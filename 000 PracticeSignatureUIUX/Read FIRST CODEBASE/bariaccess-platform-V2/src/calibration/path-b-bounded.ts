/**
 * PATH B — Bounded 0-100 Direct Mapping
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §6.5 (bounded direct mapping)
 *   - Beacon Calibration Algorithm v1.0 §4.2 (Path B pseudocode)
 * 
 * Use when: input is already on 0-100 scale (higher = better).
 * Examples: R&R apex, all 8 Layer 1 composites (per G2),
 *           SC, CIR, RSI, Effort score (after ×100 scaling),
 *           Aurora Anticipation Index (per G4, after ×100 scaling),
 *           Mood normalized (per G1, after ×100 scaling).
 * 
 * Pure deterministic function. No rescaling — just clamp.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CLAMP TO [0, 100]
// 
// Per Beacon Calibration Algorithm v1.0 §4.2 step 1:
//   "Ensure value is in [0, 100]. If outside, set to 0 or 100."
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamp a 0-100 score to ensure it falls within Beacon range.
 * 
 * @param score_0_100 — score on 0-100 scale (higher = better)
 * @returns clamped score in [0, 100]
 */
export function clampBoundedScore(score_0_100: number): number {
  if (Number.isNaN(score_0_100)) {
    // Per Beacon §12.3 Never Blank — default 30 fallback
    return 30;
  }
  return Math.max(0, Math.min(100, score_0_100));
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE 0-1 INPUT TO 0-100 (used by G1 Mood/Effort + G4 Aurora)
// 
// Per G1 §3 (Mood) and G4 §2.1 (Aurora):
//   "Multiply normalized by 100 for band lookup."
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert 0.0-1.0 score (Mood normalized, Aurora index, etc.) to 0-100 Beacon scale.
 * 
 * @param score_0_1 — normalized score on 0.0-1.0 scale
 * @returns score in [0, 100], clamped
 */
export function scale01To0_100(score_0_1: number): number {
  return clampBoundedScore(score_0_1 * 100);
}
