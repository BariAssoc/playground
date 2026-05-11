/**
 * BariAccess Lite — SRC (Sleep & Recovery Composite)
 *
 * Source: RR-Calculation-Canon-Pass1_v1_1_LOCKED.md §SRC
 *
 * Formula:
 *   SRC = 0.40·SQI + 0.35·SRI + 0.25·SNS
 *
 * Anchor: SQI (per Pass 1 §SRC Spec 5).
 * Cascade rim: if any sub-score is in band 4-7, SRC tile shows orange rim.
 */

import {
  SRC_WEIGHTS,
  SRC_ANCHOR,
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

export interface SRCInput {
  sqi: ScoreResult;
  sri: ScoreResult;
  sns: ScoreResult;
  computed_at: string;
}

export function computeSRC(input: SRCInput): CompositeResult {
  const { sqi, sri, sns, computed_at } = input;
  const sub_scores: Record<SubScoreId, ScoreResult> = {
    SQI: sqi,
    SRI: sri,
    SNS: sns,
  } as Record<SubScoreId, ScoreResult>;

  // Per Pass 1 §SRC Spec 5: anchor SQI must be present.
  // If SQI is INSUFFICIENT, SRC is INSUFFICIENT.
  if (sqi.value === null) {
    return {
      composite_id: 'SRC',
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'UNKNOWN_METHOD',
      breakdown: { SQI: null, SRI: sri.value, SNS: sns.value },
      weights_used: {},
      sub_score_ids: ['SQI', 'SRI', 'SNS'],
      cascade_rim_active: cascadeRimActive([sri.band, sns.band]),
      sub_scores,
      computed_at,
    };
  }

  const present_keys: string[] = [SRC_ANCHOR];
  if (sri.value !== null) present_keys.push('SRI');
  if (sns.value !== null) present_keys.push('SNS');

  const r = redistributeWeights(present_keys, SRC_WEIGHTS);

  const values: Record<string, number> = { SQI: sqi.value };
  if (sri.value !== null) values.SRI = sri.value;
  if (sns.value !== null) values.SNS = sns.value;

  const composite_value = clampScore(weightedSum(values, r.weights));
  const band = resolveBand(composite_value);

  // Provenance roll-up: worst of contributing sub-scores.
  const provenance =
    [sqi, sri, sns].some((s) => s.provenance === 'UNKNOWN_METHOD')
      ? 'UNKNOWN_METHOD'
      : [sqi, sri, sns].some((s) => s.provenance === 'PENDING_VALIDATION')
        ? 'PENDING_VALIDATION'
        : 'VALIDATED';

  // Degradation: PARTIAL if any sub-score INSUFFICIENT or PARTIAL.
  const degradation =
    [sqi, sri, sns].some((s) => s.degradation === 'INSUFFICIENT')
      ? 'PARTIAL'
      : [sqi, sri, sns].some((s) => s.degradation === 'PARTIAL') || r.redistributed
        ? 'PARTIAL'
        : 'FULL';

  const cascade = cascadeRimActive([sqi.band, sri.band, sns.band]);

  return {
    composite_id: 'SRC',
    value: composite_value,
    band,
    degradation,
    provenance,
    breakdown: { SQI: sqi.value, SRI: sri.value, SNS: sns.value },
    weights_used: r.weights,
    sub_score_ids: ['SQI', 'SRI', 'SNS'],
    cascade_rim_active: cascade,
    sub_scores,
    computed_at,
  };
}
