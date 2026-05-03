# BariAccess™ Canon Index

**Every canon document → every code module that implements it.**

This is the reverse map of `ARCHITECTURE.md`. Use this when you have a canon section in hand and need to find the code; use ARCHITECTURE when you have code in hand and need the canon.

---

## Supreme Canon Set (Authoritative References)

### 1. Beacon Canon v1.1 (Feb 10, 2026 — locked)
| Section | Implementation |
|---|---|
| §4 — 7-band architecture | `src/types/beacon.ts` (`BeaconBand`, `BeaconColor`) · `src/calibration/band-lookup.ts` |
| §6 — Piecewise linear mapping | `src/calibration/path-a-zscore.ts` |
| §6.5 — Path B (Bounded 0-100) | `src/calibration/path-b-bounded.ts` |
| §10 — Pre-Signal Detection | `src/computation/composite-recompute.ts` (position + velocity) |
| §11 — Confidence Indicators | `src/types/beacon.ts` (`Confidence`, `ScoreWithConfidence`) |
| §12 — Missing Data / Never Blank | `src/calibration/calibrator.ts` (default 30 fallback) |
| §15 — Scoring Hierarchy | `src/types/beacon.ts` (`CompositeName`, `CompositeMetadata`) |
| §16 — Dynamic Weighting by ISE | `src/resolver/signals/signal-4-health-status.ts` |
| §17 — Response Protocol by Band | `src/governance/ai-boundaries.ts` |

### 2. ISE Canon v3.0 (Feb 20, 2026 — locked)
| Section | Implementation |
|---|---|
| §2 — 7 finite states | `src/types/ise.ts` (`ISEState` enum) |
| §3 — Canonical State Authority | `src/resolver/resolver.ts` (single source of truth) |
| §3.1 — Two-Lane Authority | `src/resolver/resolver.ts` (Lane 1) + `src/governance/*` (Lane 2) |
| §5 — Tile rims | `src/frontend/components/signal-bar-tile.tsx` |
| §10 — ISE and Scoring | `src/computation/composite-recompute.ts` |
| §13 — Delivery matrix | `src/governance/ai-boundaries.ts` |
| §17 — Core Principles + CPIE/CCIE | `src/types/journal.ts` (`CreditType`, `InterfaceLayer`) |

### 3. Beacon Calibration Algorithm v1.0 (March 14, 2026 — locked)
| Section | Implementation |
|---|---|
| §2 — Input classification | `src/types/beacon.ts` (`CalibrationInputType`) |
| §4.1 — Path A (Z-score) | `src/calibration/path-a-zscore.ts` |
| §4.2 — Path B (Bounded 0-100) | `src/calibration/path-b-bounded.ts` |
| §4.3 — Path C (Raw Range) | `src/calibration/path-c-raw-range.ts` |
| §5 — Band lookup | `src/calibration/band-lookup.ts` |
| §6 — End-to-end pseudocode | `src/calibration/calibrator.ts` |

### 4. PAC-ISE-001 v1.0A (Identity State Expressions Rendering Layer)
| Section | Implementation |
|---|---|
| §3 — Finite state set | `src/types/ise.ts` (`ISEState`) |
| §4.1 — Identity icon tokens | `src/types/ise.ts` (`IdentityIconTokens`) · `src/frontend/components/identity-icon.tsx` |
| §4.2 — CTA policy | `src/types/ise.ts` (`CTAPolicy`) · `src/frontend/components/cta-controller.tsx` |
| §4.3 — Ollie policy | `src/types/ise.ts` (`OlliePolicy`) · `src/frontend/components/ollie-space.tsx` |
| §5 — ISE_DEFAULTS lookup | `src/payload/ise-defaults.ts` |
| §6 — ISEPayload schema | `src/types/ise.ts` (`ISEPayload`) · `src/payload/schema-validator.ts` |
| §8 — Acceptance tests | `tests/acceptance/pac-ise-001.test.ts` |

### 5. PAC-ISE-002 v2.0 (ISE Resolver Specification — TRADE SECRET)
| Section | Implementation |
|---|---|
| §3 — Resolver as dispatcher | `src/resolver/resolver.ts` |
| §5 — Priority order | `src/resolver/priority-chain.ts` |
| §6 — 6 resolver signals | `src/resolver/signals/signal-1` through `signal-6.ts` |
| §11 — Output contract (ISEPayload) | `src/resolver/resolver.ts` (return shape) |
| §13 — Resolver run triggers | `src/resolver/resolver.ts` (entry points) |
| §14 — Phase 1 WoZ + Phase 3 AI | `src/resolver/safety-override.ts` (Phase 3 gate hint) |
| §15 — Threshold appendix | `src/resolver/thresholds.ts` |
| §16 — Acceptance tests | `tests/acceptance/pac-ise-002.test.ts` |

### 6. PAC-ISE-003 v1.0A (Reason Codes + Template Keys)
| Section | Implementation |
|---|---|
| §3 — Reason codes dictionary | `src/payload/reason-codes.ts` |
| §4 — Reason code → ISE mapping | `src/payload/reason-codes.ts` (validation) |
| §5 — Ollie template keys | `src/payload/template-keys.ts` |
| §7 — Validation rules | `src/payload/schema-validator.ts` |

### 7. PAC-ISE-004 v1.0A (Cosmos DB Schema)
| Section | Implementation |
|---|---|
| §3.1 — `ise-current-state` container | `src/storage/containers/ise-current-state.ts` |
| §3.2 — `ise-transition-log` container | `src/storage/containers/ise-transition-log.ts` |
| §4 — Governance + redaction | `src/storage/redaction-layer.ts` |
| §5 — Query patterns | `src/storage/queries.ts` |
| §6 — Retention + TTL | `src/storage/containers/*.ts` (per-container TTL) |
| §10 — Acceptance tests | `tests/acceptance/storage.test.ts` |

### 8. PAC-ISE-005 v1.0A (Frontend Reference Component)
| Section | Implementation |
|---|---|
| §5 — Identity Icon component | `src/frontend/components/identity-icon.tsx` |
| §6 — CTA Controller | `src/frontend/components/cta-controller.tsx` |
| §7 — Ollie Space | `src/frontend/components/ollie-space.tsx` |
| §8 — Constellation Panel composed | `src/frontend/components/constellation-panel.tsx` |
| §9 — Error handling + fallback | `src/frontend/fallback-payload.ts` |
| §10 — Accessibility | All components (prefers-reduced-motion) |

### 9. PAC-ISE-006 v1.0A (CPIE/CCIE Visibility & Redaction Matrix)
| Section | Implementation |
|---|---|
| §4 — Visibility matrix | `src/governance/visibility-matrix.ts` |
| §6 — Redaction levels | `src/governance/visibility-matrix.ts` |
| §7 — API enforcement | `src/api/middleware/redaction.ts` |
| §8 — Audit trail | `src/governance/audit-logger.ts` |
| §11 — Acceptance tests | `tests/acceptance/pac-ise-006.test.ts` |

### 10. PAC-ISE-007 v1.0B (AI Behavioral Governance)
| Section | Implementation |
|---|---|
| §3 — Prohibited capabilities | `src/governance/prohibited-capabilities.ts` |
| §4 — Per-state behavioral boundaries | `src/governance/ai-boundaries.ts` |
| §7 — Compliance logging | `src/governance/audit-logger.ts` |
| §7.2 — Deviation alerts | `src/governance/deviation-detector.ts` |
| §11 — Acceptance tests | `tests/acceptance/pac-ise-007.test.ts` |

---

## New Canon Set (May 2, 2026 — uploaded by Val)

### 11. CCO-FAB-001 v2.0 Pass 1 (FAB Canon Architectural Reset)
| Section | Implementation |
|---|---|
| §2 — 7 families | `src/types/fab.ts` (`FABFamily`) |
| §3 — Task / Silent visibility | `src/types/fab.ts` (`FABVisibility`) |
| §4 — 6 states | `src/types/fab.ts` (`FABState`) |
| §5 — 4 operating levels | `src/types/fab.ts` (`FABOperatingLevel`) |
| §6 — Variable / Binary types | `src/types/fab.ts` (`FABDataType`) |
| §11 — FCS formula | `src/computation/fcs-daily.ts` |
| §12 — Drift thresholds | `src/types/fab.ts` (constants) |

### 12. CCO-UX-RBSHELF-001 v1.1 (Routine Bookshelf)
| Section | Implementation |
|---|---|
| §3 — Display (AM/Mid/PM) | `src/frontend/components/routine-bookshelf.tsx` |
| §6.5 — 17-slot architecture | `src/types/slot.ts` (`SlotId`, `ALL_SLOTS`) |
| §13 — Time Anchor | `src/computation/cascade-router.ts` |
| §14 — FAB-to-Slot mapping | `src/types/slot.ts` (`CrossSlotFAB`) |
| §15 — Slot expression activation | `src/types/slot.ts` (`SlotLifecycleState`, `SlotFinalState`) |

### 13. CCO-ENG-LOGO-EXPR-001 v1.1 (Logo Expression Canon)
| Section | Implementation |
|---|---|
| §5 — Three-phase sequence | `src/frontend/components/logo-expression.tsx` |
| §6 — Rhythm Signal full spec | `src/frontend/components/logo-expression.tsx` |
| §7 — 7 BioSnap types | `src/frontend/components/logo-expression.tsx` |
| §18 — Aurora KPI | `src/computation/aurora-kpi.ts` (Phase 2D) |

### 14. CCO-RR-PYRAMID-ADD-001 v1.0 (Pyramid + Ground Levels Addendum)
| Section | Implementation |
|---|---|
| §2 — Pyramid-on-ground metaphor | `src/types/composite.ts` |
| §3 — Orange dot rule per tile | `src/computation/cascade-router.ts` |
| §6 — 4-tile connected architecture | `src/storage/containers/composite-state.ts` |

### 15. DEV-WORK-D0LITE-001 v0.3 (Practice Edition GLP-1)
| Section | Implementation |
|---|---|
| §2 — Timespan progression | `src/frontend/components/signal-bar-tile.tsx` (`tileLock`) |
| §6 — Daily Pulse PE config | `src/frontend/components/daily-pulse-tracker.tsx` |
| §16 — Pyramid + Ground addendum | `src/computation/cascade-router.ts` |

### 16. MEMO-CARD-COMM-001 (Cards as Communication Layer)
| Section | Implementation |
|---|---|
| §2 — 4 origin paths | `src/types/card.ts` (`CardOrigin`) |
| §3 — Cards → Journal bridge | `src/types/journal.ts` |
| §4 — Slot Card variant | `src/types/card.ts` (`SlotCard`) |
| §6 — Surface boundaries | `src/types/card.ts` (`CARD_SURFACE_TO_INTERFACE`) |

---

## Phase 1 Closure Patches (G1–G7, May 2, 2026)

### G1 — CCO-FAB-001-PIN-001 v1.0 (Pin Specs)
| Section | Implementation |
|---|---|
| §2 — Timestamp pin (4 levels) | `src/types/fab.ts` (`TimestampPin`) |
| §3 — Mood pin | `src/types/fab.ts` (`MoodReading`) |
| §4 — Effort pin (canonical formula) | `src/computation/effort-score.ts` · `src/types/fab.ts` (`EffortScoreInputs`) |
| §5 — 7-day slope | `src/computation/slope-7day.ts` |
| §6 — Storage hooks | `src/storage/containers/effort-daily-rollup.ts` |

### G2 — CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (Composites + Cascade + accruing)
| Section | Implementation |
|---|---|
| §2 — All 8 composites = Path B | `src/types/composite.ts` (`CompositeMetadata`) |
| §3 — Cascade stops at composite | `src/computation/composite-recompute.ts` (apex deferred) |
| §4 — Phase 1 scope (SRC + CRC live) | `src/computation/apex-rollup.ts` |
| §5 — `accruing`/`live` render token | `src/types/ise.ts` (`CompositeRenderToken`) |
| §6 — `composite-state` container | `src/storage/containers/composite-state.ts` |

### G3 — CCO-UX-RBSHELF-PATCH-001 v1.0 (Slot → Resolver mapping)
| Section | Implementation |
|---|---|
| §3 — `slot_drift_count_24h` → Signal 4 | `src/resolver/signals/signal-4-health-status.ts` |
| §4 — Slot completion → Signal 5 (FCS + ORI) | `src/resolver/signals/signal-5-engagement.ts` · `src/computation/fcs-daily.ts` · `src/computation/ori-7day.ts` |
| §5 — Selective cascade routing | `src/computation/cascade-router.ts` |
| §6 — Three new containers | `src/storage/containers/{slot-state,slot-cascade-events,daily-engagement-rollup}.ts` |

### G4 — CCO-ENG-LOGO-EXPR-PATCH-001 v1.0 (Aurora Calibration)
| Section | Implementation |
|---|---|
| §2 — Aurora = Path B | `src/computation/aurora-kpi.ts` |
| §3 — Render rules (Day 30 / 90) | `src/frontend/components/logo-expression.tsx` |
| §4 — Missing data + weight renormalization | `src/computation/aurora-kpi.ts` |

### G5 — CCO-UX-CARD-COMM-PATCH-001 v1.0 (HIPAA Redaction Map)
| Section | Implementation | ⚠️ |
|---|---|---|
| §4 — Per-column visibility matrix | `src/governance/visibility-matrix.ts` | HIPAA |
| §5 — Per-card-origin visibility | `src/types/card.ts` (`CARD_SURFACE_TO_INTERFACE`) | HIPAA |
| §6 — API enforcement + soft-delete | `src/api/middleware/redaction.ts` · `src/api/routes/journal-entries.ts` | HIPAA |
| §7 — **12 mandatory acceptance tests** | `tests/acceptance/g5-hipaa-redaction.test.ts` | ⚠️ SHIP BLOCKER |

### G6 — DEV-WORK-D0LITE-PATCH-001 v1.0 (4 PE implementation gaps)
| Section | Implementation | ⚠️ |
|---|---|---|
| §3 — `tileLock` token | `src/types/ise.ts` (`TileLockToken`) · `src/frontend/components/signal-bar-tile.tsx` | |
| §4 — Voice Signal 7 (Phase 2+) | `src/types/voice.ts` · `src/resolver/signals/signal-7-voice.ts` (stub) | HIPAA Phase 2+ |
| §5 — Mental Wellbeing escalation | `src/types/safety.ts` · `src/resolver/safety-override.ts` · `src/api/routes/safety-trigger.ts` | ⚠️ SAFETY-CRITICAL |
| §5.7 — **8 mandatory acceptance tests** | `tests/acceptance/g6-safety-escalation.test.ts` | ⚠️ SHIP BLOCKER |
| §6 — PROD slot 5 locked-empty | `src/types/ise.ts` (`TrackerRenderToken`) · `src/frontend/components/daily-pulse-tracker.tsx` | |

### G7 — CCO-PAC-ISE-002-PATCH-001 v1.0 (Effort sync — housekeeping)
| Section | Implementation |
|---|---|
| §3 — Effort formula sync | `src/resolver/signals/signal-6-trajectory.ts` (reads `effort_score_daily` from rollup, does not recompute) |

---

## Reading Order for Zakiy

**For the entire scaffold, read canon docs in this order:**

1. ISE Canon v3.0 — finite state set + Two-Lane Authority
2. Beacon Canon v1.1 §4 + §15 — bands + composites
3. Beacon Calibration Algorithm v1.0 — Path A/B/C
4. PAC-ISE-001 — payload schema (the contract Zakiy implements)
5. PAC-ISE-002 v2.0 — Resolver dispatcher
6. PAC-ISE-003, 004, 005, 006, 007 — supporting layers
7. New canon (FAB v2.0, RBSHELF v1.1, LOGO-EXPR v1.1, PYRAMID-ADD, MEMO-CARD-COMM, DEV-WORK-D0LITE)
8. Patches G1–G7 — these resolve gaps in 1-7

**For the code, read in this order:**

1. `src/types/` — every file (the contract surface)
2. `src/calibration/` — pure deterministic functions, easiest to verify
3. `src/storage/` — Cosmos containers + queries
4. `src/computation/` — nightly + event-driven jobs
5. `src/resolver/` — the heart of the system
6. `src/governance/` — redaction + AI boundaries
7. `src/frontend/` — render layer
8. `src/api/` — HTTP routes
9. `tests/` — acceptance tests (especially G5 HIPAA + G6 Safety)
