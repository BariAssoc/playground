/**
 * BariAccess Beta — Bookshelf Component
 *
 * Source: BETA-BOOKEND-001 §Routine Bookshelf
 *
 * Renders today's Routine as Morning / Midday / Evening "books" with
 * FAB segments slotted underneath. Each segment renders with its current
 * color_state (Blue/Green/Orange/Red).
 *
 * Per Val's standing instruction: Bookshelf shows Morning/Midday/Evening
 * umbrellas. Segments flex/swap. FABs = wedges stabilizing segments.
 */

import { useEffect, useState } from 'react';
import type { BookendEvent, ColorState, FAB } from '@bariaccess/shared';

// ────────────────────────────────────────────────────────────
// COLOR PALETTE — locked Apr 22 2026, Expression Layer separate from Beacon
// ────────────────────────────────────────────────────────────
const COLOR_HEX: Record<ColorState, string> = {
  blue: '#60A5FA', // Awaiting cool-down
  green: '#4ADE80', // Completed
  orange: '#FB923C', // Missed (non-critical)
  red: '#EF4444', // Critical missed
};

// ────────────────────────────────────────────────────────────
// SEGMENT GROUPING
// ────────────────────────────────────────────────────────────
type SegmentGroup = 'Morning' | 'Midday' | 'Evening';

const GROUP_FOR_SEGMENT: Record<string, SegmentGroup> = {
  AM1: 'Morning',
  AM2: 'Morning',
  AM3: 'Morning',
  A1: 'Morning',
  A2: 'Morning',
  A3: 'Morning',
  A4: 'Morning',
  Mid1: 'Midday',
  Mid2: 'Midday',
  Mid3: 'Midday',
  B1: 'Midday',
  B2: 'Midday',
  B3: 'Midday',
  B4: 'Midday',
  PM1: 'Evening',
  PM2: 'Evening',
  PM3: 'Evening',
};

// ────────────────────────────────────────────────────────────
// BOOKSHELF
// ────────────────────────────────────────────────────────────
export interface BookshelfProps {
  user_id: string;
  apiBaseUrl?: string;
  onTapFAB?: (fab: FAB, currentColorState: ColorState | null) => void;
}

interface FABWithState {
  fab: FAB;
  color_state: ColorState | null;
  has_warmup: boolean;
  has_cooldown: boolean;
}

export function Bookshelf({
  user_id,
  apiBaseUrl = '/api',
  onTapFAB,
}: BookshelfProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<Record<SegmentGroup, FABWithState[]>>(
    { Morning: [], Midday: [], Evening: [] }
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [fabsResp, eventsResp] = await Promise.all([
          fetch(`${apiBaseUrl}/fabs?user_id=${encodeURIComponent(user_id)}`),
          fetch(
            `${apiBaseUrl}/bookend/today/${encodeURIComponent(user_id)}`
          ),
        ]);
        if (!fabsResp.ok || !eventsResp.ok) {
          throw new Error('Failed to load Bookshelf data');
        }
        const fabs = ((await fabsResp.json()) as { fabs: FAB[] }).fabs ?? [];
        const events =
          ((await eventsResp.json()) as { events: BookendEvent[] }).events ??
          [];
        if (cancelled) return;
        setGrouped(buildGrouped(fabs, events));
        setError(null);
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user_id, apiBaseUrl]);

  if (loading) return <div className="bookshelf-loading">Loading…</div>;
  if (error) return <div className="bookshelf-error">{error}</div>;

  return (
    <div className="bookshelf">
      {(['Morning', 'Midday', 'Evening'] as SegmentGroup[]).map((group) => (
        <BookshelfSection
          key={group}
          group={group}
          fabs={grouped[group]}
          onTapFAB={onTapFAB}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SECTION
// ────────────────────────────────────────────────────────────
function BookshelfSection({
  group,
  fabs,
  onTapFAB,
}: {
  group: SegmentGroup;
  fabs: FABWithState[];
  onTapFAB?: BookshelfProps['onTapFAB'];
}) {
  return (
    <section className="bookshelf-section" aria-label={`${group} segment`}>
      <h2 className="bookshelf-section-title">{group}</h2>
      <ol className="bookshelf-fab-list">
        {fabs.length === 0 ? (
          <li className="bookshelf-empty">No FABs in this segment</li>
        ) : (
          fabs.map(({ fab, color_state }) => (
            <li
              key={fab.fab_id}
              className="bookshelf-fab"
              style={{
                borderLeftColor: color_state
                  ? COLOR_HEX[color_state]
                  : '#94A3B8',
              }}
            >
              <button
                className="bookshelf-fab-btn"
                onClick={() => onTapFAB?.(fab, color_state)}
              >
                <span className="bookshelf-fab-time">
                  {fab.scheduled_time}
                </span>
                <span className="bookshelf-fab-name">{fab.name}</span>
                {fab.critical_flag && (
                  <span className="bookshelf-fab-critical" aria-label="critical">
                    ●
                  </span>
                )}
              </button>
            </li>
          ))
        )}
      </ol>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
function buildGrouped(
  fabs: FAB[],
  events: BookendEvent[]
): Record<SegmentGroup, FABWithState[]> {
  const out: Record<SegmentGroup, FABWithState[]> = {
    Morning: [],
    Midday: [],
    Evening: [],
  };

  // Latest event per fab_id (warmup or cooldown)
  const latestByFAB = new Map<string, BookendEvent>();
  for (const ev of events) {
    const existing = latestByFAB.get(ev.fab_id);
    if (
      !existing ||
      new Date(ev.actual_timestamp) > new Date(existing.actual_timestamp)
    ) {
      latestByFAB.set(ev.fab_id, ev);
    }
  }

  // Sort FABs by scheduled_time then place into groups
  const sorted = [...fabs].sort((a, b) =>
    a.scheduled_time.localeCompare(b.scheduled_time)
  );
  for (const fab of sorted) {
    const group = GROUP_FOR_SEGMENT[fab.segment_code];
    if (!group) continue;
    const ev = latestByFAB.get(fab.fab_id);
    out[group].push({
      fab,
      color_state: ev?.color_state ?? null,
      has_warmup: events.some(
        (e) => e.fab_id === fab.fab_id && e.event_type === 'warmup'
      ),
      has_cooldown: events.some(
        (e) => e.fab_id === fab.fab_id && e.event_type === 'cooldown'
      ),
    });
  }
  return out;
}
