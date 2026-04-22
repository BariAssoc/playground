# CCO-UX-SCREENS-001 · Screenshot-to-Canon Methodology

**Version:** v1.2
**Status:** 🟢 Locked (methodology) · mixed card statuses (see deck below)
**Author:** Valeriu E. Andrei, MD · President
**Entity:** BariAccess LLC
**Date locked:** April 22, 2026
**Canon type:** Parent methodology · governs how native app screenshots become the UI/UX source of truth
**Version reason:** Phase 2 — Content Governance. §22 Content Governance Rule added. Deck extended with SHOT-007 through SHOT-017. Two reference documents attached to bundle: `Beacon_Seven_Bands_Pure.html` (SHOT-011 canonical reference) and `CCO-UX-ITB-DISP-001_v1.0_WIP.md` (ITB display rules). v1.0, v1.0.1, v1.0.2 preserved inside this bundle.

---

© 2026 BariAccess LLC. All rights reserved.
BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.
Confidential — Internal use only.

---

## Opening note — v1.2

> *v1.2 closes with a clear commitment. Going forward, every change to the Rhythm Board, the Constellation Panel, and the content that lives on them will be analyzed together as a team — aligned before it ships. Two lines we protect carefully: HIPAA compliance, and the canonical integrity of the Rhythm Board and Constellation Panel. No display crosses both surfaces at the same time. No customer-facing content ships without review. This version captures the guardrails; the next versions will build the work that earns them.*
>
> — Val

---

## §1. PURPOSE

This canon defines the methodology for converting native BariAccess app screenshots into the authoritative UI/UX reference. The output is two parallel core READMEs (Human + Code) plus three role-specific briefing READMEs (Zakiy, Marketing, Research) plus a visual gallery, versioned cumulatively, with every prior version preserved. The canon itself is editable and evolves with use.

## §2. SCOPE

**Governs:** screenshot intake, labeling, card structure, sequencing, versioning, edit handling, contradiction protocol, delivery bundles, display protocol, teaching-instance interpretation, content governance for customer-facing copy.

**Does not govern:** what the UI should be (individual CCO docs define that) · what the clinical or business logic behind a screen means (Beacon Canon, ISE Canon, Program Canon, CCO-UX-ITB-DISP-001, etc. define those).

## §3. THE SCREENSHOT CARD — FIELD DEFINITIONS

Every screenshot becomes one card with these fields:

| Field | Content |
|---|---|
| **ID** | `SHOT-###` — simple sequential, permanent, never reused |
| **Title** | Short name (dictated by Val) |
| **Surface** | Constellation Panel · Rhythm Board · Program WorkPad · 51/49 WorkPad · Inner Circle · Q · Three Dots · Parking Lot · AI Playground · Other |
| **State** | Idle · Program Active Vertical · ITB Full Screen · Human Mode · etc. |
| **Phase · Step** | e.g. Phase 2 · Step 3 |
| **Triggered by** | What the user did to arrive here |
| **Leads to** | What screen comes next |
| **Description — human** | Plain-language narrative — what is visible, what it feels like, what Ollie says |
| **Description — code** | Same screen as states, triggers, components, implementation notes |
| **Character count (customer-facing copy)** | Total characters with spaces / without spaces — when card contains Max/Ollie/UI copy |
| **Canon refs** | Which locked CCO docs this validates or touches |
| **Status** | 🟢 Approved/Reference · 🟡 WIP · 🔴 Contradiction · ⚪ Not Approved · ⚫ Superseded/Retired |
| **Version history** | v1, v2… (all preserved) |
| **Notes** | Anything flagged for review |

## §4. NUMBERING

Simple sequential: `SHOT-001`, `SHOT-002`, `SHOT-003`, etc. IDs are permanent. Never reused, never re-numbered when re-ordered. Grouping by Surface or Phase is done via fields, not via the ID.

## §5. PHASE STRUCTURE

**Phase 0 — Holding.** Always open. Default bucket for shots that do not yet belong in the user journey.

**Phases 1 → N — User Journey.** Opened as we go.

**Current phase registry (v1.2):**
- Phase 1 — Rhythm Board Foundation (SHOT-001 through SHOT-006)
- Phase 2 — Content Governance (SHOT-007 through SHOT-017)

## §6. STATUS TAXONOMY

| Status | Meaning |
|---|---|
| 🟢 **Approved / Reference** | Validated by simulation, matches canon, locked — OR — a canonical reference shot (e.g., SHOT-011 Beacon Pure) |
| 🟡 **WIP** | Uploaded, card built, concept committed but mechanics or details pending |
| 🔴 **Contradiction** | Screenshot conflicts with a locked CCO doc. Canon wins. Card stays in deck as WIP until simulation or team decision resolves it. |
| ⚪ **Not Approved** | Simulation reviewed and rejected. Preserved in deck with reason. |
| ⚫ **Superseded / Retired** | Replaced by a newer version or removed from the active flow. Preserved forever, never deleted. |

A card may carry compound status (e.g., 🔴 + 🟡) when a single shot shows both a contradiction and a WIP concept.

## §7. EDIT PROTOCOL

| Action | Behavior |
|---|---|
| **Add** | New ID assigned, slotted by Phase · Step |
| **Edit** | Version bumped. Old version preserved as ⚫ Superseded. |
| **Replace** | Old card → ⚫ Superseded. New card takes same Phase · Step slot. |
| **Remove** | Never deleted. Marked ⚫ Retired with reason. |
| **Re-order** | Phase · Step field updated. Master Index re-sorted. ID unchanged. |

Nothing is ever deleted. Every change is traceable through version history.

## §8. MASTER INDEX

A running table maintained inside the working conversation. Displayed on command:
- `Display Master Index` → full table
- `Show Phase X` → filtered to phase
- `Show all WIP` → filtered by status
- `Show all contradictions` → filtered by status

## §9. DUAL README OUTPUT — PARALLEL, SAME STORY, TWO VOICES

Both core READMEs contain the same cards in the same order, telling the same story in two dialects.

**README_HUMAN** — narrative voice. What the screen is, what it feels like, what Ollie/Max says, the brand and UX beat.

**README_CODE** — technical voice. States, triggers, transitions, component names, canon refs, implementation flags.

One story, two dialects, perfect parallel.

## §10. VERSIONING & ADDENDUM RULE

**Each shipped zip is CLOSED.** Once a version bundle is delivered, it is never re-opened or edited in place. All further work moves to the next version.

**Normal versioning = whole increments.** Sequence: v1.0 → v1.2 → v1.3 → v1.4 → ... → v2.0 (major jump on Val's declaration, typically at phase-complete or at launch).

**Point versions (vX.Y.Z) are emergency-patch only.** v1.0.1 was used to add role briefing READMEs; v1.0.2 was used to clarify §10 itself. Not the normal pattern.

**Content-preservation across versions:** each version's bundle contains the full cumulative state at that point. Prior shots, prior canon sections, prior role briefings — all carried forward and extended. Nothing lost, nothing overwritten.

**v-FINAL** is declared by Val when the canon is launch-ready for developer handoff.

**At each version lock, Claude states explicitly:** *"vX.Y is closed. Next upload begins vX.Y+1."*

## §11. CONTRADICTION RULE & SIMULATION GATE

When a screenshot contradicts locked canon:
1. Card flagged 🔴 Contradiction
2. Canon wins — the screenshot does NOT overrule canon
3. Card stays in deck, preserved, not discarded
4. Simulation (or team decision) is the resolution gate
5. After resolution, card transitions to 🟢, 🟡, or ⚪
6. All prior versions preserved regardless of outcome

## §12. WORKFLOW — SEQUENTIAL WITH EDIT-THEN-RESUME

Default flow: Val uploads → card built → next upload → card built → etc.

**Edit pattern:** Val may say *"edit Shot 7"* at any point. Edit executed, prior version preserved, change confirmed, then sequential flow resumes from where it paused.

## §13. COMMAND VOCABULARY

| Val says | Behavior |
|---|---|
| Uploads screenshot + dictates | Card built, added to index |
| *"Display all in chat"* | Full canon + all cards rendered |
| *"Show Master Index"* | Index table only |
| *"Show Phase X"* | That phase's cards only |
| *"Edit Shot ###"* | Revised card displayed fully, version-bumped |
| *"Replace Shot ###"* | Old retired, new slotted |
| *"Re-order"* | Phase · Step updated, re-sorted |
| *"Simulate Shot ###"* | Marked for simulation |
| *"Great, markdown version X"* | Delivery bundle exported |
| *"This is final — version X"* | Exported as `v-FINAL` |

## §14. DELIVERY BUNDLE SPEC

On version lock, one zip delivered: `BariAccess_UX_Canon_vX_Phase-X-Name.zip`. Contents:

**Canon + core READMEs:**
- `CCO-UX-SCREENS-001_vX.md` — this parent canon
- `README_HUMAN_vX.md`
- `README_CODE_vX.md`

**Role-specific briefing READMEs (standing since v1.0.1):**
- `README_ZAKIY_vX.md`
- `README_MARKETING_vX.md`
- `README_RESEARCH_vX.md`

**Visual + screenshots:**
- `GALLERY_vX.html` — self-contained visual gallery (base64-embedded)
- `screenshots/` folder

**Reference documents (attached when relevant):**
- `Beacon_Seven_Bands_Pure.html` (canonical Beacon display reference — v1.2)
- `CCO-UX-ITB-DISP-001_v1.0_WIP.md` (ITB display rules — v1.2)

## §15. CROSS-REFERENCES TO LOCKED & ACTIVE CANON

- Constellation Panel structure → CCO-CP-ARCH-001
- Rhythm Board display → CCO-UX-RBDISP-001 v1.2
- Signal Bar™ / Constellation Crown™ → CCO-UX-RBDISP-001
- 51/49 WorkPad → CCO-WP-5149-001 (WIP)
- Program WorkPad / Shell → CCO-ARCH-SHELL-001
- Program behavior → CCO-PROG-001 v2.1
- ITBs → CCO-ITB-001 v1.1 amendment
- **ITB Display → CCO-UX-ITB-DISP-001 v1.0 WIP (attached to v1.2 bundle)**
- Beacon → Beacon Canon v1.1 · **`Beacon_Seven_Bands_Pure.html` (attached to v1.2)**
- ISE states → ISE Canon v3.0
- Expressions → CCO-UX-EXPR-001 (colors, sizes, thresholds deferred to this canon — NOT mixed with Beacon)
- Ollie's Space → CCO-UX-OLLIE-001
- Bookshelf → CCO-UX-RBSHELF-001
- Parent methodology → META-ALGO-001 v1.1

## §16. DISPLAY PROTOCOL

| Situation | Display behavior |
|---|---|
| New screenshot uploaded | Brief confirmation + observations/flags |
| Version lock | One card fully drafted in all applicable voices, displayed for review, then build |
| Edit to existing card | Revised card displayed fully before update |
| *"Display all in chat"* | Full Master Index or full deck on command |
| Routine building | Silent — build, confirm when done |

## §17. RESOLVED OPEN QUESTIONS

All OQs from v1.0 resolved. See prior versions for history.

## §18. TEACHING INSTANCE RULE 🟢 LOCKED

Every screenshot in this canon is a **teaching instance**, not a production specification. The specific content visible in any given shot is an example of that moment, not a fixed rule.

**What IS canonical from a shot:** the rule being taught, the structural behavior, the expression logic.

**What is NOT canonical from a shot:** specific card types, specific numeric values, specific Ollie/Max messages, specific Bookshelf colors in the moment, specific notification counts.

Content is determined at runtime by the Program engine and Expression Layer rules.

## §19. PROVENANCE

**Drafted in conversation:** April 22, 2026
**Supersedes:** none (new canon)
**Builds on:** CCO-UX-RBDISP-001 · CCO-CP-ARCH-001 · META-ALGO-001 v1.1 · CCO-PROG-001 v2.1 · Beacon Canon v1.1 · CCO-UX-EXPR-001 · CCO-UX-ITB-DISP-001 v1.0 WIP

## §20. ROLE-SPECIFIC BRIEFING READMES 🟢 LOCKED (since v1.0.1)

Every version bundle includes three role briefings: `README_ZAKIY_vX.md`, `README_MARKETING_vX.md`, `README_RESEARCH_vX.md`. Written in Val's voice, distributed personally by Val.

## §21. [RESERVED]

*Reserved. Not canonized as team-facing rule.*

## §22. CONTENT GOVERNANCE RULE 🟢 LOCKED in v1.2

From v1.2 forward, customer-facing content across the app — Max lines, Ollie messages, tile labels, button text, program phase descriptions, notification copy, all in-app strings a customer may read — is released only after team review.

**Core reviewers:**
- **Val** — final word (51/49)
- **Zakiy** — technical feasibility
- **Clinical / Advisory Board** — clinical accuracy and tone

**Additional contributors added as Val deems appropriate.**

The review gate prevents internal acronyms (PQIS, CCIE, FAB, CPIE, ITB internals), protocol language ("label titration," "mechanism," "Week-4 export"), and canon terminology from reaching the customer. The canon and engineering docs keep their rigor internally; the customer encounters warm, precise, jargon-free language externally.

**Character count discipline:** customer-facing copy is measured by character count (with and without spaces), not only word count. UI speech bubbles are bounded by screen space, not word budgets.

**Expression properties** (colors, sizes, counts, thresholds, visual states) are deferred to the dedicated Expressions canon — not part of this content governance rule.

**HIPAA compliance guardrail:** no customer-facing content should reference clinical terms or data in ways that could expose identifiable patient information. Content review includes a HIPAA check.

**Scaffold integrity guardrail:** no customer-facing display may cover both the Rhythm Board and the Constellation Panel simultaneously except where CCO-UX-ITB-DISP-001 §2 explicitly authorizes (ITB full-screen). All other overlays must respect the scaffold.

---

*End of CCO-UX-SCREENS-001 v1.2*
