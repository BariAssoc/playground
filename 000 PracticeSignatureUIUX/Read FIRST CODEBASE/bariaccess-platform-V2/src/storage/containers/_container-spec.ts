/**
 * CONTAINER SPEC — shared interface for all Cosmos DB containers
 * 
 * Source canon:
 *   - PAC-ISE-004 v1.0A §3 (container definitions)
 *   - PAC-ISE-004 v1.0A §6 (retention + TTL)
 *   - PAC-ISE-004 v1.0A §7 (consistency + throughput)
 * 
 * Defines the contract every Cosmos container module exports.
 */

// ─────────────────────────────────────────────────────────────────────────────
// COSMOS INDEXING POLICY (per-container)
// ─────────────────────────────────────────────────────────────────────────────

export interface IndexingPolicy {
  indexingMode: 'consistent' | 'lazy' | 'none';
  automatic: boolean;
  includedPaths: ReadonlyArray<{ path: string }>;
  excludedPaths: ReadonlyArray<{ path: string }>;
  compositeIndexes?: ReadonlyArray<
    ReadonlyArray<{ path: string; order: 'ascending' | 'descending' }>
  >;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTAINER SPEC — every container module exports one of these
// ─────────────────────────────────────────────────────────────────────────────

export interface ContainerSpec {
  /** Container name in Cosmos DB */
  containerName: string;

  /** Partition key path — almost always /userId per PAC-ISE-004 */
  partitionKeyPath: string;

  /** Default TTL in seconds, or null for no TTL */
  defaultTtlSeconds: number | null;

  /** Indexing policy */
  indexingPolicy: IndexingPolicy;

  /** Append-only? (no updates/deletes allowed at app layer) */
  appendOnly: boolean;

  /** Throughput mode + RU/s bounds */
  throughput: {
    mode: 'autoscale' | 'manual';
    minRus?: number;
    maxRus?: number;
  };

  /** Source canon reference */
  sourceCanon: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED CONSTANTS (per PAC-ISE-004 §6 + §7)
// ─────────────────────────────────────────────────────────────────────────────

export const TTL_NEVER = null;
export const TTL_365_DAYS = 31_536_000; // PAC-ISE-004 default for transition log
export const TTL_90_DAYS = 7_776_000; // G3 §6.2 — slot-cascade-events
export const TTL_HIPAA_6_YEARS = 189_216_000; // 45 CFR §164.530(j)(2)

export const STANDARD_AUTOSCALE_THROUGHPUT = {
  mode: 'autoscale' as const,
  minRus: 400,
  maxRus: 4000
};

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD INDEX PATHS — building blocks
// ─────────────────────────────────────────────────────────────────────────────

export const INDEX_ALL_PATHS: ReadonlyArray<{ path: string }> = [{ path: '/*' }];

export const EXCLUDE_ETAG: ReadonlyArray<{ path: string }> = [
  { path: '/"_etag"/?' }
];
