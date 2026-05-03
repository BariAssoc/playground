/**
 * COMPOSITE RECOMPUTE — Event-driven composite cascade
 * 
 * Source canon:
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §3 (cascade stops at composite layer)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §4.2 (Phase 1 unlock triggers)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §5 (composite irreversibility)
 *   - Beacon Canon v1.1 §10 (pre-signal detection)
 *   - Beacon Canon v1.1 §15 (composite scoring hierarchy)
 * 
 * When a ground level signal (Healthspan / My Blueprint) recomputes:
 *   1. The relevant composite recomputes
 *   2. The composite's Beacon band updates
 *   3. ❗ Cascade STOPS HERE. Apex roll-up only happens at 03:00 patient-local.
 *   4. No event-driven apex recompute.
 * 
 * Composite irreversibility (G2 OQ-PATCH-05): once `state = "live"`, NEVER reverts
 * to `accruing`. Below FCS statistical floor → confidence drops, NOT state changes.
 */

import type {
  CompositeStateRecord,
  CompositeName,
  CompositeCascadeEvent,
  GroundLevel
} from '../types/composite.js';
import type { CompositeState, BeaconBand } from '../types/ise.js';
import type { Confidence } from '../types/beacon.js';
import { calibrateToBeaconWithConfidence } from '../calibration/calibrator.js';
import { computeConfidence } from '../calibration/calibrator.js';

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 UNLOCK SCOPE (G2 §4.2 — LOCKED)
// 
// Day 1 LIVE:    SRC, CRC
// Accruing:      SBL, MBC, MEI, AMP, BCI, BHR
// 
// Unlock triggers (operator-curated; values per G2 §4.2):
// ─────────────────────────────────────────────────────────────────────────────

export const PHASE_1_LIVE_DAY_1: ReadonlyArray<CompositeName> = ['SRC', 'CRC'] as const;

export const PHASE_1_UNLOCK_SPECS: Readonly<
  Record<CompositeName, { unlock_trigger_text: string; estimated_day: string }>
> = {
  SRC: {
    unlock_trigger_text: 'live from Day 1',
    estimated_day: 'Day 0'
  },
  CRC: {
    unlock_trigger_text: 'live from Day 1',
    estimated_day: 'Day 0'
  },
  SBL: {
    unlock_trigger_text: '7 days of stress signals captured',
    estimated_day: 'Day 7'
  },
  MBC: {
    unlock_trigger_text: 'first lab return + 3 metabolic FABs stable',
    estimated_day: 'Day 7-10'
  },
  MEI: {
    unlock_trigger_text: '14 days of activity data + 1 movement FAB stable',
    estimated_day: 'Day 14'
  },
  AMP: {
    unlock_trigger_text: '14 days of FAB completion data across 2+ families',
    estimated_day: 'Day 14'
  },
  BCI: {
    unlock_trigger_text: 'first body composition reading (DEXA / SECA / InBody)',
    estimated_day: 'Day 7-30'
  },
  BHR: {
    unlock_trigger_text: '14 days of behavioral signals + Mood pin baseline established',
    estimated_day: 'Day 14'
  }
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// IS COMPOSITE LIVE-ELIGIBLE? (G2 §4.2)
// 
// Used by unlock checker to determine if accruing composite has met its trigger.
// In Phase 1 + WoZ era, unlock decisions are made by Pamela/Isaiah and persisted.
// This function verifies the data preconditions; the unlock event is operator-confirmed.
// ─────────────────────────────────────────────────────────────────────────────

export interface CompositeUnlockPreconditions {
  composite: CompositeName;
  day_since_d0: number;
  active_fab_families: number;
  stable_fab_count: number; // FABs in Stable state
  has_first_lab: boolean;
  has_first_body_comp: boolean;
  has_mood_baseline: boolean; // 7+ Mood pin readings
}

export function checkUnlockPreconditions(
  pre: CompositeUnlockPreconditions
): boolean {
  switch (pre.composite) {
    case 'SRC':
    case 'CRC':
      return true; // Day 1 live always eligible
    case 'SBL':
      return pre.day_since_d0 >= 7;
    case 'MBC':
      return pre.has_first_lab && pre.stable_fab_count >= 3;
    case 'MEI':
      return pre.day_since_d0 >= 14 && pre.stable_fab_count >= 1;
    case 'AMP':
      return pre.day_since_d0 >= 14 && pre.active_fab_families >= 2;
    case 'BCI':
      return pre.has_first_body_comp;
    case 'BHR':
      return pre.day_since_d0 >= 14 && pre.has_mood_baseline;
    default: {
      const _exhaustive: never = pre.composite;
      throw new Error(`checkUnlockPreconditions: Unknown composite: ${String(_exhaustive)}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMPUTE COMPOSITE — pure function
// 
// Given a composite's underlying score (0-100, already aggregated upstream),
// produce the new CompositeStateRecord shape.
// 
// IMPORTANT: This honors the irreversibility rule. If existing state is "live"
// and new data falls below threshold, score and confidence reflect the drop
// but state stays "live".
// ─────────────────────────────────────────────────────────────────────────────

export interface RecomputeCompositeParams {
  userId: string;
  composite_name: CompositeName;
  new_score_0_100: number;
  defaulted_input_count: number;
  existing_record: CompositeStateRecord | null;
  unlock_progress?: number; // 0.0-1.0, only relevant when state="accruing"
}

export function recomputeComposite(
  params: RecomputeCompositeParams
): CompositeStateRecord {
  const now = new Date().toISOString();

  const calibration = calibrateToBeaconWithConfidence(
    {
      value: params.new_score_0_100,
      inputType: 'Bounded_0_100' // all 8 composites are Path B per G2 §2
    },
    params.defaulted_input_count
  );

  // Determine state per irreversibility rule
  const existing_state: CompositeState =
    params.existing_record?.state ?? 'accruing';

  // ❗ G2 §5: Once live, never reverts
  const new_state: CompositeState =
    existing_state === 'live' ? 'live' : 'accruing';

  // For accruing composites, score remains null (not displayed)
  const score_0_100 = new_state === 'live' ? calibration.score : null;
  const beacon_band: BeaconBand | null =
    new_state === 'live' ? calibration.band : null;
  const confidence: Confidence | null =
    new_state === 'live' ? calibration.confidence : null;

  const spec = PHASE_1_UNLOCK_SPECS[params.composite_name];

  return {
    id: `${params.userId}_${params.composite_name}`,
    userId: params.userId,
    compositeName: params.composite_name,
    state: new_state,
    score_0_100,
    beacon_band,
    confidence,
    unlock_trigger: spec.unlock_trigger_text,
    unlock_progress: params.unlock_progress ?? params.existing_record?.unlock_progress ?? 0,
    unlocked_at: params.existing_record?.unlocked_at ?? null,
    last_cascade_fired_at: params.existing_record?.last_cascade_fired_at ?? null,
    last_recompute_at: now
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UNLOCK COMPOSITE (transition accruing → live)
// 
// Called when Pamela/Isaiah confirms unlock preconditions met. Records unlocked_at,
// promotes state to "live", and seeds initial score from current data.
// ─────────────────────────────────────────────────────────────────────────────

export function unlockComposite(
  existing: CompositeStateRecord,
  initial_score_0_100: number,
  defaulted_input_count: number
): CompositeStateRecord {
  if (existing.state === 'live') {
    return existing; // already live, no-op
  }

  const now = new Date().toISOString();
  const calibration = calibrateToBeaconWithConfidence(
    { value: initial_score_0_100, inputType: 'Bounded_0_100' },
    defaulted_input_count
  );

  return {
    ...existing,
    state: 'live',
    score_0_100: calibration.score,
    beacon_band: calibration.band,
    confidence: calibration.confidence,
    unlocked_at: now,
    last_recompute_at: now,
    unlock_progress: 1.0
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD COMPOSITE CASCADE EVENT (G2 §3.1)
// 
// Called when ground-level signal change triggers composite recompute.
// The apex_recompute_triggered field is ALWAYS false — apex computes on roll-up only.
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildCompositeCascadeParams {
  userId: string;
  source_ground_level: GroundLevel;
  source_signal_name: string;
  affected_composite: CompositeName;
  composite_old_band: BeaconBand | null;
  composite_new_band: BeaconBand;
}

export function buildCompositeCascadeEvent(
  params: BuildCompositeCascadeParams
): CompositeCascadeEvent {
  return {
    eventId: crypto.randomUUID(),
    userId: params.userId,
    timestamp: new Date().toISOString(),
    source_ground_level: params.source_ground_level,
    source_signal_name: params.source_signal_name,
    affected_composite: params.affected_composite,
    composite_old_band: params.composite_old_band,
    composite_new_band: params.composite_new_band,
    apex_recompute_triggered: false // ❗ G2 §3 — cascade STOPS at composite layer
  };
}

// Re-export Confidence + computeConfidence for downstream convenience
export { computeConfidence };
export type { Confidence };
