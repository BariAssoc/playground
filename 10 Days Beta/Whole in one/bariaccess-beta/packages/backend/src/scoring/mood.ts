/**
 * BariAccess Beta — Mood Scoring
 *
 * Source: BETA-FORMULA-001 §1 [CANON-LOCKED]
 *
 * Mood normalization: linear (raw − 1) / 4
 * Beacon mapping: non-linear sequence 7 / 25.5 / 50 / 75 / 95
 * (NOT a simple ×20 multiplier — emotional weighting on low-mood states)
 */

/**
 * Normalize a 1–5 raw mood self-report to a 0.0–1.0 scalar.
 * @param raw integer 1–5
 */
export function normalizeMood(raw: number): number {
  if (!Number.isInteger(raw) || raw < 1 || raw > 5) {
    throw new Error(`mood_raw must be integer 1–5; got ${raw}`);
  }
  return (raw - 1) / 4.0;
}

/**
 * Map a 1–5 raw mood to its Beacon value (non-linear).
 * Source: BETA-FORMULA-001 §1 Mapping Table.
 */
export function moodToBeacon(raw: number): number {
  switch (raw) {
    case 1:
      return 7;
    case 2:
      return 25.5;
    case 3:
      return 50;
    case 4:
      return 75;
    case 5:
      return 95;
    default:
      throw new Error(`mood_raw must be integer 1–5; got ${raw}`);
  }
}

/**
 * Daily Mood aggregation — VAL_DEFAULT_14 (equal-weighted mean).
 * Differential weighting (Bookend > ambient) deferred to v1.
 *
 * @param normalizedMoods array of 0.0–1.0 normalized mood values from all sources today
 * @returns mean, or 0.5 if empty (neutral fallback)
 */
export function aggregateDailyMood(normalizedMoods: number[]): number {
  if (normalizedMoods.length === 0) return 0.5;
  const sum = normalizedMoods.reduce((acc, m) => acc + m, 0);
  return sum / normalizedMoods.length;
}

/**
 * Compute mood delta for a Bookend pair.
 * Used in Journal entry display and prediction-fidelity tracking.
 */
export function moodDelta(before: number | null, after: number | null): number | null {
  if (before == null || after == null) return null;
  return after - before;
}
