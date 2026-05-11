/**
 * BariAccess Lite Beta UI — Canon Constants
 *
 * Source: CCO-LITE-BETA-UI-001 v1.0 LOCKED
 *
 * Every constant here must trace back to a locked canon section.
 * Do NOT add constants without a canon citation.
 */

// ────────────────────────────────────────────────────────────
// §4 — ABA COMPANION NAMES — 13-pool
// 3 locked, 10 TBD by Val. Onboarding offers the pool; user picks one.
// ────────────────────────────────────────────────────────────

export interface AbaName {
  id: string;
  name: string;
  status: 'LOCKED' | 'TBD';
  note?: string;
}

export const ABA_POOL: readonly AbaName[] = [
  { id: 'max',   name: 'Max',   status: 'LOCKED', note: 'Company default' },
  { id: 'atlas', name: 'Atlas', status: 'LOCKED', note: "Zakiy's ABA" },
  { id: 'athos', name: 'Athos', status: 'LOCKED', note: "Val's (Dr. Andrei) ABA" },
  // 10 names TBD by Val per §9 Open Items
  { id: 'tbd-04', name: 'TBD #4',  status: 'TBD' },
  { id: 'tbd-05', name: 'TBD #5',  status: 'TBD' },
  { id: 'tbd-06', name: 'TBD #6',  status: 'TBD' },
  { id: 'tbd-07', name: 'TBD #7',  status: 'TBD' },
  { id: 'tbd-08', name: 'TBD #8',  status: 'TBD' },
  { id: 'tbd-09', name: 'TBD #9',  status: 'TBD' },
  { id: 'tbd-10', name: 'TBD #10', status: 'TBD' },
  { id: 'tbd-11', name: 'TBD #11', status: 'TBD' },
  { id: 'tbd-12', name: 'TBD #12', status: 'TBD' },
  { id: 'tbd-13', name: 'TBD #13', status: 'TBD' },
] as const;

export const ABA_DEFAULT = 'Max';

// ────────────────────────────────────────────────────────────
// §5 — JOTFORM NOTIFICATION FLOW timing constants
// ────────────────────────────────────────────────────────────

/** Step 3c — No answer in 50 seconds → default reminder 1 hour, prompt disappears */
export const JOTFORM_NO_ANSWER_TIMEOUT_MS = 50 * 1000;

/** Step 4 — Reminder options. ONE CHANCE ONLY. */
export const REMINDER_OPTIONS_MS = {
  THIRTY_MIN: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  NEVER: null,
} as const;

/** Default reminder window if user lets the prompt time out */
export const DEFAULT_REMINDER_MS = REMINDER_OPTIONS_MS.ONE_HOUR;

/** Step 5 — Parking Lot retention window */
export const PARKING_LOT_RETENTION_MS = 72 * 60 * 60 * 1000;

// ────────────────────────────────────────────────────────────
// §5 — VOICE LINES (LOCKED)
// Never paraphrase. Never substitute "you got mail" or Outlook flavor.
// ────────────────────────────────────────────────────────────

export const VOICE = {
  ANNOUNCE: 'You got the message.',
  PROMPT: 'You got it — are you ready — yes or no?',
  PARKING: "I'll keep it in your Parking Lot.",
  EVENING_INTRO: (abaName: string) => `Let me bring ${abaName}.`,
  EVENING_AMBIENCE: (abaName: string) =>
    `I'll let ${abaName} tell you what you need — how to get ready for tonight.`,
  ABA_DAY_1:
    "You're doing a great job. Dr. Andrei is sending you a great message soon — we'll go live.",
} as const;

// ────────────────────────────────────────────────────────────
// §3 — DAILY PULSE ROW 5 — 6 trackers, LOCKED order
// ────────────────────────────────────────────────────────────

export type DailyPulseTracker = 'FAB' | 'ITB' | 'BEACON' | 'ROUTINE' | 'PROD' | 'PARK';

export const DAILY_PULSE_ORDER: readonly DailyPulseTracker[] = [
  'FAB',
  'ITB',
  'BEACON',
  'ROUTINE',
  'PROD',
  'PARK',
] as const;

// ────────────────────────────────────────────────────────────
// §3 — ROW 1 CONSTELLATION CROWN tiles — LOCKED 4-tile order
// ────────────────────────────────────────────────────────────

export type CrownTile = 'R&R' | 'Healthspan' | 'My Blueprint' | 'Inner Circle';

export const CROWN_ORDER: readonly CrownTile[] = [
  'R&R',
  'Healthspan',
  'My Blueprint',
  'Inner Circle',
] as const;

// ────────────────────────────────────────────────────────────
// §3 — ROUTINE BOOKSHELF segments
// AM / MID / PM replaces Morning / Midday / Evening per
// April 22, 2026 voice-to-text correction memo.
// ────────────────────────────────────────────────────────────

export type BookshelfSegment = 'AM' | 'MID' | 'PM';

export const BOOKSHELF_LABELS = {
  AM: 'MORNING',
  MID: 'MIDDAY',
  PM: 'EVENING',
} as const satisfies Record<BookshelfSegment, string>;

// ────────────────────────────────────────────────────────────
// §3 — Q INBOX
// THE inbox. Never "box", never "queue", never "inbox-Q".
// ────────────────────────────────────────────────────────────

export const Q_LABEL = 'Q';

// ────────────────────────────────────────────────────────────
// §8 — DAY-1 ONBOARDING SPINE — 6 steps
// ────────────────────────────────────────────────────────────

export interface Day1Step {
  step: number;
  surface: string;
  asset: string;
}

export const DAY1_SPINE: readonly Day1Step[] = [
  { step: 1, surface: 'Rhythm Board',        asset: 'Video: What the Rhythm Board does' },
  { step: 2, surface: 'Routine Bookshelf',   asset: 'Video: Morning / Midday / Evening + FABs as wedges' },
  { step: 3, surface: 'Memory Snap',         asset: 'Video: (content TBD by Val)' },
  { step: 4, surface: 'Two Cards',           asset: 'Both cards can be education cards at onboarding' },
  { step: 5, surface: 'Constellation Panel + AI', asset: 'Video: How the Constellation Panel works with AI' },
  { step: 6, surface: 'Notification + Ollie', asset: 'Video: How notifications flow through Ollie\u2019s voice' },
] as const;
