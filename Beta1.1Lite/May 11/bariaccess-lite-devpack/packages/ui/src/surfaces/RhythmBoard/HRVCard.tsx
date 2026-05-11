/**
 * HRV Card — V1 biometric card in upper Rhythm Board.
 * Renders headline HRV value + 7-day delta + mini sparkline.
 * Live screenshots IMG_2737 / IMG_2735.
 */

import React from 'react';
import { SHADOW } from '../../theme/tokens.js';

interface HRVCardProps {
  ms: number;
  delta?: number;
  trend?: number[];
  weekLabels?: string[];
}

export const HRVCard: React.FC<HRVCardProps> = ({
  ms,
  delta = 0,
  trend = [15, 11, 13, 8, 9, 7, 5],
  weekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
}) => {
  const points = trend
    .map((y, i) => `${(i / (trend.length - 1)) * 100},${22 - (y / 22) * 22}`)
    .join(' ');
  const deltaLabel = delta === 0 ? '+0 ms' : `${delta > 0 ? '+' : ''}${delta} ms`;
  const deltaColor = delta < 0 ? '#F97316' : '#22C55E';
  return (
    <div className="rounded-2xl p-3 bg-white" style={{ boxShadow: SHADOW.card }}>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-semibold tracking-wider text-gray-500">HRV</span>
        <span className="text-[10px]" style={{ color: deltaColor }}>{deltaLabel}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-bold text-green-500" style={{ lineHeight: 1 }}>{ms}</span>
        <span className="text-[10px] text-gray-500">ms</span>
      </div>
      <svg viewBox="0 0 100 22" className="w-full mt-2" style={{ height: 22 }}>
        <polyline fill="none" stroke="#22C55E" strokeWidth="1.3" points={points} />
      </svg>
      <div className="flex justify-between text-[9px] mt-1 text-gray-500">
        {weekLabels.map((d, i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  );
};
