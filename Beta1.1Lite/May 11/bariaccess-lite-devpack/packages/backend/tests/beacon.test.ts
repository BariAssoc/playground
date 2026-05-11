/**
 * Beacon §6.2 piecewise linear verification.
 * Hand-calculated values from the canonical formula.
 */

import { describe, it, expect } from 'vitest';
import { zToScore } from '../src/beacon/piecewise-linear.js';
import { resolveBand } from '../src/beacon/band-resolver.js';
import { BeaconBand } from '../../shared/src/enums/index.js';

describe('zToScore — Beacon §6.2', () => {
  it('caps at 100 for very high Z', () => {
    expect(zToScore(2.0)).toBe(100);
    expect(zToScore(3.0)).toBe(100);
  });

  it('Z=+1.5 → score 95 (band 1 boundary)', () => {
    expect(zToScore(1.5)).toBeCloseTo(95, 5);
  });

  it('Z=+0.7 → score 85 (band 2 boundary)', () => {
    expect(zToScore(0.7)).toBeCloseTo(85, 5);
  });

  it('Z=+0.3 → score 80 (band 3 boundary)', () => {
    expect(zToScore(0.3)).toBeCloseTo(80, 5);
  });

  it('Z=-0.3 → score 70 (band 4 boundary)', () => {
    expect(zToScore(-0.3)).toBeCloseTo(70, 5);
  });

  it('Z=-0.6 → score 65 (band 5 boundary)', () => {
    expect(zToScore(-0.6)).toBeCloseTo(65, 5);
  });

  it('Z=-1.0 → score 60 (band 6 boundary)', () => {
    expect(zToScore(-1.0)).toBeCloseTo(60, 5);
  });

  it('Z=0 (population mean) → score 70 + 0.3 × 16.7 ≈ 75.01', () => {
    expect(zToScore(0)).toBeCloseTo(75.01, 1);
  });

  it('Z=-2.0 → score 60 + (-1.0) × 20 = 40', () => {
    expect(zToScore(-2.0)).toBe(40);
  });

  it('Z=-3.0 → 60 + (-2.0) × 20 = 20', () => {
    expect(zToScore(-3.0)).toBe(20);
  });

  it('Z=-5.0 → floored to 0', () => {
    expect(zToScore(-5.0)).toBe(0);
  });
});

describe('resolveBand — Beacon §4', () => {
  it('100 → STRONG_GREEN', () => expect(resolveBand(100)).toBe(BeaconBand.STRONG_GREEN));
  it('95 → STRONG_GREEN', () => expect(resolveBand(95)).toBe(BeaconBand.STRONG_GREEN));
  it('94 → MED_GREEN', () => expect(resolveBand(94)).toBe(BeaconBand.MED_GREEN));
  it('85 → MED_GREEN', () => expect(resolveBand(85)).toBe(BeaconBand.MED_GREEN));
  it('84 → FAINT_GREEN', () => expect(resolveBand(84)).toBe(BeaconBand.FAINT_GREEN));
  it('80 → FAINT_GREEN', () => expect(resolveBand(80)).toBe(BeaconBand.FAINT_GREEN));
  it('79 → LIGHT_ORANGE', () => expect(resolveBand(79)).toBe(BeaconBand.LIGHT_ORANGE));
  it('70 → LIGHT_ORANGE', () => expect(resolveBand(70)).toBe(BeaconBand.LIGHT_ORANGE));
  it('69 → MED_ORANGE', () => expect(resolveBand(69)).toBe(BeaconBand.MED_ORANGE));
  it('65 → MED_ORANGE', () => expect(resolveBand(65)).toBe(BeaconBand.MED_ORANGE));
  it('64 → DARK_ORANGE', () => expect(resolveBand(64)).toBe(BeaconBand.DARK_ORANGE));
  it('60 → DARK_ORANGE', () => expect(resolveBand(60)).toBe(BeaconBand.DARK_ORANGE));
  it('59 → RED', () => expect(resolveBand(59)).toBe(BeaconBand.RED));
  it('0 → RED', () => expect(resolveBand(0)).toBe(BeaconBand.RED));
});
