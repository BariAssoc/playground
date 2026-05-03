# VERSION-HEADER — BariAccess Platform · Phase 4 V2

**Phase:** 4 of 7 — Computation + Storage
**Version:** V2
**Build date:** 2026-05-03
**Supersedes:** Computation half of V1 Phase 2C + Storage half of V1 Phase 2B
**Status:** ✅ Audit-corrected · 184/184 tests passing in integrated suite (V2 Phase 7)
**Authority:** Valeriu E. Andrei, MD, FACS, FASMBS — Founder & CEO, BariAccess LLC
**Scribe:** Claude (Anthropic) — code generation under Val's direction

---

## ⚠️ AUDIT NOTICE

**This phase contains TWO BRAND NEW files created during the 2026-05-03 audit:**

1. `src/computation/presignal-detection.ts` — implements Beacon §10.2 (audit item #6)
2. `src/computation/composite-weights-by-ise.ts` — implements Beacon §16 (audit item #7)

Both files exist because the audit found that V1 referenced these mechanisms but did not implement them. Without these files, the Resolver's `any_presignal_active` boolean was structurally always false in production, and the Beacon §16 dynamic weighting principle was inert — both effectively bypassed in V1.

This phase is the second audit-heavy section of V2. Read carefully.

---

## What this phase contains

The Computation + Storage layer of the BariAccess platform. Two distinct concerns combined into one phase because they share the same consumer (the Resolver, the API routes, the apex roll-up).

### Computation (9 files)

Pure deterministic functions. No I/O. No side effects. All testable in isolation.

- **`slope-7day.ts`** — 7-day linear regression slope (used by Mood, Effort, FSI direction)
- **`fcs-daily.ts`** — FAB Consistency Score per G3 §4.2 (cross-FAB adherence detection)
- **`ori-7day.ts`** — Ollie Response Index per G3 §4.3 (decay-weighted: `0.95^days_ago`)
- **`effort-score.ts`** — Effort formula per G1 §4 (`E = 0.40·F + 0.30·C + 0.30·LC`)
- **`apex-rollup.ts`** — daily 03:00 patient-local R&R apex roll-up per G2 §3
- **`composite-recompute.ts`** — selective composite recompute on signal change per G2
- **`cascade-router.ts`** — slot cascade routing per G3 §5
- **`presignal-detection.ts`** — Beacon §10.2 pre-signal (position OR velocity trigger)
- **`composite-weights-by-ise.ts`** — Beacon §16 dynamic composite weighting per ISE state

### Storage (13 files)

Cosmos DB container specifications and the API redaction layer that enforces G5 HIPAA boundaries.

- **`redaction-layer.ts`** — G5 HIPAA redaction (PAC-ISE-006 §4 — patient/provider/internal views)
- **`queries.ts`** — Cosmos query helpers (parameterized, partition-key safe)
- **`containers/_container-spec.ts`** — Container spec interface (TTL, partition key, append-only)
- **`containers/ise-current-state.ts`** — Per-user current ISE state
- **`containers/ise-transition-log.ts`** — Append-only state transitions per PAC-ISE-004
- **`containers/composite-state.ts`** — Per-user composite states (live/accruing)
- **`containers/slot-state.ts`** — Per-user 17-slot RBSHELF states
- **`containers/slot-cascade-events.ts`** — Slot cascade event log
- **`containers/effort-daily-rollup.ts`** — Daily effort score snapshots
- **`containers/daily-engagement-rollup.ts`** — Daily FSI/ORI snapshots
- **`containers/journal-entries.ts`** — Journal entries (G5 redaction at the boundary)
- **`containers/mental-wellbeing-events.ts`** — G6 safety trigger log
- **`containers/fireflies-call-records.ts`** — Voice records (locked, awaiting G6 §4.4 unlock)

## What changed from V1

V1 split this work across two phases:
- V1 Phase 2B contained calibration + storage (storage half = ~13 files)
- V1 Phase 2C contained resolver + computation (computation half = ~7 files)

V2 separates calibration into its own Phase 2 (pure math) and resolver into its own Phase 3 (state machine). The remaining computation + storage live together here in Phase 4 because:

1. They share the same upstream data shape (composite records, behavior events)
2. They are both consumed by the same API routes (Phase 6)
3. Storage containers are designed around what computation produces

Architecturally this is a "data services" layer — what computation produces, storage persists.

V2 changes for Phase 4 specifically:
1. **Renamed** Phase 2B+2C halves → Phase 4 (V2 first-class phase)
2. **Added** `VERSION-HEADER.md` (this file)
3. **Preserved** all 22 source files bit-identical to V1 AUDITED
4. **Documented** the two new audit files (`presignal-detection.ts`, `composite-weights-by-ise.ts`) explicitly

---

## ⚠️ AUDIT 2026-05-03 — CORRECTIONS APPLIED IN THIS PHASE

### Item #6 — Pre-signal detection implemented

**File:** `src/computation/presignal-detection.ts` — **NEW IN V2**

**Pre-audit:** A type definition (`PreSignalDetection`) existed in `src/types/beacon.ts`, but no function computed `any_presignal_active`. The Resolver consumed the boolean but no upstream code produced it. The field was structurally always `false` in production — **the entire Beacon §10.2 pre-signal mechanism was effectively bypassed in V1**.

**Post-audit:** This file implements the Beacon §10.2 EITHER clause literally:

```
PRE-SIGNAL = TRUE when EITHER:
  (a) POSITION: Score is currently in Band 3 (Faint Green, 80-84)
  (b) VELOCITY: Score has dropped > 10 points in 14 days, regardless of band
```

Exports:
- `detectCompositePreSignal(input)` — single composite check
- `detectAnyPreSignalActive(contexts)` — aggregate across user's live composites (used by Resolver)
- `reportPreSignalsAcrossComposites(contexts)` — detailed breakdown for audit log
- `isPreSignalExpired(input)` — Beacon §10.6 expiration rule

**Coverage:** 22 acceptance tests in `tests/acceptance/presignal-detection.test.ts` (Phase 7).

### Item #7 — Beacon §16 dynamic weighting mechanism implemented

**File:** `src/computation/composite-weights-by-ise.ts` — **NEW IN V2**

**Pre-audit:** `apex-rollup.ts` had a constant `COMPOSITE_APEX_WEIGHTS_DEFAULT` set to equal 1/8 across all 8 composites. A code comment said "Operator may persist custom weights via Beacon §16 mechanism" — **but the mechanism did not exist.**

**Post-audit:** This file implements the Beacon §16 dynamic weighting principle. Per canon §16.2, exact weight values per ISE state are deferred to PAC-2 biostatistics validation. The values shipping in V2 are **PHASE_1_PROVISIONAL** — directionally derived from canon §16.3, with conservative ±0.04 shifts from the 1/8 baseline.

**Reviewed and approved by Val (clinical lead, BariAccess LLC) on 2026-05-03 for beta launch.**

The provenance is encoded inline:

```typescript
export const COMPOSITE_WEIGHTS_PROVENANCE = {
  status: 'PHASE_1_PROVISIONAL',
  approved_by: 'Val (clinical lead, BariAccess LLC)',
  approved_on: '2026-05-03',
  source_canon: 'Beacon Canon v1.1 §16.3 directional principles',
  validation_pending: 'PAC-2 biostatistics validation per canon §16.2',
  shift_cap: 0.04,
  baseline: BASELINE_WEIGHT_PER_COMPOSITE
};
```

Per-state weight tables (summary):

| State | Direction (canon §16.3) | Implementation |
|---|---|---|
| ISE-0 Neutral | "Behavioral metrics weighted higher" | BHR/SBL/CRC ↑, MEI/AMP ↓ |
| ISE-1 Aligned | "Equal weighting (canon default)" | All 1/8 |
| ISE-2 Protective | "Recovery-related sub-scores weighted higher" | SRC/SBL/BHR/CRC ↑, MEI/AMP ↓ |
| ISE-3 Contained | "Subjective metrics emphasized" | BCI/SBL/BHR ↑, MEI/AMP ↓ |
| ISE-4 Building | "Phase 2 — to be defined" | Equal 1/8 (deferred) |
| ISE-5 Restricted | "Objective physiological weighted highest" | MBC/SRC/MEI/AMP ↑, SBL/BHR ↓ |
| ISE-6 Exploratory | "Phase 2 — to be defined" | Equal 1/8 (deferred) |

**Module-load invariant:** `_verifyTableSum()` runs at startup and throws if any weight table sums outside 1.0 ± 0.001 — preferable to silent scoring drift in production.

**Coverage:** 36 acceptance tests in `tests/acceptance/beacon-dynamic-weighting.test.ts` (Phase 7).

### Apex roll-up updated to consume ISE-aware weights

**File:** `src/computation/apex-rollup.ts` — modified

**Pre-audit:** `computeApexRollup(params)` took only `weights` parameter (or used equal-weighted default).
**Post-audit:** Now accepts optional `ise_state` parameter. Resolution path: explicit `weights` → `ise_state` lookup via `getCompositeWeightsForISE()` → equal baseline.

Backward-compatible: existing callers without `ise_state` get equal weights (canon §15 default). Production callers should pass current ISE state to engage Beacon §16.

---

## What's NOT in this phase

| Expected here? Located in |
|---|---|
| Type definitions for `CompositeStateRecord`, etc. | Phase 1 |
| Beacon calibration math | Phase 2 |
| Resolver priority chain | Phase 3 |
| React rendering | Phase 5 |
| API route handlers | Phase 6 |
| Auth middleware | Phase 6 |
| Governance modules (PAC-ISE-006/007 application logic) | Phase 6 |
| Tests for these computation modules | Phase 7 |

## Canon authorities for this phase

The implementations in this phase are literal translations of:

- **Beacon Canon v1.1 §10.2** — Pre-signal detection (`presignal-detection.ts`)
- **Beacon Canon v1.1 §10.6** — Pre-signal expiration (`presignal-detection.ts`)
- **Beacon Canon v1.1 §16.1-16.3** — Dynamic Weighting Principle (`composite-weights-by-ise.ts`)
- **Beacon Canon v1.1 §15** — Composite hierarchy (8 composites)
- **CCO-FAB-001-PIN-001** (G1) §4 — Effort formula `E = 0.40·F + 0.30·C + 0.30·LC` (`effort-score.ts`)
- **CCO-FAB-001-PIN-001** (G1) §5 — 7-day slope computation (`slope-7day.ts`)
- **CCO-RR-PYRAMID-ADD-PATCH-001** (G2) §3 — Apex roll-up cascade rules (`apex-rollup.ts`)
- **CCO-RR-PYRAMID-ADD-PATCH-001** (G2) §6 — RRApexRecord schema (`apex-rollup.ts`)
- **CCO-UX-RBSHELF-PATCH-001** (G3) §4.2 — FAB Consistency Score (`fcs-daily.ts`)
- **CCO-UX-RBSHELF-PATCH-001** (G3) §4.3 — Ollie Response Index (`ori-7day.ts`)
- **CCO-UX-RBSHELF-PATCH-001** (G3) §5 — Selective cascade routing (`cascade-router.ts`)
- **PAC-ISE-004 v1.0A** — CosmosDB ISE State Transition Log (`containers/ise-transition-log.ts`)
- **PAC-ISE-006 v1.0A** §4 — CPIE/CCIE Visibility Redaction Matrix (`redaction-layer.ts`)

Each computation file's top-of-file comment cites its specific canon section.

## Dependencies on other phases

**This phase depends on:**
- **Phase 1** (Foundation) — imports types from `src/types/`
- **Phase 2** (Beacon Calibration) — `composite-recompute.ts` calls `calibrateToBeaconWithConfidence()` from `src/calibration/calibrator.ts`

**This phase resolves these forward dependencies left dangling in Phase 3:**
- `signal-4-health-status.ts` → `presignal-detection.ts` ✓ (now resolved)
- `signal-6-trajectory.ts` → `slope-7day.ts` ✓ (now resolved)

**This phase is consumed by:**
- **Phase 6** (Governance + API) — route handlers call `computeApexRollup()`, `computeFCSDaily()`, `computeORI7Day()`
- **Phase 6** (Governance + API) — `redaction-layer.ts` is invoked by API middleware before responses ship
- **Phase 7** (Tests) — Multiple test suites exercise computation and use storage container specs

## How to verify this phase

```bash
# Extract Phase 1, 2, 3, 4 in order
tar -xzf bariaccess-platform-phase1-V2.tar.gz
tar -xzf bariaccess-platform-phase2-V2.tar.gz
tar -xzf bariaccess-platform-phase3-V2.tar.gz
tar -xzf bariaccess-platform-phase4-V2.tar.gz
cd bariaccess-platform-V2/

# Typecheck — should now be CLEAN (Phase 4 resolves Phase 3's forward deps)
npx tsc --noEmit -p tsconfig.json
# Expected: no module-not-found errors. Only the deprecation warning.
```

For full test suite verification, install all 7 phases and run:

```bash
npm install
npm test
# Expected: Test Suites: 10 passed, 10 total
#           Tests:       184 passed, 184 total
```

Phase 4-specific test suites (in Phase 7):
- `tests/acceptance/presignal-detection.test.ts` — 22 tests (Beacon §10.2)
- `tests/acceptance/beacon-dynamic-weighting.test.ts` — 36 tests (Beacon §16)
- `tests/integration/cascade-flow.test.ts` — selective cascade routing
- `tests/integration/slot-lifecycle.test.ts` — slot state lifecycle

## V2 lineage record

| File | V1 phase | V2 phase | Notes |
|---|---|---|---|
| `src/computation/slope-7day.ts` | 2C | 4 | bit-identical |
| `src/computation/fcs-daily.ts` | 2C | 4 | bit-identical |
| `src/computation/ori-7day.ts` | 2C | 4 | bit-identical |
| `src/computation/effort-score.ts` | 2C | 4 | bit-identical |
| `src/computation/apex-rollup.ts` | 2C | 4 | ⚠️ AUDIT — accepts `ise_state` for §16 weight lookup |
| `src/computation/composite-recompute.ts` | 2C | 4 | bit-identical |
| `src/computation/cascade-router.ts` | 2C | 4 | bit-identical |
| `src/computation/presignal-detection.ts` | n/a (V1 didn't have) | 4 | ⚠️ **NEW IN AUDIT** — Beacon §10.2 |
| `src/computation/composite-weights-by-ise.ts` | n/a (V1 didn't have) | 4 | ⚠️ **NEW IN AUDIT** — Beacon §16 |
| `src/storage/redaction-layer.ts` | 2B | 4 | bit-identical |
| `src/storage/queries.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/_container-spec.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/ise-current-state.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/ise-transition-log.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/composite-state.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/slot-state.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/slot-cascade-events.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/effort-daily-rollup.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/daily-engagement-rollup.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/journal-entries.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/mental-wellbeing-events.ts` | 2B | 4 | bit-identical |
| `src/storage/containers/fireflies-call-records.ts` | 2B | 4 | bit-identical |
| `VERSION-HEADER.md` | n/a | 4 | **new in V2** — this file |

## Canon mapping (file → canon section)

| File | Canon source | Section | What it implements |
|---|---|---|---|
| `slope-7day.ts` | G1 | §5 | 7-day linear regression slope (Mood, Effort, FSI) |
| `fcs-daily.ts` | G3 + FAB Canon §11 | §4.2 | FAB Consistency Score |
| `ori-7day.ts` | G3 | §4.3 | Ollie Response Index (decay-weighted) |
| `effort-score.ts` | G1 | §4 | `E = 0.40·F + 0.30·C + 0.30·LC` |
| `apex-rollup.ts` | G2 + Beacon §16 | §3, §6 | Daily 03:00 patient-local apex with ISE-aware weights |
| `composite-recompute.ts` | G2 | §3 | Selective recompute on signal change |
| `cascade-router.ts` | G3 | §5 | Slot cascade routing |
| `presignal-detection.ts` | Beacon Canon | §10.2, §10.6 | Position OR velocity pre-signal + expiration |
| `composite-weights-by-ise.ts` | Beacon Canon | §16.1-16.3 | Dynamic composite weighting per ISE state |
| `redaction-layer.ts` | PAC-ISE-006 | §4 | CPIE/CCIE visibility matrix enforcement |
| `queries.ts` | PAC-ISE-004 | All | Cosmos parameterized query helpers |
| `containers/*.ts` | PAC-ISE-004 + G2/G3/G5/G6 | various | Container specs (partition key, TTL, append-only) |

## Audit corrections applied

| Audit item | File | Type of change |
|---|---|---|
| #6 | `presignal-detection.ts` | **NEW FILE** — implements Beacon §10.2 |
| #7 | `composite-weights-by-ise.ts` | **NEW FILE** — implements Beacon §16; Phase 1 provisional values approved by Val 2026-05-03 |
| (wiring) | `apex-rollup.ts` | Accepts `ise_state` for §16 weight lookup |

Total audit-related additions/modifications in this phase: **3 files** (2 new, 1 modified).

## Trade-secret notice

Per Beacon Canon v1.1 §31, the **specific composite-to-path mappings and the per-composite calibration parameters** referenced inside `composite-recompute.ts` are trade-secret. The values currently in `composite-weights-by-ise.ts` are **PHASE_1_PROVISIONAL** per canon §16.2, with explicit metadata in `COMPOSITE_WEIGHTS_PROVENANCE`. They will be replaced by biostatistics-validated values when PAC-2 lands.

The deployment pattern for production:
1. Code ships canon defaults (PHASE_1_PROVISIONAL)
2. Production deployment overrides via environment variables OR replaces tables wholesale via a single PR with provenance metadata updated to `BIOSTATISTICS_VALIDATED`
3. Tests in Phase 7 verify structural contract (sum=1.0, all 8 composites, valid ranges) — pass regardless of specific values

## License & confidentiality

© 2026 BariAccess LLC. All rights reserved.
This source is proprietary. Distribution requires explicit written authorization from Val.
Trade-secret components per Beacon Canon §31 and PAC-ISE-002 §15 are marked inline.

## Document history

| Version | Date | Change |
|---|---|---|
| V1 — phase 2C (computation half) | 2026-05-03 (early) | Original computation files (without presignal-detection or composite-weights-by-ise) |
| V1 — phase 2B (storage half) | 2026-05-03 (early) | Original storage files |
| V1 — AUDITED | 2026-05-03 (mid-day) | Audit added `presignal-detection.ts` (item #6) and `composite-weights-by-ise.ts` (item #7); modified `apex-rollup.ts` |
| V2 — phase 4 | 2026-05-03 | Architectural separation: Phase 2B+2C halves → Phase 4; bit-identical to V1 AUDITED |

---

**END OF VERSION-HEADER**
