# BariAccess™ Platform — Architecture Map

**Every file → every canon section. No code without canonical justification.**

---

## Layer 1 — Types (`src/types/`)

The contract surface. All types defined here are imported by every other layer. **No logic. No imports from sibling layers.**

| File | Lines defined | Source canon |
|---|---|---|
| `ise.ts` | `ISEState` enum (7 states), `ISEPayload` schema v1.0A, `IdentityIconTokens`, `CTAPolicy`, `OlliePolicy`, `Contributor`, `GovernanceBlock`, `TileLockToken`, `CompositeRenderToken`, `TrackerRenderToken` | ISE Canon v3.0 §2 · PAC-ISE-001 §3-§6 · G6 §3 (`tileLock`) · G2 §5 · G6 §6 |
| `beacon.ts` | `BeaconBand`, `BeaconColor`, `Confidence`, `CalibrationInputType`, `CalibrationInput`, `CalibrationOutput`, `CompositeName` (8), `CompositeMetadata`, `PreSignalDetection`, `ScoreWithConfidence` | Beacon Canon v1.1 §4, §6.5, §11, §15 · Calibration Algorithm v1.0 §2-§5 · G2 §2 · G4 §2 |
| `fab.ts` | `FABFamily` enum (7), `FABVisibility`, `FABState` enum (6), `FABOperatingLevel` enum (4), `TimestampPin`, `MoodReading`, `LearningCoefficient`, `EffortScoreInputs`, `EffortScoreDaily`, `FABBookendRecord`, `FCSScore`, drift threshold constants | FAB Canon v2.0 §2-§6, §11-§13 · G1 §2-§6 |
| `slot.ts` | `SlotId` (17 = 9 anchor + 8 bridge), `SlotLifecycleState`, `SlotFinalState`, `SlotStateRecord`, `SlotCascadeFireEvent`, `SlotCompletionEvent`, `DailyEngagementRollup`, `CascadeRoutingRule` | RBSHELF v1.1 §6.5, §13-§15 · G3 §3-§6 |
| `composite.ts` | `CompositeStateRecord`, `PhaseOneUnlockSpec`, `CompositeCascadeEvent`, `RRApexRecord`, `APEX_ROLLUP_LOCAL_TIME` | Pyramid Addendum v1.0 · G2 §2-§6 (locked OQ-04 + OQ-05) |
| `journal.ts` | `JournalEntryFull`, `JournalEntryPatientView` (5 cols), `JournalEntryProviderView` (9 cols), `CardOrigin`, `InterfaceLayer`, `CreditType`, `JournalAccessAuditEntry` | Memory Rule April 24 · MEMO-CARD-COMM-001 · G5 §2-§6 |
| `card.ts` | `CardSurface`, `CardEnvelope`, `SlotCard`, `CARD_SURFACE_TO_INTERFACE`, `CARD_ORIGIN_TO_SURFACE` | MEMO-CARD-COMM-001 §2-§6 · G5 §5 |
| `safety.ts` | `MentalWellbeingTrigger`, `SafetyOverrideEvent`, `PatientSafetyResponse`, `SAFETY_HARD_RULES`, `ISE5_SAFETY_CHECKIN_TEMPLATE_KEY` | G6 §5 (full escalation flow + hard rules) |
| `voice.ts` | `FirefliesCallRecord`, `VoiceAffectSignalInput`, `VoicePhase1Blockers`, `canIngestFirefliesCall()`, `canResolverConsumeVoice()` | G6 §4 (Phase 2+ deferred) |
| `audit.ts` | `ISETransitionLogEntry`, `ISESignalSnapshot`, `JournalAccessAuditEntry`, `AIInteractionAuditEntry`, `AIDeviationAlert`, `CompositeUnlockAuditEntry`, `AuditEvent` union | PAC-ISE-004 §3.2 · PAC-ISE-006 §8 · PAC-ISE-007 §7 · G5 §6.2 · G6 §5.5 |

---

## Layer 2 — Payload (`src/payload/`) — Phase 2B

Schema validators + canonical lookup tables.

| File | Source canon |
|---|---|
| `ise-defaults.ts` | PAC-ISE-001 §5 — `ISE_DEFAULTS` lookup (state → render/CTA/Ollie defaults) |
| `reason-codes.ts` | PAC-ISE-003 §3 — full Reason Codes Dictionary (6 categories) |
| `template-keys.ts` | PAC-ISE-003 §5 — 7 Ollie Template Keys + `ISE5_SAFETY_CHECKIN` (G6 §5.5) |
| `schema-validator.ts` | PAC-ISE-001 §6 JSON Schema → Zod validators |

---

## Layer 3 — Calibration (`src/calibration/`) — Phase 2B

Beacon Calibration Algorithm v1.0 — pure deterministic functions.

| File | Source canon |
|---|---|
| `path-a-zscore.ts` | Calibration Algorithm v1.0 §4.1 — Z-score → 0-100 piecewise linear |
| `path-b-bounded.ts` | Calibration Algorithm v1.0 §4.2 — Bounded 0-100 (clamp + band lookup) |
| `path-c-raw-range.ts` | Calibration Algorithm v1.0 §4.3 — Raw Range rescale to 0-100 |
| `band-lookup.ts` | Calibration Algorithm v1.0 §5 — 7-band lookup table |
| `calibrator.ts` | Calibration Algorithm v1.0 §6 — end-to-end `CALIBRATE_TO_BEACON()` |

---

## Layer 4 — Storage (`src/storage/`) — Phase 2B

Cosmos DB containers + queries + redaction.

| File | Source canon |
|---|---|
| `containers/ise-current-state.ts` | PAC-ISE-004 §3.1 |
| `containers/ise-transition-log.ts` | PAC-ISE-004 §3.2 (append-only, TTL 365d) |
| `containers/composite-state.ts` | G2 §6.1 (NEW) |
| `containers/slot-state.ts` | G3 §6.1 (NEW) |
| `containers/slot-cascade-events.ts` | G3 §6.2 (NEW, TTL 90d) |
| `containers/daily-engagement-rollup.ts` | G3 §6.3 (NEW) |
| `containers/effort-daily-rollup.ts` | G1 §4 (NEW) |
| `containers/fireflies-call-records.ts` | G6 §4.3 (NEW, TTL per HIPAA 6yr) |
| `containers/mental-wellbeing-events.ts` | G6 §5.2 (NEW, severity:critical) |
| `containers/journal-entries.ts` | CCO-JOUR-DEF-001 v1.0 (referenced) |
| `queries.ts` | All Cosmos query patterns (PAC-ISE-004 §5, G2 §6 SQL) |
| `redaction-layer.ts` | PAC-ISE-006 §6 + G5 §6 (HIPAA enforcement) |

---

## Layer 5 — Resolver (`src/resolver/`) — Phase 2C

PAC-ISE-002 v2.0 — 6-signal dispatcher (not computer).

| File | Source canon |
|---|---|
| `signals/signal-1-governance.ts` | PAC-ISE-002 §6 Signal 1 (boolean override) |
| `signals/signal-2-data-freshness.ts` | PAC-ISE-002 §6 Signal 2 (`THRESHOLD_STALE = 72h`) |
| `signals/signal-3-cognitive-load.ts` | PAC-ISE-002 §6 Signal 3 (PLI + Space-State, `THRESHOLD_PLI = 5`) |
| `signals/signal-4-health-status.ts` | PAC-ISE-002 §6 Signal 4 + G2 §3.2 (composites) + G3 §3 (slot drift) |
| `signals/signal-5-engagement.ts` | PAC-ISE-002 §6 Signal 5 (FSI + ORI) + G3 §4 |
| `signals/signal-6-trajectory.ts` | PAC-ISE-002 §6 Signal 6 + G1 §5 (slope) + G7 (effort_score_daily authority) |
| `signals/signal-7-voice.ts` | G6 §4 (Phase 2+ stub — does NOT contribute in Phase 1) |
| `priority-chain.ts` | PAC-ISE-002 §5 (priority order: Gov → ISE-5 → Stale → ... → ISE-0) |
| `thresholds.ts` | PAC-ISE-002 §15 — all threshold constants (Val overruled WoZ-only constraint) |
| `safety-override.ts` | G6 §5 — Mental Wellbeing forced ISE-5 (highest priority, bypasses normal Resolver) |
| `resolver.ts` | Main entry point — orchestrates signals → priority chain → ISEPayload |

---

## Layer 6 — Computation (`src/computation/`) — Phase 2C

Nightly + event-driven compute.

| File | Source canon |
|---|---|
| `slope-7day.ts` | G1 §5 — linear regression over 7 days |
| `fcs-daily.ts` | FAB Canon §11 + G3 §4.2 — `FCS = 0.6·CR + 0.4·TA` |
| `ori-7day.ts` | G3 §4.3 — decay-weighted (`0.95^days_ago`) |
| `effort-score.ts` | G1 §4 — canonical `E = 0.40·F + 0.30·C + 0.30·LC` |
| `apex-rollup.ts` | G2 §3 — daily roll-up at `03:00 patient-local` |
| `composite-recompute.ts` | G2 §3 — event-driven cascade recompute |
| `cascade-router.ts` | G3 §5.1 — selective routing per FAB family |

---

## Layer 7 — Frontend (`src/frontend/`) — Phase 2D

PAC-ISE-005 + extensions.

| File | Source canon |
|---|---|
| `components/identity-icon.tsx` | PAC-ISE-005 §5 (posture/saturation/motion/overlay) |
| `components/cta-controller.tsx` | PAC-ISE-005 §6 (mode + maxVisible + orderingBias) |
| `components/ollie-space.tsx` | PAC-ISE-005 §7 (cadence + density + voiceStyle + templateKeys) |
| `components/constellation-panel.tsx` | PAC-ISE-005 §8 (composed) |
| `components/routine-bookshelf.tsx` | RBSHELF v1.1 (umbrellas + 17 backend slots) + G3 (cascade) |
| `components/logo-expression.tsx` | LOGO-EXPR v1.1 (3-phase: Warm-up → Content → Cool-down) |
| `components/signal-bar-tile.tsx` | G6 §3 (`tileLock` token) |
| `components/daily-pulse-tracker.tsx` | G6 §6 (PROD `locked_empty`) |
| `components/composite-display.tsx` | G2 §5 (`accruing` / `live`) |
| `components/slot-card.tsx` | MEMO-CARD-COMM-001 §4 (replaces "Card Expansion") |
| `components/safety-checkin.tsx` | G6 §5.4 (`ISE5_SAFETY_CHECKIN` UI) |
| `tokens/*.ts` | All render token specs |
| `fallback-payload.ts` | PAC-ISE-005 §9 (ISE-0 fallback) |

---

## Layer 8 — Governance (`src/governance/`) — Phase 2E

PAC-ISE-006 + PAC-ISE-007.

| File | Source canon |
|---|---|
| `visibility-matrix.ts` | PAC-ISE-006 §4 + G5 §4 (per-column matrix) |
| `ai-boundaries.ts` | PAC-ISE-007 §4 (per-state boundaries) + G6 §5.6 (hard rules) |
| `audit-logger.ts` | PAC-ISE-007 §7 (every interaction logged) + G5 §8 |
| `deviation-detector.ts` | PAC-ISE-007 §7.2 (deviation alerts) |
| `prohibited-capabilities.ts` | PAC-ISE-007 §3 (hard rules — diagnose/raw biometrics) |

---

## Layer 9 — API (`src/api/`) — Phase 2E

Express handlers + auth middleware.

| File | Source canon |
|---|---|
| `routes/identity-ise.ts` | `GET /v1/identity/ise` (PAC-ISE-006 §7.1) |
| `routes/journal-entries.ts` | G5 §6.2 — three view variants (patient / provider / internal) |
| `routes/composite-state.ts` | G2 — composite query endpoints |
| `routes/slot-state.ts` | G3 — slot query endpoints |
| `routes/safety-trigger.ts` | G6 §5 — mental wellbeing trigger ingestion |
| `auth/role-check.ts` | G5 §6.2 (role:patient / role:clinician / role:system) |
| `middleware/redaction.ts` | G5 enforcement at API layer |
| `middleware/audit.ts` | PAC-ISE-007 every interaction logged |

---

## Layer 10 — Tests (`tests/`) — Phase 2E

| File | Source canon | Status |
|---|---|---|
| `acceptance/pac-ise-001.test.ts` | PAC-ISE-001 §8 | Standard |
| `acceptance/pac-ise-002.test.ts` | PAC-ISE-002 §16 | Standard |
| `acceptance/pac-ise-007.test.ts` | PAC-ISE-007 §11 | Standard |
| `acceptance/g5-hipaa-redaction.test.ts` | G5 §7 — **12 mandatory tests** | ⚠️ SHIP BLOCKER |
| `acceptance/g6-safety-escalation.test.ts` | G6 §5.7 — **8 mandatory tests** | ⚠️ SHIP BLOCKER |
| `integration/resolver-flow.test.ts` | Resolver end-to-end | |
| `integration/cascade-flow.test.ts` | G3 §5 selective cascade | |
| `integration/slot-lifecycle.test.ts` | RBSHELF §15 lifecycle | |

---

## Build Phases

| Phase | Layer | Files | Status |
|---|---|---|---|
| **2A** | Foundation (types + repo + docs) | ~10 | ⏳ Current |
| **2B** | Calibration + Storage | ~12 | ⏸ Queued |
| **2C** | Resolver + Computation | ~12 | ⏸ Queued |
| **2D** | Frontend | ~12 | ⏸ Queued |
| **2E** | Governance + API + Tests | ~12 | ⏸ Queued |

Each phase: build → review → approve → next phase.
