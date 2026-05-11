/**
 * BariAccess — Behavioral Bridge (Pass 0 Spec 5)
 *
 * Source: RR-Calculation-Canon-Pass0_v1_1_LOCKED.md Spec 5
 *         + DECISIONS.md §11
 *
 * When V1 expires (Pass 0 Spec 4 → Day 4+), V2 (FAB) data activates as
 * Behavioral Bridge. Maximum 7 days. After 7 days without V1 return,
 * the score drops to INSUFFICIENT regardless of V2.
 *
 * Bridge formula:
 *   BRIDGE_SCORE = Last_Known_V1 + (V2_Direction × Adjustment × Days_Since)
 *
 *     V2_Direction:  +1 (improving), 0 (stable), -1 (declining)
 *                    derived from FAB completion trend
 *     Adjustment:    3 points/day default — refined per user via reconciliation
 *                    (CLAUDE-FLAG-5)
 *     Days_Since:    days since last V1 reading (capped at 7)
 *
 * Reconciliation (when V1 returns): adjust per-user `Adjustment` factor based
 * on bridge accuracy. Lite v1 ships the math; reconciliation calibration UI
 * deferred per DECISIONS.md §15.
 */

import {
  BRIDGE_DEFAULT_ADJUSTMENT_PER_DAY,
  BRIDGE_MAX_DAYS,
} from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface BridgeInput {
  /** Last known V1-derived score (0–100). NULL if no historical V1 exists. */
  last_known_v1_score: number | null;
  /** Days since last V1 reading. */
  days_since: number;
  /** FAB completion trend over the bridge window: +1 / 0 / -1. */
  v2_direction: -1 | 0 | 1;
  /** Per-user adjustment in points/day (default 3.0). */
  adjustment_per_day?: number;
  /** FAB family IDs that drove the v2_direction calculation, for audit. */
  fab_sources: string[];
}

export interface BridgeResult {
  /** Bridged score 0–100, or NULL if INSUFFICIENT. */
  score: number | null;
  /** True if the bridge expired (days_since ≥ 7). */
  expired: boolean;
  /** True if bridge is active (V1 expired but within 7-day cap). */
  active: boolean;
  /** Days into the bridge (1..7). */
  days_in_bridge: number;
  /** FAB sources used. */
  bridge_source_fabs: string[];
}

/**
 * Compute the bridged score per Pass 0 Spec 5.
 */
export function computeBridge(input: BridgeInput): BridgeResult {
  const {
    last_known_v1_score,
    days_since,
    v2_direction,
    adjustment_per_day = BRIDGE_DEFAULT_ADJUSTMENT_PER_DAY,
    fab_sources,
  } = input;

  // V1 still fresh (days_since 0..3) — bridge not active.
  if (days_since <= 3) {
    return {
      score: null,
      expired: false,
      active: false,
      days_in_bridge: 0,
      bridge_source_fabs: [],
    };
  }

  // No prior V1 anchor — bridge cannot start.
  if (last_known_v1_score === null) {
    return {
      score: null,
      expired: false,
      active: false,
      days_in_bridge: 0,
      bridge_source_fabs: [],
    };
  }

  // Beyond 7-day bridge window — INSUFFICIENT.
  if (days_since > 3 + BRIDGE_MAX_DAYS) {
    return {
      score: null,
      expired: true,
      active: false,
      days_in_bridge: BRIDGE_MAX_DAYS,
      bridge_source_fabs: fab_sources,
    };
  }

  // Within the bridge window. days_in_bridge starts at 1 when days_since = 4.
  const days_in_bridge = days_since - 3;

  const drift = v2_direction * adjustment_per_day * days_in_bridge;
  const score = Math.max(0, Math.min(100, last_known_v1_score + drift));

  return {
    score,
    expired: false,
    active: true,
    days_in_bridge,
    bridge_source_fabs: fab_sources,
  };
}

// ────────────────────────────────────────────────────────────
// V2 DIRECTION HELPER
// Convert FAB completion trend to direction signal.
// Compares last 3 days vs prior 3 days completion rate per family.
// ────────────────────────────────────────────────────────────

export function fabTrendToDirection(
  recent_completion_rate: number,
  prior_completion_rate: number,
  threshold: number = 0.10
): -1 | 0 | 1 {
  const delta = recent_completion_rate - prior_completion_rate;
  if (delta > threshold) return 1;
  if (delta < -threshold) return -1;
  return 0;
}

// ────────────────────────────────────────────────────────────
// RECONCILIATION (Pass 0 Spec 5) — DEFERRED IN LITE v1
// LOCKED 2026-05-09 by founder (Val):
//   Lite v1 always uses BRIDGE_DEFAULT_ADJUSTMENT_PER_DAY = 3.0.
//   Per-user refinement deferred until ≥30 days of bridge-then-V1-return
//   cycles are observed and Exec-Biostat specifies the refinement formula.
//
// The function signature is preserved so callers can keep the integration
// point. It now records prediction_error (for audit/learning data capture)
// but ALWAYS returns the input adjustment unchanged.
// ────────────────────────────────────────────────────────────

export interface ReconcileInput {
  predicted_score: number;
  actual_v1_score: number;
  current_adjustment_per_day: number;
}

export interface ReconcileResult {
  prediction_error: number;
  /** Always returns input unchanged in Lite v1 (reconciliation deferred). */
  new_adjustment_per_day: number;
  /** True in Lite v1; flips to false when reconciliation is enabled. */
  deferred: boolean;
}

export function reconcileBridge(input: ReconcileInput): ReconcileResult {
  const { predicted_score, actual_v1_score, current_adjustment_per_day } = input;
  const prediction_error = predicted_score - actual_v1_score;

  // Lite v1: reconciliation deferred per founder lock (DECISIONS.md §11).
  // We capture prediction_error so the audit trail builds up per-user data
  // for future Exec-Biostat specification of the refinement formula, but the
  // adjustment factor itself is NEVER updated.
  return {
    prediction_error,
    new_adjustment_per_day: current_adjustment_per_day,
    deferred: true,
  };
}
