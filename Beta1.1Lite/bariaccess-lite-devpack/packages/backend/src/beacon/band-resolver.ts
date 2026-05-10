/**
 * BariAccess — Beacon Band Resolver
 *
 * Source: Beacon_Canon_v1_1.md §4 Color Bands
 *         + RR-Calculation-Canon-Pass1_v1_1_LOCKED.md §R&R Cascade Rim Rule
 *
 * Two responsibilities:
 *   1. score (0-100) → BeaconBand (1-7)
 *   2. cascade rim — if any sub-score is in band 4-7, parent tile shows orange rim
 *      even if the parent score itself is in green
 */

import {
  BeaconBand,
  BEACON_BANDS,
  type BandDefinition,
} from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// SCORE → BAND
// ────────────────────────────────────────────────────────────

/**
 * Resolve a 0-100 score to its Beacon band.
 * Throws if score outside [0, 100].
 */
export function resolveBand(score: number): BeaconBand {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error(`resolveBand: score must be 0-100; got ${score}`);
  }

  // Iterate in band order; first matching range wins.
  for (const def of BEACON_BANDS) {
    if (score >= def.min && score <= def.max) {
      return def.band;
    }
  }

  // Should not be reachable given BEACON_BANDS is exhaustive over [0, 100].
  // Defensive fallback to RED.
  return BeaconBand.RED;
}

/**
 * Get full band definition (name, color token, family, etc.) for a score.
 */
export function bandDefinition(score: number): BandDefinition {
  const b = resolveBand(score);
  const def = BEACON_BANDS.find((d) => d.band === b);
  if (!def) {
    throw new Error(`bandDefinition: no definition for band ${b}`);
  }
  return def;
}

/**
 * True if the band is in the orange family (4-6).
 */
export function isOrangeBand(band: BeaconBand): boolean {
  return band >= BeaconBand.LIGHT_ORANGE && band <= BeaconBand.DARK_ORANGE;
}

/**
 * True if the band is the red band (7).
 */
export function isRedBand(band: BeaconBand): boolean {
  return band === BeaconBand.RED;
}

/**
 * True if the band is in the green family (1-3).
 */
export function isGreenBand(band: BeaconBand): boolean {
  return band <= BeaconBand.FAINT_GREEN;
}

// ────────────────────────────────────────────────────────────
// CASCADE RIM RULE
// Per Pass 1 §R&R Spec 3:
// "If ANY composite in Band 4-7, R&R tile shows orange rim
//  (even if R&R score is green)"
// We generalize this: if any CHILD band is 4-7, parent tile
// shows cascade rim. Used at composite (sub-scores → composite)
// and at R&R_Lite (composites → R&R_Lite) levels.
// ────────────────────────────────────────────────────────────

/**
 * Returns true if cascade rim is active for a parent given child bands.
 *
 * @param childBands array of bands from child scores. Nulls (INSUFFICIENT children)
 *                   are skipped — they do not trigger cascade rim by themselves
 *                   (the degradation state on the parent surfaces that visually).
 */
export function cascadeRimActive(
  childBands: Array<BeaconBand | null>
): boolean {
  return childBands.some((b) => b !== null && b >= BeaconBand.LIGHT_ORANGE);
}
