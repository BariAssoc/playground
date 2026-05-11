/**
 * LSR warmup gate tests — DECISIONS.md §8.
 *
 * Boundary verification:
 *   Day 1-13:   INSUFFICIENT (no ACWR computable; chronic baseline immature)
 *   Day 14-27:  PARTIAL (ACWR computable but chronic window not yet 28d)
 *   Day 28+:    FULL (canonical Gabbett ACWR)
 *
 * AMP composite handling at each boundary verified separately.
 */

import { describe, it, expect } from 'vitest';
import { computeLSR } from '../src/scoring/activity/lsr.js';
import { computeAMP } from '../src/scoring/activity/amp-composite.js';
import type { ScoreResult } from '../../shared/src/types/index.js';
import { BeaconBand } from '../../shared/src/enums/index.js';

const NOW = '2026-05-09T02:00:00Z';

const VALID_LOAD = {
  acute_7d_load: 600,        // ratio 1.0 (sweet spot)
  chronic_28d_load: 600,
  hrv_deviation_0_1: 0.2,
  sleep_debt_0_1: 0.2,
  subjective_recovery_inv_0_1: 0.3,
  provenance_per_input: {},
  computed_at: NOW,
};

function fullScore(value: number, band: BeaconBand): ScoreResult {
  return {
    value,
    band,
    degradation: 'FULL',
    provenance: 'VALIDATED',
    breakdown: {},
    weights_used: {},
    computed_at: NOW,
  };
}

// ────────────────────────────────────────────────────────────
// LSR DIRECT
// ────────────────────────────────────────────────────────────

describe('LSR — Day 1-13 (INSUFFICIENT gate)', () => {
  it('Day 1: INSUFFICIENT regardless of inputs', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 1 });
    expect(r.degradation).toBe('INSUFFICIENT');
    expect(r.value).toBeNull();
    expect(r.provenance).toBe('PENDING_VALIDATION');
  });

  it('Day 7: still INSUFFICIENT', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 7 });
    expect(r.degradation).toBe('INSUFFICIENT');
  });

  it('Day 13: last INSUFFICIENT day', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 13 });
    expect(r.degradation).toBe('INSUFFICIENT');
  });
});

describe('LSR — Day 14-27 (PARTIAL gate)', () => {
  it('Day 14: first PARTIAL day, score computes', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 14 });
    expect(r.degradation).toBe('PARTIAL');
    expect(r.value).not.toBeNull();
    expect(r.provenance).toBe('PENDING_VALIDATION');
  });

  it('Day 20: PARTIAL, sweet-spot ACWR=1.0 → high score', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 20 });
    expect(r.degradation).toBe('PARTIAL');
    expect(r.value).not.toBeNull();
    // ACWR 1.0 → acwr_score 1.0; strain ~ 0.4·0.2 + 0.3·0.2 + 0.3·0.3 = 0.23
    // LSR = 1.0 / (1 + 0.23) = 0.813 → 81
    expect(r.value!).toBeGreaterThan(75);
    expect(r.value!).toBeLessThan(90);
  });

  it('Day 27: last PARTIAL day', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 27 });
    expect(r.degradation).toBe('PARTIAL');
  });
});

describe('LSR — Day 28+ (FULL gate)', () => {
  it('Day 28: first FULL day', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 28 });
    expect(r.degradation).toBe('FULL');
    expect(r.provenance).toBe('VALIDATED');
  });

  it('Day 60: FULL with stable VALIDATED provenance', () => {
    const r = computeLSR({ ...VALID_LOAD, days_active: 60 });
    expect(r.degradation).toBe('FULL');
  });

  it('overtraining: ACWR=1.8 lowers score sharply', () => {
    const r = computeLSR({
      ...VALID_LOAD,
      days_active: 60,
      acute_7d_load: 1080,    // 1.8x chronic
      chronic_28d_load: 600,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeLessThan(60);     // band 6 or worse
  });

  it('undertrained: ACWR=0.4 lowers score', () => {
    const r = computeLSR({
      ...VALID_LOAD,
      days_active: 60,
      acute_7d_load: 240,
      chronic_28d_load: 600,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeLessThan(80);
  });
});

// ────────────────────────────────────────────────────────────
// AMP composite × LSR warmup interaction
// ────────────────────────────────────────────────────────────

describe('AMP × LSR warmup', () => {
  it('Day 7 (LSR INSUFFICIENT): AMP redistributes EPC + MVI; PARTIAL', () => {
    const r = computeAMP({
      epc: fullScore(70, BeaconBand.LIGHT_ORANGE),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr: computeLSR({ ...VALID_LOAD, days_active: 7 }),
      days_active: 7,
      computed_at: NOW,
    });
    // 0.40+0.30 = 0.70 → 0.5714 / 0.4286
    // 70*0.5714 + 80*0.4286 = 40.0 + 34.29 = 74.29
    expect(r.value).toBeCloseTo(74.29, 1);
    expect(r.degradation).toBe('PARTIAL');
  });

  it('Day 20 (LSR PARTIAL): AMP includes LSR with full weight, still PARTIAL', () => {
    const lsr = computeLSR({ ...VALID_LOAD, days_active: 20 });
    const r = computeAMP({
      epc: fullScore(70, BeaconBand.LIGHT_ORANGE),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr,
      days_active: 20,
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.degradation).toBe('PARTIAL');
    // weights should NOT be redistributed at this point
    expect(r.weights_used.EPC).toBeCloseTo(0.40, 6);
    expect(r.weights_used.MVI).toBeCloseTo(0.30, 6);
    expect(r.weights_used.LSR).toBeCloseTo(0.30, 6);
  });

  it('Day 30 (LSR FULL): AMP at full canon, FULL', () => {
    const lsr = computeLSR({ ...VALID_LOAD, days_active: 30 });
    const r = computeAMP({
      epc: fullScore(70, BeaconBand.LIGHT_ORANGE),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr,
      days_active: 30,
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.degradation).toBe('FULL');
  });
});
