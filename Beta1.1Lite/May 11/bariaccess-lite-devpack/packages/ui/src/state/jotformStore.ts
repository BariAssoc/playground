/**
 * JotForm state store — implements §5 JotForm Notification Flow 6-step state machine.
 *
 * §5 steps:
 *   1. Announcement              → status: ANNOUNCED, expression: BLUE
 *   2. Prompt                    → (same)
 *   3a. Yes → Now                → status: WORKPAD_OPEN, expression: GREEN
 *   3b. Yes → Later              → status: DEFERRED, expression: ORANGE
 *   3c. No answer in 50 sec      → status: DEFERRED with default 1h reminder
 *   4. Reminder picker shown     → status: REMINDER_SHOWN (ONE CHANCE)
 *   5. No response to reminder   → status: PARKED, 72h countdown begins
 *   6. 72h expired               → status: ARCHIVED, marked incomplete
 */

import { create } from 'zustand';
import {
  DEFAULT_REMINDER_MS,
  JOTFORM_NO_ANSWER_TIMEOUT_MS,
  PARKING_LOT_RETENTION_MS,
} from '../canon/constants.js';
import type { JotFormItem, JotFormStatus } from '../types/ui.js';

interface JotFormStore {
  items: Record<string, JotFormItem>;
  /** Currently-foregrounded JotForm id (announcement target). null = none. */
  foregroundId: string | null;

  // ── Lifecycle actions ──────────────────────────────────────
  announce: (item: Pick<JotFormItem, 'id' | 'title' | 'body'>) => void;
  /** §5 Step 3a — Yes → Now */
  acceptNow: (id: string) => void;
  /** §5 Step 3b — Yes → Later */
  deferLater: (id: string) => void;
  /** §5 Step 3c — 50-sec timeout, default 1h reminder */
  timeoutNoAnswer: (id: string) => void;
  /** §5 Step 4 — User selects reminder option (ONE CHANCE) */
  pickReminder: (id: string, msFromNow: number | null) => void;
  /** §5 Step 5 — Reminder fires without response → Parking Lot */
  dropToParking: (id: string) => void;
  /** §5 Step 6 — 72h elapsed → archive marked incomplete */
  archive: (id: string) => void;
  /** Happy-path completion (WorkPad finished) */
  complete: (id: string) => void;
  /** Get items by status */
  byStatus: (status: JotFormStatus) => JotFormItem[];
}

const setStatus = (item: JotFormItem, status: JotFormStatus): JotFormItem => ({
  ...item,
  status,
  expression:
    status === 'ANNOUNCED' || status === 'IDLE' ? 'BLUE'
    : status === 'WORKPAD_OPEN' || status === 'COMPLETED' ? 'GREEN'
    : status === 'ARCHIVED' ? 'RED'
    : 'ORANGE',
});

export const useJotFormStore = create<JotFormStore>((set, get) => ({
  items: {},
  foregroundId: null,

  announce: ({ id, title, body }) => {
    const now = Date.now();
    const item: JotFormItem = {
      id,
      title,
      body,
      announcedAt: now,
      parkedAt: null,
      reminderAt: null,
      reminderSelected: false,
      status: 'ANNOUNCED',
      expression: 'BLUE',
    };
    set((s) => ({ items: { ...s.items, [id]: item }, foregroundId: id }));
  },

  acceptNow: (id) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      return { items: { ...s.items, [id]: setStatus(item, 'WORKPAD_OPEN') } };
    });
  },

  deferLater: (id) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      return { items: { ...s.items, [id]: setStatus(item, 'DEFERRED') } };
    });
  },

  timeoutNoAnswer: (id) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      const reminderAt = Date.now() + DEFAULT_REMINDER_MS;
      return {
        items: {
          ...s.items,
          [id]: { ...setStatus(item, 'DEFERRED'), reminderAt },
        },
        foregroundId: null,
      };
    });
  },

  pickReminder: (id, msFromNow) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      // ONE CHANCE — if already selected, no-op
      if (item.reminderSelected) return s;
      const reminderAt = msFromNow === null ? null : Date.now() + msFromNow;
      return {
        items: {
          ...s.items,
          [id]: {
            ...setStatus(item, 'DEFERRED'),
            reminderAt,
            reminderSelected: true,
          },
        },
      };
    });
  },

  dropToParking: (id) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      return {
        items: {
          ...s.items,
          [id]: { ...setStatus(item, 'PARKED'), parkedAt: Date.now() },
        },
      };
    });
  },

  archive: (id) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      return { items: { ...s.items, [id]: setStatus(item, 'ARCHIVED') } };
    });
  },

  complete: (id) => {
    set((s) => {
      const item = s.items[id];
      if (!item) return s;
      return { items: { ...s.items, [id]: setStatus(item, 'COMPLETED') } };
    });
  },

  byStatus: (status) =>
    Object.values(get().items).filter((i) => i.status === status),
}));

// ────────────────────────────────────────────────────────────
// Tick helper — call from a top-level useEffect to expire Parking Lot
// items past their 72-hour retention into ARCHIVED.
// ────────────────────────────────────────────────────────────

export function tickParkingLot(): void {
  const store = useJotFormStore.getState();
  const now = Date.now();
  for (const item of Object.values(store.items)) {
    if (item.status === 'PARKED' && item.parkedAt !== null) {
      if (now - item.parkedAt >= PARKING_LOT_RETENTION_MS) {
        store.archive(item.id);
      }
    }
  }
}

export { JOTFORM_NO_ANSWER_TIMEOUT_MS };
