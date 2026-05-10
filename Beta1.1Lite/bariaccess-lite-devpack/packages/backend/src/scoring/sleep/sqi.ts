/**
 * BariAccess Lite — SQI (Sleep Quality Index)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §1 SQI
 *
 * Formula:
 *   SQI = 0.35·Efficiency + 0.30·DeepSleep% + 0.20·Continuity + 0.15·Latency_inv
 *
 * Components in 0..1 (Path B — bounded scoring against Pass 3 ranges).
 * Output 0..1 (component score). Composite SRC will run through Beacon
 * piecewise linear mapping at the SRC level.
 *
 * SRC anchor sub-score (per Pass 1 §SRC). If SQI insufficient, SRC inherits.
 */

import {
  SQI_COMPONENTS,
  type ScoreResult,
  type SleepNight,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  evaluateBounded,
  SQI_EFFICIENCY_SPEC,
  SQI_DEEP_PCT_SPEC,
  SQI_CONTINUITY_SPEC,
  SQI_LATENCY_SPEC,
} from '../../baseline/bounded.js';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { zToScore, clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface SQIInput {
  sleep: SleepNight;
  provenance_per_input: Partial<Record<keyof typeof SQI_COMPONENTS, ProvenanceFlag>>;
  computed_at: string;
}

export function computeSQI(input: SQIInput): ScoreResult {
  const { sleep, provenance_per_input, computed_at } = input;
  const breakdown: Record<string, number | null> = {};

  // Efficiency (0..1) — Path B
  if (sleep.efficiency !== null && Number.isFinite(sleep.efficiency)) {
    breakdown.efficiency = evaluateBounded(sleep.efficiency, SQI_EFFICIENCY_SPEC).score;
  } else {
    breakdown.efficiency = null;
  }

  // DeepSleep% (Path B, sweet-spot 15-25%)
  if (
    sleep.duration_deep_ms !== null &&
    sleep.total_sleep_ms > 0 &&
    Number.isFinite(sleep.duration_deep_ms)
  ) {
    const deepPct = sleep.duration_deep_ms / sleep.total_sleep_ms;
    breakdown.deep_sleep_pct = evaluateBounded(deepPct, SQI_DEEP_PCT_SPEC).score;
  } else {
    breakdown.deep_sleep_pct = null;
  }

  // Continuity (Path B, lower-better — fewer awakenings)
  if (sleep.awakenings !== null && Number.isFinite(sleep.awakenings)) {
    breakdown.continuity = evaluateBounded(sleep.awakenings, SQI_CONTINUITY_SPEC).score;
  } else {
    breakdown.continuity = null;
  }

  // Latency_inv (Path B, sweet-spot 10-20 min). Latency stored in ms.
  if (sleep.latency_ms !== null && Number.isFinite(sleep.latency_ms)) {
    const latencyMin = sleep.latency_ms / 60_000;
    breakdown.latency_inv = evaluateBounded(latencyMin, SQI_LATENCY_SPEC).score;
  } else {
    breakdown.latency_inv = null;
  }

  // Filter present components.
  const present_keys = Object.keys(SQI_COMPONENTS).filter(
    (k) => breakdown[k] !== null
  );

  // INSUFFICIENT if no Efficiency or fewer than 2 components present.
  if (present_keys.length < 2 || breakdown.efficiency === null) {
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

  const r = redistributeWeights(present_keys, SQI_COMPONENTS);
  const present_values: Record<string, number> = {};
  for (const k of present_keys) {
    present_values[k] = breakdown[k]!;
  }
  const component_score = weightedSum(present_values, r.weights);

  // Path B: convert 0..1 component score → 0..100. Linear at this layer.
  const score_0_100 = clampScore(component_score * 100);
  const band = resolveBand(score_0_100);

  // Provenance roll-up
  const provenance = rollUpProvenance(provenance_per_input, present_keys);

  return {
    value: score_0_100,
    band,
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance,
    breakdown,
    weights_used: r.weights,
    computed_at,
  };
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
