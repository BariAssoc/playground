/**
 * AUDIT — Compliance audit log types
 * 
 * Source canon:
 *   - PAC-ISE-004 v1.0A §3.2 (ISE transition log — append-only)
 *   - PAC-ISE-006 v1.0A §8 (audit trail requirements)
 *   - PAC-ISE-007 v1.0B §7 (compliance logging — every AI interaction)
 *   - PAC-ISE-007 v1.0B §7.2 (deviation alerts)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §6.2 (Journal access audit)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §5.5 (mental wellbeing audit — severity:critical)
 * 
 * This file defines TYPES ONLY.
 */

import type { ISEState, GovernanceBlock } from './ise.js';
import type { InterfaceLayer, RequesterRole } from './journal.js';

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT SEVERITY LEVELS
// ─────────────────────────────────────────────────────────────────────────────

export type AuditSeverity = 'info' | 'warn' | 'high' | 'critical';

// ─────────────────────────────────────────────────────────────────────────────
// ISE TRANSITION LOG ENTRY (PAC-ISE-004 §3.2)
// Append-only, partition `/userId`, TTL 365 days
// ─────────────────────────────────────────────────────────────────────────────

export type ResolverTriggerSource = 'scheduled' | 'manual' | 'event';

export interface ISESignalSnapshot {
  // From PAC-ISE-002 v2.0 §6 (6 signals) + G3 (slot_drift_count_24h) + G6 (voice deferred)
  governance_flag: boolean;
  data_freshness_hours: number;
  onboarding_days: number;
  pli_count: number;
  space_state: 'protected' | 'challenging' | 'vulnerable' | null;
  composites_in_orange: number;
  composites_in_red: number;
  any_presignal_active: boolean;
  slot_drift_count_24h: number; // G3 §3 addition
  fsi_trend: 'rising' | 'stable' | 'declining';
  ori_7d: number;
  mood_slope: number;
  effort_slope: number;
}

export interface ISETransitionLogEntry {
  id: string; // GUID
  userId: string; // partition key
  version: 'v1.0A';
  transitionId: string;

  previousState: ISEState | null; // null if first
  newState: ISEState;
  transitionAt: string; // ISO 8601
  durationInPreviousState: number | null; // seconds

  reasonCodes: string[];
  contributorSummary: Array<{ domain: string; direction: string }>;

  triggerSource: ResolverTriggerSource;
  governanceApplied: boolean;
  redactionLevel: 'none' | 'light' | 'strict';

  // G2 + G3 + G6 — signal snapshot for audit + threshold calibration
  signals?: ISESignalSnapshot;

  // G6 §5.5 — mental wellbeing override gets severity:critical
  severity: AuditSeverity;

  _ts?: number;
  _ttl?: number; // Cosmos TTL — default 31536000 (365 days)
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL ACCESS AUDIT (G5 §8)
// Every journal endpoint access logged
// ─────────────────────────────────────────────────────────────────────────────

export interface JournalAccessAuditEntry {
  audit_id: string;
  entry_id: string;
  userId: string; // patient whose journal was accessed
  accessed_at: string;
  requesting_user_id: string;
  requester_role: RequesterRole;
  interface: InterfaceLayer;
  redaction_applied: boolean;
  fields_redacted: string[];
  severity: AuditSeverity;
  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI INTERACTION AUDIT (PAC-ISE-007 §7)
// Every AI response logged with state and compliance status
// ─────────────────────────────────────────────────────────────────────────────

export interface AIInteractionAuditEntry {
  interaction_id: string;
  userId: string;
  agent: 'ollie' | 'askaba_max' | 'morpheus';
  agent_version: string;
  iseStateAtInteraction: ISEState;
  templateKeyUsed: string;
  cadenceUsed: string;
  voiceStyleUsed: string;
  outputCompliant: boolean;
  escalationTriggered: boolean;
  governanceBlock?: GovernanceBlock;
  timestamp: string;
  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI DEVIATION ALERT (PAC-ISE-007 §7.2)
// Fired when AI output doesn't match expected state behavior
// ─────────────────────────────────────────────────────────────────────────────

export interface AIDeviationAlert {
  alert_id: string;
  alertType: 'AI_ISE_DEVIATION';
  severity: AuditSeverity;
  iseStateExpected: ISEState;
  behaviorObserved: string;
  templateKeyExpected: string;
  templateKeyUsed: string;
  actionRequired: string;
  detected_at: string;
  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE UNLOCK AUDIT (G2 §4.2)
// Composite transition: accruing → live
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeUnlockAuditEntry {
  audit_id: string;
  userId: string;
  composite_name: string; // CompositeName
  unlocked_at: string;
  unlock_trigger_met: string; // human-readable
  initial_score_0_100: number;
  initial_band: number;
  celebration_rendered: boolean;
  _ts?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT EVENT UNION — top-level audit feed
// ─────────────────────────────────────────────────────────────────────────────

export type AuditEvent =
  | { type: 'ise_transition'; entry: ISETransitionLogEntry }
  | { type: 'journal_access'; entry: JournalAccessAuditEntry }
  | { type: 'ai_interaction'; entry: AIInteractionAuditEntry }
  | { type: 'ai_deviation'; entry: AIDeviationAlert }
  | { type: 'composite_unlock'; entry: CompositeUnlockAuditEntry };
