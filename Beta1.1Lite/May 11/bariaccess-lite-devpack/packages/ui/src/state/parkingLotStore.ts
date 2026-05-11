/**
 * Parking Lot store — surfaces a sorted view of JotForms held in the 72-hour window.
 * This is a derived view over jotformStore; no separate state of its own.
 * Provides hooks for the Parking Lot screen + counters.
 */

import { useJotFormStore } from './jotformStore.js';
import { PARKING_LOT_RETENTION_MS } from '../canon/constants.js';
import type { JotFormItem } from '../types/ui.js';

export interface ParkedView {
  item: JotFormItem;
  /** ms remaining in the 72-hour window */
  remainingMs: number;
  /** Formatted HH:MM:SS countdown */
  remainingLabel: string;
}

export function getParkedItems(): ParkedView[] {
  const items = useJotFormStore.getState().byStatus('PARKED');
  const now = Date.now();
  return items
    .filter((i) => i.parkedAt !== null)
    .map((item) => {
      const elapsed = now - (item.parkedAt ?? now);
      const remainingMs = Math.max(0, PARKING_LOT_RETENTION_MS - elapsed);
      return {
        item,
        remainingMs,
        remainingLabel: formatHMS(remainingMs),
      };
    })
    .sort((a, b) => a.remainingMs - b.remainingMs);
}

export function formatHMS(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600).toString().padStart(2, '0');
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}
