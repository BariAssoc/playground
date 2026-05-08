/**
 * BariAccess Beta — Color State Resolver
 *
 * Source: BETA-BOOKEND-001 §Color State Logic
 * VAL_DEFAULT_28 — runtime color_state distinct from intrinsic critical_flag.
 *
 * Decision table:
 *   ✅ Yes,  any                → 🟢 GREEN
 *   ❌ No,   non-critical       → 🟠 ORANGE
 *   ❌ No,   critical           → 🔴 RED
 *   ⏭️ Skip, non-critical       → 🟠 ORANGE (with skip-tag)
 *   ⏭️ Skip, critical           → 🔴 RED (with skip-tag)
 *   ⏱️ Timeout, non-critical    → 🟠 ORANGE
 *   ⏱️ Timeout, critical        → 🔴 RED
 */

import { ColorState, type Completion } from '@bariaccess/shared';

export function resolveColorState(
  completion: Completion,
  critical_flag: boolean
): ColorState {
  if (completion === 'yes') return ColorState.GREEN;
  // No / Skip / Timeout — same color treatment, differentiated by completion field
  return critical_flag ? ColorState.RED : ColorState.ORANGE;
}

/**
 * Warm-up Bookend always renders BLUE (awaiting cool-down response).
 */
export function warmupColorState(): ColorState {
  return ColorState.BLUE;
}
