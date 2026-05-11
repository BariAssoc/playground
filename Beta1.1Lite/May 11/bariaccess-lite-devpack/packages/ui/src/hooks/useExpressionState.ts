/**
 * useExpressionState — convenience hook over expressionStore.
 * Exposes current state + setters with stable references.
 */

import { useExpressionStore } from '../state/expressionStore.js';
import type { ExpressionState } from '../theme/palette.js';

export function useExpressionState() {
  const current = useExpressionStore((s) => s.current);
  const set = useExpressionStore((s) => s.set);
  const setNight = useExpressionStore((s) => s.setNight);
  const isNight = current === 'WHITE';
  return { current, set, setNight, isNight };
}

export type { ExpressionState };
