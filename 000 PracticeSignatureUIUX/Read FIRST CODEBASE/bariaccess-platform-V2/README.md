# BariAccess™ Platform — V2

**Phase 1 Practice Edition (GLP-1 Vertical) — Reference Scaffold · Version 2**

```
═══════════════════════════════════════════════════════════════
PROJECT:    BariAccess™ Platform
EDITION:    Practice Edition (GLP-1 Vertical) — Phase 1
VERSION:    V2 · Audit-Corrected Build (2026-05-03)
TARGET:     Biohackers World NYC (June 27–28, 2026)
LAUNCH:     Bariatric Associates, PA (anchor customer)
PATIENT:    Mark (52M, 18 months post-RYGB, Core tier,
            Oura Ring Gen 3, tirzepatide) — SPG-001 Patient 1
═══════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. **Confidential — Internal use only.**

---

## V2 — What's New

V2 incorporates a senior-engineer audit pass (2026-05-03) that verified canon-conformance line-by-line. The audit corrected 6 deviations and added 22 new tests for canon §10.2 pre-signal detection. The full audit record lives in Phase 7 (`CHANGELOG-AUDIT-2026-05-03.md`).

V2 also re-decomposes the build into 7 architecturally clean phases (versus V1's 5-phase delivery-convenience split). Each phase tarball is self-contained with its own `VERSION-HEADER.md` documenting scope, dependencies, and canon authority.

**Test state at V2 release: 184/184 passing across 10 suites. Both pre-ship gates green (G5 HIPAA, G6 safety).**

For a complete V1→V2 migration record, see `VERSION-HEADER.md` in each phase tarball.

---

## V2 — Phase Structure

The build is delivered as 7 sequential phase tarballs that overlay into a single `bariaccess-platform-V2/` repo:

| Phase | Name | What it contains |
|---|---|---|
| 1 | **Foundation** | Types, repo config, top-level docs, canon patches reference |
| 2 | **Beacon Calibration** | Path A/B/C calibration, band lookup, Never-Blank fallback |
| 3 | **Resolver Core** | Priority chain (canon-literal §10), 6 signals, safety override |
| 4 | **Computation + Storage** | Slope, FCS, ORI, effort, apex, presignal, Cosmos containers, redaction |
| 5 | **Frontend** | React components, render tokens, fallback payload |
| 6 | **Governance + API** | PAC-ISE-006/007, route handlers, middleware, auth |
| 7 | **Test Suite + Audit Capstone** | All 184 tests + audit changelog + Zakiy onboarding docs |

Each phase has its own `VERSION-HEADER.md` documenting scope and canon authority. Extracting all 7 in order yields a complete, runnable repo.

---

## What This Is

A TypeScript-first reference scaffold implementing the BariAccess™ canon set. Built for **Zakiy Manigo (Lead Developer)** as the ground-truth structure for Phase 1 build. Every module maps back to a specific canon section — see [ARCHITECTURE.md](./ARCHITECTURE.md) and [CANON-INDEX.md](./CANON-INDEX.md).

This scaffold is **not the final shipped product.** It is:
- ✅ Type-complete — all canonical types defined
- ✅ Schema-complete — all Cosmos containers defined
- ✅ Reference-complete — every locked behavior has a function signature
- ✅ Audit-corrected — 6 canon-conformance corrections verified line-by-line
- ✅ Test-complete — 184 tests passing including 12 mandatory HIPAA tests + 8 mandatory safety tests
- ⚠️ Logic-skeletal — some thresholds marked for WoZ calibration (see PAC-ISE-002 §15)

## Doctrine — The Three Principles

Per `DEV-WORK-D0LITE-001 v0.3 §4`:

1. **Canon stays.** Practice Edition is a configuration, not a rewrite.
2. **D0 = quietest state.** Patient sees minimum needed to start.
3. **Unlocks are celebrations.** Each tile / card / tracker activation is a moment.

## Architecture Quick Reference

```
RHYTHM BOARD (upper ~70%) — DYNAMIC
├── Header: 3-Dots Menu · BariAccess Logo + BioSnap · RhythmSignal · Q
├── Card Area: Cards 1, 2, 3 + Memory Snap
├── Routine Bookshelf: [ AM ] [ Mid ] [ PM ] (17 backend slots)
└── WorkPad (Program / 51-49)

CONSTELLATION PANEL (lower ~30%) — STATIC structure
├── Row 1: Signal Bar — R&R · Healthspan · My Blueprint · Inner Circle
├── Row 2: Ollie's Space
├── Row 3: 51/49 WorkPad / AI Playground
├── Row 4: M+E icon (Mood + Effort patient input)
└── Row 5: Daily Pulse — 6 trackers (FAB · ITB · BEACON · ROUTINE · PROD-locked · PARK)
```

## The 7-State ISE System

Every render and AI behavior derives from exactly one ISE state at a time:

| State | Name | UX |
|---|---|---|
| ISE-0 | Neutral / Baseline | Normal app, full options |
| ISE-1 | Aligned / Available | App encourages action |
| ISE-2 | Protective / Recovery-Forward | App slows down, softer tone |
| ISE-3 | Contained / Load-Limited | App shows ONE thing only |
| ISE-4 | Building / Momentum | App reinforces rhythm |
| ISE-5 | Restricted / Guarded | Provider exercises 51% |
| ISE-6 | Exploratory / Low-Signal | App learns, asks gently |

Per `ISE Canon v3.0`, **AI is trained by state, not by physiology.**

## V2 Repo Layout (after extracting all 7 phases)

```
bariaccess-platform-V2/
├── src/
│   ├── types/         — TypeScript types (Phase 1)
│   ├── calibration/   — Beacon Path A/B/C (Phase 2)
│   ├── resolver/      — PAC-ISE-002 priority chain + 6 signals (Phase 3)
│   ├── computation/   — Slopes, FCS, ORI, apex, presignal, weights (Phase 4)
│   ├── storage/       — Cosmos containers + redaction (Phase 4)
│   ├── frontend/      — PAC-ISE-005 React components (Phase 5)
│   ├── governance/    — PAC-ISE-006/007 (Phase 6)
│   ├── api/           — Route handlers + middleware (Phase 6)
│   └── payload/       — ISE_DEFAULTS lookups (Phase 3)
│
├── tests/             — 184 tests across 10 suites (Phase 7)
│   ├── acceptance/
│   └── integration/
│
├── canon-patches/     — G1–G7 canon patches (Phase 1, reference)
│
└── [top-level docs]   — README, ARCHITECTURE, CANON-INDEX, etc.
```

## Phase 1 Ship Blockers — MANDATORY

These must close before any Phase 1 release:

### HIPAA Redaction (G5 §7)
- [x] All 12 mandatory acceptance tests pass: `npm run test:hipaa` ✅ verified at V2 release

### Mental Wellbeing Safety (G6 §5.7)
- [x] All 8 mandatory acceptance tests pass: `npm run test:safety` ✅ verified at V2 release
- [ ] Keyword list curated by Val + Pamela (operator-side, not code)
- [ ] 988 dial integration verified (iOS + Android) — Phase 1B integration work
- [ ] Provider notification channel active — Phase 1C integration work

### Voice / Signal 7 (G6 §4.4 — INTENTIONALLY LOCKED)
- [ ] BAA executed (Crenguta) — operator-side, blocking
- [ ] Voice consent UX validated by counsel — operator-side, blocking
- [ ] Voice affect model validated against bariatric cohort — Pamela + biostatistics, blocking
- [ ] WoZ threshold calibration extended to voice domain — Isaiah, blocking

**Voice unlock requires ALL FOUR gates documented closed in writing. See `signal-7-voice.ts` banner and Phase 7 `RED-FLAG-QUESTIONS.md`.**

### Composite + Pyramid Architecture
- [x] All 8 composites declared Path B (locked in `src/types/composite.ts`)
- [x] R&R apex daily roll-up scheduled at `03:00 patient-local` (constant in `src/computation/apex-rollup.ts`)
- [x] Composite irreversibility rule enforced (never reverts to `accruing`)
- [x] Beacon §16 dynamic weighting mechanism implemented (Phase 1 provisional values approved by Val 2026-05-03; biostatistics validation pending)

## Getting Started

```bash
# Install dependencies
npm install

# Type-check the entire codebase
npx tsc --noEmit -p tsconfig.json

# Run all tests
npm test
# Expected: 184 passed, 10 suites

# Run only HIPAA-critical tests
npm run test:hipaa
# Expected: 17 passed (12 mandatory T1-T12 + 5 bonus)

# Run only Mental Wellbeing safety tests
npm run test:safety
# Expected: 12 passed (8 mandatory MW-T1..MW-T8 + 4 bonus)

# Run pre-flight audit verification
bash audit-verify.sh
# Expected: 6/6 checks green
```

## For Zakiy

- **Start here:** `ZAKIY-START-HERE.md` (Phase 7) — your onboarding entry point
- **Then:** [ARCHITECTURE.md](./ARCHITECTURE.md) — the file-by-file map
- **Then:** [CANON-INDEX.md](./CANON-INDEX.md) — every canon doc → code module
- **Then:** Read `src/types/` end-to-end — that's the contract surface
- **Then:** Pick a layer and start integration work

Workflow rules: see `HOW-TO-ASK-CLAUDE.md` (Phase 7).
Escalation rules: see `RED-FLAG-QUESTIONS.md` (Phase 7).

Trade-secret thresholds are documented in `src/resolver/thresholds.ts` with their canon source. Calibrated values for production live in your secrets vault, not in the codebase.

## Governance Authority

| Role | Responsibility |
|---|---|
| **Val (CEO + Clinical Authority)** | All canon locks, clinical doctrine, threshold final approval |
| **Zakiy (Lead Developer)** | Implementation, code quality, test coverage, deployment |
| **Isaiah (Data Operations / WoZ)** | 90-day calibration, Resolver agreement scoring |
| **Pamela (Master Barista, RD)** | BBS workflow, Journal Layer 1, mental wellbeing keywords |
| **Nikita (Vision / Marketing / Outreach)** | UX visual design, Nikita-owned design tickets |
| **Crenguta Leaua, Esq.** | EPFL AI governance, BAA execution, voice consent counsel |

## Questions That Are NOT Questions for Code

The following decisions are **clinical/product**, not engineering. Do not let them block the build:

- Composite unlock celebration UX → Nikita design ticket
- BBS InBody/DEXA scheduling → Pamela ops ticket
- Logo color-coordination on slot cascade → Nikita design ticket
- Future PROD vertical activation UX → Nikita design ticket (Phase 2+)
- Final Beacon hex values → Nikita design ticket

## V1 → V2 Lineage

V1 was delivered as 5 phase tarballs (2A foundation, 2B calibration+storage, 2C resolver+computation, 2D frontend, 2E governance+api+tests) plus a final `bariaccess-platform-AUDITED-2026-05-03.tar.gz`.

V1's phase splits were a delivery convenience. V2 re-decomposes into 7 architecturally clean phases. **No code logic differs between V1-AUDITED and V2** — V2 is a re-organization of the audit-corrected codebase with cleaner phase boundaries, stronger documentation, and full canon-patches reference folder.

V2 includes the 7 G-patches (G1–G7) in `canon-patches/` for full architectural transparency. These patches are status `🟡 PROPOSED` — approved by Val in chat 2026-05-03 but pending formal canon-archive elevation.

## License & Confidentiality

This codebase contains proprietary IP and trade-secret algorithms. Distribution requires explicit written authorization from Val.

**Document Canon v2** governs all canonical specifications referenced herein.
