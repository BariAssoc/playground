/**
 * R&R_Lite headline tests — DECISIONS.md §2 verification.
 *
 * The headline = 0.35·SRC + 0.35·SBL + 0.30·AMP, computed via
 * redistributeWeights from the master 8-key RR_WEIGHTS table.
 */

import { describe, it, expect } from 'vitest';
import { computeRRLite } from '../src/scoring/rr-lite.js';
import type { CompositeResult, ScoreResult } from '../../shared/src/types/index.js';
import { BeaconBand } from '../../shared/src/enums/index.js';

const NOW = '2026-05-09T02:00:00Z';

function compositeMock(
  composite_id: 'SRC' | 'SBL' | 'AMP',
  value: number | null,
  band: BeaconBand | null,
  cascade_rim_active = false,
  degradation: ScoreResult['degradation'] = 'FULL'
): CompositeResult {
  const sub_score_ids =
    composite_id === 'SRC'
      ? (['SQI', 'SRI', 'SNS'] as const)
      : composite_id === 'SBL'
        ? (['CIR', 'SMA', 'RSI'] as const)
        : (['EPC', 'MVI', 'LSR'] as const);
  return {
    composite_id,
    value,
    band,
    degradation,
    provenance: 'VALIDATED',
    breakdown: {},
    weights_used: {},
    sub_score_ids: [...sub_score_ids],
    cascade_rim_active,
    sub_scores: {} as Record<string, ScoreResult>,
    computed_at: NOW,
  };
}

describe('R&R_Lite headline — DECISIONS.md §2', () => {
  it('full canon: 0.35·80 + 0.35·75 + 0.30·70 = 75.25', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', 80, BeaconBand.FAINT_GREEN),
        SBL: compositeMock('SBL', 75, BeaconBand.LIGHT_ORANGE),
        AMP: compositeMock('AMP', 70, BeaconBand.LIGHT_ORANGE),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    expect(r.value).toBeCloseTo(75.25, 2);
    expect(r.field_name).toBe('rr_lite');
    expect(r.composite_subset).toEqual(['SRC', 'SBL', 'AMP']);
    expect(r.degradation).toBe('PARTIAL'); // because subset is being redistributed (3-of-8)
  });

  it('weights sum to 1.0 after redistribution', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', 80, BeaconBand.FAINT_GREEN),
        SBL: compositeMock('SBL', 80, BeaconBand.FAINT_GREEN),
        AMP: compositeMock('AMP', 80, BeaconBand.FAINT_GREEN),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    const sum = Object.values(r.weights_used).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 9);
  });

  it('redistributed weights match expected: 0.35/0.35/0.30', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', 80, BeaconBand.FAINT_GREEN),
        SBL: compositeMock('SBL', 80, BeaconBand.FAINT_GREEN),
        AMP: compositeMock('AMP', 80, BeaconBand.FAINT_GREEN),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    expect(r.weights_used.SRC).toBeCloseTo(0.35, 6);
    expect(r.weights_used.SBL).toBeCloseTo(0.35, 6);
    expect(r.weights_used.AMP).toBeCloseTo(0.30, 6);
  });

  it('any_cascade_rim true if any composite has cascade_rim_active', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', 80, BeaconBand.FAINT_GREEN, false),
        SBL: compositeMock('SBL', 75, BeaconBand.LIGHT_ORANGE, true),
        AMP: compositeMock('AMP', 70, BeaconBand.LIGHT_ORANGE, false),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    expect(r.any_cascade_rim).toBe(true);
  });

  it('SRC missing: redistributes 0.35+0.30=0.65 → SBL 0.5385, AMP 0.4615', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', null, null, false, 'INSUFFICIENT'),
        SBL: compositeMock('SBL', 80, BeaconBand.FAINT_GREEN),
        AMP: compositeMock('AMP', 70, BeaconBand.LIGHT_ORANGE),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    // 80 * 0.5385 + 70 * 0.4615 = 43.08 + 32.31 = 75.38
    expect(r.value).toBeCloseTo(75.38, 1);
  });

  it('all composites null → headline INSUFFICIENT', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', null, null, false, 'INSUFFICIENT'),
        SBL: compositeMock('SBL', null, null, false, 'INSUFFICIENT'),
        AMP: compositeMock('AMP', null, null, false, 'INSUFFICIENT'),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    expect(r.value).toBeNull();
    expect(r.degradation).toBe('INSUFFICIENT');
  });

  it('field_name stays "rr_lite" until composite_subset.length === 8', () => {
    const r = computeRRLite({
      composites: {
        SRC: compositeMock('SRC', 80, BeaconBand.FAINT_GREEN),
        SBL: compositeMock('SBL', 75, BeaconBand.LIGHT_ORANGE),
        AMP: compositeMock('AMP', 70, BeaconBand.LIGHT_ORANGE),
      } as Record<string, CompositeResult>,
      ise_state: 'ISE_1_ALIGNED_AVAILABLE',
      computed_at: NOW,
    });
    expect(r.field_name).toBe('rr_lite');
  });
});
