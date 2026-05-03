/**
 * BAND LOOKUP — Beacon 7-Band Lookup Table
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §4 (band definitions — DO NOT MODIFY)
 *   - Beacon Calibration Algorithm v1.0 §5 (band lookup pseudocode)
 * 
 * Pure deterministic function. Same input → same output. No side effects.
 */

import type { BandDefinition, CalibrationOutput } from '../types/beacon.js';
import type { BeaconBand, BeaconColor } from '../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// BAND DEFINITIONS (Beacon Canon v1.1 §4 — LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const BAND_DEFINITIONS: ReadonlyArray<BandDefinition> = [
  {
    band: 1,
    rangeMin: 95,
    rangeMax: 100,
    color: 'strong_green',
    name: 'Strong Green',
    clinicalMeaning: 'Top-tier health metric. Protect this corridor. Rare and valuable.'
  },
  {
    band: 2,
    rangeMin: 85,
    rangeMax: 94,
    color: 'med_green',
    name: 'Med Green',
    clinicalMeaning: 'Genuinely above the curve. System reinforces positive patterns.'
  },
  {
    band: 3,
    rangeMin: 80,
    rangeMax: 84,
    color: 'faint_green',
    name: 'Faint Green',
    clinicalMeaning:
      'Good but showing early softening OR entering from above. Pre-signal zone.'
  },
  {
    band: 4,
    rangeMin: 70,
    rangeMax: 79,
    color: 'light_orange',
    name: 'Light Orange',
    clinicalMeaning:
      'Average to slightly above. Room to grow. Where most users live early in journey.'
  },
  {
    band: 5,
    rangeMin: 65,
    rangeMax: 69,
    color: 'med_orange',
    name: 'Med Orange',
    clinicalMeaning:
      'Below average. Needs focused attention. Behavioral or physiological drift detected.'
  },
  {
    band: 6,
    rangeMin: 60,
    rangeMax: 64,
    color: 'dark_orange',
    name: 'Dark Orange',
    clinicalMeaning:
      'Significantly below average. Active intervention recommended. Provider may be involved.'
  },
  {
    band: 7,
    rangeMin: 0,
    rangeMax: 59,
    color: 'red',
    name: 'Red',
    clinicalMeaning: 'Critical zone. Provider engagement. Restricted protocols may apply.'
  }
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// BAND LOOKUP — pure function
// Beacon Calibration Algorithm v1.0 §5
// 
// Boundaries are inclusive on the lower bound (e.g. 70 → Band 4, 80 → Band 3).
// ─────────────────────────────────────────────────────────────────────────────

export function lookupBand(score_0_100: number): {
  band: BeaconBand;
  bandName: string;
  color: BeaconColor;
} {
  // Clamp defensively
  const score = Math.max(0, Math.min(100, score_0_100));

  if (score >= 95) return { band: 1, bandName: 'Strong Green', color: 'strong_green' };
  if (score >= 85) return { band: 2, bandName: 'Med Green', color: 'med_green' };
  if (score >= 80) return { band: 3, bandName: 'Faint Green', color: 'faint_green' };
  if (score >= 70) return { band: 4, bandName: 'Light Orange', color: 'light_orange' };
  if (score >= 65) return { band: 5, bandName: 'Med Orange', color: 'med_orange' };
  if (score >= 60) return { band: 6, bandName: 'Dark Orange', color: 'dark_orange' };
  return { band: 7, bandName: 'Red', color: 'red' };
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL CALIBRATION OUTPUT — convenience wrapper
// ─────────────────────────────────────────────────────────────────────────────

export function buildCalibrationOutput(score_0_100: number): CalibrationOutput {
  const score = Math.max(0, Math.min(100, score_0_100));
  const { band, bandName, color } = lookupBand(score);
  return { score, band, bandName, color };
}
