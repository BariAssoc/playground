/**
 * Educational card — generic content card with "Explore" CTA.
 * Used for Programs, Daily Learning, and other educational content.
 */

import React from 'react';
import { SHADOW } from '../../theme/tokens.js';

interface EducationalCardProps {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  onExplore?: () => void;
}

export const EducationalCard: React.FC<EducationalCardProps> = ({
  eyebrow = 'EDUCATIONAL',
  title,
  body,
  ctaLabel = 'Explore ›',
  onExplore,
}) => (
  <div
    className="rounded-2xl p-3 bg-white flex flex-col justify-between"
    style={{ boxShadow: SHADOW.card }}
  >
    <div>
      <div className="text-[10px] font-semibold tracking-wider text-gray-500">{eyebrow}</div>
      <div className="text-sm font-semibold leading-tight mt-1 text-gray-900">{title}</div>
      {body && <div className="text-[10px] mt-1 text-gray-500">{body}</div>}
    </div>
    <button
      type="button"
      onClick={onExplore}
      className="mt-2 self-start px-3 py-1 rounded-full text-[11px] font-medium"
      style={{ border: '1px solid #3B82F6', color: '#3B82F6' }}
    >
      {ctaLabel}
    </button>
  </div>
);
