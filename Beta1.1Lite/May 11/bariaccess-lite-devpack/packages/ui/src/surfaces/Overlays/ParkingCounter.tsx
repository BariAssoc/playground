/**
 * Parking Lot inline counter — surfaces "PARKING LOT 72:00:00" at top of screen
 * when a JotForm has just been parked. Per §5 Step 5.
 */

import React from 'react';
import { EXPRESSION } from '../../theme/palette.js';

interface ParkingCounterProps {
  label?: string;
}

export const ParkingCounter: React.FC<ParkingCounterProps> = ({ label = '72:00:00' }) => {
  const tokens = EXPRESSION.ORANGE;
  return (
    <div
      className="absolute left-3 right-3 top-[60px] z-20 rounded-xl p-2 flex items-center justify-between"
      style={{ background: tokens.bubbleBg, border: `1.5px solid ${tokens.border}` }}
    >
      <span
        className="text-[10px] font-semibold tracking-wider"
        style={{ color: tokens.text }}
      >
        PARKING LOT
      </span>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: tokens.text }}>
        {label}
      </span>
    </div>
  );
};
