/**
 * BariAccess — Master R&R Weights
 *
 * Source: RR-Calculation-Canon-Pass1_v1_1_LOCKED.md §R&R Spec 1
 * Status: ✅ LOCKED Pass 1 v1.1 (May 4, 2026)
 *
 * Rule: All weight tables in scoring code import from THIS FILE.
 *       Lite uses redistributeWeights(['SRC','SBL','AMP'], RR_WEIGHTS).
 *       Migration to full R&R is a no-op — same helper, larger subset.
 */

// ────────────────────────────────────────────────────────────
// LAYER 0: R&R MASTER WEIGHTS
// 8 composites, default ISE-1 set, total = 1.00
// Recovery = 0.50 (SRC + SBL + MBC + MEI)
// Readiness = 0.50 (AMP + BCI + CRC + BHR)
// ────────────────────────────────────────────────────────────
export const RR_WEIGHTS = {
  // Recovery (50%)
  SRC: 0.14,   // Sleep & Recovery Composite
  SBL: 0.14,   // Stress & Burden Level
  MBC: 0.11,   // Muscle & Body Composition (NOT in Lite)
  MEI: 0.11,   // Metabolic & Energy Index (NOT in Lite)
  // Readiness (50%)
  AMP: 0.12,   // Activity & Movement Performance
  BCI: 0.12,   // Brain & Cognitive Integrity (NOT in Lite)
  CRC: 0.15,   // Circadian & Rhythm Coherence (NOT in Lite)
  BHR: 0.11,   // Behavioral & Habit Readiness (NOT in Lite)
} as const;

// ────────────────────────────────────────────────────────────
// LAYER 1: COMPOSITE → SUB-SCORE WEIGHTS
// Per Pass 1 entries 2, 3, 6 (SRC, SBL, AMP).
// ────────────────────────────────────────────────────────────

// SRC = 0.40·SQI + 0.35·SRI + 0.25·SNS  — anchor SQI
export const SRC_WEIGHTS = {
  SQI: 0.40,
  SRI: 0.35,
  SNS: 0.25,
} as const;
export const SRC_ANCHOR = 'SQI' as const;

// SBL = 0.30·CIR + 0.40·SMA + 0.30·RSI  — anchor RSI
export const SBL_WEIGHTS = {
  CIR: 0.30,
  SMA: 0.40,
  RSI: 0.30,
} as const;
export const SBL_ANCHOR = 'RSI' as const;

// AMP = 0.40·EPC + 0.30·MVI + 0.30·LSR  — anchor EPC
export const AMP_WEIGHTS = {
  EPC: 0.40,
  MVI: 0.30,
  LSR: 0.30,
} as const;
export const AMP_ANCHOR = 'EPC' as const;

// ────────────────────────────────────────────────────────────
// LAYER 2: SUB-SCORE COMPONENT WEIGHTS
// Per Pass 3 sub-score formulas. Component weights normalized to 1.0.
// ────────────────────────────────────────────────────────────

// Pass 3 §1 SQI = 0.35·Efficiency + 0.30·DeepSleep% + 0.20·Continuity + 0.15·Latency_inv
export const SQI_COMPONENTS = {
  efficiency: 0.35,
  deep_sleep_pct: 0.30,
  continuity: 0.20,
  latency_inv: 0.15,
} as const;

// Pass 3 §2 SRI = 0.40·BedtimeConsistency + 0.40·WaketimeConsistency + 0.20·DurationConsistency
export const SRI_COMPONENTS = {
  bedtime_consistency: 0.40,
  waketime_consistency: 0.40,
  duration_consistency: 0.20,
} as const;

// Pass 3 §3 SNS = 0.50·SleepDebt_inv + 0.30·RecoveryAdequacy + 0.20·SubjectiveSatisfaction
export const SNS_COMPONENTS = {
  sleep_debt_inv: 0.50,
  recovery_adequacy: 0.30,
  subjective_satisfaction: 0.20,
} as const;

// Pass 3 §4 CIR = 0.35·SleepPhase + 0.30·ActivityPhase + 0.20·MealPhase + 0.15·LightExposurePattern
export const CIR_COMPONENTS = {
  sleep_phase_stability: 0.35,
  activity_phase_stability: 0.30,
  meal_phase_stability: 0.20,
  light_exposure_pattern: 0.15,
} as const;

// Pass 3 §5 SMA = 0.40·EatingWindow + 0.30·LastMealGap + 0.30·GlucoseStability
export const SMA_COMPONENTS = {
  eating_window: 0.40,
  last_meal_gap: 0.30,
  glucose_stability: 0.30,
} as const;

// Pass 3 §6 RSI = 0.40·HRVRecovery + 0.30·RestingHR_trend + 0.30·SubjectiveRecovery
export const RSI_COMPONENTS = {
  hrv_recovery: 0.40,
  resting_hr_trend: 0.30,
  subjective_recovery: 0.30,
} as const;

// Pass 3 §13 EPC = max(CI-M, CI-C) × (0.35·Strength + 0.35·Endurance + 0.30·Power)
export const EPC_PERFORMANCE_COMPONENTS = {
  strength: 0.35,
  endurance: 0.35,
  power: 0.30,
} as const;

// Pass 3 §14 MVI = 0.40·Activity_diversity + 0.35·Movement_patterns + 0.25·Sedentary_breaks
export const MVI_COMPONENTS = {
  activity_diversity: 0.40,
  movement_patterns: 0.35,
  sedentary_breaks: 0.25,
} as const;

// Pass 3 §15 LSR = ACWR / (1 + Strain_score). Pass 3 explicit.
// Strain_score itself is composite: 0.40·HRV_dev + 0.30·SleepDebt + 0.30·SubjectiveRecovery
export const LSR_STRAIN_COMPONENTS = {
  hrv_deviation: 0.40,
  sleep_debt: 0.30,
  subjective_recovery: 0.30,
} as const;

// ────────────────────────────────────────────────────────────
// CI LAYER COMPONENTS — Pass 2 §CI-M and §CI-C
// ────────────────────────────────────────────────────────────

// Pass 2 §CI-M TAF = 0.40·ChronoAlign + 0.30·PeakWindow + 0.30·ConsistentPhase
export const CIM_TAF_COMPONENTS = {
  chrono_align: 0.40,
  peak_window: 0.30,
  consistent_phase: 0.30,
} as const;

// Pass 2 §CI-M MRQ = 0.35·PerformanceCapacity + 0.35·AdaptationQuality + 0.30·RecoveryEfficiency
export const CIM_MRQ_COMPONENTS = {
  performance_capacity: 0.35,
  adaptation_quality: 0.35,
  recovery_efficiency: 0.30,
} as const;

// Pass 2 §CI-C TAF = 0.40·TempPhaseAlign + 0.30·AwakeningWindow + 0.30·CVReadinessSync
export const CIC_TAF_COMPONENTS = {
  temp_phase_align: 0.40,
  awakening_window: 0.30,
  cv_readiness_sync: 0.30,
} as const;

// Pass 2 §CI-C CRQ = 0.40·AerobicCapacity + 0.30·CVEfficiency + 0.30·AdaptationMarkers
export const CIC_CRQ_COMPONENTS = {
  aerobic_capacity: 0.40,
  cv_efficiency: 0.30,
  adaptation_markers: 0.30,
} as const;

// ────────────────────────────────────────────────────────────
// W₇ KERNEL — Pass 0 §1 + Pass 2 §summary
// W₇(d) = exp(−λ × (7 − d)), normalized so Σ = 1.0
// λ = 0.30 (Phase 1a default)
// Profile: today=25%, d-2=18%, d-3=14%, d-4=10%, d-5=8%, d-6=5%, d-7=4%
// ────────────────────────────────────────────────────────────
export const W7_LAMBDA = 0.30;
export const W7_DAYS = 7;

// Pre-computed canonical profile — verified against Pass 0/Pass 2 stated profile.
// Used by ci-layer/w7-kernel.ts; verified via test fixture.
export const W7_PROFILE_REFERENCE = {
  today: 0.25,        // d=7
  'd-2': 0.18,        // d=6
  'd-3': 0.14,        // d=5
  'd-4': 0.10,        // d=4
  'd-5': 0.08,        // d=3
  'd-6': 0.05,        // d=2
  'd-7': 0.04,        // d=1
} as const;

// ────────────────────────────────────────────────────────────
// CARRY-FORWARD — Pass 0 Spec 4
// ────────────────────────────────────────────────────────────
export const CARRY_FORWARD_WEIGHTS: Record<number, number | 'EXPIRED'> = {
  0: 1.00,
  1: 0.85,
  2: 0.65,
  3: 0.40,
  4: 'EXPIRED',
} as const;

// ────────────────────────────────────────────────────────────
// BEHAVIORAL BRIDGE — Pass 0 Spec 5
// Default adjustment factor 3 points/day, refined per user via reconciliation.
// CLAUDE-FLAG-5: founder confirm default is correct.
// ────────────────────────────────────────────────────────────
export const BRIDGE_DEFAULT_ADJUSTMENT_PER_DAY = 3;
export const BRIDGE_MAX_DAYS = 7;

// ────────────────────────────────────────────────────────────
// LSR WARMUP THRESHOLDS — Pass 3 §LSR Spec 4
// ────────────────────────────────────────────────────────────
export const LSR_DAYS_INSUFFICIENT_BELOW = 14;
export const LSR_DAYS_PARTIAL_BELOW = 28;

// ────────────────────────────────────────────────────────────
// PERSONAL BASELINE — CCO-V1V4-REFFRAME-001 §4 + Beacon §7
// ────────────────────────────────────────────────────────────
export const BASELINE_WINDOW_DAYS = 28;
export const BASELINE_MIN_DAYS_FOR_PROVENANCE_VALIDATED = 28;
export const BASELINE_MIN_DAYS_TO_COMPUTE = 7;

// ────────────────────────────────────────────────────────────
// GLP-1 ANNOTATION THRESHOLDS — DECISIONS.md §7
// LOCKED 2026-05-09 by founder (Val):
//   Flag 1 → Option C: bidirectional |drift| ≥ 2 bpm in early phase.
//            Rationale: literature shows medication raises RHR ~2-4 bpm,
//            but post-bariatric weight loss can drive opposite drop;
//            either direction in early phase is medication-confounded.
//   Flag 2 → 120 days. Matches semaglutide full titration window
//            (16 weeks per FDA label); covers tirzepatide mid-titration too.
// ────────────────────────────────────────────────────────────
export const GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM = 2;
export const GLP1_EARLY_PHASE_DAYS = 120;
