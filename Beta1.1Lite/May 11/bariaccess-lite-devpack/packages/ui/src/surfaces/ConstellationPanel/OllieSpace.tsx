/**
 * Row 2 — Ollie's Space.
 * Per §3: "Where Ollie speaks, announces, and prompts."
 * Color expression follows §2 Expression Color Code.
 */

import React from 'react';
import { ExpressionBubble } from '../../components/ExpressionBubble.js';
import type { ExpressionState } from '../../theme/palette.js';

interface OllieSpaceProps {
  text: string;
  expression: ExpressionState;
}

export const OllieSpace: React.FC<OllieSpaceProps> = ({ text, expression }) => (
  <div style={{ minHeight: 36 }}>
    <ExpressionBubble state={expression} variant="line">
      {text}
    </ExpressionBubble>
  </div>
);
