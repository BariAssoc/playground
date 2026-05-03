/**
 * COSMOS CONTAINER: ise-current-state
 * 
 * Source canon:
 *   - PAC-ISE-004 v1.0A §3.1
 * 
 * Stores the latest resolved ISE state per user. Upserted on each resolve.
 * No TTL (always keep latest state).
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_NEVER,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { ISEPayload, ISEState } from '../../types/ise.js';
import type { Contributor, GovernanceBlock } from '../../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const ISE_CURRENT_STATE_SPEC: ContainerSpec = {
  containerName: 'ise-current-state',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_NEVER, // always keep latest
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    // Per PAC-ISE-004 §3.1: exclude render/cta/ollie tokens (not queried)
    excludedPaths: [
      { path: '/render/*' },
      { path: '/cta/*' },
      { path: '/ollie/*' }
    ]
  },
  appendOnly: false, // upsert pattern
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'PAC-ISE-004 v1.0A §3.1'
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT SHAPE
// ─────────────────────────────────────────────────────────────────────────────

export interface ISECurrentStateDocument {
  /** Document ID = userId */
  id: string;
  /** Partition key */
  userId: string;
  version: 'v1.0A';
  state: ISEState;
  resolvedAt: string; // ISO 8601
  reasonCodes: string[]; // max 10
  contributors: Contributor[];
  render: ISEPayload['render'];
  cta: ISEPayload['cta'];
  ollie: ISEPayload['ollie'];
  governance?: GovernanceBlock;
  _ts?: number; // Cosmos auto
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function buildCurrentStateDoc(
  userId: string,
  payload: ISEPayload
): ISECurrentStateDocument {
  return {
    id: userId,
    userId,
    version: payload.version,
    state: payload.state,
    resolvedAt: payload.generatedAt,
    reasonCodes: payload.reasonCodes,
    contributors: payload.contributors,
    render: payload.render,
    cta: payload.cta,
    ollie: payload.ollie,
    ...(payload.governance ? { governance: payload.governance } : {})
  };
}
