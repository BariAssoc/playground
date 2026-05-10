/**
 * BariAccess Lite — ISE Weight Modulator (Lane 1 Read-Only)
 *
 * Source: ISE_Canon_v3_0_Canonical.md §3.1 Two-Lane Authority
 *         + DECISIONS.md §12
 *
 * Lite ships ISE-1 (Aligned/Available) defaults regardless of resolved state,
 * and logs `ise_modulation_skipped: true` when state ≠ ISE-1. Vault tables
 * (TS-002–TS-010) drop in here without code change.
 */

import type { ISEState } from '@bariaccess-lite/shared';

export interface ISEModulationContext {
  resolved_state: ISEState;
  /** True if Lite skipped applying state-specific weights. */
  modulation_skipped: boolean;
  /** Reason logged for audit. */
  skip_reason?: string;
}

/**
 * Resolve the active weight set for an ISE state.
 * Lite v1: always returns the canonical ISE-1 weight set
 * (the master RR_WEIGHTS, etc., already imported by composites).
 *
 * When the vault tables ship, this function loads the state-specific
 * tables. Until then, downstream composites use master tables.
 */
export function resolveISEWeights(state: ISEState): ISEModulationContext {
  if (state === 'ISE_1_ALIGNED_AVAILABLE') {
    return { resolved_state: state, modulation_skipped: false };
  }
  return {
    resolved_state: state,
    modulation_skipped: true,
    skip_reason: `Vault weight tables not loaded in Lite v1; using ISE-1 defaults for ${state}`,
  };
}

/**
 * Read ISE state for a user from the ise-current-state container.
 * Per PAC-ISE-004 — single doc per user with state, computed_at, evidence.
 */
export interface ISEStateDoc {
  user_id: string;
  state: ISEState;
  computed_at: string;
  evidence?: Record<string, unknown>;
}

export interface ISEStateReader {
  getCurrentState(user_id: string): Promise<ISEStateDoc | null>;
}

const DEFAULT_FALLBACK: ISEState = 'ISE_1_ALIGNED_AVAILABLE';

export async function readISEStateOrDefault(
  reader: ISEStateReader,
  user_id: string
): Promise<{ state: ISEState; from_default: boolean }> {
  const doc = await reader.getCurrentState(user_id);
  if (doc) return { state: doc.state, from_default: false };
  return { state: DEFAULT_FALLBACK, from_default: true };
}
