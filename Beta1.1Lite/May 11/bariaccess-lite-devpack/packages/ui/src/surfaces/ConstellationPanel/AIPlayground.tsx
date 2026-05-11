/**
 * AI Playground — where AskABA / Max / [user's ABA] responds.
 * §6 Dual AI Protocol — ABA never appears alone. Ollie always introduces.
 *
 * Visual rule (v1.1 amendment proposed from May 11 screenshots):
 *   - When ABA is the active speaker, Ollie's owl DIMS, ABA icon brightens.
 *   - Both icons remain visible at all times — visual enforcement of
 *     "ABA never alone."
 */

import React from 'react';
import { ExpressionBubble } from '../../components/ExpressionBubble.js';
import { OllieIcon } from '../../components/OllieIcon.js';
import { ABAIcon } from '../../components/ABAIcon.js';
import { EXPRESSION, type ExpressionState } from '../../theme/palette.js';
import type { AISpeaker } from '../../types/ui.js';

interface AIPlaygroundProps {
  visible: boolean;
  text: string;
  expression: ExpressionState;
  activeSpeaker: AISpeaker;
  abaName: string;
}

export const AIPlayground: React.FC<AIPlaygroundProps> = ({
  visible,
  text,
  expression,
  activeSpeaker,
  abaName,
}) => {
  if (!visible) return null;
  const tokens = EXPRESSION[expression];
  const ollieActive = activeSpeaker === 'ollie';
  const abaActive = activeSpeaker === 'aba';
  return (
    <div
      className="rounded-2xl p-3 mt-2"
      style={{
        background: tokens.bubbleBg,
        border: `1.5px solid ${tokens.border}`,
        transition: 'all 500ms ease',
      }}
    >
      <div
        className="rounded-xl p-2.5 text-[11px] leading-snug text-center bg-white"
        style={{ color: tokens.text, border: `1px solid ${tokens.border}` }}
      >
        {text}
      </div>
      {/* Speech tail */}
      <div className="ml-3 mt-[-1px]">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${tokens.border}`,
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1 ml-1">
        <OllieIcon active={ollieActive} />
        <ABAIcon active={abaActive} initial={abaName.charAt(0)} />
        <span className="text-[9px] ml-1" style={{ color: tokens.text }}>
          {ollieActive ? 'Ollie speaking' : `${abaName} responding (Ollie present)`}
        </span>
      </div>
    </div>
  );
};
