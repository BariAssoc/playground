/**
 * BariAccess Beta — Day 11 Trend Report Generator
 *
 * Source: BETA-FORMULA-001 §8 Day 11 Report Format + BETA-HANDOFF-001 §9
 *
 * Per spec, Day 11 narrative includes:
 *   - Activity (Journal entries)
 *   - HRV (where wearable data exists)
 *   - Behavioral consistency (C)
 *   - Schedule adherence (routine drift)
 *   - Sleep score
 *   - Nudge compliance rate
 *   - Productivity prediction match rate
 *   - E + SC_beta + SC_band per cohort member
 *   - Disengagement flags
 *
 * Output: structured JSON per cohort member; downstream renders to PDF/email.
 *
 * Run on May 18, 2026 (Day 11) at 06:00 ET.
 */

import { runNightlyCompute } from './nightly-compute';
import type {
  Archetype,
  EffortDailyRollup,
  SCBand,
} from '@bariaccess/shared';

export interface Day11ReportOptions {
  end_date: string; // 'YYYY-MM-DD' (May 17, 2026)
  beta_start: string; // 'YYYY-MM-DD' (May 7, 2026)
}

export interface Day11MemberReport {
  user_id: string;
  full_name: string;
  archetype: Archetype;
  internal_only: boolean;
  // 10-day aggregates
  days_logged: number;
  avg_E: number;
  avg_Mood: number;
  avg_SC_beta: number;
  final_SC_band: SCBand;
  // Compliance
  jotform_completion_rate: number;
  nudge_response_rate: number;
  bookend_response_rate: number;
  // Behavioral
  productivity_prediction_match_rate: number | null;
  schedule_drift_minutes_avg: number;
  // Wearable (if any)
  avg_HRV: number | null;
  avg_sleep_score: number | null;
  // Engagement
  grit_events_count: number;
  disengagement_flags: string[];
  // Trend trajectory
  E_trajectory: 'improving' | 'stable' | 'declining';
  SC_trajectory: 'improving' | 'stable' | 'declining';
  // Notes
  highlights: string[];
}

export interface Day11CohortReport {
  generated_at: string;
  beta_start: string;
  end_date: string;
  cohort_size: number;
  members: Day11MemberReport[];
  cohort_aggregates: {
    avg_E: number;
    avg_SC_beta: number;
    overall_jotform_completion: number;
    overall_nudge_response: number;
    members_with_disengagement_flag: number;
  };
}

export async function generateDay11Report(
  opts: Day11ReportOptions
): Promise<Day11CohortReport> {
  const members = await loadAllCohortMembers();
  const memberReports: Day11MemberReport[] = [];

  for (const m of members) {
    if (m.beta_started_at == null) continue; // Lana — delayed entry
    const rollups = await loadRollupsForMember(
      m.user_id,
      opts.beta_start,
      opts.end_date
    );
    const report = await assembleMemberReport(m, rollups);
    memberReports.push(report);
  }

  // Cohort-level aggregates
  const visible = memberReports.filter((r) => !r.internal_only);
  const aggregates = {
    avg_E: mean(visible.map((r) => r.avg_E)),
    avg_SC_beta: mean(visible.map((r) => r.avg_SC_beta)),
    overall_jotform_completion: mean(
      visible.map((r) => r.jotform_completion_rate)
    ),
    overall_nudge_response: mean(visible.map((r) => r.nudge_response_rate)),
    members_with_disengagement_flag: visible.filter(
      (r) => r.disengagement_flags.length > 0
    ).length,
  };

  return {
    generated_at: new Date().toISOString(),
    beta_start: opts.beta_start,
    end_date: opts.end_date,
    cohort_size: memberReports.length,
    members: memberReports,
    cohort_aggregates: aggregates,
  };
}

async function assembleMemberReport(
  member: any,
  rollups: EffortDailyRollup[]
): Promise<Day11MemberReport> {
  const days_logged = rollups.length;
  const avg_E = mean(rollups.map((r) => r.E));
  const avg_Mood = mean(rollups.map((r) => r.Mood_daily));
  const avg_SC_beta = mean(rollups.map((r) => r.SC_beta));
  const final_SC_band: SCBand =
    rollups.length > 0 ? rollups[rollups.length - 1].SC_band : 'yellow';

  // Trajectory: compare first half vs second half
  const half = Math.floor(rollups.length / 2);
  const e_first = mean(rollups.slice(0, half).map((r) => r.E));
  const e_second = mean(rollups.slice(half).map((r) => r.E));
  const sc_first = mean(rollups.slice(0, half).map((r) => r.SC_beta));
  const sc_second = mean(rollups.slice(half).map((r) => r.SC_beta));

  const E_trajectory = trajectory(e_first, e_second);
  const SC_trajectory = trajectory(sc_first, sc_second);

  return {
    user_id: member.user_id,
    full_name: member.full_name,
    archetype: member.archetype,
    internal_only: member.internal_only,
    days_logged,
    avg_E,
    avg_Mood,
    avg_SC_beta,
    final_SC_band,
    jotform_completion_rate: await loadJotFormCompletionRate(
      member.user_id,
      rollups
    ),
    nudge_response_rate: await loadNudgeResponseRate(member.user_id, rollups),
    bookend_response_rate: await loadBookendResponseRate(
      member.user_id,
      rollups
    ),
    productivity_prediction_match_rate: await loadPredictionMatchRate(
      member.user_id
    ),
    schedule_drift_minutes_avg: await loadScheduleDrift(member.user_id),
    avg_HRV: await loadAvgHRV(member.user_id),
    avg_sleep_score: await loadAvgSleepScore(member.user_id),
    grit_events_count: rollups.filter((r) => r.grit_triggered).length,
    disengagement_flags: await loadDisengagementFlagsFor(member.user_id),
    E_trajectory,
    SC_trajectory,
    highlights: deriveHighlights(rollups, E_trajectory, SC_trajectory),
  };
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function trajectory(
  first_half: number,
  second_half: number
): 'improving' | 'stable' | 'declining' {
  const delta = second_half - first_half;
  if (delta > 0.05) return 'improving';
  if (delta < -0.05) return 'declining';
  return 'stable';
}

function deriveHighlights(
  rollups: EffortDailyRollup[],
  e_traj: string,
  sc_traj: string
): string[] {
  const out: string[] = [];
  if (e_traj === 'improving') out.push('Effort improving across beta window');
  if (sc_traj === 'improving') out.push('Stability improving');
  const grit_days = rollups.filter((r) => r.grit_triggered).length;
  if (grit_days >= 3) out.push(`Showed grit on ${grit_days} days`);
  const high_sc_days = rollups.filter((r) => r.SC_band === 'optimal' || r.SC_band === 'peak').length;
  if (high_sc_days >= 5) out.push(`${high_sc_days} days in Optimal/Peak band`);
  return out;
}

// Stubs
async function loadAllCohortMembers(): Promise<any[]> {
  throw new Error('wire to Cosmos');
}
async function loadRollupsForMember(
  user_id: string,
  start: string,
  end: string
): Promise<EffortDailyRollup[]> {
  throw new Error('wire to Cosmos');
}
async function loadJotFormCompletionRate(user_id: string, rollups: any[]): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadNudgeResponseRate(user_id: string, rollups: any[]): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadBookendResponseRate(user_id: string, rollups: any[]): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadPredictionMatchRate(user_id: string): Promise<number | null> {
  return null; // Captured only if v0.3 forms ship before May 7
}
async function loadScheduleDrift(user_id: string): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadAvgHRV(user_id: string): Promise<number | null> {
  return null;
}
async function loadAvgSleepScore(user_id: string): Promise<number | null> {
  return null;
}
async function loadDisengagementFlagsFor(user_id: string): Promise<string[]> {
  throw new Error('wire to Cosmos');
}

if (require.main === module) {
  generateDay11Report({
    beta_start: '2026-05-07',
    end_date: '2026-05-17',
  })
    .then((r) => {
      console.log(JSON.stringify(r, null, 2));
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
