/**
 * BariAccess Beta — Bookend Cool-down Card
 *
 * Source: BETA-BOOKEND-001 §Cool-Down Bookend
 *
 * Captures Completion (Yes/No/Skip) + Mood-after (1–5) after a FAB window.
 * VAL_DEFAULT_36 — Mood-after captured for ALL completion states.
 * Total interaction target: ≤5 seconds.
 */

import { useState } from 'react';
import type { Completion, FAB } from '@bariaccess/shared';

export interface CooldownCardProps {
  fab: FAB;
  user_id: string;
  apiBaseUrl?: string;
  onComplete?: (color_state: string) => void;
}

const MOODS: Array<{ value: number; emoji: string; label: string }> = [
  { value: 1, emoji: '😣', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

const COMPLETIONS: Array<{
  value: Completion;
  label: string;
  emoji: string;
}> = [
  { value: 'yes', label: 'Done', emoji: '✅' },
  { value: 'no', label: 'No', emoji: '❌' },
  { value: 'skip', label: 'Skipped', emoji: '⏭️' },
];

export function CooldownCard({
  fab,
  user_id,
  apiBaseUrl = '/api',
  onComplete,
}: CooldownCardProps) {
  const [completion, setCompletion] = useState<Completion | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (completion == null) return;
    try {
      setSubmitting(true);
      setError(null);
      const resp = await fetch(`${apiBaseUrl}/bookend/cooldown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          fab_id: fab.fab_id,
          completion,
          mood_after: moodAfter, // VAL_DEFAULT_36 — captured even on No/Skip
        }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const json = (await resp.json()) as { color_state: string };
      onComplete?.(json.color_state);
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bookend-card cooldown-card"
      role="dialog"
      aria-label="Cool-down bookend"
    >
      <header className="bookend-card-header">
        <div className="bookend-card-time">{fab.scheduled_time}</div>
        <h3 className="bookend-card-title">How did "{fab.name}" go?</h3>
      </header>

      <section className="cooldown-completion">
        <h4>Completion</h4>
        <div className="completion-row">
          {COMPLETIONS.map((c) => (
            <button
              key={c.value}
              className={`completion-btn ${completion === c.value ? 'active' : ''} completion-${c.value}`}
              onClick={() => setCompletion(c.value)}
              aria-pressed={completion === c.value}
            >
              <span className="completion-emoji">{c.emoji}</span>
              <span className="completion-label">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cooldown-mood">
        <h4>How do you feel now?</h4>
        <div className="mood-row">
          {MOODS.map((m) => (
            <button
              key={m.value}
              className={`mood-btn ${moodAfter === m.value ? 'active' : ''}`}
              onClick={() => setMoodAfter(m.value)}
              aria-pressed={moodAfter === m.value}
            >
              <span className="mood-emoji">{m.emoji}</span>
            </button>
          ))}
        </div>
      </section>

      {error && <div className="bookend-error" role="alert">{error}</div>}

      <footer className="bookend-card-actions">
        <button
          className="btn-primary"
          disabled={submitting || completion == null}
          onClick={submit}
        >
          {submitting ? 'Saving…' : 'Log it'}
        </button>
      </footer>
    </div>
  );
}
