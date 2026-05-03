/**
 * DEVIATION DETECTOR — PAC-ISE-007 §7.2 deviation alerts
 * 
 * Source canon:
 *   - PAC-ISE-007 v1.0B §7.2 (deviation alerts)
 *   - PAC-ISE-007 v1.0B §3 (prohibited capabilities — input source)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (mental wellbeing hard rules)
 * 
 * Inspects AI outputs for:
 *   1. Violations of per-state behavioral boundaries (cadence/voice/template mismatch)
 *   2. Prohibited content patterns (P-001 through P-008-MW)
 * 
 * Emits AIDeviationAlert records for downstream alerting + audit.
 */

import { ISEState } from '../types/ise.js';
import type { OllieCadence, VoiceStyle } from '../types/ise.js';
import type { AIDeviationAlert, AuditSeverity } from '../types/audit.js';
import {
  isCadencePermitted,
  isVoiceStylePermitted,
  isTemplateKeyPermitted
} from './ai-boundaries.js';
import {
  PROHIBITED_CAPABILITIES,
  type AIAgent,
  type Prohibition
} from './prohibited-capabilities.js';

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 1 — STATE BOUNDARY DEVIATION
// ─────────────────────────────────────────────────────────────────────────────

export interface BoundaryCheckInput {
  ise_state: ISEState;
  cadence_used: OllieCadence;
  voice_style_used: VoiceStyle;
  template_key_used: string;
}

export interface BoundaryCheckResult {
  is_compliant: boolean;
  cadence_ok: boolean;
  voice_style_ok: boolean;
  template_key_ok: boolean;
  violations: string[];
}

export function checkStateBoundaryCompliance(
  input: BoundaryCheckInput
): BoundaryCheckResult {
  const cadence_ok = isCadencePermitted(input.ise_state, input.cadence_used);
  const voice_style_ok = isVoiceStylePermitted(input.ise_state, input.voice_style_used);
  const template_key_ok = isTemplateKeyPermitted(input.ise_state, input.template_key_used);

  const violations: string[] = [];
  if (!cadence_ok) {
    violations.push(`Cadence "${input.cadence_used}" not permitted in state ${input.ise_state}`);
  }
  if (!voice_style_ok) {
    violations.push(`Voice style "${input.voice_style_used}" not permitted in state ${input.ise_state}`);
  }
  if (!template_key_ok) {
    violations.push(`Template key "${input.template_key_used}" not permitted in state ${input.ise_state}`);
  }

  return {
    is_compliant: cadence_ok && voice_style_ok && template_key_ok,
    cadence_ok,
    voice_style_ok,
    template_key_ok,
    violations
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2 — PROHIBITED CONTENT PATTERN MATCH
// ─────────────────────────────────────────────────────────────────────────────

export interface ProhibitionCheckInput {
  agent: AIAgent;
  output_text: string;
}

export interface ProhibitionCheckResult {
  is_compliant: boolean;
  violated_prohibitions: ReadonlyArray<{
    prohibition: Prohibition;
    matched_pattern: string;
  }>;
}

export function checkProhibitionPatterns(
  input: ProhibitionCheckInput
): ProhibitionCheckResult {
  const lower = input.output_text.toLowerCase();
  const violations: Array<{ prohibition: Prohibition; matched_pattern: string }> = [];

  for (const prohibition of PROHIBITED_CAPABILITIES) {
    if (!prohibition.applies_to.includes(input.agent)) continue;
    for (const pattern of prohibition.violation_patterns) {
      if (lower.includes(pattern.toLowerCase())) {
        violations.push({ prohibition, matched_pattern: pattern });
        // Continue scanning — multiple patterns may match
      }
    }
  }

  return {
    is_compliant: violations.length === 0,
    violated_prohibitions: violations
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED DEVIATION CHECK — produces AIDeviationAlert if any violation
// ─────────────────────────────────────────────────────────────────────────────

export interface FullDeviationCheckInput {
  agent: AIAgent;
  ise_state: ISEState;
  cadence_used: OllieCadence;
  voice_style_used: VoiceStyle;
  template_key_used: string;
  output_text: string;
}

export interface FullDeviationCheckResult {
  is_compliant: boolean;
  alerts: ReadonlyArray<AIDeviationAlert>;
}

export function checkForDeviations(
  input: FullDeviationCheckInput
): FullDeviationCheckResult {
  const alerts: AIDeviationAlert[] = [];
  const now = new Date().toISOString();

  // Check 1: state boundary compliance
  const boundary = checkStateBoundaryCompliance(input);
  if (!boundary.is_compliant) {
    for (const violation of boundary.violations) {
      alerts.push({
        alert_id: crypto.randomUUID(),
        alertType: 'AI_ISE_DEVIATION',
        severity: 'high',
        iseStateExpected: input.ise_state,
        behaviorObserved: violation,
        templateKeyExpected: '(any permitted for state)',
        templateKeyUsed: input.template_key_used,
        actionRequired: 'Review AI agent prompt/template alignment with state boundaries.',
        detected_at: now
      });
    }
  }

  // Check 2: prohibited content patterns
  const prohibition = checkProhibitionPatterns({
    agent: input.agent,
    output_text: input.output_text
  });
  if (!prohibition.is_compliant) {
    for (const v of prohibition.violated_prohibitions) {
      const severity: AuditSeverity =
        v.prohibition.severity === 'critical' ? 'critical' : 'high';
      alerts.push({
        alert_id: crypto.randomUUID(),
        alertType: 'AI_ISE_DEVIATION',
        severity,
        iseStateExpected: input.ise_state,
        behaviorObserved: `Prohibition ${v.prohibition.id} violated: ${v.prohibition.description}. Matched pattern: "${v.matched_pattern}".`,
        templateKeyExpected: '(prohibited content not allowed in any template)',
        templateKeyUsed: input.template_key_used,
        actionRequired: `Refer to ${v.prohibition.source_canon}. Suppress output and notify operator.`,
        detected_at: now
      });
    }
  }

  return {
    is_compliant: alerts.length === 0,
    alerts
  };
}
