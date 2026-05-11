/**
 * BariAccess Lite — Locked Enums
 * Finite sets per canon. Do not extend without a canon document update.
 */

// ────────────────────────────────────────────────────────────
// BEACON BANDS — 7 asymmetric bands per Beacon Canon §4
// ────────────────────────────────────────────────────────────
export enum BeaconBand {
  STRONG_GREEN = 1,    // 95–100
  MED_GREEN = 2,       // 85–94
  FAINT_GREEN = 3,     // 80–84
  LIGHT_ORANGE = 4,    // 70–79
  MED_ORANGE = 5,      // 65–69
  DARK_ORANGE = 6,     // 60–64
  RED = 7,             // <60
}

// ────────────────────────────────────────────────────────────
// ISE STATES — 7 states per ISE Canon v3.0 §2
// ────────────────────────────────────────────────────────────
export type ISEState =
  | 'ISE_0_NEUTRAL_BASELINE'
  | 'ISE_1_ALIGNED_AVAILABLE'
  | 'ISE_2_PROTECTIVE_RECOVERY_FORWARD'
  | 'ISE_3_CONTAINED_LOAD_LIMITED'
  | 'ISE_4_BUILDING_MOMENTUM'
  | 'ISE_5_RESTRICTED_GUARDED'
  | 'ISE_6_EXPLORATORY_LOW_SIGNAL';

// ────────────────────────────────────────────────────────────
// DEGRADATION STATE — Pass 0 Spec 4
// ────────────────────────────────────────────────────────────
export type DegradationState = 'FULL' | 'PARTIAL' | 'INSUFFICIENT';

// ────────────────────────────────────────────────────────────
// PROVENANCE FLAG — CCO-V1V4-REFFRAME-001 §3.6
// ────────────────────────────────────────────────────────────
export type ProvenanceFlag =
  | 'VALIDATED'           // ✅
  | 'PENDING_VALIDATION'  // 🟡
  | 'UNKNOWN_METHOD';     // ❌

// ────────────────────────────────────────────────────────────
// V-STREAMS — per ISE Canon v3.0 §4 Architecture
// ────────────────────────────────────────────────────────────
export type V_Stream = 'V1' | 'V2' | 'V3' | 'V4';

// ────────────────────────────────────────────────────────────
// COMPOSITE IDS — Lite ships 3 of 8
// ────────────────────────────────────────────────────────────
export type CompositeId = 'SRC' | 'SBL' | 'AMP';

// ────────────────────────────────────────────────────────────
// SUB-SCORE IDS — Lite ships 9 of 25
// ────────────────────────────────────────────────────────────
export type SubScoreId =
  | 'SQI' | 'SRI' | 'SNS'   // SRC
  | 'CIR' | 'SMA' | 'RSI'   // SBL
  | 'EPC' | 'MVI' | 'LSR';  // AMP

// ────────────────────────────────────────────────────────────
// GLP-1 — V4 interventional
// ────────────────────────────────────────────────────────────
export type GLP1Compound = 'semaglutide' | 'tirzepatide' | 'liraglutide' | 'other';

// ────────────────────────────────────────────────────────────
// LIGHT THERAPY TIMING — per DECISIONS.md §6
// ────────────────────────────────────────────────────────────
export type TimingStrategy = 'fixed' | 'chronotype_indexed' | 'cbtmin_offset';

// ────────────────────────────────────────────────────────────
// CHRONOTYPE — 5-category MEQ classification (Horne-Östberg)
// ────────────────────────────────────────────────────────────
export type ChronotypeCategory =
  | 'definitely_morning'    // MEQ 70–86
  | 'moderately_morning'    // 59–69
  | 'neither'               // 42–58
  | 'moderately_evening'    // 31–41
  | 'definitely_evening';   // 16–30

// ────────────────────────────────────────────────────────────
// FAB FAMILIES — V2 source families
// Per Pass 0 §2 6P × 6B Scaffold (B1..B6) + canonical FAB family names
// ────────────────────────────────────────────────────────────
export const FAB_FAMILIES = [
  'FAB-SLEEP',
  'FAB-NUTRITION',
  'FAB-HYDRATION',
  'FAB-ACTIVITY',
  'FAB-MINDFULNESS',
  'FAB-RECOVERY',
  'FAB-ROUTINE',
  'FAB-LIGHT',
  'FAB-BRAIN',
  'FAB-SOCIAL',
] as const;
export type FABFamily = typeof FAB_FAMILIES[number];
