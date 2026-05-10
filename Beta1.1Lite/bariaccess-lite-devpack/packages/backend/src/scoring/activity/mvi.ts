/**
 * BariAccess Lite — MVI (Movement Variety Index)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §14 MVI
 *
 * Formula:
 *   MVI = 0.40·Activity_diversity + 0.35·Movement_patterns + 0.25·Sedentary_breaks
 *
 *   Activity_diversity:    distinct activity types in 7-day window (workout_sessions)
 *   Movement_patterns:     coverage of 6 fundamental patterns (FAB-ACTIVITY tags)
 *   Sedentary_breaks:      hourly movement intervals (V1 intraday epochs)
 */

import {
  MVI_COMPONENTS,
  type ScoreResult,
  type FABAggregate,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

const FUNDAMENTAL_PATTERNS = ['push', 'pull', 'squat', 'hinge', 'carry', 'rotate'] as const;

export interface MVIInput {
  /** Distinct activity types observed in 7-day window. */
  activity_types_7d: string[];
  /** Movement patterns tagged in 7-day window via FAB-ACTIVITY. */
  movement_patterns_7d: Array<typeof FUNDAMENTAL_PATTERNS[number]>;
  /** Hours containing >= 1 movement break (V1 intraday). 0..16 typical waking hours. */
  sedentary_break_hours: number | null;
  /** Total waking hours observed (for normalization). */
  waking_hours: number;
  fab_aggregate: FABAggregate | null;
  provenance_per_input: Partial<Record<string, ProvenanceFlag>>;
  computed_at: string;
}

export function computeMVI(input: MVIInput): ScoreResult {
  const breakdown: Record<string, number | null> = {
    activity_diversity: null,
    movement_patterns: null,
    sedentary_breaks: null,
  };

  // Activity_diversity: 4+ distinct types optimal; 1 → 0.25, 2 → 0.5, 3 → 0.75, 4+ → 1.0
  const distinct_count = new Set(input.activity_types_7d).size;
  if (distinct_count === 0) breakdown.activity_diversity = 0;
  else if (distinct_count >= 4) breakdown.activity_diversity = 1.0;
  else breakdown.activity_diversity = distinct_count / 4;

  // Movement_patterns: fraction of fundamental patterns covered (0..1)
  const patterns_seen = new Set(input.movement_patterns_7d);
  const coverage = patterns_seen.size / FUNDAMENTAL_PATTERNS.length;
  breakdown.movement_patterns = coverage;

  // Sedentary_breaks: fraction of waking hours with movement break
  if (
    input.sedentary_break_hours !== null &&
    Number.isFinite(input.sedentary_break_hours) &&
    input.waking_hours > 0
  ) {
    breakdown.sedentary_breaks = Math.min(1, input.sedentary_break_hours / input.waking_hours);
  }

  const present_keys = Object.keys(MVI_COMPONENTS).filter(
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

  const r = redistributeWeights(present_keys, MVI_COMPONENTS);
  const values: Record<string, number> = {};
  for (const k of present_keys) values[k] = breakdown[k]!;
  const component_score = weightedSum(values, r.weights);
  const score_0_100 = clampScore(component_score * 100);

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance: rollUp(input.provenance_per_input, present_keys),
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
