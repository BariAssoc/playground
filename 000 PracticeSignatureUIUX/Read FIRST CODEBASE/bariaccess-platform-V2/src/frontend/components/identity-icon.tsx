/**
 * IDENTITY ICON — PAC-ISE-005 §5 reference component
 * 
 * Source canon:
 *   - PAC-ISE-005 v1.0A §5 (Identity Icon component)
 *   - PAC-ISE-001 v1.0A §4.1 (token vocabulary)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §3 (tileLock token extension)
 * 
 * LANE 1 (render only — no business logic).
 * Reads tokens from the ISEPayload and applies the corresponding CSS classes.
 * The icon glyph itself is owned by Nikita; this component handles the
 * tokenized treatment around it.
 */

import { type ReactNode } from 'react';
import type { IdentityIconTokens, ISEState } from '../../types/ise.js';
import {
  POSTURE_CLASSES,
  SATURATION_CLASSES,
  MOTION_CLASSES,
  OVERLAY_DESCRIPTORS
} from '../tokens/ise-render-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface IdentityIconProps {
  tokens: IdentityIconTokens;
  state: ISEState;
  /** The icon glyph itself (typically the BariAccess wordmark or RhythmSignal). */
  children?: ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function IdentityIcon({
  tokens,
  state,
  children,
  className = ''
}: IdentityIconProps): JSX.Element {
  const postureClass = POSTURE_CLASSES[tokens.posture];
  const saturationClass = SATURATION_CLASSES[tokens.saturation];
  const motionClass = MOTION_CLASSES[tokens.motion];
  const overlayDescriptor = OVERLAY_DESCRIPTORS[tokens.overlay];

  const composed = [
    'inline-flex relative items-center justify-center transition-all duration-500',
    postureClass,
    saturationClass,
    motionClass,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={composed}
      data-ise-state={state}
      data-posture={tokens.posture}
      data-saturation={tokens.saturation}
      data-motion={tokens.motion}
      data-overlay={tokens.overlay}
      aria-label={`Identity icon, state ${state}`}
    >
      {children}
      {overlayDescriptor.showLockGlyph ? (
        <span
          aria-label={overlayDescriptor.ariaLabel}
          className={`absolute -bottom-1 -right-1 text-sm ${overlayDescriptor.glyphTone}`}
        >
          {tokens.overlay === 'shieldLock' ? '🛡' : '🔒'}
        </span>
      ) : null}
    </div>
  );
}
