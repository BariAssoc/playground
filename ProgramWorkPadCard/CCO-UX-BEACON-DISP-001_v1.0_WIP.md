# BARIACCESS™ CANONICAL SPECIFICATION
## Beacon Visual Display Specification

**DOCUMENT ID:** CCO-UX-BEACON-DISP-001
**VERSION:** v1.0
**STATUS:** WORK IN PROGRESS — PENDING VAL APPROVAL
**AUTHOR:** Valeriu E. Andrei, MD | President
**COMPANIES:** VE Andrei MD Bariatric Associates, PA | BariAccess LLC | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.

---

## §1. PURPOSE

This canon defines the Beacon visual once — as a single underlying specification — with two deployment contexts.

- Zakiy builds it once.
- Nikita uses the same spec for the website.
- No duplication. No drift.
- Same concept. Same 7 bands. Same color gradient. Same circle landing in band.
- Different data. Different audience. Different purpose.

---

## §2. THE UNDERLYING ARCHITECTURE

The Beacon visual is a 7-band vertical corridor. The patient's SC score drops from above and lands in its corresponding band. The score is displayed as a circle that is **LARGER than the band width.**

The same architecture governs both deployment contexts. The visual logic does not change between contexts — only the data source and the audience change.

---

## §3. THE 7-BAND COLOR GRADIENT

Bands run from bottom (worst) to top (best):

| Band | Position | Color | Ollie Expression |
|------|---------|-------|-----------------|
| Band 1 | TOP — best | Dark Green | Pearl White Ollie — guardian mode, breathing |
| Band 2 | | Green | Blue + Green Ollie — programs, CTA |
| Band 3 | | Light Green | Orange Ollie — attention, monitor |
| Band 4 | | Light Orange | Orange Ollie — alert |
| Band 5 | SIGNAL | Orange | Orange → Red Ollie — clinical approaching |
| Band 6 | | Red | Red Ollie — crisis support |
| Band 7 | BOTTOM — CLINICAL TRIGGER | Dark Red | Red → Purple Ollie — emergency, handoff |

Val's description:
> *"Red, orange, light orange, light green, and go gradient to the dark green — therefore."*

**Note:** Exact hex color values and band breakpoints are governed by Beacon Canon v1.1 (internal IP — not repeated here). In all external-facing materials — band score ranges are shown as "xx" for IP protection.

---

## §4. THE SCORE CIRCLE

| Property | Specification |
|---------|--------------|
| Shape | Circle / bubble |
| Size | **LARGER than the band width** — overflows the band edges deliberately. Visually prominent. Intentional. |
| Placement | Circle sits in its corresponding band — centered vertically within that band |
| Animation | Circle appears at its correct size. No small→big animation required. Val: *"You don't have to do small. As long as you do it like this."* |
| Multiple scores | Multiple scores can appear simultaneously — each circle in its own band. Example: 75 in Band 3 / 72 in Band 5 / 70 in Band 6. Each labeled with its value. |
| Label | Score value displayed inside or beside circle — e.g., "75" visible |

---

## §5. TWO DEPLOYMENT CONTEXTS

---

### CONTEXT A — APP (FULL READBOARD WORK PAD)

**Where:** Top section of the Full Readboard Work Pad — same height as Row 1 (Signal Bar / Constellation Crown)

**What data:** Patient's LIVE personal SC score. Real data from their own profile. Multiple recent scores visible simultaneously in their bands.

**Who sees it:** The patient — their own data only. Private — HIPAA governed.

**When it appears:** When an ITB tagged as Full Readboard Work Pad is active.

**Purpose:** Shows the patient exactly where their score lands in the corridor. Makes the abstract score tangible. Contextualizes the ITB they are about to engage.

**Placement rules:**
- Appears immediately below the BariAccess header bar
- Same height/width as Row 1
- Routine Bookshelf remains below it — always visible
- ITB card content appears below the Beacon visual
- Queue indicator stays on

---

### CONTEXT B — WEBSITE (BARIACCESS.COM)

**Where:** Hero visual on BariAccess.com — Beacon corridor section (per MEMO-NIKITA-WEBSITES-001 v1.2)

**What data:** Illustrative / demo data only. No real patient data. Score values replaced with "xx" (IP protection per existing canon).

**Who sees it:** Prospects — biohackers — executives — B2B partners — investors — wellness professionals.

**When it appears:** Always — it is the hero visual for the BariAccess.com page.

**Purpose:** Explains HOW the scoring system works — demonstrates the concept — makes the engine visible to external audiences without disclosing proprietary breakpoints.

**Animation (website only):**
The score marker moves between bands — animated — shows the score dropping or rising.
Val: *"Show it as a living diagram. Not a static image. The score moves. The band changes. The expression responds."*

**Nikita note:**
Use this spec directly. Same 7 bands. Same colors. Same circle in band visual. Show Ollie's expression changing as the score moves between bands. Per CCO-UX-EXPR-001 — the color expression fires match the band.

---

## §6. BAND ↔ EXPRESSION MAP (BOTH CONTEXTS — CANONICAL)

| Band | Color | Ollie Expression |
|------|-------|-----------------|
| Band 1 — Dark Green | TOP | Pearl White — guardian mode, breathing |
| Band 2 — Green | | Blue + Green — programs, CTA |
| Band 3 — Light Green | | Orange — attention, monitor |
| Band 4 — Light Orange | | Orange — alert |
| Band 5 — Orange — SIGNAL | | Orange → Red — clinical approaching |
| Band 6 — Red | | Red — crisis support |
| Band 7 — Dark Red — CLINICAL TRIGGER | BOTTOM | Red → Purple — emergency, handoff |

Source: CCO-UX-EXPR-001 (locked)

---

## §7. WHAT IS NOT IN THIS DOCUMENT

The Beacon Corridor band breakpoints (exact score ranges per band) are governed by Beacon Canon v1.1. They are NOT repeated here.

In all external-facing materials (website, pitch decks, booth): band score ranges are shown as "xx" for IP protection.

In all internal materials: refer to Beacon Canon v1.1 directly.

---

## §8. OPEN QUESTIONS

**OQ-BEACON-01:** In Context A (App) — does the Beacon visual show ONLY the current SC score? Or also V1/V2/V3/V4 sub-scores as separate circles? Owner: Valeriu E. Andrei, MD.

**OQ-BEACON-02:** In Context A — how many historical scores appear simultaneously? Val's example showed 3 (75, 72, 70). Is 3 the standard? Or variable? Owner: Valeriu E. Andrei, MD.

**OQ-BEACON-03:** In Context B (website) — does the animated score marker show Ollie's expression changing in sync with the band? Or is the expression shown separately? Owner: Valeriu E. Andrei, MD + Nikita.

---

## §9. CROSS-REFERENCES

| Document ID | Relationship |
|-------------|-------------|
| Beacon Canon v1.1 | Band breakpoints and SC formula |
| CCO-UX-EXPR-001 | Band ↔ Expression map (locked) |
| CCO-UX-ITB-DISP-001 | Full Readboard Work Pad (Context A) |
| MEMO-NIKITA-WEBSITES-001 v1.2 | Website deployment (Context B) |
| CCO-IC-SC-001 | SC formula (locked) |

---

## §10. PROVENANCE

Transcript — Val + Zakiy dev conversation — April 2026
https://claude.ai/chat/3cd9b824-d1dc-4458-8a25-15a01ee4ca31

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.
