/**
 * dualAIEveningFlow — orchestrates §6 Dual AI End-of-Day Protocol.
 *
 * Step 1: Evening trigger fires → Ollie says "Let me bring [ABA]."     (BLUE)
 * Step 2: ABA introduced — surprise, never arrives alone               (still BLUE briefly)
 * Step 3: ABA Day-1 message renders                                    (PURPLE, ABA active)
 * Step 4: Day 2+ rotating messages                                     (PURPLE)
 * Step 5: Evening ambience handoff                                     (PURPLE)
 *
 * "Patentable element is the structured handoff" — keep this code
 * canon-locked.
 */

import { useExpressionStore } from '../state/expressionStore.js';
import { useAbaStore } from '../state/abaStore.js';
import { VOICE } from '../canon/constants.js';
import type { DualAIBubble } from '../types/ui.js';

interface EveningResult {
  ollieLine: string;
  abaBubble: DualAIBubble;
}

/** Compose the evening handoff bubble. Pure — no side effects. */
export function composeEveningHandoff(abaName: string, dayN: number): EveningResult {
  const ollieLine = VOICE.EVENING_INTRO(abaName);
  const text =
    dayN === 1
      ? VOICE.ABA_DAY_1
      : `Day ${dayN} — keep going. (Rotating messages TBD by Val.)`;
  return {
    ollieLine,
    abaBubble: {
      speaker: 'aba',
      text,
      ollieLeadIn: ollieLine,
      expression: 'PURPLE',
    },
  };
}

/** Run the Step 1 → Step 3 transition: BLUE intro → PURPLE handoff. */
export function runEveningHandoff(dayN = 1): EveningResult {
  const abaName = useAbaStore.getState().name;
  useExpressionStore.getState().set('BLUE');
  const out = composeEveningHandoff(abaName, dayN);
  // 800 ms after intro, switch to PURPLE — ABA takes over
  setTimeout(() => {
    useExpressionStore.getState().set('PURPLE');
  }, 800);
  return out;
}

/** Step 5 — Evening ambience handoff text. */
export function composeAmbienceHandoff(abaName: string): string {
  return VOICE.EVENING_AMBIENCE(abaName);
}
