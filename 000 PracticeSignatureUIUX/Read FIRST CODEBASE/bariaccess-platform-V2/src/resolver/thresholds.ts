/**
 * RESOLVER THRESHOLDS — All threshold constants used by the Resolver
 * 
 * Source canon:
 *   - PAC-ISE-002 v2.0 §15 (Threshold Appendix — TRADE SECRET)
 *   - CCO-FAB-001-PIN-001 v1.0 (G1) §5 (slope thresholds)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 (G3) §3 (slot drift threshold)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5 (mental wellbeing precedence)
 * 
 * NOTE on Val's overrule (May 2, 2026):
 *   Val explicitly authorized using ACTUAL VALUES here, not stub placeholders.
 *   "I overrule. USE actual values and codes. Its safe."
 * 
 *   These values are the locked Phase 1 defaults. Isaiah's 90-day WoZ may
 *   propose adjustments based on calibration data; any change requires Val
 *   sign-off before threshold update.
 * 
 * CONFIDENTIALITY: TRADE SECRET (inherits from PAC-ISE-002 v2.0)
 */

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 2 — DATA FRESHNESS (PAC-ISE-002 v2.0 §15)
// ─────────────────────────────────────────────────────────────────────────────

/** Hours of data staleness above which Signal 2 fires "stale" */
export const THRESHOLD_STALE_HOURS = 72;

/** Hours of data staleness above which Resolver forces ISE-6 (low signal) */
export const THRESHOLD_STALE_FORCE_ISE6_HOURS = 168; // 7 days

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 3 — COGNITIVE LOAD (PAC-ISE-002 v2.0 §15)
// ─────────────────────────────────────────────────────────────────────────────

/** PLI count above which "load" signals overload */
export const THRESHOLD_PLI_OVERLOAD = 5;

/** PLI count below which "load" signals underload (eligible for build) */
export const THRESHOLD_PLI_UNDERLOAD = 2;

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 4 — HEALTH STATUS (PAC-ISE-002 v2.0 §15 + G2 + G3)
// ─────────────────────────────────────────────────────────────────────────────

/** LIVE composites in Bands 4-7 above which health-status flags concern */
export const THRESHOLD_COMPOSITES_IN_ORANGE = 2;

/** LIVE composites in Band 7 (Red) above which health-status flags critical */
export const THRESHOLD_COMPOSITES_IN_RED = 1;

/** Slot drifts in last 24h above which Signal 4 escalates (G3 §3) */
export const THRESHOLD_SLOT_DRIFT_COUNT_24H = 3;

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 5 — ENGAGEMENT (PAC-ISE-002 v2.0 §15)
// ─────────────────────────────────────────────────────────────────────────────

/** ORI 7-day below which engagement flags "low" */
/**
 * ORI 7-day threshold below which engagement flags "low" / disables aligned check.
 * 
 * ⚠️ AUDIT 2026-05-03 — was: 0.40 pre-audit
 * Canon §6 Signal 5: "Threshold: ORI < THRESHOLD_ORI (default: 0.5) combined
 * with FSI trend for routing". The pre-audit value (0.40) deviated from canon.
 * Now matches canon default. Calibration may adjust during WoZ.
 */
export const THRESHOLD_ORI_LOW = 0.5;

/** ORI 7-day above which engagement flags "high" */
export const THRESHOLD_ORI_HIGH = 0.75;

/** FSI 7-day below which engagement flags "fragile" */
export const THRESHOLD_FSI_FRAGILE = 0.50;

/** FSI 7-day above which engagement flags "robust" */
export const THRESHOLD_FSI_ROBUST = 0.75;

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 6 — TRAJECTORY (G1 §5 + G7 §3 + PAC-ISE-002 v2.0 §15)
// ─────────────────────────────────────────────────────────────────────────────

/** Slope (per day) at or below which trajectory classifies "down" */
export const THRESHOLD_TRAJECTORY_NEG_SLOPE = -0.1;

/** Slope (per day) at or above which trajectory classifies "up" */
export const THRESHOLD_TRAJECTORY_POS_SLOPE = +0.1;

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL 7 — VOICE AFFECT (G6 §4 — DEFERRED)
// 
// All voice thresholds are Phase 2+. Phase 1 Resolver does NOT consume voice.
// Stub values shown for reference only.
// ─────────────────────────────────────────────────────────────────────────────

/** PHASE 2+ STUB — tone valence below which voice flags concern */
export const THRESHOLD_VOICE_TONE_VALENCE_LOW = -0.4;

/** PHASE 2+ STUB — tone arousal above which voice flags activation */
export const THRESHOLD_VOICE_TONE_AROUSAL_HIGH = 0.75;

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY CHAIN — DAY-OF-MEMBERSHIP THRESHOLDS (PAC-ISE-002 v2.0 §15)
// ─────────────────────────────────────────────────────────────────────────────

/** First N days of membership: ISE-0 onboarding window */
export const THRESHOLD_ONBOARDING_DAYS = 7;

// ─────────────────────────────────────────────────────────────────────────────
// HARD LIMITS (PAC-ISE-002 v2.0 §16)
// ─────────────────────────────────────────────────────────────────────────────

/** Max reason codes per ISEPayload (PAC-ISE-001 §6 contract) */
export const MAX_REASON_CODES_PER_PAYLOAD = 10;

/** Max contributors per ISEPayload */
export const MAX_CONTRIBUTORS_PER_PAYLOAD = 10;

// ─────────────────────────────────────────────────────────────────────────────
// CONSOLIDATED EXPORT — for diagnostic / audit dump
// ─────────────────────────────────────────────────────────────────────────────

export const RESOLVER_THRESHOLDS_SNAPSHOT = {
  version: 'v2.0',
  source: 'PAC-ISE-002 v2.0 §15 + G1 + G2 + G3 + G6 + G7',
  values: {
    THRESHOLD_STALE_HOURS,
    THRESHOLD_STALE_FORCE_ISE6_HOURS,
    THRESHOLD_PLI_OVERLOAD,
    THRESHOLD_PLI_UNDERLOAD,
    THRESHOLD_COMPOSITES_IN_ORANGE,
    THRESHOLD_COMPOSITES_IN_RED,
    THRESHOLD_SLOT_DRIFT_COUNT_24H,
    THRESHOLD_ORI_LOW,
    THRESHOLD_ORI_HIGH,
    THRESHOLD_FSI_FRAGILE,
    THRESHOLD_FSI_ROBUST,
    THRESHOLD_TRAJECTORY_NEG_SLOPE,
    THRESHOLD_TRAJECTORY_POS_SLOPE,
    THRESHOLD_ONBOARDING_DAYS,
    MAX_REASON_CODES_PER_PAYLOAD,
    MAX_CONTRIBUTORS_PER_PAYLOAD
  }
} as const;
