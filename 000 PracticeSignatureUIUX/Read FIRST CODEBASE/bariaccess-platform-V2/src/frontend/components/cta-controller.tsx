/**
 * CTA CONTROLLER — PAC-ISE-005 §6 reference component
 * 
 * Source canon:
 *   - PAC-ISE-005 v1.0A §6 (CTA Controller spec)
 *   - PAC-ISE-001 v1.0A §4.2 (CTAPolicy schema)
 * 
 * LANE 1 (render only).
 * Receives a CTA policy + a candidate list of CTAs from upstream;
 * filters, orders, and limits according to policy. Does NOT decide
 * what CTAs exist — just how many show and in what order.
 */

import type { CTAPolicy, OrderingBias } from '../../types/ise.js';
import { CTA_MODE_CLASSES } from '../tokens/ise-render-tokens.js';

// ─────────────────────────────────────────────────────────────────────────────
// CTA CANDIDATE — a CTA proposed by upstream business logic
// ─────────────────────────────────────────────────────────────────────────────

export interface CTACandidate {
  id: string;
  label: string;
  category: 'performance' | 'recovery' | 'continuity' | 'next_step' | 'approved';
  /** Restricted action key — if listed in policy.restrictedActions, this CTA is hidden */
  restrictionKey?: string;
  onClick: () => void;
}

export interface CTAControllerProps {
  policy: CTAPolicy;
  candidates: CTACandidate[];
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERING — Lane 1 sort logic per PAC-ISE-005 §6.3
// 
// Uses orderingBias to bring matching-category candidates to the top.
// Stable sort — preserves caller's original ordering within categories.
// ─────────────────────────────────────────────────────────────────────────────

function getCategoryPriority(
  category: CTACandidate['category'],
  bias: OrderingBias
): number {
  switch (bias) {
    case 'performanceFirst':
      return category === 'performance' ? 0 : 1;
    case 'recoveryFirst':
      return category === 'recovery' ? 0 : 1;
    case 'continuityFirst':
      return category === 'continuity' ? 0 : 1;
    case 'oneNextStep':
      return category === 'next_step' ? 0 : 1;
    case 'approvedOnly':
      return category === 'approved' ? 0 : 99;
    case 'none':
      return 0;
    default: {
      const _exhaustive: never = bias;
      void _exhaustive;
      return 0;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function CTAController({
  policy,
  candidates,
  className = ''
}: CTAControllerProps): JSX.Element {
  // 1. Filter restricted actions (PAC-ISE-005 §6.4)
  const restrictedSet = new Set(policy.restrictedActions);
  let filtered = candidates.filter((c) =>
    c.restrictionKey ? !restrictedSet.has(c.restrictionKey) : true
  );

  // 2. approvedOnly mode: hide everything not in 'approved' category
  if (policy.orderingBias === 'approvedOnly') {
    filtered = filtered.filter((c) => c.category === 'approved');
  }

  // 3. Stable sort by category priority
  const ordered = [...filtered]
    .map((c, idx) => ({
      candidate: c,
      priority: getCategoryPriority(c.category, policy.orderingBias),
      originalIdx: idx
    }))
    .sort((a, b) => a.priority - b.priority || a.originalIdx - b.originalIdx)
    .map((x) => x.candidate);

  // 4. Cap at maxVisible
  const visible = ordered.slice(0, policy.maxVisible);

  const composed = [
    'flex flex-wrap gap-2 p-3 rounded-lg border transition-all',
    CTA_MODE_CLASSES[policy.mode],
    className
  ].join(' ');

  return (
    <div
      className={composed}
      data-cta-mode={policy.mode}
      data-cta-bias={policy.orderingBias}
      role="group"
      aria-label="Available actions"
    >
      {visible.length === 0 ? (
        <p className="text-sm text-stone-500 italic">No actions available right now.</p>
      ) : (
        visible.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={c.onClick}
            className="px-4 py-2 rounded-md bg-white border border-stone-200 hover:border-stone-400 transition-colors text-sm font-medium"
          >
            {c.label}
          </button>
        ))
      )}
    </div>
  );
}
