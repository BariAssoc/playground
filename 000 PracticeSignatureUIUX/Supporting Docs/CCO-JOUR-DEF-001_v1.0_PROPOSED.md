# BARIACCESS™ — JOURNAL ARCHITECTURAL DEFINITION CANON

## v1.0 PROPOSED

**DOCUMENT ID:** CCO-JOUR-DEF-001
**VERSION:** v1.0 PROPOSED
**STATUS:** WIP — AWAITING VAL LOCK
**AUTHOR:** Valeriu E. Andrei, MD | President
**ASSISTANT EDITOR:** Claude (Anthropic) — drafting only, not authoring
**DATE:** May 2, 2026
**SUPERSEDES:** CCO-JOUR-001 (pre-canon, April 26, 2026)
**COMPANION:** CCO-JOUR-OPS-001 (Operational Spec — queued, post-lock)

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.

---

## §1. PURPOSE

To define the Journal as a first-class architectural component of BariAccess — the longitudinal behavioral spine of the platform, operating 24/7 across weekdays, weekends, sick days, and well days alike.

This canon is **architectural** — it locks WHAT the Journal IS and HOW it works structurally. Operational specifications (UI surfaces, schemas, capture cadence) are reserved for the companion canon `CCO-JOUR-OPS-001`.

**Val's foundational principle, May 2, 2026:**

> *"Journal is really something which collects everything in one's routine. Routine goes 24/7. During the weekdays, weekends, when one is sick, when one is not sick, always Journal goes through."*

---

## §2. CANONICAL DEFINITION

The **Journal** is the longitudinal behavioral record of the BariAccess universe. It is structured in two layers:

- **Layer 1 — Collection** (silent, 24/7, complete)
- **Layer 2 — Display** (selective, task-relevant, patient-facing)

The Journal is filled through three architectural mechanisms (R-3, see §5), bounded by Day and Night envelopes (R-4, see §5), and consolidated into the R&R Pyramid composites at the night layer.

The Journal is **append-only** at the architectural level (R-10), with a versioned anchor revision mechanism for evolving truths (see §4.2).

---

## §3. THE TWO-LAYER ARCHITECTURE (NEW — locked May 2, 2026)

### §3.1 Layer 1 — Collection (silent, complete, 24/7)

Layer 1 collects EVERYTHING that informs the patient's routine, regardless of patient awareness. It is the **substrate** Ollie reads from to make decisions.

Layer 1 contains:

- All entries from R-3 filling mechanisms (ITB, FAB, Ollie/AskABA Yes/No)
- Bookend timestamps from every segment (8–12 per day per Bookend Canon)
- Voice + tone capture from D0 first call onward
- Memory Snaps
- Chronotype refinement (continuous wearable analysis)
- Social Jet Lag (computed nightly via FAB-SOCIAL-JET-LAG™ — Silent FAB, Circadian family)
- ITB reactions, personality reactions
- Passive sensor data (HRV recovery, sleep stages, app interactions)
- All weekday / weekend / sick-day / well-day data without exception

### §3.2 Layer 2 — Display (selective, patient-facing)

Layer 2 surfaces **only task-relevant** entries to the patient via the WorkPad and Journal display surfaces. Ollie filters which Layer 1 data surfaces to Layer 2.

Layer 2 shows:

- ✅ Task FABs (FAB Canon v2.0 §3) — protein, hydration, sleep, medication, hunger, exercise, etc.
- ✅ Memory Snaps (when present)
- ✅ Major events Ollie surfaces for patient attention
- ❌ Silent FABs (background, Ollie-mediated)
- ❌ Passive sensor data (Ollie reacts silently)
- ❌ Voice/tone analysis output (informs Ollie, not displayed)
- ❌ Bookend pin timestamps (sensors, not entries)

**Key rule:** Layer 1 is complete. Layer 2 is curated. The patient sees what is actionable. Ollie sees the full picture.

### §3.3 Why this matters

Val's clarification, May 2, 2026:

> *"There are some FABs on the Journal which are not need to be displayed at enforcement FABs. They are FABs which support a segment not to shake during the routine, they cannot doesn't need to be displayed on the Journal because Ollie is going to react. So that's very important — all the FABs which are not really part of the task but are more part of supporting the routine that don't need to be seen. But the task should be."*

The two-layer model resolves what was previously ambiguous: collection is complete, display is curated, and the rule that governs both is **patient cognitive load protection** (R-8 — see §5).

---

## §4. THE ANCHOR + REVISION MECHANISM (NEW — locked May 2, 2026)

### §4.1 D0 Anchor Rows

At Day Zero, certain intake events are stamped permanently as **Anchor rows** in the Journal:

| Anchor Type | Source | Captured by |
|---|---|---|
| Hunger Assessment (HM-INTAKE-001 v1.0) | Self-completed pre-BBS | Patient + Pamela review |
| Chronotype Assessment (CAS quiz) | 5-question MEQ-based | Patient + Isaiah/Pamela |
| Hunger Score baseline | Ollie's 3-question Day-1 conversation | Ollie + AskABA |
| Personality / Space classification (Protected/Challenging/Vulnerable) | PC-CONVO-001 | Pamela + Isaiah |
| Demographics + medication context | Intake form | Pamela |

Anchor rows establish the **starting truth** for the patient.

### §4.2 Revision Mechanism

Anchor rows are **NOT immutable.** When ongoing Layer 1 reactions / observations contradict the anchor over time, the anchor itself can be updated.

**Val's principle, May 2, 2026:**

> *"Type is anchor but it's changed daily either reactions. Native question is is really through the anchor or sometimes it's not so that is very important. Daily the other one once but if everyone is changing, we have to change it if it's not true. So if he wants it I'm a Wolf, but it proves that it's not a Wolf — I think at one point Ollie's gonna make a decision."*

### §4.3 Update Authority

- **Ollie owns the anchor revision decision.**
- AskABA / Max provides clinical evidence for the decision.
- Patient self-report (e.g., "I'm a Wolf") is the initial anchor but does NOT override observed truth indefinitely.
- Threshold for revision: TBD (see Open Questions).

### §4.4 Append-Only Reconciliation with R-10

The append-only rule (R-10) is preserved. Anchor revision does NOT delete prior anchor versions:

```
Anchor v1 (D0):  "Wolf chronotype" (self-report)
   ↓ stays in history forever
Anchor v2 (D45): "Behaves as Lion chronotype" (Ollie decision based on observed peak times)
   ↓ replaces active value, v1 archived
Anchor v3 (D120): "Stable Lion chronotype" (Ollie confirms after sustained pattern)
```

Active value = most recent. Full history = preserved. No deletion.

### §4.5 Anchor Types Subject to Revision

| Anchor Type | Revisable? | Frequency Allowed |
|---|---|---|
| Chronotype | ✅ Yes | Auto-refined every 28 days; explicit revision Ollie-decided |
| Personality / Space classification | ✅ Yes | Quarterly review by Pamela + Ollie |
| Hunger pattern | ✅ Yes | Continuous — pattern changes with medication titration |
| Demographics (age, surgery date) | ❌ No | Fixed historical data |
| Medication baseline | ⚠️ Versioned | New row appended on each medication change |

---

## §5. THE THIRTEEN ARCHITECTURAL RULES (R-1 through R-13)

These are the locked architectural invariants of the Journal. Each rule has a one-line statement followed by a brief clarification.

### R-1 — First-Class Component
The Journal is a first-class component of My Blueprint and the BariAccess universe. It is not an OQ, placeholder, or downstream artifact. (Per Val correction, April 26, 2026.)

### R-2 — Two-Layer Architecture (NEW)
The Journal operates in two layers: Layer 1 Collection (silent, complete) and Layer 2 Display (selective, task-relevant). Ollie filters Layer 1 to Layer 2.

### R-3 — Three Filling Mechanisms ONLY
Active patient-fed entries are limited to three mechanisms:
1. **ITB** — Interventional Therapeutic Block answers auto-log
2. **FAB** — Focused Action Block completions and observations
3. **Ollie/AskABA Yes/No** — conversational binary capture

Layer 1 ALSO includes passive data (sensors, computed signals, voice/tone) — but these enter via system instruments, not patient-active mechanisms. R-3 governs **active fill paths**, not collection scope.

### R-4 — Day vs Night Envelope
Day Journal is bounded by Morning Bookend → Evening Bookend (~16 hours). Night Journal is bounded by Evening Bookend → next-Morning Bookend (~8 hours). Together they cover 24 hours.

### R-5 — Routine-Anchored, Not Calendar-Anchored
The Journal follows the Routine, not the wall-clock day. Weekends, vacation routines, and sick-day routines all generate full Journals. The Routine type changes; the Journal continuity does not.

### R-6 — Peer to Memory Lane
Both Journal and Memory Lane are first-class components of My Blueprint. Neither contains the other. Journal entries can be **promoted** to Memory Lane (e.g., Memory Snap promotion) without deletion from Journal.

### R-7 — Not a Mesh Thread
The Journal is NOT a Mesh thread. It populates Mesh via the pipeline V-stream → BDC (Behavior Digital Chip) → BDG (BioDigitalGene). Mesh threads emerge from Journal data; they are not Journal itself.

### R-8 — Cognitive-Overload UX Invariant
The patient sees ONE Journal card at a time at the display layer. Ollie selects which surfaces. This is the canonical defense against patient overwhelm.

### R-9 — Bookend-Bounded
Every Journal entry is wrapped by a Warm-up Bookend and a Cool-down Bookend (per CCO-ARCH-BOOKEND-001). The bookend protocol is what makes the Journal entry a behavioral biometric rather than a log.

### R-10 — Append-Only at Architectural Layer
No architectural deletion is possible. Updates create new versions; prior versions are preserved. Anchor revisions (§4.4) follow this rule via versioned append.

### R-11 — Programs May Contain Journal Entries
Per CCO-PROG-DEF-001 R-8: A Program may contain Journal entries. Each entry retains both `journalRefIds` (its Journal lineage) and `programRefId` (its Program context). Deletion of a Program does not delete the Journal entries — they revert to free-standing Journal status.

### R-12 — HIPAA Inheritance
A Journal entry inherits HIPAA classification from its source mechanism:
- ITB (clinical) → CPIE / HIPAA-tagged
- FAB (varies) → tag follows FAB classification (CPIE or CCIE)
- Ollie/AskABA Yes/No → context-dependent
- Passive sensor → defaults to V1 stream classification

### R-13 — Anchor + Revision (NEW)
D0 Anchor rows establish starting truth. Anchor values are revisable when reactions/observations contradict them over time. Ollie owns the revision decision. Append-only governance preserved (§4.4).

---

## §6. THE THREE FILLING MECHANISMS (R-3 detailed)

The Journal is filled through **three architectural mechanisms** for active patient-fed entries. These are the only paths a patient-actioned entry can enter the Journal. Layer 1 also receives passive data (see §3.1), but passive data enters via system instruments, not these mechanisms.

### §6.1 Mechanism 1 — ITB (Interventional Therapeutic Block)

**Source:** ITB completion events and embedded ITB questions.
**Example:** Mark completes the Friday-morning Zepbound injection ITB. The injection event auto-logs to Journal as a Day-bounded entry. Embedded questions ("How was your hunger before injection?") generate additional rows.
**HIPAA:** CPIE (clinical, HIPAA-tagged).
**Cross-reference:** CCO-ITB-001 — ITB Canon.

### §6.2 Mechanism 2 — FAB (Focused Action Block)

**Source:** FAB completion events and FAB-attached observations.
**Example:** Mark logs his protein meal via FAB-NUTRITION™. The completion event becomes a Journal entry. FAB-HUNGER™ logs a 0–10 score via Variable FAB capture.
**HIPAA:** Inherits from FAB classification — CPIE or CCIE per FAB Canon v2.0 §10.
**Cross-reference:** CCO-FAB-001 v2.0 Pass 1 — FAB Canon.

### §6.3 Mechanism 3 — Ollie / AskABA Yes/No

**Source:** Conversational binary capture initiated by Ollie or AskABA.
**Example:** Ollie asks "Did the cat get fed?" — patient says yes. Logs to Journal as binary entry. AskABA asks "Any GI symptoms today?" — clinical context.
**HIPAA:** Context-dependent — clinical questions = CPIE; wellness = CCIE.
**V-stream:** Primarily V3 (contextual).

### §6.4 Filling Mechanism Restriction Rule

R-3 is **strict** for active patient-fed entries. No fourth active mechanism may be added without explicit canon amendment. Passive Layer 1 capture (sensors, computed signals, voice/tone) is governed separately under §3.1 and does NOT count as a fourth mechanism.

### §6.5 Cross-Mechanism Combinations

A single Journal entry may have multiple mechanism sources:
- ITB completion + FAB observation = entry tagged with both `itbRefId` and `fabRefId`
- FAB completion triggered by Ollie Yes/No prompt = entry tagged with both `fabRefId` and `ollieConversationId`

These compound entries enrich Mesh population without violating R-3.

---

## §7. THE DAY / NIGHT ENVELOPE (R-4 detailed)

The Journal operates on a continuous 24-hour cycle structured by two envelopes that together cover the entire day-and-night routine.

### §7.1 Day Journal Envelope

**Boundary:** Morning Bookend → Evening Bookend
**Duration:** ~16 hours (varies by chronotype and routine)
**Primary content:** Active patient-fed entries via R-3 mechanisms; segment-level Bookend pin captures
**V-streams:** V2 (behavioral) primarily; V3 (contextual) via Bookend pins; V4 (interventional) via ITB events

**Inside the Day Envelope, Bookends fire at every segment boundary:**

```
MORNING UMBRELLA               MIDDAY UMBRELLA              EVENING UMBRELLA
   │                              │                            │
   ├ Wake (AM1)                   ├ Lunch Block (Mid1)         ├ Dinner (PM1)
   │  └ Bookend pair fires        │  └ Bookend pair fires      │  └ Bookend pair fires
   ├ Coffee (AM2)                 ├ Work Block 2 (Mid2)        ├ Wind Down (PM2)
   │  └ Bookend pair fires        │  └ Bookend pair fires      │  └ Bookend pair fires
   ├ Commute (AM3)                ├ Break (Mid3)               ├ Sleep Ambience (PM3)
   │  └ Bookend pair fires        │  └ Bookend pair fires      │  └ Bookend pair fires
   └ Work Block 1 (A1)            └ ... (B1–B4)                └ Bedtime
       └ Bookend pair fires
```

**Net effect:** ~8–12 Bookend pairs fire per day, each generating Journal entries.

### §7.2 Night Journal Envelope

**Boundary:** Evening Bookend → next Morning Bookend
**Duration:** ~8 hours (varies by chronotype)
**Primary content:** Sleep stages, HRV recovery, FAB-SLEEP™ outcomes, computed signals (FAB-SOCIAL-JET-LAG™)
**V-streams:** V1 (biometric — wearable sleep data); V3 (contextual — chronotype refinement)

**Layer assignment:** Mostly Layer 1 (silent collection — sleep stages, recovery metrics). Some Layer 2 surfacing (e.g., morning "How was your sleep?" check-in becomes a Task FAB entry).

### §7.3 R&R Pyramid Consolidation (preview — full detail in §11)

Night Journal data consolidates into R&R Pyramid composites:
- **SRC** (Sleep & Recovery Composite)
- **BHR** (Behavioral & Habit Readiness)
- **MEI** (Metabolic & Energy Index)
- **AMP** (Activity & Movement Performance)

This pipeline is detailed in §11.

### §7.4 Routine-Type Variations

The Day/Night envelope structure adapts to routine type without breaking continuity:

| Routine Type | Envelope Behavior |
|---|---|
| **Weekday** | Standard Day/Night envelope, full segment Bookend coverage |
| **Weekend** | Day envelope shifted (later wake, later sleep); fewer segments |
| **Vacation** | Day envelope minimal-segment; chronotype natural alignment |
| **Sick Day** | Day envelope compressed; Recovery FABs prioritized |
| **Travel** | Day envelope wraps timezone shift; Social Jet Lag spikes captured |

**The envelopes always exist.** The contents vary. R-5 governs.

### §7.5 Envelope Sealing

At the close of each Bookend, the wrapped entry is **sealed** — timestamp-locked, source-tagged, V-stream-routed, and committed to Layer 1. Sealed entries cannot be modified retroactively (R-10 append-only). New observations create new entries.

---

## §8. VOICE + TONE STREAM (NEW — locked May 2, 2026)

### §8.1 Origin

From D0 onward — starting at the patient's first call into the BariAccess system — voice recordings and derived tone signals enter Layer 1 of the Journal.

**Val's principle, May 2, 2026:**

> *"Voice recognition, when you start to work, talk to the client very first time, when the client calls first time, and is recording the voice, it goes in a journal."*

### §8.2 Three Voice Sub-Streams

| Sub-stream | What's Captured | V-stream | Layer |
|---|---|---|---|
| **Voice content** | Transcribed words (Fireflies.ai integration) | V2 (behavioral) | L1 → L2 (selective) |
| **Voice tone** | Emotional / stress signal from prosody | V2 (behavioral) | L1 only |
| **Voice patterns** | Pace, hesitation, response latency | V3 (contextual) | L1 only |

### §8.3 Capture Sources

- D0 BBS visit recording (Pamela + patient conversation, Fireflies.ai)
- All subsequent provider calls (Tech Barista, provider, Pamela follow-ups)
- Ollie voice interactions (when patient responds via voice)
- AskABA voice exchanges

### §8.4 HIPAA Status

**Voice + tone capture is PHI under HIPAA.** Patient consent flow at D0 is **mandatory** before any voice recording enters the Journal.

### §8.5 Voice Stream Layer Routing

- **Voice content** → may surface to Layer 2 as transcript reference (e.g., journal entry "Patient mentioned hunger returning Wednesday")
- **Voice tone** → stays Layer 1 only (Ollie reads, patient does not see)
- **Voice patterns** → stays Layer 1 only (informs Ollie / clinical context)

### §8.6 Cross-References

- CCO-ARCH-BOOKEND-001 §4 — Response Latency proposed pin (overlaps with §8.2 voice patterns)
- Memory Rule #29 — Fireflies.ai locked April 2026 as web app voice intake

### §8.7 Open Questions

| # | Question |
|---|---|
| OQ-VOICE-01 | Voice tone scoring formula — TBD |
| OQ-VOICE-02 | Patient consent flow language at D0 — needs legal review |
| OQ-VOICE-03 | Voice content retention duration — HIPAA + clinical-utility tradeoff |

---

## §9. MEMORY SNAP AS JOURNAL COMPONENT

### §9.1 Definition

A **Memory Snap** is a patient-captured photo or moment that enters the Journal as a Layer 1 + Layer 2 entry. Memory Snaps are the only Journal entries with explicit visual content.

**Val's principle, May 2, 2026:**

> *"Even part of their memories, snaps can be on the Journal."*

### §9.2 Capture Mechanism

- Patient uploads photo via 51/49 WorkPad (per CCO-WP-5149-001)
- Ollie asks: *"What do you want me to write on it?"* (per CCO-CP-ARCH-001 §10)
- Patient annotates → entry sealed to Journal

### §9.3 Display Treatment

- Layer 1: full image + annotation + timestamp + Bookend wrap
- Layer 2: surfaces as Memory Snap card on Rhythm Board (per Pic 1 / Pic 2 reference UI)
- Stack count badge when multiple Memory Snaps accrue
- "View all ›" CTA opens Memory Lane history

### §9.4 Promotion to Memory Lane

Memory Snaps can be **promoted** to Memory Lane (per R-6 — peer relationship). Promotion does NOT delete from Journal — the entry exists in both surfaces simultaneously, linked by `memorySnapId`.

### §9.5 Special Case — Medical Files

Per CCO-WP-5149-001: when a patient uploads a **medical file** (lab result, scan), the 51/49 WorkPad recognizes it via AI:
- Expression turns purple
- Ollie says: *"Thank you for uploading this one, but this is medical. These are documents which don't belong to me."*
- File routes to Pamela / provider, NOT to Memory Snap
- Journal logs the upload event with `medicalFileFlag = true`, content sealed to provider channel

### §9.6 Cross-References

- CCO-WP-5149-001 — 51/49 WorkPad upload flow
- CCO-CP-ARCH-001 — Constellation Panel Memory Snap surfacing
- PAC-DP-001 — My Blueprint Memory Lane architecture

### §9.7 Open Questions

| # | Question |
|---|---|
| OQ-SNAP-01 | Memory Snap retention default — keep all or auto-archive after N days? |
| OQ-SNAP-02 | Multiple-photo stack UI — already shown in build; canon documentation pending |
| OQ-SNAP-03 | Voice annotation on Memory Snap — supported or text-only? |

---

## §10. PIPELINE — V-STREAM → BDC → BDG → MY BLUEPRINT

The Journal does not stand alone. Every Journal entry feeds a deterministic compounding pipeline that builds the patient's longitudinal identity over time. This is what R-7 governs — Journal **populates** Mesh; it is not Mesh itself.

### §10.1 The Four Stages

```
┌──────────────────────────────────────────────────┐
│  STAGE 1 — V-STREAM ROUTING                      │
│  Each Journal entry tags V1/V2/V3/V4             │
│  per its source (R-12 HIPAA inheritance)         │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  STAGE 2 — BDC (Behavior Digital Chip)           │
│  Compounds V-stream tagged entries into          │
│  behavioral patterns over rolling windows        │
│  (7d / 14d / 30d / 90d)                          │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  STAGE 3 — BDG (BioDigitalGene)                  │
│  Encodes BDC patterns into the patient's         │
│  longitudinal behavioral identity — the          │
│  digital phenotype                               │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  STAGE 4 — MY BLUEPRINT MESH                     │
│  Mesh threads emerge from BDG; visible to        │
│  patient via My Blueprint tile (Tile 3)          │
└──────────────────────────────────────────────────┘
```

### §10.2 V-Stream Routing (Stage 1)

Every Journal entry is tagged at sealing time:

| V-stream | Source | Examples |
|---|---|---|
| **V1** | Biometric — wearable data | HRV, sleep stages, temperature, RHR |
| **V2** | Behavioral — patient actions | FAB completions, Ollie Yes/No, voice content |
| **V3** | Contextual — environment + timing | Bookend timestamps, Social Jet Lag, app interaction patterns, voice tone |
| **V4** | Interventional — clinical actions | Medication doses, ITB completions, provider interventions |

A single Journal entry may carry multiple V-stream tags (compound entries from §6.5).

### §10.3 BDC Compounding (Stage 2)

The Behavior Digital Chip aggregates V-stream-tagged entries over rolling windows:
- **7-day window** — recent pattern (used for FCS, drift detection)
- **14-day window** — habit stabilization signal (FAB Learning → Stable threshold)
- **30-day window** — chronotype refinement; Social Jet Lag computation
- **90-day window** — clinical-grade trend (used for Healthspan, lab-result interpretation)

BDC outputs feed:
- FAB state machine (Learning → Active → Stable → Drifting → Locked → Blocked)
- FABRV™ (when Pass 3 formulas lock)
- Beacon band assignment

### §10.4 BDG Encoding (Stage 3)

The BioDigitalGene encodes BDC patterns into the patient's persistent identity:
- Behavioral phenotype (active vs sedentary, morning-leaning vs evening-leaning)
- Risk patterns (Vulnerable Space frequency, Erosion susceptibility)
- Resilience patterns (Recovery speed, Stability Coefficient signal)
- Identity signatures (FAB-ROUTINE™ stability, social anchoring patterns)

BDG is the substrate for the **Digital Health Passport** (proposed canon, not yet locked).

### §10.5 My Blueprint Mesh (Stage 4)

Mesh threads emerge from BDG and surface in My Blueprint (Tile 3). Mesh threads are **emergent**, not entered. The patient does not "fill" a Mesh thread — Mesh threads accumulate from sustained BDG patterns.

This is the **architectural reason R-7 exists** — Mesh threads are the OUTPUT of the pipeline, not the INPUT. Journal is the input.

### §10.6 Cross-References

- PAC-DP-001 — My Blueprint Dynamic Profile architecture
- CCO-V1V4-001 — V1–V4 Domain Scoring Canon ⚠️ **NOT YET BUILT** — flagged in 6+ audits as #1 most critical missing canon
- PAC-BDG-001 — BDG Canon ⚠️ **NOT YET BUILT**
- PAC-DP-001 — Dynamic Profile Canon ✅ Locked

---

## §11. R&R PYRAMID CONSOLIDATION (Night Journal → Composites)

### §11.1 The Consolidation Pipeline

Night Journal data — captured between Evening Bookend and next-Morning Bookend — consolidates into the R&R Pyramid Layer 1 composites:

```
NIGHT JOURNAL ENVELOPE (~8 hours)
         │
         ▼
   Sleep stages, HRV recovery,
   FAB-SLEEP™ outcomes,
   Computed: FAB-SOCIAL-JET-LAG™,
             chronotype refinement
         │
         ▼
   ┌──────────────────────────────┐
   │  R&R Pyramid Composites      │
   │                              │
   │  SRC — Sleep & Recovery      │
   │  BHR — Behavioral & Habit    │
   │        Readiness             │
   │  MEI — Metabolic & Energy    │
   │  AMP — Activity & Movement   │
   │        Performance           │
   └──────────────────────────────┘
         │
         ▼
   R&R apex score (0–100)
   Tile 1 display in Constellation Panel
```

### §11.2 Composite Mapping

| Composite | Night Journal Inputs |
|---|---|
| **SRC** (Sleep & Recovery) | Sleep stages, REM %, deep sleep %, sleep efficiency, total duration, FAB-SLEEP™ completion |
| **BHR** (Behavioral & Habit Readiness) | FAB-ROUTINE™ stability across day, FCS rolling 14-day, drift signals |
| **MEI** (Metabolic & Energy Index) | Overnight glucose stability (when CGM present), HRV recovery delta, fasting metabolic markers |
| **AMP** (Activity & Movement Performance) | Recovery completeness, readiness for next-day movement, NAP entries |

### §11.3 Day Journal Contribution

Day Journal also feeds composites — but predominantly the **active** side (Readiness composites: AMP, BCI, CRC, BHR via daytime FABs). Night Journal feeds the **recovery** side (Recovery composites: SRC, SBL, MBC, MEI via overnight signals).

This split reflects the locked R&R formula (March 3, 2026):
- Recovery side = 50% (SRC + SBL + MBC + MEI)
- Readiness side = 50% (AMP + BCI + CRC + BHR)

### §11.4 Why This Matters Architecturally

If the Night Journal envelope did not exist, Tile 1 (R&R) Recovery composites would be **broken** — there would be no canonical home for overnight signals. This is why R-4 (Day/Night envelope) and §11 (consolidation) are non-negotiable.

### §11.5 Cross-References

- PCN-RR-INV-001 — R&R Pyramid Inventory Canon
- 33370 / 33376 — R&R composite weights locked March 3, 2026
- CCO-IC-SC-001 — Stability Coefficient

---

## §12. OPEN QUESTIONS (Consolidated)

These items are flagged as Open Questions and require Val decision OR are deferred to companion canon CCO-JOUR-OPS-001.

### From §3 — Two-Layer Architecture
| # | Question |
|---|---|
| OQ-JOUR-L-01 | Layer 2 surfacing rule — algorithmic or Ollie-discretionary? |
| OQ-JOUR-L-02 | Patient-initiated promotion from L1 → L2 — supported? |

### From §4 — Anchor + Revision
| # | Question |
|---|---|
| OQ-JOUR-A-01 | Anchor revision threshold — how many consistent contradictions trigger Ollie's update decision? |
| OQ-JOUR-A-02 | Patient notification when anchor is revised — silent or transparent? |
| OQ-JOUR-A-03 | Provider review required for clinical anchor revisions (e.g., medication baseline)? |

### From §6 — Filling Mechanisms
| # | Question |
|---|---|
| OQ-JOUR-M-01 | Compound entries — how many simultaneous mechanism tags allowed per entry? |
| OQ-JOUR-M-02 | Provider-entered Journal rows (not patient-fed) — fourth mechanism or separate? |

### From §7 — Day / Night Envelope
| # | Question |
|---|---|
| OQ-JOUR-E-01 | Sick-day routine envelope — how does Bookshelf display compress? |
| OQ-JOUR-E-02 | Vacation routine envelope — how is timezone shift handled? |
| OQ-JOUR-E-03 | Travel envelope — same-day timezone change Bookend behavior? |

### From §8 — Voice + Tone
| # | Question |
|---|---|
| OQ-VOICE-01 | Voice tone scoring formula |
| OQ-VOICE-02 | Patient consent flow language at D0 (legal review) |
| OQ-VOICE-03 | Voice content retention duration |

### From §9 — Memory Snap
| # | Question |
|---|---|
| OQ-SNAP-01 | Memory Snap retention default |
| OQ-SNAP-02 | Multiple-photo stack UI canon documentation |
| OQ-SNAP-03 | Voice annotation on Memory Snap — supported or text-only? |

### From §10 — Pipeline
| # | Question |
|---|---|
| OQ-PIPE-01 | CCO-V1V4-001 must be built before this pipeline locks operationally |
| OQ-PIPE-02 | PAC-BDG-001 must be built |
| OQ-PIPE-03 | Mental Wellbeing safety escalation flow — sensitive entries route TBD |

### From §11 — R&R Consolidation
| # | Question |
|---|---|
| OQ-RR-01 | Night Journal data minimum threshold for valid composite computation |
| OQ-RR-02 | When Night Journal data is missing (no wearable worn) — degradation rule per R&R Pass 0 Foundation Rules |

---

## §13. CROSS-REFERENCES + PROVENANCE + CHANGE LOG

### §13.1 Cross-References

| Document ID | Relationship |
|---|---|
| **CCO-FAB-001 v2.0** | Parent FAB Canon — FAB is filling mechanism #2 (R-3) |
| **CCO-FAB-CANDIDATE-001** | Open FAB detection — candidates may become Journal entry types |
| **CCO-PROG-DEF-001 v1.0** | Programs may contain Journal entries (R-11) |
| **CCO-ITB-001** | ITB filling mechanism #1 (R-3) |
| **CCO-ARCH-BOOKEND-001** | Bookend wrap rule (R-9) — every Journal entry is Bookend-bounded |
| **CCO-WP-5149-001** | 51/49 WorkPad Memory Snap upload flow |
| **CCO-CP-ARCH-001 v2.0** | Constellation Panel Memory Snap surface |
| **PAC-DP-001** | My Blueprint Dynamic Profile peer to Memory Lane (R-6) |
| **PCN-RR-INV-001** | R&R Pyramid composite consolidation (§11) |
| **CCO-V1V4-001** | ⚠️ NOT BUILT — V1–V4 Domain Scoring Canon |
| **PAC-BDG-001** | ⚠️ NOT BUILT — BDG Canon |
| **CCO-IC-SC-001** | Stability Coefficient Canon |
| **ISE Canon v3.0** | Ollie's anchor revision authority governance |
| **CCO-JOUR-OPS-001** | ⚠️ QUEUED — Operational Specification companion canon |
| **HM-INTAKE-001 v1.0** | Hunger Assessment intake doc — D0 Anchor source |
| **CAS** | Chronotype Assessment — D0 Anchor source |
| **PC-CONVO-001** | Personality / Chronotype Conversation — D0 Anchor source |

### §13.2 Provenance

| # | Source | Date | Contribution |
|---|---|---|---|
| 1 | Chat 33360 (cfe4b673) | April 26–28, 2026 | Pre-canon CCO-JOUR-001; R-1 through R-11 architectural rules; three filling mechanisms |
| 2 | Chat 1d1fb4a2 | April 24, 2026 | Journal Entry Extraction Algorithm; 9-column structure; Ollie tone canon (memory rule #30) |
| 3 | Chat 921625ab + 33370 | March 3, 2026 | R&R Pyramid composite weights; Night Journal consolidation rule |
| 4 | Chat 6e0bf7a8 + 86ae98ef | March 16, 2026 | Bookend warm-up/cool-down architecture; QMQN three-times-daily |
| 5 | Chat 3cd9b824 | April 9, 2026 | Bookend 24-pin connector; pin architecture |
| 6 | This conversation | May 2, 2026 | Two-Layer Architecture; Anchor Revision Mechanism (R-13); Voice + Tone Stream; FAB-HUNGER, FAB-CHRONOTYPE-CHECK, FAB-NAP, FAB-FOCUS, FAB-SOCIAL-JET-LAG additions |

### §13.3 Searches Conducted

Per META-ALGO-001 and the Honest Search Rule. Searches conducted across this canon's drafting:

1. `Journal 24 hour longitudinal hourly segment routine continuous capture`
2. `bookend timestamp contextual phone interaction screen time apps surveillance`
3. `Journal Practice Edition GLP-1 medication scope narrow`
4. `Journal Definition Canon CCO-JOUR-DEF rules R-1 R-13 architecture`
5. `Journal day night entry consolidation R&R Pyramid sleep recovery readiness`
6. `Journal entry algorithm columns Hoop Ollie Mark Max provider hidden`
7. `chronotype assessment social jet lag morning evening`
8. `social jet lag weekday weekend midsleep difference algorithm`
9. `hunger score scale assessment GLP-1 medication`

### §13.4 Hallucination Posture

No formula, variable, name, or rule in this canon was invented during drafting. Every reference traces to either:
- (a) The locked canon corpus (§13.1 Cross-References)
- (b) Val's authored dictation in source conversations (May 2, 2026 + April 26–28, 2026 + March 2026)
- (c) Val's resolution decisions in this drafting session (Block 1 + 2 + 3 confirmations)

Items not traceable to confirmed sources were placed in §12 Open Questions, not asserted in §1–§11.

### §13.5 51/49 Rule Honored

Drafting paused at every architectural decision point pending Val's explicit resolution. Block 1 confirmation, Block 2 confirmation, and Block 3 confirmation were each elicited before the next block began. AI acted as Assistant Editor; Dr. Andrei is the Author.

### §13.6 Supersedes Notice

This canon **supersedes** the pre-canon `CCO-JOUR-001` referenced in chat cfe4b673 (April 26, 2026). The pre-canon ID is retired. Future references should use `CCO-JOUR-DEF-001`.

The companion operational canon `CCO-JOUR-OPS-001` is **queued** and will inherit:
- All architectural rules from this canon (R-1 through R-13)
- All Open Questions in §12 that are operational in nature

### §13.7 Change Log

| Version | Date | Author | Summary |
|---|---|---|---|
| pre-canon CCO-JOUR-001 | April 26, 2026 | Val + Claude | Initial Journal references; deferred to full canon |
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial architectural canon. Two-layer model. R-1 through R-13. Anchor revision (Ollie-owned). Voice + tone stream. Memory Snap component. V-stream → BDC → BDG → Mesh pipeline. Night Journal → R&R consolidation.** |

---

*END — CCO-JOUR-DEF-001 v1.0 PROPOSED / WIP*

*Status: Awaiting Val lock. Companion CCO-JOUR-OPS-001 queued.*

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
