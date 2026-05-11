/**
 * ExpressionBubble — color-coded text container.
 * The atomic primitive for Ollie's Space, AI Playground bubble, banners.
 * Renders per §2 Expression Color Code.
 */

import React from 'react';
import { EXPRESSION, type ExpressionState } from '../theme/palette.js';

interface ExpressionBubbleProps {
  state: ExpressionState;
  children: React.ReactNode;
  /** Render compact (Row 2 line) or expanded (AI Playground bubble) */
  variant?: 'line' | 'bubble';
  className?: string;
}

export const ExpressionBubble: React.FC<ExpressionBubbleProps> = ({
  state,
  children,
  variant = 'line',
  className = '',
}) => {
  const tokens = EXPRESSION[state];
  const padding = variant === 'bubble' ? '12px' : '8px 12px';
  const fontSize = variant === 'bubble' ? '12px' : '11px';
  return (
    <div
      className={`rounded-xl font-semibold ${className}`}
      style={{
        background: tokens.bubbleBg,
        border: `1.5px solid ${tokens.border}`,
        color: tokens.text,
        padding,
        fontSize,
        textAlign: variant === 'line' ? 'center' : 'left',
        transition: 'all 500ms ease',
      }}
    >
      {children}
    </div>
  );
};
