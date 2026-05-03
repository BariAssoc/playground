/**
 * COSMOS CONTAINER: ise-transition-log
 * 
 * Source canon:
 *   - PAC-ISE-004 v1.0A §3.2 (transition log schema)
 *   - PAC-ISE-002 v2.0 §12.3 (signal snapshot block)
 *   - G3 §3 (slot_drift_count_24h field added)
 *   - G6 §5.5 (severity:critical for mental wellbeing override)
 * 
 * APPEND-ONLY container. Every state transition logged for audit.
 * TTL 365 days (default; may extend for clinical-flagged users per CPIE policy).
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_365_DAYS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type {
  ISETransitionLogEntry,
  ISESignalSnapshot,
  ResolverTriggerSource
} from '../../types/audit.js';
import type { ISEState, RedactionLevel } from '../../types/ise.js';
import type { AuditSeverity } from '../../types/audit.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const ISE_TRANSITION_LOG_SPEC: ContainerSpec = {
  containerName: 'ise-transition-log',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_365_DAYS, // PAC-ISE-004 §6
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [{ path: '/contributorSummary/*' }],
    compositeIndexes: [
      // Per PAC-ISE-004 §3.2: composite index for recent history queries
      [
        { path: '/userId', order: 'ascending' },
        { path: '/transitionAt', order: 'descending' }
      ]
    ]
  },
  appendOnly: true, // ❗ no updates or deletes
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'PAC-ISE-004 v1.0A §3.2 + G3 §3 + G6 §5.5'
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT SHAPE — re-export type from audit.ts for convenience
// ─────────────────────────────────────────────────────────────────────────────

export type ISETransitionLogDocument = ISETransitionLogEntry;

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildTransitionLogParams {
  userId: string;
  transitionId: string;
  previousState: ISEState | null;
  newState: ISEState;
  durationInPreviousState: number | null;
  reasonCodes: string[];
  contributorSummary: Array<{ domain: string; direction: string }>;
  triggerSource: ResolverTriggerSource;
  governanceApplied: boolean;
  redactionLevel: RedactionLevel;
  signals?: ISESignalSnapshot;
  /** G6 §5.5 — set to 'critical' for mental wellbeing override events */
  severity?: AuditSeverity;
}

export function buildTransitionLogDoc(
  params: BuildTransitionLogParams
): ISETransitionLogDocument {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    version: 'v1.0A',
    transitionId: params.transitionId,
    previousState: params.previousState,
    newState: params.newState,
    transitionAt: new Date().toISOString(),
    durationInPreviousState: params.durationInPreviousState,
    reasonCodes: params.reasonCodes,
    contributorSummary: params.contributorSummary,
    triggerSource: params.triggerSource,
    governanceApplied: params.governanceApplied,
    redactionLevel: params.redactionLevel,
    ...(params.signals ? { signals: params.signals } : {}),
    severity: params.severity ?? 'info',
    _ttl: TTL_365_DAYS
  };
}
