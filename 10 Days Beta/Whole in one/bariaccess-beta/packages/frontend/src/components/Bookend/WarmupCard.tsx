/**
 * BariAccess Beta — Bookend Warm-up Card
 *
 * Source: BETA-BOOKEND-001 §Warm-Up Bookend
 *
 * Captures Mood (1–5) + Space (P/C/V) before a FAB.
 * VAL_DEFAULT_37 — Mood is skippable. User can tap "Skip" without entering.
 * Total interaction target: ≤5 seconds.
 */

import { useState } from 'react';
import type { FAB, Space } from '@bariaccess/shared';

export interface WarmupCardProps {
  fab: FAB;
  user_id: string;
  apiBaseUrl?: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

const MOODS: Array<{ value: number; emoji: string; label: string }> = [
  { value: 1, emoji: '😣', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

const SPACES: Array<{ value: Space; label: string; subtext: string }> = [
  { value: 'protected', label: 'Protected', subtext: 'Calm, in zone' },
  { value: 'challenging', label: 'Challenging', subtext: 'Engaged, problem-solving' },
  { value: 'vulnerable', label: 'Vulnerable', subtext: 'Exposed, high-stakes' },
];

export function WarmupCard({
  fab,
  user_id,
  apiBaseUrl = '/api',
  onComplete,
  onSkip,
}: WarmupCardProps) {
  const [mood, setMood] = useState<number | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (skipMood = false) => {
    try {
      setSubmitting(true);
      setError(null);
      const resp = await fetch(`${apiBaseUrl}/bookend/warmup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          fab_id: fab.fab_id,
          mood: skipMood ? null : mood,
          space,
        }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      onComplete?.();
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bookend-card warmup-card"
      role="dialog"
      aria-label="Warm-up bookend"
    >
      <header className="bookend-card-header">
        <div className="bookend-card-time">{fab.scheduled_time}</div>
        <h3 className="bookend-card-title">{fab.name}</h3>
        {fab.rationale && (
          <p className="bookend-card-rationale">{fab.rationale}</p>
        )}
      </header>

      <section className="bookend-mood">
        <h4>How do you feel right now?</h4>
        <div className="mood-row">
          {MOODS.map((m) => (
            <button
              key={m.value}
              className={`mood-btn ${mood === m.value ? 'active' : ''}`}
              onClick={() => setMood(m.value)}
              aria-label={m.label}
              aria-pressed={mood === m.value}
            >
              <span className="mood-emoji">{m.emoji}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bookend-space">
        <h4>What space are you in?</h4>
        <div className="space-row">
          {SPACES.map((s) => (
            <button
              key={s.value}
              className={`space-btn ${space === s.value ? 'active' : ''}`}
              onClick={() => setSpace(s.value)}
              aria-pressed={space === s.value}
            >
              <span className="space-label">{s.label}</span>
              <span className="space-subtext">{s.subtext}</span>
            </button>
          ))}
        </div>
      </section>

      {error && <div className="bookend-error" role="alert">{error}</div>}

      <footer className="bookend-card-actions">
        <button
          className="btn-secondary"
          disabled={submitting}
          onClick={() => {
            onSkip?.();
            submit(true);
          }}
        >
          Skip mood
        </button>
        <button
          className="btn-primary"
          disabled={submitting || space == null}
          onClick={() => submit(false)}
        >
          {submitting ? 'Saving…' : "I'm ready"}
        </button>
      </footer>
    </div>
  );
}
