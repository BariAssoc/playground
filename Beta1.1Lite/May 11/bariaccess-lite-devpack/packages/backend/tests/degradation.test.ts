/**
 * Degradation tests:
 *   - redistributeWeights (the most-used helper in the entire engine)
 *   - applyCarryForward (Pass 0 Spec 4)
 *   - computeBridge (Pass 0 Spec 5)
 */

import { describe, it, expect } from 'vitest';
import {
  redistributeWeights,
  weightedSum,
} from '../src/degradation/weight-redistribution.js';
import {
  applyCarryForward,
  daysSinceLastReading,
} from '../src/degradation/carry-forward.js';
import {
  computeBridge,
  fabTrendToDirection,
  reconcileBridge,
} from '../src/degradation/behavioral-bridge.js';
import { RR_WEIGHTS, SRC_WEIGHTS } from '../../shared/src/constants/rr-weights.js';

describe('redistributeWeights — DECISIONS.md §2 canon-preserving', () => {
  it('R&R_Lite: 3-of-8 subset normalizes 0.14/0.14/0.12 over 0.40 → 0.35/0.35/0.30', () => {
    const r = redistributeWeights(['SRC', 'SBL', 'AMP'], RR_WEIGHTS);
    expect(r.weights.SRC).toBeCloseTo(0.35, 6);
    expect(r.weights.SBL).toBeCloseTo(0.35, 6);
    expect(r.weights.AMP).toBeCloseTo(0.30, 6);
    expect(r.weights.SRC! + r.weights.SBL! + r.weights.AMP!).toBeCloseTo(1.0, 6);
    expect(r.redistributed).toBe(true);
    expect(r.dropped_keys).toEqual(expect.arrayContaining(['MBC', 'MEI', 'BCI', 'CRC', 'BHR']));
  });

  it('Full R&R: 8-of-8 returns canon weights as-is', () => {
    const r = redistributeWeights(
      ['SRC', 'SBL', 'MBC', 'MEI', 'AMP', 'BCI', 'CRC', 'BHR'],
      RR_WEIGHTS
    );
    expect(r.weights.SRC).toBeCloseTo(0.14, 6);
    expect(r.weights.AMP).toBeCloseTo(0.12, 6);
    const total = Object.values(r.weights).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1.0, 6);
    expect(r.dropped_keys).toEqual([]);
  });

  it('SRC sub-scores: 3-of-3 returns canon weights as-is', () => {
    const r = redistributeWeights(['SQI', 'SRI', 'SNS'], SRC_WEIGHTS);
    expect(r.weights.SQI).toBeCloseTo(0.40, 6);
    expect(r.weights.SRI).toBeCloseTo(0.35, 6);
    expect(r.weights.SNS).toBeCloseTo(0.25, 6);
    expect(r.redistributed).toBe(false);
  });

  it('SQI + SRI only (SNS missing): 0.40 + 0.35 = 0.75 → 0.5333 / 0.4667', () => {
    const r = redistributeWeights(['SQI', 'SRI'], SRC_WEIGHTS);
    expect(r.weights.SQI).toBeCloseTo(0.40 / 0.75, 6);
    expect(r.weights.SRI).toBeCloseTo(0.35 / 0.75, 6);
    expect(r.dropped_keys).toEqual(['SNS']);
  });

  it('throws on missing key in master', () => {
    expect(() => redistributeWeights(['SRC', 'BOGUS'], RR_WEIGHTS)).toThrow(/missing/);
  });

  it('throws on empty subset', () => {
    expect(() => redistributeWeights([], RR_WEIGHTS)).toThrow(/empty/);
  });
});

describe('weightedSum', () => {
  it('computes correct weighted score', () => {
    const s = weightedSum(
      { SRC: 80, SBL: 70, AMP: 65 },
      { SRC: 0.35, SBL: 0.35, AMP: 0.30 }
    );
    expect(s).toBeCloseTo(80 * 0.35 + 70 * 0.35 + 65 * 0.30, 6);
  });
});

describe('applyCarryForward — Pass 0 Spec 4', () => {
  it('day 0: weight 1.00, fresh=true', () => {
    const r = applyCarryForward({ value: 50, days_since: 0 });
    expect(r.weight_applied).toBe(1.00);
    expect(r.fresh).toBe(true);
    expect(r.expired).toBe(false);
  });
  it('day 1: weight 0.85', () => {
    expect(applyCarryForward({ value: 50, days_since: 1 }).weight_applied).toBe(0.85);
  });
  it('day 2: weight 0.65', () => {
    expect(applyCarryForward({ value: 50, days_since: 2 }).weight_applied).toBe(0.65);
  });
  it('day 3: weight 0.40', () => {
    expect(applyCarryForward({ value: 50, days_since: 3 }).weight_applied).toBe(0.40);
  });
  it('day 4+: EXPIRED', () => {
    const r = applyCarryForward({ value: 50, days_since: 4 });
    expect(r.expired).toBe(true);
    expect(r.value).toBeNull();
    expect(r.weight_applied).toBeNull();
  });
});

describe('daysSinceLastReading', () => {
  it('same day → 0', () => {
    expect(daysSinceLastReading('2026-05-09', '2026-05-09')).toBe(0);
  });
  it('one day later → 1', () => {
    expect(daysSinceLastReading('2026-05-10', '2026-05-09')).toBe(1);
  });
  it('null last reading → Infinity', () => {
    expect(daysSinceLastReading('2026-05-09', null)).toBe(Infinity);
  });
});

describe('computeBridge — Pass 0 Spec 5', () => {
  it('inactive while V1 fresh (days_since ≤ 3)', () => {
    const r = computeBridge({
      last_known_v1_score: 75,
      days_since: 2,
      v2_direction: 1,
      fab_sources: ['FAB-SLEEP'],
    });
    expect(r.active).toBe(false);
    expect(r.score).toBeNull();
  });

  it('day 4 (1st bridge day), improving V2: score = 75 + 1 × 3 × 1 = 78', () => {
    const r = computeBridge({
      last_known_v1_score: 75,
      days_since: 4,
      v2_direction: 1,
      fab_sources: ['FAB-SLEEP'],
    });
    expect(r.active).toBe(true);
    expect(r.days_in_bridge).toBe(1);
    expect(r.score).toBeCloseTo(78, 6);
  });

  it('day 7 (4th bridge day), declining V2: score = 75 + (-1) × 3 × 4 = 63', () => {
    const r = computeBridge({
      last_known_v1_score: 75,
      days_since: 7,
      v2_direction: -1,
      fab_sources: ['FAB-SLEEP'],
    });
    expect(r.active).toBe(true);
    expect(r.score).toBeCloseTo(63, 6);
  });

  it('day 11 (8th day past V1) → EXPIRED', () => {
    const r = computeBridge({
      last_known_v1_score: 75,
      days_since: 11,
      v2_direction: 1,
      fab_sources: ['FAB-SLEEP'],
    });
    expect(r.expired).toBe(true);
    expect(r.score).toBeNull();
  });

  it('no V1 anchor → bridge cannot start', () => {
    const r = computeBridge({
      last_known_v1_score: null,
      days_since: 5,
      v2_direction: 1,
      fab_sources: [],
    });
    expect(r.active).toBe(false);
    expect(r.score).toBeNull();
  });
});

describe('fabTrendToDirection', () => {
  it('improving > threshold → +1', () => {
    expect(fabTrendToDirection(0.8, 0.6)).toBe(1);
  });
  it('declining < -threshold → -1', () => {
    expect(fabTrendToDirection(0.4, 0.7)).toBe(-1);
  });
  it('within threshold → 0', () => {
    expect(fabTrendToDirection(0.7, 0.65)).toBe(0);
  });
});

describe('reconcileBridge — DEFERRED in Lite v1 (DECISIONS.md §11)', () => {
  it('captures prediction_error for audit (over-prediction)', () => {
    const r = reconcileBridge({
      predicted_score: 80,
      actual_v1_score: 70,
      current_adjustment_per_day: 3.0,
    });
    expect(r.prediction_error).toBe(10);
    expect(r.deferred).toBe(true);
  });

  it('captures prediction_error for audit (under-prediction)', () => {
    const r = reconcileBridge({
      predicted_score: 60,
      actual_v1_score: 75,
      current_adjustment_per_day: 3.0,
    });
    expect(r.prediction_error).toBe(-15);
    expect(r.deferred).toBe(true);
  });

  it('NEVER updates adjustment in Lite v1 — always returns input unchanged', () => {
    const r1 = reconcileBridge({
      predicted_score: 80,
      actual_v1_score: 70,
      current_adjustment_per_day: 3.0,
    });
    expect(r1.new_adjustment_per_day).toBe(3.0);

    const r2 = reconcileBridge({
      predicted_score: 100,
      actual_v1_score: 0,
      current_adjustment_per_day: 0.6,
    });
    expect(r2.new_adjustment_per_day).toBe(0.6);

    const r3 = reconcileBridge({
      predicted_score: 50,
      actual_v1_score: 50,
      current_adjustment_per_day: 4.5,
    });
    expect(r3.new_adjustment_per_day).toBe(4.5);
    expect(r3.prediction_error).toBe(0);
  });
});
