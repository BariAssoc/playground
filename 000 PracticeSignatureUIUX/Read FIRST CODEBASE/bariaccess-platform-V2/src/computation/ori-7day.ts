/**
 * ORI 7-DAY — Ollie Response Index (Decay-Weighted)
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §4.3 (decay-weighted ORI formula)
 *   - PAC-ISE-002 v2.0 §6 Signal 5 (engagement signal — ORI is one of two inputs)
 * 
 * ORI measures patient responsiveness to Ollie prompts.
 * Decay weighting (0.95^days_ago) favors recent responsiveness over old responsiveness.
 * 
 * Range: 0.0–1.0 (1.0 = patient responds to every prompt within window).
 */

// ─────────────────────────────────────────────────────────────────────────────
// DECAY CONSTANT (G3 §4.3 — LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const ORI_DECAY_BASE = 0.95 as const;

// ─────────────────────────────────────────────────────────────────────────────
// DAILY ORI INPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyORIInput {
  /** 0 = today, 1 = yesterday, ..., 6 = 6 days ago */
  days_ago: number;
  ollie_prompts_delivered: number;
  ollie_prompts_responded: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE 7-DAY DECAY-WEIGHTED ORI
// 
// Per G3 §4.3:
//   ORI_7d = Σ(daily_ratio × 0.95^days_ago × delivered) / Σ(0.95^days_ago × delivered)
// 
// This is a weighted-average-of-ratios (NOT ratio-of-weighted-sums) so days with
// many prompts contribute proportionally to days with few prompts.
// 
// Edge cases:
//   - Empty array → return 0.5 (neutral default per Beacon §12.3 reasoning)
//   - Zero total prompts → return 0.5
//   - days_ago > 6 → still weighted (no cap), but caller should slice to 7-day window
// ─────────────────────────────────────────────────────────────────────────────

export function computeORI7Day(daily_inputs: DailyORIInput[]): number {
  if (daily_inputs.length === 0) {
    return 0.5;
  }

  let weighted_responded_sum = 0;
  let weighted_delivered_sum = 0;

  for (const day of daily_inputs) {
    if (day.ollie_prompts_delivered <= 0) {
      continue; // skip days with no prompts (avoid divide-by-zero)
    }
    const decay = Math.pow(ORI_DECAY_BASE, Math.max(0, day.days_ago));
    weighted_responded_sum += day.ollie_prompts_responded * decay;
    weighted_delivered_sum += day.ollie_prompts_delivered * decay;
  }

  if (weighted_delivered_sum <= 0) {
    return 0.5;
  }

  const ori = weighted_responded_sum / weighted_delivered_sum;
  return Math.max(0, Math.min(1, ori));
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE FSI 7-DAY (FAB Stability Index — Signal 5 second input)
// 
// Per G3 §4 (referenced from FAB Canon v2.0 §11 + PAC-ISE-002 §6 Signal 5):
//   FSI = mean(daily FCS values across all task-visible families, 7-day rolling)
// 
// Uses simple mean across families (NOT decay-weighted — Resolver thresholds
// are calibrated against unweighted mean per PAC-ISE-002 v2.0 §15).
// ─────────────────────────────────────────────────────────────────────────────

export function computeFSI7Day(
  daily_fcs_by_family: Array<Record<string, number>>
): number {
  if (daily_fcs_by_family.length === 0) {
    return 0.5;
  }

  let total = 0;
  let count = 0;

  for (const day of daily_fcs_by_family) {
    for (const [, fcs] of Object.entries(day)) {
      if (!Number.isNaN(fcs)) {
        total += fcs;
        count += 1;
      }
    }
  }

  if (count === 0) {
    return 0.5;
  }

  const fsi = total / count;
  return Math.max(0, Math.min(1, fsi));
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIFY FSI TREND (Signal 5 output — comparing today's FSI to 7d-ago FSI)
// ─────────────────────────────────────────────────────────────────────────────

export type FSITrend = 'rising' | 'stable' | 'declining';

export const FSI_TREND_THRESHOLD = 0.05 as const; // ±5% delta = stable band

export function classifyFSITrend(fsi_today: number, fsi_7d_ago: number): FSITrend {
  const delta = fsi_today - fsi_7d_ago;
  if (delta >= FSI_TREND_THRESHOLD) return 'rising';
  if (delta <= -FSI_TREND_THRESHOLD) return 'declining';
  return 'stable';
}
