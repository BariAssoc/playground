/**
 * RESOLVER SIGNAL 3 — Cognitive Load
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §6 Signal 3
 *   - Beacon Canon v1.1 (Space-State terminology — Protected/Challenging/Vulnerable)
 *   - PAC-ISE-002 v2.0 §15 (THRESHOLD_PLI_OVERLOAD = 5, THRESHOLD_PLI_UNDERLOAD = 2)
 * 
 * PLI = Patient Load Indicator. Counts active programs, plans, schedules,
 * and behavioral asks placed on the patient.
 * 
 * Space-State (Protected / Challenging / Vulnerable) tracks the social/emotional
 * environment the patient is currently in.
 * 
 * High load + Vulnerable space → Resolver tends toward ISE-3 (Contained/Load-Limited).
 * Low load + Protected space → Resolver eligible for ISE-1 or ISE-4.
 */

import {
  THRESHOLD_PLI_OVERLOAD,
  THRESHOLD_PLI_UNDERLOAD
} from '../thresholds.js';

// ─────────────────────────────────────────────────────────────────────────────
// SPACE-STATE TYPE (canonical taxonomy from F.A.C.T.S. workshops, 2009-)
// ─────────────────────────────────────────────────────────────────────────────

export type SpaceState = 'protected' | 'challenging' | 'vulnerable';

// ─────────────────────────────────────────────────────────────────────────────
// LOAD CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export type CognitiveLoadLevel = 'underload' | 'normal' | 'overload';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface CognitiveLoadSignalOutput {
  pli_count: number;
  load_level: CognitiveLoadLevel;
  space_state: SpaceState | null;
  /** True if conditions favor ISE-3 (Contained/Load-Limited) */
  favors_ise3: boolean;
  /** True if conditions favor build/momentum eligibility */
  favors_build: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL INPUTS
// ─────────────────────────────────────────────────────────────────────────────

export interface CognitiveLoadSignalInputs {
  /** Count of patient load items (active programs + plans + schedules + asks) */
  pli_count: number;
  /** Most recent space-state classification, or null if not yet captured */
  space_state: SpaceState | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE SIGNAL 3
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateSignal3CognitiveLoad(
  inputs: CognitiveLoadSignalInputs
): CognitiveLoadSignalOutput {
  let load_level: CognitiveLoadLevel = 'normal';
  if (inputs.pli_count >= THRESHOLD_PLI_OVERLOAD) {
    load_level = 'overload';
  } else if (inputs.pli_count <= THRESHOLD_PLI_UNDERLOAD) {
    load_level = 'underload';
  }

  // Favors ISE-3 when: overload OR (high load AND vulnerable space)
  const favors_ise3 =
    load_level === 'overload' ||
    (inputs.pli_count >= THRESHOLD_PLI_OVERLOAD - 1 &&
      inputs.space_state === 'vulnerable');

  // Favors build when: underload AND protected space
  const favors_build =
    load_level === 'underload' && inputs.space_state === 'protected';

  return {
    pli_count: inputs.pli_count,
    load_level,
    space_state: inputs.space_state,
    favors_ise3,
    favors_build
  };
}
