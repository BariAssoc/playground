/**
 * SLOT LIFECYCLE INTEGRATION — RBSHELF §15 Lifecycle Verification
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-001 v1.1 §6.5 (17-slot architecture: 9 anchor + 8 bridge)
 *   - CCO-UX-RBSHELF-001 v1.1 §15 (slot lifecycle: pre_window → in_window → post_window)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §6 (storage hooks)
 * 
 * Slot lifecycle progression:
 *   pre_window  → before window opens (FAB scheduled, not yet active)
 *   in_window   → window open (FAB live; outcomes accruing)
 *   post_window → window closed (final_state locked; no further mutation)
 * 
 * Final state options when transitioning to post_window:
 *   green  → all FABs in slot completed (Y)
 *   orange → drift detected in window (any drift_outcome)
 *   gray   → no FABs scheduled or all skipped (N)
 */

import { describe, it, expect } from '@jest/globals';
import {
  ALL_SLOTS,
  ALL_ANCHOR_SLOTS,
  ALL_BRIDGE_SLOTS
} from '../../src/types/slot.js';
import type {
  SlotStateRecord,
  SlotLifecycleState,
  SlotFinalState,
  SlotId
} from '../../src/types/slot.js';

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildSlot(
  slotId: SlotId,
  lifecycle_state: SlotLifecycleState,
  overrides: Partial<SlotStateRecord> = {}
): SlotStateRecord {
  return {
    id: `mark-spg-001_2026-05-03_${slotId}`,
    userId: 'mark-spg-001',
    date: '2026-05-03',
    slotId,
    lifecycle_state,
    window_start_ts: '2026-05-03T07:00:00Z',
    window_end_ts: '2026-05-03T09:00:00Z',
    final_state: null,
    final_state_locked_at: null,
    fabs_in_slot: ['fab-hydration-1', 'fab-protein-1'],
    fab_outcomes: {
      'fab-hydration-1': 'pending',
      'fab-protein-1': 'pending'
    },
    drift_detected_in_window: false,
    drift_detection_reason: null,
    ...overrides
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LIFECYCLE TRANSITION SIMULATOR (pure function — what the runtime would do)
// ─────────────────────────────────────────────────────────────────────────────

function transitionToInWindow(slot: SlotStateRecord): SlotStateRecord {
  if (slot.lifecycle_state !== 'pre_window') {
    throw new Error(`Cannot transition to in_window from ${slot.lifecycle_state}`);
  }
  return { ...slot, lifecycle_state: 'in_window' };
}

function transitionToPostWindow(
  slot: SlotStateRecord,
  final_state: SlotFinalState
): SlotStateRecord {
  if (slot.lifecycle_state !== 'in_window') {
    throw new Error(`Cannot transition to post_window from ${slot.lifecycle_state}`);
  }
  return {
    ...slot,
    lifecycle_state: 'post_window',
    final_state,
    final_state_locked_at: new Date().toISOString()
  };
}

function deriveFinalState(slot: SlotStateRecord): SlotFinalState {
  if (slot.fabs_in_slot.length === 0) return 'gray';
  if (slot.drift_detected_in_window) return 'orange';

  const outcomes = Object.values(slot.fab_outcomes);
  if (outcomes.every((o) => o === 'Y')) return 'green';
  if (outcomes.some((o) => o === 'drift')) return 'orange';
  if (outcomes.every((o) => o === 'N' || o === 'pending')) return 'gray';
  return 'green'; // mixed Y + N → green if any Y completed
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Slot Lifecycle Integration — RBSHELF §15', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // SLOT INVENTORY (RBSHELF v1.1 §6.5 — 17 slots: 9 anchor + 8 bridge)
  // ───────────────────────────────────────────────────────────────────────────

  it('17 total slots: 9 anchor + 8 bridge', () => {
    expect(ALL_ANCHOR_SLOTS.length).toBe(9);
    expect(ALL_BRIDGE_SLOTS.length).toBe(8);
    expect(ALL_SLOTS.length).toBe(17);
  });

  it('Anchor slot IDs follow AM[1-3], Mid[1-3], PM[1-3] convention', () => {
    expect(ALL_ANCHOR_SLOTS).toContain('AM1');
    expect(ALL_ANCHOR_SLOTS).toContain('AM3');
    expect(ALL_ANCHOR_SLOTS).toContain('Mid2');
    expect(ALL_ANCHOR_SLOTS).toContain('PM1');
  });

  it('Bridge slot IDs follow A[1-4], B[1-4] convention', () => {
    for (const id of ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'] as const) {
      expect(ALL_BRIDGE_SLOTS).toContain(id);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // LIFECYCLE TRANSITIONS (RBSHELF §15.2)
  // ───────────────────────────────────────────────────────────────────────────

  it('Slot starts in pre_window state', () => {
    const slot = buildSlot('AM1', 'pre_window');
    expect(slot.lifecycle_state).toBe('pre_window');
    expect(slot.final_state).toBeNull();
  });

  it('pre_window → in_window transition succeeds', () => {
    const slot = buildSlot('AM1', 'pre_window');
    const next = transitionToInWindow(slot);
    expect(next.lifecycle_state).toBe('in_window');
    expect(next.final_state).toBeNull(); // still null until post_window
  });

  it('in_window → post_window transition with green final state', () => {
    let slot = buildSlot('AM1', 'pre_window');
    slot = transitionToInWindow(slot);
    slot = {
      ...slot,
      fab_outcomes: { 'fab-hydration-1': 'Y', 'fab-protein-1': 'Y' }
    };
    const final = deriveFinalState(slot);
    const next = transitionToPostWindow(slot, final);
    expect(next.lifecycle_state).toBe('post_window');
    expect(next.final_state).toBe('green');
    expect(next.final_state_locked_at).not.toBeNull();
  });

  it('Drift in window → final_state = orange', () => {
    let slot = buildSlot('AM2', 'pre_window');
    slot = transitionToInWindow(slot);
    slot = {
      ...slot,
      drift_detected_in_window: true,
      drift_detection_reason: 'a6_trend exceeded threshold',
      fab_outcomes: { 'fab-hydration-1': 'drift', 'fab-protein-1': 'Y' }
    };
    const final = deriveFinalState(slot);
    expect(final).toBe('orange');
    const next = transitionToPostWindow(slot, final);
    expect(next.final_state).toBe('orange');
  });

  it('No FABs scheduled → final_state = gray', () => {
    let slot = buildSlot('Mid1', 'pre_window', {
      fabs_in_slot: [],
      fab_outcomes: {}
    });
    slot = transitionToInWindow(slot);
    const final = deriveFinalState(slot);
    expect(final).toBe('gray');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // INVALID TRANSITIONS REJECTED
  // ───────────────────────────────────────────────────────────────────────────

  it('Cannot transition pre_window → post_window directly (must go through in_window)', () => {
    const slot = buildSlot('AM1', 'pre_window');
    expect(() => transitionToPostWindow(slot, 'green')).toThrow();
  });

  it('Cannot transition in_window → in_window (already there)', () => {
    const slot = buildSlot('AM1', 'in_window');
    expect(() => transitionToInWindow(slot)).toThrow();
  });

  it('Cannot transition post_window → anywhere (terminal state)', () => {
    const slot = buildSlot('AM1', 'post_window', {
      final_state: 'green',
      final_state_locked_at: new Date().toISOString()
    });
    expect(() => transitionToInWindow(slot)).toThrow();
    expect(() => transitionToPostWindow(slot, 'orange')).toThrow();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // FINAL STATE IRREVERSIBILITY (post_window is terminal)
  // ───────────────────────────────────────────────────────────────────────────

  it('Final state is locked with timestamp once post_window', () => {
    let slot = buildSlot('PM1', 'pre_window');
    slot = transitionToInWindow(slot);
    slot = {
      ...slot,
      fab_outcomes: { 'fab-hydration-1': 'Y', 'fab-protein-1': 'Y' }
    };
    const next = transitionToPostWindow(slot, 'green');
    expect(next.final_state_locked_at).not.toBeNull();
    expect(next.final_state).toBe('green');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // FULL DAY CYCLE — 17 slots, all transition cleanly
  // ───────────────────────────────────────────────────────────────────────────

  it('Full day: all 17 slots can complete a full lifecycle', () => {
    let slots: SlotStateRecord[] = ALL_SLOTS.map((id) =>
      buildSlot(id, 'pre_window')
    );

    // Open all windows
    slots = slots.map(transitionToInWindow);
    expect(slots.every((s) => s.lifecycle_state === 'in_window')).toBe(true);

    // Mark all FABs complete and close windows
    slots = slots.map((s) => ({
      ...s,
      fab_outcomes: Object.fromEntries(
        Object.keys(s.fab_outcomes).map((k) => [k, 'Y'] as const)
      )
    }));
    slots = slots.map((s) => transitionToPostWindow(s, deriveFinalState(s)));

    expect(slots.every((s) => s.lifecycle_state === 'post_window')).toBe(true);
    expect(slots.every((s) => s.final_state === 'green')).toBe(true);
    expect(slots.every((s) => s.final_state_locked_at !== null)).toBe(true);
  });
});
