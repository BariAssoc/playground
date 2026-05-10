/**
 * BariAccess Lite — SRI (Sleep Regularity Index)
 *
 * Source: RR-Calculation-Canon-Pass3_v1_1_LOCKED.md §2 SRI
 *
 * Formula:
 *   SRI = 0.40·BedtimeConsistency + 0.40·WaketimeConsistency + 0.20·DurationConsistency
 *
 * Inputs are 7-day SDs of bedtime, waketime, duration (in minutes).
 * Lower SD = more regular = higher score.
 */

import {
  SRI_COMPONENTS,
  type ScoreResult,
  type SleepNight,
  type ProvenanceFlag,
} from '@bariaccess-lite/shared';
import {
  evaluateBounded,
  SRI_BEDTIME_SD_SPEC,
  SRI_WAKETIME_SD_SPEC,
  SRI_DURATION_SD_SPEC,
} from '../../baseline/bounded.js';
import {
  redistributeWeights,
  weightedSum,
} from '../../degradation/weight-redistribution.js';
import { clampScore } from '../../beacon/piecewise-linear.js';
import { resolveBand } from '../../beacon/band-resolver.js';

export interface SRIInput {
  /** 7 most-recent SleepNights, oldest first. Nulls in slots are tolerated. */
  series: Array<SleepNight | null>;
  provenance: ProvenanceFlag;
  computed_at: string;
}

export function computeSRI(input: SRIInput): ScoreResult {
  const { series, provenance, computed_at } = input;
  const valid = series.filter((s): s is SleepNight => s !== null);
  const breakdown: Record<string, number | null> = {
    bedtime_consistency: null,
    waketime_consistency: null,
    duration_consistency: null,
  };

  if (valid.length < 4) {
    // Pass 3 §SRI — SRI requires at least 4 nights for SD to be meaningful.
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

  // Bedtime SD (minutes from midnight, modular handling for late bedtimes)
  const bedtimes_min = valid.map((s) => clockMinutesNormalized(s.bedtime));
  if (bedtimes_min.every((m) => Number.isFinite(m))) {
    const sd = stdDev(bedtimes_min);
    breakdown.bedtime_consistency = evaluateBounded(sd, SRI_BEDTIME_SD_SPEC).score;
  }

  // Waketime SD
  const waketimes_min = valid.map((s) => clockMinutesNormalized(s.wake_time));
  if (waketimes_min.every((m) => Number.isFinite(m))) {
    const sd = stdDev(waketimes_min);
    breakdown.waketime_consistency = evaluateBounded(sd, SRI_WAKETIME_SD_SPEC).score;
  }

  // Duration SD (minutes)
  const durations_min = valid.map((s) => s.total_sleep_ms / 60_000);
  if (durations_min.every((m) => Number.isFinite(m))) {
    const sd = stdDev(durations_min);
    breakdown.duration_consistency = evaluateBounded(sd, SRI_DURATION_SD_SPEC).score;
  }

  const present_keys = Object.keys(SRI_COMPONENTS).filter(
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
      computed_at,
    };
  }

  const r = redistributeWeights(present_keys, SRI_COMPONENTS);
  const present_values: Record<string, number> = {};
  for (const k of present_keys) present_values[k] = breakdown[k]!;
  const component_score = weightedSum(present_values, r.weights);
  const score_0_100 = clampScore(component_score * 100);

  return {
    value: score_0_100,
    band: resolveBand(score_0_100),
    degradation: r.redistributed ? 'PARTIAL' : 'FULL',
    provenance,
    breakdown,
    weights_used: r.weights,
    computed_at,
  };
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────

/** Convert ISO timestamp to minutes-since-midnight, handling cross-midnight clusters. */
function clockMinutesNormalized(iso: string): number {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return NaN;
  return d.getHours() * 60 + d.getMinutes();
}

function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const variance = xs.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}
