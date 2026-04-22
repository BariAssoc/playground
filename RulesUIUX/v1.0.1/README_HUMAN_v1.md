# BariAccess UX Canon · Phase 1 — Rhythm Board Foundation

## README_HUMAN — v1.0

**Phase:** 1 — Rhythm Board Foundation
**Cards:** SHOT-001 through SHOT-006
**Version:** v1.0
**Status:** 🟡 WIP (simulation pending)
**Author:** Valeriu E. Andrei, MD · President
**Entity:** BariAccess LLC
**Date:** April 22, 2026

---

© 2026 BariAccess LLC. All rights reserved.
BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.
Confidential — Internal use only.

---

## Preface — how to read this document

This is the **human narrative** of how the Rhythm Board comes alive in a BariAccess customer's first days and weeks with the app. It is meant to be read end-to-end as a story: the customer opens the app for the first time, nothing is populated, the scaffold holds them; then the Bookshelf appears, then expressions begin to fire, then the customer earns the right to customize the Rhythm Board with cards and memories, then the first Program launches and the screen reshapes around the work.

The parallel document, `README_CODE_v1.md`, tells the same story in a developer's language — states, triggers, component flags, layout specs. The two documents travel together and must stay in perfect parallel.

### The Teaching Instance Rule — read this once, then remember it forever

> *Every screenshot in this canon is a **teaching instance**, not a production specification. The shot is chosen to illustrate one concept clearly — a state, a layout, an expression, a resize behavior. The specific content visible in any given shot (cards, values, messages, colors, notification counts) is an example of that moment, not a fixed rule. Canonical takeaway = the rule being taught, not the specific example shown.*

Every card below carries this reminder inline. The rule tells you what to carry forward. Everything else — the specific number, the specific message, the specific card type — is illustrative.

---

## Card Index

| ID | Title | Phase · Step | Status |
|---|---|---|---|
| SHOT-001 | D0 Home View | 1 · 1 | 🟡 WIP |
| SHOT-002 | Bookshelf Green Morning | 1 · 2 | 🟡 WIP |
| SHOT-003 | Bookshelf Orange Morning | 1 · 3 | 🟡 WIP |
| SHOT-004 | RB Two Cards + Memory Snap | 1 · 4 | 🟡 WIP |
| SHOT-005 | Program WorkPad Vertical (dev capture) | 1 · 5 | 🟡 WIP |
| SHOT-006 | Program WorkPad Vertical (clean) | 1 · 6 | 🟡 WIP |

---

## SHOT-001 · D0 Home View

![SHOT-001 — D0 Home View](screenshots/SHOT-001_d0-home-view.jpeg)

**Phase 1 · Step 1 · Status: 🟡 WIP**

> *Teaching Instance — this shot illustrates the rule described. Specific content shown (cards, values, messages, colors) is an example at this moment; actual content at runtime is determined by the Program engine and Expression Layer rules. Canonical takeaway = the rule, not the example.*

**The rule being taught:** At Day Zero, the Rhythm Board is blank and the Constellation Panel is fully present with its scaffold in place. The Signal Bar shows padlocked tiles until biometrics arrive. Expressions can already fire even before scoring activates.

### The story

This is what the customer sees the first time they open the app after onboarding. The Rhythm Board above is intentionally blank — a clean canvas waiting to be earned. The Constellation Panel below is already fully present, because it is the scaffold that never moves. Structure first. Personalization later.

At the very top of the screen sit three anchor elements: the **Three Dots** menu on the left, the **BariAccess™** logo centered, and the **Q** with the **BariAccess logo** (the one that holds BioSnaps and Rhythm Signals) on the right. These stay in place every screen, every state, forever.

The Constellation Panel is already speaking — but softly. In the **Signal Bar** (the Crown), four tiles show placeholder scores and all wear padlocks. The numbers are demo values. The padlocks mean: biometrics have not yet arrived. The system is not scoring the client yet; it is waiting. During this window — roughly the first 7 to 10 days — the Signal Bar is a promise, not a readout.

One tile is already expressing. The **R&R tile** wears an orange rim. That orange is not a score. It is Ollie's voice. Orange on any tile, any tracker, any surface means one thing: Ollie wants the customer's attention here. In this moment, Ollie is highlighting R&R as the default first place to tap — the invitation in.

**Ollie's Space** carries a warm welcome, naming the customer and locating them — the Biometric Station is where the journey begins.

Below that, the **AI Playground** is already alive. The Morpheus shape floats in the center — the soft, amorphous form that will change color and texture as Ollie and Max (AskABA) engage with the customer. At this moment, Morpheus is calm cream — restful, guardian, breathing. The owl and the triangle sit below it. A "Chat" button waits on the right for the customer to speak when they are ready.

At the bottom, the **Daily Pulse** — six trackers lined up: FAB, ITB, BEACON, ROUTINE, PROD, PARK. In this first moment they are uniform and quiet. They will come alive as the customer engages, each one earning its color and its notifications.

The **Routine Bookshelf** is not yet visible. That is deliberate. The Bookshelf appears after the first Barista engagement — it is the next thing the customer will see once the day begins. SHOT-002 shows its arrival.

**What this screen is saying:** *You are here. We are ready. The system is listening. Nothing is demanded of you yet.*

**Canon cross-references:** CCO-CP-ARCH-001 (Constellation Panel structure) · CCO-UX-RBDISP-001 v1.2 (D0 blank state) · CCO-UX-EXPR-001 (Expression Layer, Ollie-triggered) · Beacon Canon v1.1 (band activation gated by unlock).

**Notes:** Orange rim is an Expression Layer signal, not a Beacon band. The Expression Layer and the Beacon are entirely separate systems — never cross-referenced.

---

## SHOT-002 · Bookshelf Green Morning

![SHOT-002 — Bookshelf Green Morning](screenshots/SHOT-002_bookshelf-green-morning.jpeg)

**Phase 1 · Step 2 · Status: 🟡 WIP**

> *Teaching Instance — this shot illustrates the rule described. Specific content shown (cards, values, messages, colors) is an example at this moment; actual content at runtime is determined by the Program engine and Expression Layer rules. Canonical takeaway = the rule, not the example.*

**The rule being taught:** The Routine Bookshelf appears after the first Barista engagement. It sits at the bottom of the Rhythm Board and stays indefinitely. Its segment bars express state through color — green means in shape, on track.

### The story

The customer returns to the app after their first Barista session. The screen has changed. The Rhythm Board above is still mostly blank — cards have not been chosen yet, Memory Snap has not been placed — but something new now anchors the bottom of the board: the **Routine Bookshelf**.

Three umbrellas: **Morning · Midday · Evening**. The order is correct, permanent, the frame of every day the customer will live inside the app. Beneath each umbrella, the Bookshelf will come to hold segments and FABs — the named blocks of the day and the habits that keep them standing. That detail comes later.

Right now, the eye goes to one thing: the **Morning bar is green**. Green is the Expression Layer's way of saying *the morning routine is in shape*. Not a score, not a ranking — a communication. The customer's morning is on track, and the Bookshelf is showing them. Midday and Evening stand ready, quiet, waiting for their moment.

**Ollie's Space** speaks to the same moment the Bookshelf is showing — a forward-leaning welcome, the tone of a day that has started well.

The rest of the screen is consistent with D0. The **Signal Bar** tiles still wear their padlocks — biometrics are still arriving, the Beacon has not yet activated. R&R still wears its orange rim — Ollie is still calling attention there. The **AI Playground** holds its cream Morpheus, the **Daily Pulse** sits quiet below.

**The lesson of this shot:** the Bookshelf is the first piece of the Rhythm Board to appear after D0. It is permanent once it arrives. Its color is always an expression — always Ollie speaking.

**Canon cross-references:** CCO-UX-RBDISP-001 v1.2 (Bookshelf presence rule) · CCO-UX-RBSHELF-001 (Bookshelf governance) · CCO-UX-EXPR-001 (green = in shape).

**Notes:** The green on the morning bar is an expression, not a Beacon band. The Expression Layer paints the Bookshelf the same way it paints tile rims and Ollie's Space. Ollie owns all signals — Rule #1.

---

## SHOT-003 · Bookshelf Orange Morning

![SHOT-003 — Bookshelf Orange Morning](screenshots/SHOT-003_bookshelf-orange-morning.png)

**Phase 1 · Step 3 · Status: 🟡 WIP**

> *Teaching Instance — this shot illustrates the rule described. Specific content shown (cards, values, messages, colors) is an example at this moment; actual content at runtime is determined by the Program engine and Expression Layer rules. Canonical takeaway = the rule, not the example.*

**The rule being taught:** The Routine Bookshelf can express any Expression Layer color, not just green. When the bar turns orange, Ollie is calling for the customer's attention on that segment — same meaning as orange anywhere else in the app.

### The story

Later in the morning. The same customer, the same Rhythm Board — but the Bookshelf is now speaking differently. The **Morning bar is orange.** Not an alarm, not a grade, not a warning light — a call. Ollie is asking the customer to lean in and tap.

The beauty of the Expression Layer is that it uses the same vocabulary everywhere. Orange on a Signal Bar tile rim, orange on a Daily Pulse tracker, orange on a Bookshelf segment — the meaning is always the same: **Ollie wants your attention here.** The customer learns the vocabulary once and reads it on every surface.

And Ollie's Space is speaking in parallel. The message has changed to match the Bookshelf — a directive, a pull toward action. Two surfaces expressing together. This is how the app talks: not with one channel shouting over another, but with surfaces in unison, each reinforcing what the others are saying.

One new detail in this shot — easily missed, but worth noting for future phases. The **R&R tile** has shed its padlock. It is the first tile to unlock. The Beacon is beginning to activate for this customer. The orange rim is still there, still an Ollie expression, still a call to tap — but now, if the customer taps, real scoring lives behind the tile.

Also new: a small **"1" notification badge** has appeared on the ITB tracker in the Daily Pulse. The first Interventional Therapeutic Block is waiting. This is a forward signal — it tells the canon that the notification system is active across the Daily Pulse as soon as the Expression Layer has something to express.

**The lesson of this shot:** expression colors are consistent across surfaces. Orange means attention, everywhere it appears. The customer will learn this once and carry it with them through the entire app.

**Canon cross-references:** CCO-UX-RBDISP-001 v1.2 · CCO-UX-EXPR-001 (orange = Ollie attention call) · CCO-UX-RBSHELF-001 · Beacon Canon v1.1 (tile unlock).

**Notes:** Orange in the Bookshelf ≠ orange in the Beacon band. They share a color, not a system. Ollie owns the signal. The ITB "1" badge is logged as a forward observation for future phases; not interpreted here.

---

## SHOT-004 · RB Two Cards + Memory Snap

![SHOT-004 — RB Two Cards + Memory Snap](screenshots/SHOT-004_rb-two-cards-memory-snap.jpeg)

**Phase 1 · Step 4 · Status: 🟡 WIP**

> *Teaching Instance — this shot illustrates the rule described. Specific content shown (cards, values, messages, colors) is an example at this moment; actual content at runtime is determined by the Program engine and Expression Layer rules. Canonical takeaway = the rule, not the example.*

**The rule being taught:** The Rhythm Board's default populated layout is two content cards on top (full width each) and a Memory Snap slot below, with the Routine Bookshelf at the bottom. Cards are content cards — biometric, educational, or other types — chosen by the customer based on infusion of knowledge from programs. Card changes are governed by a 72-hour commitment rule.

### The story

The customer has been with the app long enough to earn the right to customize the Rhythm Board. This is where BariAccess becomes *his* app — where the board stops being generic and becomes a reflection of what he has learned to pay attention to.

Two **content cards** stand on top of the Rhythm Board. Each card is a subject the customer has studied inside a program and asked to keep in his daily view. The cards are not just biometric — they can be biometric, educational, or other types that emerge over time. What matters is not *what* they are, but *why* they are there: the customer earned them. He asked for them. They are evidence of his infusion of knowledge.

Below the two cards lives the **Memory Snap** — a horizontal block that anchors the emotional layer of the customer's day. Memory Snap can hold a single image, two images, or a video. It is the place where a customer's life outside the app enters the app. Not data — meaning.

Underneath everything, the **Routine Bookshelf** holds the day's frame — Morning, Midday, Evening, with the segments and FABs living inside each umbrella.

### The 72-hour rule

When the customer chooses a card — when he says *"I want HRV on my board"* after finishing an HRV program — the card is placed, and it stays placed for **72 hours minimum.** He cannot swap it, remove it, or reconsider it for three days. This is not a punishment. It is a behavioral commitment, a beat that says *you chose this, now live with it*. After 72 hours, if he wants to change the card, the change must come from fresh infusion of knowledge — he must have learned something new to earn a new card.

### The optional third card

The customer has the right to add a third card if he wants. When he does, the Memory Snap resizes: the **Rhythm Board becomes four equal quadrants** — Card 1, Card 2, Card 3, and a compressed Memory Snap showing its first picture. Nothing else changes. The Bookshelf still sits below. The Constellation Panel still sits beneath that.

**The lesson of this shot:** the Rhythm Board is the customization surface. It is where the customer makes the app his own, through the cards he earns and the memories he holds close.

**Canon cross-references:** CCO-UX-RBDISP-001 v1.2 (populated layout) · CCO-PROG-001 v2.1 (72-hour commitment rule, card types) · CCO-UX-RBSHELF-001 (Bookshelf persistence).

**Notes:** This shot is cropped to the Rhythm Board only — the Constellation Panel is outside the frame but remains present beneath. The specific cards shown (HRV, Chronomuscle) and the specific Memory Snap images are examples. Runtime content is determined by the customer's program history.

---

## SHOT-005 · Program WorkPad Vertical (dev capture)

![SHOT-005 — Program WorkPad Vertical (dev capture)](screenshots/SHOT-005_program-workpad-vertical.png)

**Phase 1 · Step 5 · Status: 🟡 WIP**

> *Teaching Instance — this shot illustrates the rule described. Specific content shown (cards, values, messages, colors) is an example at this moment; actual content at runtime is determined by the Program engine and Expression Layer rules. Canonical takeaway = the rule, not the example.*

**The rule being taught:** When a Program launches, the Rhythm Board splits vertically. The Program WorkPad takes the right half, full top-to-bottom. The content on the left — the customer's cards — retracts and compresses. The Routine Bookshelf compresses in both dimensions (shorter and narrower) and sits only beneath the left column, under the cards. The Constellation Panel stays intact below.

### The story

This shot comes from a developer video Zakiy sent on April 10. It is rough — captured through a phone screen recording — but it carries the rule. The customer has tapped into a program, and the Rhythm Board has reshaped around the work.

The **Program WorkPad** now occupies the right half of the Rhythm Board, running full top-to-bottom. It carries a header, a Learn phase, content, and an action button. Below the active phase sits a locked Intervene phase — the customer must complete Learn first. This is the **Branch Point Rule** from Program Canon v2.1 in action: Learn, then Intervene. No skipping.

On the left, the Rhythm Board has given up its space to the work. The customer's cards compress into the left column. The Memory Snap or third-card slot drops off entirely — there is not enough real estate for it during a program, and the canon says it yields.

At the bottom of the left column, the **Routine Bookshelf** is still there, but smaller. The labels have shortened: **AM · MID · PM.** The green morning bar still shows — the customer's day is still on track, the expression layer still reads. The Bookshelf under the Program WorkPad side is gone entirely — the WorkPad runs unbroken from top to bottom of its half.

The **Constellation Panel** below sits unchanged. R&R tile is now unlocked. Ollie's Space says what the moment calls for: *"Time to learn and intervene!"* The AI Playground and Daily Pulse hold their familiar shape.

**The lesson of this shot:** programs reshape the Rhythm Board. The Rhythm Board gives way to the work. The Constellation Panel never gives way. Structure holds.

**Canon cross-references:** CCO-UX-RBDISP-001 v1.2 (vertical split, Bookshelf compression) · CCO-PROG-001 v2.1 (Learn → Intervene gate) · CCO-ARCH-SHELL-001 (Program WorkPad as Shell) · CCO-UX-EXPR-001.

**Notes:** This is a rough video capture from a developer build. SHOT-006 shows the same state clean. Bookshelf position is the critical visual learning — it compresses in BOTH height AND width, sitting only under the cards, not under the Program WorkPad.

---

## SHOT-006 · Program WorkPad Vertical (clean)

![SHOT-006 — Program WorkPad Vertical (clean)](screenshots/SHOT-006_program-workpad-vertical-clean.png)

**Phase 1 · Step 6 · Status: 🟡 WIP**

> *Teaching Instance — this shot illustrates the rule described. Specific content shown (cards, values, messages, colors) is an example at this moment; actual content at runtime is determined by the Program engine and Expression Layer rules. Canonical takeaway = the rule, not the example.*

**The rule being taught:** Same rule as SHOT-005, shown clean. Cards stack vertically on the left — and they can be mixed types, not only biometric. Educational cards, biometric cards, and future card types all stack the same way. The Bookshelf sits compressed under the cards only. The Program WorkPad runs unbroken on the right.

### The story

This is the clean, high-resolution version of the resize state. Everything SHOT-005 taught is visible here without the blur.

The left column holds **two cards stacked vertically.** The top card is biometric — an HRV reading with its delta (colored to express direction, green for positive, warm tones for negative) and a compact week trend chart. The bottom card is educational — a "Daily learning" card inviting the customer to explore protocols, quizzes, and guided reads from the care team. Two different card types, stacked as equals. The point: **cards are content containers, not restricted to biometrics.** The Program engine and the customer's program history decide what fills each slot.

The right column holds the **Program WorkPad**, running unbroken from the top of the Rhythm Board down to the Constellation Panel. The Learn phase is active — *"What is HRV?"* — with a Start quiz button and a Save to Q button. The Intervene phase sits below, locked with *"Complete previous phase first."* Branch Point Rule, visible.

Beneath the cards on the left — only the left — sits the compressed **Bookshelf**: AM · MID · PM. The midday bar is green, an expression speaking mid-day: *on track*. The Bookshelf does not extend under the Program WorkPad.

The **Constellation Panel** below is fully alive. All four Signal Bar tiles are now unlocked — the customer is past D0 by several days. R&R wears its orange rim: Ollie calling for a tap. Ollie's Space greets the morning. The AI Playground holds its cream Morpheus, ready. The Daily Pulse runs across the bottom in its distinct colors — FAB, ITB, BEACON, ROUTINE, PROD, PARK — each tracker carrying its own shape and color identity.

**The lesson of this shot:** the rule taught in SHOT-005, shown unambiguously. Two cards left, Program WorkPad right, Bookshelf compressed under the cards only, Constellation Panel unchanged below. And cards are content, not a type.

**Canon cross-references:** CCO-UX-RBDISP-001 v1.2 · CCO-PROG-001 v2.1 · CCO-ARCH-SHELL-001 · CCO-UX-EXPR-001 · Content Card Types (canon needed — currently inferred from Program engine).

**Notes:** TestFlight banner confirms this is a beta build — good provenance for developer handoff. Q notification count "3" is an example state, not a canonical number. Card types shown (HRV + Educational) are examples of valid content; runtime assignment is Program-driven.

---

## End of README_HUMAN v1.0

Phase 1 — Rhythm Board Foundation, six cards, all 🟡 WIP pending simulation.

Next phase will open when Val uploads the next screenshot and declares Phase 2.

---

© 2026 BariAccess LLC · Valeriu E. Andrei MD · President · Confidential — Internal use only.
