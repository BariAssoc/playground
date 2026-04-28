# T-03 — Spike API Display Logic + Memory Snap + Card Management + Vertical Expansion

**Source:** Internal dev session, Val + Zakiy
**Topics covered:** Spike API usage through May 20, gray-out logic for unavailable biometric values, Memory Snap behavior, 72-hour card change rule, vertical expansion for programs, pre-Belgrade prep
**Status:** Ready for Zakiy review
**Purpose:** Side-by-side compare surface — Val's understanding vs Zakiy's understanding of the same transcript

---

## What this transcript contains

### Spike API + biometric display through May 20

- Question raised: how to use Spike API until May 20.
- Confirmed available signals to use: HRV, temperature, Sleep Score, Stress Score, possibly VO2 Max, Body Composition, Phase Angle (if available via InBody or SECA).
- Trends on HRV: Zakiy confirmed **not yet built**.
- Display rule: **only show what is actually available** — if a value isn't available from the user's device, **don't show it at all**.
- Fallback weighting: when a score is computed and a value is missing, use a 30% default weight (Val proposed, simple/uniform weighting to keep it less complicated).
- FreeStyle Libre treated the same way — present only if device supports it.

### Gray-out + upgrade-path messaging

- Alternative considered: gray out missing values with an "upgrade your device" prompt.
- Val's revised approach: don't gray out as punishment; let it just not show.
- BUT — if surfaced, the gray area becomes a doorway: clicking it triggers Ollie/AskABA dialogue.
- Mechanic: Ollie says *"Great request, Zakiy. I got you — but let me ask AskABA. Why doesn't Zakiy have it?"* → AskABA responds explaining the device limitation → message offered to be sent to Dr. Andrei or Professor Ilić about upgrading.
- AskABA does **not** speak directly — AskABA only responds when Ollie asks.
- AskABA scope: don't make it smart enough to check every device variant — keep it simple, generic response: *"Whatever you see gray — I'm going to send a message to Professor Ilić to explain how you can upgrade your platform."*

### Memory Snap

- Memory Snaps = user-uploaded pictures (food they liked, things that went wrong, anything they want to keep visible for a while).
- Users can change Memory Snap any time (no 72-hour lock).
- Memory Snap **does not drop** — it stays in place.
- Education program in Q to teach users about Memory Snap.

### Card management — 72-hour rule

- Original rule of thumb: 3 cards.
- **Phase 1 simplification: 2 cards** (Card 1 + Card 2 stay by default), Memory Snap is the third element in the app.
- Why simplified: this is just coding, not AI — different phase.
- 72-hour change rule: users can change one card after 72 hours.
- Process for changing a card:
  - User asks Ollie when ready.
  - Ollie reminds user: *"You can change your Card 1. Do you want to move it to temperature to learn more?"*
  - If user changes to temperature: *"Now go to your device and check — go ask your Oura how they use temperature."*
- ITB strategy for biometrics like temperature **not built yet** — fallback is "go to your device."
- Whenever a 72-hour card matures, Ollie sends reminder.
- Card resize behavior: when Memory Snap + 2 cards are in place, the layout resizes — Memory Snap doesn't drop, **Routine Bookshelf resizes** to accommodate.

### Vertical expansion + 🔵 blue announcement

- When a program/plan opens, Ollie can offer: *"You have a button — update — if you want to expand the full screen, I expand it — and you'll just swipe it afterwards."*
- 🔵 blue announcement = key program announcement.
- Default when 🔵 blue announcement: open vertically, taking half of the Rhythm Board.
- User can expand to full screen via expand button, then collapse back.
- Reason for vertical: nice "half" effect, lets users feel resizing.
- This is part of Val's stated reason for using vertical layout.

### Polar / Oura observation (Zakiy)

- Zakiy confirmed: gets temperature from Oura, **not** from Polar.
- This is exactly the case the gray-out / hide rule must handle.

### Pre-Belgrade work commitment

- Val will send a written push within the next hour ("before you get on board").
- Zakiy can read on the road with family, plan, then push back via Figma feedback.
- Standard Source-of-Truth-vetted-push protocol from T-02 applies.

---

## Decisions stated

- Spike API is in place; show only available values.
- If a value is missing in a score computation, **default weight = 30%** (Val proposed, simple fallback).
- Don't gray out as punishment; either hide or use gray as dialogue doorway.
- AskABA only speaks when Ollie asks.
- AskABA stays simple — no per-device intelligence; generic upgrade message.
- Phase 1 = **2 cards + Memory Snap** (not 3 cards).
- Memory Snap doesn't drop; user can change anytime.
- 72-hour change rule applies to Card 1 / Card 2 only.
- Education program in Q teaches users about Memory Snap.
- When card layout resizes, **Routine Bookshelf** is the element that resizes — Memory Snap holds.
- 🔵 blue announcement opens program vertically (half Rhythm Board); expand button available.
- ITB for temperature/biometric coaching **not built in Phase 1** — fallback is "ask your device."

---

## Timeline references

| Date | Milestone |
|------|-----------|
| **By May 20** | Spike API display logic for biometric values must be ready |
| **Next hour** | Val pushes vetted written summary to Zakiy before he leaves for trip |

(May 1 / May 2 / May 15 from earlier transcripts still apply.)

---

## Dependencies / Blockers

- HRV trend computation — not built; if needed, requires build.
- Sleep Score / Stress Score availability via Spike API — Val asked, no confirmation in transcript.
- VO2 Max availability via Spike API — Val asked, no confirmation.
- Body Composition / Phase Angle from InBody or SECA — integration path implied but not detailed.
- FreeStyle Libre integration — referenced as future integration.
- Card resize logic — Memory Snap holds, Routine Bookshelf resizes — implementation not yet done.
- 🔵 blue announcement vertical-expand component — implementation not yet done.
- Education program in Q for Memory Snap — content not written.
- Ollie + AskABA dialogue script for gray-area clicks — content not written.
- Message routing to Dr. Andrei / Professor Ilić — channel not specified (email? in-app? notification?).

---

## Open Questions

### 1. 30% default weight for missing values — OPEN

Val proposed: when a value is missing in score computation, weight it at 30% (uniform fallback to keep things simple). No formula refinement, no breakdown by which composite it feeds.

Working read: this is a Phase 1 simplification — uniform 30% across the board for any missing biometric value during score computation, until the proper weighting hierarchy is built post-June.

Ambiguity: Does 30% apply (a) at the composite level, (b) per individual missing biometric, or (c) only to the final score? Transcript doesn't specify.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 2. AskABA voice in Phase 1 gray-area dialogue — OPEN

Val: *"AskABA is code — which is very smart — but it's not smart enough to check all of them — will be too much work for you."*

Zakiy: *"AskABA doesn't talk — only Ollie is asking him."*

Working read: AskABA in Phase 1 returns a generic message; doesn't device-detect; doesn't have its own conversational surface. Ollie always initiates.

This connects directly to T-01 Q2 (Dual AI in AI Playground). Possible collapse — if AskABA only ever responds to Ollie's prompts, it may not be a separate user-reachable surface in Phase 1.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 3. Spike API signal availability inventory — OPEN

Val asked through several signals (Sleep Score, Stress Score, VO2 Max, Body Composition, Phase Angle) and got no confirmation in transcript. The actual list of what Spike API delivers per device (Oura, Polar, WHOOP, Garmin) needs to be inventoried before May 20 build.

Zakiy confirmed only one data point: Polar doesn't return temperature, Oura does.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need — this is your build inventory; you have the API access.**

---

### 4. Message-to-Dr.-Andrei / Professor-Ilić routing — OPEN

When user clicks a grayed-out / unavailable biometric, Ollie offers to "send a message to Dr. Andrei" or "Professor Ilić." The transcript doesn't specify the channel — in-app message? Email? Notification queue? Provider Dashboard ticket?

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 5. Phase 1 = 2 cards + Routine Bookshelf resize behavior — OPEN

Val: *"we're not gonna put 3 cards at this point. We'll put 2 cards — Card 1 and Card 2 — stay by default. And Memory Snap is in the app."*

Resize logic: Memory Snap holds, Routine Bookshelf resizes.

Layout to confirm: Card 1, Card 2, Memory Snap, Routine Bookshelf — and Routine Bookshelf is the only element that flexes when content changes. Also: 3-card rule needs to be documented somewhere as Phase 2 so it doesn't get lost.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 6. Education program in Q for Memory Snap — OPEN

Val: *"We will create an education program in Q teaching about Memory Snap."*

This is content authoring (Val's side), not Zakiy's build — but Zakiy needs to know it's coming and ensure Q can host it.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need in Q to host the Memory Snap education program.**

---

## Val's understanding

> **Open. Val to provide in his own words. Zakiy: this is the side-by-side compare surface — when Val fills it in, read it against your own understanding of the same transcript and flag any mismatch.**

---

## Gaps / flags for Zakiy

- **HRV trend** — Zakiy said "no" to whether trends exist. May need to be built for Phase 1, or descoped — Val didn't push.
- **InBody and SECA** — referenced as biometric data sources for Body Composition / Phase Angle. Integration path with Spike API or separate?
- **"Don't gray out as punishment"** — Val's design principle: missing values should not feel like blame. Important UX framing.
- **🔵 blue announcement** — new UI element type. Triggered by what events? Only program opens? Other triggers possible?
- **Rhythm Board** — referenced as the canvas the vertical-expanded program occupies. Confirm canon spelling consistent (Rhythm Board, not Rythm Board).
- **72-hour card maturity reminder** — Ollie owns this prompt. Implementation: timer-based notification? Triggered on next session?
- **"You should just go to your Oura — go to your device"** — Val's Phase 1 fallback for missing ITB content. Worth documenting as the canonical placeholder copy.
- **Spike API confirmed in scope** — but Val said *"even for us — we don't use Spike API. We have it there"* — slightly ambiguous; Val may mean it's wired but not actively pulled. Confirm activation status.

---

**[READY FOR ZAKIY REVIEW]**

---

*Document compiled for Zakiy's flight review. T-03 of multi-transcript intake series. More transcripts to follow — full compilation when Val signals "compile."*
