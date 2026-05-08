/**
 * BariAccess Beta — FAB Seed Data
 *
 * Source: BETA-FAB-COHORT-001 v5 (May 6, 2026)
 * 130 FABs across 13 cohort members and 7 archetypes.
 *
 * VAL_DEFAULT_29 — every member also gets a wildcard 11th FAB slot, default empty.
 * VAL_DEFAULT_27 — rationale field optional, populated where useful.
 * VAL_DEFAULT_28 — critical_flag intrinsic, separate from runtime color_state.
 *
 * Run: npm run seed:fabs
 */

import type { CohortMember, FAB } from '@bariaccess/shared';

const NOW = new Date().toISOString();

function fab(
  user_id: string,
  archetype: FAB['archetype'],
  index: number,
  partial: Omit<
    FAB,
    'fab_id' | 'user_id' | 'archetype' | 'created_at' | 'updated_at'
  >
): FAB {
  return {
    fab_id: `fab_${user_id}_${String(index).padStart(2, '0')}`,
    user_id,
    archetype,
    created_at: NOW,
    updated_at: NOW,
    ...partial,
  };
}

// ────────────────────────────────────────────────────────────
// VAL — Sedentary Executive (HQ-based, GLP-1)
// ────────────────────────────────────────────────────────────
const VAL_FABS: FAB[] = [
  fab('val_andrei', 'sedentary_executive', 1, {
    name: 'Light therapy (red/UV exposure)',
    scheduled_time: '05:30',
    segment_code: 'AM1',
    window_minutes: 10,
    critical_flag: false,
    rationale: 'Anchors circadian rhythm with morning photic input',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 2, {
    name: 'Hydration — first water glass',
    scheduled_time: '05:45',
    segment_code: 'AM1',
    window_minutes: 10,
    critical_flag: false,
    rationale: 'Resets fluid balance after sleep',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 3, {
    name: 'GLP-1 / medication check',
    scheduled_time: '06:00',
    segment_code: 'AM2',
    window_minutes: 15,
    critical_flag: true, // Red — adherence critical
    rationale: 'Critical adherence — protects tirzepatide window',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 4, {
    name: 'Morning walk / movement (15 min)',
    scheduled_time: '06:30',
    segment_code: 'AM2',
    window_minutes: 20,
    critical_flag: false,
    rationale: 'Cardiovascular activation; supports cognitive primer',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 5, {
    name: 'Protein breakfast',
    scheduled_time: '07:30',
    segment_code: 'AM3',
    window_minutes: 20,
    critical_flag: false,
    rationale: 'Stabilizes blood sugar; sustains morning cognition',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 6, {
    name: 'Posture / stand-up break',
    scheduled_time: '11:00',
    segment_code: 'A4',
    window_minutes: 5,
    critical_flag: false,
    rationale: 'Counters sedentary executive posture compression',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 7, {
    name: 'Midday hydration + protein',
    scheduled_time: '13:00',
    segment_code: 'Mid2',
    window_minutes: 20,
    critical_flag: false,
    rationale: 'Bridges afternoon dip; protects decision quality',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 8, {
    name: 'Afternoon movement (walk / stairs)',
    scheduled_time: '16:00',
    segment_code: 'B2',
    window_minutes: 15,
    critical_flag: false,
    rationale: 'Disrupts sedentary chain; activates parasympathetic',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 9, {
    name: 'Wind-down — screens off',
    scheduled_time: '21:30',
    segment_code: 'PM2',
    window_minutes: 15,
    critical_flag: false,
    rationale: 'Sleep prep — reduces blue light pre-melatonin',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('val_andrei', 'sedentary_executive', 10, {
    name: 'Sleep hygiene (lights / temp)',
    scheduled_time: '22:00',
    segment_code: 'PM3',
    window_minutes: 10,
    critical_flag: false,
    rationale: 'Optimizes sleep onset environment',
    internal_only: false,
    is_wildcard: false,
  }),
];

// ────────────────────────────────────────────────────────────
// ZAKIY — Active Night-Shifter
// ────────────────────────────────────────────────────────────
const ZAKIY_FABS: FAB[] = [
  fab('zakiy_manigo', 'active_night_shifter', 1, {
    name: 'Wake-up hydration',
    scheduled_time: '09:30',
    segment_code: 'AM1',
    window_minutes: 15,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 2, {
    name: 'Sunlight exposure (10 min outside)',
    scheduled_time: '10:00',
    segment_code: 'AM2',
    window_minutes: 15,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 3, {
    name: 'Protein breakfast',
    scheduled_time: '10:30',
    segment_code: 'AM3',
    window_minutes: 20,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 4, {
    name: 'Lunch (sit-down, protein)',
    scheduled_time: '13:30',
    segment_code: 'Mid2',
    window_minutes: 30,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 5, {
    name: 'Stress check-in / 2-min breath',
    scheduled_time: '15:30',
    segment_code: 'B1',
    window_minutes: 5,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 6, {
    name: 'Gym session (1 hour)',
    scheduled_time: '16:00',
    segment_code: 'B2',
    window_minutes: 75,
    critical_flag: false,
    rationale: 'Stress release — protect this window',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 7, {
    name: 'Post-workout protein + hydration',
    scheduled_time: '17:30',
    segment_code: 'B4',
    window_minutes: 20,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 8, {
    name: 'Dinner — actual meal',
    scheduled_time: '20:30',
    segment_code: 'PM1',
    window_minutes: 30,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 9, {
    name: 'Stress decompression (off-screen)',
    scheduled_time: '23:00',
    segment_code: 'PM1',
    window_minutes: 15,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('zakiy_manigo', 'active_night_shifter', 10, {
    name: 'Screens off / sleep window start',
    scheduled_time: '01:30',
    segment_code: 'PM3',
    window_minutes: 30,
    critical_flag: false,
    rationale: 'Late-cycle sleep — backend handles same-cycle PM3',
    internal_only: false,
    is_wildcard: false,
  }),
];

// ────────────────────────────────────────────────────────────
// SEDENTARY DAY / ACTIVE NIGHT — shared template (Nikita, Isaiah)
// ────────────────────────────────────────────────────────────
const SDAN_TEMPLATE: Array<Omit<FAB, 'fab_id' | 'user_id' | 'archetype' | 'created_at' | 'updated_at'>> = [
  { name: 'Wake-up hydration', scheduled_time: '08:00', segment_code: 'AM1', window_minutes: 10, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Sunlight exposure', scheduled_time: '08:30', segment_code: 'AM2', window_minutes: 15, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Protein breakfast', scheduled_time: '09:00', segment_code: 'AM3', window_minutes: 20, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Posture / stretch break', scheduled_time: '11:30', segment_code: 'A4', window_minutes: 5, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Lunch — sit-down, protein priority', scheduled_time: '13:00', segment_code: 'Mid2', window_minutes: 30, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Afternoon movement injection (walk)', scheduled_time: '16:00', segment_code: 'B2', window_minutes: 15, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Hydration check (pre-evening)', scheduled_time: '18:00', segment_code: 'B4', window_minutes: 5, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Dinner', scheduled_time: '20:30', segment_code: 'PM1', window_minutes: 45, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Wind-down', scheduled_time: '23:30', segment_code: 'PM2', window_minutes: 15, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
  { name: 'Sleep window start', scheduled_time: '00:30', segment_code: 'PM3', window_minutes: 20, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false },
];

const NIKITA_FABS: FAB[] = SDAN_TEMPLATE.map((spec, i) =>
  fab('nikita_page', 'sedentary_day_active_night', i + 1, spec)
);
const ISAIAH_FABS: FAB[] = SDAN_TEMPLATE.map((spec, i) =>
  fab('isaiah_delrios', 'sedentary_day_active_night', i + 1, {
    ...spec,
    // Nikita-specific override: vocal rest at PM2 wind-down
    name: i === 8 ? 'Wind-down' : spec.name,
  })
);
// Apply Nikita's vocal-rest variant (FAB #9)
NIKITA_FABS[8] = { ...NIKITA_FABS[8], name: 'Wind-down — vocal rest' };
// Nikita FAB #8 dinner is "often late / social"
NIKITA_FABS[7] = { ...NIKITA_FABS[7], name: 'Dinner (often late / social)' };

// ────────────────────────────────────────────────────────────
// COSTIN — Traveling Strategist (GLP-1)
// ────────────────────────────────────────────────────────────
const COSTIN_FABS: FAB[] = [
  fab('costin_peiu', 'traveling_strategist', 1, {
    name: 'Wake-up hydration',
    scheduled_time: '06:30',
    segment_code: 'AM1',
    window_minutes: 15,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 2, {
    name: 'GLP-1 / medication check',
    scheduled_time: '07:00',
    segment_code: 'AM2',
    window_minutes: 15,
    critical_flag: true, // Red
    rationale: 'Critical adherence — protect dose timing',
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 3, {
    name: 'Time-zone / day plan check',
    scheduled_time: '07:30',
    segment_code: 'AM2',
    window_minutes: 5,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 4, {
    name: 'Protein breakfast (or hotel equivalent)',
    scheduled_time: '08:00',
    segment_code: 'AM3',
    window_minutes: 25,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 5, {
    name: 'Stress reset (2-min breath)',
    scheduled_time: '09:30',
    segment_code: 'A2',
    window_minutes: 5,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 6, {
    name: 'Mid-morning hydration',
    scheduled_time: '11:00',
    segment_code: 'A4',
    window_minutes: 5,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 7, {
    name: "Lunch — sit, don't eat in transit",
    scheduled_time: '13:00',
    segment_code: 'Mid2',
    window_minutes: 30,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 8, {
    name: 'Decompression between meetings',
    scheduled_time: '15:30',
    segment_code: 'B1',
    window_minutes: 10,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 9, {
    name: 'Dinner — protein, no late food',
    scheduled_time: '19:30',
    segment_code: 'PM1',
    window_minutes: 30,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
  fab('costin_peiu', 'traveling_strategist', 10, {
    name: 'Sleep window — same time daily',
    scheduled_time: '23:00',
    segment_code: 'PM3',
    window_minutes: 20,
    critical_flag: false,
    rationale: null,
    internal_only: false,
    is_wildcard: false,
  }),
];

// ────────────────────────────────────────────────────────────
// VICTOR — IT & Data Integration
// ────────────────────────────────────────────────────────────
const VICTOR_FABS: FAB[] = [
  fab('victor_savturev', 'it_data_integration', 1, { name: 'Wake-up hydration (pre-screen)', scheduled_time: '07:00', segment_code: 'AM1', window_minutes: 10, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 2, { name: 'Sunlight exposure (10 min outside)', scheduled_time: '07:30', segment_code: 'AM2', window_minutes: 15, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 3, { name: 'Protein breakfast (no skipping)', scheduled_time: '08:00', segment_code: 'AM3', window_minutes: 20, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 4, { name: 'Pre-deep-work brain prime (2-min breath)', scheduled_time: '09:00', segment_code: 'A1', window_minutes: 5, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 5, { name: 'Posture / stretch break', scheduled_time: '11:00', segment_code: 'A4', window_minutes: 5, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 6, { name: 'Lunch — away from terminal', scheduled_time: '13:00', segment_code: 'Mid2', window_minutes: 30, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 7, { name: 'Eye break (20-20-20 rule)', scheduled_time: '15:00', segment_code: 'B1', window_minutes: 5, critical_flag: false, rationale: 'Reduces ocular strain accumulating since 7 AM', internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 8, { name: 'Movement break (walk / push-ups)', scheduled_time: '17:00', segment_code: 'B4', window_minutes: 10, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 9, { name: 'Dinner — actual meal', scheduled_time: '19:30', segment_code: 'PM1', window_minutes: 30, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
  fab('victor_savturev', 'it_data_integration', 10, { name: 'Screens off / sleep window', scheduled_time: '23:00', segment_code: 'PM3', window_minutes: 15, critical_flag: false, rationale: null, internal_only: false, is_wildcard: false }),
];

// ────────────────────────────────────────────────────────────
// METHODICAL ACHIEVER — shared template (Grace, Jennifer, Madeline, Pamela, Donna, Roychele)
// ────────────────────────────────────────────────────────────
const MA_TEMPLATE: Array<Omit<FAB, 'fab_id' | 'user_id' | 'archetype' | 'created_at' | 'updated_at'>> = [
  { name: 'Wake-up hydration', scheduled_time: '07:00', segment_code: 'AM1', window_minutes: 10, critical_flag: false, rationale: 'Resets fluid balance after 7+ hours of dehydration; primes cognition', internal_only: false, is_wildcard: false },
  { name: 'Sunlight exposure (outside)', scheduled_time: '07:30', segment_code: 'AM2', window_minutes: 15, critical_flag: false, rationale: 'Anchors circadian rhythm, supports cortisol awakening response', internal_only: false, is_wildcard: false },
  { name: 'Protein breakfast', scheduled_time: '08:00', segment_code: 'AM3', window_minutes: 20, critical_flag: false, rationale: 'Stabilizes blood sugar; sustains cognitive performance through morning peak', internal_only: false, is_wildcard: false },
  { name: 'Mid-morning hydration check', scheduled_time: '10:30', segment_code: 'A3', window_minutes: 5, critical_flag: false, rationale: 'Counters cognitive fatigue from sustained focus work', internal_only: false, is_wildcard: false },
  { name: 'Pre-decision protein / snack', scheduled_time: '12:00', segment_code: 'A4', window_minutes: 10, critical_flag: false, rationale: 'Buffers afternoon cognitive load; protects decision quality', internal_only: false, is_wildcard: false },
  { name: 'Lunch — sit-down meal', scheduled_time: '13:00', segment_code: 'Mid2', window_minutes: 30, critical_flag: false, rationale: 'Real meal, away from desk; cognitive reset', internal_only: false, is_wildcard: false },
  { name: 'Post-lunch movement', scheduled_time: '14:00', segment_code: 'Mid3', window_minutes: 10, critical_flag: false, rationale: 'Mitigates "2–4 PM dip"; maintains afternoon clarity', internal_only: false, is_wildcard: false },
  { name: 'Decompression reset', scheduled_time: '16:30', segment_code: 'B3', window_minutes: 10, critical_flag: false, rationale: 'Post-decision-day recovery; transition signal from work to evening', internal_only: false, is_wildcard: false },
  { name: 'Dinner — protein, no late food', scheduled_time: '19:00', segment_code: 'PM1', window_minutes: 30, critical_flag: false, rationale: 'Earlier dinner protects sleep onset', internal_only: false, is_wildcard: false },
  { name: 'Wind-down + screens off', scheduled_time: '22:00', segment_code: 'PM3', window_minutes: 15, critical_flag: false, rationale: 'Sleep prep; matches evening chronotype default', internal_only: false, is_wildcard: false },
];

const MA_USERS: Array<CohortMember['user_id']> = [
  'grace',
  'jennifer_strong',
  'madeline_delrios',
  'pamela_posner',
  'donna',
  'roychele_jones',
];

const MA_FABS: FAB[] = MA_USERS.flatMap((user_id) =>
  MA_TEMPLATE.map((spec, i) => fab(user_id, 'methodical_achiever', i + 1, spec))
);

// ────────────────────────────────────────────────────────────
// LANA — Embodied Practitioner (BIOSTAT-PROPOSED)
// VAL_DEFAULT_22 — internal_only=true on all rows
// VAL_DEFAULT_32 — FAB #2 window extended from 30 → 45 min
// ────────────────────────────────────────────────────────────
const LANA_FABS: FAB[] = [
  fab('lana', 'embodied_practitioner', 1, { name: 'Wake-up hydration + body scan', scheduled_time: '07:00', segment_code: 'AM1', window_minutes: 10, critical_flag: false, rationale: 'Couples interoception with hydration; embodiment overlay on baseline anchor', internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 2, { name: 'Morning movement practice', scheduled_time: '07:30', segment_code: 'AM2', window_minutes: 45, critical_flag: false, rationale: 'KEYSTONE — anchors the day; missing it cascades to lower SC', internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 3, { name: 'Protein breakfast', scheduled_time: '09:00', segment_code: 'AM3', window_minutes: 20, critical_flag: false, rationale: null, internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 4, { name: 'Mid-morning breath anchor', scheduled_time: '11:00', segment_code: 'A4', window_minutes: 5, critical_flag: false, rationale: 'Parasympathetic activation; replaces standard posture-correction break', internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 5, { name: 'Lunch — sit-down meal', scheduled_time: '13:00', segment_code: 'Mid2', window_minutes: 30, critical_flag: false, rationale: null, internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 6, { name: 'Embodied reset / movement', scheduled_time: '15:00', segment_code: 'B1', window_minutes: 10, critical_flag: false, rationale: 'Body-mediated reset; replaces screen-based eye break', internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 7, { name: 'Hydration + posture check', scheduled_time: '17:00', segment_code: 'B4', window_minutes: 5, critical_flag: false, rationale: null, internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 8, { name: 'Dinner — protein', scheduled_time: '19:00', segment_code: 'PM1', window_minutes: 30, critical_flag: false, rationale: null, internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 9, { name: 'Evening somatic practice', scheduled_time: '21:00', segment_code: 'PM2', window_minutes: 20, critical_flag: false, rationale: 'Active wind-down — somatic experiencing, gentle movement, breath cycling', internal_only: true, is_wildcard: false }),
  fab('lana', 'embodied_practitioner', 10, { name: 'Sleep window', scheduled_time: '22:30', segment_code: 'PM3', window_minutes: 15, critical_flag: false, rationale: null, internal_only: true, is_wildcard: false }),
];

// ────────────────────────────────────────────────────────────
// EXPORT — all 130 FABs
// ────────────────────────────────────────────────────────────
export const FAB_SEED: FAB[] = [
  ...VAL_FABS,
  ...ZAKIY_FABS,
  ...NIKITA_FABS,
  ...COSTIN_FABS,
  ...VICTOR_FABS,
  ...ISAIAH_FABS,
  ...MA_FABS,
  ...LANA_FABS,
];

// Sanity check
if (FAB_SEED.length !== 130) {
  throw new Error(
    `FAB_SEED expected 130 FABs (13 × 10); got ${FAB_SEED.length}`
  );
}
