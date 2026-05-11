# CCO-LITE-BETA-UI-001 — Lite Beta UI/UX Canon

---

**BariAccess LLC**
**Document ID:** CCO-LITE-BETA-UI-001
**Version:** 1.0 — LOCKED
**Date:** May 11, 2026
**Author:** Valeriu E. Andrei, MD, President — BariAccess LLC
**Assistant Editor:** Claude
**Status:** LOCKED by Founder, May 11, 2026
**Target:** Lite Beta Launch — May 11, 2026

---

## §1 — Purpose & Scope

This canon defines the **UI/UX behavior** of the BariAccess Lite Beta launching May 11, 2026. It covers what users see, how surfaces respond to user action and system events, and the rules governing how Ollie, ABA, and BariAccess surfaces interact.

**In scope:** color expression, surface inventory, notification flow, Dual AI protocol, Accountability Score display, Day-1 onboarding spine.

**Out of scope:** scoring math (cited via Beta Formula, R&R canons), 51/49 backend architecture, full ABAEMR memory protocol. These remain governed by their own canons and are referenced only.

---

## §2 — Expression Color Code (6 States) — LOCKED

The Expression Layer is entirely separate from Beacon bands. Ollie owns all expression signals. Colors communicate **what is happening on the surface**, not biometric score state.

| Color | Trigger | Meaning |
|---|---|---|
| 🔵 **Blue** | Ollie announces AskABA / Max / [user's ABA] | Conversation initiating |
| 🟢 **Green** | Good result | FAB completed — on track |
| 🟠 **Orange** | Signal detected | FAB missed / deferred |
| 🔴 **Red** | Critical missed | Delinquent — urgent |
| 🟣 **Purple** | AI Playground active | AskABA / Max responding |
| ⚪ **Opaque White** | Night mode | Relaxation — breathing — sleep |

---

## §3 — Surface Inventory

Each surface has one canonical name. Voice-to-text auto-correction enforces these terms.

| Surface | Role |
|---|---|
| **Constellation Panel** | Primary daily UI — 5-row architecture |
| **Rhythm Board** | Upper dynamic surface within Constellation Panel |
| **Routine Bookshelf** | Morning / Midday / Evening segments + FABs as wedges |
| **Ollie's Space** | Where Ollie speaks, announces, and prompts |
| **AI Playground** | Where AskABA / Max / [user's ABA] responds (🟣 Purple state) |
| **Q** | THE inbox. Never "box," never "queue," never "inbox-Q." Voice line: *"You got the message."* |
| **Three Dots archive** | Final resting place for expired / incomplete items |
| **WorkPad** | Half-screen workspace where JotForms open when user says "Now" |
| **Parking Lot** | 72-hour holding zone for deferred / unanswered items before archive |
| **Memory Snap** | **TBD by Val** — slot reserved in canon for later definition |

---

## §4 — ABA Companion Names — 13-Pool

Each client chooses their own ABA companion name + voice during onboarding. BariAccess maintains a **pool of 13 names** for members to choose from.

| # | Name | Status |
|---|---|---|
| 1 | **Max** | Company default — locked |
| 2 | **Atlas** | Zakiy's ABA — locked |
| 3 | **Athos** | Dr. Andrei's ABA — locked |
| 4–13 | *(10 names TBD by Val)* | Reserved slots |

**Rule:** Onboarding offers the pool. User picks one. Voice can be selected separately. Once chosen, that name is the user's ABA forever in their experience.

---

## §5 — JotForm Notification Flow — 6 Steps

JotForms are treated as **programs**, not as form-fill exercises. They flow through Ollie's voice from announcement to completion or archive.

| Step | Action | Color |
|---|---|---|
| **1. Announcement** | Ollie's Space announces the JotForm | 🔵 Blue |
| **2. Prompt** | *"You got it — are you ready — yes or no?"* | 🔵 Blue |
| **3a. Yes → Now** | Card opens — WorkPad opens halfway | 🟢 Green |
| **3b. Yes → Later** | Deferred — Routine Bookshelf turns | 🟠 Orange |
| **3c. No answer in 50 sec** | Default to 1-hour reminder; prompt disappears | 🟠 Orange |
| **4. Reminder options** | 30 minutes / 1 hour / never — **ONE CHANCE ONLY** | 🟠 Orange |
| **5. No response to reminder** | Drops to Parking Lot — stays 72 hours | 🟠 Orange |
| **6. 72 hours expired** | Moves to Three Dots archive — marked **incomplete** | 🔴 Red → Archive |

**Voice rule:** Ollie says *"You got the message."* — never "you got mail," "you got an inbox notification," or anything Outlook-flavored.

**Reminder rule:** Only one chance to pick a reminder window. If user dismisses or ignores the picker, default behavior takes over. No second chance.

**Archive language:** Expired JotForms are marked **incomplete** — never "delinquent," never "failed." This is Val's deliberate choice to avoid punitive framing.

---

## §6 — Dual AI End-of-Day Protocol — LOCKED — PATENTABLE

**Core rule:** ABA never appears alone. Ollie always introduces ABA. This is the BariAccess Dual AI architecture and is flagged as patentable IP.

| Step | Actor | Action |
|---|---|---|
| **Evening trigger** (timed window) | Ollie | *"Let me bring [user's ABA name]."* |
| **ABA introduction** | Ollie → ABA | Surprise appearance — ABA never arrives alone |
| **Day 1 message** | ABA | *"You're doing a great job. Dr. Andrei is sending you a great message soon — we'll go live."* |
| **Day 2+** | ABA | Rotating messages — slow onboarding, different each day |
| **Evening ambience handoff** | Ollie → ABA | *"I'll let [ABA name] tell you what you need — how to get ready for tonight."* |

**Why Dual AI matters:** Multiple AIs in one experience is becoming common. BariAccess's claim is the **introduction protocol + brain governance** — one AI presents, one AI executes, governed by the 51/49 Architecture. The patentable element is the structured handoff, not the multi-AI presence itself.

---

## §7 — Accountability Score (UX-Facing)

**Public name (UX):** Accountability Score
**Internal alias:** Anti-Grit Score
**Clinical/scientific alias:** Non-Committal Score
**Sibling on positive axis:** Grit Engine

**Definition:** A behavioral insight score measuring whether a client follows through on commitments — JotForms completed, cards engaged, Memory Snap entered, FABs done.

**Not punitive.** The score is descriptive, not disciplinary. It exists to surface a behavioral pattern, not to penalize.

**The Bob Marley test (Val's canon):**
- A client who genuinely **struggles** (illness, life event, real obstacle) → free pass. No Accountability Score penalty.
- A client who is **disengaged** — not learning, not caring, not understanding why → Accountability Score applies.

**Display behavior:** Lite Beta surfaces Accountability Score in provider drilldowns only. Patient-facing exposure deferred to a later canon. Math definition references the scoring canon (TBD as separate document).

---

## §8 — Day-1 Onboarding Spine — LOCKED

The Day-1 sequence is the spine on which all subsequent education hangs. Each step gets one video (clickable from CosmosDB).

| Step | Surface | Education Asset |
|---|---|---|
| **1** | Rhythm Board | Video: *What the Rhythm Board does* |
| **2** | Routine Bookshelf | Video: *Morning / Midday / Evening + FABs as wedges* |
| **3** | Memory Snap | Video: *(content TBD by Val)* |
| **4** | Two Cards (education-eligible) | Both cards can be education cards at onboarding. User picks 2. |
| **5** | Constellation Panel + AI | Video: *How the Constellation Panel works with AI* |
| **6** | Notification + Ollie | Video: *How notifications flow through Ollie's voice* |

**Card rule:** Day 1 starts with **2 cards**, not 1. Either or both may be education cards. This is the simplest viable engagement floor without being trivial.

---

## §9 — Open Items / TBD by Val

| Item | Owner | Status |
|---|---|---|
| Memory Snap definition + video content | Val | TBD |
| ABA names #4–#13 (10 remaining) | Val | TBD |
| Accountability Score math definition | Val + Exec-Biostat | Deferred to separate scoring canon |
| Patient-facing Accountability Score visibility | Val | Deferred to later canon |
| Evening ambience trigger window (exact hour) | Val | TBD |
| 13-name selection UI (dropdown vs carousel) | Val + Zakiy | TBD pre-launch |

---

## §10 — Document Control

| Version | Date | Change | Author |
|---|---|---|---|
| 1.0 LOCKED | 2026-05-11 | Initial canon locked by founder. Derived from May 11 Val + Zakiy session transcript and founder Q&A. | Val + Claude (assistant editor) |

**Lock status:** No CLAUDE-FLAGs in this canon. Every decision came directly from the transcript or founder's explicit answer in the May 11 session.

---

*BariAccess LLC — Confidential — Internal Use Only*
*© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
