/**
 * BariAccess Beta — Disengagement Detection
 *
 * Source: BETA-FORMULA-001 §9 [CANON-LOCKED]
 *
 * Rules:
 *   E < 0.3 for 3 consecutive days  → soft nudge from Ollie
 *   E < 0.2 for 5 consecutive days  → human outreach (Pamela or Val)
 *   No app interaction for 7 days    → win-back protocol
 */

import type { EffortDailyRollup } from '@bariaccess/shared';

export interface DisengagementCheck {
  flagged: boolean;
  rule:
    | 'E_below_03_for_3d'
    | 'E_below_02_for_5d'
    | 'no_app_interaction_7d'
    | null;
  action: 'soft_nudge' | 'human_outreach' | 'winback' | null;
}

/**
 * Check if a cohort member should be flagged for disengagement.
 * @param recent_rollups daily rollups, ordered newest-first, up to 7 days deep
 * @param last_app_interaction_days_ago number of days since last app interaction (any kind)
 */
export function checkDisengagement(
  recent_rollups: EffortDailyRollup[],
  last_app_interaction_days_ago: number
): DisengagementCheck {
  // Check 7-day no-interaction first (most severe)
  if (last_app_interaction_days_ago >= 7) {
    return {
      flagged: true,
      rule: 'no_app_interaction_7d',
      action: 'winback',
    };
  }

  // Sort newest first defensively
  const sorted = [...recent_rollups].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  // E < 0.2 for 5 consecutive days
  if (sorted.length >= 5) {
    const last5 = sorted.slice(0, 5);
    if (last5.every((r) => r.E < 0.2)) {
      return {
        flagged: true,
        rule: 'E_below_02_for_5d',
        action: 'human_outreach',
      };
    }
  }

  // E < 0.3 for 3 consecutive days
  if (sorted.length >= 3) {
    const last3 = sorted.slice(0, 3);
    if (last3.every((r) => r.E < 0.3)) {
      return {
        flagged: true,
        rule: 'E_below_03_for_3d',
        action: 'soft_nudge',
      };
    }
  }

  return { flagged: false, rule: null, action: null };
}
