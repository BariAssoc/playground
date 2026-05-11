/**
 * PhoneFrame — iOS chrome wrapper for Lite Beta screens.
 * Used for demo, simulation, and developer preview only.
 * Production deployment wraps the native iOS shell instead.
 */

import React from 'react';
import { RADIUS, SHADOW, SPACING } from '../theme/tokens.js';
import { SURFACE } from '../theme/palette.js';

interface PhoneFrameProps {
  children: React.ReactNode;
  isNight?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isNight = false }) => (
  <div
    className="relative mx-auto font-ios"
    style={{
      width: SPACING.phoneWidth,
      height: SPACING.phoneHeight,
      background: isNight ? SURFACE.nightBg : SURFACE.pageBg,
      border: `${SPACING.phoneBorder} solid #1A1A1A`,
      borderRadius: RADIUS.phone,
      boxShadow: SHADOW.phone,
      transition: 'background 700ms ease',
    }}
  >
    {/* Notch */}
    <div
      className="absolute left-1/2 -translate-x-1/2 rounded-full z-20"
      style={{
        top: SPACING.notchTop,
        width: SPACING.notchWidth,
        height: SPACING.notchHeight,
        background: '#000',
      }}
    />
    <div
      className="w-full h-full overflow-hidden flex flex-col relative"
      style={{ borderRadius: RADIUS.panel }}
    >
      {children}
    </div>
  </div>
);
