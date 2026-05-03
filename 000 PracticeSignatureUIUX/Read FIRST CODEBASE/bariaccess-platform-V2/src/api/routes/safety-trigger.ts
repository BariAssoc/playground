/**
 * ROUTE: POST /v1/safety/trigger
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5 (full Mental Wellbeing escalation flow)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.4 (response flow with hard rules)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (hard rules — never violated)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.7 (acceptance tests MW-T1..MW-T8)
 * 
 * ⚠️ SAFETY-CRITICAL ⚠️
 * 
 * Two endpoint shapes:
 *   POST /v1/safety/trigger — record a Mental Wellbeing trigger (creates record,
 *                              forces ISE-5, notifies provider + Pamela)
 *   POST /v1/safety/trigger/:id/respond — record patient response selection
 * 
 * Per G6 hard rules:
 *   - Provider notified ALWAYS (even on "I'm safe")
 *   - No diagnostic language in any response payload
 *   - No false reassurance
 *   - AI never decides not to escalate — once submitted, escalation happens
 */

import type {
  MentalWellbeingTrigger,
  MentalWellbeingDetectionSource,
  PatientSafetyResponse,
  SafetyOverrideEvent
} from '../../types/safety.js';
import type { AuthContext } from '../auth/role-check.js';
import {
  buildSafetyOverrideEvent
} from '../../resolver/safety-override.js';
import type { AuditEventSink } from '../middleware/audit.js';
import type { AuditEvent } from '../../types/audit.js';

// ─────────────────────────────────────────────────────────────────────────────
// CREATE TRIGGER REQUEST / RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateSafetyTriggerRequest {
  auth: AuthContext;
  /** patient userId — must equal auth.user_id for self-trigger */
  target_user_id: string;
  source: MentalWellbeingDetectionSource;
  detection_confidence: number;
  /**
   * SAFE summary — patient may see this echoed (existence not signaled though).
   * Per G6 §5.6: no diagnostic language.
   */
  trigger_content_redacted: string;
  /**
   * VERBATIM content. Stored only if HIPAA storage gate active.
   * NEVER returned in response to CCIE-interface.
   */
  trigger_content_full: string;
}

export interface CreateSafetyTriggerResponse {
  status: 201 | 400 | 403 | 500;
  body: SafetyTriggerCreatedView | { error: string };
  headers: Record<string, string>;
}

/** Patient-facing view — does NOT include trigger_content_full */
export interface SafetyTriggerCreatedView {
  trigger_id: string;
  /** Locked clinical content from G6 §5.4 */
  check_in_message: "I'm here. Are you safe right now?";
  /** Three options the UI must render — no other choices permitted */
  response_options: ReadonlyArray<PatientSafetyResponse>;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE / NOTIFICATION GATEWAYS
// ─────────────────────────────────────────────────────────────────────────────

export interface SafetyStorageGateway {
  createTrigger(trigger: MentalWellbeingTrigger): Promise<void>;
  recordResponse(
    trigger_id: string,
    response: PatientSafetyResponse,
    resolution_at: string
  ): Promise<void>;
  getTrigger(trigger_id: string): Promise<MentalWellbeingTrigger | null>;
}

export interface NotificationGateway {
  /** Per G6 §5.5: SMS to provider on file (Bariatric Associates contact list) */
  notifyProvider(userId: string, trigger_id: string, message: string): Promise<void>;
  /** Per G6 §5.5: Slack DM + email to Pamela */
  notifyPamela(userId: string, trigger_id: string, message: string): Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCKED CLINICAL CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const CHECK_IN_MESSAGE = "I'm here. Are you safe right now?" as const;
const RESPONSE_OPTIONS: ReadonlyArray<PatientSafetyResponse> = [
  'i_am_safe',
  'i_need_to_talk',
  'i_need_help_now'
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// CREATE TRIGGER HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function handleCreateSafetyTrigger(
  req: CreateSafetyTriggerRequest,
  storage: SafetyStorageGateway,
  notifications: NotificationGateway,
  audit_sink: AuditEventSink
): Promise<CreateSafetyTriggerResponse> {
  // Patient self-trigger only — clinicians do not create patient triggers via this endpoint
  if (req.auth.user_id !== req.target_user_id || req.auth.role !== 'patient') {
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  // Validate confidence
  if (req.detection_confidence < 0 || req.detection_confidence > 1) {
    return {
      status: 400,
      body: { error: 'detection_confidence must be in [0, 1]' },
      headers: {}
    };
  }

  const trigger_id = crypto.randomUUID();
  const now = new Date().toISOString();

  const trigger: MentalWellbeingTrigger = {
    trigger_id,
    userId: req.target_user_id,
    source: req.source,
    detection_at: now,
    detection_confidence: req.detection_confidence,
    trigger_content_redacted: req.trigger_content_redacted,
    trigger_content_full: req.trigger_content_full,
    immediate_provider_alert: true, // hard rule 4 — provider always notified
    immediate_988_offer: req.source === 'patient_text_self_harm' || req.source === 'patient_text_suicidal_ideation',
    pamela_notified_at: null,
    provider_notified_at: null,
    resolved_at: null,
    resolution_type: null,
    patient_response: null
  };

  try {
    await storage.createTrigger(trigger);
  } catch {
    return { status: 500, body: { error: 'Storage error' }, headers: {} };
  }

  // Force ISE-5 override audit event (severity:critical)
  const override: SafetyOverrideEvent = buildSafetyOverrideEvent(trigger, req.target_user_id);
  // Persist override via audit sink — uses a transition wrapper
  // Caller's resolver run will reflect ISE-5 on next request
  await audit_sink.enqueue(buildOverrideAuditEvent(override));

  // Notify provider + Pamela in parallel; failures must NOT block response (per
  // hard rule 4 — escalation always happens, even if notification channel is
  // momentarily flaky; downstream retries pick up).
  await Promise.allSettled([
    notifications.notifyProvider(
      req.target_user_id,
      trigger_id,
      'Mental Wellbeing trigger fired. Patient surfaced safety check-in.'
    ),
    notifications.notifyPamela(
      req.target_user_id,
      trigger_id,
      'Mental Wellbeing trigger fired. Review pending.'
    )
  ]);

  // Patient-facing response — NEVER returns trigger_content_full per G5/G6
  return {
    status: 201,
    body: {
      trigger_id,
      check_in_message: CHECK_IN_MESSAGE,
      response_options: RESPONSE_OPTIONS
    },
    headers: {
      'X-Safety-Override': 'active',
      'X-Patch-Version': 'DEV-WORK-D0LITE-PATCH-001 v1.0'
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE HANDLER — patient selects one of three options
// ─────────────────────────────────────────────────────────────────────────────

export interface RecordSafetyResponseRequest {
  auth: AuthContext;
  trigger_id: string;
  response: PatientSafetyResponse;
}

export interface RecordSafetyResponseResponse {
  status: 200 | 400 | 403 | 404 | 500;
  body: { acknowledged: true } | { error: string };
  headers: Record<string, string>;
}

export async function handleRecordSafetyResponse(
  req: RecordSafetyResponseRequest,
  storage: SafetyStorageGateway,
  notifications: NotificationGateway
): Promise<RecordSafetyResponseResponse> {
  if (req.auth.role !== 'patient') {
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  if (!RESPONSE_OPTIONS.includes(req.response)) {
    return { status: 400, body: { error: 'Invalid response option' }, headers: {} };
  }

  const trigger = await storage.getTrigger(req.trigger_id).catch(() => null);
  if (trigger === null) {
    return { status: 404, body: { error: 'Trigger not found' }, headers: {} };
  }

  // Authorization — patient can only respond to their own trigger
  if (trigger.userId !== req.auth.user_id) {
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  try {
    await storage.recordResponse(req.trigger_id, req.response, new Date().toISOString());
  } catch {
    return { status: 500, body: { error: 'Storage error' }, headers: {} };
  }

  // Hard rule 4: provider notified again on response (regardless of choice)
  await notifications.notifyProvider(
    trigger.userId,
    req.trigger_id,
    `Patient responded: ${req.response}. Provider review still required.`
  );

  return {
    status: 200,
    body: { acknowledged: true },
    headers: {}
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function buildOverrideAuditEvent(override: SafetyOverrideEvent): AuditEvent {
  // Wrap as ise_transition event with severity:critical per G6 §5.5.
  // Real impl would also build a full ISETransitionLogEntry; here we emit a
  // minimal AI-interaction event tagged critical so the audit sink sees it.
  return {
    type: 'ai_interaction',
    entry: {
      interaction_id: override.event_id,
      userId: override.userId,
      agent: 'ollie',
      agent_version: 'safety-override-1.0',
      iseStateAtInteraction: 'ISE_5_RESTRICTED_GUARDED' as never,
      templateKeyUsed: override.forced_template_key,
      cadenceUsed: override.forced_cadence,
      voiceStyleUsed: override.forced_voice_style,
      outputCompliant: true,
      escalationTriggered: true,
      timestamp: override.override_at
    }
  };
}
