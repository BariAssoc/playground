/**
 * BariAccess Lite — EPC (Exercise Performance Capacity)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §13 EPC
 *
 * Formula:
 *   EPC = max(CI-M, CI-C) × performance_aggregate
 *
 *   performance_aggregate = 0.35·Strength + 0.35·Endurance + 0.30·Power
 *
 * AMP anchor sub-score (per Pass 1 §AMP Spec 5).
 *
 * Inputs:
 *   - CI-M, CI-C (computed by ci-layer/ci-m, ci-layer/ci-c)
 *   - performance components 0..1 from session aggregations
 */

import {
  EPC_PERFORMANCE_COMPONENTS,
  type ScoreResult,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

export interface EPCInput {
  ci_m: number | null;            // 0..1
  ci_c: number | null;            // 0..1
  strength_0_1: number | null;
  endurance_0_1: number | null;
  power_0_1: number | null;
  provenance_per_input: Partial<Record<string, ProvenanceFlag>>;
  computed_at: string;
}

export function computeEPC(input: EPCInput): ScoreResult {
  const breakdown: Record<string, number | null> = {
    ci_m: input.ci_m,
    ci_c: input.ci_c,
    strength: input.strength_0_1,
    endurance: input.endurance_0_1,
    power: input.power_0_1,
  };

  // Need at least one of CI-M / CI-C, and at least one performance component.
  const ci_max = bestOf(input.ci_m, input.ci_c);

  const perf_present: string[] = [];
  if (input.strength_0_1 !== null && Number.isFinite(input.strength_0_1)) perf_present.push('strength');
  if (input.endurance_0_1 !== null && Number.isFinite(input.endurance_0_1)) perf_present.push('endurance');
  if (input.power_0_1 !== null && Number.isFinite(input.power_0_1)) perf_present.push('power');

  if (ci_max === null || perf_present.length === 0) {
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

  const r = redistributeWeights(perf_present, EPC_PERFORMANCE_COMPONENTS);
  const values: Record<string, number> = {};
  if (input.strength_0_1 !== null) values.strength = input.strength_0_1;
  if (input.endurance_0_1 !== null) values.endurance = input.endurance_0_1;
  if (input.power_0_1 !== null) values.power = input.power_0_1;

  const performance_aggregate = weightedSum(values, r.weights);

  // EPC = max(CI-M, CI-C) × performance_aggregate. Both 0..1.
  const epc_0_1 = ci_max * performance_aggregate;
  const score_0_100 = clampScore(epc_0_1 * 100);

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed || (input.ci_m === null || input.ci_c === null) ? 'PARTIAL' : 'FULL',
    provenance: rollUp(input.provenance_per_input, perf_present),
    breakdown,
    weights_used: r.weights,
    computed_at: input.computed_at,
  };
}

function bestOf(a: number | null, b: number | null): number | null {
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return Math.max(a, b);
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
