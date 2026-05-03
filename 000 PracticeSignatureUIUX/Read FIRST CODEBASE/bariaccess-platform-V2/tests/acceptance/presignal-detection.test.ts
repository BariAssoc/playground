/**
 * BEACON §10.2 PRE-SIGNAL DETECTION — ACCEPTANCE TESTS
 * 
 * Source canon: Beacon Canon v1.1 §10.2 (Detection Rule)
 * 
 * Verifies the literal canon rule:
 *   PRE-SIGNAL = TRUE when EITHER:
 *     (a) POSITION: Score is currently in Band 3 (Faint Green, 80-84)
 *     (b) VELOCITY: Score has dropped > 10 points in 14 days, regardless of band
 */

import { describe, it, expect } from '@jest/globals';
import {
  detectCompositePreSignal,
  detectAnyPreSignalActive,
  reportPreSignalsAcrossComposites,
  isPreSignalExpired,
  PRESIGNAL_VELOCITY_DROP_THRESHOLD,
  PRESIGNAL_VELOCITY_WINDOW_DAYS,
  PRESIGNAL_POSITION_BAND,
  type CompositePreSignalContext
} from '../../src/computation/presignal-detection.js';
import type { CompositeStateRecord } from '../../src/types/composite.js';
import type { BeaconBand } from '../../src/types/ise.js';

function buildLiveComposite(
  overrides: Partial<CompositeStateRecord> = {}
): CompositeStateRecord {
  return {
    id: 'mark-spg-001_SBL',
    userId: 'mark-spg-001',
    compositeName: 'SBL',
    state: 'live',
    score_0_100: 75,
    beacon_band: 4,
    confidence: 'high',
    unlock_trigger: '7 days of stress signals captured',
    unlock_progress: 1.0,
    unlocked_at: '2026-04-25T03:00:00Z',
    last_cascade_fired_at: null,
    last_recompute_at: '2026-05-03T03:00:00Z',
    ...overrides
  };
}

describe('Beacon §10.2 — Pre-Signal Detection', () => {
  describe('Locked constants', () => {
    it('Velocity drop threshold = 10 points', () => {
      expect(PRESIGNAL_VELOCITY_DROP_THRESHOLD).toBe(10);
    });
    it('Velocity window = 14 days', () => {
      expect(PRESIGNAL_VELOCITY_WINDOW_DAYS).toBe(14);
    });
    it('Position trigger band = 3 (Faint Green)', () => {
      expect(PRESIGNAL_POSITION_BAND).toBe(3);
    });
  });

  describe('Position trigger (canon §10.2 line a)', () => {
    it('Score in Band 3 (Faint Green, 80-84) → presignal active', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 82,
        current_band: 3 as BeaconBand,
        score_14_days_ago: 85 // not a velocity drop
      });
      expect(result.presignal_active).toBe(true);
      expect(result.position_trigger).toBe(true);
      expect(result.velocity_trigger).toBe(false);
    });

    it('Score in Band 2 (Med Green) → no presignal from position', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 87,
        current_band: 2 as BeaconBand,
        score_14_days_ago: 85
      });
      expect(result.position_trigger).toBe(false);
      expect(result.presignal_active).toBe(false);
    });

    it('Score in Band 4 (Light Orange) — position alone does not trigger', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 73,
        current_band: 4 as BeaconBand,
        score_14_days_ago: 75 // 2pt drop, not >10
      });
      expect(result.position_trigger).toBe(false);
      expect(result.velocity_trigger).toBe(false);
      expect(result.presignal_active).toBe(false);
    });
  });

  describe('Velocity trigger (canon §10.2 line b)', () => {
    it('Drop > 10 points in 14 days → velocity trigger fires (clean threshold case)', () => {
      // Canon §30 James data: 9.4-point drop is described as "approaching velocity
      // threshold" — it does NOT trigger the canonical >10 rule. The §10.3 narrative
      // mentioning "the velocity did" trigger for James is an approximation; the
      // locked rule is strict. Use a 12-pt drop here for an unambiguous trigger.
      const result = detectCompositePreSignal({
        current_score_0_100: 73,
        current_band: 4 as BeaconBand,
        score_14_days_ago: 85
      });
      expect(result.velocity_trigger).toBe(true);
      expect(result.position_trigger).toBe(false); // band 4, not 3
      expect(result.presignal_active).toBe(true);
      expect(result.velocity_drop).toBe(12);
    });

    it('James canon scenario (9.4-pt drop) does NOT trigger velocity (canon §10.2 strict >10)', () => {
      // Canon §10.3 narrative says velocity triggered for James; canon §30 data
      // (drop = 9.4) and canon §10.2 rule (>10) say it does not. We honor the
      // locked rule. Document the tension here so the next reader understands.
      const result = detectCompositePreSignal({
        current_score_0_100: 72.6,
        current_band: 4 as BeaconBand,
        score_14_days_ago: 82
      });
      expect(result.velocity_trigger).toBe(false);
      expect(result.velocity_drop).toBeCloseTo(9.4, 1);
    });

    it('Drop = exactly 10 points (boundary) does NOT trigger (rule is > 10, not >=)', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 75,
        current_band: 4 as BeaconBand,
        score_14_days_ago: 85 // exactly 10 pt drop
      });
      expect(result.velocity_trigger).toBe(false);
    });

    it('Drop = 11 points → triggers (just over threshold)', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 74,
        current_band: 4 as BeaconBand,
        score_14_days_ago: 85
      });
      expect(result.velocity_trigger).toBe(true);
      expect(result.presignal_active).toBe(true);
    });

    it('Score IMPROVED (not dropped) → no velocity trigger', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 88,
        current_band: 2 as BeaconBand,
        score_14_days_ago: 75 // improved by 13
      });
      expect(result.velocity_trigger).toBe(false);
      expect(result.velocity_drop).toBe(-13); // negative = improvement
    });

    it('Velocity check skipped when 14-day-ago score unavailable', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 75,
        current_band: 4 as BeaconBand,
        score_14_days_ago: null
      });
      expect(result.velocity_trigger).toBe(false);
      expect(result.velocity_drop).toBeNull();
    });
  });

  describe('Either trigger fires the canon §10.2 rule', () => {
    it('Position OR Velocity (canon EITHER clause) — both fire when both true', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 81, // Band 3
        current_band: 3 as BeaconBand,
        score_14_days_ago: 95 // 14-pt drop
      });
      expect(result.position_trigger).toBe(true);
      expect(result.velocity_trigger).toBe(true);
      expect(result.presignal_active).toBe(true);
    });

    it('Neither trigger fires → no presignal', () => {
      const result = detectCompositePreSignal({
        current_score_0_100: 92, // Band 2, no drop
        current_band: 2 as BeaconBand,
        score_14_days_ago: 90
      });
      expect(result.presignal_active).toBe(false);
    });
  });

  describe('Multi-composite aggregation for Resolver', () => {
    it('any_presignal_active = true when ANY live composite has presignal', () => {
      const contexts: CompositePreSignalContext[] = [
        {
          composite: buildLiveComposite({ score_0_100: 75, beacon_band: 4 }),
          score_14_days_ago: 80
        },
        {
          composite: buildLiveComposite({
            compositeName: 'BHR',
            score_0_100: 82,
            beacon_band: 3 // Band 3 → triggers
          }),
          score_14_days_ago: 85
        }
      ];
      expect(detectAnyPreSignalActive(contexts)).toBe(true);
    });

    it('any_presignal_active = false when no composites trigger', () => {
      const contexts: CompositePreSignalContext[] = [
        {
          composite: buildLiveComposite({ score_0_100: 88, beacon_band: 2 }),
          score_14_days_ago: 87
        },
        {
          composite: buildLiveComposite({
            compositeName: 'BHR',
            score_0_100: 92,
            beacon_band: 2
          }),
          score_14_days_ago: 90
        }
      ];
      expect(detectAnyPreSignalActive(contexts)).toBe(false);
    });

    it('Accruing composites excluded from presignal aggregation', () => {
      const contexts: CompositePreSignalContext[] = [
        {
          // Accruing composite — score should be excluded even if it would trigger
          composite: buildLiveComposite({
            state: 'accruing',
            score_0_100: null,
            beacon_band: null
          }),
          score_14_days_ago: 95
        }
      ];
      expect(detectAnyPreSignalActive(contexts)).toBe(false);
    });
  });

  describe('Detailed report — per composite', () => {
    it('Returns per-composite breakdown with both triggers', () => {
      const contexts: CompositePreSignalContext[] = [
        {
          composite: buildLiveComposite({
            compositeName: 'SBL',
            score_0_100: 81,
            beacon_band: 3
          }),
          score_14_days_ago: 95
        }
      ];
      const report = reportPreSignalsAcrossComposites(contexts);
      expect(report.any_presignal_active).toBe(true);
      expect(report.per_composite[0]?.position_trigger).toBe(true);
      expect(report.per_composite[0]?.velocity_trigger).toBe(true);
      expect(report.per_composite[0]?.velocity_drop).toBe(14);
    });
  });

  describe('Pre-signal expiration (canon §10.6)', () => {
    it('Expires when stable 72h+ AND not in Band 3', () => {
      expect(
        isPreSignalExpired({
          current_score_0_100: 88,
          current_band: 2,
          hours_since_last_decline: 96,
          score_72_hours_ago: 87
        })
      ).toBe(true);
    });

    it('Does NOT expire if still in Band 3', () => {
      expect(
        isPreSignalExpired({
          current_score_0_100: 82,
          current_band: 3,
          hours_since_last_decline: 96,
          score_72_hours_ago: 81
        })
      ).toBe(false);
    });

    it('Does NOT expire if not yet stable for 72h', () => {
      expect(
        isPreSignalExpired({
          current_score_0_100: 88,
          current_band: 2,
          hours_since_last_decline: 24,
          score_72_hours_ago: 87
        })
      ).toBe(false);
    });

    it('Does NOT expire if score has declined within window', () => {
      expect(
        isPreSignalExpired({
          current_score_0_100: 85,
          current_band: 2,
          hours_since_last_decline: 96,
          score_72_hours_ago: 88 // declined since 72h ago
        })
      ).toBe(false);
    });
  });
});
