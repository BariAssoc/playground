/**
 * BariAccess Lite — Shared Types
 *
 * Source canon:
 *   - RR-Calculation-Canon-Pass0_v1_1_LOCKED.md  (universal specs)
 *   - RR-Calculation-Canon-Pass1_v1_1_LOCKED.md  (composites)
 *   - RR-Calculation-Canon-Pass3_v1_1_LOCKED.md  (sub-scores)
 *   - Beacon_Canon_v1_1.md                        (7-band system)
 *   - ISE_Canon_v3_0_Canonical.md                 (state authority)
 *   - CCO-V1V4-REFFRAME-001_v1_0.md               (reference frames)
 */

// ────────────────────────────────────────────────────────────
// CORE ENUMS — imported here for use within this file.
// They are re-exported by the package barrel directly from ../enums,
// NOT here, so the runtime enum (BeaconBand) is preserved.
// (Earlier `export type { BeaconBand, ... }` here masked the value side
//  of the enum at the public surface and broke isolatedModules.)
// ────────────────────────────────────────────────────────────

import type {
  BeaconBand,
  DegradationState,
  ProvenanceFlag,
  CompositeId,
  SubScoreId,
} from '../enums/index.js';

export interface ScoreResult {
  /** 0–100, mapped through Beacon piecewise linear function. NULL if INSUFFICIENT. */
  value: number | null;

  /** 1–7, asymmetric Beacon band. NULL if INSUFFICIENT. */
  band: BeaconBand | null;

  /** Per Pass 0 Spec 4. Drives UI rim style: solid (FULL), dashed (PARTIAL), gray (INSUFFICIENT). */
  degradation: DegradationState;

  /** Per CCO-V1V4-REFFRAME-001 §3.6. Mandatory metadata on every value. */
  provenance: ProvenanceFlag;

  /** Component breakdown — for drilldown UI and audit. */
  breakdown: Record<string, number | null>;

  /** Component weights actually used (after redistribution if PARTIAL). */
  weights_used: Record<string, number>;

  /** Source provider per V1 metric (e.g. {hrv: 'oura', sleep_stages: 'oura'}). */
  metric_sources?: Record<string, string>;

  /** True if Behavioral Bridge active per Pass 0 Spec 5. */
  bridged?: boolean;

  /** FAB IDs that drove the bridge, if bridged. */
  bridge_source_fabs?: string[];

  /** Per-component provenance roll-up. Composite is 🟡 if any sub-score is 🟡. */
  provenance_failures?: string[];

  /** Free-text notes/annotations from V4 layer (e.g. GLP-1 RHR note). */
  annotations?: ScoreAnnotation[];

  /** ISO timestamp of compute. */
  computed_at: string;
}

export interface ScoreAnnotation {
  /** Stable id — provider can mark as "read". */
  id: string;

  /** Source: 'glp1_baseline', 'lsr_warmup', 'baseline_maturing', etc. */
  source: string;

  /** Audience — provider only by default; some annotations safe for patient. */
  audience: 'provider' | 'patient' | 'both';

  /** Severity for UI sort. */
  severity: 'info' | 'caution' | 'warning';

  /** Human-readable text. */
  message: string;

  /** Citation back to canon section. */
  cites: string[];
}

// ────────────────────────────────────────────────────────────
// COMPOSITE-LEVEL RESULT
// Wraps a ScoreResult with composite metadata + cascade rim.
// ────────────────────────────────────────────────────────────

export interface CompositeResult extends ScoreResult {
  composite_id: CompositeId;

  /** Sub-score IDs feeding this composite. */
  sub_score_ids: SubScoreId[];

  /**
   * Per Pass 1 §R&R Cascade Rim Rule — if any sub-score is in band 4–7,
   * composite tile shows orange rim even if composite score is in green.
   */
  cascade_rim_active: boolean;

  /** Sub-score results, indexed by id. */
  sub_scores: Record<SubScoreId, ScoreResult>;
}

// ────────────────────────────────────────────────────────────
// R&R_LITE RESULT
// Headline. Always carries Lite badge until composite_subset.length === 8.
// ────────────────────────────────────────────────────────────

export interface RRLiteResult extends ScoreResult {
  /** Always 'rr_lite' until full pyramid ships. Per DECISIONS.md §3. */
  field_name: 'rr_lite' | 'rr';

  /** Composite IDs included. Lite = ['SRC','SBL','AMP']. */
  composite_subset: CompositeId[];

  /** Composite results indexed by id. */
  composites: Record<CompositeId, CompositeResult>;

  /** True if any composite has cascade_rim_active. Headline tile shows orange rim. */
  any_cascade_rim: boolean;

  /** ISE state at compute time. Modulates weights per ISE Canon v3.0 §3.1 Lane 1. */
  ise_state_at_compute: string;
}

// ────────────────────────────────────────────────────────────
// V4 MODIFIERS — interventional context attached to every score doc
// Per CCO-V1V4-REFFRAME-001 §3.2 (V4 = treatment data: GLP-1, ITBs, light therapy)
// ────────────────────────────────────────────────────────────

import type {
  GLP1Compound,
  TimingStrategy,
} from '../enums/index.js';

export interface GLP1Status {
  active: boolean;
  compound: GLP1Compound | null;
  start_date: string | null;       // ISO date
  dose_current: string | null;
  /** Computed: today − start_date. Null if not active. */
  days_on: number | null;
  /** True if currently in the 28-day baseline reset window per §4.5. */
  baseline_reset_active: boolean;
  /** ISO date when current dose became stable (last titration completed). */
  dose_stable_since: string | null;
}

export interface LightTherapyProtocol {
  user_id: string;
  prescription: {
    lux: number;                    // default 10000
    duration_minutes: number;       // default 15
    timing_strategy: TimingStrategy;
    fixed_time?: string;            // 'HH:MM' if timing_strategy = 'fixed'
    cbtmin_offset_minutes?: number; // +90 default for advance protocol
  };
  prescribed_by: string;            // staff_id
  prescribed_at: string;            // ISO
  protocol_version: string;         // e.g. 'advance_protocol_v1'
  active: boolean;
  override_reason?: string;
}

export interface V4Modifiers {
  glp1: GLP1Status;
  light_therapy: LightTherapyProtocol | null;
  /** ITB completion ratios — slot for future ITB integration. */
  itb_summary?: Record<string, number>;
}

// ────────────────────────────────────────────────────────────
// BASELINE — per CCO-V1V4-REFFRAME-001 §4 Personal Baseline Layer
// ────────────────────────────────────────────────────────────

export interface PersonalBaseline {
  user_id: string;
  metric: string;                   // e.g. 'hrv_rmssd', 'heartrate_resting'
  /** μ over the 28-day window. NULL if days_in_window < 7. */
  mean: number | null;
  /** σ over the 28-day window. NULL if days_in_window < 7. */
  stddev: number | null;
  /** Number of days with valid readings in current window (max 28). */
  days_in_window: number;
  /** ISO date this window opened (post-reset event). */
  window_opened_at: string;
  /** Reset events per §4.5. */
  last_reset_event?: BaselineResetEvent;
  /** Per §3.6. ✅ once days_in_window === 28; 🟡 during warmup; ❌ if no data. */
  provenance: ProvenanceFlag;
}

export interface BaselineResetEvent {
  event_type:
    | 'glp1_initiation'
    | 'glp1_dose_change'
    | 'major_surgery'
    | 'illness_extended'
    | 'travel_timezone_shift'
    | 'pregnancy_postpartum'
    | 'provider_initiated';
  occurred_at: string;              // ISO
  recorded_at: string;              // ISO
  recorded_by: string;              // staff_id or 'system'
  reason?: string;                  // free-text, required for 'provider_initiated'
}

// ────────────────────────────────────────────────────────────
// CHRONOTYPE — V3 contextual data
// Sourced from BETA-JF-BASELINE-001 (MEQ).
// ────────────────────────────────────────────────────────────

import type { ChronotypeCategory } from '../enums/index.js';

export interface ChronotypeProfile {
  user_id: string;
  /** MEQ score 16–86 (Horne-Östberg). Higher = more morning. */
  meq_score: number;
  category: ChronotypeCategory;
  /** Estimated CBTmin (core body temperature minimum) clock time, e.g. '04:30'. */
  estimated_cbtmin: string;
  /** Performance peak window for muscle/cardio (typically 4pm–8pm). */
  peak_window_start: string;        // 'HH:MM'
  peak_window_end: string;          // 'HH:MM'
  established_at: string;           // ISO
  source: 'meq_intake' | 'observed_28d' | 'provider_override';
}

// ────────────────────────────────────────────────────────────
// GLUCOSE (Libre via Spike) — per Decision 5
// ────────────────────────────────────────────────────────────

export interface GlucoseReading {
  timestamp: string;                // ISO with timezone
  value_mgdl: number;               // mg/dL
  source: string;                   // 'libre' | 'libre2' | 'libre3'
  /** True if interpolated due to gap; raw readings only false. */
  interpolated: boolean;
}

export interface OvernightGlucoseSeries {
  user_id: string;
  date: string;                     // YYYY-MM-DD (the night of)
  bedtime: string;                  // ISO — anchor from V1 sleep timestamps
  wake_time: string;                // ISO
  /** Window: bedtime+30min through wake−30min (steady-state overnight). */
  window_start: string;
  window_end: string;
  readings: GlucoseReading[];
  /** Coefficient of variation = (σ / μ) × 100. Used in SMA GlucoseStability. */
  cv_percent: number | null;
  /** True if any ≥30-min gap detected. Triggers 🟡 provenance for the night. */
  has_gaps: boolean;
  provenance: ProvenanceFlag;
}

// ────────────────────────────────────────────────────────────
// SLEEP TIMESTAMPS — V1, source-priority resolved
// Used by SQI, SRI, SNS, and as anchor for SMA last-meal-gap
// ────────────────────────────────────────────────────────────

export interface SleepNight {
  user_id: string;
  date: string;                     // YYYY-MM-DD (the night ending)
  bedtime: string;                  // ISO
  wake_time: string;                // ISO
  /** ms */
  total_sleep_ms: number;
  /** ms */
  time_in_bed_ms: number;
  efficiency: number | null;        // 0–1
  duration_deep_ms: number | null;
  duration_light_ms: number | null;
  duration_rem_ms: number | null;
  duration_awake_ms: number | null;
  awakenings: number | null;
  /** ms — sleep onset latency. */
  latency_ms: number | null;
  primary_source: string;           // 'oura' | 'polar' | 'garmin' | 'apple' | 'fab_sleep'
  metric_sources: Record<string, string>;
}

// ────────────────────────────────────────────────────────────
// WEIGHT REDISTRIBUTION INPUT/OUTPUT
// Per Pass 0 Spec 4. The single helper used everywhere.
// ────────────────────────────────────────────────────────────

export interface WeightTable {
  [key: string]: number;
}

export interface RedistributedWeights {
  weights: WeightTable;
  /** True if any redistribution happened. Sets composite to PARTIAL. */
  redistributed: boolean;
  /** Original IDs that were dropped. */
  dropped_keys: string[];
}

// ────────────────────────────────────────────────────────────
// FAB AGGREGATE — V2 input rolled up over the scoring window
// ────────────────────────────────────────────────────────────

export interface FABAggregate {
  user_id: string;
  window_start: string;             // ISO
  window_end: string;               // ISO
  /** FAB family → completion rate over window (0–1). */
  completion_by_family: Record<string, number>;
  /** FAB family → trend over window: +1 improving, 0 stable, -1 declining. */
  trend_by_family: Record<string, -1 | 0 | 1>;
  /** Subjective ratings indexed by FAB type → mean over window. */
  ratings: Record<string, number>;
  /** Activity types logged in window (for MVI Activity_diversity). */
  activity_types?: string[];
  /** Movement patterns tagged (for MVI Movement_patterns). */
  movement_patterns?: Array<'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotate'>;
  /** Meal timestamps for SMA EatingWindow + LastMealGap. */
  meal_timestamps?: { first_meal: string; last_meal: string };
  /** Light therapy adherence for CIR LightExposurePattern + V4 protocol scoring. */
  light_sessions?: Array<{ start: string; duration_min: number; lux: number }>;
}

// ────────────────────────────────────────────────────────────
// SCORE DAILY ROLLUP — Cosmos doc shape, written by nightly job
// Container: score_daily_rollup, partition: /user_id, id: {userId}:{date}
// ────────────────────────────────────────────────────────────

export interface ScoreDailyRollup {
  id: string;                       // {userId}:{date}
  user_id: string;
  date: string;                     // YYYY-MM-DD
  /** 1-indexed day since user's program start. Drives LSR warmup logic. */
  days_active: number;
  /** ISO program start anchor. */
  program_started_at: string;
  /** R&R_Lite headline + composites + sub-scores. */
  rr_lite: RRLiteResult;
  /** V4 context at compute time. */
  v4_modifiers: V4Modifiers;
  /** ISE state sampled at compute time. */
  ise_state: string;
  /** Composite subset — Lite always ['SRC','SBL','AMP']. */
  composite_subset: ('SRC' | 'SBL' | 'AMP')[];
  /** Compute job metadata. */
  computed_at: string;
  computed_by_job: string;
  /** Schema version of this rollup doc — for migration safety. */
  schema_version: string;
}
