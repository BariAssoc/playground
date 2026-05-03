/**
 * CASCADE ROUTER — Selective Cascade Routing per FAB Family
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5.1 (selective routing table)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5.2 (cross-slot FAB rule)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5.3 (Smile Doctrine — unified Beacon color)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §3 (cascade stops at composite layer)
 * 
 * When a slot drift occurs, the cascade lights up specific surfaces based on
 * the FAB family that drifted. Different families produce different cascades.
 * 
 * Cross-slot FABs anchor cascade to START SLOT only (G3 §5.2).
 * Cascade NEVER bubbles past composite layer to apex (G2 §3).
 */

import type { FABFamily } from '../types/fab.js';
import type {
  CascadeRoutingRule,
  CascadeSurface,
  SlotCascadeFireEvent,
  SlotId,
  DriftSignalSource
} from '../types/slot.js';

// ─────────────────────────────────────────────────────────────────────────────
// SELECTIVE CASCADE ROUTING TABLE (G3 §5.1 — LOCKED)
// 
// Each FAB family maps to the surfaces that light up on cascade.
// Tile rims (R&R / Healthspan / My Blueprint) are NEVER lit by slot cascade —
// only by composite cascade (G3 §5.4).
// ─────────────────────────────────────────────────────────────────────────────

export const CASCADE_ROUTING_TABLE: ReadonlyArray<CascadeRoutingRule> = [
  {
    // Activity FABs (movement, exercise) → MEI composite + body composition feedback
    family: 'activity' as FABFamily,
    surfaces: [
      'bookshelf_slot',
      'ollie_space',
      'daily_pulse_fab_tracker',
      'daily_pulse_routine_tracker'
    ]
  },
  {
    // Metabolic FABs (nutrition, hydration) → MBC composite + metabolic surfaces
    family: 'metabolic' as FABFamily,
    surfaces: [
      'bookshelf_slot',
      'ollie_space',
      'daily_pulse_fab_tracker',
      'daily_pulse_routine_tracker',
      'composite_mbc'
    ]
  },
  {
    // Circadian FABs (sleep, light, timing) → CRC composite
    family: 'circadian' as FABFamily,
    surfaces: [
      'bookshelf_slot',
      'ollie_space',
      'daily_pulse_routine_tracker',
      'composite_crc'
    ]
  },
  {
    // Cognitive FABs (learning, focus) — does NOT light Daily Pulse PROD slot
    // (PROD slot 5 is locked_empty in Practice Edition per G6 §6)
    family: 'cognitive' as FABFamily,
    surfaces: ['bookshelf_slot', 'ollie_space', 'ai_playground']
  },
  {
    // Behavioral FABs (habits, routines) → BHR composite
    family: 'behavioral' as FABFamily,
    surfaces: [
      'bookshelf_slot',
      'ollie_space',
      'daily_pulse_fab_tracker',
      'composite_bhr'
    ]
  },
  {
    // Social FABs → Inner Circle / Vitamin S surface
    family: 'social' as FABFamily,
    surfaces: [
      'bookshelf_slot',
      'ollie_space',
      'inner_circle_vitamin_s',
      'composite_bhr'
    ]
  },
  {
    // Identity Fusion FABs → Logo (optional flicker per LOGO-EXPR §11) + BHR composite
    family: 'identity_fusion' as FABFamily,
    surfaces: [
      'bookshelf_slot',
      'ollie_space',
      'logo_optional',
      'composite_bhr'
    ]
  }
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP: surfaces to light for a given FAB family
// ─────────────────────────────────────────────────────────────────────────────

export function getCascadeSurfacesForFamily(
  family: FABFamily
): ReadonlyArray<CascadeSurface> {
  const rule = CASCADE_ROUTING_TABLE.find((r) => r.family === family);
  if (!rule) {
    // Defensive: unknown family → minimal cascade (slot + Ollie only)
    return ['bookshelf_slot', 'ollie_space'];
  }
  return rule.surfaces;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD CASCADE FIRE EVENT
// 
// Called when slot drift detected. Resolves START SLOT for cross-slot FABs
// per G3 §5.2 — cascade fires once, in the start slot only.
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildCascadeEventParams {
  userId: string;
  startSlotId: SlotId; // for cross-slot FABs, this is the START slot
  fab_family: FABFamily;
  fab_id: string;
  drift_signal: DriftSignalSource;
  smile_doctrine_color: string; // Beacon color all surfaces match (G3 §5.3)
  cascade_terminated_at?: CascadeSurface | null; // null = full cascade fired
}

export function buildSlotCascadeEvent(
  params: BuildCascadeEventParams
): SlotCascadeFireEvent {
  const surfaces_lit = [
    ...getCascadeSurfacesForFamily(params.fab_family)
  ];

  return {
    eventId: crypto.randomUUID(),
    userId: params.userId,
    timestamp: new Date().toISOString(),
    source: {
      slotId: params.startSlotId,
      fab_family: params.fab_family,
      fab_id: params.fab_id,
      drift_signal: params.drift_signal
    },
    surfaces_lit,
    cascade_terminated_at: params.cascade_terminated_at ?? null,
    smile_doctrine_color: params.smile_doctrine_color,
    contributes_to_signal_4: true, // slot drift always feeds Signal 4 count
    contributes_to_signal_5: false // slot drift is NOT engagement signal (G3 §3)
  };
}
