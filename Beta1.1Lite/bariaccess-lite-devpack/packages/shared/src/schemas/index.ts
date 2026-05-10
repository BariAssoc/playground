/**
 * BariAccess Lite — Zod Runtime Validators
 * Mirrors types/index.ts. Use these at API boundaries and Cosmos read/write.
 */

import { z } from 'zod';

// ────────────────────────────────────────────────────────────
// CORE ENUM SCHEMAS
// ────────────────────────────────────────────────────────────

export const BeaconBandSchema = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4),
  z.literal(5), z.literal(6), z.literal(7),
]);

export const ISEStateSchema = z.enum([
  'ISE_0_NEUTRAL_BASELINE',
  'ISE_1_ALIGNED_AVAILABLE',
  'ISE_2_PROTECTIVE_RECOVERY_FORWARD',
  'ISE_3_CONTAINED_LOAD_LIMITED',
  'ISE_4_BUILDING_MOMENTUM',
  'ISE_5_RESTRICTED_GUARDED',
  'ISE_6_EXPLORATORY_LOW_SIGNAL',
]);

export const DegradationStateSchema = z.enum(['FULL', 'PARTIAL', 'INSUFFICIENT']);

export const ProvenanceFlagSchema = z.enum([
  'VALIDATED',
  'PENDING_VALIDATION',
  'UNKNOWN_METHOD',
]);

export const CompositeIdSchema = z.enum(['SRC', 'SBL', 'AMP']);

export const SubScoreIdSchema = z.enum([
  'SQI', 'SRI', 'SNS',
  'CIR', 'SMA', 'RSI',
  'EPC', 'MVI', 'LSR',
]);

export const GLP1CompoundSchema = z.enum([
  'semaglutide', 'tirzepatide', 'liraglutide', 'other',
]);

export const TimingStrategySchema = z.enum([
  'fixed', 'chronotype_indexed', 'cbtmin_offset',
]);

export const ChronotypeCategorySchema = z.enum([
  'definitely_morning',
  'moderately_morning',
  'neither',
  'moderately_evening',
  'definitely_evening',
]);

// ────────────────────────────────────────────────────────────
// SCORE RESULT
// ────────────────────────────────────────────────────────────

export const ScoreAnnotationSchema = z.object({
  id: z.string(),
  source: z.string(),
  audience: z.enum(['provider', 'patient', 'both']),
  severity: z.enum(['info', 'caution', 'warning']),
  message: z.string(),
  cites: z.array(z.string()),
});

export const ScoreResultSchema = z.object({
  value: z.number().min(0).max(100).nullable(),
  band: BeaconBandSchema.nullable(),
  degradation: DegradationStateSchema,
  provenance: ProvenanceFlagSchema,
  breakdown: z.record(z.string(), z.number().nullable()),
  weights_used: z.record(z.string(), z.number()),
  metric_sources: z.record(z.string(), z.string()).optional(),
  bridged: z.boolean().optional(),
  bridge_source_fabs: z.array(z.string()).optional(),
  provenance_failures: z.array(z.string()).optional(),
  annotations: z.array(ScoreAnnotationSchema).optional(),
  computed_at: z.string(),
});

// ────────────────────────────────────────────────────────────
// V4 — GLP-1, light therapy
// ────────────────────────────────────────────────────────────

export const GLP1StatusSchema = z.object({
  active: z.boolean(),
  compound: GLP1CompoundSchema.nullable(),
  start_date: z.string().nullable(),
  dose_current: z.string().nullable(),
  days_on: z.number().int().nonnegative().nullable(),
  baseline_reset_active: z.boolean(),
  dose_stable_since: z.string().nullable(),
});

export const LightTherapyProtocolSchema = z.object({
  user_id: z.string(),
  prescription: z.object({
    lux: z.number().positive(),
    duration_minutes: z.number().positive(),
    timing_strategy: TimingStrategySchema,
    fixed_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    cbtmin_offset_minutes: z.number().int().optional(),
  }),
  prescribed_by: z.string(),
  prescribed_at: z.string(),
  protocol_version: z.string(),
  active: z.boolean(),
  override_reason: z.string().optional(),
});

export const V4ModifiersSchema = z.object({
  glp1: GLP1StatusSchema,
  light_therapy: LightTherapyProtocolSchema.nullable(),
  itb_summary: z.record(z.string(), z.number()).optional(),
});

// ────────────────────────────────────────────────────────────
// BASELINE
// ────────────────────────────────────────────────────────────

export const BaselineResetEventSchema = z.object({
  event_type: z.enum([
    'glp1_initiation',
    'glp1_dose_change',
    'major_surgery',
    'illness_extended',
    'travel_timezone_shift',
    'pregnancy_postpartum',
    'provider_initiated',
  ]),
  occurred_at: z.string(),
  recorded_at: z.string(),
  recorded_by: z.string(),
  reason: z.string().optional(),
});

export const PersonalBaselineSchema = z.object({
  user_id: z.string(),
  metric: z.string(),
  mean: z.number().nullable(),
  stddev: z.number().nullable(),
  days_in_window: z.number().int().min(0).max(28),
  window_opened_at: z.string(),
  last_reset_event: BaselineResetEventSchema.optional(),
  provenance: ProvenanceFlagSchema,
});

// ────────────────────────────────────────────────────────────
// CHRONOTYPE
// ────────────────────────────────────────────────────────────

export const ChronotypeProfileSchema = z.object({
  user_id: z.string(),
  meq_score: z.number().min(16).max(86),
  category: ChronotypeCategorySchema,
  estimated_cbtmin: z.string().regex(/^\d{2}:\d{2}$/),
  peak_window_start: z.string().regex(/^\d{2}:\d{2}$/),
  peak_window_end: z.string().regex(/^\d{2}:\d{2}$/),
  established_at: z.string(),
  source: z.enum(['meq_intake', 'observed_28d', 'provider_override']),
});

// ────────────────────────────────────────────────────────────
// GLUCOSE (Libre)
// ────────────────────────────────────────────────────────────

export const GlucoseReadingSchema = z.object({
  timestamp: z.string(),
  value_mgdl: z.number().min(20).max(600),
  source: z.string(),
  interpolated: z.boolean(),
});

export const OvernightGlucoseSeriesSchema = z.object({
  user_id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bedtime: z.string(),
  wake_time: z.string(),
  window_start: z.string(),
  window_end: z.string(),
  readings: z.array(GlucoseReadingSchema),
  cv_percent: z.number().nullable(),
  has_gaps: z.boolean(),
  provenance: ProvenanceFlagSchema,
});

// ────────────────────────────────────────────────────────────
// SLEEP NIGHT
// ────────────────────────────────────────────────────────────

export const SleepNightSchema = z.object({
  user_id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bedtime: z.string(),
  wake_time: z.string(),
  total_sleep_ms: z.number().nonnegative(),
  time_in_bed_ms: z.number().nonnegative(),
  efficiency: z.number().min(0).max(1).nullable(),
  duration_deep_ms: z.number().nullable(),
  duration_light_ms: z.number().nullable(),
  duration_rem_ms: z.number().nullable(),
  duration_awake_ms: z.number().nullable(),
  awakenings: z.number().int().nullable(),
  latency_ms: z.number().nullable(),
  primary_source: z.string(),
  metric_sources: z.record(z.string(), z.string()),
});

// ────────────────────────────────────────────────────────────
// ROLLUP DOC
// ────────────────────────────────────────────────────────────

export const ScoreDailyRollupSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  days_active: z.number().int().min(1),
  program_started_at: z.string(),
  rr_lite: z.unknown(),                  // RRLiteResult — opaque to schema
  v4_modifiers: V4ModifiersSchema,
  ise_state: z.string(),
  composite_subset: z.array(CompositeIdSchema),
  computed_at: z.string(),
  computed_by_job: z.string(),
  schema_version: z.string(),
});
