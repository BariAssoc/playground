/**
 * V4 GLP-1 + Annotations tests — DECISIONS.md §7.
 *
 * Verifies:
 *   - getGLP1Status correctly computes days_on, dose_stable, active
 *   - shouldAttachRHRAnnotation respects -2 bpm threshold + 90-day window
 *   - buildGLP1RHRAnnotation surfaces correct cite chain
 *   - buildAllAnnotations composes correctly with multiple sources
 */

import { describe, it, expect } from 'vitest';
import {
  getGLP1Status,
  shouldAttachRHRAnnotation,
} from '../src/v4/glp1-status.js';
import {
  buildGLP1RHRAnnotation,
  buildBaselineMaturingAnnotation,
  buildLSRWarmupAnnotation,
  buildBridgedAnnotation,
  buildProvenanceFailureAnnotation,
  buildAllAnnotations,
} from '../src/v4/annotations.js';
import type { GLP1Status, PersonalBaseline } from '../../shared/src/types/index.js';
import { GLP1_INACTIVE, GLP1_EARLY_DAY_45, GLP1_LATE_DAY_120 } from './fixtures/golden-cases.js';

const NOW = '2026-05-09T02:00:00Z';

// ────────────────────────────────────────────────────────────
// getGLP1Status
// ────────────────────────────────────────────────────────────

describe('getGLP1Status', () => {
  it('inactive when no glp1 in profile', () => {
    const s = getGLP1Status({
      profile: { user_id: 'u1' },
      on_date: '2026-05-09',
    });
    expect(s.active).toBe(false);
    expect(s.days_on).toBeNull();
    expect(s.compound).toBeNull();
  });

  it('inactive when profile.glp1.active = false', () => {
    const s = getGLP1Status({
      profile: { user_id: 'u1', glp1: { active: false } },
      on_date: '2026-05-09',
    });
    expect(s.active).toBe(false);
  });

  it('active with computed days_on for valid start_date', () => {
    const s = getGLP1Status({
      profile: {
        user_id: 'u1',
        glp1: {
          active: true,
          compound: 'semaglutide',
          start_date: '2026-03-25',
        },
      },
      on_date: '2026-05-09',
    });
    expect(s.active).toBe(true);
    expect(s.compound).toBe('semaglutide');
    expect(s.days_on).toBe(45);
  });

  it('baseline_reset_active = true when stable_since is recent (<28 days)', () => {
    const s = getGLP1Status({
      profile: {
        user_id: 'u1',
        glp1: {
          active: true,
          compound: 'tirzepatide',
          start_date: '2026-01-09',
          dose_stable_since: '2026-04-20',     // 19 days before on_date
        },
      },
      on_date: '2026-05-09',
    });
    expect(s.baseline_reset_active).toBe(true);
    expect(s.dose_stable_since).toBe('2026-04-20');
  });

  it('baseline_reset_active = false when stable_since is older (≥28 days)', () => {
    const s = getGLP1Status({
      profile: {
        user_id: 'u1',
        glp1: {
          active: true,
          compound: 'tirzepatide',
          start_date: '2026-01-09',
          dose_stable_since: '2026-03-01',
        },
      },
      on_date: '2026-05-09',
    });
    expect(s.baseline_reset_active).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────
// shouldAttachRHRAnnotation
// ────────────────────────────────────────────────────────────

describe('shouldAttachRHRAnnotation — DECISIONS.md §7 (LOCKED 2026-05-09)', () => {
  it('ATTACH: active + day 45 + drift -3 bpm (drop direction)', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, -3)).toBe(true);
  });

  it('ATTACH: active + day 45 + drift +3 bpm (rise direction — bidirectional)', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, +3)).toBe(true);
  });

  it('ATTACH: boundary -2 bpm exact', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, -2)).toBe(true);
  });

  it('ATTACH: boundary +2 bpm exact', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, +2)).toBe(true);
  });

  it('NO ATTACH: |drift| -1 bpm (below magnitude threshold)', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, -1)).toBe(false);
  });

  it('NO ATTACH: |drift| +1 bpm (below magnitude threshold)', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, +1)).toBe(false);
  });

  it('NO ATTACH: |drift| 0 bpm', () => {
    expect(shouldAttachRHRAnnotation(GLP1_EARLY_DAY_45, 0)).toBe(false);
  });

  it('NO ATTACH: GLP-1 inactive', () => {
    expect(shouldAttachRHRAnnotation(GLP1_INACTIVE, -3)).toBe(false);
  });

  it('ATTACH: day 119 (last early-phase day)', () => {
    const day119: GLP1Status = { ...GLP1_EARLY_DAY_45, days_on: 119 };
    expect(shouldAttachRHRAnnotation(day119, -3)).toBe(true);
  });

  it('NO ATTACH: day 120 (boundary — first post-early day)', () => {
    const day120: GLP1Status = { ...GLP1_EARLY_DAY_45, days_on: 120 };
    expect(shouldAttachRHRAnnotation(day120, -3)).toBe(false);
  });

  it('NO ATTACH: GLP1_LATE_DAY_120 fixture (past 120-day window)', () => {
    expect(shouldAttachRHRAnnotation(GLP1_LATE_DAY_120, -3)).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────
// buildGLP1RHRAnnotation
// ────────────────────────────────────────────────────────────

describe('buildGLP1RHRAnnotation', () => {
  it('builds annotation with provider audience + correct cites (drop)', () => {
    const a = buildGLP1RHRAnnotation(GLP1_EARLY_DAY_45, -3, NOW);
    expect(a).not.toBeNull();
    expect(a!.audience).toBe('provider');
    expect(a!.severity).toBe('info');
    expect(a!.source).toBe('glp1_baseline');
    expect(a!.message).toContain('drop');
    expect(a!.message).toContain('day 45 of 120');
    expect(a!.cites).toEqual(
      expect.arrayContaining([
        'CCO-V1V4-REFFRAME-001 §4.5',
        'DECISIONS.md §7 (LOCKED 2026-05-09)',
      ])
    );
  });

  it('builds annotation for positive drift (rise direction)', () => {
    const a = buildGLP1RHRAnnotation(GLP1_EARLY_DAY_45, +3, NOW);
    expect(a).not.toBeNull();
    expect(a!.message).toContain('rise');
    expect(a!.message).toContain('3.0 bpm');
  });

  it('returns null when conditions not met', () => {
    expect(buildGLP1RHRAnnotation(GLP1_INACTIVE, -3, NOW)).toBeNull();
    expect(buildGLP1RHRAnnotation(GLP1_LATE_DAY_120, -3, NOW)).toBeNull();
    expect(buildGLP1RHRAnnotation(GLP1_EARLY_DAY_45, +1, NOW)).toBeNull();   // |drift|<2
    expect(buildGLP1RHRAnnotation(GLP1_EARLY_DAY_45, -1, NOW)).toBeNull();   // |drift|<2
  });
});

// ────────────────────────────────────────────────────────────
// Other annotation builders
// ────────────────────────────────────────────────────────────

describe('buildBaselineMaturingAnnotation', () => {
  const PENDING_HRV: PersonalBaseline = {
    metric: 'hrv',
    mean: 4.0,
    stddev: 0.2,
    days_in_window: 14,
    provenance: 'PENDING_VALIDATION',
    log_transformed: true,
    computed_at: NOW,
  };

  it('builds when any baseline pending', () => {
    const a = buildBaselineMaturingAnnotation([PENDING_HRV], NOW);
    expect(a).not.toBeNull();
    expect(a!.message).toContain('Day 14');
    expect(a!.message).toContain('hrv');
  });

  it('null when all baselines validated', () => {
    const validated: PersonalBaseline = { ...PENDING_HRV, days_in_window: 28, provenance: 'VALIDATED' };
    expect(buildBaselineMaturingAnnotation([validated], NOW)).toBeNull();
  });

  it('null on empty list', () => {
    expect(buildBaselineMaturingAnnotation([], NOW)).toBeNull();
  });
});

describe('buildLSRWarmupAnnotation', () => {
  it('Day 1: INSUFFICIENT-flavor message; audience both', () => {
    const a = buildLSRWarmupAnnotation(1, NOW);
    expect(a).not.toBeNull();
    expect(a!.audience).toBe('both');
    expect(a!.message).toContain('Day 14');
  });

  it('Day 14: PARTIAL-flavor message', () => {
    const a = buildLSRWarmupAnnotation(14, NOW);
    expect(a!.message).toContain('Day 14 of 28');
  });

  it('Day 28: null (out of warmup)', () => {
    expect(buildLSRWarmupAnnotation(28, NOW)).toBeNull();
  });
});

describe('buildBridgedAnnotation', () => {
  it('builds caution-severity annotation with FAB sources', () => {
    const a = buildBridgedAnnotation(2, ['FAB-SLEEP', 'FAB-RECOVERY'], NOW);
    expect(a.severity).toBe('caution');
    expect(a.message).toContain('FAB-SLEEP');
    expect(a.message).toContain('Day 7');
    expect(a.cites).toEqual(expect.arrayContaining(['Pass 0 Spec 5']));
  });
});

describe('buildProvenanceFailureAnnotation', () => {
  it('builds warning for unknown-method inputs', () => {
    const a = buildProvenanceFailureAnnotation(['rhr', 'hrv'], NOW);
    expect(a).not.toBeNull();
    expect(a!.severity).toBe('warning');
    expect(a!.message).toContain('rhr');
  });

  it('null when no failures', () => {
    expect(buildProvenanceFailureAnnotation([], NOW)).toBeNull();
  });
});

describe('buildAllAnnotations — composer', () => {
  it('composes multiple annotations in single call', () => {
    const annotations = buildAllAnnotations({
      glp1: GLP1_EARLY_DAY_45,
      rhr_drift_bpm: -3,
      days_active: 14,
      bridged: { days_since_v1: 2, fab_sources: ['FAB-SLEEP'] },
      provenance_failures: ['rhr_today'],
      computed_at: NOW,
    });
    const sources = annotations.map((a) => a.source);
    expect(sources).toContain('glp1_baseline');
    expect(sources).toContain('lsr_warmup');
    expect(sources).toContain('behavioral_bridge');
    expect(sources).toContain('provenance_failure');
  });

  it('returns empty list when nothing applies', () => {
    const annotations = buildAllAnnotations({
      glp1: GLP1_INACTIVE,
      computed_at: NOW,
    });
    expect(annotations).toEqual([]);
  });
});
