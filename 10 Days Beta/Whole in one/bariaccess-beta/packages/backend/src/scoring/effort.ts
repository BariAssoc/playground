/**
 * BariAccess Beta — Effort Score (E)
 *
 * Source: BETA-FORMULA-001 §5 [CANON-LOCKED March 17, 2026]
 *
 * E = 0.40·F + 0.30·C + 0.30·LC
 *
 * Range: 0.0–1.0
 *
 * For the 10-day beta, LC = LC_beta proxy per §4.2.
 */

export interface EffortInputs {
  F: number;  // 0.0–1.0
  C: number;  // 0.0–1.0
  LC: number; // 0.0–1.0 (use LC_beta for May 7–17 window)
}

export function computeEffort({ F, C, LC }: EffortInputs): number {
  // Validate inputs
  for (const [name, val] of Object.entries({ F, C, LC })) {
    if (val < 0 || val > 1 || Number.isNaN(val)) {
      throw new Error(`${name} must be in [0,1]; got ${val}`);
    }
  }
  const E = 0.4 * F + 0.3 * C + 0.3 * LC;
  return Math.max(0, Math.min(1, E));
}
