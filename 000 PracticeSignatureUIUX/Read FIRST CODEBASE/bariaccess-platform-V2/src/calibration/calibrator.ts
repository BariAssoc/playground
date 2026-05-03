/**
 * CALIBRATOR — End-to-End Beacon Calibration Entry Point
 * 
 * Source canon:
 *   - Beacon Calibration Algorithm v1.0 §6 (end-to-end pseudocode)
 *   - Beacon Calibration Algorithm v1.0 §7 (edge cases + confidence)
 *   - Beacon Canon v1.1 §11 (confidence indicators)
 *   - Beacon Canon v1.1 §12.3 (Never Blank — default 30)
 * 
 * Single deterministic function used by ALL scoring layers:
 *   - Sub-scores → composites → R&R apex
 *   - Mood / Effort (G1)
 *   - Aurora Anticipation Index (G4)
 *   - Stability Coefficient
 */

import type {
  CalibrationInput,
  CalibrationOutput,
  ScoreWithConfidence,
  Confidence
} from '../types/beacon.js';
import { zScoreToBeaconScore } from './path-a-zscore.js';
import { clampBoundedScore } from './path-b-bounded.js';
import { rescaleRawRange } from './path-c-raw-range.js';
import { lookupBand, buildCalibrationOutput } from './band-lookup.js';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CALIBRATION FUNCTION
// 
// Per Calibration Algorithm v1.0 §6 pseudocode:
//   CALIBRATE_TO_BEACON(value, input_type, [min, max], higher_is_better)
//     → (score_0_100, band, band_name, color)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calibrate any formula score to the Beacon 7-band display.
 * 
 * Routes to Path A (Z), Path B (Bounded 0-100), or Path C (Raw Range)
 * based on input.inputType.
 * 
 * @param input — calibration input with type discriminator
 * @returns standard calibration output (score, band, name, color)
 * @throws Error if inputType is unrecognized
 */
export function calibrateToBeacon(input: CalibrationInput): CalibrationOutput {
  let score_0_100: number;

  switch (input.inputType) {
    case 'Z': {
      // Path A — Z-score with optional inversion
      const higherIsBetter = input.higherIsBetter ?? true;
      score_0_100 = zScoreToBeaconScore(input.value, higherIsBetter);
      break;
    }

    case 'Bounded_0_100': {
      // Path B — already on 0-100, just clamp
      score_0_100 = clampBoundedScore(input.value);
      break;
    }

    case 'Raw_Range': {
      // Path C — rescale arbitrary range
      if (input.rangeMin === undefined || input.rangeMax === undefined) {
        throw new Error(
          'CALIBRATE_TO_BEACON: Path C (Raw_Range) requires rangeMin and rangeMax'
        );
      }
      const higherIsBetter = input.higherIsBetter ?? true;
      score_0_100 = rescaleRawRange(
        input.value,
        input.rangeMin,
        input.rangeMax,
        higherIsBetter
      );
      break;
    }

    default: {
      // Exhaustiveness check — TypeScript will flag if a new InputType is added
      const _exhaustive: never = input.inputType;
      throw new Error(`CALIBRATE_TO_BEACON: Unknown input_type: ${String(_exhaustive)}`);
    }
  }

  return buildCalibrationOutput(score_0_100);
}

// ─────────────────────────────────────────────────────────────────────────────
// CALIBRATION WITH CONFIDENCE — extended variant
// 
// Per Beacon Canon v1.1 §11:
//   Confidence drops one tier per missing input that used default 30 fallback.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calibrate to Beacon with confidence indicator attached.
 * 
 * @param input — calibration input
 * @param defaultedInputCount — count of upstream inputs that used default 30 fallback
 * @returns score with band, color, and confidence
 */
export function calibrateToBeaconWithConfidence(
  input: CalibrationInput,
  defaultedInputCount: number = 0
): ScoreWithConfidence {
  const result = calibrateToBeacon(input);
  const confidence = computeConfidence(defaultedInputCount);

  return {
    score: result.score,
    band: result.band,
    color: result.color,
    confidence,
    defaultedInputCount
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIDENCE COMPUTATION (Beacon Canon v1.1 §11)
// 
// Tier descent:
//   0 defaulted inputs  → high
//   1 defaulted input   → medium
//   2 defaulted inputs  → low
//   3+ defaulted inputs → default (Never Blank baseline)
// ─────────────────────────────────────────────────────────────────────────────

export function computeConfidence(defaultedInputCount: number): Confidence {
  if (defaultedInputCount <= 0) return 'high';
  if (defaultedInputCount === 1) return 'medium';
  if (defaultedInputCount === 2) return 'low';
  return 'default';
}

// ─────────────────────────────────────────────────────────────────────────────
// NEVER BLANK FALLBACK (Beacon Canon v1.1 §12.3)
// 
// When upstream cannot produce ANY value, return the Never Blank default:
// score = 30, band = 7 (Red), confidence = default.
// ─────────────────────────────────────────────────────────────────────────────

export const NEVER_BLANK_DEFAULT_SCORE = 30 as const;

export function neverBlankFallback(): ScoreWithConfidence {
  const { band, color } = lookupBand(NEVER_BLANK_DEFAULT_SCORE);
  return {
    score: NEVER_BLANK_DEFAULT_SCORE,
    band,
    color,
    confidence: 'default',
    defaultedInputCount: 99 // sentinel — entire score is fallback
  };
}
