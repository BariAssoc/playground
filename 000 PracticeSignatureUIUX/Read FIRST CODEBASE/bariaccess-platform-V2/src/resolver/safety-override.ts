/**
 * SAFETY OVERRIDE — Mental Wellbeing Forced ISE-5
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5 (full escalation flow)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.4 (response flow)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (hard rules)
 * 
 * ⚠️ SAFETY-CRITICAL ⚠️
 * 
 * Operates OUTSIDE the normal Resolver state machine. Higher priority than:
 *   - Governance flag (Signal 1)
 *   - All other signals
 *   - Even existing ISE-5 governance
 * 
 * When a Mental Wellbeing trigger fires:
 *   1. Force ISE-5 (Restricted/Guarded) regardless of all other inputs
 *   2. Cadence forced to "strictNeutral", voiceStyle forced to "protective"
 *   3. Template key forced to ISE5_SAFETY_CHECKIN
 *   4. Provider notified ALWAYS (per G6 hard rule 4)
 *   5. Pamela notified ALWAYS
 *   6. Audit log entry with severity:critical
 * 
 * Per G6 §5.6 hard rules:
 *   - AI never decides not to escalate
 *   - AI never gives crisis counseling
 *   - No false reassurance ("you're going to be okay")
 *   - Patient choosing "I'm safe" does NOT cancel provider notification
 *   - No diagnostic language
 */

import { ISEState } from '../types/ise.js';
import type { ISEPayload } from '../types/ise.js';
import type {
  MentalWellbeingTrigger,
  SafetyOverrideEvent
} from '../types/safety.js';
import { ISE5_SAFETY_CHECKIN_TEMPLATE_KEY } from '../types/safety.js';

// ─────────────────────────────────────────────────────────────────────────────
// CHECK FOR ACTIVE SAFETY OVERRIDE
// 
// Returns the override event if any unresolved Mental Wellbeing trigger exists.
// Resolver checks this FIRST, before all other signals.
// ─────────────────────────────────────────────────────────────────────────────

export function findActiveSafetyOverride(
  active_triggers: MentalWellbeingTrigger[]
): MentalWellbeingTrigger | null {
  // First unresolved trigger wins (most recent if multiple — caller orders by detection_at desc)
  return active_triggers.find((t) => t.resolved_at === null) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD SAFETY OVERRIDE PAYLOAD
// 
// Constructs the forced ISE-5 ISEPayload for the patient surface.
// ─────────────────────────────────────────────────────────────────────────────

export function buildSafetyOverridePayload(
  trigger: MentalWellbeingTrigger
): ISEPayload {
  // Reference trigger to satisfy strict unused-param check while documenting intent:
  // the trigger informs caller-side logging; the payload itself is template-driven.
  void trigger;

  const FORCED_STATE: ISEState = ISEState.ISE_5_RESTRICTED_GUARDED;

  return {
    version: 'v1.0A',
    generatedAt: new Date().toISOString(),
    state: FORCED_STATE,
    reasonCodes: [
      'SAFETY_REVIEW_REQUIRED',
      'CLINICAL_INTERSECTION_ACTIVE',
      'ACTIONS_LIMITED_BY_GOVERNANCE'
    ],
    contributors: [
      {
        domain: 'governance',
        direction: 'flagged'
      }
    ],
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
      voiceStyle: 'protective',
      templateKeys: [ISE5_SAFETY_CHECKIN_TEMPLATE_KEY]
    },
    governance: {
      isClinicalRouted: true,
      visibility: 'cpie',
      redactionLevel: 'strict'
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD SAFETY OVERRIDE EVENT (audit)
// ─────────────────────────────────────────────────────────────────────────────

export function buildSafetyOverrideEvent(
  trigger: MentalWellbeingTrigger,
  userId: string
): SafetyOverrideEvent {
  return {
    event_id: crypto.randomUUID(),
    userId,
    triggered_by_trigger_id: trigger.trigger_id,
    override_at: new Date().toISOString(),
    forced_state: 'ISE_5_RESTRICTED_GUARDED',
    forced_cadence: 'strictNeutral',
    forced_voice_style: 'protective',
    forced_template_key: ISE5_SAFETY_CHECKIN_TEMPLATE_KEY,
    override_acknowledged_by_resolver_at: new Date().toISOString(),
    override_lifted_at: null,
    lift_reason: null
  };
}
