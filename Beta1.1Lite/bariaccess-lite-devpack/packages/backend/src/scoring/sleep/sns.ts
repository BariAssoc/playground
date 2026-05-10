/**
 * BariAccess Lite — SNS (Sleep Need Satisfaction)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §3 SNS
 *
 * Formula:
 *   SNS = 0.50·SleepDebt_inv + 0.30·RecoveryAdequacy + 0.20·SubjectiveSatisfaction
 *
 *   SleepDebt_inv:           inversion of cumulative debt vs personal target
 *   RecoveryAdequacy:        proxy for restorative quality (deep + REM ratio + HRV)
 *   SubjectiveSatisfaction:  V2 input — FAB-SLEEP daily rating (1–5 → 0..1)
 */

import {
  SNS_COMPONENTS,
  type ScoreResult,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

export interface SNSInput {
  /**
   * Sleep debt over recent days vs personal target (in minutes).
   * Positive = debt; negative = surplus. Pass 3 maps to 0..1 inversely.
   */
  sleep_debt_minutes: number | null;
  /** Personal target sleep duration in minutes (e.g. 7.5h = 450). */
  personal_target_min: number;
  /** Computed adequacy score from deep + REM ratios (0..1). */
  recovery_adequacy_0_1: number | null;
  /** FAB-SLEEP rating 1..5; nulled if no FAB submitted. */
  fab_sleep_rating: number | null;
  provenance_per_input: Partial<Record<keyof typeof SNS_COMPONENTS, ProvenanceFlag>>;
  computed_at: string;
}

export function computeSNS(input: SNSInput): ScoreResult {
  const {
    sleep_debt_minutes,
    personal_target_min,
    recovery_adequacy_0_1,
    fab_sleep_rating,
    provenance_per_input,
    computed_at,
  } = input;

  const breakdown: Record<string, number | null> = {
    sleep_debt_inv: null,
    recovery_adequacy: null,
    subjective_satisfaction: null,
  };

  // SleepDebt_inv:
  //   debt = max(0, target - actual). Per Pass 3 — debt as positive minutes.
  //   0..1 mapping: 0 min debt → 1.0, 60 min → 0.7, 120 min → 0.4, ≥180 → 0.
  if (sleep_debt_minutes !== null && Number.isFinite(sleep_debt_minutes)) {
    const debt = Math.max(0, sleep_debt_minutes);
    if (debt <= 0) breakdown.sleep_debt_inv = 1.0;
    else if (debt <= 30) breakdown.sleep_debt_inv = 1.0 - (debt / 30) * 0.15;        // 1.0 → 0.85
    else if (debt <= 60) breakdown.sleep_debt_inv = 0.85 - ((debt - 30) / 30) * 0.15; // 0.85 → 0.70
    else if (debt <= 120) breakdown.sleep_debt_inv = 0.70 - ((debt - 60) / 60) * 0.30; // 0.70 → 0.40
    else if (debt <= 180) breakdown.sleep_debt_inv = 0.40 - ((debt - 120) / 60) * 0.20; // 0.40 → 0.20
    else if (debt <= 240) breakdown.sleep_debt_inv = 0.20 - ((debt - 180) / 60) * 0.20; // 0.20 → 0.00
    else breakdown.sleep_debt_inv = 0;
  }

  if (recovery_adequacy_0_1 !== null && Number.isFinite(recovery_adequacy_0_1)) {
    breakdown.recovery_adequacy = clamp01(recovery_adequacy_0_1);
  }

  if (fab_sleep_rating !== null && Number.isFinite(fab_sleep_rating)) {
    // 1..5 → 0..1 linear
    breakdown.subjective_satisfaction = clamp01((fab_sleep_rating - 1) / 4);
  }

  const present_keys = Object.keys(SNS_COMPONENTS).filter(
    (k) => breakdown[k] !== null
  );
  if (present_keys.length === 0) {
    return {
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'UNKNOWN_METHOD',
      breakdown,
      weights_used: {},
      computed_at,
    };
  }

  const r = redistributeWeights(present_keys, SNS_COMPONENTS);
  const present_values: Record<string, number> = {};
  for (const k of present_keys) present_values[k] = breakdown[k]!;
  const component_score = weightedSum(present_values, r.weights);
  const score_0_100 = clampScore(component_score * 100);

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance: rollUpProvenance(provenance_per_input, present_keys),
    breakdown,
    weights_used: r.weights,
    computed_at,
  };
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function rollUpProvenance(
  per_input: Partial<Record<string, ProvenanceFlag>>,
  present_keys: string[]
): ProvenanceFlag {
  let any_pending = false;
  for (const k of present_keys) {
    const p = per_input[k];
    if (p === 'UNKNOWN_METHOD') return 'UNKNOWN_METHOD';
    if (p === 'PENDING_VALIDATION') any_pending = true;
  }
  return any_pending ? 'PENDING_VALIDATION' : 'VALIDATED';
}
