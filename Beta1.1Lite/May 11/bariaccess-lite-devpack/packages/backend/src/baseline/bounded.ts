/**
 * BariAccess Lite — Path B: Bounded Scoring
 *
 * Source: Beacon_Canon_v1_1.md §6.5 + §7.2 + §8 Normalization Paths
 *
 * Behavioral / contextual metrics that are already in meaningful 0–1 ranges
 * (mood scales, FAB completion %, categorical states) skip Stage 2 (Z-score)
 * and Stage 3 (piecewise mapping). They map DIRECTLY to 0–100.
 *
 * Pass 3 sub-score components (Wave 1A/1B/1E/3-Bio) provide their own
 * piecewise band ranges (Optimal / Good / Moderate / Poor / Insufficient).
 * This module implements the canonical linear-interpolation evaluator
 * those ranges expect.
 */

// ────────────────────────────────────────────────────────────
// COMPONENT BAND DEFINITION
// Per Pass 3 §X.Spec 2 Component Ranges (Wave-locked).
// ────────────────────────────────────────────────────────────

export interface BoundedBand {
  /** 'optimal' | 'good' | 'moderate' | 'poor' | 'insufficient' */
  label: 'optimal' | 'good' | 'moderate' | 'poor' | 'insufficient';
  /** Score assigned to this band's centroid (0–1 scale internally; mapped 0–100 outside). */
  score: number;
  /** Inclusive lower bound (raw input units — minutes, %, count, etc.). */
  min?: number;
  /** Inclusive upper bound. */
  max?: number;
}

export interface BoundedRangeSpec {
  /**
   * Direction. If 'higher_is_better', a value above all bands floors to optimal.
   * If 'lower_is_better', a value below all bands floors to optimal.
   * If 'sweet_spot', optimal range is bounded both sides; deviation in either direction degrades.
   */
  direction: 'higher_is_better' | 'lower_is_better' | 'sweet_spot';
  /** Bands ordered by quality: optimal first, insufficient last. */
  bands: BoundedBand[];
  /** Linear interpolation between band centroids? Default true per Pass 3 §SQI Latency_inv. */
  interpolate?: boolean;
}

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface EvaluateBoundedResult {
  /** 0.0–1.0 component score. */
  score: number;
  /** Which band the value fell into. */
  band_label: BoundedBand['label'];
  /** True if value floored to optimal (above/below all bands). */
  saturated: boolean;
  /** True if linear interpolation produced the score. */
  interpolated: boolean;
}

/**
 * Evaluate a raw value against a Pass 3 component range spec.
 * Returns 0–1 score for use in sub-score weighted sums.
 */
export function evaluateBounded(
  value: number,
  spec: BoundedRangeSpec
): EvaluateBoundedResult {
  if (!Number.isFinite(value)) {
    return {
      score: 0,
      band_label: 'insufficient',
      saturated: false,
      interpolated: false,
    };
  }

  const interpolate = spec.interpolate !== false;

  // Find the band the value falls into.
  for (let i = 0; i < spec.bands.length; i++) {
    const band = spec.bands[i]!;
    const inBand = inRange(value, band, spec.direction);
    if (inBand) {
      // For interpolation, find adjacent band on the worse side.
      if (interpolate && i + 1 < spec.bands.length) {
        const next = spec.bands[i + 1]!;
        const interp = linearInterpolate(value, band, next, spec.direction);
        return {
          score: clamp01(interp),
          band_label: band.label,
          saturated: false,
          interpolated: true,
        };
      }
      return {
        score: clamp01(band.score),
        band_label: band.label,
        saturated: false,
        interpolated: false,
      };
    }
  }

  // Outside all bands — floor to insufficient.
  return {
    score: 0,
    band_label: 'insufficient',
    saturated: true,
    interpolated: false,
  };
}

// ────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ────────────────────────────────────────────────────────────

function inRange(
  value: number,
  band: BoundedBand,
  direction: BoundedRangeSpec['direction']
): boolean {
  const minOk = band.min === undefined || value >= band.min;
  const maxOk = band.max === undefined || value <= band.max;
  return minOk && maxOk;
}

function linearInterpolate(
  value: number,
  upper: BoundedBand,
  lower: BoundedBand,
  direction: BoundedRangeSpec['direction']
): number {
  // Default behavior: position within the band proportional to distance from band center.
  // Pass 3 §SQI Latency_inv specifies "Linear interpolation between bounds."
  // We implement: interpolate between this band's score and the worse band's score,
  // proportional to position within the current band.
  if (upper.min !== undefined && upper.max !== undefined) {
    const center = (upper.min + upper.max) / 2;
    const halfWidth = (upper.max - upper.min) / 2;
    const distFromCenter = Math.abs(value - center);
    const t = halfWidth === 0 ? 0 : distFromCenter / halfWidth; // 0..1
    return upper.score - t * (upper.score - lower.score);
  }
  return upper.score;
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

// ────────────────────────────────────────────────────────────
// COMMON SPECS — exposed for sub-score scorers to import
// Each is a literal transcription of Pass 3 component ranges.
// Keeping these here (not inline in scorers) makes them auditable.
// ────────────────────────────────────────────────────────────

/** SQI Efficiency: target ≥85% (Pass 3 §1) */
export const SQI_EFFICIENCY_SPEC: BoundedRangeSpec = {
  direction: 'higher_is_better',
  bands: [
    { label: 'optimal', score: 1.0, min: 0.85, max: 0.95 },
    { label: 'good', score: 0.8, min: 0.80, max: 0.85 },
    { label: 'moderate', score: 0.5, min: 0.75, max: 0.80 },
    { label: 'poor', score: 0.2, min: 0.70, max: 0.75 },
    { label: 'insufficient', score: 0.0, max: 0.70 },
  ],
  interpolate: true,
};

/** SQI DeepSleep%: 15–25% sweet spot */
export const SQI_DEEP_PCT_SPEC: BoundedRangeSpec = {
  direction: 'sweet_spot',
  bands: [
    { label: 'optimal', score: 1.0, min: 0.15, max: 0.25 },
    { label: 'good', score: 0.8, min: 0.12, max: 0.15 },
    { label: 'moderate', score: 0.5, min: 0.10, max: 0.12 },
    { label: 'poor', score: 0.2, min: 0.08, max: 0.30 },
    { label: 'insufficient', score: 0.0 },
  ],
};

/** SQI Continuity: <3 awakenings/night optimal */
export const SQI_CONTINUITY_SPEC: BoundedRangeSpec = {
  direction: 'lower_is_better',
  bands: [
    { label: 'optimal', score: 1.0, max: 3 },
    { label: 'good', score: 0.8, min: 3, max: 5 },
    { label: 'moderate', score: 0.5, min: 5, max: 8 },
    { label: 'poor', score: 0.2, min: 8, max: 10 },
    { label: 'insufficient', score: 0.0, min: 10 },
  ],
};

/** SQI Latency_inv: 10–20 min optimal sweet spot */
export const SQI_LATENCY_SPEC: BoundedRangeSpec = {
  direction: 'sweet_spot',
  bands: [
    { label: 'optimal', score: 1.0, min: 10, max: 20 },
    { label: 'good', score: 0.8, min: 5, max: 30 },
    { label: 'moderate', score: 0.5, min: 30, max: 45 },
    { label: 'poor', score: 0.2, min: 45, max: 60 },
    { label: 'insufficient', score: 0.0 },
  ],
};

// SRI components — SD of bedtimes / waketimes / durations
export const SRI_BEDTIME_SD_SPEC: BoundedRangeSpec = {
  direction: 'lower_is_better',
  bands: [
    { label: 'optimal', score: 1.0, max: 30 },
    { label: 'good', score: 0.8, min: 30, max: 45 },
    { label: 'moderate', score: 0.5, min: 45, max: 60 },
    { label: 'poor', score: 0.2, min: 60, max: 90 },
    { label: 'insufficient', score: 0.0, min: 90 },
  ],
};
export const SRI_WAKETIME_SD_SPEC = SRI_BEDTIME_SD_SPEC;
export const SRI_DURATION_SD_SPEC: BoundedRangeSpec = {
  direction: 'lower_is_better',
  bands: [
    { label: 'optimal', score: 1.0, max: 30 },
    { label: 'good', score: 0.8, min: 30, max: 60 },
    { label: 'moderate', score: 0.5, min: 60, max: 90 },
    { label: 'poor', score: 0.2, min: 90, max: 120 },
    { label: 'insufficient', score: 0.0, min: 120 },
  ],
};

// SMA EatingWindow — 8–12 hours sweet spot (Pass 3 §SMA)
export const SMA_EATING_WINDOW_SPEC: BoundedRangeSpec = {
  direction: 'sweet_spot',
  bands: [
    { label: 'optimal', score: 1.0, min: 8, max: 12 },
    { label: 'good', score: 0.8, min: 6, max: 14 },
    { label: 'moderate', score: 0.5, min: 12, max: 16 },
    { label: 'poor', score: 0.2, min: 16, max: 18 },
    { label: 'insufficient', score: 0.0 },
  ],
};

// SMA LastMealGap — 2–4 hr optimal
export const SMA_LAST_MEAL_GAP_SPEC: BoundedRangeSpec = {
  direction: 'sweet_spot',
  bands: [
    { label: 'optimal', score: 1.0, min: 2, max: 4 },
    { label: 'good', score: 0.8, min: 1.5, max: 5 },
    { label: 'moderate', score: 0.5, min: 1, max: 6 },
    { label: 'poor', score: 0.2, min: 0, max: 6 },
    { label: 'insufficient', score: 0.0 },
  ],
};

// SMA GlucoseStability — overnight CV (Pass 3 §SMA, Hall 2018)
export const SMA_GLUCOSE_CV_SPEC: BoundedRangeSpec = {
  direction: 'lower_is_better',
  bands: [
    { label: 'optimal', score: 1.0, max: 15 },
    { label: 'good', score: 0.8, min: 15, max: 20 },
    { label: 'moderate', score: 0.5, min: 20, max: 25 },
    { label: 'poor', score: 0.2, min: 25, max: 30 },
    { label: 'insufficient', score: 0.0, min: 30 },
  ],
};
