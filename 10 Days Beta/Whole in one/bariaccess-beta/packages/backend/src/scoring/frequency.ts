/**
 * BariAccess Beta — Frequency (F) Scoring
 *
 * Source: BETA-FORMULA-001 §2 [BIOSTAT-COMMITTED]
 *
 * F = completed_FABs_7d / scheduled_FABs_7d
 * Range: 0.0–1.0
 * Window: Rolling 7 days
 *
 * Edge case: First 6 days have <70 scheduled events.
 * Compute against actual scheduled count for partial window.
 * Do NOT pad with zeros (per spec).
 */

export interface FrequencyInputs {
  completed_count: number;
  scheduled_count: number;
}

export interface FrequencyResult {
  F: number;
  partial_window: boolean;
}

/**
 * Compute F over a rolling window.
 * @param completed number of FABs marked completion=yes in window
 * @param scheduled total FABs scheduled in window (including missed)
 * @param expected_full_window typical full-window count (default 70 = 10 FABs × 7 days)
 */
export function computeFrequency(
  completed: number,
  scheduled: number,
  expected_full_window = 70
): FrequencyResult {
  if (scheduled <= 0) {
    return { F: 0, partial_window: true };
  }
  if (completed < 0 || completed > scheduled) {
    throw new Error(
      `completed (${completed}) must be in [0, scheduled (${scheduled})]`
    );
  }
  const F = completed / scheduled;
  return {
    F,
    partial_window: scheduled < expected_full_window,
  };
}
