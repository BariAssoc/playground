/**
 * APEX ROLL-UP — Daily R&R Apex Computation
 * 
 * Source canon:
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §3 (cascade stops at composite, apex on roll-up only)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §6 (RRApexRecord schema)
 *   - APEX_ROLLUP_LOCAL_TIME = '03:00' (LOCKED)
 * 
 * Per G2 OQ-PATCH-04 closure:
 *   "Apex roll-up runs ONCE daily at 03:00 patient-local time."
 * 
 * The R&R apex score is the weighted average of all 8 composites' Beacon scores.
 * Phase 1: only LIVE composites contribute (accruing composites excluded from
 * apex calculation, per G2 §3.3 implicit rule — they have no score yet).
 */

import type {
  CompositeStateRecord,
  CompositeName,
  RRApexRecord
} from '../types/composite.js';
import type { CompositeState, ISEState } from '../types/ise.js';
import {
  calibrateToBeaconWithConfidence,
  neverBlankFallback
} from '../calibration/calibrator.js';
import {
  getCompositeWeightsForISE,
  BASELINE_WEIGHT_PER_COMPOSITE
} from './composite-weights-by-ise.js';

export { APEX_ROLLUP_LOCAL_TIME } from '../types/composite.js';

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE WEIGHTS FOR APEX (Beacon Canon v1.1 §15 + §16 dynamic weighting)
// 
// Two paths supported:
//   1. Caller passes explicit `weights` map → those are used directly
//   2. Caller passes `ise_state` → weights resolved via getCompositeWeightsForISE
//      (Beacon §16 dynamic weighting per ISE state — Phase 1 provisional values)
//   3. Neither → baseline 1/8 equal weights (canon §15 default)
// 
// Per Beacon §16.2: exact weight values per ISE state are deferred to PAC-2
// biostatistics validation. The values currently in composite-weights-by-ise.ts
// are PHASE_1_PROVISIONAL — directionally derived from canon §16.3 principles.
// ─────────────────────────────────────────────────────────────────────────────

/** Legacy default — kept for backward compat with existing call sites */
export const COMPOSITE_APEX_WEIGHTS_DEFAULT: Readonly<
  Record<CompositeName, number>
> = {
  SRC: BASELINE_WEIGHT_PER_COMPOSITE,
  SBL: BASELINE_WEIGHT_PER_COMPOSITE,
  MBC: BASELINE_WEIGHT_PER_COMPOSITE,
  MEI: BASELINE_WEIGHT_PER_COMPOSITE,
  AMP: BASELINE_WEIGHT_PER_COMPOSITE,
  BCI: BASELINE_WEIGHT_PER_COMPOSITE,
  CRC: BASELINE_WEIGHT_PER_COMPOSITE,
  BHR: BASELINE_WEIGHT_PER_COMPOSITE
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE APEX ROLL-UP
// 
// Phase 1 logic (G2 §4):
//   - Only `state = "live"` composites contribute (accruing composites have no score)
//   - Re-normalize weights across active composites only
//   - Each accruing composite drops confidence one tier (Beacon §11 reasoning)
//   - If 0 composites are live → Never Blank fallback (score=30, band=7)
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildApexParams {
  userId: string;
  date: string; // YYYY-MM-DD patient-local
  composite_records: ReadonlyArray<CompositeStateRecord>;
  /**
   * Optional explicit weight map. If provided, used directly.
   * Mutually exclusive with `ise_state`.
   */
  weights?: Readonly<Record<CompositeName, number>>;
  /**
   * Optional ISE state. If provided (and `weights` is not), weights are looked
   * up via Beacon §16 dynamic weighting. Use this for production patient-state
   * aware apex computation.
   */
  ise_state?: ISEState;
}

export function computeApexRollup(params: BuildApexParams): RRApexRecord {
  // Resolve weights: explicit > ISE-aware lookup > equal baseline
  const weights =
    params.weights ??
    (params.ise_state !== undefined
      ? getCompositeWeightsForISE(params.ise_state)
      : COMPOSITE_APEX_WEIGHTS_DEFAULT);

  const live_composites = params.composite_records.filter(
    (c) => c.state === 'live' && c.score_0_100 !== null
  );

  // ❗ Edge: no live composites yet — Never Blank fallback
  if (live_composites.length === 0) {
    const fallback = neverBlankFallback();
    return {
      id: `${params.userId}_${params.date}`,
      userId: params.userId,
      date: params.date,
      apex_score_0_100: fallback.score,
      apex_band: fallback.band,
      confidence: fallback.confidence,
      composite_scores_at_rollup: {},
      composite_states_at_rollup: snapshotStates(params.composite_records),
      rollup_completed_at: new Date().toISOString()
    };
  }

  // Sum weights across live composites only
  const live_weight_total = live_composites.reduce(
    (sum, c) => sum + (weights[c.compositeName] ?? 0),
    0
  );

  if (live_weight_total <= 0) {
    // Defensive: weights all zero for live set — fallback
    const fallback = neverBlankFallback();
    return {
      id: `${params.userId}_${params.date}`,
      userId: params.userId,
      date: params.date,
      apex_score_0_100: fallback.score,
      apex_band: fallback.band,
      confidence: fallback.confidence,
      composite_scores_at_rollup: snapshotScores(live_composites),
      composite_states_at_rollup: snapshotStates(params.composite_records),
      rollup_completed_at: new Date().toISOString()
    };
  }

  // Weighted average over LIVE composites, weights re-normalized
  let weighted_score = 0;
  for (const c of live_composites) {
    const w = weights[c.compositeName] ?? 0;
    const normalized_w = w / live_weight_total;
    weighted_score += normalized_w * (c.score_0_100 ?? 0);
  }

  // Confidence: drops one tier per accruing composite (out of 8 total)
  const accruing_count = params.composite_records.filter(
    (c) => c.state === 'accruing'
  ).length;

  const calibration = calibrateToBeaconWithConfidence(
    { value: weighted_score, inputType: 'Bounded_0_100' },
    accruing_count
  );

  return {
    id: `${params.userId}_${params.date}`,
    userId: params.userId,
    date: params.date,
    apex_score_0_100: calibration.score,
    apex_band: calibration.band,
    confidence: calibration.confidence,
    composite_scores_at_rollup: snapshotScores(live_composites),
    composite_states_at_rollup: snapshotStates(params.composite_records),
    rollup_completed_at: new Date().toISOString()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function snapshotScores(
  records: ReadonlyArray<CompositeStateRecord>
): Partial<Record<CompositeName, number>> {
  const out: Partial<Record<CompositeName, number>> = {};
  for (const r of records) {
    if (r.score_0_100 !== null) {
      out[r.compositeName] = r.score_0_100;
    }
  }
  return out;
}

function snapshotStates(
  records: ReadonlyArray<CompositeStateRecord>
): Partial<Record<CompositeName, CompositeState>> {
  const out: Partial<Record<CompositeName, CompositeState>> = {};
  for (const r of records) {
    out[r.compositeName] = r.state;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULING HINT
// 
// Per G2 §3 + APEX_ROLLUP_LOCAL_TIME constant:
//   Cron expression: '0 3 * * *' interpreted in patient's local timezone.
//   Each user's apex rolls up at their local 03:00.
// 
// Implementation note: this scheduling lives in the deployment layer
// (Azure Functions / Durable Functions / Cron). This module exports the time
// constant and the pure compute function.
// ─────────────────────────────────────────────────────────────────────────────
