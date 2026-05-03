/**
 * FAB — Focused Action Block
 * 
 * Source canon:
 *   - CCO-FAB-001 v2.0 Pass 1 §1 (Universal FAB Definition)
 *   - CCO-FAB-001 v2.0 Pass 1 §2 (7 families)
 *   - CCO-FAB-001 v2.0 Pass 1 §3 (Task / Silent visibility)
 *   - CCO-FAB-001 v2.0 Pass 1 §4 (6 states — no "Completed")
 *   - CCO-FAB-001 v2.0 Pass 1 §5 (4 operating levels)
 *   - CCO-FAB-001 v2.0 Pass 1 §6 (Variable / Binary data types)
 *   - CCO-FAB-001 v2.0 Pass 1 §11 (FCS formula)
 *   - CCO-FAB-001-PIN-001 v1.0 §2-§6 (Pin Specs — Timestamp, Mood, Effort)
 *   - CCO-FAB-001 v2.0 Pass 1 §13 (Action Modes — Reinforcing deferred to Pass 2)
 * 
 * This file defines TYPES ONLY.
 */

// ─────────────────────────────────────────────────────────────────────────────
// THE 7 FAMILIES (CCO-FAB-001 v2.0 Pass 1 §2)
// ─────────────────────────────────────────────────────────────────────────────

export enum FABFamily {
  Activity = 'activity',
  Metabolic = 'metabolic',
  Circadian = 'circadian',
  Cognitive = 'cognitive',
  Behavioral = 'behavioral',
  Social = 'social',
  IdentityFusion = 'identity_fusion'
}

export const ALL_FAB_FAMILIES: ReadonlyArray<FABFamily> = [
  FABFamily.Activity,
  FABFamily.Metabolic,
  FABFamily.Circadian,
  FABFamily.Cognitive,
  FABFamily.Behavioral,
  FABFamily.Social,
  FABFamily.IdentityFusion
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// VISIBILITY CLASSIFICATION (CCO-FAB-001 v2.0 Pass 1 §3)
// ─────────────────────────────────────────────────────────────────────────────

export type FABVisibility = 'task' | 'silent';

// ─────────────────────────────────────────────────────────────────────────────
// THE 6 STATES (CCO-FAB-001 v2.0 Pass 1 §4)
// CRITICAL RULE: No "Completed" state. FABs cycle — they never terminate.
// ─────────────────────────────────────────────────────────────────────────────

export enum FABState {
  Learning = 'learning',
  Active = 'active',
  Stable = 'stable',
  Drifting = 'drifting',
  Locked = 'locked',
  Blocked = 'blocked'
}

// ─────────────────────────────────────────────────────────────────────────────
// THE 4 OPERATING LEVELS (CCO-FAB-001 v2.0 Pass 1 §5)
// ─────────────────────────────────────────────────────────────────────────────

export enum FABOperatingLevel {
  L1_Standby = 'L1_STANDBY',
  L2_Scaffold = 'L2_SCAFFOLD', // proposed Feb 8 2026 — Pass 2 lock decision
  L3_Wedge = 'L3_WEDGE',
  L4_Program = 'L4_PROGRAM'
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES (CCO-FAB-001 v2.0 Pass 1 §6)
// ─────────────────────────────────────────────────────────────────────────────

export type FABDataType = 'variable' | 'binary';

// ─────────────────────────────────────────────────────────────────────────────
// ACTION MODES (CCO-FAB-001 v2.0 Pass 1 §13)
// Reinforcing deferred to Pass 2 — Stable/SCAFFOLD scope
// ─────────────────────────────────────────────────────────────────────────────

export type FABActionMode = 'preventive' | 'protective' | 'reinforcing';

// ─────────────────────────────────────────────────────────────────────────────
// TIMESTAMP PIN (G1 §2 — 4 levels)
// ─────────────────────────────────────────────────────────────────────────────

export interface TimestampPin {
  should_start_ts: string; // ISO 8601 UTC
  actual_start_ts: string;
  actual_end_ts: string;
  duration_sec: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOOD PIN (G1 §3 — 5-pt Likert + normalized)
// Captured at Bookend Open AND Bookend Close
// ─────────────────────────────────────────────────────────────────────────────

export type MoodLikert = 1 | 2 | 3 | 4 | 5;

export interface MoodReading {
  mood_raw: MoodLikert | null; // null if patient skipped
  mood_normalized: number; // 0.0-1.0 (default 0.30 per Beacon §12.3 if skipped)
}

// ─────────────────────────────────────────────────────────────────────────────
// EFFORT PIN (G1 §4 — March 17 formula, supersedes PAC-ISE-002 v2.0)
// E = 0.40·F + 0.30·C + 0.30·LC
// LC = 0.30·Quiz_PassRate + 0.25·Quiz_Attempts_norm + 0.25·Content_Engagement_norm + 0.20·Ollie_Questions_norm
// ─────────────────────────────────────────────────────────────────────────────

export interface LearningCoefficient {
  quiz_pass_rate: number; // 0.0-1.0
  quiz_attempts_norm: number; // 0.0-1.0
  content_engagement_norm: number; // 0.0-1.0
  ollie_questions_norm: number; // 0.0-1.0
  lc_value: number; // computed: weighted sum, 0.0-1.0
}

export interface EffortScoreInputs {
  fab_completion_rate_7d: number; // F, 0.0-1.0
  consistency_timing_7d: number; // C, 0.0-1.0
  learning_coefficient: LearningCoefficient; // LC
}

export interface EffortScoreDaily {
  user_id: string;
  date: string; // YYYY-MM-DD
  inputs: EffortScoreInputs;
  effort_score_daily: number; // 0.0-1.0, the canonical E value
  computed_at: string; // ISO 8601
}

// ─────────────────────────────────────────────────────────────────────────────
// FAB BOOKEND RECORD (G1 §6 — full storage schema)
// Lives in BehaviorEvents Cosmos container
// ─────────────────────────────────────────────────────────────────────────────

export type FABOutcome = 'Y' | 'N' | 'drift';

export interface FABBookendRecord {
  id: string; // GUID
  userId: string; // partition key
  fabId: string; // FAB instance ID
  fabName: string; // e.g., "FAB-HYDRATION"
  family: FABFamily;
  visibility: FABVisibility;

  // Timestamp pin (G1 §2)
  should_start_ts: string;
  actual_start_ts: string;
  actual_end_ts: string;
  duration_sec: number;

  // Mood pin (G1 §3) — captured twice
  mood_raw_open: MoodLikert | null;
  mood_normalized_open: number;
  mood_raw_close: MoodLikert | null;
  mood_normalized_close: number;

  // Effort pin (G1 §4) — daily snapshot stamped at close
  effort_score_daily: number; // 0.0-1.0

  // Outcome
  fab_outcome: FABOutcome;

  _ts?: number; // Cosmos auto
}

// ─────────────────────────────────────────────────────────────────────────────
// FCS — FAB CONSISTENCY SCORE (CCO-FAB-001 v2.0 Pass 1 §11)
// FCS = (0.6 × Completion Rate) + (0.4 × Timing Accuracy)
// Range: 0.0-1.0 over 7/14/30 day windows
// Baseline: 14 consecutive days FCS ≥ 0.70 = Learning → Stable
// ─────────────────────────────────────────────────────────────────────────────

export interface FCSScore {
  user_id: string;
  family: FABFamily;
  window_days: 7 | 14 | 30;
  completion_rate: number; // 0.0-1.0
  timing_accuracy: number; // 0.0-1.0
  fcs_value: number; // computed: 0.6 × CR + 0.4 × TA
  computed_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIFT THRESHOLDS (CCO-FAB-001 v2.0 Pass 1 §12)
// ─────────────────────────────────────────────────────────────────────────────

export const DRIFT_DELTA_NUDGE = 0.20; // Ollie nudge threshold
export const DRIFT_DELTA_CRITICAL = 0.40; // Barista escalation threshold
export const DRIFT_RATE_RAPID_DECLINE = 0.05; // per-day rapid decline threshold

export type DriftLevel = 'stable' | 'drifting' | 'drifting_critical' | 'rapid_decline';
