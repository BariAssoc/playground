/**
 * BariAccess Lite Beta UI — Theme Palette
 *
 * Source: CCO-LITE-BETA-UI-001 v1.0 §2 Expression Color Code (LOCKED)
 *         + Beacon_Canon_v1_1.md §4 Color Bands
 *
 * This file is the single runtime source of truth for color tokens.
 * Tailwind config provides ergonomic aliases; canonical values live here.
 */

import { BeaconBand } from '@bariaccess-lite/shared';

// ────────────────────────────────────────────────────────────
// EXPRESSION COLOR CODE — §2 LOCKED (6 states)
// Communicates surface state, NOT biometric score.
// Ollie owns all expression signals.
// ────────────────────────────────────────────────────────────

export type ExpressionState =
  | 'BLUE'    // Ollie announcing
  | 'GREEN'   // FAB completed / on track
  | 'ORANGE'  // FAB missed / deferred
  | 'RED'     // Critical / delinquent
  | 'PURPLE'  // AI Playground active — ABA responding
  | 'WHITE';  // Night mode

export interface ExpressionTokens {
  /** Primary text color when in this state */
  text: string;
  /** Fill background for bubbles, cards, banners */
  bubbleBg: string;
  /** 1.5px border accent */
  border: string;
  /** Solid swatch dot — used in legends, controls */
  dot: string;
  /** Canon §2 trigger label */
  trigger: string;
  /** Canon §2 meaning label */
  meaning: string;
}

export const EXPRESSION: Record<ExpressionState, ExpressionTokens> = {
  BLUE: {
    text: '#1E40AF',
    bubbleBg: '#EFF6FF',
    border: '#93C5FD',
    dot: '#3B82F6',
    trigger: "Ollie announces AskABA / Max / [user's ABA]",
    meaning: 'Conversation initiating',
  },
  GREEN: {
    text: '#166534',
    bubbleBg: '#F0FDF4',
    border: '#86EFAC',
    dot: '#22C55E',
    trigger: 'Good result',
    meaning: 'FAB completed — on track',
  },
  ORANGE: {
    text: '#9A3412',
    bubbleBg: '#FFF7ED',
    border: '#FDBA74',
    dot: '#F97316',
    trigger: 'Signal detected',
    meaning: 'FAB missed / deferred',
  },
  RED: {
    text: '#991B1B',
    bubbleBg: '#FEF2F2',
    border: '#FCA5A5',
    dot: '#EF4444',
    trigger: 'Critical missed',
    meaning: 'Delinquent — urgent',
  },
  PURPLE: {
    text: '#6B21A8',
    bubbleBg: '#FAF5FF',
    border: '#D8B4FE',
    dot: '#A855F7',
    trigger: 'AI Playground active',
    meaning: 'AskABA / Max responding',
  },
  WHITE: {
    text: '#374151',
    bubbleBg: '#FFFFFF',
    border: '#E5E7EB',
    dot: '#D1D5DB',
    trigger: 'Night mode',
    meaning: 'Relaxation — breathing — sleep',
  },
};

// ────────────────────────────────────────────────────────────
// BEACON BAND COLORS — Beacon_Canon_v1_1.md §4 (7 asymmetric bands)
// Separate from Expression Code per §2 "Expression Layer is entirely
// separate from Beacon bands."
// ────────────────────────────────────────────────────────────

export interface BandTokens {
  /** Fill for the band visualization rectangle */
  fill: string;
  /** Stroke for the band visualization */
  stroke: string;
  /** Text color used inside the band */
  text: string;
  /** Score range label */
  range: string;
  /** Human-readable name */
  label: string;
}

export const BAND: Record<BeaconBand, BandTokens> = {
  [BeaconBand.STRONG_GREEN]: { fill: '#DCFCE7', stroke: '#16A34A', text: '#166534', range: '95–100', label: 'Strong Green' },
  [BeaconBand.MED_GREEN]:    { fill: '#BBF7D0', stroke: '#15803D', text: '#14532D', range: '85–94',  label: 'Medium Green' },
  [BeaconBand.FAINT_GREEN]:  { fill: '#D1FAE5', stroke: '#10B981', text: '#065F46', range: '80–84',  label: 'Faint Green' },
  [BeaconBand.LIGHT_ORANGE]: { fill: '#FED7AA', stroke: '#F97316', text: '#9A3412', range: '70–79',  label: 'Light Orange' },
  [BeaconBand.MED_ORANGE]:   { fill: '#FDBA74', stroke: '#EA580C', text: '#7C2D12', range: '65–69',  label: 'Medium Orange' },
  [BeaconBand.DARK_ORANGE]:  { fill: '#FB923C', stroke: '#C2410C', text: '#7C2D12', range: '60–64',  label: 'Dark Orange' },
  [BeaconBand.RED]:          { fill: '#FECACA', stroke: '#DC2626', text: '#991B1B', range: '<60',    label: 'Red' },
};

// ────────────────────────────────────────────────────────────
// CASCADE RIM — per Pass 1 §R&R Cascade Rim Rule
// Orange rim on parent tile when ANY sub-band ≥ 4 (i.e., 4-7).
// ────────────────────────────────────────────────────────────

export const CASCADE_RIM_COLOR = '#F97316';

// ────────────────────────────────────────────────────────────
// SURFACE BACKGROUND — Lite Beta background tone (from screenshots)
// ────────────────────────────────────────────────────────────

export const SURFACE = {
  pageBg: '#F4ECE6',
  panelBg: 'rgba(244, 236, 230, 1)',
  cardBg: '#FFFFFF',
  ink: '#0A0A0A',
  inkMuted: '#6B7280',
  divider: '#E5E7EB',
  nightBg: '#FAFAF9',  // §2 ⚪ Opaque White night mode
};
