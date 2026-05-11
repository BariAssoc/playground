/**
 * Q inbox — add / mark read / unread count behavior.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useQStore } from '../src/state/qStore.js';

describe('Q inbox (§3 — voice "You got the message.")', () => {
  beforeEach(() => {
    useQStore.setState({ items: [] });
  });

  it('add returns a stable id + inserts at head', () => {
    const id1 = useQStore.getState().add({
      kind: 'jotform',
      source: 'ollie',
      title: 'Hello',
      preview: 'preview',
    });
    const id2 = useQStore.getState().add({
      kind: 'jotform',
      source: 'ollie',
      title: 'Hello 2',
      preview: 'preview',
    });
    const items = useQStore.getState().items;
    expect(items[0].id).toBe(id2);
    expect(items[1].id).toBe(id1);
  });

  it('unreadCount reflects unread items', () => {
    useQStore.getState().add({ kind: 'jotform', source: 'ollie', title: 'a', preview: '' });
    useQStore.getState().add({ kind: 'jotform', source: 'ollie', title: 'b', preview: '' });
    expect(useQStore.getState().unreadCount()).toBe(2);
    const id = useQStore.getState().items[0].id;
    useQStore.getState().markRead(id);
    expect(useQStore.getState().unreadCount()).toBe(1);
    useQStore.getState().markAllRead();
    expect(useQStore.getState().unreadCount()).toBe(0);
  });

  it('remove deletes an item', () => {
    const id = useQStore.getState().add({
      kind: 'jotform', source: 'ollie', title: 'a', preview: '',
    });
    useQStore.getState().remove(id);
    expect(useQStore.getState().items.length).toBe(0);
  });
});
