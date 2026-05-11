/**
 * OllieIcon — the BariAccess Ollie owl mark.
 * Per §6 Dual AI: when ABA is the active speaker, Ollie's icon DIMS
 * but stays visible (visual enforcement of "ABA never appears alone").
 */

import React from 'react';

interface OllieIconProps {
  active?: boolean;
  size?: number;
}

export const OllieIcon: React.FC<OllieIconProps> = ({ active = true, size = 24 }) => (
  <div
    className="rounded-full flex items-center justify-center select-none"
    style={{
      width: size,
      height: size,
      background: active ? '#92400E' : '#FCD34D',
      opacity: active ? 1 : 0.35,
      transition: 'opacity 500ms ease',
      fontSize: size * 0.6,
      lineHeight: 1,
    }}
    aria-label="Ollie"
    role="img"
  >
    🦉
  </div>
);
