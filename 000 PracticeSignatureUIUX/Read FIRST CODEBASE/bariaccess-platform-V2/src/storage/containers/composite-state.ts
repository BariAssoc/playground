/**
 * COSMOS CONTAINER: composite-state
 * 
 * Source canon:
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §6.1 (NEW container per G2)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §6 (SQL query patterns)
 * 
 * Stores current state for each of 8 composites per user.
 * One document per `${userId}_${compositeName}` pair.
 * Composite irreversibility rule (G2 OQ-PATCH-05 closure): never reverts to accruing.
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_NEVER,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { CompositeStateRecord } from '../../types/composite.js';

// Re-export the document shape
export type CompositeStateDocument = CompositeStateRecord;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const COMPOSITE_STATE_SPEC: ContainerSpec = {
  containerName: 'composite-state',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_NEVER, // composite state is durable
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [],
    compositeIndexes: [
      // Per G2 §6.1: composite index `[userId, state]` for fast Signal 4 queries
      [
        { path: '/userId', order: 'ascending' },
        { path: '/state', order: 'ascending' }
      ]
    ]
  },
  appendOnly: false, // upsert pattern (each composite has one document)
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §6.1'
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export function buildCompositeStateId(
  userId: string,
  compositeName: CompositeStateRecord['compositeName']
): string {
  return `${userId}_${compositeName}`;
}
