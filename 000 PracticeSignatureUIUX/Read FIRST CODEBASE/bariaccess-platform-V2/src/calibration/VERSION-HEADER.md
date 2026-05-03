# VERSION-HEADER — BariAccess Platform · Phase 2 V2

**Phase:** 2 of 7 — Beacon Calibration
**Version:** V2
**Build date:** 2026-05-03
**Supersedes:** Calibration half of V1 Phase 2B (`bariaccess-platform-phase2B.tar.gz`)
**Status:** ✅ Audit-corrected · 184/184 tests passing in integrated suite (V2 Phase 7)
**Authority:** Valeriu E. Andrei, MD, FACS, FASMBS — Founder & CEO, BariAccess LLC
**Scribe:** Claude (Anthropic) — code generation under Val's direction

---

## What this phase contains

The Beacon Calibration layer — the deterministic mathematical engine that converts raw biometric and behavioral measurements into the BariAccess 7-band scoring corridor (Strong Green, Med Green, Faint Green, Light Orange, Med Orange, Dark Orange, Red).

This phase implements the three calibration paths defined by Beacon Canon v1.1, the 7-band lookup table, the end-to-end calibrator, and the "Never Blank" fallback for missing data scenarios. **No business logic, no Resolver, no UI — only the calibration math.**

The Beacon corridor is the one mathematical primitive shared across every composite, every pre-signal, every confidence calculation, and the apex roll-up. Every downstream phase consumes its outputs.

## What changed from V1

V1 organized calibration as the first half of `Phase 2B` (which also contained Cosmos storage). V2 splits these concerns:
- **V2 Phase 2** — Beacon calibration (this phase, 5 files)
- **V2 Phase 4** — Computation + Storage (the other half of V1's 2B, plus computation utilities from V1 2C)

This separation matters for GitHub readers: calibration is pure math (deterministic, no I/O, fully testable in isolation). Storage is persistence (Cosmos-coupled, requires runtime). Mixing them in one phase tarball confused architectural concerns.

V2 changes for Phase 2 specifically:
1. **Renamed** Phase 2B (calibration half) → Phase 2 (V2 first-class phase)
2. **Added** `VERSION-HEADER.md` (this file)
3. **Preserved** all 5 calibration files bit-identical to V1

**No audit corrections affect this phase.** The 2026-05-03 audit explicitly verified `band-lookup.ts` and `path-a-zscore.ts` against canon — all 7 band cutoffs (95/85/80/70/65/60) and all 7 Z-score piecewise breakpoints (+1.5/+0.7/+0.3/-0.3/-0.6/-1.0) match Beacon Canon v1.1 §4 and §6.1 line-by-line. No changes were necessary.

## What's NOT in this phase

| Expected here? Not found here. | Located in |
|---|---|
| Type definitions for `BeaconBand`, `BeaconColor`, etc. | Phase 1 |
| Composite-specific calibration parameters | Phase 4 (`composite-recompute.ts`) |
| Confidence-tier rules (Beacon §11) — implementation logic | Phase 4 |
| Pre-signal detection (Beacon §10.2) | Phase 4 (`presignal-detection.ts`) |
| Beacon §16 dynamic weighting (composite weights per ISE state) | Phase 4 (`composite-weights-by-ise.ts`) |
| Cosmos persistence of calibrated scores | Phase 4 |
| React rendering of Beacon bands | Phase 5 (`composite-display.tsx`) |
| Acceptance tests for calibration | Phase 7 (covered by integration tests in `integration/cascade-flow.test.ts`) |

## Canon authorities for this phase

The implementations in this phase are literal translations of:

- **Beacon Canon v1.1 §4** — 7-band corridor with exact cutoffs (`band-lookup.ts`)
- **Beacon Canon v1.1 §6.1** — Path A Z-score piecewise function (`path-a-zscore.ts`)
- **Beacon Canon v1.1 §6.2** — Path B bounded 0-100 calibration (`path-b-bounded.ts`)
- **Beacon Canon v1.1 §6.3** — Path C raw range calibration (`path-c-raw-range.ts`)
- **Beacon Canon v1.1 §12.3** — Never Blank fallback (score=30, band=7) — implemented in `calibrator.ts`
- **Beacon Calibration Algorithm v1.0** — supplementary reference document for end-to-end orchestration

Each calibration file's top-of-file comment cites its specific canon section and line range.

## Dependencies on other phases

**This phase depends on:**
- **Phase 1** (Foundation) — imports `BeaconBand`, `BeaconColor`, `CalibrationConfidence` types from `src/types/beacon.ts`

**This phase is consumed by:**
- **Phase 3** (Resolver Core) — Signal evaluators don't directly call calibration; they consume already-calibrated composite scores
- **Phase 4** (Computation + Storage) — `composite-recompute.ts` calls `calibrateToBeaconWithConfidence()` from `calibrator.ts` on every composite update; `apex-rollup.ts` uses it for daily roll-ups
- **Phase 5** (Frontend) — `composite-display.tsx` consumes Beacon band → color mapping (indirectly via render tokens)

## How to verify this phase

```bash
# Extract Phase 1 first (required dependency), then Phase 2
tar -xzf bariaccess-platform-phase1-V2.tar.gz
tar -xzf bariaccess-platform-phase2-V2.tar.gz
cd bariaccess-platform-V2/

# Phase-local typecheck (Phase 1 + Phase 2 together)
npx tsc --noEmit -p tsconfig.json

# Expected: no errors. Calibration imports from types/beacon.ts and types/composite.ts.
```

For full test suite verification, install all 7 phases and run:

```bash
npm install
npm test
# Expected: Test Suites: 10 passed, 10 total
#           Tests:       184 passed, 184 total
```

Calibration is exercised most heavily by:
- `tests/integration/cascade-flow.test.ts` (composite recompute fires calibration)
- `tests/integration/resolver-flow.test.ts` (Mark scenario calibrates real scores end-to-end)

## V2 lineage record

| File | V1 phase | V2 phase | Notes |
|---|---|---|---|
| `src/calibration/band-lookup.ts` | 2B | 2 | bit-identical (audit verified canon-correct) |
| `src/calibration/path-a-zscore.ts` | 2B | 2 | bit-identical (audit verified canon-correct) |
| `src/calibration/path-b-bounded.ts` | 2B | 2 | bit-identical |
| `src/calibration/path-c-raw-range.ts` | 2B | 2 | bit-identical |
| `src/calibration/calibrator.ts` | 2B | 2 | bit-identical |
| `VERSION-HEADER.md` | n/a | 2 | **new in V2** — this file |

## Canon mapping (file → canon section)

| File | Canon source | Section | What it implements |
|---|---|---|---|
| `band-lookup.ts` | Beacon Canon v1.1 | §4 | 7-band lookup: score 0-100 → BeaconBand (1-7) → BeaconColor name |
| `path-a-zscore.ts` | Beacon Canon v1.1 | §6.1 | Z-score → 0-100 piecewise mapping (used for HRV, RHR, sleep efficiency) |
| `path-b-bounded.ts` | Beacon Canon v1.1 | §6.2 | Bounded metrics (0-100 native, e.g., FAB completion rate, ORI) |
| `path-c-raw-range.ts` | Beacon Canon v1.1 | §6.3 | Raw range (e.g., body composition, lab values mapped to clinical reference) |
| `calibrator.ts` | Beacon Canon v1.1 | §6, §11, §12.3 | End-to-end: dispatches to A/B/C, attaches confidence, applies Never Blank fallback |

## Audit corrections applied

**None.** The 2026-05-03 audit explicitly examined `band-lookup.ts` and `path-a-zscore.ts` and found:

> "All 7 band ranges (95-100, 85-94, 80-84, 70-79, 65-69, 60-64, 0-59) match Beacon Canon v1.1 §4 line-by-line. All 7 color names match. No fix needed."
>
> "All 7 piecewise breakpoints (Z thresholds at +1.5, +0.7, +0.3, -0.3, -0.6, -1.0, < -1.0) match Beacon Canon v1.1 §6.2 line-by-line. All coefficients (10, 12.5, 12.5, 16.7, 16.7, 12.5, 20) match. The cap-at-100 and floor-at-0 clamps match. No fix needed."

— Audit Pass 2026-05-03, items #1 and #2

The Beacon math is one of the most rigorously verified parts of the platform. It is the substrate on which everything else depends; correctness here is non-negotiable.

## Trade-secret notice

Per Beacon Canon v1.1 §31, the **specific composite-to-path mappings and the per-composite calibration parameters** are trade secret. The functions in this phase are deterministic reference implementations of Paths A, B, and C — but which specific composite uses which path, and with which parameters, lives in `composite-recompute.ts` (Phase 4) where the trade-secret application happens.

This phase contains the published mathematical primitives only. No trade-secret content.

## License & confidentiality

© 2026 BariAccess LLC. All rights reserved.
This source is proprietary. Distribution requires explicit written authorization from Val.

## Document history

| Version | Date | Change |
|---|---|---|
| V1 — phase 2B (calibration half) | 2026-05-03 (early) | Original Calibration phase content — superseded by V2 Phase 2 |
| V2 — phase 2 | 2026-05-03 | Architectural separation from storage; first-class V2 phase; bit-identical content (no audit corrections needed) |

---

**END OF VERSION-HEADER**
