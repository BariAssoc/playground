/**
 * Sub-score tests — verify Pass 3 formulas against golden cases.
 */

import { describe, it, expect } from 'vitest';
import { computeSQI } from '../src/scoring/sleep/sqi.js';
import { computeSRI } from '../src/scoring/sleep/sri.js';
import { computeSNS } from '../src/scoring/sleep/sns.js';
import { computeCIR } from '../src/scoring/stress/cir.js';
import { computeSMA } from '../src/scoring/stress/sma.js';
import { computeRSI } from '../src/scoring/stress/rsi.js';
import { computeEPC } from '../src/scoring/activity/epc.js';
import { computeMVI } from '../src/scoring/activity/mvi.js';
import { computeCIM } from '../src/ci-layer/ci-m.js';
import { computeCIC } from '../src/ci-layer/ci-c.js';
import { w7Kernel, applyW7 } from '../src/ci-layer/w7-kernel.js';
import {
  SLEEP_GOOD,
  SLEEP_POOR,
  buildSleepWeek,
  GLP1_INACTIVE,
  GLP1_EARLY_DAY_45,
  GLUCOSE_OVERNIGHT_STABLE,
  GLUCOSE_OVERNIGHT_VARIABLE,
  FAB_GOOD_DAY,
  buildCIMSeriesFlat,
  buildCICSeriesFlat,
} from './fixtures/golden-cases.js';

const NOW = '2026-05-09T02:00:00Z';

// ────────────────────────────────────────────────────────────
// W7 KERNEL
// ────────────────────────────────────────────────────────────

describe('W7 kernel', () => {
  it('weights sum to 1.0', () => {
    const k = w7Kernel();
    expect(k.sum).toBeCloseTo(1.0, 9);
  });

  it('today (index 6) gets ~0.25 weight per Pass 0 reference profile', () => {
    const k = w7Kernel();
    expect(k.weights[6]!).toBeCloseTo(0.25, 1);
  });

  it('oldest day (index 0) gets the smallest weight', () => {
    const k = w7Kernel();
    expect(k.weights[0]!).toBeLessThan(k.weights[6]!);
  });

  it('applyW7 returns null for all-null series', () => {
    const r = applyW7([null, null, null, null, null, null, null]);
    expect(r.value).toBeNull();
    expect(r.days_used).toBe(0);
  });

  it('applyW7 with constant series returns the constant', () => {
    const r = applyW7([0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    expect(r.value).toBeCloseTo(0.5, 9);
    expect(r.days_used).toBe(7);
  });

  it('applyW7 re-normalizes when days are missing', () => {
    const r = applyW7([null, null, null, null, null, 1.0, 1.0]);
    expect(r.value).toBeCloseTo(1.0, 9);
    expect(r.days_used).toBe(2);
  });
});

// ────────────────────────────────────────────────────────────
// SQI — Sleep Quality Index (Pass 3 §1)
// ────────────────────────────────────────────────────────────

describe('SQI', () => {
  it('good night → high band 1-3', () => {
    const r = computeSQI({
      sleep: SLEEP_GOOD,
      provenance_per_input: {
        efficiency: 'VALIDATED',
        deep_sleep_pct: 'VALIDATED',
        continuity: 'VALIDATED',
        latency_inv: 'VALIDATED',
      },
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeGreaterThanOrEqual(70);
    expect(r.degradation).toBe('FULL');
    expect(r.provenance).toBe('VALIDATED');
  });

  it('poor night → lower band 4-7', () => {
    const r = computeSQI({
      sleep: SLEEP_POOR,
      provenance_per_input: {
        efficiency: 'VALIDATED',
        deep_sleep_pct: 'VALIDATED',
        continuity: 'VALIDATED',
        latency_inv: 'VALIDATED',
      },
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeLessThan(70);
  });

  it('INSUFFICIENT when efficiency missing', () => {
    const r = computeSQI({
      sleep: { ...SLEEP_GOOD, efficiency: null },
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.degradation).toBe('INSUFFICIENT');
    expect(r.value).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────
// SRI — Sleep Regularity Index (Pass 3 §2)
// ────────────────────────────────────────────────────────────

describe('SRI', () => {
  it('regular schedule (0 jitter) → high score', () => {
    const week = buildSleepWeek(SLEEP_GOOD, 0);
    const r = computeSRI({ series: week, provenance: 'VALIDATED', computed_at: NOW });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeGreaterThan(85);
  });

  it('irregular schedule (60 min SD) → lower score', () => {
    const week = buildSleepWeek(SLEEP_GOOD, 60);
    const r = computeSRI({ series: week, provenance: 'VALIDATED', computed_at: NOW });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeLessThan(85);
  });

  it('INSUFFICIENT when fewer than 4 nights', () => {
    const week = [SLEEP_GOOD, SLEEP_GOOD, SLEEP_GOOD, null, null, null, null];
    const r = computeSRI({ series: week, provenance: 'VALIDATED', computed_at: NOW });
    expect(r.degradation).toBe('INSUFFICIENT');
  });
});

// ────────────────────────────────────────────────────────────
// SNS — Sleep Need Satisfaction (Pass 3 §3)
// ────────────────────────────────────────────────────────────

describe('SNS', () => {
  it('zero debt + good adequacy + high FAB → ~95', () => {
    const r = computeSNS({
      sleep_debt_minutes: 0,
      personal_target_min: 450,
      recovery_adequacy_0_1: 0.95,
      fab_sleep_rating: 5,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeGreaterThan(90);
  });

  it('large debt → low score', () => {
    const r = computeSNS({
      sleep_debt_minutes: 200,
      personal_target_min: 450,
      recovery_adequacy_0_1: 0.4,
      fab_sleep_rating: 2,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeLessThan(50);
  });
});

// ────────────────────────────────────────────────────────────
// CIR / SMA / RSI
// ────────────────────────────────────────────────────────────

describe('CIR', () => {
  it('all-stable phases → high score', () => {
    const r = computeCIR({
      sleep_phase_stability_0_1: 0.9,
      activity_phase_stability_0_1: 0.85,
      meal_phase_stability_0_1: 0.8,
      light_exposure_pattern_0_1: 0.95,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeGreaterThanOrEqual(80);
  });

  it('INSUFFICIENT when sleep_phase missing', () => {
    const r = computeCIR({
      sleep_phase_stability_0_1: null,
      activity_phase_stability_0_1: 0.8,
      meal_phase_stability_0_1: null,
      light_exposure_pattern_0_1: null,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.degradation).toBe('INSUFFICIENT');
  });
});

describe('SMA — Libre wired', () => {
  it('stable glucose + good meal timing → high score', () => {
    const r = computeSMA({
      fab_aggregate: FAB_GOOD_DAY,
      sleep: SLEEP_GOOD,
      glucose_overnight: GLUCOSE_OVERNIGHT_STABLE,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeGreaterThanOrEqual(70);
  });

  it('variable glucose lowers score even with good timing', () => {
    const stable = computeSMA({
      fab_aggregate: FAB_GOOD_DAY,
      sleep: SLEEP_GOOD,
      glucose_overnight: GLUCOSE_OVERNIGHT_STABLE,
      provenance_per_input: {},
      computed_at: NOW,
    });
    const variable = computeSMA({
      fab_aggregate: FAB_GOOD_DAY,
      sleep: SLEEP_GOOD,
      glucose_overnight: GLUCOSE_OVERNIGHT_VARIABLE,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(variable.value!).toBeLessThan(stable.value!);
  });

  it('redistributes when glucose missing', () => {
    const r = computeSMA({
      fab_aggregate: FAB_GOOD_DAY,
      sleep: SLEEP_GOOD,
      glucose_overnight: null,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.degradation).toBe('PARTIAL');
  });
});

describe('RSI — GLP-1 annotation hook', () => {
  it('attaches GLP-1 annotation when active + early phase + RHR drift ≤ -2 bpm', () => {
    const r = computeRSI({
      hrv_today: Math.exp(4.0),    // matches log-baseline mean
      hrv_baseline_mean: 4.0,
      hrv_baseline_stddev: 0.2,
      hrv_log_transformed: true,
      rhr_trend_bpm: -3,
      fab_recovery_rating: 4,
      glp1: GLP1_EARLY_DAY_45,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.annotations).toBeDefined();
    expect(r.annotations!.some((a) => a.source === 'glp1_baseline')).toBe(true);
  });

  it('does NOT attach annotation when GLP-1 inactive', () => {
    const r = computeRSI({
      hrv_today: Math.exp(4.0),
      hrv_baseline_mean: 4.0,
      hrv_baseline_stddev: 0.2,
      hrv_log_transformed: true,
      rhr_trend_bpm: -3,
      fab_recovery_rating: 4,
      glp1: GLP1_INACTIVE,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.annotations).toBeUndefined();
  });

  it('does NOT attach annotation when |drift| < 2 bpm (bidirectional)', () => {
    const r = computeRSI({
      hrv_today: Math.exp(4.0),
      hrv_baseline_mean: 4.0,
      hrv_baseline_stddev: 0.2,
      hrv_log_transformed: true,
      rhr_trend_bpm: +1,
      fab_recovery_rating: 4,
      glp1: GLP1_EARLY_DAY_45,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.annotations).toBeUndefined();
  });

  it('attaches annotation for positive drift ≥ +2 bpm (bidirectional)', () => {
    const r = computeRSI({
      hrv_today: Math.exp(4.0),
      hrv_baseline_mean: 4.0,
      hrv_baseline_stddev: 0.2,
      hrv_log_transformed: true,
      rhr_trend_bpm: +3,
      fab_recovery_rating: 4,
      glp1: GLP1_EARLY_DAY_45,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.annotations).toBeDefined();
    expect(r.annotations!.some((a) => a.source === 'glp1_baseline')).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────
// CI-M / CI-C / EPC / MVI
// ────────────────────────────────────────────────────────────

describe('CI-M', () => {
  it('flat 0.8 → CI-M ≈ 0.64 (TAF × MRQ = 0.8 × 0.8)', () => {
    const r = computeCIM(buildCIMSeriesFlat(0.8));
    expect(r.cim).not.toBeNull();
    expect(r.cim!).toBeCloseTo(0.64, 2);
    expect(r.taf).toBeCloseTo(0.8, 6);
    expect(r.mrq).toBeCloseTo(0.8, 6);
  });
});

describe('CI-C', () => {
  it('flat 0.7 → CI-C ≈ 0.49', () => {
    const r = computeCIC(buildCICSeriesFlat(0.7));
    expect(r.cic).not.toBeNull();
    expect(r.cic!).toBeCloseTo(0.49, 2);
  });
});

describe('EPC', () => {
  it('uses max(CI-M, CI-C)', () => {
    const r = computeEPC({
      ci_m: 0.6,
      ci_c: 0.8,
      strength_0_1: 0.7,
      endurance_0_1: 0.7,
      power_0_1: 0.7,
      provenance_per_input: {},
      computed_at: NOW,
    });
    // 0.8 × 0.7 = 0.56 → 56
    expect(r.value).toBeCloseTo(56, 1);
  });

  it('INSUFFICIENT when both CI-M and CI-C null', () => {
    const r = computeEPC({
      ci_m: null,
      ci_c: null,
      strength_0_1: 0.7,
      endurance_0_1: 0.7,
      power_0_1: 0.7,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.degradation).toBe('INSUFFICIENT');
  });
});

describe('MVI', () => {
  it('4+ activity types + full pattern coverage + all sedentary breaks → high score', () => {
    const r = computeMVI({
      activity_types_7d: ['strength', 'cardio', 'mobility', 'walk'],
      movement_patterns_7d: ['push', 'pull', 'squat', 'hinge', 'carry', 'rotate'],
      sedentary_break_hours: 16,
      waking_hours: 16,
      fab_aggregate: FAB_GOOD_DAY,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value).not.toBeNull();
    expect(r.value!).toBeGreaterThanOrEqual(95);
  });

  it('low diversity + low coverage → lower score', () => {
    const r = computeMVI({
      activity_types_7d: ['walk'],
      movement_patterns_7d: [],
      sedentary_break_hours: 4,
      waking_hours: 16,
      fab_aggregate: FAB_GOOD_DAY,
      provenance_per_input: {},
      computed_at: NOW,
    });
    expect(r.value!).toBeLessThan(50);
  });
});
