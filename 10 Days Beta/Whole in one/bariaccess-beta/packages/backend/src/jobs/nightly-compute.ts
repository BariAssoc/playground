/**
 * BariAccess Beta — Nightly Compute Job
 *
 * Runs once per day, ~02:00 cohort-local time (US/Eastern by default).
 * Per CCO-FAB-001-PIN-001 — pre-compute everything; reads NEVER recompute.
 *
 * Run:
 *   - Cron: 0 2 * * * node dist/jobs/nightly-compute.js
 *   - Manual: npm run job:nightly -- --date=2026-05-08
 */

import { randomUUID } from 'node:crypto';
import {
  aggregateDailyMood,
  computeEffort,
  computeFABConsistency,
  computeFrequency,
  computeLCBeta,
  computeRollingConsistency,
  computeSCBeta,
  computeV3SpaceScore,
} from '../scoring';
import { getSCBand } from '@bariaccess/shared';
import type {
  CohortMember,
  EffortDailyRollup,
  Space,
} from '@bariaccess/shared';

export interface NightlyComputeOptions {
  date: string; // YYYY-MM-DD (the day we're computing FOR — yesterday at 2am)
  dry_run?: boolean;
}

export async function runNightlyCompute(opts: NightlyComputeOptions) {
  const startedAt = Date.now();
  const members = await loadAllCohortMembers();
  const results: EffortDailyRollup[] = [];

  for (const m of members) {
    if (m.beta_started_at == null) {
      // Lana — delayed entry; skip until intake completes
      continue;
    }
    try {
      const rollup = await computeMemberRollup(m, opts.date);
      results.push(rollup);
      if (!opts.dry_run) {
        await writeRollup(rollup);
      }
    } catch (err) {
      console.error(`[nightly] failed for ${m.user_id}`, err);
    }
  }

  const elapsedMs = Date.now() - startedAt;
  console.log(
    `[nightly] computed ${results.length} rollups for ${opts.date} in ${elapsedMs}ms${opts.dry_run ? ' (dry run)' : ''}`
  );
  return results;
}

// ────────────────────────────────────────────────────────────
// PER-MEMBER COMPUTATION
// ────────────────────────────────────────────────────────────
async function computeMemberRollup(
  member: CohortMember,
  date: string
): Promise<EffortDailyRollup> {
  // Window: rolling 7 days ending on `date`
  const window = sevenDayWindow(date);

  // ── Mood (daily, equal-weighted) ──
  const moodEvents = await loadMoodEvents(member.user_id, date);
  const Mood_daily = aggregateDailyMood(moodEvents.map((m) => m.mood_normalized));

  // ── F: Frequency (rolling 7d) ──
  const completedThisWindow = await countCompletedFABs(member.user_id, window);
  const scheduledThisWindow = await countScheduledFABs(member.user_id, window);
  const fResult = computeFrequency(completedThisWindow, scheduledThisWindow);

  // ── C: Consistency (rolling 7d, completed FABs only) ──
  const completedDetail = await loadCompletedFABTimings(member.user_id, window);
  const C = computeRollingConsistency(
    completedDetail.map((d) =>
      computeFABConsistency({
        scheduled_time: d.scheduled_time,
        actual_completion_time: d.actual_completion_time,
        window_minutes: d.window_minutes,
      })
    )
  );

  // ── LC_beta (rolling 7d) ──
  const lcInputs = await loadLCInputs(member.user_id, window);
  const lcResult = computeLCBeta(lcInputs);

  // ── E: Effort ──
  const E = computeEffort({ F: fResult.F, C, LC: lcResult.LC_beta });

  // ── Grit Engine (max M observed today) ──
  const todaysWarmups = await loadTodayWarmups(member.user_id, date);
  let grit_triggered = false;
  let grit_multiplier_max = 1.0;
  for (const w of todaysWarmups) {
    if (w.mood_normalized != null) {
      const M = computeGritM(w.mood_normalized, E);
      if (M > 1.0) grit_triggered = true;
      if (M > grit_multiplier_max) grit_multiplier_max = M;
    }
  }

  // ── V1: Wearable Readiness ──
  const V1_native = await loadWearableReadiness(member.user_id, date);

  // ── V3: Space distribution (today's warmups) ──
  const spaceDist = countSpaceDistribution(todaysWarmups.map((w) => w.space));
  const V3_space_score = computeV3SpaceScore(spaceDist);

  // ── V4: Anchors compliance (today's 10 AM nudge Y rate) ──
  const anchors_compliance = await loadAnchorsCompliance(member.user_id, date);

  // ── SC_beta ──
  const sc = computeSCBeta({
    V1_wearable_native: V1_native,
    Mood_daily,
    E,
    V3_space_score,
    F: fResult.F,
    anchors_compliance,
    archetype: member.archetype,
  });

  // ── Credits ──
  const { credits_total, credits_grit_boosted } = await loadTodayCredits(
    member.user_id,
    date
  );

  return {
    rollup_id: randomUUID(),
    user_id: member.user_id,
    archetype: member.archetype,
    date,
    F: fResult.F,
    C,
    LC_beta: lcResult.LC_beta,
    E,
    Mood_daily,
    grit_triggered,
    grit_multiplier_max,
    V1: sc.V1,
    V2_beta: sc.V2_beta,
    V3: sc.V3,
    V4_beta: sc.V4_beta,
    SC_beta: sc.SC_beta,
    SC_band: getSCBand(sc.SC_beta),
    credits_earned_total: credits_total,
    credits_grit_boosted: credits_grit_boosted,
    computed_at: new Date().toISOString(),
    partial_window: fResult.partial_window,
  };
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
function sevenDayWindow(date: string): { start: string; end: string } {
  const end = new Date(date);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function computeGritM(mood: number, effort: number): number {
  if (mood > 0.5 || effort < 0.6) return 1.0;
  return Math.max(1.0, Math.min(2.0, 1.0 + (effort - mood) * 1.5));
}

function countSpaceDistribution(spaces: Array<Space | null>) {
  const dist = {
    protected_count: 0,
    challenging_count: 0,
    vulnerable_count: 0,
    mix_count: 0,
  };
  for (const s of spaces) {
    if (s === 'protected') dist.protected_count++;
    else if (s === 'challenging') dist.challenging_count++;
    else if (s === 'vulnerable') dist.vulnerable_count++;
    else if (s === 'mix') dist.mix_count++;
  }
  return dist;
}

// Stubs — wire to Cosmos
async function loadAllCohortMembers(): Promise<CohortMember[]> {
  throw new Error('wire to Cosmos');
}
async function loadMoodEvents(user_id: string, date: string): Promise<any[]> {
  throw new Error('wire to Cosmos');
}
async function countCompletedFABs(user_id: string, window: any): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function countScheduledFABs(user_id: string, window: any): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadCompletedFABTimings(
  user_id: string,
  window: any
): Promise<
  Array<{
    scheduled_time: Date;
    actual_completion_time: Date;
    window_minutes: number;
  }>
> {
  throw new Error('wire to Cosmos');
}
async function loadLCInputs(user_id: string, window: any): Promise<any> {
  throw new Error('wire to Cosmos');
}
async function loadTodayWarmups(
  user_id: string,
  date: string
): Promise<Array<{ mood_normalized: number | null; space: Space | null }>> {
  throw new Error('wire to Cosmos');
}
async function loadWearableReadiness(user_id: string, date: string): Promise<number> {
  // Stub — Spike API normalized 0–100. If no wearable, return 50 (neutral).
  return 50;
}
async function loadAnchorsCompliance(
  user_id: string,
  date: string
): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadTodayCredits(
  user_id: string,
  date: string
): Promise<{ credits_total: number; credits_grit_boosted: number }> {
  throw new Error('wire to Cosmos');
}
async function writeRollup(rollup: EffortDailyRollup): Promise<void> {
  throw new Error('wire to Cosmos');
}

// CLI entry
if (require.main === module) {
  const dateArg = process.argv.find((a) => a.startsWith('--date='));
  const date = dateArg
    ? dateArg.split('=')[1]
    : new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const dry_run = process.argv.includes('--dry-run');
  runNightlyCompute({ date, dry_run })
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
