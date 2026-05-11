/**
 * BariAccess Lite — V4 Provider Annotations
 *
 * Source: DECISIONS.md §7 (GLP-1 RHR annotation)
 *         CCO-V1V4-REFFRAME-001 §3.6 (provenance)
 *         ISE Canon v3.0 §17 Principle 9 (two-lane authority)
 *
 * Builds ScoreAnnotation records attached to score documents.
 * Annotations are metadata — they NEVER change the numeric score.
 * Audience: provider-only by default (Lane 2). Patient-safe annotations
 * are explicitly marked.
 */

import type {
  ScoreAnnotation,
  GLP1Status,
  PersonalBaseline,
} from '@bariaccess-lite/shared';
import { GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM, GLP1_EARLY_PHASE_DAYS } from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// GLP-1 RHR ANNOTATION
// Per DECISIONS.md §7 (LOCKED 2026-05-09 by founder). Attached when:
//   active && days_on < 120 && |rhr_drift_bpm| >= 2
// ────────────────────────────────────────────────────────────

export function buildGLP1RHRAnnotation(
  glp1: GLP1Status,
  rhr_drift_bpm: number,
  computed_at: string
): ScoreAnnotation | null {
  if (!glp1.active || glp1.days_on === null) return null;
  if (glp1.days_on >= GLP1_EARLY_PHASE_DAYS) return null;
  if (Math.abs(rhr_drift_bpm) < GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM) return null;

  const direction = rhr_drift_bpm >= 0 ? 'rise' : 'drop';
  const magnitude = Math.abs(rhr_drift_bpm).toFixed(1);

  return {
    id: `glp1_rhr:${computed_at}`,
    source: 'glp1_baseline',
    audience: 'provider',
    severity: 'info',
    message:
      `RHR ${direction} of ${magnitude} bpm in early GLP-1 phase ` +
      `(day ${glp1.days_on} of ${GLP1_EARLY_PHASE_DAYS}). Either direction in this window ` +
      `is typically medication-confounded: published literature shows GLP-1 raises RHR ~2-4 bpm, ` +
      `while post-bariatric weight loss can drive an opposite drop. ` +
      `Not a clean training-adaptation signal. Personal baseline rebuilds at 28 days post-dose-stable.`,
    cites: [
      'CCO-V1V4-REFFRAME-001 §4.5',
      'DECISIONS.md §7 (LOCKED 2026-05-09)',
    ],
  };
}

// ────────────────────────────────────────────────────────────
// BASELINE-MATURING ANNOTATION
// Per DECISIONS.md §9. Attached when any baseline used by the score
// is in PENDING_VALIDATION (days_in_window < 28).
// ────────────────────────────────────────────────────────────

export function buildBaselineMaturingAnnotation(
  baselines: PersonalBaseline[],
  computed_at: string
): ScoreAnnotation | null {
  const pending = baselines.filter(
    (b) => b.provenance === 'PENDING_VALIDATION' && b.days_in_window > 0
  );
  if (pending.length === 0) return null;

  const minDays = Math.min(...pending.map((b) => b.days_in_window));
  const metrics = pending.map((b) => b.metric).join(', ');

  return {
    id: `baseline_maturing:${computed_at}`,
    source: 'baseline_maturing',
    audience: 'provider',
    severity: 'info',
    message:
      `Personal baseline maturing — Day ${minDays} of 28. ` +
      `Pending metrics: ${metrics}. ` +
      `Score is computed but provenance flag = 🟡 Pending validation until Day 28.`,
    cites: ['CCO-V1V4-REFFRAME-001 §4.4', 'DECISIONS.md §9'],
  };
}

// ────────────────────────────────────────────────────────────
// LSR WARMUP ANNOTATION
// Per DECISIONS.md §8. Attached when AMP composite is in LSR warmup
// (days_active < 28). Patient-safe wording.
// ────────────────────────────────────────────────────────────

export function buildLSRWarmupAnnotation(
  days_active: number,
  computed_at: string
): ScoreAnnotation | null {
  if (days_active >= 28) return null;

  const stage = days_active < 14 ? 'INSUFFICIENT' : 'PARTIAL';
  const target = stage === 'INSUFFICIENT' ? 14 : 28;

  return {
    id: `lsr_warmup:${computed_at}`,
    source: 'lsr_warmup',
    audience: 'both',
    severity: 'info',
    message:
      stage === 'INSUFFICIENT'
        ? `Activity load tracking matures at Day 14. Currently Day ${days_active}. ` +
          `AMP composite reweights EPC + MVI during this period.`
        : `Activity load tracking is partial — Day ${days_active} of 28. ` +
          `Full ACWR-based load monitoring activates at Day 28.`,
    cites: ['Pass 3 §LSR Spec 4', 'DECISIONS.md §8'],
  };
}

// ────────────────────────────────────────────────────────────
// BRIDGED-SCORE ANNOTATION
// Per Pass 0 Spec 5. Attached when V1 has expired and Behavioral Bridge
// is providing the score.
// ────────────────────────────────────────────────────────────

export function buildBridgedAnnotation(
  days_since_v1: number,
  fab_sources: string[],
  computed_at: string
): ScoreAnnotation {
  return {
    id: `bridged:${computed_at}`,
    source: 'behavioral_bridge',
    audience: 'provider',
    severity: 'caution',
    message:
      `V1 wearable data expired ${days_since_v1} day(s) ago. Score derived ` +
      `via Behavioral Bridge from FABs: ${fab_sources.join(', ')}. ` +
      `Bridge auto-expires at Day 7 → INSUFFICIENT.`,
    cites: ['Pass 0 Spec 5', 'DECISIONS.md §11'],
  };
}

// ────────────────────────────────────────────────────────────
// PROVENANCE-FAILURE ANNOTATION
// Per CCO-V1V4-REFFRAME-001 §3.6. Attached when ANY input has
// provenance: UNKNOWN_METHOD.
// ────────────────────────────────────────────────────────────

export function buildProvenanceFailureAnnotation(
  failed_inputs: string[],
  computed_at: string
): ScoreAnnotation | null {
  if (failed_inputs.length === 0) return null;

  return {
    id: `provenance_failure:${computed_at}`,
    source: 'provenance_failure',
    audience: 'provider',
    severity: 'warning',
    message:
      `Inputs with unknown collection method excluded from score computation: ` +
      `${failed_inputs.join(', ')}. Per §3.6, these MUST NOT enter Frame A.`,
    cites: ['CCO-V1V4-REFFRAME-001 §3.6', 'DECISIONS.md §13'],
  };
}

// ────────────────────────────────────────────────────────────
// PUBLIC: BUILD ALL ANNOTATIONS FOR A SCORE DOC
// Composer used by composite scorers. Returns only non-null annotations.
// ────────────────────────────────────────────────────────────

export interface BuildAnnotationsContext {
  glp1: GLP1Status;
  rhr_drift_bpm?: number;
  baselines?: PersonalBaseline[];
  days_active?: number;
  bridged?: { days_since_v1: number; fab_sources: string[] };
  provenance_failures?: string[];
  computed_at: string;
}

export function buildAllAnnotations(
  ctx: BuildAnnotationsContext
): ScoreAnnotation[] {
  const out: ScoreAnnotation[] = [];

  if (ctx.rhr_drift_bpm !== undefined) {
    const a = buildGLP1RHRAnnotation(ctx.glp1, ctx.rhr_drift_bpm, ctx.computed_at);
    if (a) out.push(a);
  }
  if (ctx.baselines) {
    const a = buildBaselineMaturingAnnotation(ctx.baselines, ctx.computed_at);
    if (a) out.push(a);
  }
  if (ctx.days_active !== undefined) {
    const a = buildLSRWarmupAnnotation(ctx.days_active, ctx.computed_at);
    if (a) out.push(a);
  }
  if (ctx.bridged) {
    out.push(
      buildBridgedAnnotation(ctx.bridged.days_since_v1, ctx.bridged.fab_sources, ctx.computed_at)
    );
  }
  if (ctx.provenance_failures && ctx.provenance_failures.length > 0) {
    const a = buildProvenanceFailureAnnotation(ctx.provenance_failures, ctx.computed_at);
    if (a) out.push(a);
  }

  return out;
}
