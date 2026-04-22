# BariAccess UX Canon · Phase 1 — Briefing for Zakiy

**README_ZAKIY — v1.0**
**From:** Valeriu E. Andrei MD, President · BariAccess LLC
**To:** Zakiy (lead developer)
**Phase:** 1 — Rhythm Board Foundation
**Date:** April 22, 2026
**Status:** 🟡 WIP (simulation pending)

---

© 2026 BariAccess LLC. All rights reserved.
Confidential — Internal use only.

---

## What this document is

Zakiy — this is not the full spec. The full technical spec is in `README_CODE_v1.md`. Read that for the component-level detail. This document is shorter, on top of it: what I want from you, what matters most, open questions I need you to answer, and the priorities for v1.

Six shots. Six states. Read through, then come back to me with your answers to the open questions before you start building.

---

## Read this before every shot

> *Teaching Instance Rule — specific content in each shot (numbers, card types, Ollie messages, notification counts) is an example. Build components to accept engine-driven values. Do not hardcode from the screenshots.*

---

## Critical architecture decision — read this first

**Expression Layer and Beacon are two independent systems. They do not share state, code paths, or color tables.**

- **Beacon** = algorithmic output of the SC formula. Seven bands. Fires only when `tile.unlocked = true`.
- **Expression Layer** = Ollie-triggered communication. Lives on five surfaces (Bookshelf, Signal Bar tile rims, Ollie's Space, AI Playground, Daily Pulse). Fires independently of scoring.

A tile's rim color comes from the Expression Layer. A tile's internal band color (when unlocked) comes from the Beacon. Same tile, two separate systems. Same hex values may appear in both — that is a palette coincidence, not a link. Build them as two independent subsystems. If you find yourself writing code that bridges them, stop and flag it.

**Rule #1:** Ollie owns all Expression Layer signals. No signal fires without Ollie triggering it.

---

## SHOT-001 · D0 Home View

![SHOT-001](screenshots/SHOT-001_d0-home-view.jpeg)

**State:** `D0_INITIAL_LAUNCH` · **Phase 1 · Step 1**

Zakiy — what I want from you on this state.

This is the first screen the customer sees. It has to feel alive even when nothing is populated yet. That means the Constellation Panel renders fully on first launch — no loading spinner, no skeletons. The Rhythm Board above is intentionally empty. I want the blankness to feel intentional, not broken.

**Three things to build cleanly:**

1. **Constellation Panel is the scaffold.** It mounts once and never unmounts. Every row (Signal Bar, Ollie's Space, AI Playground compact, Daily Pulse) is already on screen at D0. The tiles display placeholder scores with padlocks. Padlocks come off per-tile as biometrics arrive (`tile.unlocked` boolean, engine-driven, expect 7–10 days for the first unlock).

2. **Signal Bar tile rims are Expression Layer, NOT Beacon.** Two separate code paths. Read the critical architecture decision above.

3. **Rhythm Board children unmount at D0.** Bookshelf, cards, Memory Snap — none of them render until their triggers fire. The RB container is present but its children are `null` until the trigger event.

**Open questions I need you to answer:**

- **OQ-ZAK-01:** What is the exact Barista-completion event you'll listen for to mount the Bookshelf?
- **OQ-ZAK-02:** Do all four tiles unlock together at one gate (~Day 7–10) or progressively? If progressive, what drives each unlock?

**Do not hardcode from this shot:** score values (75, 78, 82, 51), Ollie message string, orange rim on R&R specifically. All engine-driven.

**Priority for v1:** nail the Expression Layer vs. Beacon separation. Everything downstream depends on this being clean.

---

## SHOT-002 · Bookshelf Green Morning

![SHOT-002](screenshots/SHOT-002_bookshelf-green-morning.jpeg)

**State:** `D0_POST_BARISTA` · **Phase 1 · Step 2**

Zakiy — this state is the Bookshelf's first appearance. Once it mounts, it stays.

**Three things to build cleanly:**

1. **The Bookshelf mounts on the Barista-completion event.** See OQ-ZAK-01 above — I need your answer on what event exactly triggers this. Once mounted, it persists across all states (until resize during program active — see SHOT-005/006).

2. **Bookshelf umbrellas are fixed labels at idle.** `MORNING · MIDDAY · EVENING` — fixed order, fixed spelling, do not template. The segment bars inside each umbrella are the dynamic parts (colors and content).

3. **Segment bar colors are Expression Layer.** Green in this shot means "in shape / on track." Do not code green as a hardcoded constant — route it through the same Expression Layer state machine that drives tile rims and Daily Pulse colors. If you do it right, a single engine update can light up a bar green, a rim orange, and Morpheus purple from the same event bus.

**Open question:**

- **OQ-ZAK-03:** Where does the Bookshelf mount animation come from? I want it to feel like the Bookshelf "arrives," not like the whole RB re-renders. Your call on the animation approach — show me in simulation.

**Do not hardcode:** the green color, the Ollie message, the specific segment showing green.

**Priority:** get the Expression Layer event bus in place before you style the Bookshelf. The Bookshelf is just a surface; the engine is what matters.

---

## SHOT-003 · Bookshelf Orange Morning

![SHOT-003](screenshots/SHOT-003_bookshelf-orange-morning.png)

**State:** `DAILY_MORNING_ATTENTION` · **Phase 1 · Step 3**

Zakiy — same Bookshelf, different Expression Layer state. This shot proves the engine works.

**What this state tells you:**

- A segment bar can accept any Expression Layer color. Orange here means attention.
- Multiple surfaces can express in unison at the same time — Bookshelf bar orange, R&R rim orange, Ollie's Space carrying a directive message, and a Daily Pulse tracker picking up a notification badge.
- **This is canonical: surfaces express together.** Build for this from day one. If Ollie fires an "attention" event, multiple surfaces should subscribe and respond — not just one.

**Two things to build cleanly:**

1. **Notification badges on Daily Pulse.** In this shot the ITB tracker shows "1." This is the first notification badge I'm showing you. Build it now as part of the tracker component — integer badge count, Expression Layer driven. Other trackers will get badges in future phases. Build once, reuse everywhere.

2. **R&R padlock removed.** By this state, R&R has unlocked. The padlock icon is gone. The orange rim persists — because rim is Expression Layer, not lock state. Two independent conditions on the same tile.

**Open questions:**

- **OQ-ZAK-04:** What's your plan for the notification system more broadly? Daily Pulse badges, the Q badge on the top bar (see SHOT-006, shows "3"), and Three Dots menu indicators — are these one unified system or separate? I lean toward unified. Tell me what you think.

**Do not hardcode:** the specific orange, the "1" count on ITB, the specific Ollie message.

**Priority:** multi-surface expression subscription. Prove the event bus works with a single test event that lights multiple surfaces.

---

## SHOT-004 · RB Two Cards + Memory Snap

![SHOT-004](screenshots/SHOT-004_rb-two-cards-memory-snap.jpeg)

**State:** `RB_IDLE_POPULATED` · **Phase 1 · Step 4**

Zakiy — this is the customization state. The customer has earned cards and placed them. Now the Rhythm Board is theirs.

**Four things to build cleanly:**

1. **Content cards are polymorphic.** `card_type` is a prop. In this shot both cards are biometric (HRV, Chronomuscle) — but the type is extensible. Educational cards in SHOT-006. Future types to come. Build the card container once, swap the inner component per type. Do not hardcode biometric-only assumptions into the card shell.

2. **72-hour commitment rule.** When a card is placed, `card.locked_until = now + 72h`. While locked, no swap, no removal. After 72h, swap allowed — but the swap must be triggered by a new program engagement event (infusion-of-knowledge gate). Do not allow swaps from UI alone.

3. **Three-card option = four equal quadrants.** When the customer adds Card 3, the Rhythm Board becomes a 2×2 grid: Card 1, Card 2, Card 3, resized Memory Snap. **All four quadrants are equal size.** Memory Snap in quadrant mode shows picture_1 by default. Build a `layout_mode` enum on the Rhythm Board component: `"two_card" | "three_card"`.

4. **Memory Snap behavior.** Can hold 1 image, 2 images, or a video. Client controls content freely. The shell is governed, the content inside is not. Build the Memory Snap component with content-agnostic slots.

**Open question:**

- **OQ-ZAK-05:** For the three-card mode, when Memory Snap compresses to the quadrant, which picture it shows as "picture_1" — is that the most recent upload, or a client-designated favorite? My instinct: most recent. Your call, tell me what you think.

**Do not hardcode:** the specific cards shown, the specific memory images, the specific metric values on each card, the 72-hour timeout as a magic number (parameterize it).

**Priority:** the card polymorphism. Every shortcut you take here will cost us later when we add a third card type.

---

## SHOT-005 · Program WorkPad Vertical (dev capture)

![SHOT-005](screenshots/SHOT-005_program-workpad-vertical.png)

**State:** `PROGRAM_ACTIVE_VERTICAL` · **Phase 1 · Step 5**

Zakiy — you sent this video on April 10. I'm filing it as Shot 5. The clean version is Shot 6.

**The rule, shown rough:**

Rhythm Board splits 50/50 vertically. Program WorkPad on the right, full top-to-bottom. Cards retract and stack vertical on the left. Memory Snap drops entirely. Bookshelf compresses **in both dimensions** — shorter and narrower — and sits only under the left column, not under the WorkPad.

**Critical layout detail (easy to miss):**

- Program WorkPad on the right runs unbroken from top of Rhythm Board to the Constellation Panel boundary. No Bookshelf strip beneath it.
- Bookshelf on the left is under the cards only — same width as the left column, compressed height.
- Constellation Panel below is unchanged from idle. Do not resize it during program active.

**Bookshelf labels compress** to `AM · MID · PM` in this state. Full labels (`MORNING · MIDDAY · EVENING`) only at idle. Handle this as a label variant on the Bookshelf component, not as two separate components.

**Branch Point Rule** from CCO-PROG-001 v2.1: Learn must complete before Intervene unlocks. Intervene phase visible but locked (padlock + "Complete previous phase first") until Learn completion event fires. Implement as a phase state machine: `locked | active | complete_lite | complete`. `complete_lite` is a canonical terminal state — partial credits, 72-hour Parking Lot hold permitted.

**Open question:**

- **OQ-ZAK-06:** The resize animation — cards collapsing from full-width to half-width-of-left-half, Bookshelf compressing in both dimensions, WorkPad sliding in from the right. I want this to feel smooth and deliberate, not janky. Your call on animation library and timing. Show me in simulation.

**Do not hardcode:** the HRV card, the "What is HRV?" quiz content, the program being shown.

**Priority:** the Bookshelf compression in both dimensions. That's the detail most developers would miss.

---

## SHOT-006 · Program WorkPad Vertical (clean)

![SHOT-006](screenshots/SHOT-006_program-workpad-vertical-clean.png)

**State:** `PROGRAM_ACTIVE_VERTICAL` · **Phase 1 · Step 6**

Zakiy — same state as SHOT-005, clean. Confirms the spec and shows something important I want you to build into your card component.

**What this shot confirms on top of SHOT-005:**

1. **Cards stack mixed types.** Top card is biometric (HRV). Bottom card is educational ("Daily learning," with an Explore CTA). Both stacked in the same state, no special-casing. This is the polymorphic card spec in action — build it so any valid `card_type` can be in Slot 1 or Slot 2.

2. **Biometric card delta color convention.** When HRV delta is positive, the delta displays in green. When negative (-11 ms in this shot), it displays in a warm tone (orange-red). This is an Expression Layer convention applied inside the card. Build the delta component once with green/warm logic based on sign; do not ask the engine to compute colors for delta display.

3. **All four tiles unlocked.** This customer is past the unlock gate for all four. R&R still carries the orange rim — proving again that rim state is independent of lock state.

4. **Q notification on the top bar shows "3."** This is the unified notification system I asked about in OQ-ZAK-04. Whatever you decide on, apply consistently to Q, Daily Pulse, and Three Dots.

**Open questions (still open from prior shots):**

- OQ-ZAK-04 (notification system architecture)
- OQ-ZAK-06 (resize animation approach)

**Do not hardcode:** the HRV card, the educational card copy, the "3" on Q, the specific Ollie message.

**Priority:** finalize the polymorphic card spec and the biometric delta color convention. Both need to be stable before we add new card types in future phases.

---

## Summary — what I need from you before you build v1

**Answer these six open questions:**

1. **OQ-ZAK-01:** Exact Barista-completion event for Bookshelf mount.
2. **OQ-ZAK-02:** Tile unlock — single gate or progressive?
3. **OQ-ZAK-03:** Bookshelf mount animation approach.
4. **OQ-ZAK-04:** Notification system architecture (unified or separate).
5. **OQ-ZAK-05:** Memory Snap `picture_1` in quadrant mode — most recent or client favorite?
6. **OQ-ZAK-06:** Resize animation approach for program activation.

**Build priorities in order:**

1. Expression Layer event bus (prove multi-surface subscription works)
2. Expression Layer vs. Beacon separation (two independent systems)
3. Polymorphic card spec (content-type extensibility)
4. Program phase state machine (`locked | active | complete_lite | complete`)
5. Bookshelf compression in both dimensions
6. Notification system (unified across Q, Daily Pulse, Three Dots)
7. 72-hour commitment rule as parameterized constant

**Simulation is the gate.** None of these cards are 🟢 Approved yet. Build for simulation, not for production. We will iterate.

Come to me with your OQ answers and I'll tell you what to build first. 51/49 final word stays with me. Questions anytime.

— Val

---

© 2026 BariAccess LLC · Valeriu E. Andrei MD · President · Confidential — Internal use only.
