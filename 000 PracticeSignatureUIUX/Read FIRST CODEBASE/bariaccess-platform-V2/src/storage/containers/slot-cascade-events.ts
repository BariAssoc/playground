/**
 * COSMOS CONTAINER: slot-cascade-events
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §5.3 (cascade event schema)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §6.2 (NEW container per G3)
 * 
 * APPEND-ONLY log of all cascade fires.
 * TTL 90 days.
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_90_DAYS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { SlotCascadeFireEvent } from '../../types/slot.js';

export type SlotCascadeEventDocument = SlotCascadeFireEvent;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const SLOT_CASCADE_EVENTS_SPEC: ContainerSpec = {
  containerName: 'slot-cascade-events',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_90_DAYS,
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [{ path: '/surfaces_lit/*' }],
    compositeIndexes: [
      [
        { path: '/userId', order: 'ascending' },
        { path: '/timestamp', order: 'descending' }
      ]
    ]
  },
  appendOnly: true, // ❗ append-only log
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'CCO-UX-RBSHELF-PATCH-001 v1.0 §6.2'
};
