/**
 * Theme palette tests — every §2 Expression Color must round-trip
 * with stable tokens. Locked v1.0 — these must not change without canon update.
 */

import { describe, it, expect } from 'vitest';
import { EXPRESSION, BAND } from '../src/theme/palette.js';
import { BeaconBand } from '@bariaccess-lite/shared';

describe('§2 Expression Color Code — 6 states locked', () => {
  it('has exactly 6 states', () => {
    expect(Object.keys(EXPRESSION).sort()).toEqual(
      ['BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE'].sort(),
    );
  });

  it('each state has the 4 required token keys', () => {
    for (const [name, tokens] of Object.entries(EXPRESSION)) {
      expect(tokens.text, `${name}.text`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(tokens.bubbleBg, `${name}.bubbleBg`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(tokens.border, `${name}.border`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(tokens.dot, `${name}.dot`).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('PURPLE is for AI Playground active (§2 + §6)', () => {
    expect(EXPRESSION.PURPLE.trigger).toContain('AI Playground');
    expect(EXPRESSION.PURPLE.meaning.toLowerCase()).toContain('responding');
  });

  it('WHITE is for night mode', () => {
    expect(EXPRESSION.WHITE.trigger.toLowerCase()).toContain('night');
  });
});

describe('Beacon band palette — 7 asymmetric bands', () => {
  it('has tokens for every BeaconBand enum member', () => {
    for (const b of [
      BeaconBand.STRONG_GREEN,
      BeaconBand.MED_GREEN,
      BeaconBand.FAINT_GREEN,
      BeaconBand.LIGHT_ORANGE,
      BeaconBand.MED_ORANGE,
      BeaconBand.DARK_ORANGE,
      BeaconBand.RED,
    ]) {
      expect(BAND[b]).toBeDefined();
      expect(BAND[b].fill).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('STRONG_GREEN range is 95–100', () => {
    expect(BAND[BeaconBand.STRONG_GREEN].range).toBe('95\u2013100');
  });

  it('RED range is <60', () => {
    expect(BAND[BeaconBand.RED].range).toBe('<60');
  });
});
