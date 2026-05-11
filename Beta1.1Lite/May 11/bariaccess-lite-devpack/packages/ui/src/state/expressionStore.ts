/**
 * Expression state store — drives the current §2 Expression Color across surfaces.
 * Read by OllieSpace, AIPlayground, ExpressionBubble.
 */

import { create } from 'zustand';
import type { ExpressionState } from '../theme/palette.js';

interface ExpressionStore {
  current: ExpressionState;
  /** Set current expression state */
  set: (s: ExpressionState) => void;
  /** Force night mode regardless of other state */
  setNight: (on: boolean) => void;
  /** Convenience: is in night mode */
  isNight: () => boolean;
}

export const useExpressionStore = create<ExpressionStore>((set, get) => ({
  current: 'GREEN', // default — on track
  set: (s) => set({ current: s }),
  setNight: (on) => set({ current: on ? 'WHITE' : 'GREEN' }),
  isNight: () => get().current === 'WHITE',
}));
