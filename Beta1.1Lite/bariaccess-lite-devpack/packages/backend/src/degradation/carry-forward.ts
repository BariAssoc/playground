/**
 * BariAccess — V1 Carry-Forward Logic
 *
 * Source: RR-Calculation-Canon-Pass0_v1_1_LOCKED.md Spec 4
 *
 * When V1 wearable data is missing for the current day, the engine carries
 * forward the most recent reading with declining weight. After Day 4, the
 * metric expires and Behavioral Bridge (Pass 0 Spec 5) takes over.
 *
 *   Day 0 (today):       weight 1.00  (fresh)
 *   Day 1 (yesterday):   weight 0.85
 *   Day 2:               weight 0.65
 *   Day 3:               weight 0.40
 *   Day 4+:              EXPIRED → trigger Behavioral Bridge
 */

import { CARRY_FORWARD_WEIGHTS } from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface CarryForwardInput {
  /** Most recent V1 reading (raw value, pre-Z, pre-bound). */
  value: number | null;
  /** Days since the value was recorded (0 = today, 1 = yesterday, ...). */
  days_since: number;
}

export interface CarryForwardResult {
  /** Weighted value, or null if EXPIRED or no source. */
  value: number | null;
  /** Carry-forward weight applied (1.00 / 0.85 / 0.65 / 0.40 / null). */
  weight_applied: number | null;
  /** True if metric expired — caller should activate Behavioral Bridge. */
  expired: boolean;
  /** True if value was fresh (days_since === 0). */
  fresh: boolean;
}

export function applyCarryForward(input: CarryForwardInput): CarryForwardResult {
  const { value, days_since } = input;

  if (value === null || !Number.isFinite(value)) {
    return {
      value: null,
      weight_applied: null,
      expired: false,
      fresh: false,
    };
  }

  if (days_since < 0) {
    throw new Error(`applyCarryForward: days_since must be ≥ 0; got ${days_since}`);
  }

  const w = CARRY_FORWARD_WEIGHTS[days_since] ?? 'EXPIRED';

  if (w === 'EXPIRED') {
    return {
      value: null,
      weight_applied: null,
      expired: true,
      fresh: false,
    };
  }

  // Pass 0 Spec 4 says weight is APPLIED to the value (not "fades the value out
  // toward zero" — that would be wrong for physiological metrics where 0 is
  // meaningful). The canonical interpretation: the carry-forward weight reduces
  // the metric's contribution to the composite, NOT the value itself.
  // Therefore we return the value AS-IS and surface weight_applied for the
  // composite to multiply into the metric's component weight.
  return {
    value,
    weight_applied: w,
    expired: false,
    fresh: days_since === 0,
  };
}

/**
 * Determine staleness of a normalized day's metrics by comparing dates.
 *
 * Given today's target date and the most recent date that has a value,
 * returns days_since.
 */
export function daysSinceLastReading(
  target_date: string,
  last_reading_date: string | null
): number {
  if (last_reading_date === null) return Infinity;
  const t = new Date(`${target_date}T00:00:00Z`).getTime();
  const r = new Date(`${last_reading_date}T00:00:00Z`).getTime();
  if (Number.isNaN(t) || Number.isNaN(r)) return Infinity;
  return Math.max(0, Math.floor((t - r) / (1000 * 60 * 60 * 24)));
}
