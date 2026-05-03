/**
 * AI BOUNDARIES — Per-state behavioral boundaries
 * 
 * Source canon:
 *   - PAC-ISE-007 v1.0B §4 (per-state behavioral boundaries)
 *   - PAC-ISE-001 v1.0A §5 (ISE_DEFAULTS — these define the cadence/voice)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (mental wellbeing hard rules)
 * 
 * Maps each ISE state to:
 *   - Required cadence values
 *   - Required voice style values
 *   - Permitted template keys (whitelisted by state)
 *   - State-specific behavioral constraints
 * 
 * Used by:
 *   - audit-logger to validate compliance per interaction
 *   - deviation-detector to flag mismatches
 *   - AI agent system prompts (Ollie, AskABA) include these boundaries
 */

import { ISEState } from '../types/ise.js';
import type { OllieCadence, VoiceStyle } from '../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// PER-STATE BOUNDARY DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

export interface StateBoundary {
  state: ISEState;
  /** Cadence values that are valid for this state */
  permitted_cadences: ReadonlyArray<OllieCadence>;
  /** Voice styles that are valid for this state */
  permitted_voice_styles: ReadonlyArray<VoiceStyle>;
  /** Template keys whitelisted for this state */
  permitted_template_keys: ReadonlyArray<string>;
  /** Additional behavioral constraints (free-text, used in agent prompts) */
  behavioral_constraints: ReadonlyArray<string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// THE 7 LOCKED STATE BOUNDARIES
// ─────────────────────────────────────────────────────────────────────────────

export const STATE_BOUNDARIES: Readonly<Record<ISEState, StateBoundary>> = {
  [ISEState.ISE_0_NEUTRAL_BASELINE]: {
    state: ISEState.ISE_0_NEUTRAL_BASELINE,
    permitted_cadences: ['neutral'],
    permitted_voice_styles: ['onboardingGuide', 'informational'],
    permitted_template_keys: ['ISE0_INFO'],
    behavioral_constraints: [
      'Neutral baseline — explain calmly without urgency.',
      'Patient is new or in early state. Avoid assumptions about prior context.',
      'Onboarding-guide voice — patient, explanatory, low-pressure.'
    ]
  },

  [ISEState.ISE_1_ALIGNED_AVAILABLE]: {
    state: ISEState.ISE_1_ALIGNED_AVAILABLE,
    permitted_cadences: ['neutral'],
    permitted_voice_styles: ['encouragingNeutral'],
    permitted_template_keys: ['ISE1_OFFER_NEXT'],
    behavioral_constraints: [
      'Patient is positive but not actively building. Offer one next step.',
      'Encouraging-neutral voice — warm but not effusive.'
    ]
  },

  [ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD]: {
    state: ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD,
    permitted_cadences: ['slow'],
    permitted_voice_styles: ['protective'],
    permitted_template_keys: ['ISE2_PROTECT', 'ISE2_RECOVER_FORWARD'],
    behavioral_constraints: [
      'Patient needs protection + slow forward motion.',
      'Avoid intense workouts, caloric restriction, or load-adding actions.',
      'Protective voice — careful, slow, low-stakes.'
    ]
  },

  [ISEState.ISE_3_CONTAINED_LOAD_LIMITED]: {
    state: ISEState.ISE_3_CONTAINED_LOAD_LIMITED,
    permitted_cadences: ['minimal'],
    permitted_voice_styles: ['containment'],
    permitted_template_keys: ['ISE3_ONE_THING'],
    behavioral_constraints: [
      'Patient is load-limited. Show ONE thing only.',
      'Containment voice — calm, brief, contained.',
      'No multi-step suggestions, no parallel asks.'
    ]
  },

  [ISEState.ISE_4_BUILDING_MOMENTUM]: {
    state: ISEState.ISE_4_BUILDING_MOMENTUM,
    permitted_cadences: ['forward'],
    permitted_voice_styles: ['encouragingNeutral'],
    permitted_template_keys: ['ISE4_REINFORCE_RHYTHM'],
    behavioral_constraints: [
      'Patient has rhythm. Reinforce — do not introduce new asks.',
      'Encouraging-neutral voice — warm but not effusive.'
    ]
  },

  [ISEState.ISE_5_RESTRICTED_GUARDED]: {
    state: ISEState.ISE_5_RESTRICTED_GUARDED,
    permitted_cadences: ['strictNeutral'],
    permitted_voice_styles: ['governanceNeutral', 'protective'],
    permitted_template_keys: ['ISE5_GUIDANCE_ONLY', 'ISE5_SAFETY_CHECKIN'],
    behavioral_constraints: [
      'Provider exercises 51%. AI defers entirely.',
      'No encouragement, no challenge, no goal-setting.',
      'Governance-neutral voice — minimal, factual, no encouragement.',
      'If template key is ISE5_SAFETY_CHECKIN: G6 §5.6 hard rules apply ABSOLUTELY.'
    ]
  },

  [ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL]: {
    state: ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL,
    permitted_cadences: ['explanatory'],
    permitted_voice_styles: ['continuity'],
    permitted_template_keys: ['ISE6_LEARN_RHYTHM'],
    behavioral_constraints: [
      'Data is sparse. Ask gentle questions to fill gaps.',
      'Continuity voice — gentle bridge, low-data.',
      'Avoid making strong recommendations from sparse signal.'
    ]
  }
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS — used by audit-logger and deviation-detector
// ─────────────────────────────────────────────────────────────────────────────

export function isCadencePermitted(state: ISEState, cadence: OllieCadence): boolean {
  return STATE_BOUNDARIES[state].permitted_cadences.includes(cadence);
}

export function isVoiceStylePermitted(state: ISEState, style: VoiceStyle): boolean {
  return STATE_BOUNDARIES[state].permitted_voice_styles.includes(style);
}

export function isTemplateKeyPermitted(state: ISEState, templateKey: string): boolean {
  return STATE_BOUNDARIES[state].permitted_template_keys.includes(templateKey);
}

export function getBoundary(state: ISEState): StateBoundary {
  return STATE_BOUNDARIES[state];
}
