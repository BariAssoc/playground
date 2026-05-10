/**
 * BariAccess Lite — AMP (Activity & Movement Performance)
 *
 * Source: RR-Calculation-Canon-Pass1_v1_1_LOCKED.md §AMP
 *         + DECISIONS.md §8 (LSR warmup behavior)
 *
 * Formula:
 *   AMP = 0.40·EPC + 0.30·MVI + 0.30·LSR
 *
 * Anchor: EPC (per Pass 1 §AMP Spec 5).
 *
 * LSR warmup behavior (DECISIONS.md §8):
 *   Day 1-13:  LSR INSUFFICIENT — redistribute → AMP = 0.57·EPC + 0.43·MVI
 *   Day 14-27: LSR PARTIAL — included with full weight; composite is PARTIAL
 *   Day 28+:   LSR FULL — full canon
 */

import {
  AMP_WEIGHTS,
  AMP_ANCHOR,
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

export interface AMPInput {
  epc: ScoreResult;
  mvi: ScoreResult;
  lsr: ScoreResult;
  days_active: number;
  computed_at: string;
}

export function computeAMP(input: AMPInput): CompositeResult {
  const { epc, mvi, lsr, computed_at } = input;
  const sub_scores: Record<SubScoreId, ScoreResult> = {
    EPC: epc,
    MVI: mvi,
    LSR: lsr,
  } as Record<SubScoreId, ScoreResult>;

  // Anchor EPC must be present.
  if (epc.value === null) {
    return {
      composite_id: 'AMP',
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'UNKNOWN_METHOD',
      breakdown: { EPC: null, MVI: mvi.value, LSR: lsr.value },
      weights_used: {},
      sub_score_ids: ['EPC', 'MVI', 'LSR'],
      cascade_rim_active: cascadeRimActive([mvi.band, lsr.band]),
      sub_scores,
      computed_at,
    };
  }

  // Build present_keys honoring LSR warmup gate.
  // If LSR is INSUFFICIENT (which is the warmup-day case), it doesn't enter the sum;
  // weights redistribute over EPC + MVI.
  const present_keys: string[] = [AMP_ANCHOR];
  if (mvi.value !== null) present_keys.push('MVI');
  if (lsr.value !== null) present_keys.push('LSR');

  const r = redistributeWeights(present_keys, AMP_WEIGHTS);
  const values: Record<string, number> = { EPC: epc.value };
  if (mvi.value !== null) values.MVI = mvi.value;
  if (lsr.value !== null) values.LSR = lsr.value;

  const composite_value = clampScore(weightedSum(values, r.weights));

  const provenance =
    [epc, mvi, lsr].some((s) => s.provenance === 'UNKNOWN_METHOD')
      ? 'UNKNOWN_METHOD'
      : [epc, mvi, lsr].some((s) => s.provenance === 'PENDING_VALIDATION')
        ? 'PENDING_VALIDATION'
        : 'VALIDATED';

  // Degradation:
  //   - PARTIAL during LSR warmup (Day 1-27) regardless of present_keys
  //   - PARTIAL if any sub-score is PARTIAL or INSUFFICIENT
  const partial_warmup = input.days_active < 28;
  const degradation =
    partial_warmup ||
    [epc, mvi, lsr].some((s) => s.degradation === 'PARTIAL') ||
    r.redistributed
      ? 'PARTIAL'
      : 'FULL';

  return {
    composite_id: 'AMP',
    value: composite_value,
    band: resolveBand(composite_value),
    degradation,
    provenance,
    breakdown: { EPC: epc.value, MVI: mvi.value, LSR: lsr.value },
    weights_used: r.weights,
    sub_score_ids: ['EPC', 'MVI', 'LSR'],
    cascade_rim_active: cascadeRimActive([epc.band, mvi.band, lsr.band]),
    sub_scores,
    computed_at,
  };
}
