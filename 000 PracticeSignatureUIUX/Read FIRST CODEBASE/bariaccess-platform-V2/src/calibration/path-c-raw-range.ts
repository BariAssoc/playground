/**
 * PATH C — Raw Range Rescale to 0-100
 * 
 * Source canon:
 *   - Beacon Calibration Algorithm v1.0 §4.3 (Path C pseudocode)
 * 
 * Use when: score is on a known numeric range [min, max] with a known direction
 * (higher = better OR higher = worse).
 * Examples: Custom formulas on [0, 10], [0, 1], or other bounded scale that
 *           don't fit Path A (Z) or Path B (already 0-100).
 * 
 * NAMING NOTE (per Calibration Algorithm v1.0 §4.3):
 *   This "Path C" is the Raw_Range calibration path in this algorithm only.
 *   It is NOT Beacon Canon §8 "Path C: Hybrid" (which is the normalization path
 *   for composites built from mixed V1+V2/V3 components).
 * 
 * Pure deterministic function.
 */

// ─────────────────────────────────────────────────────────────────────────────
// LINEAR RESCALE — pure function
// 
// Per Calibration Algorithm v1.0 §4.3:
//   If higher = better:
//     Score_0_100 = 100 × (value - min) / (max - min)
//   If higher = worse:
//     Score_0_100 = 100 × (max - value) / (max - min)
//   Special case: if max == min, return 50 (Beacon §6.5 default)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rescale a value from arbitrary range [min, max] to Beacon 0-100 scale.
 * 
 * @param value — raw score
 * @param min — lower bound of input range
 * @param max — upper bound of input range
 * @param higherIsBetter — direction convention (true = higher is better)
 * @returns score in [0, 100], clamped
 */
export function rescaleRawRange(
  value: number,
  min: number,
  max: number,
  higherIsBetter: boolean
): number {
  // Edge case: degenerate range
  if (max === min) {
    return 50;
  }

  // Edge case: invalid input
  if (Number.isNaN(value) || Number.isNaN(min) || Number.isNaN(max)) {
    // Per Beacon §12.3 Never Blank — default 30 fallback
    return 30;
  }

  // Edge case: inverted range (defensive)
  if (max < min) {
    [min, max] = [max, min];
  }

  let score: number;
  if (higherIsBetter) {
    score = (100 * (value - min)) / (max - min);
  } else {
    score = (100 * (max - value)) / (max - min);
  }

  // Clamp to [0, 100]
  return Math.max(0, Math.min(100, score));
}
