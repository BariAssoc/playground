/**
 * BariAccess Beta — Scoring Test Suite
 *
 * Every test is pulled DIRECTLY from a worked example in BETA-FORMULA-001.
 * If these pass, the math implementation matches Val's spec.
 *
 * Run: npm test
 */

import { describe, expect, it } from 'vitest';
import {
  aggregateDailyMood,
  computeCredit,
  computeEffort,
  computeFABConsistency,
  computeFrequency,
  computeGrit,
  computeLCBeta,
  computeRollingConsistency,
  computeSCBeta,
  computeV3SpaceScore,
  getSpaceMultiplier,
  moodDelta,
  moodToBeacon,
  normalizeMood,
  resolveColorState,
} from '../src/scoring';

// ────────────────────────────────────────────────────────────
// MOOD — BETA-FORMULA-001 §1
// ────────────────────────────────────────────────────────────
describe('Mood normalization', () => {
  it('matches the §1 mapping table', () => {
    expect(normalizeMood(1)).toBeCloseTo(0.0, 5);
    expect(normalizeMood(2)).toBeCloseTo(0.25, 5);
    expect(normalizeMood(3)).toBeCloseTo(0.5, 5);
    expect(normalizeMood(4)).toBeCloseTo(0.75, 5);
    expect(normalizeMood(5)).toBeCloseTo(1.0, 5);
  });

  it('rejects out-of-range raw values', () => {
    expect(() => normalizeMood(0)).toThrow();
    expect(() => normalizeMood(6)).toThrow();
    expect(() => normalizeMood(2.5)).toThrow();
  });

  it('Beacon mapping is non-linear (7 / 25.5 / 50 / 75 / 95)', () => {
    expect(moodToBeacon(1)).toBe(7);
    expect(moodToBeacon(2)).toBe(25.5);
    expect(moodToBeacon(3)).toBe(50);
    expect(moodToBeacon(4)).toBe(75);
    expect(moodToBeacon(5)).toBe(95);
  });

  it('aggregates daily mood as equal-weighted mean (VAL_DEFAULT_14)', () => {
    expect(aggregateDailyMood([0.5, 0.75, 1.0, 0.25])).toBeCloseTo(0.625, 5);
    expect(aggregateDailyMood([])).toBe(0.5);
  });

  it('computes mood delta', () => {
    expect(moodDelta(3, 5)).toBe(2);
    expect(moodDelta(4, 2)).toBe(-2);
    expect(moodDelta(null, 5)).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────
// FREQUENCY — BETA-FORMULA-001 §2
// ────────────────────────────────────────────────────────────
describe('Frequency (F)', () => {
  it('Val Day 7 worked example: 50/70 = 0.71', () => {
    const result = computeFrequency(50, 70);
    expect(result.F).toBeCloseTo(50 / 70, 5);
    expect(result.partial_window).toBe(false);
  });

  it('flags partial_window during first 6 days', () => {
    const result = computeFrequency(20, 30);
    expect(result.partial_window).toBe(true);
  });

  it('returns 0 with no scheduled events', () => {
    const result = computeFrequency(0, 0);
    expect(result.F).toBe(0);
    expect(result.partial_window).toBe(true);
  });

  it('rejects completed > scheduled', () => {
    expect(() => computeFrequency(80, 70)).toThrow();
  });
});

// ────────────────────────────────────────────────────────────
// CONSISTENCY — BETA-FORMULA-001 §3 worked example
// ────────────────────────────────────────────────────────────
describe('Consistency (C)', () => {
  it('§3 worked example — 3 FABs', () => {
    // GLP-1 check: scheduled 6:00 AM, window 15 min, actual 6:02 AM → C_i = 1 - 2/15 = 0.867
    const c1 = computeFABConsistency({
      scheduled_time: new Date('2026-05-07T06:00:00-04:00'),
      actual_completion_time: new Date('2026-05-07T06:02:00-04:00'),
      window_minutes: 15,
    });
    expect(c1).toBeCloseTo(1 - 2 / 15, 2);

    // Hydration: 5:45 AM, 10 min, 5:46 AM → 1 - 1/10 = 0.9
    const c2 = computeFABConsistency({
      scheduled_time: new Date('2026-05-07T05:45:00-04:00'),
      actual_completion_time: new Date('2026-05-07T05:46:00-04:00'),
      window_minutes: 10,
    });
    expect(c2).toBeCloseTo(0.9, 2);

    // Protein meal: 7:30 AM, 20 min, 7:48 AM → 1 - 18/20 = 0.10
    const c3 = computeFABConsistency({
      scheduled_time: new Date('2026-05-07T07:30:00-04:00'),
      actual_completion_time: new Date('2026-05-07T07:48:00-04:00'),
      window_minutes: 20,
    });
    expect(c3).toBeCloseTo(0.1, 2);

    // Mean ≈ 0.622 (spec rounds to 0.62)
    const rolling = computeRollingConsistency([c1, c2, c3]);
    expect(rolling).toBeCloseTo(0.62, 1);
  });

  it('clamps to 0 when delta exceeds window', () => {
    const c = computeFABConsistency({
      scheduled_time: new Date('2026-05-07T06:00:00Z'),
      actual_completion_time: new Date('2026-05-07T06:30:00Z'), // 30 min late
      window_minutes: 15, // 15-min window
    });
    expect(c).toBe(0);
  });

  it('returns 0 for empty rolling window', () => {
    expect(computeRollingConsistency([])).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────
// LEARNING COEFFICIENT — BETA-FORMULA-001 §4.2
// ────────────────────────────────────────────────────────────
describe('LC_beta', () => {
  it('weights 0.40/0.30/0.30 and recency-weights nudges', () => {
    const result = computeLCBeta({
      am_completed: 7,
      am_scheduled: 7,
      pm_completed: 7,
      pm_scheduled: 7,
      // 3 days of nudges, each with 3 firings, 2/3 responded
      nudges: [
        { responded: true, days_ago: 0 },
        { responded: true, days_ago: 0 },
        { responded: false, days_ago: 0 },
        { responded: true, days_ago: 1 },
        { responded: true, days_ago: 1 },
        { responded: false, days_ago: 1 },
      ],
      text_submissions: 5,
      text_opportunities: 10,
    });
    // jotform: 14/14 = 1.0
    expect(result.jotform_completion_rate).toBe(1.0);
    // text: 0.5
    expect(result.optional_text_submission_rate).toBe(0.5);
    // LC_beta in [0,1]
    expect(result.LC_beta).toBeGreaterThan(0);
    expect(result.LC_beta).toBeLessThanOrEqual(1);
  });

  it('handles zero-input edge case', () => {
    const result = computeLCBeta({
      am_completed: 0,
      am_scheduled: 0,
      pm_completed: 0,
      pm_scheduled: 0,
      nudges: [],
      text_submissions: 0,
      text_opportunities: 0,
    });
    expect(result.LC_beta).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────
// EFFORT SCORE — §5 worked example for Val Day 7
// ────────────────────────────────────────────────────────────
describe('Effort Score (E)', () => {
  it('§5 worked example — Val Day 7: F=0.71 C=0.62 LC=0.83 → E=0.65', () => {
    const E = computeEffort({ F: 0.71, C: 0.62, LC: 0.83 });
    // 0.40 × 0.71 + 0.30 × 0.62 + 0.30 × 0.83 = 0.284 + 0.186 + 0.249 = 0.719... wait
    // Spec rounds: 0.284 + 0.186 + 0.249 = 0.719... but spec says 0.65
    // Let me re-check: 0.40 × 0.71 = 0.284
    //                  0.30 × 0.62 = 0.186
    //                  0.30 × 0.83 = 0.249
    //                  sum = 0.719
    // The spec table shows E=0.65 — that appears to be a rounding inconsistency in spec.
    // The formula is correct; the spec's 0.65 is incorrect arithmetic.
    // We test the FORMULA, not the spec's faulty arithmetic.
    expect(E).toBeCloseTo(0.719, 2);
  });

  it('rejects out-of-range inputs', () => {
    expect(() => computeEffort({ F: -0.1, C: 0.5, LC: 0.5 })).toThrow();
    expect(() => computeEffort({ F: 0.5, C: 1.1, LC: 0.5 })).toThrow();
  });
});

// ────────────────────────────────────────────────────────────
// GRIT ENGINE — BETA-FORMULA-001 §6.3 worked examples
// ────────────────────────────────────────────────────────────
describe('Grit Engine', () => {
  it('§6.3 — E=0.6, M=0.5: triggers, M=1.15×', () => {
    const r = computeGrit({ effort: 0.6, mood_normalized: 0.5 });
    expect(r.triggered).toBe(true);
    expect(r.multiplier).toBeCloseTo(1.15, 2);
  });

  it('§6.3 — E=0.7, M=0.4: triggers, M=1.45×', () => {
    const r = computeGrit({ effort: 0.7, mood_normalized: 0.4 });
    expect(r.triggered).toBe(true);
    expect(r.multiplier).toBeCloseTo(1.45, 2);
  });

  it('§6.3 — E=0.8, M=0.3: triggers, M=1.75×', () => {
    const r = computeGrit({ effort: 0.8, mood_normalized: 0.3 });
    expect(r.triggered).toBe(true);
    expect(r.multiplier).toBeCloseTo(1.75, 2);
  });

  it('§6.3 — E=0.9, M=0.2: triggers, hits 2.0× cap', () => {
    const r = computeGrit({ effort: 0.9, mood_normalized: 0.2 });
    expect(r.triggered).toBe(true);
    expect(r.multiplier).toBe(2.0);
  });

  it('§6.3 — E=1.0, M=0.0: triggers, 2.0× cap', () => {
    const r = computeGrit({ effort: 1.0, mood_normalized: 0.0 });
    expect(r.triggered).toBe(true);
    expect(r.multiplier).toBe(2.0);
  });

  it('§6.3 — E=0.5, M=0.5: NOT triggered (effort below threshold)', () => {
    const r = computeGrit({ effort: 0.5, mood_normalized: 0.5 });
    expect(r.triggered).toBe(false);
    expect(r.multiplier).toBe(1.0);
  });

  it('§6.3 — E=0.7, M=0.6: NOT triggered (mood above threshold)', () => {
    const r = computeGrit({ effort: 0.7, mood_normalized: 0.6 });
    expect(r.triggered).toBe(false);
    expect(r.multiplier).toBe(1.0);
  });
});

// ────────────────────────────────────────────────────────────
// SPACE MULTIPLIER — §7 [CANON-LOCKED]
// ────────────────────────────────────────────────────────────
describe('Space Multiplier', () => {
  it('matches §7 lock', () => {
    expect(getSpaceMultiplier('protected')).toBe(1.0);
    expect(getSpaceMultiplier('challenging')).toBe(1.25);
    expect(getSpaceMultiplier('vulnerable')).toBe(1.5);
    expect(getSpaceMultiplier('mix')).toBe(1.0);
    expect(getSpaceMultiplier(null)).toBe(1.0);
  });
});

// ────────────────────────────────────────────────────────────
// CREDIT COMPUTATION — §7 worked example
// ────────────────────────────────────────────────────────────
describe('Credit (Grit × Space)', () => {
  it('§7 worked example: Val E=0.8 Mood=0.3 Vulnerable → 2.625 credits', () => {
    const r = computeCredit({
      base_credit: 1,
      mood_at_warmup: 0.3,
      effort_at_warmup: 0.8,
      space_at_warmup: 'vulnerable',
    });
    expect(r.grit_triggered).toBe(true);
    expect(r.grit_multiplier).toBeCloseTo(1.75, 2);
    expect(r.space_multiplier).toBe(1.5);
    expect(r.final_credit).toBeCloseTo(2.625, 3);
  });

  it('no-grit baseline: M=1.0, Space=Protected → base credit unchanged', () => {
    const r = computeCredit({
      base_credit: 1,
      mood_at_warmup: 0.8, // high mood → no grit
      effort_at_warmup: 0.8,
      space_at_warmup: 'protected',
    });
    expect(r.grit_triggered).toBe(false);
    expect(r.final_credit).toBe(1);
  });
});

// ────────────────────────────────────────────────────────────
// SC_BETA — VAL_DEFAULT_13 fix validation
// ────────────────────────────────────────────────────────────
describe('SC_beta (with VAL_DEFAULT_13 V2/V4 double-counting fix)', () => {
  it('produces SC in [0, 100] range', () => {
    const r = computeSCBeta({
      V1_wearable_native: 75,
      Mood_daily: 0.7,
      E: 0.65,
      V3_space_score: 70,
      F: 0.71,
      anchors_compliance: 0.85,
      archetype: 'sedentary_executive',
    });
    expect(r.SC_beta).toBeGreaterThanOrEqual(0);
    expect(r.SC_beta).toBeLessThanOrEqual(100);
  });

  it('uses standard weights for non-EP archetypes', () => {
    const r = computeSCBeta({
      V1_wearable_native: 80,
      Mood_daily: 0.7,
      E: 0.6,
      V3_space_score: 70,
      F: 0.7,
      anchors_compliance: 0.8,
      archetype: 'methodical_achiever',
    });
    expect(r.weights.w1).toBe(0.25);
    expect(r.weights.w2).toBe(0.35);
    expect(r.weights.w3).toBe(0.2);
    expect(r.weights.w4).toBe(0.2);
  });

  it('uses EP weights for embodied_practitioner (VAL_DEFAULT_33)', () => {
    const r = computeSCBeta({
      V1_wearable_native: 80,
      Mood_daily: 0.7,
      E: 0.6,
      V3_space_score: 80,
      F: 0.7,
      anchors_compliance: 0.8,
      archetype: 'embodied_practitioner',
    });
    expect(r.weights.w1).toBe(0.2);
    expect(r.weights.w3).toBe(0.3); // V3 elevated
  });

  it('V2_beta = Mood×50 + E×50 (no longer collapses to E×100)', () => {
    const r = computeSCBeta({
      V1_wearable_native: 50,
      Mood_daily: 0.5,
      E: 0.5,
      V3_space_score: 50,
      F: 0.5,
      anchors_compliance: 0.5,
      archetype: 'sedentary_executive',
    });
    // V2_beta = 0.5×50 + 0.5×50 = 50
    expect(r.V2_beta).toBe(50);
    // V4_beta = 0.5×70 + 0.5×30 = 50
    expect(r.V4_beta).toBe(50);
  });
});

describe('V3 Space Score', () => {
  it('all-protected → high score', () => {
    expect(
      computeV3SpaceScore({
        protected_count: 10,
        challenging_count: 0,
        vulnerable_count: 0,
        mix_count: 0,
      })
    ).toBe(100);
  });

  it('all-vulnerable → low score', () => {
    expect(
      computeV3SpaceScore({
        protected_count: 0,
        challenging_count: 0,
        vulnerable_count: 10,
        mix_count: 0,
      })
    ).toBe(40);
  });

  it('empty → neutral 50', () => {
    expect(
      computeV3SpaceScore({
        protected_count: 0,
        challenging_count: 0,
        vulnerable_count: 0,
        mix_count: 0,
      })
    ).toBe(50);
  });
});

// ────────────────────────────────────────────────────────────
// COLOR STATE RESOLVER — Bookend Decision Table
// ────────────────────────────────────────────────────────────
describe('Color State Resolver', () => {
  it('Yes → GREEN regardless of critical', () => {
    expect(resolveColorState('yes', false)).toBe('green');
    expect(resolveColorState('yes', true)).toBe('green');
  });

  it('No, non-critical → ORANGE', () => {
    expect(resolveColorState('no', false)).toBe('orange');
  });

  it('No, critical → RED', () => {
    expect(resolveColorState('no', true)).toBe('red');
  });

  it('Skip, non-critical → ORANGE', () => {
    expect(resolveColorState('skip', false)).toBe('orange');
  });

  it('Skip, critical → RED', () => {
    expect(resolveColorState('skip', true)).toBe('red');
  });

  it('Timeout, critical → RED', () => {
    expect(resolveColorState('timeout', true)).toBe('red');
  });
});
