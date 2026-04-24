# README — MARK LONGITUDINAL DEMO
## Investor Meeting Build — April 24, 2026

**Document:** README_MARK_LONGITUDINAL_DEMO_v1.0.md
**Author:** BariAccess™ Canonical Architecture — Val + Claude
**Date:** April 24, 2026
**Status:** ACTIVE — ship to Zakiy immediately
**Purpose:** Brief Zakiy on the investor-meeting demo build. Three files. One arc. Mark's longitudinal story — good time, bad time, recovery.

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.

---

## SECTION 1 — WHY THIS EXISTS

We have a second investor meeting coming. The demo must show the BariAccess engine working — not described, not promised. Working.

Mark is the patient. He already exists in the Beacon Playground you built. We are extending what you built — not rebuilding it.

**The demo tells one story in three screens:**
- Screen A — Mark doing well.
- Screen B — Mark drifting. Ignoring Ollie.
- Screen C — Mark recovered. FABs did the work.

An investor watching those three screens understands the platform. No slides needed. No explanation needed. The display tells it.

---

## SECTION 2 — READ THESE FILES FIRST

Read in this exact order before writing a single line of code:

**STEP 1 — CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md**
The foundation you already built. Four panels. Four presets. The engine. Nothing in it changes.

**STEP 2 — CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md**
Three new scenarios (5, 6, 7). Six FABs. Ollie + Max copy per scenario. Play Sequence button. All additive.

**STEP 3 — CURSOR_MARK_JOURNAL_v1.0.md**
Journal Panel F. Six entries per scenario. Dot system. Animates with the Play Sequence. Additive only.

**STEP 4 — THIS README**
The framing. The investor story. The build sequence. What ships.

Do not skip steps. Each file assumes you have read the prior one.

---

## SECTION 3 — THE INVESTOR STORY

This is the narrative the demo must carry. You do not need to know this to build it. But you need to know it to understand what matters and what does not.

**MARK — 64 years old.** On Zepbound (tirzepatide) for weight and metabolic health. Active patient.

**NOVEMBER 2025 — GOOD TIME**
Mark is doing the work. Injections on time. Protein first. Sleep solid. Hydration held. His Beacon is green. His Journal is full. Ollie barely speaks. Nothing to flag.

**APRIL 2026 — BAD TIME**
Business stress. Holiday drift that did not recover. Two missed injections. Evening alcohol compounding. Sleep fragmented. Hunger absent at meals — under-eating on GLP-1 without noticing.

Ollie spoke. Max flagged the injection gap. Mark did not respond.

The Beacon moved into orange. The Journal entries disappeared. The FAB dots turned orange.

The platform saw it. The patient did not act. This is the adherence crisis. This is exactly what BariAccess was built to address.

**RECOVERY — FABS APPLIED**
Mark re-engages. Injection timing restored. Protein first at two meals. Hydration back on cadence. Sleep ambiance rebuilt. Alcohol reduced before the next social event.

The FAB dots turn green one by one. The Journal entries return. The Beacon climbs back to green.

The investor sees: the platform was right. The corrections were specific. The recovery was measurable. The engine worked.

---

## SECTION 4 — WHAT YOU ARE BUILDING

Three additions to the existing playground. Nothing else.

| Addition | What | Where |
|---------|------|-------|
| 1 | Three new scenario presets (5, 6, 7) | Panel A |
| 2 | Ollie + Max caption area | Below Beacon corridor |
| 3 | Panel E — FABs (six entries, dot states) | New panel |
| 4 | Panel F — Journal (six entries, dot states) | New panel below Panel E |
| 5 | Play Sequence button | Animates all panels 5→6→7 |

All specs live in the three Cursor docs. This README does not repeat them.

---

## SECTION 5 — WHAT THE JOURNAL SHOWS THE INVESTOR

This is important. Read it.

**Screen A (Good Time):**
Journal panel shows 5 green dots. All entries logged. All FABs on track. Ollie is quiet. Max is satisfied. The Beacon sits in green.

**Screen B (Bad Time):**
Journal entries start going orange and red. Injection missed. Hunger absent. Sleep degraded. Alcohol events logged but FAB was not acted on. Ollie spoke. Mark did not answer. The Beacon slides into orange. The Journal is the story.

**Screen C (Recovery):**
Journal dots turn green one by one. Each entry restored = one FAB working. The Beacon climbs back. Ollie confirms. Max anchors.

The investor understands without being told: when the patient journals, the numbers improve. When they stop, the numbers fall. The journal IS the behavioral signal.

---

## SECTION 6 — BUILD SEQUENCE

Do it in this order. Do not skip steps.

**STEP 1**
Open the existing playground HTML. Confirm the four existing presets still render correctly. Do not touch them.

**STEP 2**
Add Scenario 5, 6, 7 preset buttons. Load V-values from the longitudinal doc. Confirm SC, Beacon band, ISE all compute correctly through the existing engine.

**STEP 3**
Add Ollie + Max caption area beneath the Beacon corridor. Load copy from longitudinal doc Section 4. Use exact strings — do not rewrite.

**STEP 4**
Add Panel E (FABs). Six entries. Dot states from longitudinal doc Section 5 table. Confirm dots update when scenario changes.

**STEP 5**
Add Panel F (Journal). Six entries. Dot states from journal doc Section 4. Context text from journal doc Section 5. Confirm dots update when scenario changes.

**STEP 6**
Add Play Sequence button. Walk 5 → 6 → 7. Hold 5 seconds each. Animate: sliders, Beacon, ISE, copy, FAB dots, Journal dots — all together. Stop on Scenario 7 until user clicks another preset.

**STEP 7**
Full playthrough review. Run the sequence from start to finish. Confirm every panel updates correctly at every transition. Send Val a screen recording before declaring done.

---

## SECTION 7 — RULES — DO NOT VIOLATE

- ❌ Do not modify existing presets 1–4
- ❌ Do not modify the SC formula
- ❌ Do not modify Beacon band thresholds
- ❌ Do not modify ISE resolver logic
- ❌ Do not rewrite Ollie or Max copy
- ❌ Do not invent new FABs
- ❌ Do not invent new Journal entries
- ❌ Do not make Journal interactive
- ❌ Do not add clinical numbers anywhere
- ❌ Do not rebuild — only add

- ✅ Read the three Cursor docs in order
- ✅ Add only what is specified
- ✅ Send screen recording when done
- ✅ Ask Val before changing anything not specified in the three docs

---

## SECTION 8 — WHAT SHIPS

| # | File | Status |
|---|------|--------|
| 1 | README_MARK_LONGITUDINAL_DEMO_v1.0.md | This file — new |
| 2 | CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md | Already shipped — no changes |
| 3 | CURSOR_MARK_JOURNAL_v1.0.md | New — built today |
| 4 | Updated index.html | Zakiy builds from specs above |

Nothing else. No new architecture. No new files beyond these. No rebuilds.

---

## SECTION 9 — TIMELINE

| When | What |
|------|------|
| Today | Zakiy reads all three docs |
| Today | Steps 1–4 complete |
| Tomorrow | Steps 5–6 complete |
| Tomorrow | Full playthrough + screen recording sent to Val |
| Before investor meeting | Val reviews and approves or corrects |

If anything is unclear — ask Val. Do not guess. Do not invent. The specs are complete.

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.
