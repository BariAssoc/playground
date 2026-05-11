/**
 * UI-specific types not present in @bariaccess-lite/shared.
 * Backend types (ScoreResult, BeaconBand, etc.) are imported from shared.
 */

import type { ExpressionState } from '../theme/palette.js';

// ────────────────────────────────────────────────────────────
// JOTFORM — §5 6-step flow state machine
// ────────────────────────────────────────────────────────────

export type JotFormStatus =
  | 'IDLE'
  | 'ANNOUNCED'      // Step 1 + 2 — Ollie's Space active
  | 'WORKPAD_OPEN'   // Step 3a — Yes → Now
  | 'DEFERRED'       // Step 3b — Yes → Later
  | 'REMINDER_SHOWN' // Step 4 — picker visible (ONE CHANCE)
  | 'PARKED'         // Step 5 — Parking Lot, 72h timer
  | 'COMPLETED'      // happy path terminal
  | 'ARCHIVED';      // Step 6 — Three Dots, marked incomplete

export interface JotFormItem {
  id: string;
  title: string;
  body?: string;
  /** When the item was announced */
  announcedAt: number;
  /** When the item entered Parking Lot (if applicable) */
  parkedAt: number | null;
  /** Scheduled reminder time, ms epoch */
  reminderAt: number | null;
  /** Has the user already used their ONE CHANCE picker selection? */
  reminderSelected: boolean;
  status: JotFormStatus;
  /** §2 color the surface is rendering in */
  expression: ExpressionState;
}

// ────────────────────────────────────────────────────────────
// Q INBOX item
// ────────────────────────────────────────────────────────────

export type QItemKind = 'jotform' | 'learn' | 'memory-snap' | 'message';
export type QItemSource = 'ollie' | 'aba' | 'provider' | 'system';

export interface QItem {
  id: string;
  kind: QItemKind;
  source: QItemSource;
  title: string;
  preview: string;
  receivedAt: number;
  read: boolean;
  /** Optional link to JotForm or other item */
  refId?: string;
}

// ────────────────────────────────────────────────────────────
// DUAL AI speaker state — §6
// ────────────────────────────────────────────────────────────

export type AISpeaker = 'ollie' | 'aba' | null;

export interface DualAIBubble {
  /** Who is speaking right now. Drives icon dimming. */
  speaker: AISpeaker;
  /** Body text inside the bubble */
  text: string;
  /** Lead-in from Ollie when ABA is the speaker (e.g., "Let me bring Max.") */
  ollieLeadIn?: string;
  /** Expression color of the bubble — usually BLUE (Ollie) or PURPLE (ABA active) */
  expression: ExpressionState;
}

// ────────────────────────────────────────────────────────────
// SIMULATION step (used by SimulationScreen — 12 steps)
// ────────────────────────────────────────────────────────────

export interface BookshelfState {
  morning: number;
  midday: number;
  evening: number;
  /** Number of midday segments showing the orange deferred state */
  mOrange: number;
}

export type OverlayKind =
  | 'YES_NO'
  | 'WORKPAD'
  | 'REMINDER'
  | 'PARKING_COUNTER'
  | null;

export interface SimStep {
  n: number;
  title: string;
  phase: 'MORNING' | 'MIDDAY' | 'EVENING' | 'NIGHT';
  expression: ExpressionState;
  ollieText: string;
  bubbleVisible: boolean;
  bubbleText: string | null;
  bookshelf: BookshelfState;
  fabBadge: number;
  activeSpeaker: AISpeaker;
  overlay: OverlayKind;
  isNight: boolean;
  rRimColor: string | null;
  caption: string;
  canonRef: string;
}
