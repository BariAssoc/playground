/**
 * SLOPE 7-DAY — Linear Regression Slope Computation
 * 
 * Source canon:
 *   - CCO-FAB-001-PIN-001 v1.0 (G1) §5 (slope computation method)
 *   - CCO-PAC-ISE-002-PATCH-001 v1.0 (G7) §3.2 (used identically for mood/effort/fsi)
 *   - PAC-ISE-002 v2.0 §6 Signal 6 (THRESHOLD_NEG = -0.1, THRESHOLD_POS = +0.1)
 * 
 * Pure deterministic function. Used by Resolver Signal 6 for all three trajectory
 * inputs (mood_slope, effort_slope, fsi_direction's underlying slope).
 * 
 * Method: ordinary least squares (OLS) linear regression on (day_index, value) pairs.
 * Returns the slope coefficient — units of value per day.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SLOPE THRESHOLDS (PAC-ISE-002 v2.0 §15 — locked, Val overruled WoZ-only)
// ─────────────────────────────────────────────────────────────────────────────

export const THRESHOLD_NEG = -0.1; // slope ≤ this → "down" classification
export const THRESHOLD_POS = +0.1; // slope ≥ this → "up" classification

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE 7-DAY SLOPE — pure function
// 
// Input: array of daily values (must be length 7 for canonical 7-day slope).
// Index 0 = 7 days ago, Index 6 = today.
// 
// Returns: slope (units per day). Positive = trending up. Negative = trending down.
// 
// Edge cases:
//   - Empty array → return 0 (treat as flat)
//   - Single value → return 0 (no slope without two points)
//   - All values equal → return 0 (true mathematical result)
//   - NaN values → skipped before regression
// ─────────────────────────────────────────────────────────────────────────────

export function compute7daySlope(values: number[]): number {
  // Filter out NaN values (defensive — upstream should default 30 per Beacon §12.3)
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v !== undefined && !Number.isNaN(v)) {
      points.push({ x: i, y: v });
    }
  }

  // Need at least 2 points to compute slope
  if (points.length < 2) {
    return 0;
  }

  // Ordinary least squares: slope = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)
  const n = points.length;
  const xMean = points.reduce((sum, p) => sum + p.x, 0) / n;
  const yMean = points.reduce((sum, p) => sum + p.y, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (const p of points) {
    const xDev = p.x - xMean;
    const yDev = p.y - yMean;
    numerator += xDev * yDev;
    denominator += xDev * xDev;
  }

  // Defensive: degenerate denominator (all x values equal — shouldn't happen with daily indices)
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIFY SLOPE DIRECTION (PAC-ISE-002 v2.0 §6 Signal 6 thresholds)
// ─────────────────────────────────────────────────────────────────────────────

export type SlopeDirection = 'up' | 'down' | 'stable';

export function classifySlope(slope: number): SlopeDirection {
  if (slope >= THRESHOLD_POS) return 'up';
  if (slope <= THRESHOLD_NEG) return 'down';
  return 'stable';
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIFY DIRECTION FROM ALL THREE TRAJECTORY INPUTS (G7 §3.3 reference impl)
// 
// Composite trajectory direction logic (Signal 6 final output):
//   "up"   if any 2 of 3 slopes are "up" AND none are "down"
//   "down" if any 2 of 3 slopes are "down"
//   "stable" otherwise
// ─────────────────────────────────────────────────────────────────────────────

export function classifyTrajectoryDirection(
  moodSlope: number,
  effortSlope: number,
  fsiSlope: number
): SlopeDirection {
  const moodDir = classifySlope(moodSlope);
  const effortDir = classifySlope(effortSlope);
  const fsiDir = classifySlope(fsiSlope);

  const directions = [moodDir, effortDir, fsiDir];
  const upCount = directions.filter((d) => d === 'up').length;
  const downCount = directions.filter((d) => d === 'down').length;

  if (downCount >= 2) return 'down';
  if (upCount >= 2 && downCount === 0) return 'up';
  return 'stable';
}
