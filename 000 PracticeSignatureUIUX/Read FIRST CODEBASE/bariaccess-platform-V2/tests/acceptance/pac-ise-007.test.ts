/**
 * PAC-ISE-007 ACCEPTANCE TESTS
 * 
 * Source canon: PAC-ISE-007 v1.0B §11 (acceptance tests)
 * 
 * Validates:
 *   - Per-state behavioral boundaries enforced
 *   - Prohibited capability patterns detected
 *   - Deviation detector emits alerts on violation
 *   - Mental Wellbeing hard rules represented
 */

import { describe, it, expect } from '@jest/globals';
import { ISEState } from '../../src/types/ise.js';
import {
  STATE_BOUNDARIES,
  isCadencePermitted,
  isVoiceStylePermitted,
  isTemplateKeyPermitted
} from '../../src/governance/ai-boundaries.js';
import {
  PROHIBITED_CAPABILITIES,
  getProhibitionsForAgent,
  getCriticalProhibitions
} from '../../src/governance/prohibited-capabilities.js';
import {
  checkStateBoundaryCompliance,
  checkProhibitionPatterns,
  checkForDeviations
} from '../../src/governance/deviation-detector.js';

describe('PAC-ISE-007 §11 — AI Governance Acceptance', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // STATE BOUNDARIES
  // ───────────────────────────────────────────────────────────────────────────
  describe('State boundaries (§4)', () => {
    it('All 7 ISE states have boundary definitions', () => {
      for (const state of Object.values(ISEState)) {
        expect(STATE_BOUNDARIES[state]).toBeDefined();
      }
    });

    it('ISE-3 only permits "minimal" cadence (load-limited)', () => {
      const boundary = STATE_BOUNDARIES[ISEState.ISE_3_CONTAINED_LOAD_LIMITED];
      expect(boundary.permitted_cadences).toEqual(['minimal']);
    });

    it('ISE-5 permits ISE5_SAFETY_CHECKIN template (G6 §5.5)', () => {
      const boundary = STATE_BOUNDARIES[ISEState.ISE_5_RESTRICTED_GUARDED];
      expect(boundary.permitted_template_keys).toContain('ISE5_SAFETY_CHECKIN');
    });

    it('isCadencePermitted: forward cadence rejected in ISE-2', () => {
      expect(isCadencePermitted(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD, 'forward')).toBe(false);
      expect(isCadencePermitted(ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD, 'slow')).toBe(true);
    });

    it('isVoiceStylePermitted: encouragingNeutral rejected in ISE-5', () => {
      expect(isVoiceStylePermitted(ISEState.ISE_5_RESTRICTED_GUARDED, 'encouragingNeutral')).toBe(false);
      expect(isVoiceStylePermitted(ISEState.ISE_5_RESTRICTED_GUARDED, 'governanceNeutral')).toBe(true);
    });

    it('isTemplateKeyPermitted: ISE0_INFO permitted only in ISE-0', () => {
      expect(isTemplateKeyPermitted(ISEState.ISE_0_NEUTRAL_BASELINE, 'ISE0_INFO')).toBe(true);
      expect(isTemplateKeyPermitted(ISEState.ISE_4_BUILDING_MOMENTUM, 'ISE0_INFO')).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // PROHIBITED CAPABILITIES
  // ───────────────────────────────────────────────────────────────────────────
  describe('Prohibited capabilities (§3)', () => {
    it('At least 8 prohibitions defined (§3.1-§3.4 + 4 G6 hard rules)', () => {
      expect(PROHIBITED_CAPABILITIES.length).toBeGreaterThanOrEqual(8);
    });

    it('G6 mental wellbeing prohibitions (P-004-MW..P-007-MW) all critical', () => {
      const mw_prohibitions = PROHIBITED_CAPABILITIES.filter((p) => p.id.endsWith('-MW'));
      expect(mw_prohibitions.length).toBeGreaterThanOrEqual(4);
      for (const p of mw_prohibitions) {
        expect(p.severity).toBe('critical');
      }
    });

    it('getProhibitionsForAgent("ollie") returns Ollie-applicable rules', () => {
      const ollie_prohibitions = getProhibitionsForAgent('ollie');
      expect(ollie_prohibitions.length).toBeGreaterThan(0);
      for (const p of ollie_prohibitions) {
        expect(p.applies_to).toContain('ollie');
      }
    });

    it('getCriticalProhibitions returns all severity:critical entries', () => {
      const critical = getCriticalProhibitions();
      expect(critical.length).toBeGreaterThan(0);
      for (const p of critical) {
        expect(p.severity).toBe('critical');
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // DEVIATION DETECTOR
  // ───────────────────────────────────────────────────────────────────────────
  describe('Deviation detector (§7.2)', () => {
    it('checkStateBoundaryCompliance flags forward cadence in ISE-2', () => {
      const result = checkStateBoundaryCompliance({
        ise_state: ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD,
        cadence_used: 'forward',
        voice_style_used: 'protective',
        template_key_used: 'ISE2_PROTECT'
      });
      expect(result.is_compliant).toBe(false);
      expect(result.cadence_ok).toBe(false);
    });

    it('checkProhibitionPatterns detects "you have" diagnosis pattern', () => {
      const result = checkProhibitionPatterns({
        agent: 'ollie',
        output_text: 'Based on your numbers, you have insulin resistance.'
      });
      expect(result.is_compliant).toBe(false);
      expect(result.violated_prohibitions.length).toBeGreaterThan(0);
    });

    it('checkProhibitionPatterns detects "you\'re going to be okay" false reassurance', () => {
      const result = checkProhibitionPatterns({
        agent: 'ollie',
        output_text: "You're going to be okay. Try to relax."
      });
      expect(result.is_compliant).toBe(false);
      // Should match P-006-MW (false reassurance) and P-005-MW (crisis counseling)
      const violated_ids = result.violated_prohibitions.map((v) => v.prohibition.id);
      expect(violated_ids).toContain('P-006-MW');
    });

    it('checkProhibitionPatterns detects diagnostic language in safety context', () => {
      const result = checkProhibitionPatterns({
        agent: 'ollie',
        output_text: 'I notice you might be experiencing suicidal ideation.'
      });
      expect(result.is_compliant).toBe(false);
      const violated_ids = result.violated_prohibitions.map((v) => v.prohibition.id);
      expect(violated_ids).toContain('P-007-MW');
    });

    it('checkForDeviations returns multiple alerts when both checks fail', () => {
      const result = checkForDeviations({
        agent: 'ollie',
        ise_state: ISEState.ISE_5_RESTRICTED_GUARDED,
        cadence_used: 'forward', // boundary violation
        voice_style_used: 'encouragingNeutral', // boundary violation
        template_key_used: 'ISE5_GUIDANCE_ONLY',
        output_text: "You're going to be okay." // prohibition violation
      });
      expect(result.is_compliant).toBe(false);
      expect(result.alerts.length).toBeGreaterThanOrEqual(3);
    });

    it('Compliant safety check-in produces no alerts', () => {
      const result = checkForDeviations({
        agent: 'ollie',
        ise_state: ISEState.ISE_5_RESTRICTED_GUARDED,
        cadence_used: 'strictNeutral',
        voice_style_used: 'protective',
        template_key_used: 'ISE5_SAFETY_CHECKIN',
        output_text: "I'm here. Are you safe right now?"
      });
      expect(result.is_compliant).toBe(true);
      expect(result.alerts.length).toBe(0);
    });
  });
});
