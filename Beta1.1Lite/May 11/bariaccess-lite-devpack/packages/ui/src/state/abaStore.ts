/**
 * ABA companion store — user's chosen ABA name + voice (§4).
 * Persisted to localStorage so it survives reloads.
 * TODO (backend): swap localStorage for user-profile API once backend supports it.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ABA_DEFAULT, ABA_POOL, type AbaName } from '../canon/constants.js';

interface AbaStore {
  name: string;
  voiceId: string | null;
  setName: (name: string) => void;
  setVoice: (voiceId: string) => void;
  /** Read-only view of the 13-pool */
  pool: readonly AbaName[];
}

export const useAbaStore = create<AbaStore>()(
  persist(
    (set) => ({
      name: ABA_DEFAULT,
      voiceId: null,
      setName: (name) => set({ name }),
      setVoice: (voiceId) => set({ voiceId }),
      pool: ABA_POOL,
    }),
    {
      name: 'bariaccess.aba.v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ name: s.name, voiceId: s.voiceId }),
    },
  ),
);
