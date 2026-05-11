/**
 * Reminder picker — §5 Step 4.
 * 30 min / 1 hour / never — ONE CHANCE ONLY.
 * If user dismisses or ignores the picker, default behavior takes over.
 * No second chance.
 */

import React from 'react';
import { EXPRESSION } from '../../theme/palette.js';
import { REMINDER_OPTIONS_MS } from '../../canon/constants.js';
import { SHADOW } from '../../theme/tokens.js';

interface ReminderPickerProps {
  onPick: (msFromNow: number | null) => void;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({ onPick }) => {
  const tokens = EXPRESSION.ORANGE;
  return (
    <div
      className="absolute left-3 right-3 bottom-[268px] z-20 rounded-2xl p-3"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${tokens.border}`,
        boxShadow: SHADOW.overlay,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-semibold tracking-wider"
          style={{ color: tokens.text }}
        >
          REMINDER
        </span>
        <span
          className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: tokens.dot, color: '#FFFFFF' }}
        >
          ONE CHANCE
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPick(REMINDER_OPTIONS_MS.THIRTY_MIN)}
          className="flex-1 py-2 rounded-xl text-[11px] font-semibold"
          style={{
            background: tokens.bubbleBg,
            color: tokens.text,
            border: `1px solid ${tokens.border}`,
          }}
        >
          30 min
        </button>
        <button
          type="button"
          onClick={() => onPick(REMINDER_OPTIONS_MS.ONE_HOUR)}
          className="flex-1 py-2 rounded-xl text-[11px] font-semibold"
          style={{
            background: tokens.bubbleBg,
            color: tokens.text,
            border: `1px solid ${tokens.border}`,
          }}
        >
          1 hour
        </button>
        <button
          type="button"
          onClick={() => onPick(REMINDER_OPTIONS_MS.NEVER)}
          className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-gray-500"
          style={{ background: '#F3F4F6' }}
        >
          never
        </button>
      </div>
    </div>
  );
};
