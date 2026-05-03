/**
 * SAFETY — Mental Wellbeing Safety Escalation Flow
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5 (full escalation flow)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5.6 (hard rules — never violated)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5.7 (8 acceptance tests — Phase 1 ship blockers)
 * 
 * This file defines TYPES ONLY.
 * 
 * ⚠️ SAFETY-CRITICAL: Tests MW-T1 through MW-T8 are mandatory before Phase 1 ship.
 *    A patient experiencing crisis at the demo would be a catastrophic failure mode.
 */

// ─────────────────────────────────────────────────────────────────────────────
// DETECTION SOURCES (G6 §5.3)
// ─────────────────────────────────────────────────────────────────────────────

export type MentalWellbeingDetectionSource =
  | 'patient_text_self_harm'
  | 'patient_text_suicidal_ideation'
  | 'patient_voice_distress' // Phase 2+ via Fireflies — NOT in Phase 1
  | 'ollie_concern_pattern'
  | 'explicit_help_request';

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT RESPONSE OPTIONS (G6 §5.4)
// ─────────────────────────────────────────────────────────────────────────────

export type PatientSafetyResponse =
  | 'i_am_safe'
  | 'i_need_to_talk'
  | 'i_need_help_now';

// ─────────────────────────────────────────────────────────────────────────────
// RESOLUTION TYPES (G6 §5.2)
// ─────────────────────────────────────────────────────────────────────────────

export type SafetyResolutionType =
  | 'provider_contact'
  | 'patient_safe_response'
  | '988_referred'
  | 'emergency_services_contacted';

// ─────────────────────────────────────────────────────────────────────────────
// MENTAL WELLBEING TRIGGER (G6 §5.2 — full event schema)
// Stored in mental-wellbeing-events Cosmos container
// ─────────────────────────────────────────────────────────────────────────────

export interface MentalWellbeingTrigger {
  trigger_id: string;
  userId: string;

  // Detection source
  source: MentalWellbeingDetectionSource;
  detection_at: string; // ISO 8601
  detection_confidence: number; // 0.0-1.0

  /**
   * Content fields — enforced redaction per G5:
   *   - trigger_content_redacted: SAFE summary, returnable to CCIE-interface
   *     (though the existence of the trigger event itself is NEVER signaled to patient)
   *   - trigger_content_full: VERBATIM, CPIE-interface ONLY (provider/Pamela)
   * Per G6 acceptance test MW-T7: full content NEVER returned to CCIE-interface.
   */
  trigger_content_redacted: string;
  trigger_content_full: string;

  // Routing
  immediate_provider_alert: boolean;
  immediate_988_offer: boolean;
  pamela_notified_at: string | null;
  provider_notified_at: string | null;

  // Resolution
  resolved_at: string | null;
  resolution_type: SafetyResolutionType | null;
  patient_response: PatientSafetyResponse | null;

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SAFETY OVERRIDE EVENT (G6 §5.4 — forces ISE-5 regardless of current state)
// Highest priority in the ISE state machine. Bypasses normal Resolver.
// ─────────────────────────────────────────────────────────────────────────────

export interface SafetyOverrideEvent {
  event_id: string;
  userId: string;
  triggered_by_trigger_id: string; // links to MentalWellbeingTrigger.trigger_id
  override_at: string;

  // Forced ISE state values
  forced_state: 'ISE_5_RESTRICTED_GUARDED';
  forced_cadence: 'strictNeutral';
  forced_voice_style: 'protective';
  forced_template_key: 'ISE5_SAFETY_CHECKIN';

  // Audit
  override_acknowledged_by_resolver_at: string | null;
  override_lifted_at: string | null;
  lift_reason: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// HARD RULES (G6 §5.6 — never violated)
// Enforcement lives in src/governance/ai-boundaries.ts and src/resolver/safety-override.ts
// ─────────────────────────────────────────────────────────────────────────────

export const SAFETY_HARD_RULES = {
  /**
   * Rule 1: AI never decides not to escalate.
   * When trigger fires, escalation happens. Period.
   */
  AI_NEVER_SUPPRESSES_ESCALATION: true,

  /**
   * Rule 2: AI never gives crisis counseling.
   * Only safety check-in templates + 988/911 options.
   */
  AI_NEVER_GIVES_CRISIS_COUNSELING: true,

  /**
   * Rule 3: No false reassurance.
   * AI does not say "you're going to be okay."
   * AI says "I'm here. Are you safe right now?"
   */
  AI_NO_FALSE_REASSURANCE: true,

  /**
   * Rule 4: Patient choosing "I'm safe" does NOT cancel provider notification.
   * Provider always notified.
   */
  PROVIDER_ALWAYS_NOTIFIED: true,

  /**
   * Rule 5: No diagnostic language.
   * AI never references "suicidal ideation," "self-harm," "crisis" — only safety language.
   */
  AI_NO_DIAGNOSTIC_LANGUAGE: true
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 IMPLEMENTATION REQUIREMENTS (G6 §5.5)
// ─────────────────────────────────────────────────────────────────────────────

export interface SafetyPhase1Requirements {
  keyword_list_locked: boolean; // Val + Pamela curate before ship
  ise5_safety_checkin_template_added: boolean; // PAC-ISE-003 extension
  hotline_988_integration_works: boolean; // tel: link iOS + Android
  hotline_911_offer_works: boolean; // patient confirms, not auto-dial
  provider_sms_channel_active: boolean;
  pamela_notification_channel_active: boolean; // Slack DM + email
  audit_log_severity_critical: boolean; // ise-transition-log entries
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIAL TEMPLATE KEY (G6 §5.5 — extends PAC-ISE-003)
// ─────────────────────────────────────────────────────────────────────────────

export const ISE5_SAFETY_CHECKIN_TEMPLATE_KEY = 'ISE5_SAFETY_CHECKIN' as const;
