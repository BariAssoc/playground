# BariAccess UX Canon · Phase 1 + Phase 2

## README_CODE — v1.2

**Phases:** 1 — Rhythm Board Foundation · 2 — Content Governance
**Cards:** SHOT-001 through SHOT-017
**Version:** v1.2
**Status:** Mixed (see card index)
**Author:** Valeriu E. Andrei, MD · President
**Entity:** BariAccess LLC
**Date:** April 22, 2026
**Intended reader:** Zakiy (lead developer) and engineering team.

---

© 2026 BariAccess LLC. All rights reserved.
Confidential — Internal use only.

---

## Opening note — from Val

> *v1.2 closes with a clear commitment. Going forward, every change to the Rhythm Board, the Constellation Panel, and the content that lives on them will be analyzed together as a team — aligned before it ships. Two lines we protect carefully: HIPAA compliance, and the canonical integrity of the Rhythm Board and Constellation Panel. No display crosses both surfaces at the same time. No customer-facing content ships without review. This version captures the guardrails; the next versions will build the work that earns them.*
>
> — Val

---

## Preface — how to read this document

This is the developer-facing spec. Phase 1 (see `README_CODE_v1.md` from v1.0.2 bundled here) locked the foundation: Constellation Panel scaffold, Rhythm Board layout modes, Program WorkPad resize, Expression Layer vs. Beacon separation, 72-hour commitment rule, Learn→Intervene Branch Point.

Phase 2 locks the guardrails:
- **§22 Content Governance** — no customer-facing copy ships without team review
- **CCO-UX-ITB-DISP-001 §2** — ITBs are full-screen only; they hide Constellation Panel + Daily Pulse
- **Beacon canonical display** — pure colors, no text, per `Beacon_Seven_Bands_Pure.html`
- **Scaffold integrity** — no display covers both Rhythm Board and Constellation Panel except canonical ITB

### Teaching Instance Rule

> *Specific content in each shot (numbers, card types, messages, notification counts) is an example. Build components to accept engine-driven values. Do not hardcode from the screenshots.*

### Two color systems — never cross-reference

- **Beacon** = algorithmic, SC formula, seven bands, fires only when `tile.unlocked=true`.
- **Expression Layer** = Ollie-triggered, communicative, five surfaces (Bookshelf, Signal Bar rims, Ollie's Space, AI Playground, Daily Pulse). Independent of scoring.

Build them as two independent subsystems. Same hex = palette coincidence, not a link.

### Rule #1 — Ollie owns all Expression Layer signals

---

## Card Index (Phase 2)

| ID | Title | State / Component | Status |
|---|---|---|---|
| SHOT-007 | Max Message — Content Governance | `ai_playground.max_message_bubble` | 🔴 |
| SHOT-008 | Rhythm Board White Gap | Rhythm Board render bug | 🔴 |
| SHOT-009+010 | Beacon — Text Must Be Removed | Beacon display component | 🔴 |
| SHOT-011 | Beacon Canonical Display | Beacon display canonical reference | 🟢 Reference |
| SHOT-012 | ITB Half-Display | ITB state violation (`itb.display_mode != full_screen`) | 🔴 |
| SHOT-013 | ITB Full-Width Partial | ITB state violation (Constellation still visible) | 🔴 |
| SHOT-014 | Education Journal | New component — Journal — WIP | 🟡 |
| SHOT-015 | Intervene Journal | Same Journal component, Intervene phase | 🟡 |
| SHOT-016 | Program Calendar | New component — Program Calendar — WIP | 🟡 |
| SHOT-017 | Full-Screen Content Overlay | Unauthorized surface — retire and rehome | 🔴+🟡 |

---

## SHOT-007 · Max Message — Content Governance

![SHOT-007](screenshots/SHOT-007_max-message-original.jpeg)

**Status: 🔴 Contradiction**

> *Teaching Instance — specific message string in this shot is illustrative; the rule is that customer-facing Max strings pass content governance before shipping.*

**Component:** `ai_playground.max_message_bubble`
**Surface:** AI Playground (Max's only surface)
**Content source:** runtime string from reviewed content library

**Implementation requirements:**
- Max bubble strings are runtime-loaded from a content library gated by §22 Content Governance review
- Pipeline must reject strings containing internal acronyms (PQIS, CCIE, FAB, CPIE, ITB internals) or protocol-language terms (`label titration`, `mechanism`, `Week-4 export`) unless explicitly whitelisted by review
- Copy stored with metadata: content_id, reviewer(s), review_date, review_status

**Corrected canonical copy (this specific string):**
> *"Learn with Max. Earn recognition credits along the way. When you're ready, Ollie guides you to your next program — where your credits can be redeemed."*

- Word count: 25
- Characters with spaces: 152
- Characters without spaces: 127

**Component flags:**
```
ai_playground.max_message_bubble.content_id       : references content library entry
content_library.entry.review_status               : "approved" | "pending" | "rejected"
content_library.entry.reviewers                   : ["val", "zakiy", "clinical_board"]
content_library.entry.review_date                 : ISO timestamp
publishing_pipeline.block_unreviewed              : true (hard gate)
```

**Canon refs:** CCO-UX-SCREENS-001 §22.

---

## SHOT-008 · Rhythm Board White Gap

![SHOT-008](screenshots/SHOT-008_rhythm-board-white-gap.jpeg)

**Status: 🔴 Contradiction**

> *Teaching Instance — the rule being taught is that the Rhythm Board must never render an uncovered region.*

**Bug description:** The Rhythm Board rendered white/empty space between the Memory Snap and the Bookshelf. No canonical state authorizes this.

**Root cause investigation needed:**
- Possible: a child component unmounted without the parent reshaping layout
- Possible: a layout mode transition failed to re-flow
- Possible: a content-region intended to hold a component (e.g., Program Calendar) rendered empty because the component wasn't ready

**Implementation requirements:**
- Rhythm Board parent component must enforce that all child regions are filled per canonical layout mode
- If a child component is unmounted, the parent must reshape layout (e.g., merge regions, expand neighbors) — never show raw background
- Add runtime assertion in dev builds: `assert(rhythm_board.has_no_uncovered_regions)`

**Canon refs:** CCO-UX-RBDISP-001 v1.2 · CCO-UX-ITB-DISP-001 v1.0 WIP.

---

## SHOT-009 + SHOT-010 · Beacon — Text Must Be Removed

![SHOT-009](screenshots/SHOT-009_beacon-with-labels.jpeg)

![SHOT-010](screenshots/SHOT-010_beacon-warning-text.jpeg)

**Status: 🔴 Contradiction (combined)**

> *Teaching Instance — two shots, one rule: Beacon display is colors only in the customer app.*

**Bug description:**
- SHOT-009: Beacon component is rendering left-column state names ("Optimal corridor," "Strong alignment," "Stable edge," "Drift watch," "Overload & Recovery," "High load," "Clinical focus") and right-column ISE labels ("ISE-4," "ISE-2," etc.) in customer-facing UI.
- SHOT-010: Beacon component additionally renders a warning banner ("⚠ APPROACHING CLINICAL INTERSECTION") in customer-facing UI.

**Implementation requirements:**
- Customer-facing Beacon display = pure seven-band color stack, zero text. See `Beacon_Seven_Bands_Pure.html` in bundle.
- State names and ISE labels belong in provider/admin dashboards only — separate component with separate mount paths
- Warnings handled through Ollie's Space messaging, NOT in the Beacon component itself

**Component separation required:**
```
beacon.customer_display     : pure color bands (reference: Beacon_Seven_Bands_Pure.html)
beacon.provider_dashboard   : full state names, ISE labels, warnings (DIFFERENT component, DIFFERENT route)
```

**Canon refs:** Beacon Canon v1.1 · CCO-UX-EXPR-001 · attached `Beacon_Seven_Bands_Pure.html`.

---

## SHOT-011 · Beacon Canonical Display (Pure Bands)

![SHOT-011](screenshots/SHOT-011_beacon-canonical-display.jpeg)

**Status: 🟢 Reference**

> *Teaching Instance — this is the canonical reference for customer-facing Beacon display.*

**Reference artifact:** `Beacon_Seven_Bands_Pure.html` (attached to this bundle)

**Seven bands, top to bottom:**
1. Deep Green (`#0d6b2a`)
2. Green (`#3ba03e`)
3. Faint Green (`#9dc64d`)
4. Very Light Green (`#d4ecb0`)
5. Orange (`#ef8a17`)
6. Red (`#d63d34`)
7. Dark Red (`#8f1a14`)

**Implementation:** Use `Beacon_Seven_Bands_Pure.html` as the visual specification. Hex values shown are tuned for screen readability — if the clinical team locks different exact hex values via Beacon Canon v1.1, those override this reference.

**Component:** `beacon.customer_display`
**Rendering:** seven stacked equal-height colored bands, no text, no labels, no borders except optional subtle internal highlight/shadow for depth.

**Canon refs:** Beacon Canon v1.1 · `Beacon_Seven_Bands_Pure.html`.

---

## SHOT-012 · ITB Half-Display

![SHOT-012](screenshots/SHOT-012_itb-half-display-contradiction.png)

**Status: 🔴 Contradiction**

> *Teaching Instance — violates CCO-UX-ITB-DISP-001 §2.*

**Violation:** ITB is rendered in a right-half split while cards remain on the left and Constellation Panel + Daily Pulse remain visible below. CCO-UX-ITB-DISP-001 §2 requires ITBs to open to FULL SCREEN with Constellation Panel and Daily Pulse HIDDEN.

**Implementation requirements (per CCO-UX-ITB-DISP-001):**
- ITB trigger event must force `layout_mode = itb_full_screen`
- In `itb_full_screen` mode: hide Rhythm Board children, hide Constellation Panel, hide Daily Pulse
- ITB component renders across entire viewport minus the top chrome (Three Dots · BariAccess logo · Q)
- ITB card pagination ("Card N of Total") must always be visible (CCO-UX-ITB-DISP-001 §3)

**Component flags:**
```
layout_mode                        : "idle" | "program_active_vertical" | "itb_full_screen" | ...
itb.display_mode                   : locked to "full_screen" on trigger
constellation_panel.visible        : false when layout_mode == "itb_full_screen"
daily_pulse.visible                : false when layout_mode == "itb_full_screen"
itb.current_card.number            : integer
itb.total_cards                    : integer, ≤ 20 per CCO-UX-ITB-DISP-001 §3
```

**Canon refs:** CCO-UX-ITB-DISP-001 v1.0 WIP §2, §3 · CCO-PROG-001 v2.1.

---

## SHOT-013 · ITB Full-Width Partial

![SHOT-013](screenshots/SHOT-013_itb-full-width-partial-contradiction.png)

**Status: 🔴 Contradiction**

> *Teaching Instance — closer to canonical than SHOT-012, but still violates §2.*

**Violation:** ITB takes the full width of the Rhythm Board, but Constellation Panel and Daily Pulse remain visible at the bottom of the screen. §2 requires ALL of those to be hidden — not just the Rhythm Board children.

**Implementation requirements:** same as SHOT-012. `layout_mode = itb_full_screen` must hide ALL non-ITB surfaces including Constellation Panel and Daily Pulse.

**Canon refs:** CCO-UX-ITB-DISP-001 v1.0 WIP §2.

---

## SHOT-014 · Education Journal (Learn phase)

![SHOT-014](screenshots/SHOT-014_education-journal-learn.png)

**Status: 🟡 WIP**

> *Teaching Instance — Journal concept is committed; mechanics are WIP.*

**Concept (committed):** A Programs Journal component that captures what the customer learned (or felt) during Learn/Intervene phases. Tap-only interaction, no typing required. Sequential prompts (1 of N format).

**Mechanics (WIP — do NOT hardcode):**
- Trigger timing: may be post-Learn-completion, may be earlier, may be integrated into Learn question answers themselves
- Component placement: may be a separate upper-right card on the Rhythm Board (as shown), may be a modal, may be inline within the Learn phase
- Prompt content: illustrative only. Final prompts go through §22 Content Governance.
- Number of prompts per phase: illustrative (shown as "1 of 6")

**Design principles (locked):**
- **Tap-only** — no typing required
- **Simple** — not overwhelming, not obvious as a heavy separate surface
- **Captures V3 data** — patient input per CCO-ARCH-VVAL-001 (pending)

**Component flags (placeholder — pending full spec):**
```
journal.phase                 : "learn" | "intervene"
journal.prompt_index          : integer
journal.total_prompts         : integer
journal.response_type         : "tap_option" (locked — no typing)
journal.options               : array of tap button strings (content library)
journal.recorded_as           : "v3" (V3 data per CCO-ARCH-VVAL-001)
journal.trigger_event         : TBD — defer to Program engine
journal.ui_presentation       : TBD — defer to UX team
```

**Canon refs:** CCO-UX-SCREENS-001 §22 (prompt content) · CCO-ARCH-VVAL-001 (pending).

---

## SHOT-015 · Intervene Journal

![SHOT-015](screenshots/SHOT-015_intervene-journal.png)

**Status: 🟡 WIP**

> *Teaching Instance — same Journal component, Intervene phase.*

**Same as SHOT-014.** Additional flags from this shot:

- Prompt shown in this screen (*"What CPIE behavior do you want visible on your Week-4 export?"*) contains internal vocabulary (CPIE, Week-4 export). Must go through §22 review before shipping.
- Max bubble paired with this shot (*"Pad is complete — capture the Intervene story before CPIE lands in Inner Circle"*) also requires §22 review — leaks protocol language.

**Canon refs:** CCO-UX-SCREENS-001 §22.

---

## SHOT-016 · Program Calendar (Tirzepatide)

![SHOT-016](screenshots/SHOT-016_program-calendar-tirzepatide.png)

**Status: 🟡 WIP**

> *Teaching Instance — Calendar concept is committed; layout and position are WIP.*

**Concept (committed):** For medication-class programs (e.g., Tirzepatide injection cadence), the Rhythm Board displays a Program Calendar showing weekly anchors, injection days, and MD follow-ups. Ties into the export/sync layer for medication tracking.

**Hard rule (locked):** The Calendar MUST NOT jam the Rhythm Board. No induced scroll. No overflow.

**Candidate layouts (WIP — do NOT lock):**
1. Full horizontal block
2. Partial horizontal (half width, paired with another component)
3. Upper half of Rhythm Board
4. Lower half of Rhythm Board
5. Collapsed summary on RB + "Full view" button for expansion (visible in this shot)

**Component flags (placeholder):**
```
program_calendar.mounted                : true for medication-class programs
program_calendar.layout                 : "TBD" — set by Program engine per program type
program_calendar.cadence_source         : link to program.injection_schedule
program_calendar.rb_jam_assertion       : runtime check — must not force RB scroll
program_calendar.fullview_expansion     : TBD — modal, separate route, or off-RB
```

**Canon refs:** CCO-UX-RBDISP-001 v1.2 · CCO-UX-SCREENS-001 §22.

---

## SHOT-017 · Full-Screen Content Overlay

![SHOT-017](screenshots/SHOT-017_fullscreen-content-overlay-contradiction.png)

**Status: 🔴 Contradiction + 🟡 WIP**

> *Teaching Instance — the overlay shown is unauthorized. The content it holds may be valuable; the delivery mechanism must be rehomed.*

**Violation:** A full-screen overlay covers both the Rhythm Board and the Constellation Panel simultaneously, with no canonical parent. Per v1.2 canon §22 (scaffold integrity guardrail), no display may cover both surfaces except a canonically-defined ITB. This overlay is not an ITB. It is an untethered surface.

**Content valued (preserve substance):**
- Clinical citations (SURMOUNT-1 NEJM 2022 doi:10.1056/NEJMoa2206038, SURMOUNT-4 JAMA 2024)
- Boundary line: *"BariAccess cites these trials for education only. Your individual trajectory is between you and your prescribing physician."*

**Delivery form — WIP, four candidates (all appropriate, can coexist):**
1. **In-app card with swipe method** — card on Rhythm Board, swipeable between content pieces
2. **Archive / history / library** — customer can browse past educational content
3. **Downloadable PDF** — sent to the customer's account or email
4. **Web app access** — customer views in PDF-style display via web login

**Implementation requirements:**
- Retire the current full-screen overlay component
- Choose one or more of the four delivery forms based on team decision
- Any new delivery form must respect scaffold integrity (do not cover RB + Constellation Panel)
- Clinical content must pass HIPAA review per §22

**Canon refs:** CCO-UX-SCREENS-001 §22 (HIPAA + scaffold guardrails) · CCO-UX-RBDISP-001 v1.2.

---

## Summary — what Zakiy needs to do in v1.2

**Hard blockers (🔴 Contradictions to fix):**
1. Remove PQIS/CCIE/protocol-language strings from Max/Ollie copy pipeline (SHOT-007)
2. Fix Rhythm Board render bug that allows uncovered regions (SHOT-008)
3. Separate customer-facing Beacon from provider dashboard Beacon (SHOT-009+010)
4. Enforce `layout_mode = itb_full_screen` on ITB trigger — hide Constellation Panel + Daily Pulse (SHOT-012, SHOT-013)
5. Retire the unauthorized full-screen content overlay component (SHOT-017)

**New components to build (🟡 WIP — spec pending team decisions):**
6. Programs Journal — tap-only, sequential, V3 data capture (SHOT-014, SHOT-015)
7. Program Calendar — medication-cadence display on Rhythm Board, no-jam rule (SHOT-016)

**Guardrails to implement in publishing pipeline:**
- `publishing_pipeline.block_unreviewed = true` — no customer-facing copy ships without §22 review
- Runtime assertions on scaffold integrity (no display covers both RB + Constellation except canonical ITB)
- Runtime assertion on Rhythm Board: no uncovered regions

**Build priorities in order:**
1. §22 Content Governance pipeline (blocks a whole class of future bugs)
2. `layout_mode = itb_full_screen` enforcement
3. Beacon component separation (customer vs provider)
4. Rhythm Board no-uncovered-regions assertion
5. Journal component spec — collaborate with Val + clinical team
6. Program Calendar spec — collaborate with Val

**Simulation gate:** none of these cards advance to 🟢 Approved without simulation resolving them. Reference cards (SHOT-011) are exempt because they are canonical references, not WIP states.

---

## End of README_CODE v1.2

v1.2 is closed. Next upload begins v1.3.

---

© 2026 BariAccess LLC · Valeriu E. Andrei MD · President · Confidential — Internal use only.
