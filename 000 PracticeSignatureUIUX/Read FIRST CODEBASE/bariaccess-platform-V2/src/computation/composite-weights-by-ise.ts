/**
 * COMPOSITE WEIGHTS BY ISE — Beacon §16 Dynamic Weighting Mechanism
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §15 (composite hierarchy: 8 composites)
 *   - Beacon Canon v1.1 §16.1-16.3 (Dynamic Weighting Principle)
 *   - Beacon Canon v1.1 §16.2 (exact weights deferred to PAC-2 / biostatistics validation)
 * 
 * Per canon §16.2: "Exact weight values for all ISE states across all composites
 * are deferred to PAC-2 (Deterministic Logic) for biostatistics team validation."
 * 
 * The values in this file are PHASE 1 PROVISIONAL — directionally derived from
 * canon §16.3 principles, with conservative ±0.04 shifts from the 1/8 baseline.
 * Reviewed and approved by Val (clinical lead) on 2026-05-03 for beta launch.
 * 
 * BIOSTATISTICS HANDOFF:
 *   When the biostatistics team produces validated weights from cohort data,
 *   replace each `_PHASE_1_PROVISIONAL` constant with the validated table.
 *   The mechanism (this file's exported function) does not change — only the
 *   numeric values inside the tables.
 * 
 * Provisional rationale per state:
 *   ISE-0: behavioral metrics weighted higher (canon §16.3 — sparse early V1 data)
 *   ISE-1: standard equal weighting (canon §16.3 default)
 *   ISE-2: recovery composites weighted higher (canon §16.3 — Recovery-Forward)
 *   ISE-3: subjective metrics emphasized (canon §16.3 — Load-Limited)
 *   ISE-4: equal weighting (canon §16.3 — Phase 2 deferred)
 *   ISE-5: objective physiological weighted highest (canon §16.3 — Restricted)
 *   ISE-6: equal weighting (canon §16.3 — Phase 2 deferred)
 */

import { ISEState } from '../types/ise.js';
import type { CompositeName } from '../types/composite.js';

// ─────────────────────────────────────────────────────────────────────────────
// BASELINE WEIGHT (canon §15 default — 1/8 across all 8 composites)
// ─────────────────────────────────────────────────────────────────────────────

export const BASELINE_WEIGHT_PER_COMPOSITE = 1 / 8;

// ─────────────────────────────────────────────────────────────────────────────
// EQUAL-WEIGHTED TABLE (used for ISE-1, ISE-4, ISE-6)
// ─────────────────────────────────────────────────────────────────────────────

const EQUAL_WEIGHTS: Readonly<Record<CompositeName, number>> = {
  SRC: BASELINE_WEIGHT_PER_COMPOSITE,
  SBL: BASELINE_WEIGHT_PER_COMPOSITE,
  MBC: BASELINE_WEIGHT_PER_COMPOSITE,
  MEI: BASELINE_WEIGHT_PER_COMPOSITE,
  AMP: BASELINE_WEIGHT_PER_COMPOSITE,
  BCI: BASELINE_WEIGHT_PER_COMPOSITE,
  CRC: BASELINE_WEIGHT_PER_COMPOSITE,
  BHR: BASELINE_WEIGHT_PER_COMPOSITE
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ISE-0 NEUTRAL / BASELINE — PHASE 1 PROVISIONAL
// 
// Canon §16.3: "Limited V1 data early; behavioral metrics weighted higher"
// Sum: 1.000 (self-balanced, no renormalization needed)
// ─────────────────────────────────────────────────────────────────────────────

const ISE_0_WEIGHTS_PHASE_1_PROVISIONAL: Readonly<Record<CompositeName, number>> = {
  BHR: 0.165, // +0.040 — most behavioral; habits self-reportable early
  SBL: 0.155, // +0.030 — subjective stress signals available early
  CRC: 0.145, // +0.020 — sleep timing reportable before HRV calibrated
  BCI: 0.125, //   0    — mixed; neutral hold
  SRC: 0.105, // -0.020 — needs HRV history; sparse early
  MBC: 0.105, // -0.020 — needs labs + body comp baseline
  MEI: 0.100, // -0.025 — energy expenditure needs calibrated wearable
  AMP: 0.100  // -0.025 — performance needs baseline reference
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ISE-2 PROTECTIVE / RECOVERY-FORWARD — PHASE 1 PROVISIONAL
// 
// Canon §16.3: "Recovery-related sub-scores weighted higher"
// Pre-renormalization sum: 1.015 — values below are POST-RENORMALIZATION
// (each pre-renorm value divided by 1.015)
// ─────────────────────────────────────────────────────────────────────────────

const ISE_2_WEIGHTS_PHASE_1_PROVISIONAL: Readonly<Record<CompositeName, number>> = {
  SRC: 0.163, // +0.040 → renorm — sleep recovery is THE recovery composite
  BHR: 0.153, // +0.030 → renorm — habit consistency sustains recovery
  SBL: 0.148, // +0.025 → renorm — lower stress burden = recovery progress
  CRC: 0.143, // +0.020 → renorm — circadian alignment supports recovery
  MBC: 0.123, //   0    → renorm — body comp neutral in recovery
  BCI: 0.103, // -0.020 → renorm — cognitive load less central
  MEI: 0.084, // -0.040 → renorm — performance push de-emphasized
  AMP: 0.084  // -0.040 → renorm — performance push de-emphasized
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ISE-3 CONTAINED / LOAD-LIMITED — PHASE 1 PROVISIONAL
// 
// Canon §16.3: "Simplified; subjective metrics emphasized"
// Sum: 1.000 (self-balanced, no renormalization needed)
// ─────────────────────────────────────────────────────────────────────────────

const ISE_3_WEIGHTS_PHASE_1_PROVISIONAL: Readonly<Record<CompositeName, number>> = {
  BCI: 0.165, // +0.040 — cognitive load is the central concern
  SBL: 0.155, // +0.030 — subjective stress is the felt experience
  BHR: 0.150, // +0.025 — habit signal still self-reported
  SRC: 0.125, //   0    — sleep matters but not central
  CRC: 0.125, //   0    — rhythm matters but not central
  MBC: 0.105, // -0.020 — body comp not load-relevant
  MEI: 0.090, // -0.035 — performance push counter to containment
  AMP: 0.085  // -0.040 — performance push counter to containment
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ISE-5 RESTRICTED / GUARDED — PHASE 1 PROVISIONAL
// 
// Canon §16.3: "Objective (physiological) weighted highest; provider exercises 51%"
// Pre-renormalization sum: 1.010 — values below are POST-RENORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

const ISE_5_WEIGHTS_PHASE_1_PROVISIONAL: Readonly<Record<CompositeName, number>> = {
  MBC: 0.163, // +0.040 → renorm — most objective; labs + body comp
  SRC: 0.158, // +0.035 → renorm — HRV, RHR — biometric ground truth
  MEI: 0.149, // +0.025 → renorm — wearable-objective performance
  AMP: 0.149, // +0.025 → renorm — wearable-objective performance
  BCI: 0.114, // -0.010 → renorm — mixed; slight subjective de-emphasis
  CRC: 0.099, // -0.025 → renorm — behavior-driven side de-emphasized
  SBL: 0.084, // -0.040 → renorm — subjective stress de-emphasized
  BHR: 0.084  // -0.040 → renorm — self-report most de-emphasized
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP — primary entry point
// 
// Returns the weight table for a given ISE state. Returned object is readonly
// to prevent accidental mutation by callers.
// 
// Invariant: every returned table sums to 1.0 (within floating-point epsilon).
// Verified at module load via _verifyAllTablesSum() below.
// ─────────────────────────────────────────────────────────────────────────────

export function getCompositeWeightsForISE(
  state: ISEState
): Readonly<Record<CompositeName, number>> {
  switch (state) {
    case ISEState.ISE_0_NEUTRAL_BASELINE:
      return ISE_0_WEIGHTS_PHASE_1_PROVISIONAL;
    case ISEState.ISE_1_ALIGNED_AVAILABLE:
      return EQUAL_WEIGHTS;
    case ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD:
      return ISE_2_WEIGHTS_PHASE_1_PROVISIONAL;
    case ISEState.ISE_3_CONTAINED_LOAD_LIMITED:
      return ISE_3_WEIGHTS_PHASE_1_PROVISIONAL;
    case ISEState.ISE_4_BUILDING_MOMENTUM:
      return EQUAL_WEIGHTS; // canon §16.3: Phase 2 deferred
    case ISEState.ISE_5_RESTRICTED_GUARDED:
      return ISE_5_WEIGHTS_PHASE_1_PROVISIONAL;
    case ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL:
      return EQUAL_WEIGHTS; // canon §16.3: Phase 2 deferred
    default: {
      const _exhaustive: never = state;
      throw new Error(`getCompositeWeightsForISE: unknown state ${String(_exhaustive)}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-LOAD INVARIANT CHECK
// 
// Verifies every weight table sums to 1.0 within floating-point epsilon.
// Fails loudly at startup if any table is malformed — preferable to silent
// scoring drift in production.
// ─────────────────────────────────────────────────────────────────────────────

const SUM_TOLERANCE = 0.001;

function _verifyTableSum(
  state_label: string,
  table: Readonly<Record<CompositeName, number>>
): void {
  const sum = Object.values(table).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1.0) > SUM_TOLERANCE) {
    throw new Error(
      `Composite weight table for ${state_label} sums to ${sum.toFixed(4)}, ` +
        `expected 1.0 ± ${SUM_TOLERANCE}. Check Beacon §16 weight constants.`
    );
  }
}

_verifyTableSum('EQUAL_WEIGHTS', EQUAL_WEIGHTS);
_verifyTableSum('ISE_0_WEIGHTS_PHASE_1_PROVISIONAL', ISE_0_WEIGHTS_PHASE_1_PROVISIONAL);
_verifyTableSum('ISE_2_WEIGHTS_PHASE_1_PROVISIONAL', ISE_2_WEIGHTS_PHASE_1_PROVISIONAL);
_verifyTableSum('ISE_3_WEIGHTS_PHASE_1_PROVISIONAL', ISE_3_WEIGHTS_PHASE_1_PROVISIONAL);
_verifyTableSum('ISE_5_WEIGHTS_PHASE_1_PROVISIONAL', ISE_5_WEIGHTS_PHASE_1_PROVISIONAL);

// ─────────────────────────────────────────────────────────────────────────────
// PROVENANCE — for audit / biostatistics handoff
// ─────────────────────────────────────────────────────────────────────────────

export const COMPOSITE_WEIGHTS_PROVENANCE = {
  status: 'PHASE_1_PROVISIONAL',
  approved_by: 'Val (clinical lead, BariAccess LLC)',
  approved_on: '2026-05-03',
  source_canon: 'Beacon Canon v1.1 §16.3 directional principles',
  validation_pending: 'PAC-2 biostatistics validation per canon §16.2',
  shift_cap: 0.04,
  baseline: BASELINE_WEIGHT_PER_COMPOSITE
} as const;
