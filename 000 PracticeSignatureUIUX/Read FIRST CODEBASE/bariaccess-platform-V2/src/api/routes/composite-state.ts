/**
 * ROUTE: GET /v1/composites
 * 
 * Source canon:
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §6 (composite queries)
 *   - Beacon Canon v1.1 §15 (8 composite scoring hierarchy)
 * 
 * Returns the per-composite state record set for a patient. CCIE patients see
 * their own composites (live ones with band + score; accruing ones with
 * unlock_trigger only). CPIE clinicians see the same plus underlying detail.
 */

import type { CompositeStateRecord } from '../../types/composite.js';
import type { InterfaceLayer } from '../../types/journal.js';
import { checkAccess, type AuthContext } from '../auth/role-check.js';

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST / RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export interface ListCompositeStatesRequest {
  auth: AuthContext;
  target_user_id: string;
  view?: 'patient' | 'provider';
}

export interface ListCompositeStatesResponse {
  status: 200 | 403 | 500;
  body: ReadonlyArray<CompositeStateView> | { error: string };
  headers: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW SHAPES
// ─────────────────────────────────────────────────────────────────────────────

/** Patient-facing slim view — never exposes `last_cascade_fired_at` or recompute timing */
export interface CompositeStateView {
  composite_name: CompositeStateRecord['compositeName'];
  state: CompositeStateRecord['state'];
  /** Only present when state = "live" */
  score_0_100: number | null;
  beacon_band: CompositeStateRecord['beacon_band'];
  confidence: CompositeStateRecord['confidence'];
  /** Always present; for accruing this is the unlock spec */
  unlock_trigger: string;
  unlock_progress: number;
  /** ISO 8601 — when transitioned to live (null while accruing) */
  unlocked_at: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE GATEWAY
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeStorageGateway {
  listCompositesForUser(userId: string): Promise<ReadonlyArray<CompositeStateRecord>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const VIEW_TO_INTERFACE: Readonly<
  Record<NonNullable<ListCompositeStatesRequest['view']>, InterfaceLayer>
> = {
  patient: 'CCIE-interface',
  provider: 'CPIE-interface'
};

export async function handleListCompositeStates(
  req: ListCompositeStatesRequest,
  storage: CompositeStorageGateway
): Promise<ListCompositeStatesResponse> {
  const view = req.view ?? 'patient';
  const target_interface = VIEW_TO_INTERFACE[view];

  const access = checkAccess(req.auth, req.target_user_id, target_interface);
  if (!access.allowed) {
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  let records: ReadonlyArray<CompositeStateRecord>;
  try {
    records = await storage.listCompositesForUser(req.target_user_id);
  } catch {
    return { status: 500, body: { error: 'Storage error' }, headers: {} };
  }

  // Map to view shape
  const view_records: CompositeStateView[] = records.map((r) => ({
    composite_name: r.compositeName,
    state: r.state,
    score_0_100: r.score_0_100,
    beacon_band: r.beacon_band,
    confidence: r.confidence,
    unlock_trigger: r.unlock_trigger,
    unlock_progress: r.unlock_progress,
    unlocked_at: r.unlocked_at
  }));

  return {
    status: 200,
    body: view_records,
    headers: {
      'X-Composite-View': view
    }
  };
}
