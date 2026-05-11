/**
 * Generic bottom-sheet card overlay — INTERACTION 2 (CCO-UX-RBCP-001):
 *   "When patient clicks a Q tab:
 *      → Content opens ON TOP of Constellation Panel
 *      → Constellation Panel is temporarily covered
 *      → Content displays above it
 *      → Constellation Panel returns when content is closed"
 *
 * Used by Program detail, JotForm detail, Memory Snap detail, etc.
 */

import React from 'react';
import { X } from 'lucide-react';
import { SHADOW } from '../../theme/tokens.js';

interface CardOverlayProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; onClick: () => void };
  onClose?: () => void;
  children?: React.ReactNode;
  /** Height of overlay (default 50%) */
  heightPct?: number;
}

export const CardOverlay: React.FC<CardOverlayProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  onClose,
  children,
  heightPct = 50,
}) => (
  <div
    className="absolute left-0 right-0 bottom-0 z-30 rounded-t-3xl p-4 flex flex-col"
    style={{ background: '#FFFFFF', boxShadow: SHADOW.workpad, height: `${heightPct}%` }}
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="text-base font-bold text-gray-900">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-gray-500 mt-0.5">{subtitle}</div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      )}
    </div>
    <div className="flex-1 mt-3 text-[11px] text-gray-700 leading-relaxed overflow-auto">
      {children}
    </div>
    {(primaryCta || secondaryCta) && (
      <div className="mt-3 flex gap-2">
        {secondaryCta && (
          <button
            type="button"
            onClick={secondaryCta.onClick}
            className="flex-1 py-2 rounded-xl text-[12px] font-semibold"
            style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #E5E7EB' }}
          >
            {secondaryCta.label}
          </button>
        )}
        {primaryCta && (
          <button
            type="button"
            onClick={primaryCta.onClick}
            className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white"
            style={{ background: '#22C55E' }}
          >
            {primaryCta.label}
          </button>
        )}
      </div>
    )}
  </div>
);
