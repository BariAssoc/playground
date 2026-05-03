/**
 * RESOLVER SIGNAL 1 — Governance Override
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §6 Signal 1
 *   - ISE Canon v3.0 §3.1 (Two-Lane Authority — Lane 2 governance)
 *   - PAC-ISE-006 v1.0A §5 (governance-flagged states)
 * 
 * Highest priority signal (after Mental Wellbeing safety override).
 * When governance flag is true, Resolver forces ISE-5 (Restricted/Guarded)
 * regardless of all other signals.
 * 
 * Sources of governance flag:
 *   - Provider-set restriction (clinician portal)
 *   - Compliance flag (audit-detected violation)
 *   - Safety review flag (after mental wellbeing event)
 *   - Manual operator override (Pamela / Val)
 */

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL OUTPUT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface GovernanceSignalOutput {
  governance_flag: boolean;
  governance_source: GovernanceSource | null;
  governance_set_at: string | null; // ISO 8601
  governance_set_by: string | null; // user_id of setter (provider/operator)
}

export type GovernanceSource =
  | 'provider_restriction'
  | 'compliance_flag'
  | 'safety_review_flag'
  | 'operator_override';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL INPUTS — what Resolver passes in
// ─────────────────────────────────────────────────────────────────────────────

export interface GovernanceSignalInputs {
  /**
   * Active governance record from ise-current-state container, or null if none.
   * Provider portal / Pamela console writes governance records to this state.
   */
  active_governance: {
    governance_flag: boolean;
    source: GovernanceSource;
    set_at: string;
    set_by: string;
  } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE SIGNAL 1
// 
// Pure function. No I/O. Inputs come from caller.
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateSignal1Governance(
  inputs: GovernanceSignalInputs
): GovernanceSignalOutput {
  if (inputs.active_governance === null) {
    return {
      governance_flag: false,
      governance_source: null,
      governance_set_at: null,
      governance_set_by: null
    };
  }

  return {
    governance_flag: inputs.active_governance.governance_flag,
    governance_source: inputs.active_governance.source,
    governance_set_at: inputs.active_governance.set_at,
    governance_set_by: inputs.active_governance.set_by
  };
}
