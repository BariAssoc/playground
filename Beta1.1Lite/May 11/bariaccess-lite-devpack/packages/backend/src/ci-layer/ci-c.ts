/**
 * BariAccess — CI-C (RhythmRun Index)
 *
 * Source: RR-Calculation-Canon-Pass2_v1_1_LOCKED.md §CI-C
 *
 * Formula:  CI-C = TAF × CRQ × W₇
 *
 *   TAF (Temporal Alignment Factor — cardio):
 *     0.40·TempPhaseAlign + 0.30·AwakeningWindow + 0.30·CVReadinessSync
 *
 *   CRQ (Cardiovascular Readiness Quality):
 *     0.40·AerobicCapacity + 0.30·CVEfficiency + 0.30·AdaptationMarkers
 *
 *   W₇: applied to the daily CI-C time series (oldest first).
 */

import {
  CIC_TAF_COMPONENTS,
  CIC_CRQ_COMPONENTS,
} from '@bariaccess-lite/shared';
import { weightedSum } from '../degradation/weight-redistribution.js';
import { applyW7 } from './w7-kernel.js';

export interface CICDailyComponents {
  /** Body temperature phase alignment with circadian baseline (0..1). */
  temp_phase_align: number | null;
  /** Workout start aligned with awakening window (0..1). */
  awakening_window: number | null;
  /** HRV/RHR readiness sync with planned cardio load (0..1). */
  cv_readiness_sync: number | null;
  /** Aerobic capacity vs personal baseline (0..1). */
  aerobic_capacity: number | null;
  /** CV efficiency: HR recovery, HR variability under load (0..1). */
  cv_efficiency: number | null;
  /** Adaptation markers: VO2max trend, sub-max HR (0..1). */
  adaptation_markers: number | null;
}

export interface CICResult {
  cic: number | null;
  taf: number | null;
  crq: number | null;
  daily_series: Array<number | null>;
  days_used: number;
}

export function computeCIC(series: CICDailyComponents[]): CICResult {
  if (series.length !== 7) {
    throw new Error(`computeCIC: series must be length 7; got ${series.length}`);
  }

  const daily: Array<number | null> = series.map((d) => computeDailyCIC(d));
  const w7 = applyW7(daily);

  let taf: number | null = null;
  let crq: number | null = null;
  for (let i = 6; i >= 0; i--) {
    const d = series[i]!;
    const t = computeCICTAF(d);
    const r = computeCRQ(d);
    if (t !== null && r !== null) {
      taf = t;
      crq = r;
      break;
    }
  }

  return {
    cic: w7.value,
    taf,
    crq,
    daily_series: daily,
    days_used: w7.days_used,
  };
}

function computeCICTAF(d: CICDailyComponents): number | null {
  const present = filterPresent({
    temp_phase_align: d.temp_phase_align,
    awakening_window: d.awakening_window,
    cv_readiness_sync: d.cv_readiness_sync,
  });
  if (Object.keys(present).length < 3) return null;
  return weightedSum(present, CIC_TAF_COMPONENTS);
}

function computeCRQ(d: CICDailyComponents): number | null {
  const present = filterPresent({
    aerobic_capacity: d.aerobic_capacity,
    cv_efficiency: d.cv_efficiency,
    adaptation_markers: d.adaptation_markers,
  });
  if (Object.keys(present).length < 3) return null;
  return weightedSum(present, CIC_CRQ_COMPONENTS);
}

function computeDailyCIC(d: CICDailyComponents): number | null {
  const taf = computeCICTAF(d);
  const crq = computeCRQ(d);
  if (taf === null || crq === null) return null;
  return taf * crq;
}

function filterPresent(obj: Record<string, number | null>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && Number.isFinite(v)) out[k] = v;
  }
  return out;
}
