# BARIACCESS™ CANONICAL SPECIFICATION DOCUMENT
# PROGRAM CANON — MASTER

```
═══════════════════════════════════════════════════════════════
DOCUMENT ID:     CCO-PROG-001
TITLE:           Program Canon — Master
VERSION:         v2.1
STATUS:          ✅ LOCKED — EDITABLE
LOCK DATE:       April 20, 2026
SUPERSEDES:      Program Canon v2.0 (April 20, 2026)
AUTHOR:          Dr. Valeriu E. Andrei, MD, FACS, FASMBS
                 President, BariAccess LLC
ASSISTANT EDITOR: Claude (Anthropic) — AI assist, not creator
CLINICAL TAG:    HYBRID — CPIE (HIPAA) / CCIE (wellness)
COMPLIANCE NOTE: Canonical source of truth going forward.
                 All program work references this document.
EDITABLE STATUS: Open to revision — version bump required
                 (v2.2, v2.3, etc.) for any future change.
═══════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved.

---

## §1. PURPOSE

Programs are the **base mechanism for knowledge infusion** in the BariAccess platform. Programs are **premade** — drawn from a curated library, not dynamically generated. Every program is a structured, two-step delivery surface that guides the client from understanding a specific signal to acting on it.

This canon replaces Program Canon v2.0 as the single source of truth for Programs across BariAccess and all licensed modules (Lopesan, PROFEX, Sleep, Standard, and future enterprise licensees).

---

## §2. SCOPE

### 2.1 IN SCOPE
- Program definition, composition, and lifecycle
- Program sources (entry points)
- The Learn → Intervene two-step execution model with Branch Point Rule
- Program Work Pad (delivery surface)
- Program credit architecture at ITB level (Light/Full differentiation)
- Rhythm Board resize behavior when a program is deployed
- Routine Bookshelf behaviors during program active state
- Parking Lot, PLI, Q (inherited from v1.1, updated)
- Identity Engine integration
- Complete Lite canonical endpoint
- Calendar Integration architecture
- Economics and licensing framework (skeleton — see §14)

### 2.2 OUT OF SCOPE
- ITB internal formulas (see CCO-ITB-001)
- Beacon scoring (see Beacon Canon v1.1)
- ISE governance (see ISE Canon v3.0)
- SC formula (see CCO-IC-SC-001)
- V1–V4 domain scoring (see future CCO-V1V4-001)
- Full enterprise licensing contracts (see business documents)
- FAB deployment sequencing rules (held as D&R item — see DR-FAB-PROG-SEQ-001)

---

## §3. CLINICAL RATIONALE

Programs are the operational expression of the 25-year clinical lineage: **individual baseline first, population context second.** They translate clinical intersections into patient-comprehensible, behaviorally-actionable sequences without requiring medical literacy. The premade library ensures clinical consistency across thousands of patients; the two-step Learn → Intervene structure ensures every intervention is paired with comprehension — no action without understanding. The Branch Point Rule (§7.3) ensures patient autonomy — learning alone is a legitimate outcome, not a failure state.

---

## §4. DEFINITION — WHAT IS A PROGRAM

A **Program** in BariAccess is:

| Attribute | Value |
|---|---|
| **Nature** | Premade from curated library |
| **Purpose** | Base infusion of knowledge → behavioral change |
| **Structure** | 2 branching paths: Learn (Light) · Intervene (Full) |
| **Default duration** | 5 min Learn + 5 min Intervene = 10 min |
| **Delivery surface** | Program Work Pad (full right half of Rhythm Board) |
| **Contains** | ITB Light (Learn path) OR ITB Full (Intervene path) |
| **Credits** | CCIE on ITB Light completion · CPIE on ITB Full completion |
| **Progression** | Branch Point — Learn completes with partial credit OR continues to Intervene |

---

## §5. PROGRAM SOURCES — THREE ENTRY POINTS

| # | Source | Location | Trigger | Who Initiates |
|---|---|---|---|---|
| 1 | **Row 1 Signal Dial tap** | R&R · Healthspan · My Blueprint · Inner Circle tiles | Tap tile → Pyramid opens → Tap orange dot → Card Program → Start | User (guided by system signal) |
| 2 | **Q (Queue)** | Header right | User manually opens, selects program | User (direct) |
| 3 | **[OPEN SLOT]** | TBD | TBD | TBD |

### §5.1 REMOVED FROM v1.1

- ❌ **Escape Room** — removed from canon per April 20, 2026 instruction
- ❌ **BioSnap at header logo** — superseded by Row 1 Signal Dial tap as primary entry point (OQ-SRC-02 — fate elsewhere TBD)
- ❌ **"Learn More" button in Row 1 Press Card Section 3** — replaced by the direct Pyramid → Orange Dot → Card Program flow

### §5.2 STANDING OPEN SLOT

Val has reserved an open third entry point for future editing. Logged as such. No assumption made about what fills it.

---

## §6. ROW 1 SIGNAL DIAL → PROGRAM — FULL FLOW

The primary path. Verified against screenshots (April 20, 2026).

**Extended with FAB deployment sequencing per canonical case: Low HRV + Low Angle Phase → Protein Intervention.**

```
SIGNAL LAYER
Low HRV + Low Angle Phase (V1 biometric signals)
    │
    ▼
FLAG triggered
    │
    ▼
Intervention identified: PROTEIN
    │
    ▼
FAB deployed* (habit implementation — the behavioral anchor)
    │
    ▼
Knowledge infusion (education layer activates)
    │
    ▼
SIGNAL BAR ALERT
Orange rim on tile + Orange dot in Pyramid
    │
    ▼
Problem presented to user
    │
    ▼
PROGRAM CREATED
    │
    ├── PATH A — LEARN (ITB Light)
    │       │
    │       ▼
    │   Partial CCIE credits collected
    │   Marked: COMPLETE LITE
    │   → Parking Lot 72hrs
    │
    └── PATH B — INTERVENE (ITB Full)
            │
            ▼
        Full CPIE credits collected
        Full program completed
```

### §6.1 SCREEN-LEVEL FLOW (from Row 1 tile tap)

```
STEP 1: Row 1 tile visible (e.g. R&R = 82, rim ORANGE)
         Tile rim rule: NEVER red — max orange

STEP 2: Tap tile → PYRAMID opens (Rolling Gesture Card)
         3 layers: Apex (1 score) → 8 composites → 24 sub-scores
         Beacon-colored dots. Orange dots visible at any layer.

STEP 3: Tap orange dot → CARD PROGRAM SCREEN A opens
         "[Score Name] Score Impact"
         "Your [Score] Was Affected"
         "3 biometrics are pulling your score down"
         Lists affected biometrics with orange dots
         Button: [Learn more →]

STEP 4: Tap Learn more → SCREEN B opens
         "What Each Score Means"
         Each biometric gets a plain-language explanation
         Dot colors reflect individual Beacon band state
         Button: [Start program →]

STEP 5: Tap Start program → SCREEN C opens
         "Ready to Improve?"
         "Start the recovery program for [biometrics]?"
         Shows the two-path structure:
           🔵 Learn — "Learn what's driving your deficits" · 5 min
           🟤 Intervene — "Guided daily recovery protocol" · 5 min
         Buttons: [No] [Yes]

STEP 6: Tap Yes → PROGRAM WORK PAD ACTIVATES
         Rhythm Board resizes (see §9)
         Learn phase active · Intervene gated 🔒 (until branch)
```

---

```
───────────────────────────────────────────────────────
* FAB deployment sequencing flagged as D&R item
  DR-FAB-PROG-SEQ-001 — "Is FAB always deployed before
  the Program Card surfaces, or only in specific cases?"
  Documented here as per Val's original description of
  the Low HRV + Low Angle Phase + Protein case. Held
  open for dedicated research. See CCO-DR-REGISTER-001
  (pending) for full D&R item tracking.
───────────────────────────────────────────────────────
```

---

## §7. THE TWO-STEP EXECUTION MODEL

### §7.1 Learn Step

| Attribute | Value |
|---|---|
| **Visual marker** | Blue dot 🔵 |
| **Content** | Knowledge module ("What is HRV?" etc.) |
| **Interaction** | Quiz — `Start quiz →` button |
| **Manual action** | `Save to Q` button available throughout |
| **Delivery surface** | Program Work Pad, top card position |
| **Default duration** | 5 min |
| **Outcome** | Completion of quiz produces completion status (see §7.3) |

### §7.2 Intervene Step — ITB Light vs Full

Brown dot 🟤 · Gated until Learn complete (see §7.3)

The Intervene step contains **ONE of two ITB tiers** — determined by the Program:

```
┌─────────────────────────────────────────────────────┐
│ ITB LIGHT (Educational)                             │
├─────────────────────────────────────────────────────┤
│ Classification:  CCIE (wellness)                    │
│ Content:         Benefits, tips, self-guided        │
│                  application — "these are the       │
│                  benefits, you can try it on        │
│                  your own with light, etc."         │
│ Access:          Open — no prerequisites            │
│ Credits:         CCIE credits on completion         │
│ Accountability:  None                               │
│ HIPAA:           Not required                       │
│ Calendar:        NO calendar widget (§19.4)         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ITB FULL (Prescriptive)                             │
├─────────────────────────────────────────────────────┤
│ Classification:  CPIE (clinical/HIPAA)              │
│ Content:         Protocols, prescriptive guidance   │
│                  — "wake at 6am, 20 min light,      │
│                  protein, etc."                     │
│ Access gates:    ISE-2+                             │
│                  · Barista/Provider approval        │
│                  · CLI ≥ 0.60                       │
│                  · Light completion prerequisite    │
│                    (some ITBs)                      │
│ Credits:         CPIE credits on completion         │
│ Accountability:  Daily/weekly checkpoints,          │
│                  PQIS quizzes, Ollie nudges         │
│ HIPAA:           Required                           │
│ Calendar:        Widget auto-present when           │
│                  scheduling_required = true (§19.4) │
└─────────────────────────────────────────────────────┘
```

### §7.2.1 Light ↔ Full Transitions

**UPGRADE (Light → Full)**
- Trigger: Patient readiness + all conditions met
- Gates: ISE ≥ 2 · Barista/Provider green-light · Prerequisite Light ITBs complete · CLI ≥ 0.60

**DOWNGRADE (Full → Light) — SAFETY PROTECTIVE**

Triggers:
- ISE drops to 0 or 1
- Patient misses 3+ consecutive CPIE checkpoints
- CLI drops below 0.40
- Hard-stop events (e.g., GLP-1 patient off-reservation)
- Patient requests pause (CCIE only)

**Principle:** Full → Light is protective, not punitive.

### §7.2.2 Governing Principle

> **"ITBs are determined by the Program."**

The Program selects the ITB tier at deployment. Signal + FAB + Flag drives Program creation. The Program then offers Learn (Light path) and Intervene (Full path) as branches. The system can auto-downgrade Full → Light for safety.

### §7.3 Branch Point Rule

**Replaces the "Sequential Locked Rule" of v2.0.**

Learn is **not just a gate** — it is a **legitimate completion state**.

```
Program Start
    │
    ▼
LEARN (ITB Light)
    │
    ├───► STOP HERE
    │     Outcome: Partial CCIE credits
    │              "Complete Lite" status
    │              → Parking Lot 72hrs (see §7.4)
    │
    └───► CONTINUE TO INTERVENE (ITB Full)
          Gates check: ISE-2+ · Approval · CLI ≥ 0.60
          Outcome: Full CPIE credits
                   Full program completed
```

**Rule:**
- Learn completion produces a real outcome — partial credits + Complete Lite status.
- Intervene requires Learn complete **AS A FLOOR**, but completion of Learn does **not automatically unlock Intervene** — access gates (§7.2) apply.
- User is never forced into Intervene. Opting out of Intervene after Learn is a **valid, credit-earning path**.

### §7.4 Complete Lite — Canonical Endpoint

**Status code:** `COMPLETE_LITE`

| Attribute | Value |
|---|---|
| **Triggered when** | Patient completes Learn step (ITB Light) and does not proceed to Intervene |
| **Credits awarded** | Partial CCIE credits |
| **Parking Lot behavior** | 72-hour hold in Parking Lot (per v1.1 §5–§10) |
| **Reopen path** | Patient can return during 72hr window to proceed to Intervene if gates allow |
| **After 72hr** | Q Inbox → standard 72hr Q Inbox purge rule applies |
| **Archive** | Preserved forever in 3-Dots (Ollie-searchable) |
| **Behavioral signal** | Repeat Complete Lite pattern feeds V2 — flagged as legitimate learning preference, not failure |

---

## §8. PROGRAM WORK PAD

### §8.1 Naming

**Program Work Pad** — two words. Spacing as shown. Never "WorkPad," "Work Path," or "Workpad."

### §8.2 Location

Full **right vertical half** of Rhythm Board when a program is active.

### §8.3 Header

- Label: **WORK PAD**
- Right side: **% completion** indicator

### §8.4 Phase Cards

- **Active phase card (Learn):** content + `Start quiz →` + `Save to Q`
- **Gated phase card (Intervene):** 🔒 "Complete previous phase first"

### §8.5 Auto-Save-to-Q Mechanic

- Inactivity detection triggers countdown
- Banner displays: "Auto-saving to Q in [X]s… tap to keep working"
- `Keep working` button interrupts the countdown
- Auto-save destination: **Q** (not Parking Lot directly)
- OQ-WP-01: Exact inactivity threshold (TBD)
- OQ-WP-02: Countdown duration starting value (TBD)

### §8.6 Supersedes

CCO-ARCH-SHELL-001 (April 2026 WIP) placing Work Pad in "lower vertical half" is **superseded** by this §8. Production screenshots confirm right vertical half.

---

## §9. RHYTHM BOARD RESIZE — WHEN PROGRAM DEPLOYS

### §9.1 The Two-Card Rule

Rhythm Board displays **exactly 2 cards** during program active state. The 3rd content slot (default = Memory Snap) disappears when Program Work Pad activates.

### §9.2 Three Display States

**STATE 1 — Idle Rhythm Board (no program):**
```
┌───────────────────────────────────────┐
│ Biometric Card 1  │  Biometric Card 2 │
├───────────────────┴───────────────────┤
│       MEMORY SNAP (full width)        │
├───────────────────────────────────────┤
│         ROUTINE BOOKSHELF             │
└───────────────────────────────────────┘
```

**STATE 2 — Program Work Pad Active (vertical split):**
```
┌──────────────────┬────────────────────┐
│ Biometric Card 1 │                    │
├──────────────────┤   PROGRAM          │
│ Biometric Card 2 │   WORK PAD         │
├──────────────────┤   (right half)     │
│ ❌ Memory Snap    │                    │
│   DISAPPEARS     │                    │
├──────────────────┴────────────────────┤
│ ROUTINE BOOKSHELF (AM · MID · PM)     │
└───────────────────────────────────────┘
```

**STATE 3 — Full Screen Expand:**
Work Pad covers entire Rhythm Board. All other cards yield.

### §9.3 Rule — Positional, Not Item-Specific

The 3rd slot always disappears when Work Pad activates, regardless of what occupies it. Memory Snap is the default, but client may substitute a 3rd-diagram option — either way, the 3rd slot yields.

### §9.4 72-Hour Commitment Rule

Client customization of card configuration follows a **behavioral commitment lock**:

1. Client requests card change (add/swap/replace)
2. Request approved
3. New configuration **locked for 72 hours**
4. No reversal or re-swap during window
5. After 72 hours → client may request another change

This is a **commitment mechanism**, not a storage mechanism. Aligns with v1.1 Parking Lot 72-hour spirit: prevents customization churn, forces client to experience chosen configuration before iterating.

### §9.5 Horizontal Split Mode — Future Phase

**UNLOCKED.** Not in v2.1. Reserved as option for future phase. Apple Stock App marquee-style reference preserved as UX inspiration.

---

## §10. ROUTINE BOOKSHELF BEHAVIOR

### §10.1 Two Canonical Behaviors

| Display Mode | Behavior |
|---|---|
| **Vertical split** (Work Pad = right half) | Resizes proportionally. Labels: Morning → **AM** · Midday → **MID** · Evening → **PM** |
| **Horizontal split** (future phase) | Stays fixed. Program Work Pad does NOT overlap. Visually protected. |

### §10.2 Governance

| Rule | Value |
|---|---|
| Displayed by | Provider on Day 1 of app launch |
| Patient removal | ❌ Never |
| AI removal | ❌ Never |
| Provider removal | ✅ Only in exceptional circumstances |
| Persistence | Static permanent element of Rhythm Board |

---

## §11. PROGRAM STATES

| State | Meaning | Next Step |
|---|---|---|
| Generated | Created, not yet seen | Appears at Row 1 signal trigger |
| Active | Patient engaged in Work Pad | Learn phase running |
| Saved to Q | Auto-save triggered or manual save | Q Inbox |
| Learn Complete | Quiz passed | Branch Point — Intervene or Complete Lite |
| **Complete Lite** | Learn done, Intervene opted out | Partial CCIE credits + Parking Lot 72hr |
| Intervene Active | ITB Full running | Credits pending |
| Stalled | 60%+, 72hr no engagement | Ollie asks: Keep or Wrap Up |
| Completed | Both steps done + ITB complete | BRiCK logged + full credits released |
| Wrapped Up | Partial completion | Partial credit |
| Deferred | Client chose No | Parking Lot |
| Archived | Stored in 3-Dots | Accessible forever, Ollie-searchable |

---

## §12. PARKING LOT & Q (INHERITED FROM v1.1, UPDATED)

Full v1.1 §5–§10 content retained with these updates:

- Auto-save-to-Q from Work Pad (new — §8.5)
- Q hold time tightened to 24 hours (from April 2026 WIP) → drops to Parking Lot after
- Parking Lot 72-hour hold → Q Inbox → 72-hour purge (unchanged)
- Archive forever in 3-Dots, Ollie-searchable (unchanged)
- PLI Engine (Parking Lot Index) 0–100 cognitive stability (unchanged)
- Complete Lite programs enter Parking Lot 72hr (new — §7.4)

### §12.1 Parking Lot Definition (from v1.1)

"Not a trash bin — a **behavioral biomarker**." Has own Identity Engine governance. Feeds V2, ISE, FAB System, Clinical Intersection.

### §12.2 Q (Queue)

| Attribute | Value |
|---|---|
| Location | Header (right side, Rhythm Board) |
| Access | Direct — outside Constellation Panel |
| Trigger | Manual (user clicks) or auto-save from Work Pad |
| Q TAP (Blip Card) | Line 1: 🆕 New Program · Line 2: 📥 Waiting Programs (Inbox) |
| Ollie | Joins AFTER Q is opened (not before) |
| Inbox hold | 72 hours from open → then purged |

### §12.3 PLI Engine

| Attribute | Value |
|---|---|
| Name | PLI (Parking Lot Index) |
| Type | Sub-Engine 4 of Identity Engine |
| Purpose | Cognitive stability index (0–100) |
| High PLI | Too much parked = cognitive overload |
| Low PLI | Clear parking = clear mind |

---

## §13. IDENTITY ENGINE INTEGRATION

Programs feed Sub-Engine 3 (Parking Lot Engine) and Sub-Engine 4 (PLI Engine). Program completion data flows to Identity Update Engine → outputs Biohacker Level, Identity Arc, Identity Tags (unchanged from v1.1 §12).

### §13.1 Identity Engine — Five Sub-Engines

| # | Engine | User-Facing | Function |
|---|---|---|---|
| 1 | Constellation Panel Engine™ | ✅ Yes | 5-row UI, daily identity vitals |
| 2 | PRA Engine™ (Productivity Rhythm Alignment) | 🔶 Indirect | PDS, MPT, EPD, productive window duration, alignment drift |
| 3 | Parking Lot Engine™ | ✅ Yes | SAFE cognitive load items |
| 4 | PLI Engine™ | 🔶 Indirect | Score 0–100 cognitive stability |
| 5 | Identity Update Engine™ | ❌ Backend | State reconciliation, outputs Biohacker Level, Identity Arc, Identity Tags |

### §13.2 Program Data Flow Into Identity Engine

```
Program completion
    ↓
Parking Lot Engine + PLI Engine update
    ↓
Identity Update Engine (backend)
    ↓
Outputs: Biohacker Level, Identity Arc, Identity Tags
    ↓
Surfaces in Row 1 tiles + Constellation Panel
```

### §13.3 Complete Lite Signal

Complete Lite programs feed V2 data as **legitimate learning preference** — not as failure or avoidance. This distinction is preserved through the Identity Update Engine so the patient's Identity Arc reflects chosen learning mode, not behavioral deficit.

---

## §14. ECONOMICS — SKELETON (REQUIRES VAL INPUT)

### §14.1 Credit Architecture

- **CCIE credits** (wellness) — released on ITB Light completion (Complete Lite endpoint)
- **CPIE credits** (clinical/HIPAA) — released on ITB Full completion
- Credits attached to **ITB**, not to program shell
- Credit mechanics per ITB: **OQ-ECON-01** (fixed amount vs. variable)

### §14.2 Business Prototype Model

- Programs deployed to enterprise B-clients
- Three-tier subscription structure (confirmed Q1 locked in conversation 2e1213b2):

| Tier | Price/month | Includes |
|---|---|---|
| **Light Tier** | $69 | Light Layer only — ITB Light educational access, FAB tracking, merchant ecosystem, basic credit earning |
| **Full Tier** | $99 | Light + Full Layer activation — Joe's Engine safety checks, weekly monitoring, Ollie CPIE support, provider dashboard, quarterly lab coordination |
| **Prime Tier** | $140 | Full + Prime ITB upgrade — 51/49 WorkPad AI interaction, deeper FAB personalization, priority Barista access, advanced biometric correlation |

- Licensing model per enterprise client: per-program / per-ITB / per-seat / flat — **OQ-ECON-02**

### §14.3 First Enterprise Client

- Client name: **OQ-ECON-03** (voice-to-text said "adult Moran" — likely **AllientCare** (Joe + Lorraine), confirmed B-client from memory. Needs Val confirmation.)

### §14.4 Licensing Framework

- Sole IP-holding entity: **BariAccess LLC** (Document Canon v2, locked April 18, 2026)
- License to enterprise clients: **OQ-ECON-04**
- Medication access: NOT bundled into subscription. Three paths: Insurance / LillyDirect / Compounded (per Q2 locked in conversation 2e1213b2)

### §14.5 Future Sibling Canon

Val option to flesh out Economics into **CCO-PROG-ECON-001** as standalone document when ready.

---

## §15. OPEN QUESTIONS (CONSOLIDATED)

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-PROG-01 | Exact governance check replacing Row 4 filter | Val | OPEN |
| OQ-PROG-02 | Partial credit at Wrap Up — flat or proportional? | Val | OPEN |
| OQ-PROG-03 | Grit gaming detection pattern | Val + Zakiy | OPEN |
| OQ-WP-01 | Auto-save inactivity threshold | Val + Zakiy | OPEN |
| OQ-WP-02 | Auto-save countdown starting value | Val + Zakiy | OPEN |
| OQ-WP-03 | `Keep working` — resets or pauses timer? | Zakiy | OPEN |
| OQ-WP-04 | Q resume mechanics after auto-save | Val | OPEN |
| OQ-RB-01 | Priority ranking of which 2 cards survive retraction | Val + Nikita | OPEN |
| OQ-RB-02 | Approved "3rd diagram" options client can substitute for Memory Snap | Val | OPEN |
| OQ-RB-03 | Horizontal Work Pad mode — which phase unlocks it? | Val | OPEN |
| OQ-ECON-01 | Credit mechanics at ITB level — fixed or variable? | Val | OPEN |
| OQ-ECON-02 | Business licensing model | Val | OPEN |
| OQ-ECON-03 | First enterprise client name confirmation | Val | OPEN |
| OQ-ECON-04 | Licensing framework per module | Val | OPEN |
| OQ-UX-01 | "Service" button function (Pyramid top-left) | Val | OPEN |
| OQ-UX-02 | Daily Learning / Educational card — program source or separate? | Val | OPEN |
| OQ-UX-03 | Dot color semantics (orange/blue/brown) — Beacon mapping? | Val + Nikita | OPEN |
| OQ-UX-04 | Row 4 Daily Lens visibility when Program Work Pad is active | Val | OPEN |
| OQ-SRC-01 | 3rd Program Source — what fills the open slot? | Val | OPEN |
| OQ-SRC-02 | BioSnap fate — survives elsewhere or fully retired? | Val | OPEN |
| OQ-CAL-01 | ITB Light — truly no calendar, or minimal "suggestion"? | Val | OPEN (§19) |
| OQ-CAL-02 | Native OS push — opt-in per ITB or global permission? | Val + Zakiy | OPEN (§19) |
| OQ-CAL-03 | Calendar missed confirmation → Full→Light downgrade trigger? | Val | OPEN (§19) |
| ~~OQ-ITB-Q3~~ | Light vs Full determination — prescription only? | — | ✅ RESOLVED (§7.2.2) |
| ~~OQ-ITB-Q9~~ | ITB tier dual-path canonicity | — | ✅ RESOLVED (§7.3 + §7.4) |

**D&R items (separate from OQs):**
- **DR-FAB-PROG-SEQ-001** — FAB deployment sequencing (referenced in §6*) — held for future research

---

## §16. CROSS-REFERENCES

| Doc ID | Relationship |
|---|---|
| Beacon Canon v1.1 | Band color mapping for dots |
| ISE Canon v3.0 | Governs program delivery timing |
| CCO-IC-SC-001 | SC independent governance layer |
| CCO-ITB-001 | ITB internal structure (inside Intervene) — companion v1.1 update pending |
| CCO-ENG-PQIS-001 | PQIS in program sequence |
| CCO-PL-001 | Parking Lot full slot canon |
| CCO-UX-QICON-001 v2 | Q mechanics |
| CCO-GE-001 | Grit Engine (60% stall rule) |
| FAB Canon v1.2 | FAB deployment referenced in §6 |
| CCO-V1V4-001 | V1–V4 domain scoring (MISSING — critical gap) |
| CCO-PROG-ECON-001 | Economics sibling canon (future) |
| CCO-CAL-001 | Calendar Canon (future — if §19 complexity grows) |
| CCO-DR-REGISTER-001 | D&R Register (future) |

---

## §17. PROVENANCE

Drafted from:

- Program Canon v1.1 (Jan 30, 2026) — conversation 33303 FinalHubConstPanel
  https://claude.ai/chat/7471eeb0-2d39-44b9-91ed-a9c3b3b090c7
- Canonical Bridge v1.1 (Feb 1, 2026) — conversation 33301
  https://claude.ai/chat/d0e550f1-517e-4e0f-988e-81379cc63fb0
- April 2026 WIP docs — conversation 33360 Canon
  https://claude.ai/chat/3cd9b824-d1dc-4458-8a25-15a01ee4ca31
- Row 1 Pyramid architecture — conversation 33341
  https://claude.ai/chat/c9a23884-a2b1-4ae4-a6c6-38480d1a3f47
- Rhythm Board UI/UX — conversations 21905475, 86ae98ef, 33378
  https://claude.ai/chat/21905475-ec7a-4aa6-93b3-e9bbcf62b171
  https://claude.ai/chat/86ae98ef-59a9-448b-a240-c3f7110b1be6
  https://claude.ai/chat/14822b2e-6e00-44c8-8b94-fddb87f84220
- ITB Light/Full architecture — conversations 33345, 33310, 33372, 33360, 2e1213b2
- Low HRV + Low Angle Phase + Protein case — this conversation (April 20, 2026)
- Program Canon v2.0 (April 20, 2026 — locked earlier today, superseded by v2.1)

---

## §18. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| v1.0 | Jan 30, 2026 — 7:45 PM | Dr. Andrei | Initial canon |
| v1.1 | Jan 30, 2026 — 9:15 PM | Dr. Andrei | Parking Lot rules, behavioral patterns, Identity Engine hierarchy |
| v2.0 | Apr 20, 2026 | Dr. Andrei | Escape Room removed. Programs = premade knowledge infusion. Learn → Intervene two-step. Program Work Pad canonized. Rhythm Board resize. 72-hour commitment. Economics skeleton. |
| **v2.1** | **Apr 20, 2026** | **Dr. Andrei** | **FAB deployment sequencing in §6 (D&R-flagged). ITB Light vs Full full differentiation (§7.2). Branch Point Rule replaces Sequential Locked Rule (§7.3). Complete Lite canonical endpoint (§7.4). Calendar Integration Canon (§19). OQ-ITB-Q3 and OQ-ITB-Q9 resolved.** |

---

## §19. CALENDAR INTEGRATION CANON

### §19.1 Purpose

Defines how ITB protocols that require scheduling (doses, appointments, follow-ups) interact with the Program Card surface and execute through a Calendar widget. Clean separation of concerns: protocol spec (ITB) · interface (Program Card) · execution (Calendar).

### §19.2 The Three-Component Model

```
┌─────────────────────────────────────────────┐
│  ITB (container of clinical protocol)        │
├─────────────────────────────────────────────┤
│  Owns:                                       │
│  • WHAT needs scheduling                     │
│  • Frequency (e.g. 3x weekly)                │
│  • Duration                                  │
│  • Dose / protocol spec                      │
│                                              │
│  Raises: "scheduling_required" flag          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  PROGRAM CARD (the interface)                │
├─────────────────────────────────────────────┤
│  Role: Hosts the Calendar widget             │
│  User sees + interacts here                  │
│  Does NOT own the protocol or the timing     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  CALENDAR WIDGET (the executor)              │
├─────────────────────────────────────────────┤
│  Owns:                                       │
│  • WHEN (dose times, appointments)           │
│  • Reminders + notifications                 │
│  • Confirmations ("did you take it?")        │
│  • Follow-up triggers                        │
│                                              │
│  Feeds back: adherence data → V4             │
└─────────────────────────────────────────────┘
```

### §19.3 Separation of Concerns — Locked Rule

| Component | Owns | Does NOT Own |
|---|---|---|
| **ITB** | Protocol spec, frequency, dose | Scheduling logistics, reminders |
| **Program Card** | Interface / display surface | Protocol content, timing engine |
| **Calendar Widget** | Timing, reminders, execution | Clinical protocol itself |

### §19.4 Tier Behavior

| ITB Tier | Calendar Widget |
|---|---|
| **ITB Light** | ❌ NO calendar widget (no prescriptive timing — educational only) |
| **ITB Full** | ✅ Calendar widget auto-present when `scheduling_required = true` |

### §19.5 The V4 Feedback Loop

Calendar confirmations (dose taken / appointment attended / follow-up completed) feed **V4 Interventional** data. This is how ITB Full achieves accountability without the ITB becoming a scheduling engine.

```
ITB Full raises scheduling flag
    ↓
Calendar executes
    ↓
Patient confirms action
    ↓
V4 Interventional data updates
    ↓
Feeds next ITB's complexity calibration
```

### §19.6 Native OS Integration

In-app Calendar widget can push to the user's device calendar (iOS Calendar, Google Calendar) with **explicit patient opt-in permission**. Preserves user autonomy. Reduces friction.

### §19.7 Calendar Open Questions

| # | Question | Owner |
|---|---|---|
| OQ-CAL-01 | ITB Light — truly no calendar? Or minimal "suggestion" calendar? | Val |
| OQ-CAL-02 | Native OS push — opt-in per ITB or global permission? | Val + Zakiy |
| OQ-CAL-03 | Calendar confirmation missed → how does it degrade into Full → Light downgrade trigger? | Val |

### §19.8 Cross-References

- CCO-ITB-001 — ITB structure (raises scheduling flag)
- CCO-PROG-001 §8 — Program Work Pad (hosts Program Card)
- Future **CCO-CAL-001** — Full Calendar Canon if complexity grows

---

```
═══════════════════════════════════════════════════════════════
END OF DOCUMENT — CCO-PROG-001 v2.1
STATUS: ✅ LOCKED — EDITABLE
AUTHORITY: Dr. Valeriu E. Andrei, President, BariAccess LLC
═══════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. Licensed under Document Canon v2 governance (locked April 18, 2026).
