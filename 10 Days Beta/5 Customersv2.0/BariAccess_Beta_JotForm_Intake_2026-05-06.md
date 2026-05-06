# BariAccess Beta — Cohort JotForm Intake

**Document ID:** BETA-JOTFORM-001
**Author:** Valeriu E Andrei MD, President — BariAccess LLC
**Date:** May 6, 2026
**Status:** Beta v1 — locked content, ready for JotForm build
**Linked spec:** BariAccess Beta Build Spec — 10-Day Production Sprint (May 6, 2026)
**Cohort:** Val, Zakiy, Nikita, Costin, Victor

---

## Purpose

The intake form sent to all 5 cohort members at the start of the 10-day Wizard of Oz beta. Captures the baseline routine, mood, space, effort, and consistency data needed to (1) populate each user's Routine Bookshelf, (2) generate the 30-day synthetic backfill via Claude, and (3) calibrate FAB timing per person.

**Format:** All multi-choice / yes-no. No free-text fields. (Per Zakiy's lock — analytic AI is not in scope for the beta.)
**Estimated completion time:** 6–8 minutes
**Total questions:** 33 across 10 sections

---

## Delivery

**Owner:** Val
**Deadline:** Thursday, May 7, 2026
**Method:** JotForm (email/text link to all 5 cohort members)
**Submission target:** All 5 responses returned by Friday May 8, end of day

---

## Section 1 — Wake / Sleep

**Q1.** What time do you wake up on weekdays?

- Before 5 AM
- 5–6 AM
- 6–7 AM
- 7–8 AM
- 8–9 AM
- After 9 AM

**Q2.** What time do you go to bed on weekdays?

- Before 9 PM
- 9–10 PM
- 10–11 PM
- 11 PM – 12 AM
- 12 – 1 AM
- After 1 AM

**Q3.** Is your weekend wake/bed time the same as weekdays?

- Yes, same
- Off by 1 hour
- Off by 2+ hours
- Completely different

---

## Section 2 — Morning Routine

**Q4.** What is the FIRST thing you do after waking up?

- Check phone
- Drink water
- Bathroom
- Coffee or tea
- Exercise
- Eat
- Other

**Q5.** Do you eat breakfast within 1 hour of waking?

- Always
- Usually
- Sometimes
- Rarely
- Never

**Q6.** Do you exercise in the morning?

- Yes — daily
- Yes — 3–5x/week
- Yes — 1–2x/week
- Rarely
- Never

**Q7.** Do you get sunlight exposure in the morning?

- Always
- Usually
- Sometimes
- Rarely
- Never

---

## Section 3 — Midday

**Q8.** What time do you consider "midday"?

- Before 11 AM
- 11 AM – 12 PM
- 12 – 1 PM
- 1 – 2 PM
- After 2 PM

**Q9.** Do you take a break for lunch?

- Yes — sit-down meal
- Yes — but at desk
- Quick snack only
- Skip lunch

**Q10.** Do you hydrate consistently during the day?

- Always — actively tracking
- Usually — drink enough
- Forget often
- Rarely drink water

**Q11.** Do you eat protein at lunch?

- Always
- Usually
- Sometimes
- Rarely
- Never

---

## Section 4 — Evening

**Q12.** What's your main evening activity?

- Family time
- Work continues
- Exercise
- Social
- Solo unwind
- Errands

**Q13.** When is your last meal of the day?

- Before 6 PM
- 6 – 7 PM
- 7 – 8 PM
- 8 – 9 PM
- After 9 PM

**Q14.** Do you do an evening workout?

- Yes — daily
- Yes — a few times/week
- Rarely
- Never

---

## Section 5 — Sleep Prep

**Q15.** Do you dim lights / use ambient lighting before bed?

- Yes
- No
- Sometimes

**Q16.** Do you control your bedroom temperature?

- Yes — cool
- Yes — warm
- No specific control

**Q17.** Do you sleep alone or with a partner?

- Alone
- Partner
- Pet(s)
- Other

**Q18.** Do you fall asleep within 15 minutes of getting in bed?

- Always
- Usually
- Sometimes
- Rarely
- Never

**Q19.** What do you do in the 30 minutes before sleep?

- Read book
- Phone or tablet
- TV
- Meditate
- Nothing
- Other

---

## Section 6 — Mood

**Q20.** How is your mood when you wake up vs. when you went to bed?

- Much better
- Better
- Same
- Worse
- Much worse

**Q21.** How is your mood at lunch vs. at breakfast?

- Much better
- Better
- Same
- Worse
- Much worse

**Q22.** What's your typical baseline mood during the workday?

- 😞 Low
- 😐 Meh
- 🙂 Okay
- 😊 Good
- 🔥 Great

---

## Section 7 — Space

**Q23.** During a typical day, how much time do you spend in **Protected Space** (calm, safe, no demands)?

- Most of day
- Half the day
- A few hours
- Less than 1 hour
- Almost none

**Q24.** During a typical day, how much time do you spend in **Challenging Space** (demanding work, meetings, problem-solving)?

- Most of day
- Half the day
- A few hours
- Less than 1 hour
- Almost none

**Q25.** During a typical day, how often do you enter **Vulnerable Space** (uncomfortable, exposed, high-stakes)?

- Multiple times daily
- Daily
- A few times/week
- Rarely
- Almost never

---

## Section 8 — Grit / Effort

**Q26.** How hard did you push yourself yesterday (effort scale)?

- 1 — coasted
- 2 — light
- 3 — moderate
- 4 — hard
- 5 — maxed out

**Q27.** How often does your effort match your intentions for the day?

- Always
- Usually
- Sometimes
- Rarely
- Never

---

## Section 9 — Consistency

**Q28.** Are your weekdays consistent (same routine each day)?

- Very consistent
- Mostly consistent
- Mixed
- Mostly inconsistent
- Different every day

**Q29.** Is your weekend the same routine as your weekdays?

- Same
- Mostly same
- Different
- Completely different

---

## Section 10 — 30-Day Self-Assessment

**Q30.** Compared to the last 30 days, how do you feel today?

- Much better
- Better
- Same
- Worse
- Much worse

**Q31.** Compared to the last 30 days, how consistent has your routine been?

- Much more consistent
- More consistent
- Same
- Less consistent
- Much less consistent

**Q32.** Compared to the last 30 days, how is your sleep?

- Much better
- Better
- Same
- Worse
- Much worse

**Q33.** Compared to the last 30 days, how is your energy?

- Much better
- Better
- Same
- Worse
- Much worse

---

## How This Data Feeds the Beta

| JotForm Section | Beta Use |
|---|---|
| Wake / Sleep | Sets each user's Routine Bookshelf time anchors (AM1 wake, PM3 sleep) |
| Morning / Midday / Evening | Confirms FAB timing per cohort member; shifts archetype FABs to actual schedule |
| Sleep Prep | Calibrates evening FAB sequencing (PM1→PM3) |
| Mood (Q20–22) | Baseline for Bookend mood-delta calculations |
| Space (Q23–25) | Calibrates the warm-up Bookend Space tap distribution |
| Grit / Effort | Feeds Effort Score input (E = 0.40·F + 0.30·C + 0.30·LC) |
| Consistency | Feeds backend consistency computation; flags weekend variance |
| 30-Day Self-Assessment | Used by Claude for the 30-day synthetic backfill prompt |

---

## Synthetic Backfill Pipeline (post-JotForm)

1. JotForm response returned per cohort member
2. Val runs each response through Claude with a synthetic-profile prompt
3. Claude generates 30 days of plausible prior routine data (FAB completion patterns, mood traces, sleep windows)
4. Data tagged `synthetic: true` and written to CosmosDB
5. When user logs in Day Zero, ~30 days of "history" already plotted on their Routine Bookshelf

---

## Open Items

1. Confirm JotForm logic — should Q23 / Q24 percentages auto-validate (sum near 100%)? Recommend: no, they overlap.
2. Confirm consent / privacy text at top of form — does Val have a standard cohort consent block from the clinic?
3. Confirm whether Q19 (pre-sleep activity) should be multi-select (read AND meditate) — currently single-select. Recommend: multi-select.
4. Decide whether to add a final open-question — "anything else we should know about your routine?" — Currently excluded per multi-choice-only lock. Recommend: keep excluded for the beta.

---

*BariAccess LLC — Confidential — Internal Use Only*
*Copyright © 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
