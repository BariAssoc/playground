# BARIACCESS™ CANONICAL SPECIFICATION
## ITB Display Canon — Full Screen / Pagination / Progress Messaging / Save & Exit / Credit Differential

**DOCUMENT ID:** CCO-UX-ITB-DISP-001
**VERSION:** v1.0
**STATUS:** WORK IN PROGRESS — PENDING VAL APPROVAL
**AUTHOR:** Valeriu E. Andrei, MD | President
**COMPANIES:** VE Andrei MD Bariatric Associates, PA | BariAccess LLC | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.

---

## §1. PURPOSE

This canon governs how an ITB (Interventional Therapeutic Block) is displayed to the patient once triggered. It covers: full screen display, card pagination and numbering, progress messaging every 3rd card, save and exit mechanics, credit differential rule, and AskABA Yes/No button interaction.

Source: Val + Zakiy dev conversation — April 2026.

---

## §2. DISPLAY — FULL SCREEN

When an ITB is triggered and the patient enters it:

- ITB opens to **FULL SCREEN** — the entire Rhythm Board
- Everything else is hidden
- No Constellation Panel visible
- No Daily Pulse visible
- No other tiles or trackers
- The ITB is the only thing present

This is intentional. The patient is inside a program. Full attention. No distractions.

---

## §3. CARD PAGINATION — THE NUMBERING RULE

**RULE — NON-NEGOTIABLE:**
Every card is numbered. Always. The patient ALWAYS knows where they are.

**Format:**
> Card [N] of [Total]
> Examples: "Card 3 of 12" / "Card 7 of 20" / "Card 1 of 8"

**Range:**
- ITBs are variable length — the number of cards per ITB varies by program content
- **Hard ceiling: 20 cards maximum per ITB — LOCKED**
- Minimum: no fixed minimum — determined by program content
- Exact card count per ITB is set by the program — not by a universal rule

**What never happens:**
- A card with no number
- A card that hides the total
- A patient who does not know how many cards remain

Val's clinical reasoning:
> *"I'm 6 into it — you follow me? In this way it's much easier. Sometimes you say, oh — I'm 10, I'm not gonna understand. You say — save and exit."*

---

## §4. PROGRESS MESSAGING — EVERY 3RD CARD

**Rule:**
Every 3rd card — Ollie delivers a progress message BEFORE the card loads.

| Card | Event |
|------|-------|
| Card 3 | Progress message → then Card 3 loads |
| Card 6 | Progress message → then Card 6 loads |
| Card 9 | Progress message → then Card 9 loads |
| (and so on) | Throughout the ITB |

**Placement — LOCKED:**
The progress message appears as an **Ollie notification BEFORE the card loads.** It does not replace the card content. The patient sees the Ollie message first — then the card loads beneath.

**What the message contains:**
1. Acknowledgment of progress made
2. Cards completed so far
3. Cards remaining — always stated explicitly
4. Encouragement
5. Save option reminder — gentle, not pressuring

**Canonical example (Val's words):**
> *"Card number 3. Listen — it's a great job. You're doing great. You have another 7 cards. Keep going. But if you can, just save it and come back next time. Don't forget this message."*

**Tone:**
- Warm. Not clinical.
- Specific. Not generic.
- Never guilt. Never pressure.
- Always the save option is mentioned as acceptable.

Val's rationale:
> *"This makes such a huge difference. Don't you feel sometimes when you do something and you see how it's good, but my God — when is it gonna end? But I always come and say: hey, you got 3 — not bad. You're moving along nicely. But by the way, we have another 7. And you have juice for it."*

---

## §5. SAVE AND EXIT — MECHANICS

**Available:** At any point in the ITB. The patient is never trapped.

| Action | Result |
|--------|--------|
| Patient saves | Progress saved. Card number remembered. Resumes at exact card when returning. ITB stays active in Daily Pulse. |
| Patient ignores ITB entirely | ITB moves to Parking Lot. Standard Parking Lot rules apply per CCO-PROG-001 v2.1. |

---

## §6. CREDIT DIFFERENTIAL — LOCKED

**Rule:** Completion method determines final credit award.

| Completion Type | Credits |
|----------------|---------|
| Full ITB in one session | Full credits — no deduction |
| Fragmented — saved and returned | Variable deduction — NOT always exactly 1 credit. Depends on the ITB. |

**How it is communicated to patient:**

At the 3rd card progress message and at the save prompt:
> *"If you do it in one shot — you get all 5 credits. If you save fragmented — you get one credit less. So you have 2 more minutes — buy the bullet. It's important."*

**Note on credit deduction:** The exact deduction amount is variable per ITB — it is NOT a universal fixed -1 credit rule. The deduction amount is set at the program/ITB level. The example of "1 credit less" is illustrative — not a locked universal formula.

**Purpose:** The credit differential is a nudge — not a punishment. The patient is never penalized for saving. They are rewarded for completing in one sitting. The difference is meaningful but not devastating.

---

## §7. ASKABA YES/NO BUTTON INTERACTION

**What this is:**
AskABA can deliver a message inside an ITB that includes **two buttons: Yes / No.** This is not just a text bubble — it is an interactive prompt inside the AskABA bubble message. The patient clicks a button. The response is recorded as **V3 data.**

**Placement — LOCKED:**
The Yes/No buttons appear **inside the AskABA bubble message** — not on a separate card, not as a standalone overlay. It is part of the AskABA message bubble interaction.

**When it triggers:**
- At the start of an ITB (space, mood, readiness check)
- At the every-3rd-card interval (mood check mid-ITB)
- At any point AskABA determines a contextual check is needed

**Canonical example (Val's words):**

AskABA in bubble:
> *"I just want to make sure I keep a finger on your pulse. I'm asking how you're doing. How's your mood right now?"*
> [YES] [NO]

If patient ignores:
> *"Okay — come back later. Nothing personal."*

If patient answers YES:
> *"Great. Keep going — that is right."*

**What the response records:**
- Button pressed (Yes / No)
- Timestamp
- Card number at time of response
- Recorded as **V3 data** — contextual input from patient
- Non-response is also recorded (proportional frequency — not zero — full formula pending CCO-ARCH-VVAL-001)

---

## §8. V3 DATA COLLECTED INSIDE ITB

*This section references confirmed transcript decisions. Full V3 container canon is pending — CCO-ARCH-VVAL-001.*

V3 data collected inside ITB:
- AskABA Yes/No button response
- Space (Protected / Challenging / Vulnerable) if asked at start
- Mood input
- Effort signal
- Non-response (proportional frequency — not zero)

V3 is NOT zero when patient does not respond. Non-response is recorded as a proportional frequency value. Full formula: TBD in CCO-ARCH-VVAL-001 after Val sends V-value brief.

---

## §9. OPEN QUESTIONS

All OQs from initial display resolved:

| OQ | Answer | Status |
|----|--------|--------|
| OQ-ITBDISP-01 | Hard ceiling = 20 cards. Range is variable up to 20. | ✅ RESOLVED |
| OQ-ITBDISP-02 | Credit deduction is variable per ITB — NOT always exactly 1. | ✅ RESOLVED |
| OQ-ITBDISP-03 | Yes/No buttons appear inside AskABA bubble message. | ✅ RESOLVED |
| OQ-ITBDISP-04 | Progress message = Ollie notification BEFORE card loads. | ✅ RESOLVED |

---

## §10. CROSS-REFERENCES

| Document ID | Relationship |
|-------------|-------------|
| CCO-PROG-001 v2.1 | Program Canon — ITB within Program |
| CCO-ITB-001 v1.1 | ITB Canon Master |
| CCO-ARCH-VVAL-001 | V-Value Container Architecture (pending) |
| PAC-ISE-002 | ISE governs ITB delivery |

---

## §11. PROVENANCE

Transcript — Val + Zakiy dev conversation — April 2026
https://claude.ai/chat/3cd9b824-d1dc-4458-8a25-15a01ee4ca31

---

Copyright © 2026 | BariAccess LLC | VE Andrei MD Bariatric Associates, PA | RITHM, Powered by BariAccess LLC | Live in Rithm LLC | Aithos LLC. All rights reserved. Internal use only.
