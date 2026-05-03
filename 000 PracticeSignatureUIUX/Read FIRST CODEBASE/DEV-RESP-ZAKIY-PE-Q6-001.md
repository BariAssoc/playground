# DEV-RESP-ZAKIY-PE-Q6-001
## Practice Edition GLP-1 — Answers to Zakiy's 6 Questions
### (Unified Brief: Chat 333600 Answers + May 2 Canon Updates)

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — DEVELOPER RESPONSE BRIEF
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    DEV-RESP-ZAKIY-PE-Q6-001
TITLE:          Practice Edition GLP-1 — Answers to Zakiy's 6 Questions
                (Unified Brief: Chat 333600 Answers + May 2 Canon Updates)
VERSION:        v1.0
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
TO:             Zakiy Manigo, Lead Developer
FROM:           Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only, not authoring
DATE:           May 2, 2026

PURPOSE:        Single-source answer brief for the 6 Practice Edition questions
                Zakiy raised. Combines the prior locked answers from chat 333600
                (DEV-WORK-D0LITE-001 v0.3 work) with the architectural refinements
                from today's coordinated canon lock (EXPR v2.0 + LOGO v1.1 +
                RBSHELF v1.1 + MEMO-CARD-COMM-001).

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §0. EXECUTIVE SUMMARY FOR ZAKIY

Zakiy — your 6 Practice Edition questions have answers. 5 are locked. 1 (Inner Circle visibility window) is still open and waiting on Val.

**Quick reference:**

| # | Question | Status | Short answer |
|---|---|---|---|
| 1 | Where to collect Hunger / Chronotype / SJL? | ✅ LOCKED | Journal — via FAB R-3 mechanism + D0 Anchor row for one-time intake |
| 2 | How to display them for Day 0–7? | ✅ LOCKED | Hunger Score + Chronotype = Task FABs in Slot Cards. Anchors = reference only. SJL = NEVER displayed (Silent FAB) |
| 3 | Display labs (FibroScan)? Where? | ✅ LOCKED | Healthspan tile (Surface #2) → PRESS → Ground Levels. Day 7+ unlock. Pyramid (R&R) does NOT carry labs. |
| 4 | Appointments — Journal or Calendar? | ✅ LOCKED | BOTH. Calendar = future-facing. Journal = past-facing, sealed via Bookend after appointment. |
| 5 | Inner Circle visibility 0–60+ days? | 🟡 OPEN — OQ-T3 | Recommended: limited mode D0, full unlock Day 30+. **Awaiting Val's call.** |
| 6 | Chat button popup from AI Playground in PE? | ✅ LOCKED | YES — keep exactly as current build. No simplification. |

**This document expands each answer with the architectural reasoning + the May 2, 2026 canon updates that strengthen or refine the answer.**

---

## §1. CONTEXT — WHY THIS BRIEF EXISTS

You asked these questions during the v0.3 Practice Edition (GLP-1 Vertical) spec work in chat "333600 Final A" (https://claude.ai/chat/75b78eae-d10f-4138-aabd-f0b4e92b7352). Five answers were locked there. Today (May 2, 2026), four additional canons were filed in a coordinated lock that **strengthens or refines** those answers:

| Canon filed today | Relevance to your questions |
|---|---|
| **CCO-ENG-EXPR-001 v2.0** (Expression Engine Canon) | Defines the 7 Expression Surfaces, the 4-color cascade, ISE permission map, Smile Doctrine (selective cascade), Universal Bookend Doctrine — affects Q3, Q4, Q6 |
| **CCO-ENG-LOGO-EXPR-001 v1.1** (Logo Expression Canon) | Defines BREATH ANCHOR (Surface #7), BioSnap cool-down per type, A6 event logging — affects Q4 (BioSnap → appointment) and Q6 (cascade integration with Morpheus) |
| **CCO-UX-RBSHELF-001 v1.1** (Routine Bookshelf Canon) | Defines TIME ANCHOR (Surface #1), 17-slot sub-segment architecture, FAB-to-slot mapping rules, slot expression activation — affects Q1, Q2, Q4 |
| **MEMO-CARD-COMM-001** (Cards as Communication Layer) | Defines cards as the communication layer with 4 origin paths; introduces **Slot Card** as the Bookshelf-side card variant — affects Q1, Q2, Q3 |

The prior answers from chat 333600 remain correct. Today's canon work makes them more architecturally precise and adds new specificity (especially around the Slot Card concept).

---

## §2. THE FOUR-CARD-ORIGIN MODEL — REQUIRED CONTEXT

Before answering Q1–Q6, you need this architectural framing because every answer references one of these card origins.

Per **MEMO-CARD-COMM-001 (May 2, 2026)**:

> **Cards are the communication layer of BariAccess.** Cards are not a UX widget — they are the surface where the system speaks to the patient and the patient generates journals back to the system.

**Four card origins:**

| # | Origin | Trigger | Surface | Authority canon |
|---|---|---|---|---|
| **1** | **Program-originated** | Program opens on Rhythm Board | Rhythm Board card area (Cards 1, 2, 3 + Memory Snap) | CCO-UX-RBCARD-001 |
| **2** | **Q-originated** | Patient taps Q icon → Q dropdown | Q dropdown context (Rhythm Board header) | CCO-UX-RBDROP-001 |
| **3** | **Constellation Panel-originated** | Tile or tracker tap (R&R, Healthspan, etc.) | On top of Constellation Panel | **CCO-UX-CARD-001** v1.0 (ON HOLD) |
| **4** | **Bookshelf-originated** ← *NEW May 2, 2026* | Tap on active Bookshelf slot or umbrella tile | Bookshelf area in Rhythm Board | CCO-UX-RBSHELF-001 v1.1 + future CCO-UX-CARD-COMM-001 |

**Plus:** patient-driven "more" path (on-demand additional cards — mechanism TBD).

**Critical bridge:** Cards are the front-end of the Journal Entry Algorithm. Every card interaction is a potential journal touchpoint.

---

## §3. SURFACE INVENTORY — REQUIRED CONTEXT

Per **CCO-ENG-EXPR-001 v2.0 §3** (May 2, 2026), the BariAccess UI has 7 Expression Surfaces:

| # | Surface | Role |
|---|---|---|
| **1** | Routine Bookshelf | **TIME ANCHOR** — drives cascade by clock |
| **2** | Signal Bar tiles (Row 1: R&R, Healthspan, My Blueprint, Inner Circle) | Cascade-only |
| **3** | Rim (around tiles + trackers) | Cascade-only when triggered |
| **4** | Ollie's Space (Row 2) | Cascade + Pearl White overnight |
| **5** | AI Playground / Morpheus | Cascade-only — coordinates with Ollie's Space |
| **6** | Daily Pulse trackers (Row 5) | Cascade-only |
| **7** | The Logo | **BREATH ANCHOR** — continuous + BioSnap drops |

This inventory matters for several of your questions.

---

# §4. THE 6 ANSWERS

---

## Q1. Where to collect Hunger Score / Hunger Assessment / Chronotype / SJL?

### ✅ LOCKED ANSWER

**Journal — but in different layers and via different mechanisms.**

Per **Journal Canon v1.0 (CCO-JOUR-DEF-001)** + **FAB Canon v2.0 Pass 1** + **Practice Edition canon updates (May 2, 2026)**:

| Item | Collection mechanism | Layer | Module |
|---|---|---|---|
| **Hunger Assessment** (HM-INTAKE-001 v1.0) | One-time intake form pre-BBS | L1 — D0 Anchor row | Intake module → writes to Journal as Anchor |
| **Hunger Score** (0–10 daily) | **FAB-HUNGER™** (Metabolic family, Task FAB, Variable scale) | L1 + L2 | Journal via R-3 mechanism #2 (FAB) |
| **Chronotype Quiz** (5-question MEQ, one-time) | One-time intake at D0 | L1 — D0 Anchor row | Intake module → writes to Journal as Anchor |
| **FAB-CHRONOTYPE-CHECK™** (daily) | Task FAB (Circadian family) | L1 + L2 | Journal via R-3 mechanism #2 (FAB) |
| **FAB-SOCIAL-JET-LAG™** | Computed nightly (Silent FAB, Circadian family) | L1 only | Journal Layer 1 — does NOT display |

### 🆕 May 2, 2026 Refinement — Slot Card placement

**Per RBSHELF v1.1 §14 (FAB-to-Slot Mapping Rules):** The daily FABs (Hunger Score, Chronotype Check) now have specific time-coded Bookshelf slot placements:

| FAB | Likely slot placement | Reasoning |
|---|---|---|
| **FAB-CHRONOTYPE-CHECK™** | AM1 (~6:30 AM) | Anchor slot — wake/morning anchor, ties to chronotype rhythm |
| **FAB-HUNGER™** | A1 / A2 / Mid1 / B1 (depending on patient GLP-1 timing) | Bridge slots or anchor slots aligned to injection-decision moments |
| **FAB-SOCIAL-JET-LAG™** | No slot placement (Silent FAB — backend-only) | Computed nightly, never surfaces to patient |

### 🛠 Implementation guidance for you

**Build:**

1. **Intake Module** — captures Hunger Assessment + Chronotype Quiz at D0 (likely during BBS visit with Pamela). Writes results to Journal as **Anchor rows** (revisable per Journal Canon §4).

2. **FAB capture pipeline** (already part of Journal R-3 mechanism #2) — the daily FABs (Hunger Score, Chronotype Check) flow through the standard FAB pipeline. No new module needed.

3. **Silent FAB pipeline** — FAB-SOCIAL-JET-LAG™ is computed nightly from sleep data. Do NOT surface to patient UI.

4. **Slot integration** — the daily Task FABs are now slot-anchored. Surface them in the Bookshelf at their assigned slot. Patient taps slot → **Slot Card** opens revealing the FAB(s) for that slot.

---

## Q2. How to display them for Day 0–7?

### ✅ LOCKED ANSWER

**Per Journal Canon §3 (Two-Layer Architecture):**

| Item | Layer 2 Display? | Where? |
|---|---|---|
| **Hunger Score (FAB-HUNGER™)** | ✅ YES (Task FAB) | Slot Card (when patient taps slot); daily card in WorkPad if program active |
| **Hunger Assessment** (D0 anchor) | ⚠️ REFERENCE ONLY — not daily display | Patient profile / "About me" section; Ollie can recall on demand |
| **FAB-CHRONOTYPE-CHECK™ daily** | ✅ YES (Task FAB) | Slot Card (likely AM1 slot); Bookshelf integration |
| **Chronotype Quiz** (D0 anchor) | ⚠️ REFERENCE ONLY | Same as Hunger Assessment — anchor row, accessible but not daily |
| **FAB-SOCIAL-JET-LAG™** | ❌ **NEVER DISPLAYED** (Silent FAB) | Computed only — Ollie reads, patient doesn't see the number |

### 🆕 May 2, 2026 Refinement — Slot Card is the canonical UI surface

**Per MEMO-CARD-COMM-001 + RBSHELF v1.1 §6.5.4:**

The **Slot Card** is the canonical surface for revealing Day 0–7 FAB content. When the patient taps an active Bookshelf slot:

| Slot color | Tap behavior | Slot Card opens? |
|---|---|---|
| **Default / dormant** | Nothing — outside time-window | ❌ No |
| **Blue** (announce) | Optional acknowledge | 🟡 Optional — reveals upcoming routine context |
| **Green** (in progress / complete) | Reveal FABs underneath | ✅ Yes |
| **Orange** (active + drift) | Reveal problematic FAB(s) | ✅ Yes — for learning |
| **Gray** (timed out, missed) | Reveal what was missed | ✅ Yes — for learning |
| **Pearl White** (overnight) | Dormant — guardian state | ❌ No |

### 🛠 Implementation guidance for you

**Build the Slot Card behavior** as part of RBSHELF v1.1 §6.5.4 + §8.1 specification:

1. **Tap on active slot** → Slot Card opens (NOT Program WorkPad — that's a different surface entirely)
2. **Slot Card reveals** the FAB(s) underneath that slot with their current color states (per OQ-EXPR-07, FAB-level colors deferred to v1.2 — working hypothesis: green=on track, orange=drift, blue=announce)
3. **Slot Card is the journal touchpoint** — patient interaction here can produce journal entries via Cards-as-Communication-Layer pipeline (per MEMO-CARD-COMM-001 §3)
4. **Routine runs in BACKGROUND**, NOT in WorkPad. Tapping a slot does not open a Program WorkPad. (This is the most consequential single rule from RBSHELF v1.1.)

**Critical:** OQ-T-W-01 (timeout times per chronotype) is still open — exact slot time-windows for Practice Edition Day 0–7 patients need Val's chronotype-specific call.

---

## Q3. Display labs (FibroScan, etc.)? How and where?

### ✅ LOCKED ANSWER

**Healthspan Tile (Signal Bar Surface #2) → PRESS → Ground Levels (horizontal swipe). Day 7+ unlock.**

Per **DEV-WORK-D0LITE-001 v0.3 §8** (locked May 2, 2026) + **CCO-UX-CARD-001 v1.0** (Constellation Panel Cards):

- **Healthspan Tile = Tile 2 in the Signal Bar (Row 1 of Constellation Panel)**
- Patient TAP on Healthspan tile → Blip Card (quick summary)
- Patient PRESS on Healthspan tile → Constellation Panel-originated card opens with Ground Levels (horizontal swipe gesture)
- **All labs in ONE deep Ground Level** for Phase 1 simplification:
  - FibroScan (V1)
  - Body composition (V1 — InBody / SECA mBCA)
  - Cardiorisk
  - Lipid panel
  - HbA1c
  - Insulin (V1)
- Each lab = swipeable horizontal card within that level

### 🚫 What labs do NOT do

**Pyramid (R&R Tile 1) does NOT contain individual labs.** The Pyramid holds aggregated composites + sub-scores only. Per Val's correction in chat 333600: *"the pyramid is only in R&R; the blood testing and individual blood testing are extreme under the ground levels."*

**Day 0–7 (R&R window):** Labs not displayed. Healthspan tile is locked until Day 7+ per timespan progression model.

### 🆕 May 2, 2026 Refinement — EXPR v2.0 surface mechanics

Today's EXPR v2.0 §3.2 confirms:
- Signal Bar tiles are **Surface #2** in the 7-surface inventory
- Tile cascade behavior: tile rim activates when relevant content fires (per OQ-EXPR-03 RESOLVED)
- When a clinical signal lands on a lab (e.g., FibroScan score crosses threshold), the cascade can fire selectively — Healthspan tile rim renders cascade color (Orange/Green/etc. per ISE permission map at §4.3)

### 🛠 Implementation guidance for you

**Build:**

1. **Healthspan tile Ground Levels card** (Origin #3 — Constellation Panel-originated, per CCO-UX-CARD-001 §4.7)
2. **Single deep level** containing all labs as horizontal swipe cards (Phase 1)
3. **Cascade integration** — when a lab signal triggers ISE re-evaluation, the Healthspan tile rim fires the cascade color per EXPR v2.0 §4.3 ISE permission map
4. **Day 7 unlock** per Practice Edition timespan model (DEV-WORK-D0LITE-001 v0.3 §2)
5. **Architecture must support expansion** — additional ground levels per CARD-001 Rule 5 ("More Cards Can Be Added")

---

## Q4. Display Appointments — Journal or Calendar card?

### ✅ LOCKED ANSWER

**BOTH — but architecturally distinct, with the Universal Bookend Doctrine connecting them.**

Per **Journal Canon R-3 + R-9 (Bookend rules)** + **EXPR v2.0 §8 (Universal Bookend Doctrine)**:

| Surface | Purpose | Mechanism |
|---|---|---|
| **Calendar / Calendly card** | Future-facing — scheduling + reminder | Native Calendly integration (per memory rule #29). Card surfaces upcoming appointment(s) on Rhythm Board. |
| **Journal entry** | Past-facing — sealed event log ("appointment happened on X with Y, outcome Z") | R-3 mechanism #2 (FAB) or #3 (Ollie Yes/No) — entry sealed via Bookend (R-9) after appointment occurs |

**Same data, different temporal lens.** Each entry retains both `calendarRefId` and `journalRefId` for reconciliation.

### 🆕 May 2, 2026 Refinement — Universal Bookend Doctrine

Per **EXPR v2.0 §8.6** (Universal Bookend Doctrine extends to programs and ITBs and appointments):

An appointment is a **bookended event** following the three-phase pattern:

| Phase | Mechanism | Surface |
|---|---|---|
| **Warm-up** | Calendar card displays "upcoming appointment with Pamela on Friday 10am" + reminder pulse | Rhythm Board / Calendar surface |
| **Content** | Appointment occurs (in person, by Zoom, by phone) | External — provider workflow |
| **Cool-down** | Ollie/AskABA closes a Bookend → Journal entry sealed with outcome | Journal surface |

This is **architecturally identical** to how FABs and BioSnaps work (per EXPR v2.0 §8). Same pattern. Different content.

### 🛠 Implementation guidance for you

**Build BOTH surfaces:**

1. **Calendar card** (Origin #1 — Program-originated OR Origin #2 — Q-originated; Calendly drives the data)
   - Surfaces upcoming appointments on Rhythm Board
   - Tap on calendar card → Calendly UI / appointment detail
   - Reminder pulse 24h / 1h before (timing per OQ — to be locked)

2. **Journal entry sealing** (Bookend close per Journal Canon R-9)
   - After appointment time passes, Ollie/AskABA prompts patient: *"How did your appointment with Pamela go?"*
   - Patient response → Journal entry created (Past tense), sealed via Bookend
   - Entry retains `calendarRefId` (so it links back to the original calendar event) AND `journalRefId` (its own ID)

3. **Day 7–30 (Healthspan window)** is when this becomes most active per Practice Edition v0.3 — first labs return, first dose adjustment, first follow-up appointments

---

## Q5. When should Inner Circle tile be shown in 0–60+ days? 🟡 STILL OPEN

### 🟡 STATUS: OPEN — OQ-T3 IN DEV-WORK-D0LITE-001 v0.3

This is the only one of your 6 questions that does NOT have a locked answer. Val has not made the call yet.

### Recommendation from chat 333600 (Claude's read, not Val-locked)

**Option (c) — Limited mode at D0, full unlock at Day 30+**

Reasoning:
- Inner Circle is **Surface #2** Tile 4 in the 7-surface inventory (per EXPR v2.0 §3.2). It is canonical architecture and non-negotiable per memory rule #4 governance.
- **Always-visible from D0** preserves architecture; **hard-locking Inner Circle** could break the Inner Circle governance metric (S = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4 — independent V1–V4 pipeline per memory rule #4).
- **Limited mode** (tile visible at D0, content minimal — e.g., "Welcome card from Pamela") preserves the architecture while acknowledging that Practice Edition cohorts at Bariatric Associates PA are too small at D0 to justify full social features.
- **Full social features unlock at Day 30+** when patient has accumulated enough behavioral data and credit history for tier progression to feel meaningful.

### Three options Val must choose between

| Option | Description | Risk |
|---|---|---|
| **(a) Always visible from D0** | Tile shows full content from Day 1 | Patient sees empty/sparse social features early — low engagement |
| **(b) Locked until Day 30+** | Tile completely hidden until Day 30 | Breaks canonical 4-tile Signal Bar architecture |
| **(c) Limited mode at D0, full unlock Day 30** | Tile visible from D0 with minimal content; full features Day 30+ | Slightly more engineering work; preserves architecture; tunes UX expectations |

### 🛠 Implementation guidance pending Val's call

**Until Val locks OQ-T3, do not ship Inner Circle behavior in Practice Edition.** Build infrastructure assuming option (c) is most likely (least architectural risk), but do not deploy the visibility logic until Val confirms.

**This is the one blocker for you.** All other Practice Edition Day 0–7 work can proceed.

---

## Q6. Display chat button popup from AI Playground in Light Practice Edition?

### ✅ LOCKED ANSWER

**YES — chat button stays exactly as in current build. No simplification.**

Reasoning (per chat 333600 + your override accepted in v0.2):

1. **Memory rule (Zakiy override accepted):** *"AI Playground is the biggest thing in the constellation panel because the AIs are what is controlling, picking up all the data."* → AI Playground simplification is rejected.

2. **CCO-WP-5149-001 (51/49 WorkPad canon):** Chat is the primary patient-Ollie interaction surface. Stripping it for Practice Edition would break the engagement spine.

3. **Practice Edition rationale:** PE is a **configuration**, not a feature reduction. The AI Playground is the universal layer; reducing it weakens the platform's distinguishing differentiator.

### 🆕 May 2, 2026 Refinement — Surface #5 Morpheus mechanics

Per **EXPR v2.0 §3.5** (AI Playground / Morpheus):

- AI Playground = Surface #5 in the 7-surface inventory
- Mode: Cascade-only (does not fire independently)
- **Morpheus** is the AI display state BEFORE it resolves into Ollie (owl icon) or AskABA (mask icon)
- Behavior (per OQ-EXPR-05 RESOLVED): Morpheus follows Ollie's Space rules **exactly** — same timing, same color, same pulsation (heartbeat rhythm, 4 pulsations)
- Then resolves into Ollie or AskABA based on context

**This means the chat button popup is part of the cascade.** When Ollie's Space (Surface #4) lights up Blue/Green/Orange, AI Playground (Surface #5) coordinates to the same color in the same render frame (Smile Doctrine per EXPR v2.0 §7).

### 🛠 Implementation guidance for you

**No change from current build.** Chat button popup mechanics stay exactly as they are.

**Architectural note for future cascade integration:** AI Playground is now formally Surface #5 in EXPR v2.0. When you implement the cascade engine (Smile Doctrine), AI Playground must color-sync with Ollie's Space within the same render frame. This is consistent with how you have it built today; this canon now formalizes the rule.

---

# §5. SUMMARY TABLE — ONE SHEET FOR YOU

| # | Question | Answer | Build path | Status |
|---|---|---|---|---|
| 1 | Where to collect H/HA/CT/SJL? | Journal — FAB R-3 mechanism + D0 Anchor for one-time intake | Build Intake Module + use existing FAB pipeline + Slot Card integration | ✅ Build now |
| 2 | How to display them Day 0–7? | Hunger Score + Chronotype = Task FABs surfaced via Slot Cards. Anchors = reference only. SJL = never displayed (Silent FAB). | Build Slot Card per RBSHELF v1.1 §6.5.4 + §8.1 | ✅ Build now |
| 3 | Display labs (FibroScan)? | Healthspan tile (Surface #2) PRESS → Ground Levels horizontal swipe. Day 7+ unlock. Pyramid (R&R) does NOT carry labs. | Build Healthspan Ground Levels card per CARD-001 §4.7 | ✅ Build now (Day 7 unlock) |
| 4 | Appointments — Journal or Calendar? | BOTH. Calendar = future. Journal = past, sealed via Bookend. | Build Calendly integration + Bookend close → Journal entry pipeline | ✅ Build now (most active Day 7–30) |
| 5 | Inner Circle visibility? | Recommended: limited mode D0, full unlock Day 30+. Awaiting Val's lock. | DO NOT BUILD until Val locks OQ-T3 | 🟡 BLOCKED — needs Val |
| 6 | AI Playground chat in PE? | YES — keep exactly as current build | No change. Future: ensure Morpheus color-syncs with Ollie's Space (cascade) | ✅ No change needed |

---

# §6. WHAT I NEED FROM VAL (FOR ZAKIY)

To unblock the full Practice Edition Day 0–7 build:

| # | Open question | Owner | Blocker for |
|---|---|---|---|
| **OQ-T3** | Inner Circle visibility — (a), (b), or (c)? | Val | Q5 — Inner Circle behavior in Practice Edition |
| **OQ-T-W-01** | Slot timeout times per chronotype | Val | Q2 — exact slot time-windows for Day 0–7 patients |
| **OQ-G1** | Hunger Score scale + formula | Val | Q1 — FAB-HUNGER™ thresholds |
| **OQ-G2** | Chronotype assessment method (single survey vs longitudinal) | Val | Q1 — Chronotype FAB capture rules |
| **OQ-G3** | Dose adjustment cadence (7 vs 9 days) | Val | Q4 — appointment timing for dose adjustments |

---

# §7. CANON REFERENCES — FOR YOUR DEEP READ

If you want to verify any of these answers against source canon:

| Canon | What it covers | Filed |
|---|---|---|
| **CCO-ENG-EXPR-001 v2.0** | 7 surfaces, 4-color cascade, ISE permission, Smile Doctrine, Universal Bookend Doctrine | May 2, 2026 |
| **CCO-ENG-LOGO-EXPR-001 v1.1** | BREATH ANCHOR, BioSnap cool-down per type, A6 logging | May 2, 2026 |
| **CCO-UX-RBSHELF-001 v1.1** | TIME ANCHOR, 17-slot architecture, FAB-to-slot mapping, Slot Card behavior | May 2, 2026 |
| **MEMO-CARD-COMM-001** | Cards as communication layer, 4 origin paths, Slot Card variant, Cards → Journals bridge | May 2, 2026 |
| **CCO-UX-CARD-001 v1.0** (ON HOLD) | Constellation Panel cards (Origin #3) — Swipe / Rolling / Blip / Card Program | March 18, 2026 |
| **CCO-UX-RBCARD-001 v1.0** (WIP) | Rhythm Board card area (Origin #1) | April 2026 |
| **CCO-JOUR-DEF-001 v1.0** (Journal Canon) | Two-layer architecture, R-1 to R-13 rules, mechanisms | May 2, 2026 (referenced) |
| **CCO-FAB-001 v2.0 Pass 1** (FAB Canon) | 7 families, Task/Silent visibility, named FABs | May 2, 2026 (referenced) |
| **DEV-WORK-D0LITE-001 v0.3** | Practice Edition GLP-1 Vertical spec | May 2, 2026 |
| **HM-INTAKE-001 v1.0** | Hunger Assessment intake form | April 4, 2026 |

---

# §8. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| v1.0 | May 2, 2026 | Val + Claude | Initial unified brief. Combines 6 prior answers from chat 333600 with May 2 canon refinements (EXPR v2.0 + LOGO v1.1 + RBSHELF v1.1 + MEMO-CARD-COMM-001). 5 questions LOCKED, 1 OPEN (Inner Circle OQ-T3). |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF DOCUMENT — DEV-RESP-ZAKIY-PE-Q6-001
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. Internal use only.
