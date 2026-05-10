/**
 * BariAccess Lite — CIR (Circadian Index of Resilience)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §4 CIR
 *
 * Formula:
 *   CIR = 0.35·SleepPhase + 0.30·ActivityPhase + 0.20·MealPhase + 0.15·LightExposurePattern
 *
 * Inputs are 7-day phase stability metrics (Φ ≤ 0.30 sweet spot per Pass 3 §CIR).
 * LightExposurePattern feeds from V4 light therapy adherence (DECISIONS.md §6).
 */

import {
  CIR_COMPONENTS,
  type ScoreResult,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

export interface CIRInput {
  /** Phase stability metric (lower = more stable). 0..1 score after Pass 3 mapping. */
  sleep_phase_stability_0_1: number | null;
  activity_phase_stability_0_1: number | null;
  meal_phase_stability_0_1: number | null;
  /** From V4 light therapy adherence. */
  light_exposure_pattern_0_1: number | null;
  provenance_per_input: Partial<Record<keyof typeof CIR_COMPONENTS, ProvenanceFlag>>;
  computed_at: string;
}

export function computeCIR(input: CIRInput): ScoreResult {
  const breakdown: Record<string, number | null> = {
    sleep_phase_stability: input.sleep_phase_stability_0_1,
    activity_phase_stability: input.activity_phase_stability_0_1,
    meal_phase_stability: input.meal_phase_stability_0_1,
    light_exposure_pattern: input.light_exposure_pattern_0_1,
  };

  const present_keys = Object.keys(CIR_COMPONENTS).filter(
    (k) => breakdown[k] !== null && Number.isFinite(breakdown[k]!)
  );

  // Pass 3 §CIR: require sleep_phase + activity_phase minimum.
  if (
    present_keys.length < 2 ||
    breakdown.sleep_phase_stability === null
  ) {
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

  const r = redistributeWeights(present_keys, CIR_COMPONENTS);
  const values: Record<string, number> = {};
  for (const k of present_keys) values[k] = breakdown[k]!;
  const component_score = weightedSum(values, r.weights);
  const score_0_100 = clampScore(component_score * 100);

  const provenance = rollUp(input.provenance_per_input, present_keys);

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance,
    breakdown,
    weights_used: r.weights,
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
