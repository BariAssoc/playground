/**
 * SIGNAL BAR TILE — Constellation Panel Row 1 tile component
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-001 v0.3 §5 (Signal Bar tiles: R&R / Healthspan / My Blueprint / Inner Circle)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §3 (tileLock render token — NEW)
 *   - PAC-ISE-005 v1.0A §8 (Constellation Panel composition)
 *   - ISE Canon v3.0 §5 (tile rims by Beacon band)
 * 
 * LANE 1 (render only).
 * Renders one Signal Bar tile. State driven by:
 *   - TileLockToken (locked vs unlocked) per G6
 *   - BeaconColor for rim treatment when unlocked
 */

import type { ReactNode } from 'react';
import type { TileLockToken, BeaconColor } from '../../types/ise.js';
import { BEACON_COLOR_CLASSES } from '../tokens/beacon-color-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export type TileLabel = 'R&R' | 'Healthspan' | 'My Blueprint' | 'Inner Circle';

export interface SignalBarTileProps {
  label: TileLabel;
  lock: TileLockToken;
  /** Current Beacon color for the tile rim — only used when unlocked */
  rimColor?: BeaconColor;
  /** Tile body content (composite display, KPI summary, etc.) */
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function SignalBarTile({
  label,
  lock,
  rimColor,
  children,
  onClick,
  className = ''
}: SignalBarTileProps): JSX.Element {
  const isLocked = lock.state === 'locked';

  // Per G6 §3.3: locked = 40% opacity + lock icon overlay + thin progress arc
  const opacityClass = isLocked ? 'opacity-40' : 'opacity-100';
  const cursorClass = isLocked ? 'cursor-not-allowed' : 'cursor-pointer';

  const rimClass = !isLocked && rimColor ? BEACON_COLOR_CLASSES[rimColor].rim : '';
  const ringClass = !isLocked && rimColor ? 'ring-2' : '';

  function handleClick(): void {
    if (isLocked) {
      // Per G6 §3.3 tap behavior: show display_message popup, no other interaction
      // Caller can hook this; for now a basic alert as the safe default
      if (lock.display_message) {
        // eslint-disable-next-line no-alert
        window.alert(lock.display_message);
      }
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
        'relative flex flex-col gap-2 p-4 rounded-xl bg-white border border-stone-200 transition-all',
        opacityClass,
        cursorClass,
        rimClass,
        ringClass,
        className
      ]
        .filter(Boolean)
        .join(' ')}
      data-tile-label={label}
      data-tile-state={lock.state}
      aria-label={
        isLocked
          ? `${label} (locked${lock.unlock_day ? `, opens day ${lock.unlock_day}` : ''})`
          : label
      }
    >
      <header className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">
          {label}
        </span>
        {isLocked ? (
          <span className="text-stone-400 text-xs" aria-hidden>
            🔒
          </span>
        ) : null}
      </header>

      <div className="flex-1">{children}</div>

      {isLocked && lock.unlock_progress !== undefined ? (
        <footer className="mt-2">
          {/* Thin progress arc — represented as a horizontal bar for simplicity.
              Nikita owns the actual arc rendering. */}
          <div
            className="h-0.5 bg-stone-100 rounded-full overflow-hidden"
            aria-label="Unlock progress"
          >
            <div
              className="h-full bg-stone-400 transition-all"
              style={{ width: `${Math.round(lock.unlock_progress * 100)}%` }}
            />
          </div>
        </footer>
      ) : null}
    </button>
  );
}
