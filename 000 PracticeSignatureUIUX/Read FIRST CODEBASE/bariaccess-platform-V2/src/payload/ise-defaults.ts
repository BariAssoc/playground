/**
 * ISE DEFAULTS — Canonical state → render/CTA/Ollie defaults
 * 
 * Source canon:
 *   - PAC-ISE-001 v1.0A §5 (ISE_DEFAULTS lookup table — LOCKED)
 *   - PAC-ISE-005 v1.0A §9 (fallback handling)
 * 
 * Maps each of the 7 ISE states to its default render tokens, CTA policy,
 * and Ollie policy. These are the "first principles" baselines that the
 * Resolver returns when no further customization applies.
 * 
 * IMPORTANT: This is the canonical baseline — DO NOT MODIFY without canon update.
 * Custom payloads from the Resolver may override individual fields, but the
 * default shape MUST be one of these 7 entries.
 */

import { ISEState } from '../types/ise.js';
import type {
  IdentityIconTokens,
  CTAPolicy,
  OlliePolicy
} from '../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// ISE DEFAULT ENTRY
// ─────────────────────────────────────────────────────────────────────────────

export interface ISEDefaultEntry {
  render: {
    identityIcon: IdentityIconTokens;
  };
  cta: CTAPolicy;
  ollie: OlliePolicy;
}

// ─────────────────────────────────────────────────────────────────────────────
// THE 7 LOCKED DEFAULTS (PAC-ISE-001 §5)
// ─────────────────────────────────────────────────────────────────────────────

export const ISE_DEFAULTS: Readonly<Record<ISEState, ISEDefaultEntry>> = {
  ISE_0_NEUTRAL_BASELINE: {
    render: {
      identityIcon: {
        posture: 'neutral',
        saturation: 'standard',
        motion: 'subtleIdle',
        overlay: 'none'
      }
    },
    cta: {
      mode: 'onboarding',
      maxVisible: 4,
      orderingBias: 'continuityFirst',
      restrictedActions: []
    },
    ollie: {
      cadence: 'neutral',
      promptDensity: 'normal',
      voiceStyle: 'onboardingGuide',
      templateKeys: ['ISE0_INFO']
    }
  },

  ISE_1_ALIGNED_AVAILABLE: {
    render: {
      identityIcon: {
        posture: 'upright',
        saturation: 'standard',
        motion: 'steadyIdle',
        overlay: 'none'
      }
    },
    cta: {
      mode: 'default',
      maxVisible: 6,
      orderingBias: 'continuityFirst',
      restrictedActions: []
    },
    ollie: {
      cadence: 'neutral',
      promptDensity: 'normal',
      voiceStyle: 'encouragingNeutral',
      templateKeys: ['ISE1_OFFER_NEXT']
    }
  },

  ISE_2_PROTECTIVE_RECOVERY_FORWARD: {
    render: {
      identityIcon: {
        posture: 'softened',
        saturation: 'muted',
        motion: 'subtleIdle',
        overlay: 'none'
      }
    },
    cta: {
      mode: 'recovery',
      maxVisible: 3,
      orderingBias: 'recoveryFirst',
      restrictedActions: ['intense_workout', 'caloric_restriction']
    },
    ollie: {
      cadence: 'slow',
      promptDensity: 'reduced',
      voiceStyle: 'protective',
      templateKeys: ['ISE2_PROTECT', 'ISE2_RECOVER_FORWARD']
    }
  },

  ISE_3_CONTAINED_LOAD_LIMITED: {
    render: {
      identityIcon: {
        posture: 'contained',
        saturation: 'muted',
        motion: 'minimal',
        overlay: 'none'
      }
    },
    cta: {
      mode: 'compress',
      maxVisible: 1,
      orderingBias: 'oneNextStep',
      restrictedActions: []
    },
    ollie: {
      cadence: 'minimal',
      promptDensity: 'minimal',
      voiceStyle: 'containment',
      templateKeys: ['ISE3_ONE_THING']
    }
  },

  ISE_4_BUILDING_MOMENTUM: {
    render: {
      identityIcon: {
        posture: 'upright',
        saturation: 'bright',
        motion: 'steadyIdle',
        overlay: 'none'
      }
    },
    cta: {
      mode: 'build',
      maxVisible: 6,
      orderingBias: 'performanceFirst',
      restrictedActions: []
    },
    ollie: {
      cadence: 'forward',
      promptDensity: 'increased',
      voiceStyle: 'encouragingNeutral',
      templateKeys: ['ISE4_REINFORCE_RHYTHM']
    }
  },

  ISE_5_RESTRICTED_GUARDED: {
    render: {
      identityIcon: {
        posture: 'contained',
        saturation: 'muted',
        motion: 'minimal',
        overlay: 'shieldLock'
      }
    },
    cta: {
      mode: 'restricted',
      maxVisible: 1,
      orderingBias: 'approvedOnly',
      restrictedActions: []
    },
    ollie: {
      cadence: 'strictNeutral',
      promptDensity: 'minimal',
      voiceStyle: 'governanceNeutral',
      templateKeys: ['ISE5_GUIDANCE_ONLY']
    }
  },

  ISE_6_EXPLORATORY_LOW_SIGNAL: {
    render: {
      identityIcon: {
        posture: 'neutral',
        saturation: 'lightOpacity',
        motion: 'subtleIdle',
        overlay: 'none'
      }
    },
    cta: {
      mode: 'default',
      maxVisible: 3,
      orderingBias: 'continuityFirst',
      restrictedActions: []
    },
    ollie: {
      cadence: 'explanatory',
      promptDensity: 'normal',
      voiceStyle: 'continuity',
      templateKeys: ['ISE6_LEARN_RHYTHM']
    }
  }
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP FUNCTION
// 
// Returns deep-cloned default entry to prevent caller mutation of canonical data.
// ─────────────────────────────────────────────────────────────────────────────

export function lookupISEDefaults(state: ISEState): ISEDefaultEntry {
  const entry = ISE_DEFAULTS[state];

  // Deep clone via structuredClone (Node 17+)
  // Falls back to JSON clone if unavailable (older runtimes)
  if (typeof structuredClone === 'function') {
    return structuredClone(entry);
  }
  return JSON.parse(JSON.stringify(entry)) as ISEDefaultEntry;
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK PAYLOAD (PAC-ISE-005 §9)
// 
// Returned when Resolver fails or required data is unavailable.
// Patient never sees an empty/error state — always returns a valid ISEPayload.
// ─────────────────────────────────────────────────────────────────────────────

export const FALLBACK_STATE: ISEState = ISEState.ISE_0_NEUTRAL_BASELINE;

export function getFallbackDefaults(): ISEDefaultEntry {
  return lookupISEDefaults(FALLBACK_STATE);
}
