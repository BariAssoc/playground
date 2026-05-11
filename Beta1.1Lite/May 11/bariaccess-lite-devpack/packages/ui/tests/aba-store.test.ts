/**
 * ABA store — name + voice persistence.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAbaStore } from '../src/state/abaStore.js';
import { ABA_DEFAULT, ABA_POOL } from '../src/canon/constants.js';

describe('ABA store', () => {
  beforeEach(() => {
    useAbaStore.setState({ name: ABA_DEFAULT, voiceId: null });
  });

  it('default is Max', () => {
    expect(useAbaStore.getState().name).toBe('Max');
  });

  it('setName updates the store', () => {
    useAbaStore.getState().setName('Atlas');
    expect(useAbaStore.getState().name).toBe('Atlas');
  });

  it('setVoice updates the voice', () => {
    useAbaStore.getState().setVoice('voice-2-male');
    expect(useAbaStore.getState().voiceId).toBe('voice-2-male');
  });

  it('pool is the 13-name list', () => {
    expect(useAbaStore.getState().pool.length).toBe(ABA_POOL.length);
  });
});
