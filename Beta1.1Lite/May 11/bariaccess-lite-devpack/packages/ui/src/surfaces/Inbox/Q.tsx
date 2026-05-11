/**
 * Q — THE inbox per §3 Surface Inventory.
 * Never "box", never "queue", never "inbox-Q".
 * Voice line: "You got the message."
 *
 * Renders the user's Q items sorted by receivedAt desc.
 * Unread items show a 🔵 Blue dot per §2 Expression Color Code.
 */

import React from 'react';
import { useQStore } from '../../state/qStore.js';
import { EXPRESSION } from '../../theme/palette.js';
import type { QItem } from '../../types/ui.js';

interface QProps {
  onItemSelect?: (item: QItem) => void;
}

export const Q: React.FC<QProps> = ({ onItemSelect }) => {
  const items = useQStore((s) => s.items);
  const markRead = useQStore((s) => s.markRead);

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-[12px]">
        No messages. Empty Q.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            markRead(item.id);
            onItemSelect?.(item);
          }}
          className="text-left rounded-xl p-3 bg-white flex items-start gap-2"
          style={{ border: '1px solid #E5E7EB' }}
        >
          {!item.read && (
            <span
              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: EXPRESSION.BLUE.dot }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[12px] text-gray-900 truncate">
                {item.title}
              </span>
              <span className="text-[9px] text-gray-400 flex-shrink-0">
                {timeAgo(item.receivedAt)}
              </span>
            </div>
            <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
              {item.preview}
            </div>
            <div className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
              {item.kind} · {item.source}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
