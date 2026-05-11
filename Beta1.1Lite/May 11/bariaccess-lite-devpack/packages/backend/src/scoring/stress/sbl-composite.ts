/**
 * BariAccess Lite — SBL (Stress & Burden Level)
 *
 * Source: RR-Calculation-Canon-Pass1_v1_1_LOCKED.md §SBL
 *
 * Formula:
 *   SBL = 0.30·CIR + 0.40·SMA + 0.30·RSI
 *
 * Anchor: RSI (per Pass 1 §SBL Spec 5).
 */

import {
  SBL_WEIGHTS,
  SBL_ANCHOR,
  type ScoreResult,
  type CompositeResult,
  type SubScoreId,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand, cascadeRimActive } from '../../beacon/band-resolver.js';

export interface SBLInput {
  cir: ScoreResult;
  sma: ScoreResult;
  rsi: ScoreResult;
  computed_at: string;
}

export function computeSBL(input: SBLInput): CompositeResult {
  const { cir, sma, rsi, computed_at } = input;
  const sub_scores: Record<SubScoreId, ScoreResult> = {
    CIR: cir,
    SMA: sma,
    RSI: rsi,
  } as Record<SubScoreId, ScoreResult>;

  if (rsi.value === null) {
    return {
      composite_id: 'SBL',
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'UNKNOWN_METHOD',
      breakdown: { CIR: cir.value, SMA: sma.value, RSI: null },
      weights_used: {},
      sub_score_ids: ['CIR', 'SMA', 'RSI'],
      cascade_rim_active: cascadeRimActive([cir.band, sma.band]),
      sub_scores,
      computed_at,
    };
  }

  const present_keys: string[] = [SBL_ANCHOR];
  if (cir.value !== null) present_keys.push('CIR');
  if (sma.value !== null) present_keys.push('SMA');

  const r = redistributeWeights(present_keys, SBL_WEIGHTS);
  const values: Record<string, number> = { RSI: rsi.value };
  if (cir.value !== null) values.CIR = cir.value;
  if (sma.value !== null) values.SMA = sma.value;

  const composite_value = clampScore(weightedSum(values, r.weights));

  const provenance =
    [cir, sma, rsi].some((s) => s.provenance === 'UNKNOWN_METHOD')
      ? 'UNKNOWN_METHOD'
      : [cir, sma, rsi].some((s) => s.provenance === 'PENDING_VALIDATION')
        ? 'PENDING_VALIDATION'
        : 'VALIDATED';

  const degradation =
    [cir, sma, rsi].some((s) => s.degradation === 'INSUFFICIENT') ||
    [cir, sma, rsi].some((s) => s.degradation === 'PARTIAL') ||
    r.redistributed
      ? 'PARTIAL'
      : 'FULL';

  return {
    composite_id: 'SBL',
    value: composite_value,
    band: resolveBand(composite_value),
    degradation,
    provenance,
    breakdown: { CIR: cir.value, SMA: sma.value, RSI: rsi.value },
    weights_used: r.weights,
    sub_score_ids: ['CIR', 'SMA', 'RSI'],
    cascade_rim_active: cascadeRimActive([cir.band, sma.band, rsi.band]),
    sub_scores,
    computed_at,
  };
}
