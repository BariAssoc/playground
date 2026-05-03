/**
 * FALLBACK PAYLOAD — Frontend-side ISE-0 fallback
 * 
 * Source canon:
 *   - PAC-ISE-005 v1.0A §9 (error handling and fallback)
 *   - PAC-ISE-001 v1.0A §5 (ISE_DEFAULTS lookup)
 * 
 * If the API call to /v1/identity/ise fails OR returns a malformed payload,
 * the frontend MUST render with this fallback. Patient never sees an empty
 * or error state — always a valid (if neutral) ISE-0 view.
 */

import type { ISEPayload } from '../types/ise.js';
import { ISEState } from '../types/ise.js';
import { lookupISEDefaults } from '../payload/ise-defaults.js';

// ─────────────────────────────────────────────────────────────────────────────
// BUILD FALLBACK ISEPayload
// 
// Pure function. No I/O. Safe to call synchronously during render.
// ─────────────────────────────────────────────────────────────────────────────

export function getFallbackISEPayload(): ISEPayload {
  const defaults = lookupISEDefaults(ISEState.ISE_0_NEUTRAL_BASELINE);
  return {
    version: 'v1.0A',
    generatedAt: new Date().toISOString(),
    state: ISEState.ISE_0_NEUTRAL_BASELINE,
    reasonCodes: ['FALLBACK_RENDER'],
    contributors: [],
    render: defaults.render,
    cta: defaults.cta,
    ollie: defaults.ollie
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION GUARD — minimal shape check
// 
// Returns true if `payload` looks like a valid ISEPayload.
// Caller uses this before render; failure → render fallback instead.
// ─────────────────────────────────────────────────────────────────────────────

export function isValidISEPayload(payload: unknown): payload is ISEPayload {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Partial<ISEPayload>;
  if (p.version !== 'v1.0A') return false;
  if (typeof p.state !== 'string') return false;
  if (typeof p.generatedAt !== 'string') return false;
  if (!p.render || typeof p.render !== 'object') return false;
  if (!p.cta || typeof p.cta !== 'object') return false;
  if (!p.ollie || typeof p.ollie !== 'object') return false;
  if (!Array.isArray(p.reasonCodes)) return false;
  if (!Array.isArray(p.contributors)) return false;
  return true;
}
