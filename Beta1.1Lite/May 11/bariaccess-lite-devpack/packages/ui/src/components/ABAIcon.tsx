/**
 * ABAIcon — the user's configured ABA companion icon.
 * The initial letter (M for Max, A for Atlas/Athos) renders inside.
 * Per §6 — bright when active, dim when Ollie is speaking.
 */

import React from 'react';

interface ABAIconProps {
  active?: boolean;
  initial: string;
  size?: number;
}

export const ABAIcon: React.FC<ABAIconProps> = ({ active = true, initial, size = 24 }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white select-none"
    style={{
      width: size,
      height: size,
      background: active ? '#1F2937' : '#D1D5DB',
      opacity: active ? 1 : 0.35,
      transition: 'opacity 500ms ease',
      fontSize: size * 0.46,
      lineHeight: 1,
    }}
    aria-label={`ABA · ${initial}`}
    role="img"
  >
    {initial}
  </div>
);
