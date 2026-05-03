/**
 * PRIORITY CHAIN — Resolver State Selection Logic (CANON-LITERAL)
 * 
 * Source canon (LITERAL TRANSLATION):
 *   - PAC-ISE-002 v2.0 §5 (Priority Order — 7 steps)
 *   - PAC-ISE-002 v2.0 §7 (Resolver Input Contract — raw fields)
 *   - PAC-ISE-002 v2.0 §8 (Trigger Table — Rule Groups G/Q/C/P/A/M/F)
 *   - PAC-ISE-002 v2.0 §9 (Conflict Detection — feeds ISE-6)
 *   - PAC-ISE-002 v2.0 §10 (Pseudocode — the source-of-truth implementation)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) — Mental Wellbeing safety override (handled in resolver.ts BEFORE this chain)
 * 
 * ⚠️ AUDIT 2026-05-03 — REWRITE NOTICE
 * 
 * This file was rewritten 2026-05-03 to match canon §10 pseudocode literally.
 * The pre-audit version had 6 deviations from canon:
 *   (1) 10 priority steps instead of canon's 7
 *   (2) "Health status critical → ISE-5" step that does not exist in canon
 *   (3) "Building/momentum" before "Aligned" (canon: Aligned before Momentum)
 *   (4) Onboarding routed to ISE-0 (canon: ISE-6, CHECK 2 immediately after governance)
 *   (5) Used derived helper booleans (favors_recovery_or_explore, favors_build, etc.)
 *       that hid actual canonical thresholds — replaced with direct field reads
 *   (6) Missing CHECK 4A (Health in trouble → ISE-2) and CHECK 4B (Engagement collapsing → ISE-2)
 *       canon explicitly routes red composites + declining trend to ISE-2 (Protective), not ISE-5
 * 
 * Pre-audit version retained as `_deprecated_priorityChain_v1` at end of file
 * for migration reference. DO NOT CALL.
 * 
 * Canonical order (PAC-ISE-002 v2.0 §5):
 *   1. Governance gating         → ISE-5
 *   2. Low-signal / onboarding   → ISE-6
 *   3. Containment / overload    → ISE-3
 *   4. Protective / recovery     → ISE-2  (4A health-in-trouble OR 4B engagement-collapse)
 *   5. Aligned / available       → ISE-1
 *   6. Building / momentum       → ISE-4
 *   7. Fallback                  → ISE-0
 */

import { ISEState } from '../types/ise.js';
import {
  THRESHOLD_STALE_HOURS,
  THRESHOLD_PLI_OVERLOAD,
  THRESHOLD_ORI_LOW,
  THRESHOLD_TRAJECTORY_NEG_SLOPE,
  THRESHOLD_TRAJECTORY_POS_SLOPE,
  THRESHOLD_ONBOARDING_DAYS
} from './thresholds.js';

// ─────────────────────────────────────────────────────────────────────────────
// SPACE-STATE — canonical taxonomy from F.A.C.T.S. workshops (canon §6 Signal 3)
// ─────────────────────────────────────────────────────────────────────────────

export type SpaceState = 'protected' | 'challenging' | 'vulnerable';

// ─────────────────────────────────────────────────────────────────────────────
// FSI TREND — canonical (canon §6 Signal 5)
// ─────────────────────────────────────────────────────────────────────────────

export type FSITrend = 'rising' | 'stable' | 'declining';

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY CHAIN INPUTS — matches PAC-ISE-002 v2.0 §7 Resolver Input Contract
// 
// ⚠️ AUDIT 2026-05-03 — RAW FIELDS, NOT DERIVED HELPERS
// 
// Pre-audit version consumed `signal_1`, `signal_2`, etc. wrapper objects with
// derived `favors_*` booleans. Canon §7 specifies the input contract as raw
// fields. This version matches canon literally.
// 
// Caller (resolver.ts) builds this object from signal evaluator outputs.
// ─────────────────────────────────────────────────────────────────────────────

export interface PriorityChainInputs {
  /** Canon §6 Signal 1 — provider has set governance flag */
  governance_flag: boolean;
  /** Canon §6 Signal 2 — hours since most recent V1/V2 data point */
  data_freshness_hours: number;
  /** Canon §6 Signal 2 — days since user's D0 / membership start */
  onboarding_days: number;
  /** Canon §6 Signal 3 — Parking Lot Index count */
  pli_count: number;
  /** Canon §6 Signal 3 — patient-reported Space-State (V3); null if not yet captured */
  space_state: SpaceState | null;
  /** Canon §6 Signal 4 — count of LIVE composites in Bands 4-6 (orange spectrum) */
  composites_in_orange: number;
  /** Canon §6 Signal 4 — count of LIVE composites in Band 7 (Red) */
  composites_in_red: number;
  /** Canon §6 Signal 4 — pre-signal detection per Beacon §10.2 (position OR velocity) */
  any_presignal_active: boolean;
  /** Canon §6 Signal 5 — 7-day FSI direction */
  fsi_trend: FSITrend;
  /** Canon §6 Signal 5 — 7-day decay-weighted ORI in [0.0, 1.0] */
  ori_7d: number;
  /** Canon §6 Signal 6 — 7-day Mood pin slope */
  mood_slope: number;
  /** Canon §6 Signal 6 — 7-day Effort score slope (per G1 formula E = 0.40·F + 0.30·C + 0.30·LC) */
  effort_slope: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY CHAIN OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface PriorityChainOutput {
  resolved_state: ISEState;
  selected_by_step: PriorityChainStep;
  reason_codes: string[];
}

/** Canon §5 + §8 step labels */
export type PriorityChainStep =
  | 'governance'              // §5 step 1 — Rule Group G
  | 'low_signal_onboarding'   // §5 step 2 — Rule Group Q
  | 'cognitive_overload'      // §5 step 3 — Rule Group C
  | 'protective_health'       // §5 step 4 — Rule Group P, Path A (canon §10 CHECK 4A)
  | 'protective_engagement'   // §5 step 4 — Rule Group P, Path B (canon §10 CHECK 4B)
  | 'aligned'                 // §5 step 5 — Rule Group A
  | 'building_momentum'       // §5 step 6 — Rule Group M
  | 'fallback';               // §5 step 7 — Rule Group F

// ─────────────────────────────────────────────────────────────────────────────
// CONFLICT DETECTION (PAC-ISE-002 v2.0 §9)
// 
// ⚠️ AUDIT 2026-05-03 — NEW FUNCTION (was missing pre-audit)
// 
// Canon §9 defines three conflict patterns that route to ISE-6 with reason
// CONFLICTING_SIGNALS. The pre-audit code did not implement this — onboarding/
// staleness fired but conflict detection was absent.
// ─────────────────────────────────────────────────────────────────────────────

export function detectConflictingSignals(input: PriorityChainInputs): boolean {
  // Pattern 1: body failing but engagement strong → possible device error
  // canon §9 line 1
  if (
    input.composites_in_red >= 1 &&
    input.fsi_trend === 'rising' &&
    input.ori_7d >= 0.8
  ) {
    return true;
  }

  // Pattern 2: high cognitive load but everything else fine → possible PLI stacking
  // canon §9 line 2
  if (
    input.pli_count >= THRESHOLD_PLI_OVERLOAD &&
    input.composites_in_orange === 0 &&
    input.fsi_trend === 'stable'
  ) {
    return true;
  }

  // Pattern 3: implausible day-to-day deltas — flagged at signal evaluator level,
  // not detectable from a single resolver tick. Caller may set sentinel value
  // or extend this fn when delta tracking is wired (Phase 1.5).
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE PRIORITY CHAIN — CANON §10 LITERAL TRANSLATION
// 
// Pure function. No I/O. Pseudocode-equivalent line-by-line.
// 
// ⚠️ AUDIT 2026-05-03 — CANONICAL PSEUDOCODE TRANSLATION
// Each CHECK below is a direct mapping of canon §10 lines 317-365.
// ─────────────────────────────────────────────────────────────────────────────

export function evaluatePriorityChain(
  input: PriorityChainInputs
): PriorityChainOutput {
  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 1: Governance (canon §10 line 318-320)
  //   if input.governance_flag == true: return ISE_5
  // ───────────────────────────────────────────────────────────────────────────
  if (input.governance_flag) {
    return {
      resolved_state: ISEState.ISE_5_RESTRICTED_GUARDED,
      selected_by_step: 'governance',
      reason_codes: ['GOV_RESTRICTED_MODE']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 2: Low signal / onboarding (canon §10 line 322-326)
  //   if input.onboarding_days < 7
  //      OR input.data_freshness_hours > THRESHOLD_STALE
  //      OR conflictingSignals(input):
  //     return ISE_6
  // 
  // ⚠️ AUDIT 2026-05-03 — was: pre-audit routed onboarding to ISE-0 at step 8.
  // Canon explicitly routes onboarding to ISE-6 at CHECK 2 (immediately after
  // governance). Per canon §6 Signal 2: "Onboarding check: if onboarding_days < 7
  // → ISE-6 regardless of freshness."
  // ───────────────────────────────────────────────────────────────────────────
  if (input.onboarding_days < THRESHOLD_ONBOARDING_DAYS) {
    return {
      resolved_state: ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL,
      selected_by_step: 'low_signal_onboarding',
      reason_codes: ['LOW_SIGNAL_ONBOARDING']
    };
  }
  if (input.data_freshness_hours > THRESHOLD_STALE_HOURS) {
    return {
      resolved_state: ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL,
      selected_by_step: 'low_signal_onboarding',
      reason_codes: ['DATA_INSUFFICIENT']
    };
  }
  if (detectConflictingSignals(input)) {
    return {
      resolved_state: ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL,
      selected_by_step: 'low_signal_onboarding',
      reason_codes: ['CONFLICTING_SIGNALS']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 3: Cognitive overload (canon §10 line 328-332)
  //   if input.pli_count >= THRESHOLD_PLI
  //      AND (input.space_state == "vulnerable" OR input.composites_in_orange >= 3):
  //     return ISE_3
  // ───────────────────────────────────────────────────────────────────────────
  if (
    input.pli_count >= THRESHOLD_PLI_OVERLOAD &&
    (input.space_state === 'vulnerable' || input.composites_in_orange >= 3)
  ) {
    return {
      resolved_state: ISEState.ISE_3_CONTAINED_LOAD_LIMITED,
      selected_by_step: 'cognitive_overload',
      reason_codes: ['COGNITIVE_LOAD_HIGH', 'CHOICE_COMPRESSION_REQUIRED']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 4A: Health in trouble (canon §10 line 334-337)
  //   if input.composites_in_red >= 1
  //      AND (input.fsi_trend == "declining" OR input.mood_slope < THRESHOLD_NEG):
  //     return ISE_2
  // 
  // ⚠️ AUDIT 2026-05-03 — was: pre-audit routed `composites_in_red >= 1` to
  // ISE-5 (Restricted/Guarded). Canon routes red composites + declining trend
  // to ISE-2 (Protective/Recovery-Forward). ISE-5 is reserved for governance
  // flag (canon §8 Rule Group G) — only the provider sets it.
  // ───────────────────────────────────────────────────────────────────────────
  if (
    input.composites_in_red >= 1 &&
    (input.fsi_trend === 'declining' ||
      input.mood_slope < THRESHOLD_TRAJECTORY_NEG_SLOPE)
  ) {
    return {
      resolved_state: ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD,
      selected_by_step: 'protective_health',
      reason_codes: ['RECOVERY_LOW', 'HEALTH_STATUS_CONCERN']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 4B: Engagement collapsing (canon §10 line 339-341)
  //   if input.fsi_trend == "declining" AND input.ori_7d < THRESHOLD_ORI:
  //     return ISE_2
  // ───────────────────────────────────────────────────────────────────────────
  if (input.fsi_trend === 'declining' && input.ori_7d < THRESHOLD_ORI_LOW) {
    return {
      resolved_state: ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD,
      selected_by_step: 'protective_engagement',
      reason_codes: ['ADHERENCE_EROSION', 'MOMENTUM_NEGATIVE']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 5: Everything aligned (canon §10 line 346-353)
  //   if input.composites_in_orange == 0
  //      AND input.composites_in_red == 0
  //      AND input.fsi_trend in ["stable", "rising"]
  //      AND input.ori_7d >= THRESHOLD_ORI
  //      AND input.space_state != "vulnerable":
  //     return ISE_1
  // 
  // ⚠️ AUDIT 2026-05-03 — was: pre-audit step 7 fired on a loose OR-of-3
  // expression including `status_level === 'normal'`. Canon §10 specifies a
  // strict AND-conjunction of 5 conditions. This version is the canon literal.
  // ───────────────────────────────────────────────────────────────────────────
  if (
    input.composites_in_orange === 0 &&
    input.composites_in_red === 0 &&
    (input.fsi_trend === 'stable' || input.fsi_trend === 'rising') &&
    input.ori_7d >= THRESHOLD_ORI_LOW &&
    input.space_state !== 'vulnerable'
  ) {
    return {
      resolved_state: ISEState.ISE_1_ALIGNED_AVAILABLE,
      selected_by_step: 'aligned',
      reason_codes: ['READINESS_HIGH', 'RHYTHM_ALIGNED']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CHECK 6: Positive momentum (canon §10 line 355-360)
  //   if input.mood_slope > THRESHOLD_POS
  //      AND input.effort_slope > THRESHOLD_POS
  //      AND input.fsi_trend == "rising"
  //      AND input.composites_in_red == 0
  //      AND input.any_presignal_active == false:
  //     return ISE_4
  // 
  // ⚠️ AUDIT 2026-05-03 — was: pre-audit step 6 used three derived helper
  // booleans (favors_build, favors_momentum_build, favors_momentum). Canon §10
  // specifies a strict AND-conjunction of 5 raw thresholds. Using derived
  // booleans hid the actual canonical thresholds and decoupled the logic from
  // canon. This version is the canon literal.
  // 
  // Per canon §5 commentary: "Momentum is intentionally after Aligned to prevent
  // it from overriding a depleted or misaligned day."
  // ───────────────────────────────────────────────────────────────────────────
  if (
    input.mood_slope > THRESHOLD_TRAJECTORY_POS_SLOPE &&
    input.effort_slope > THRESHOLD_TRAJECTORY_POS_SLOPE &&
    input.fsi_trend === 'rising' &&
    input.composites_in_red === 0 &&
    input.any_presignal_active === false
  ) {
    return {
      resolved_state: ISEState.ISE_4_BUILDING_MOMENTUM,
      selected_by_step: 'building_momentum',
      reason_codes: ['MOMENTUM_POSITIVE', 'CONSISTENCY_STRONG']
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DEFAULT (canon §10 line 363-365)
  //   return ISE_0
  // ───────────────────────────────────────────────────────────────────────────
  return {
    resolved_state: ISEState.ISE_0_NEUTRAL_BASELINE,
    selected_by_step: 'fallback',
    reason_codes: ['BASELINE_DEFAULT']
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// DEPRECATED PRE-AUDIT IMPLEMENTATION
// 
// ⚠️ DO NOT CALL. Retained for migration reference only.
// Will be removed in Phase 1.5.
// 
// See CHANGELOG-AUDIT-2026-05-03.md for full migration notes.
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @deprecated 2026-05-03 — non-canonical. Replaced by evaluatePriorityChain above.
 * 
 * The pre-audit version had 10 steps with 6 deviations from PAC-ISE-002 v2.0 §10.
 * It is kept here as a stub function reference so any imports of the old shape
 * fail loudly with a migration message rather than silently misroute states.
 */
export function _deprecated_priorityChain_v1(): never {
  throw new Error(
    '_deprecated_priorityChain_v1 was removed by 2026-05-03 audit. ' +
      'Use evaluatePriorityChain() instead. See CHANGELOG-AUDIT-2026-05-03.md.'
  );
}
