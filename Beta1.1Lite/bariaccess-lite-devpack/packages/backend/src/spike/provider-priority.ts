/**
 * BariAccess Lite — Provider Priority Resolver
 *
 * Source: DECISIONS.md §10 (priority table, derived from
 *         spike_metrics_coverage_analysis.md empirical observations)
 *
 * When multiple wearables deliver the same metric for the same user/date,
 * pick the canonical primary source. Honest to coverage doc — no provider
 * gets priority for a metric they don't actually deliver.
 */

import type { NormalizedDailyDoc } from './ingest-adapter.js';

// ────────────────────────────────────────────────────────────
// PRIORITY TABLES — per DECISIONS.md §10
// Lower index = higher priority.
// ────────────────────────────────────────────────────────────

const PRIORITY: Record<string, string[]> = {
  // HRV — Oura/Polar/Garmin all deliver hrv_rmssd; Apple delivers hrv_sdnn (different); Withings doesn't.
  hrv_rmssd: ['oura', 'polar', 'garmin'],

  // Sleep stages — Apple gaps Deep + REM per coverage doc.
  sleep_duration_deep: ['oura', 'polar', 'garmin'],
  sleep_duration_rem: ['oura', 'polar', 'garmin'],
  sleep_duration_light: ['oura', 'polar', 'garmin', 'apple_health'],
  sleep_duration_awake: ['oura', 'polar', 'garmin', 'apple_health'],
  sleep_duration: ['oura', 'polar', 'garmin', 'apple_health'],
  sleep_efficiency: ['oura', 'polar', 'garmin'],
  sleep_interruptions: ['oura', 'polar', 'garmin'],
  sleep_latency: ['oura', 'polar', 'garmin'],
  bedtime_duration: ['oura', 'polar', 'garmin'],

  // RHR — Polar coverage doc shows heartrate_resting MISSING, demoted.
  heartrate_resting: ['oura', 'garmin', 'apple_health', 'polar'],

  // Activity — Garmin delivers duration_active + intraday epochs per coverage.
  duration_active: ['garmin', 'oura', 'apple_health'],
  duration_moderate_intensity: ['oura', 'garmin'],
  duration_high_intensity: ['oura', 'garmin'],
  duration_low_intensity: ['oura', 'garmin'],
  steps: ['garmin', 'oura', 'polar', 'apple_health'],
  calories_burned_active: ['garmin', 'oura', 'polar', 'apple_health'],
  calories_burned_basal: ['garmin', 'oura', 'polar'],

  // SpO2 — Polar doesn't deliver.
  spo2: ['garmin', 'oura', 'apple_health'],
  spo2_max: ['garmin'],
  spo2_min: ['garmin'],

  // Body composition — DECISIONS.md §10 (LOCKED 2026-05-09 by founder):
  //   bbs > withings > garmin
  // BBS = Biometric Barista Station (clinical-grade segmental BIA, in-clinic).
  // BBS readings are date-stamped from clinic visits and provide the gold-standard
  // anchor; Withings home scale fills daily; Garmin wrist-based BIA is fallback.
  // BBS data flows in via the same provider_metrics map under provider key 'bbs'.
  weight: ['bbs', 'withings', 'garmin'],
  body_fat: ['bbs', 'withings', 'garmin'],
  body_bone_mass: ['bbs', 'withings', 'garmin'],
  body_mass_index: ['bbs', 'garmin'], // Withings doesn't deliver BMI directly per coverage
  // BBS-only segmental measurements (not delivered by consumer scales)
  body_skeletal_muscle_mass: ['bbs'],
  body_visceral_fat_area: ['bbs'],
  body_segmental_lean_mass: ['bbs'],

  // Glucose — Libre via Spike, sole source.
  glucose: ['libre'],

  // Heart rate (general)
  heartrate: ['oura', 'polar', 'garmin', 'apple_health'],
  heartrate_max: ['oura', 'polar', 'garmin'],
  heartrate_min: ['oura', 'polar', 'garmin'],

  // Breathing
  breathing_rate: ['oura', 'polar', 'garmin'],
  breathing_rate_max: ['oura', 'polar', 'garmin'],
  breathing_rate_min: ['oura', 'polar', 'garmin'],

  // Skin temperature deviation (Oura, Garmin)
  sleep_skin_temperature_deviation: ['oura', 'garmin'],

  // Floors climbed (Garmin)
  floors_climbed: ['garmin'],
};

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface PrimaryPick<T = number> {
  value: T | null;
  source: string | null;
  /** Lower = higher priority. -1 if no source matched. */
  source_priority_rank: number;
}

/**
 * Pick the highest-priority source for a metric from a normalized daily doc.
 *
 * Strategy:
 *   1. If `metric_sources` field tells us who won, trust it.
 *   2. Else, walk the priority list and return the first provider that
 *      actually has a non-null value for this metric in `provider_metrics`.
 *   3. Fall back to top-level `metrics[metric]` if no provider-specific value.
 */
export function pickPrimary(
  metric: string,
  doc: NormalizedDailyDoc
): PrimaryPick {
  const priority = PRIORITY[metric];

  // Path 1: metric_sources tells us who won.
  if (doc.metric_sources?.[metric] !== undefined && doc.metrics[metric] !== undefined) {
    const source = doc.metric_sources[metric]!;
    const rank = priority?.indexOf(source) ?? -1;
    return {
      value: doc.metrics[metric] ?? null,
      source,
      source_priority_rank: rank,
    };
  }

  // Path 2: walk priority list.
  if (priority && doc.provider_metrics) {
    for (let i = 0; i < priority.length; i++) {
      const provider = priority[i]!;
      const providerData = doc.provider_metrics[provider];
      if (providerData && providerData[metric] !== undefined && providerData[metric] !== null) {
        return {
          value: providerData[metric]!,
          source: provider,
          source_priority_rank: i,
        };
      }
    }
  }

  // Path 3: top-level metrics[].
  if (doc.metrics[metric] !== undefined && doc.metrics[metric] !== null) {
    return {
      value: doc.metrics[metric]!,
      source: 'merged',
      source_priority_rank: -1,
    };
  }

  return {
    value: null,
    source: null,
    source_priority_rank: -1,
  };
}

/**
 * Bulk-pick all canon-required metrics in a single pass.
 * Returns a flat record keyed by metric name with value + source provenance.
 */
export function pickPrimaryBulk(
  metrics: string[],
  doc: NormalizedDailyDoc
): Record<string, PrimaryPick> {
  const out: Record<string, PrimaryPick> = {};
  for (const m of metrics) {
    out[m] = pickPrimary(m, doc);
  }
  return out;
}

/**
 * Returns true if the provider is known to deliver the metric per coverage doc.
 */
export function providerHasMetric(provider: string, metric: string): boolean {
  return PRIORITY[metric]?.includes(provider) ?? false;
}
