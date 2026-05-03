/**
 * ROLE CHECK — Authorization gate
 * 
 * Source canon:
 *   - PAC-ISE-006 v1.0A §7.2 (RBAC requirements)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §6.2 (role-based access)
 * 
 * Pure auth helpers. Express integration lives in middleware layer.
 * 
 * Pamela authentication note (G5 OQ-CARD-PATCH-01 default):
 *   Pamela authenticates as `role: 'clinician'` (clinician-equivalent under
 *   BariAccess BAA). She accesses the CPIE-interface endpoints. May be re-scoped
 *   to a distinct BBS tier if counsel requires.
 */

import type { InterfaceLayer, RequesterRole } from '../../types/journal.js';
import { isRoleAuthorizedForInterface } from '../../storage/redaction-layer.js';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONTEXT — what the API expects after token validation
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthContext {
  /** ID of the authenticated user making the request */
  user_id: string;
  /** Role claim from validated token */
  role: RequesterRole;
  /**
   * For clinicians: list of patient userIds they have a verified relationship with.
   * Empty array for non-clinicians.
   * Resolved server-side from clinician-patient relationship table.
   */
  authorized_patient_ids: ReadonlyArray<string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS DECISIONS
// ─────────────────────────────────────────────────────────────────────────────

export type AccessDecision =
  | { allowed: true; reason: 'self' | 'verified_clinician_relationship' | 'system_or_audit' }
  | { allowed: false; reason: 'role_mismatch' | 'no_clinician_relationship' | 'cross_patient_access_denied' };

/**
 * Determine whether the authenticated user can access the target interface
 * for a specific patient userId.
 */
export function checkAccess(
  auth: AuthContext,
  target_patient_id: string,
  target_interface: InterfaceLayer
): AccessDecision {
  // Step 1: role-to-interface compatibility
  if (!isRoleAuthorizedForInterface(auth.role, target_interface)) {
    return { allowed: false, reason: 'role_mismatch' };
  }

  // Step 2: scope verification per role
  switch (auth.role) {
    case 'patient': {
      // CCIE-interface only, and only for self
      if (auth.user_id !== target_patient_id) {
        return { allowed: false, reason: 'cross_patient_access_denied' };
      }
      return { allowed: true, reason: 'self' };
    }
    case 'clinician': {
      // CPIE-interface, must have verified relationship
      if (!auth.authorized_patient_ids.includes(target_patient_id)) {
        return { allowed: false, reason: 'no_clinician_relationship' };
      }
      return { allowed: true, reason: 'verified_clinician_relationship' };
    }
    case 'system':
    case 'audit': {
      // Internal or any layer — system/audit roles have full read scope
      return { allowed: true, reason: 'system_or_audit' };
    }
    default: {
      const _exhaustive: never = auth.role;
      void _exhaustive;
      return { allowed: false, reason: 'role_mismatch' };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP STATUS MAPPING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map an access decision to an HTTP status code.
 * Per G5 §7 T10: a CCIE caller requesting CPIE view returns 403, NOT 200 with
 * redaction — we don't signal that a richer view exists.
 */
export function accessDecisionToHTTPStatus(decision: AccessDecision): 200 | 403 {
  return decision.allowed ? 200 : 403;
}
