/**
 * BariAccess — W₇ Kernel (Universal 7-Day Exponential Weighting)
 *
 * Source: RR-Calculation-Canon-Pass0_v1_1_LOCKED.md Universal Spec (W7 kernel)
 *         RR-Calculation-Canon-Pass2_v1_1_LOCKED.md (CI-M and CI-C apply W7)
 *
 *   W₇(d) = exp(−λ × (7 − d)) for d ∈ {1..7}
 *   λ = 0.30 (Phase 1a default)
 *   Then normalize so Σ W₇(d) = 1.0 over 7 days.
 *
 * Reference profile (Pass 0/Pass 2):
 *   d=7 (today)   → 0.25
 *   d=6 (d-2)     → 0.18
 *   d=5 (d-3)     → 0.14
 *   d=4 (d-4)     → 0.10
 *   d=3 (d-5)     → 0.08
 *   d=2 (d-6)     → 0.05
 *   d=1 (d-7)     → 0.04
 *
 * Verified against W7_PROFILE_REFERENCE in shared/constants by the test suite.
 */

import { W7_LAMBDA, W7_DAYS } from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────────────────

export interface W7KernelResult {
  /** Weights indexed 1..7. Index 7 = today, 1 = oldest day. */
  weights: number[];
  /** Sum (always 1.0 after normalization, modulo float ε). */
  sum: number;
  lambda: number;
  days: number;
}

let CACHED: W7KernelResult | null = null;

/**
 * Build the canonical W₇ weight vector.
 * Cached — kernel never changes within a process.
 */
export function w7Kernel(lambda: number = W7_LAMBDA): W7KernelResult {
  if (CACHED && CACHED.lambda === lambda && CACHED.days === W7_DAYS) {
    return CACHED;
  }
  const raw: number[] = [];
  for (let d = 1; d <= W7_DAYS; d++) {
    raw.push(Math.exp(-lambda * (W7_DAYS - d)));
  }
  const total = raw.reduce((a, b) => a + b, 0);
  const normalized = raw.map((w) => w / total);
  const sum = normalized.reduce((a, b) => a + b, 0);
  CACHED = { weights: normalized, sum, lambda, days: W7_DAYS };
  return CACHED;
}

/**
 * Apply W₇ kernel to a 7-day series.
 * `series` is oldest-first: series[0] = day 1 (oldest), series[6] = today.
 *
 * Missing values (null) are excluded and weights re-normalized over present days.
 * Returns null if no valid values.
 */
export function applyW7(
  series: Array<number | null>,
  lambda: number = W7_LAMBDA
): { value: number | null; days_used: number } {
  if (series.length !== W7_DAYS) {
    throw new Error(`applyW7: series must be length ${W7_DAYS}; got ${series.length}`);
  }

  const kernel = w7Kernel(lambda);
  let weighted_sum = 0;
  let weight_used = 0;
  let days_used = 0;

  for (let i = 0; i < W7_DAYS; i++) {
    const v = series[i]!;
    if (v === null || !Number.isFinite(v)) continue;
    const w = kernel.weights[i]!;
    weighted_sum += v * w;
    weight_used += w;
    days_used++;
  }

  if (days_used === 0 || weight_used === 0) {
    return { value: null, days_used: 0 };
  }
  return {
    value: weighted_sum / weight_used,  // re-normalize over present days
    days_used,
  };
}
