/**
 * ROUTE: GET /v1/journal/entries
 * 
 * Source canon:
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §4 (per-column visibility matrix)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §6.2 (three-variant API contract)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §6.4 (soft-delete with revoked_at)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §7 (12 mandatory acceptance tests)
 * 
 * ⚠️ HIPAA-CRITICAL ⚠️
 * 
 * Three view variants:
 *   ?view=patient   → CCIE-interface (5 columns; clinical fields HIDDEN)
 *   ?view=provider  → CPIE-interface (full 9 columns + credit_type)
 *   /internal/...   → Internal (full + audit log inclusion option)
 * 
 * Per G5 T10: requesting view=provider as a patient returns 403, NOT 200 with
 * redaction. We never signal that a richer view exists.
 */

import type {
  JournalEntryFull,
  JournalEntryPatientView,
  JournalEntryProviderView,
  InterfaceLayer
} from '../../types/journal.js';
import { applyJournalRedaction } from '../middleware/redaction.js';
import { checkAccess, type AuthContext } from '../auth/role-check.js';
import { recordJournalAccess, type AuditEventSink } from '../middleware/audit.js';

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST / RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export interface ListJournalEntriesRequest {
  auth: AuthContext;
  target_user_id: string;
  view?: 'patient' | 'provider' | 'internal';
  limit?: number;
  /** Internal view only — include revoked entries */
  include_revoked?: boolean;
}

export interface ListJournalEntriesResponse {
  status: 200 | 403 | 500;
  body:
    | ReadonlyArray<JournalEntryPatientView | JournalEntryProviderView>
    | { error: string };
  headers: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE GATEWAY
// ─────────────────────────────────────────────────────────────────────────────

export interface JournalStorageGateway {
  listEntries(
    userId: string,
    options: { limit: number; include_revoked: boolean }
  ): Promise<ReadonlyArray<JournalEntryFull>>;
  getEntry(userId: string, entry_id: string): Promise<JournalEntryFull | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW → INTERFACE MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const VIEW_TO_INTERFACE: Readonly<Record<NonNullable<ListJournalEntriesRequest['view']>, InterfaceLayer>> = {
  patient: 'CCIE-interface',
  provider: 'CPIE-interface',
  internal: 'Internal'
};

// ─────────────────────────────────────────────────────────────────────────────
// LIST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function handleListJournalEntries(
  req: ListJournalEntriesRequest,
  storage: JournalStorageGateway,
  audit_sink: AuditEventSink
): Promise<ListJournalEntriesResponse> {
  const view = req.view ?? 'patient';
  const target_interface = VIEW_TO_INTERFACE[view];

  // Authorize
  const access = checkAccess(req.auth, req.target_user_id, target_interface);
  if (!access.allowed) {
    // Per G5 T10 — 403, no signal of richer view existing
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  // Internal-only flag
  const include_revoked =
    target_interface === 'Internal' ? Boolean(req.include_revoked) : false;

  let entries: ReadonlyArray<JournalEntryFull>;
  try {
    entries = await storage.listEntries(req.target_user_id, {
      limit: req.limit ?? 50,
      include_revoked
    });
  } catch {
    return { status: 500, body: { error: 'Storage error' }, headers: {} };
  }

  // Apply redaction
  const { redacted, redaction_applied, fields_redacted, headers } =
    applyJournalRedaction(entries, {
      target_interface,
      include_revoked
    });

  // Audit each access
  for (const entry of entries) {
    await recordJournalAccess(audit_sink, {
      entry_id: entry.entry_id,
      patient_user_id: req.target_user_id,
      requesting_user_id: req.auth.user_id,
      requester_role: req.auth.role,
      interface_layer: target_interface,
      redaction_applied,
      fields_redacted
    });
  }

  return { status: 200, body: redacted, headers };
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE-ENTRY HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export interface GetJournalEntryRequest {
  auth: AuthContext;
  target_user_id: string;
  entry_id: string;
  view?: 'patient' | 'provider' | 'internal';
}

export interface GetJournalEntryResponse {
  status: 200 | 403 | 404 | 500;
  body: JournalEntryPatientView | JournalEntryProviderView | { error: string };
  headers: Record<string, string>;
}

export async function handleGetJournalEntry(
  req: GetJournalEntryRequest,
  storage: JournalStorageGateway,
  audit_sink: AuditEventSink
): Promise<GetJournalEntryResponse> {
  const view = req.view ?? 'patient';
  const target_interface = VIEW_TO_INTERFACE[view];

  const access = checkAccess(req.auth, req.target_user_id, target_interface);
  if (!access.allowed) {
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  let entry: JournalEntryFull | null;
  try {
    entry = await storage.getEntry(req.target_user_id, req.entry_id);
  } catch {
    return { status: 500, body: { error: 'Storage error' }, headers: {} };
  }

  if (entry === null) {
    return { status: 404, body: { error: 'Not found' }, headers: {} };
  }

  // Per G5 §6.4: revoked entries not returned outside Internal
  if (entry.revoked_at !== null && target_interface !== 'Internal') {
    return { status: 404, body: { error: 'Not found' }, headers: {} };
  }

  const { redacted, redaction_applied, fields_redacted, headers } =
    applyJournalRedaction([entry], { target_interface });

  await recordJournalAccess(audit_sink, {
    entry_id: entry.entry_id,
    patient_user_id: req.target_user_id,
    requesting_user_id: req.auth.user_id,
    requester_role: req.auth.role,
    interface_layer: target_interface,
    redaction_applied,
    fields_redacted
  });

  // redacted[0] is guaranteed by length-1 input; defensive narrowing for type:
  const first = redacted[0];
  if (first === undefined) {
    return { status: 500, body: { error: 'Redaction internal error' }, headers };
  }
  return { status: 200, body: first, headers };
}
