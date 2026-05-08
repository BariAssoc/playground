/**
 * BariAccess Beta — Journal Single-Day Log
 *
 * Source: BETA-BOOKEND-001 §Container 2: journal_entries
 *
 * Single-day Journal "WorkPad" — chronological list of FAB attempts with
 * completion, mood arc, and color state. ≤125 chars per cell rule applies
 * if/when narrative summaries are added (Journal Entry Algo, Apr 24 2026).
 */

import { useEffect, useState } from 'react';
import type { ColorState, JournalEntry } from '@bariaccess/shared';

export interface JournalProps {
  user_id: string;
  date?: string; // YYYY-MM-DD; defaults to today
  apiBaseUrl?: string;
}

const COLOR_HEX: Record<ColorState, string> = {
  blue: '#60A5FA',
  green: '#4ADE80',
  orange: '#FB923C',
  red: '#EF4444',
};

const MOOD_EMOJI: Record<number, string> = {
  1: '😣',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

export function Journal({
  user_id,
  date,
  apiBaseUrl = '/api',
}: JournalProps) {
  const today = date ?? new Date().toISOString().slice(0, 10);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const resp = await fetch(
          `${apiBaseUrl}/reports/journal/${encodeURIComponent(user_id)}?date=${today}`
        );
        if (!resp.ok) throw new Error('Failed to load Journal');
        const json = (await resp.json()) as { entries: JournalEntry[] };
        if (!cancelled) setEntries(json.entries ?? []);
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
  }, [user_id, today, apiBaseUrl]);

  if (loading) return <div className="journal-loading">Loading…</div>;
  if (error) return <div className="journal-error">{error}</div>;

  return (
    <div className="journal">
      <header className="journal-header">
        <h2>Journal — {today}</h2>
        <p className="journal-summary">
          {entries.filter((e) => e.completion === 'yes').length} of{' '}
          {entries.length} FABs completed
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="journal-empty">No entries yet today.</p>
      ) : (
        <ol className="journal-list">
          {entries
            .sort(
              (a, b) =>
                new Date(a.log_time).getTime() -
                new Date(b.log_time).getTime()
            )
            .map((e) => (
              <li
                key={e.entry_id}
                className="journal-entry"
                style={{ borderLeftColor: COLOR_HEX[e.color_state] }}
              >
                <div className="journal-entry-time">
                  {new Date(e.log_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="journal-entry-name">{e.fab_name}</div>
                <div className="journal-entry-status">
                  <span
                    className={`completion-pill completion-${e.completion}`}
                  >
                    {labelForCompletion(e.completion)}
                  </span>
                </div>
                <div className="journal-entry-mood-arc">
                  {e.mood_before != null && (
                    <span title="Mood before">
                      {MOOD_EMOJI[e.mood_before]}
                    </span>
                  )}
                  <span className="mood-arrow" aria-hidden="true">
                    →
                  </span>
                  {e.mood_after != null && (
                    <span title="Mood after">
                      {MOOD_EMOJI[e.mood_after]}
                    </span>
                  )}
                  {e.mood_delta != null && e.mood_delta !== 0 && (
                    <span
                      className={`mood-delta ${e.mood_delta > 0 ? 'positive' : 'negative'}`}
                    >
                      {e.mood_delta > 0 ? `+${e.mood_delta}` : e.mood_delta}
                    </span>
                  )}
                </div>
                {e.critical_flag && (
                  <span
                    className="critical-marker"
                    aria-label="critical FAB"
                    title="Critical FAB"
                  >
                    ●
                  </span>
                )}
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}

function labelForCompletion(c: JournalEntry['completion']): string {
  switch (c) {
    case 'yes':
      return 'Done';
    case 'no':
      return 'No';
    case 'skip':
      return 'Skipped';
    case 'timeout':
      return 'Missed';
  }
}
