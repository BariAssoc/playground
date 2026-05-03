/**
 * COSMOS CONTAINER: effort-daily-rollup
 * 
 * Source canon:
 *   - CCO-FAB-001-PIN-001 v1.0 §4 (Effort Score canonical formula)
 *   - CCO-FAB-001-PIN-001 v1.0 §6 (storage hooks)
 *   - CCO-PAC-ISE-002-PATCH-001 v1.0 (Resolver reads from this rollup, not recompute)
 * 
 * Per-user-per-day Effort Score snapshot. Resolver Signal 6 (Trajectory) reads
 * `effort_score_daily` from this container — does NOT recompute Effort.
 * 
 * Formula authority: G1 §4 — E = 0.40·F + 0.30·C + 0.30·LC
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_365_DAYS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { EffortScoreDaily } from '../../types/fab.js';

export type EffortDailyRollupDocument = EffortScoreDaily;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const EFFORT_DAILY_ROLLUP_SPEC: ContainerSpec = {
  containerName: 'effort-daily-rollup',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_365_DAYS,
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [{ path: '/inputs/learning_coefficient/*' }],
    compositeIndexes: [
      [
        { path: '/user_id', order: 'ascending' },
        { path: '/date', order: 'descending' }
      ]
    ]
  },
  appendOnly: false, // upsert per (user_id, date)
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'CCO-FAB-001-PIN-001 v1.0 §6'
};

export function buildEffortDailyRollupId(userId: string, date: string): string {
  return `${userId}_${date}`;
}
