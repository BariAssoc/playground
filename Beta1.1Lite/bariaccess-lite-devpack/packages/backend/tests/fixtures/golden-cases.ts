/**
 * Golden test fixtures — hand-calculated cases.
 *
 * Each fixture has the input + the expected output verified by hand against
 * the canon formulas. When tests fail, check whether the canon changed before
 * editing fixtures — the fixtures are the canon's witness.
 */

import type {
  SleepNight,
  GLP1Status,
  PersonalBaseline,
  OvernightGlucoseSeries,
  FABAggregate,
} from '../../../shared/src/types/index.js';

// ────────────────────────────────────────────────────────────
// SLEEP NIGHTS — for SQI/SRI/SNS tests
// ────────────────────────────────────────────────────────────

export const SLEEP_GOOD: SleepNight = {
  date: '2026-05-08',
  bedtime: '2026-05-08T23:00:00.000Z',
  wake_time: '2026-05-09T07:00:00.000Z',
  total_sleep_ms: 7.5 * 60 * 60 * 1000,    // 7.5 hours
  duration_deep_ms: 1.5 * 60 * 60 * 1000,  // 20% deep
  duration_rem_ms: 1.6 * 60 * 60 * 1000,
  efficiency: 0.92,                         // 92%
  awakenings: 1,
  latency_ms: 12 * 60 * 1000,              // 12 min
  source: 'oura',
};

export const SLEEP_POOR: SleepNight = {
  date: '2026-05-08',
  bedtime: '2026-05-09T01:30:00.000Z',
  wake_time: '2026-05-09T05:30:00.000Z',
  total_sleep_ms: 4 * 60 * 60 * 1000,
  duration_deep_ms: 0.3 * 60 * 60 * 1000,  // 7.5% deep
  duration_rem_ms: 0.5 * 60 * 60 * 1000,
  efficiency: 0.65,
  awakenings: 8,
  latency_ms: 35 * 60 * 1000,
  source: 'oura',
};

export function buildSleepWeek(base: SleepNight, jitterMin: number = 0): SleepNight[] {
  const out: SleepNight[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayOffset = -i;
    const bedtimeJitter = (Math.sin(i * 1.3) * jitterMin) * 60 * 1000;
    const bed = new Date(base.bedtime).getTime() + dayOffset * 24 * 60 * 60 * 1000 + bedtimeJitter;
    const wake = new Date(base.wake_time).getTime() + dayOffset * 24 * 60 * 60 * 1000 + bedtimeJitter;
    const date = new Date(bed).toISOString().slice(0, 10);
    out.push({
      ...base,
      date,
      bedtime: new Date(bed).toISOString(),
      wake_time: new Date(wake).toISOString(),
    });
  }
  return out;
}

// ────────────────────────────────────────────────────────────
// GLP-1 PROFILES
// ────────────────────────────────────────────────────────────

export const GLP1_INACTIVE: GLP1Status = {
  active: false,
  compound: null,
  start_date: null,
  dose_current: null,
  days_on: null,
  baseline_reset_active: false,
  dose_stable_since: null,
};

export const GLP1_EARLY_DAY_45: GLP1Status = {
  active: true,
  compound: 'semaglutide',
  start_date: '2026-03-25',
  dose_current: '0.5 mg/wk',
  days_on: 45,
  baseline_reset_active: true,
  dose_stable_since: null,
};

export const GLP1_LATE_DAY_120: GLP1Status = {
  active: true,
  compound: 'semaglutide',
  start_date: '2026-01-09',
  dose_current: '1.0 mg/wk',
  days_on: 120,
  baseline_reset_active: false,
  dose_stable_since: '2026-03-01',
};

// ────────────────────────────────────────────────────────────
// PERSONAL BASELINES
// ────────────────────────────────────────────────────────────

export const HRV_BASELINE_VALIDATED: PersonalBaseline = {
  metric: 'hrv',
  mean: 4.0,           // log-space mean (e.g. ln(55))
  stddev: 0.20,
  days_in_window: 28,
  provenance: 'VALIDATED',
  log_transformed: true,
  computed_at: '2026-05-09T02:00:00Z',
};

export const HRV_BASELINE_PENDING: PersonalBaseline = {
  ...HRV_BASELINE_VALIDATED,
  days_in_window: 14,
  provenance: 'PENDING_VALIDATION',
};

// ────────────────────────────────────────────────────────────
// GLUCOSE
// ────────────────────────────────────────────────────────────

export const GLUCOSE_OVERNIGHT_STABLE: OvernightGlucoseSeries = {
  start_iso: '2026-05-08T23:30:00Z',
  end_iso: '2026-05-09T06:30:00Z',
  reading_count: 84,                  // ~ every 5 min for 7h
  mean_mgdl: 95,
  stddev_mgdl: 4.3,
  cv_percent: 4.5,
  provenance: 'VALIDATED',
  has_gaps: false,
  source: 'libre',
};

// NOTE: SMA_GLUCOSE_CV_SPEC has an optimal band of CV < 15% scoring 1.0.
// To test that variable glucose lowers SMA, we use cv_percent = 22% which
// falls in the "moderate" band (score 0.5). This is the diabetic-CGM
// "out of target" zone and is the right discriminator for the test.
export const GLUCOSE_OVERNIGHT_VARIABLE: OvernightGlucoseSeries = {
  ...GLUCOSE_OVERNIGHT_STABLE,
  stddev_mgdl: 22.0,
  cv_percent: 22.0,
};

// ────────────────────────────────────────────────────────────
// FAB AGGREGATES
// ────────────────────────────────────────────────────────────

export const FAB_GOOD_DAY: FABAggregate = {
  date: '2026-05-08',
  fab_sleep_rating: 4,
  fab_recovery_rating: 4,
  fab_activity_tags: ['squat', 'pull', 'carry'],
  meal_timestamps: {
    first_meal: '2026-05-08T08:00:00Z',
    last_meal: '2026-05-08T18:30:00Z',
  },
};

export const FAB_DEFAULT: FABAggregate = {
  date: '2026-05-08',
  fab_sleep_rating: 3,
  fab_recovery_rating: 3,
  fab_activity_tags: [],
  meal_timestamps: { first_meal: null, last_meal: null },
};

// ────────────────────────────────────────────────────────────
// CI-M / CI-C 7-DAY SERIES
// ────────────────────────────────────────────────────────────

export function buildCIMSeriesFlat(value: number) {
  return Array.from({ length: 7 }, () => ({
    chrono_align: value,
    peak_window: value,
    consistent_phase: value,
    performance_capacity: value,
    adaptation_quality: value,
    recovery_efficiency: value,
  }));
}

export function buildCICSeriesFlat(value: number) {
  return Array.from({ length: 7 }, () => ({
    temp_phase_align: value,
    awakening_window: value,
    cv_readiness_sync: value,
    aerobic_capacity: value,
    cv_efficiency: value,
    adaptation_markers: value,
  }));
}
