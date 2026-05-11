/**
 * Parking Lot — 72-hour retention + countdown formatting.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useJotFormStore, tickParkingLot } from '../src/state/jotformStore.js';
import { getParkedItems, formatHMS } from '../src/state/parkingLotStore.js';
import { PARKING_LOT_RETENTION_MS } from '../src/canon/constants.js';

describe('Parking Lot', () => {
  beforeEach(() => {
    useJotFormStore.setState({ items: {}, foregroundId: null });
    vi.useRealTimers();
  });

  it('formatHMS pads correctly', () => {
    expect(formatHMS(0)).toBe('00:00:00');
    expect(formatHMS(72 * 3600 * 1000)).toBe('72:00:00');
    expect(formatHMS(65_000)).toBe('00:01:05');
  });

  it('items appear sorted by remaining time ascending', () => {
    useJotFormStore.getState().announce({ id: 'a', title: 'A' });
    useJotFormStore.getState().dropToParking('a');
    // Slightly older
    useJotFormStore.setState((s) => ({
      items: {
        ...s.items,
        a: { ...s.items.a, parkedAt: (s.items.a.parkedAt ?? 0) - 60_000 },
      },
    }));
    useJotFormStore.getState().announce({ id: 'b', title: 'B' });
    useJotFormStore.getState().dropToParking('b');

    const items = getParkedItems();
    expect(items.length).toBe(2);
    expect(items[0].item.id).toBe('a'); // a is older, less remaining
  });

  it('tick archives items past 72h window', () => {
    useJotFormStore.getState().announce({ id: 'stale', title: 'Stale' });
    useJotFormStore.getState().dropToParking('stale');
    useJotFormStore.setState((s) => ({
      items: {
        ...s.items,
        stale: { ...s.items.stale, parkedAt: Date.now() - PARKING_LOT_RETENTION_MS - 1 },
      },
    }));
    tickParkingLot();
    expect(useJotFormStore.getState().items.stale.status).toBe('ARCHIVED');
  });
});
