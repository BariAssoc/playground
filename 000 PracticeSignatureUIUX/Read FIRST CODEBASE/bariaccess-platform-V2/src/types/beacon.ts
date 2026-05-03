/**
 * BEACON — Universal Health Metric Normalization and Response System
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §4 (7-band architecture)
 *   - Beacon Canon v1.1 §6.5 (Path B — Bounded 0-100)
 *   - Beacon Canon v1.1 §11 (confidence indicators)
 *   - Beacon Canon v1.1 §15 (scoring hierarchy: 8 composites + 24 sub-scores + 80+ components)
 *   - Beacon Calibration Algorithm v1.0 §2 (input classification)
 *   - Beacon Calibration Algorithm v1.0 §4 (Path A/B/C definitions)
 *   - Beacon Calibration Algorithm v1.0 §5 (band lookup)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §2 (all 8 composites = Path B)
 *   - CCO-ENG-LOGO-EXPR-PATCH-001 v1.0 §2 (Aurora index = Path B)
 *   - CCO-FAB-001-PIN-001 v1.0 §3 + §4 (Mood + Effort = Path B)
 * 
 * This file defines TYPES ONLY. Implementation lives in src/calibration/*.
 */

import type { BeaconBand, BeaconColor, Confidence } from './ise.js';

// Re-export shared types from ise.ts
export type { BeaconBand, BeaconColor, Confidence };

// ─────────────────────────────────────────────────────────────────────────────
// BAND DEFINITIONS (Beacon Canon v1.1 §4 — DO NOT MODIFY)
// ─────────────────────────────────────────────────────────────────────────────

export interface BandDefinition {
  band: BeaconBand;
  rangeMin: number; // inclusive
  rangeMax: number; // inclusive (Band 1: 100, Band 7: 0)
  color: BeaconColor;
  name: string; // human-readable
  clinicalMeaning: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CALIBRATION INPUT TYPES (Beacon Calibration Algorithm v1.0 §2)
// ─────────────────────────────────────────────────────────────────────────────

export type CalibrationInputType =
  | 'Z' // Path A — normalized Z-score
  | 'Bounded_0_100' // Path B — already on 0-100
  | 'Raw_Range'; // Path C — arbitrary range, rescaled to 0-100

// ─────────────────────────────────────────────────────────────────────────────
// CALIBRATION INPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface CalibrationInput {
  value: number;
  inputType: CalibrationInputType;

  // Path A only — direction modifier
  // If "higher_is_worse", Z is inverted: Z_display = -Z (per Beacon §7.3)
  higherIsBetter?: boolean;

  // Path C only — arbitrary range bounds
  rangeMin?: number;
  rangeMax?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CALIBRATION OUTPUT — Standard return shape from calibrator
// ─────────────────────────────────────────────────────────────────────────────

export interface CalibrationOutput {
  score: number; // 0-100, clamped
  band: BeaconBand;
  bandName: string;
  color: BeaconColor;
}

// ─────────────────────────────────────────────────────────────────────────────
// THE 8 COMPOSITES (Beacon Canon v1.1 §15)
// ─────────────────────────────────────────────────────────────────────────────

export type CompositeName =
  | 'SRC' // Sleep Recovery Composite
  | 'SBL' // Stress Balance Layer
  | 'MBC' // Metabolic Balance Composite
  | 'MEI' // Movement & Exercise Index
  | 'AMP' // Adherence & Momentum Profile
  | 'BCI' // Body Composition Index
  | 'CRC' // Circadian & Rhythm Coherence
  | 'BHR'; // Behavioral Health & Resilience

export const ALL_COMPOSITES: ReadonlyArray<CompositeName> = [
  'SRC',
  'SBL',
  'MBC',
  'MEI',
  'AMP',
  'BCI',
  'CRC',
  'BHR'
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE METADATA — full name + domain (Beacon Canon v1.1 §15 + G2 §2)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeMetadata {
  name: CompositeName;
  fullName: string;
  domain: string;
  // All 8 composites declared Path B per CCO-RR-PYRAMID-ADD-PATCH-001 §2
  calibrationPath: 'Bounded_0_100';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SIGNAL DETECTION (Beacon Canon v1.1 §10)
// Position + velocity dual trigger
// ─────────────────────────────────────────────────────────────────────────────

export interface PreSignalDetection {
  positionInBand: BeaconBand; // 3 = Faint Green threshold
  velocity7Day: number; // slope, can be negative
  preSignalActive: boolean; // true if Band 3 + declining velocity
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIDENCE LEVELS (Beacon Canon v1.1 §11)
// ─────────────────────────────────────────────────────────────────────────────

export interface ScoreWithConfidence {
  score: number; // 0-100
  band: BeaconBand;
  color: BeaconColor;
  confidence: Confidence;
  /**
   * Number of inputs using default 30 fallback (Beacon §12.3 Never Blank).
   * Each missing input drops confidence one tier.
   */
  defaultedInputCount: number;
}
