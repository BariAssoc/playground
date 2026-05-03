/**
 * COSMOS CONTAINER: mental-wellbeing-events
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5 (full escalation flow)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5.2 (event schema)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5.5 (severity:critical audit log entry)
 * 
 * ⚠️ SAFETY-CRITICAL ⚠️
 * 
 * Stores all Mental Wellbeing trigger events. Append-only.
 * Every trigger event ALSO writes a severity:critical entry to ise-transition-log.
 * 
 * trigger_content_full is HIPAA-redactable per G5 — only CPIE-interface receives it.
 * trigger_content_redacted is the safe summary (still NEVER signaled to patient
 * via the escalation flow — patient sees only the safety check-in template).
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_HIPAA_6_YEARS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { MentalWellbeingTrigger } from '../../types/safety.js';

export type MentalWellbeingEventDocument = MentalWellbeingTrigger;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const MENTAL_WELLBEING_EVENTS_SPEC: ContainerSpec = {
  containerName: 'mental-wellbeing-events',
  partitionKeyPath: '/userId',
  // HIPAA retention — these are clinical/safety events
  defaultTtlSeconds: TTL_HIPAA_6_YEARS,
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    excludedPaths: [
      // Content fields excluded from index — they are read by ID only,
      // never queried by content (safety + privacy)
      { path: '/trigger_content_full' },
      { path: '/trigger_content_redacted' }
    ],
    compositeIndexes: [
      [
        { path: '/userId', order: 'ascending' },
        { path: '/detection_at', order: 'descending' }
      ],
      [
        { path: '/userId', order: 'ascending' },
        { path: '/resolved_at', order: 'ascending' }
      ]
    ]
  },
  appendOnly: false, // resolution updates set resolved_at + resolution_type
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'DEV-WORK-D0LITE-PATCH-001 v1.0 §5'
};
