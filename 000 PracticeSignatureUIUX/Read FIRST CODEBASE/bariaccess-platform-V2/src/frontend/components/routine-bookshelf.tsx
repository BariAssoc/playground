/**
 * ROUTINE BOOKSHELF — Rhythm Board Bookshelf
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-001 v1.1 §3 (Display: AM / Mid / PM umbrellas)
 *   - CCO-UX-RBSHELF-001 v1.1 §6.5 (17-slot architecture: 9 anchor + 8 bridge)
 *   - CCO-UX-RBSHELF-001 v1.1 §15 (Slot lifecycle states)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §4 (slot completion → Signal 5)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5 (selective cascade routing)
 * 
 * LANE 1 (render only).
 * Patient sees ONLY the 3 umbrellas (AM / Mid / PM). The 17 backend slots
 * are invisible to the patient — they're the system's internal anchoring.
 * 
 * Tap an umbrella → expand to show that umbrella's anchor slots (RBSHELF §6.5.4).
 * Tap a slot → reveal Slot Card (MEMO-CARD-COMM-001 §4).
 */

import { useState } from 'react';
import type {
  Umbrella,
  AnchorSlotId,
  SlotStateRecord,
  SlotFinalState
} from '../../types/slot.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface RoutineBookshelfProps {
  /** All 17 slot states for today */
  slot_states: ReadonlyArray<SlotStateRecord>;
  onSlotTap?: (slot: SlotStateRecord) => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UMBRELLA CONFIG
// ─────────────────────────────────────────────────────────────────────────────

interface UmbrellaConfig {
  label: Umbrella;
  display_name: string;
  anchor_slot_ids: ReadonlyArray<AnchorSlotId>;
}

const UMBRELLAS: ReadonlyArray<UmbrellaConfig> = [
  { label: 'AM', display_name: 'Morning', anchor_slot_ids: ['AM1', 'AM2', 'AM3'] },
  { label: 'Mid', display_name: 'Midday', anchor_slot_ids: ['Mid1', 'Mid2', 'Mid3'] },
  { label: 'PM', display_name: 'Evening', anchor_slot_ids: ['PM1', 'PM2', 'PM3'] }
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getUmbrellaSummary(
  umbrella: UmbrellaConfig,
  slot_states: ReadonlyArray<SlotStateRecord>
): { active_count: number; drift_detected: boolean } {
  const slots = slot_states.filter((s) =>
    umbrella.anchor_slot_ids.includes(s.slotId as AnchorSlotId)
  );
  const active_count = slots.filter(
    (s) => s.lifecycle_state === 'in_window'
  ).length;
  const drift_detected = slots.some(
    (s) => s.drift_detected_in_window || s.final_state === 'orange'
  );
  return { active_count, drift_detected };
}

function finalStateRingClass(state: SlotFinalState | null): string {
  if (state === 'green') return 'ring-2 ring-emerald-400';
  if (state === 'orange') return 'ring-2 ring-amber-400';
  if (state === 'gray') return 'ring-1 ring-stone-300';
  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function RoutineBookshelf({
  slot_states,
  onSlotTap,
  className = ''
}: RoutineBookshelfProps): JSX.Element {
  const [expanded, setExpanded] = useState<Umbrella | null>(null);

  return (
    <section
      className={[
        'flex flex-col gap-3 p-4 rounded-xl bg-white border border-stone-200',
        className
      ].join(' ')}
      aria-label="Routine bookshelf"
    >
      <header className="flex justify-between items-center">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-600">
          Routine
        </h2>
      </header>

      {/* 3 umbrellas — patient-facing surface */}
      <div className="grid grid-cols-3 gap-3">
        {UMBRELLAS.map((u) => {
          const summary = getUmbrellaSummary(u, slot_states);
          const isOpen = expanded === u.label;
          return (
            <button
              key={u.label}
              type="button"
              onClick={(): void => setExpanded(isOpen ? null : u.label)}
              className={[
                'flex flex-col items-center justify-center gap-1 p-4 rounded-lg border bg-stone-50 transition-all',
                isOpen ? 'border-stone-400 bg-stone-100' : 'border-stone-200 hover:border-stone-300',
                summary.drift_detected ? 'ring-1 ring-amber-300' : ''
              ].join(' ')}
              data-umbrella={u.label}
              data-expanded={isOpen}
              aria-expanded={isOpen}
              aria-label={`${u.display_name}: ${summary.active_count} active`}
            >
              <span className="text-xl font-bold text-stone-800">{u.label}</span>
              <span className="text-xs text-stone-500">{u.display_name}</span>
              {summary.active_count > 0 ? (
                <span className="text-xs text-stone-600 mt-1">
                  {summary.active_count} active
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Expanded slot detail (anchor slots only — bridge slots stay invisible) */}
      {expanded ? (
        <div
          className="flex gap-2 overflow-x-auto p-2 rounded-lg bg-stone-50 border border-stone-100"
          aria-label={`${expanded} slots`}
        >
          {(UMBRELLAS.find((u) => u.label === expanded)?.anchor_slot_ids ?? []).map(
            (slotId) => {
              const state = slot_states.find((s) => s.slotId === slotId);
              if (!state) {
                return (
                  <div
                    key={slotId}
                    className="min-w-[5rem] px-3 py-2 rounded border border-dashed border-stone-300 text-xs text-stone-400"
                  >
                    {slotId}
                  </div>
                );
              }
              return (
                <button
                  key={slotId}
                  type="button"
                  onClick={(): void => onSlotTap?.(state)}
                  className={[
                    'flex flex-col items-center min-w-[5rem] px-3 py-2 rounded bg-white border border-stone-200 transition-all hover:border-stone-400',
                    finalStateRingClass(state.final_state)
                  ].join(' ')}
                  data-slot-id={state.slotId}
                  data-lifecycle={state.lifecycle_state}
                  aria-label={`Slot ${state.slotId}, ${state.lifecycle_state}`}
                >
                  <span className="text-xs font-semibold text-stone-700">
                    {state.slotId}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    {state.fabs_in_slot.length} FAB
                    {state.fabs_in_slot.length === 1 ? '' : 's'}
                  </span>
                  {state.drift_detected_in_window ? (
                    <span className="text-amber-500 text-xs mt-0.5" aria-hidden>
                      ⚠
                    </span>
                  ) : null}
                </button>
              );
            }
          )}
        </div>
      ) : null}
    </section>
  );
}
