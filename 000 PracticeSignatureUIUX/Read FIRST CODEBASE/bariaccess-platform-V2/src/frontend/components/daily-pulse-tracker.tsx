/**
 * DAILY PULSE TRACKER — Constellation Panel Row 5
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-001 v0.3 §3 (Daily Pulse: 6 tracker slots — NEVER TOUCH)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §6 (PROD slot 5 locked-empty resolution)
 *   - PAC-ISE-005 v1.0A §8 (Constellation Panel composition)
 * 
 * LANE 1 (render only).
 * Renders the 6-slot Daily Pulse row: FAB · ITB · BEACON · ROUTINE · PROD · PARK
 * 
 * Per G6 §6.2: slot count fixed at 6. Practice Edition Phase 1: PROD = locked_empty.
 */

import type { TrackerRenderToken } from '../../types/ise.js';
import { BEACON_COLOR_CLASSES } from '../tokens/beacon-color-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyPulseTrackerProps {
  /** Six tokens, one per slot (1..6). PROD slot is index 4. */
  tokens: ReadonlyArray<TrackerRenderToken>;
  onSlotClick?: (token: TrackerRenderToken) => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function DailyPulseTracker({
  tokens,
  onSlotClick,
  className = ''
}: DailyPulseTrackerProps): JSX.Element {
  return (
    <div
      className={[
        'grid grid-cols-6 gap-2 p-3 rounded-xl bg-stone-50/60 border border-stone-100',
        className
      ].join(' ')}
      role="group"
      aria-label="Daily Pulse trackers"
    >
      {tokens.map((token) => (
        <DailyPulseSlot
          key={token.slot_position}
          token={token}
          onClick={(): void => onSlotClick?.(token)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INNER — DailyPulseSlot
// ─────────────────────────────────────────────────────────────────────────────

interface DailyPulseSlotProps {
  token: TrackerRenderToken;
  onClick?: () => void;
}

function DailyPulseSlot({ token, onClick }: DailyPulseSlotProps): JSX.Element {
  const isLocked = token.state === 'locked_empty';
  const isFutureUnlock = token.state === 'future_unlock';
  const isActive = token.state === 'active';

  const rimClasses =
    isActive && token.rim_color ? BEACON_COLOR_CLASSES[token.rim_color].rim : '';
  const ringClasses = isActive && token.rim_color ? 'ring-2' : '';

  function handleClick(): void {
    if (isLocked && token.locked_message) {
      // Per G6 §6.2: small popup with locked_message
      // eslint-disable-next-line no-alert
      window.alert(token.locked_message);
      return;
    }
    onClick?.();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLocked}
      className={[
        'flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-white border transition-all',
        isLocked ? 'opacity-40 border-dashed border-stone-300 cursor-not-allowed' : 'border-stone-200',
        isFutureUnlock ? 'opacity-70 border-stone-200' : '',
        rimClasses,
        ringClasses
      ]
        .filter(Boolean)
        .join(' ')}
      data-slot-position={token.slot_position}
      data-slot-label={token.slot_label}
      data-slot-state={token.state}
      aria-label={
        isLocked
          ? `${token.slot_label} (locked)`
          : isFutureUnlock
            ? `${token.slot_label} (not yet active)`
            : token.slot_label
      }
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
        {token.slot_label}
      </span>
      {isLocked ? (
        <span className="text-stone-400 text-xs" aria-hidden>
          🔒
        </span>
      ) : isFutureUnlock ? (
        <span className="text-stone-400 text-xs" aria-hidden>
          ◌
        </span>
      ) : null}
    </button>
  );
}
