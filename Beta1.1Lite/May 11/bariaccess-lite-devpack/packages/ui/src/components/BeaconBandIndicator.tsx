/**
 * BeaconBandIndicator — visualizes a score's position on the 7-band Beacon corridor.
 * Reads from @bariaccess-lite/shared BeaconBand enum.
 * Reference screenshot: IMG_2734 (Beacon Bands card).
 */

import React from 'react';
import { BeaconBand } from '@bariaccess-lite/shared';
import { BAND } from '../theme/palette.js';

interface BeaconBandIndicatorProps {
  /** 0–100 score */
  score: number;
  /** Which band the score belongs to */
  band: BeaconBand;
  /** Optional compact mode for inline display */
  compact?: boolean;
}

const BAND_ORDER: BeaconBand[] = [
  BeaconBand.STRONG_GREEN,
  BeaconBand.MED_GREEN,
  BeaconBand.FAINT_GREEN,
  BeaconBand.LIGHT_ORANGE,
  BeaconBand.MED_ORANGE,
  BeaconBand.DARK_ORANGE,
  BeaconBand.RED,
];

export const BeaconBandIndicator: React.FC<BeaconBandIndicatorProps> = ({
  score,
  band,
  compact = false,
}) => {
  return (
    <div className="flex flex-col gap-1" style={{ width: '100%' }}>
      {BAND_ORDER.map((b) => {
        const tokens = BAND[b];
        const isActive = b === band;
        return (
          <div
            key={b}
            className="relative rounded-md flex items-center justify-center"
            style={{
              height: compact ? '14px' : '22px',
              background: tokens.fill,
              border: `${isActive ? 2 : 1}px solid ${tokens.stroke}`,
              opacity: isActive ? 1 : 0.55,
              transition: 'opacity 300ms ease',
            }}
          >
            {isActive && (
              <span
                className="absolute font-bold text-white rounded-full flex items-center justify-center"
                style={{
                  background: tokens.stroke,
                  width: compact ? '20px' : '28px',
                  height: compact ? '20px' : '28px',
                  fontSize: compact ? '9px' : '12px',
                }}
              >
                {score}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
