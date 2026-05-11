/**
 * BariAccess Lite — LSR (Load & Strain Recovery)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §15 LSR
 *
 * Formula:
 *   LSR = ACWR_score / (1 + Strain_score)
 *
 *   ACWR (Acute:Chronic Workload Ratio): Acute_7d / Chronic_28d
 *     Sweet spot 0.8-1.3 (Gabbett 2016) → optimal score 1.0
 *     <0.8 (undertrained) → 0.6-0.8
 *     1.3-1.5 (functional overreach) → 0.6-0.8
 *     >1.5 (overtraining risk) → 0-0.4
 *
 *   Strain_score: 0.40·HRV_dev + 0.30·SleepDebt + 0.30·SubjectiveRecovery_inv
 *     0..1 — higher means more strain
 *
 * Warmup gate (DECISIONS.md §8):
 *   days_active < 14:           INSUFFICIENT
 *   14 ≤ days_active < 28:      PARTIAL (chronic baseline immature)
 *   days_active ≥ 28:           FULL
 */

import {
  LSR_DAYS_INSUFFICIENT_BELOW,
  LSR_DAYS_PARTIAL_BELOW,
  LSR_STRAIN_COMPONENTS,
  type ScoreResult,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

export interface LSRInput {
  days_active: number;
  /** 7-day acute load (sum of training-load units). */
  acute_7d_load: number | null;
  /** 28-day chronic load. NULL during days 14-27 = use available days. */
  chronic_28d_load: number | null;
  /** HRV deviation from baseline (Z-equivalent magnitude, mapped 0..1 magnitude). */
  hrv_deviation_0_1: number | null;
  /** Sleep debt 0..1. */
  sleep_debt_0_1: number | null;
  /** Inverted subjective recovery: 0..1, where 1 = very tired (high strain). */
  subjective_recovery_inv_0_1: number | null;
  provenance_per_input: Partial<Record<string, ProvenanceFlag>>;
  computed_at: string;
}

export function computeLSR(input: LSRInput): ScoreResult {
  // Warmup gate.
  if (input.days_active < LSR_DAYS_INSUFFICIENT_BELOW) {
    return {
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'PENDING_VALIDATION',
      breakdown: { acwr: null, strain: null, days_active: input.days_active },
      weights_used: {},
      computed_at: input.computed_at,
    };
  }

  const partial_window =
    input.days_active < LSR_DAYS_PARTIAL_BELOW;

  // ACWR
  let acwr: number | null = null;
  if (
    input.acute_7d_load !== null &&
    input.chronic_28d_load !== null &&
    input.chronic_28d_load > 0
  ) {
    acwr = input.acute_7d_load / input.chronic_28d_load;
  }

  if (acwr === null) {
    return {
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'PENDING_VALIDATION',
      breakdown: { acwr: null, strain: null, days_active: input.days_active },
      weights_used: {},
      computed_at: input.computed_at,
    };
  }

  // Map ACWR → 0..1 (Gabbett sweet spot).
  let acwr_score: number;
  if (acwr >= 0.8 && acwr <= 1.3) acwr_score = 1.0;
  else if (acwr >= 0.5 && acwr < 0.8) acwr_score = 0.6 + ((acwr - 0.5) / 0.3) * 0.4; // 0.6→1.0
  else if (acwr > 1.3 && acwr <= 1.5) acwr_score = 1.0 - ((acwr - 1.3) / 0.2) * 0.2;  // 1.0→0.8
  else if (acwr > 1.5 && acwr <= 2.0) acwr_score = 0.8 - ((acwr - 1.5) / 0.5) * 0.4;  // 0.8→0.4
  else if (acwr > 2.0) acwr_score = Math.max(0, 0.4 - (acwr - 2.0) * 0.4);
  else acwr_score = Math.max(0, acwr / 0.5 * 0.6);  // <0.5

  // Strain
  const strain_components: Record<string, number | null> = {
    hrv_deviation: input.hrv_deviation_0_1,
    sleep_debt: input.sleep_debt_0_1,
    subjective_recovery: input.subjective_recovery_inv_0_1,
  };
  const strain_present = Object.keys(LSR_STRAIN_COMPONENTS).filter(
    (k) => strain_components[k] !== null && Number.isFinite(strain_components[k]!)
  );
  let strain_score: number;
  if (strain_present.length === 0) {
    strain_score = 0; // no strain signal → no penalty
  } else {
    const r = redistributeWeights(strain_present, LSR_STRAIN_COMPONENTS);
    const values: Record<string, number> = {};
    for (const k of strain_present) values[k] = strain_components[k]!;
    strain_score = weightedSum(values, r.weights);
  }

  // LSR
  const lsr_0_1 = acwr_score / (1 + strain_score);
  const score_0_100 = clampScore(lsr_0_1 * 100);

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: partial_window ? 'PARTIAL' : 'FULL',
    provenance: partial_window ? 'PENDING_VALIDATION' : rollUp(input.provenance_per_input, strain_present),
    breakdown: {
      acwr,
      acwr_score,
      strain_score,
      hrv_deviation: input.hrv_deviation_0_1,
      sleep_debt: input.sleep_debt_0_1,
      subjective_recovery_inv: input.subjective_recovery_inv_0_1,
      days_active: input.days_active,
    },
    weights_used: {},
    computed_at: input.computed_at,
  };
}

function rollUp(
  per_input: Partial<Record<string, ProvenanceFlag>>,
  keys: string[]
): ProvenanceFlag {
  let pending = false;
  for (const k of keys) {
    const p = per_input[k];
    if (p === 'UNKNOWN_METHOD') return 'UNKNOWN_METHOD';
    if (p === 'PENDING_VALIDATION') pending = true;
  }
  return pending ? 'PENDING_VALIDATION' : 'VALIDATED';
}
