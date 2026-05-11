/**
 * Program card — paginated card stack inside Rhythm Board.
 * Screenshots IMG_2737 (Card 1 / 13) confirm paginated cards.
 * "Card system" → planned canon CCO-UX-RBCARD-001.
 */

import React from 'react';
import { Maximize2 } from 'lucide-react';
import { SHADOW } from '../../theme/tokens.js';

interface ProgramCardProps {
  eyebrow: string;
  cardIndex: number;
  cardTotal: number;
  title: string;
  children?: React.ReactNode;
  onExpand?: () => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  eyebrow,
  cardIndex,
  cardTotal,
  title,
  children,
  onExpand,
}) => (
  <div className="rounded-2xl p-3 bg-white" style={{ boxShadow: SHADOW.card }}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold tracking-wider text-gray-500 truncate">
        {eyebrow}
      </span>
      <button
        type="button"
        onClick={onExpand}
        className="flex items-center gap-1 text-[10px] font-semibold"
        style={{ color: '#3B82F6' }}
      >
        Card {cardIndex} <Maximize2 size={11} />
      </button>
    </div>
    <div className="text-sm font-bold mt-1 text-gray-900 leading-tight">{title}</div>
    <div className="mt-2 text-[10px] text-gray-700">{children}</div>
    <div className="text-right text-[9px] text-gray-400 mt-2">
      {cardIndex} / {cardTotal}
    </div>
  </div>
);
