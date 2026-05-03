/**
 * G5 HIPAA REDACTION — MANDATORY ACCEPTANCE TESTS (T1-T12)
 * 
 * Source canon:
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §7 (12 mandatory acceptance tests)
 * 
 * ⚠️ HIPAA-CRITICAL ⚠️ — PHASE 1 SHIP BLOCKERS
 * 
 * Per G5 §7: "All 12 tests run in CI on every commit affecting
 * src/api/journal/* or src/storage/journal/*. Failure of ANY test blocks merge."
 * 
 * Run: npm run test:hipaa
 */

import { describe, it, expect } from '@jest/globals';
import {
  redactJournalForPatient,
  getJournalForProvider,
  isRoleAuthorizedForInterface,
  ALWAYS_REDACTED_FROM_CCIE_INTERFACE
} from '../../src/storage/redaction-layer.js';
import {
  applyJournalRedaction
} from '../../src/api/middleware/redaction.js';
import {
  handleListJournalEntries,
  type JournalStorageGateway
} from '../../src/api/routes/journal-entries.js';
import type { JournalEntryFull } from '../../src/types/journal.js';
import type { AuthContext } from '../../src/api/auth/role-check.js';
import type { AuditEventSink } from '../../src/api/middleware/audit.js';
import type { AuditEvent } from '../../src/types/audit.js';

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function buildFullEntry(
  overrides: Partial<JournalEntryFull> = {}
): JournalEntryFull {
  return {
    entry_id: 'entry-abc123',
    category: 'metabolic',
    entry: 'Hydration completed at slot AM2',
    question: 'How are you feeling about hydration today?',
    ollie_to_mark_first: 'Nice work on hydration today.',
    ollie_to_max:
      'Patient hydration FAB completed; mood pin 4/5; effort score trending up. Anything to flag?',
    max_to_ollie:
      'No clinical concern. Continue reinforcement. Patient on tirzepatide; hydration is high-priority for tolerance.',
    ollie_to_mark_second: "You're building a steady rhythm — keep it up.",
    askaba_to_provider: false,
    credit_type: 'CCIE-credit',
    revoked_at: null,
    revoked_reason: null,
    revocation_audit_id: null,
    ...overrides
  };
}

function buildPatientAuth(): AuthContext {
  return {
    user_id: 'mark-spg-001',
    role: 'patient',
    authorized_patient_ids: []
  };
}

function buildClinicianAuth(authorized: string[] = []): AuthContext {
  return {
    user_id: 'pamela-mb',
    role: 'clinician',
    authorized_patient_ids: authorized
  };
}

class InMemoryJournalGateway implements JournalStorageGateway {
  constructor(private readonly entries: ReadonlyArray<JournalEntryFull>) {}
  async listEntries(
    userId: string,
    options: { limit: number; include_revoked: boolean }
  ): Promise<ReadonlyArray<JournalEntryFull>> {
    void userId;
    let pool = [...this.entries];
    if (!options.include_revoked) {
      pool = pool.filter((e) => e.revoked_at === null);
    }
    return pool.slice(0, options.limit);
  }
  async getEntry(_userId: string, entry_id: string): Promise<JournalEntryFull | null> {
    return this.entries.find((e) => e.entry_id === entry_id) ?? null;
  }
}

class CapturingAuditSink implements AuditEventSink {
  events: AuditEvent[] = [];
  enqueue(event: AuditEvent): void {
    this.events.push(event);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MANDATORY TESTS T1-T12 (G5 §7)
// ─────────────────────────────────────────────────────────────────────────────

describe('G5 §7 — HIPAA Redaction Acceptance Tests (MANDATORY PRE-SHIP)', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // T1: Patient endpoint never returns ollie_to_max — even null, even empty
  // ───────────────────────────────────────────────────────────────────────────
  it('T1: Patient view never contains ollie_to_max (truthy value)', () => {
    const entry = buildFullEntry({ ollie_to_max: 'sensitive clinical reasoning' });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'ollie_to_max')).toBe(false);
  });

  it('T1b: Patient view never contains ollie_to_max (empty string)', () => {
    const entry = buildFullEntry({ ollie_to_max: '' });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'ollie_to_max')).toBe(false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T2: Patient endpoint never returns max_to_ollie
  // ───────────────────────────────────────────────────────────────────────────
  it('T2: Patient view never contains max_to_ollie', () => {
    const entry = buildFullEntry({ max_to_ollie: 'clinical interpretation here' });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'max_to_ollie')).toBe(false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T3: Patient endpoint never returns askaba_to_provider — even when false
  // ───────────────────────────────────────────────────────────────────────────
  it('T3: Patient view never contains askaba_to_provider (false value)', () => {
    const entry = buildFullEntry({ askaba_to_provider: false });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'askaba_to_provider')).toBe(false);
  });

  it('T3b: Patient view never contains askaba_to_provider (true value)', () => {
    const entry = buildFullEntry({ askaba_to_provider: true });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'askaba_to_provider')).toBe(false);
  });

  it('T3c: Patient view never contains askaba_to_provider (null value)', () => {
    const entry = buildFullEntry({ askaba_to_provider: null });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'askaba_to_provider')).toBe(false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T4: Patient endpoint never returns credit_type
  // ───────────────────────────────────────────────────────────────────────────
  it('T4: Patient view never contains credit_type (CCIE-credit)', () => {
    const entry = buildFullEntry({ credit_type: 'CCIE-credit' });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'credit_type')).toBe(false);
  });

  it('T4b: Patient view never contains credit_type (CPIE-credit)', () => {
    const entry = buildFullEntry({ credit_type: 'CPIE-credit' });
    const view = redactJournalForPatient(entry);
    expect(Object.prototype.hasOwnProperty.call(view, 'credit_type')).toBe(false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T5: Byte-identical patient view for askaba_to_provider true vs false
  // (no length leakage, no timing leakage)
  // ───────────────────────────────────────────────────────────────────────────
  it('T5: Byte-identical patient view regardless of askaba_to_provider value', () => {
    const entry_false = buildFullEntry({ askaba_to_provider: false });
    const entry_true = buildFullEntry({ askaba_to_provider: true });

    const view_false = redactJournalForPatient(entry_false);
    const view_true = redactJournalForPatient(entry_true);

    expect(JSON.stringify(view_false)).toBe(JSON.stringify(view_true));
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T6: Provider endpoint requires role:clinician + verified relationship
  // ───────────────────────────────────────────────────────────────────────────
  it('T6: Provider endpoint requires role:clinician with verified relationship', async () => {
    const entry = buildFullEntry();
    const gateway = new InMemoryJournalGateway([entry]);
    const sink = new CapturingAuditSink();

    // Clinician without relationship — should be 403
    const unauthorized_response = await handleListJournalEntries(
      {
        auth: buildClinicianAuth([]), // no authorized patients
        target_user_id: 'mark-spg-001',
        view: 'provider'
      },
      gateway,
      sink
    );
    expect(unauthorized_response.status).toBe(403);

    // Patient role — should be 403 (T10 also exercises this)
    const patient_response = await handleListJournalEntries(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        view: 'provider'
      },
      gateway,
      sink
    );
    expect(patient_response.status).toBe(403);

    // Clinician with verified relationship — should be 200
    const authorized_response = await handleListJournalEntries(
      {
        auth: buildClinicianAuth(['mark-spg-001']),
        target_user_id: 'mark-spg-001',
        view: 'provider'
      },
      gateway,
      sink
    );
    expect(authorized_response.status).toBe(200);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T7: Provider endpoint receives all 9 columns when authorized
  // ───────────────────────────────────────────────────────────────────────────
  it('T7: Provider view contains all 9 columns + credit_type', () => {
    const entry = buildFullEntry();
    const view = getJournalForProvider(entry);

    expect(view.entry_id).toBeDefined();
    expect(view.category).toBeDefined();
    expect(view.entry).toBeDefined();
    expect(view.question).toBeDefined();
    expect(view.ollie_to_mark_first).toBeDefined();
    expect(view.ollie_to_max).toBeDefined(); // ✅ Provider sees this
    expect(view.max_to_ollie).toBeDefined(); // ✅ Provider sees this
    expect(view.ollie_to_mark_second).toBeDefined();
    // askaba_to_provider may be false/null — we just verify the field is present
    expect(Object.prototype.hasOwnProperty.call(view, 'askaba_to_provider')).toBe(true);
    expect(view.credit_type).toBeDefined();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T8: Internal endpoint requires role:system or role:audit
  // ───────────────────────────────────────────────────────────────────────────
  it('T8: Internal endpoint requires system or audit role', () => {
    expect(isRoleAuthorizedForInterface('patient', 'Internal')).toBe(false);
    expect(isRoleAuthorizedForInterface('clinician', 'Internal')).toBe(false);
    expect(isRoleAuthorizedForInterface('system', 'Internal')).toBe(true);
    expect(isRoleAuthorizedForInterface('audit', 'Internal')).toBe(true);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T9: Audit log records every access with interface, role, redaction status
  // ───────────────────────────────────────────────────────────────────────────
  it('T9: Audit log records every access with interface, role, redaction_applied', async () => {
    const entry = buildFullEntry();
    const gateway = new InMemoryJournalGateway([entry]);
    const sink = new CapturingAuditSink();

    await handleListJournalEntries(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        view: 'patient'
      },
      gateway,
      sink
    );

    expect(sink.events.length).toBeGreaterThan(0);
    const access_event = sink.events.find((e) => e.type === 'journal_access');
    expect(access_event).toBeDefined();
    if (access_event && access_event.type === 'journal_access') {
      expect(access_event.entry.interface).toBe('CCIE-interface');
      expect(access_event.entry.requester_role).toBe('patient');
      expect(access_event.entry.redaction_applied).toBe(true);
      expect(access_event.entry.fields_redacted).toEqual(
        expect.arrayContaining(['ollie_to_max', 'max_to_ollie', 'askaba_to_provider', 'credit_type'])
      );
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T10: Patient view=provider returns 403 (NOT 200 with redaction)
  //      — never signal that a richer view exists
  // ───────────────────────────────────────────────────────────────────────────
  it('T10: Patient requesting view=provider returns 403, not a redacted 200', async () => {
    const entry = buildFullEntry();
    const gateway = new InMemoryJournalGateway([entry]);
    const sink = new CapturingAuditSink();

    const response = await handleListJournalEntries(
      {
        auth: buildPatientAuth(),
        target_user_id: 'mark-spg-001',
        view: 'provider'
      },
      gateway,
      sink
    );

    expect(response.status).toBe(403);
    // Body should be an error object, not a redacted entry list
    expect(Array.isArray(response.body)).toBe(false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T11: Same entry_id via both views returns different payloads with same _ts
  // ───────────────────────────────────────────────────────────────────────────
  it('T11: Same entry_id via patient and provider views returns different payloads', () => {
    const entry = buildFullEntry();

    const patient_view = redactJournalForPatient(entry);
    const provider_view = getJournalForProvider(entry);

    // Same entry_id
    expect(patient_view.entry_id).toBe(provider_view.entry_id);

    // Different shapes
    const patient_keys = Object.keys(patient_view).sort();
    const provider_keys = Object.keys(provider_view).sort();
    expect(patient_keys).not.toEqual(provider_keys);

    // Provider has more keys
    expect(provider_keys.length).toBeGreaterThan(patient_keys.length);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // T12: Redaction enforced at API layer — ALWAYS_REDACTED_FROM_CCIE_INTERFACE
  //      includes all 4 forbidden fields. (Network-level enforcement is a
  //      deployment concern verified separately; this asserts the constant.)
  // ───────────────────────────────────────────────────────────────────────────
  it('T12: ALWAYS_REDACTED_FROM_CCIE_INTERFACE includes all 4 forbidden fields', () => {
    const required = ['ollie_to_max', 'max_to_ollie', 'askaba_to_provider', 'credit_type'];
    for (const field of required) {
      expect(ALWAYS_REDACTED_FROM_CCIE_INTERFACE).toContain(field);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // BONUS: applyJournalRedaction integration — full end-to-end through middleware
  // ───────────────────────────────────────────────────────────────────────────
  it('Integration: applyJournalRedaction produces patient view with no clinical fields', () => {
    const entries = [
      buildFullEntry({ entry_id: 'a' }),
      buildFullEntry({ entry_id: 'b' })
    ];

    const result = applyJournalRedaction(entries, {
      target_interface: 'CCIE-interface'
    });

    expect(result.redaction_applied).toBe(true);
    expect(result.fields_redacted).toEqual(
      expect.arrayContaining(['ollie_to_max', 'max_to_ollie', 'askaba_to_provider', 'credit_type'])
    );
    for (const view of result.redacted) {
      expect(Object.prototype.hasOwnProperty.call(view, 'ollie_to_max')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(view, 'max_to_ollie')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(view, 'askaba_to_provider')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(view, 'credit_type')).toBe(false);
    }
  });
});
