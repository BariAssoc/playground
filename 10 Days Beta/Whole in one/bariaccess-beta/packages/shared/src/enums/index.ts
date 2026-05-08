/**
 * BariAccess Beta — Shared Enums
 *
 * Source: BETA-VTAG-001 v1, BETA-BOOKEND-001 v3, BETA-FAB-COHORT-001 v5
 * All locked values from spec documents dated May 6, 2026.
 */

// ────────────────────────────────────────────────────────────
// V-DOMAIN TAGS (BETA-VTAG-001 §V-Domain Reference)
// ────────────────────────────────────────────────────────────
export const VTag = {
  V1: 'V1', // Biometric — wearable streams (HRV, sleep, RHR, temp, steps)
  V2: 'V2', // Behavioral — Mood, Effort, Consistency, Frequency, Productivity match
  V3: 'V3', // Contextual — P/C/V Space, Hunger reading, Timing, Chronotype
  V4: 'V4', // Interventional — Protein, Hydration, Movement, Medication, Sleep prep
} as const;

export type VTag = (typeof VTag)[keyof typeof VTag];

// ────────────────────────────────────────────────────────────
// CONTEXT CLASSIFIER (VAL_DEFAULT_2 — DECISIONS.md #2)
// 11-value locked enum. Routes same content to different scores.
// ────────────────────────────────────────────────────────────
export const ContextClassifier = {
  STRESS: 'stress',
  NUTRITION: 'nutrition',
  SLEEP: 'sleep',
  PRODUCTIVITY: 'productivity',
  MOOD: 'mood',
  RECOVERY: 'recovery',
  SOCIAL: 'social',
  HUNGER: 'hunger',
  ACTIVITY: 'activity',
  HYDRATION: 'hydration',
  MEDICATION: 'medication',
} as const;

export type ContextClassifier =
  (typeof ContextClassifier)[keyof typeof ContextClassifier];

// ────────────────────────────────────────────────────────────
// ARCHETYPES (BETA-COHORT-ROSTER-001 v1, BETA-FAB-COHORT-001 v5)
// 7 locked archetypes across 13-person cohort.
// ────────────────────────────────────────────────────────────
export const Archetype = {
  SEDENTARY_EXECUTIVE: 'sedentary_executive',
  ACTIVE_NIGHT_SHIFTER: 'active_night_shifter',
  SEDENTARY_DAY_ACTIVE_NIGHT: 'sedentary_day_active_night',
  TRAVELING_STRATEGIST: 'traveling_strategist',
  IT_DATA_INTEGRATION: 'it_data_integration',
  METHODICAL_ACHIEVER: 'methodical_achiever',
  EMBODIED_PRACTITIONER: 'embodied_practitioner',
} as const;

export type Archetype = (typeof Archetype)[keyof typeof Archetype];

// ────────────────────────────────────────────────────────────
// SPACE — Protected / Challenging / Vulnerable
// (BETA-INTAKE-001, BETA-BOOKEND-001 §Warm-Up Bookend)
// ────────────────────────────────────────────────────────────
export const Space = {
  PROTECTED: 'protected', // Calm, in zone — Multiplier 1.0×
  CHALLENGING: 'challenging', // Engaged, problem-solving — Multiplier 1.25×
  VULNERABLE: 'vulnerable', // Exposed, high-stakes — Multiplier 1.5×
  MIX: 'mix', // Used in JotForms (recall) — Multiplier 1.0× (no boost)
} as const;

export type Space = (typeof Space)[keyof typeof Space];

// ────────────────────────────────────────────────────────────
// COMPLETION STATE (BETA-BOOKEND-001 §Cool-Down Bookend)
// ────────────────────────────────────────────────────────────
export const Completion = {
  YES: 'yes',
  NO: 'no',
  SKIP: 'skip',
  TIMEOUT: 'timeout', // No response within window — system-set
} as const;

export type Completion = (typeof Completion)[keyof typeof Completion];

// ────────────────────────────────────────────────────────────
// COLOR STATE (BETA-BOOKEND-001 §Color State Logic)
// Runtime state, distinct from intrinsic critical_flag (VAL_DEFAULT_28)
// ────────────────────────────────────────────────────────────
export const ColorState = {
  BLUE: 'blue', // Warm-up fired, awaiting response
  GREEN: 'green', // Completed within window
  ORANGE: 'orange', // Missed (non-critical)
  RED: 'red', // Critical FAB missed
} as const;

export type ColorState = (typeof ColorState)[keyof typeof ColorState];

// ────────────────────────────────────────────────────────────
// CONTENT TYPE (BETA-VTAG-001 §Multi-Tag Architecture)
// ────────────────────────────────────────────────────────────
export const ContentType = {
  JOTFORM_Q: 'jotform_q',
  NUDGE_Q: 'nudge_q',
  BOOKEND_EVENT: 'bookend_event',
  WEARABLE_STREAM: 'wearable_stream',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

// ────────────────────────────────────────────────────────────
// SC BANDS (BETA-FORMULA-001 §8, VAL_DEFAULT_16)
// 5-band Path B thresholds for Day 11 report narrative.
// ────────────────────────────────────────────────────────────
export const SCBand = {
  CRITICAL: 'critical', // < 25
  YELLOW: 'yellow', // 25–50
  GREEN: 'green', // 50–75
  OPTIMAL: 'optimal', // 75–90
  PEAK: 'peak', // 90+
} as const;

export type SCBand = (typeof SCBand)[keyof typeof SCBand];

export function getSCBand(sc: number): SCBand {
  if (sc < 25) return SCBand.CRITICAL;
  if (sc < 50) return SCBand.YELLOW;
  if (sc < 75) return SCBand.GREEN;
  if (sc < 90) return SCBand.OPTIMAL;
  return SCBand.PEAK;
}

// ────────────────────────────────────────────────────────────
// SEGMENT CODES (BETA-BOOKEND-001 §Routine Bookshelf)
// ────────────────────────────────────────────────────────────
export const SegmentCode = {
  // Morning
  AM1: 'AM1',
  AM2: 'AM2',
  AM3: 'AM3',
  // Bar: Morning → Midday
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  A4: 'A4',
  // Midday
  MID1: 'Mid1',
  MID2: 'Mid2',
  MID3: 'Mid3',
  // Bar: Midday → Evening
  B1: 'B1',
  B2: 'B2',
  B3: 'B3',
  B4: 'B4',
  // Evening
  PM1: 'PM1',
  PM2: 'PM2',
  PM3: 'PM3',
} as const;

export type SegmentCode = (typeof SegmentCode)[keyof typeof SegmentCode];

// ────────────────────────────────────────────────────────────
// NUDGE TYPE (BETA-NUDGE-001)
// ────────────────────────────────────────────────────────────
export const NudgeType = {
  AM_10: '10am', // FAB Check (protein/hydration/movement)
  PM_1: '1pm', // Productivity & Mood
  PM_330: '3:30pm', // Lunch & Hunger
} as const;

export type NudgeType = (typeof NudgeType)[keyof typeof NudgeType];

// ────────────────────────────────────────────────────────────
// CHANNEL (BETA-NUDGE-001 §Delivery Channel Strategy)
// ────────────────────────────────────────────────────────────
export const Channel = {
  SMS: 'sms',
  IMESSAGE: 'imessage',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
} as const;

export type Channel = (typeof Channel)[keyof typeof Channel];

// ────────────────────────────────────────────────────────────
// ISE STATE (BariAccess canon — preserved for forward-compat)
// 7-state finite state machine, currently not driving beta UI.
// ────────────────────────────────────────────────────────────
export const ISEState = {
  ISE_0: 'ISE_0',
  ISE_1: 'ISE_1',
  ISE_2: 'ISE_2',
  ISE_3: 'ISE_3',
  ISE_4: 'ISE_4',
  ISE_5: 'ISE_5',
  ISE_6: 'ISE_6',
} as const;

export type ISEState = (typeof ISEState)[keyof typeof ISEState];
