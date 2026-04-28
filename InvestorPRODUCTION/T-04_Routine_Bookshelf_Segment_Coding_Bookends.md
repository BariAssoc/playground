# T-04 — Routine Bookshelf Segment Coding + FAB Granularity + Bookend Timing Logic

**Source:** Internal dev session, Val + Zakiy
**Topics covered:** Routine Bookshelf simulation time-coding system, FAB granularity rules, Bookend timing logic, UI/UX limits vs backend encoding distinction
**Status:** Ready for Zakiy review
**Purpose:** Side-by-side compare surface — Val's understanding vs Zakiy's understanding of the same transcript

---

## Routine Bookshelf — Time-Coding Canon (locked in this transcript)

| Segment | Codes | Color State |
|---------|-------|-------------|
| 🌅 **Morning** | AM1 — AM2 — AM3 | 🟢 Green when complete / 🟠 Orange when pending |
| **Bar: Morning → Midday** | A1 — A2 — A3 — A4 | FAB placement zone |
| ☀️ **Midday** | Mid1 — Mid2 — Mid3 | 🟢 Green when complete / 🟠 Orange when pending |
| **Bar: Midday → Evening** | B1 — B2 — B3 — B4 | FAB placement zone |
| 🌙 **Evening** | PM1 — PM2 — PM3 | 🟢 Green when complete / 🟠 Orange when pending |

**Example FAB placements:**
- 💧 Hydration → **A1**
- 🥩 Protein → **A2**
- 🏋️ Gym (7PM) → **B3** *(🟠 orange if routine broken)*

---

## What this transcript contains

### Granularity rule — UI/UX vs backend

- A segment slot (e.g., A2) can hold **multiple FABs** behind it (example: A2 between 10–11AM holds emails + protein + hydration).
- **UI/UX must NOT be granular** — only the segment slot lights up (one orange dot for A2).
- **Backend CAN be granular** — the encoding behind the segment can carry 3+ FABs and track each independently.
- When user clicks on the orange A2, the card surfaces and shows which specific FAB inside is the problem.
- Granularity at UI level would be "insane" / "sick" — Val explicitly limits this.
- Val: *"Ollie is going to say — go — you know — guys — crazy people. I'm not going to get so crazy — because Ollie goes into therapy if we give her like 20 FABs in that one."*

### FAB sub-segment math

- A2 represents roughly 25% of the bar between Morning and Midday.
- A FAB inside A2 may be 1/8 of A2 (i.e., ~15 minutes).
- These sub-fractions are tracked in backend, not displayed in UI.

### Bookends — the timing/closing mechanism

- Bookends = the timing structure that **opens and closes** a FAB.
- Each FAB has 2 Bookends (open + close).
- An A2 with 3 FABs = 6 Bookends total.
- Ollie uses Bookends to prompt the user: *"Hey Zakiy — remember — did you send your emails?"* / *"Did you do your breathing exercises?"* / *"Did you do your protein?"*
- User responses ("yes" / "on it" / "finished") close the FAB via the Bookend.
- Precision is approximate — Bookends fire close to expected time, not exactly at it.
- Anything on the card immediately closing a FAB = Bookend behavior.

### Zakiy's reframe

- Zakiy initially thought of segments as "time of day / times" — Val confirms it's really about **Bookends**, which are what tell us the times.
- Bookends are the time-anchoring mechanism, not segment slots themselves.

---

## Decisions stated

- Time-coding system locked: AM1-3, A1-4, Mid1-3, B1-4, PM1-3.
- Color rule locked: 🟢 green = complete, 🟠 orange = pending/broken.
- A and B bars are FAB placement zones (between major segments).
- **UI/UX granularity capped at segment slot level** — one slot, one color, one orange-click.
- **Backend granularity unrestricted** — encoding holds multiple FABs per slot.
- Click-on-orange behavior: card opens, shows the specific problematic FAB(s) underneath.
- FABs are bracketed by Bookends (2 per FAB: open + close).
- Ollie uses Bookends to fire reminder prompts.
- Bookend timing is approximate, not precise.

---

## Timeline references

(No new dates in this transcript — earlier timeline anchors still apply: May 2 / May 15 / May 20.)

---

## Dependencies / Blockers

- Routine Bookshelf segment-coding implementation in app — UI must render AM1-3 / A1-4 / Mid1-3 / B1-4 / PM1-3 with color states.
- Backend FAB-to-segment mapping — multiple FABs per slot, tracked individually.
- Click-on-segment behavior — opens card showing FABs nested inside that segment.
- Ollie Bookend prompt scripts — content not written ("Did you send your emails?" / "Did you do your protein?").
- Bookend trigger timing logic — when does Ollie fire the prompt? At Bookend open? Mid-FAB? Bookend close?
- FAB completion close-out — voice/text response from user closes the FAB via Bookend.

---

## Open Questions

### 1. A2 sub-fraction math — one eighth or one quarter? — OPEN

The cleanup transcript flagged this: *"one eighth of A2"* — is this the right fraction, or did Val mean one quarter?

Val's transcript: *"as you said — one eighth of A2 — is going to show."*

Working read: A2 = 25% of the A bar (since there are 4 slots A1-A4). A FAB inside A2 representing ~15 minutes would be ~1/8 of A2 if A2 covers ~2 hours. Math checks out for a 1/8 reading, but Val's intent should be confirmed.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 2. Ollie Bookend prompt timing — when does Ollie fire? — OPEN

Bookends bracket each FAB (open + close), but the transcript doesn't lock when Ollie's prompt fires:
- (a) At Bookend open — *"Are you about to do your protein?"*
- (b) Mid-FAB — *"Are you doing it?"*
- (c) At Bookend close — *"Did you finish?"*
- (d) After Bookend close if no signal — *"Did you do your protein?"*

Val's example dialogue suggests (d) — Ollie checks after the fact. But for FABs that have started, mid-FAB prompts also fit.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 3. Maximum FABs per segment slot — soft limit or hard limit? — OPEN

Val's example: 3 FABs in A2. Val also said: *"Ollie goes into therapy if we give her like 20 FABs in that one."*

Working read: There's a soft upper bound (somewhere between 3 and "20-which-is-too-many"), but no hard cap was stated. Could be a Phase 1 build choice — Zakiy might cap at 3 or 5 per slot, expand later.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 4. Click-on-orange-segment card design — OPEN

When user taps an orange A2, a card opens showing the FABs underneath. The transcript doesn't specify the card layout:
- All 3 FABs listed with individual color states?
- Only the problematic (orange) FAB shown?
- Mix — show all but emphasize the orange one?

Val's transcript: *"actually — it's going to show you the 3 FABs that are resting behind it. You can see which one actually is the trouble."*

Working read: show all FABs in the slot, with their individual color states, so the user can see which is the trouble. But specific card UI not specified.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

### 5. FAB close-out via voice/text — input scope — OPEN

Bookend closure happens when user signals completion. Val's example dialogue uses voice-style ("Yes" / "On it" / "Close" / "Finished"). The transcript doesn't specify:
- Voice-only? Text? Either?
- Free text or button taps?
- Does Ollie auto-close based on biometric signal (e.g., HRV change indicating workout done)?

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and flag the hooks you need.**

---

## Val's understanding

> **Open. Val to provide in his own words. Zakiy: this is the side-by-side compare surface — when Val fills it in, read it against your own understanding of the same transcript and flag any mismatch.**

---

## Gaps / flags for Zakiy

- **Time-coding system is now canonically locked** — AM1-3, A1-4, Mid1-3, B1-4, PM1-3. This is the canonical naming for Routine Bookshelf segment slots going forward.
- **The "UI vs backend granularity" distinction** is the key architectural insight from this transcript. Surface stays simple, encoding stays rich. Worth marking as a design principle.
- **Bookends as the time-anchoring mechanism** — Zakiy's mental model shift confirmed by Val. Bookends, not segment slots, are what carry time information.
- **2 Bookends per FAB** — confirmed math. A2 with 3 FABs = 6 Bookends.
- **Hydration → A1, Protein → A2, Gym 7PM → B3** — example FAB placements; not necessarily canonical assignments, but useful as illustrative defaults.
- **Per April 22 2026 canon (existing memory):** Routine Bookshelf shows Morning/Midday/Evening *umbrellas*, not segments. T-04 introduces segment-level slots (AM1, A1, etc.) which are the granular layer behind the umbrellas. Confirm these coexist — umbrellas in display, segment slots in encoding.
- **"Bar Morning → Midday" and "Bar Midday → Evening"** — the bridges/bars between major segments. Per existing canon, segments include Wake, Coffee, Commute, Work Block 1, Break, Work Block 2, Dinner, Sleep. The A1-4 / B1-4 layer maps to where in the day these sit. Cross-reference needed.
- **Per April 22 2026 Expression Layer rule:** orange = Ollie calling for attention, green = in shape. T-04 reinforces this — segment slot colors follow expression layer, not Beacon. Consistent.

---

**[READY FOR ZAKIY REVIEW]**

---

*Document compiled for Zakiy's flight review. T-04 of multi-transcript intake series. More transcripts to follow — full compilation when Val signals "compile."*
