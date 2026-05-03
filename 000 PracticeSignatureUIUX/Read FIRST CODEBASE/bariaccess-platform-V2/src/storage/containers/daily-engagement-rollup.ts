/**
 * COSMOS CONTAINER: daily-engagement-rollup
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §6.3 (NEW container per G3)
 * 
 * Per-user-per-day rollup feeding Resolver Signal 4 (slot_drift_count_24h)
 * and Signal 5 (FSI/ORI 7-day metrics).
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_365_DAYS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { DailyEngagementRollup } from '../../types/slot.js';

export type DailyEngagementRollupDocument = DailyEngagementRollup;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const DAILY_ENGAGEMENT_ROLLUP_SPEC: ContainerSpec = {
  containerName: 'daily-engagement-rollup',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_365_DAYS, // align with transition log retention
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [{ path: '/fcs_by_family/*' }],
    compositeIndexes: [
      [
        { path: '/userId', order: 'ascending' },
        { path: '/date', order: 'descending' }
      ]
    ]
  },
  appendOnly: false, // rollups upserted on nightly recompute
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'CCO-UX-RBSHELF-PATCH-001 v1.0 §6.3'
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export function buildDailyEngagementRollupId(userId: string, date: string): string {
  return `${userId}_${date}`;
}
