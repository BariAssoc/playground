# BariAccess Lite — Developer Pack

**For:** Zakiy Manigo, Lead Software Developer
**From:** Valeriu E Andrei MD, President, BariAccess LLC
**Date:** May 9, 2026
**Status:** Drop-in TypeScript scaffolding for Sleep, Stress, Activity, R&R_Lite scoring

---

## What this pack is

A drop-in monorepo covering the four user-facing scores for the Lite version of the app:

- **Sleep** card → SRC composite (Sleep & Recovery Composite)
- **Stress** card → SBL composite (Stress & Burden Level)
- **Activity** card → AMP composite (Activity & Movement Performance)
- **Headline** → R&R_Lite (`0.35·SRC + 0.35·SBL + 0.30·AMP`)

Every formula is locked to canon (Pass 0/1/2/3 + Beacon Canon v1.1 + ISE Canon v3.0 + V1V4 Reframe). No invented numbers.

## What this pack is NOT

- **Not** a deployable app. You wire it into your existing repo / auth / deployment.
- **Not** an ingestion layer. Spike webhook + 15-min timer already write `normalized_data` and `raw_data` per `WOOZ_COSMOS_CONTAINERS.md`. This pack consumes those.
- **Not** the full R&R pyramid. This is the 3-composite Lite subset. See `DECISIONS.md` §16 for migration path.

## How to use this pack

1. **Read `DECISIONS.md` first.** Every Lite design choice is cited there back to canon section number. If anything in code disagrees with `DECISIONS.md`, the doc wins.
2. **Run the test suite.** `cd packages/backend && npm install && npm test`. Every formula has worked-example tests pulled from Pass 3 ranges. If they pass, the math matches canon.
3. **Wire to existing Cosmos.** Containers consumed: `normalized_data`, `raw_data`, `workout_sessions`, `user_environment` (chronotype), `user_mood`, `FABResponses`, `FABSessions`. One new container required: `score_daily_rollup` — provision via existing `npm run provision-rr-containers` pattern in `bariaccess-note-ingest`.
4. **Wire the API.** Routers are Express. Mount `/api/scores` in your existing app. Drop the React tile components from `packages/frontend` into the Constellation Panel Row 1.
5. **Schedule the nightly job.** `node dist/jobs/nightly-rr-lite.js` at 02:00 ET cohort-local time. Pre-computes everything; reads NEVER recompute (per CCO-FAB-001-PIN-001).

## CLAUDE-FLAGs

`DECISIONS.md` ends with 5 flagged items where Claude could not trace a number cleanly to canon. **Resolve those with Val before merging to main.** Search code for `CLAUDE-FLAG-` to find call sites.

## Source documents this pack is built from

- `RR-Calculation-Canon-Pass0_v1_1_LOCKED.md` — universal rules every formula obeys
- `RR-Calculation-Canon-Pass1_v1_1_LOCKED.md` — composite formulas (R&R, SRC, SBL, AMP)
- `RR-Calculation-Canon-Pass2_v1_1_LOCKED.md` — CI Layer (CI-M, CI-C used)
- `RR-Calculation-Canon-Pass3_v1_1_LOCKED.md` — sub-score formulas (SQI, SRI, SNS, CIR, SMA, RSI, EPC, MVI, LSR)
- `Beacon_Canon_v1_1.md` — 7-band asymmetric architecture, piecewise linear mapping
- `ISE_Canon_v3_0_Canonical.md` — state authority, two-lane (Lane 1 weight modulation)
- `CCO-V1V4-REFFRAME-001_v1_0.md` — dual reference frame rule, baseline reset events
- `spike_metrics_coverage_analysis.md` — empirical V1 metric availability per provider
- `WOOZ_COSMOS_CONTAINERS.md` — production data architecture

## Friday May 10 deliverable to Val

Within 24h of receiving this pack:
1. Confirmation that `npm test` passes locally
2. Spike API smoke test for one cohort patient: `GET /api/scores/today/:user_id` returns four scores with bands
3. Confirmation Libre `glucose` field is flowing into `normalized_data` for at least one Libre-connected patient

## Questions

If anything is unclear, ping Val directly. Don't guess. Don't hallucinate. Per founder standing instruction.

---

*BariAccess LLC — Confidential — Internal Use Only*
*© 2026 BariAccess LLC. All rights reserved.*

---

## UI Package (added v0.1.3 — May 11, 2026)

The `@bariaccess-lite/ui` workspace implements **CCO-LITE-BETA-UI-001 v1.0** (Lite Beta UI/UX Canon).

### Quick start

```bash
# From repo root
npm install
npm run dev:ui            # Starts Vite dev server on http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:3000` (the backend Express app). Start the backend in a second terminal:

```bash
npm run build --workspace=@bariaccess-lite/backend
node packages/backend/dist/serve.js     # If a serve.js entry exists; see backend README
```

### Routes (hash-based, no router dependency)

| Route        | Screen              | Purpose                                                                     |
|--------------|---------------------|-----------------------------------------------------------------------------|
| `/` (default) | `SimulationScreen` | 12-step day-in-the-life walkthrough — best demo path                        |
| `#main`      | `MainScreen`        | Production composition wired to backend `/api/scores/today/:user_id`        |
| `#q`         | `QScreen`           | Q inbox + Parking Lot tabs                                                  |
| `#archive`   | `ArchiveScreen`     | Three Dots archive of expired JotForms                                      |

Switch routes via the floating nav in the top-right.

### File layout

```
packages/ui/
├─ src/
│  ├─ theme/        palette, typography, tokens     (§2 + Beacon band colors)
│  ├─ canon/        constants.ts                    (§4 13-pool, §5 timing, §3 ordering)
│  ├─ types/        ui.ts                           (JotForm, Q, DualAI types)
│  ├─ components/   atomic React primitives         (Ollie/ABA icons, ExpressionBubble, PhoneFrame)
│  ├─ surfaces/     ConstellationPanel · RhythmBoard · RoutineBookshelf · WorkPad · Inbox · Overlays
│  ├─ state/        Zustand stores                  (expression, jotform, aba, parkingLot, q)
│  ├─ flows/        Multi-step orchestrators        (§5 JotForm 6-step, §6 Dual AI evening, §8 Day-1)
│  ├─ hooks/        TanStack Query bindings         (useTodayScores, useDrilldown, etc.)
│  ├─ api/          client.ts · scores.ts · adapters.ts (stubs for backend-pending endpoints)
│  └─ screens/      MainScreen · QScreen · ArchiveScreen · SimulationScreen
└─ tests/           vitest — theme, jotform-flow, dual-ai, parking-lot, q-inbox, aba-store, canon-constants
```

### Integration guide for Zakiy

**1. Real backend wiring is already done** for the four endpoints the backend v0.1.2 ships:
- `/api/scores/today/:user_id` → `useTodayScores(userId)`
- `/api/sleep/:user_id` → `useSleepDrilldown(userId)`
- `/api/stress/:user_id` → `useStressDrilldown(userId)`
- `/api/activity/:user_id` → `useActivityDrilldown(userId)`

**2. Stub adapters (`src/api/adapters.ts`)** for endpoints the backend does NOT yet expose. Each one has a `TODO (backend):` comment showing the planned URL. Replace `localStorage` calls with `api.get`/`api.post` once the backend lands.

- `JotFormSubmissionAdapter.submit()` → `POST /api/jotforms/:id/submissions`
- `QPersistence.{load,save}()` → `GET/POST /api/q/:userId`
- `AbaProfile.{load,save}()` → `GET/PUT /api/users/:userId/aba`
- `MemorySnap.list()` → Memory Snap content rules TBD by Val (§9 Open Items)

**3. State stores** use Zustand. To read in any component:

```tsx
import { useJotFormStore } from '@/state/jotformStore';
const items = useJotFormStore((s) => s.items);
```

**4. Flows** (in `src/flows/`) coordinate multiple stores. Don't bypass them — call `announceJotForm()`, `acceptNow(id)`, etc. so timers and expression state stay in sync.

**5. Open items per canon §9** that need product input before launch:

- Memory Snap content (Val)
- ABA names #4–#13 (Val — currently labeled "TBD #4" through "TBD #13")
- Evening ambience trigger hour (Val)
- 13-name selection UI: dropdown vs carousel (Val + Zakiy pre-launch)
- Accountability Score patient-facing exposure (deferred to later canon)

### Tests

```bash
npm run test --workspace=@bariaccess-lite/ui
```

Coverage:
- **theme.test.ts** — §2 Expression Color states + 7-band Beacon palette
- **jotform-flow.test.ts** — §5 6-step state machine including ONE CHANCE enforcement
- **dual-ai.test.ts** — §6 Ollie-introduces-ABA, Day 1 message content
- **parking-lot.test.ts** — 72h expiry + countdown formatting
- **q-inbox.test.ts** — Q add / mark read / unread count
- **aba-store.test.ts** — name + voice persistence
- **canon-constants.test.ts** — locked timing, ordering, voice lines
