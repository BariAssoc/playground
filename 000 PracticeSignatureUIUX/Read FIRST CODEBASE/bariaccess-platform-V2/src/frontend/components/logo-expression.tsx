/**
 * LOGO EXPRESSION — Three-Phase Logo Animation
 * 
 * Source canon:
 *   - CCO-ENG-LOGO-EXPR-001 v1.1 §5 (Three-phase sequence: Warm-up → Content → Cool-down)
 *   - CCO-ENG-LOGO-EXPR-001 v1.1 §6 (Rhythm Signal full spec)
 *   - CCO-ENG-LOGO-EXPR-001 v1.1 §7 (BioSnap types)
 *   - CCO-ENG-LOGO-EXPR-PATCH-001 v1.0 (G4) §3 (Aurora render rules: Day 30 Provider / Day 90 Patient)
 *   - PAC-ISE-005 v1.0A §10 (prefers-reduced-motion compliance)
 * 
 * LANE 1 (render only).
 * Renders the BariAccess logo + RhythmSignal companion area.
 * Three-phase cycle:
 *   1. Warm-up   — soft fade-in
 *   2. Content   — RhythmSignal (BioSnap or Aurora KPI)
 *   3. Cool-down — soft fade-out
 * 
 * Aurora visibility (per G4):
 *   - Pre-Day-30:  accruing — never rendered
 *   - Day 30+:     Provider view (CPIE-interface only)
 *   - Day 90+:     Patient view (CCIE-interface, via Memory Lane card)
 */

import { useEffect, useState } from 'react';
import type { CompositeRenderToken } from '../../types/ise.js';
import { BEACON_COLOR_CLASSES } from '../tokens/beacon-color-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export type LogoPhase = 'warmup' | 'content' | 'cooldown' | 'idle';

export interface BioSnap {
  type: 'wearable_sync' | 'lab_return' | 'fab_close' | 'sleep_summary' | 'nutrition_log' | 'check_in' | 'mood_pulse';
  short_label: string;
}

export interface LogoExpressionProps {
  /** Current animation phase */
  phase: LogoPhase;
  /** RhythmSignal payload — what to display during the content phase */
  bio_snap?: BioSnap;
  /** Aurora KPI display (G4) — only when render rules permit */
  aurora_token?: CompositeRenderToken;
  /** Visible to patient (CCIE) or provider (CPIE)? Affects Aurora visibility */
  interface_layer: 'CCIE-interface' | 'CPIE-interface';
  /** Days since user's D0 (Aurora render rules per G4) */
  days_since_d0: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AURORA VISIBILITY GATE (G4 §3)
// ─────────────────────────────────────────────────────────────────────────────

function shouldRenderAurora(
  layer: LogoExpressionProps['interface_layer'],
  days_since_d0: number,
  token: CompositeRenderToken | undefined
): boolean {
  if (!token) return false;
  if (token.state === 'accruing') return false;

  // Day 30+ provider, Day 90+ patient
  if (layer === 'CPIE-interface' && days_since_d0 >= 30) return true;
  if (layer === 'CCIE-interface' && days_since_d0 >= 90) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function LogoExpression({
  phase,
  bio_snap,
  aurora_token,
  interface_layer,
  days_since_d0,
  className = ''
}: LogoExpressionProps): JSX.Element {
  // Honor prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent): void => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return (): void => mq.removeEventListener('change', handler);
  }, []);

  const phaseOpacity = reducedMotion
    ? 'opacity-100'
    : phase === 'warmup'
      ? 'opacity-50'
      : phase === 'content'
        ? 'opacity-100'
        : phase === 'cooldown'
          ? 'opacity-50'
          : 'opacity-90';

  const showAurora = shouldRenderAurora(interface_layer, days_since_d0, aurora_token);
  const auroraColor = aurora_token?.beacon_color;
  const auroraClasses = auroraColor ? BEACON_COLOR_CLASSES[auroraColor] : null;

  return (
    <div
      className={[
        'flex items-center gap-3 transition-opacity duration-700',
        phaseOpacity,
        className
      ].join(' ')}
      data-phase={phase}
      data-reduced-motion={reducedMotion}
      aria-label="BariAccess logo"
    >
      {/* Logo glyph placeholder — Nikita owns the actual mark */}
      <span className="font-serif text-lg tracking-tight text-stone-900">
        BariAccess
      </span>

      {/* RhythmSignal during content phase */}
      {phase === 'content' && bio_snap ? (
        <span
          className="text-xs text-stone-600 px-2 py-1 rounded bg-stone-100"
          data-bio-snap-type={bio_snap.type}
          aria-label={`RhythmSignal: ${bio_snap.short_label}`}
        >
          {bio_snap.short_label}
        </span>
      ) : null}

      {/* Aurora KPI (G4) — gated by interface + day threshold */}
      {showAurora && aurora_token?.state === 'live' ? (
        <span
          className={[
            'text-xs font-semibold px-2 py-1 rounded border',
            auroraClasses?.border ?? 'border-stone-300',
            auroraClasses?.text ?? 'text-stone-800'
          ].join(' ')}
          data-aurora-band={aurora_token.beacon_band}
          aria-label={`Aurora index ${aurora_token.beacon_score}`}
        >
          Aurora {aurora_token.beacon_score}
        </span>
      ) : null}
    </div>
  );
}
