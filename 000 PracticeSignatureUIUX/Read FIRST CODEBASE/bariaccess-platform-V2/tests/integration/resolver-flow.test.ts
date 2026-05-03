/**
 * RESOLVER FLOW INTEGRATION — Mark Reference Scenario E2E (CANON-LITERAL)
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §5 + §10 (priority chain — canon-literal)
 *   - PAC-ISE-001 v1.0A (ISEPayload contract)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) safety override
 * 
 * ⚠️ AUDIT 2026-05-03 — REWRITTEN
 * 
 * Reference patient: Mark = SPG-001 Patient 1
 *   - 52M, 18 months post-RYGB, Core tier, Oura Gen 3, tirzepatide 5mg weekly
 *   - 540 days post-D0
 * 
 * IMPORTANT BEHAVIORAL CHANGE FROM PRE-AUDIT:
 * 
 *   Pre-audit: Mark's "fully aligned + rising signals" baseline resolved to ISE-4
 *   Canon-literal: Mark's "fully aligned + rising signals" baseline resolves to ISE-1
 * 
 *   Why: per canon §5 commentary, "Momentum is intentionally after Aligned to
 *   prevent it from overriding a depleted or misaligned day." A patient who is
 *   simultaneously aligned (CHECK 5 passes) AND has momentum signals (CHECK 6
 *   would pass) is correctly routed to ISE-1 (Aligned), not ISE-4 (Momentum).
 * 
 *   ISE-4 fires when momentum signals are present BUT alignment criteria are
 *   not met — typically a patient just starting to build (rising slopes) but
 *   ORI hasn't reached the 0.5 threshold yet. This is the "early momentum"
 *   pattern, captured in the test "Mark with rising slopes but ORI not yet at
 *   alignment threshold → ISE-4" below.
 */

import { describe, it, expect } from '@jest/globals';
import { resolve, type ResolverInputs } from '../../src/resolver/resolver.js';
import { ISEState } from '../../src/types/ise.js';
import type { Contributor } from '../../src/types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// MARK SCENARIO BUILDER — fully aligned + rising signals
// ─────────────────────────────────────────────────────────────────────────────

function buildMarkInputs(
  overrides: {
    active_safety_triggers?: ResolverInputs['active_safety_triggers'];
    governance_active?: boolean;
    days_since_d0?: number;
    fsi_trend?: 'rising' | 'stable' | 'declining';
    ori_7d?: number;
    composites_in_orange?: number;
    composites_in_red?: number;
    pli_count?: number;
    space_state?: 'protected' | 'challenging' | 'vulnerable';
  } = {}
): ResolverInputs {
  const now = new Date().toISOString();

  const contributors: Contributor[] = [
    { domain: 'biometric', direction: 'up' },
    { domain: 'rhythm', direction: 'stable' },
    { domain: 'behavior', direction: 'up' }
  ];

  return {
    userId: 'mark-spg-001',
    triggerSource: 'scheduled',
    active_safety_triggers: overrides.active_safety_triggers ?? [],
    signal_1_inputs: {
      active_governance: overrides.governance_active
        ? {
            governance_flag: true,
            source: 'provider_restriction',
            set_at: now,
            set_by: 'provider-bariatric-associates'
          }
        : null
    },
    signal_2_inputs: {
      most_recent_data_timestamp: now
    },
    signal_3_inputs: {
      pli_count: overrides.pli_count ?? 2,
      space_state: overrides.space_state ?? 'protected'
    },
    signal_4_inputs: {
      composites_in_orange: overrides.composites_in_orange ?? 0,
      composites_in_red: overrides.composites_in_red ?? 0,
      any_presignal_active: false,
      slot_drift_count_24h: 0
    },
    signal_5_inputs: {
      fsi_7d_current: overrides.fsi_trend === 'declining' ? 0.45 : 0.78,
      fsi_trend: overrides.fsi_trend ?? 'rising',
      ori_7d: overrides.ori_7d ?? 0.82
    },
    signal_6_inputs: {
      mood_normalized_7d: [0.2, 0.32, 0.45, 0.58, 0.7, 0.82, 0.9],
      effort_score_daily_7d: [0.15, 0.28, 0.42, 0.55, 0.68, 0.82, 0.92],
      fsi_trend: overrides.fsi_trend ?? 'rising'
    },
    signal_7_inputs: {
      activation: {
        fireflies_baa_signed: false,
        hipaa_voice_consent_validated_by_counsel: false,
        voice_analysis_model_validated: false,
        threshold_calibration_completed: false
      },
      recent_voice_signals_7d: []
    },
    days_since_d0: overrides.days_since_d0 ?? 540,
    contributors
  };
}

describe('Resolver Flow Integration — Mark Reference Scenario (canon-literal)', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // BASELINE — fully aligned + rising signals → ISE-1 per canon §5/§10
  // ⚠️ AUDIT 2026-05-03 — was: ISE-4 pre-audit
  // ───────────────────────────────────────────────────────────────────────────
  it('Mark baseline (aligned + rising) → ISE-1 ALIGNED (canon §5: aligned wins over momentum)', () => {
    const inputs = buildMarkInputs();
    const result = resolve(inputs);

    expect(result.safety_override_fired).toBe(false);
    expect(result.payload.state).toBe(ISEState.ISE_1_ALIGNED_AVAILABLE);
    expect(result.priority_decision?.selected_by_step).toBe('aligned');
  });

  it('Returned ISEPayload conforms to PAC-ISE-001 v1.0A schema', () => {
    const inputs = buildMarkInputs();
    const result = resolve(inputs);

    expect(result.payload.version).toBe('v1.0A');
    expect(result.payload.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.payload.state).toBeDefined();
    expect(Array.isArray(result.payload.reasonCodes)).toBe(true);
    expect(Array.isArray(result.payload.contributors)).toBe(true);
    expect(result.payload.render.identityIcon).toBeDefined();
    expect(result.payload.cta).toBeDefined();
    expect(result.payload.ollie).toBeDefined();
  });

  it('ISE-1 baseline payload has upright posture (canon ISE-1 defaults)', () => {
    const inputs = buildMarkInputs();
    const result = resolve(inputs);
    const icon = result.payload.render.identityIcon;
    expect(icon.posture).toBe('upright');
    expect(icon.overlay).toBe('none');
  });

  it('ISE-1 baseline has neutral cadence + encouragingNeutral voice', () => {
    const inputs = buildMarkInputs();
    const result = resolve(inputs);
    expect(result.payload.ollie.cadence).toBe('neutral');
    expect(result.payload.ollie.voiceStyle).toBe('encouragingNeutral');
    expect(result.payload.ollie.templateKeys).toContain('ISE1_OFFER_NEXT');
  });

  it('Signal snapshot captures audit-ready state', () => {
    const inputs = buildMarkInputs();
    const result = resolve(inputs);
    expect(result.signal_snapshot.governance_flag).toBe(false);
    expect(result.signal_snapshot.fsi_trend).toBe('rising');
    expect(result.signal_snapshot.ori_7d).toBeCloseTo(0.82, 2);
    expect(result.signal_snapshot.composites_in_orange).toBe(0);
    expect(result.signal_snapshot.composites_in_red).toBe(0);
    expect(result.signal_snapshot.mood_slope).toBeGreaterThan(0);
    expect(result.signal_snapshot.effort_slope).toBeGreaterThan(0);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // ISE-4 BUILDING MOMENTUM — early-momentum pattern
  // (rising signals BUT ORI not yet at alignment threshold)
  // ───────────────────────────────────────────────────────────────────────────
  it('Mark with rising slopes but ORI < 0.5 → ISE-4 (momentum without alignment)', () => {
    // ORI below alignment threshold means CHECK 5 fails on the ori >= 0.5 clause,
    // so CHECK 6 momentum can fire.
    const inputs = buildMarkInputs({ ori_7d: 0.3 });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_4_BUILDING_MOMENTUM);
    expect(result.priority_decision?.selected_by_step).toBe('building_momentum');
    expect(result.payload.ollie.cadence).toBe('forward');
    expect(result.payload.ollie.templateKeys).toContain('ISE4_REINFORCE_RHYTHM');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // STATE TRANSITIONS — variant scenarios per canon §10
  // ───────────────────────────────────────────────────────────────────────────

  it('Mark with declining FSI + low ORI → ISE-2 (canon CHECK 4B engagement collapse)', () => {
    // Need ORI < 0.5 to satisfy CHECK 4B
    const inputs = buildMarkInputs({ fsi_trend: 'declining', ori_7d: 0.3 });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD);
    expect(result.priority_decision?.selected_by_step).toBe('protective_engagement');
  });

  it('Mark with PLI overload + vulnerable space → ISE-3 (canon CHECK 3)', () => {
    // PLI 6 + vulnerable. Avoid conflict pattern 2 (which needs orange=0 + stable):
    // we keep fsi_trend = 'rising' (default) so pattern 2 doesn't match.
    const inputs = buildMarkInputs({ pli_count: 6, space_state: 'vulnerable' });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_3_CONTAINED_LOAD_LIMITED);
    expect(result.priority_decision?.selected_by_step).toBe('cognitive_overload');
  });

  // ⚠️ AUDIT 2026-05-03 — was: red composite → ISE-5. Canon: red + declining → ISE-2
  it('Mark with 1 red composite + declining FSI → ISE-2 (canon CHECK 4A health-in-trouble)', () => {
    const inputs = buildMarkInputs({
      composites_in_red: 1,
      composites_in_orange: 1,
      fsi_trend: 'declining',
      ori_7d: 0.3 // dodge conflict pattern 1
    });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD);
    expect(result.priority_decision?.selected_by_step).toBe('protective_health');
  });

  it('Mark with 1 red composite + rising FSI + high ORI → ISE-6 (canon §9 conflict pattern 1)', () => {
    // Per canon §9 pattern 1: red + rising + high ORI suggests device error
    const inputs = buildMarkInputs({
      composites_in_red: 1,
      composites_in_orange: 1,
      fsi_trend: 'rising',
      ori_7d: 0.85
    });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL);
    expect(result.payload.reasonCodes).toContain('CONFLICTING_SIGNALS');
  });

  // ⚠️ AUDIT 2026-05-03 — was: 'governance_flag' step. Canon: 'governance' step
  it('Governance flag forces ISE-5 regardless of all positive signals', () => {
    const inputs = buildMarkInputs({ governance_active: true });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_5_RESTRICTED_GUARDED);
    expect(result.priority_decision?.selected_by_step).toBe('governance');
    expect(result.payload.governance).toBeDefined();
    expect(result.payload.governance?.isClinicalRouted).toBe(true);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // ONBOARDING — canon §6 Signal 2: onboarding_days < 7 → ISE-6
  // ⚠️ AUDIT 2026-05-03 — was: ISE-0 pre-audit
  // ───────────────────────────────────────────────────────────────────────────
  it('Hypothetical Day 3 patient → ISE-6 (canon onboarding routes to low-signal)', () => {
    const inputs = buildMarkInputs({ days_since_d0: 3 });
    const result = resolve(inputs);
    expect(result.payload.state).toBe(ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL);
    expect(result.priority_decision?.selected_by_step).toBe('low_signal_onboarding');
    expect(result.payload.reasonCodes).toContain('LOW_SIGNAL_ONBOARDING');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // SAFETY OVERRIDE — highest priority (G6, runs before priority chain)
  // ───────────────────────────────────────────────────────────────────────────
  it('Mental Wellbeing trigger forces ISE-5 with shieldLock + safety check-in', () => {
    const inputs = buildMarkInputs({
      active_safety_triggers: [
        {
          trigger_id: 'trig-emergency',
          userId: 'mark-spg-001',
          source: 'patient_text_self_harm',
          detection_at: new Date().toISOString(),
          detection_confidence: 0.9,
          trigger_content_redacted: 'redacted',
          trigger_content_full: 'verbatim',
          immediate_provider_alert: true,
          immediate_988_offer: true,
          pamela_notified_at: null,
          provider_notified_at: null,
          resolved_at: null,
          resolution_type: null,
          patient_response: null
        }
      ]
    });
    const result = resolve(inputs);

    expect(result.safety_override_fired).toBe(true);
    expect(result.payload.state).toBe(ISEState.ISE_5_RESTRICTED_GUARDED);
    expect(result.payload.render.identityIcon.overlay).toBe('shieldLock');
    expect(result.payload.ollie.cadence).toBe('strictNeutral');
    expect(result.payload.ollie.voiceStyle).toBe('protective');
    expect(result.payload.ollie.templateKeys).toContain('ISE5_SAFETY_CHECKIN');
    expect(result.priority_decision).toBeNull();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // PAYLOAD CONTRACT — bounds + truncation
  // ───────────────────────────────────────────────────────────────────────────
  it('Reason codes truncated to ≤10 (PAC-ISE-001 §6)', () => {
    const inputs = buildMarkInputs();
    inputs.contributors = Array.from({ length: 15 }, (_, i) => ({
      domain: i % 2 === 0 ? 'biometric' : 'behavior',
      direction: 'up'
    }));
    const result = resolve(inputs);
    expect(result.payload.contributors.length).toBeLessThanOrEqual(10);
    expect(result.payload.reasonCodes.length).toBeLessThanOrEqual(10);
  });
});
