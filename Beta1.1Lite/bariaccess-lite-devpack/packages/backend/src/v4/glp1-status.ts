/**
 * BariAccess Lite — V4 GLP-1 Status
 *
 * Source: DECISIONS.md §7
 *         CCO-V1V4-REFFRAME-001 §3.2 (V4 = treatment data)
 *
 * Reads patient profile (provider-entered at clinical intake, NOT user self-report).
 * Returns GLP1Status with days_on, baseline_reset_active, dose_stable_since.
 *
 * The math is GLP-1-agnostic. This module's job is to surface metadata
 * so RSI can attach the provider annotation when appropriate.
 */

import type { GLP1Status, GLP1Compound } from '@bariaccess-lite/shared';
import {
  GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM,
  GLP1_EARLY_PHASE_DAYS,
} from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// PROFILE READ INTERFACE
// Memory says BariAccess uses Practices/Clients containers; the patient
// profile shape lives outside this dev pack. This adapter accepts a
// minimal shape and lets Zakiy wire to the actual profile reader.
// ────────────────────────────────────────────────────────────

export interface PatientProfileMin {
  user_id: string;
  glp1?: {
    active: boolean;
    compound?: GLP1Compound;
    start_date?: string;            // ISO date
    dose_current?: string;
    dose_stable_since?: string;     // ISO — date last titration completed
  };
}

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface GetGLP1StatusInput {
  profile: PatientProfileMin;
  /** Date for which we're computing status (YYYY-MM-DD). */
  on_date: string;
}

export function getGLP1Status(input: GetGLP1StatusInput): GLP1Status {
  const { profile, on_date } = input;
  const g = profile.glp1;

  if (!g || !g.active) {
    return {
      active: false,
      compound: null,
      start_date: null,
      dose_current: null,
      days_on: null,
      baseline_reset_active: false,
      dose_stable_since: null,
    };
  }

  const start_date = g.start_date ?? null;
  const dose_stable_since = g.dose_stable_since ?? g.start_date ?? null;
  const days_on = start_date ? daysBetween(start_date, on_date) : null;

  // Baseline reset window per §4.5: reset on init or dose change.
  // We're in the reset window if dose_stable_since is within last 28 days.
  const baseline_reset_active =
    dose_stable_since !== null &&
    daysBetween(dose_stable_since, on_date) < 28;

  return {
    active: true,
    compound: g.compound ?? 'other',
    start_date,
    dose_current: g.dose_current ?? null,
    days_on,
    baseline_reset_active,
    dose_stable_since,
  };
}

/**
 * Returns true if RSI should attach the early-phase RHR annotation,
 * given current GLP-1 status and observed RHR drift.
 *
 * Per DECISIONS.md §7 (LOCKED 2026-05-09 by founder):
 *   active && days_on < 120 && |rhr_drift_bpm| >= 2
 *
 * Bidirectional: published literature shows GLP-1 raises RHR ~2-4 bpm,
 * but post-bariatric weight loss can produce opposite drop. Either
 * direction in early phase signals medication-confounded baseline.
 */
export function shouldAttachRHRAnnotation(
  glp1: GLP1Status,
  rhr_drift_bpm: number
): boolean {
  if (!glp1.active || glp1.days_on === null) return false;
  if (glp1.days_on >= GLP1_EARLY_PHASE_DAYS) return false;
  return Math.abs(rhr_drift_bpm) >= GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM;
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────

function daysBetween(startISO: string, endISO: string): number {
  const s = new Date(startISO).getTime();
  const e = new Date(endISO).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;
  const diffMs = e - s;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
