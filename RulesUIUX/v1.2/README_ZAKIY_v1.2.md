# BariAccess UX Canon · Phase 2 — Briefing for Zakiy

**README_ZAKIY — v1.2**
**From:** Valeriu E. Andrei MD, President · BariAccess LLC
**To:** Zakiy (lead developer)
**Phase:** 2 — Content Governance
**Date:** April 22, 2026
**Status:** Mixed (see card statuses in main code README)

---

© 2026 BariAccess LLC. All rights reserved.
Confidential — Internal use only.

---

## Opening note — from Val

> *v1.2 closes with a clear commitment. Going forward, every change to the Rhythm Board, the Constellation Panel, and the content that lives on them will be analyzed together as a team — aligned before it ships. Two lines we protect carefully: HIPAA compliance, and the canonical integrity of the Rhythm Board and Constellation Panel. No display crosses both surfaces at the same time. No customer-facing content ships without review.*

---

## What this document is

Zakiy — Phase 2 is about guardrails. We found contradictions in the build: internal acronyms leaking into Max copy, ITBs not going full-screen like the canon requires, a Beacon component showing state names and warnings it shouldn't, a full-screen overlay nobody approved, a white gap on the Rhythm Board that shouldn't exist. None of these are big features to build. They are guardrails to enforce.

Plus two new components committed as concepts but not yet speced: the Journal and the Program Calendar. We'll spec those together.

Read `README_CODE_v1.2.md` for full technical detail. This document is shorter: what I need from you on v1.2, in order.

---

## Your priorities in order

### 1. §22 Content Governance pipeline (blocks a whole class of future bugs)

Build a content review gate in the publishing pipeline. No customer-facing string ships without review approval.

**Rules:**
- Every Max/Ollie/UI string has metadata: `content_id`, `reviewers`, `review_date`, `review_status`
- `publishing_pipeline.block_unreviewed = true` — hard gate
- Acronym audit runs structurally: flag strings containing `PQIS`, `CCIE`, `FAB`, `CPIE`, `ITB` (as internal), `Week-4 export`, `label titration`, `mechanism`, and any other protocol-language term until whitelisted
- Reviewers = Val + you + clinical/advisory board. Additional per Val.

This is the highest priority. It prevents SHOT-007, SHOT-015, SHOT-016 class bugs from shipping again.

### 2. `layout_mode = itb_full_screen` enforcement

Per **CCO-UX-ITB-DISP-001 §2** (attached to this bundle): when an ITB is triggered, ITB opens to FULL SCREEN. Everything else is hidden — Constellation Panel, Daily Pulse, Rhythm Board children — all hidden.

Current implementation (SHOT-012, SHOT-013) violates this. The ITB is taking only part of the screen. Must be fixed before any ITB ships in production.

**Implementation:**
- `layout_mode` state enum: `"idle" | "program_active_vertical" | "itb_full_screen"`
- ITB trigger event forces `layout_mode = "itb_full_screen"`
- In `itb_full_screen`: hide Constellation Panel, hide Daily Pulse, hide Rhythm Board children
- ITB card pagination ("Card N of Total") always visible per §3 of the canon

### 3. Beacon component separation — customer vs provider

The Beacon component today renders state names, ISE labels, and warning banners — all in customer-facing UI (SHOT-009, SHOT-010). That vocabulary is for provider dashboards, not for the customer.

**What to build:**
- `beacon.customer_display` — pure seven-color-band stack. Use `Beacon_Seven_Bands_Pure.html` (attached to bundle) as the visual spec.
- `beacon.provider_dashboard` — separate component, separate route, can display everything (state names, ISE labels, warnings, numerical output). This is for Val, Pamela, and the advisory board.

Two components. Two routes. Do not conditional-render one component with visibility flags. They are different audiences with different requirements.

### 4. Rhythm Board — no-uncovered-regions assertion

SHOT-008 caught a render bug: the Rhythm Board showed empty white space between Memory Snap and Bookshelf. No canonical state authorizes uncovered space.

**What to build:**
- Runtime assertion (dev builds): `assert(rhythm_board.has_no_uncovered_regions)`
- If a child component unmounts, the Rhythm Board parent must reshape layout (merge regions, expand neighbors) — never expose raw background
- Add this to CI/linting if possible

### 5. Retire the unauthorized full-screen content overlay (SHOT-017)

The "Dual GIP/GLP-1 receptor agonism" overlay covers both Rhythm Board and Constellation Panel with no canonical parent. Remove the component.

The content inside — SURMOUNT citations, boundary line — is valuable and must be preserved. We will rehome it in one or more of four candidate delivery forms (decision pending team discussion): in-app swipe card, archive/library, downloadable PDF, web app access.

**Do not rebuild the overlay.** Wait for the team decision on delivery form before implementing a replacement.

### 6. Journal component — spec with Val + clinical team

Concept is committed (SHOT-014, SHOT-015). Mechanics are WIP.

**Locked principles:**
- Tap-only — no typing required
- Simple — not overwhelming
- Captures V3 data per CCO-ARCH-VVAL-001 (pending)

**Open for team decision:**
- Trigger timing — may be post-Learn, may be earlier, may be folded into Learn question answers
- Placement on Rhythm Board — may be upper-right card, may be modal, may be inline
- Number of prompts per phase — TBD
- Prompt content — all goes through §22 review

Schedule time with me (Val) and the clinical team before you start building. We'll decide trigger and placement together.

### 7. Program Calendar — spec with Val

Concept is committed (SHOT-016). Layout is WIP.

**Hard rule:** no RB jamming. No induced scroll. The Calendar must fit within existing Rhythm Board dimensions.

**Candidate layouts (not locked):**
- Full horizontal block
- Partial horizontal (half width)
- Upper half or lower half of RB
- Collapsed RB view + "Full view" button for expansion

Schedule time with me before building. We'll walk through the candidate layouts on paper first.

---

## What I do not want you to build yet

- New full-screen overlays of any kind. Wait for team decision on delivery forms.
- Content strings freehand. Everything customer-facing goes through §22 review.
- Beacon enhancements (animations, transitions, state names re-added). The customer Beacon is pure color. End of story.

---

## Open questions for you

- **OQ-ZAK-v1.2-01:** For the Content Governance pipeline, do you want review metadata in the string itself (inline JSON) or in a separate content management table? I lean toward a separate table — cleaner for auditing. Your call on the architecture.
- **OQ-ZAK-v1.2-02:** For the ITB full-screen enforcement, should we animate the Constellation Panel + Daily Pulse sliding out of view, or hard-cut? Hard-cut is simpler and more respectful of the "program as sacred time" principle. I lean hard-cut. Tell me what you think.
- **OQ-ZAK-v1.2-03:** For the Rhythm Board no-uncovered-regions assertion, should it also fire in production (silent error reporting) or only in dev builds? I lean production with silent reporting — these bugs should never reach customers.

Come to me with your answers. I'll give you final direction on each.

---

## Simulation gate reminder

None of these cards advance to 🟢 Approved without simulation resolving them. Reference cards (SHOT-011 Beacon Pure) are exempt — they are canonical references, not WIP.

**Build the guardrails first. Then we simulate. Then we green-light.**

— Val

---

© 2026 BariAccess LLC · Valeriu E. Andrei MD · President · Confidential — Internal use only.
