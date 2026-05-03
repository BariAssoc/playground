/**
 * ROUTE: GET /v1/identity/ise
 * 
 * Source canon:
 *   - PAC-ISE-001 v1.0A §6 (ISEPayload v1.0A schema — return shape)
 *   - PAC-ISE-006 v1.0A §7.1 (endpoint contract)
 *   - PAC-ISE-005 v1.0A §9 (fallback handling on Resolver failure)
 * 
 * Returns the current ISEPayload for the authenticated user.
 * Default target interface: CCIE-interface (patient app).
 * Provider variant: pass `view=provider` query param + clinician role.
 * 
 * Framework-agnostic handler. Zakiy wires to Express/Fastify.
 */

import type { ISEPayload } from '../../types/ise.js';
import type { InterfaceLayer, RequesterRole } from '../../types/journal.js';
import type { ISECurrentStateDocument } from '../../storage/containers/ise-current-state.js';
import { applyISERedaction } from '../middleware/redaction.js';
import { checkAccess, type AuthContext } from '../auth/role-check.js';
import { getFallbackDefaults } from '../../payload/ise-defaults.js';
import { ISEState } from '../../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER INPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface GetIdentityISERequest {
  auth: AuthContext;
  /** Path/query param — patient whose ISE is being requested */
  target_user_id: string;
  /** ?view=patient (default) | ?view=provider */
  view?: 'patient' | 'provider' | 'internal';
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface GetIdentityISEResponse {
  status: 200 | 403 | 404 | 500;
  body: ISEPayload | { error: string };
  headers: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE GATEWAY — caller provides Cosmos lookup function
// ─────────────────────────────────────────────────────────────────────────────

export interface IdentityISEStorageGateway {
  getCurrentState(userId: string): Promise<ISECurrentStateDocument | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const VIEW_TO_INTERFACE: Readonly<Record<NonNullable<GetIdentityISERequest['view']>, InterfaceLayer>> = {
  patient: 'CCIE-interface',
  provider: 'CPIE-interface',
  internal: 'Internal'
};

export async function handleGetIdentityISE(
  req: GetIdentityISERequest,
  storage: IdentityISEStorageGateway
): Promise<GetIdentityISEResponse> {
  const view = req.view ?? 'patient';
  const target_interface = VIEW_TO_INTERFACE[view];

  // Step 1: authorize
  const access = checkAccess(req.auth, req.target_user_id, target_interface);
  if (!access.allowed) {
    return {
      status: 403,
      body: { error: 'Forbidden' },
      headers: {}
    };
  }

  // Step 2: load current state
  const doc = await storage.getCurrentState(req.target_user_id).catch(() => null);

  // Step 3: build payload (or fallback per PAC-ISE-005 §9)
  let payload: ISEPayload;
  if (doc === null) {
    // Fallback to ISE-0 defaults — never surface error to patient
    const defaults = getFallbackDefaults();
    payload = {
      version: 'v1.0A',
      generatedAt: new Date().toISOString(),
      state: ISEState.ISE_0_NEUTRAL_BASELINE,
      reasonCodes: ['DEFAULT_BASELINE'],
      contributors: [],
      render: defaults.render,
      cta: defaults.cta,
      ollie: defaults.ollie
    };
  } else {
    payload = {
      version: doc.version,
      generatedAt: doc.resolvedAt,
      state: doc.state,
      reasonCodes: doc.reasonCodes,
      contributors: doc.contributors,
      render: doc.render,
      cta: doc.cta,
      ollie: doc.ollie,
      ...(doc.governance ? { governance: doc.governance } : {})
    };
  }

  // Step 4: apply redaction
  const { redacted, headers } = applyISERedaction(payload, {
    target_interface,
    redaction_level: doc?.governance?.redactionLevel ?? 'none'
  });

  return {
    status: 200,
    body: redacted,
    headers
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — extract role from auth (used by route framework adapters)
// ─────────────────────────────────────────────────────────────────────────────

export function inferTargetInterface(role: RequesterRole, view: GetIdentityISERequest['view']): InterfaceLayer {
  const requested_view = view ?? 'patient';
  const requested_interface = VIEW_TO_INTERFACE[requested_view];
  // Per G5 T10: never auto-downgrade; role-mismatch returns 403 from checkAccess
  void role;
  return requested_interface;
}
