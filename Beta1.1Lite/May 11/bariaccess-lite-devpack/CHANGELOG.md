# BariAccess Lite Dev Pack — Changelog

## v0.1.2 — 2026-05-09 (founder-locked, all CLAUDE-FLAGs resolved)

All 5 CLAUDE-FLAGs from v0.1.0 resolved and locked by founder (Dr. Valeriu E. Andrei MD) on May 9, 2026. See `DECISIONS.md` for full rationale per flag.

| Flag | Resolution | Code change |
|---|---|---|
| 1 | **Bidirectional** `\|drift\| ≥ 2 bpm` | `GLP1_RHR_DRIFT_BPM_THRESHOLD = -2` → `GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM = 2`; annotation builder describes direction (rise/drop) and magnitude |
| 2 | **120 days** early phase | `GLP1_EARLY_PHASE_DAYS = 90` → `120` (matches semaglutide full titration) |
| 3 | **BBS > Withings > Garmin** | provider priority adds `'bbs'` for `weight`/`body_fat`/`body_bone_mass`/`body_mass_index`; new BBS-only metrics `body_skeletal_muscle_mass`, `body_visceral_fat_area`, `body_segmental_lean_mass` |
| 4 | **Confirmed** Eastman/Terman +90 min | No code change; `DEFAULT_ADVANCE_OFFSET_MIN = 90` cleared of flag comment |
| 5 | **Defer** reconciliation | `reconcileBridge` always returns `current_adjustment_per_day` unchanged; new `deferred: true` field; `prediction_error` still captured for future-formula audit trail |

After lock: `npm run typecheck` clean, `npm test` reports **141 of 141 passing** (was 133/133 at v0.1.1; 8 new tests cover bidirectional GLP-1 logic and deferred reconciliation behavior).

DECISIONS.md document version bumped to 0.2 with explicit "ALL DECISIONS LOCKED. No CLAUDE-FLAGs remain open" status line.

---

## v0.1.1 — 2026-05-09 (post-integrity-review fixes)

Fixes from `npm install && npm run typecheck && npm test` self-review:

1. **Typecheck blocker**: `packages/shared/src/types/index.ts` was re-exporting `BeaconBand` (and other enums) with `export type {...}`, which masked the runtime numeric enum at the public surface. Backend code that uses `BeaconBand.LIGHT_ORANGE` (a value) failed `isolatedModules`. Fixed by removing the redundant re-export from `types/index.ts` — the package barrel already re-exports from `enums/index.ts` directly, preserving runtime values.
2. **Test signature drift in `tests/v4-glp1.test.ts`**: `getGLP1Status` was called with a flat `{ compound, start_date, dose_stable_since, reference_date }` shape, but the real signature is `{ profile: PatientProfileMin, on_date: string }`. Fixed: tests now match the canonical signature; added `baseline_reset_active` boundary tests.
3. **GLP1 fixtures shape mismatch**: `golden-cases.ts` used `dose_stable: boolean` but the canonical `GLP1Status` type has `dose_stable_since: string | null` + `baseline_reset_active: boolean` + `dose_current: string | null`. Fixed: fixtures now match the canonical type.
4. **SMA glucose CV test fixture**: `GLUCOSE_OVERNIGHT_VARIABLE.cv_percent = 13.2` fell inside the same "optimal" band (<15%) as the stable case, so the test "variable lowers SMA" was tautological. Bumped variable CV to 22.0 (in the "moderate" band, score 0.5) — the legitimate diabetic-CGM "out of target" discriminator.
5. **Root workspace script ordering**: `npm test` and `npm run typecheck` ran on all workspaces in parallel without ordering, so `@bariaccess-lite/backend` couldn't resolve `@bariaccess-lite/shared` (which compiles to `dist/` first). Fixed: root scripts now build shared, then run backend's test/typecheck. Single `npm install && npm test` works cleanly from a fresh clone.

After fixes: `npm run typecheck` clean, `npm test` reports **133 of 133 passing** across 7 test files.

### Recommendation for follow-up

The current `tsconfig.json` excludes `tests/`, so test-side type drift (Issue 2/3 above) is not caught at typecheck time. Suggest adding a `tsconfig.spec.json` that includes tests and a `npm run typecheck:tests` script, so future test-fixture drift fails CI rather than runtime.

---

## v0.1.0 — 2026-05-09 (Initial Lite delivery for Zakiy)

This dev pack ships the **R&R_Lite scoring engine**: 3 composites (SRC, SBL, AMP) of the eventual 8, computed via canon-preserving weight redistribution so the migration to full R&R is a one-line change.

---

### What's in the box

**Scoring layer (math)**
- 9 sub-scores: SQI, SRI, SNS, CIR, SMA, RSI, EPC, MVI, LSR
- 3 composites: SRC (Sleep & Recovery), SBL (Stress & Burden), AMP (Activity & Movement)
- 1 headline: R&R_Lite = 0.35·SRC + 0.35·SBL + 0.30·AMP (computed via redistribution)
- Beacon 7-band asymmetric piecewise mapping (§6.2 verified by tests)
- W₇ kernel (λ=0.30, 7-day exponential weighting)
- CI-M (ChronoMuscle) and CI-C (RhythmRun) indices feeding EPC

**Provenance & degradation**
- Personal baselines (28-day rolling, μ/σ, log-transform for HRV)
- Path A (Z-score) and Path B (bounded) score paths
- Carry-forward (Pass 0 Spec 4): Day 0 → 1.00, Day 1 → 0.85, Day 2 → 0.65, Day 3 → 0.40, Day 4+ → EXPIRED
- Behavioral Bridge (Pass 0 Spec 5): 7-day cap, 3 pts/day default adjustment, EWMA reconciliation
- Provenance: VALIDATED / PENDING_VALIDATION / UNKNOWN_METHOD with strict §3.6 enforcement

**Spike API integration**
- 8-wearable provider priority table (HRV: oura > polar > garmin > apple)
- Libre glucose normalizer with overnight CV computation (anchored bedtime+30min → wake-30min)
- Ingest adapter scaffold

**V4 modifiers**
- GLP-1 status resolver (active, days_on, dose_stable)
- RHR-drift annotation (active && days_on < 90 && drift ≤ -2 bpm)
- Light therapy adherence scoring (10000 lux, 15 min, +90 min CBTmin offset default)
- 5 annotation builders + composer

**ISE bridge**
- Two-lane Lane 1 read-only consumer
- ISE state reader with default fallback to ISE-1
- Vault tables (TS-002–TS-010) drop in without code change

**API**
- Express factory, /health endpoint
- /api/scores/today/:user_id, /by-date, /range
- /api/sleep, /api/stress, /api/activity drilldowns
- Reads NEVER recompute (per Pass 0)

**Storage**
- One new Cosmos container: `score_daily_rollup` (partition `/user_id`, doc `{userId}:{date}`)
- Read containers spec aligned with WOOZ_COSMOS_CONTAINERS.md (no schema changes)

**Jobs**
- Nightly orchestrator scaffold with adapter interface for Cosmos

**Tests (vitest)**
- beacon.test.ts — band resolution + piecewise §6.2 boundaries (all 7 bands)
- degradation.test.ts — redistribution canon-preservation, carry-forward, bridge, reconciliation
- scoring.test.ts — sub-score golden cases (SQI/SRI/SNS/CIR/SMA/RSI/EPC/MVI/CI-M/CI-C/W₇)
- composites.test.ts — SRC/SBL/AMP including anchor-missing cases
- rr-lite.test.ts — headline integration; 0.35/0.35/0.30 verification
- lsr-warmup.test.ts — Day 1/13/14/27/28 boundary verification
- v4-glp1.test.ts — annotation builders + composer

---

### CLAUDE-FLAGs requiring founder verification before lock

These five points were chosen by Claude based on canon + standard practice; you and the biostatistics team must confirm or override before final lock.

1. **CLAUDE-FLAG-1**: GLP-1 RHR drift threshold = -2 bpm. Eli Lilly (semaglutide / tirzepatide) data shows -2 to -4 bpm typical in early phase; -2 chosen as conservative attach point.
2. **CLAUDE-FLAG-2**: GLP-1 early phase = 90 days. Common literature window for dose titration + physiological adaptation; reset point per CCO-V1V4-REFFRAME-001 §4.5.
3. **CLAUDE-FLAG-3**: BBS body composition priority = withings > garmin (vs. the wearable HRV/RHR priorities which favor oura). Withings preferred for clinical-grade body comp; Garmin fallback only.
4. **CLAUDE-FLAG-4**: Light therapy default = 10000 lux × 15 min × 07:00 fixed for first 14 days, then advance protocol with CBTmin offset of +90 min. Eastman/Terman 2014 standard.
5. **CLAUDE-FLAG-5**: Behavioral Bridge reconciliation = EWMA over absolute prediction error, alpha=0.3, clamped to [0.5, 6.0] points/day. Pass 0 Spec 5 specifies "refined per user via reconciliation" without a formula; this is Lite v1's default.

---

### Known gaps (not blockers for Zakiy's smoke test)

- Vault state tables (TS-002–TS-010) are stubbed; weight modulator returns ISE-1 defaults
- LUNARA / women's health metrics not in scope
- Inner Circle S has its own pipeline; not part of R&R_Lite
- 5 remaining R&R composites (MBC, MEI, BCI, CRC, BHR) are not implemented; subset migration path is in place

---

### Friday May 10 — Acceptance criteria for Val

- [ ] `npm test` passes (all suites green)
- [ ] Spike API smoke test: pull 1 user's last 7 days of HRV from oura
- [ ] Libre glucose flow: confirm overnight CV computes for 1 sample night
- [ ] DECISIONS.md reviewed; 5 CLAUDE-FLAGs confirmed or overridden

---

## [0.1.3] — 2026-05-11 — UI Pack v0.1.0 LOCKED

### Added

**New workspace: `@bariaccess-lite/ui`** — implements CCO-LITE-BETA-UI-001 v1.0 (Lite Beta UI/UX Canon).

Stack (matches backend conventions where applicable):
- **Build:** Vite 5 + React 18 + TypeScript (ESM)
- **State:** Zustand 4 with localStorage persistence on `abaStore` and `qStore`
- **Data fetching:** TanStack Query 5 for backend bindings (TODO swap to fetch in production if SSR ever added)
- **Styling:** Tailwind 3 + custom theme tokens in `src/theme/palette.ts`
- **Icons:** lucide-react (matches simulation JSX)
- **Tests:** Vitest 1 with jsdom (matches backend test convention)

Files added: **67 source / config / test files** under `packages/ui/`.

Surfaces implemented (per §3 Surface Inventory):
- Constellation Panel — 5-row architecture with Signal Bar / Crown, Ollie's Space, AI Playground, Daily Pulse
- Rhythm Board — HRV card, Educational card, Memory Snap (TBD slot), Signal Board, Program card (paginated)
- Routine Bookshelf — 16-segment AM/MID/PM with mOrange deferred state
- WorkPad — half-screen JotForm container (§5 Step 3a)
- Q + Parking Lot + Three Dots archive (§3 + §5)
- Overlays — JotFormPrompt, ReminderPicker (ONE CHANCE badge), CardOverlay, ParkingCounter

Flows implemented:
- §5 JotForm 6-step state machine — full lifecycle from Announce → WorkPad/Defer → ONE CHANCE picker → Parking Lot → 72h archive
- §6 Dual AI Evening Protocol — Ollie introduces ABA, owl dims when ABA active
- §8 Day-1 Onboarding spine — 6 steps with advance / skip / completion tracking

Screens:
- `SimulationScreen` — 12-step day-in-the-life walkthrough (ported from CCO-LITE-BETA-UI-001 simulation JSX)
- `MainScreen` — production composition wired to backend `/api/scores/today/:user_id`
- `QScreen` — Q + Parking Lot tabs
- `ArchiveScreen` — Three Dots view

Backend integration:
- TanStack Query hooks bind real backend endpoints from v0.1.2
- Stub adapters (`src/api/adapters.ts`) for JotForm submission, Q persistence, ABA profile, Memory Snap — each marked `TODO (backend):` with the planned URL

### Locked constants (cannot change without canon update)

- `ABA_POOL` — 13 entries; Max/Atlas/Athos LOCKED, #4–#13 TBD per §9
- `JOTFORM_NO_ANSWER_TIMEOUT_MS = 50_000` (§5 Step 3c)
- `PARKING_LOT_RETENTION_MS = 72 * 60 * 60 * 1000` (§5 Step 5)
- `REMINDER_OPTIONS_MS` — 30 min / 1 hour / never (§5 Step 4)
- `DAILY_PULSE_ORDER` — FAB · ITB · BEACON · ROUTINE · PROD · PARK
- `CROWN_ORDER` — R&R · Healthspan · My Blueprint · Inner Circle
- `VOICE.ANNOUNCE = "You got the message."` (§5 — never Outlook-flavored)
- `VOICE.PROMPT = "You got it — are you ready — yes or no?"` (§5 Step 2)
- `VOICE.EVENING_INTRO(name) = "Let me bring [name]."` (§6)
- `VOICE.ABA_DAY_1` — Day 1 ABA message text locked

### Tests

7 vitest files, ~30 assertions across:
- §2 Expression Color states (6) + 7 Beacon bands
- §5 JotForm 6-step flow including ONE CHANCE enforcement (second `pickReminder` is no-op)
- §6 Dual AI handoff content + ABA name interpolation
- 72h Parking Lot expiry + countdown formatting
- Q inbox add / read / unread count
- ABA store + canon-locked constants

### Open items (deferred to v0.1.1 of UI pack)

- Memory Snap content rules (TBD by Val per §9)
- ABA names #4–#13 (TBD by Val)
- Evening ambience trigger hour (TBD by Val)
- 13-name selection UI: dropdown vs carousel (TBD by Val + Zakiy pre-launch)
- Accountability Score patient-facing display (deferred to later canon)
