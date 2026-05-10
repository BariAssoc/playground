/**
 * BariAccess Lite — V4 Light Therapy Protocol Resolver
 *
 * Source: DECISIONS.md §6 (advance protocol, +90min CBTmin offset)
 *         CCO-V1V4-REFFRAME-001 §3.2 (V4 = treatment data)
 *         Pass 3 §CIR LightExposurePattern (consumer of this resolver's output)
 *
 * Resolves daily light therapy target time for a patient given:
 *   - V4 prescription (timing_strategy, fixed_time, cbtmin_offset_minutes)
 *   - V3 chronotype profile (estimated_cbtmin)
 *   - days_active (drives uniform fallback during chronotype warmup days 1-14)
 *
 * Returns `{ target_time, lux, duration_min }` for each calendar day.
 *
 * 51/49 governance: this resolver SUGGESTS. The provider LOCKS via the
 * prescription. Mid-program changes require provider sign-off.
 */

import type {
  LightTherapyProtocol,
  ChronotypeProfile,
} from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────────────────────

/** Days of program activity before chronotype-indexed protocol activates. */
const CHRONOTYPE_WARMUP_DAYS = 14;

/** Default prescription parameters when no protocol is active. */
const DEFAULT_LUX = 10000;
const DEFAULT_DURATION_MIN = 15;
const DEFAULT_FIXED_TIME = '07:00';

/** CLAUDE-FLAG-4: Eastman/Terman default for advance protocol. */
const DEFAULT_ADVANCE_OFFSET_MIN = 90;

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface DailyLightTargetInput {
  protocol: LightTherapyProtocol | null;
  chronotype: ChronotypeProfile | null;
  /** Local date for which target is being computed (YYYY-MM-DD). */
  on_date: string;
  /** 1-indexed day of program. Drives warmup. */
  days_active: number;
}

export interface DailyLightTarget {
  /** ISO timestamp (local TZ assumed; downstream timezone-aware). */
  target_time: string;
  lux: number;
  duration_minutes: number;
  /** Strategy used to derive target_time. Logged for audit. */
  strategy_used: 'prescribed_fixed' | 'chronotype_indexed' | 'cbtmin_offset' | 'uniform_fallback';
  /** Notes for audit / provider review. */
  derivation_notes: string;
}

/**
 * Resolve today's light therapy target for a patient.
 */
export function getDailyLightTarget(
  input: DailyLightTargetInput
): DailyLightTarget {
  const { protocol, chronotype, on_date, days_active } = input;

  // No active protocol → uniform fallback default.
  if (!protocol || !protocol.active) {
    return uniformFallback(on_date, 'no active prescription');
  }

  const { prescription } = protocol;
  const lux = prescription.lux;
  const duration_minutes = prescription.duration_minutes;

  // Strategy 1: fixed time prescribed (provider override or pre-chronotype-lock patient).
  if (prescription.timing_strategy === 'fixed') {
    const time = prescription.fixed_time ?? DEFAULT_FIXED_TIME;
    return {
      target_time: combineDateTime(on_date, time),
      lux,
      duration_minutes,
      strategy_used: 'prescribed_fixed',
      derivation_notes: `Provider-fixed time: ${time}`,
    };
  }

  // Strategies 2 and 3 require chronotype.
  // If chronotype not yet established (warmup days 1-14 OR MEQ skipped),
  // fall back to uniform 7am.
  if (!chronotype || days_active < CHRONOTYPE_WARMUP_DAYS) {
    const reason = !chronotype
      ? 'no chronotype profile'
      : `chronotype warmup day ${days_active}/${CHRONOTYPE_WARMUP_DAYS}`;
    return uniformFallback(on_date, reason);
  }

  // Strategy 2: chronotype_indexed — advance protocol indexed to category.
  if (prescription.timing_strategy === 'chronotype_indexed') {
    const offset = prescription.cbtmin_offset_minutes ?? DEFAULT_ADVANCE_OFFSET_MIN;
    const cbtmin = parseHHMM(chronotype.estimated_cbtmin);
    if (!cbtmin) return uniformFallback(on_date, 'chronotype CBTmin parse failed');
    const target = addMinutes(cbtmin, offset);
    return {
      target_time: combineDateTime(on_date, formatHHMM(target)),
      lux,
      duration_minutes,
      strategy_used: 'chronotype_indexed',
      derivation_notes:
        `Advance protocol: CBTmin ${chronotype.estimated_cbtmin} + ${offset}min ` +
        `(category: ${chronotype.category}, MEQ: ${chronotype.meq_score})`,
    };
  }

  // Strategy 3: cbtmin_offset — explicit CBTmin offset (advance or delay).
  if (prescription.timing_strategy === 'cbtmin_offset') {
    const offset = prescription.cbtmin_offset_minutes ?? DEFAULT_ADVANCE_OFFSET_MIN;
    const cbtmin = parseHHMM(chronotype.estimated_cbtmin);
    if (!cbtmin) return uniformFallback(on_date, 'chronotype CBTmin parse failed');
    const target = addMinutes(cbtmin, offset);
    return {
      target_time: combineDateTime(on_date, formatHHMM(target)),
      lux,
      duration_minutes,
      strategy_used: 'cbtmin_offset',
      derivation_notes: `CBTmin ${chronotype.estimated_cbtmin} + ${offset}min (${offset >= 0 ? 'advance' : 'delay'})`,
    };
  }

  return uniformFallback(on_date, 'unknown timing_strategy');
}

/**
 * Compute adherence for a single day given target and observed sessions.
 * Returns a 0-1 score for use as one input to CIR LightExposurePattern.
 *
 * Adherence definition for Lite v1:
 *   - 1.0 if a session of >= prescribed duration started within ±30min of target
 *   - 0.7 if a session matched but at half-prescribed duration
 *   - 0.0 if no session that day OR all sessions outside ±60min window
 *
 * Refinement (richer scoring) deferred to vault.
 */
export function adherenceScoreForDay(
  target: DailyLightTarget,
  observed_sessions: Array<{ start: string; duration_min: number; lux: number }>
): number {
  if (observed_sessions.length === 0) return 0;

  const targetT = new Date(target.target_time).getTime();
  const requiredMinDuration = target.duration_minutes;

  let bestScore = 0;
  for (const s of observed_sessions) {
    const sT = new Date(s.start).getTime();
    if (Number.isNaN(sT)) continue;
    const offsetMin = Math.abs(sT - targetT) / 60_000;

    if (offsetMin > 60) continue; // outside ±60min window — no credit

    const durationRatio = Math.min(1, s.duration_min / requiredMinDuration);
    let score: number;
    if (offsetMin <= 30) {
      score = durationRatio;                    // full credit at duration ratio
    } else {
      score = 0.5 * durationRatio;              // half credit at 30-60min offset
    }

    if (score > bestScore) bestScore = score;
  }
  return Math.max(0, Math.min(1, bestScore));
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────

function uniformFallback(on_date: string, reason: string): DailyLightTarget {
  return {
    target_time: combineDateTime(on_date, DEFAULT_FIXED_TIME),
    lux: DEFAULT_LUX,
    duration_minutes: DEFAULT_DURATION_MIN,
    strategy_used: 'uniform_fallback',
    derivation_notes: `Uniform 07:00 fallback — ${reason}`,
  };
}

function parseHHMM(s: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
}

function formatHHMM(t: { h: number; m: number }): string {
  const h = ((t.h % 24) + 24) % 24;
  const m = ((t.m % 60) + 60) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutes(t: { h: number; m: number }, deltaMin: number): { h: number; m: number } {
  const total = t.h * 60 + t.m + deltaMin;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return { h: Math.floor(wrapped / 60), m: wrapped % 60 };
}

function combineDateTime(date: string, hhmm: string): string {
  // Combine YYYY-MM-DD with HH:MM in local-time semantics (no TZ suffix).
  // Caller is responsible for timezone awareness when comparing to actual sessions.
  return `${date}T${hhmm}:00`;
}
