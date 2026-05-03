/**
 * COMPOSITE DISPLAY — accruing / live composite renderer
 * 
 * Source canon:
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §5 (CompositeRenderToken — NEW)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §4.2 (Phase 1 unlock specs)
 *   - Beacon Canon v1.1 §11 (confidence indicators)
 * 
 * LANE 1 (render only).
 * Renders one composite (e.g., SRC, MBC, BHR) per its state:
 *   - accruing → gray placeholder with unlock trigger text + progress
 *   - live → Beacon band color + score + confidence indicator
 */

import type { CompositeRenderToken } from '../../types/ise.js';
import type { CompositeName } from '../../types/composite.js';
import { BEACON_COLOR_CLASSES } from '../tokens/beacon-color-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeDisplayProps {
  composite_name: CompositeName;
  composite_full_name: string; // e.g., "Sleep Recovery Composite"
  token: CompositeRenderToken;
  className?: string;
  onClick?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function CompositeDisplay({
  composite_name,
  composite_full_name,
  token,
  className = '',
  onClick
}: CompositeDisplayProps): JSX.Element {
  if (token.state === 'accruing') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          'flex flex-col gap-1.5 p-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 text-left transition-colors',
          'hover:border-stone-400',
          className
        ].join(' ')}
        data-composite={composite_name}
        data-composite-state="accruing"
        aria-label={`${composite_full_name} accruing`}
      >
        <header className="flex items-center justify-between">
          <span className="text-sm font-semibold text-stone-700">{composite_name}</span>
          <span className="text-xs uppercase tracking-wide text-stone-400">
            accruing
          </span>
        </header>
        <p className="text-xs text-stone-500">{composite_full_name}</p>
        {token.unlock_trigger_text ? (
          <p className="text-xs text-stone-600 italic">
            Opens when: {token.unlock_trigger_text}
          </p>
        ) : null}
        {token.progress_pct !== undefined ? (
          <div className="mt-1 h-1 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-400 transition-all"
              style={{ width: `${Math.round(token.progress_pct)}%` }}
            />
          </div>
        ) : null}
      </button>
    );
  }

  // state === 'live'
  const color = token.beacon_color;
  const colorClasses = color ? BEACON_COLOR_CLASSES[color] : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-col gap-1.5 p-3 rounded-lg border bg-white text-left transition-all',
        colorClasses?.border ?? 'border-stone-200',
        className
      ].join(' ')}
      data-composite={composite_name}
      data-composite-state="live"
      data-band={token.beacon_band}
      aria-label={`${composite_full_name} score ${token.beacon_score} of 100`}
    >
      <header className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${colorClasses?.text ?? 'text-stone-800'}`}>
          {composite_name}
        </span>
        <span className={`text-lg font-bold tabular-nums ${colorClasses?.text ?? 'text-stone-800'}`}>
          {token.beacon_score ?? '—'}
        </span>
      </header>
      <p className="text-xs text-stone-500">{composite_full_name}</p>
      <footer className="flex items-center gap-2 mt-1">
        {color ? (
          <span
            className={`inline-block w-2 h-2 rounded-full ${colorClasses?.bg ?? ''}`}
            aria-hidden
          />
        ) : null}
        {token.confidence ? (
          <span
            className="text-xs text-stone-500"
            title={`Confidence: ${token.confidence}`}
          >
            {token.confidence === 'high'
              ? '●●●'
              : token.confidence === 'medium'
                ? '●●○'
                : token.confidence === 'low'
                  ? '●○○'
                  : '○○○'}
          </span>
        ) : null}
      </footer>
    </button>
  );
}
