/**
 * Q inbox store — THE inbox per §3.
 * Voice line: "You got the message." (never "you got mail").
 *
 * Q populates from:
 *   - Ollie announcements (JotForm, Memory Snap)
 *   - ABA-routed messages
 *   - Provider messages (future, when backend wires this)
 *   - "Save to Q" buttons in WorkPad cards
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { QItem } from '../types/ui.js';

interface QStore {
  items: QItem[];
  unreadCount: () => number;
  add: (item: Omit<QItem, 'id' | 'receivedAt' | 'read'>) => string;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useQStore = create<QStore>()(
  persist(
    (set, get) => ({
      items: [],

      unreadCount: () => get().items.filter((i) => !i.read).length,

      add: (input) => {
        const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const item: QItem = {
          ...input,
          id,
          receivedAt: Date.now(),
          read: false,
        };
        set((s) => ({ items: [item, ...s.items] }));
        return id;
      },

      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        })),

      markAllRead: () =>
        set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'bariaccess.q.v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
