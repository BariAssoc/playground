/**
 * SLOT CARD — Bookshelf-originated card variant
 * 
 * Source canon:
 *   - MEMO-CARD-COMM-001 §4 (Slot Card variant — replaces working term "Card Expansion")
 *   - MEMO-CARD-COMM-001 §6 (Surface boundaries — Bookshelf surface = CCIE-interface)
 *   - CCO-UX-RBSHELF-001 v1.1 §6.5.4 (Slot tap behavior)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) §5 (per-card-origin visibility)
 * 
 * LANE 1 (render only).
 * Renders a Slot Card revealing the FAB-level details under one slot.
 * Slot Card surface = CCIE-interface (patient view) ONLY.
 * Per G5: NO clinical reasoning columns ever shown here.
 */

import type { SlotCard as SlotCardType } from '../../types/card.js';
import type { JournalEntryPatientView } from '../../types/journal.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface SlotCardProps {
  card: SlotCardType;
  /** Patient-redacted journal entries surfaced by this card (per G5) */
  journal_entries: ReadonlyArray<JournalEntryPatientView>;
  onClose?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function SlotCard({
  card,
  journal_entries,
  onClose,
  className = ''
}: SlotCardProps): JSX.Element {
  return (
    <article
      className={[
        'flex flex-col gap-3 p-4 rounded-xl bg-white border border-stone-200 shadow-md',
        className
      ].join(' ')}
      data-card-id={card.card_id}
      data-card-origin={card.origin}
      data-slot-id={card.slot_id}
      aria-label={`Slot card for ${card.slot_id}`}
    >
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700">
          Slot {card.slot_id}
        </h3>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-sm"
            aria-label="Close slot card"
          >
            ×
          </button>
        ) : null}
      </header>

      <p className="text-xs text-stone-500">
        {card.fab_ids_in_slot.length} FAB
        {card.fab_ids_in_slot.length === 1 ? '' : 's'} in this slot
      </p>

      {journal_entries.length > 0 ? (
        <section className="flex flex-col gap-2 mt-2" aria-label="Journal entries">
          {journal_entries.map((e) => (
            <div
              key={e.entry_id}
              className="rounded-lg bg-stone-50 px-3 py-2 border border-stone-100"
            >
              <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
                {e.category}
              </p>
              <p className="text-sm text-stone-800">{e.entry}</p>
              {e.ollie_to_mark_first ? (
                <p className="mt-2 text-sm italic text-stone-700">
                  Ollie: {e.ollie_to_mark_first}
                </p>
              ) : null}
              {e.ollie_to_mark_second ? (
                <p className="mt-1 text-sm italic text-stone-700">
                  Ollie: {e.ollie_to_mark_second}
                </p>
              ) : null}
              {/*
                ❗ HIPAA-CRITICAL (G5):
                Patient view NEVER renders ollie_to_max, max_to_ollie,
                askaba_to_provider, or credit_type. The TypeScript type
                JournalEntryPatientView does not even include these fields,
                so they cannot be accessed here at all.
              */}
            </div>
          ))}
        </section>
      ) : (
        <p className="text-sm text-stone-500 italic">No journal entries yet.</p>
      )}
    </article>
  );
}
