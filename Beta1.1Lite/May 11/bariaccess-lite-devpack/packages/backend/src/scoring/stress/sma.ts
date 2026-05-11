/**
 * BariAccess Lite — SMA (Sleep & Metabolic Alignment)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §5 SMA
 *
 * Formula:
 *   SMA = 0.40·EatingWindow + 0.30·LastMealGap + 0.30·GlucoseStability
 *
 *   EatingWindow:     duration first→last meal (8-12h sweet spot)
 *   LastMealGap:      last meal → bedtime (2-4h sweet spot)
 *   GlucoseStability: overnight CV% via Libre (DECISIONS.md §5)
 *
 * Glucose may be missing on sensor-change days; weight redistributes naturally.
 */

import {
  SMA_COMPONENTS,
  type ScoreResult,
  type OvernightGlucoseSeries,
  type FABAggregate,
  type SleepNight,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  evaluateBounded,
  SMA_EATING_WINDOW_SPEC,
  SMA_LAST_MEAL_GAP_SPEC,
  SMA_GLUCOSE_CV_SPEC,
} from '../../baseline/bounded.js';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

export interface SMAInput {
  fab_aggregate: FABAggregate | null;     // V2 — meal timestamps
  sleep: SleepNight | null;               // V1 — bedtime anchor for last-meal-gap
  glucose_overnight: OvernightGlucoseSeries | null;
  provenance_per_input: Partial<Record<keyof typeof SMA_COMPONENTS, ProvenanceFlag>>;
  computed_at: string;
}

export function computeSMA(input: SMAInput): ScoreResult {
  const breakdown: Record<string, number | null> = {
    eating_window: null,
    last_meal_gap: null,
    glucose_stability: null,
  };

  // EatingWindow — hours between first and last meal of the day.
  const meals = input.fab_aggregate?.meal_timestamps;
  if (meals?.first_meal && meals?.last_meal) {
    const start = new Date(meals.first_meal).getTime();
    const end = new Date(meals.last_meal).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      const hours = (end - start) / (1000 * 60 * 60);
      breakdown.eating_window = evaluateBounded(hours, SMA_EATING_WINDOW_SPEC).score;
    }
  }

  // LastMealGap — hours between last meal and bedtime.
  if (meals?.last_meal && input.sleep?.bedtime) {
    const last = new Date(meals.last_meal).getTime();
    const bed = new Date(input.sleep.bedtime).getTime();
    if (Number.isFinite(last) && Number.isFinite(bed) && bed > last) {
      const hours = (bed - last) / (1000 * 60 * 60);
      breakdown.last_meal_gap = evaluateBounded(hours, SMA_LAST_MEAL_GAP_SPEC).score;
    }
  }

  // GlucoseStability — overnight CV%
  if (input.glucose_overnight?.cv_percent !== null && input.glucose_overnight?.cv_percent !== undefined) {
    breakdown.glucose_stability = evaluateBounded(
      input.glucose_overnight.cv_percent,
      SMA_GLUCOSE_CV_SPEC
    ).score;
  }

  const present_keys = Object.keys(SMA_COMPONENTS).filter(
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

  const r = redistributeWeights(present_keys, SMA_COMPONENTS);
  const values: Record<string, number> = {};
  for (const k of present_keys) values[k] = breakdown[k]!;
  const component_score = weightedSum(values, r.weights);
  const score_0_100 = clampScore(component_score * 100);

  // Provenance: glucose can be 🟡 if has_gaps or insufficient readings.
  const per_input = { ...input.provenance_per_input };
  if (input.glucose_overnight && breakdown.glucose_stability !== null) {
    per_input.glucose_stability = input.glucose_overnight.provenance;
  }

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance: rollUp(per_input, present_keys),
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
