# BariAccess Lite Beta — UI Implementation Guide

**For:** Val (founder) + Zakiy (lead developer)
**Pack:** `bariaccess-lite-devpack-2026-05-11-ui-v0.1.0.tar.gz`
**Canon:** CCO-LITE-BETA-UI-001 v1.0 LOCKED
**Target launch:** Biohackers World NYC — June 27, 2026

---

## How to use this document

Each phase has two roles:

- **🩺 Val** = what you (founder) confirm or decide. No code action.
- **💻 Zakiy** = what gets typed into a terminal or editor.

Work through the phases in order. Don't skip. If a step fails, stop and surface it — every phase has a verification step.

---

## Phase 0 — Prerequisites (one-time)

**🩺 Val:** No action.

**💻 Zakiy:**

1. Install Node.js **20 LTS or later**. Verify:
   ```bash
   node --version    # should print v20.x or higher
   npm --version     # should print 10.x or higher
   ```
2. Have a modern terminal (Terminal.app on Mac, or any).
3. Have a code editor — Cursor recommended (matches Val's stack), VS Code also fine.
4. Save the tarball somewhere you'll remember:
   ```
   ~/bariaccess/bariaccess-lite-devpack-2026-05-11-ui-v0.1.0.tar.gz
   ```

**Verify:** Both `node` and `npm` print versions. Move to Phase 1.

---

## Phase 1 — Extract the pack

**🩺 Val:** No action.

**💻 Zakiy:**

```bash
cd ~/bariaccess
tar -xzf bariaccess-lite-devpack-2026-05-11-ui-v0.1.0.tar.gz
cd bariaccess-lite-devpack
```

You should now have this structure:

```
bariaccess-lite-devpack/
├── package.json               ← root (manages 3 workspaces)
├── README.md
├── CHANGELOG.md
├── DECISIONS.md
└── packages/
    ├── shared/                ← types, enums, schemas
    ├── backend/               ← scoring engine + Express API
    └── ui/                    ← the new Lite Beta UI (this pack adds)
```

**Verify:**
```bash
ls packages          # should list: shared, backend, ui
```

---

## Phase 2 — Install + run the simulation (~10 min)

**Goal:** See the 12-step day-in-the-life walkthrough working in a browser.

**🩺 Val:** Stand next to Zakiy. You're about to see the simulation we built together.

**💻 Zakiy:**

```bash
# 1. Install all 3 workspaces — one command from root
npm install
# (takes ~45 sec; installs 358 packages)

# 2. Build the shared types package first (UI depends on it)
npm run build --workspace=@bariaccess-lite/shared

# 3. Start the dev server
npm run dev:ui
```

Vite will print something like:
```
  VITE v5.4.21  ready in 312 ms
  ➜  Local:   http://localhost:5173/
```

**Open** `http://localhost:5173/` in Chrome or Safari.

**🩺 Val confirms:**

- [ ] Simulation screen loads with a phone-shaped frame
- [ ] You can step through 12 steps using the **Next** / **Back** buttons
- [ ] Step 1 shows "Good morning. Day is open."
- [ ] Step 2 shows the 🔵 Blue "are you ready — yes or no?" overlay
- [ ] Step 6 shows the orange cascade rim on the R&R tile
- [ ] Step 10 shows the dual AI bubble (Ollie owl + ABA "M" icon, owl dimmed)
- [ ] Step 12 shows white night mode

If anything in the checklist is wrong → stop. Tell Claude.

**🩺 Val:** Try switching the ABA name selector at the bottom (Max / Atlas / Athos). Confirm the bubble text updates to use the chosen name.

---

## Phase 3 — Verify all tests pass (~5 min)

**🩺 Val:** This is the audit trail. Every locked canon rule has a test backing it.

**💻 Zakiy:**

```bash
# From repo root
npm run test
```

Expected output (last lines):

```
✓ tests/jotform-flow.test.ts  (7 tests)
✓ tests/canon-constants.test.ts  (11 tests)
✓ tests/theme.test.ts  (7 tests)
✓ tests/parking-lot.test.ts  (3 tests)
✓ tests/q-inbox.test.ts  (3 tests)
✓ tests/dual-ai.test.ts  (5 tests)
✓ tests/aba-store.test.ts  (4 tests)

Test Files  7 passed (7)
     Tests  40 passed (40)
```

Plus backend: **141 / 141** passing (no regression from v0.1.2).

**🩺 Val confirms:** All 40 UI tests pass + all 141 backend tests pass.

---

## Phase 4 — Tour the codebase (~30 min, Zakiy reads, Val listens)

**💻 Zakiy:** Open these files in this order. Each one is the entry point for a concept.

| # | File | What it owns |
|---|---|---|
| 1 | `packages/ui/src/canon/constants.ts` | 13-ABA pool, 50-sec timeout, 72h window, locked voice lines, Crown/Pulse order |
| 2 | `packages/ui/src/theme/palette.ts` | §2 Expression Color Code (6 states) + Beacon bands |
| 3 | `packages/ui/src/state/jotformStore.ts` | §5 JotForm 6-step state machine |
| 4 | `packages/ui/src/flows/jotFormFlow.ts` | Orchestrates timers + cross-store coordination |
| 5 | `packages/ui/src/flows/dualAIEveningFlow.ts` | §6 Ollie-introduces-ABA pattern |
| 6 | `packages/ui/src/screens/SimulationScreen.tsx` | The 12-step walkthrough — full demo |
| 7 | `packages/ui/src/screens/MainScreen.tsx` | Production composition with TanStack Query backend wiring |
| 8 | `packages/ui/src/api/adapters.ts` | Stub adapters — each one marks where backend wiring is owed |

**🩺 Val:** You don't need to read code. Ask Zakiy:

1. "Where does the 50-second JotForm timeout live?" → He should point to `canon/constants.ts`.
2. "Show me where ABA names #4–#13 will go once I name them." → `canon/constants.ts`, `ABA_POOL` array, entries with `status: 'TBD'`.
3. "When backend adds the JotForm submission endpoint, what one file changes?" → `api/adapters.ts`, `JotFormSubmissionAdapter.submit()`.

If Zakiy can't answer any of those → he needs another pass through the tour.

---

## Phase 5 — Wire to real backend scores (~15 min)

**Goal:** Replace the demo simulation with live backend data.

**🩺 Val:** You'll see real scores flow into the Crown tiles.

**💻 Zakiy:**

1. Open a **second terminal**. Build and start the backend:
   ```bash
   cd ~/bariaccess/bariaccess-lite-devpack
   npm run build --workspace=@bariaccess-lite/backend
   # TODO: backend ships routers but no serve entry — Zakiy adds a 10-line serve.ts
   #       that imports createApp() and calls app.listen(3000).
   #       See packages/backend/src/api/app.ts for the createApp() factory.
   ```

2. Once backend is on port 3000, the UI dev server (on 5173) auto-proxies `/api/*` calls.

3. In the UI, click **Main** in the top-right nav. The R&R tile should now pull from `GET /api/scores/today/demo-user`.

**🩺 Val confirms:**

- [ ] Main screen loads
- [ ] R&R tile shows a number (or `—` if no data yet seeded)
- [ ] No red errors in browser console

If the R&R tile shows `—` → backend has no data for `demo-user` yet. That's expected for an empty rollup container. Zakiy seeds test data using the backend's rollup_writer.

---

## Phase 6 — Replace the 4 stub adapters (later, not Day 1)

These are the backend endpoints owed before public launch. Each is a single-file swap in `packages/ui/src/api/adapters.ts`.

| Adapter | Stub uses | Real endpoint (TODO) |
|---|---|---|
| `JotFormSubmissionAdapter` | `localStorage` | `POST /api/jotforms/:id/submissions` |
| `QPersistence` | `localStorage` | `GET/POST /api/q/:userId` |
| `AbaProfile` | `localStorage` | `GET/PUT /api/users/:userId/aba` |
| `MemorySnap` | empty array | Memory Snap content rules — **TBD by Val first** |

**🩺 Val:** Three of the four are pure backend work (Zakiy + backend). The fourth (Memory Snap) needs your content definition before any code can be written.

---

## Phase 7 — Resolve §9 Open Items (before launch)

These are blocked on **Val's decisions**, not code:

| # | Item | Status |
|---|---|---|
| 1 | Memory Snap definition + video content | 🩺 Val owes |
| 2 | ABA names #4–#13 (10 names) | 🩺 Val owes |
| 3 | Evening ambience trigger hour | 🩺 Val owes |
| 4 | 13-name selection UI (dropdown vs carousel) | 🩺 Val + 💻 Zakiy decide together |
| 5 | Accountability Score patient-facing visibility | 🩺 Val (deferred to later canon — not Lite Beta blocker) |

When each is decided, Val tells Claude. Claude updates the canon doc + Zakiy updates the constants file. Single source of truth: `packages/ui/src/canon/constants.ts`.

---

## Daily commands (for ongoing dev)

```bash
# Start UI dev server (hot reload)
npm run dev:ui

# Run all tests (UI + backend)
npm run test

# Typecheck only — catches mistakes before running
npm run typecheck

# Production build — verify deployable
npm run build
```

---

## Where to find what

| You need to… | File |
|---|---|
| Change a §2 color value | `packages/ui/src/theme/palette.ts` |
| Add an ABA name (when Val names them) | `packages/ui/src/canon/constants.ts` → `ABA_POOL` |
| Change JotForm timeout from 50 sec | `packages/ui/src/canon/constants.ts` → `JOTFORM_NO_ANSWER_TIMEOUT_MS` |
| Add a Daily Pulse tracker | `packages/ui/src/canon/constants.ts` → `DAILY_PULSE_ORDER` + `DailyPulse.tsx` |
| Replace a stub with real backend | `packages/ui/src/api/adapters.ts` (4 TODOs marked) |
| Add a new screen | New file in `packages/ui/src/screens/` + add route to `App.tsx` |
| Read the canon source | `CCO-LITE-BETA-UI-001_v1_0_LOCKED.md` (sent separately, May 11) |

---

## Audit trail — what's locked vs. open

**LOCKED v1.0** (cannot change without canon update + Val approval):

- 6 Expression Color states (§2)
- 13-pool ABA structure (§4) — names #1–#3 locked, #4–#13 are TBD slots
- 6-step JotForm flow (§5)
- ONE CHANCE reminder rule (§5 Step 4)
- 72-hour Parking Lot retention (§5 Step 5)
- Archive label "incomplete" — never "delinquent" (§5 Step 6)
- Voice lines: "You got the message." · "You got it — are you ready — yes or no?" · "Let me bring [ABA]." · Day 1 ABA message
- §6 Dual AI Protocol — Ollie always introduces, ABA never alone
- Crown 4-tile order + Daily Pulse 6-tile order
- Document Canon v2 headers (BariAccess LLC only, Val as President, sole author)

**OPEN (per canon §9):**

- Memory Snap content (Val)
- ABA names #4–#13 (Val)
- Evening ambience trigger hour (Val)
- Selection UI: dropdown vs carousel (Val + Zakiy)
- Accountability Score patient visibility (deferred)

---

## Support

- **Architecture / canon questions** → Claude (in BariAccess Master Hub chat)
- **Build errors / npm issues** → Zakiy first, Claude as fallback
- **Product decisions / canon updates** → Val (founder, sole canon author)

---

*BariAccess LLC · Confidential — Internal Use Only · © 2026 BariAccess LLC.*
*Document version: 1.0 · Date: May 11, 2026 · Author: Valeriu E. Andrei, MD, President · Assistant Editor: Claude*
