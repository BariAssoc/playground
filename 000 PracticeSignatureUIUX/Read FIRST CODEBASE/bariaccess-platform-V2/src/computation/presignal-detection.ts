/**
 * PRE-SIGNAL DETECTION — Beacon Canon v1.1 §10.2 Implementation
 * 
 * Source canon (LITERAL):
 *   - Beacon Canon v1.1 §10.1 (Definition)
 *   - Beacon Canon v1.1 §10.2 (Detection Rule — position OR velocity)
 *   - Beacon Canon v1.1 §10.6 (Pre-Signal Expiration)
 *   - Beacon Canon v1.1 §4 (Band 3 = Faint Green, 80-84)
 * 
 * ⚠️ AUDIT 2026-05-03 — NEW IMPLEMENTATION
 * 
 * Pre-audit: type definition existed (`PreSignalDetection` in beacon.ts), but no
 * function computed `any_presignal_active`. The Resolver consumed the boolean
 * from upstream, but no upstream code produced it.
 * 
 * Post-audit: this module implements the canon §10.2 detection rule literally.
 * 
 * CANON §10.2 RULE:
 *   PRE-SIGNAL = TRUE when EITHER:
 *     (a) POSITION: Score is currently in Band 3 (Faint Green, 80-84)
 *     (b) VELOCITY: Score has dropped > 10 points in 14 days,
 *         regardless of current band
 * 
 * Pure function. Same input → same output.
 */

import type { BeaconBand } from '../types/ise.js';
import type { CompositeStateRecord } from '../types/composite.js';

// ─────────────────────────────────────────────────────────────────────────────
// VELOCITY THRESHOLD (Beacon §10.2 — LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

/** Drop magnitude that triggers velocity pre-signal (canon §10.2 line b) */
export const PRESIGNAL_VELOCITY_DROP_THRESHOLD = 10;

/** Window in days over which velocity drop is measured (canon §10.2 line b) */
export const PRESIGNAL_VELOCITY_WINDOW_DAYS = 14;

/** Band that triggers position pre-signal (canon §10.2 line a — Faint Green) */
export const PRESIGNAL_POSITION_BAND: BeaconBand = 3;

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SIGNAL EXPIRATION (canon §10.6)
// ─────────────────────────────────────────────────────────────────────────────

/** Hours of stable-or-improving score required to expire a pre-signal (canon §10.6 line a — 72+ hours) */
export const PRESIGNAL_EXPIRATION_STABLE_HOURS = 72;

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE-COMPOSITE PRE-SIGNAL DETECTION (canon §10.2)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositePreSignalInput {
  /** Current score 0-100 */
  current_score_0_100: number;
  /** Current Beacon band (1-7) */
  current_band: BeaconBand;
  /** Score 14 days ago — used for velocity check */
  score_14_days_ago: number | null;
}

export interface CompositePreSignalResult {
  /** True if either trigger fires (canon §10.2 EITHER clause) */
  presignal_active: boolean;
  /** True if position trigger fires (band == 3) */
  position_trigger: boolean;
  /** True if velocity trigger fires (drop > 10 in 14 days) */
  velocity_trigger: boolean;
  /** Score delta over 14-day window — null if 14-day-ago score unavailable */
  velocity_drop: number | null;
}

export function detectCompositePreSignal(
  input: CompositePreSignalInput
): CompositePreSignalResult {
  // Position trigger (canon §10.2 line a)
  const position_trigger = input.current_band === PRESIGNAL_POSITION_BAND;

  // Velocity trigger (canon §10.2 line b)
  let velocity_trigger = false;
  let velocity_drop: number | null = null;
  if (input.score_14_days_ago !== null) {
    velocity_drop = input.score_14_days_ago - input.current_score_0_100;
    velocity_trigger = velocity_drop > PRESIGNAL_VELOCITY_DROP_THRESHOLD;
  }

  return {
    presignal_active: position_trigger || velocity_trigger,
    position_trigger,
    velocity_trigger,
    velocity_drop
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-COMPOSITE AGGREGATE — produces `any_presignal_active` for Resolver
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositePreSignalContext {
  composite: CompositeStateRecord;
  /** Score 14 days ago for this composite — null if not yet 14 days of history */
  score_14_days_ago: number | null;
}

/**
 * Compute `any_presignal_active` for the Resolver Signal 4 input.
 * 
 * Returns true if ANY of the user's LIVE composites has a pre-signal active.
 * Accruing composites are excluded (no reliable score yet).
 */
export function detectAnyPreSignalActive(
  contexts: ReadonlyArray<CompositePreSignalContext>
): boolean {
  for (const ctx of contexts) {
    if (ctx.composite.state !== 'live') continue;
    if (ctx.composite.score_0_100 === null || ctx.composite.beacon_band === null) {
      continue;
    }

    const result = detectCompositePreSignal({
      current_score_0_100: ctx.composite.score_0_100,
      current_band: ctx.composite.beacon_band,
      score_14_days_ago: ctx.score_14_days_ago
    });

    if (result.presignal_active) {
      return true;
    }
  }
  return false;
}

/**
 * Detailed view: which composites have pre-signals active and via which trigger.
 * Used for the audit log + Constellation Panel composite-state display.
 */
export interface AggregatePreSignalReport {
  any_presignal_active: boolean;
  per_composite: ReadonlyArray<{
    composite_name: string;
    state: string;
    presignal_active: boolean;
    position_trigger: boolean;
    velocity_trigger: boolean;
    velocity_drop: number | null;
  }>;
}

export function reportPreSignalsAcrossComposites(
  contexts: ReadonlyArray<CompositePreSignalContext>
): AggregatePreSignalReport {
  const per_composite = contexts.map((ctx) => {
    if (
      ctx.composite.state !== 'live' ||
      ctx.composite.score_0_100 === null ||
      ctx.composite.beacon_band === null
    ) {
      return {
        composite_name: ctx.composite.compositeName,
        state: ctx.composite.state,
        presignal_active: false,
        position_trigger: false,
        velocity_trigger: false,
        velocity_drop: null
      };
    }

    const result = detectCompositePreSignal({
      current_score_0_100: ctx.composite.score_0_100,
      current_band: ctx.composite.beacon_band,
      score_14_days_ago: ctx.score_14_days_ago
    });

    return {
      composite_name: ctx.composite.compositeName,
      state: ctx.composite.state,
      presignal_active: result.presignal_active,
      position_trigger: result.position_trigger,
      velocity_trigger: result.velocity_trigger,
      velocity_drop: result.velocity_drop
    };
  });

  return {
    any_presignal_active: per_composite.some((c) => c.presignal_active),
    per_composite
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SIGNAL EXPIRATION CHECK (canon §10.6)
// 
// PRE-SIGNAL EXPIRED when BOTH:
//   (a) Score has stabilized or improved for 72+ hours
//   (b) Score is NOT in Band 3 (returned to Band 2 or better, OR
//       stabilized in Band 4+ with no further decline)
// ─────────────────────────────────────────────────────────────────────────────

export interface PreSignalExpirationInput {
  current_score_0_100: number;
  current_band: BeaconBand;
  /** Hours since most recent score decrease */
  hours_since_last_decline: number;
  /** Score 72 hours ago — used to check stability */
  score_72_hours_ago: number;
}

export function isPreSignalExpired(input: PreSignalExpirationInput): boolean {
  // Clause (a): stabilized or improved for 72+ hours
  const clause_a =
    input.hours_since_last_decline >= PRESIGNAL_EXPIRATION_STABLE_HOURS &&
    input.current_score_0_100 >= input.score_72_hours_ago;

  // Clause (b): NOT in Band 3 (back to Band 2 or better OR Band 4+ stable)
  const clause_b = input.current_band !== PRESIGNAL_POSITION_BAND;

  return clause_a && clause_b;
}
