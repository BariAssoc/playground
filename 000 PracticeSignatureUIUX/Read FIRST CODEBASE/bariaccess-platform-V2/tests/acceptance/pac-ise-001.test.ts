/**
 * PAC-ISE-001 ACCEPTANCE TESTS
 * 
 * Source canon: PAC-ISE-001 v1.0A §8 (acceptance tests)
 * 
 * Validates:
 *   - All 7 ISE states have ISE_DEFAULTS entries
 *   - Each entry has valid render/cta/ollie shapes
 *   - Fallback returns ISE-0 defaults
 */

import { describe, it, expect } from '@jest/globals';
import { ISEState } from '../../src/types/ise.js';
import {
  ISE_DEFAULTS,
  lookupISEDefaults,
  getFallbackDefaults,
  FALLBACK_STATE
} from '../../src/payload/ise-defaults.js';

describe('PAC-ISE-001 §8 — ISEPayload Defaults Acceptance', () => {
  it('All 7 ISE states have a default entry', () => {
    const states = Object.values(ISEState);
    expect(states.length).toBe(7);
    for (const state of states) {
      expect(ISE_DEFAULTS[state]).toBeDefined();
    }
  });

  it('Every default entry has render.identityIcon with all 4 token dimensions', () => {
    for (const state of Object.values(ISEState)) {
      const entry = ISE_DEFAULTS[state];
      expect(entry.render.identityIcon.posture).toBeDefined();
      expect(entry.render.identityIcon.saturation).toBeDefined();
      expect(entry.render.identityIcon.motion).toBeDefined();
      expect(entry.render.identityIcon.overlay).toBeDefined();
    }
  });

  it('Every default entry has cta with mode + maxVisible + orderingBias', () => {
    for (const state of Object.values(ISEState)) {
      const entry = ISE_DEFAULTS[state];
      expect(entry.cta.mode).toBeDefined();
      expect(entry.cta.maxVisible).toBeGreaterThan(0);
      expect(entry.cta.maxVisible).toBeLessThanOrEqual(8);
      expect(entry.cta.orderingBias).toBeDefined();
    }
  });

  it('Every default entry has ollie with cadence + density + voiceStyle + at least 1 templateKey', () => {
    for (const state of Object.values(ISEState)) {
      const entry = ISE_DEFAULTS[state];
      expect(entry.ollie.cadence).toBeDefined();
      expect(entry.ollie.promptDensity).toBeDefined();
      expect(entry.ollie.voiceStyle).toBeDefined();
      expect(entry.ollie.templateKeys.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('lookupISEDefaults returns deep-cloned entry (caller cannot mutate canonical data)', () => {
    const a = lookupISEDefaults(ISEState.ISE_0_NEUTRAL_BASELINE);
    const b = lookupISEDefaults(ISEState.ISE_0_NEUTRAL_BASELINE);
    expect(a).not.toBe(b); // different object identities
    expect(a).toEqual(b); // but equal contents
  });

  it('FALLBACK_STATE is ISE-0 (Neutral Baseline)', () => {
    expect(FALLBACK_STATE).toBe(ISEState.ISE_0_NEUTRAL_BASELINE);
  });

  it('getFallbackDefaults returns the ISE-0 entry', () => {
    const fallback = getFallbackDefaults();
    const ise0 = lookupISEDefaults(ISEState.ISE_0_NEUTRAL_BASELINE);
    expect(fallback).toEqual(ise0);
  });

  it('ISE-5 default has shieldLock overlay (governance-flagged)', () => {
    const ise5 = lookupISEDefaults(ISEState.ISE_5_RESTRICTED_GUARDED);
    expect(ise5.render.identityIcon.overlay).toBe('shieldLock');
    expect(ise5.cta.mode).toBe('restricted');
    expect(ise5.cta.maxVisible).toBe(1);
  });

  it('ISE-3 default constrains to 1 CTA (Contained/Load-Limited)', () => {
    const ise3 = lookupISEDefaults(ISEState.ISE_3_CONTAINED_LOAD_LIMITED);
    expect(ise3.cta.maxVisible).toBe(1);
    expect(ise3.cta.orderingBias).toBe('oneNextStep');
  });
});
