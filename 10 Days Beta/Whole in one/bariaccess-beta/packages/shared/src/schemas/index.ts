/**
 * BariAccess Beta — Zod Runtime Validators
 *
 * Every TypeScript interface in `types/index.ts` has a corresponding Zod schema here.
 * Use these at API boundaries and on Cosmos reads to enforce shape at runtime.
 */

import { z } from 'zod';

// ────────────────────────────────────────────────────────────
// PRIMITIVE ENUMS
// ────────────────────────────────────────────────────────────
export const VTagSchema = z.enum(['V1', 'V2', 'V3', 'V4']);

export const ContextClassifierSchema = z.enum([
  'stress',
  'nutrition',
  'sleep',
  'productivity',
  'mood',
  'recovery',
  'social',
  'hunger',
  'activity',
  'hydration',
  'medication',
]);

export const ArchetypeSchema = z.enum([
  'sedentary_executive',
  'active_night_shifter',
  'sedentary_day_active_night',
  'traveling_strategist',
  'it_data_integration',
  'methodical_achiever',
  'embodied_practitioner',
]);

export const SpaceSchema = z.enum([
  'protected',
  'challenging',
  'vulnerable',
  'mix',
]);

export const CompletionSchema = z.enum(['yes', 'no', 'skip', 'timeout']);

export const ColorStateSchema = z.enum(['blue', 'green', 'orange', 'red']);

export const NudgeTypeSchema = z.enum(['10am', '1pm', '3:30pm']);

export const ChannelSchema = z.enum(['sms', 'imessage', 'whatsapp', 'email']);

export const SCBandSchema = z.enum([
  'critical',
  'yellow',
  'green',
  'optimal',
  'peak',
]);

export const SegmentCodeSchema = z.enum([
  'AM1',
  'AM2',
  'AM3',
  'A1',
  'A2',
  'A3',
  'A4',
  'Mid1',
  'Mid2',
  'Mid3',
  'B1',
  'B2',
  'B3',
  'B4',
  'PM1',
  'PM2',
  'PM3',
]);

// ────────────────────────────────────────────────────────────
// COHORT MEMBER
// ────────────────────────────────────────────────────────────
export const WearableConfigSchema = z.object({
  device: z.enum([
    'oura_ring',
    'whoop',
    'polar_360',
    'apple_watch',
    'garmin',
    'fitbit',
    'other',
  ]),
  spike_user_id: z.string().nullable(),
  active: z.boolean(),
});

export const CohortMemberSchema = z.object({
  user_id: z.string().min(1),
  full_name: z.string().min(1),
  archetype: ArchetypeSchema,
  date_of_birth: z.string().nullable(),
  age: z.number().int().nullable(),
  sex: z.enum(['M', 'F', 'intersex', 'prefer_not_to_say']).nullable(),
  glp1: z.boolean(),
  internal_only: z.boolean(),
  channel_preference: ChannelSchema.nullable(),
  default_wake_time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  default_sleep_time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  wearable: z.array(WearableConfigSchema),
  beta_started_at: z.string().nullable(),
});

// ────────────────────────────────────────────────────────────
// USER TRAITS (VAL_DEFAULT_1 — meta-state)
// ────────────────────────────────────────────────────────────
export const UserTraitsSchema = z.object({
  user_id: z.string(),
  archetype: ArchetypeSchema,
  extraversion_raw: z.number().min(5).max(25),
  conscientiousness_raw: z.number().min(5).max(25),
  stress_reactivity_raw: z.number().min(5).max(25),
  openness_raw: z.number().min(5).max(25),
  agreeableness_raw: z.number().min(5).max(25),
  chronotype: z.enum([
    'strong_morning',
    'mostly_morning',
    'flexible',
    'mostly_night',
    'strong_night',
  ]),
  energy_peak_window: z.string(),
  energy_low_window: z.string(),
  natural_wake: z.string().regex(/^\d{2}:\d{2}$/),
  natural_sleep: z.string().regex(/^\d{2}:\d{2}$/),
  computed_at: z.string(),
});

// ────────────────────────────────────────────────────────────
// FAB
// ────────────────────────────────────────────────────────────
export const FABSchema = z.object({
  fab_id: z.string(),
  user_id: z.string(),
  name: z.string().min(1),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}$/),
  segment_code: SegmentCodeSchema,
  window_minutes: z.number().int().positive(),
  critical_flag: z.boolean(),
  archetype: ArchetypeSchema,
  rationale: z.string().nullable(),
  internal_only: z.boolean(),
  is_wildcard: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ────────────────────────────────────────────────────────────
// BOOKEND EVENT
// ────────────────────────────────────────────────────────────
export const BookendEventSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  fab_id: z.string(),
  fab_name: z.string(),
  event_type: z.enum(['warmup', 'cooldown']),
  scheduled_time: z.string(),
  actual_timestamp: z.string(),
  mood: z.number().int().min(1).max(5).nullable(),
  space: SpaceSchema.nullable(),
  completion: CompletionSchema.nullable(),
  critical_flag: z.boolean(),
  color_state: ColorStateSchema,
  archetype: ArchetypeSchema,
  internal_only: z.boolean(),
  synthetic: z.boolean(),
});

// ────────────────────────────────────────────────────────────
// JOURNAL ENTRY
// ────────────────────────────────────────────────────────────
export const JournalEntrySchema = z.object({
  entry_id: z.string(),
  user_id: z.string(),
  fab_id: z.string(),
  fab_name: z.string(),
  log_time: z.string(),
  completion: CompletionSchema,
  mood_before: z.number().int().min(1).max(5).nullable(),
  mood_after: z.number().int().min(1).max(5).nullable(),
  mood_delta: z.number().int().min(-4).max(4).nullable(),
  color_state: ColorStateSchema,
  critical_flag: z.boolean(),
  internal_only: z.boolean(),
  archetype: ArchetypeSchema,
  synthetic: z.boolean(),
});

// ────────────────────────────────────────────────────────────
// MOOD EVENT
// ────────────────────────────────────────────────────────────
export const MoodEventSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  mood_raw: z.number().int().min(1).max(5),
  mood_normalized: z.number().min(0).max(1),
  beacon_value: z.number().min(0).max(100),
  source: z.enum([
    'am_jotform',
    'pm_jotform',
    'bookend_warmup',
    'bookend_cooldown',
    'nudge_1pm',
  ]),
  archetype: ArchetypeSchema,
  timestamp: z.string(),
});

// ────────────────────────────────────────────────────────────
// JOTFORM EVENT
// ────────────────────────────────────────────────────────────
export const JotFormEventSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  form_id: z.enum(['am', 'pm', 'baseline', 'intake']),
  day_number: z.number().int().min(1).max(10).nullable(),
  archetype: ArchetypeSchema,
  responses: z.record(z.unknown()),
  optional_text_submitted: z.boolean(),
  scheduled_time: z.string(),
  actual_response_time: z.string().nullable(),
  completion_status: z.enum(['complete', 'partial', 'timeout']),
  v_tags: z.array(VTagSchema),
  timestamp: z.string(),
});

// ────────────────────────────────────────────────────────────
// NUDGE EVENT
// ────────────────────────────────────────────────────────────
export const NudgeResponsesSchema = z.object({
  q1: z.union([z.literal('Y'), z.literal('N'), z.string(), z.number(), z.null()]).optional(),
  q2: z.union([z.literal('Y'), z.literal('N'), z.string(), z.number(), z.null()]).optional(),
  q3: z.union([z.literal('Y'), z.literal('N'), z.string(), z.number(), z.null()]).optional(),
  q1_reason: z.string().nullable().optional(),
  q1_time: z.string().nullable().optional(),
});

export const NudgeEventSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  nudge_id: NudgeTypeSchema,
  scheduled_time: z.string(),
  actual_response_time: z.string().nullable(),
  responses: NudgeResponsesSchema,
  archetype: ArchetypeSchema,
  v_tags: z.array(VTagSchema),
  context_classifier: ContextClassifierSchema.nullable(),
  completion_status: z.enum(['complete', 'partial', 'timeout', 'parse_failed']),
  raw_message: z.string().nullable(),
});

// ────────────────────────────────────────────────────────────
// EFFORT DAILY ROLLUP
// ────────────────────────────────────────────────────────────
export const EffortDailyRollupSchema = z.object({
  rollup_id: z.string(),
  user_id: z.string(),
  archetype: ArchetypeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  F: z.number().min(0).max(1),
  C: z.number().min(0).max(1),
  LC_beta: z.number().min(0).max(1),
  E: z.number().min(0).max(1),
  Mood_daily: z.number().min(0).max(1),
  grit_triggered: z.boolean(),
  grit_multiplier_max: z.number().min(1).max(2),
  V1: z.number().min(0).max(100),
  V2_beta: z.number().min(0).max(100),
  V3: z.number().min(0).max(100),
  V4_beta: z.number().min(0).max(100),
  SC_beta: z.number().min(0).max(100),
  SC_band: SCBandSchema,
  credits_earned_total: z.number().min(0),
  credits_grit_boosted: z.number().min(0),
  computed_at: z.string(),
  partial_window: z.boolean(),
});
