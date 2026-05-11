/**
 * BariAccess Lite — Libre Glucose Normalizer
 *
 * Source: DECISIONS.md §5 Libre via Spike
 *         + Pass 3 §SMA GlucoseStability ranges (Hall 2018)
 *
 * Reads raw glucose readings (Libre via Spike) for a user/date,
 * builds the canonical overnight series anchored to V1 sleep timestamps,
 * computes CV%, flags gaps.
 *
 * Overnight window per Pass 3 §SMA semantics:
 *   start = bedtime + 30 min
 *   end   = wake_time − 30 min
 * (avoid sleep-onset/wake-up perturbation; capture steady-state nocturnal CV)
 */

import type {
  GlucoseReading,
  OvernightGlucoseSeries,
  ProvenanceFlag,
  SleepNight,
} from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────────────────────

/** Minimum gap (minutes) that flags the night as 🟡. Per DECISIONS.md §5. */
const MAX_GAP_MINUTES = 30;
/** Anchor offsets from bedtime/wake (minutes). */
const BEDTIME_ANCHOR_OFFSET_MIN = 30;
const WAKETIME_ANCHOR_OFFSET_MIN = -30;
/** Minimum readings required to compute CV (don't trust CV from 5 points). */
const MIN_READINGS_FOR_CV = 30;

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface BuildOvernightInput {
  user_id: string;
  date: string;                     // YYYY-MM-DD (the night ENDING this date)
  sleep: SleepNight;                // V1 sleep anchor
  /** All glucose readings within the candidate overnight window, oldest first. */
  raw_readings: Array<{
    timestamp: string;
    value_mgdl: number;
    source: string;
  }>;
}

/**
 * Build the canonical OvernightGlucoseSeries for a single night.
 * Returns null if sleep timestamps invalid or no readings in window.
 */
export function buildOvernightSeries(
  input: BuildOvernightInput
): OvernightGlucoseSeries | null {
  const { user_id, date, sleep, raw_readings } = input;

  const bedtime = parseISO(sleep.bedtime);
  const wake = parseISO(sleep.wake_time);
  if (!bedtime || !wake || wake.getTime() <= bedtime.getTime()) {
    return null;
  }

  const window_start = new Date(bedtime.getTime() + BEDTIME_ANCHOR_OFFSET_MIN * 60_000);
  const window_end = new Date(wake.getTime() + WAKETIME_ANCHOR_OFFSET_MIN * 60_000);

  if (window_end.getTime() <= window_start.getTime()) {
    return null;
  }

  // Filter readings to window, sort oldest first.
  const inWindow: GlucoseReading[] = raw_readings
    .filter((r) => {
      const t = parseISO(r.timestamp);
      return t && t.getTime() >= window_start.getTime() && t.getTime() <= window_end.getTime();
    })
    .map((r) => ({
      timestamp: r.timestamp,
      value_mgdl: r.value_mgdl,
      source: r.source,
      interpolated: false,
    }))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (inWindow.length === 0) {
    return {
      user_id,
      date,
      bedtime: bedtime.toISOString(),
      wake_time: wake.toISOString(),
      window_start: window_start.toISOString(),
      window_end: window_end.toISOString(),
      readings: [],
      cv_percent: null,
      has_gaps: true,
      provenance: 'UNKNOWN_METHOD',
    };
  }

  const has_gaps = detectGaps(inWindow, MAX_GAP_MINUTES);

  // CV requires σ; need at least 2 readings, but stricter threshold for clinical trust.
  let cv_percent: number | null = null;
  if (inWindow.length >= MIN_READINGS_FOR_CV) {
    cv_percent = computeCV(inWindow.map((r) => r.value_mgdl));
  }

  const provenance: ProvenanceFlag =
    has_gaps || inWindow.length < MIN_READINGS_FOR_CV
      ? 'PENDING_VALIDATION'
      : 'VALIDATED';

  return {
    user_id,
    date,
    bedtime: bedtime.toISOString(),
    wake_time: wake.toISOString(),
    window_start: window_start.toISOString(),
    window_end: window_end.toISOString(),
    readings: inWindow,
    cv_percent,
    has_gaps,
    provenance,
  };
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────

function parseISO(s: string): Date | null {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function detectGaps(readings: GlucoseReading[], maxGapMin: number): boolean {
  if (readings.length < 2) return true;
  const maxGapMs = maxGapMin * 60_000;
  for (let i = 1; i < readings.length; i++) {
    const prev = parseISO(readings[i - 1]!.timestamp)!;
    const curr = parseISO(readings[i]!.timestamp)!;
    if (curr.getTime() - prev.getTime() > maxGapMs) {
      return true;
    }
  }
  return false;
}

/**
 * Coefficient of Variation = (σ / μ) × 100.
 * Per Pass 3 §SMA — Hall 2018 CGM patterns; overnight glycemic variability.
 */
export function computeCV(values: number[]): number | null {
  if (values.length < 2) return null;
  const mu = values.reduce((a, b) => a + b, 0) / values.length;
  if (mu === 0) return null;
  const variance =
    values.reduce((acc, v) => acc + (v - mu) ** 2, 0) / (values.length - 1);
  const sigma = Math.sqrt(variance);
  return (sigma / mu) * 100;
}
