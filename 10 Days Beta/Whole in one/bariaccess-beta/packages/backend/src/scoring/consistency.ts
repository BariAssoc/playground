/**
 * BariAccess Beta — Consistency (C) Scoring
 *
 * Source: BETA-FORMULA-001 §3 [BIOSTAT-COMMITTED]
 *
 * Per-FAB:  C_i = max(0, 1 − delta_minutes / window_minutes)
 * Rolling: C = mean(C_i across completed FABs in 7-day window)
 *
 * NOTE per Claude review: C is silent on missed FABs — only computed across
 * completed ones. F captures completion rate; C measures timing precision
 * for those that were completed. They MUST be read together at scoring time.
 */

export interface PerFABTiming {
  scheduled_time: Date;
  actual_completion_time: Date;
  window_minutes: number;
}

/**
 * Compute per-FAB consistency C_i.
 * Returns 0.0 if completion was outside window, scaled linearly within window.
 */
export function computeFABConsistency(input: PerFABTiming): number {
  const { scheduled_time, actual_completion_time, window_minutes } = input;
  if (window_minutes <= 0) {
    throw new Error(`window_minutes must be positive; got ${window_minutes}`);
  }
  const deltaMs = Math.abs(
    actual_completion_time.getTime() - scheduled_time.getTime()
  );
  const deltaMinutes = deltaMs / (1000 * 60);
  return Math.max(0, 1 - deltaMinutes / window_minutes);
}

/**
 * Roll up C across all completed FABs in window.
 * Returns 0 if no FABs completed in window (matches §3 spec — undefined
 * collapsed to 0 for downstream stability; pair with F to interpret).
 */
export function computeRollingConsistency(per_fab_C: number[]): number {
  if (per_fab_C.length === 0) return 0;
  const sum = per_fab_C.reduce((acc, c) => acc + c, 0);
  return sum / per_fab_C.length;
}
