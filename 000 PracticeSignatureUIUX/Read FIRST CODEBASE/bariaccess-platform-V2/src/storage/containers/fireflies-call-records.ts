/**
 * COSMOS CONTAINER: fireflies-call-records
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §4.3 (NEW container, Phase 1 capture only)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §4.5 (HIPAA Phase 1 ship blockers)
 * 
 * ⚠️ HIPAA-CRITICAL ⚠️
 * 
 * No Fireflies call ingestion until ALL three blockers close:
 *   1. Fireflies BAA executed
 *   2. Voice consent UX shipped (default OFF)
 *   3. HIPAA-compliant audio storage (encrypted blob + RBAC + audit log)
 * 
 * Voice does NOT contribute to Resolver in Phase 1. Stranded data captured
 * silently for Phase 2+ activation.
 * 
 * TTL per HIPAA retention: 6 years (45 CFR §164.530(j)(2))
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_HIPAA_6_YEARS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { FirefliesCallRecord } from '../../types/voice.js';

export type FirefliesCallDocument = FirefliesCallRecord;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const FIREFLIES_CALL_RECORDS_SPEC: ContainerSpec = {
  containerName: 'fireflies-call-records',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_HIPAA_6_YEARS, // HIPAA retention
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [
      { path: '/voice_signal_input/*' } // not queried; Phase 2+ analysis output
    ],
    compositeIndexes: [
      [
        { path: '/userId', order: 'ascending' },
        { path: '/call_started_at', order: 'descending' }
      ]
    ]
  },
  appendOnly: false, // Phase 2+ may update voice_signal_input after analysis
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'DEV-WORK-D0LITE-PATCH-001 v1.0 §4.3'
};
