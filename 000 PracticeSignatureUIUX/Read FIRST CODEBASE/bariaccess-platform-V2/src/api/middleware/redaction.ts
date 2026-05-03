/**
 * REDACTION MIDDLEWARE — Applies G5 enforcement at API layer
 * 
 * Source canon:
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §6 (API enforcement)
 *   - PAC-ISE-006 v1.0A §10.3 ("Redaction enforced at API layer, not client")
 * 
 * Express-compatible middleware factory. Determines target interface from
 * request, applies redaction to journal/ISE payloads, sets response headers.
 * 
 * Usage example (Phase 2E reference; Express integration is Zakiy's choice):
 *   app.get('/v1/journal/entries', requireAuth, journalRedactionMiddleware, handler);
 */

import type {
  JournalEntryFull,
  JournalEntryPatientView,
  JournalEntryProviderView,
  InterfaceLayer
} from '../../types/journal.js';
import type { ISEPayload, RedactionLevel } from '../../types/ise.js';
import {
  redactJournalForPatient,
  getJournalForProvider,
  applyISEPayloadRedaction,
  buildRedactionHeaders,
  filterRevoked
} from '../../storage/redaction-layer.js';

// ─────────────────────────────────────────────────────────────────────────────
// REDACTION CONTEXT — what middleware needs to apply rules
// ─────────────────────────────────────────────────────────────────────────────

export interface RedactionContext {
  target_interface: InterfaceLayer;
  redaction_level?: RedactionLevel;
  include_revoked?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL REDACTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function applyJournalRedaction(
  entries: ReadonlyArray<JournalEntryFull>,
  ctx: RedactionContext
): {
  redacted: ReadonlyArray<JournalEntryPatientView | JournalEntryProviderView>;
  redaction_applied: boolean;
  fields_redacted: string[];
  headers: Record<string, string>;
} {
  // Filter revoked entries (G5 §6.4)
  const live_entries = filterRevoked([...entries], ctx.include_revoked ?? false);

  let redacted: Array<JournalEntryPatientView | JournalEntryProviderView>;
  let redaction_applied = false;
  let fields_redacted: string[] = [];

  switch (ctx.target_interface) {
    case 'CCIE-interface': {
      redacted = live_entries.map(redactJournalForPatient);
      redaction_applied = true;
      fields_redacted = ['ollie_to_max', 'max_to_ollie', 'askaba_to_provider', 'credit_type'];
      break;
    }
    case 'CPIE-interface': {
      redacted = live_entries.map(getJournalForProvider);
      redaction_applied = false;
      fields_redacted = [];
      break;
    }
    case 'Internal': {
      redacted = live_entries; // full document, no redaction
      redaction_applied = false;
      fields_redacted = [];
      break;
    }
    default: {
      const _exhaustive: never = ctx.target_interface;
      throw new Error(`applyJournalRedaction: Unknown layer: ${String(_exhaustive)}`);
    }
  }

  const headers = buildRedactionHeaders(ctx.target_interface, redaction_applied);

  return { redacted, redaction_applied, fields_redacted, headers };
}

// ─────────────────────────────────────────────────────────────────────────────
// ISE PAYLOAD REDACTION HELPER
// ─────────────────────────────────────────────────────────────────────────────

export function applyISERedaction(
  payload: ISEPayload,
  ctx: RedactionContext
): {
  redacted: ISEPayload;
  headers: Record<string, string>;
} {
  const redacted = applyISEPayloadRedaction(
    payload,
    ctx.target_interface,
    ctx.redaction_level ?? 'none'
  );
  const headers = buildRedactionHeaders(
    ctx.target_interface,
    ctx.target_interface !== 'Internal'
  );
  return { redacted, headers };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPRESS-COMPATIBLE FACTORY (lightweight; Zakiy can swap for Fastify/etc.)
// 
// Returns a middleware function that:
//   1. Reads `target_interface` from req.locals (set by auth middleware)
//   2. Wraps res.json to apply redaction before send
//   3. Sets canonical X-* headers
// 
// Note: this is a reference shape. Zakiy may prefer per-route handler logic.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExpressLikeRequest {
  locals?: { redaction_context?: RedactionContext };
}

export interface ExpressLikeResponse {
  setHeader(name: string, value: string): void;
  json(body: unknown): unknown;
}

export type ExpressLikeNext = () => void;

export function createRedactionMiddleware(): (
  req: ExpressLikeRequest,
  res: ExpressLikeResponse,
  next: ExpressLikeNext
) => void {
  return (req, res, next): void => {
    const ctx = req.locals?.redaction_context;
    if (!ctx) {
      // No context set — caller is expected to redact in handler. Pass through.
      next();
      return;
    }

    // Set canonical headers up front
    const headers = buildRedactionHeaders(ctx.target_interface, ctx.target_interface !== 'Internal');
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
    next();
  };
}
