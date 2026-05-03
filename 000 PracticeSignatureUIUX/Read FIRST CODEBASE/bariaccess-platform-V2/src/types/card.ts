/**
 * CARD — Cards as Communication Layer
 * 
 * Source canon:
 *   - MEMO-CARD-COMM-001 §1 (Cards as communication layer)
 *   - MEMO-CARD-COMM-001 §2 (4 origin paths + on-demand)
 *   - MEMO-CARD-COMM-001 §3 (Cards → Journal bridge)
 *   - MEMO-CARD-COMM-001 §4 (Slot Card variant)
 *   - CCO-UX-CARD-COMM-PATCH-001 v1.0 §5 (per-card-origin visibility)
 * 
 * This file defines TYPES ONLY.
 */

import type { CardOrigin, InterfaceLayer } from './journal.js';

// Re-export
export type { CardOrigin, InterfaceLayer };

// ─────────────────────────────────────────────────────────────────────────────
// CARD SURFACES (where cards live — MEMO-CARD-COMM-001 §6)
// ─────────────────────────────────────────────────────────────────────────────

export type CardSurface =
  | 'rhythm_board_card_area'
  | 'rhythm_board_q_dropdown'
  | 'rhythm_board_bookshelf'
  | 'constellation_panel_overlay'
  | 'provider_dashboard';

// ─────────────────────────────────────────────────────────────────────────────
// SURFACE → INTERFACE MAPPING (G5 §5)
// ─────────────────────────────────────────────────────────────────────────────

export const CARD_SURFACE_TO_INTERFACE: Readonly<Record<CardSurface, InterfaceLayer>> = {
  rhythm_board_card_area: 'CCIE-interface',
  rhythm_board_q_dropdown: 'CCIE-interface',
  rhythm_board_bookshelf: 'CCIE-interface',
  constellation_panel_overlay: 'CCIE-interface',
  provider_dashboard: 'CPIE-interface'
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CARD ORIGIN → SURFACE MAPPING
// ─────────────────────────────────────────────────────────────────────────────

export const CARD_ORIGIN_TO_SURFACE: Readonly<Record<CardOrigin, CardSurface>> = {
  program_originated: 'rhythm_board_card_area',
  q_originated: 'rhythm_board_q_dropdown',
  constellation_panel_originated: 'constellation_panel_overlay',
  bookshelf_originated: 'rhythm_board_bookshelf',
  provider_originated: 'provider_dashboard'
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CARD METADATA — generic envelope for any card type
// ─────────────────────────────────────────────────────────────────────────────

export interface CardEnvelope {
  card_id: string;
  origin: CardOrigin;
  surface: CardSurface;
  interface_layer: InterfaceLayer;
  triggered_at: string; // ISO 8601
  triggered_by: string; // event reference (program_id, slot_id, tile_id, etc.)
  journal_entry_id?: string; // if card surfaces a journal touchpoint
}

// ─────────────────────────────────────────────────────────────────────────────
// SLOT CARD (MEMO-CARD-COMM-001 §4 — Bookshelf-originated card variant)
// Replaces the working term "Card Expansion" used in RBSHELF v1.1 + EXPR v2.0 §9.4
// ─────────────────────────────────────────────────────────────────────────────

export interface SlotCard extends CardEnvelope {
  origin: 'bookshelf_originated';
  surface: 'rhythm_board_bookshelf';
  slot_id: string; // SlotId from src/types/slot.ts
  fab_ids_in_slot: string[]; // FAB instance IDs revealed by the Slot Card
  /**
   * Slot Cards surface FAB-level reveal of what lives underneath the slot.
   * Tap behavior: per RBSHELF v1.1 §6.5.4 + §8.1 — opens FAB close-out interactions.
   */
}
