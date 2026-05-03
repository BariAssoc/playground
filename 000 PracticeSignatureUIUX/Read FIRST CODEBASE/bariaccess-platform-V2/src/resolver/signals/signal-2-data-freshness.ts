/**
 * RESOLVER SIGNAL 2 — Data Freshness
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §6 Signal 2
 *   - PAC-ISE-002 v2.0 §15 (THRESHOLD_STALE_HOURS = 72)
 * 
 * Tracks how recently data has flowed in across all sources.
 * Stale data → Resolver forces ISE-6 (Exploratory/Low-Signal).
 */

import {
  THRESHOLD_STALE_HOURS,
  THRESHOLD_STALE_FORCE_ISE6_HOURS
} from '../thresholds.js';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL OUTPUT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type DataFreshnessLevel = 'fresh' | 'stale' | 'critical_stale';

export interface DataFreshnessSignalOutput {
  level: DataFreshnessLevel;
  most_recent_data_at: string | null; // ISO 8601 of latest signal across all sources
  hours_since_most_recent: number;
  forces_ise6: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL INPUTS
// ─────────────────────────────────────────────────────────────────────────────

export interface DataFreshnessSignalInputs {
  /**
   * Most recent data timestamp across ALL sources (biometric, behavioral, manual).
   * If no data ever → null.
   */
  most_recent_data_timestamp: string | null;
  /** Reference time for staleness calculation, defaults to now. */
  evaluated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE SIGNAL 2
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateSignal2DataFreshness(
  inputs: DataFreshnessSignalInputs
): DataFreshnessSignalOutput {
  const now = inputs.evaluated_at ? new Date(inputs.evaluated_at) : new Date();

  if (inputs.most_recent_data_timestamp === null) {
    return {
      level: 'critical_stale',
      most_recent_data_at: null,
      hours_since_most_recent: Number.POSITIVE_INFINITY,
      forces_ise6: true
    };
  }

  const last = new Date(inputs.most_recent_data_timestamp);
  const hours_since = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

  let level: DataFreshnessLevel = 'fresh';
  if (hours_since >= THRESHOLD_STALE_FORCE_ISE6_HOURS) {
    level = 'critical_stale';
  } else if (hours_since >= THRESHOLD_STALE_HOURS) {
    level = 'stale';
  }

  return {
    level,
    most_recent_data_at: inputs.most_recent_data_timestamp,
    hours_since_most_recent: hours_since,
    forces_ise6: hours_since >= THRESHOLD_STALE_FORCE_ISE6_HOURS
  };
}
