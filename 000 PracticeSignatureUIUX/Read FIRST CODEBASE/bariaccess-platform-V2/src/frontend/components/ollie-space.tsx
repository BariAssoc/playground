/**
 * OLLIE SPACE — PAC-ISE-005 §7 reference component
 * 
 * Source canon:
 *   - PAC-ISE-005 v1.0A §7 (Ollie Space spec)
 *   - PAC-ISE-001 v1.0A §4.3 (OlliePolicy schema)
 *   - PAC-ISE-003 v1.0A §5 (Ollie template keys)
 * 
 * LANE 1 (render only).
 * Renders Ollie's chat surface respecting cadence + density + voiceStyle.
 * The TEMPLATE TEXT itself comes from the template-keys lookup;
 * this component does NOT generate language.
 */

import { useState, useEffect, type ReactNode } from 'react';
import type { OlliePolicy } from '../../types/ise.js';
import {
  OLLIE_CADENCE_INTERVAL_MS,
  PROMPT_DENSITY_MAX_PROMPTS,
  VOICE_STYLE_DESCRIPTORS
} from '../tokens/ise-render-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface OllieMessage {
  /** ID of the template (PAC-ISE-003 key) — caller already resolved to text */
  templateKey: string;
  /** Resolved user-facing text */
  text: string;
}

export interface OllieSpaceProps {
  policy: OlliePolicy;
  /** Pre-resolved messages from upstream — Ollie doesn't generate, just paces. */
  messages: OllieMessage[];
  /** Optional footer (e.g., quick-response chips for safety check-in) */
  footerSlot?: ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function OllieSpace({
  policy,
  messages,
  footerSlot,
  className = ''
}: OllieSpaceProps): JSX.Element {
  // Cap message count by density
  const maxPrompts = PROMPT_DENSITY_MAX_PROMPTS[policy.promptDensity];
  const limitedMessages = messages.slice(0, maxPrompts);

  // Cadence-paced reveal: messages appear one at a time at the cadence interval
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    setRevealedCount(0);
    if (limitedMessages.length === 0) return;

    const intervalMs = OLLIE_CADENCE_INTERVAL_MS[policy.cadence];

    // Honor prefers-reduced-motion: reveal all at once
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setRevealedCount(limitedMessages.length);
      return;
    }

    let cancelled = false;
    let i = 0;

    function step(): void {
      if (cancelled) return;
      i += 1;
      setRevealedCount(i);
      if (i < limitedMessages.length) {
        setTimeout(step, intervalMs);
      }
    }

    setTimeout(step, intervalMs);

    return (): void => {
      cancelled = true;
    };
  }, [policy.cadence, policy.promptDensity, limitedMessages.length]);

  const visible = limitedMessages.slice(0, revealedCount);

  return (
    <section
      className={`flex flex-col gap-3 p-4 rounded-xl bg-stone-50/80 ${className}`}
      data-cadence={policy.cadence}
      data-density={policy.promptDensity}
      data-voice-style={policy.voiceStyle}
      title={VOICE_STYLE_DESCRIPTORS[policy.voiceStyle]}
      aria-label="Ollie messages"
    >
      <ol className="space-y-2 list-none">
        {visible.map((m, idx) => (
          <li
            key={`${m.templateKey}-${idx}`}
            className="rounded-lg bg-white px-4 py-2.5 shadow-sm border border-stone-100 text-stone-800"
          >
            {m.text}
          </li>
        ))}
        {revealedCount < limitedMessages.length ? (
          <li className="text-stone-400 text-sm italic" aria-hidden>
            …
          </li>
        ) : null}
      </ol>
      {footerSlot ? <div className="mt-2">{footerSlot}</div> : null}
    </section>
  );
}
