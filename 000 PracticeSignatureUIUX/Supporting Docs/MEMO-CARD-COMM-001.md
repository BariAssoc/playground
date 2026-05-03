# MEMO-CARD-COMM-001
## Cards as Communication Layer — Architectural Note

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — ARCHITECTURAL MEMO
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    MEMO-CARD-COMM-001
TITLE:          Cards as Communication Layer — Architectural Note
TYPE:           Architectural Memo (not yet a canon — captures insight
                pending formal canon authoring)
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — AI assist, not creator

PURPOSE:        Capture the architectural truth about cards as the
                communication layer of BariAccess — clarified during
                May 2, 2026 session — before it evaporates between
                sessions. This memo is a precursor to a formal canon
                (CCO-UX-CARD-COMM-001 — TBD).

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. THE INSIGHT

Cards are not a UX widget. Cards are **the communication layer of BariAccess** — the surface where the system speaks to the patient and the patient generates journals back to the system.

Every patient-facing message that requires more than a single line of Ollie speech, every clinical detail that needs structured display, every interaction that produces journal data — **flows through a card**.

This insight clarifies and expands the prior CCO-UX-CARD-001 v1.0 (ON HOLD, March 18, 2026) which framed cards primarily as tile/tracker engagement displays. CARD-001 remains correct for the surfaces it covers; this memo establishes that those surfaces are part of a broader communication model.

---

## §2. THE FOUR ORIGIN PATHS

Cards can originate from any of four sources. All four paths produce cards on the patient's surface; all four feed into the same downstream pipeline (display + journal generation).

| # | Origin | Trigger | Surface |
|---|---|---|---|
| **1** | **Program-originated** | Program opens on Rhythm Board | Rhythm Board card area |
| **2** | **Q-originated** | Patient taps Q icon → Q dropdown surfaces a card | Q dropdown context (Rhythm Board header) |
| **3** | **Constellation Panel-originated** | Slide / signal / score change in CP triggers a card on tile or tracker | On top of Constellation Panel (per CARD-001 §4) |
| **4** | **Bookshelf-originated** | Patient taps an active sub-segment slot or umbrella tile | Bookshelf area in Rhythm Board (Slot Card) |

**Plus a fifth path — patient-driven on-demand:**

| Path | Description |
|---|---|
| **"More" option** | Patient may request additional cards on-demand. Mechanism TBD. |

---

## §3. THE CARD → JOURNAL BRIDGE

This is the architectural connection that this memo formally captures for the first time:

> **Cards are the front-end of the Journal Entry Algorithm.**

When a patient interacts with a card, the interaction can produce a journal entry. The card surfaces the question; Ollie surfaces the prompt; Mark (the patient) responds; Max (AskABA in the background) processes; the entry flows into the Journal Entry Algorithm pipeline (per memory rule, April 24, 2026).

**Implications:**

- Every card is a **potential journal touchpoint**, not just a display surface
- Journal Entry Algorithm columns (#|Category|Entry|Question|Ollie→Mark(1st)|Ollie→Max|Max→Ollie|Ollie→Mark(2nd)|AskABA→Provider) map to interactions that happen *through* cards
- The card layer and the journal layer are not separate systems — they are tightly coupled

This bridge was implied across multiple prior sessions but was never explicitly canonized. This memo captures it.

---

## §4. SLOT CARD — NEW NAMED VARIANT

The Bookshelf-originated card path (Origin #4) introduces a new card variant: **the Slot Card.**

| Property | Value |
|---|---|
| **Name** | Slot Card |
| **Origin** | Routine Bookshelf — sub-segment slot or umbrella tile tap |
| **Content** | FAB-level reveal of what lives underneath the slot |
| **Surface** | Bookshelf area in Rhythm Board (NOT on top of Constellation Panel — see §6) |
| **Stacking** | TBD |
| **Gesture** | Tap to open (per RBSHELF v1.1 §6.5.4 + §8.1) |
| **Journal connection** | Yes — FAB close-out, drift acknowledgment, completion check-in all flow through Slot Card interactions |

**This name replaces the term "Card Expansion"** which was used in RBSHELF v1.1 and EXPR v2.0 §9.4 during the May 2, 2026 drafting session. "Card Expansion" was a working term that did not align with the broader card vocabulary. **Slot Card is the locked name.**

---

## §5. RECONCILIATION WITH PRIOR CANONS

| Canon | Status | Reconciliation |
|---|---|---|
| **CCO-UX-CARD-001 v1.0** (ON HOLD, March 18, 2026) | Constellation Panel cards | ✅ Preserved — covers Origin #3. Becomes a child canon under the broader communication-layer parent. Pending lock pending Val OQ resolutions. |
| **CCO-UX-RBCARD-001 v1.0** (WIP) | Rhythm Board card area | ✅ Preserved — covers Origin #1 + parts of Origin #2. Becomes a child canon. Pending lock. |
| **CCO-UX-RBDISP-001 v1.0** (WIP) | "Always 2 biometric cards or 1 biometric + 1 educational" rule | ✅ Preserved — applies to Rhythm Board card area display rules. |
| **RBSHELF v1.1** (filed May 2, 2026) | "Card Expansion" terminology | 🔧 Vocabulary correction needed — rename "Card Expansion" → "Slot Card" throughout. |
| **EXPR v2.0 §9.4** (filed May 2, 2026) | "Card Expansion" terminology | 🔧 Vocabulary correction needed — same rename. |
| **CARD-001 Rule 1** ("Cards stay in Constellation Panel") | Hard rule | ⚠️ Needs review — Slot Cards live in Rhythm Board, not Constellation Panel. Either (a) Rule 1 narrows to apply only to Origin #3 cards, or (b) Rule 1 is rewritten more broadly. To be resolved when CARD-001 is locked. |

---

## §6. SURFACE BOUNDARIES — WHERE CARDS LIVE

The four origins produce cards on different surfaces. This is intentional. Cards are not all on one surface; cards live where their origin lives.

```
RHYTHM BOARD (upper 2/3)
├── Header ──────── (Q icon — opens Q-originated cards in dropdown context)
├── Bookshelf ───── (Slot Cards — Origin #4)
├── Card Area ───── (Cards 1, 2, 3 + Memory Snap — Program-originated, Origin #1)
└── WorkPad ─────── (program-active state)

CONSTELLATION PANEL (lower 1/3)
├── Row 1 Tiles ─── (CP-originated cards — Origin #3, per CARD-001)
├── Row 2 Ollie ─── (no cards directly; cards may reference)
├── Row 5 Trackers (CP-originated cards — Origin #3, per CARD-001)
```

**Architectural rule:** A card may reference content across surfaces, but the card itself is anchored to its origin's parent surface.

---

## §7. WHAT THIS MEMO DOES NOT DO

This memo is a **capture**, not a canon. It does not:

- Define card visual design (Nikita's domain)
- Specify Slot Card animation, layout, or interaction details (TBD — would live in formal canon)
- Resolve CARD-001's open questions (OQ-CARD-01 through 06)
- Lock the "more" / on-demand path mechanics
- Reconcile CARD-001 Rule 1 ("Cards stay in Constellation Panel") with the Slot Card's Rhythm Board location
- Replace any existing canon

A formal canon — proposed ID **CCO-UX-CARD-COMM-001** — would do the above when drafted.

---

## §8. WHAT THIS MEMO DOES DO

- Captures the architectural truth that cards are the communication layer
- Names the Slot Card variant
- Names the four card origin paths
- Establishes the cards → journals bridge as canonical
- Triggers the vocabulary correction in RBSHELF v1.1 + EXPR v2.0 §9.4
- Provides the architectural reference point for future card canon work

---

## §9. NEXT STEPS

| # | Action | Owner | Timeline |
|---|---|---|---|
| 1 | This memo locked | Val | This session |
| 2 | Rename "Card Expansion" → "Slot Card" in RBSHELF v1.1 + EXPR v2.0 §9.4 | Claude | Immediately after memo lock |
| 3 | Draft formal CCO-UX-CARD-COMM-001 canon | Val + Claude | Future session (or this session if Deliverable 3 = 🔴) |
| 4 | Lock CCO-UX-CARD-001 v1.0 (with OQs deferred or resolved) | Val + Claude | Future session (or this session if Deliverable 3 = 🟡) |
| 5 | Reconcile CARD-001 Rule 1 with Slot Card Rhythm Board surface | Val | When CARD-001 is locked |

---

## §10. PROVENANCE

| Source | Contribution |
|---|---|
| Val dictation, May 2, 2026 (this session) | Cards as communication layer; four origin paths; cards → journals bridge; "more" path acknowledgment |
| CCO-UX-CARD-001 v1.0 (March 18, 2026) | Original card framework — Origin #3 (Constellation Panel) |
| CCO-UX-RBCARD-001 v1.0 (April 2026) | Origin #1 framework — Program-originated cards |
| Memory Rule April 24, 2026 — Journal Entry Algorithm | Cards → journals bridge (formalized in §3) |
| Memory Rule April 22, 2026 — Routine Bookshelf Display | Bookshelf as cardable surface (Origin #4) |
| RBSHELF v1.1 + EXPR v2.0 (filed May 2, 2026) | "Card Expansion" terminology — corrected to "Slot Card" by this memo |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF MEMO — MEMO-CARD-COMM-001
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. Internal use only.
