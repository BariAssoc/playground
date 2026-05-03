/**
 * COSMOS CONTAINER: journal-entries
 * 
 * Source canon:
 *   - CCO-JOUR-DEF-001 v1.0 (Journal Architectural Definition Canon — referenced)
 *   - Memory Rule April 24, 2026 (9-column structure, 125-char cell cap)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §4 (per-column visibility — HIPAA CRITICAL)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §6.4 (soft-delete with revoked_at)
 * 
 * ⚠️ HIPAA-CRITICAL ⚠️
 * 
 * Storage stores the FULL 9 columns. Redaction happens at API layer
 * (src/storage/redaction-layer.ts), never at frontend.
 * 
 * Per PAC-ISE-006 §10.3: "Redaction enforced at API layer, not client."
 */

import type { ContainerSpec } from './_container-spec.js';
import {
  STANDARD_AUTOSCALE_THROUGHPUT,
  TTL_HIPAA_6_YEARS,
  INDEX_ALL_PATHS
} from './_container-spec.js';
import type { JournalEntryFull } from '../../types/journal.js';

export type JournalEntryDocument = JournalEntryFull;

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC
// ─────────────────────────────────────────────────────────────────────────────

export const JOURNAL_ENTRIES_SPEC: ContainerSpec = {
  containerName: 'journal-entries',
  partitionKeyPath: '/userId',
  defaultTtlSeconds: TTL_HIPAA_6_YEARS,
  indexingPolicy: {
    indexingMode: 'consistent',
    automatic: true,
    includedPaths: INDEX_ALL_PATHS,
    // Exclude content fields from index — read by entry_id, not by content search
    excludedPaths: [
      { path: '/entry' },
      { path: '/question' },
      { path: '/ollie_to_mark_first' },
      { path: '/ollie_to_max' },
      { path: '/max_to_ollie' },
      { path: '/ollie_to_mark_second' }
    ],
    compositeIndexes: [
      [
        { path: '/userId', order: 'ascending' },
        { path: '/_ts', order: 'descending' }
      ],
      [
        { path: '/userId', order: 'ascending' },
        { path: '/category', order: 'ascending' }
      ]
    ]
  },
  appendOnly: false, // soft-delete via revoked_at update
  throughput: STANDARD_AUTOSCALE_THROUGHPUT,
  sourceCanon: 'CCO-JOUR-DEF-001 v1.0 + CCO-UX-CARD-COMM-PATCH-001 v1.0'
};
