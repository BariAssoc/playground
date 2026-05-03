/**
 * ISE RENDER TOKENS — Canonical token-to-CSS mapping
 * 
 * Source canon:
 *   - PAC-ISE-001 v1.0A §4.1 (identity icon token vocabulary)
 *   - PAC-ISE-005 v1.0A §5 (frontend reference component spec)
 * 
 * Maps each render-token enum value to a Tailwind class string.
 * 
 * IMPORTANT (Two-Lane Authority — ISE Canon v3.0 §3.1):
 *   This file is LANE 1 (render layer). It maps tokens to visual treatment ONLY.
 *   No business logic. No threshold checks. No state decisions.
 *   The Resolver (Lane 1 source-of-truth) sends tokens; the renderer obeys.
 */

import type {
  Posture,
  Saturation,
  Motion,
  Overlay,
  CTAMode,
  OllieCadence,
  PromptDensity,
  VoiceStyle
} from '../../types/ise.js';

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY ICON — POSTURE → Tailwind transform
// ─────────────────────────────────────────────────────────────────────────────

export const POSTURE_CLASSES: Readonly<Record<Posture, string>> = {
  neutral: 'transform-none',
  upright: 'transform-none', // baseline upright; treated identically to neutral
  softened: 'scale-95 translate-y-px',
  contained: 'scale-90'
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY ICON — SATURATION → Tailwind opacity / saturate
// ─────────────────────────────────────────────────────────────────────────────

export const SATURATION_CLASSES: Readonly<Record<Saturation, string>> = {
  standard: 'saturate-100 opacity-100',
  bright: 'saturate-150 opacity-100',
  muted: 'saturate-50 opacity-90',
  lightOpacity: 'saturate-100 opacity-60'
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY ICON — MOTION → CSS animation name
// 
// Each motion value corresponds to a keyframe defined in the host stylesheet.
// PAC-ISE-005 §10: animations honor `prefers-reduced-motion: reduce` —
// when set, all motion values resolve to 'none'.
// ─────────────────────────────────────────────────────────────────────────────

export const MOTION_CLASSES: Readonly<Record<Motion, string>> = {
  none: '',
  subtleIdle: 'animate-[ise-subtle-idle_4s_ease-in-out_infinite] motion-reduce:animate-none',
  steadyIdle: 'animate-[ise-steady-idle_3s_ease-in-out_infinite] motion-reduce:animate-none',
  minimal: 'animate-[ise-minimal_8s_ease-in-out_infinite] motion-reduce:animate-none'
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY ICON — OVERLAY (extended in G6 §3.3)
// ─────────────────────────────────────────────────────────────────────────────

export const OVERLAY_DESCRIPTORS: Readonly<
  Record<Overlay, { showLockGlyph: boolean; glyphTone: string; ariaLabel: string }>
> = {
  none: {
    showLockGlyph: false,
    glyphTone: '',
    ariaLabel: ''
  },
  shieldLock: {
    showLockGlyph: true,
    glyphTone: 'text-amber-500',
    ariaLabel: 'Identity guarded'
  },
  tileLock: {
    showLockGlyph: true,
    glyphTone: 'text-stone-400',
    ariaLabel: 'Tile locked — opens later'
  }
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CTA MODE → Tailwind chrome (frame styling around the CTA cluster)
// ─────────────────────────────────────────────────────────────────────────────

export const CTA_MODE_CLASSES: Readonly<Record<CTAMode, string>> = {
  default: 'border-stone-200',
  build: 'border-emerald-300 bg-emerald-50/40',
  recovery: 'border-amber-300 bg-amber-50/40',
  compress: 'border-stone-300 bg-stone-50',
  restricted: 'border-rose-300 bg-rose-50/40',
  onboarding: 'border-sky-300 bg-sky-50/40'
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OLLIE CADENCE → typing-rhythm hint (used by chat surface)
// 
// These values map to ms intervals between Ollie utterance bursts.
// Frontend uses them as setTimeout delays in the streaming-text component.
// ─────────────────────────────────────────────────────────────────────────────

export const OLLIE_CADENCE_INTERVAL_MS: Readonly<Record<OllieCadence, number>> = {
  neutral: 1200,
  forward: 600,
  slow: 2400,
  minimal: 4000,
  strictNeutral: 1500,
  explanatory: 1800
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OLLIE PROMPT DENSITY → max prompts per session window
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_DENSITY_MAX_PROMPTS: Readonly<Record<PromptDensity, number>> = {
  normal: 6,
  increased: 10,
  reduced: 3,
  minimal: 1
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OLLIE VOICE STYLE → tone descriptor (used for tooltip / dev panel only)
// ─────────────────────────────────────────────────────────────────────────────

export const VOICE_STYLE_DESCRIPTORS: Readonly<Record<VoiceStyle, string>> = {
  informational: 'plain neutral, fact-forward',
  encouragingNeutral: 'warm but not effusive',
  protective: 'careful, slow, low-stakes',
  containment: 'calm, brief, contained',
  continuity: 'gentle bridge, low-data',
  governanceNeutral: 'minimal, factual, no encouragement',
  onboardingGuide: 'patient, explanatory, low-pressure'
} as const;
