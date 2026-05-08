/**
 * BariAccess Beta — Cohort Seed Data
 *
 * Source: BETA-COHORT-ROSTER-001 v1 (Lana = #12) + Roychele Jones (#13).
 * 13 members across 7 archetypes.
 *
 * Run: npm run seed:cohort
 *
 * VAL_DEFAULT_18 — wake/sleep windows for 6 women are placeholders
 *                  (refined from intake May 11+).
 * VAL_DEFAULT_19 — channel preference TBD per cohort member.
 * VAL_DEFAULT_22 — Lana internal_only=true, delayed entry until intake completes.
 */

import type { CohortMember } from '@bariaccess/shared';

export const COHORT_SEED: CohortMember[] = [
  {
    user_id: 'val_andrei',
    full_name: 'Val Andrei',
    archetype: 'sedentary_executive',
    date_of_birth: null,
    age: null,
    sex: 'M',
    glp1: true,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '05:15',
    default_sleep_time: '21:00',
    wearable: [
      { device: 'oura_ring', spike_user_id: null, active: true },
      { device: 'polar_360', spike_user_id: null, active: true },
    ],
    beta_started_at: null,
  },
  {
    user_id: 'zakiy_manigo',
    full_name: 'Zakiy Manigo',
    archetype: 'active_night_shifter',
    date_of_birth: null,
    age: null,
    sex: 'M',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '09:30',
    default_sleep_time: '01:30',
    wearable: [
      { device: 'oura_ring', spike_user_id: null, active: true },
      { device: 'polar_360', spike_user_id: null, active: true },
    ],
    beta_started_at: null,
  },
  {
    user_id: 'nikita_page',
    full_name: 'Nikita Page',
    archetype: 'sedentary_day_active_night',
    date_of_birth: null,
    age: null,
    sex: 'M', // Confirmed by Val
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '08:00',
    default_sleep_time: '00:30',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'costin_peiu',
    full_name: 'Costin Peiu',
    archetype: 'traveling_strategist',
    date_of_birth: null,
    age: null,
    sex: 'M',
    glp1: true,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '06:30',
    default_sleep_time: '23:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'victor_savturev',
    full_name: 'Victor Savturev',
    archetype: 'it_data_integration',
    date_of_birth: null,
    age: null,
    sex: 'M',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '23:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'isaiah_delrios',
    full_name: 'Isaiah DelRios',
    archetype: 'sedentary_day_active_night',
    date_of_birth: null,
    age: null,
    sex: 'M',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '08:00',
    default_sleep_time: '00:30',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'grace',
    full_name: 'Grace',
    archetype: 'methodical_achiever',
    date_of_birth: null,
    age: null,
    sex: 'F',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '07:00', // VAL_DEFAULT_18 — placeholder
    default_sleep_time: '22:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'jennifer_strong',
    full_name: 'Jennifer Strong, NP',
    archetype: 'methodical_achiever',
    date_of_birth: null,
    age: null,
    sex: 'F',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '22:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'madeline_delrios',
    full_name: 'Madeline DelRios',
    archetype: 'methodical_achiever',
    date_of_birth: null,
    age: null,
    sex: 'F',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '22:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'pamela_posner',
    full_name: 'Pamela Posner, RD',
    archetype: 'methodical_achiever',
    date_of_birth: null,
    age: null,
    sex: 'F',
    glp1: false,
    internal_only: false, // Dual-role flag handled at analysis layer
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '22:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'donna',
    full_name: 'Donna',
    archetype: 'methodical_achiever',
    date_of_birth: null,
    age: null,
    sex: 'F',
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '22:00',
    wearable: [],
    beta_started_at: null,
  },
  {
    user_id: 'lana',
    full_name: 'Lana',
    archetype: 'embodied_practitioner',
    date_of_birth: null,
    age: null,
    sex: 'F', // Likely; confirm in intake
    glp1: false, // VAL_DEFAULT — confirm in intake (Open Item)
    internal_only: true, // VAL_DEFAULT_22 — PROFEX firewall
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '22:30',
    wearable: [],
    beta_started_at: null, // Delayed entry — set when intake completes
  },
  {
    user_id: 'roychele_jones',
    full_name: 'Roychele Jones',
    archetype: 'methodical_achiever',
    date_of_birth: null,
    age: null,
    sex: 'F', // Likely; confirm in intake
    glp1: false,
    internal_only: false,
    channel_preference: null,
    default_wake_time: '07:00',
    default_sleep_time: '22:00',
    wearable: [],
    beta_started_at: null,
  },
];

/**
 * Pamela has a dual role: BBS Barista AND cohort member.
 * Flagged at analysis layer (not as internal_only, since her cohort data
 * IS valid; just tag for "internal-beta inclusion" caveat in reports).
 */
export const PAMELA_DUAL_ROLE_FLAG = 'pamela_posner';
