/**
 * Row 5 — Daily Pulse.
 * 6 trackers, fixed order: FAB · ITB · BEACON · ROUTINE · PROD · PARK.
 * Notification badges visible on FAB and ITB per May 11 screenshots
 * (badge logic TBD by Val — UI exposes the slot, real counts come from backend).
 */

import React from 'react';
import {
  Clapperboard,
  Stethoscope,
  Compass,
  RefreshCw,
  TrendingUp,
  Hourglass,
  type LucideIcon,
} from 'lucide-react';
import { DAILY_PULSE_ORDER, type DailyPulseTracker } from '../../canon/constants.js';

interface TrackerConfig {
  Icon: LucideIcon;
  ring: string;
}

const CONFIG: Record<DailyPulseTracker, TrackerConfig> = {
  FAB:     { Icon: Clapperboard, ring: '#EC4899' },
  ITB:     { Icon: Stethoscope,  ring: '#F59E0B' },
  BEACON:  { Icon: Compass,      ring: '#14B8A6' },
  ROUTINE: { Icon: RefreshCw,    ring: '#3B82F6' },
  PROD:    { Icon: TrendingUp,   ring: '#F87171' },
  PARK:    { Icon: Hourglass,    ring: '#A855F7' },
};

export type DailyPulseBadges = Partial<Record<DailyPulseTracker, number>>;

interface DailyPulseProps {
  badges?: DailyPulseBadges;
}

export const DailyPulse: React.FC<DailyPulseProps> = ({ badges = {} }) => (
  <div className="grid grid-cols-6 gap-1 px-1 pt-2 pb-1">
    {DAILY_PULSE_ORDER.map((label) => {
      const cfg = CONFIG[label];
      const count = badges[label] ?? 0;
      const showBadge = count > 0;
      return (
        <div key={label} className="flex flex-col items-center gap-0.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center relative bg-white"
            style={{ border: `2px solid ${cfg.ring}` }}
          >
            <cfg.Icon size={14} color={cfg.ring} />
            {showBadge && (
              <span
                className="absolute -top-1 -right-1 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
                style={{ background: label === 'FAB' ? '#E11D48' : '#8B5CF6' }}
              >
                {count}
              </span>
            )}
          </div>
          <span
            className="text-[8px] font-semibold tracking-wide"
            style={{ color: '#2563EB' }}
          >
            {label}
          </span>
        </div>
      );
    })}
  </div>
);
