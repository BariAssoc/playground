# VERSION-HEADER — BariAccess Platform · Phase 3 V2

**Phase:** 3 of 7 — Resolver Core
**Version:** V2
**Build date:** 2026-05-03
**Supersedes:** Resolver half of V1 Phase 2C (`bariaccess-platform-phase2C.tar.gz`)
**Status:** ✅ Audit-corrected · 184/184 tests passing in integrated suite (V2 Phase 7)
**Authority:** Valeriu E. Andrei, MD, FACS, FASMBS — Founder & CEO, BariAccess LLC
**Scribe:** Claude (Anthropic) — code generation under Val's direction

---

## ⚠️ AUDIT NOTICE

**This phase contains the heaviest concentration of audit corrections in the entire V2 build.** The 2026-05-03 senior-engineer audit pass found 6 canon-implementation deviations — and 4 of them lived in this phase. All 4 are corrected. Audit markers are preserved inline (`⚠️ AUDIT 2026-05-03`) at every changed line.

If you skim only one VERSION-HEADER in V2, this is the one to read carefully.

---

## What this phase contains

The Resolver — the state machine that decides which of the 7 ISE states (ISE-0 through ISE-6) the patient is in, on every Resolver tick. The Resolver consumes 7 signals (governance, data freshness, cognitive load, health status, engagement, trajectory, voice) and runs them through a canon-literal priority chain to produce one ISE state with reason codes and a render contract.

This phase also contains:
- **Threshold constants** — locked numerical thresholds per canon §15
- **Safety override** — G6 mental wellbeing escalation that bypasses the priority chain entirely (highest priority)
- **ISE_DEFAULTS** — the per-state render/CTA/Ollie behavior lookup table per PAC-ISE-001 §5

The Resolver is the heart of BariAccess. Every render, every Ollie message, every CTA, every governance check flows through these files.

## What changed from V1

V1 organized this work as half of `Phase 2C` (which also contained computation utilities). V2 splits these concerns:
- **V2 Phase 3** — Resolver Core (this phase, 13 files) — pure state-machine logic
- **V2 Phase 4** — Computation + Storage — slope/FCS/ORI/apex/presignal utilities + Cosmos persistence

This separation matters because the Resolver is the most canon-sensitive module in the platform. Isolating it in its own phase tarball makes it easier for future developers to read in isolation, audit in isolation, and verify in isolation against PAC-ISE-002 v2.0 §10 pseudocode.

---

## ⚠️ AUDIT 2026-05-03 — CORRECTIONS APPLIED IN THIS PHASE

### Item #3, #4, #5 — Resolver priority chain rewrite

**File:** `src/resolver/priority-chain.ts` (8 audit markers inline)

**Pre-audit version had 6 deviations from PAC-ISE-002 v2.0 §10:**
1. Used 10 priority steps instead of canon's 7
2. "Health status critical → ISE-5" step that does not exist in canon
3. "Building/momentum" before "Aligned" (canon: Aligned before Momentum)
4. Onboarding routed to ISE-0 (canon: ISE-6, CHECK 2 immediately after governance)
5. Used derived helper booleans (`favors_recovery_or_explore`, `favors_build`, etc.) that hid actual canonical thresholds
6. Missing CHECK 4A (Health in trouble → ISE-2) and CHECK 4B (Engagement collapsing → ISE-2)

**Post-audit:** Rewritten as literal translation of canon §10 pseudocode. Every CHECK in code maps to a CHECK in canon. Every threshold reference cites its canon section.

**Specific behavioral changes (front-end consumers must update):**

| Pre-audit behavior | Post-audit behavior | Canon source |
|---|---|---|
| Day 3 patient → ISE-0 | **Day 3 patient → ISE-6** | PAC-ISE-002 §10 CHECK 2 |
| 1 red composite + declining → ISE-5 | **1 red composite + declining → ISE-2** | PAC-ISE-002 §10 CHECK 4A |
| Aligned signals + rising slopes → ISE-4 | **Aligned signals + rising slopes → ISE-1** (aligned wins) | PAC-ISE-002 §5 commentary |
| `selected_by_step === 'governance_flag'` | `selected_by_step === 'governance'` | PAC-ISE-002 §8 Rule Group G |

The pre-audit implementation is preserved as `_deprecated_priorityChain_v1()` which throws a migration error if called.

### Item #10 — ORI threshold corrected

**File:** `src/resolver/thresholds.ts` (1 audit marker)

**Pre-audit:** `THRESHOLD_ORI_LOW = 0.40`
**Post-audit:** `THRESHOLD_ORI_LOW = 0.5`

**Rationale:** Canon §6 Signal 5 specifies `THRESHOLD_ORI default: 0.5` combined with FSI trend for routing. The pre-audit value (0.40) deviated from canon. Now matches canon default. Calibration may adjust during 90-day WoZ with Isaiah.

### Item — Resolver feed shape updated

**File:** `src/resolver/resolver.ts` (1 audit marker)

**Pre-audit:** Priority chain consumed signal evaluator outputs (`signal_1`, `signal_2`, ...) with derived helper booleans.
**Post-audit:** Priority chain consumes raw fields per canon §7 input contract. The Resolver extracts raw fields from signal evaluator outputs before calling the chain.

This change is internal to the Resolver — external callers (`resolve()` function) have unchanged API.

### Item #6 (partial) — Pre-signal helper added

**File:** `src/resolver/signals/signal-4-health-status.ts` (1 audit marker)

**Pre-audit:** `signal_4` consumed `any_presignal_active: boolean` as input but no upstream code computed it. The field was structurally always false in production.
**Post-audit:** Added `buildHealthStatusInputs()` helper that uses `detectAnyPreSignalActive()` from `src/computation/presignal-detection.ts` (Phase 4) to compute the boolean from real composite history.

The detection function itself lives in Phase 4 (`src/computation/presignal-detection.ts`). The wiring helper here in Phase 3 is the bridge.

### Item #9 — Voice stub banner reinforced

**File:** `src/resolver/signals/signal-7-voice.ts` (G6 §4.4 banner — 2 references)

**No code logic change.** Banner expanded to be impossible to miss, listing all four G6 §4.4 activation gates required for unlock:
1. BAA executed
2. HIPAA voice consent UX validated by counsel (Crenguta)
3. Voice affect model validated against bariatric cohort (Pamela + biostatistics)
4. WoZ threshold calibration extended to voice domain (Isaiah)

The signal remains intentionally disabled. `canResolverConsumeVoice()` returns `false`. Resolver discards the result.

**This is a Tier 1 patient-safety lockdown.** See Phase 7 `RED-FLAG-QUESTIONS.md` for full unlock procedure. Even Val cannot unlock voice in a moment of pre-launch pressure without all four gates documented closed in writing.

---

## What's NOT in this phase

| Expected here? Located in |
|---|---|
| Beacon calibration math | Phase 2 |
| Pre-signal detection function (`detectAnyPreSignalActive`) | Phase 4 |
| Computation utilities (slope, FCS, ORI, apex, weights) | Phase 4 |
| Cosmos storage containers | Phase 4 |
| React rendering of ISE state | Phase 5 |
| Governance modules (PAC-ISE-006/007) | Phase 6 |
| Tests | Phase 7 |

## Canon authorities for this phase

The implementations in this phase are literal translations of:

- **PAC-ISE-002 v2.0** §5 — Priority Order (7 steps)
- **PAC-ISE-002 v2.0** §6 — The 6 Resolver Signals
- **PAC-ISE-002 v2.0** §7 — Resolver Input Contract
- **PAC-ISE-002 v2.0** §8 — Trigger Table (Rule Groups G/Q/C/P/A/M/F)
- **PAC-ISE-002 v2.0** §9 — Conflict Detection (feeds ISE-6)
- **PAC-ISE-002 v2.0** §10 — Pseudocode (the source-of-truth implementation)
- **PAC-ISE-002 v2.0** §15 — Threshold constants
- **PAC-ISE-001 v1.0A** §5 — ISE_DEFAULTS lookup table
- **PAC-ISE-001 v1.0A** §6 — Reason code dictionary
- **CCO-FAB-001-PIN-001** (G1) §4 — Effort formula authoritative source
- **CCO-PAC-ISE-002-PATCH-001** (G7) — Effort formula sync to G1 authority
- **DEV-WORK-D0LITE-PATCH-001** (G6) §5 — Mental wellbeing safety override
- **DEV-WORK-D0LITE-PATCH-001** (G6) §4.4 — Voice unlock four gates

Each file's top-of-file comment cites its specific canon section.

## Dependencies on other phases

**This phase depends on:**
- **Phase 1** (Foundation) — imports types from `src/types/ise.ts`, `src/types/composite.ts`, `src/types/safety.ts`, `src/types/voice.ts`, `src/types/audit.ts`

**This phase will depend on (when Phase 4 lands):**
- **Phase 4** (Computation + Storage) — `signal-4-health-status.ts` imports `detectAnyPreSignalActive` from `src/computation/presignal-detection.ts`

**This phase is consumed by:**
- **Phase 6** (Governance + API) — `src/api/routes/identity-ise.ts` calls `resolve()` from `resolver.ts`
- **Phase 7** (Tests) — Multiple test suites exercise the Resolver

## How to verify this phase

```bash
# Extract all phases up through 3
tar -xzf bariaccess-platform-phase1-V2.tar.gz
tar -xzf bariaccess-platform-phase2-V2.tar.gz
tar -xzf bariaccess-platform-phase3-V2.tar.gz
cd bariaccess-platform-V2/

# At this stage typecheck will FAIL because Phase 3 references presignal-detection
# from Phase 4. This is expected. Phase 4 will resolve it.
# To verify Phase 3 in isolation, you can comment out the import in
# signal-4-health-status.ts — but that's not necessary; the Phase 7 full
# suite is the canonical verification.
```

For full test suite verification, install all 7 phases and run:

```bash
npm install
npm test
# Expected: Test Suites: 10 passed, 10 total
#           Tests:       184 passed, 184 total
```

Resolver-specific test suites (in Phase 7):
- `tests/acceptance/pac-ise-002.test.ts` — Canon-literal priority chain (31 tests)
- `tests/integration/resolver-flow.test.ts` — Mark E2E reference scenario
- `tests/acceptance/g6-safety-escalation.test.ts` — 8 mandatory MW-T1..MW-T8 tests

## V2 lineage record

| File | V1 phase | V2 phase | Notes |
|---|---|---|---|
| `src/resolver/priority-chain.ts` | 2C | 3 | ⚠️ AUDIT — full rewrite to canon §10 literal (8 markers) |
| `src/resolver/thresholds.ts` | 2C | 3 | ⚠️ AUDIT — ORI threshold 0.40 → 0.5 |
| `src/resolver/resolver.ts` | 2C | 3 | ⚠️ AUDIT — feed shape updated |
| `src/resolver/safety-override.ts` | 2C | 3 | bit-identical (no audit corrections) |
| `src/resolver/signals/signal-1-governance.ts` | 2C | 3 | bit-identical |
| `src/resolver/signals/signal-2-data-freshness.ts` | 2C | 3 | bit-identical |
| `src/resolver/signals/signal-3-cognitive-load.ts` | 2C | 3 | bit-identical |
| `src/resolver/signals/signal-4-health-status.ts` | 2C | 3 | ⚠️ AUDIT — `buildHealthStatusInputs()` helper added |
| `src/resolver/signals/signal-5-engagement.ts` | 2C | 3 | bit-identical |
| `src/resolver/signals/signal-6-trajectory.ts` | 2C | 3 | bit-identical |
| `src/resolver/signals/signal-7-voice.ts` | 2C | 3 | ⚠️ AUDIT — banner reinforced (no logic change) |
| `src/payload/ise-defaults.ts` | 2C | 3 | bit-identical |
| `VERSION-HEADER.md` | n/a | 3 | **new in V2** — this file |

## Canon mapping (file → canon section)

| File | Canon source | Section | What it implements |
|---|---|---|---|
| `priority-chain.ts` | PAC-ISE-002 v2.0 | §5 + §10 | Priority chain, 7-step canon-literal |
| `thresholds.ts` | PAC-ISE-002 v2.0 | §15 | THRESHOLD_STALE_HOURS, THRESHOLD_PLI_OVERLOAD, THRESHOLD_ORI_LOW, etc. |
| `resolver.ts` | PAC-ISE-002 v2.0 | §13 | Main `resolve()` dispatcher, signal extraction |
| `safety-override.ts` | DEV-WORK-D0LITE + G6 | §5 | Mental wellbeing forced ISE-5 escalation (highest priority) |
| `signal-1-governance.ts` | PAC-ISE-002 | §6 Signal 1 | Governance flag check (provider 51% rule) |
| `signal-2-data-freshness.ts` | PAC-ISE-002 | §6 Signal 2 | Hours since last V1/V2 data point |
| `signal-3-cognitive-load.ts` | PAC-ISE-002 | §6 Signal 3 | PLI count + Space-State |
| `signal-4-health-status.ts` | PAC-ISE-002 + Beacon §10.2 | §6 Signal 4 | Composite band counts + pre-signal aggregation |
| `signal-5-engagement.ts` | PAC-ISE-002 | §6 Signal 5 | FSI + ORI 7-day |
| `signal-6-trajectory.ts` | PAC-ISE-002 + G1 + G7 | §6 Signal 6 | Mood slope + Effort slope (G1 formula) |
| `signal-7-voice.ts` | DEV-WORK-D0LITE + G6 | §4.4 | Voice signal stub (intentionally disabled) |
| `ise-defaults.ts` | PAC-ISE-001 v1.0A | §5 | Per-state render + CTA + Ollie defaults |

## Audit corrections applied

See "AUDIT NOTICE" section above for the full audit record. Summary:

| Audit item | File | Type of change |
|---|---|---|
| #3/#4/#5 | `priority-chain.ts` | Full rewrite to canon §10 literal |
| #10 | `thresholds.ts` | ORI threshold 0.40 → 0.5 |
| (internal) | `resolver.ts` | Feed shape updated to raw fields |
| #6 (helper) | `signal-4-health-status.ts` | `buildHealthStatusInputs()` added |
| #9 | `signal-7-voice.ts` | Banner reinforced (no logic change) |

Total audit markers in this phase: **13** across 5 files.

## Trade-secret notice

Per PAC-ISE-002 v2.0 §15, the **calibrated production values** of the threshold constants in `thresholds.ts` are trade-secret. The values shipping in V2 are canon defaults documented in the canon doc itself:

- `THRESHOLD_STALE_HOURS = 72`
- `THRESHOLD_PLI_OVERLOAD = 5`
- `THRESHOLD_ORI_LOW = 0.5` (corrected from V1's 0.40)
- `THRESHOLD_TRAJECTORY_NEG_SLOPE = -0.1`
- `THRESHOLD_TRAJECTORY_POS_SLOPE = +0.1`
- `THRESHOLD_ONBOARDING_DAYS = 7`
- `THRESHOLD_COMPOSITES_IN_ORANGE = 2`
- `THRESHOLD_SLOT_DRIFT_COUNT_24H = 3`

These canon defaults are safe to ship. **Calibrated production values from the 90-day WoZ with Isaiah replace these in production deployment via environment variables, not via code edits.** See `thresholds.ts` top-of-file commentary for the deployment pattern.

## License & confidentiality

© 2026 BariAccess LLC. All rights reserved.
This source is proprietary. Distribution requires explicit written authorization from Val.
PAC-ISE-002 v2.0 is a TRADE SECRET document; this phase implements its public contract surface only.

## Document history

| Version | Date | Change |
|---|---|---|
| V1 — phase 2C (resolver half) | 2026-05-03 (early) | Original Resolver phase content with 6 canon deviations |
| V1 — AUDITED | 2026-05-03 (mid-day) | Audit pass corrected 6 deviations + added audit markers |
| V2 — phase 3 | 2026-05-03 | Architectural separation from computation; first-class V2 phase; audit corrections preserved bit-identical from V1 AUDITED |

---

**END OF VERSION-HEADER**
