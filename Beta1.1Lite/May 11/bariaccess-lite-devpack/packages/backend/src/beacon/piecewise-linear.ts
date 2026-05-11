/**
 * BariAccess — Beacon Piecewise Linear Mapping Function
 *
 * Source: Beacon_Canon_v1_1.md §6.2 (LOCKED)
 *
 * Maps Z-score → 0-100 Beacon score. Asymmetric by clinical design:
 * the breakpoints encode 25 years of clinical experience and 9,000
 * bariatric surgeries. DO NOT modify breakpoints without canon update.
 *
 * The function is verified against Beacon §6.3 Verification Table.
 */

import { PIECEWISE_SEGMENTS } from '@bariaccess-lite/shared';

/**
 * Beacon §6.2 piecewise linear function.
 *
 *   If Z >= +1.5  → Score = 95 + (Z − 1.5) × 10           cap at 100
 *   If Z >= +0.7  → Score = 85 + (Z − 0.7) × 12.5
 *   If Z >= +0.3  → Score = 80 + (Z − 0.3) × 12.5
 *   If Z >= -0.3  → Score = 70 + (Z + 0.3) × 16.7
 *   If Z >= -0.6  → Score = 65 + (Z + 0.6) × 16.7
 *   If Z >= -1.0  → Score = 60 + (Z + 1.0) × 12.5
 *   If Z <  -1.0  → Score = max(0, 60 + (Z + 1.0) × 20)
 */
export function zToScore(z: number): number {
  if (!Number.isFinite(z)) {
    throw new Error(`zToScore: z must be finite; got ${z}`);
  }

  if (z >= 1.5) {
    return Math.min(100, 95 + (z - 1.5) * 10);
  }
  if (z >= 0.7) {
    return 85 + (z - 0.7) * 12.5;
  }
  if (z >= 0.3) {
    return 80 + (z - 0.3) * 12.5;
  }
  if (z >= -0.3) {
    return 70 + (z + 0.3) * 16.7;
  }
  if (z >= -0.6) {
    return 65 + (z + 0.6) * 16.7;
  }
  if (z >= -1.0) {
    return 60 + (z + 1.0) * 12.5;
  }
  // z < -1.0
  return Math.max(0, 60 + (z + 1.0) * 20);
}

/**
 * Convenience: bound a score to the canonical 0-100 range.
 * Use after weighted-sum aggregation in case of micro-overflow.
 */
export function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    throw new Error(`clampScore: score must be finite; got ${score}`);
  }
  return Math.max(0, Math.min(100, score));
}

/**
 * For reference / debug — exposes the segment table.
 */
export function getSegments() {
  return PIECEWISE_SEGMENTS;
}
