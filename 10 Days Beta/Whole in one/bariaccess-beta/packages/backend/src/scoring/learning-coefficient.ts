/**
 * BariAccess Beta — Learning Coefficient (LC)
 *
 * Source: BETA-FORMULA-001 §4
 *
 * §4.1 LC Canonical [CANON-LOCKED March 17, 2026]:
 *   LC = 0.30·Quiz_PassRate
 *      + 0.25·Quiz_Attempts_normalized
 *      + 0.25·Content_Engagement_normalized
 *      + 0.20·Ollie_Questions_normalized
 *
 *   CANNOT be computed during 10-day beta — quizzes / content / Ollie not shipped.
 *
 * §4.2 LC_beta [BIOSTAT-COMMITTED v0.1]:
 *   LC_beta = 0.40·JotForm_CompletionRate
 *           + 0.30·Nudge_ResponseRate (recency-weighted)
 *           + 0.30·OptionalText_SubmissionRate
 *
 *   Deprecated when canonical inputs ship.
 */

export interface LCBetaInputs {
  // JotForm side
  am_completed: number;
  am_scheduled: number;
  pm_completed: number;
  pm_scheduled: number;

  // Nudge side — recency-weighted: weight_i = 0.95^(days_ago_i)
  nudges: Array<{
    responded: boolean;
    days_ago: number; // 0 = today
  }>;

  // Optional text side
  text_submissions: number;
  text_opportunities: number;
}

export interface LCBetaBreakdown {
  jotform_completion_rate: number;
  nudge_response_rate_weighted: number;
  optional_text_submission_rate: number;
  LC_beta: number;
}

export function computeLCBeta(inputs: LCBetaInputs): LCBetaBreakdown {
  const totalScheduled = inputs.am_scheduled + inputs.pm_scheduled;
  const totalCompleted = inputs.am_completed + inputs.pm_completed;
  const jotform_completion_rate =
    totalScheduled > 0 ? totalCompleted / totalScheduled : 0;

  // Recency-weighted nudge response rate
  let weightedResponded = 0;
  let weightedSent = 0;
  for (const n of inputs.nudges) {
    const w = Math.pow(0.95, n.days_ago);
    weightedSent += w;
    if (n.responded) weightedResponded += w;
  }
  const nudge_response_rate_weighted =
    weightedSent > 0 ? weightedResponded / weightedSent : 0;

  const optional_text_submission_rate =
    inputs.text_opportunities > 0
      ? inputs.text_submissions / inputs.text_opportunities
      : 0;

  const LC_beta =
    0.4 * jotform_completion_rate +
    0.3 * nudge_response_rate_weighted +
    0.3 * optional_text_submission_rate;

  return {
    jotform_completion_rate,
    nudge_response_rate_weighted,
    optional_text_submission_rate,
    LC_beta: Math.max(0, Math.min(1, LC_beta)),
  };
}
