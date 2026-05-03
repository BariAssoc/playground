/**
 * AUDIT MIDDLEWARE — Applies PAC-ISE-007 logging at API boundary
 * 
 * Source canon:
 *   - PAC-ISE-007 v1.0B §7 (compliance logging)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §6.2 (journal access audit)
 * 
 * Reference shape for Express-compatible audit middleware. Reads request
 * context, invokes audit-logger builders, and queues entries for downstream
 * persistence (Cosmos `ise-transition-log` or dedicated audit container).
 */

import type { InterfaceLayer, RequesterRole } from '../../types/journal.js';
import type { JournalAccessAuditEntry, AuditEvent } from '../../types/audit.js';
import {
  buildJournalAccessAudit,
  wrapJournalAccessAsEvent
} from '../../governance/audit-logger.js';

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT QUEUE INTERFACE — caller provides the persistence target
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditEventSink {
  enqueue(event: AuditEvent): void | Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL ACCESS AUDIT HELPER
// ─────────────────────────────────────────────────────────────────────────────

export interface RecordJournalAccessParams {
  entry_id: string;
  patient_user_id: string;
  requesting_user_id: string;
  requester_role: RequesterRole;
  interface_layer: InterfaceLayer;
  redaction_applied: boolean;
  fields_redacted: string[];
}

export async function recordJournalAccess(
  sink: AuditEventSink,
  params: RecordJournalAccessParams
): Promise<JournalAccessAuditEntry> {
  const entry = buildJournalAccessAudit({
    entry_id: params.entry_id,
    userId: params.patient_user_id,
    requesting_user_id: params.requesting_user_id,
    requester_role: params.requester_role,
    interface_layer: params.interface_layer,
    redaction_applied: params.redaction_applied,
    fields_redacted: params.fields_redacted
  });
  await sink.enqueue(wrapJournalAccessAsEvent(entry));
  return entry;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPRESS-COMPATIBLE FACTORY
// 
// The middleware wraps res.json to capture the response, then queues an audit
// event using the request's auth context.
// 
// Reference shape only. Zakiy may prefer per-route audit calls.
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditRequestContext {
  user_id: string;
  role: RequesterRole;
  target_interface: InterfaceLayer;
  /** For journal endpoints — path parameter for entry_id, if any */
  entry_id?: string;
  /** For journal endpoints — patient userId being accessed */
  target_patient_id?: string;
}

export interface AuditMiddlewareDeps {
  sink: AuditEventSink;
  /** Optional pre-resolved redaction state (from upstream redaction middleware) */
  resolve_redaction_meta?: (ctx: AuditRequestContext) => {
    redaction_applied: boolean;
    fields_redacted: string[];
  };
}

export function createAuditMiddleware(deps: AuditMiddlewareDeps) {
  return async function auditMiddleware(
    ctx: AuditRequestContext
  ): Promise<JournalAccessAuditEntry | null> {
    if (!ctx.entry_id || !ctx.target_patient_id) {
      // Not a journal access — caller logs other audit types directly
      return null;
    }
    const meta = deps.resolve_redaction_meta?.(ctx) ?? {
      redaction_applied: false,
      fields_redacted: []
    };
    return recordJournalAccess(deps.sink, {
      entry_id: ctx.entry_id,
      patient_user_id: ctx.target_patient_id,
      requesting_user_id: ctx.user_id,
      requester_role: ctx.role,
      interface_layer: ctx.target_interface,
      redaction_applied: meta.redaction_applied,
      fields_redacted: meta.fields_redacted
    });
  };
}
