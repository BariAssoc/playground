/**
 * Parking Lot — 72-hour holding zone per §5 Step 5.
 *
 * After §5 Step 5, JotForms drop here. Each item carries a live HH:MM:SS
 * countdown until §5 Step 6 (archive marked incomplete).
 */

import React, { useEffect, useState } from 'react';
import { getParkedItems } from '../../state/parkingLotStore.js';
import { EXPRESSION } from '../../theme/palette.js';

export const ParkingLot: React.FC = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const items = getParkedItems();
  const tokens = EXPRESSION.ORANGE;

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-[12px]">
        Nothing parked.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
        Parking Lot — 72-hour window
      </div>
      {items.map(({ item, remainingLabel }) => (
        <div
          key={item.id}
          className="rounded-xl p-3 flex items-center justify-between"
          style={{
            background: tokens.bubbleBg,
            border: `1.5px solid ${tokens.border}`,
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold truncate" style={{ color: tokens.text }}>
              {item.title}
            </div>
            {item.body && (
              <div className="text-[10px] mt-0.5 text-gray-700 line-clamp-1">
                {item.body}
              </div>
            )}
          </div>
          <div
            className="text-[11px] font-bold tabular-nums ml-3"
            style={{ color: tokens.text }}
          >
            {remainingLabel}
          </div>
        </div>
      ))}
      <span className="hidden">{tick}</span>
    </div>
  );
};
