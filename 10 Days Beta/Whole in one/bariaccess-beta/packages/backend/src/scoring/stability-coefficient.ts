/**
 * BariAccess Beta — Stability Coefficient (SC_beta)
 *
 * Source: BETA-FORMULA-001 §8 [CANON-LOCKED] + VAL_DEFAULT_13 fix
 *
 * Canonical: SC = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4
 * Each Vn bounded 0–100 via Path B normalization.
 *
 * VAL_DEFAULT_13 — V2/V4 double-counting fix (raised in Formula Spec review):
 *   Original §8 beta:  V2 = E×100 (collapses Behavioral to Effort)
 *                      V4 = F×100 (so F appears inside V2 via E AND as V4)
 *
 *   Fixed beta:        V2_beta = (Mood × 50) + (E × 50)
 *                      V4_beta = (F × 70) + (anchors_compliance × 30)
 *                      F now appears once (only inside V4_beta).
 *
 * VAL_DEFAULT_33 — Embodied Practitioner archetype-specific weighting:
 *   Standard:                 SC = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4
 *   Embodied Practitioner:    SC = 0.20·V1 + 0.30·V2 + 0.30·V3 + 0.20·V4
 */

import type { Archetype } from '@bariaccess/shared';

export interface SCBetaInputs {
  V1_wearable_native: number; // 0–100 (Oura Readiness, WHOOP Recovery, etc.)
  Mood_daily: number; // 0.0–1.0
  E: number; // 0.0–1.0
  V3_space_score: number; // 0–100 (weighted Space distribution)
  F: number; // 0.0–1.0
  anchors_compliance: number; // 0.0–1.0 (10 AM nudge protein/hydration/movement Y rate)
  archetype: Archetype;
}

export interface SCBetaBreakdown {
  V1: number;
  V2_beta: number;
  V3: number;
  V4_beta: number;
  weights: { w1: number; w2: number; w3: number; w4: number };
  SC_beta: number;
}

const STANDARD_WEIGHTS = { w1: 0.25, w2: 0.35, w3: 0.2, w4: 0.2 };
const EMBODIED_PRACTITIONER_WEIGHTS = { w1: 0.2, w2: 0.3, w3: 0.3, w4: 0.2 };

function getWeights(archetype: Archetype) {
  // VAL_DEFAULT_33 — EP gets V3-elevated weighting
  if (archetype === 'embodied_practitioner') {
    return EMBODIED_PRACTITIONER_WEIGHTS;
  }
  return STANDARD_WEIGHTS;
}

export function computeSCBeta(inputs: SCBetaInputs): SCBetaBreakdown {
  const {
    V1_wearable_native,
    Mood_daily,
    E,
    V3_space_score,
    F,
    anchors_compliance,
    archetype,
  } = inputs;

  // Validate
  if (V1_wearable_native < 0 || V1_wearable_native > 100) {
    throw new Error(`V1 must be 0–100; got ${V1_wearable_native}`);
  }
  for (const [name, val] of Object.entries({
    Mood_daily,
    E,
    F,
    anchors_compliance,
  })) {
    if (val < 0 || val > 1) {
      throw new Error(`${name} must be 0.0–1.0; got ${val}`);
    }
  }
  if (V3_space_score < 0 || V3_space_score > 100) {
    throw new Error(`V3_space_score must be 0–100; got ${V3_space_score}`);
  }

  // VAL_DEFAULT_13 fix
  const V1 = V1_wearable_native;
  const V2_beta = Mood_daily * 50 + E * 50;
  const V3 = V3_space_score;
  const V4_beta = F * 70 + anchors_compliance * 30;

  const weights = getWeights(archetype);
  const SC_beta =
    weights.w1 * V1 +
    weights.w2 * V2_beta +
    weights.w3 * V3 +
    weights.w4 * V4_beta;

  return {
    V1,
    V2_beta,
    V3,
    V4_beta,
    weights,
    SC_beta: Math.max(0, Math.min(100, SC_beta)),
  };
}

/**
 * Helper: compute V3_space_score from a distribution of Space taps over the day.
 * Treats Space dwell-time as a stability proxy:
 *   - Protected dominant → high score (you stay grounded)
 *   - Vulnerable dominant → lower score (you're often exposed)
 *   - Mix → middle
 *
 * Approximation for beta. Refined post-Day 11.
 */
export interface SpaceDistribution {
  protected_count: number;
  challenging_count: number;
  vulnerable_count: number;
  mix_count: number;
}

export function computeV3SpaceScore(dist: SpaceDistribution): number {
  const total =
    dist.protected_count +
    dist.challenging_count +
    dist.vulnerable_count +
    dist.mix_count;
  if (total === 0) return 50; // Neutral fallback
  // Higher weight on protected; vulnerable downweighted
  const score =
    (dist.protected_count * 100 +
      dist.challenging_count * 70 +
      dist.mix_count * 60 +
      dist.vulnerable_count * 40) /
    total;
  return Math.max(0, Math.min(100, score));
}
