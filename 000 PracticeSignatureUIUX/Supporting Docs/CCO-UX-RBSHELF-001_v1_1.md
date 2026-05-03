# CCO-UX-RBSHELF-001 v1.1
## Routine Bookshelf Canon

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL SPECIFICATION (AMENDMENT)
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-UX-RBSHELF-001
TITLE:          Routine Bookshelf Canon
VERSION:        v1.1
TIER:           UX — Surface Authority for Surface #1
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
                (Companion to CCO-ENG-EXPR-001 v2.0)
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
CO-EDITOR:      Claude (Anthropic) — AI assist, not creator
DATE LOCKED:    April 9, 2026 (v1.0)
DRAFT DATE:     May 2, 2026 (v1.1 amendment)

AMENDS:         v1.0 (WIP April 9, 2026)
SUPERSEDES:     CCO-UX-RSHELL-001 v1.0 (Routine Shell — already retired in v1.0)
ABSORBS + RETIRES: CCO-UX-BOOKSHELF-001 v1.0 (3-bookend-pair structure —
                   retired in v1.1 per Decision D-3, May 2, 2026)

PATCHES IN v1.1:
   §6.5 NEW  — Sub-Segment Architecture (17-slot system, folds T-04)
   §7 NEW    — Three-Umbrella Structure (folds CCO-UX-BOOKSHELF-001 v1.0)
   §7 PATCH  — Color states aligned to EXPR v2.0 §4 (reserved color clarification)
   §8 PATCH  — Tap behavior — Card Expansion replaces Program WorkPad
   §9 PATCH  — Connection to Expressions — full import of OQ-EXPR-06 resolution
   §10 PATCH — OQ-SHELF-03 CLOSED via cross-reference to EXPR v2.0 §9
   §13 NEW   — Time Anchor role
   §14 NEW   — FAB-to-Slot mapping rules
   §15 NEW   — Slot expression activation rules

DEPENDS ON:     CCO-ENG-EXPR-001 v2.0 (May 2, 2026 — color/state authority)
                CCO-ENG-LOGO-EXPR-001 v1.1 (May 2, 2026 — Logo coordination)
                ISE Canon v3.0 (Feb 20, 2026)
                T-04 transcript review document (April 28, 2026 — folded in §6.5)

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. CANONICAL NAME

**ROUTINE BOOKSHELF** — final locked name.

**Supersedes:** Routine Shell (CCO-UX-RSHELL-001 — RETIRED in v1.0).
**Absorbs in v1.1:** CCO-UX-BOOKSHELF-001 v1.0 (3-bookend-pair structure — RETIRED, content folded into §7 of this canon).

Do not use "Routine Shell" or reference CCO-UX-BOOKSHELF-001 in any new document. The canonical name is **Routine Bookshelf**, governed by this canon.

---

## §2. PURPOSE

The Routine Bookshelf is the permanent visual representation of THE THREE (Morning / Midday / Evening structure) on the Rhythm Board.

It is the primary habits formation anchor. Patients see it every day in the same place. It never moves. It never disappears by default. It is the backbone of the daily behavioral routine in BariAccess.

**Architectural role (NEW in v1.1):**

The Routine Bookshelf is **Surface #1** in the 7-surface Expression Layer (per CCO-ENG-EXPR-001 v2.0 §3.1) and serves as the **TIME ANCHOR** of the coordinated expression cascade. When a sub-segment slot activates at its time-window, the cascade fires through the other 5 cascade-eligible surfaces (Signal Bar tiles, Rim, Ollie's Space, AI Playground, Daily Pulse trackers), with the Logo (Surface #7) optionally color-coordinating.

This dual role — habits formation anchor AND cascade time anchor — makes the Routine Bookshelf the most architecturally consequential UX surface in BariAccess. (Full Time Anchor mechanics are detailed in §13.)

---

## §3. DISPLAY

The Bookshelf renders at the umbrella level on the patient-facing surface:

```
[ AM ] [ Mid ] [ PM ]
```

| Abbreviation | Full Name |
|---|---|
| AM | Morning |
| Mid | Midday |
| PM | Evening |

**Display rules (LOCKED):**

- Full words NOT used in compact display. Abbreviations only.
- Mild indentation between umbrellas.
- Clean visual presentation — no Bookend icons visible to patient at umbrella level.
- The 17-slot sub-segmentation (§6.5) is encoded behind the surface — NOT rendered as 17 visible boxes. Patient sees 3 umbrella tiles by default; sub-segments reveal only via Card Expansion (§8).

---

## §4. WHEN IT APPEARS

The Routine Bookshelf is deposited by the provider on Day 1 (D0) when the provider launches the BariAccess app with the patient for the first time. This occurs at the BBS (Biometric Barista Station) during the Day 0 → Day 1 onboarding workflow.

From that moment → **permanent in the Rhythm Board.**

**Co-creation property:** The Routine Bookshelf is co-created at D0 between the patient and the Master Barista (Pamela). The structure of the umbrellas (AM/Mid/PM) is fixed; the sub-segment slot content (which FABs live where) is personalized to the patient's chronotype, schedule, and clinical context during the BBS session.

**Authority for D0 deposit:** CCO-UX-D1-001 (Day 1 UIUX Lock — WIP).

---

## §5. PERMANENCE AND REMOVAL RULES

**RULE — PERMANENT:**
The Routine Bookshelf does not leave the Rhythm Board. Default and expected state for every patient.

**RULE — REMOVAL:**

| Actor | Authority |
|---|---|
| **Patient** | ❌ CANNOT remove |
| **AI** (Ollie, AskABA, any AI agent) | ❌ CANNOT remove |
| **Provider** | ✅ CAN remove — exceptional clinical circumstances only |

No patient request, no AI decision, no system event can trigger removal. Only a provider acting in an exceptional clinical situation may remove the Bookshelf, and the action is logged as a clinical event for audit.

**Why permanent:** The habits formation thesis (per Expression Canon v2.0 §5 Rule 3) requires consistent surface presence. Patients learn where to look and what to expect. Removing the Bookshelf would erase the time anchor of the entire daily expression cycle.

---

## §6. TWO DISPLAY BEHAVIORS

The Bookshelf operates in two display behaviors depending on the Rhythm Board state:

### 6.1 BEHAVIOR 1 — VERTICAL DISPLAY (resize)

When the Rhythm Board enters Vertical Split (e.g., a Program WorkPad opens in the right half), the Bookshelf resizes proportionally. Cards and the WorkPad share screen real estate; the Bookshelf shrinks to accommodate but **always remains visible** at the bottom of the left half.

**Position invariant:** The Bookshelf stays at the bottom of the left half during Vertical Split. It does not move to the top, the side, or get hidden. Bottom-anchored at all times.

**Resize labels:** During Vertical Split, the umbrella labels may abbreviate:
- Morning → AM
- Midday → MID
- Evening → PM

(Standard display already uses AM/Mid/PM — see §3 — so resize maintains the same labels.)

### 6.2 BEHAVIOR 2 — HORIZONTAL DISPLAY (fixed — future phase reservation)

In future phases (post-Phase 1), a horizontal split mode is reserved for advanced workflows. In this mode:

- Bookshelf stays FIXED at the bottom of the screen.
- Program WorkPad does NOT overlap the Bookshelf.
- Bookshelf is visually protected — never covered by other elements.
- WorkPad sits above the Bookshelf, never on top of it.

**Status:** 🟡 RESERVED — not in Phase 1 build. Documented for forward-compatibility.

### 6.3 Three Rhythm Board states (LOCKED)

The Bookshelf renders consistently across the three Rhythm Board states:

| State | Bookshelf behavior |
|---|---|
| **Idle** | Full umbrella display [AM] [Mid] [PM] at standard size |
| **Vertical Split** | Resized, bottom-anchored, left-half (per §6.1) |
| **Full Screen Expand** | Bookshelf visible at standard size; cards/content above expand vertically; Bookshelf does not get covered |

In all three states: **The Routine Bookshelf is PROTECTED.** It is never covered or pushed off-screen.

### 6.4 Tile Lock and D0 Progressive Unlock (LOCKED)

At Day 1 (D0), only the AM umbrella is unlocked at first reveal. Mid and PM unlock progressively as the patient experiences their first morning routine. This protects against cognitive overload at onboarding.

**Unlock sequence:**

| Time | Unlocked |
|---|---|
| Day 1, hour 1 (post-Barista) | AM only |
| Day 1, after AM completion (or AM time window passes) | Mid unlocks |
| Day 1, after Mid completion (or Mid time window passes) | PM unlocks |
| Day 2+ | All three unlocked from midnight reset |

**72-Hour Commitment Rule:** During the first 72 hours, the Bookshelf composition (which FABs live where) is locked from patient modification. Patient may interact, complete, miss — but cannot reorganize. After 72 hours, FAB rearrangement requests route through Ollie + provider review.

### 6.5 Sub-Segment Architecture — The 17-Slot Time-Coding System (NEW IN v1.1)

**v1.0 of this canon described only the umbrella level (AM / Mid / PM). v1.1 incorporates the sub-segment encoding system locked in T-04 (April 28, 2026) and confirmed in V's dictation (May 2, 2026).**

The Bookshelf surface display remains 3 umbrellas (per §3). Underneath, the system encodes 17 sub-segment slots that govern FAB placement and time-coded expression behavior.

#### 6.5.1 The 17 Slots

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   AM UMBRELLA          BRIDGE A         MID UMBRELLA       BRIDGE B          PM UMBRELLA
│                                                                          │
│   AM1 · AM2 · AM3   →   A1·A2·A3·A4   →   Mid1·Mid2·Mid3   →   B1·B2·B3·B4   →   PM1·PM2·PM3
│   (3 anchor slots)      (4 bridge       (3 anchor slots)      (4 bridge        (3 anchor slots)
│                          slots — FAB                           slots — FAB
│                          placement                             placement
│                          zone)                                 zone)
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

   Total: 3 + 4 + 3 + 4 + 3 = 17 sub-segment slots per day
```

#### 6.5.2 Anchor Slots vs. Bridge Slots

The 17 slots split into two architectural categories:

| Category | Slots | Role |
|---|---|---|
| **Anchor Slots** | AM1, AM2, AM3, Mid1, Mid2, Mid3, PM1, PM2, PM3 (9 total) | Stable rhythm scaffolding — fixed times the patient anchors against (wake, lunch, sleep) |
| **Bridge Slots (Bridge Bars)** | A1, A2, A3, A4 (Bridge A) and B1, B2, B3, B4 (Bridge B) (8 total) | Flexible work segments — commute, work blocks, breaks, errands. Most FABs live here. |

**Why two categories:** The body anchors against rhythmic stability points (wake, meals, sleep). Anchors carry fewer FABs but more weight per FAB. Bridge bars carry most behavioral activity because that's where life happens between anchors. The architecture deliberately separates structural scaffolding from flexible work.

#### 6.5.3 UI/UX vs. Backend Granularity (LOCKED — T-04 §1)

**Critical architectural rule:**

| Layer | Granularity |
|---|---|
| **Surface display** | Umbrella level only (3 tiles: AM, Mid, PM) |
| **Card Expansion (on tap)** | Sub-segment level (17 slots visible) |
| **Backend encoding** | Unrestricted (multiple FABs per slot tracked individually) |

A single sub-segment slot (e.g., A2) can hold **multiple FABs** behind it — example: A2 between 10–11 AM can carry hydration + protein + emails. The patient sees one slot color (orange/green) at the surface; backend tracks each FAB independently.

**V's lock rule (May 2, 2026):**

> *"Ollie is going to say — go — you know — guys — crazy people. I'm not going to get so crazy — because Ollie goes into therapy if we give her like 20 FABs in that one."*

UI/UX granularity is intentionally capped. Surface stays simple; encoding stays rich.

#### 6.5.4 Click-on-Slot Behavior

When the patient taps an active slot (orange or green) at the umbrella level, **Card Expansion** opens revealing the FABs underneath that slot. Per Decision D-5 (May 2, 2026):

| Slot color | Tap behavior |
|---|---|
| **Default / dormant** | Nothing happens — slot outside time-window |
| **Blue** (announce) | Optional acknowledge; reveals upcoming routine context |
| **Green** (complete or in-progress) | Card Expansion shows completed FABs; for active green, allows interaction |
| **Orange** (active + misalignment) | Card Expansion reveals problematic FAB(s) underneath — **for learning** |
| **Gray** (timed out, missed) | Locked — no Card Expansion. Missed = locked for the day. |
| **Pearl White** (overnight reset) | Dormant — no expansion; guardian state |

**Authority:** CCO-UX-CARDEXP-001 (Card Expansion canon — TBD).

#### 6.5.5 Color Authority — Cross-Reference Only

**Sub-segment slot colors are governed by CCO-ENG-EXPR-001 v2.0 §4** (4-color cascade + 2 reserved). This canon does NOT define color semantics — it inherits.

**Slot color quick reference (per EXPR v2.0):**

| Color | Slot meaning | Cascade behavior |
|---|---|---|
| **Default (no color)** | Outside time-window — slot dormant | None |
| **Blue** | Ollie announcing routine starting (AM Step 1) | Cascades to Ollie's Space + AI Playground |
| **Green** | On track / complete / call to action active | Cascades selectively per §7.6 of EXPR v2.0 |
| **Orange** | Active + misalignment detected (FAB problem) | Cascades selectively per Universal Misalignment Rule |
| **Gray (matte)** | Timed out / missed | Final state for the day; no cascade |
| **Pearl White** | Post-midnight reset window | Reserved color — Logo + Bookshelf only (§9.2 of EXPR v2.0) |

**Sub-segment FAB-level colors:** OPEN per OQ-EXPR-07 — what colors render on individual FAB icons within a slot is deferred to v1.2. Working hypothesis: green when on track, orange when in trouble, possibly blue for announcement. Owner: Val + Nikita.

---

## §7. THREE-UMBRELLA STRUCTURE (NEW IN v1.1 — ABSORBED FROM CCO-UX-BOOKSHELF-001 v1.0)

**v1.1 absorbs the structural content of CCO-UX-BOOKSHELF-001 v1.0** (which was ON HOLD since March 18, 2026 and is now formally RETIRED per Decision D-3, May 2, 2026). The 3-bookend-pair model from that canon describes the same architecture this canon governs — they were two views of one surface. v1.1 unifies them.

### 7.1 The Three Umbrellas

The Routine Bookshelf displays three umbrella anchors per day, each representing one session of structured behavioral activity:

```
BOOKSHELF (one day)
├── UMBRELLA 1: AM (Morning)    → sub-slots AM1 · AM2 · AM3
├── UMBRELLA 2: Mid (Midday)    → sub-slots Mid1 · Mid2 · Mid3
└── UMBRELLA 3: PM (Evening)    → sub-slots PM1 · PM2 · PM3
```

Bridge Bars (A1–A4 between AM and Mid; B1–B4 between Mid and PM) are not umbrella anchors — they are flexible work zones where most FABs are placed (per §6.5.2).

### 7.2 The Three-Bookend-Pair Mapping (preserved from CCO-UX-BOOKSHELF-001 v1.0)

Each umbrella maps to one Bookend pair (from the Universal Bookend Doctrine — see CCO-ENG-EXPR-001 v2.0 §8):

| Umbrella | Bookend Pair | Three-phase pattern |
|---|---|---|
| **AM (Morning)** | Bookend Set 1 | Warm-up (Blue announce) → Content (background routine) → Cool-down (completion card) |
| **Mid (Midday)** | Bookend Set 2 | Same pattern |
| **PM (Evening)** | Bookend Set 3 | Same pattern |

**Locked relationship (preserved verbatim from CCO-UX-BOOKSHELF-001 v1.0 §3):**
- One Daily Routine Document (DRD) = One Bookshelf
- Multiple Bookshelves stacked over days form the Routine Trend (7-day, 21-day, 30-day, 40-day windows)

### 7.3 Why Exactly Three Umbrellas

The three-umbrella structure is canonical and not arbitrary:

- **Three anchor windows match human chronobiology** — wake/morning, midday/lunch, evening/sleep are universal anchor points across cultures and chronotypes.
- **Three opportunities per day** — patient gets three shots at routine completion, three potential completion cards, up to 15 credits from routine completion alone (subject to daily cap per CCO-CREDITS-001 — TBD).
- **Three umbrellas + two bridge bars = five visual zones** — manageable cognitive load. More umbrellas would fragment attention; fewer would lose granularity.

### 7.4 Color States — Cross-Reference to EXPR v2.0

**This canon does NOT define color semantics.** Color authority sits in CCO-ENG-EXPR-001 v2.0 §4. This section provides a quick reference for umbrella-level color states only.

**Umbrella color states (LOCKED — derived from EXPR v2.0):**

| Color | Meaning at umbrella level |
|---|---|
| **Default / dormant** | Outside time-window |
| **Pearl White** | Post-midnight reset, before AM activation (guardian state per EXPR v2.0 §4.4) |
| **Blue** | Ollie announcing routine starting (AM Step 1 — see §9 below) |
| **Green** | Routine in progress OR completed at 100% |
| **Gray (matte)** | Routine missed/timed out — final state for the day |

**Sub-segment color states:** Inherit from EXPR v2.0 §4 + the extended 17-slot rules in §6.5 of this canon. **Sub-segment FAB-level colors remain OPEN per OQ-EXPR-07** (deferred to v1.2 — see §10).

**No Bookshelf-specific color invention.** All colors come from the EXPR v2.0 master taxonomy. This v1.1 supersedes any color language in v1.0 §7 that conflicted with EXPR v2.0.

### 7.5 Old Color State Reconciliation Note

**v1.0 of this canon (April 9, 2026) used a 3-state color model: Green / Gray (matte) / Grayed Out.** That model conflicted with the 4-color cascade + 2-reserved taxonomy locked in EXPR v2.0 §4. v1.1 supersedes the v1.0 color model with the EXPR v2.0 taxonomy.

**Mapping for documentation continuity:**

| v1.0 Term | v1.1 Equivalent |
|---|---|
| Green | Green (cascade) — same |
| Gray (matte) | Gray (final state, missed) — same |
| Grayed Out | Same as Gray — "cannot reopen" rule preserved |

The "GRAYED OUT = CANNOT REOPEN" behavior from v1.0 §4 is preserved in v1.1 as the standard Gray behavior. Once an umbrella tile is Gray for the day, it cannot be reactivated. Card Expansion may still reveal what was missed (for learning per Decision D-5), but the slot itself is locked.

---

## §8. TAPPING A SLOT (PATCHED v1.1)

**v1.0 of this canon stated that tapping a Green session opened the Program WorkPad. This was incorrect** and contradicted the OQ-EXPR-06 resolution in CCO-UX-EXPR-001 v1.0 docx (April 15, 2026). v1.1 patches this section to align with EXPR v2.0 §9.4.

### 8.1 Locked Tap Behavior (per EXPR v2.0 §9.4 + Decision D-5)

**ARCHITECTURAL HEADLINE:** Tapping a Bookshelf slot **does NOT** open the Program WorkPad — it opens **Card Expansion**. These are two different UI surfaces with different roles. Card Expansion reveals FAB-level state within the tapped slot, in-place, without leaving the Rhythm Board. Program WorkPad is a separate surface reached through other Constellation Panel paths (per §8.3).

| Slot color | Tap behavior | Card Expansion | Program WorkPad |
|---|---|---|---|
| **Default / dormant** | Nothing | ❌ No | ❌ No — outside time-window |
| **Pearl White** | Nothing — guardian state | ❌ No | ❌ No |
| **Blue** | Optional acknowledge | 🟡 Optional — reveals upcoming routine context | ❌ No |
| **Green (complete or in-progress)** | Reveal FABs underneath | ✅ Yes — shows completed FABs and 100% card if final | ❌ No |
| **Orange (active + misalignment)** | Reveal problematic FAB(s) | ✅ Yes — for learning | ❌ No |
| **Gray (missed)** | Reveal what was missed | ✅ Yes — for learning (per D-5) | ❌ No — slot is locked |

**KEY ARCHITECTURAL RULE:**

> **Tapping a Bookshelf slot does NOT open the Program WorkPad.**
> **Tapping an active Bookshelf slot DOES open Card Expansion.**

This rule supersedes v1.0 §8 entirely. The routine runs in the BACKGROUND per EXPR v2.0 §9.4. Tap behavior reveals FAB-level state via Card Expansion, NOT via WorkPad opening.

### 8.2 Why Card Expansion, Not WorkPad

Three architectural reasons:

1. **Background routine integrity.** The routine runs in patient's actual life (eating breakfast, drinking coffee, light exposure). Opening a WorkPad on tap would displace the patient out of the routine into a separate UI mode — defeating the background execution model.

2. **Selective revelation.** Card Expansion shows ONLY the FABs in the tapped slot. WorkPad would show the full program structure. The patient doesn't need program-level context to understand a slot — they need slot-level context.

3. **Reversibility.** Card Expansion closes back to the umbrella view in one tap. WorkPad opening is a mode shift requiring more explicit close action. Lighter weight = better for habit formation.

### 8.3 What DOES Open a Program WorkPad

Program WorkPads open through other Constellation Panel surfaces, not the Bookshelf. The tap-from-Bookshelf path is reserved for Card Expansion only.

**Authority for Program WorkPad opening:** CCO-WP-5149-001 + CCO-PROG-001.

### 8.4 What DOES Open Card Expansion

Card Expansion opens on tap from:

- Routine Bookshelf slot (this canon)
- Constellation Panel tile rim when active (per CCO-CP-ARCH-001)
- Daily Pulse tracker rim when active (per Daily Pulse canon — TBD)
- BioSnap acknowledgment (per CCO-ENG-LOGO-EXPR-001 v1.1)

**Authority for Card Expansion behavior:** CCO-UX-CARDEXP-001 (Card Expansion canon — TBD).

---

## §9. CONNECTION TO EXPRESSIONS (PATCHED v1.1)

**v1.0 of this canon §9 stated *"Exact connection rules: TBD (OQ-SHELF-03)."* That open question is now CLOSED.** The full operational specification is locked in CCO-ENG-EXPR-001 v2.0 §9 (which preserves OQ-EXPR-06 resolution from April 15, 2026, with corrections).

### 9.1 Authority Pointer

**Master authority for Routine Bookshelf ↔ Ollie's Space connection:** CCO-ENG-EXPR-001 v2.0 §9.

This canon does NOT redefine the connection rules — it inherits and provides Bookshelf-side cross-references. The full specification in EXPR v2.0 §9 covers:

- §9.1 The Daily Cycle (midnight → AM → Mid → PM → midnight)
- §9.2 Midnight Reset (Pearl White guardian state)
- §9.3 AM Cascade Step 1 (Warm-up — Blue announce)
- §9.4 AM Cascade Step 2 (Content — Green CTA, background routine, Card Expansion on tap)
- §9.5 AM Completion (Green tile + 100% card + 5 credits OR Gray tile + no card + no credits)
- §9.6 Midday and Evening — Same Sequence
- §9.7 OQ-EXPR-06 RESOLVED + OQ-SHELF-03 CLOSED

### 9.2 Quick Reference — The Daily Cycle

For ease of cross-canon navigation, the daily cycle from EXPR v2.0 §9.1 is reproduced here:

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

### 9.3 Bookshelf-Side Behaviors During Daily Cycle (LOCKED via EXPR v2.0)

| Phase | Bookshelf state | Authority |
|---|---|---|
| **Midnight reset** | All three umbrella tiles dormant. Bookshelf transitions to Pearl White (paired with Ollie's Space Pearl White). | EXPR v2.0 §9.2 |
| **AM Step 1 (Warm-up)** | First AM slot enters time-window → AM umbrella tile transitions Pearl White → Blue (synchronizes with Ollie's Space Blue announcement) | EXPR v2.0 §9.3 |
| **AM Step 2 (Content)** | After patient acknowledgment → AM umbrella tile transitions Blue → Green (active state). Background routine executes. Sub-segments activate at their time-windows per §6.5. | EXPR v2.0 §9.4 |
| **AM Completion** | All sub-segment slots Y → AM umbrella tile turns full Green + 100% card + 5 credits. Some/all N → AM umbrella tile turns Gray + no card + no credits. | EXPR v2.0 §9.5 |
| **Mid + PM** | Same sequence repeats for Midday and Evening umbrellas. | EXPR v2.0 §9.6 |

### 9.4 Pearl White on the Bookshelf — Documented Exception

Per EXPR v2.0 §4.4, Pearl White is a **reserved color** that does NOT cascade across all 7 surfaces. However, it has one documented exception: **the post-midnight reset window**.

**During this exception window:**
- Bookshelf renders Pearl White (3 umbrellas dormant, guardian state)
- Ollie's Space renders Pearl White (paired)
- Logo continues Pearl White overnight breath cadence (per LOGO v1.1 §6.3)
- **Other 4 cascade surfaces remain dormant** — they do NOT render Pearl White

This is the only condition under which Pearl White renders on the Bookshelf. At all other times, the Bookshelf renders cascade colors (Blue, Green, Orange) or the final Gray state.

### 9.5 What §9 Closes

| Open Item | Status |
|---|---|
| **OQ-SHELF-03** (Ollie Space ↔ Routine Bookshelf expression connection — exact rules?) | ✅ **CLOSED** — full specification lives in CCO-ENG-EXPR-001 v2.0 §9. This canon's §9 is now an authority pointer, not an open question. |

---

## §10. OPEN QUESTIONS (PATCHED v1.1)

### 10.1 Closed in v1.1

| ID | Original question | Resolution |
|---|---|---|
| **OQ-SHELF-03** | Ollie Space ↔ Routine Bookshelf expression connection — exact rules? | ✅ **CLOSED** via CCO-ENG-EXPR-001 v2.0 §9 (May 2, 2026). See §9 of this canon for cross-reference. |

### 10.2 Remaining Open Questions (preserved from v1.0)

| ID | Question | Owner | Status |
|---|---|---|---|
| **OQ-SHELF-01** | Exact timeout times per session (AM/Mid/PM)? Adjust per chronotype? | Val — 90-day question | 🟡 OPEN |
| **OQ-SHELF-02** | Gray exact color value (specific hex code)? Same as Green but desaturated, or specific matte gray? | Nikita (design) | 🟡 OPEN |
| **OQ-SHELF-04** | Progress flow line between sessions — animated or static? | Zakiy + Nikita | 🟡 OPEN |

### 10.3 New Open Questions Surfaced in v1.1

| ID | Question | Owner | Status |
|---|---|---|---|
| **OQ-SHELF-05** (NEW) | A2 sub-fraction math — voice-to-text in T-04 said "one eighth of A2"; is this 1/8 or 1/4? Working read: 1/8 (since A2 = ~25% of Bridge A, and a 15-min FAB in A2 ≈ 1/8 of a 2-hour A2 window). | Val | 🟡 OPEN — migrated from T-04 |
| **OQ-SHELF-06** (NEW) | Bookend prompt timing — when does Ollie fire the prompt? At Bookend open? Mid-FAB? Bookend close? | Val + Zakiy | 🟡 OPEN — migrated from T-04. Likely belongs in CCO-ARCH-BOOKEND-001 (TBD). |
| **OQ-SHELF-07** (NEW) | Maximum FABs per slot — soft limit or hard limit? Val example: 3 FABs in A2 acceptable; 20 FABs is "Ollie goes into therapy." | Val + Zakiy | 🟡 OPEN — migrated from T-04. Phase 1 build choice — Zakiy might cap at 3 or 5/slot. |
| **OQ-SHELF-08** (NEW) | Click-on-orange-slot card design — show all FABs with individual color states? Show only problematic FABs? Mix? | Val + Nikita | 🟡 OPEN — migrated from T-04. Belongs in CCO-UX-CARDEXP-001 (TBD). |
| **OQ-SHELF-09** (NEW) | FAB close-out via voice/text — input scope? Voice-only? Text? Either? Free text or button taps? Auto-close on biometric signal? | Val + Zakiy | 🟡 OPEN — migrated from T-04. |
| **OQ-SHELF-10** (NEW) | Routine type variation (Weekday/Weekend/Vacation) — does Bookshelf composition change per routine type? How does the patient toggle? | Val + Nikita | 🟡 OPEN — referenced in April 22 memory rule, never specified. Likely belongs in Routine Type Variation canon (TBD). |

### 10.4 Cross-Reference to EXPR v2.0 OQ Register

The following OQs from EXPR v2.0 §13 also affect the Bookshelf surface and are tracked there:

| ID | Authority |
|---|---|
| **OQ-EXPR-07** (sub-segment FAB color authority) | EXPR v2.0 §13.1 — affects §6.5.5 + §7.4 of this canon |
| **OQ-RESET-01** (midnight reset time zone authority) | EXPR v2.0 §13.2 — affects §9.4 of this canon |
| **OQ-CASCADE-01** (render-frame budget for 7-surface sync) | EXPR v2.0 §13.2 — affects time-anchor cascade fire timing |

---

## §11. PROVENANCE — UPDATED FOR v1.1

| Source | Contribution |
|---|---|
| **v1.0 source material** (April 9, 2026) | Original Routine Bookshelf canon — canonical name, 3-umbrella structure, permanence rules, two display behaviors, original OQ-SHELF-01 through 04 |
| **CCO-UX-RSHELL-001 v1.0** (RETIRED in v1.0) | Visual erosion metaphor preserved (Gray = "going into a desert"); progress flow line concept (OQ-SHELF-04) |
| **CCO-UX-BOOKSHELF-001 v1.0** (ON HOLD March 18, 2026 → RETIRED in v1.1) | Three-bookend-pair structural model; One DRD = One Bookshelf rule; Routine Trend stacking concept (folded into §7) |
| **T-04 transcript** (April 28, 2026 — Val + Zakiy production deployment session) | 17-slot time-coding system (AM1-3, A1-4, Mid1-3, B1-4, PM1-3); UI/UX vs backend granularity rule; FAB-to-slot example placements (hydration → A1, protein → A2, gym 7 PM → B3); Ollie cap rule (folded into §6.5) |
| **V dictation** (May 2, 2026) | Time anchor architectural insight; FAB-to-slot mapping by time; slot expression activates only at time-window; slot color reveals biological/behavioral decay early; 7-surface coordination; FAB inside Bookend → score → trend |
| **V dictation clarifications** (May 2, 2026) | Universal Misalignment Rule; selective cascade; tile rim only fires when score moves; Daily Pulse rim Orange = program triggered; gray slot card expansion still allowed for learning |
| **CCO-ENG-EXPR-001 v2.0** (May 2, 2026 — companion lock) | Color authority (4-color cascade + 2 reserved) inherited in §6.5.5 + §7.4; OQ-EXPR-06 resolution closes OQ-SHELF-03 (§9); Card Expansion replaces WorkPad (§8) |
| **CCO-ENG-LOGO-EXPR-001 v1.1** (May 2, 2026) | Logo coordination via cascade reverse-fire (DriftSnap targeting can color a Bookshelf slot retrospectively per EXPR v2.0 §10.4) |
| **April 22, 2026 Memory Rule** | Bookshelf shows Morning/Midday/Evening umbrellas, not segments. Sub-segments live behind via Card Expansion. Routine type variation acknowledged. |
| **466-patient cohort observation** (2012–2015) | Habits formation thesis underlying Bookshelf's permanence rule (§5) |

---

## §12. CROSS-REFERENCES (PATCHED v1.1)

| Document ID | Relationship to this canon |
|---|---|
| **CCO-ENG-EXPR-001 v2.0** (May 2, 2026) | Owns Expression Layer color authority. This canon §6.5.5, §7.4, §9, §13.3 inherit from EXPR v2.0 §4 and §6–§9. Companion lock to RBSHELF v1.1. |
| **CCO-ENG-LOGO-EXPR-001 v1.1** (May 2, 2026) | Owns Surface #7 (Logo). This canon §13.4 inherits DriftSnap targeting (reverse-fire) authority. |
| **ISE Canon v3.0** (Feb 20, 2026) | State authority. Slot color permissions inherit from ISE permission map (EXPR v2.0 §4.3). |
| **CCO-UX-RSHELL-001 v1.0** | RETIRED in v1.0 of this canon. Visual erosion metaphor (Gray = "going into a desert") + progress flow line concept (OQ-SHELF-04) preserved. |
| **CCO-UX-BOOKSHELF-001 v1.0** | RETIRED in v1.1 per Decision D-3. Three-bookend-pair structural content folded into §7. One-DRD-equals-one-Bookshelf rule preserved. |
| **CCO-UX-D1-001** (Day 1 UIUX Lock — WIP) | Authority for D0 Bookshelf deposit. Co-creation property (§4) inherits from D1 canon. |
| **CCO-UX-CARDEXP-001** (Card Expansion — TBD) | Owns tap-on-slot behavior detail (§8). This canon's §6.5.4 + §8 cite forward to Card Expansion canon when drafted. |
| **CCO-UX-OLLIE-001** (Ollie's Space — WIP) | Owns Surface #4 detail. This canon §9 binds via EXPR v2.0 §9. |
| **CCO-CP-ARCH-001** (Constellation Panel Architecture — WIP, requires April 9–10 reconciliation) | Owns Surfaces #2, #3 detail. Cascade interactions per §13.3. |
| **CCO-WP-5149-001** (51/49 WorkPad — WIP) | Owns Surface #5 detail. Note: Program WorkPad does NOT open from Bookshelf taps (§8.1). |
| **Daily Pulse canon** (TBD) | Owns Surface #6 detail. Tracker Orange rim signals program triggered (§13.3). |
| **CCO-ARCH-BOOKEND-001** (Bookend Universal Architecture — TBD) | Will own Bookend timing and FAB lifecycle detail. OQ-SHELF-06 routes here. |
| **CCO-FAB-001 v1.2** | FAB taxonomy. §14 FAB-to-Slot mapping coordinates with FAB Canon. FAB movement governance (§14.6) lives in FAB Canon. |
| **CCO-PROG-001 v2.1** | Program lifecycle. Program FABs follow program-level rules + slot-mapping rules (§14). |
| **CCO-CREDITS-001** (Credits Canon — TBD per Decision D-4) | Owns credit award rules. §9.3 references 5 credits per umbrella completion (subject to daily cap). |
| **T-04 transcript review** (April 28, 2026) | Source for §6.5 (17-slot system), §14 (FAB-to-slot examples), and OQ-SHELF-05 through 09 in §10.3. |
| **April 22, 2026 Memory Rule** | Sub-segments live behind Card Expansion, not visible at umbrella level (§3, §6.5.3). |
| **Document Canon v2** (April 18, 2026) | This canon's header conforms — BariAccess LLC single entity, V Andrei MD President, Document Canon v2 governance. |

---

## §13. TIME ANCHOR ARCHITECTURE (NEW IN v1.1)

This section makes explicit a role the Routine Bookshelf has always played but was never formally canonized: **the Bookshelf is the TIME ANCHOR of the BariAccess Expression Cascade.**

### 13.1 The Architectural Insight

The 7 expression surfaces (per CCO-ENG-EXPR-001 v2.0 §3) are not equal. Two of them serve as **anchors** — the other five are cascade recipients. The Routine Bookshelf is one of those two anchors.

| Anchor | Surface | Temporal mode |
|---|---|---|
| **TIME ANCHOR** | Surface #1 — Routine Bookshelf (this canon) | Event-driven (discrete) |
| **BREATH ANCHOR** | Surface #7 — The Logo (CCO-ENG-LOGO-EXPR-001 v1.1) | Continuous (ambient) + event-driven (BioSnap) |

The two anchors operate in parallel, in different temporal modes. The clock drives the Bookshelf. The body drives the Logo. Both produce expressions independently. They coordinate when their signals align (per EXPR v2.0 §6.5).

**Authority for full Two-Anchor Architecture:** CCO-ENG-EXPR-001 v2.0 §6.

### 13.2 Why the Bookshelf is the Time Anchor

The Bookshelf is the surface where time becomes visual. Each of the 17 sub-segment slots represents a discrete window of the day. As the system clock advances, slots activate at their assigned time-windows, and each activation is an expression event that drives the cascade through other surfaces.

**No other surface in the 7-surface inventory has this property:**

| Surface | Time-driven? |
|---|---|
| #1 Routine Bookshelf | ✅ YES — clock-driven, slot-by-slot |
| #2 Signal Bar tiles | ❌ No — driven by score changes, not time |
| #3 Rim | ❌ No — driven by trigger events, not time |
| #4 Ollie's Space | ❌ No — driven by messages/state changes, not time |
| #5 AI Playground / Morpheus | ❌ No — driven by Ollie's Space, not time |
| #6 Daily Pulse trackers | ❌ No — driven by program triggers, not time |
| #7 The Logo | 🟡 Partial — Rhythm Signal is continuous; BioSnap is event-driven by A6, not clock |

Only the Bookshelf has slot-by-slot time-window activation as its native firing mode. This makes it architecturally unique — and architecturally essential. Without the Bookshelf, the cascade would have no native time-driven trigger source.

### 13.3 Time Anchor Cascade Flow

When a sub-segment slot activates at its time-window, the cascade fires:

```
System clock = T
   ↓
Slot S(T) enters its time-window (per §6.5 + §14)
   ↓
Backend evaluates: which FAB(s) live in S(T)?
   ↓
Backend evaluates: are FAB(s) on track / drifting / missed?
   ↓
Color C selected (per EXPR v2.0 §4.1 cascade taxonomy
   + §4.3 ISE permission map)
   ↓
S(T) renders C on the Bookshelf surface
   ↓
Cascade fires SELECTIVELY through the 5 cascade recipients:
   • Signal Bar tile rim (Surface #2) — IF slot affects tile's score
   • Rim (Surface #3) — IF triggered
   • Ollie's Space (Surface #4) — speaks at slot activation
   • AI Playground / Morpheus (Surface #5) — coordinates with Ollie's Space
   • Daily Pulse trackers (Surface #6) — IF program triggered
   ↓
Logo (Surface #7) MAY color-coordinate but maintains
   independent breath cadence
```

**Key property:** The TIME anchor cascade is **discrete** — it fires when slots cross time boundaries, not continuously. Between slot activations, the cascade is silent unless another trigger source (BioSnap drop, ISE state change, Beacon/SC trigger) produces an expression event.

**Selective cascade rule** (Universal Misalignment Rule per EXPR v2.0 §7.6): Not every cascade fires every surface. Surfaces light up when their content is relevant to the trigger. The Smile Doctrine requires color-matching among whichever surfaces DO light up — but does not require all 6 cascade recipients to fire for every Bookshelf slot activation.

### 13.4 Reverse Fire — Logo to Bookshelf (DriftSnap Targeting)

The Bookshelf is not write-locked after a slot's time-window passes. Per EXPR v2.0 §10.4, when a BioSnap of type DriftSnap™ drops from the Logo (because A6 detected behavioral drift), the cascade may propagate **back** to a previously-active Bookshelf slot — coloring it Orange retrospectively to flag where the day's drift originated.

**Example:** A DriftSnap™ at 2 PM identifies that the source of drift was a 10 AM hydration FAB miss. The Logo drops the BioSnap. The cascade routes through Ollie's Space first (per EXPR v2.0 §7.7). Then the cascade colors the A2 slot Orange retrospectively — giving the patient a visual trace of where the day's drift originated, even though the A2 time-window has passed.

**Architectural significance:** The Bookshelf is a **living surface**, not a static daily log. Slot color can be updated by retrospective signals from the Logo (BREATH anchor → TIME anchor reverse fire). This preserves the Bookshelf's role as the day's behavioral trace, capable of being annotated by clinical/biometric signals that emerge later.

### 13.5 The Two Anchors Together

The architecture deliberately gives the patient two timing systems because **the body operates on two timing systems**:

- Daily routine adherence (clock-driven, conscious) → Bookshelf
- Long-arc biological/behavioral drift (slow, subconscious until trained) → Logo

Without the Bookshelf as TIME anchor, the cascade would have no native daily structure. Without the Logo as BREATH anchor, the cascade would have no native biology. With both, both layers of patient experience get visual surfaces.

**Aurora alignment** (per EXPR v2.0 §6.5): At Day 90+, patients begin to feel the Logo breath shift before any Bookshelf slot fires. The two anchors begin to feel synchronized. This is internalized proprioception — emergent from training, not a coded interaction. The Bookshelf provides the structure; the Logo provides the rhythm; the patient eventually carries both inside.

---

## §14. FAB-TO-SLOT MAPPING RULES (NEW IN v1.1)

### 14.1 The Mapping Principle

Each FAB lives in a specific sub-segment slot based on its **time-of-day occurrence**. FABs are not free-floating — they are time-coded into the 17-slot architecture per §6.5.

**Locked principle (per V dictation, Beat 4 + T-04 §3):**

> *Each FAB has a time-of-day, and the time-of-day determines its slot. Hydration before lunch lives in A1 or A2. Protein at 11 AM lives in A2. A 7 PM gym workout lives in B3. The slot is determined by when the FAB occurs.*

### 14.2 Worked Examples (from V dictation + T-04)

| FAB | Time-of-day | Slot | Umbrella | Reasoning |
|---|---|---|---|---|
| Wake routine | ~6:30 AM | AM1 | AM | Anchor slot — wake is a stable rhythm point |
| Coffee + breakfast | ~7:00 AM | AM2 | AM | Anchor slot — early morning routine |
| Light/circadian exposure | ~7:15 AM | AM3 | AM | Anchor slot — early morning routine |
| Hydration (mid-morning) | ~9:30 AM | A1 | Bridge A | Bridge slot — between AM and lunch |
| Protein snack | ~11:00 AM | A2 | Bridge A | Bridge slot — pre-lunch |
| Pre-lunch walk | ~11:45 AM | A3 or A4 | Bridge A | Bridge slot — late Bridge A |
| Lunch | ~12:30 PM | Mid1 | Mid | Anchor slot — midday meal |
| Post-lunch | ~1:30 PM | Mid2 | Mid | Anchor slot — early afternoon |
| Mid-afternoon | ~3:00 PM | Mid3 | Mid | Anchor slot — late midday |
| Afternoon hydration | ~4:00 PM | B1 | Bridge B | Bridge slot — afternoon |
| Pre-dinner snack | ~5:30 PM | B2 | Bridge B | Bridge slot — late afternoon |
| Gym workout | ~7:00 PM | B3 | Bridge B | Bridge slot — evening exercise |
| Cool-down / stretch | ~8:00 PM | B4 | Bridge B | Bridge slot — late evening |
| Dinner | ~8:30 PM | PM1 | PM | Anchor slot — evening meal |
| Wind-down | ~9:30 PM | PM2 | PM | Anchor slot — pre-sleep routine |
| Sleep | ~10:30 PM | PM3 | PM | Anchor slot — sleep onset |

**These are illustrative examples, not prescriptive.** Actual slot assignments are personalized to patient chronotype + schedule + clinical context during D0/BBS co-creation (per §4).

### 14.3 Multi-FAB Slot Rule

A single sub-segment slot can hold **multiple FABs** behind it. Per V's lock (May 2, 2026):

| Slot | Possible content |
|---|---|
| **A2 (10–11 AM)** | Hydration + Protein snack + Email check-in (3 FABs in one slot) |
| **B3 (7–8 PM)** | Gym workout + Cool-down stretch (2 FABs in one slot) |
| **AM2 (7 AM)** | Coffee + Breakfast (2 FABs in one slot) |

**Surface display:** The slot renders one color (the most consequential of the underlying FAB states — typically the worst, e.g., if any FAB in A2 is drifting, A2 renders Orange even if other FABs are on track). Card Expansion (per §6.5.4) reveals the individual FAB states underneath.

**Soft cap:** OQ-SHELF-07 OPEN — exact maximum FABs per slot not yet locked. V's guidance: 3 FABs per slot is acceptable, 20 FABs is "Ollie goes into therapy." Phase 1 build cap likely 3–5 per slot per Zakiy's discretion.

### 14.4 Anchor vs. Bridge Placement Heuristic

| Type | Best for |
|---|---|
| **Anchor slots** (AM1-3, Mid1-3, PM1-3) | Stable, recurring FABs tied to chronobiological anchors (wake, meals, sleep). Lower FAB count per slot, higher weight per FAB. |
| **Bridge slots** (A1-A4, B1-B4) | Flexible, variable FABs that fill the work day (commute, work blocks, breaks, errands, hydration, snacks, exercise). Higher FAB count per slot, more granular tracking. |

**Why this split:** The body anchors against rhythmic stability points; bridges absorb life's variability. Mixing them at the same granularity dilutes both.

### 14.5 FAB Time-Window Rules

A FAB's slot is determined by the **start time** of the FAB's expected occurrence, not its duration. A FAB lasting from 9:00–9:15 AM lives in the slot covering 9:00 AM, even if 9:15 AM is in a different slot.

For FABs that span slot boundaries (e.g., a 30-minute walk from 11:50 AM–12:20 PM, crossing A4 → Mid1), the FAB is anchored to the **start slot** for tracking purposes. Cross-boundary FABs may produce special handling in CCO-FAB-001 v1.3+ (TBD).

### 14.6 FAB Movement Across Slots

After the 72-Hour Commitment Rule expires (per §6.4), the patient may request to move a FAB to a different slot. Movement requests:

- Route through Ollie + provider review
- Are NOT executed silently by AI
- Get logged in the patient's behavioral history (V2 stream)
- May trigger ISE re-evaluation if the move signals a chronotype shift

**Authority for FAB movement governance:** CCO-FAB-001 v1.2 (FAB Canon) — coordinated with CCO-PROG-001 v2.1 for program FABs.

---

## §15. SLOT EXPRESSION ACTIVATION RULES (NEW IN v1.1)

### 15.1 The Activation Principle (LOCKED — per V dictation Beats 5, 6)

A sub-segment slot **does NOT carry expressions** outside its time-window. Slot expressions activate ONLY when the time-window is active or when retrospective signals (DriftSnap targeting per §13.4) annotate a previously-active slot.

**Locked rule (per V dictation, May 2, 2026):**

> *"The slot is silent until its time arrives. Then it expresses what's happening in the FAB(s) underneath. Once the time-window passes, the slot locks to its final state — Green if completed, Gray if missed, Orange if there's drift to surface."*

### 15.2 Three Slot States Across Time

A slot's expression behavior follows a predictable lifecycle across the day:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  STATE 1: PRE-WINDOW       STATE 2: IN-WINDOW       STATE 3: POST-WINDOW
│  (before slot's time)      (during slot's time)     (after slot closes)
│                                                             │
│      ─────                   ━━━━━                   ─────  │
│     dormant                 ACTIVE                  locked  │
│   (no color)              (renders C)              (G/Gy/O) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| State | Slot rendering | Tap behavior | Cascade fire? |
|---|---|---|---|
| **Pre-window (dormant)** | No color; outside time-window | No effect (outside time-window) | ❌ No |
| **In-window (active)** | Renders cascade color C per FAB state + ISE permission | Card Expansion opens (per §8.1) | ✅ YES — drives cascade |
| **Post-window (locked)** | Final state: Green / Gray / Orange | Card Expansion opens (for learning) | ❌ No (unless reverse-fire from Logo per §13.4) |

### 15.3 Biological/Behavioral Decay Reveal — V's Locked Rule

A critical architectural property (per V dictation, May 2, 2026):

> *"The slot reveals biological or behavioral decay early — meaning, the slot can show drift BEFORE the patient consciously realizes it. Because A6 sees the trend slope, and the slot's color reflects the FAB state, the slot lights up Orange even when the patient still thinks they're on track."*

**Mechanism:**

1. Patient is in A2 (10–11 AM, hydration FAB).
2. A6 detects the patient's hydration trend slope is drifting downward over the past 48 hours.
3. Even before the patient consciously notices being thirsty or having forgotten to drink water, A2 renders Orange to surface the drift early.
4. The cascade fires through Ollie's Space: *"Hydration is showing some drift — want to check in?"*
5. Patient receives the signal at the moment of in-window activity, not retroactively at the end of the day.

**Why this matters:** The Bookshelf is not a passive logger. It is a **leading indicator** when paired with A6 trend detection. Slot color reveals biology before patient awareness — making it a clinical proprioception trainer, not just a routine tracker.

### 15.4 Slot State Locking on Time-Window Exit

Once a slot's time-window passes, the slot locks to one of three final states:

| Final state | Trigger | Reversibility |
|---|---|---|
| **Green** | All underlying FABs completed (Y) within window | ❌ Cannot reopen (per §7.5 Grayed Out → cannot reactivate rule, applied to all locked states) |
| **Gray** | One or more underlying FABs missed (N) within window | ❌ Cannot reopen — but Card Expansion still allowed for learning per Decision D-5 |
| **Orange** | FAB(s) underway showed drift detected by A6/A2; persists post-window | 🟡 Can be re-annotated by reverse-fire from Logo (DriftSnap targeting per §13.4) — but the underlying FAB state cannot be retroactively changed |

**Key rule:** Final state locks behaviorally — patient cannot redo a missed FAB by tapping the slot. The slot's role post-window is to trace the day, not to enable retroactive completion.

### 15.5 Selective Cascade Per Slot Activation

Per the Universal Misalignment Rule (EXPR v2.0 §7.6), a slot activation does not blindly fire all 6 cascade recipients. The cascade fires selectively based on what's downstream of the slot's content:

**Example: 10 AM hydration FAB in A2 enters time-window with drift detected.**

| Surface | Renders Orange? | Reason |
|---|---|---|
| Bookshelf slot A2 | ✅ Yes | Slot is at its time-window, drift detected |
| Signal Bar tile rim (R&R) | ❌ No | Hydration drift does not directly affect R&R score domain |
| Daily Pulse FAB tracker rim | ✅ Yes | Triggers a program response in Row 5 |
| Ollie's Space | ✅ Yes | Speaks to the FAB |
| AI Playground / Morpheus | ✅ Yes | Coordinates with Ollie's Space |
| The Logo | ✅ Optional color-coord | Rhythm Signal may shift toward warmer breath |
| Other tile rims | ❌ No | Not affected by hydration |

**This is the canonical Bookshelf-to-cascade pattern.** Surfaces light up when the slot's content is relevant; surfaces stay dormant when it's not. The Smile Doctrine requires color-matching among whichever surfaces DO light up.

### 15.6 Ollie's Bookend Prompt Timing — OPEN

**OQ-SHELF-06** (migrated from T-04, preserved in §10.3): When does Ollie fire the prompt during a slot's lifecycle? At Bookend Open (start of time-window)? Mid-FAB? Bookend Close (end of time-window)? Multiple firings within window?

**Working hypothesis (NOT LOCKED):** Open Bookend at start of time-window (announce the FAB(s) in this slot); silent during in-window unless drift surfaces; Close Bookend at end of window (capture completion signal). This mirrors the Universal Bookend Doctrine (EXPR v2.0 §8) applied to slot level. However, this has not been canonized.

**Authority when locked:** CCO-ARCH-BOOKEND-001 (Bookend Universal Architecture canon — TBD).

### 15.7 FAB Close-Out Input — OPEN

**OQ-SHELF-09** (migrated from T-04, preserved in §10.3): How does a FAB get marked complete (Y/N) within the slot's time-window? Voice input? Text input? Auto-complete on biometric signal? Tap confirmation? All of the above?

**Working hypothesis (NOT LOCKED):** Voice + text + biometric auto-complete all valid inputs. Default behavior = patient confirms via Card Expansion tap; exception path = biometric auto-complete (e.g., wearable detects exercise, marks gym FAB complete without user action). Voice/text confirmations route through Ollie. Not yet canonized.

**Authority when locked:** CCO-FAB-001 v1.3+ or new CCO-UX-FAB-INPUT-001 (TBD).

---

## §16. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 WIP** | April 9, 2026 | Dr. Andrei + Claude | Initial Routine Bookshelf canon. Locks canonical name (replacing Routine Shell). Defines 3-umbrella structure (AM/Mid/PM). Two display behaviors. Permanence + removal rules (provider-only). Tile lock D0 progressive unlock. 72-Hour Commitment. Open questions: OQ-SHELF-01 through 04. Note in v1.0 §8: tapping a Green session opens Program WorkPad (later identified as incorrect). |
| **v1.1 DRAFT** | **May 2, 2026** | **Dr. Andrei + Claude** | **Major revision — companion lock to CCO-ENG-EXPR-001 v2.0. Absorbs and retires CCO-UX-BOOKSHELF-001 v1.0 per Decision D-3. NEW §6.5: 17-slot Sub-Segment Architecture (folds T-04 system — 9 anchor slots + 8 bridge slots). NEW §7: Three-Umbrella Structure (folds retired BOOKSHELF-001 content). PATCHED §7.4: color states cross-referenced to EXPR v2.0 §4 (no Bookshelf-specific color invention). PATCHED §7.5: v1.0 → v1.1 color model migration documented. PATCHED §8: Tap behavior — Card Expansion replaces Program WorkPad (corrects v1.0 §8 incorrect statement). Routine runs in BACKGROUND, NOT WorkPad. PATCHED §9: Connection to Expressions — full authority pointer to EXPR v2.0 §9. Closes OQ-SHELF-03. PATCHED §10: Open Questions — closes OQ-SHELF-03; preserves OQ-SHELF-01, 02, 04; adds 6 NEW OQ-SHELF-05 through 10 (5 migrated from T-04 + routine type variation). NEW §13: Time Anchor Architecture — Bookshelf as TIME ANCHOR of 7-surface cascade. NEW §14: FAB-to-Slot Mapping Rules (per V dictation Beat 4 + T-04 example placements). NEW §15: Slot Expression Activation Rules (per V dictation Beats 5, 6 — slot expressions activate ONLY at time-window; biological/behavioral decay revealed early). PATCHED §12: Cross-References updated for v1.1. Provenance updated with all v1.1 sources.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF DOCUMENT — CCO-UX-RBSHELF-001 v1.1
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
COMPANION LOCK: CCO-ENG-EXPR-001 v2.0 (May 2, 2026)
                CCO-ENG-LOGO-EXPR-001 v1.1 (May 2, 2026)
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. Internal use only. Licensed under Document Canon v2 governance (locked April 18, 2026).
