/**
 * BariAccess Lite — Spike Ingest Adapter
 *
 * Source: WOOZ_COSMOS_CONTAINERS.md (containers + write paths)
 *         spike_metrics_coverage_analysis.md (per-provider metrics observed)
 *
 * READS ONLY. Webhook + 15-min proactive timer are pre-existing in production.
 * This adapter is the score engine's read interface to those documents.
 *
 * Container reads:
 *   - normalized_data:  doc id `{userId}:{date}` — daily merged metrics
 *   - raw_data:         doc id `{userId}:{provider}:{dataType}:{date}` — per-vendor archive
 *   - workout_sessions: doc id `{userId}:{workout_id}` — per session
 */

// ────────────────────────────────────────────────────────────
// CONTAINER READ INTERFACE
// Implementations live wherever Cosmos client lives (likely
// `bariaccess-note-ingest` package). This adapter is provider-agnostic
// to keep scoring code testable in isolation.
// ────────────────────────────────────────────────────────────

export interface CosmosReadAdapter {
  /**
   * Read a single document by id from a container.
   * Returns null if not found. Throws on actual Cosmos errors.
   */
  readById<T>(containerName: string, id: string, partitionKey: string): Promise<T | null>;

  /**
   * Query a partition for documents matching a predicate string.
   * Used for raw_data (per-vendor TOP query) and workout_sessions (per-day range).
   */
  queryPartition<T>(
    containerName: string,
    partitionKey: string,
    sql: string,
    parameters?: Record<string, unknown>
  ): Promise<T[]>;
}

// ────────────────────────────────────────────────────────────
// NORMALIZED DAILY DOC SHAPE
// Per WOOZ_COSMOS_CONTAINERS.md §normalized_data:
//   "metrics" object (best value per metric across providers)
//   "provider_metrics" (each provider's raw contribution)
//   "metric_sources" (which provider "won" each metric)
//   "sources" array (all connected vendors that day)
// ────────────────────────────────────────────────────────────

export interface NormalizedDailyDoc {
  id: string;                              // {userId}:{date}
  user_id: string;
  date: string;                            // YYYY-MM-DD
  metrics: Record<string, number | null>;
  provider_metrics?: Record<string, Record<string, number | null>>;
  metric_sources?: Record<string, string>;
  sources?: string[];
  workouts?: WorkoutSummary[];
}

export interface WorkoutSummary {
  workout_id: string;
  provider_slug: string;
  start_time: string;                      // ISO
  duration_minutes: number;
  calories_burned?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  activity_type?: string;                  // 'running', 'cycling', 'strength', etc.
}

// ────────────────────────────────────────────────────────────
// RAW DATA DOC SHAPE
// Per WOOZ_COSMOS_CONTAINERS.md §raw_data:
//   "Full Spike API response archive (stats, sleeps, workouts)"
// ────────────────────────────────────────────────────────────

export interface RawDataDoc {
  id: string;                              // {userId}:{provider}:{dataType}:{date}
  user_id: string;
  provider: string;
  data_type: 'provider_records' | 'interval_stats';
  date: string;
  records: Array<{
    provider_slug: string;
    provider_source: string;
    payload: Record<string, unknown>;
  }>;
}

// ────────────────────────────────────────────────────────────
// PUBLIC INGEST API
// ────────────────────────────────────────────────────────────

const NORMALIZED_CONTAINER = 'normalized_data';
const RAW_CONTAINER = 'raw_data';
const WORKOUT_CONTAINER = 'workout_sessions';

export class SpikeIngestAdapter {
  constructor(private readonly cosmos: CosmosReadAdapter) {}

  /**
   * Read the normalized daily doc for a user on a given date.
   */
  async getNormalizedDay(
    user_id: string,
    date: string
  ): Promise<NormalizedDailyDoc | null> {
    const id = `${user_id}:${date}`;
    return this.cosmos.readById<NormalizedDailyDoc>(
      NORMALIZED_CONTAINER,
      id,
      user_id
    );
  }

  /**
   * Read normalized docs for a date range, oldest first.
   * Used for 7-day windows (F, C, LSR), 28-day baselines, 14-day MEQ verification, etc.
   */
  async getNormalizedRange(
    user_id: string,
    start_date: string,
    end_date: string
  ): Promise<NormalizedDailyDoc[]> {
    const sql = `
      SELECT * FROM c
      WHERE c.user_id = @userId
        AND c.date >= @startDate
        AND c.date <= @endDate
      ORDER BY c.date ASC
    `;
    return this.cosmos.queryPartition<NormalizedDailyDoc>(
      NORMALIZED_CONTAINER,
      user_id,
      sql,
      { userId: user_id, startDate: start_date, endDate: end_date }
    );
  }

  /**
   * Read per-vendor raw records for a single user/date/provider.
   * Used when the score engine needs provider-specific source preservation
   * (e.g. confirming HRV came from Oura overnight vs Polar nightly recharge).
   */
  async getRawForProvider(
    user_id: string,
    provider: string,
    data_type: 'provider_records' | 'interval_stats',
    date: string
  ): Promise<RawDataDoc | null> {
    const id = `${user_id}:${provider}:${data_type}:${date}`;
    return this.cosmos.readById<RawDataDoc>(RAW_CONTAINER, id, user_id);
  }

  /**
   * Read workout sessions in a date range.
   * Used for MVI Activity_diversity and LSR training-load compute.
   */
  async getWorkouts(
    user_id: string,
    start_date: string,
    end_date: string
  ): Promise<WorkoutSummary[]> {
    const sql = `
      SELECT * FROM c
      WHERE c.user_id = @userId
        AND c.start_time >= @startTs
        AND c.start_time <= @endTs
      ORDER BY c.start_time ASC
    `;
    return this.cosmos.queryPartition<WorkoutSummary>(
      WORKOUT_CONTAINER,
      user_id,
      sql,
      {
        userId: user_id,
        startTs: `${start_date}T00:00:00Z`,
        endTs: `${end_date}T23:59:59Z`,
      }
    );
  }
}
