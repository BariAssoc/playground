/**
 * BariAccess Lite — Nightly RR_Lite Compute Job
 *
 * Schedule: 02:00 ET cohort-local time, every night.
 *
 * For each active user:
 *   1. Read normalized_data, raw_data, workout_sessions for last 28 days
 *   2. Read FABResponses, FABSessions for last 7 days
 *   3. Read user_environment (chronotype)
 *   4. Read patient profile (GLP-1 status, light therapy protocol)
 *   5. Read ise-current-state
 *   6. Compute personal baselines (HRV, RHR, etc.)
 *   7. Compute CI-M, CI-C from 7-day windows
 *   8. Compute SQI, SRI, SNS → SRC
 *   9. Compute CIR, SMA, RSI → SBL
 *   10. Compute EPC, MVI, LSR → AMP
 *   11. Compute R&R_Lite via redistributeWeights
 *   12. Build all annotations
 *   13. Write ScoreDailyRollup to score_daily_rollup container
 *
 * This file is the orchestration scaffold. The Cosmos client wiring lives
 * in your existing repo; this exports a `runNightlyRRLite` function that
 * accepts adapters and runs the pipeline.
 */

import type {
  ScoreDailyRollup,
  CompositeId,
  CompositeResult,
  V4Modifiers,
} from '@bariaccess-lite/shared';

// Adapter interfaces — Zakiy implements these against existing repo infra.
export interface NightlyJobAdapters {
  listActiveUsers(date: string): Promise<Array<{ user_id: string; program_started_at: string }>>;
  computeForUser(user_id: string, date: string): Promise<{
    rr_lite: ScoreDailyRollup['rr_lite'];
    v4_modifiers: V4Modifiers;
    ise_state: string;
  } | null>;
  writeRollup(rollup: ScoreDailyRollup): Promise<void>;
  log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void;
}

export interface NightlyJobResult {
  date: string;
  total_users: number;
  succeeded: number;
  failed: number;
  errors: Array<{ user_id: string; message: string }>;
  duration_ms: number;
}

const SCHEMA_VERSION = '0.1.0';
const JOB_NAME = 'nightly-rr-lite';

export async function runNightlyRRLite(
  adapters: NightlyJobAdapters,
  options: { date?: string } = {}
): Promise<NightlyJobResult> {
  const date = options.date ?? defaultDate();
  const startTs = Date.now();
  adapters.log('info', `nightly job starting for ${date}`);

  const users = await adapters.listActiveUsers(date);
  let succeeded = 0;
  let failed = 0;
  const errors: NightlyJobResult['errors'] = [];

  for (const user of users) {
    try {
      const result = await adapters.computeForUser(user.user_id, date);
      if (!result) {
        adapters.log('warn', `no compute result for ${user.user_id}`);
        continue;
      }
      const days_active = computeDaysActive(user.program_started_at, date);
      const rollup: ScoreDailyRollup = {
        id: `${user.user_id}:${date}`,
        user_id: user.user_id,
        date,
        days_active,
        program_started_at: user.program_started_at,
        rr_lite: result.rr_lite,
        v4_modifiers: result.v4_modifiers,
        ise_state: result.ise_state,
        composite_subset: ['SRC', 'SBL', 'AMP'] as CompositeId[],
        computed_at: new Date().toISOString(),
        computed_by_job: JOB_NAME,
        schema_version: SCHEMA_VERSION,
      };
      await adapters.writeRollup(rollup);
      succeeded++;
    } catch (err) {
      failed++;
      const message = err instanceof Error ? err.message : 'unknown error';
      errors.push({ user_id: user.user_id, message });
      adapters.log('error', `compute failed for ${user.user_id}`, { err: message });
    }
  }

  const duration_ms = Date.now() - startTs;
  adapters.log('info', `nightly job complete`, {
    date,
    total_users: users.length,
    succeeded,
    failed,
    duration_ms,
  });
  return { date, total_users: users.length, succeeded, failed, errors, duration_ms };
}

function defaultDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeDaysActive(started_at: string, on_date: string): number {
  const start = new Date(`${started_at}`).getTime();
  const target = new Date(`${on_date}T23:59:59Z`).getTime();
  if (Number.isNaN(start) || Number.isNaN(target)) return 1;
  return Math.max(1, Math.floor((target - start) / (1000 * 60 * 60 * 24)) + 1);
}
