# CURSOR DEVELOPER PROMPT — MARK JOURNAL PANEL v1.0

**Document:** CURSOR_MARK_JOURNAL_v1.0.md
**Author:** BariAccess™ Canonical Architecture — Val + Claude
**Date:** April 24, 2026
**Status:** SANDBOX — extends longitudinal demo
**Pre-canon reference:** CCO-JOUR-001 (journal canon pending lock)
**Purpose:** Add Journal Panel (Panel F) to the Mark Beacon Playground — showing Mark's self-reported behavioral state across the three longitudinal scenarios.

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.

---

## SECTION 1 — WHAT THIS IS

This document adds Panel F (Journal) to the existing Mark Beacon Playground. It does NOT rebuild anything. It is additive only.

**Read in this order before touching code:**

1. `CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md` — foundation, already built
2. `CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md` — scenarios 5/6/7, FABs, Ollie+Max copy
3. **THIS DOCUMENT** — Journal Panel F, adds to the above

---

## SECTION 2 — WHAT THE JOURNAL IS

The Journal is a behavioral record that builds from three sources:

1. **ITB answers** — patient responds to questions inside a program → journal logs automatically
2. **FAB completion** — each FAB that fires and is confirmed becomes a journal entry
3. **Ollie Yes/No interactions** — patient taps a response → journal captures it as V3

In the demo, the Journal Panel shows Mark's behavioral state in a simple card format. No numbers. States only. Dot system.

**THE KEY INSIGHT FOR THE INVESTOR DEMO:**
When the Journal entries disappear → the scores fall.
When they return → the scores climb.
The absent journal entry IS the clinical signal.
The journal is not decoration. It is data.

---

## SECTION 3 — WHERE THE JOURNAL PANEL LIVES

Add Panel F immediately below Panel E (FABs).

**Label:** JOURNAL — Mark's Daily Record

The Journal Panel is visible in all three scenarios. It updates when a new scenario is loaded — same behavior as Panel E dots.

---

## SECTION 4 — JOURNAL ENTRIES BY SCENARIO

Each entry has: entry name (short label) / state dot / one-line status note.

**Dot legend:**
- ✅ = logged and complete
- 🟠 = logged but incomplete or drifting
- 🔴 = flagged — needs attention
- ⚪ = dormant / not applicable this period

---

### SCENARIO 5 — GOOD TIME (November 2025)
*Mark's journal is active and consistent. Ollie has little to intervene on.*

| Dot | Entry | Status |
|-----|-------|--------|
| ✅ | GLP-1 Injection | Logged — Sunday 7:14 AM — on cadence |
| ✅ | Protein First | Logged — breakfast + lunch — 2 of 2 meals |
| ✅ | Hydration | Logged — structured cadence through the day |
| ✅ | Sleep Ambiance | Logged — 7.2 hrs — continuous — held |
| ✅ | Hunger Check | Hunger appropriate at meal times — GLP-1 suppression working as expected |
| ⚪ | Alcohol | Not applicable — none reported this period |

---

### SCENARIO 6 — BAD TIME (April 2026)
*Mark's journal entries are sparse and missing. The absent entries ARE the signal. Ollie is present. Mark is not responding.*

| Dot | Entry | Status |
|-----|-------|--------|
| 🟠 | GLP-1 Injection | 2 of last 3 weekly injections missed — not logged at injection time |
| 🟠 | Protein First | Inconsistent — 1 of 2 meals only |
| 🟠 | Hydration | Dropped — cadence lost — distribution skewed toward end of day |
| 🔴 | Sleep Ambiance | Degraded — 5.1 hrs — fragmented — ambiance conditions not maintained |
| 🔴 | Hunger Check | Hunger absent at expected meal times — FLAGGED — under-eating risk on GLP-1 |
| 🟠 | Alcohol | Evening pattern — 3 social events logged — Vulnerable space activated — Alcohol FAB engaged but not acted on |

---

### SCENARIO 7 — RECOVERY (FABs Applied)
*Mark's journal is rebuilding. Entries returning one by one. Ollie confirms progress. Max anchors it.*

| Dot | Entry | Status |
|-----|-------|--------|
| ✅ | GLP-1 Injection | Restored — weekly cadence — logged at injection time |
| ✅ | Protein First | Restored — 2 meals — breakfast + lunch |
| ✅ | Hydration | Cadence back — distributed through day |
| ✅ | Sleep Ambiance | Improving — 6.8 hrs — ambiance restored |
| ✅ | Hunger Check | Hunger returning at expected windows — appropriate meal timing — GLP-1 working |
| ✅ | Alcohol | Reduced — 1 event logged — FAB engaged before event — plan followed |

---

## SECTION 5 — JOURNAL PANEL RENDERING RULES

**1. DISPLAY FORMAT**
Show each entry as a single row:
`[Dot] [Entry Name] [Status note]`
No numbers. No clinical values. Status notes are short — 1 line maximum.

**2. CARD HEADER**
At the top of Panel F, show: *"JOURNAL — Mark's Daily Record"*
Below the header, one line of context text that changes per scenario:

- Scenario 5: *"Active and consistent."*
- Scenario 6: *"Entries missing. This is the signal."*
- Scenario 7: *"Rebuilding. One entry at a time."*

**3. DOT SYSTEM**
Same dot system as Panel E (FABs). The two panels should look like siblings — consistent visual language.

**4. UPDATES WITH SCENARIO CHANGE**
When a new scenario is loaded (via preset button or Play Sequence), Panel F updates its entries immediately — same timing as Panel E dot updates.

**5. NO INTERACTIVITY REQUIRED IN DEMO**
Journal entries are static display only in this version. Patient does not tap anything. This is a read-only panel for the investor demo. Interactivity comes in Phase 2.

---

## SECTION 6 — PLAY SEQUENCE UPDATE

The Play Sequence button defined in `CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md` must now also animate Panel F.

When the sequence walks Scenario 5 → 6 → 7:
- Panel F journal entries update with each scenario transition
- Dots animate from complete (✅) to drifting (🟠/🔴) to restored (✅)
- Context text fades and updates
- Journal and FAB panels animate together — they are visually linked

**This is the core investor moment:**
The investor watches the dots shift. The Beacon moves. The Journal empties. Then the FABs engage. The Journal rebuilds. The Beacon climbs back. No explanation needed. The display tells it.

---

## SECTION 7 — RULES CURSOR MUST FOLLOW

- ❌ Do NOT invent new journal entries. Only the six defined above.
- ❌ Do NOT show clinical numbers in the journal panel. States and dots only.
- ❌ Do NOT make the journal interactive. Read-only for this demo.
- ❌ Do NOT change Panel A through E. Panel F is additive only.
- ❌ Do NOT change Ollie or Max copy. That is locked in the longitudinal doc.

---

## SECTION 8 — PRE-CANON NOTE

This document is the first concrete instance of the BariAccess Journal architecture.

**Future canon document:** CCO-JOUR-001 (Journal Canon — not yet built)

When CCO-JOUR-001 is locked, this simulation document will be updated to reference it. Until then — this document IS the reference.

The six entries in Section 4 represent the journal FAB categories confirmed for the Zepbound (tirzepatide) ITB use case:
GLP-1 Injection / Protein First / Hydration / Sleep Ambiance / Hunger Check / Alcohol

---

## SECTION 9 — CANONICAL REFERENCES

| Document | What it governs |
|---------|----------------|
| CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md | Foundation playground |
| CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md | Scenarios, FABs, Ollie+Max copy |
| Beacon Canon v1.1 | 7-band corridor |
| ISE Canon v3.0 | ISE states and resolver |
| CCO-IC-SC-001 | SC formula |
| CCO-JOUR-001 | Journal Canon (pending) |
| V3 Space-State definitions | Protected (1.0) / Challenging (1.25) / Vulnerable (1.5) |

---

## SECTION 10 — WHAT SHIPS TO ZAKIY

1. `CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md` — already shipped, no changes
2. `CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md` — already shipped, no changes
3. `CURSOR_MARK_JOURNAL_v1.0.md` — this file (new)
4. `README_MARK_LONGITUDINAL_DEMO_v1.0.md` — shipped with this file
5. Updated `index.html` with Panel F added

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.
