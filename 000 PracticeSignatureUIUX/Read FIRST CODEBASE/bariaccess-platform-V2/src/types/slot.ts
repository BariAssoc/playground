/**
 * SLOT — Routine Bookshelf 17-slot system + cascade
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-001 v1.1 §6.5 (17-slot architecture)
 *   - CCO-UX-RBSHELF-001 v1.1 §13 (Time Anchor — Surface #1 of 7-surface cascade)
 *   - CCO-UX-RBSHELF-001 v1.1 §14 (FAB-to-Slot mapping)
 *   - CCO-UX-RBSHELF-001 v1.1 §15 (Slot Expression Activation Rules)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §3 (slot drift → Signal 4)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §4 (slot completion → Signal 5)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §5 (selective cascade routing)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §6 (storage hooks)
 * 
 * This file defines TYPES ONLY.
 */

import type { FABFamily, FABOutcome } from './fab.js';

// ─────────────────────────────────────────────────────────────────────────────
// SLOT IDENTIFIERS (RBSHELF v1.1 §6.5 — 9 anchor + 8 bridge = 17 total)
// ─────────────────────────────────────────────────────────────────────────────

export type AnchorSlotId =
  | 'AM1' | 'AM2' | 'AM3'
  | 'Mid1' | 'Mid2' | 'Mid3'
  | 'PM1' | 'PM2' | 'PM3';

export type BridgeSlotId =
  | 'A1' | 'A2' | 'A3' | 'A4'  // AM → Midday
  | 'B1' | 'B2' | 'B3' | 'B4'; // Midday → Evening

export type SlotId = AnchorSlotId | BridgeSlotId;

export const ALL_ANCHOR_SLOTS: ReadonlyArray<AnchorSlotId> = [
  'AM1', 'AM2', 'AM3',
  'Mid1', 'Mid2', 'Mid3',
  'PM1', 'PM2', 'PM3'
] as const;

export const ALL_BRIDGE_SLOTS: ReadonlyArray<BridgeSlotId> = [
  'A1', 'A2', 'A3', 'A4',
  'B1', 'B2', 'B3', 'B4'
] as const;

export const ALL_SLOTS: ReadonlyArray<SlotId> = [
  ...ALL_ANCHOR_SLOTS,
  ...ALL_BRIDGE_SLOTS
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// UMBRELLA (Bookshelf displays only umbrellas — RBSHELF v1.1 §3)
// ─────────────────────────────────────────────────────────────────────────────

export type Umbrella = 'AM' | 'Mid' | 'PM';

// ─────────────────────────────────────────────────────────────────────────────
// SLOT LIFECYCLE (RBSHELF v1.1 §15.2)
// ─────────────────────────────────────────────────────────────────────────────

export type SlotLifecycleState = 'pre_window' | 'in_window' | 'post_window';

// ─────────────────────────────────────────────────────────────────────────────
// SLOT FINAL STATES (RBSHELF v1.1 §15.4)
// Locked once post_window — Green/Gray/Orange
// ─────────────────────────────────────────────────────────────────────────────

export type SlotFinalState = 'green' | 'gray' | 'orange';

// ─────────────────────────────────────────────────────────────────────────────
// SLOT STATE RECORD (G3 §6.1 — Cosmos slot-state container)
// ─────────────────────────────────────────────────────────────────────────────

export interface SlotStateRecord {
  id: string; // = `${userId}_${date}_${slotId}`
  userId: string; // partition key
  date: string; // YYYY-MM-DD
  slotId: SlotId;

  // Lifecycle
  lifecycle_state: SlotLifecycleState;
  window_start_ts: string;
  window_end_ts: string;

  // Final state (locked once post_window)
  final_state: SlotFinalState | null;
  final_state_locked_at: string | null;

  // Membership
  fabs_in_slot: string[]; // FAB instance IDs scheduled for this slot
  fab_outcomes: Record<string, FABOutcome | 'pending'>;

  // Drift tracking
  drift_detected_in_window: boolean;
  drift_detection_reason: string | null;

  _ts?: number; // Cosmos auto
}

// ─────────────────────────────────────────────────────────────────────────────
// CASCADE FIRE EVENT (G3 §5.3 — slot-cascade-events container)
// ─────────────────────────────────────────────────────────────────────────────

export type DriftSignalSource = 'a6_trend' | 'a2_completion' | 'a8_context';

export type CascadeSurface =
  | 'bookshelf_slot'
  | 'ollie_space'
  | 'ai_playground'
  | 'daily_pulse_fab_tracker'
  | 'daily_pulse_routine_tracker'
  | 'logo_optional'
  | 'inner_circle_vitamin_s'
  | 'composite_mbc'
  | 'composite_crc'
  | 'composite_bhr';

export interface SlotCascadeFireEvent {
  eventId: string;
  userId: string;
  timestamp: string;

  source: {
    slotId: SlotId;
    fab_family: FABFamily;
    fab_id: string;
    drift_signal: DriftSignalSource;
  };

  surfaces_lit: CascadeSurface[];
  cascade_terminated_at: CascadeSurface | null;
  smile_doctrine_color: string; // unified Beacon color all lit surfaces matched

  contributes_to_signal_4: boolean; // true if drift contributes to slot_drift_count
  contributes_to_signal_5: boolean; // false — slot drift ≠ engagement signal

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLOT COMPLETION EVENT (G3 §4.1 — feeds Signal 5 FCS + ORI)
// ─────────────────────────────────────────────────────────────────────────────

export interface SlotCompletionEvent {
  slotId: SlotId;
  userId: string;

  // Bookend timestamps (G1 §2)
  should_start_ts: string;
  actual_start_ts: string;
  actual_end_ts: string;
  duration_sec: number;

  // Slot final state (RBSHELF §15.4)
  final_state: SlotFinalState;

  // FCS inputs (CCO-FAB-001 §11)
  completion_rate_within_slot: number; // 0.0-1.0
  timing_accuracy: number; // 0.0-1.0

  // ORI source — Ollie prompts during this slot
  ollie_prompts_delivered: number;
  ollie_prompts_responded: number;
  ori_local: number; // = responded / delivered

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY ENGAGEMENT ROLLUP (G3 §6.3)
// Feeds Signal 4 (slot_drift_count_24h) + Signal 5 (FSI/ORI 7-day)
// ─────────────────────────────────────────────────────────────────────────────

export type FSITrend = 'rising' | 'stable' | 'declining';

export interface DailyEngagementRollup {
  id: string; // = `${userId}_${date}`
  userId: string; // partition key
  date: string; // YYYY-MM-DD

  // FCS per family (G3 §4.2)
  fcs_by_family: Record<FABFamily, number>; // 0.0-1.0 per family

  // FSI 7-day trend (Signal 5)
  fsi_7d_value: number; // 0.0-1.0 cross-FAB stability
  fsi_7d_trend: FSITrend;

  // ORI 7-day decay-weighted (Signal 5)
  ori_7d: number; // 0.0-1.0

  // Signal 4 contribution (G3 §3)
  slot_drift_count_24h: number;

  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECTIVE CASCADE ROUTING TABLE (G3 §5.1)
// Maps FAB family → which surfaces light up on cascade
// Implementation lives in src/computation/cascade-router.ts
// ─────────────────────────────────────────────────────────────────────────────

export interface CascadeRoutingRule {
  family: FABFamily;
  surfaces: ReadonlyArray<CascadeSurface>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-SLOT FAB RULE (G3 §5.2 — closes OQ-RBSHELF-PATCH-03)
// Cross-slot FABs anchored to START SLOT only for cascade purposes
// ─────────────────────────────────────────────────────────────────────────────

export interface CrossSlotFAB {
  fabId: string;
  start_slot: SlotId;
  end_slot: SlotId;
  spans_boundary: true;
  // Cascade fires in start_slot only per §5.2
}
