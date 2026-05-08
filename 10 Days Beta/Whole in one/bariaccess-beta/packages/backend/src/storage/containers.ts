/**
 * BariAccess Beta — Cosmos DB Container Specifications
 *
 * Source: BETA-FORMULA-001 §10 + BETA-BOOKEND-001 §Data Schema
 *
 * 8 containers required for the May 7–17 beta.
 * Partition key strategy: /user_id everywhere (predictable, fast lookups).
 *
 * Run: npm run cosmos:create-containers
 */

export interface CosmosContainerSpec {
  name: string;
  partition_key: string;
  ttl_seconds?: number; // Time-to-live; null = no expiry
  unique_keys?: string[][];
  indexed_fields: string[];
  description: string;
}

export const COSMOS_CONTAINERS: CosmosContainerSpec[] = [
  {
    name: 'cohort_members',
    partition_key: '/user_id',
    indexed_fields: ['archetype', 'internal_only'],
    description:
      'Static cohort roster (13 members). Updated only on intake or correction.',
  },
  {
    name: 'user_traits',
    partition_key: '/user_id',
    indexed_fields: ['archetype', 'chronotype'],
    description:
      'OCEAN scores + chronotype derived from BETA-JF-BASELINE-001. VAL_DEFAULT_1 — meta-state, not V-tagged.',
  },
  {
    name: 'fabs',
    partition_key: '/user_id',
    indexed_fields: ['archetype', 'segment_code', 'critical_flag', 'is_wildcard'],
    description:
      '130 FAB definitions. One row per FAB per cohort member. Update on Day 4 / Day 11 refinement.',
  },
  {
    name: 'bookend_events',
    partition_key: '/user_id',
    indexed_fields: ['fab_id', 'event_type', 'archetype', 'internal_only'],
    description:
      'Warm-up + cool-down captures per FAB. ~20 rows/cohort/day during full beta = ~2,600 rows total.',
  },
  {
    name: 'journal_entries',
    partition_key: '/user_id',
    indexed_fields: ['log_time', 'archetype', 'internal_only'],
    description:
      'Reading B — written once per cool-down completion. Single-day Journal WorkPad reads from this.',
  },
  {
    name: 'mood_events',
    partition_key: '/user_id',
    indexed_fields: ['source', 'archetype', 'timestamp'],
    description:
      'Per mood capture from any source (forms / nudges / Bookends). Daily mood mean rolls up from this.',
  },
  {
    name: 'jotform_events',
    partition_key: '/user_id',
    indexed_fields: ['form_id', 'day_number', 'archetype', 'completion_status'],
    description:
      'AM / PM / Baseline / Intake form submissions. Used for LC_beta JotForm completion rate.',
  },
  {
    name: 'nudge_events',
    partition_key: '/user_id',
    indexed_fields: ['nudge_id', 'archetype', 'completion_status'],
    description:
      'SMS / WhatsApp nudge responses. parse_failed status routes to manual review.',
  },
  {
    name: 'effort_daily_rollup',
    partition_key: '/user_id',
    indexed_fields: ['date', 'archetype', 'SC_band'],
    description:
      'Nightly compute output. F, C, LC_beta, E, Mood_daily, Grit_M, V1–V4, SC_beta, SC_band. NEVER recompute on display.',
  },
  {
    name: 'disengagement_flags',
    partition_key: '/user_id',
    indexed_fields: ['rule', 'resolved'],
    description:
      'Per-cohort disengagement detection from BETA-FORMULA-001 §9 thresholds.',
  },
  {
    name: 'wearable_streams',
    partition_key: '/user_id',
    ttl_seconds: 60 * 60 * 24 * 90, // 90-day TTL on raw wearable streams
    indexed_fields: ['metric', 'source_device', 'timestamp'],
    description:
      'Raw V1 streams from Spike API. 90-day TTL — daily rollups derived from this stay forever.',
  },
];
