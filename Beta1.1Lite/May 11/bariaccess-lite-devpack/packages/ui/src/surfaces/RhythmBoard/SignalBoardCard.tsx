/**
 * Signal Board card — V1 biometric inputs from screenshots IMG_2733/IMG_2734.
 * Sleep Score · Deep Sleep · Resting HR · Temperature · O2 Saturation.
 *
 * Not yet locked in CCO-LITE-BETA-UI-001 v1.0 — see canon v1.1 amendment proposal.
 * Bar color: green when in personal range; placeholder for orange/red out-of-range.
 */

import React from 'react';
import { SHADOW } from '../../theme/tokens.js';

export interface SignalRow {
  label: string;
  /** Fill percentage 0-100 */
  pct: number;
  /** Right-side value display */
  value: string;
  /** Override the fill color (defaults to green) */
  color?: string;
}

interface SignalBoardCardProps {
  rows: SignalRow[];
}

export const SignalBoardCard: React.FC<SignalBoardCardProps> = ({ rows }) => (
  <div className="rounded-2xl p-3 bg-white" style={{ boxShadow: SHADOW.card }}>
    <div className="text-[10px] font-bold tracking-[0.18em] text-gray-700 mb-2">
      SIGNAL BOARD
    </div>
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => {
        const color = row.color ?? '#22C55E';
        return (
          <div key={row.label} className="flex items-center gap-2 text-[10px]">
            <span className="text-gray-700 truncate" style={{ width: '34%' }}>
              {row.label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, row.pct))}%`, background: color }}
              />
            </div>
            <span className="font-medium" style={{ color, width: '20%', textAlign: 'right' }}>
              {row.value}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);
