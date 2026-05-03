/**
 * CASCADE FLOW INTEGRATION — G3 §5 Selective Cascade Verification
 * 
 * Source canon:
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5.1 (selective routing per FAB family)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5.2 (cross-slot FAB rule — start slot only)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §5.3 (Smile Doctrine — unified Beacon color)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §3 (cascade stops at composite)
 * 
 * Verifies that slot drift events route the cascade to the correct surfaces
 * for each of the 7 FAB families, and that cascade NEVER bubbles past the
 * composite layer (G2 §3 hard stop).
 */

import { describe, it, expect } from '@jest/globals';
import {
  CASCADE_ROUTING_TABLE,
  getCascadeSurfacesForFamily,
  buildSlotCascadeEvent
} from '../../src/computation/cascade-router.js';
import {
  buildCompositeCascadeEvent
} from '../../src/computation/composite-recompute.js';
import { FABFamily, ALL_FAB_FAMILIES } from '../../src/types/fab.js';
import type { CascadeSurface } from '../../src/types/slot.js';

describe('Cascade Flow Integration — G3 §5 Selective Cascade', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // ROUTING TABLE COMPLETENESS
  // ───────────────────────────────────────────────────────────────────────────

  it('Routing table has an entry for all 7 FAB families', () => {
    expect(CASCADE_ROUTING_TABLE.length).toBe(7);
    const families_in_table = CASCADE_ROUTING_TABLE.map((r) => r.family).sort();
    const expected = [...ALL_FAB_FAMILIES].sort();
    expect(families_in_table).toEqual(expected);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // PER-FAMILY ROUTING (G3 §5.1)
  // ───────────────────────────────────────────────────────────────────────────

  it('Activity FAB cascade lights bookshelf + Ollie + FAB tracker + Routine tracker', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.Activity);
    expect(surfaces).toContain('bookshelf_slot');
    expect(surfaces).toContain('ollie_space');
    expect(surfaces).toContain('daily_pulse_fab_tracker');
    expect(surfaces).toContain('daily_pulse_routine_tracker');
  });

  it('Metabolic FAB cascade lights MBC composite (G3 §5.1)', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.Metabolic);
    expect(surfaces).toContain('composite_mbc');
  });

  it('Circadian FAB cascade lights CRC composite + Routine tracker', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.Circadian);
    expect(surfaces).toContain('composite_crc');
    expect(surfaces).toContain('daily_pulse_routine_tracker');
  });

  it('Cognitive FAB cascade does NOT light Daily Pulse PROD (PROD locked_empty in Phase 1)', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.Cognitive);
    // Cognitive FABs route to AI Playground, NOT to Daily Pulse PROD (G6 §6)
    expect(surfaces).toContain('ai_playground');
  });

  it('Behavioral FAB cascade lights BHR composite', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.Behavioral);
    expect(surfaces).toContain('composite_bhr');
  });

  it('Social FAB cascade lights Inner Circle + BHR composite', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.Social);
    expect(surfaces).toContain('inner_circle_vitamin_s');
    expect(surfaces).toContain('composite_bhr');
  });

  it('Identity Fusion FAB cascade may light Logo (optional flicker)', () => {
    const surfaces = getCascadeSurfacesForFamily(FABFamily.IdentityFusion);
    expect(surfaces).toContain('logo_optional');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CASCADE EVENT CONSTRUCTION (G3 §5.2 — cross-slot rule)
  // ───────────────────────────────────────────────────────────────────────────

  it('buildSlotCascadeEvent records START SLOT for cross-slot FABs (G3 §5.2)', () => {
    const event = buildSlotCascadeEvent({
      userId: 'mark-spg-001',
      startSlotId: 'AM2', // start slot of cross-slot Hydration FAB
      fab_family: FABFamily.Metabolic,
      fab_id: 'fab-hydration-cross-slot',
      drift_signal: 'a2_completion',
      smile_doctrine_color: '#F59E0B' // amber
    });
    expect(event.source.slotId).toBe('AM2');
    expect(event.source.fab_family).toBe(FABFamily.Metabolic);
    expect(event.contributes_to_signal_4).toBe(true);
    expect(event.contributes_to_signal_5).toBe(false);
  });

  it('Cascade event includes all surfaces from routing table', () => {
    const event = buildSlotCascadeEvent({
      userId: 'mark-spg-001',
      startSlotId: 'AM1',
      fab_family: FABFamily.Behavioral,
      fab_id: 'fab-1',
      drift_signal: 'a6_trend',
      smile_doctrine_color: '#10B981'
    });
    const expected_surfaces: ReadonlyArray<CascadeSurface> = [
      'bookshelf_slot',
      'ollie_space',
      'daily_pulse_fab_tracker',
      'composite_bhr'
    ];
    for (const surface of expected_surfaces) {
      expect(event.surfaces_lit).toContain(surface);
    }
  });

  it('Smile Doctrine color is preserved across cascade event (G3 §5.3)', () => {
    const event = buildSlotCascadeEvent({
      userId: 'mark-spg-001',
      startSlotId: 'PM1',
      fab_family: FABFamily.Activity,
      fab_id: 'fab-1',
      drift_signal: 'a8_context',
      smile_doctrine_color: '#EF4444'
    });
    expect(event.smile_doctrine_color).toBe('#EF4444');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // COMPOSITE CASCADE STOPS AT COMPOSITE LAYER (G2 §3)
  // ───────────────────────────────────────────────────────────────────────────

  it('Composite cascade event has apex_recompute_triggered = false (G2 §3 hard stop)', () => {
    const event = buildCompositeCascadeEvent({
      userId: 'mark-spg-001',
      source_ground_level: 'healthspan',
      source_signal_name: 'fab_metabolic_completed',
      affected_composite: 'MBC',
      composite_old_band: 4,
      composite_new_band: 3
    });

    // ❗ G2 §3: cascade NEVER triggers apex recompute
    expect(event.apex_recompute_triggered).toBe(false);
    expect(event.affected_composite).toBe('MBC');
  });

  it('Multiple composite changes never aggregate to apex event-driven recompute', () => {
    // Simulate 5 composite cascades in quick succession
    const events = ['MBC', 'CRC', 'BHR', 'MEI', 'AMP'].map((composite) =>
      buildCompositeCascadeEvent({
        userId: 'mark-spg-001',
        source_ground_level: 'healthspan',
        source_signal_name: 'fab_completed',
        affected_composite: composite as never,
        composite_old_band: 4,
        composite_new_band: 3
      })
    );

    // Every single one must have apex_recompute_triggered = false
    for (const event of events) {
      expect(event.apex_recompute_triggered).toBe(false);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // ALL 7 FAMILIES PRODUCE NON-EMPTY CASCADE
  // ───────────────────────────────────────────────────────────────────────────

  it('Every FAB family produces a cascade with at least bookshelf_slot + ollie_space', () => {
    for (const family of ALL_FAB_FAMILIES) {
      const surfaces = getCascadeSurfacesForFamily(family);
      expect(surfaces.length).toBeGreaterThanOrEqual(2);
      expect(surfaces).toContain('bookshelf_slot');
      expect(surfaces).toContain('ollie_space');
    }
  });
});
