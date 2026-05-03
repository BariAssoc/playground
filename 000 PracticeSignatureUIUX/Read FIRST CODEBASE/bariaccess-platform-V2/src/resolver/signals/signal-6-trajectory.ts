/**
 * RESOLVER SIGNAL 6 — Trajectory
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §6 Signal 6 (UPDATED per G7 — see notes below)
 *   - CCO-FAB-001-PIN-001 v1.0 (G1) §4 (canonical Effort formula)
 *   - CCO-FAB-001-PIN-001 v1.0 (G1) §5 (slope computation)
 *   - CCO-PAC-ISE-002-PATCH-001 v1.0 (G7) §3 (Effort formula sync — Resolver READS, doesn't recompute)
 * 
 * Combines three trajectory inputs:
 *   1. Mood slope (7-day) — from daily Mood pin readings
 *   2. Effort slope (7-day) — from effort_score_daily snapshots (G1 formula)
 *   3. FSI direction — already classified by Signal 5 / engagement rollup
 * 
 * Per G7: Resolver READS effort_score_daily from rollup container.
 * It does NOT recompute Effort. The compute happens nightly in src/computation/effort-score.ts.
 */

import {
  compute7daySlope,
  classifyTrajectoryDirection,
  classifySlope
} from '../../computation/slope-7day.js';
import type { SlopeDirection } from '../../computation/slope-7day.js';
import type { FSITrend } from './signal-5-engagement.js';

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

export interface TrajectorySignalOutput {
  mood_slope: number;
  effort_slope: number;
  fsi_direction: SlopeDirection;
  /** Composite direction across all three trajectory inputs */
  direction: SlopeDirection;
  /** True if trajectory favors building momentum (ISE-4) */
  favors_momentum_build: boolean;
  /** True if trajectory favors protective recovery (ISE-2) */
  favors_recovery: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL INPUTS
// 
// Per G7: Resolver receives 7-day arrays of (mood normalized, effort_score_daily).
// FSI trend comes already classified from Signal 5 rollup.
// ─────────────────────────────────────────────────────────────────────────────

export interface TrajectorySignalInputs {
  /** 7 daily Mood pin normalized values (0 = oldest, 6 = today) */
  mood_normalized_7d: number[];
  /** 7 daily Effort score values from effort-daily-rollup container */
  effort_score_daily_7d: number[];
  /** Pre-classified FSI trend from Signal 5 */
  fsi_trend: FSITrend;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATE SIGNAL 6
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateSignal6Trajectory(
  inputs: TrajectorySignalInputs
): TrajectorySignalOutput {
  // Compute slopes per G1 §5
  const mood_slope = compute7daySlope(inputs.mood_normalized_7d);
  const effort_slope = compute7daySlope(inputs.effort_score_daily_7d);

  // Convert FSI trend to slope direction (already classified by Signal 5)
  const fsi_direction: SlopeDirection =
    inputs.fsi_trend === 'rising'
      ? 'up'
      : inputs.fsi_trend === 'declining'
        ? 'down'
        : 'stable';

  // For composite direction, treat FSI direction as a slope value above/below thresholds
  // Approach: if FSI trend is rising, treat as +0.15 (above THRESHOLD_POS).
  // If declining, treat as -0.15 (below THRESHOLD_NEG). If stable, treat as 0.
  const fsi_slope_proxy =
    fsi_direction === 'up' ? 0.15 : fsi_direction === 'down' ? -0.15 : 0;

  const direction = classifyTrajectoryDirection(
    mood_slope,
    effort_slope,
    fsi_slope_proxy
  );

  // Behavioral hints
  const mood_dir = classifySlope(mood_slope);
  const effort_dir = classifySlope(effort_slope);

  const favors_momentum_build =
    direction === 'up' && (mood_dir === 'up' || effort_dir === 'up');

  const favors_recovery =
    direction === 'down' && (mood_dir === 'down' || effort_dir === 'down');

  return {
    mood_slope,
    effort_slope,
    fsi_direction,
    direction,
    favors_momentum_build,
    favors_recovery
  };
}
