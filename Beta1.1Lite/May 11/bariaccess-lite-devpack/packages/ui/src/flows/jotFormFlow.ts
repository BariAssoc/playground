/**
 * jotFormFlow — runtime orchestrator for §5 JotForm Notification Flow.
 *
 * Coordinates jotformStore + qStore + expressionStore.
 * Sets timers for §5 Step 3c (50-sec no-answer) and reminder firing.
 * Schedules archival when 72h window expires.
 */

import { useJotFormStore, tickParkingLot, JOTFORM_NO_ANSWER_TIMEOUT_MS } from '../state/jotformStore.js';
import { useQStore } from '../state/qStore.js';
import { useExpressionStore } from '../state/expressionStore.js';
import { VOICE } from '../canon/constants.js';

interface AnnounceArgs {
  id: string;
  title: string;
  body?: string;
}

/** Step 1+2 — Ollie's Space announces JotForm; surface goes BLUE. */
export function announceJotForm({ id, title, body }: AnnounceArgs): void {
  const jot = useJotFormStore.getState();
  jot.announce({ id, title, body });
  useExpressionStore.getState().set('BLUE');

  // Auto-add to Q (mirror of Ollie's announcement)
  useQStore.getState().add({
    kind: 'jotform',
    source: 'ollie',
    title,
    preview: VOICE.PROMPT,
    refId: id,
  });

  // §5 Step 3c — 50-second no-answer timeout
  setTimeout(() => {
    const current = useJotFormStore.getState().items[id];
    if (current && current.status === 'ANNOUNCED') {
      useJotFormStore.getState().timeoutNoAnswer(id);
      useExpressionStore.getState().set('ORANGE');
    }
  }, JOTFORM_NO_ANSWER_TIMEOUT_MS);
}

/** Step 3a — Yes → Now → WorkPad opens; surface goes GREEN. */
export function acceptNow(id: string): void {
  useJotFormStore.getState().acceptNow(id);
  useExpressionStore.getState().set('GREEN');
}

/** Step 3b — Yes → Later → Bookshelf turns; surface goes ORANGE. */
export function deferLater(id: string): void {
  useJotFormStore.getState().deferLater(id);
  useExpressionStore.getState().set('ORANGE');
}

/** Step 4 — User picks reminder window. ONE CHANCE. */
export function pickReminder(id: string, msFromNow: number | null): void {
  useJotFormStore.getState().pickReminder(id, msFromNow);

  if (msFromNow !== null) {
    setTimeout(() => {
      const current = useJotFormStore.getState().items[id];
      if (current && (current.status === 'DEFERRED' || current.status === 'REMINDER_SHOWN')) {
        // No response to the reminder → §5 Step 5 → Parking Lot
        useJotFormStore.getState().dropToParking(id);
      }
    }, msFromNow);
  } else {
    // User chose "never" — drop straight to Parking Lot
    useJotFormStore.getState().dropToParking(id);
  }
}

/** WorkPad finished → mark complete; surface goes GREEN. */
export function completeJotForm(id: string): void {
  useJotFormStore.getState().complete(id);
  useExpressionStore.getState().set('GREEN');
}

/**
 * Top-level tick — call from App useEffect every 30 sec or so.
 * Walks Parking Lot, archives any items past 72h.
 */
export function tickJotFormLifecycle(): void {
  tickParkingLot();
}
