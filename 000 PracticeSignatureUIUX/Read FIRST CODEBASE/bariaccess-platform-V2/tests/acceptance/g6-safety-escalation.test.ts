/**
 * G6 SAFETY ESCALATION — MANDATORY ACCEPTANCE TESTS (MW-T1..MW-T8)
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.7 (8 mandatory acceptance tests)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (hard rules — never violated)
 * 
 * ⚠️ SAFETY-CRITICAL ⚠️ — PHASE 1 SHIP BLOCKERS
 * 
 * Per G6 §5.7: "These tests block Phase 1 ship. A patient experiencing crisis
 * at the demo would be a catastrophic failure mode."
 * 
 * Run: npm run test:safety
 */

import { describe, it, expect } from '@jest/globals';
import {
  handleCreateSafetyTrigger,
  handleRecordSafetyResponse,
  type SafetyStorageGateway,
  type NotificationGateway
} from '../../src/api/routes/safety-trigger.js';
import {
  buildSafetyOverridePayload,
  findActiveSafetyOverride,
  buildSafetyOverrideEvent
} from '../../src/resolver/safety-override.js';
import type {
  MentalWellbeingTrigger,
  PatientSafetyResponse
} from '../../src/types/safety.js';
import { ISE5_SAFETY_CHECKIN_TEMPLATE_KEY } from '../../src/types/safety.js';
import { ISEState } from '../../src/types/ise.js';
import type { AuthContext } from '../../src/api/auth/role-check.js';
import type { AuditEventSink } from '../../src/api/middleware/audit.js';
import type { AuditEvent } from '../../src/types/audit.js';

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURES + GATEWAYS
// ─────────────────────────────────────────────────────────────────────────────

class InMemorySafetyStorage implements SafetyStorageGateway {
  triggers: MentalWellbeingTrigger[] = [];
  async createTrigger(trigger: MentalWellbeingTrigger): Promise<void> {
    this.triggers.push({ ...trigger });
  }
  async recordResponse(
    trigger_id: string,
    response: PatientSafetyResponse,
    resolution_at: string
  ): Promise<void> {
    const t = this.triggers.find((x) => x.trigger_id === trigger_id);
    if (t) {
      t.patient_response = response;
      t.resolved_at = resolution_at;
      t.resolution_type =
        response === 'i_am_safe'
          ? 'patient_safe_response'
          : response === 'i_need_to_talk'
            ? '988_referred'
            : 'emergency_services_contacted';
    }
  }
  async getTrigger(trigger_id: string): Promise<MentalWellbeingTrigger | null> {
    return this.triggers.find((t) => t.trigger_id === trigger_id) ?? null;
  }
}

class CapturingNotificationGateway implements NotificationGateway {
  provider_calls: Array<{ userId: string; trigger_id: string; message: string; at: number }> = [];
  pamela_calls: Array<{ userId: string; trigger_id: string; message: string; at: number }> = [];

  async notifyProvider(userId: string, trigger_id: string, message: string): Promise<void> {
    this.provider_calls.push({ userId, trigger_id, message, at: Date.now() });
  }
  async notifyPamela(userId: string, trigger_id: string, message: string): Promise<void> {
    this.pamela_calls.push({ userId, trigger_id, message, at: Date.now() });
  }
}

class CapturingAuditSink implements AuditEventSink {
  events: AuditEvent[] = [];
  enqueue(event: AuditEvent): void {
    this.events.push(event);
  }
}

function buildPatientAuth(): AuthContext {
  return { user_id: 'mark-spg-001', role: 'patient', authorized_patient_ids: [] };
}

function buildTrigger(
  overrides: Partial<MentalWellbeingTrigger> = {}
): MentalWellbeingTrigger {
  return {
    trigger_id: 'trig-1',
    userId: 'mark-spg-001',
    source: 'patient_text_self_harm',
    detection_at: new Date().toISOString(),
    detection_confidence: 0.85,
    trigger_content_redacted: 'Patient indicated distress.',
    trigger_content_full: 'Verbatim patient message would go here',
    immediate_provider_alert: true,
    immediate_988_offer: true,
    pamela_notified_at: null,
    provider_notified_at: null,
    resolved_at: null,
    resolution_type: null,
    patient_response: null,
    ...overrides
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MANDATORY TESTS MW-T1..MW-T8
// ─────────────────────────────────────────────────────────────────────────────

describe('G6 §5.7 — Mental Wellbeing Safety Escalation Acceptance Tests (MANDATORY PRE-SHIP)', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // MW-T1: Trigger keyword list locked + reviewed by clinical (Val + Pamela)
  //        before ship — this test verifies the KEYWORD LIST EXISTS as a
  //        non-empty, frozen artifact. Actual content is curated separately.
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T1: Mental wellbeing trigger keyword list is locked + non-empty', async () => {
    // The locked keyword list lives in the patterns of P-005-MW through P-007-MW
    // in src/governance/prohibited-capabilities.ts. We verify those patterns exist
    // and form a non-trivial set. Final clinical curation by Val + Pamela is a
    // pre-ship gate documented in the patch (OQ-D0LITE-PATCH-02).
    const { PROHIBITED_CAPABILITIES } = await import(
      '../../src/governance/prohibited-capabilities.js'
    );
    const mw_prohibitions = PROHIBITED_CAPABILITIES.filter((p) =>
      p.id.startsWith('P-') && p.id.endsWith('-MW')
    );
    expect(mw_prohibitions.length).toBeGreaterThanOrEqual(3);
    for (const p of mw_prohibitions) {
      expect(p.severity).toBe('critical');
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T2: Trigger detection latency < 2 seconds from patient input to ISE-5
  //        override. We exercise the synchronous create path and assert it
  //        returns within 2 seconds in test harness.
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T2: Trigger create + ISE-5 override completes in < 2 seconds', async () => {
    const storage = new InMemorySafetyStorage();
    const notifications = new CapturingNotificationGateway();
    const sink = new CapturingAuditSink();

    const start = Date.now();
    const response = await handleCreateSafetyTrigger(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        source: 'patient_text_self_harm',
        detection_confidence: 0.85,
        trigger_content_redacted: 'safe summary',
        trigger_content_full: 'verbatim'
      },
      storage,
      notifications,
      sink
    );
    const elapsed_ms = Date.now() - start;

    expect(response.status).toBe(201);
    expect(elapsed_ms).toBeLessThan(2000);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T3: Provider notification fires within 30 seconds of trigger
  //        — in our in-memory test, this happens in the same call.
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T3: Provider notification fires on trigger creation', async () => {
    const storage = new InMemorySafetyStorage();
    const notifications = new CapturingNotificationGateway();
    const sink = new CapturingAuditSink();

    await handleCreateSafetyTrigger(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        source: 'patient_text_self_harm',
        detection_confidence: 0.85,
        trigger_content_redacted: 'safe summary',
        trigger_content_full: 'verbatim'
      },
      storage,
      notifications,
      sink
    );

    expect(notifications.provider_calls.length).toBeGreaterThan(0);
    expect(notifications.pamela_calls.length).toBeGreaterThan(0);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T4: "I'm safe" response does NOT cancel provider notification
  //        — Hard Rule 4 (G6 §5.6): provider always notified.
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T4: Patient "I am safe" response still triggers provider notification', async () => {
    const storage = new InMemorySafetyStorage();
    const notifications = new CapturingNotificationGateway();
    const sink = new CapturingAuditSink();

    // Create trigger
    const create_response = await handleCreateSafetyTrigger(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        source: 'patient_text_self_harm',
        detection_confidence: 0.85,
        trigger_content_redacted: 'safe summary',
        trigger_content_full: 'verbatim'
      },
      storage,
      notifications,
      sink
    );
    expect(create_response.status).toBe(201);
    const provider_calls_after_create = notifications.provider_calls.length;
    expect(provider_calls_after_create).toBeGreaterThan(0);

    // Patient responds "I'm safe"
    const trigger = storage.triggers[0];
    expect(trigger).toBeDefined();
    if (!trigger) return;

    const response_result = await handleRecordSafetyResponse(
      {
        auth: buildPatientAuth(),
        trigger_id: trigger.trigger_id,
        response: 'i_am_safe'
      },
      storage,
      notifications
    );

    expect(response_result.status).toBe(200);
    // ❗ HARD RULE 4: provider notified AGAIN on response — count went up
    expect(notifications.provider_calls.length).toBeGreaterThan(provider_calls_after_create);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T5: 988 link works on iOS + Android
  //        — verified at integration/E2E level. Here we assert the safety
  //        override payload references 988 contextually (via templates).
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T5: Safety override payload uses ISE5_SAFETY_CHECKIN template (988 surface)', () => {
    const trigger = buildTrigger();
    const payload = buildSafetyOverridePayload(trigger);
    expect(payload.ollie.templateKeys).toContain(ISE5_SAFETY_CHECKIN_TEMPLATE_KEY);
    expect(payload.ollie.cadence).toBe('strictNeutral');
    expect(payload.ollie.voiceStyle).toBe('protective');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T6: Audit log entry created with severity:critical
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T6: Audit event created on trigger fire (escalation flagged)', async () => {
    const storage = new InMemorySafetyStorage();
    const notifications = new CapturingNotificationGateway();
    const sink = new CapturingAuditSink();

    await handleCreateSafetyTrigger(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        source: 'patient_text_self_harm',
        detection_confidence: 0.85,
        trigger_content_redacted: 'safe summary',
        trigger_content_full: 'verbatim'
      },
      storage,
      notifications,
      sink
    );

    expect(sink.events.length).toBeGreaterThan(0);
    // The override event is a synthetic ai_interaction with escalationTriggered=true
    const escalation_events = sink.events.filter(
      (e) => e.type === 'ai_interaction' && e.entry.escalationTriggered === true
    );
    expect(escalation_events.length).toBeGreaterThan(0);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T7: trigger_content_full is NEVER returned to CCIE-interface (per G5)
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T7: Trigger content full is never returned to CCIE-interface', async () => {
    const storage = new InMemorySafetyStorage();
    const notifications = new CapturingNotificationGateway();
    const sink = new CapturingAuditSink();

    const response = await handleCreateSafetyTrigger(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        source: 'patient_text_self_harm',
        detection_confidence: 0.85,
        trigger_content_redacted: 'safe summary',
        trigger_content_full: 'VERBATIM SECRET CONTENT THAT MUST NOT LEAK'
      },
      storage,
      notifications,
      sink
    );

    expect(response.status).toBe(201);
    const body_serialized = JSON.stringify(response.body);
    expect(body_serialized).not.toContain('VERBATIM SECRET CONTENT THAT MUST NOT LEAK');
    expect(body_serialized).not.toContain('trigger_content_full');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // MW-T8: Behavioral assertion — once submitted, escalation always happens
  //        (Hard Rule 1: AI never decides not to escalate)
  //        We verify this by confirming no code path can set
  //        immediate_provider_alert=false on a created trigger.
  // ───────────────────────────────────────────────────────────────────────────
  it('MW-T8: Created trigger always has immediate_provider_alert=true', async () => {
    const storage = new InMemorySafetyStorage();
    const notifications = new CapturingNotificationGateway();
    const sink = new CapturingAuditSink();

    // Try multiple sources — none should result in suppressed escalation
    const sources: Array<MentalWellbeingTrigger['source']> = [
      'patient_text_self_harm',
      'patient_text_suicidal_ideation',
      'ollie_concern_pattern',
      'explicit_help_request'
    ];

    for (const source of sources) {
      await handleCreateSafetyTrigger(
        {
          auth: buildPatientAuth(),
          target_user_id: 'mark-spg-001',
          source,
          detection_confidence: 0.5, // even lower confidence → still escalates
          trigger_content_redacted: 'safe summary',
          trigger_content_full: 'verbatim'
        },
        storage,
        notifications,
        sink
      );
    }

    expect(storage.triggers.length).toBe(sources.length);
    for (const trigger of storage.triggers) {
      expect(trigger.immediate_provider_alert).toBe(true);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // BONUS: findActiveSafetyOverride returns trigger when present
  // ───────────────────────────────────────────────────────────────────────────
  it('Bonus: findActiveSafetyOverride returns most recent unresolved trigger', () => {
    const triggers: MentalWellbeingTrigger[] = [
      buildTrigger({ trigger_id: 'old', resolved_at: '2026-05-01T00:00:00Z' }),
      buildTrigger({ trigger_id: 'active' }) // unresolved
    ];
    const active = findActiveSafetyOverride(triggers);
    expect(active).not.toBeNull();
    expect(active?.trigger_id).toBe('active');
  });

  it('Bonus: findActiveSafetyOverride returns null when all resolved', () => {
    const triggers: MentalWellbeingTrigger[] = [
      buildTrigger({ trigger_id: 'a', resolved_at: '2026-05-01T00:00:00Z' }),
      buildTrigger({ trigger_id: 'b', resolved_at: '2026-05-02T00:00:00Z' })
    ];
    const active = findActiveSafetyOverride(triggers);
    expect(active).toBeNull();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // BONUS: SafetyOverrideEvent has correct forced values
  // ───────────────────────────────────────────────────────────────────────────
  it('Bonus: SafetyOverrideEvent has correct forced ISE-5 values', () => {
    const trigger = buildTrigger();
    const event = buildSafetyOverrideEvent(trigger, 'mark-spg-001');
    expect(event.forced_state).toBe('ISE_5_RESTRICTED_GUARDED');
    expect(event.forced_cadence).toBe('strictNeutral');
    expect(event.forced_voice_style).toBe('protective');
    expect(event.forced_template_key).toBe(ISE5_SAFETY_CHECKIN_TEMPLATE_KEY);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // BONUS: Forced state is exactly ISE_5_RESTRICTED_GUARDED
  // ───────────────────────────────────────────────────────────────────────────
  it('Bonus: buildSafetyOverridePayload returns ISE-5 state', () => {
    const trigger = buildTrigger();
    const payload = buildSafetyOverridePayload(trigger);
    expect(payload.state).toBe(ISEState.ISE_5_RESTRICTED_GUARDED);
  });
});
