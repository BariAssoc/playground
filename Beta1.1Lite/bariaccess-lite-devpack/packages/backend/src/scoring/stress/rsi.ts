/**
 * BariAccess Lite — RSI (Recovery Status Index)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §6 RSI
 *
 * Formula:
 *   RSI = 0.40·HRVRecovery + 0.30·RestingHR_trend + 0.30·SubjectiveRecovery
 *
 *   HRVRecovery:        today's HRV vs personal baseline (Z → Beacon)
 *   RestingHR_trend:    7-day RHR trend (negative slope = better)
 *   SubjectiveRecovery: V2 input — FAB-RECOVERY rating (1–5)
 *
 * GLP-1 hook: When active && days_on < 90 && rhr_drift ≤ -2 bpm,
 * annotation attached (math unchanged).
 *
 * SBL anchor sub-score (per Pass 1 §SBL Spec 5).
 */

import {
  RSI_COMPONENTS,
  type ScoreResult,
  type ProvenanceFlag,
  type GLP1Status,
  type ScoreAnnotation,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { zToScore, clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';
import { buildGLP1RHRAnnotation } from '../../v4/annotations.js';

export interface RSIInput {
  /** HRV today (raw value). */
  hrv_today: number | null;
  /** HRV personal baseline μ, σ (caller computes via baseline/personal-baseline.ts). */
  hrv_baseline_mean: number | null;
  hrv_baseline_stddev: number | null;
  /** Whether HRV is in log-space (Beacon §7.1 Stage 1). Caller pre-transforms. */
  hrv_log_transformed: boolean;
  /** RHR 7-day trend in bpm. Negative = improving for healthy patients. */
  rhr_trend_bpm: number | null;
  /** FAB-RECOVERY rating 1..5. */
  fab_recovery_rating: number | null;
  /** GLP-1 status — for annotation only. */
  glp1: GLP1Status;
  provenance_per_input: Partial<Record<keyof typeof RSI_COMPONENTS, ProvenanceFlag>>;
  computed_at: string;
}

export function computeRSI(input: RSIInput): ScoreResult {
  const breakdown: Record<string, number | null> = {
    hrv_recovery: null,
    resting_hr_trend: null,
    subjective_recovery: null,
  };

  // HRVRecovery — Path A through Beacon piecewise.
  if (
    input.hrv_today !== null &&
    input.hrv_baseline_mean !== null &&
    input.hrv_baseline_stddev !== null &&
    input.hrv_baseline_stddev > 0
  ) {
    let x = input.hrv_today;
    if (input.hrv_log_transformed) {
      if (x <= 0) {
        // skip
      } else {
        x = Math.log(x);
        const z = (x - input.hrv_baseline_mean) / input.hrv_baseline_stddev;
        breakdown.hrv_recovery = zToScore(z) / 100; // normalize to 0..1 for component sum
      }
    } else {
      const z = (x - input.hrv_baseline_mean) / input.hrv_baseline_stddev;
      breakdown.hrv_recovery = zToScore(z) / 100;
    }
  }

  // RestingHR_trend — slope-to-score mapping.
  // Pass 3 §RSI: stable or improving (negative slope) is good.
  // Map: ≤-2 bpm → 1.0, -1 → 0.85, 0 → 0.70, +1 → 0.55, +2 → 0.40, ≥+3 → 0.20, ≥+5 → 0.0
  if (input.rhr_trend_bpm !== null && Number.isFinite(input.rhr_trend_bpm)) {
    const t = input.rhr_trend_bpm;
    if (t <= -2) breakdown.resting_hr_trend = 1.0;
    else if (t <= -1) breakdown.resting_hr_trend = 1.0 - (t + 2) * 0.15;
    else if (t <= 0) breakdown.resting_hr_trend = 0.85 - (t + 1) * 0.15;
    else if (t <= 1) breakdown.resting_hr_trend = 0.70 - t * 0.15;
    else if (t <= 2) breakdown.resting_hr_trend = 0.55 - (t - 1) * 0.15;
    else if (t <= 3) breakdown.resting_hr_trend = 0.40 - (t - 2) * 0.20;
    else if (t <= 5) breakdown.resting_hr_trend = 0.20 - (t - 3) * 0.10;
    else breakdown.resting_hr_trend = 0;
  }

  // SubjectiveRecovery — FAB-RECOVERY 1..5 → 0..1
  if (input.fab_recovery_rating !== null && Number.isFinite(input.fab_recovery_rating)) {
    breakdown.subjective_recovery = Math.max(0, Math.min(1, (input.fab_recovery_rating - 1) / 4));
  }

  const present_keys = Object.keys(RSI_COMPONENTS).filter(
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
      computed_at: input.computed_at,
    };
  }

  const r = redistributeWeights(present_keys, RSI_COMPONENTS);
  const values: Record<string, number> = {};
  for (const k of present_keys) values[k] = breakdown[k]!;
  const component_score = weightedSum(values, r.weights);
  const score_0_100 = clampScore(component_score * 100);

  // GLP-1 annotation (metadata only — never modifies score)
  const annotations: ScoreAnnotation[] = [];
  if (input.rhr_trend_bpm !== null) {
    const a = buildGLP1RHRAnnotation(input.glp1, input.rhr_trend_bpm, input.computed_at);
    if (a) annotations.push(a);
  }

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance: rollUp(input.provenance_per_input, present_keys),
    breakdown,
    weights_used: r.weights,
    annotations: annotations.length > 0 ? annotations : undefined,
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
