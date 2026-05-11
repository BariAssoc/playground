/**
 * BariAccess Lite — Cosmos Container Specs
 *
 * Source: WOOZ_COSMOS_CONTAINERS.md
 *         + DECISIONS.md §14 (one new container: score_daily_rollup)
 *
 * READ specs (existing in production, do not provision here):
 *   - normalized_data
 *   - raw_data
 *   - workout_sessions
 *   - user_environment   (V3 chronotype)
 *   - user_mood
 *   - FABResponses
 *   - FABSessions
 *
 * WRITE spec (NEW — provision via existing npm run provision-rr-containers):
 *   - score_daily_rollup
 */

export interface CosmosContainerSpec {
  name: string;
  partition_key_path: string;
  /** TTL in seconds; null = no expiration. */
  ttl_seconds: number | null;
  /** Indexing policy preference; defaults are fine for Lite v1. */
  indexing?: 'default' | 'lazy';
  /** Notes for Zakiy. */
  notes?: string;
}

export const SCORE_DAILY_ROLLUP_SPEC: CosmosContainerSpec = {
  name: 'score_daily_rollup',
  partition_key_path: '/user_id',
  ttl_seconds: null,
  notes:
    'Doc id: {userId}:{date}. One doc per user per day. ' +
    'Pre-computed by nightly-rr-lite job (02:00 ET). ' +
    'Reads NEVER recompute. ' +
    'Schema: ScoreDailyRollup (see @bariaccess-lite/shared/types).',
};

export const READ_CONTAINERS = {
  normalized_data: 'normalized_data',
  raw_data: 'raw_data',
  workout_sessions: 'workout_sessions',
  user_environment: 'user_environment',
  user_mood: 'user_mood',
  fab_responses: 'FABResponses',
  fab_sessions: 'FABSessions',
} as const;

export const WRITE_CONTAINERS = {
  score_daily_rollup: 'score_daily_rollup',
} as const;
