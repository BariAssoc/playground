/**
 * BariAccess — CI-M (ChronoMuscle Index)
 *
 * Source: RR-Calculation-Canon-Pass2_v1_1_LOCKED.md §CI-M
 *
 * Formula:  CI-M = TAF × MRQ × W₇
 *
 *   TAF (Temporal Alignment Factor):
 *     0.40·ChronoAlign + 0.30·PeakWindow + 0.30·ConsistentPhase
 *
 *   MRQ (Muscle Readiness Quality):
 *     0.35·PerformanceCapacity + 0.35·AdaptationQuality + 0.30·RecoveryEfficiency
 *
 *   W₇: applied to the daily CI-M time series (oldest first).
 *
 * All inputs in 0..1 component scale. Output 0..1, multiplied into EPC
 * by Pass 3 §13: EPC = max(CI-M, CI-C) × performance_aggregate.
 */

import {
  CIM_TAF_COMPONENTS,
  CIM_MRQ_COMPONENTS,
} from '@bariaccess-lite/shared';
import { weightedSum } from '../degradation/weight-redistribution.js';
import { applyW7 } from './w7-kernel.js';

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface CIMDailyComponents {
  /** TAF — chronotype-aligned start time vs personal optimum (0..1). */
  chrono_align: number | null;
  /** TAF — fraction of training in peak window (0..1). */
  peak_window: number | null;
  /** TAF — phase consistency over recent days (0..1). */
  consistent_phase: number | null;
  /** MRQ — performance trend vs personal baseline (0..1). */
  performance_capacity: number | null;
  /** MRQ — adaptation indicators: HRV trend, RHR trend (0..1). */
  adaptation_quality: number | null;
  /** MRQ — recovery efficiency: time-to-baseline post-load (0..1). */
  recovery_efficiency: number | null;
}

export interface CIMResult {
  cim: number | null;          // 0..1
  taf: number | null;
  mrq: number | null;
  /** Per-day CI-M before W₇ application (oldest first). */
  daily_series: Array<number | null>;
  days_used: number;
}

/**
 * Compute CI-M from a 7-day series of daily components.
 * `series[0]` is oldest (d-7); `series[6]` is today.
 *
 * Returns cim=null if no day has full TAF + MRQ data.
 */
export function computeCIM(series: CIMDailyComponents[]): CIMResult {
  if (series.length !== 7) {
    throw new Error(`computeCIM: series must be length 7; got ${series.length}`);
  }

  const daily: Array<number | null> = series.map((d) => computeDailyCIM(d));
  const w7 = applyW7(daily);

  // For TAF/MRQ surfacing in result, compute today's values (most recent non-null day).
  let taf: number | null = null;
  let mrq: number | null = null;
  for (let i = 6; i >= 0; i--) {
    const d = series[i]!;
    const t = computeTAF(d);
    const m = computeMRQ(d);
    if (t !== null && m !== null) {
      taf = t;
      mrq = m;
      break;
    }
  }

  return {
    cim: w7.value,
    taf,
    mrq,
    daily_series: daily,
    days_used: w7.days_used,
  };
}

// ────────────────────────────────────────────────────────────
// INTERNAL
// ────────────────────────────────────────────────────────────

function computeTAF(d: CIMDailyComponents): number | null {
  const present = filterPresent({
    chrono_align: d.chrono_align,
    peak_window: d.peak_window,
    consistent_phase: d.consistent_phase,
  });
  if (Object.keys(present).length === 0) return null;

  // For Lite v1 — require all three TAF components present (canon-strict).
  // If any missing, return null and let CI-M fall back to CI-C path.
  if (Object.keys(present).length < 3) return null;
  return weightedSum(present, CIM_TAF_COMPONENTS);
}

function computeMRQ(d: CIMDailyComponents): number | null {
  const present = filterPresent({
    performance_capacity: d.performance_capacity,
    adaptation_quality: d.adaptation_quality,
    recovery_efficiency: d.recovery_efficiency,
  });
  if (Object.keys(present).length < 3) return null;
  return weightedSum(present, CIM_MRQ_COMPONENTS);
}

function computeDailyCIM(d: CIMDailyComponents): number | null {
  const taf = computeTAF(d);
  const mrq = computeMRQ(d);
  if (taf === null || mrq === null) return null;
  return taf * mrq;  // 0..1 × 0..1 = 0..1
}

function filterPresent(obj: Record<string, number | null>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && Number.isFinite(v)) out[k] = v;
  }
  return out;
}
