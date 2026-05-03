/**
 * BEACON COLOR TOKENS — Beacon band → CSS color mapping
 * 
 * Source canon:
 *   - Beacon Canon v1.1 §4 (7-band color names + emoji indicators)
 * 
 * ⚠️ AUDIT 2026-05-03 — DESIGN HANDOFF
 * 
 * Pre-audit notes incorrectly cited Beacon §13 as the color spec source.
 * §13 is "Data Resilience Model" — colors are NOT specified there. Canon §4
 * provides only band names + emoji indicators, NOT exact hex values.
 * 
 * Implementation rationale:
 *   - Beta launch needs to ship something legible. Saturated default Tailwind
 *     colors (bg-emerald-500, bg-red-500) read as generic "AI-default styling"
 *     and risk looking unprofessional next to clinical content.
 *   - Nikita (design lead) owns the final palette. Until her tokens land,
 *     this file uses MUTED NEUTRALS that preserve the canonical color grammar
 *     (Strong Green = positive, Red = clinical concern) while looking calmer
 *     and more clinical.
 *   - Approved by Val 2026-05-03 for beta launch.
 * 
 * Migration to Nikita's palette:
 *   When Nikita delivers final hex tokens, replace the Tailwind utility classes
 *   below with arbitrary-value Tailwind syntax (e.g., bg-[#DDE4D6]). The shape
 *   of BEACON_COLOR_CLASSES (bg/border/text/rim) does not change.
 */

import type { BeaconBand, BeaconColor } from '../../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// BEACON COLOR → Tailwind background + border + text classes
// ─────────────────────────────────────────────────────────────────────────────

export interface BeaconColorClasses {
  bg: string;
  border: string;
  text: string;
  rim: string; // for tile rims, slot indicators, etc.
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTED NEUTRAL PALETTE — Phase 1 beta defaults
// 
// Color grammar preserved: green spectrum = positive, amber spectrum = caution,
// rose = clinical. Saturation reduced across the board to avoid "AI default" feel.
// 
// Provenance:
//   - Greens: warm emerald tints (less saturated than emerald-500/green-400)
//   - Ambers: replaces "orange" — warmer / softer for the largest user band
//   - Rose: replaces pure red — clinical but compassionate per canon §4
//     Band 7: "Compassionate response — protect, don't punish."
// ─────────────────────────────────────────────────────────────────────────────

export const BEACON_COLOR_CLASSES: Readonly<Record<BeaconColor, BeaconColorClasses>> = {
  strong_green: {
    // Band 1 — top tier; muted sage with definite presence
    bg: 'bg-emerald-100',
    border: 'border-emerald-400',
    text: 'text-emerald-800',
    rim: 'ring-emerald-400'
  },
  med_green: {
    // Band 2 — above curve
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    rim: 'ring-emerald-300'
  },
  faint_green: {
    // Band 3 — pre-signal zone; deliberately less saturated to read as boundary
    bg: 'bg-stone-50',
    border: 'border-emerald-200',
    text: 'text-stone-700',
    rim: 'ring-emerald-200'
  },
  light_orange: {
    // Band 4 — average; warm but not alarming (most users live here)
    bg: 'bg-stone-100',
    border: 'border-amber-300',
    text: 'text-stone-700',
    rim: 'ring-amber-300'
  },
  med_orange: {
    // Band 5 — below average; clearer caution signal
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    text: 'text-amber-800',
    rim: 'ring-amber-400'
  },
  dark_orange: {
    // Band 6 — significantly below; stronger caution
    bg: 'bg-amber-100',
    border: 'border-amber-500',
    text: 'text-amber-900',
    rim: 'ring-amber-500'
  },
  red: {
    // Band 7 — clinical concern; warm rose (NOT pure red) per canon §4
    // "Compassionate response — protect, don't punish."
    bg: 'bg-rose-50',
    border: 'border-rose-400',
    text: 'text-rose-800',
    rim: 'ring-rose-400'
  }
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BAND NUMBER → color (convenience)
// ─────────────────────────────────────────────────────────────────────────────

export const BAND_TO_COLOR: Readonly<Record<BeaconBand, BeaconColor>> = {
  1: 'strong_green',
  2: 'med_green',
  3: 'faint_green',
  4: 'light_orange',
  5: 'med_orange',
  6: 'dark_orange',
  7: 'red'
} as const;

export function getBeaconClasses(band: BeaconBand): BeaconColorClasses {
  const color = BAND_TO_COLOR[band];
  return BEACON_COLOR_CLASSES[color];
}
