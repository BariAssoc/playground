/**
 * Canon constants — locked values per CCO-LITE-BETA-UI-001 v1.0.
 */

import { describe, it, expect } from 'vitest';
import {
  ABA_POOL,
  ABA_DEFAULT,
  JOTFORM_NO_ANSWER_TIMEOUT_MS,
  PARKING_LOT_RETENTION_MS,
  REMINDER_OPTIONS_MS,
  DAILY_PULSE_ORDER,
  CROWN_ORDER,
  VOICE,
} from '../src/canon/constants.js';

describe('§4 — 13-name ABA pool', () => {
  it('has exactly 13 entries', () => {
    expect(ABA_POOL.length).toBe(13);
  });
  it('first 3 are LOCKED: Max, Atlas, Athos', () => {
    expect(ABA_POOL.slice(0, 3).map((a) => a.name)).toEqual(['Max', 'Atlas', 'Athos']);
    for (const a of ABA_POOL.slice(0, 3)) expect(a.status).toBe('LOCKED');
  });
  it('default is Max', () => {
    expect(ABA_DEFAULT).toBe('Max');
  });
});

describe('§5 — timing constants', () => {
  it('50-second no-answer timeout', () => {
    expect(JOTFORM_NO_ANSWER_TIMEOUT_MS).toBe(50 * 1000);
  });
  it('72-hour Parking Lot window', () => {
    expect(PARKING_LOT_RETENTION_MS).toBe(72 * 60 * 60 * 1000);
  });
  it('reminder options: 30 min / 1 hour / never', () => {
    expect(REMINDER_OPTIONS_MS.THIRTY_MIN).toBe(30 * 60 * 1000);
    expect(REMINDER_OPTIONS_MS.ONE_HOUR).toBe(60 * 60 * 1000);
    expect(REMINDER_OPTIONS_MS.NEVER).toBe(null);
  });
});

describe('§3 — surface ordering', () => {
  it('Daily Pulse Row 5 order locked', () => {
    expect(DAILY_PULSE_ORDER).toEqual(['FAB', 'ITB', 'BEACON', 'ROUTINE', 'PROD', 'PARK']);
  });
  it('Crown Row 1 order locked', () => {
    expect(CROWN_ORDER).toEqual(['R&R', 'Healthspan', 'My Blueprint', 'Inner Circle']);
  });
});

describe('§5 — Ollie voice lines locked', () => {
  it('"You got the message." — never Outlook-flavored', () => {
    expect(VOICE.ANNOUNCE).toBe('You got the message.');
    expect(VOICE.ANNOUNCE).not.toMatch(/mail|inbox|notification/i);
  });
  it('"You got it — are you ready — yes or no?"', () => {
    expect(VOICE.PROMPT).toBe('You got it — are you ready — yes or no?');
  });
  it('Evening intro is template-interpolated', () => {
    expect(VOICE.EVENING_INTRO('Max')).toBe('Let me bring Max.');
    expect(VOICE.EVENING_INTRO('Athos')).toBe('Let me bring Athos.');
  });
});
