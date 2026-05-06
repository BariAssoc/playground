# BariAccess Beta — FAB Schedule

**For: Pamela**
**Archetype: Methodical Achiever**

---

## Cohort Member

| Field | Value |
|---|---|
| Full Name | Pamela |
| Archetype | Methodical Achiever |
| Beta Window | May 7 – May 17, 2026 |

---

**Document ID:** BETA-FAB-Pamela-001
**Version:** v1 (May 6, 2026 — pre-intake placeholder)
**Status:** Default Methodical Achiever schedule. Times will be calibrated per individual after Day 1 Baseline JotForm + 90-Day Intake responses are received.

---

## Methodical Achiever Profile

- **High Conscientiousness** → responds to clear structure, tracks precisely
- **High agency / "needs to understand before approving"** → each FAB carries a brief rationale so completion feels purposeful, not arbitrary
- **Hidden risk: cognitive load** → midday reset, pre-decision protein, post-meeting decompression are protective FABs
- **Detail-driven** → will track precisely if the FAB is well-defined

---

## The 10 FABs (default times — will calibrate after intake)

| # | FAB Name | Time | Segment | Window | Critical? | Rationale |
|---|---|---|---|---|---|---|
| 1 | Wake-up hydration | 7:00 AM | AM1 | 10 min | No | Resets fluid balance after 7+ hours of dehydration; primes cognition |
| 2 | Sunlight exposure (outside) | 7:30 AM | AM2 | 15 min | No | Anchors circadian rhythm, supports cortisol awakening response |
| 3 | Protein breakfast | 8:00 AM | AM3 | 20 min | No | Stabilizes blood sugar; sustains cognitive performance through morning peak |
| 4 | Mid-morning hydration check | 10:30 AM | A3 | 5 min | No | Counters cognitive fatigue from sustained focus work |
| 5 | Pre-decision protein / snack | 12:00 PM | A4 | 10 min | No | Buffers afternoon cognitive load; protects decision quality |
| 6 | Lunch — sit-down meal | 1:00 PM | Mid2 | 30 min | No | Real meal, away from desk; cognitive reset |
| 7 | Post-lunch movement | 2:00 PM | Mid3 | 10 min | No | Mitigates "2–4 PM dip"; maintains afternoon clarity |
| 8 | Decompression reset | 4:30 PM | B3 | 10 min | No | Post-decision-day recovery; transition signal from work to evening |
| 9 | Dinner — protein, no late food | 7:00 PM | PM1 | 30 min | No | Earlier dinner protects sleep onset |
| 10 | Wind-down + screens off | 10:00 PM | PM3 | 15 min | No | Sleep prep; matches evening chronotype default |

---

## Color Logic

| State | Trigger |
|---|---|
| 🔵 Blue | FAB nudge fired — awaiting response |
| 🟢 Green | Completed within window |
| 🟠 Orange | Missed window |
| 🔴 Red | Critical FAB missed (none flagged Red in this baseline) |

---

## Notes for Pamela

- Each FAB is deliberately small. Methodical Achievers tend to over-commit; the goal here is **base rate stability**, not heroic effort.
- The pre-decision protein FAB (#5) and decompression reset (#8) are the two FABs most likely to feel "unnecessary." They are the most protective for sustained cognitive performance.
- Times above are defaults. After your Day 1 Baseline JotForm (Chronotype + Personality) and the 90-Day Intake, these will calibrate to your actual wake/sleep window and peak-time pattern.

---

## Notes for Zakiy (Implementation)

- Each FAB carries: `fab_id`, `user_id`, `name`, `scheduled_time`, `segment_code`, `window_minutes`, `critical_flag`, `rationale`
- No critical (Red) FABs in this baseline. All use Green/Orange logic.
- Post-intake refinement: shift `scheduled_time` per cohort member based on Chronotype Q1 (peak time) and Q3/Q4 (natural wake/bed)
- This baseline is acceptable for the first 3 days of the beta. Refinement should land by Day 4 for accurate F/C scoring

---

## Open Items

1. Confirm wake/sleep window for Pamela from Day 1 Baseline (May 11 response)
2. Confirm whether Pamela is on GLP-1 — if yes, add as critical FAB
3. After 90-Day Intake returns, refine all FAB times to actual routine
4. Consider adding 1 "wildcard / personal" FAB after intake — discovery slot for individual habits

---

*BariAccess LLC — Confidential — Internal Use Only*
*Copyright © 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
