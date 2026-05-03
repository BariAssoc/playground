/**
 * COSMOS CONTAINER: slot-state
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §6.1 (NEW container per G3)
 * 
 * Stores per-day per-slot state. 17 slots × N days × N users.
 * One document per `${userId}_${date}_${slotId}`.
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_90_DAYS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { SlotStateRecord, SlotId } from '../../types/slot.js';

export type SlotStateDocument = SlotStateRecord;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const SLOT_STATE_SPEC: ContainerSpec = {
  containerName: 'slot-state',
  partitionKeyPath: '/userId',
  // Slot states age out after 90 days (post-window historical, no longer queried)
  defaultTtlSeconds: TTL_90_DAYS,
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [{ path: '/fab_outcomes/*' }],
    compositeIndexes: [
      [
        { path: '/userId', order: 'ascending' },
        { path: '/date', order: 'descending' }
      ],
      [
        { path: '/userId', order: 'ascending' },
        { path: '/lifecycle_state', order: 'ascending' }
      ]
    ]
  },
  appendOnly: false, // slots transition pre_window → in_window → post_window via update
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'CCO-UX-RBSHELF-PATCH-001 v1.0 §6.1'
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export function buildSlotStateId(
  userId: string,
  date: string,
  slotId: SlotId
): string {
  return `${userId}_${date}_${slotId}`;
}
