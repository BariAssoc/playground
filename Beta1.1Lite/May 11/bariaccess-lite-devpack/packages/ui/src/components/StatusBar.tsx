/**
 * StatusBar — iOS status row (time + signal/wifi/battery).
 * Cosmetic only — does not reflect real device state.
 */

import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

interface StatusBarProps {
  time?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = '10:25' }) => (
  <div
    className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold"
    style={{ color: '#000', height: 36 }}
  >
    <span>{time}</span>
    <span className="flex items-center gap-1">
      <Signal size={12} />
      <Wifi size={12} />
      <Battery size={14} />
    </span>
  </div>
);
