/**
 * §6 Dual AI Protocol — Ollie always introduces ABA. ABA never appears alone.
 */

import { describe, it, expect } from 'vitest';
import { composeEveningHandoff, composeAmbienceHandoff } from '../src/flows/dualAIEveningFlow.js';

describe('§6 Dual AI End-of-Day Protocol', () => {
  it('Ollie introduces ABA with locked voice line', () => {
    const out = composeEveningHandoff('Max', 1);
    expect(out.ollieLine).toBe('Let me bring Max.');
  });

  it('Day 1 ABA message contains "Dr. Andrei is sending you"', () => {
    const out = composeEveningHandoff('Atlas', 1);
    expect(out.abaBubble.text).toContain('Dr. Andrei is sending you');
    expect(out.abaBubble.speaker).toBe('aba');
    expect(out.abaBubble.expression).toBe('PURPLE');
  });

  it('ABA name is interpolated, never hardcoded', () => {
    const max = composeEveningHandoff('Max', 1);
    const atlas = composeEveningHandoff('Atlas', 1);
    const athos = composeEveningHandoff('Athos', 1);
    expect(max.ollieLine).toContain('Max');
    expect(atlas.ollieLine).toContain('Atlas');
    expect(athos.ollieLine).toContain('Athos');
  });

  it('Day 2+ rotates messages (TBD content tagged honestly)', () => {
    const day2 = composeEveningHandoff('Max', 2);
    expect(day2.abaBubble.text.toLowerCase()).toContain('day 2');
  });

  it('Evening ambience handoff includes ABA name + locked phrasing', () => {
    const text = composeAmbienceHandoff('Max');
    expect(text).toContain('Max');
    expect(text).toMatch(/let\s+max\s+tell\s+you/i);
  });
});
