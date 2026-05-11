/**
 * §5 JotForm Notification Flow — full 6-step lifecycle.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useJotFormStore } from '../src/state/jotformStore.js';

describe('§5 JotForm 6-step flow', () => {
  beforeEach(() => {
    useJotFormStore.setState({ items: {}, foregroundId: null });
  });

  it('Step 1+2 — announce sets BLUE + ANNOUNCED', () => {
    useJotFormStore.getState().announce({ id: 'jf-1', title: 'Test' });
    const item = useJotFormStore.getState().items['jf-1'];
    expect(item.status).toBe('ANNOUNCED');
    expect(item.expression).toBe('BLUE');
    expect(useJotFormStore.getState().foregroundId).toBe('jf-1');
  });

  it('Step 3a — acceptNow opens WorkPad (GREEN)', () => {
    useJotFormStore.getState().announce({ id: 'jf-2', title: 'Test' });
    useJotFormStore.getState().acceptNow('jf-2');
    const item = useJotFormStore.getState().items['jf-2'];
    expect(item.status).toBe('WORKPAD_OPEN');
    expect(item.expression).toBe('GREEN');
  });

  it('Step 3b — deferLater turns ORANGE', () => {
    useJotFormStore.getState().announce({ id: 'jf-3', title: 'Test' });
    useJotFormStore.getState().deferLater('jf-3');
    const item = useJotFormStore.getState().items['jf-3'];
    expect(item.status).toBe('DEFERRED');
    expect(item.expression).toBe('ORANGE');
  });

  it('Step 4 — ONE CHANCE: second pickReminder is ignored', () => {
    useJotFormStore.getState().announce({ id: 'jf-4', title: 'Test' });
    useJotFormStore.getState().pickReminder('jf-4', 30 * 60 * 1000);
    const t1 = useJotFormStore.getState().items['jf-4'].reminderAt;
    // Second call should NOT change reminderAt — one chance only
    useJotFormStore.getState().pickReminder('jf-4', 60 * 60 * 1000);
    const t2 = useJotFormStore.getState().items['jf-4'].reminderAt;
    expect(t2).toBe(t1);
    expect(useJotFormStore.getState().items['jf-4'].reminderSelected).toBe(true);
  });

  it('Step 5 — dropToParking sets PARKED with parkedAt', () => {
    useJotFormStore.getState().announce({ id: 'jf-5', title: 'Test' });
    const before = Date.now();
    useJotFormStore.getState().dropToParking('jf-5');
    const item = useJotFormStore.getState().items['jf-5'];
    expect(item.status).toBe('PARKED');
    expect(item.parkedAt).toBeGreaterThanOrEqual(before);
  });

  it('Step 6 — archive sets ARCHIVED + RED expression', () => {
    useJotFormStore.getState().announce({ id: 'jf-6', title: 'Test' });
    useJotFormStore.getState().archive('jf-6');
    const item = useJotFormStore.getState().items['jf-6'];
    expect(item.status).toBe('ARCHIVED');
    expect(item.expression).toBe('RED');
  });

  it('happy path — complete sets COMPLETED + GREEN', () => {
    useJotFormStore.getState().announce({ id: 'jf-7', title: 'Test' });
    useJotFormStore.getState().acceptNow('jf-7');
    useJotFormStore.getState().complete('jf-7');
    const item = useJotFormStore.getState().items['jf-7'];
    expect(item.status).toBe('COMPLETED');
    expect(item.expression).toBe('GREEN');
  });
});
