/**
 * Three Dots archive — §3 Surface Inventory.
 * Final resting place for expired / incomplete items.
 * Archive label: "incomplete" — never "delinquent", never "failed".
 */

import React from 'react';
import { useJotFormStore } from '../../state/jotformStore.js';
import { EXPRESSION } from '../../theme/palette.js';

export const ThreeDots: React.FC = () => {
  const archived = useJotFormStore((s) =>
    Object.values(s.items).filter((i) => i.status === 'ARCHIVED'),
  );
  const tokens = EXPRESSION.RED;

  if (archived.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-[12px]">
        Three Dots archive is empty.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
        Three Dots · archive
      </div>
      {archived.map((item) => (
        <div
          key={item.id}
          className="rounded-xl p-3"
          style={{
            background: tokens.bubbleBg,
            border: `1.5px solid ${tokens.border}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: tokens.text }}>
              {item.title}
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: tokens.dot, color: '#FFFFFF' }}
            >
              incomplete
            </span>
          </div>
          {item.body && (
            <div className="text-[10px] mt-1 text-gray-700">{item.body}</div>
          )}
        </div>
      ))}
    </div>
  );
};
