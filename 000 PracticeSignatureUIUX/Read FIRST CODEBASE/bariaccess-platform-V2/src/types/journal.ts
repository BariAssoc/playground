/**
 * JOURNAL — Journal Entry Algorithm + redaction views
 * 
 * Source canon:
 *   - Memory Rule April 24, 2026 — Journal Entry Algorithm columns (9 columns, 125-char cap)
 *   - MEMO-CARD-COMM-001 §3 (Cards → Journal bridge)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §2 (CPIE/CCIE dual-meaning disambiguation)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §3 (9 columns)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §4 (per-column visibility matrix — HIPAA CRITICAL)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §6.4 (consent revocation — soft-delete with revoked_at)
 * 
 * This file defines TYPES ONLY.
 * 
 * ⚠️ HIPAA-CRITICAL: G5 §7 acceptance tests T1-T12 are MANDATORY before Phase 1 ship.
 *    Patient-view never receives ollie_to_max, max_to_ollie, askaba_to_provider,
 *    or credit_type fields. Existence of these fields is NEVER signaled.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CPIE/CCIE DUAL-MEANING DISAMBIGUATION (G5 §2)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CPIE-credit / CCIE-credit — credit types (platform-wide canonical, ISE Canon v3.0 §17)
 * 
 * - CPIE-credit = Continue PATIENT Involvement and Education (clinical, HIPAA-tagged)
 * - CCIE-credit = Continue CUSTOMER Involvement and Education (wellness, non-clinical)
 */
export type CreditType = 'CPIE-credit' | 'CCIE-credit';

/**
 * CPIE-interface / CCIE-interface — interface layers (PAC-ISE-006 internal shorthand)
 * 
 * - CPIE-interface = Clinical/Provider Interface (Provider Dashboard, Pamela's BBS console)
 * - CCIE-interface = Consumer/Wellness Interface (Patient app, Memory Lane card)
 */
export type InterfaceLayer = 'CCIE-interface' | 'CPIE-interface' | 'Internal';

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL ENTRY — FULL (Internal + CPIE-interface)
// G5 §3 — 9 columns + credit_type + 125-char cap per cell
// ─────────────────────────────────────────────────────────────────────────────

export interface JournalEntryFull {
  entry_id: string;
  category: string; // FAB family / domain
  entry: string; // patient action / state
  question: string; // anchored journal question

  // 5 utterance/reasoning columns
  ollie_to_mark_first: string;
  ollie_to_max: string; // ⚠️ CPIE-interface only — NEVER in patient view
  max_to_ollie: string; // ⚠️ CPIE-interface only — NEVER in patient view
  ollie_to_mark_second: string;
  askaba_to_provider: boolean | null; // ⚠️ CPIE-interface only — existence not signaled

  // Credit type tagging
  credit_type: CreditType; // ⚠️ NEVER returned to CCIE-interface

  // Soft-delete fields (G5 §6.4 — OQ-CARD-PATCH-03 default)
  revoked_at: string | null;
  revoked_reason: string | null;
  revocation_audit_id: string | null;

  _ts?: number; // Cosmos auto
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL ENTRY — PATIENT VIEW (CCIE-interface)
// G5 §6.3 — 5 columns ONLY. Three clinical columns + credit_type NEVER sent over wire.
// ─────────────────────────────────────────────────────────────────────────────

export interface JournalEntryPatientView {
  entry_id: string;
  category: string;
  entry: string;
  question: string;
  ollie_to_mark_first: string;
  ollie_to_mark_second: string;
  // INTENTIONALLY OMITTED:
  //   - ollie_to_max (HIPAA CRITICAL)
  //   - max_to_ollie (HIPAA CRITICAL)
  //   - askaba_to_provider (existence not signaled)
  //   - credit_type (no CPIE/CCIE leakage)
  //   - revoked_at, revoked_reason, revocation_audit_id (revoked entries not returned)
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL ENTRY — PROVIDER VIEW (CPIE-interface)
// G5 §6.3 — full 9 columns + credit_type
// ─────────────────────────────────────────────────────────────────────────────

export type JournalEntryProviderView = JournalEntryFull;

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTER LIMIT (Memory Rule April 24, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const JOURNAL_CELL_MAX_CHARS = 125 as const;

// ─────────────────────────────────────────────────────────────────────────────
// CARD ORIGIN PATHS (MEMO-CARD-COMM-001 §2 + G5 §5)
// ─────────────────────────────────────────────────────────────────────────────

export type CardOrigin =
  | 'program_originated'           // Origin #1 — Rhythm Board card area
  | 'q_originated'                  // Origin #2 — Q dropdown context
  | 'constellation_panel_originated' // Origin #3 — CP tile / tracker
  | 'bookshelf_originated'          // Origin #4 — Slot Card on Bookshelf
  | 'provider_originated';          // Origin #5 — Provider Dashboard (G5 §5 addition)

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG ENTRY (G5 §6.2 + PAC-ISE-006 §8 — every access logged)
// ─────────────────────────────────────────────────────────────────────────────

export type RequesterRole = 'patient' | 'clinician' | 'system' | 'audit';

export interface JournalAccessAuditEntry {
  audit_id: string;
  entry_id: string;
  userId: string;
  accessed_at: string; // ISO 8601
  requesting_user_id: string;
  requester_role: RequesterRole;
  interface: InterfaceLayer;
  redaction_applied: boolean;
  fields_redacted: string[]; // names of columns filtered out
  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE HEADERS (G5 §6.2)
// ─────────────────────────────────────────────────────────────────────────────

export interface JournalAPIResponseHeaders {
  'X-Card-Visibility': InterfaceLayer;
  'X-Journal-Redaction-Applied': 'true' | 'false';
  'X-Patch-Version': 'CCO-UX-CARD-COMM-PATCH-001 v1.0';
}
