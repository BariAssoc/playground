/**
 * WorkPad — half-screen workspace where JotForms open when user says "Now".
 *
 * §5 Step 3a — Yes → Now → Card opens, WorkPad opens halfway.
 * §3 — "Half-screen workspace where JotForms open when user says Now."
 *
 * Interaction rules (CCO-UX-RBCP-001):
 *   - Lives in lower Rhythm Board.
 *   - Does NOT enter the Constellation Panel.
 *   - Stops above the Constellation Panel boundary.
 *   - Vertical → Bookshelf resizes. Horizontal → Bookshelf stays fixed.
 */

import React from 'react';
import { X } from 'lucide-react';
import { SHADOW } from '../../theme/tokens.js';

interface WorkPadProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  progressPct?: number;
  onStart?: () => void;
  onSaveToQ?: () => void;
  onClose?: () => void;
}

export const WorkPad: React.FC<WorkPadProps> = ({
  eyebrow = 'WORKPAD · LEARN',
  title,
  subtitle,
  body,
  progressPct = 0,
  onStart,
  onSaveToQ,
  onClose,
}) => (
  <div
    className="absolute left-0 right-0 bottom-0 z-20 rounded-t-3xl p-4 flex flex-col"
    style={{ background: '#FFFFFF', boxShadow: SHADOW.workpad, height: '52%' }}
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[10px] font-semibold tracking-wider text-gray-500">{eyebrow}</div>
        <div className="text-base font-bold mt-1 text-gray-900">{title}</div>
        {subtitle && <div className="text-[10px] text-gray-500">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold" style={{ color: '#22C55E' }}>
          {progressPct}%
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close WorkPad"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
    {body && (
      <div className="mt-3 text-[11px] text-gray-700 leading-relaxed">{body}</div>
    )}
    <div className="mt-auto pt-3 flex gap-2 flex-wrap">
      <button
        type="button"
        onClick={onStart}
        className="px-4 py-2 rounded-full text-[12px] font-semibold text-white"
        style={{ background: '#22C55E' }}
      >
        Start quiz →
      </button>
      <button
        type="button"
        onClick={onSaveToQ}
        className="px-4 py-1.5 rounded-full text-[11px] font-medium"
        style={{ background: '#F3F4F6', color: '#374151' }}
      >
        Save to Q
      </button>
    </div>
  </div>
);
