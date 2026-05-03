/**
 * VISIBILITY MATRIX — Codification of PAC-ISE-006 + G5 visibility rules
 * 
 * Source canon:
 *   - PAC-ISE-006 v1.0A §4 (full visibility matrix)
 *   - PAC-ISE-006 v1.0A §6 (redaction levels)
 *   - PAC-ISE-006 v1.0A §10 (edge cases + conflict resolution)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §4 (per-column journal visibility)
 *   - ISE Canon v3.0 §17 (CPIE/CCIE dual-meaning disambiguation)
 * 
 * This module is the source-of-truth for "who sees what, in what form."
 * The redaction-layer module (src/storage/redaction-layer.ts) consumes this
 * matrix to filter payloads at the API boundary.
 * 
 * ⚠️ HIPAA-CRITICAL: Modifications require canon update.
 */

import type { InterfaceLayer } from '../types/journal.js';

// ─────────────────────────────────────────────────────────────────────────────
// MATRIX ENTRY — what each (field, interface) pair allows
// ─────────────────────────────────────────────────────────────────────────────

export type FieldVisibility =
  | 'visible'       // returned in full
  | 'redacted'      // returned with light redaction (e.g. note stripped)
  | 'hidden';       // entirely absent from payload (existence not signaled)

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL FIELDS (G5 §4) — per-column visibility
// 
// These are the 9 canonical Journal Entry Algorithm columns plus credit_type.
// The four redacted fields below are NEVER returned to CCIE-interface.
// ─────────────────────────────────────────────────────────────────────────────

export type JournalField =
  | 'entry_id'
  | 'category'
  | 'entry'
  | 'question'
  | 'ollie_to_mark_first'
  | 'ollie_to_max'
  | 'max_to_ollie'
  | 'ollie_to_mark_second'
  | 'askaba_to_provider'
  | 'credit_type';

export const JOURNAL_VISIBILITY_MATRIX: Readonly<
  Record<JournalField, Readonly<Record<InterfaceLayer, FieldVisibility>>>
> = {
  entry_id:                { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  category:                { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  entry:                   { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  question:                { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  ollie_to_mark_first:     { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  ollie_to_max:            { 'CCIE-interface': 'hidden',   'CPIE-interface': 'visible',  'Internal': 'visible' },
  max_to_ollie:            { 'CCIE-interface': 'hidden',   'CPIE-interface': 'visible',  'Internal': 'visible' },
  ollie_to_mark_second:    { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  askaba_to_provider:      { 'CCIE-interface': 'hidden',   'CPIE-interface': 'visible',  'Internal': 'visible' },
  credit_type:             { 'CCIE-interface': 'hidden',   'CPIE-interface': 'visible',  'Internal': 'visible' }
} as const;

/** Convenience: fields that are NEVER returned to CCIE-interface (G5 §4) */
export const JOURNAL_FIELDS_HIDDEN_FROM_CCIE: ReadonlyArray<JournalField> = [
  'ollie_to_max',
  'max_to_ollie',
  'askaba_to_provider',
  'credit_type'
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// ISE PAYLOAD FIELDS (PAC-ISE-006 §4)
// 
// These map ISEPayload top-level keys to per-interface visibility.
// The redaction-layer module applies these.
// ─────────────────────────────────────────────────────────────────────────────

export type ISEPayloadField =
  | 'version'
  | 'generatedAt'
  | 'state'
  | 'reasonCodes'
  | 'contributors'
  | 'render'
  | 'cta'
  | 'ollie'
  | 'governance';

export const ISE_PAYLOAD_VISIBILITY_MATRIX: Readonly<
  Record<ISEPayloadField, Readonly<Record<InterfaceLayer, FieldVisibility>>>
> = {
  version:        { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  generatedAt:    { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  state:          { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  // reasonCodes filtered per PAC-ISE-006 §4.2 (some hidden from CCIE)
  reasonCodes:    { 'CCIE-interface': 'redacted', 'CPIE-interface': 'visible',  'Internal': 'visible' },
  // Contributors — biometric domain redacted on CCIE per PAC-ISE-006 §4.3
  contributors:   { 'CCIE-interface': 'redacted', 'CPIE-interface': 'visible',  'Internal': 'visible' },
  render:         { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  // CTA restrictedActions list hidden per PAC-ISE-006 §4.5
  cta:            { 'CCIE-interface': 'redacted', 'CPIE-interface': 'visible',  'Internal': 'visible' },
  ollie:          { 'CCIE-interface': 'visible',  'CPIE-interface': 'visible',  'Internal': 'visible' },
  // Governance block ONLY visible to CPIE
  governance:     { 'CCIE-interface': 'hidden',   'CPIE-interface': 'visible',  'Internal': 'visible' }
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// REASON CODES HIDDEN FROM CCIE-INTERFACE (PAC-ISE-006 §4.2)
// 
// These reason codes carry clinical/governance context that must NEVER appear
// on the patient surface. Mirrors the constant in redaction-layer.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const REASON_CODES_HIDDEN_FROM_CCIE: ReadonlySet<string> = new Set([
  'ALCOHOL_MARKER',
  'ILLNESS_FLAG',
  'MEDICATION_CHANGE',
  'GOV_RESTRICTED_MODE',
  'CLINICAL_INTERSECTION_ACTIVE',
  'SAFETY_REVIEW_REQUIRED',
  'ACTIONS_LIMITED_BY_GOVERNANCE'
]);

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getJournalFieldVisibility(
  field: JournalField,
  layer: InterfaceLayer
): FieldVisibility {
  return JOURNAL_VISIBILITY_MATRIX[field][layer];
}

export function getISEPayloadFieldVisibility(
  field: ISEPayloadField,
  layer: InterfaceLayer
): FieldVisibility {
  return ISE_PAYLOAD_VISIBILITY_MATRIX[field][layer];
}

export function isReasonCodeHiddenFromCCIE(code: string): boolean {
  return REASON_CODES_HIDDEN_FROM_CCIE.has(code);
}
