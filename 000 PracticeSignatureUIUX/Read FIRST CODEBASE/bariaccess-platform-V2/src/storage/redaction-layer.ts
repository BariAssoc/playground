/**
 * REDACTION LAYER — HIPAA-Critical Enforcement
 * 
 * ⚠️ HIPAA-CRITICAL ⚠️
 * 
 * Source canon:
 *   - PAC-ISE-006 v1.0A §4 (per-field visibility matrix)
 *   - PAC-ISE-006 v1.0A §6 (redaction levels + application logic)
 *   - PAC-ISE-006 v1.0A §10 (edge cases + conflict resolution)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §4 (per-column journal visibility)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §6 (API enforcement reference impl)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §7 (12 mandatory acceptance tests)
 * 
 * CRITICAL: All redaction MUST happen at this API layer, not at frontend.
 * Per PAC-ISE-006 §10.3: "Redaction enforced at API layer, not client."
 * 
 * Patient endpoint must NEVER receive these fields under any circumstance:
 *   - ollie_to_max
 *   - max_to_ollie
 *   - askaba_to_provider
 *   - credit_type
 * 
 * Per G5 §6.3: This module constructs new objects with explicit fields.
 * It does NOT use spread/destructuring with delete — those leave detectable
 * traces in JSON serialization that could leak through edge cases.
 */

import type {
  JournalEntryFull,
  JournalEntryPatientView,
  JournalEntryProviderView,
  InterfaceLayer
} from '../types/journal.js';
import type {
  ISEPayload,
  GovernanceBlock,
  Contributor
} from '../types/ise.js';
import type { RedactionLevel } from '../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL REDACTION (G5 §6.3 — HIPAA CRITICAL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fields ALWAYS redacted from CCIE-interface (patient view).
 * Existence of these fields must NEVER be signaled to patient.
 */
export const ALWAYS_REDACTED_FROM_CCIE_INTERFACE = [
  'ollie_to_max',
  'max_to_ollie',
  'askaba_to_provider',
  'credit_type'
] as const;

/**
 * Redact a journal entry for the CCIE-interface (patient app).
 * 
 * CRITICAL: Constructs new object with explicit fields.
 * Does NOT use spread/destructuring with delete.
 * 
 * Per G5 §7 acceptance tests T1-T12, this function MUST satisfy:
 *   T1: Output never contains `ollie_to_max` field
 *   T2: Output never contains `max_to_ollie` field
 *   T3: Output never contains `askaba_to_provider` field (even when value is false)
 *   T4: Output never contains `credit_type` field
 *   T5: When askaba_to_provider=true, output is byte-identical to false case
 * 
 * @param entry — full journal entry from storage
 * @returns patient-view safe payload
 */
export function redactJournalForPatient(
  entry: JournalEntryFull
): JournalEntryPatientView {
  // Explicit field copy — DO NOT use spread/destructuring
  return {
    entry_id: entry.entry_id,
    category: entry.category,
    entry: entry.entry,
    question: entry.question,
    ollie_to_mark_first: entry.ollie_to_mark_first,
    ollie_to_mark_second: entry.ollie_to_mark_second
    // INTENTIONALLY OMITTED:
    //   - ollie_to_max (HIPAA CRITICAL)
    //   - max_to_ollie (HIPAA CRITICAL)
    //   - askaba_to_provider (existence not signaled)
    //   - credit_type (no CPIE/CCIE leakage)
    //   - revoked_at, revoked_reason, revocation_audit_id
  };
}

/**
 * Pass-through for provider view — no redaction.
 * Provider receives full 9 columns + credit_type.
 * 
 * @param entry — full journal entry from storage
 * @returns provider-view payload (full 9 columns)
 */
export function getJournalForProvider(
  entry: JournalEntryFull
): JournalEntryProviderView {
  // Provider sees everything. Type alias makes the interface explicit.
  return entry;
}

/**
 * Filter out revoked entries from a list.
 * Per G5 §6.4: revoked_at IS NOT NULL → entry NOT returned by ANY endpoint
 * (except internal audit endpoint with include_revoked=true flag).
 */
export function filterRevoked<T extends JournalEntryFull>(
  entries: T[],
  includeRevoked: boolean = false
): T[] {
  if (includeRevoked) {
    return entries; // internal/audit only
  }
  return entries.filter((e) => e.revoked_at === null);
}

// ─────────────────────────────────────────────────────────────────────────────
// ISE PAYLOAD REDACTION (PAC-ISE-006 §6 — applyRedaction reference impl)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reason codes hidden from CCIE-interface per PAC-ISE-006 §4.2.
 */
const HIDDEN_FROM_CCIE_REASON_CODES: ReadonlySet<string> = new Set([
  'ALCOHOL_MARKER',
  'ILLNESS_FLAG',
  'MEDICATION_CHANGE',
  'GOV_RESTRICTED_MODE',
  'CLINICAL_INTERSECTION_ACTIVE',
  'SAFETY_REVIEW_REQUIRED',
  'ACTIONS_LIMITED_BY_GOVERNANCE'
]);

function filterReasonCodesForCCIE(codes: string[]): string[] {
  return codes.filter((code) => !HIDDEN_FROM_CCIE_REASON_CODES.has(code));
}

function filterContributorsForCCIE(contributors: Contributor[]): Contributor[] {
  return contributors
    .filter((c) => c.domain !== 'governance')
    .map((c) => {
      if (c.domain === 'biometric') {
        // Per PAC-ISE-006 §4.3: CCIE biometric — direction only, no note
        return { domain: c.domain, direction: c.direction };
      }
      return c;
    });
}

/**
 * Apply redaction to an ISEPayload based on target interface layer.
 * 
 * Per PAC-ISE-006 §6 reference implementation.
 */
export function applyISEPayloadRedaction(
  payload: ISEPayload,
  targetLayer: InterfaceLayer,
  redactionLevel: RedactionLevel = 'none'
): ISEPayload {
  // Internal layer — no redaction
  if (targetLayer === 'Internal') {
    return payload;
  }

  // Build redacted shape explicitly (avoid spread leakage)
  const redacted: ISEPayload = {
    version: payload.version,
    generatedAt: payload.generatedAt,
    state: payload.state,
    reasonCodes: payload.reasonCodes,
    contributors: payload.contributors,
    render: payload.render,
    cta: payload.cta,
    ollie: payload.ollie
    // governance intentionally omitted; only added back for CPIE
  };

  if (targetLayer === 'CCIE-interface') {
    // 1. Always remove governance block for CCIE
    // (already not copied above)

    // 2. Filter reason codes
    redacted.reasonCodes = filterReasonCodesForCCIE(payload.reasonCodes);

    // 3. Filter contributors
    redacted.contributors = filterContributorsForCCIE(payload.contributors);

    // 4. Hide restricted actions list (effect only, per PAC-ISE-006 §4.5)
    redacted.cta = {
      ...redacted.cta,
      restrictedActions: []
    };

    // 5. ISE-5 with strict redaction → minimal disclosure (PAC-ISE-006 §5.2.1)
    if (redactionLevel === 'strict') {
      redacted.reasonCodes = [];
      redacted.contributors = [];
    }

    return redacted;
  }

  if (targetLayer === 'CPIE-interface') {
    // CPIE sees governance block when present
    if (payload.governance) {
      redacted.governance = payload.governance;
    }
    return redacted;
  }

  // Exhaustiveness check
  const _exhaustive: never = targetLayer;
  throw new Error(`applyISEPayloadRedaction: Unknown layer: ${String(_exhaustive)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHORIZATION GATE (G5 §6.2)
// ─────────────────────────────────────────────────────────────────────────────

export type RoleClaim = 'patient' | 'clinician' | 'system' | 'audit';

/**
 * Verify role can access target interface.
 * Per G5 §6.2 + PAC-ISE-006 §7.2.
 */
export function isRoleAuthorizedForInterface(
  role: RoleClaim,
  target: InterfaceLayer
): boolean {
  switch (target) {
    case 'CCIE-interface':
      // Patient (self) only
      return role === 'patient';
    case 'CPIE-interface':
      // Clinician (with verified patient relationship — checked separately)
      return role === 'clinician';
    case 'Internal':
      // System or audit
      return role === 'system' || role === 'audit';
    default: {
      const _exhaustive: never = target;
      throw new Error(`isRoleAuthorizedForInterface: Unknown layer: ${String(_exhaustive)}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE HEADER BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export function buildRedactionHeaders(
  layer: InterfaceLayer,
  redactionApplied: boolean
): Record<string, string> {
  return {
    'X-Card-Visibility': layer,
    'X-Journal-Redaction-Applied': redactionApplied ? 'true' : 'false',
    'X-Patch-Version': 'CCO-UX-CARD-COMM-PATCH-001 v1.0'
  };
}

// Re-export GovernanceBlock for convenience
export type { GovernanceBlock };
