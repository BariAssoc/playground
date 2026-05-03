/**
 * PATH A — Z-Score Piecewise Linear Mapping
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §6 (piecewise linear function)
 *   - Beacon Canon v1.1 §7.3 (inversion rule for "higher is worse" metrics)
 *   - Beacon Calibration Algorithm v1.0 §4.1 (Path A pseudocode)
 * 
 * Use when: input is a normalized Z-score (population or reference).
 * Examples: SMA composite Z, component Z after ln() and ref.
 * 
 * Pure deterministic function.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PIECEWISE LINEAR MAPPING (Beacon Canon v1.1 §6 — LOCKED)
// 
// Z-score breakpoints derived from population reference data + 9,000-patient
// bariatric experience. Asymmetric — "average = Light Orange" doctrine.
// 
//   If Z >= +1.5   → Score = min(100, 95 + (Z - 1.5) × 10)
//   If Z >= +0.7   → Score = 85 + (Z - 0.7) × 12.5
//   If Z >= +0.3   → Score = 80 + (Z - 0.3) × 12.5
//   If Z >= -0.3   → Score = 70 + (Z + 0.3) × 16.7
//   If Z >= -0.6   → Score = 65 + (Z + 0.6) × 16.7
//   If Z >= -1.0   → Score = 60 + (Z + 1.0) × 12.5
//   If Z <  -1.0   → Score = max(0, 60 + (Z + 1.0) × 20)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map Z-score to Beacon 0-100 score using locked piecewise linear function.
 * 
 * @param zScore — normalized Z-score (positive = better when convention applied)
 * @param higherIsBetter — if false, Z is inverted before mapping (Beacon §7.3)
 * @returns score in [0, 100], clamped
 */
export function zScoreToBeaconScore(
  zScore: number,
  higherIsBetter: boolean = true
): number {
  // Inversion for "higher is worse" metrics (Beacon §7.3)
  const z = higherIsBetter ? zScore : -zScore;

  let score: number;

  if (z >= 1.5) {
    // Top tier — cap at 100
    score = Math.min(100, 95 + (z - 1.5) * 10);
  } else if (z >= 0.7) {
    // 85-94 range (Med Green)
    score = 85 + (z - 0.7) * 12.5;
  } else if (z >= 0.3) {
    // 80-84 range (Faint Green)
    score = 80 + (z - 0.3) * 12.5;
  } else if (z >= -0.3) {
    // 70-79 range (Light Orange) — "average = Light Orange" central zone
    score = 70 + (z + 0.3) * 16.7;
  } else if (z >= -0.6) {
    // 65-69 range (Med Orange)
    score = 65 + (z + 0.6) * 16.7;
  } else if (z >= -1.0) {
    // 60-64 range (Dark Orange)
    score = 60 + (z + 1.0) * 12.5;
  } else {
    // Below -1.0 → Red zone, floor at 0
    score = Math.max(0, 60 + (z + 1.0) * 20);
  }

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITY-CHECK CONSTANTS — useful for tests + debugging
// 
// These verify the piecewise function produces expected scores at Z breakpoints:
//   Z = +1.5  → 95.0  (Band 1 boundary)
//   Z = +0.7  → 85.0  (Band 2 boundary)
//   Z = +0.3  → 80.0  (Band 3 boundary)
//   Z =  0.0  → 75.01 (mid Band 4 — the "average = Light Orange" doctrine)
//   Z = -0.3  → 70.0  (Band 4 lower boundary)
//   Z = -0.6  → 65.0  (Band 5 boundary)
//   Z = -1.0  → 60.0  (Band 6 boundary)
//   Z = -3.0  → 20.0  (deep Red)
// ─────────────────────────────────────────────────────────────────────────────

export const ZSCORE_REFERENCE_POINTS = {
  Z_PLUS_1_5: 95.0,
  Z_PLUS_0_7: 85.0,
  Z_PLUS_0_3: 80.0,
  Z_ZERO: 75.01, // "average = Light Orange" — Beacon doctrine
  Z_MINUS_0_3: 70.0,
  Z_MINUS_0_6: 65.0,
  Z_MINUS_1_0: 60.0,
  Z_MINUS_3_0: 20.0
} as const;
