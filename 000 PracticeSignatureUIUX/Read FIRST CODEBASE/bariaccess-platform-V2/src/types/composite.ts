/**
 * COMPOSITE — R&R Pyramid mid-layer (8 composites)
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §15 (8 composite names + scoring hierarchy)
 *   - CCO-RR-PYRAMID-ADD-001 v1.0 (Pyramid + Ground Levels architecture)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §2 (all 8 = Path B)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §3 (cascade stops at composite layer)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §4 (Phase 1 scope: SRC + CRC LIVE Day 1)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §5 (accruing/live render token)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §6 (Cosmos composite-state container)
 * 
 * This file defines TYPES ONLY.
 */

import type { CompositeName, CompositeMetadata, BeaconBand } from './beacon.js';
import type { CompositeState, Confidence } from './ise.js';

// Re-export shared types
export type { CompositeName, CompositeMetadata, CompositeState, Confidence };

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE STATE RECORD (G2 §6.1 — Cosmos composite-state container)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeStateRecord {
  id: string; // = `${userId}_${compositeName}`
  userId: string; // partition key
  compositeName: CompositeName;
  state: CompositeState;

  // Score snapshot (only when state = "live")
  score_0_100: number | null;
  beacon_band: BeaconBand | null;
  confidence: Confidence | null;

  // Unlock metadata
  unlock_trigger: string; // human-readable spec
  unlock_progress: number; // 0.0-1.0 toward unlock
  unlocked_at: string | null; // ISO 8601 when transitioned to live

  // Cascade tracking (G2 §3 — cascade stops at composite layer)
  last_cascade_fired_at: string | null;
  last_recompute_at: string;

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 UNLOCK TRIGGERS (G2 §4.2)
// ─────────────────────────────────────────────────────────────────────────────

export interface PhaseOneUnlockSpec {
  composite: CompositeName;
  phase1_status: 'live_day_1' | 'accruing';
  unlock_trigger_text: string;
  estimated_day: string; // e.g., "Day 7-10"
  celebration_moment: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CASCADE EVENT (G2 §3.1 — ground orange → composite orange)
// ─────────────────────────────────────────────────────────────────────────────

export type GroundLevel = 'healthspan' | 'my_blueprint';

export interface CompositeCascadeEvent {
  eventId: string;
  userId: string;
  timestamp: string;

  source_ground_level: GroundLevel;
  source_signal_name: string; // e.g., "FibroScan", "chronotype_drift"

  affected_composite: CompositeName;
  composite_old_band: BeaconBand | null;
  composite_new_band: BeaconBand;

  // Hard rule: cascade stops at composite layer per G2 §3
  apex_recompute_triggered: false; // always false — apex on daily roll-up only

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// APEX ROLL-UP (G2 OQ-PATCH-04 closure: 03:00 patient-local)
// ─────────────────────────────────────────────────────────────────────────────

export const APEX_ROLLUP_LOCAL_TIME = '03:00' as const;

export interface RRApexRecord {
  id: string; // = `${userId}_${date}`
  userId: string; // partition key
  date: string; // YYYY-MM-DD (patient-local)

  apex_score_0_100: number;
  apex_band: BeaconBand;
  confidence: Confidence;

  // Composite snapshots used in apex computation
  composite_scores_at_rollup: Partial<Record<CompositeName, number>>;
  composite_states_at_rollup: Partial<Record<CompositeName, CompositeState>>;

  rollup_completed_at: string; // ISO 8601 — actual time computed

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE REVERSION RULE (G2 OQ-PATCH-05 closure: stay LIVE with confidence drop)
// Once unlocked, composite never reverts to accruing.
// Confidence drops one tier per Beacon §11 when underlying data degrades.
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeIrreversibilityRule {
  composite: CompositeName;
  // Once unlocked_at is set, state stays "live" forever.
  // Below FCS statistical floor → confidence drops, NOT state reverts.
  irreversible: true;
}
