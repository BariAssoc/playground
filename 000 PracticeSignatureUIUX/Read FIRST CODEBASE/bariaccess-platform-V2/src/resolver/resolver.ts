/**
 * RESOLVER — Main Entry Point
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §3 (Resolver as dispatcher, not computer)
 *   - PAC-ISE-002 v2.0 §11 (output contract — ISEPayload)
 *   - PAC-ISE-002 v2.0 §13 (run triggers — scheduled/manual/event)
 *   - PAC-ISE-002 v2.0 §14 (Phase 1 WoZ + Phase 3 AI gating)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5 (Mental Wellbeing safety override)
 *   - PAC-ISE-001 v1.0A §6 (ISEPayload schema)
 *   - PAC-ISE-001 v1.0A §5 (ISE_DEFAULTS lookup)
 * 
 * The Resolver:
 *   1. Checks Mental Wellbeing safety override (G6) — short-circuits if active
 *   2. Evaluates 6 signals (Signal 7 stub returns unavailable)
 *   3. Runs priority chain to select ISE state
 *   4. Looks up ISE_DEFAULTS for that state
 *   5. Builds and returns ISEPayload v1.0A
 *   6. Caller persists to ise-current-state + appends to ise-transition-log
 * 
 * Per PAC-ISE-002 §3.1: Resolver is a DISPATCHER. It does NOT compute Effort,
 * FCS, ORI, slopes, or composite scores. Those live in src/computation/.
 */

import { ISEState } from '../types/ise.js';
import type { ISEPayload, Contributor } from '../types/ise.js';
import type { MentalWellbeingTrigger } from '../types/safety.js';
import type { ISESignalSnapshot, ResolverTriggerSource } from '../types/audit.js';

import {
  findActiveSafetyOverride,
  buildSafetyOverridePayload
} from './safety-override.js';

import {
  evaluateSignal1Governance,
  type GovernanceSignalInputs
} from './signals/signal-1-governance.js';
import {
  evaluateSignal2DataFreshness,
  type DataFreshnessSignalInputs
} from './signals/signal-2-data-freshness.js';
import {
  evaluateSignal3CognitiveLoad,
  type CognitiveLoadSignalInputs
} from './signals/signal-3-cognitive-load.js';
import {
  evaluateSignal4HealthStatus,
  type HealthStatusSignalInputs
} from './signals/signal-4-health-status.js';
import {
  evaluateSignal5Engagement,
  type EngagementSignalInputs
} from './signals/signal-5-engagement.js';
import {
  evaluateSignal6Trajectory,
  type TrajectorySignalInputs
} from './signals/signal-6-trajectory.js';
import {
  evaluateSignal7Voice,
  type VoiceTrajectorySignalInputs
} from './signals/signal-7-voice.js';

import {
  evaluatePriorityChain,
  type PriorityChainOutput
} from './priority-chain.js';

import { lookupISEDefaults } from '../payload/ise-defaults.js';

import {
  MAX_REASON_CODES_PER_PAYLOAD,
  MAX_CONTRIBUTORS_PER_PAYLOAD
} from './thresholds.js';

// ─────────────────────────────────────────────────────────────────────────────
// RESOLVER INPUT — everything the dispatcher needs
// 
// Caller is responsible for fetching all source data from Cosmos and assembling
// these inputs. Resolver itself is a pure function.
// ─────────────────────────────────────────────────────────────────────────────

export interface ResolverInputs {
  userId: string;
  triggerSource: ResolverTriggerSource;

  /** Active mental wellbeing triggers (G6) — checked first */
  active_safety_triggers: MentalWellbeingTrigger[];

  /** Per-signal inputs */
  signal_1_inputs: GovernanceSignalInputs;
  signal_2_inputs: DataFreshnessSignalInputs;
  signal_3_inputs: CognitiveLoadSignalInputs;
  signal_4_inputs: HealthStatusSignalInputs;
  signal_5_inputs: EngagementSignalInputs;
  signal_6_inputs: TrajectorySignalInputs;
  signal_7_inputs: VoiceTrajectorySignalInputs;

  /** Days since user's D0 / membership start */
  days_since_d0: number;

  /** Caller-provided contributors derived from upstream domain signals */
  contributors: Contributor[];
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOLVER OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface ResolverOutput {
  payload: ISEPayload;
  /** True if mental wellbeing safety override fired (priority 0) */
  safety_override_fired: boolean;
  /** Priority chain decision (null if safety override fired) */
  priority_decision: PriorityChainOutput | null;
  /** Snapshot of all 6 signals + voice for audit log */
  signal_snapshot: ISESignalSnapshot;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN RESOLVER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function resolve(inputs: ResolverInputs): ResolverOutput {
  // ─────────────────────────────────────────────────────────────────────────
  // PRIORITY 0: Mental Wellbeing Safety Override (G6)
  // ─────────────────────────────────────────────────────────────────────────
  const active_trigger = findActiveSafetyOverride(inputs.active_safety_triggers);

  if (active_trigger !== null) {
    const safety_payload = buildSafetyOverridePayload(active_trigger);
    const empty_snapshot = buildEmptySignalSnapshot();
    return {
      payload: safety_payload,
      safety_override_fired: true,
      priority_decision: null,
      signal_snapshot: empty_snapshot
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EVALUATE 6 SIGNALS (+ Signal 7 stub)
  // ─────────────────────────────────────────────────────────────────────────
  const signal_1 = evaluateSignal1Governance(inputs.signal_1_inputs);
  const signal_2 = evaluateSignal2DataFreshness(inputs.signal_2_inputs);
  const signal_3 = evaluateSignal3CognitiveLoad(inputs.signal_3_inputs);
  const signal_4 = evaluateSignal4HealthStatus(inputs.signal_4_inputs);
  const signal_5 = evaluateSignal5Engagement(inputs.signal_5_inputs);
  const signal_6 = evaluateSignal6Trajectory(inputs.signal_6_inputs);
  const _signal_7 = evaluateSignal7Voice(inputs.signal_7_inputs);
  // signal_7 result currently unused (Phase 1 — voice does not contribute)
  void _signal_7;

  // ─────────────────────────────────────────────────────────────────────────
  // PRIORITY CHAIN
  // 
  // ⚠️ AUDIT 2026-05-03 — CHANGED FEED SHAPE
  // 
  // Pre-audit: priority chain consumed signal evaluator outputs (signal_1,
  // signal_2, ...) with derived `favors_*` booleans.
  // Post-audit: priority chain consumes raw fields per canon §7 input contract.
  // We extract the raw fields from signal evaluator outputs here and pass them
  // through. Signal evaluator outputs are still used for the audit snapshot.
  // ─────────────────────────────────────────────────────────────────────────
  const priority_decision = evaluatePriorityChain({
    governance_flag: signal_1.governance_flag,
    data_freshness_hours: signal_2.hours_since_most_recent,
    onboarding_days: inputs.days_since_d0,
    pli_count: signal_3.pli_count,
    space_state: signal_3.space_state,
    composites_in_orange: signal_4.composites_in_orange,
    composites_in_red: signal_4.composites_in_red,
    any_presignal_active: signal_4.any_presignal_active,
    fsi_trend: signal_5.fsi_trend,
    ori_7d: signal_5.ori_7d,
    mood_slope: signal_6.mood_slope,
    effort_slope: signal_6.effort_slope
  });

  // ─────────────────────────────────────────────────────────────────────────
  // BUILD ISEPayload from defaults + decision
  // ─────────────────────────────────────────────────────────────────────────
  const payload = buildPayloadFromState(
    priority_decision.resolved_state,
    priority_decision.reason_codes,
    inputs.contributors,
    signal_1.governance_flag
  );

  // ─────────────────────────────────────────────────────────────────────────
  // BUILD SIGNAL SNAPSHOT for audit
  // ─────────────────────────────────────────────────────────────────────────
  const signal_snapshot: ISESignalSnapshot = {
    governance_flag: signal_1.governance_flag,
    data_freshness_hours: signal_2.hours_since_most_recent,
    onboarding_days: inputs.days_since_d0,
    pli_count: signal_3.pli_count,
    space_state: signal_3.space_state,
    composites_in_orange: signal_4.composites_in_orange,
    composites_in_red: signal_4.composites_in_red,
    any_presignal_active: signal_4.any_presignal_active,
    slot_drift_count_24h: signal_4.slot_drift_count_24h,
    fsi_trend: signal_5.fsi_trend,
    ori_7d: signal_5.ori_7d,
    mood_slope: signal_6.mood_slope,
    effort_slope: signal_6.effort_slope
  };

  return {
    payload,
    safety_override_fired: false,
    priority_decision,
    signal_snapshot
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD PAYLOAD FROM STATE
// 
// Combines ISE_DEFAULTS with state-specific reason codes and contributors.
// Truncates to canonical max sizes (PAC-ISE-001 §6).
// ─────────────────────────────────────────────────────────────────────────────

function buildPayloadFromState(
  state: ISEState,
  reason_codes: string[],
  contributors: Contributor[],
  governance_active: boolean
): ISEPayload {
  const defaults = lookupISEDefaults(state);

  const payload: ISEPayload = {
    version: 'v1.0A',
    generatedAt: new Date().toISOString(),
    state,
    reasonCodes: reason_codes.slice(0, MAX_REASON_CODES_PER_PAYLOAD),
    contributors: contributors.slice(0, MAX_CONTRIBUTORS_PER_PAYLOAD),
    render: defaults.render,
    cta: defaults.cta,
    ollie: defaults.ollie
  };

  // Governance block populated for ISE-5 OR when governance_active flag is true
  if (state === ISEState.ISE_5_RESTRICTED_GUARDED || governance_active) {
    payload.governance = {
      isClinicalRouted: state === ISEState.ISE_5_RESTRICTED_GUARDED,
      visibility: state === ISEState.ISE_5_RESTRICTED_GUARDED ? 'cpie' : 'dual',
      redactionLevel: state === ISEState.ISE_5_RESTRICTED_GUARDED ? 'strict' : 'light'
    };
  }

  return payload;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY SIGNAL SNAPSHOT (used when safety override fires)
// ─────────────────────────────────────────────────────────────────────────────

function buildEmptySignalSnapshot(): ISESignalSnapshot {
  return {
    governance_flag: false,
    data_freshness_hours: 0,
    onboarding_days: 0,
    pli_count: 0,
    space_state: null,
    composites_in_orange: 0,
    composites_in_red: 0,
    any_presignal_active: false,
    slot_drift_count_24h: 0,
    fsi_trend: 'stable',
    ori_7d: 0,
    mood_slope: 0,
    effort_slope: 0
  };
}
