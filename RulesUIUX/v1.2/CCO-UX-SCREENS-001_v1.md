# CCO-UX-SCREENS-001 · Screenshot-to-Canon Methodology

**Version:** v1.0
**Status:** 🟢 Locked (methodology) · 🟡 WIP (cards in current phase)
**Author:** Valeriu E. Andrei, MD · President
**Entity:** BariAccess LLC
**Date locked:** April 22, 2026
**Canon type:** Parent methodology · governs how native app screenshots become the UI/UX source of truth

---

© 2026 BariAccess LLC. All rights reserved.
BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.
Confidential — Internal use only.

---

## §1. Purpose

This canon defines the methodology for converting native BariAccess app screenshots into the authoritative UI/UX reference. The output is two parallel READMEs (human + code) plus a visual gallery, versioned cumulatively, with every prior version preserved. The canon itself is editable and evolves with use.

## §2. Scope

**Governs:** screenshot intake, labeling, card structure, sequencing, versioning, edit handling, contradiction protocol, delivery bundles, display protocol, teaching-instance interpretation.

**Does not govern:** what the UI should be (individual CCO docs define that) · what the clinical or business logic behind a screen means (Beacon Canon, ISE Canon, Program Canon, etc., define that).

## §3. The Screenshot Card — field definitions

Every screenshot becomes one card with these fields:

| Field | Content |
|---|---|
| **ID** | `SHOT-###` — simple sequential, permanent, never reused |
| **Title** | Short name (dictated by Val) |
| **Surface** | Constellation Panel · Rhythm Board · Program WorkPad · 51/49 WorkPad · Inner Circle · Q · Three Dots · Parking Lot · Other |
| **State** | Idle · Program Active Vertical · Full Expand · AI Playground Open · Human Mode · etc. |
| **Phase · Step** | e.g. Phase 1 · Step 3 |
| **Triggered by** | What the user did to arrive here |
| **Leads to** | What screen comes next |
| **Description — human** | Plain-language narrative — what is visible, what it feels like, what Ollie says |
| **Description — code** | Same screen as states, triggers, components, implementation notes |
| **Canon refs** | Which locked CCO docs this validates or touches |
| **Status** | 🟢 Approved · 🟡 WIP · 🔴 Contradiction · ⚪ Not Approved · ⚫ Superseded/Retired |
| **Version history** | v1, v2… (all preserved) |
| **Notes** | Anything flagged for review |

## §4. Numbering

Simple sequential: `SHOT-001`, `SHOT-002`, `SHOT-003`, etc. IDs are permanent. Never reused, never re-numbered when re-ordered. Grouping by Surface or Phase is done via fields, not via the ID. When a shot is retired, its ID is retired with it.

## §5. Phase Structure

**Phase 0 — Holding.** Always open. Default bucket for shots that do not yet belong in the user journey — developer reference material, side views, anything on the side. Items can move out of Phase 0 into a journey phase when Val decides.

**Phases 1 → N — User Journey.** Opened as we go. Val declares a new phase when a new journey segment begins. No fixed list upfront. Each phase has a short name and Steps (1, 2, 3…) assigned in narrative order.

**Current phase registry (v1):**
- Phase 1 — Rhythm Board Foundation (SHOT-001 through SHOT-006)

## §6. Status Taxonomy

| Status | Meaning |
|---|---|
| 🟢 **Approved** | Validated by simulation, matches canon, locked |
| 🟡 **WIP** | Uploaded, card built, awaiting simulation or decision |
| 🔴 **Contradiction** | Screenshot conflicts with a locked CCO doc. Canon wins. Card stays in deck as WIP until simulation resolves it. |
| ⚪ **Not Approved** | Simulation reviewed and rejected. Preserved in deck with reason. |
| ⚫ **Superseded / Retired** | Replaced by a newer version or removed from the active flow. Preserved forever, never deleted. |

## §7. Edit Protocol

| Action | Behavior |
|---|---|
| **Add** | New ID assigned, slotted by Phase · Step |
| **Edit** | Version bumped (v1 → v2). Old version preserved as ⚫ Superseded. |
| **Replace** | Old card → ⚫ Superseded. New card takes same Phase · Step slot. |
| **Remove** | Never deleted. Marked ⚫ Retired with reason. |
| **Re-order** | Phase · Step field updated. Master Index re-sorted. ID unchanged. |

Nothing is ever deleted. Every change is traceable through version history.

## §8. Master Index

A running table maintained inside the working conversation. One row per card, sorted by Phase · Step. Fields shown: ID · Title · Surface · State · Phase · Step · Status · Version.

**Displayed on command:**
- `Display Master Index` → full table, all cards
- `Show Phase X` → filtered to that phase
- `Show all WIP` → filtered by status
- `Show all contradictions` → filtered by status

## §9. Dual README Output — parallel, same story, two voices

Both READMEs contain the same cards in the same order. Every card has two description voices telling the same story in two dialects.

**README_HUMAN** — narrative voice. What the screen is, what it feels like, what the user experiences, what Ollie or Max says, the brand and UX beat. Relatable to Val, Nikita, and any reader.

**README_CODE** — technical voice. Same screen as states, triggers, transitions, component names, canon refs, implementation flags for Zakiy.

A developer reading both sees one screen told twice. A marketer reading both understands the logic behind the feel. **One story, two dialects, perfect parallel.**

## §10. Versioning & Addendum Rule

Versions are cumulative. v1 is locked when Val says *"great, markdown version 1."* v1.1 = v1 content fully preserved + new work added as addendum. v1.2 = v1.1 + new addendum.

Nothing from a prior version is ever overwritten or lost. Each new version's bundle contains the full cumulative state at that point. **v-FINAL** is declared by Val when ready for launch and developer handoff.

## §11. Contradiction Rule & Simulation Gate

When a screenshot shows something that contradicts a locked CCO doc:

1. Card flagged 🔴 Contradiction with reference to the conflicting canon doc
2. Canon wins — the screenshot does NOT overrule canon
3. Card stays in deck as WIP, preserved, not discarded
4. **Simulation is the resolution gate**
5. After simulation, card transitions to 🟢 Approved, 🟡 WIP (still unresolved), or ⚪ Not Approved
6. All prior versions of the card are preserved regardless of outcome

## §12. Workflow — Sequential with Edit-Then-Resume

Default flow: Val uploads Shot 1 → card built → Shot 2 → card built → Shot 3 → etc. Forward motion.

**Edit pattern:** at any point, Val may say *"edit Shot 7"* or *"replace Shot 3"* or *"re-order 5 before 4."* Edit executed, prior version preserved, change confirmed, then sequential flow **resumes from where it paused.** Edits never break forward motion.

## §13. Command Vocabulary

| Val says | Behavior |
|---|---|
| Uploads screenshot + dictates | Card built, added to index |
| *"Display all in chat"* | Full canon + all cards rendered inline for review |
| *"Show Master Index"* | Index table only |
| *"Show Phase X"* | That phase's cards only |
| *"Edit Shot ###"* | Revised card displayed fully, version-bump on execution |
| *"Replace Shot ###"* | Old retired, new slotted in same position |
| *"Re-order"* | Phase · Step updated, Master Index re-sorted |
| *"Simulate Shot ###"* | Marked for simulation, await outcome |
| *"Great, markdown version X"* | Delivery bundle zip exported |
| *"This is final — version X"* | Exported as `v-FINAL` bundle for developer handoff |

## §14. Delivery Bundle Spec

On version lock, one zip file delivered: `BariAccess_UX_Canon_vX_Phase-X-Name.zip`. Contents:

- `CCO-UX-SCREENS-001_vX.md` — this parent canon, current version
- `README_HUMAN_vX.md` — human narrative with inline image refs
- `README_CODE_vX.md` — developer/code with inline image refs
- `GALLERY_vX.html` — self-contained visual gallery (base64-embedded images), grid default + vertical play-through toggle
- `screenshots/` folder — all images renamed as `SHOT-###_short-title.ext`

Opening any `.md` in a markdown viewer (VS Code, Obsidian, Mac Preview, GitHub) displays images inline. Opening `GALLERY_vX.html` in any browser shows the full visual sequence, no folder dependency.

## §15. Cross-references to Locked & Active Canon

Individual cards cross-reference as applicable:

- **Constellation Panel structure** → CCO-CP-ARCH-001 (note: needs correction per 33360)
- **Rhythm Board display** → CCO-UX-RBDISP-001 v1.2 (locked)
- **Signal Bar™ / Constellation Crown™** → CCO-UX-RBDISP-001 (pre-canon)
- **51/49 WorkPad** → CCO-WP-5149-001 (WIP)
- **Program WorkPad / Shell** → CCO-ARCH-SHELL-001
- **Program behavior** → CCO-PROG-001 v2.1 (locked)
- **ITBs** → CCO-ITB-001 v1.1 amendment
- **Beacon** → Beacon Canon v1.1
- **ISE states** → ISE Canon v3.0
- **Expressions** → CCO-UX-EXPR-001
- **Ollie's Space** → CCO-UX-OLLIE-001
- **Bookshelf** → CCO-UX-RBSHELF-001
- **Parent methodology (this doc)** → META-ALGO-001 v1.1

## §16. Display Protocol (locked)

| Situation | Display behavior |
|---|---|
| New screenshot uploaded | Brief line confirmation + observations/flags |
| Version lock (v1, v1.1, v2…) | **One card fully drafted in both voices, displayed for review, then build** |
| Edit to an existing card | **Revised card displayed fully** in both voices before update |
| *"Display all in chat"* | Full Master Index or full deck on command |
| Routine building | Silent — just build, confirm when done |

## §17. Open Questions — resolved status

- **OQ-SCREENS-01 (display on upload):** ✅ Brief confirmation on upload, full render on command.
- **OQ-SCREENS-02 (gallery layout):** ✅ Grid default + vertical play-through toggle in same HTML file.
- **OQ-SCREENS-03 (human README depth):** ✅ Human README carries full depth, parallel to Code README.

## §18. Teaching Instance Rule 🟢 LOCKED

Every screenshot in this canon is a **teaching instance**, not a production specification. The shot is chosen to illustrate one concept clearly — a state, a layout, an expression, a resize behavior. The specific content visible in any given shot is an **example of that moment**, not a fixed rule.

**What IS canonical from a shot:**
- The rule being taught (e.g., *"Program WorkPad launches vertical right-half"*)
- The structural behavior (e.g., *"cards stack left, Memory Snap drops, Bookshelf compresses"*)
- The expression logic (e.g., *"orange rim = Ollie attention call"*)

**What is NOT canonical from a shot:**
- The specific card types shown (HRV, Chronomuscle, Educational — these are examples)
- The specific numeric values (75, 82, 12 ms — placeholders or snapshots)
- The specific Ollie message (one of many possible)
- The specific Bookshelf segment color at that moment (examples of state)
- The specific Q notification count (example state)

**Content is determined at runtime by the Program engine and by the Expression Layer rules, not by the screenshot.** The Program decides which card appears in Slot 1. The Expression Layer decides which surface lights up orange, which stays green. A shot freezes one valid output of those systems — it does not define the only valid output.

**Placement of this rule:**
- **This parent canon (§18)** — source of truth
- **Preface of each README** (Human and Code) — quoted before the first card
- **Inline on every card** — short italic block directly below Phase/Step/Status, so the reader can never forget which parts are rules vs. examples

## §19. Provenance

**Drafted in conversation:** April 22, 2026
**Supersedes:** none (new canon)
**Builds on:** CCO-UX-RBDISP-001 · CCO-CP-ARCH-001 · META-ALGO-001 v1.1 (Canon Algorithm) · CCO-PROG-001 v2.1 · Beacon Canon v1.1 · CCO-UX-EXPR-001

---

*End of CCO-UX-SCREENS-001 v1.0*
