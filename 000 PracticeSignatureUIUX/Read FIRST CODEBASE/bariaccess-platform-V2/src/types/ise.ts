/**
 * ISE — Identity State Expressions™
 * 
 * Source canon:
 *   - ISE Canon v3.0 §2 (7-state finite set)
 *   - PAC-ISE-001 v1.0A §3 (canonical state set + render tokens)
 *   - PAC-ISE-001 v1.0A §6 (ISEPayload v1.0A schema)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §3 (tileLock token extension)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §5 (CompositeRenderToken extension)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 §6 (TrackerRenderToken extension)
 * 
 * This file defines TYPES ONLY. No logic. No defaults. No imports from sibling modules.
 */

// ─────────────────────────────────────────────────────────────────────────────
// THE 7 STATES (ISE Canon v3.0 §2 — DO NOT MODIFY)
// ─────────────────────────────────────────────────────────────────────────────

export enum ISEState {
  ISE_0_NEUTRAL_BASELINE = 'ISE_0_NEUTRAL_BASELINE',
  ISE_1_ALIGNED_AVAILABLE = 'ISE_1_ALIGNED_AVAILABLE',
  ISE_2_PROTECTIVE_RECOVERY_FORWARD = 'ISE_2_PROTECTIVE_RECOVERY_FORWARD',
  ISE_3_CONTAINED_LOAD_LIMITED = 'ISE_3_CONTAINED_LOAD_LIMITED',
  ISE_4_BUILDING_MOMENTUM = 'ISE_4_BUILDING_MOMENTUM',
  ISE_5_RESTRICTED_GUARDED = 'ISE_5_RESTRICTED_GUARDED',
  ISE_6_EXPLORATORY_LOW_SIGNAL = 'ISE_6_EXPLORATORY_LOW_SIGNAL'
}

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY ICON RENDER TOKENS (PAC-ISE-001 §4.1)
// ─────────────────────────────────────────────────────────────────────────────

export type Posture = 'neutral' | 'upright' | 'softened' | 'contained';
export type Saturation = 'standard' | 'bright' | 'muted' | 'lightOpacity';
export type Motion = 'none' | 'subtleIdle' | 'steadyIdle' | 'minimal';
// Overlay extended in DEV-WORK-D0LITE-PATCH-001 §3.3 (tileLock added)
export type Overlay = 'none' | 'shieldLock' | 'tileLock';

export interface IdentityIconTokens {
  posture: Posture;
  saturation: Saturation;
  motion: Motion;
  overlay: Overlay;
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA POLICY (PAC-ISE-001 §4.2)
// ─────────────────────────────────────────────────────────────────────────────

export type CTAMode =
  | 'default'
  | 'build'
  | 'recovery'
  | 'compress'
  | 'restricted'
  | 'onboarding';

export type OrderingBias =
  | 'none'
  | 'performanceFirst'
  | 'recoveryFirst'
  | 'continuityFirst'
  | 'oneNextStep'
  | 'approvedOnly';

export interface CTAPolicy {
  mode: CTAMode;
  maxVisible: number; // 1-8
  orderingBias: OrderingBias;
  restrictedActions: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// OLLIE POLICY (PAC-ISE-001 §4.3)
// ─────────────────────────────────────────────────────────────────────────────

export type OllieCadence =
  | 'neutral'
  | 'forward'
  | 'slow'
  | 'minimal'
  | 'strictNeutral'
  | 'explanatory';

export type PromptDensity = 'normal' | 'increased' | 'reduced' | 'minimal';

export type VoiceStyle =
  | 'informational'
  | 'encouragingNeutral'
  | 'protective'
  | 'containment'
  | 'continuity'
  | 'governanceNeutral'
  | 'onboardingGuide';

export interface OlliePolicy {
  cadence: OllieCadence;
  promptDensity: PromptDensity;
  voiceStyle: VoiceStyle;
  templateKeys: string[]; // 1-6 template IDs from PAC-ISE-003
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTORS (PAC-ISE-001 §6 — abstracted, no raw biometrics)
// ─────────────────────────────────────────────────────────────────────────────

export type ContributorDomain =
  | 'biometric'
  | 'sleep'
  | 'rhythm'
  | 'behavior'
  | 'cognitive'
  | 'governance';

export type ContributorDirection =
  | 'up'
  | 'down'
  | 'stable'
  | 'insufficient'
  | 'flagged';

export interface Contributor {
  domain: ContributorDomain;
  direction: ContributorDirection;
  note?: string; // max 160 chars; NOT shown on CCIE-interface for biometric domain
}

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNANCE BLOCK (PAC-ISE-001 §6, populated for ISE-5 only)
// ─────────────────────────────────────────────────────────────────────────────

export type Visibility = 'ccie' | 'cpie' | 'dual';
export type RedactionLevel = 'none' | 'light' | 'strict';

export interface GovernanceBlock {
  isClinicalRouted: boolean;
  visibility: Visibility;
  redactionLevel: RedactionLevel;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISE PAYLOAD v1.0A (PAC-ISE-001 §6 — full API contract)
// ─────────────────────────────────────────────────────────────────────────────

export interface ISEPayload {
  version: 'v1.0A';
  generatedAt: string; // ISO 8601 datetime
  state: ISEState;
  reasonCodes: string[]; // from PAC-ISE-003 dictionary, max 10
  contributors: Contributor[]; // max 10
  render: {
    identityIcon: IdentityIconTokens;
  };
  cta: CTAPolicy;
  ollie: OlliePolicy;
  governance?: GovernanceBlock; // optional, primarily for ISE-5
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE LOCK TOKEN (DEV-WORK-D0LITE-PATCH-001 v1.0 §3.2)
// ─────────────────────────────────────────────────────────────────────────────

export type TileLockState = 'unlocked' | 'locked';

export interface TileLockToken {
  state: TileLockState;
  unlock_day?: number; // e.g., 7, 30
  unlock_clinical_trigger?: string; // e.g., "first lab return"
  unlock_progress?: number; // 0.0-1.0
  display_message?: string; // pre-rendered for tap
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE RENDER TOKEN (CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §5.2)
// Reused by Aurora KPI per CCO-ENG-LOGO-EXPR-PATCH-001 v1.0 §3.3
// ─────────────────────────────────────────────────────────────────────────────

export type CompositeState = 'accruing' | 'live';
export type Confidence = 'high' | 'medium' | 'low' | 'default';

export type BeaconBand = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type BeaconColor =
  | 'strong_green'
  | 'med_green'
  | 'faint_green'
  | 'light_orange'
  | 'med_orange'
  | 'dark_orange'
  | 'red';

export interface CompositeRenderToken {
  state: CompositeState;

  // accruing only
  unlock_trigger_text?: string;
  progress_pct?: number; // 0-100

  // live only
  beacon_band?: BeaconBand;
  beacon_score?: number; // 0-100
  beacon_color?: BeaconColor;
  confidence?: Confidence;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACKER RENDER TOKEN (DEV-WORK-D0LITE-PATCH-001 v1.0 §6.3)
// Daily Pulse Row 5 — 6 slots, PROD locked-empty in PE Phase 1
// ─────────────────────────────────────────────────────────────────────────────

export type TrackerSlotPosition = 1 | 2 | 3 | 4 | 5 | 6;
export type TrackerSlotLabel = 'FAB' | 'ITB' | 'BEACON' | 'ROUTINE' | 'PROD' | 'PARK';
export type TrackerState = 'active' | 'locked_empty' | 'future_unlock';

export interface TrackerRenderToken {
  slot_position: TrackerSlotPosition;
  slot_label: TrackerSlotLabel;
  state: TrackerState;

  // active state
  rim_color?: BeaconColor;

  // locked_empty state (Practice Edition PROD)
  locked_message?: string;

  // future_unlock state (e.g., BEACON if not yet active)
  unlock_trigger?: string;
}
