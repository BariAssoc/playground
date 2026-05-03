/**
 * CONSTELLATION PANEL — Lower ~30% of the patient view
 * 
 * Source canon:
 *   - PAC-ISE-005 v1.0A §8 (Constellation Panel composition)
 *   - DEV-WORK-D0LITE-001 v0.3 §5 (5-row architecture LOCKED)
 *   - PAC-ISE-001 v1.0A §6 (ISEPayload v1.0A)
 * 
 * LANE 1 (render only).
 * 
 * Five rows (LOCKED architecture):
 *   Row 1 — Signal Bar (R&R · Healthspan · My Blueprint · Inner Circle tiles)
 *   Row 2 — Ollie's Space
 *   Row 3 — 51/49 WorkPad / AI Playground (placeholder area; owned upstream)
 *   Row 4 — M+E icon (Mood + Effort patient input — placeholder; G1 pin capture)
 *   Row 5 — Daily Pulse (6 trackers)
 */

import type { ReactNode } from 'react';
import type { ISEPayload, TileLockToken, TrackerRenderToken } from '../../types/ise.js';
import { OllieSpace, type OllieMessage } from './ollie-space.js';
import { SignalBarTile, type TileLabel } from './signal-bar-tile.js';
import { DailyPulseTracker } from './daily-pulse-tracker.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface ConstellationPanelProps {
  /** ISE payload from Resolver — drives Ollie space cadence/voice */
  ise_payload: ISEPayload;

  /** Resolved Ollie messages (text already looked up from template keys) */
  ollie_messages: OllieMessage[];

  /** Row 1 — Signal Bar tile lock states keyed by tile label */
  tile_locks: Readonly<Record<TileLabel, TileLockToken>>;

  /** Row 5 — Daily Pulse 6-slot tokens (in slot_position order 1..6) */
  daily_pulse_tokens: ReadonlyArray<TrackerRenderToken>;

  /** Row 3 slot — caller-provided WorkPad / AI Playground content */
  workpad_slot?: ReactNode;

  /** Row 4 slot — caller-provided M+E icon component */
  mood_effort_slot?: ReactNode;

  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ConstellationPanel({
  ise_payload,
  ollie_messages,
  tile_locks,
  daily_pulse_tokens,
  workpad_slot,
  mood_effort_slot,
  className = ''
}: ConstellationPanelProps): JSX.Element {
  return (
    <section
      className={[
        'flex flex-col gap-3 p-4 rounded-2xl bg-white border border-stone-200',
        className
      ].join(' ')}
      data-ise-state={ise_payload.state}
      aria-label="Constellation Panel"
    >
      {/* ROW 1 — Signal Bar */}
      <div
        className="grid grid-cols-4 gap-2"
        role="group"
        aria-label="Signal Bar"
      >
        {(['R&R', 'Healthspan', 'My Blueprint', 'Inner Circle'] as TileLabel[]).map(
          (label) => (
            <SignalBarTile key={label} label={label} lock={tile_locks[label]}>
              {/* Body content placeholder — caller passes children via ConstellationPanelProps
                  in a future revision once tile-body composition is locked */}
              <span className="text-xs text-stone-500 italic">—</span>
            </SignalBarTile>
          )
        )}
      </div>

      {/* ROW 2 — Ollie's Space */}
      <OllieSpace policy={ise_payload.ollie} messages={ollie_messages} />

      {/* ROW 3 — WorkPad / AI Playground */}
      <div
        className="min-h-[3rem] rounded-lg bg-stone-50 border border-dashed border-stone-200 p-3"
        role="region"
        aria-label="WorkPad"
      >
        {workpad_slot ?? (
          <p className="text-xs text-stone-400 italic">WorkPad / AI Playground</p>
        )}
      </div>

      {/* ROW 4 — M+E icon (Mood + Effort patient input) */}
      <div
        className="flex items-center justify-center rounded-lg bg-stone-50 border border-stone-100 p-2"
        role="region"
        aria-label="Mood and Effort input"
      >
        {mood_effort_slot ?? (
          <p className="text-xs text-stone-400 italic">M + E</p>
        )}
      </div>

      {/* ROW 5 — Daily Pulse */}
      <DailyPulseTracker tokens={daily_pulse_tokens} />
    </section>
  );
}
