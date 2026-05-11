/**
 * useJotFormLifecycleTick — Mount once at App level.
 * Ticks the JotForm lifecycle every 30 seconds to expire stale Parking Lot
 * items into the Three Dots archive.
 */

import { useEffect } from 'react';
import { tickJotFormLifecycle } from '../flows/jotFormFlow.js';

export function useJotFormLifecycleTick(intervalMs = 30 * 1000) {
  useEffect(() => {
    const id = setInterval(tickJotFormLifecycle, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
