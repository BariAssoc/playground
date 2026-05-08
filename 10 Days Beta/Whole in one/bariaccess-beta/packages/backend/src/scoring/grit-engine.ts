/**
 * BariAccess Beta — Grit Engine + Space Multiplier
 *
 * Source: BETA-FORMULA-001 §6 (Grit) + §7 (Space)
 *
 * Trigger [CANON-LOCKED March 4, 2026]:
 *   Grit fires IF Mood ≤ 0.50 AND Effort ≥ 0.60
 *
 * Multiplier curve [BIOSTAT-COMMITTED]:
 *   M = clamp(1.0 + (E − Mood) × 1.5, 1.0, 2.0)
 *
 * Space Multiplier [CANON-LOCKED]:
 *   Protected   1.0×
 *   Challenging 1.25×
 *   Vulnerable  1.5×
 *   Mix         1.0×
 *
 * Application [VAL_DEFAULT_15]:
 *   Single FAB cycle scope. Mood + Effort sampled at WARM-UP Bookend.
 *   Multiplier applied to that cool-down's credit.
 *
 * final_credit = base_credit × Grit_M × Space_M
 */

import type { Space } from '@bariaccess/shared';

// ────────────────────────────────────────────────────────────
// GRIT ENGINE
// ────────────────────────────────────────────────────────────
const GRIT_MOOD_CEILING = 0.5;
const GRIT_EFFORT_FLOOR = 0.6;
const GRIT_CURVE_COEFFICIENT = 1.5;
const GRIT_M_MIN = 1.0;
const GRIT_M_MAX = 2.0;

export interface GritInputs {
  mood_normalized: number; // 0.0–1.0 — sampled at warm-up Bookend
  effort: number; // 0.0–1.0 — current rolling E at warm-up time
}

export interface GritResult {
  triggered: boolean;
  multiplier: number; // 1.0× when not triggered
}

export function computeGrit({ mood_normalized, effort }: GritInputs): GritResult {
  const triggered =
    mood_normalized <= GRIT_MOOD_CEILING && effort >= GRIT_EFFORT_FLOOR;
  if (!triggered) {
    return { triggered: false, multiplier: 1.0 };
  }
  const raw = 1.0 + (effort - mood_normalized) * GRIT_CURVE_COEFFICIENT;
  const multiplier = Math.max(GRIT_M_MIN, Math.min(GRIT_M_MAX, raw));
  return { triggered: true, multiplier };
}

// ────────────────────────────────────────────────────────────
// SPACE MULTIPLIER (V3 MODIFIER) [CANON-LOCKED]
// ────────────────────────────────────────────────────────────
const SPACE_MULTIPLIERS: Record<Space, number> = {
  protected: 1.0,
  challenging: 1.25,
  vulnerable: 1.5,
  mix: 1.0,
};

export function getSpaceMultiplier(space: Space | null): number {
  if (space == null) return 1.0;
  return SPACE_MULTIPLIERS[space];
}

// ────────────────────────────────────────────────────────────
// FINAL CREDIT COMPUTATION
// ────────────────────────────────────────────────────────────
export interface CreditInputs {
  base_credit: number; // 1 per qualifying FAB completion (PQIS pass adds +2 when shipped)
  mood_at_warmup: number; // 0.0–1.0
  effort_at_warmup: number; // 0.0–1.0
  space_at_warmup: Space | null;
}

export interface CreditResult {
  final_credit: number;
  base_credit: number;
  grit_multiplier: number;
  space_multiplier: number;
  grit_triggered: boolean;
}

export function computeCredit(input: CreditInputs): CreditResult {
  const { base_credit, mood_at_warmup, effort_at_warmup, space_at_warmup } =
    input;
  const grit = computeGrit({
    mood_normalized: mood_at_warmup,
    effort: effort_at_warmup,
  });
  const space_multiplier = getSpaceMultiplier(space_at_warmup);
  const final_credit = base_credit * grit.multiplier * space_multiplier;
  return {
    final_credit,
    base_credit,
    grit_multiplier: grit.multiplier,
    space_multiplier,
    grit_triggered: grit.triggered,
  };
}
