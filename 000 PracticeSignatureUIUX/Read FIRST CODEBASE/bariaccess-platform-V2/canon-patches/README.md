# Canon Patches — G1 through G7

**Folder purpose:** Reference copies of the seven canonical patches (G1–G7) that fill gaps in upstream canon documents. The TypeScript types, business logic, and tests in this scaffold reference these patches by ID and section number. This folder makes them readable in-context without leaving the repo.

---

## Status — IMPORTANT

All seven patches are status `🟡 DRAFT — PENDING VAL APPROVAL` per their internal banners.

**Approval reality:** Val (CEO, clinical lead, BariAccess LLC) approved the **content** of all seven patches in chat on **2026-05-03**. The scaffold treats them as authoritative for implementation purposes.

**What "PENDING VAL APPROVAL" means in practice:** The formal elevation to LOCKED status in the BariAccess canon archive (Notion / Cursor) is a follow-up administrative action by Val. Until that elevation:

- ✅ The patches are authoritative for code implementation
- ✅ The scaffold's design choices reference them as if locked
- ⚠️ External readers should treat them as "approved-in-chat, archive-elevation-pending"
- ⚠️ Substantive changes to G1–G7 require Val's sign-off, not Zakiy's discretion

---

## Patch index

| # | File | Patches | Filling gap in |
|---|---|---|---|
| G1 | `CCO-FAB-001-PIN-001_v1.0_PROPOSED.md` | FAB Canon v2.0 Pass 1 | §7 — Pin measurement specs (Mood, Effort, Timestamp) |
| G2 | `CCO-RR-PYRAMID-ADD-PATCH-001_v1.0_PROPOSED.md` | R&R Pyramid Addendum | §3.3 — Composite calibration paths + cascade hooks |
| G3 | `CCO-UX-RBSHELF-PATCH-001_v1.0_PROPOSED.md` | RBSHELF v1.1 | §15 — Slot cascade → Resolver signal mapping |
| G4 | `CCO-ENG-LOGO-EXPR-PATCH-001_v1.0_PROPOSED.md` | LOGO-EXPR v1.1 | Aurora KPI Beacon calibration path declaration |
| G5 | `CCO-UX-CARD-COMM-PATCH-001_v1.0_PROPOSED.md` | MEMO-CARD-COMM-001 | Cards → Journal CPIE/CCIE redaction map |
| G6 | `DEV-WORK-D0LITE-PATCH-001_v1.0_PROPOSED.md` | DEV-WORK-D0LITE v0.3 | Locked tile render + Fireflies signal + safety escalation + PROD lock |
| G7 | `CCO-PAC-ISE-002-PATCH-001_v1.0_PROPOSED.md` | PAC-ISE-002 v2.0 | §6 Signal 6 Effort formula sync to G1 authority |

---

## Where each patch is consumed in the codebase

### G1 — FAB Pin Measurement Specs
- `src/types/fab.ts` — `FABBookendRecord` interface (G1 §6 storage hooks)
- `src/computation/effort-score.ts` (Phase 4) — implements `E = 0.40·F + 0.30·C + 0.30·LC` (G1 §4)
- `src/computation/slope-7day.ts` (Phase 4) — 7-day linear regression slope (G1 §5)

### G2 — Pyramid Addendum Cascade Hooks
- `src/types/composite.ts` — `CompositeStateRecord`, accruing/live state machine
- `src/computation/composite-recompute.ts` (Phase 4) — selective cascade routing (G2 §3)
- `src/computation/apex-rollup.ts` (Phase 4) — daily 03:00 patient-local roll-up (G2 §3)

### G3 — RBSHELF Slot → Signal Mapping
- `src/types/slot.ts` — slot state machine
- `src/computation/cascade-router.ts` (Phase 4) — slot cascade routing (G3 §5)
- `src/computation/fcs-daily.ts` (Phase 4) — FAB Consistency Score (G3 §4.2)
- `src/computation/ori-7day.ts` (Phase 4) — Ollie Response Index (G3 §4.3)

### G4 — LOGO-EXPR Aurora Path
- `src/frontend/components/logo-expression.tsx` (Phase 5) — three-phase logo render
- `src/frontend/tokens/ise-render-tokens.ts` (Phase 5) — Aurora KPI render tokens

### G5 — Cards → Journal Redaction
- `src/types/journal.ts` — three view variants (patient / provider / internal)
- `src/types/card.ts` — card-to-journal bridge
- `src/api/routes/journal-entries.ts` (Phase 6) — three view variants
- `src/governance/visibility-matrix.ts` (Phase 6) — redaction rules
- `tests/acceptance/g5-hipaa-redaction.test.ts` (Phase 7) — 12 mandatory T1-T12

### G6 — D0Lite Implementation Patches
- `src/types/safety.ts` — safety trigger types
- `src/types/voice.ts` — voice signal types (stubbed; locked)
- `src/resolver/signals/signal-7-voice.ts` (Phase 3) — voice stub with banner
- `src/api/routes/safety-trigger.ts` (Phase 6) — safety endpoint
- `tests/acceptance/g6-safety-escalation.test.ts` (Phase 7) — 8 mandatory MW-T1..MW-T8

### G7 — PAC-ISE-002 Effort Formula Sync
- `src/computation/effort-score.ts` (Phase 4) — references G1 as canonical authority
- `src/resolver/signals/signal-6-trajectory.ts` (Phase 3) — uses G1 formula

---

## Reading order for new contributors

If you're new to BariAccess and want to understand the architecture:

1. **G1 first** — establishes the foundational measurement model (Timestamp, Mood, Effort)
2. **G2 second** — establishes the composite scoring and cascade architecture
3. **G3 third** — wires slot states to Resolver signals (depends on G2)
4. **G6 fourth** — establishes safety escalation + voice lockdown rules
5. **G5 fifth** — establishes HIPAA redaction at the API boundary
6. **G4 sixth** — Aurora KPI calibration (independent of others)
7. **G7 seventh** — housekeeping wrap, ensures Effort formula is consistent across canon

---

## Audit history

A senior-engineer audit pass on 2026-05-03 verified that the scaffold's implementation of G1–G7 matches the patches' specifications. Six canon-implementation deviations were found and corrected (none in G1–G7 themselves; all in upstream interpretation by the scaffold). Full audit record in Phase 7 `CHANGELOG-AUDIT-2026-05-03.md`.

---

## Authority

These patches were authored by Val (CEO, clinical lead) with Claude (Anthropic) as scribe, on 2026-05-02. Approved in chat on 2026-05-03. Formal canon-archive elevation pending.

For canon questions: route to Val. Not to Claude. Not to Zakiy's discretion.
