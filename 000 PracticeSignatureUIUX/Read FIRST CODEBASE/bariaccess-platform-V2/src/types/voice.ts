/**
 * VOICE — Fireflies.ai Voice Signal (Signal 7 — Phase 2+ deferred)
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §4 (Voice Signal 7 — additive to Resolver)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §4.3 (Phase 1 storage hook)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §4.4 (Resolver integration deferral)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §4.5 (Phase 1 ship blockers — HIPAA)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §6.4 (soft-delete / consent revocation)
 * 
 * This file defines TYPES ONLY.
 * 
 * ⚠️ PHASE 1: Voice data is captured silently to validate signal-to-noise ratio.
 *    Resolver does NOT consume voice in Phase 1. Phase 2+ activation requires:
 *      1. Fireflies BAA executed
 *      2. HIPAA voice consent flow validated by counsel
 *      3. Voice analysis model validated against cohort data
 *      4. Threshold calibration via WoZ extension to voice domain
 */

// ─────────────────────────────────────────────────────────────────────────────
// CALL TYPES (G6 §4.3)
// ─────────────────────────────────────────────────────────────────────────────

export type FirefliesCallType = 'pamela_d0' | 'pamela_checkin' | 'provider_visit';

// ─────────────────────────────────────────────────────────────────────────────
// VOICE AFFECT SIGNAL INPUT (G6 §4.2 — Phase 2+ schema)
// PROPOSED — not active in Phase 1. Resolver Signal 7 (deferred).
// ─────────────────────────────────────────────────────────────────────────────

export interface VoiceAffectSignalInput {
  source: 'fireflies_ai_pamela_call' | 'fireflies_ai_provider_call';
  call_duration_sec: number;

  // Tone analysis (Phase 2+)
  tone_valence: number; // -1.0 (negative) to +1.0 (positive)
  tone_arousal: number; // 0.0 (calm) to 1.0 (activated)
  tone_confidence: number; // 0.0-1.0 (model confidence)

  // Speech analysis (Phase 2+)
  patient_speaking_ratio: number; // 0.0-1.0
  speech_pace_relative: number; // -1.0 (slower than baseline) to +1.0 (faster)

  // Compliance metadata (always present)
  consent_recorded_at: string; // ISO 8601 — must be present
  hipaa_baa_active: boolean; // must be true to ingest
  redacted_transcript_id: string; // pointer to Journal Layer 1 row
}

// ─────────────────────────────────────────────────────────────────────────────
// FIREFLIES CALL RECORD (G6 §4.3 — Phase 1 capture container)
// Stored in fireflies-call-records Cosmos container
// ─────────────────────────────────────────────────────────────────────────────

export interface FirefliesCallRecord {
  id: string; // GUID
  userId: string; // partition key
  call_type: FirefliesCallType;
  call_started_at: string;
  call_ended_at: string;
  duration_sec: number;

  // HIPAA gates (MUST be present — both true to ingest)
  consent_recorded_at: string | null; // null = call not ingested
  hipaa_baa_active: boolean; // false = call not ingested

  // Storage references
  transcript_journal_row_id: string; // links to Journal entry per G5 redaction rules
  audio_storage_uri: string | null; // encrypted blob, optional

  // Phase 2+ fields (populated when voice analysis enabled)
  voice_analysis_completed_at: string | null;
  voice_signal_input: VoiceAffectSignalInput | null;

  // Soft-delete (G5 §6.4 — consent revocation)
  revoked_at: string | null;

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 SHIP BLOCKERS (G6 §4.5)
// All three must close before any Fireflies call ingestion
// ─────────────────────────────────────────────────────────────────────────────

export interface VoicePhase1Blockers {
  fireflies_baa_executed: boolean; // counsel + Fireflies sign BAA
  voice_consent_ux_shipped: boolean; // D0 onboarding includes opt-in (default OFF)
  hipaa_compliant_audio_storage: boolean; // encrypted blob + RBAC + audit log
}

/**
 * Hard rule: No Fireflies call ingestion until ALL three blockers close.
 * Pre-blocker calls fall back to manual journal entry by Pamela.
 */
export function canIngestFirefliesCall(blockers: VoicePhase1Blockers): boolean {
  return (
    blockers.fireflies_baa_executed &&
    blockers.voice_consent_ux_shipped &&
    blockers.hipaa_compliant_audio_storage
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2+ ACTIVATION REQUIREMENTS (G6 §4.4)
// Resolver consumes voice only when ALL four met
// ─────────────────────────────────────────────────────────────────────────────

export interface VoicePhase2Activation {
  fireflies_baa_signed: boolean;
  hipaa_voice_consent_validated_by_counsel: boolean;
  voice_analysis_model_validated: boolean;
  threshold_calibration_completed: boolean;
}

export function canResolverConsumeVoice(
  activation: VoicePhase2Activation
): boolean {
  return (
    activation.fireflies_baa_signed &&
    activation.hipaa_voice_consent_validated_by_counsel &&
    activation.voice_analysis_model_validated &&
    activation.threshold_calibration_completed
  );
}
