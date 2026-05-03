/**
 * BEACON §16 DYNAMIC WEIGHTING — ACCEPTANCE TESTS
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §16.3 (ISE state weight shift principles)
 *   - Beacon Canon v1.1 §16.2 (exact weights deferred to PAC-2)
 * 
 * Verifies:
 *   - Every ISE state has a weight table
 *   - Every weight table sums to 1.0 within tolerance
 *   - Directional principles match canon §16.3
 *   - Phase 1 provisional shifts are bounded by ±0.04 cap from baseline
 */

import { describe, it, expect } from '@jest/globals';
import { ISEState } from '../../src/types/ise.js';
import {
  getCompositeWeightsForISE,
  BASELINE_WEIGHT_PER_COMPOSITE,
  COMPOSITE_WEIGHTS_PROVENANCE
} from '../../src/computation/composite-weights-by-ise.js';

const SUM_TOLERANCE = 0.001;
const SHIFT_CAP_PRE_RENORM = 0.04;
const RENORM_TOLERANCE = 0.005; // post-renormalization values can drift slightly past raw cap

describe('Beacon §16 — Dynamic Composite Weighting', () => {
  describe('Mechanism — every ISE state returns a valid weight table', () => {
    for (const state of Object.values(ISEState)) {
      it(`${state} returns a weight table summing to 1.0`, () => {
        const weights = getCompositeWeightsForISE(state);
        const sum = Object.values(weights).reduce((a, b) => a + b, 0);
        expect(Math.abs(sum - 1.0)).toBeLessThan(SUM_TOLERANCE);
      });

      it(`${state} returns weights for all 8 composites`, () => {
        const weights = getCompositeWeightsForISE(state);
        const composites = Object.keys(weights).sort();
        expect(composites).toEqual(['AMP', 'BCI', 'BHR', 'CRC', 'MBC', 'MEI', 'SBL', 'SRC']);
      });

      it(`${state} weights are all in (0, 1) — no zero or negative weights`, () => {
        const weights = getCompositeWeightsForISE(state);
        for (const w of Object.values(weights)) {
          expect(w).toBeGreaterThan(0);
          expect(w).toBeLessThan(1);
        }
      });
    }
  });

  describe('Canon §16.3 — directional principles honored', () => {
    it('ISE-1 baseline uses equal 1/8 weighting (canon §16.3 default)', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_1_ALIGNED_AVAILABLE);
      for (const w of Object.values(weights)) {
        expect(w).toBeCloseTo(BASELINE_WEIGHT_PER_COMPOSITE, 6);
      }
    });

    it('ISE-4 (Phase 2 deferred) uses equal weighting', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_4_BUILDING_MOMENTUM);
      for (const w of Object.values(weights)) {
        expect(w).toBeCloseTo(BASELINE_WEIGHT_PER_COMPOSITE, 6);
      }
    });

    it('ISE-6 (Phase 2 deferred) uses equal weighting', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL);
      for (const w of Object.values(weights)) {
        expect(w).toBeCloseTo(BASELINE_WEIGHT_PER_COMPOSITE, 6);
      }
    });

    it('ISE-0 weights behavioral composites higher than physiological (canon §16.3)', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_0_NEUTRAL_BASELINE);
      // Behavioral: BHR, SBL, CRC should be above baseline
      expect(weights.BHR).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.SBL).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.CRC).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      // Physiological: SRC, MBC, MEI, AMP should be below baseline
      expect(weights.SRC).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.MBC).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.MEI).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.AMP).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
    });

    it('ISE-2 weights recovery composites higher; performance composites lower (canon §16.3)', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD);
      // Recovery: SRC, BHR, SBL, CRC above baseline
      expect(weights.SRC).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.BHR).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.SBL).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.CRC).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      // Performance: MEI, AMP below baseline
      expect(weights.MEI).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.AMP).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
    });

    it('ISE-3 weights subjective composites higher; performance composites lower (canon §16.3)', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_3_CONTAINED_LOAD_LIMITED);
      // Subjective: BCI (cognitive load), SBL (subjective stress), BHR (self-report) above baseline
      expect(weights.BCI).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.SBL).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.BHR).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      // Performance: MEI, AMP below baseline
      expect(weights.MEI).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.AMP).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
    });

    it('ISE-5 weights objective physiological higher; subjective lower (canon §16.3)', () => {
      const weights = getCompositeWeightsForISE(ISEState.ISE_5_RESTRICTED_GUARDED);
      // Objective physiological: MBC, SRC, MEI, AMP above baseline
      expect(weights.MBC).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.SRC).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.MEI).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.AMP).toBeGreaterThan(BASELINE_WEIGHT_PER_COMPOSITE);
      // Subjective: SBL, BHR, CRC below baseline
      expect(weights.SBL).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.BHR).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
      expect(weights.CRC).toBeLessThan(BASELINE_WEIGHT_PER_COMPOSITE);
    });
  });

  describe('Conservative shift bounds — Phase 1 provisional cap', () => {
    const states_with_shifts: ISEState[] = [
      ISEState.ISE_0_NEUTRAL_BASELINE,
      ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD,
      ISEState.ISE_3_CONTAINED_LOAD_LIMITED,
      ISEState.ISE_5_RESTRICTED_GUARDED
    ];

    for (const state of states_with_shifts) {
      it(`${state} — every weight is within ±${SHIFT_CAP_PRE_RENORM + RENORM_TOLERANCE} of baseline`, () => {
        const weights = getCompositeWeightsForISE(state);
        for (const [composite, w] of Object.entries(weights)) {
          const shift = Math.abs(w - BASELINE_WEIGHT_PER_COMPOSITE);
          expect(shift).toBeLessThanOrEqual(SHIFT_CAP_PRE_RENORM + RENORM_TOLERANCE);
          // Document failures clearly
          if (shift > SHIFT_CAP_PRE_RENORM + RENORM_TOLERANCE) {
            throw new Error(
              `${state}.${composite} = ${w} drifts ${shift.toFixed(4)} from baseline; cap ${SHIFT_CAP_PRE_RENORM}`
            );
          }
        }
      });
    }
  });

  describe('Provenance — biostatistics handoff metadata', () => {
    it('Weights are tagged PHASE_1_PROVISIONAL', () => {
      expect(COMPOSITE_WEIGHTS_PROVENANCE.status).toBe('PHASE_1_PROVISIONAL');
    });

    it('Provenance cites Beacon §16.3 directional principles', () => {
      expect(COMPOSITE_WEIGHTS_PROVENANCE.source_canon).toContain('§16.3');
    });

    it('Validation pending flag references PAC-2 biostatistics', () => {
      expect(COMPOSITE_WEIGHTS_PROVENANCE.validation_pending).toContain('PAC-2');
      expect(COMPOSITE_WEIGHTS_PROVENANCE.validation_pending).toContain('biostatistics');
    });

    it('Approval recorded with date and approver', () => {
      expect(COMPOSITE_WEIGHTS_PROVENANCE.approved_by).toBeTruthy();
      expect(COMPOSITE_WEIGHTS_PROVENANCE.approved_on).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
