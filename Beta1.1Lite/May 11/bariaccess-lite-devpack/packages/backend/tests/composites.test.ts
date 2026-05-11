/**
 * Composite tests — Pass 1 verification.
 * SRC anchored on SQI, SBL anchored on RSI, AMP anchored on EPC.
 */

import { describe, it, expect } from 'vitest';
import { computeSRC } from '../src/scoring/sleep/src-composite.js';
import { computeSBL } from '../src/scoring/stress/sbl-composite.js';
import { computeAMP } from '../src/scoring/activity/amp-composite.js';
import type { ScoreResult } from '../../shared/src/types/index.js';
import { BeaconBand } from '../../shared/src/enums/index.js';

const NOW = '2026-05-09T02:00:00Z';

function fullScore(value: number, band: BeaconBand): ScoreResult {
  return {
    value,
    band,
    degradation: 'FULL',
    provenance: 'VALIDATED',
    breakdown: {},
    weights_used: {},
    computed_at: NOW,
  };
}

function insufficient(): ScoreResult {
  return {
    value: null,
    band: null,
    degradation: 'INSUFFICIENT',
    provenance: 'UNKNOWN_METHOD',
    breakdown: {},
    weights_used: {},
    computed_at: NOW,
  };
}

// ────────────────────────────────────────────────────────────
// SRC
// ────────────────────────────────────────────────────────────

describe('SRC composite — Pass 1 §SRC', () => {
  it('full canon: 0.40·80 + 0.35·75 + 0.25·70 = 75.75', () => {
    const r = computeSRC({
      sqi: fullScore(80, BeaconBand.FAINT_GREEN),
      sri: fullScore(75, BeaconBand.LIGHT_ORANGE),
      sns: fullScore(70, BeaconBand.LIGHT_ORANGE),
      computed_at: NOW,
    });
    expect(r.value).toBeCloseTo(75.75, 2);
    expect(r.composite_id).toBe('SRC');
    expect(r.degradation).toBe('FULL');
  });

  it('SQI INSUFFICIENT → entire composite INSUFFICIENT', () => {
    const r = computeSRC({
      sqi: insufficient(),
      sri: fullScore(80, BeaconBand.FAINT_GREEN),
      sns: fullScore(80, BeaconBand.FAINT_GREEN),
      computed_at: NOW,
    });
    expect(r.value).toBeNull();
    expect(r.degradation).toBe('INSUFFICIENT');
  });

  it('SNS missing: redistributes 0.40+0.35=0.75; weight 0.5333/0.4667', () => {
    const r = computeSRC({
      sqi: fullScore(80, BeaconBand.FAINT_GREEN),
      sri: fullScore(75, BeaconBand.LIGHT_ORANGE),
      sns: insufficient(),
      computed_at: NOW,
    });
    // 80 * 0.5333 + 75 * 0.4667 = 42.67 + 35.00 = 77.67
    expect(r.value).toBeCloseTo(77.67, 1);
    expect(r.degradation).toBe('PARTIAL');
  });

  it('cascade rim active when sub-band ≥ 4', () => {
    const r = computeSRC({
      sqi: fullScore(80, BeaconBand.FAINT_GREEN),
      sri: fullScore(75, BeaconBand.LIGHT_ORANGE),    // band 4
      sns: fullScore(80, BeaconBand.FAINT_GREEN),
      computed_at: NOW,
    });
    expect(r.cascade_rim_active).toBe(true);
  });

  it('cascade rim inactive when all sub-bands ≤ 3', () => {
    const r = computeSRC({
      sqi: fullScore(85, BeaconBand.MED_GREEN),
      sri: fullScore(82, BeaconBand.FAINT_GREEN),
      sns: fullScore(86, BeaconBand.MED_GREEN),
      computed_at: NOW,
    });
    expect(r.cascade_rim_active).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────
// SBL
// ────────────────────────────────────────────────────────────

describe('SBL composite — Pass 1 §SBL', () => {
  it('full canon: 0.30·80 + 0.40·75 + 0.30·85 = 79.5', () => {
    const r = computeSBL({
      cir: fullScore(80, BeaconBand.FAINT_GREEN),
      sma: fullScore(75, BeaconBand.LIGHT_ORANGE),
      rsi: fullScore(85, BeaconBand.MED_GREEN),
      computed_at: NOW,
    });
    expect(r.value).toBeCloseTo(79.5, 1);
  });

  it('RSI INSUFFICIENT → composite INSUFFICIENT', () => {
    const r = computeSBL({
      cir: fullScore(80, BeaconBand.FAINT_GREEN),
      sma: fullScore(75, BeaconBand.LIGHT_ORANGE),
      rsi: insufficient(),
      computed_at: NOW,
    });
    expect(r.degradation).toBe('INSUFFICIENT');
  });
});

// ────────────────────────────────────────────────────────────
// AMP
// ────────────────────────────────────────────────────────────

describe('AMP composite — Pass 1 §AMP', () => {
  it('Day 30, full canon: 0.40·70 + 0.30·80 + 0.30·75 = 74.5', () => {
    const r = computeAMP({
      epc: fullScore(70, BeaconBand.LIGHT_ORANGE),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr: fullScore(75, BeaconBand.LIGHT_ORANGE),
      days_active: 30,
      computed_at: NOW,
    });
    expect(r.value).toBeCloseTo(74.5, 1);
    expect(r.degradation).toBe('FULL');
  });

  it('Day 10 (LSR INSUFFICIENT): redistributes EPC + MVI; AMP is PARTIAL', () => {
    const r = computeAMP({
      epc: fullScore(70, BeaconBand.LIGHT_ORANGE),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr: insufficient(),
      days_active: 10,
      computed_at: NOW,
    });
    // 0.40+0.30 = 0.70 → 0.5714 / 0.4286
    // 70*0.5714 + 80*0.4286 = 40.0 + 34.29 = 74.29
    expect(r.value).toBeCloseTo(74.29, 1);
    expect(r.degradation).toBe('PARTIAL');
  });

  it('Day 20 (PARTIAL): even when LSR present, composite is PARTIAL', () => {
    const r = computeAMP({
      epc: fullScore(70, BeaconBand.LIGHT_ORANGE),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr: { ...fullScore(75, BeaconBand.LIGHT_ORANGE), degradation: 'PARTIAL', provenance: 'PENDING_VALIDATION' },
      days_active: 20,
      computed_at: NOW,
    });
    expect(r.degradation).toBe('PARTIAL');
  });

  it('EPC INSUFFICIENT → AMP INSUFFICIENT', () => {
    const r = computeAMP({
      epc: insufficient(),
      mvi: fullScore(80, BeaconBand.FAINT_GREEN),
      lsr: fullScore(75, BeaconBand.LIGHT_ORANGE),
      days_active: 30,
      computed_at: NOW,
    });
    expect(r.degradation).toBe('INSUFFICIENT');
  });
});
