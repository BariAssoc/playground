# BariAccess Lite — Design Decisions Log

**Document Type:** Audit log of every Lite design choice
**Author:** Valeriu E Andrei MD, President — via Claude (executive coder, this conversation)
**Date:** May 9, 2026
**Status:** 🟡 DRAFT — Pending Founder + Exec-Biostat lock signature
**No Hallucination Standard:** Every decision below cites either (a) a canon document section, or (b) an explicit founder override in this conversation.

---

## What this document is

This is the single audit-defensible record of every choice Lite makes that differs from, simplifies, or scopes-down full canon. Zakiy reads this first. Future-Val reads this when he forgets why a weight is 0.35. An external biostat reviewer reads this when validating a manuscript. If a code file's behavior disagrees with this document, **this document wins** and the code is wrong.

Every decision has the same shape: **What was decided · What canon says · Why Lite differs (if at all) · Who authorized.**

---

## Decision 1 — Score scope

**Decided:** Lite ships exactly four user-facing scores: Sleep, Stress, Activity, and R&R_Lite.

**Canon mapping (Pass 1 §R&R, lines 17-25):**
- Sleep card → **SRC** (Sleep & Recovery Composite)
- Stress card → **SBL** (Stress & Burden Level)
- Activity card → **AMP** (Activity & Movement Performance)
- Headline → **R&R_Lite** (re-normalized R&R subset)

**Why this mapping:** SRC's Orange Dot Message in Pass 1 §SRC is *"Your SLEEP needs attention."* SBL's is *"Your STRESS is elevated."* AMP's is *"Your ACTIVITY needs attention."* The composite-to-card mapping is canon's own user-facing language, not a Lite invention.

**Authorized:** Founder, this conversation, May 9, 2026 — *"Only 3 and the lite R&R."*

---

## Decision 2 — R&R_Lite weights

**Decided:** `R&R_Lite = 0.35·SRC + 0.35·SBL + 0.30·AMP`

**Canon source (Pass 1 §R&R Spec 1):** Master R&R weights are SRC 0.14 / SBL 0.14 / AMP 0.12 (among 8 composites totaling 1.0).

**Derivation:** `0.14 + 0.14 + 0.12 = 0.40`. Re-normalize each over 0.40:
- SRC: 0.14 / 0.40 = 0.350
- SBL: 0.14 / 0.40 = 0.350
- AMP: 0.12 / 0.40 = 0.300

**Why canon-preserving (not equal thirds):** Canon weights reflect locked clinical judgment (Pass 1 v1.1, May 4 2026). Equal thirds (0.33/0.33/0.34) would erase the clinical signal that Recovery substrates (sleep, stress) carry slightly more weight than Readiness output (activity) in healthspan optimization. Canon-preserving makes Lite a strict mathematical subset of full R&R — when the remaining 5 composites ship, every patient's headline migrates seamlessly without a "we re-weighted mid-program" disclosure.

**Implementation rule:** Do NOT hardcode `{ SRC: 0.35, SBL: 0.35, AMP: 0.30 }` anywhere. Use `redistributeWeights(['SRC','SBL','AMP'], RR_WEIGHTS)` from the master `RR_WEIGHTS` table in `packages/shared/src/constants/rr-weights.ts`. This guarantees Lite migrates to full R&R with zero code changes.

**Authorized:** Founder, this conversation, May 9, 2026 — *"0.35/0.35/0.30 canon-preserving."*

---

## Decision 3 — Naming and field strictness

**Decided:** The headline score is named `R&R_Lite` (UI) and `rr_lite` (code). NEVER `R&R` or `rr`. Provenance metadata on every score doc carries `composite_subset: ['SRC','SBL','AMP']` so audit trail is self-documenting.

**Canon source:** ISE Canon v3.0 §17 Principle 2 — *"Trained by state, not physiology."* Naming discipline is part of state authority — patients and providers must always know whether they're seeing a partial-pyramid Lite score or full canonical R&R.

**Migration rule:** When the remaining 5 composites (MBC, MEI, BCI, CRC, BHR) ship and `composite_subset.length === 8`, the field name flips to `rr` and the UI badge "Lite" disappears. This is a config-driven event, not a math change.

**Authorized:** Senior dev recommendation accepted, this conversation, May 9, 2026.

---

## Decision 4 — V1+V2+V3+V4 all available

**Decided:** Lite assumes all four V-streams are live — V1 (wearables via Spike), V2 (FABs and QMQN per WOOZ_COSMOS_CONTAINERS.md FAB and QMQN families), V3 (chronotype from BETA-JF-BASELINE-001), V4 (ITBs, GLP-1 status, light therapy protocol).

**Canon source:** CCO-V1V4-REFFRAME-001 §3.3 Property 2 (Universality) — *"The rule applies to every variable in every domain — V1, V2, V3, V4 — without exception."*

**What this unlocks vs Spike-only:**
- **EPC** runs full canon `max(CI-M, CI-C) × performance_aggregate` (Pass 3 §13). No Lite proxy. CI-M and CI-C use full TAF × RQ × W₇ kernel.
- **CIR** LightExposurePattern (15%) computes from V4 light therapy adherence log, not ambient sensor.
- **SMA** GlucoseStability (30%) computes from Libre overnight CV via Spike API.
- **SNS** SubjectiveSatisfaction (20%) computes from FAB-SLEEP daily rating.
- **RSI** SubjectiveRecovery (30%) computes from FAB-RECOVERY daily rating.
- **MVI** Movement_patterns (35%) computes from FAB-ACTIVITY pattern tagging.

**Authorized:** Founder, this conversation, May 9, 2026 — *"we will have all V1 V2 V3 and V4."*

---

## Decision 5 — Libre CGM via Spike

**Decided:** Abbott FreeStyle Libre glucose readings ingest through Spike API into `normalized_data` (Cosmos), keyed `{userId}:{date}`. No parallel LibreView OAuth adapter.

**Canon source for the math:** Pass 3 §SMA GlucoseStability ranges (Wave 3-Bio, May 5 2026) — Optimal CV ≤15%, Good 15-20%, Moderate 20-25%, Poor 25-30%, Insufficient >30%. Source: Hall 2018 CGM patterns; overnight glycemic variability literature.

**Implementation rule:** `glucose-stability.ts` reads from `OvernightGlucoseSeries` abstraction. Series builder lives in `spike/glucose-normalizer.ts`. Gap detection: any ≥30-minute gap in overnight series flags the night as `provenance: 🟡 Pending validation` for that night. Overnight window defined as bedtime + 30min through wake - 30min, anchored to V1 sleep timestamps.

**SMA degrades naturally if a given night has no glucose data** (e.g. sensor change day): weight redistribution per Pass 0 Spec 4 across the remaining EatingWindow + LastMealGap. Patient cohort therefore tolerates Libre warm-up days and sensor-change days without breaking the score.

**Authorized:** Founder, this conversation, May 9, 2026 — *"yes Libre"* + *"we are connected to libre through spike API."*

---

## Decision 6 — Light therapy protocol (advance, V4-modeled)

**Decided:** Bright light therapy (10,000 lux, Abbott-style timed exposure) is modeled in V4 as a clinically prescribed protocol per patient. Default strategy: **advance protocol**, `cbtmin_offset_minutes: +90` (Eastman / Terman protocol — light ~1.5h after estimated CBTmin, which advances phase).

**Why advance protocol:** Bariatric population skews late-chronotype (post-surgical sleep architecture disruption, GLP-1 melatonin onset effects). Uniform morning bright light at a fixed clock time would *worsen* phase delay in delayed-phase patients per Czeisler phase response curve (light before CBTmin delays, after CBTmin advances). Per-chronotype indexing avoids harm and matches published light-therapy literature.

**Canon source for CIR consumption:** Pass 3 §CIR LightExposurePattern (Wave 1A) — Optimal: morning ≥15 min, evening dim ≥80%, daylight total ≥60 min. Source: Czeisler entrainment work; Blume et al. 2019; West et al. 2011.

**Schema (V4 LightTherapyProtocol):**
```ts
{
  user_id: string,
  prescription: {
    lux: number,                    // default 10000
    duration_minutes: number,       // default 15
    timing_strategy: 'fixed' | 'chronotype_indexed' | 'cbtmin_offset',
    fixed_time?: 'HH:MM',           // when timing_strategy = 'fixed'
    cbtmin_offset_minutes?: number, // +90 default for advance protocol
  },
  prescribed_by: string,            // staff_id
  prescribed_at: string,            // ISO
  protocol_version: string,         // e.g. 'advance_protocol_v1'
  active: boolean,
  override_reason?: string,
}
```

**Uniform fallback (warmup):** For patients in days 1-14 (chronotype baseline not yet stable) OR patients who haven't completed MEQ at intake: default to `timing_strategy: 'fixed'`, `fixed_time: '07:00'` local, lux 10000, duration 15 min. Provenance flag = 🟡 *Pending validation* until chronotype lock at Day 14.

**51/49 governance:** System SUGGESTS chronotype-indexed protocol to provider after Day 14 chronotype lock. Provider LOCKS the actual prescription. System never auto-changes prescription mid-program without provider sign-off. Per ISE Canon v3.0 §17 Principle 9 (Two-lane authority).

**Authorized:** Founder, this conversation, May 9, 2026 — *"Advanced protocol."*

---

## Decision 7 — GLP-1 V4 modeling

**Decided:** GLP-1 status is a V4 (interventional) field on patient profile, not derived. Provider-entered at clinical intake. Carried through to score documents as `v4_modifiers` metadata.

**Schema:**
```ts
{
  glp1_active: boolean,
  glp1_compound: 'semaglutide' | 'tirzepatide' | 'liraglutide' | 'other' | null,
  glp1_start_date: ISO date | null,
  glp1_dose_current: string | null,
  glp1_days_on: number | null,      // computed: today - start_date
}
```

**Math impact:** ZERO. RSI, SQI, every other sub-score uses the same formula whether or not the patient is on GLP-1.

**Annotation impact (provider-facing only):** When `glp1_active && glp1_days_on < 90` AND `RestingHR_trend` component shows ≤ -2 bpm vs baseline, the RSI score document attaches a provider annotation: *"RHR trend in early GLP-1 phase typically reflects medication-driven baseline reset (-2 to -4 bpm), not necessarily training adaptation. Personal baseline rebuilds at 28 days post-dose-stable per CCO-V1V4-REFFRAME-001 §4.5."* This is a flag on the score doc — it does NOT change the number.

**Personal baseline reset (Canon source: CCO-V1V4-REFFRAME-001 §4.5):** GLP-1 initiation OR dose change triggers a **baseline reset event** for V1 metrics affected (RHR, HRV, weight trend, sleep duration). The 28-day rolling window restarts from the dose-stable date. During the reset window, scores carry provenance `🟡 Pending validation` until the new 28-day window completes.

**Frame B status:** CCO-V1V4-REFFRAME-001 §3.2 lists *"GLP-1 adherence rate"* as a Frame B candidate (published cohort data exists). Lite v1 ships the **scaffolding** (cohort_n counter, statistical adequacy thresholds per §6.5) but Frame B is **OFF** by default until §6.6 cohort transition event is founder-locked.

**Authorized:** Founder, this conversation, May 9, 2026 — *"Few patients will be on GLP1 meds."*

---

## Decision 8 — LSR warmup (14-day INSUFFICIENT gate)

**Decided:** LSR returns `INSUFFICIENT` when `days_with_training_load_data < 14`. Day 14 is the earliest day LSR can return PARTIAL. Day 28 is the earliest day LSR can return FULL. AMP composite recomputes during LSR warmup with weight redistribution.

**Canon source (Pass 3 §LSR Spec 4):**
```
FULL:        28 days training load history + HRV/RHR (5+ days) + strain signals
PARTIAL:     14-27 days load history → partial chronic load
INSUFFICIENT: <14 days load history OR no strain signals
```

**Pass 3 §LSR Spec 6 confirms MUST:** *"Training load tracking (14+ days history)."*

**Why the canon draws this line (Pass 3 §LSR):** ACWR is `Acute (7-day) / Chronic (28-day)`. The Gabbett 2016 sweet-spot framework (`ACWR 0.8-1.3 = Optimal`) is validated against a 28-day chronic baseline. Computing ACWR with a shorter chronic window distorts the ratio — false overreaching flags trigger when comparison window is too tight.

**AMP behavior during LSR warmup:**

| Days active | LSR | AMP formula | Provenance |
|---|---|---|---|
| 1-13 | INSUFFICIENT | `0.57·EPC + 0.43·MVI` (redistributed: 0.40/0.70 and 0.30/0.70) | 🟡 Pending validation |
| 14-27 | PARTIAL | `0.40·EPC + 0.30·MVI + 0.30·LSR_partial` | 🟡 Pending validation |
| 28+ | FULL | `0.40·EPC + 0.30·MVI + 0.30·LSR` | ✅ Validated |

**UI behavior:** Card rim is dashed (PARTIAL state per Pass 0 Spec 4) during days 1-13. Tooltip: *"Activity load tracking matures at Day 14."* Solid rim from Day 14 onward; provenance flag flips to ✅ Validated at Day 28.

**Authorized:** Canon-derived (no founder override required). Confirmed in conversation, May 9, 2026.

---

## Decision 9 — Personal baseline window

**Decided:** Path A normalization (Z-score for physiological metrics) uses a **28-day rolling personal baseline** per CCO-V1V4-REFFRAME-001 §4. Lite ships with a **7-day warmup window** during which scores compute with whatever baseline is available, flagged 🟡 *Pending validation*. From Day 28 onward, full personal baseline locks and provenance flips to ✅ Validated.

**Canon source:** CCO-V1V4-REFFRAME-001 §4.4 *"Update Cadence"* and §3.6 provenance flag pattern. Beacon Canon §7 — Path A pipeline is `(x - μ_28d) / σ_28d`.

**During warmup (Day 1-27):**
- Z-score uses available data (`min(days_active, 28)` window)
- Scores still produced — no INSUFFICIENT just because baseline immature
- Provenance flag = 🟡 Pending validation
- Provider dashboard shows "Baseline maturing — Day N of 28" badge

**Baseline reset events (per §4.5):** Any of these triggers a fresh 28-day window:
- GLP-1 initiation or dose change
- Major surgery (bariatric or other)
- Documented illness >7 days
- Travel >5 timezones for >7 days
- Pregnancy / postpartum
- Provider-initiated reset (free-text reason required)

**Implementation lives in:** `packages/backend/src/baseline/personal-baseline.ts`.

**Authorized:** Canon-derived (CCO-V1V4-REFFRAME-001 §4 already locked).

---

## Decision 10 — Provider priority for V1 multi-source merge

**Decided:** When multiple wearable providers deliver the same metric for the same `{userId}:{date}`, use this priority:

| Metric | Priority order | Rationale |
|---|---|---|
| HRV (`hrv_rmssd`) | Oura > Polar > Garmin > Apple > Withings | Per `spike_metrics_coverage_analysis.md`, Oura/Polar/Garmin all deliver `hrv_rmssd`; Apple delivers `hrv_sdnn` (different metric); Withings doesn't deliver. |
| Sleep stages (deep/REM) | Oura > Polar > Garmin > Apple > Withings | Apple delivers only `sleep_duration_total`, `sleep_duration_light`, `sleep_duration_awake` per coverage doc — gaps Deep + REM. Oura/Polar/Garmin deliver full staging. |
| Resting HR (`heartrate_resting`) | Oura > Garmin > Apple > Polar > Withings | Polar coverage doc shows `heartrate_resting` MISSING; demote. |
| Sleep timestamps (bedtime/wake) | Oura > Polar > Garmin > Apple > Withings | All deliver, Oura/Polar most precise per provider docs. |
| Activity (steps, calories, intensity duration) | Garmin > Oura > Polar > Apple > Withings | Garmin delivers `duration_active`, `duration_moderate_intensity`, intraday epochs (15-min) per coverage doc. |
| SpO2 | Garmin > Oura > Apple > Polar > Withings | Polar doesn't deliver `spo2`; demote. |
| Glucose | Libre (via Spike) — sole source | No competing providers. |
| Body composition (weight, body_fat, BMI) | Withings > Garmin (Phase 1 BBS planned) | Withings is the dedicated body-comp scale. |

**Canon source:** Beacon Canon §13 *"Data Resilience Model (5 Pathways)"* establishes the principle of multi-source resilience. Specific priority is derived from the empirical metric availability documented in `spike_metrics_coverage_analysis.md` and is **honest to that doc** — no provider is given priority for a metric they don't actually deliver.

**Implementation:** `packages/backend/src/spike/provider-priority.ts` exposes `pickPrimary(metric, normalizedDoc) → { value, source, source_priority_rank }`. Source identity flows into score document `metric_sources` field for provenance.

**Authorized:** Senior dev derivation from coverage doc, May 9, 2026.

---

## Decision 11 — Behavioral Bridge cap (7-day)

**Decided:** When V1 metrics expire (per Pass 0 Spec 4 carry-forward 1.00/0.85/0.65/0.40/EXPIRED), V2 (FAB) data activates as Behavioral Bridge per Pass 0 Spec 5. Maximum bridge duration = **7 days**. After 7 days without V1 return, score drops to INSUFFICIENT regardless of V2 availability.

**Canon source:** Pass 0 Spec 5 — *"Maximum bridge duration: 7 days. After 7 days without V1, score drops to INSUFFICIENT regardless of V2."*

**Bridge formula:**
```
BRIDGE_SCORE = Last_Known_V1 + (V2_Direction × Adjustment × Days_Since)
  V2_Direction: +1 (improving), 0 (stable), -1 (declining) — derived from FAB completion trend
  Adjustment:    3 points/day default, refined per user via reconciliation
  Days_Since:    days since last V1 reading (capped at 7)
```

**Reconciliation (when V1 returns):** Per Pass 0 Spec 5 reconciliation table — adjust `Adjustment` factor per user based on bridge accuracy. Implementation in `packages/backend/src/degradation/behavioral-bridge.ts`.

**Visual:** Bridged scores show dashed rim + "B" icon per Pass 0 Spec 5. Score doc carries `bridged: true` + `bridge_source_fabs: [...]`.

**Authorized:** Canon-derived (no founder override).

---

## Decision 12 — ISE weight modulation (Lane 1 read-only)

**Decided:** Lite scoring engine reads `ise-current-state` Cosmos container (per PAC-ISE-004 naming) as a Lane 1 input. ISE state modulates **composite weights only** (not band thresholds, not the math itself). Default weights documented above are the **ISE-1 (Aligned/Available) set**.

**Canon source:** ISE Canon v3.0 §3.1 Two-Lane Authority — Lane 1 ISE owns scoring weight modulation. Beacon Canon §16 dynamic weighting principle. Pass 1 §R&R note — *"The weights above are the default (ISE-1) set. Other ISE states use weight sets defined in ISE Canon v3.0 and vault."*

**Lite implementation:** `packages/backend/src/ise-bridge/weight-modulator.ts` reads ISE state, applies state-specific weight set if defined, falls back to ISE-1 default. Vault weight tables (TS-002–TS-010) are NOT shipped in Lite — those are trade-secret. Lite ships the modulation hook so when vault tables drop in, no code changes.

**ISE state precedence:** A score nightly compute job samples ISE state at compute time (not at sub-score time). One ISE state per nightly run per patient. State changes between runs do not retro-modulate prior scores.

**Authorized:** Canon-derived (ISE Canon v3.0 already locked).

---

## Decision 13 — Provenance flag on every value

**Decided:** Every V1/V2/V3/V4 value entering the engine carries a mandatory provenance flag per CCO-V1V4-REFFRAME-001 §3.6:

- ✅ **Validated method** — collection method known, documented, compatible with reference frame.
- 🟡 **Pending validation** — collection method recorded but compatibility not yet formally validated.
- ❌ **Unknown method** — collection method not recorded; value MUST NOT be used in either Frame A or Frame B until provenance resolved.

**Lite policy:** Score docs aggregate per-input provenance into a composite-level `provenance_summary` field. If ANY input is ❌ Unknown, the sub-score returns INSUFFICIENT and writes `provenance_failures: [...]`. If ANY input is 🟡 Pending, sub-score computes but rolls up to 🟡 at composite level. All ✅ → composite is ✅.

**Authorized:** Canon-derived (CCO-V1V4-REFFRAME-001 §3.6 already locked).

---

## Decision 14 — Storage strategy

**Decided:** Lite reuses existing production Cosmos containers per `WOOZ_COSMOS_CONTAINERS.md`:

- **Reads:** `normalized_data` (Spike daily merged), `raw_data` (per-vendor archive for HRV provenance), `workout_sessions` (per-workout), `user_environment` (V3 chronotype), `user_mood`, FAB families (`FABResponses`, `FABSessions`), QMQN families.
- **Writes:** ONE new container — `score_daily_rollup`, partition `/user_id`, doc id `{userId}:{date}`. Holds nightly-computed sub-scores, composites, R&R_Lite, bands, provenance, degradation states, V4 modifiers, ISE state at compute time. Per Pass 0 architecture (CCO-FAB-001-PIN-001) — pre-compute everything, reads NEVER recompute.

**Wiring:** `packages/backend/src/storage/containers.ts` defines the spec, no code in Lite creates the container — Zakiy provisions via existing `npm run provision-rr-containers` pattern in `bariaccess-note-ingest`.

**Authorized:** Senior dev derivation from existing infrastructure, May 9, 2026.

---

## Decision 15 — What Lite does NOT ship

For audit clarity, the following items from full canon are **explicitly out of scope** for Lite v1:

- The remaining 5 composites: MBC, MEI, BCI, CRC, BHR (Pass 1 §4-9 — not used in Lite math).
- The remaining 16 sub-scores beyond the 9 used (Pass 3 sub-scores 7-12, 16-25 — not computed).
- 4 of the 6 CI indices: CI-P, CI-S/CS², CI-T, CI-N (Pass 2 §3-6 — not computed; CI-M and CI-C compute because they feed EPC).
- Frame B cohort comparison (CCO-V1V4-REFFRAME-001 §5 — scaffolding only, off by default).
- Vault weight tables for ISE states 0, 2, 3, 4, 5, 6 (TS-002–TS-010 — Lite uses ISE-1 defaults regardless of resolved state, and logs a `ise_modulation_skipped: true` flag when state ≠ ISE-1).
- Bridge reconciliation calibration UI (Pass 0 Spec 5 reconciliation runs in nightly job; calibration tuning UI deferred).
- Day 11 / Day 28 trend report generators.
- Disengagement detection (BETA-FORMULA-001 §9 — different scoring layer; if you want Lite to inherit disengagement from beta dev pack, Zakiy can wire it in.)

**Authorized:** Founder, this conversation, May 9, 2026 — *"Only 3 and the lite R&R."*

---

## Decision 16 — When and how Lite migrates to full R&R

**Decided:** Migration path is mechanical, not architectural. Five steps:

1. The remaining 5 composite scorers ship (MBC, MEI, BCI, CRC, BHR — separate dev packs per composite or as a single full-canon pack).
2. Add their composite IDs to `composite_subset` array in `score_daily_rollup` writes.
3. `redistributeWeights(composite_subset, RR_WEIGHTS)` returns canonical 8-composite weights automatically.
4. Field name flips from `rr_lite` to `rr` based on `composite_subset.length === 8`.
5. UI badge "Lite" is config-driven on `composite_subset.length`; auto-disappears at 8.

**Zero code changes in scoring engine. Zero re-validation.** The R&R_Lite formula IS the R&R formula evaluated with weight redistribution over a 3-composite subset.

**Authorized:** Senior dev architectural commitment, May 9, 2026.

---

## CLAUDE-FLAGs — RESOLVED & LOCKED (2026-05-09 by Founder)

All 5 flags confirmed by Dr. Valeriu E. Andrei MD (Founder/CEO, BariAccess LLC) on May 9, 2026, after Claude's literature search disclosed a directional concern on Flag 1. No flags remain open.

### FLAG-1 — GLP-1 RHR drift threshold → **LOCKED: bidirectional `|drift| ≥ 2 bpm`**

**Resolution:** Founder selected **Option C — bidirectional magnitude check.**

**Rationale:** Published literature (PMC12918571 meta-analysis, March 2026; Tashko clinical review) consistently shows GLP-1 receptor agonists *raise* resting heart rate by 2-4 bpm as a class effect (semaglutide ~2-3 bpm, tirzepatide ~2 bpm, liraglutide ~2.4 bpm, with some patients showing rises of 10+ bpm). However, in the BariAccess post-bariatric + GLP-1 cohort, rapid weight loss can drive opposite RHR drops via reduced cardiovascular load. Either direction in early phase is therefore medication-confounded and not a clean training-adaptation signal.

**Implementation:**
- `GLP1_RHR_DRIFT_MAGNITUDE_THRESHOLD_BPM = 2` (replaces former `GLP1_RHR_DRIFT_BPM_THRESHOLD = -2`)
- `shouldAttachRHRAnnotation`: `Math.abs(rhr_drift_bpm) >= 2`
- Annotation text now describes direction (rise/drop) and magnitude explicitly

### FLAG-2 — GLP-1 early-phase window → **LOCKED: 120 days**

**Resolution:** Founder confirmed 120 days.

**Rationale:** Matches semaglutide full titration window (16 weeks per FDA label) and covers tirzepatide mid-titration. Replaces the prior 90-day conservative default which would have ended mid-titration.

**Implementation:** `GLP1_EARLY_PHASE_DAYS = 120`.

### FLAG-3 — Body composition provider priority → **LOCKED: BBS > Withings > Garmin**

**Resolution:** Founder confirmed sequencing.

**Rationale:** BBS (Biometric Barista Station, clinical-grade segmental BIA, InBody-class equipment) provides the gold-standard anchor when readings are taken at clinic visits. Withings home scale fills daily continuity. Garmin wrist-based BIA is fallback. BBS-only segmental measurements (skeletal muscle mass, visceral fat area, segmental lean mass) are reserved to BBS exclusively — consumer scales don't deliver them.

**Implementation:**
- `weight`, `body_fat`, `body_bone_mass`: `['bbs', 'withings', 'garmin']`
- `body_mass_index`: `['bbs', 'garmin']` (Withings doesn't deliver BMI)
- `body_skeletal_muscle_mass`, `body_visceral_fat_area`, `body_segmental_lean_mass`: `['bbs']` only

### FLAG-4 — Light therapy `cbtmin_offset_minutes: +90` → **LOCKED: confirmed (clinical default)**

**Resolution:** Founder confirmed the Eastman/Terman published default. Pamela Posner RD (Master Barista, clinical lead) to ratify in clinical SOP review; founder lock holds for code/algorithm purposes.

**Implementation:** `DEFAULT_ADVANCE_OFFSET_MIN = 90` unchanged from v0.1.0; documentation cleared of flag.

### FLAG-5 — Behavioral Bridge per-user reconciliation → **LOCKED: deferred for Lite v1**

**Resolution:** Founder selected **defer reconciliation.** Lite v1 always uses `BRIDGE_DEFAULT_ADJUSTMENT_PER_DAY = 3.0` per Pass 0 Spec 5 canon.

**Rationale:** Per-user refinement requires ≥30 days of bridge-then-V1-return cycles before it can produce statistically meaningful updates. The BariAccess production cohort will not have accumulated this data until late summer 2026. Shipping a heuristic now risks locking it into UX, audit logs, and provider expectations before Exec-Biostat has specified the canonical refinement formula.

**Implementation:**
- `reconcileBridge` function preserved as integration point
- Captures `prediction_error` for audit trail (so per-user data accumulates for future formula specification)
- Returns `new_adjustment_per_day === current_adjustment_per_day` always
- New `deferred: boolean` field in `ReconcileResult` marks Lite v1 behavior; flips to `false` when reconciliation is enabled in a future version

---

## Document control

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1 | 2026-05-09 | Initial draft from this conversation | Claude (executive coder) under founder direction |
| 0.2 | 2026-05-09 | All 5 CLAUDE-FLAGs resolved and LOCKED by founder. Code, tests, and constants updated to match. v0.1.2 tarball ships with zero open flags. | Founder (Val) + Claude |

**Status:** ALL DECISIONS LOCKED. No CLAUDE-FLAGs remain open. v0.1.2 ready for Zakiy.

---

*BariAccess LLC — Confidential — Internal Use Only*
*© 2026 BariAccess LLC. All rights reserved.*
