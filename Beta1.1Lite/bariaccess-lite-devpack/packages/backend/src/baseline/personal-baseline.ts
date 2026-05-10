/**
 * BariAccess Lite — Personal Baseline Layer
 *
 * Source: CCO-V1V4-REFFRAME-001_v1_0.md §4 Personal Baseline Layer
 *         + Beacon_Canon_v1_1.md §7 Normalization Pipeline
 *
 * Frame A — always on, never off (Property 1, §3.3 Continuity).
 * 28-day rolling window per metric per user.
 *
 * Reset events per §4.5: GLP-1 init/dose change, surgery, illness >7d,
 * timezone shift >5 zones for >7d, pregnancy, provider-initiated.
 */

import type {
  PersonalBaseline,
  BaselineResetEvent,
  ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  BASELINE_WINDOW_DAYS,
  BASELINE_MIN_DAYS_FOR_PROVENANCE_VALIDATED,
  BASELINE_MIN_DAYS_TO_COMPUTE,
} from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface ComputeBaselineInput {
  user_id: string;
  metric: string;
  /** All readings in the rolling window, oldest first. */
  readings: Array<{ date: string; value: number }>;
  /** Window opening date (post-last-reset). ISO date. */
  window_opened_at: string;
  /** Most recent reset event, if any. */
  last_reset_event?: BaselineResetEvent;
}

/**
 * Compute personal baseline μ, σ over the rolling 28-day window.
 *
 * Returns:
 *   - { mean: null, stddev: null, provenance: 'UNKNOWN_METHOD' } if no readings
 *   - { mean, stddev, provenance: 'PENDING_VALIDATION' } if days_in_window < 28
 *   - { mean, stddev, provenance: 'VALIDATED' } if days_in_window === 28
 */
export function computePersonalBaseline(
  input: ComputeBaselineInput
): PersonalBaseline {
  const { user_id, metric, readings, window_opened_at, last_reset_event } = input;

  const valid = readings.filter((r) => Number.isFinite(r.value));
  const days_in_window = Math.min(valid.length, BASELINE_WINDOW_DAYS);

  if (days_in_window < BASELINE_MIN_DAYS_TO_COMPUTE) {
    return {
      user_id,
      metric,
      mean: null,
      stddev: null,
      days_in_window,
      window_opened_at,
      ...(last_reset_event ? { last_reset_event } : {}),
      provenance: days_in_window === 0 ? 'UNKNOWN_METHOD' : 'PENDING_VALIDATION',
    };
  }

  const mean = valid.reduce((acc, r) => acc + r.value, 0) / valid.length;
  const variance =
    valid.reduce((acc, r) => acc + (r.value - mean) ** 2, 0) /
    Math.max(1, valid.length - 1);
  const stddev = Math.sqrt(variance);

  const provenance: ProvenanceFlag =
    days_in_window >= BASELINE_MIN_DAYS_FOR_PROVENANCE_VALIDATED
      ? 'VALIDATED'
      : 'PENDING_VALIDATION';

  return {
    user_id,
    metric,
    mean,
    stddev,
    days_in_window,
    window_opened_at,
    ...(last_reset_event ? { last_reset_event } : {}),
    provenance,
  };
}

// ────────────────────────────────────────────────────────────
// RESET EVENT HANDLER — per §4.5
// ────────────────────────────────────────────────────────────

/**
 * Determine which metrics' baselines a given reset event invalidates.
 * Per CCO-V1V4-REFFRAME-001 §4.5 — different events affect different metric groups.
 */
export function metricsAffectedByReset(
  event: BaselineResetEvent
): Set<string> {
  switch (event.event_type) {
    case 'glp1_initiation':
    case 'glp1_dose_change':
      // GLP-1 affects appetite/satiety hormones, RHR, HRV, weight trend.
      return new Set([
        'heartrate_resting',
        'hrv_rmssd',
        'weight',
        'sleep_duration',
        'duration_active',
      ]);

    case 'major_surgery':
      // Bariatric or major non-elective. Reset all V1 physiology.
      return new Set([
        'heartrate_resting',
        'hrv_rmssd',
        'weight',
        'body_fat',
        'body_mass_index',
        'sleep_duration',
        'sleep_duration_deep',
        'sleep_duration_rem',
        'duration_active',
        'spo2',
      ]);

    case 'illness_extended':
      // >7 days illness — HRV and RHR most affected.
      return new Set(['heartrate_resting', 'hrv_rmssd', 'sleep_duration']);

    case 'travel_timezone_shift':
      // >5 timezones for >7 days — circadian-anchored metrics reset.
      return new Set([
        'sleep_duration',
        'sleep_duration_deep',
        'sleep_duration_rem',
        'hrv_rmssd',
      ]);

    case 'pregnancy_postpartum':
      // Hormonal cascade; reset broadly.
      return new Set([
        'heartrate_resting',
        'hrv_rmssd',
        'weight',
        'body_fat',
        'body_mass_index',
        'sleep_duration',
      ]);

    case 'provider_initiated':
      // Free-text reason in event.reason; provider chooses scope.
      // For Lite v1 default to broad reset — provider sees scope decision in audit.
      return new Set([
        'heartrate_resting',
        'hrv_rmssd',
        'weight',
        'sleep_duration',
      ]);

    default:
      return new Set();
  }
}

/**
 * Apply a reset event: returns a new window_opened_at for affected metrics.
 * Caller is responsible for invalidating cached baselines for those metrics.
 */
export function newWindowOpenedAt(event: BaselineResetEvent): string {
  return event.occurred_at;
}
