/**
 * BariAccess Beta — Shared Types
 *
 * Source: BETA-VTAG-001 §Multi-Tag Architecture, BETA-BOOKEND-001 §Data Schema,
 *         BETA-FORMULA-001 §Storage containers, BETA-FAB-COHORT-001 §Implementation Notes.
 *
 * Every container schema in the beta is represented here as a TypeScript interface.
 */

import type {
  Archetype,
  Channel,
  ColorState,
  Completion,
  ContentType,
  ContextClassifier,
  ISEState,
  NudgeType,
  SCBand,
  SegmentCode,
  Space,
  VTag,
} from '../enums';

// ────────────────────────────────────────────────────────────
// COHORT MEMBER (BETA-COHORT-ROSTER-001)
// ────────────────────────────────────────────────────────────
export interface CohortMember {
  user_id: string;
  full_name: string;
  archetype: Archetype;
  date_of_birth: string | null; // ISO 8601 (YYYY-MM-DD)
  age: number | null;
  sex: 'M' | 'F' | 'intersex' | 'prefer_not_to_say' | null; // VAL_DEFAULT_23
  glp1: boolean;
  internal_only: boolean; // VAL_DEFAULT_22 — Lana flag
  channel_preference: Channel | null;
  default_wake_time: string | null; // 'HH:MM' cohort local
  default_sleep_time: string | null; // 'HH:MM' cohort local
  wearable: WearableConfig[];
  beta_started_at: string | null; // ISO 8601
}

export interface WearableConfig {
  device:
    | 'oura_ring'
    | 'whoop'
    | 'polar_360'
    | 'apple_watch'
    | 'garmin'
    | 'fitbit'
    | 'other';
  spike_user_id: string | null;
  active: boolean;
}

// ────────────────────────────────────────────────────────────
// USER TRAITS (VAL_DEFAULT_1 — meta-state, NOT V-tagged)
// Stores OCEAN scores derived from BETA-JF-BASELINE-001 Q6–Q30.
// ────────────────────────────────────────────────────────────
export interface UserTraits {
  user_id: string;
  archetype: Archetype;
  // OCEAN — each 5–25 raw, 0–1 normalized
  extraversion_raw: number;
  conscientiousness_raw: number;
  stress_reactivity_raw: number;
  openness_raw: number;
  agreeableness_raw: number;
  // Chronotype derived from BETA-JF-BASELINE-001 Q1–Q5
  chronotype:
    | 'strong_morning'
    | 'mostly_morning'
    | 'flexible'
    | 'mostly_night'
    | 'strong_night';
  energy_peak_window: string; // 'HH:MM-HH:MM'
  energy_low_window: string;
  natural_wake: string; // 'HH:MM'
  natural_sleep: string;
  computed_at: string; // ISO 8601
}

// ────────────────────────────────────────────────────────────
// FAB DEFINITION (BETA-FAB-COHORT-001 §Implementation Notes)
// VAL_DEFAULT_27 (rationale optional for all), VAL_DEFAULT_28 (critical_flag separate from color_state)
// ────────────────────────────────────────────────────────────
export interface FAB {
  fab_id: string;
  user_id: string;
  name: string;
  scheduled_time: string; // 'HH:MM' cohort local
  segment_code: SegmentCode;
  window_minutes: number;
  critical_flag: boolean; // VAL_DEFAULT_28 — intrinsic medical criticality
  archetype: Archetype;
  rationale: string | null; // VAL_DEFAULT_27 — optional for all archetypes
  internal_only: boolean; // VAL_DEFAULT_22 — true for Lana
  is_wildcard: boolean; // VAL_DEFAULT_29 — 11th slot, populated post-intake
  created_at: string;
  updated_at: string;
}

// ────────────────────────────────────────────────────────────
// BOOKEND EVENT (BETA-BOOKEND-001 §Container 1: bookend_events)
// ────────────────────────────────────────────────────────────
export interface BookendEvent {
  event_id: string;
  user_id: string;
  fab_id: string;
  fab_name: string;
  event_type: 'warmup' | 'cooldown';
  scheduled_time: string; // ISO 8601
  actual_timestamp: string; // ISO 8601
  mood: number | null; // 1–5, VAL_DEFAULT_37 (skippable warm-up)
  space: Space | null; // VAL_DEFAULT_34 (warm-up only, null on cool-down)
  completion: Completion | null; // null on warmup
  critical_flag: boolean;
  color_state: ColorState; // VAL_DEFAULT_28 — runtime, distinct from critical_flag
  archetype: Archetype; // VAL_DEFAULT_4 + VAL_DEFAULT_38 — denormalized
  internal_only: boolean;
  synthetic: boolean; // true for backfill data
}

// ────────────────────────────────────────────────────────────
// JOURNAL ENTRY (BETA-BOOKEND-001 §Container 2: journal_entries)
// VAL_DEFAULT_35 — paired write at cool-down.
// ────────────────────────────────────────────────────────────
export interface JournalEntry {
  entry_id: string;
  user_id: string;
  fab_id: string;
  fab_name: string;
  log_time: string; // ISO 8601 (cool-down timestamp)
  completion: Completion;
  mood_before: number | null; // 1–5
  mood_after: number | null; // 1–5, VAL_DEFAULT_36 (always captured)
  mood_delta: number | null; // -4 to +4
  color_state: ColorState;
  critical_flag: boolean;
  internal_only: boolean;
  archetype: Archetype;
  synthetic: boolean;
}

// ────────────────────────────────────────────────────────────
// MOOD EVENT (BETA-FORMULA-001 §1: mood_events)
// VAL_DEFAULT_35 — every mood capture writes here.
// ────────────────────────────────────────────────────────────
export interface MoodEvent {
  event_id: string;
  user_id: string;
  mood_raw: number; // 1–5
  mood_normalized: number; // 0.0–1.0 = (raw − 1) / 4
  beacon_value: number; // 7 / 25.5 / 50 / 75 / 95 (non-linear)
  source:
    | 'am_jotform'
    | 'pm_jotform'
    | 'bookend_warmup'
    | 'bookend_cooldown'
    | 'nudge_1pm';
  archetype: Archetype; // VAL_DEFAULT_38
  timestamp: string; // ISO 8601
}

// ────────────────────────────────────────────────────────────
// JOTFORM EVENT (BETA-FORMULA-001 §10: jotform_events)
// ────────────────────────────────────────────────────────────
export interface JotFormEvent {
  event_id: string;
  user_id: string;
  form_id: 'am' | 'pm' | 'baseline' | 'intake';
  day_number: number | null; // 1–10 for AM/PM, null for one-time
  archetype: Archetype; // VAL_DEFAULT_38
  responses: Record<string, unknown>; // Q1, Q2, ... raw values
  optional_text_submitted: boolean;
  scheduled_time: string;
  actual_response_time: string | null;
  completion_status: 'complete' | 'partial' | 'timeout';
  v_tags: VTag[]; // Aggregated across all responses in form
  timestamp: string;
}

// ────────────────────────────────────────────────────────────
// NUDGE EVENT (BETA-NUDGE-001 §Compliance Tracking)
// ────────────────────────────────────────────────────────────
export interface NudgeEvent {
  event_id: string;
  user_id: string;
  nudge_id: NudgeType;
  scheduled_time: string;
  actual_response_time: string | null;
  responses: NudgeResponses;
  archetype: Archetype; // VAL_DEFAULT_38
  v_tags: VTag[];
  context_classifier: ContextClassifier | null;
  completion_status: 'complete' | 'partial' | 'timeout' | 'parse_failed';
  raw_message: string | null; // Original SMS/WhatsApp body for audit
}

export interface NudgeResponses {
  q1?: 'Y' | 'N' | string | number | null;
  q2?: 'Y' | 'N' | string | number | null;
  q3?: 'Y' | 'N' | string | number | null;
  q1_reason?: string | null; // 1 PM Q1 free text
  q1_time?: string | null; // 3:30 PM Q1 lunch time
}

// ────────────────────────────────────────────────────────────
// V-TAGGED CONTENT ROW (BETA-VTAG-001 §Multi-Tag Architecture)
// Generic schema — every captured value can be wrapped in this.
// ────────────────────────────────────────────────────────────
export interface VTaggedContent {
  content_id: string;
  content_type: ContentType;
  raw_value: unknown;
  v_tags: VTag[];
  fab_flag: boolean; // VAL_DEFAULT_3 — true when row directly captures FAB attempt
  context_classifier: ContextClassifier | null;
  archetype: Archetype; // VAL_DEFAULT_4
  user_id: string;
  timestamp: string;
  derived: boolean; // true for computed metrics (e.g., F, C, E)
  polarity: -1 | 1; // VAL_DEFAULT — anti-interventions get -1 (alcohol, late caffeine)
}

// ────────────────────────────────────────────────────────────
// EFFORT DAILY ROLLUP (BETA-FORMULA-001 §10: effort_daily_rollup)
// Computed nightly. Read-only at display time (CCO-FAB-001-PIN-001).
// ────────────────────────────────────────────────────────────
export interface EffortDailyRollup {
  rollup_id: string;
  user_id: string;
  archetype: Archetype;
  date: string; // YYYY-MM-DD cohort local
  // Components — all 0.0–1.0
  F: number;
  C: number;
  LC_beta: number;
  E: number; // Effort = 0.40·F + 0.30·C + 0.30·LC_beta
  Mood_daily: number; // VAL_DEFAULT_14 — equal-weighted mean
  // Grit
  grit_triggered: boolean;
  grit_multiplier_max: number; // Max M observed today (1.0–2.0)
  // Stability Coefficient — bounded 0–100
  V1: number;
  V2_beta: number; // VAL_DEFAULT_13 — (Mood × 50) + (E × 50)
  V3: number;
  V4_beta: number; // VAL_DEFAULT_13 — (F × 70) + (anchors × 30)
  SC_beta: number;
  SC_band: SCBand;
  // Credits
  credits_earned_total: number;
  credits_grit_boosted: number;
  // Compute provenance
  computed_at: string;
  partial_window: boolean; // True for first 6 days (per §2 edge case)
}

// ────────────────────────────────────────────────────────────
// DISENGAGEMENT FLAG (BETA-FORMULA-001 §9)
// ────────────────────────────────────────────────────────────
export interface DisengagementFlag {
  flag_id: string;
  user_id: string;
  archetype: Archetype;
  flagged_at: string;
  rule:
    | 'E_below_03_for_3d'
    | 'E_below_02_for_5d'
    | 'no_app_interaction_7d';
  action: 'soft_nudge' | 'human_outreach' | 'winback';
  resolved: boolean;
  resolved_at: string | null;
}

// ────────────────────────────────────────────────────────────
// WEARABLE STREAM (BETA-VTAG-001 §Wearable Bookend Streams)
// Auto-captured via Spike API — V1 only.
// ────────────────────────────────────────────────────────────
export interface WearableStream {
  stream_id: string;
  user_id: string;
  metric:
    | 'hrv'
    | 'sleep_stages'
    | 'rhr'
    | 'temperature'
    | 'steps'
    | 'spo2';
  raw_value: number | object;
  unit: string;
  v_tags: VTag[]; // Always [V1]
  source_device: WearableConfig['device'];
  timestamp: string;
}

// ────────────────────────────────────────────────────────────
// PREDICTION FIDELITY (post-launch, candidate canon CCO-PREDICTION-FAB-001)
// Captured for Day 11 trend report; not used in beta scoring.
// ────────────────────────────────────────────────────────────
export interface PredictionFidelity {
  fidelity_id: string;
  user_id: string;
  date: string;
  productivity_match: boolean | null; // AM Q5 vs 1 PM Q1
  mood_match: boolean | null; // AM mood-prediction (v0.3) vs PM Q1
  space_match: boolean | null; // AM space-prediction (v0.3) vs PM Q6
  fidelity_score: number; // 0.0–1.0 across captured loops
  computed_at: string;
}
