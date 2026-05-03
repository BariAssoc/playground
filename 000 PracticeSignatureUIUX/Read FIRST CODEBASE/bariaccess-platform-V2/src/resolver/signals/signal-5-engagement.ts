/**
 * RESOLVER SIGNAL 5 — Engagement
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §6 Signal 5
 *   - CCO-FAB-001 v2.0 Pass 1 §11 (FCS / FSI definitions)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §4 (slot completion → FCS + ORI)
 * 
 * Tracks two patient-engagement metrics:
 *   FSI (FAB Stability Index) — cross-FAB stability over 7 days
 *   ORI (Ollie Response Index) — patient responsiveness to Ollie prompts (decay-weighted)
 * 
 * Both are 7-day rolling. Inputs come from daily-engagement-rollup container.
 * Resolver READS these values; computation lives in src/computation/.
 */

import {
  THRESHOLD_ORI_LOW,
  THRESHOLD_ORI_HIGH,
  THRESHOLD_FSI_FRAGILE,
  THRESHOLD_FSI_ROBUST
} from '../thresholds.js';

// ─────────────────────────────────────────────────────────────────────────────
// FSI TREND TYPE — re-exported for downstream use
// ─────────────────────────────────────────────────────────────────────────────

export type FSITrend = 'rising' | 'stable' | 'declining';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export type EngagementLevel = 'low' | 'normal' | 'high';

export interface EngagementSignalOutput {
  fsi_7d: number;
  fsi_trend: FSITrend;
  ori_7d: number;
  fsi_level: 'fragile' | 'normal' | 'robust';
  ori_level: EngagementLevel;
  /** True if engagement favors momentum/build (ISE-1, ISE-4) */
  favors_momentum: boolean;
  /** True if engagement is fragile enough to favor recovery (ISE-2, ISE-6) */
  favors_recovery_or_explore: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL INPUTS
// ─────────────────────────────────────────────────────────────────────────────

export interface EngagementSignalInputs {
  /** FSI 7-day current value, 0.0–1.0 */
  fsi_7d_current: number;
  /** FSI trend (rising / stable / declining) */
  fsi_trend: FSITrend;
  /** ORI 7-day decay-weighted value, 0.0–1.0 */
  ori_7d: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE SIGNAL 5
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateSignal5Engagement(
  inputs: EngagementSignalInputs
): EngagementSignalOutput {
  // FSI level
  let fsi_level: 'fragile' | 'normal' | 'robust' = 'normal';
  if (inputs.fsi_7d_current <= THRESHOLD_FSI_FRAGILE) {
    fsi_level = 'fragile';
  } else if (inputs.fsi_7d_current >= THRESHOLD_FSI_ROBUST) {
    fsi_level = 'robust';
  }

  // ORI level
  let ori_level: EngagementLevel = 'normal';
  if (inputs.ori_7d <= THRESHOLD_ORI_LOW) {
    ori_level = 'low';
  } else if (inputs.ori_7d >= THRESHOLD_ORI_HIGH) {
    ori_level = 'high';
  }

  // Favors momentum: robust FSI + rising trend + normal/high ORI
  const favors_momentum =
    fsi_level === 'robust' &&
    inputs.fsi_trend !== 'declining' &&
    ori_level !== 'low';

  // Favors recovery / explore: fragile FSI OR declining FSI OR low ORI
  const favors_recovery_or_explore =
    fsi_level === 'fragile' ||
    inputs.fsi_trend === 'declining' ||
    ori_level === 'low';

  return {
    fsi_7d: inputs.fsi_7d_current,
    fsi_trend: inputs.fsi_trend,
    ori_7d: inputs.ori_7d,
    fsi_level,
    ori_level,
    favors_momentum,
    favors_recovery_or_explore
  };
}
