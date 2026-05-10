/**
 * BariAccess Lite — Path A: Z-Score Normalization
 *
 * Source: Beacon_Canon_v1_1.md §7 Normalization Pipeline
 *         CCO-V1V4-REFFRAME-001_v1_0.md §4 Personal Baseline Layer
 *
 * Pipeline (physiological metrics):
 *   Stage 1 (HRV only): x' = ln(x_raw)         — log-normal distribution
 *   Stage 2:            Z = (x − μ) / σ        — personal baseline
 *   Stage 2 inverse:    Z' = -Z                — for inverse metrics (positive = better)
 *   Stage 3:            handed off to beacon/piecewise-linear.ts
 */

import type { PersonalBaseline } from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// METRIC DIRECTIONALITY — per Beacon §7.3 Inversion Rule
// "POSITIVE = BETTER HEALTH" is the convention. Metrics where higher = worse
// must be inverted at Z-score time so positive Z always = better.
// ────────────────────────────────────────────────────────────
const INVERSE_METRICS = new Set<string>([
  'heartrate_resting',           // higher RHR = worse
  'sleep_latency',                // longer onset = worse
  'sleep_duration_awake',         // more awake time = worse
  'sleep_interruptions',          // more = worse
  'sleep_skin_temperature_deviation', // |dev| larger = worse (handled separately)
]);

// HRV is log-normally distributed per Task Force ESC 1996 (Beacon §7.1 Stage 1).
const LOG_TRANSFORMED_METRICS = new Set<string>([
  'hrv_rmssd',
  'hrv_sdnn',
]);

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface ZScoreInput {
  metric: string;
  value: number;
  baseline: PersonalBaseline;
}

export interface ZScoreResult {
  /** Final Z used downstream — already inverted if applicable. */
  z: number | null;
  /** Raw Z (before inversion) — for debug. */
  z_raw: number | null;
  /** True if metric was log-transformed. */
  log_transformed: boolean;
  /** True if metric was inverted. */
  inverted: boolean;
  /** True if baseline immature (< 28 days) — score still computed but flagged. */
  baseline_pending: boolean;
  /** Null if baseline cannot compute (no readings or σ === 0). */
  computable: boolean;
}

/**
 * Compute Z-score against personal baseline.
 *
 * Returns z=null if:
 *   - baseline.mean is null (insufficient days)
 *   - baseline.stddev is null OR 0 (no variance — can happen day 1-2)
 *   - value is non-finite
 */
export function zScore(input: ZScoreInput): ZScoreResult {
  const { metric, value, baseline } = input;

  if (!Number.isFinite(value)) {
    return {
      z: null,
      z_raw: null,
      log_transformed: false,
      inverted: false,
      baseline_pending: false,
      computable: false,
    };
  }

  if (
    baseline.mean === null ||
    baseline.stddev === null ||
    baseline.stddev === 0
  ) {
    return {
      z: null,
      z_raw: null,
      log_transformed: false,
      inverted: false,
      baseline_pending: baseline.mean === null,
      computable: false,
    };
  }

  const log_transformed = LOG_TRANSFORMED_METRICS.has(metric);
  const inverted = INVERSE_METRICS.has(metric);

  // Stage 1: log transform if applicable
  let x = value;
  let mu = baseline.mean;
  let sigma = baseline.stddev;
  if (log_transformed) {
    if (value <= 0) {
      // Log-transform requires positive values. Flag uncomputable.
      return {
        z: null,
        z_raw: null,
        log_transformed: true,
        inverted,
        baseline_pending: false,
        computable: false,
      };
    }
    x = Math.log(value);
    // NOTE: This requires baseline μ, σ to ALSO be in log space.
    // Caller is responsible for storing log-space baselines for HRV.
    // See personal-baseline.ts integration: HRV readings should be ln(raw)
    // BEFORE being passed into computePersonalBaseline. We document this
    // contract here and enforce in the orchestration layer.
  }

  const z_raw = (x - mu) / sigma;
  const z = inverted ? -z_raw : z_raw;

  const baseline_pending = baseline.provenance !== 'VALIDATED';

  return {
    z,
    z_raw,
    log_transformed,
    inverted,
    baseline_pending,
    computable: true,
  };
}

/**
 * Convenience: pre-process HRV value into log space before baseline ingest.
 * Per Beacon §7.1 Stage 1.
 */
export function preprocessForBaseline(metric: string, value: number): number {
  if (LOG_TRANSFORMED_METRICS.has(metric) && value > 0) {
    return Math.log(value);
  }
  return value;
}

export function isInverseMetric(metric: string): boolean {
  return INVERSE_METRICS.has(metric);
}

export function isLogTransformedMetric(metric: string): boolean {
  return LOG_TRANSFORMED_METRICS.has(metric);
}
