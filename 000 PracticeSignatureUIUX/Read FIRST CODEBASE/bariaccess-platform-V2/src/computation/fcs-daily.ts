/**
 * FCS DAILY — FAB Consistency Score
 * 
 * Source canon:
 *   - CCO-FAB-001 v2.0 Pass 1 §11 (FCS formula — LOCKED)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §4.2 (slot completion → FCS computation)
 * 
 * FORMULA (LOCKED):
 *   FCS = (0.6 × Completion Rate) + (0.4 × Timing Accuracy)
 * 
 * Range: 0.0–1.0 over 7/14/30 day windows.
 * Baseline: 14 consecutive days FCS ≥ 0.70 = Learning → Stable transition.
 */

import type { FCSScore, FABFamily } from '../types/fab.js';

// ─────────────────────────────────────────────────────────────────────────────
// FORMULA WEIGHTS (FAB §11 — LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const FCS_WEIGHT_COMPLETION = 0.6 as const;
export const FCS_WEIGHT_TIMING = 0.4 as const;

const _FCS_SUM = FCS_WEIGHT_COMPLETION + FCS_WEIGHT_TIMING;
if (Math.abs(_FCS_SUM - 1.0) > 0.0001) {
  throw new Error(`FCS weights must sum to 1.0; got ${_FCS_SUM}. Check FAB Canon §11.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// BASELINE THRESHOLDS (FAB §11)
// ─────────────────────────────────────────────────────────────────────────────

export const FCS_LEARNING_TO_STABLE_THRESHOLD = 0.70;
export const FCS_LEARNING_TO_STABLE_DAYS_REQUIRED = 14;

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE FCS — pure function
// ─────────────────────────────────────────────────────────────────────────────

export function computeFCS(
  completion_rate: number,
  timing_accuracy: number
): number {
  const cr = Math.max(0, Math.min(1, completion_rate));
  const ta = Math.max(0, Math.min(1, timing_accuracy));

  const fcs = FCS_WEIGHT_COMPLETION * cr + FCS_WEIGHT_TIMING * ta;
  return Math.max(0, Math.min(1, fcs));
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD FCS RECORD
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildFCSParams {
  user_id: string;
  family: FABFamily;
  window_days: 7 | 14 | 30;
  completion_rate: number;
  timing_accuracy: number;
}

export function buildFCSRecord(params: BuildFCSParams): FCSScore {
  const fcs_value = computeFCS(params.completion_rate, params.timing_accuracy);

  return {
    user_id: params.user_id,
    family: params.family,
    window_days: params.window_days,
    completion_rate: params.completion_rate,
    timing_accuracy: params.timing_accuracy,
    fcs_value,
    computed_at: new Date().toISOString()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK STABLE TRANSITION ELIGIBILITY (FAB §11)
// 
// Returns true if 14 consecutive days of FCS ≥ 0.70.
// Input: chronological array of daily FCS values, oldest first.
// ─────────────────────────────────────────────────────────────────────────────

export function isEligibleForStableTransition(daily_fcs_values: number[]): boolean {
  if (daily_fcs_values.length < FCS_LEARNING_TO_STABLE_DAYS_REQUIRED) {
    return false;
  }

  // Check the LAST 14 consecutive days
  const recent = daily_fcs_values.slice(-FCS_LEARNING_TO_STABLE_DAYS_REQUIRED);
  return recent.every((v) => v >= FCS_LEARNING_TO_STABLE_THRESHOLD);
}
