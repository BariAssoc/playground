# CCO-ENG-EXPR-001 v2.0
## Expression Engine Canon

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL SPECIFICATION
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-ENG-EXPR-001
TITLE:          Expression Engine Canon
VERSION:        v2.0
TIER:           ENGINE — Lane 1 Render Authority
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
CO-EDITOR:      Claude (Anthropic) — AI assist, not creator
DRAFT DATE:     May 2, 2026

SUPERSEDES:     CCO-UX-EXPR-001 v1.0 (UX tier — promoted to Engine)
                Inverted ISE numbering in §4.2 of prior v1.0 (deprecated)
                
DEPENDS ON:     ISE Canon v3.0 (Feb 20, 2026)
                Beacon Canon v1.1 (Jan 30, 2026) — separate system, never cross-referenced
                CCO-ENG-LOGO-EXPR-001 v1.1 (May 2, 2026) — owns Surface #7 (companion lock)
                Stability Coefficient Canon (Feb 27, 2026)
                
COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE

Expressions are the visual and tonal language of BariAccess. They are how the system communicates patient state, program activity, biometric drift, and AI presence to the patient — without requiring the patient to understand the logic that produced them.

Generically — to the patient — they are simply **expressions**. ISE governs them in the background. The patient does not see ISE. The patient sees a color, a pulsation, a tile rim warming, a slot lighting up, a breath shifting on the logo.

This canon defines:

- The seven coordinated expression surfaces
- The four-color cascade taxonomy and the two reserved colors
- The ISE permission map (using ISE Canon v3.0 numbering)
- The two-anchor architecture (TIME anchor + BREATH anchor)
- The Smile Doctrine — 7-surface coordination rules
- The Universal Bookend Doctrine — three-phase expression pattern
- The Routine Bookshelf ↔ Ollie's Space connection rules

This canon is **Engine-tier**, not UX-tier. The Two-Lane Authority of ISE Canon v3.0 designates Expression as Lane 1 render authority — meaning expressions are the canonical render output of resolved state, not decorative UI.

---

## §2. WHAT GOVERNS EXPRESSIONS

### 2.1 ISE is the canonical state authority

ISE Canon v3.0 owns the state semantics. The Resolver outputs **ONE** state per cycle (priority chain, stateless dispatcher). No AI agent — Ollie, Max/AskABA, no other actor — may independently infer patient readiness or trigger an expression by guessing state.

**Architectural rule:** Expressions render what ISE resolves. Nothing more, nothing less.

### 2.2 Two-Lane Authority (inherited from ISE Canon v3.0 §3.1)

| Lane | Owner | Function |
|---|---|---|
| **Lane 1 — Render** | This canon (CCO-ENG-EXPR-001) | What surfaces show, in what color, at what intensity |
| **Lane 2 — Enforcement** | Downstream systems (Credits, Privilege Gate, AI behavioral governance) | What the AI is permitted to do or say in that state |

The Expression Layer **publishes** state via render. Downstream systems **read** the state and make their own gating decisions. Expression does not gate; Expression renders.

### 2.3 What ISE state determines

For every resolved state, ISE determines:

- Which expression surfaces are eligible to render
- What color is permitted (per §4.3 permission map)
- What intensity (steady, flicker, pulsate, or silent)
- What tone Ollie uses (per §7.5 Tone-to-Color mapping)

### 2.4 Three independent feeds produce expression triggers

Expressions can fire from any of three feeds running in parallel:

| Feed | Source | Detects |
|---|---|---|
| **ISE Resolver** | PAC-ISE-002 v2.0 | State change requiring re-render |
| **Beacon Pipeline** | Beacon Canon v1.1 | Score band crossings, pre-signal velocity, clinical intersection |
| **Stability Coefficient Engine** | SC Canon | V2 drift first ("SC catches the canary") triggering ISE re-evaluation |

Beacon and SC operate independently of ISE. Their outputs feed into ISE re-evaluation and into expression triggers. **Expression Layer is entirely separate from Beacon — never cross-references Beacon bands for color authority.** (Memory rule, April 22, 2026 — preserved.)

---

## §3. THE SEVEN EXPRESSION SURFACES

### 3.1 Surface #1 — Routine Bookshelf — TIME ANCHOR

**Location:** Permanent display in Rhythm Board (resizes during Vertical Split, never removed by patient or AI)
**Owner:** Provider deposits at Day 1 (D0); operated by patient + Ollie
**Mode:** Event-driven — slots activate at their time-window
**Special role:** TIME ANCHOR for the cascade. When a slot activates, the cascade fires through the other 5 cascade-eligible surfaces.

**Surface display:**
```
[ AM ]   [ Mid ]   [ PM ]    (umbrella level — visible to patient)
```

**Encoding layer (17-slot system, per CCO-UX-RBSHELF-001 v1.1 §6.5 — to be drafted):**
```
AM1 · AM2 · AM3 · A1 · A2 · A3 · A4 · Mid1 · Mid2 · Mid3 · B1 · B2 · B3 · B4 · PM1 · PM2 · PM3
```

**Authority:** CCO-UX-RBSHELF-001 v1.1 (RBSHELF canon — to be drafted in this session sequence).

### 3.2 Surface #2 — Signal Bar Tiles (Row 1 of Constellation Panel)

**Location:** Row 1 — four tiles (R&R, Healthspan, My Blueprint, Inner Circle)
**Mode:** Cascade-only (does not fire independently)
**Expression mechanism:** Tile body color + rim activation

**Authority:** CCO-CP-ARCH-001 (Constellation Panel Architecture — to be reconciled with April 9–10 override).

### 3.3 Surface #3 — Rim (around tiles and trackers)

**Location:** Surrounds Row 1 tiles AND Row 5 trackers
**Mode:** Cascade-only
**Activation:** **Only when triggered** (per OQ-EXPR-03 RESOLVED in v1.0). Default state = no rim. Active state = rim renders in cascade color.

**Rim signaling vocabulary:**

| Behavior | Meaning |
|---|---|
| **Beeping** | Something to open |
| **Flickering** | Something to open |
| **Pulsating** | Something to open |
| **Steady (no rim)** | Nothing pending |

### 3.4 Surface #4 — Ollie's Space (Row 2 of Constellation Panel)

**Location:** Row 2 — fixed position, primary expression surface
**Mode:** Cascade-eligible AND limited independent fire (Pearl White overnight)
**Special property:** Steady message — no marquee. All messages and all colors use bolded/3D outline font (per OQ-EXPR-02 RESOLVED).

**Expression carrier:** Only Ollie carries expressions in Ollie's Space. AskABA does NOT express in Ollie's Space. When Ollie turns Purple, that signals AskABA/Max is incoming — but AskABA itself speaks in the AI Playground, not in Ollie's Space.

**Pulsation rule (per OQ-EXPR-04 RESOLVED):** On every new message change (any color, any type), Ollie's Space pulsates at heartbeat rhythm for **exactly 4 pulsations**, then holds steady until next message.

**Authority:** CCO-UX-OLLIE-001 (Ollie's Space Canon — WIP).

### 3.5 Surface #5 — AI Playground / Morpheus

**Location:** Between Row 2 and Row 5 (above the Daily Pulse band)
**Mode:** Cascade-only
**Special property:** Morpheus is the AI display state BEFORE it resolves into Ollie (owl) or AskABA (mask).

**Behavior (per OQ-EXPR-05 RESOLVED):** Morpheus follows Ollie's Space rules **exactly** — same timing, same color, same pulsation (heartbeat rhythm, 4 pulsations). Then resolves into Ollie or AskABA based on context.

**Authority:** CCO-WP-5149-001 (51/49 WorkPad / AI Playground canon — WIP, requires reconciliation per April 9–10 override).

### 3.6 Surface #6 — Daily Pulse Trackers (Row 5 of Constellation Panel)

**Location:** Row 5 — six trackers (FAB, ITB, BEACON, ROUTINE, PROD, PARK)
**Mode:** Cascade-only
**Expression mechanism:** Tracker rim activation + fill color

**Operational distinction:** When a Daily Pulse tracker rim turns Orange, this specifically signals that a program is being triggered — escalation to Row 5 program response. (Per V dictation clarification, May 2, 2026.)

**Authority:** Daily Pulse canon (TBD — not yet drafted).

### 3.7 Surface #7 — The Logo — BREATH ANCHOR

**Location:** Top-right of Rhythm Board header (per Voice Memory Rule, April 22, 2026)
**Mode:** **Independent fire** (continuous Rhythm Signal breath) AND cascade-eligible (when BioSnap drops)
**Special role:** BREATH ANCHOR. The only surface that runs continuously and can fire without cascade.

**Composition:** Unified Rhythm Signal + BioSnap (per CCO-ENG-LOGO-EXPR-001 v1.1 §4.1):
- **Rhythm Signal** = the continuous breath (Normal → Attention → Snap Active)
- **BioSnap** = the event-driven content drop (7 canonical types)

**Authority:** CCO-ENG-LOGO-EXPR-001 v1.1 (Logo Expression Canon — companion lock May 2, 2026). This canon does NOT redefine the Logo's behavior; it inherits from CCO-ENG-LOGO-EXPR-001.

### 3.8 Summary — Cascade Eligibility Matrix

| # | Surface | Independent fire? | Cascade fire? | Authority document |
|---|---|---|---|---|
| 1 | Routine Bookshelf | ❌ No | ✅ Drives cascade (TIME anchor) | RBSHELF-001 v1.1 |
| 2 | Signal Bar tiles | ❌ No | ✅ Yes | CP-ARCH-001 |
| 3 | Rim | ❌ No | ✅ Yes (when triggered) | This canon |
| 4 | Ollie's Space | 🟡 Limited (Pearl White overnight) | ✅ Yes | OLLIE-001 |
| 5 | AI Playground / Morpheus | ❌ No | ✅ Yes | WP-5149-001 |
| 6 | Daily Pulse trackers | ❌ No | ✅ Yes | Daily Pulse canon (TBD) |
| 7 | The Logo | ✅ Yes (continuous breath) | ✅ Yes (BioSnap drop) | LOGO-EXPR-001 v1.1 |

---

## §4. COLOR TAXONOMY

### 4.1 The 4-Color Cascade (LOCKED)

Four colors operate in active expression coordination across the cascade-eligible surfaces:

| Color | Function | Trigger condition |
|---|---|---|
| **Purple** | AI handoff — Max / AskABA takeover | Ollie hands off to Max. Icon morph: owl → mask. |
| **Orange** | Alert — pre-signal / signal / attention | Pre-signal detected; signal detected; attention needed; misalignment detected |
| **Green** | Action mode / call to action / in shape | "Let's do a program." / "Routine on track." / Slot complete. |
| **Blue** | Communication / confirmation / announcement | Ollie speaking naturally — informational, scheduling, check-in, AM routine announcement |

**Cascade state machine (default flow):**
```
Default ambient → Orange (pre-signal) → Green (action) → Blue (confirmation) → Default
```

**Hard rule:** Expression Layer color taxonomy is **entirely separate from Beacon bands** (memory rule, April 22, 2026). The cascade colors are Ollie-driven, not Beacon-band-driven. No surface in the cascade reads Beacon directly for color.

### 4.2 The 2 Reserved Colors (LOCKED)

Two colors operate **outside** the cascade. They render on specific surfaces under specific conditions and do NOT propagate through the 7-surface synchronization.

| Color | Function | Cascade behavior |
|---|---|---|
| **Pearl White** | Rest / sleep / guardian mode | ❌ NO cascade. Renders on Logo + Ollie's Space only. Other 5 surfaces remain dormant. |
| **Red** | Clinical override — abnormal lab / SC < 65 / clinical intersection | ❌ BYPASS cascade. Routes direct to Provider Dashboard. May render Red on tile rim of affected score, but does NOT trigger normal 7-surface synchronization. |

**Why reserved (not cascade):**

- **Pearl White** is a guardian state. The patient is resting; the system is watching. Lighting up 7 surfaces during sleep would defeat the purpose. Pearl White lives only where presence matters — on the Logo (continuous breath) and in Ollie's Space (visible if patient looks).
- **Red** is a clinical override. It must NOT be diluted by cascade — it routes direct to provider, bypassing the patient-facing coordination that other colors use. Red is a safety route, not an expression cascade.

### 4.3 ISE Permission Map (CORRECTED — adopts ISE Canon v3.0 numbering)

**This map replaces the inverted severity numbering used in CCO-UX-EXPR-001 v1.0 §4.2.** The v1.0 mapping (where ISE-0 = Emergency, ISE-1 = Crisis Support) is deprecated. ISE Canon v3.0 numbering is canonical.

| ISE State | Name | Cascade colors permitted | Reserved colors |
|---|---|---|---|
| **ISE-0** | Neutral / Baseline | Blue (calm default) | Pearl White (overnight) |
| **ISE-1** | Aligned / Available | Blue, Green, Orange (Ollie may push, challenge, offer) | Pearl White |
| **ISE-2** | Protective / Recovery-Forward | Blue, Orange (no Green — no celebration in protective mode) | Pearl White |
| **ISE-3** | Contained / Load-Limited | Orange only (one-thing-only) | — |
| **ISE-4** | Building / Momentum | Blue, Green (reinforce rhythm — no excessive celebration) | Pearl White |
| **ISE-5** | Restricted / Guarded | Purple (AskABA handoff) | **Red bypass** (clinical override → provider) |
| **ISE-6** | Exploratory / Low-Signal | Blue (gentle onboarding) | Pearl White |

**Governing rule:** As ISE worsens toward ISE-5 (clinical/restricted), the cascade palette narrows. **ISE-5 is the only state that authorizes Red bypass** — clinical override flows direct to Provider Dashboard without cascade synchronization.

**Resolver priority chain (inherited from PAC-ISE-002 v2.0):**
```
1. Governance flag active?    → ISE-5 (Restricted) — first match wins
2. Data stale?                → ISE-6 (Low Signal)
3. Cognitive load high?       → ISE-3 (Contained)
4. Health protective?         → ISE-2 (Protective)
5. Engagement aligned?        → ISE-1 (Available)
6. Trajectory building?       → ISE-4 (Momentum)
7. Default fallback           → ISE-0 (Baseline)
```

### 4.4 Pearl White — Full Definition (LOCKED, preserved from v1.0 docx)

**Type:** Reserved color. Guardian state. Outside cascade.

**Visual definition:** Pearl white. Not pure white. Not bright. A warm, luminous, organic pearl tone. The animation is a slow, continuous, sinusoidal elevation and depression — like a chest moving up and down during sleep.

| Phase | Visual |
|---|---|
| **Inhale** | The surface gently swells — lifts — expands softly |
| **Exhale** | The surface slowly retreats — settles — contracts softly |
| **Rhythm** | Slow. Deliberate. Not mechanical. Organic. |
| **Cycle** | ~one full breath every 4–6 seconds |
| **Loop** | Continuous until ISE state changes |

**Ollie's appearance in Pearl White:**
- Gentle pearl glow surrounding the bubble
- Eyes open — soft — aware — **not sleeping**
- Calm. Present. Watching.
- No speech bubble. No text.
- The breathing movement is in the bubble and glow — not in Ollie's expression
- Ollie remains alert — quiet guardian — watching over the patient

**What Pearl White communicates:**
> *"Everything is okay. I am here. You can rest."*

**Locked principle:** *"Ollie never fully sleeps. The patient rests. Ollie watches."*

**Where Pearl White renders:**
- Logo (continuous breath at sleep cadence — see CCO-ENG-LOGO-EXPR-001 v1.1 §6.3)
- Ollie's Space (visible if patient checks the screen during rest hours)

**Where Pearl White does NOT render:**
- Signal Bar tiles (dormant during sleep)
- Rims (no rim activation)
- AI Playground / Morpheus (dormant)
- Daily Pulse trackers (dormant)
- Routine Bookshelf — **EXCEPT** during the post-midnight reset window before AM Blue announcement (per §9 Routine Bookshelf ↔ Ollie connection)

**ISE state permission:** ISE-0 (overnight), ISE-1 (overnight), ISE-2 (overnight), ISE-4 (overnight), ISE-6 (overnight). Always conditioned on rest window.

**ISE state blocking:** ISE-3 (the system is alert — no rest mode); ISE-5 (clinical override active — no rest mode).

### 4.5 Red — Clinical Bypass Route (LOCKED)

**Type:** Reserved color. Clinical override. Bypasses cascade.

**Trigger conditions:**
- SC < 65
- Abnormal lab result
- Clinical intersection event (≥2 V-categories converging meaningfully)
- ITB CPIE event (medication-related clinical event)
- Self-harm flag

**Render path:**

```
Trigger detected
   ↓
ISE re-evaluates → resolves to ISE-5 (Restricted/Guarded)
   ↓
Red renders on:
   • Affected tile rim (R&R, Healthspan, My Blueprint, or Inner Circle)
     depending on which V-stream is in clinical intersection
   • Provider Dashboard (immediate routing)
   ↓
Cascade does NOT fire across the other 5 surfaces
   ↓
Patient sees: a Red rim on one tile + Ollie's Space message
   (Ollie's Space message uses normal cascade color, NOT Red)
   ↓
After provider acknowledgment → may transition to Purple
   (handoff to AskABA/Max for clinical communication)
```

**Why bypass:**
- Red must reach the provider without delay
- Red must not be diluted by 7-surface coordination
- Red must not trigger patient-facing celebration paths or call-to-action paths
- Red is a safety route, not an expression cascade

**Locked behavior:** When Red fires, only the affected tile rim and Provider Dashboard render Red. Ollie's Space speaks in cascade-appropriate color (typically Orange or Purple). The Logo's Rhythm Signal continues breath cadence per ISE-5 (near-static, dim). No other surface lights up Red.

---

## §5. EXPRESSION RULES

The Expression Layer operates under five foundational rules. These are not preferences. They are architectural invariants that govern every render decision across the seven surfaces.

### Rule 1 — Only Ollie carries expressions in Ollie's Space

Ollie is the only actor permitted to render expressions in Ollie's Space (Surface #4). AskABA / Max does NOT express in Ollie's Space.

When Ollie's Space turns **Purple**, that color signals that a handoff to AskABA/Max is incoming — not that AskABA is expressing in Ollie's Space. The handoff resolves into AskABA speaking in the **AI Playground** (Surface #5, Morpheus → mask icon).

**Operational consequence:** Ollie's Space and AI Playground are NOT the same surface, even when they color-match. They are distinct expression containers with distinct actors. The Smile Doctrine (§7) requires color coordination; the Three-Actor Doctrine requires actor separation.

### Rule 2 — ISE is always behind expressions

No expression fires randomly. No expression fires without an ISE state reason. Every render trace back to one of:

- ISE Resolver state change (PAC-ISE-002 v2.0)
- Beacon Pipeline detection (Beacon Canon v1.1) → triggers ISE re-evaluation
- Stability Coefficient drift (SC Canon) → triggers ISE re-evaluation
- Time-anchor activation (Bookshelf slot reaches its window) — within current ISE state
- Independent breath fire (Logo Rhythm Signal — A6 trend signals)

Even the Logo's independent fire is governed by ISE — Rhythm Signal cadence varies per state (per CCO-ENG-LOGO-EXPR-001 v1.1 §6.3).

**Operational consequence:** No surface lights up "just because." Every color, every pulsation, every rim activation is traceable to a resolved state.

### Rule 3 — Expressions are habit formation infrastructure

The consistent presence of expressions in fixed locations trains the patient to notice and respond. This is intentional behavioral architecture — not decoration.

The patient learns:
- Where to look (consistent surface positions)
- What color means (consistent semantic — Orange = attention, Green = action, etc.)
- What rhythm means (continuous breath = guardian; pulsation = new event; steady = absorbed)

Once the patient internalizes the visual language, the system can change *what* appears in the expression channel without retraining the patient on *how* to receive it.

**This rule is the founding clinical thesis** rendered into UX architecture: 466-patient cohort observation showed structured anchoring drove retention from 54% → 92%. The Expression Layer is the digital instantiation of that structured anchoring. Without consistent surfaces, expressions become noise. With consistent surfaces, expressions become proprioception.

### Rule 4 — Patient sees expressions, not ISE

The patient never sees "ISE-3" or "ISE-0." The patient sees:
- A color
- A pulsation
- A message
- A slot lighting up
- A breath shifting on the logo

The clinical/behavioral intelligence is **invisible behind the expression layer**. The Resolver runs in the backend; expressions are the patient-facing surface. This separation is what allows ISE to be a Lane 1 render authority without becoming a clinical disclosure to the patient.

**Operational consequence:** No expression copy ever names the state. Ollie does not say "you are in ISE-3." Ollie says "let's just focus on one thing today" — which is what ISE-3 looks like when expressed.

### Rule 5 — Expression is entirely separate from Beacon (preserved memory rule, April 22, 2026)

Expression Layer color authority is independent of Beacon band coloring. The cascade colors (Purple, Orange, Green, Blue) are Ollie-driven, not Beacon-band-driven. No surface in the cascade reads Beacon score directly to determine its render color.

**Why this rule exists:** Beacon owns clinical/biometric scoring authority and uses its own band system (7-band asymmetric piecewise). Expression owns patient-facing render authority and uses its own 4-color cascade + 2 reserved. Mixing the two creates ambiguity — is Orange "Beacon band 4" or "attention signal"? The architecture forbids the question. Beacon and Expression are parallel systems that happen to share a color vocabulary at the surface level but never share authority.

**The bridge:** When Beacon detects something requiring patient attention, it does NOT directly color a surface. It triggers ISE re-evaluation. ISE resolves a new state. Expression renders the new state per §4.3 permission map. The pathway is: Beacon → ISE → Expression. Never Beacon → Expression directly.

---

## §6. TWO-ANCHOR ARCHITECTURE

This is the hinge section. The Smile Doctrine (§7) describes *how* surfaces coordinate. The Universal Bookend Doctrine (§8) describes *the shape* events take. This section describes *what drives the timing* of expression — and there are exactly two drivers, operating in different temporal modes.

### 6.1 The Architectural Insight

The seven expression surfaces are not equal. Two of them serve as **anchors**. The other five are **cascade recipients**.

| Anchor | Surface | Temporal mode | Drives |
|---|---|---|---|
| **TIME ANCHOR** | Surface #1 — Routine Bookshelf | Event-driven (discrete) | The 5 cascade recipients + optionally the Logo |
| **BREATH ANCHOR** | Surface #7 — The Logo | Continuous (ambient) + event-driven (BioSnap) | Independent breath + cascade fire on BioSnap |

**The two anchors operate in parallel, not in sequence.** They produce expressions through different temporal mechanisms. Together they give the platform two independent timing systems:

- **The clock** drives the Bookshelf (life-time-driven)
- **The body** drives the Logo (biology-trend-driven via A6)

Both are valid expression sources. Both can fire without the other. They coordinate when their signals align.

### 6.2 The TIME Anchor — Routine Bookshelf

**Operational definition:** The Routine Bookshelf is the surface where time becomes visual. Each of the 17 sub-segment slots represents a discrete window of the day. As the system clock advances, slots activate at their assigned time-windows, and each activation is an expression event.

**Activation rules:**

| Slot state | Activates when | Cascade behavior |
|---|---|---|
| **Dormant (default)** | Outside time-window | No render. No cascade. |
| **Active (in-window)** | Time enters slot's assigned window | Slot color renders per ISE state + content state |
| **Closed (post-window)** | Time exits slot's window | Slot transitions to Green (complete) or Gray (missed) — final |

**Time anchor cascade flow:**

```
System clock = T
   ↓
Slot S(T) enters its time-window
   ↓
Backend evaluates: which FAB(s) live in S(T)?
   ↓
Backend evaluates: are FAB(s) on track, drifting, or missed?
   ↓
Color C selected (per §4.1 cascade taxonomy + §4.3 ISE permission)
   ↓
S(T) renders C
   ↓
Cascade fires through the 5 cascade recipients
   (selectively — see §7.6 Universal Misalignment Rule)
   ↓
Logo's Rhythm Signal MAY color-coordinate
   (but maintains independent breath cadence)
```

**Key property:** The TIME anchor cascade is **discrete** — it fires when slots cross time boundaries, not continuously. Between slot activations, the cascade is silent unless another trigger source (BioSnap, ISE state change) produces an expression event.

**Authority:** CCO-UX-RBSHELF-001 v1.1 (to be drafted next session).

### 6.3 The BREATH Anchor — The Logo

**Operational definition:** The Logo is the surface where biology becomes visual. The Rhythm Signal is a continuous micro-pulse running ambient on the logo, driven by A6 trend signals (7/14/30/90-day slopes) and pre-signal logic. The breath never stops while the patient is awake — it adjusts cadence per ISE state, deepens when pre-signals build, and condenses to a hold-point when a BioSnap is imminent.

**Three states of the breath** (per CCO-ENG-LOGO-EXPR-001 v1.1 §6.1):

| State | Visual | Trigger | Patient experience |
|---|---|---|---|
| **Normal** | Slow ambient breath | Default — A6 trends within personal corridor | Patient ignores it (Days 1–7) |
| **Attention** | Breath deepens, slight color warming | Pre-signal — A6 slope crossing soft threshold | Patient starts to notice (Days 7–30) |
| **Snap Active** | Breath holds, condenses to a point | Threshold breached — BioSnap imminent | Patient anticipates (Days 30+) |

**Two firing modes:**

| Mode | What happens | Other surfaces |
|---|---|---|
| **Independent fire** | Rhythm Signal builds Normal → Attention → returns to Normal. No BioSnap drops. | Unaffected. Logo breathes alone. |
| **Cascade fire** | Rhythm Signal reaches Snap Active. BioSnap drops. | Cascade routes through Ollie's Space first, then propagates outward (§7.7). |

**Independent fire is canonical.** Per CCO-ENG-LOGO-EXPR-001 v1.1 §6.5: *"Rhythm Signal CAN fire without a subsequent BioSnap. The breath may deepen toward Attention and return to Normal without ever reaching Snap Active. This is a feature, not a bug — it is the continuous awareness training mechanism that builds proprioception over 90 days."*

**Authority:** CCO-ENG-LOGO-EXPR-001 v1.1 (companion lock May 2, 2026).

### 6.4 The Anchor Distinction — Why It Matters

The two anchors operate at different temporal scales:

| Property | TIME anchor (Bookshelf) | BREATH anchor (Logo) |
|---|---|---|
| **Tempo** | Discrete (slot-by-slot) | Continuous (always pulsing) |
| **Source signal** | Clock + FAB completion | A6 trend slopes + pre-signal logic |
| **What it tracks** | Daily routine adherence | Biological/behavioral drift over weeks |
| **Patient awareness** | Conscious — patient sees slots | Subconscious → conscious over 90 days (Aurora Effect) |
| **Render style** | Color change at slot boundary | Color warming + cadence deepening |
| **Habit formation role** | Daily structure anchoring | Long-arc proprioception training |

The architecture deliberately gives the patient two timing systems because **the body operates on two timing systems**. Daily routine is one thing (clock-driven, conscious). Long-arc biological drift is another (slow, subconscious until trained). Without two anchors, only one of these gets rendered. With two anchors, both layers of patient experience get a visual surface.

### 6.5 When the Two Anchors Interact

The anchors run independently most of the time, but four specific interaction patterns exist:

| Pattern | Description |
|---|---|
| **Color sympathy** | When the Bookshelf cascade fires Orange (e.g., 10 a.m. hydration FAB drift), the Logo's Rhythm Signal MAY shift toward warmer breath as a secondary signal. The Logo does not fire its own BioSnap from this trigger; it just color-coordinates briefly, then returns to its breath state. |
| **DriftSnap targeting** | When a BioSnap of type DriftSnap™ drops from the Logo (because A6 detected behavioral drift), the cascade may propagate back to the affected Bookshelf slot — coloring it Orange even if the slot's time-window has already passed. This creates a retrospective signal: "this slot, earlier today, is where the drift showed up." |
| **Aurora alignment** | At Day 90+ (Aurora Effect window), the patient begins to feel the Logo breath shift before any Bookshelf slot fires. The two anchors begin to feel synchronized to the patient — the Logo predicts; the Bookshelf confirms. This is internalized proprioception, not a coded interaction — it emerges from training. |
| **Independent silence** | Most of the time, the anchors are independent. The Logo breathes in Normal state. The Bookshelf renders Green/Orange/Gray as slots advance. Neither triggers the other. The system is calm. |

### 6.6 What Drives the Cascade — Decision Tree

When the system needs to render an expression, the source determines the cascade path:

```
Expression event detected
   ↓
Source?
   │
   ├──→ Bookshelf slot activation (TIME anchor)
   │    → Cascade fires through Surfaces 2, 3, 4, 5, 6 (selective)
   │    → Logo MAY color-coordinate (Surface #7)
   │
   ├──→ Logo BioSnap drop (BREATH anchor, Snap Active)
   │    → Cascade routes Ollie's Space (Surface #4) FIRST
   │    → Then propagates to Surfaces 2, 3, 5, 6 (selective)
   │    → May propagate back to Bookshelf slot (DriftSnap targeting)
   │
   ├──→ Logo Rhythm Signal independent shift (no BioSnap)
   │    → No cascade. Logo breathes alone.
   │    → Other 6 surfaces unaffected.
   │
   ├──→ ISE state change (governance flag, data freshness, etc.)
   │    → Re-evaluate active expressions on all surfaces
   │    → Re-render per new ISE permission (§4.3)
   │    → May trigger immediate cascade if state allows new colors
   │
   └──→ Beacon / SC trigger
        → Triggers ISE re-evaluation (does NOT directly color a surface)
        → Cascade flows through resolved ISE state
```

**Architectural invariant:** No expression surface ever renders without a traceable trigger source. The decision tree above is exhaustive — if a surface lights up, one of the five branches fired.

---

## §7. SMILE DOCTRINE — 7-SURFACE COORDINATION

### 7.1 The Doctrine

When an expression fires, **all eligible surfaces synchronize on the same color in the same render frame.**

The doctrine is named for the principle: *you cannot smile with only the right side of your face.* If one surface shows Green and another shows Orange at the same moment, the patient sees a contradiction — and the trust the system has built collapses.

### 7.2 The Two-Anchor Cascade Model

Two surfaces in the seven serve as anchors. The other five are cascade recipients.

| Anchor | Surface | Mode | What it drives |
|---|---|---|---|
| **TIME ANCHOR** | Surface #1 — Routine Bookshelf | Event-driven | Cascades through Surfaces 2, 3, 4, 5, 6 + optionally 7 |
| **BREATH ANCHOR** | Surface #7 — The Logo | Continuous + event | Independent breath; also fires cascade when BioSnap drops |

(Full two-anchor mechanics are detailed in §6.)

### 7.3 Cascade Synchronization Rule

When a cascade fires:

```
1. Trigger detected (slot activation, BioSnap drop, ISE state change)
2. ISE state resolved (one state, current cycle)
3. Color selected from §4.3 permission map for that state
4. ALL cascade-eligible surfaces render the selected color
   in the same render frame
5. AI tone (Ollie's verbal register) adjusts to match (per §7.5)
6. If trigger originated at Bookshelf → Logo's Rhythm Signal
   may color-coordinate but maintains its own breath cadence
7. If trigger originated at Logo (BioSnap) → cascade routes
   through Ollie's Space first, then propagates outward
```

**No surface may lag.** Render frames are atomic. A surface that cannot render the current color (e.g., a tracker not relevant to the trigger) renders as **neutral/dormant** — never as a stale prior color.

### 7.4 What Cascade Does NOT Touch — Three Exclusions

The Smile Doctrine governs the 4-color cascade. It does NOT govern:

| Exclusion | Behavior |
|---|---|
| **Pearl White (guardian)** | Renders on Logo + Ollie's Space ONLY. Other 5 surfaces remain dormant. Other surfaces do NOT render Pearl White. |
| **Red (clinical bypass)** | Renders on affected tile rim + Provider Dashboard ONLY. Other surfaces use normal cascade colors per current ISE state. Red does NOT propagate. |
| **Logo's continuous breath** | When Logo runs Rhythm Signal independently (no BioSnap drop), other 6 surfaces are unaffected. The Logo breathes alone. |

**Architectural reason:** The 4-color cascade is for *coordinated patient-facing communication*. Pearl White is for *guardian presence during rest*. Red is for *clinical safety routing*. Independent breath is for *continuous proprioception training*. Each operates in its own register; coordination across registers would defeat the purpose of each.

### 7.5 AI Tone-to-Color Mapping (LOCKED)

Ollie's verbal tone (and Morpheus's pre-resolution voice) follows the active cascade color. Tone is not chosen freely — it is governed by the rendered color.

| Color | Tone register | Example phrasing |
|---|---|---|
| **Pearl White** | Silent. Watching. | (no speech) |
| **Blue** | Conversational. Warm. Informational. | *"Morning. Let's get going on your routine."* |
| **Green** | Encouraging. Activating. Call-to-action. | *"You've got this — let's start the program."* |
| **Orange** | Attentive. Concerned. Direct but not alarming. | *"Hydration is showing some drift — want to check in?"* |
| **Red** | (Renders rarely in Ollie's Space — usually transitions to Purple) | *"Your provider has been notified. I am here with you."* |
| **Purple** | Brief. Bridges to AskABA. | *"What do you think, Max?"* |

**Synchronization rule:** When the cascade color changes, Ollie's tone shifts within the same render frame as the visual change. No mismatched moments.

**AskABA voice:** When Morpheus resolves to AskABA (mask icon, Purple→handoff), AskABA speaks in its own clinical register — see CCO-UX-OLLIE-001 + AskABA canon for full voice specification.

### 7.6 Slot-Level Cascade — The Bookshelf as Cascade Trigger

When a Routine Bookshelf slot activates at its time-window, the cascade propagates as follows:

```
Bookshelf slot at time T → activates color C
   ↓
   ├──→ Signal Bar tile rim (Surface #2)
   │    Tile rim renders C IF the slot's content
   │    affects that tile's score domain.
   │    Otherwise tile rim stays dormant.
   │
   ├──→ Rim mechanic (Surface #3)
   │    Rim activates around tile/tracker only when
   │    triggered. Inactive surfaces stay dormant.
   │
   ├──→ Ollie's Space (Surface #4)
   │    Renders C. Pulsates 4× heartbeat. Holds steady.
   │    Tone adjusts per §7.5.
   │
   ├──→ AI Playground / Morpheus (Surface #5)
   │    Renders C. Same timing as Ollie's Space.
   │
   ├──→ Daily Pulse trackers (Surface #6)
   │    Tracker rim renders C IF a program is being
   │    triggered. Orange tracker rim = program escalation.
   │    Otherwise tracker rim stays dormant.
   │
   └──→ The Logo (Surface #7)
        Rhythm Signal MAY color-coordinate to C as
        secondary signal. Independent breath cadence
        continues. No BioSnap fires from this trigger
        (BioSnap is independent of Bookshelf cascade).
```

**Critical clarification — selective cascade:** Not every cascade fires every surface. Surfaces light up when their content is relevant to the trigger. The Smile Doctrine requires that *whichever surfaces DO light up* must color-match — but it does NOT require that *every* surface lights up for every trigger.

**Example from V's dictation (10 a.m. hydration FAB miss):**

| Surface | Renders Orange? | Reason |
|---|---|---|
| Bookshelf slot covering 10 a.m. | ✅ Yes | Slot is at its time-window |
| Signal Bar tile rim (R&R) | ❌ No | Hydration miss does not affect R&R score directly |
| Daily Pulse FAB tracker rim | ✅ Yes | Triggers a program response in Row 5 |
| Ollie's Space | ✅ Yes | Speaks to the FAB |
| AI Playground / Morpheus | ✅ Yes | Coordinates with Ollie's Space |
| The Logo | ✅ Optional color-coord | Rhythm Signal may shift toward warmer breath |
| Other tile rims | ❌ No | Not affected |

This is the **Universal Misalignment Rule** (per V dictation clarification, May 2, 2026):

> *"Always if something is not aligned with what is supposed to be, the expression will fire. The cascade depends on what is downstream of the misalignment — never blindly across all surfaces."*

### 7.7 Logo-Originated Cascade — The BioSnap Drop

When the Logo's Rhythm Signal reaches Snap Active and a BioSnap drops, the cascade propagates differently:

```
Rhythm Signal builds Normal → Attention → Snap Active
   ↓
BioSnap fires (one of 7 types — see CCO-ENG-LOGO-EXPR-001 v1.1 §7.2)
   ↓
Routes to Ollie's Space FIRST (locked routing doctrine)
   ↓
Ollie's Space renders BioSnap color and message
   ↓
Cascade propagates outward to:
   • AI Playground / Morpheus (coordinates with Ollie's Space)
   • Affected tile rim or tracker rim (if applicable)
   • Routine Bookshelf slot (if BioSnap relates to a current slot —
     e.g., DriftSnap on a FAB at A2 may color the A2 slot)
   ↓
Cool-down trace on Logo (~10 minutes residual color)
   ↓
All surfaces return to baseline
```

**Routing doctrine** (preserved verbatim from CCO-ENG-LOGO-EXPR-001 v1.1 §7.4):

> *"Expression always goes to Ollie's Space first. Expression then will start to come back how the routine is going to be affected by expression."*

Every BioSnap originates in Ollie's Space and propagates from there to other surfaces — including potentially back to the Bookshelf if the snap relates to a slot.

---

## §8. UNIVERSAL BOOKEND DOCTRINE

### 8.1 The Doctrine

Every behavioral event in BariAccess — from the smallest FAB to the largest BioSnap to a full Routine umbrella — follows a three-phase pattern:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   PHASE 1            PHASE 2            PHASE 3            │
│   WARM-UP            CONTENT            COOL-DOWN          │
│                                                            │
│   Anticipation    →  Delivery        →  Closure            │
│   (build)            (release)          (residual)         │
│                                                            │
│       ░ ▒ ▓ █          ⚡                ▓ ▒ ░             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

This is the **Universal Bookend Doctrine**. It is not metaphor. It is the operational shape of every event in the system.

### 8.2 Why This Matters Clinically

A behavioral event without bookends is an interruption. Interruptions raise cortisol, break routine, and fail to encode as habit-class information. The body experiences them as noise.

A behavioral event WITH bookends is encoded as a habit. The warm-up tells the body "something is coming." The content delivers. The cool-down closes the loop. The body integrates the event into the rhythm of the day.

**This is why every layer of the platform uses the bookend pattern**: from FAB-level micro-events (a hydration reminder) to BioSnap-level interruptions (a HRV alert) to Routine-level macro-events (an entire morning sequence). The pattern scales because the body's encoding mechanism doesn't care about scale — it cares about whether the event was bookended.

### 8.3 Applied to FAB (Sub-Segment Level)

| Phase | Mechanism | Surface |
|---|---|---|
| **Warm-up** | Open Bookend fires | Sub-segment slot lights up at time-window; Ollie may prompt |
| **Content** | FAB action occurs (or doesn't) | Patient performs the FAB; backend tracks |
| **Cool-down** | Close Bookend captures completion signal | Slot transitions to Green (done) or Orange (drift) or Gray (missed) |

**Each FAB carries 2 Bookends** (open + close). A sub-segment slot containing 3 FABs holds 6 Bookends.

**Authority:** CCO-ARCH-BOOKEND-001 v1.0 (Bookend Universal Architecture — to be drafted).

### 8.4 Applied to BioSnap (Logo Level)

| Phase | Mechanism | Surface |
|---|---|---|
| **Warm-up** | Rhythm Signal builds Normal → Attention → Snap Active | Logo continuous breath shifts cadence |
| **Content** | BioSnap drops (one of 7 types) | Routes to Ollie's Space first, cascades outward |
| **Cool-down** | Rhythm Signal returns to baseline with residual trace (~10 min) | Logo color-fades back to default ambient |

**Authority:** CCO-ENG-LOGO-EXPR-001 v1.1 §5.

### 8.5 Applied to Routine (Umbrella Level)

| Phase | Mechanism | Surface |
|---|---|---|
| **Warm-up** | AM Step 1 — Ollie's Space turns Blue → 4 pulsations → announces Morning Routine | Ollie's Space + Bookshelf transition from Pearl White (overnight) → Blue |
| **Content** | AM Step 2 — Ollie turns Green → Call to Action; routine runs in BACKGROUND | Bookshelf slots activate as time advances; binary Y/N steps tracked |
| **Cool-down** | All steps complete → Bookshelf umbrella tile turns Green → 100% completion card displays + 5 credits + social share option | Card overlay; Bookshelf umbrella locked Green for the day |

**If routine missed:** Bookshelf umbrella turns Gray. No card. No credits. Cannot reopen.

**Three umbrellas per day = three opportunities = three potential completion cards.**

**Authority:** CCO-UX-RBSHELF-001 v1.1 + this canon §9.

### 8.6 Applied to ITB / Program (Future Extension)

The Universal Bookend Doctrine extends to Interventional Therapeutic Blocks (ITBs) and to programs. While this canon does not lock those mappings (they live in CCO-ITB-001 and CCO-PROG-001), the doctrine asserts they MUST follow the same three-phase shape: warm-up event detection → program content → cool-down integration.

### 8.7 Architectural Consequence

Because every event in the system follows the bookend pattern, every event produces a **scoreable signal**: did the warm-up land? Did the content occur? Did the cool-down close? These three signals aggregate into the patient's behavioral trend (V2 stream) over time.

**This is how FAB scores become 7-day and 30-day trends** (per V dictation, Beat 9): each Bookend captures a binary outcome, and the rolling aggregation across days produces the longitudinal trend the patient sees.

The trend itself becomes an expression — rendered at the appropriate surface (typically the affected tile rim or the Trend canon — TBD).

---

## §9. ROUTINE BOOKSHELF ↔ OLLIE'S SPACE EXPRESSION CONNECTION

This section preserves the OQ-EXPR-06 resolution from CCO-UX-EXPR-001 v1.0 docx (April 15, 2026), with corrections per Decision A (4-color cascade + 2 reserved). It also closes OQ-SHELF-03 in the Routine Bookshelf canon by canonical reference to this section.

### 9.1 The Daily Cycle

The Bookshelf and Ollie's Space coordinate through a daily cycle anchored at midnight reset. The cycle traces the patient's day from sleep through the three umbrellas to next sleep.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  MIDNIGHT       AM            MID            PM      MIDNIGHT
│      ↓           ↓             ↓             ↓          ↓
│   ┌─────┐    ┌──────┐      ┌──────┐     ┌──────┐    ┌─────┐
│   │ PW  │ →  │ Blue │  →   │ Blue │  →  │ Blue │ →  │ PW  │
│   │  ↓  │    │  ↓   │      │  ↓   │     │  ↓   │    │  ↓  │
│   │ —   │    │Green │      │Green │     │Green │    │ —   │
│   │guard│    │ →    │      │ →    │     │ →    │    │guard│
│   │     │    │ G/Gy │      │ G/Gy │     │ G/Gy │    │     │
│   └─────┘    └──────┘      └──────┘     └──────┘    └─────┘
│                                                             │
│  PW = Pearl White    G = Green (complete)                   │
│  Gy = Gray (missed)  Blue/Green = active cascade            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Midnight Reset

| Property | Behavior |
|---|---|
| **Timing** | Routine Bookshelf resets every night at midnight (patient local time — see Open Question §13) |
| **State after reset** | All three umbrella tiles dormant. No active color. |
| **Surface behavior** | Bookshelf transitions to **Pearl White** background — guardian state, paired with Ollie's Space Pearl White. |
| **Cascade fire?** | NO. Pearl White is reserved (per §4.4). Other 5 cascade surfaces remain dormant. |

**Note:** This is the documented exception to the rule that Pearl White does not render on Bookshelf. During the post-midnight reset window, Pearl White renders on Bookshelf alongside Ollie's Space — both surfaces showing guardian presence. This is the only time the Bookshelf renders a reserved color.

### 9.3 AM Cascade — Step 1 (Warm-up)

| Property | Behavior |
|---|---|
| **Trigger** | First Bookshelf slot of AM umbrella enters its time-window |
| **Ollie's Space** | Wakes up → renders **Blue** → pulsates 4× heartbeat → announces *"Morning Routine starting"* (or equivalent — copy in Ollie content library) |
| **Bookshelf** | AM umbrella tile transitions Pearl White → Blue (synchronizes with Ollie's Space) |
| **Other cascade surfaces** | Selectively render Blue per §7.6 (only those whose content is relevant to AM start) |
| **Logo** | Rhythm Signal MAY color-coordinate Blue briefly, then returns to breath state |

### 9.4 AM Cascade — Step 2 (Content / Background Routine)

| Property | Behavior |
|---|---|
| **Trigger** | Patient acknowledges Blue announcement (tap, voice, or time progression) |
| **Ollie's Space** | Renders **Green** — Call to Action: *"Let's start the morning routine"* |
| **Bookshelf** | AM umbrella tile transitions Blue → Green (active state) |
| **HOW ROUTINE EXECUTES** | **In the BACKGROUND.** Patient follows their routine steps (e.g., breakfast, coffee, light/circadian exposure). Each step is binary: Complete Y or N. |
| **NOT launching Program WorkPad** | The routine does NOT open a Program WorkPad. It runs as background tracking. |
| **Card expansion on tap** | Patient may tap an active slot to reveal FABs underneath via Card Expansion (per CCO-UX-CARDEXP-001 — TBD). |

**This rule supersedes** any prior canon language stating that tapping a Bookshelf slot opens a Program WorkPad. Card Expansion replaces WorkPad for slot-level interaction.

### 9.5 AM Completion

| Outcome | Bookshelf state | Ollie's Space | Card | Credits |
|---|---|---|---|---|
| **All steps Y** | AM umbrella tile turns full **Green** | Green completion message | Card displays: 100% with binary results (Coffee ✅ Light ✅ etc.) | **5 credits** awarded (per CCO-CREDITS-001 — TBD) |
| **Some/all steps N** | AM umbrella tile turns **Gray** | Brief acknowledgment (no celebration) | No card | No credits |

**Social share:** When a completion card displays, the patient may post to social media (Instagram, TikTok, text). Authority: Social Share canon (TBD).

**Locked behavior:** Once an umbrella tile is Gray for the day, it cannot be reopened. Missed = locked. Card Expansion may still reveal what was missed (for learning), but the slot cannot be reactivated.

### 9.6 Midday and Evening — Same Sequence

The Mid and PM umbrellas follow identical mechanics:

- Time-window entry → Blue announce (Ollie's Space + Bookshelf)
- Acknowledgment → Green CTA → background routine
- Completion → Green tile + 100% card + 5 credits OR Gray tile + no card + no credits

**Three umbrellas per day = three opportunities = three potential completion cards = up to 15 credits per day from routine completion alone** (subject to daily credit cap per CCO-CREDITS-001).

### 9.7 What This Section Closes

| Open Item | Status |
|---|---|
| **OQ-EXPR-06** (Routine Bookshelf ↔ Ollie's Space connection — exact rules) | ✅ RESOLVED in this section |
| **OQ-SHELF-03** (same question, logged in Bookshelf canon) | ✅ CLOSED — refer to this section. RBSHELF v1.1 §10 will be patched to cite §9 of this canon. |

---

## §10. CONNECTION TO LOGO CANON

### 10.1 Authority Allocation

The Logo (Surface #7) is governed by **CCO-ENG-LOGO-EXPR-001 v1.1** (companion lock May 2, 2026). This canon does NOT redefine Logo behavior. It inherits from the Logo canon and provides cross-cascade integration rules.

| Domain | Authority |
|---|---|
| Logo structure (Rhythm Signal + BioSnap) | CCO-ENG-LOGO-EXPR-001 v1.1 |
| Logo color taxonomy at the surface level | CCO-ENG-LOGO-EXPR-001 v1.1 §11 (4-color cascade subset) |
| Logo cadence per ISE state | CCO-ENG-LOGO-EXPR-001 v1.1 §6.3 |
| 7 BioSnap types + cool-down per type | CCO-ENG-LOGO-EXPR-001 v1.1 §7.2 |
| A6 event logging schema | CCO-ENG-LOGO-EXPR-001 v1.1 §6.4 |
| Aurora Validation Plan | CCO-ENG-LOGO-EXPR-001 v1.1 §18 |
| Cross-surface cascade integration | This canon §6, §7 |
| Universal Bookend Doctrine application to BioSnap | This canon §8.4 |

### 10.2 Surface #5 Upgrade — Acknowledged

CCO-ENG-LOGO-EXPR-001 v1.0 §8.1 declared that Surface #5 (in the prior 5-surface model) is upgraded from "BioSnap" alone to "The Logo (Rhythm Signal + BioSnap) — unified bookended biometric."

**This canon ratifies that upgrade and assigns it to Surface #7** in the 7-surface model (per Decision D-1, May 2, 2026). The two designations refer to the same surface; the numbering changed when the surface inventory expanded from 5 to 7.

**Cross-reference reconciliation:** Any document referring to "BioSnap as Surface #5" should be updated to "The Logo as Surface #7" in subsequent canon revisions. CCO-ENG-LOGO-EXPR-001 v1.1 reflects this update throughout.

### 10.3 Cascade ↔ Rhythm Signal Coordination

The Logo participates in cascade in three modes (already covered in §6.3 and §6.5, restated here for cross-canon clarity):

| Mode | Description | Cross-canon authority |
|---|---|---|
| **Color sympathy** | Bookshelf cascade fires → Logo color-coordinates briefly | This canon §6.5 |
| **BioSnap drop** | Logo Rhythm Signal reaches Snap Active → BioSnap fires → cascade routes through Ollie's Space first | LOGO §5 + this canon §7.7 |
| **Independent breath** | Logo Rhythm Signal shifts without BioSnap → no cascade | LOGO §6.5 |

### 10.4 BioSnap → Cascade Reverse Fire

When a BioSnap drops, the cascade can fire **backward** through the Bookshelf — coloring an already-passed slot Orange to retrospectively flag where drift originated. This is the **DriftSnap targeting** pattern from §6.5.

**Behavior:** A DriftSnap™ from A6 detection at 2 p.m. may identify that the source of drift was a 10 a.m. hydration FAB miss. The Logo drops the BioSnap. The cascade routes through Ollie's Space. Then the cascade **also** colors the A2 slot Orange retrospectively, giving the patient a visual trace of where the day's drift originated.

**Architectural significance:** The Bookshelf is not write-locked after slot completion. Slot color can be updated by retrospective signals from the Logo. This preserves the Bookshelf as a living surface, not a static daily log.

---

## §11. PROVENANCE

| Source | Contribution |
|---|---|
| **CCO-UX-EXPR-001 v1.0 docx** (April 15, 2026) | Pearl White full definition (§4.4); ISE-1 / ISE-0 case presentations (preserved in §4.5 references); the four foundational rules (preserved as §5 Rules 1–4) |
| **CCO-ENG-LOGO-EXPR-001 v1.0** (May 2, 2026 — LOCKED) | Two-anchor architecture insight (§6); BioSnap routing doctrine verbatim (§7.7); Universal Bookend Doctrine — three-phase pattern (§8); Rhythm Signal independent fire rule (§6.3) |
| **CCO-ENG-LOGO-EXPR-001 v1.1** (May 2, 2026 — companion lock to this canon) | Resolutions for OQ-LOGO-01 through OQ-LOGO-05; ISE numbering reconciled to v3.0; cool-down property added per BioSnap type; A6 event logging spec; Aurora Validation Plan (new §18) |
| **V dictation** (May 2, 2026) | 7-surface coordination (§7); time-anchor role of Bookshelf (§6.2); Universal Misalignment Rule (§7.6); 10 a.m. hydration FAB example (§7.6); FAB-in-Bookend → score → trend (§8.7) |
| **V dictation clarifications** (May 2, 2026) | Selective cascade (not blanket); tile rim only fires when score moves; Daily Pulse rim Orange = program triggered; gray slot card expansion still allowed for learning |
| **V Pro account conversation** (preserved verbatim in source paste, May 2, 2026) | ISE numbering reconciliation (§4.3 — adopted ISE Canon v3.0); 4-color vs 6-color resolution insight (§4.1 + §4.2); Habit Hypothesis as founding clinical rationale (§5 Rule 3); three-feed trigger model (§2.4) |
| **ISE Canon v3.0** (Feb 20, 2026) | State semantics; resolver priority chain (§4.3); two-lane authority (§2.2) |
| **Beacon Canon v1.1** (Jan 30, 2026) | Separation rule preserved (§5 Rule 5); Beacon → ISE → Expression bridge (§5 Rule 5) |
| **SC Canon** (Feb 27, 2026) | "SC catches the canary, Beacon catches the gas" (§2.4); V2 drift first principle |
| **April 22, 2026 Memory Rule** | Expression Layer entirely separate from Beacon (§5 Rule 5) |
| **466-patient cohort observation** (2012–2015) | Clinical thesis behind Rule 3 (§5) — structured anchoring drove retention 54% → 92% |

---

## §12. CROSS-REFERENCES

| Document ID | Relationship to this canon |
|---|---|
| **CCO-ENG-LOGO-EXPR-001 v1.1** | Owns Surface #7. This canon inherits, does not redefine. Companion lock to CCO-ENG-EXPR-001 v2.0. |
| **CCO-UX-RBSHELF-001 v1.1** (TBD) | Owns Surface #1 (Routine Bookshelf). To be drafted next. §9 of this canon binds to RBSHELF v1.1. |
| **CCO-UX-OLLIE-001** (WIP) | Owns Surface #4 (Ollie's Space) detailed behavior. This canon binds via §9. |
| **CCO-CP-ARCH-001** (WIP — needs reconciliation per April 9–10 override) | Owns Surfaces #2, #3 detailed behavior on Constellation Panel structure. |
| **CCO-WP-5149-001** (WIP) | Owns Surface #5 (AI Playground / Morpheus) detailed behavior. |
| **Daily Pulse canon** (TBD) | Owns Surface #6 (Daily Pulse trackers). |
| **CCO-ARCH-BOOKEND-001** (TBD) | Owns Universal Bookend Doctrine implementation (§8) — to be drafted next session. |
| **CCO-UX-CARDEXP-001** (TBD) | Owns Card Expansion behavior on slot tap (§9.4). |
| **CCO-CREDITS-001** (TBD) | Owns credit award rules (§9.5). |
| **ISE Canon v3.0** | State authority. §4.3 permission map adopts v3.0 numbering. |
| **PAC-ISE-002 v2.0** | Resolver dispatcher. §4.3 resolver priority chain inherited. |
| **Beacon Canon v1.1** | Separate system. §5 Rule 5 enforces non-cross-reference for color authority. |
| **Stability Coefficient Canon** | Trigger feed (§2.4). |
| **CCO-FAB-001 v1.2** | FAB taxonomy. §8.3 + §9.5 reference FAB execution within Bookends. |
| **CCO-PROG-001 v2.1** | Program lifecycle. §8.6 reserves Universal Bookend Doctrine extension to programs. |
| **Document Canon v2** (April 18, 2026) | This canon's header conforms — BariAccess LLC single entity, V Andrei MD President, Document Canon v2 governance. |

---

## §13. OPEN QUESTIONS

### 13.1 New OQ from this canon

| ID | Question | Owner | Status |
|---|---|---|---|
| **OQ-EXPR-07** | Sub-segment FAB color authority — what colors render on a FAB icon at the sub-segment level (e.g., underneath an A2 slot)? Working hypothesis: green when FAB is on track, orange when in trouble, possibly blue for announcement. Not locked. | Val + Nikita | 🟡 OPEN — deferred to v1.2 per Decision D-2 (May 2, 2026) |

### 13.2 Migrated open questions (preserved from prior canon work)

| ID | Question | Owner | Status |
|---|---|---|---|
| **OQ-EXPR-RECONCILE-01** | The original CCO-UX-EXPR-001 v1.0 docx §4.2 used inverted ISE severity numbering. This v2.0 canon corrects to ISE Canon v3.0 numbering. Confirm no downstream documents still reference the old numbering. | Val + Lisa (audit) | 🟡 OPEN — audit pending |
| **OQ-RESET-01** | Midnight reset time zone authority — patient local time? Provider local? UTC? Affects §9.2. | Val + Zakiy | 🟡 OPEN |
| **OQ-CASCADE-01** | Render-frame budget for 7-surface synchronization. What is the maximum acceptable lag between trigger and full cascade render? Architectural decision — affects engineering implementation. | Zakiy + Janak | 🟡 OPEN |
| **OQ-TONE-01** | Voice synthesis vendor (currently ElevenLabs per April 2026 lock) — does ElevenLabs reliably support all 4 cascade tone registers (Blue/Green/Orange/Purple) per §7.5? Validation required. | Val + Zakiy | 🟡 OPEN |
| **OQ-TREND-01** | 7-day vs 30-day trend math — formula authority? Where do trend rules live? Likely a Trend canon TBD. | Val + Lisa | 🟡 OPEN |

### 13.3 Open questions inherited from CCO-ENG-LOGO-EXPR-001 v1.0 §15 — ✅ ALL RESOLVED (May 2, 2026)

The five OQs inherited from the LOGO canon were resolved in coordinated work with this v2.0 lock. Resolutions are documented here for cross-canon tracking. Authority for the resolved specs sits in **CCO-ENG-LOGO-EXPR-001 v1.1** (amendment drafted as companion to this canon).

| ID | Resolution | Authority document |
|---|---|---|
| **OQ-LOGO-01** ✅ | Pulse cadence values locked per ISE state (v3.0 numbering): ISE-0 → 5–6 sec cycle, opacity 0.4–0.7. ISE-1 → 4–5 sec, 0.5–0.8. ISE-2 → 6–7 sec, 0.3–0.6. ISE-3 → 6–8 sec, 0.3–0.5. ISE-4 → 5–6 sec, 0.5–0.8. ISE-5 → 8–10 sec, 0.2–0.4. ISE-6 → 5–7 sec, 0.4–0.6. Pearl White (overnight) → 4–6 sec, 0.3–0.6. Render: 60fps baseline, 30fps transitions for smooth interpolation. | CCO-ENG-LOGO-EXPR-001 v1.1 §6.3 (re-keyed to ISE v3.0) |
| **OQ-LOGO-02** ✅ | Color palette at baseline locked: single core tone per ISE state + subtle opacity gradient within breath cycle (±10% peak-to-trough). No hue shift during cycle — only opacity. Hue shifts only on ISE state change or cascade event. Rationale: solid tone reads sterile; full gradient conflicts with cascade authority; opacity-only honors organic breath metaphor while preserving hue as state signal. | CCO-ENG-LOGO-EXPR-001 v1.1 §6.3 |
| **OQ-LOGO-03** ✅ | Cool-down duration locked as property of BioSnap type (not runtime calculation): GoodSnap™ → 5 min (reward absorbs quickly). Bio-Snap™ → 15 min (biological events deserve longer integration window). DriftSnap™, OllieSnap™, MemorySnap™, TierSnap™, MerchantSnap™ → 10 min (default). Clinical override (Red bypass) → N/A; provider response governs trace. | CCO-ENG-LOGO-EXPR-001 v1.1 §7.2 (cool-down property added per type) |
| **OQ-LOGO-04** ✅ | Independent Rhythm Signal fires logged as A6 events. Logged events: state transitions (Normal ↔ Attention ↔ Snap Active), independent fire returns to baseline (Attention → Normal without BioSnap drop). NOT logged: per-cycle breath events (too noisy). Standard payload schema: timestamp, patient_id, prior_state, new_state, ise_state_at_transition, a6_trigger_source, resolved_with_biosnap, biosnap_type, session_context. Storage: V2 (Behavior Physiology) stream within ABAEMR; A6 boxes consume for slope analysis. | CCO-ENG-LOGO-EXPR-001 v1.1 §6.4 (logging spec added) |
| **OQ-LOGO-05** ✅ | Aurora Effect measurable via three-phase plan. Phase 1 (Phase 1 build): reaction time to BioSnap — compare day-90 reaction times to day-30, faster reactions = anticipation building. Phase 2 (post-Phase 1): self-report at Day 30/60/90/180 via Pamela's BBS workflow — *"Did you notice anything happening on the logo just before a notification dropped?"* Phase 3 (post-90-day cohort): wearable HRV correlation — reduced cortisol/HRV spike at BioSnap moment over 90 days indicates anticipation, not surprise. KPI name: `aurora_anticipation_index` (range 0.0–1.0). Flagged for Lisa + research team for inclusion in BariAccess validation portfolio as a platform-specific validated outcome measure. | CCO-ENG-LOGO-EXPR-001 v1.1 §18 (NEW — Aurora Validation Plan) |

### 13.4 Open questions resolved by this canon

| ID | Status |
|---|---|
| OQ-EXPR-01 through OQ-EXPR-06 | ✅ RESOLVED — preserved from CCO-UX-EXPR-001 v1.0 docx (April 15, 2026) and integrated into v2.0 |
| OQ-SHELF-03 | ✅ CLOSED — refer to §9 of this canon (RBSHELF v1.1 §10 to cite this resolution) |
| OQ-DROP-05 | ✅ RESOLVED — CCO-ENG-LOGO-EXPR-001 v1.0 |
| DR-ARCH-BIOSNAP-001 | ✅ RESOLVED — CCO-ENG-LOGO-EXPR-001 v1.0 |

---

## §14. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 WIP** | April 9, 2026 | Dr. Andrei + Claude | Initial UX-tier canon. Six OQs flagged. Logged as CCO-UX-EXPR-001. |
| **v1.0 RESOLUTION** | April 15, 2026 | Dr. Andrei + Claude | Six OQs marked RESOLVED. 6-color taxonomy locked (§4.1). ISE permission map drafted (§4.2 — using inverted severity numbering, later identified as inconsistent with ISE Canon v3.0). |
| **v2.0 DRAFT** | **May 2, 2026** | **Dr. Andrei + Claude** | **Major revision. Promoted from UX tier to Engine tier (Lane 1 render authority). Ratifies CCO-ENG-LOGO-EXPR-001 v1.1 as Surface #7 authority. Locks 4-color cascade (Purple, Orange, Green, Blue) + 2 reserved colors (Pearl White, Red). ISE numbering corrected to v3.0. New §6 Two-Anchor Architecture (TIME + BREATH). New §7 Smile Doctrine — 7-surface coordination with selective cascade (Universal Misalignment Rule). New §8 Universal Bookend Doctrine — three-phase pattern applied across FAB / BioSnap / Routine. §9 preserves OQ-EXPR-06 RESOLUTION with corrections. §10 cross-references CCO-ENG-LOGO-EXPR-001 v1.1. AI Tone-to-Color mapping locked (§7.5). One new OQ-EXPR-07 deferred to v1.2 (sub-segment FAB color authority). Coordinated companion lock with CCO-ENG-LOGO-EXPR-001 v1.1 (ISE v3.0 reconciliation; cool-down by snap type; A6 event logging; Aurora Validation Plan). Five inherited OQ-LOGO items resolved.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF DOCUMENT — CCO-ENG-EXPR-001 v2.0
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. Internal use only. Licensed under Document Canon v2 governance (locked April 18, 2026).
