/**
 * ROUTE: GET /v1/slots
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-001 v1.1 §6.5 (17-slot architecture)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §6 (storage hooks)
 * 
 * Returns slot states for a patient on a specific date (default: today
 * patient-local). 17 slots × 1 day = 17 documents.
 */

import type { SlotStateRecord } from '../../types/slot.js';
import type { InterfaceLayer } from '../../types/journal.js';
import { checkAccess, type AuthContext } from '../auth/role-check.js';

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST / RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export interface ListSlotsForDateRequest {
  auth: AuthContext;
  target_user_id: string;
  /** YYYY-MM-DD; defaults to caller's interpretation of "today" */
  date: string;
  view?: 'patient' | 'provider';
}

export interface ListSlotsForDateResponse {
  status: 200 | 400 | 403 | 500;
  body: ReadonlyArray<SlotStateRecord> | { error: string };
  headers: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE GATEWAY
// ─────────────────────────────────────────────────────────────────────────────

export interface SlotStorageGateway {
  listSlotsForDate(
    userId: string,
    date: string
  ): Promise<ReadonlyArray<SlotStateRecord>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const VIEW_TO_INTERFACE: Readonly<
  Record<NonNullable<ListSlotsForDateRequest['view']>, InterfaceLayer>
> = {
  patient: 'CCIE-interface',
  provider: 'CPIE-interface'
};

export async function handleListSlotsForDate(
  req: ListSlotsForDateRequest,
  storage: SlotStorageGateway
): Promise<ListSlotsForDateResponse> {
  // Defensive date validation
  if (!DATE_REGEX.test(req.date)) {
    return {
      status: 400,
      body: { error: 'Invalid date format; expected YYYY-MM-DD' },
      headers: {}
    };
  }

  const view = req.view ?? 'patient';
  const target_interface = VIEW_TO_INTERFACE[view];

  const access = checkAccess(req.auth, req.target_user_id, target_interface);
  if (!access.allowed) {
    return { status: 403, body: { error: 'Forbidden' }, headers: {} };
  }

  let slots: ReadonlyArray<SlotStateRecord>;
  try {
    slots = await storage.listSlotsForDate(req.target_user_id, req.date);
  } catch {
    return { status: 500, body: { error: 'Storage error' }, headers: {} };
  }

  return {
    status: 200,
    body: slots,
    headers: {
      'X-Slot-View': view,
      'X-Slot-Date': req.date
    }
  };
}
