# BARIACCESS™ — DEVELOPER WORKING DOCUMENT

## Phase 1 Lite — Practice Edition (GLP-1 Vertical) Spec

**DOCUMENT ID:** DEV-WORK-D0LITE-001
**VERSION:** v0.3 — WORKING DRAFT
**STATUS:** OPEN FOR DEVELOPER INPUT
**AUTHOR:** Valeriu E. Andrei, MD | President
**ASSISTANT EDITOR:** Claude (Anthropic) — drafting only, not authoring
**TO:** Zakiy Manigo, Lead Developer
**DATE:** May 2, 2026
**SUPERSEDES:** v0.2 (May 1, 2026 PM)

**REFERENCE PATIENT:** Mark (52M, 18 months post-RYGB, Core tier, Oura Ring Gen 3, tirzepatide) — SPG-001 Patient 1

© 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.

---

## §1. PURPOSE & SCOPE CHANGE FROM v0.2

Zakiy — v0.2 was a Practice Edition reframe locked May 1. Since then (May 2), three foundational canons + one architectural addendum were locked that change how PE Phase 1 must be built:

- **CCO-FAB-001 v2.0 Pass 1** — FAB Canon architectural reset (7 families, Task/Silent visibility, Universal FAB Definition)
- **CCO-FAB-CANDIDATE-001 v1.0** — Open FAB Candidate Detection Algorithm (always-active across conversations)
- **CCO-JOUR-DEF-001 v1.0** — Journal Architectural Definition Canon (two-layer model, 13 architectural rules, anchor revision mechanism)
- **CCO-RR-PYRAMID-ADD-001 v1.0** — R&R Pyramid Canon Addendum (Pyramid + Ground Levels architecture; 4-tile connected lock)

### What changed from v0.2

| Section | v0.2 said | v0.3 says |
|---|---|---|
| FAB family classification | Generic "FAB family" reference | **7 named families** (Activity, Metabolic, Circadian, Cognitive, Behavioral, Social, Identity-Fusion) |
| FAB visibility | Not classified | **Task FAB / Silent FAB** classification per FAB v2.0 §3 |
| Named FABs | Not tagged | **FAB-HUNGER™, FAB-CHRONOTYPE-CHECK™, FAB-NAP™, FAB-SOCIAL-JET-LAG™, FAB-NUTRITION™, FAB-HYDRATION™, FAB-MEDICATION™, FAB-SLEEP™** explicitly tagged |
| Journal architecture | Generic "scope narrowed" | **Two-Layer Architecture** referenced — Layer 1 collection always full, Layer 2 display narrow for PE Phase 1 |
| Journal rules | Not referenced | **R-1 through R-13** referenced; R-7 Mesh thread error corrected |
| Anchor + Revision | Not mentioned | **D0 Anchor rows** revisable via Ollie decision |
| Voice + Tone | Not mentioned | **D0 Pamela call** → Journal Layer 1 (Fireflies.ai, HIPAA consent flow) |
| Mesh threads | Listed as "Phase 2 toggle" ❌ | **Removed from toggle list** — Mesh threads emerge from BDG pipeline, not a feature |
| Reference patient | Not named | **Mark** named as PE reference patient |
| Mental Wellbeing safety | Not flagged | **Safety escalation flow** flagged as PE blocker |
| Lab display | "Healthspan PRESS → All Metrics" (wrong framing) | **Healthspan Tile 2 → Ground Levels (horizontal swipe)** — corrected per Pyramid Addendum |
| Pyramid + Ground Levels | Not addressed | **§16 Addendum** — 4-tile connected architecture locked |
| Related Canon | 10 docs | **16 docs** (added FAB v2.0, FAB Candidate, Bookend, R&R Inventory, Dynamic Profile, Pyramid Addendum) |

---

## §2. THE TIMESPAN PROGRESSION MODEL (UNCHANGED FROM v0.2)

| Tile | Active Window | Clinical Anchor | What patient sees |
|---|---|---|---|
| **R&R** | Day 0–7 | First week of medication, baseline build | Daily readiness scores, HRV, hunger score |
| **Healthspan** | Day 7–30 | Lab results return, cardiorisk, body composition | Trends, lab data, risk panel |
| **My Blueprint** | Day 30–60+ | Trend projection window | Forward trend modeling, 30/45/60-day projections |
| **Inner Circle** | ❓ TBD by Val | (existing canon stands) | (no change) |

**Key principle:** unlocks are **time-locked + event-confirmed.** Clock starts at D0; unlock fires when clinical event also lands.

### Open questions (Val to lock)

- **OQ-T1:** Healthspan unlock at Day 7 hard, or wait for labs even if labs are late?
- **OQ-T2:** Blueprint window — Day 30 or Day 45?
- **OQ-T3:** Inner Circle — keep visible at D0, or also time-locked?

---

## §3. WHAT DOES NOT CHANGE (UNCHANGED FROM v0.2)

| Element | Status |
|---|---|
| Two-surface architecture (Rhythm Board + Constellation Panel) | ❌ NEVER TOUCH |
| Signal Bar — 4 tile slots | ❌ NEVER TOUCH |
| Daily Pulse — 6 tracker slots | ❌ NEVER TOUCH (slot count fixed; content configures) |
| Routine Bookshelf | ❌ NEVER TOUCH |
| Expression Layer rules | ❌ NEVER TOUCH |
| **51/49 WorkPad / AI Playground — full-size, all elements** | ❌ NEVER TOUCH **(Zakiy override accepted)** |
| Two distinct WorkPads (Program + 51/49) | ❌ NEVER TOUCH |
| Beacon 7-band system | ❌ NEVER TOUCH |
| Header structure | ❌ NEVER TOUCH |
| Morpheus | ❌ Stays static — no breathing/expression |

---

## §4. THE THREE PRINCIPLES (UNCHANGED FROM v0.2)

1. **Canon stays.** Practice Edition is a configuration, not a rewrite.
2. **D0 = quietest state.** Patient sees minimum needed to start.
3. **Unlocks are celebrations.** Each tile / card / tracker activation is a moment.

---

## §5. PROPOSED PRACTICE EDITION D0 STATE — STRUCTURE (LIGHT UPDATE)

### Rhythm Board

| Element | Practice Edition D0 | Current build |
|---|---|---|
| Header | No change | Same |
| Routine Bookshelf | No change — full canonical, Pamela introduces, **FAB-CHRONOTYPE-CHECK™ (Circadian, Task) integrated early** | Same |
| Card 1 (top) | HRV card (R&R-linked), full width | HRV + Educational side-by-side |
| Card 2 | **Hidden until Day 7 / Healthspan unlock — then connects to lab results** | Always visible |
| Memory Snap | Hidden until first photo/journal added — **per Journal Canon §9 (R-6 Memory Lane peer; medical file routes to Pamela)** | Visible by default |

**Rationale for Card 2:** Card 2 is the **clinical reveal** of laboratory results when Healthspan opens. Patient sees: cardiorisk, body composition, FibroScan markers, longevity electives — displayed in **Healthspan ground levels** (per §16 addendum).

### Constellation Panel

| Element | Practice Edition D0 | Current build |
|---|---|---|
| Signal Bar — R&R | Active (Day 0–7), score visible, orange rim per cascade | Same |
| Signal Bar — Healthspan | **Locked until Day 7 + first lab return** — explicit lock indicator | Currently shown |
| Signal Bar — My Blueprint | **Locked until Day 30+** — explicit lock indicator | Currently shown |
| Signal Bar — Inner Circle | ❓ Val to decide (OQ-T3) | Currently shown |
| Tap on locked tile | Small message: "Opens at Day [X] — [clinical trigger]" | TBD |
| Ollie's Space | No change | Same |
| **51/49 WorkPad / AI Playground** | **NO CHANGE — full-size, all elements visible** | Same |
| Daily Pulse slots | See §6 — Practice configuration | See §6 |

---

## §6. DAILY PULSE — PRACTICE EDITION CONFIGURATION (UPDATED — FAB tags)

The 6 slots remain. Content configures for Practice Edition. **Each FAB now tagged with family + visibility per FAB Canon v2.0.**

| Slot | Practice Edition Role | FAB Family | Visibility |
|---|---|---|---|
| 1. **FAB** | **FAB-NUTRITION™ (Proteins) + FAB-HYDRATION™** | Metabolic | Task FAB ✅ |
| 2. **ITB** | Stays — Interventional Therapeutic Block | n/a (ITB level L4 attachment) | n/a |
| 3. **BEACON** | Secondary spider/radar view of off-pulses | n/a (Beacon ≠ FAB) | n/a |
| 4. **ROUTINE** | **FAB-ROUTINE™** (meta-FAB, gold border) | Identity-Fusion | Task FAB ✅ |
| 5. **PROD** | ❌ **Removed for Practice Edition** | (Cognitive — deferred) | n/a |
| 6. **PARK** | Simple parking for programs | n/a | n/a |

### Silent FABs running in background (NOT in Daily Pulse, NOT in Journal display)

Per FAB Canon v2.0 §3 — these run silently in Layer 1 of the Journal; Ollie reacts behind the scenes:

| Silent FAB | Family | Trigger |
|---|---|---|
| **FAB-SOCIAL-JET-LAG™** | Circadian | Computed nightly from weekday/weekend midsleep delta |
| Segment-Stabilizer FAB | (Wedge) | Triggered when Mark's segments change |
| Erosion-Prevention FAB | (Wedge) | Triggered when FAB-NUTRITION™ drift detected |
| Formation-Support FAB | (Wedge) | Triggered when new FAB forming (e.g., FAB-HUNGER™ Day 1) |
| Emergency-FAB | (Wedge) | Triggered by crisis/disruption |

### Open question (unchanged)

- **OQ-DP1:** PROD slot keep visible as locked placeholder, or compress to 5

---

## §7. BEACON MECHANIC (UNCHANGED FROM v0.2 — FAB tagging updated)

(Practice-Edition-only swipe-to-spider mechanic, OQ-B3 LOCKED.)

### Reinforcement engine (FAB connection — UPDATED tagging)

Per the May 1 call: **Task FABs** (FAB-NUTRITION™ proteins, FAB-HYDRATION™, FAB-MEDICATION™ for tirzepatide) reinforce daily what the ITB program corrected acutely. Beacon stays as a Daily Pulse rim until the underlying drift resolves over multiple days.

---

## §8. GLP-1 CONTENT LAYER — Practice Edition specific (UPDATED — FAB tags + lab display correction)

### Day 0–7 (R&R window)

- GLP-1 medication education (mechanism, expected effects)
- Drawback / side-effect education
- **FAB-HUNGER™** introduced from first injection (Metabolic family, Task FAB, Variable 0–10 scale)
- **Hunger Assessment** (HM-INTAKE-001 v1.0) tied to Routine Bookshelf — **becomes D0 Anchor row in Journal** (revisable per CCO-JOUR-DEF-001 §4)
- **FAB-CHRONOTYPE-CHECK™** assessment (Circadian family, Task FAB) — **also D0 Anchor row, revisable**
- **FAB-SOCIAL-JET-LAG™** computed silently (Circadian family, Silent FAB)

### Day 7–30 (Healthspan window) — UPDATED LAB DISPLAY

- Lab results displayed in **Healthspan Tile 2 → Ground Levels (horizontal swipe)** — per §16 Addendum
  - FibroScan (V1), body composition (V1 — InBody/SECA), cardiorisk, lipid panel, HbA1c, insulin (V1)
  - **Phase 1 simplification:** all labs in ONE deep Ground Level (single layer; expandable later as needs emerge)
  - Each lab = swipeable horizontal card within that level
  - **Pyramid (R&R Tile 1 only) does NOT contain individual labs** — pyramid holds aggregated composites + sub-scores (per Pyramid Addendum §2)
- Dose adjustment via AI interaction (7 or 9-day cadence — OQ-G3)
- AI bonding through accurate journaling
- Doctor's appointments displayed in **BOTH:**
  - **Calendar card** (future-facing, scheduling — Calendly integration per memory rule #29)
  - **Journal entry** (past-facing, sealed via Bookend after appointment — R-9)
  - Each entry retains both `calendarRefId` and `journalRefId`

### Day 30–60+ (Blueprint window)

- Trend projections in **My Blueprint Tile 3 → Ground Levels**
- Body composition trends, FibroScan trends, longevity electives — continuation of ground level architecture from Healthspan
- Mesh threads emerge from BDG pipeline (R-7) — not built; accumulates naturally
- Lifespan progression (slides in after Healthspan stabilizes)

### Open questions (unchanged)

- **OQ-G1:** Hunger Score scale + formula
- **OQ-G2:** Chronotype assessment method — single survey or longitudinal
- **OQ-G3:** Dose adjustment cadence — 7 vs 9 days

---

## §9. JOURNAL — Practice Edition scope (FULL REWRITE — synced to CCO-JOUR-DEF-001)

The full Journal canon (**CCO-JOUR-DEF-001 v1.0**) governs. Practice Edition Phase 1 is a **Layer 2 display scope narrowing** — Layer 1 collection remains FULL per canon.

### §9.1 Two-Layer Architecture in Practice Edition (per Journal Canon §3)

**Layer 1 — Collection (always FULL, even in Phase 1):**
- All R-3 filling mechanisms active (ITB, FAB, Ollie/AskABA Yes/No)
- Bookend timestamps from every segment
- Voice + tone capture from D0 first call onward (Pamela visit, Fireflies.ai)
- Memory Snaps
- Passive sensor data (HRV recovery, sleep stages from Oura)
- All Silent FABs running in background

**Layer 2 — Display (narrowed for Phase 1):**

| Layer 2 Display Category | Phase 1 Status |
|---|---|
| Medication tracking (FAB-MEDICATION™) | ✅ Active |
| Task FABs: FAB-NUTRITION™, FAB-HYDRATION™, FAB-ROUTINE™ | ✅ Active |
| FAB-HUNGER™, FAB-CHRONOTYPE-CHECK™ | ✅ Active |
| Doctor's appointments | ✅ Active |
| Memory Snap entries (when patient creates) | ✅ Active per R-6 |
| Memory Lane personal entries | ⏸️ Phase 2 display promotion |
| ~~Mesh thread populations~~ | ❌ **REMOVED** — Mesh threads EMERGE from BDG pipeline (R-7); they are not a toggle-able feature. |

**R-7 correction note:** v0.2 listed "Mesh thread populations" as Phase 2. This was a conceptual error per Journal Canon R-7. Mesh threads are pipeline output (V-stream → BDC → BDG → Mesh), not a feature flag.

### §9.2 Architectural Rules (R-1 through R-13) Active in Phase 1

All 13 rules from CCO-JOUR-DEF-001 §5 apply in Phase 1. Highlights for Zakiy:

| Rule | Phase 1 Implication |
|---|---|
| **R-1** First-class component | Journal is not optional UI element |
| **R-2** Two-Layer | Implement Layer 1 / Layer 2 separation in code |
| **R-3** Three filling mechanisms ONLY | ITB + FAB + Ollie/AskABA Yes/No are the only active fill paths |
| **R-4** Day/Night Envelope | Night Journal MUST exist — feeds R&R Pyramid composites |
| **R-7** Not a Mesh thread | Don't build a "Mesh thread builder" — Mesh emerges from pipeline |
| **R-8** One-card UX invariant | Patient sees ONE Journal card at a time at display layer |
| **R-9** Bookend-bounded | Every Journal entry wrapped by Warm-up + Cool-down Bookend |
| **R-10** Append-only | No deletion at architectural layer; updates create versions |
| **R-11** Programs may contain Journal entries | journalRefIds + programRefId both retained |
| **R-12** HIPAA inheritance | Entries inherit CPIE/CCIE classification from source mechanism |
| **R-13** Anchor + Revision | D0 Anchors revisable; Ollie owns update decision |

### §9.3 D0 Anchor Rows in Practice Edition (per Journal Canon §4)

| Anchor | Source | Captured by | Revisable? |
|---|---|---|---|
| Hunger Assessment | HM-INTAKE-001 v1.0 (pre-BBS) | Mark + Pamela | ✅ Yes (titration changes) |
| FAB-CHRONOTYPE-CHECK™ baseline | CAS quiz (5-question MEQ-based) | Mark + Pamela | ✅ Yes (28-day refinement) |
| Hunger Score baseline | Ollie's Day-1 conversation | Ollie + AskABA | ✅ Yes |
| Personality / Space classification | PC-CONVO-001 | Pamela | ✅ Yes (quarterly review) |
| Demographics (52M, RYGB date, tirzepatide start) | Intake form | Pamela | ❌ No (historical fixed) |

### §9.4 Voice + Tone Stream (per Journal Canon §8)

From D0 Pamela call onward, voice content + tone + patterns enter Layer 1.

**Phase 1 implementation:**
- Fireflies.ai integration (per memory rule #29)
- D0 patient consent flow MANDATORY before recording (HIPAA)
- Voice content may surface to Layer 2 transcript references
- Voice tone + patterns stay Layer 1 only (Ollie reads, patient does not see)

⚠️ **Blocker:** D0 consent flow language needs legal review before Phase 1 ship (Journal §8.7 OQ-VOICE-02).

### §9.5 Pre-Built Journal Content for Mark

Per memory rule #30 (Journal Entry Algorithm, April 24, 2026), 48 medication-related Journal rows are already built for Mark's tirzepatide journey using the 9-column structure:

```
# | Category | Entry | Question | Ollie→Mark(1st) | Ollie→Max | Max→Ollie | Ollie→Mark(2nd) | AskABA→Provider(hidden)
```

These rows are **ready for Phase 1 ship**. No new content build needed for Drugs & Medication category.

### §9.6 Mental Wellbeing Safety Escalation Flow (BLOCKER)

Per Journal Canon §12 OQ-PIPE-03: when sensitive Journal entries arise (suicidal ideation, severe depression markers, harm signals), routing must escalate per safety protocol. **This flow is NOT YET DEFINED.**

⚠️ **Phase 1 ship blocker:** Mental Wellbeing safety escalation flow MUST be defined before any patient-facing Journal capture goes live. Owner: Val + clinical team + legal.

### §9.7 What's Deferred to Phase 2

- Memory Lane display promotion (R-6 promotion mechanism active in Phase 1; UI surfacing of full Memory Lane = Phase 2)
- Anchor revision UI (Phase 1 = Ollie auto-update; Phase 2 = transparent patient notification)
- Voice tone scoring formula (Journal §8.7 OQ-VOICE-01)
- Voice content retention duration policy (OQ-VOICE-03)

### §9.8 Rationale (Val, May 1 + May 2, 2026)

> *"The journal has to be very discreet. And this will be about the medication and about the FAB at this point."* (May 1)
>
> *"Journal is really something which collects everything in one's routine. Routine goes 24/7."* (May 2)

The two-layer model resolves both: Layer 1 collection is FULL (24/7, complete) — Layer 2 display is DISCREET (medication + FAB + appointments). Same architecture, different surfacing volumes.

---

## §10. WHAT I'M ASKING YOU TO BUILD (UPDATED — Journal architecture additions + lab display + cascade rule)

| Build | Effort estimate |
|---|---|
| Practice Edition profile / configuration flag | Low |
| Timespan unlock engine (Day 0–7 / 7–30 / 30–60+) | Medium |
| Time-lock + clinical-trigger compound unlock logic | Medium |
| Lock visual treatment for Signal Bar tiles 2–4 | Low |
| Daily Pulse Practice Edition slot config (FAB family/visibility tagged) | Low |
| Beacon → Daily Pulse rim transition | Medium |
| Beacon Daily Pulse card stack: funnel + swipe-to-spider | Medium-High |
| **FAB-HUNGER™ capture + display (Variable, 0–10 scale)** | Medium |
| **FAB-CHRONOTYPE-CHECK™ assessment integration** | Medium |
| **FAB-SOCIAL-JET-LAG™ silent computation (nightly)** ⭐ NEW | Medium |
| **Healthspan Tile 2 Ground Levels — single deep layer for Phase 1 labs** ⭐ NEW | Medium |
| **My Blueprint Tile 3 Ground Levels — Phase 2 expansion** ⭐ NEW | Low (Phase 1 stub) |
| **Cascade rule: ground level orange → R&R pyramid composite orange** ⭐ NEW | Medium (per §16 addendum) |
| **Tile 4 (Inner Circle) downstream connection: programs → credits → tier → biohacker** ⭐ NEW | Medium (per §16 addendum) |
| **Journal Two-Layer Architecture (L1 collection / L2 display split)** ⭐ NEW | Medium-High |
| **D0 Anchor row stamping (Hunger Assessment, Chronotype Quiz)** ⭐ NEW | Low |
| **Voice + Tone stream capture (Fireflies.ai integration)** ⭐ NEW | Medium |
| **D0 consent flow UI** ⭐ NEW | Low (UI) + Legal blocker |
| **Mental Wellbeing safety escalation routing** ⭐ NEW | Medium (Val + clinical define logic) |
| Practice Edition Journal scope toggles (Layer 2 narrowing) | Low |
| Practice Edition vs full canon mode toggle (testing) | Low |

**Hard rule preserved:** unlock logic must be **coded / deterministic** (April 22, 2026 fortress rule).

### What you should NOT build

- ❌ Mesh thread builder (Mesh emerges from pipeline; never built directly)
- ❌ Anchor revision UI (Phase 2)
- ❌ Memory Lane full surfacing (Phase 2)
- ❌ Architecture changes
- ❌ AI Playground modifications
- ❌ Canon document changes
- ❌ R&R Pyramid structural changes (1+8+24 stays)

---

## §11. WHERE YOU HAVE FULL FREEDOM TO PUSH BACK (UNCHANGED + 1)

1. **Buildability of timespan engine** — feasible in 8 weeks before Biohackers NYC?
2. **Beacon Daily Pulse mechanic** — your gut, technically clean or messy?
3. **Hunger Score** — best UI capture method (slider, scale, conversational)?
4. **Chronotype** — best assessment integration with Routine Bookshelf?
5. **Sequence build order** — what should ship first to demo at Biohackers?
6. **Ground Level UI** — single deep layer or visual stack? (See §16 OQs) ⭐ NEW
7. **Anything else** — flag freely.

---

## §12. WHAT VAL OWES YOU BEFORE YOU START (UPDATED)

| # | Decision | Status |
|---|---|---|
| OQ-T1 | Healthspan hard unlock at Day 7 vs labs-arrived gating | Open |
| OQ-T2 | Blueprint window — 30 or 45 days | Open |
| OQ-T3 | Inner Circle — visible at D0 or time-locked | Open |
| OQ-DP1 | PROD slot — keep as locked placeholder or compress to 5 | Open |
| OQ-B1 | Beacon trigger biomarkers + thresholds | Open |
| OQ-B2 | Beacon-rim duration in Daily Pulse | Open |
| OQ-B3 | Beacon spider mechanic — Practice-only or full canon | ✅ **LOCKED — Practice-Edition-only** |
| OQ-G1 | Hunger Score scale + formula | Open |
| OQ-G2 | Chronotype assessment method | Open |
| OQ-G3 | Dose adjustment cadence — 7 vs 9 days | Open |
| OQ-1 | Lock icon visual treatment | Open (Val + Nikita) |
| OQ-2 | Unlock animation style | Open (Val + Nikita) |
| OQ-3 | Pamela's D0 script revision | Open (Val) |
| OQ-4 | Biohackers World NYC demo plan | Open (Val) |
| **OQ-JOUR-A-01** | Anchor revision threshold (Hunger pattern, Chronotype) | Open |
| **OQ-VOICE-02** | Voice consent flow language (legal review) | Open — **PHASE 1 BLOCKER** |
| **OQ-PIPE-03** | Mental Wellbeing safety escalation flow | Open — **PHASE 1 BLOCKER** |
| **OQ-FAB-V2-08** | Practice Edition GLP-1 vertical FAB subset confirmation | Open |
| **OQ-RR-01** | Night Journal data minimum threshold for valid composite | Open |
| **OQ-GLVL-PE-01** | Phase 1 Ground Level structure for Healthspan — single deep layer or numbered? | Open (defaulting to single deep layer for Phase 1) |
| **OQ-PYR-ADD-02** | Pyramid-to-ground gesture in R&R card — scroll, swipe, hidden? | Open |
| **OQ-PYR-ADD-04** | Ground Level numbering and naming (post-Phase 1) | Open |

**Recommended priority for closure:** T1, T2, B1, G1, G2, G3 (UI/clinical) + **OQ-VOICE-02 + OQ-PIPE-03** (legal/safety blockers, MUST close before Phase 1 ship).

---

## §13. STRATEGIC FRAME (UNCHANGED FROM v0.2)

Practice Edition (GLP-1 Vertical) is a **product variant**, not a fork. Strategic implications:

- **Bariatric Associates PA** is the launch customer
- Other GLP-1 prescribing practices (endocrinology, obesity medicine, primary care) become a sellable vertical
- **Wellness/Corporate Edition** = future variant on same architecture
- **Biohackers World NYC** demo: timespan progression story (Day 1 → Day 14 → Day 45) is more differentiated than a generic cockpit
- Positions BariAccess as the **only platform serving GLP-1 prescribing practices**

---

## §14. RELATED CANON (UPDATED — added 6 docs)

| Document ID | Purpose |
|---|---|
| **CCO-FAB-001 v2.0 Pass 1** | FAB Canon — 7 families, Task/Silent visibility, Universal FAB Definition ⭐ NEW |
| **CCO-FAB-CANDIDATE-001 v1.0** | Open FAB Candidate Detection Algorithm (always-on) ⭐ NEW |
| **CCO-JOUR-DEF-001 v1.0** | Journal Architectural Definition Canon (parent of §9) ⭐ UPDATED |
| **CCO-RR-PYRAMID-ADD-001 v1.0** | R&R Pyramid Canon Addendum — 4-tile connected architecture ⭐ NEW |
| **CCO-ARCH-BOOKEND-001** | Bookend Universal Architecture (R-9) ⭐ NEW |
| **PCN-RR-INV-001** | R&R Pyramid Inventory — Night Journal feeds composites ⭐ NEW |
| **PAC-DP-001** | Dynamic Profile / My Blueprint Memory Lane ⭐ NEW |
| CCO-CP-ARCH-001 v2.0 | Constellation Panel Architecture |
| CCO-WP-5149-001 v1.0 | 51/49 WorkPad |
| CCO-RB-ARCH-001 | Rhythm Board Architecture |
| CCO-UX-RBSHELF-001 v1.0 | Routine Bookshelf |
| CCO-UX-RBDISP-001 v1.2 | Rhythm Board Display states |
| CCO-PROG-001 v2.1 | Program Canon |
| CCO-UX-EXPR-001 | Expression Layer |
| CCO-IC-SC-001 | Stability Coefficient |
| CLN-TOT-D0-001 v1.0 | Day Zero Session Canon |

---

## §15. CHANGE LOG (UPDATED)

| Version | Date | Change | Author |
|---|---|---|---|
| v0.1 | May 1, 2026 (AM) | Initial generic D0 Lite draft | Val + Claude (assist) |
| v0.2 | May 1, 2026 (PM) | Reframed as Practice Edition (GLP-1 Vertical). AI Playground untouched. Timespan progression. Daily Pulse reconfigured. Beacon swipe-to-spider mechanic (Practice-Edition-only — OQ-B3 locked). | Val + Claude (assist) |
| **v0.3** | **May 2, 2026** | **Synced to canons filed May 2: FAB Canon v2.0 Pass 1 (7 families, Task/Silent visibility, named FABs tagged), FAB Candidate Algorithm (always-on reference), Journal Canon v1.0 (two-layer architecture, R-1 to R-13, anchor revision, voice + tone stream). R-7 Mesh thread error corrected in §9. Mark named as PE reference patient. Mental Wellbeing safety escalation flow added as Phase 1 blocker. Voice consent flow added as Phase 1 blocker. 48 pre-built medication Journal rows referenced. Lab display corrected to Healthspan Ground Levels per Pyramid Addendum. §16 Pyramid + Ground Levels Architecture Addendum added (4-tile connected lock).** | Val + Claude (assist) |

---

## §16. ADDENDUM — PYRAMID + GROUND LEVELS ARCHITECTURE (Practice Edition Reference)

This addendum captures Val's May 2, 2026 architectural clarifications on the Pyramid + Ground Levels system. It is **Practice Edition reference for Zakiy.** The full canonical formalization lives in the separate document **CCO-RR-PYRAMID-ADD-001** (Pyramid Canon Addendum).

### §16.1 Key Architecture Locks (May 2, 2026)

**1. PYRAMID-ON-GROUND METAPHOR**

The pyramid (1 apex + 8 composites + 24 sub-scores + 80+ components) is fed BY V1+V2+V3+V4 raw streams flowing UPWARD from the ground. Pyramid = aggregated layer at top. Ground = raw V1-V4 substrate feeding upward. They are connected — pyramid stays on ground.

**2. ORANGE DOT RULE PER TILE**

| Tile | Where orange dots fire |
|---|---|
| R&R (Tile 1) | **PYRAMID 3 LAYERS ONLY** (1 apex / 8 composites / 24 sub-scores) |
| Healthspan (Tile 2) | **GROUND LEVELS** (visible surface) |
| My Blueprint (Tile 3) | **GROUND LEVELS** (visible surface) |
| Inner Circle (Tile 4) | Vertical Columns (downstream consequence chain) |

**3. CASCADE RULE (LOCKED)**

When raw V1-V4 data triggers orange in Healthspan or My Blueprint ground levels, the orange CASCADES UPWARD into the R&R pyramid composite that aggregates that data.

Example: FibroScan elevated → orange in Healthspan ground level → BCI composite in R&R pyramid mid-layer ALSO turns orange (because BCI aggregates FibroScan).

**4. GROUND LEVELS FLEXIBLE STRUCTURE**

Ground Levels can be ONE large deep layer (Phase 1 simplification) OR multiple numbered/named layers (future expansion). Phase 1: ONE deep ground level per tile holding all relevant V1 data.

**5. 4-TILE CONNECTED ARCHITECTURE (LOCKED)**

ALL 4 tiles are connected — through different mechanisms:

```
TILES 1-2-3: DIRECT V1-V4 SUBSTRATE SHARING
Same biometric/behavioral/contextual/interventional 
signals feed all three tiles simultaneously. 
They are three lenses on ONE continuous data landscape.

TILE 4 (Inner Circle): DOWNSTREAM CONSEQUENCE CHAIN
Connected indirectly — reflects the engagement 
consequences that flow from V1-V4 signal changes:

  V1-V4 signal change
      ↓
  Tile 1/2/3 alert (orange dot fires)
      ↓
  Program / ITB triggers
      ↓
  Patient engages → Credits accrue (CPIE/CCIE)
      ↓
  Tier progression updates
      ↓
  Biohacker profile progresses
      ↓
  INNER CIRCLE reflects in vertical columns
```

No tile is an island. The 4-tile Constellation Crown is ONE connected architecture telling one story across different tile lenses.

### §16.2 Practice Edition Phase 1 Implications for Zakiy

- Build pyramid in R&R only (existing R&R Pyramid Canon — 1+8+24)
- Build ground levels in Healthspan + My Blueprint (existing Card Canon §4.7)
- **Phase 1: ONE deep ground level per tile** holding all V1 labs (FibroScan, body comp, blood panels)
- Orange dot escalation entry: pyramid tiers in R&R, ground levels in Healthspan/My Blueprint
- **Cascade logic must be built:** ground level orange → R&R pyramid composite orange (the BCI / SRC / etc. composite that aggregates that signal)
- **Tile 4 connection must be built:** signal change → ITB/Program → credits → tier → biohacker progression → Inner Circle vertical column update
- Future: Ground Level expansion + numbered/named layers decided post-launch

### §16.3 Open Questions (Phase 1 Scope)

| # | Question | Owner |
|---|---|---|
| OQ-GLVL-PE-01 | Phase 1 ground level count — confirm ONE deep level for Healthspan? | Val |
| OQ-GLVL-PE-02 | Ground level continuity Healthspan → Blueprint — single landscape or tile-bounded? | Val + Nikita |
| OQ-PYR-ADD-02 | R&R pyramid-to-ground transition — scroll, swipe, or hidden architecturally? | Val + Nikita |
| OQ-PYR-ADD-04 | Ground Level numbering and naming (Phase 1 simplification → future expansion) | Val + Nikita |

### §16.4 Cross-Reference

Full canonical addendum: **CCO-RR-PYRAMID-ADD-001 v1.0 PROPOSED** (companion document, filed May 2, 2026).

---

*END — DEV-WORK-D0LITE-001 v0.3 / WORKING DRAFT*

*Status: Open for Zakiy input. No canon impact until v1.0 lock.*

© 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.
