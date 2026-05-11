/**
 * JotForm Yes/No prompt overlay — §5 Step 2.
 * Voice: "You got it — are you ready — yes or no?"
 */

import React from 'react';
import { EXPRESSION, type ExpressionState } from '../../theme/palette.js';
import { SHADOW } from '../../theme/tokens.js';

interface JotFormPromptProps {
  expression?: ExpressionState;
  onYesNow: () => void;
  onYesLater: () => void;
  onNo: () => void;
}

export const JotFormPrompt: React.FC<JotFormPromptProps> = ({
  expression = 'BLUE',
  onYesNow,
  onYesLater,
  onNo,
}) => {
  const tokens = EXPRESSION[expression];
  return (
    <div
      className="absolute left-3 right-3 bottom-[268px] z-20 rounded-2xl p-3 flex gap-2"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${tokens.border}`,
        boxShadow: SHADOW.overlay,
      }}
    >
      <button
        type="button"
        onClick={onYesNow}
        className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white"
        style={{ background: tokens.dot }}
      >
        Yes — Now
      </button>
      <button
        type="button"
        onClick={onYesLater}
        className="flex-1 py-2 rounded-xl text-[12px] font-semibold"
        style={{
          background: tokens.bubbleBg,
          color: tokens.text,
          border: `1px solid ${tokens.border}`,
        }}
      >
        Yes — Later
      </button>
      <button
        type="button"
        onClick={onNo}
        className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-gray-500"
        style={{ background: '#F3F4F6' }}
      >
        No
      </button>
    </div>
  );
};
