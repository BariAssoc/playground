/**
 * EFFORT SCORE — Canonical Formula (G1 §4 LOCKED, supersedes PAC-ISE-002 v2.0)
 * 
 * Source canon:
 *   - CCO-FAB-001-PIN-001 v1.0 (G1) §4 (canonical formula)
 *   - CCO-PAC-ISE-002-PATCH-001 v1.0 (G7) §2 (drift resolution)
 *   - Voice Memory Rule, March 17, 2026 (formula origin)
 * 
 * FORMULA (LOCKED):
 *   E = 0.40·F + 0.30·C + 0.30·LC
 * 
 *   where:
 *     F  = FAB Completion Rate (7-day rolling, 0.0–1.0)
 *     C  = Consistency / timing accuracy (7-day rolling, 0.0–1.0)
 *     LC = Learning Coefficient
 * 
 *   LC = 0.30·Quiz_PassRate + 0.25·Quiz_Attempts_norm + 0.25·Content_Engagement_norm + 0.20·Ollie_Questions_norm
 * 
 * Computed nightly by FAB system. Stored in `effort-daily-rollup` container.
 * Resolver READS effort_score_daily — does NOT recompute (per G7).
 */

import type {
  EffortScoreInputs,
  LearningCoefficient,
  EffortScoreDaily
} from '../types/fab.js';

// ─────────────────────────────────────────────────────────────────────────────
// FORMULA WEIGHTS (G1 §4 — LOCKED, do not modify)
// ─────────────────────────────────────────────────────────────────────────────

export const EFFORT_WEIGHT_F = 0.40 as const;
export const EFFORT_WEIGHT_C = 0.30 as const;
export const EFFORT_WEIGHT_LC = 0.30 as const;

// Sanity: weights must sum to 1.0 (compile-time arithmetic check via runtime constant)
const _EFFORT_WEIGHT_SUM = EFFORT_WEIGHT_F + EFFORT_WEIGHT_C + EFFORT_WEIGHT_LC;
if (Math.abs(_EFFORT_WEIGHT_SUM - 1.0) > 0.0001) {
  throw new Error(
    `Effort formula weights must sum to 1.0; got ${_EFFORT_WEIGHT_SUM}. Check CCO-FAB-001-PIN-001 §4.`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING COEFFICIENT WEIGHTS (G1 §4 — LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const LC_WEIGHT_QUIZ_PASS_RATE = 0.30 as const;
export const LC_WEIGHT_QUIZ_ATTEMPTS = 0.25 as const;
export const LC_WEIGHT_CONTENT_ENGAGEMENT = 0.25 as const;
export const LC_WEIGHT_OLLIE_QUESTIONS = 0.20 as const;

const _LC_WEIGHT_SUM =
  LC_WEIGHT_QUIZ_PASS_RATE +
  LC_WEIGHT_QUIZ_ATTEMPTS +
  LC_WEIGHT_CONTENT_ENGAGEMENT +
  LC_WEIGHT_OLLIE_QUESTIONS;
if (Math.abs(_LC_WEIGHT_SUM - 1.0) > 0.0001) {
  throw new Error(
    `LC weights must sum to 1.0; got ${_LC_WEIGHT_SUM}. Check CCO-FAB-001-PIN-001 §4.`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE LEARNING COEFFICIENT (LC component of Effort)
// 
// All four inputs are in [0.0, 1.0]. Returns LC value in [0.0, 1.0].
// ─────────────────────────────────────────────────────────────────────────────

export function computeLearningCoefficient(
  quiz_pass_rate: number,
  quiz_attempts_norm: number,
  content_engagement_norm: number,
  ollie_questions_norm: number
): LearningCoefficient {
  const clamp = (v: number): number => Math.max(0, Math.min(1, v));

  const qpr = clamp(quiz_pass_rate);
  const qa = clamp(quiz_attempts_norm);
  const ce = clamp(content_engagement_norm);
  const oq = clamp(ollie_questions_norm);

  const lc_value =
    LC_WEIGHT_QUIZ_PASS_RATE * qpr +
    LC_WEIGHT_QUIZ_ATTEMPTS * qa +
    LC_WEIGHT_CONTENT_ENGAGEMENT * ce +
    LC_WEIGHT_OLLIE_QUESTIONS * oq;

  return {
    quiz_pass_rate: qpr,
    quiz_attempts_norm: qa,
    content_engagement_norm: ce,
    ollie_questions_norm: oq,
    lc_value: Math.max(0, Math.min(1, lc_value))
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE EFFORT SCORE — main entry
// 
// Returns effort_score_daily in [0.0, 1.0].
// ─────────────────────────────────────────────────────────────────────────────

export function computeEffortScore(inputs: EffortScoreInputs): number {
  const F = Math.max(0, Math.min(1, inputs.fab_completion_rate_7d));
  const C = Math.max(0, Math.min(1, inputs.consistency_timing_7d));
  const LC = inputs.learning_coefficient.lc_value;

  const E = EFFORT_WEIGHT_F * F + EFFORT_WEIGHT_C * C + EFFORT_WEIGHT_LC * LC;

  return Math.max(0, Math.min(1, E));
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD DAILY ROLLUP DOCUMENT
// 
// Called by nightly FAB-system job. Persists to effort-daily-rollup container.
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildEffortDailyParams {
  userId: string;
  date: string; // YYYY-MM-DD
  fab_completion_rate_7d: number;
  consistency_timing_7d: number;
  quiz_pass_rate: number;
  quiz_attempts_norm: number;
  content_engagement_norm: number;
  ollie_questions_norm: number;
}

export function buildEffortDailyRecord(
  params: BuildEffortDailyParams
): EffortScoreDaily {
  const learning_coefficient = computeLearningCoefficient(
    params.quiz_pass_rate,
    params.quiz_attempts_norm,
    params.content_engagement_norm,
    params.ollie_questions_norm
  );

  const inputs: EffortScoreInputs = {
    fab_completion_rate_7d: params.fab_completion_rate_7d,
    consistency_timing_7d: params.consistency_timing_7d,
    learning_coefficient
  };

  const effort_score_daily = computeEffortScore(inputs);

  return {
    user_id: params.userId,
    date: params.date,
    inputs,
    effort_score_daily,
    computed_at: new Date().toISOString()
  };
}
