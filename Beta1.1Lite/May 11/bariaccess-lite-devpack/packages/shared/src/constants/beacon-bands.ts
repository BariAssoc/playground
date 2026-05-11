/**
 * Beacon 7-Band Architecture — locked breakpoints
 *
 * Source: Beacon_Canon_v1_1.md §4 Color Bands + §6.2 Piecewise Linear Mapping
 * Status: ✅ LOCKED — Available for Phase 1b use; biostatistical validation in Phase 2
 *         may refine specific breakpoint NUMBERS. Architecture (piecewise linear,
 *         7 segments, asymmetric) is permanent.
 */

import { BeaconBand } from '../enums/index.js';

export interface BandDefinition {
  band: BeaconBand;
  /** Inclusive lower bound (0–100). */
  min: number;
  /** Inclusive upper bound (0–100). */
  max: number;
  /** UI label per Beacon §4. */
  name: string;
  /** Hex / token name; FE chooses palette. */
  color_token: string;
  /** Band 1–3 = Green family, 4–6 = Orange family, 7 = Red. */
  family: 'green' | 'orange' | 'red';
  /** Population approx per Beacon §4. */
  population_approx: string;
  /** Clinical interpretation per Beacon §4. */
  clinical_meaning: string;
}

export const BEACON_BANDS: BandDefinition[] = [
  {
    band: BeaconBand.STRONG_GREEN,
    min: 95,
    max: 100,
    name: 'Strong Green',
    color_token: 'beacon.green.strong',
    family: 'green',
    population_approx: '~7%',
    clinical_meaning:
      'Top-tier health metric. Protect this corridor. Rare and valuable.',
  },
  {
    band: BeaconBand.MED_GREEN,
    min: 85,
    max: 94,
    name: 'Med Green',
    color_token: 'beacon.green.med',
    family: 'green',
    population_approx: '~17%',
    clinical_meaning:
      'Genuinely above the curve. System reinforces positive patterns.',
  },
  {
    band: BeaconBand.FAINT_GREEN,
    min: 80,
    max: 84,
    name: 'Faint Green',
    color_token: 'beacon.green.faint',
    family: 'green',
    population_approx: '~14%',
    clinical_meaning:
      'Good but showing early softening OR entering from above. Pre-signal zone.',
  },
  {
    band: BeaconBand.LIGHT_ORANGE,
    min: 70,
    max: 79,
    name: 'Light Orange',
    color_token: 'beacon.orange.light',
    family: 'orange',
    population_approx: '~24%',
    clinical_meaning:
      'Average to slightly above. Room to grow. Most users live here early in their journey.',
  },
  {
    band: BeaconBand.MED_ORANGE,
    min: 65,
    max: 69,
    name: 'Med Orange',
    color_token: 'beacon.orange.med',
    family: 'orange',
    population_approx: '~11%',
    clinical_meaning:
      'Below average. Needs focused attention. Behavioral or physiological drift detected.',
  },
  {
    band: BeaconBand.DARK_ORANGE,
    min: 60,
    max: 64,
    name: 'Dark Orange',
    color_token: 'beacon.orange.dark',
    family: 'orange',
    population_approx: '~11%',
    clinical_meaning:
      'Significantly below average. Active intervention recommended. Provider may be involved.',
  },
  {
    band: BeaconBand.RED,
    min: 0,
    max: 59,
    name: 'Red',
    color_token: 'beacon.red',
    family: 'red',
    population_approx: '~16%',
    clinical_meaning:
      'Clinical intersection. Provider notified. 51/49 governance activated. Compassionate response — protect, don\'t punish.',
  },
];

// ────────────────────────────────────────────────────────────
// PIECEWISE LINEAR BREAKPOINTS — Beacon §6.2
// Used by beacon/piecewise-linear.ts. Verified by test fixtures.
// ────────────────────────────────────────────────────────────

export interface PiecewiseSegment {
  z_min: number;       // -Infinity for the lowest segment
  score_at_z_min: number;
  slope: number;       // points per Z-unit
  cap_at?: number;     // Score cap (e.g. 100 for the top segment)
}

/**
 * Per Beacon §6.2 The Function (LOCKED).
 *   If Z >= +1.5  → Score = 95 + (Z − 1.5) × 10           cap at 100
 *   If Z >= +0.7  → Score = 85 + (Z − 0.7) × 12.5
 *   If Z >= +0.3  → Score = 80 + (Z − 0.3) × 12.5
 *   If Z >= -0.3  → Score = 70 + (Z + 0.3) × 16.7
 *   If Z >= -0.6  → Score = 65 + (Z + 0.6) × 16.7
 *   If Z >= -1.0  → Score = 60 + (Z + 1.0) × 12.5
 *   If Z <  -1.0  → Score = max(0, 60 + (Z + 1.0) × 20)
 */
export const PIECEWISE_SEGMENTS: PiecewiseSegment[] = [
  { z_min: 1.5,  score_at_z_min: 95, slope: 10,   cap_at: 100 },
  { z_min: 0.7,  score_at_z_min: 85, slope: 12.5 },
  { z_min: 0.3,  score_at_z_min: 80, slope: 12.5 },
  { z_min: -0.3, score_at_z_min: 70, slope: 16.7 },
  { z_min: -0.6, score_at_z_min: 65, slope: 16.7 },
  { z_min: -1.0, score_at_z_min: 60, slope: 12.5 },
  // Below -1.0: Score = 60 + (Z + 1.0) × 20, floor at 0
  { z_min: -Infinity, score_at_z_min: 60, slope: 20 },
];
