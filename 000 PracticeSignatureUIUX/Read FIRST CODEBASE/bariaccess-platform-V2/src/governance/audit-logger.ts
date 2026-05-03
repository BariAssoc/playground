/**
 * AUDIT LOGGER — PAC-ISE-007 §7 every-interaction compliance logging
 * 
 * Source canon:
 *   - PAC-ISE-007 v1.0B §7 (compliance logging — every AI interaction)
 *   - PAC-ISE-007 v1.0B §7.2 (deviation alerts)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §6.2 (journal access audit)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.5 (severity:critical for safety)
 * 
 * Constructs audit records for downstream persistence. The actual write to
 * Cosmos `ise-transition-log` (or other audit containers) is performed by the
 * caller; this module is the canonical builder for audit entry shapes.
 */

import { ISEState } from '../types/ise.js';
import type { GovernanceBlock } from '../types/ise.js';
import type {
  ISETransitionLogEntry,
  ISESignalSnapshot,
  AIInteractionAuditEntry,
  JournalAccessAuditEntry,
  CompositeUnlockAuditEntry,
  AuditSeverity,
  AuditEvent,
  ResolverTriggerSource
} from '../types/audit.js';
import type { InterfaceLayer, RequesterRole } from '../types/journal.js';
import {
  isCadencePermitted,
  isVoiceStylePermitted,
  isTemplateKeyPermitted
} from './ai-boundaries.js';

// ─────────────────────────────────────────────────────────────────────────────
// ISE TRANSITION AUDIT (PAC-ISE-004 §3.2 + G6 severity)
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildISETransitionAuditParams {
  userId: string;
  previous_state: ISEState | null;
  new_state: ISEState;
  duration_in_previous_state_sec: number | null;
  reason_codes: string[];
  contributor_summary: Array<{ domain: string; direction: string }>;
  trigger_source: ResolverTriggerSource;
  governance_applied: boolean;
  redaction_level: 'none' | 'light' | 'strict';
  signals: ISESignalSnapshot;
  /**
   * G6 §5.5: severity:critical for mental wellbeing override events.
   * Default: 'info'.
   */
  severity?: AuditSeverity;
}

export function buildISETransitionAudit(
  params: BuildISETransitionAuditParams
): ISETransitionLogEntry {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    version: 'v1.0A',
    transitionId: crypto.randomUUID(),
    previousState: params.previous_state,
    newState: params.new_state,
    transitionAt: new Date().toISOString(),
    durationInPreviousState: params.duration_in_previous_state_sec,
    reasonCodes: params.reason_codes,
    contributorSummary: params.contributor_summary,
    triggerSource: params.trigger_source,
    governanceApplied: params.governance_applied,
    redactionLevel: params.redaction_level,
    signals: params.signals,
    severity: params.severity ?? 'info'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI INTERACTION AUDIT (PAC-ISE-007 §7)
// 
// Every AI response is logged with state, template key, cadence, voice style,
// and a compliance-check result. If the AI output violated state boundaries,
// `outputCompliant` is false and `escalationTriggered` may be set.
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildAIInteractionAuditParams {
  userId: string;
  agent: 'ollie' | 'askaba_max' | 'morpheus';
  agent_version: string;
  ise_state: ISEState;
  template_key_used: string;
  cadence_used: string;
  voice_style_used: string;
  governance_block?: GovernanceBlock;
}

export function buildAIInteractionAudit(
  params: BuildAIInteractionAuditParams
): AIInteractionAuditEntry {
  // Validate against per-state boundaries
  const cadence_ok = isCadencePermitted(
    params.ise_state,
    params.cadence_used as never // type narrowed at boundary
  );
  const voice_ok = isVoiceStylePermitted(
    params.ise_state,
    params.voice_style_used as never
  );
  const template_ok = isTemplateKeyPermitted(
    params.ise_state,
    params.template_key_used
  );
  const output_compliant = cadence_ok && voice_ok && template_ok;

  return {
    interaction_id: crypto.randomUUID(),
    userId: params.userId,
    agent: params.agent,
    agent_version: params.agent_version,
    iseStateAtInteraction: params.ise_state,
    templateKeyUsed: params.template_key_used,
    cadenceUsed: params.cadence_used,
    voiceStyleUsed: params.voice_style_used,
    outputCompliant: output_compliant,
    escalationTriggered: !output_compliant,
    ...(params.governance_block ? { governanceBlock: params.governance_block } : {}),
    timestamp: new Date().toISOString()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL ACCESS AUDIT (G5 §6.2)
// 
// Every journal endpoint access logged with redaction status.
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildJournalAccessAuditParams {
  entry_id: string;
  userId: string;
  requesting_user_id: string;
  requester_role: RequesterRole;
  interface_layer: InterfaceLayer;
  redaction_applied: boolean;
  fields_redacted: string[];
}

export function buildJournalAccessAudit(
  params: BuildJournalAccessAuditParams
): JournalAccessAuditEntry {
  // Severity escalates if a non-patient role accesses without redaction in a
  // patient-owned context, OR if the same patient is accessed by another patient
  // (would indicate a serious bug).
  let severity: AuditSeverity = 'info';
  if (
    params.requester_role === 'patient' &&
    params.requesting_user_id !== params.userId
  ) {
    severity = 'critical'; // patient accessing another patient — should be impossible
  } else if (
    params.requester_role === 'clinician' &&
    !params.redaction_applied &&
    params.interface_layer === 'CCIE-interface'
  ) {
    severity = 'high'; // clinician accessing patient interface unredacted — bug
  }

  return {
    audit_id: crypto.randomUUID(),
    entry_id: params.entry_id,
    userId: params.userId,
    accessed_at: new Date().toISOString(),
    requesting_user_id: params.requesting_user_id,
    requester_role: params.requester_role,
    interface: params.interface_layer,
    redaction_applied: params.redaction_applied,
    fields_redacted: params.fields_redacted,
    severity
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE UNLOCK AUDIT (G2 §4.2)
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildCompositeUnlockAuditParams {
  userId: string;
  composite_name: string;
  unlock_trigger_met: string;
  initial_score_0_100: number;
  initial_band: number;
  celebration_rendered: boolean;
}

export function buildCompositeUnlockAudit(
  params: BuildCompositeUnlockAuditParams
): CompositeUnlockAuditEntry {
  return {
    audit_id: crypto.randomUUID(),
    userId: params.userId,
    composite_name: params.composite_name,
    unlocked_at: new Date().toISOString(),
    unlock_trigger_met: params.unlock_trigger_met,
    initial_score_0_100: params.initial_score_0_100,
    initial_band: params.initial_band,
    celebration_rendered: params.celebration_rendered
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT EVENT WRAPPER — discriminated union for downstream router
// ─────────────────────────────────────────────────────────────────────────────

export function wrapTransitionAsEvent(
  entry: ISETransitionLogEntry
): AuditEvent {
  return { type: 'ise_transition', entry };
}

export function wrapAIInteractionAsEvent(
  entry: AIInteractionAuditEntry
): AuditEvent {
  return { type: 'ai_interaction', entry };
}

export function wrapJournalAccessAsEvent(
  entry: JournalAccessAuditEntry
): AuditEvent {
  return { type: 'journal_access', entry };
}

export function wrapCompositeUnlockAsEvent(
  entry: CompositeUnlockAuditEntry
): AuditEvent {
  return { type: 'composite_unlock', entry };
}
