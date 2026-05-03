/**
 * RESOLVER SIGNAL 4 — Health Status
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §6 Signal 4
 *   - Beacon Canon v1.1 §15 (composites in orange/red)
 *   - Beacon Canon v1.1 §10 (pre-signal detection)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §3.2 (composite cascade input)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §5.3 (LIVE composites only count)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §3 (slot_drift_count_24h NEW input)
 * 
 * Aggregates "is the patient's underlying biology + behavior signaling concern?"
 * 
 * Per G2 §5.3: Only `state = "live"` composites count. Accruing composites
 * are NEVER counted in composites_in_orange or composites_in_red.
 * 
 * Per G3 §3: Slot drift count over last 24h is a NEW input added to Signal 4
 * (not a separate signal — slot drift is a health/behavior signal).
 */

import {
  THRESHOLD_COMPOSITES_IN_ORANGE,
  THRESHOLD_COMPOSITES_IN_RED,
  THRESHOLD_SLOT_DRIFT_COUNT_24H
} from '../thresholds.js';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export type HealthStatusLevel = 'normal' | 'concern' | 'critical';

export interface HealthStatusSignalOutput {
  composites_in_orange: number;
  composites_in_red: number;
  any_presignal_active: boolean;
  slot_drift_count_24h: number;
  status_level: HealthStatusLevel;
  /** True if this signal favors recovery / ISE-2 */
  favors_recovery: boolean;
  /** True if this signal favors clinical handoff / ISE-5 */
  favors_clinical_handoff: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL INPUTS
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthStatusSignalInputs {
  /** Count of LIVE composites in Bands 4-7 (orange-spectrum + red) */
  composites_in_orange: number;
  /** Count of LIVE composites in Band 7 (Red) only */
  composites_in_red: number;
  /** True if any LIVE composite is in pre-signal state (Band 3 + declining velocity) */
  any_presignal_active: boolean;
  /** Slot drifts in last 24 hours (G3 §3 — new Signal 4 input) */
  slot_drift_count_24h: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// WIRING HELPER — build HealthStatusSignalInputs from composite records
// 
// ⚠️ AUDIT 2026-05-03 — NEW HELPER
// 
// Pre-audit: callers had to manually compute `any_presignal_active`. No upstream
// code did so, leaving the field structurally always false in production.
// 
// Post-audit: this helper takes the user's composite records (with 14-day-ago
// snapshots) and computes all four fields per canon §10.2 + Beacon §15.
// 
// Integration usage (example for Zakiy):
//   const records = await cosmos.getCompositesForUser(userId);
//   const history = await cosmos.getCompositeHistoryAt(userId, fourteenDaysAgo);
//   const slot_drift_24h = await cosmos.countSlotDriftsLast24h(userId);
//   const signal_4_inputs = buildHealthStatusInputs(records, history, slot_drift_24h);
//   resolve({ ..., signal_4_inputs });
// ─────────────────────────────────────────────────────────────────────────────

import type { CompositeStateRecord } from '../../types/composite.js';
import { detectAnyPreSignalActive } from '../../computation/presignal-detection.js';

export interface CompositeHistoryEntry {
  /** Composite record for the user at "now" */
  composite: CompositeStateRecord;
  /** That composite's score 14 days ago (null if not yet 14 days of history) */
  score_14_days_ago: number | null;
}

export function buildHealthStatusInputs(
  history: ReadonlyArray<CompositeHistoryEntry>,
  slot_drift_count_24h: number
): HealthStatusSignalInputs {
  let composites_in_orange = 0;
  let composites_in_red = 0;

  for (const entry of history) {
    if (entry.composite.state !== 'live') continue;
    const band = entry.composite.beacon_band;
    if (band === null) continue;
    if (band === 7) composites_in_red += 1;
    else if (band >= 4 && band <= 6) composites_in_orange += 1;
  }

  const any_presignal_active = detectAnyPreSignalActive(
    history.map((h) => ({
      composite: h.composite,
      score_14_days_ago: h.score_14_days_ago
    }))
  );

  return {
    composites_in_orange,
    composites_in_red,
    any_presignal_active,
    slot_drift_count_24h
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE SIGNAL 4
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateSignal4HealthStatus(
  inputs: HealthStatusSignalInputs
): HealthStatusSignalOutput {
  let status_level: HealthStatusLevel = 'normal';

  if (
    inputs.composites_in_red >= THRESHOLD_COMPOSITES_IN_RED ||
    inputs.composites_in_orange >= THRESHOLD_COMPOSITES_IN_ORANGE + 1
  ) {
    status_level = 'critical';
  } else if (
    inputs.composites_in_orange >= THRESHOLD_COMPOSITES_IN_ORANGE ||
    inputs.any_presignal_active ||
    inputs.slot_drift_count_24h >= THRESHOLD_SLOT_DRIFT_COUNT_24H
  ) {
    status_level = 'concern';
  }

  // Favors recovery (ISE-2): concern level OR active presignal
  const favors_recovery =
    status_level === 'concern' || inputs.any_presignal_active;

  // Favors clinical handoff (ISE-5): critical level
  const favors_clinical_handoff = status_level === 'critical';

  return {
    composites_in_orange: inputs.composites_in_orange,
    composites_in_red: inputs.composites_in_red,
    any_presignal_active: inputs.any_presignal_active,
    slot_drift_count_24h: inputs.slot_drift_count_24h,
    status_level,
    favors_recovery,
    favors_clinical_handoff
  };
}
