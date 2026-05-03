/**
 * PAC-ISE-002 ACCEPTANCE TESTS — Canon §10 Priority Chain
 * 
 * Source canon: PAC-ISE-002 v2.0 §10 (pseudocode — source of truth)
 * 
 * ⚠️ AUDIT 2026-05-03 — REWRITTEN
 * Pre-audit version asserted against my non-canonical chain. This version
 * asserts against the literal canon §10 pseudocode.
 */

import { describe, it, expect } from '@jest/globals';
import { ISEState } from '../../src/types/ise.js';
import {
  evaluatePriorityChain,
  detectConflictingSignals,
  type PriorityChainInputs
} from '../../src/resolver/priority-chain.js';
import {
  RESOLVER_THRESHOLDS_SNAPSHOT,
  THRESHOLD_STALE_HOURS,
  THRESHOLD_PLI_OVERLOAD,
  THRESHOLD_COMPOSITES_IN_ORANGE,
  THRESHOLD_SLOT_DRIFT_COUNT_24H,
  THRESHOLD_TRAJECTORY_NEG_SLOPE,
  THRESHOLD_TRAJECTORY_POS_SLOPE,
  THRESHOLD_ONBOARDING_DAYS
} from '../../src/resolver/thresholds.js';
import { evaluateSignal2DataFreshness } from '../../src/resolver/signals/signal-2-data-freshness.js';
import { evaluateSignal3CognitiveLoad } from '../../src/resolver/signals/signal-3-cognitive-load.js';
import { evaluateSignal4HealthStatus } from '../../src/resolver/signals/signal-4-health-status.js';
import { evaluateSignal5Engagement } from '../../src/resolver/signals/signal-5-engagement.js';
import { evaluateSignal6Trajectory } from '../../src/resolver/signals/signal-6-trajectory.js';

// Fixture: aligned by default (resolves to ISE-1 via canon §10 CHECK 5)
function buildAlignedInputs(): PriorityChainInputs {
  return {
    governance_flag: false,
    data_freshness_hours: 1,
    onboarding_days: 365,
    pli_count: 2,
    space_state: 'protected',
    composites_in_orange: 0,
    composites_in_red: 0,
    any_presignal_active: false,
    fsi_trend: 'stable',
    ori_7d: 0.6,
    mood_slope: 0,
    effort_slope: 0
  };
}

describe('PAC-ISE-002 v2.0 §10 — Canon-Literal Priority Chain', () => {
  describe('Threshold constants (canon §15)', () => {
    it('THRESHOLD_STALE_HOURS = 72', () => {
      expect(THRESHOLD_STALE_HOURS).toBe(72);
    });
    it('THRESHOLD_PLI_OVERLOAD = 5', () => {
      expect(THRESHOLD_PLI_OVERLOAD).toBe(5);
    });
    it('THRESHOLD_COMPOSITES_IN_ORANGE = 2', () => {
      expect(THRESHOLD_COMPOSITES_IN_ORANGE).toBe(2);
    });
    it('THRESHOLD_SLOT_DRIFT_COUNT_24H = 3 (G3 §3)', () => {
      expect(THRESHOLD_SLOT_DRIFT_COUNT_24H).toBe(3);
    });
    it('Trajectory thresholds: -0.1 / +0.1 (G1 §5)', () => {
      expect(THRESHOLD_TRAJECTORY_NEG_SLOPE).toBe(-0.1);
      expect(THRESHOLD_TRAJECTORY_POS_SLOPE).toBe(0.1);
    });
    it('THRESHOLD_ONBOARDING_DAYS = 7', () => {
      expect(THRESHOLD_ONBOARDING_DAYS).toBe(7);
    });
    it('RESOLVER_THRESHOLDS_SNAPSHOT carries source canon attribution', () => {
      expect(RESOLVER_THRESHOLDS_SNAPSHOT.source).toContain('PAC-ISE-002');
    });
  });

  describe('Canon §10 priority chain — CHECK ordering', () => {
    it('CHECK 1: governance_flag = true → ISE-5', () => {
      const inputs = buildAlignedInputs();
      inputs.governance_flag = true;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_5_RESTRICTED_GUARDED);
      expect(result.selected_by_step).toBe('governance');
    });

    it('CHECK 2: onboarding_days < 7 → ISE-6 (⚠️ AUDIT was: ISE-0)', () => {
      const inputs = buildAlignedInputs();
      inputs.onboarding_days = 3;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL);
      expect(result.selected_by_step).toBe('low_signal_onboarding');
      expect(result.reason_codes).toContain('LOW_SIGNAL_ONBOARDING');
    });

    it('CHECK 2: data_freshness_hours > 72 → ISE-6', () => {
      const inputs = buildAlignedInputs();
      inputs.data_freshness_hours = 100;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL);
      expect(result.reason_codes).toContain('DATA_INSUFFICIENT');
    });

    it('CHECK 2: conflicting signals → ISE-6 with CONFLICTING_SIGNALS', () => {
      const inputs = buildAlignedInputs();
      inputs.composites_in_red = 1;
      inputs.fsi_trend = 'rising';
      inputs.ori_7d = 0.85;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL);
      expect(result.reason_codes).toContain('CONFLICTING_SIGNALS');
    });

    it('CHECK 3: PLI≥5 + vulnerable → ISE-3', () => {
      const inputs = buildAlignedInputs();
      inputs.pli_count = 6;
      inputs.space_state = 'vulnerable';
      // Dodge canon §9 conflict pattern 2 (PLI≥5 + orange=0 + stable):
      // change fsi_trend so that pattern doesn't match before CHECK 3 fires.
      inputs.fsi_trend = 'rising';
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_3_CONTAINED_LOAD_LIMITED);
    });

    it('CHECK 3: PLI≥5 + composites_in_orange ≥ 3 → ISE-3', () => {
      const inputs = buildAlignedInputs();
      inputs.pli_count = 6;
      inputs.composites_in_orange = 3;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_3_CONTAINED_LOAD_LIMITED);
    });

    it('CHECK 3: PLI≥5 alone (no vulnerable, no orange overload) does NOT fire ISE-3', () => {
      const inputs = buildAlignedInputs();
      inputs.pli_count = 6;
      // Need to disable conflict pattern 2 (PLI≥5 + 0 orange + stable)
      inputs.fsi_trend = 'rising'; // breaks conflict pattern
      inputs.ori_7d = 0.4; // disables aligned (so result lands somewhere meaningful)
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).not.toBe(ISEState.ISE_3_CONTAINED_LOAD_LIMITED);
    });

    it('CHECK 4A: composites_in_red ≥ 1 + declining FSI → ISE-2 (⚠️ AUDIT was: ISE-5)', () => {
      const inputs = buildAlignedInputs();
      inputs.composites_in_red = 1;
      inputs.fsi_trend = 'declining';
      inputs.ori_7d = 0.4; // dodge conflict pattern 1
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD);
      expect(result.selected_by_step).toBe('protective_health');
      expect(result.reason_codes).toContain('RECOVERY_LOW');
    });

    it('CHECK 4A: composites_in_red ≥ 1 + mood_slope < -0.1 → ISE-2', () => {
      const inputs = buildAlignedInputs();
      inputs.composites_in_red = 1;
      inputs.mood_slope = -0.2;
      inputs.ori_7d = 0.4;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD);
    });

    it('CHECK 4B: declining FSI + ORI < 0.5 → ISE-2 (engagement collapse)', () => {
      const inputs = buildAlignedInputs();
      inputs.fsi_trend = 'declining';
      inputs.ori_7d = 0.3;
      inputs.composites_in_red = 0;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD);
      expect(result.selected_by_step).toBe('protective_engagement');
      expect(result.reason_codes).toContain('ADHERENCE_EROSION');
    });

    it('CHECK 5: aligned conditions met → ISE-1', () => {
      const inputs = buildAlignedInputs();
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_1_ALIGNED_AVAILABLE);
      expect(result.selected_by_step).toBe('aligned');
    });

    it('CHECK 5: vulnerable space disables aligned', () => {
      const inputs = buildAlignedInputs();
      inputs.space_state = 'vulnerable';
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).not.toBe(ISEState.ISE_1_ALIGNED_AVAILABLE);
    });

    it('CHECK 5: low ORI disables aligned', () => {
      const inputs = buildAlignedInputs();
      inputs.ori_7d = 0.3;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).not.toBe(ISEState.ISE_1_ALIGNED_AVAILABLE);
    });

    it('CHECK 6: building momentum (Mark scenario) → ISE-4', () => {
      const inputs = buildAlignedInputs();
      inputs.fsi_trend = 'rising';
      inputs.mood_slope = 0.15;
      inputs.effort_slope = 0.12;
      inputs.composites_in_red = 0;
      inputs.any_presignal_active = false;
      // To land in ISE-4, must NOT satisfy aligned (canon §5: "Momentum is
      // intentionally after Aligned to prevent overriding misaligned day").
      // Aligned requires ori_7d >= 0.5 (canon §6 Signal 5 default).
      inputs.ori_7d = 0.3; // disables aligned CHECK 5
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_4_BUILDING_MOMENTUM);
      expect(result.selected_by_step).toBe('building_momentum');
    });

    it('CHECK 6: any_presignal_active disables ISE-4', () => {
      const inputs = buildAlignedInputs();
      inputs.any_presignal_active = true;
      inputs.fsi_trend = 'rising';
      inputs.mood_slope = 0.15;
      inputs.effort_slope = 0.12;
      inputs.ori_7d = 0.3; // below canon 0.5 threshold
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).not.toBe(ISEState.ISE_4_BUILDING_MOMENTUM);
    });

    it('FALLBACK: no canonical conditions match → ISE-0', () => {
      const inputs = buildAlignedInputs();
      inputs.space_state = 'vulnerable'; // disables aligned
      inputs.fsi_trend = 'stable';
      inputs.mood_slope = 0;
      inputs.effort_slope = 0;
      const result = evaluatePriorityChain(inputs);
      expect(result.resolved_state).toBe(ISEState.ISE_0_NEUTRAL_BASELINE);
      expect(result.selected_by_step).toBe('fallback');
    });
  });

  describe('Conflict detection (canon §9)', () => {
    it('Pattern 1: red + rising + high ORI flags conflict', () => {
      const inputs = buildAlignedInputs();
      inputs.composites_in_red = 1;
      inputs.fsi_trend = 'rising';
      inputs.ori_7d = 0.85;
      expect(detectConflictingSignals(inputs)).toBe(true);
    });

    it('Pattern 2: high PLI + zero orange + stable flags conflict', () => {
      const inputs = buildAlignedInputs();
      inputs.pli_count = 6;
      inputs.composites_in_orange = 0;
      inputs.fsi_trend = 'stable';
      expect(detectConflictingSignals(inputs)).toBe(true);
    });

    it('Normal aligned state does not flag conflict', () => {
      const inputs = buildAlignedInputs();
      expect(detectConflictingSignals(inputs)).toBe(false);
    });
  });

  describe('Signal evaluators — sanity', () => {
    it('Signal 2 detects critical staleness above 168h', () => {
      const eight_days_ago = new Date(Date.now() - 192 * 60 * 60 * 1000).toISOString();
      const result = evaluateSignal2DataFreshness({
        most_recent_data_timestamp: eight_days_ago
      });
      expect(result.forces_ise6).toBe(true);
    });

    it('Signal 3 detects cognitive overload at PLI ≥ 5', () => {
      const result = evaluateSignal3CognitiveLoad({
        pli_count: 6,
        space_state: 'challenging'
      });
      expect(result.load_level).toBe('overload');
    });

    it('Signal 4 reports composite + slot drift counts', () => {
      const result = evaluateSignal4HealthStatus({
        composites_in_orange: 0,
        composites_in_red: 0,
        any_presignal_active: false,
        slot_drift_count_24h: 4
      });
      expect(result.slot_drift_count_24h).toBe(4);
    });

    it('Signal 5 classifies engagement levels', () => {
      const robust = evaluateSignal5Engagement({
        fsi_7d_current: 0.85,
        fsi_trend: 'rising',
        ori_7d: 0.8
      });
      expect(robust.fsi_level).toBe('robust');
    });

    it('Signal 6 classifies trajectory direction (G1 + G7)', () => {
      // Steep positive slope: ~0.13/day across 7 days, clears THRESHOLD_TRAJECTORY_POS_SLOPE (0.1)
      const rising = evaluateSignal6Trajectory({
        mood_normalized_7d: [0.0, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90],
        effort_score_daily_7d: [0.0, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90],
        fsi_trend: 'rising'
      });
      expect(rising.direction).toBe('up');
    });
  });
});
