# BariAccess Beta — Zakiy Handoff Summary

**Document ID:** BETA-HANDOFF-001
**Version:** v1 (May 6, 2026)
**From:** Valeriu E Andrei MD, President — BariAccess LLC
**To:** Zakiy Manigo, Lead Software Developer
**Subject:** Everything you need to launch the May 7–17 campaign

---

## 1. The 5-Step Job

This is what you need to do over the next 24 hours:

| # | Task | Done When |
|---|---|---|
| 1 | Recreate the 3 JotForm templates in JotForm.com (or your form tool) | Three form URLs exist |
| 2 | Configure your campaigns feature for all 12 cohort members | Campaign schedule active |
| 3 | Wire up the 3 mid-day text nudges (10 AM / 1 PM / 3:30 PM) | Nudge schedules saved |
| 4 | Set up CosmosDB containers per the V-Tag spec | Schemas created |
| 5 | Test fire one round on yourself before May 7 launch | One full day of data lands cleanly |

---

## 2. Files in Order of Priority

### Tier 1 — Build These Forms First (Must-Have for May 7)

| File | What It Is | Action |
|---|---|---|
| `BariAccess_Beta_JotForm_AM_Daily_TEMPLATE` | 8-question morning form, ~2 min | **Recreate in JotForm.com.** Fires at wake-time per cohort member. |
| `BariAccess_Beta_JotForm_PM_Daily_TEMPLATE` | 9-question evening form, ~3 min | **Recreate in JotForm.com.** Fires ~1 hr before bedtime per cohort member. |
| `BariAccess_Beta_JotForm_Baseline_TEMPLATE` | One-time chronotype + personality, ~7 min | **Recreate in JotForm.com.** Fires once on Day 1 only. |

### Tier 2 — Wire Up the Nudges (Must-Have for May 7)

| File | What It Is | Action |
|---|---|---|
| `BariAccess_Beta_Nudge_Templates_2026-05-06` | 3 mid-day text nudges (10 AM / 1 PM / 3:30 PM) | **Configure as SMS/iMessage/WhatsApp via campaigns.** Plain text. Reply parsing per spec. |

### Tier 3 — Reference Material (Use During Build)

| File | What It Is | Action |
|---|---|---|
| `BariAccess_Beta_VTag_Mapping_2026-05-06` | Which V-domain each Q/nudge feeds | **Use this when writing Sub-JSON encoding for every captured value.** |
| `BariAccess_Beta_Formula_Spec_2026-05-06` | Mood / F / C / LC_beta / E / Grit / SC formulas | **Implement nightly compute job per §10 data flow.** |
| `BariAccess_Beta_Build_Spec_2026-05-06` (v3) | Master spec — read first if confused | Reference only. |
| `BariAccess_Beta_Cohort_FABs_2026-05-06` | All 110 FABs (12 people × ~10 each) | **Load FABs into Routine Bookshelf. One row per FAB.** |

### Tier 4 — Per-Cohort Packets (Reference, NOT For Re-Building)

| File | What It Is |
|---|---|
| `BariAccess_Beta_JotForm_Packet_Val_Andrei` | Reference copy of all 3 forms for Val |
| `BariAccess_Beta_JotForm_Packet_Costin` | Reference copy for Costin |
| `BariAccess_Beta_JotForm_Packet_Zakiy` | Reference copy for you |
| `BariAccess_Beta_JotForm_Packet_Nikita` | Reference copy for Nikita |
| `BariAccess_Beta_JotForm_Packet_Victor` | Reference copy for Victor |
| `BariAccess_Beta_JotForm_Packet_Isaiah` | Reference copy for Isaiah |
| `BariAccess_Beta_JotForm_Packet_Grace` | Reference copy for Grace |
| `BariAccess_Beta_JotForm_Packet_Jennifer` | Reference copy for Jennifer |
| `BariAccess_Beta_JotForm_Packet_Madeline` | Reference copy for Madeline |
| `BariAccess_Beta_JotForm_Packet_Pamela` | Reference copy for Pamela |
| `BariAccess_Beta_JotForm_Packet_Donna` | Reference copy for Donna |
| `BariAccess_Beta_JotForm_Packet_Lana` | Reference copy for Lana (Embodied Practitioner) |

> **Don't recreate 12 separate forms.** Build the 3 templates once. Use the campaign feature to fire the same form at all 12 cohort members. The packets above are just per-person reference printouts.

### Tier 5 — Intake Forms (Send May 11, NOT May 7)

| File | What It Is | When |
|---|---|---|
| `BariAccess_Beta_Intake_Val_Andrei_FILLED` | Reference example (already filled by Val) | Reference only |
| `BariAccess_Beta_Intake_Costin` ... and 10 more | Blank named intakes for all 12 cohort members | **Send via email/web on May 11** — separate from daily campaign |

---

## 3. The 12-Person Cohort

| # | Name | Archetype | Wake / Sleep (default) | Channel |
|---|---|---|---|---|
| 1 | Val Andrei | Sedentary Executive (HQ, GLP-1) | 5:15 AM / 9 PM | TBD |
| 2 | Zakiy Manigo | Active Night-Shifter | 9:30 AM / 1:30 AM | TBD |
| 3 | Nikita Page | Sedentary Day / Active Night | 8 AM / 12:30 AM | TBD |
| 4 | Costin Peiu | Traveling Strategist (GLP-1) | 6:30 AM / 11 PM | TBD |
| 5 | Victor Savturev | IT & Data Integration | 7 AM / 11 PM | TBD |
| 6 | Isaiah DelRios | Sedentary Day / Active Night | 8 AM / 12:30 AM | TBD |
| 7 | Grace | Methodical Achiever | 7 AM / 10 PM | TBD |
| 8 | Jennifer Strong, NP | Methodical Achiever | 7 AM / 10 PM | TBD |
| 9 | Madeline DelRios | Methodical Achiever | 7 AM / 10 PM | TBD |
| 10 | Pamela Posner, RD | Methodical Achiever | 7 AM / 10 PM | TBD |
| 11 | Donna | Methodical Achiever | 7 AM / 10 PM | TBD |
| 12 | Lana | **Embodied Practitioner (NEW)** | TBD | TBD |

> **Lana is internal-only.** No data shared with Prof. Ilić or PROFEX.

---

## 4. The Campaign Schedule

For each cohort member, fire these on a 10-day repeating schedule starting **Thursday May 7, 2026**:

| Time (cohort local) | What | Source File |
|---|---|---|
| Wake + 30 min | AM JotForm | BETA-JF-AM-001 |
| 10:00 AM | FAB Check Nudge | BETA-NUDGE-001 §Nudge 1 |
| 1:00 PM | Productivity & Mood Nudge | BETA-NUDGE-001 §Nudge 2 |
| 3:30 PM | Lunch & Hunger Nudge | BETA-NUDGE-001 §Nudge 3 |
| ~1 hr before bedtime | PM JotForm | BETA-JF-PM-001 |

**Campaign window:** May 7 (Day 1) → May 17 (Day 11). Cohort embarks fully on May 17.

**On May 11 (Day 5):** Fire Day 1 Baseline JotForm + 90-Day Intake (one-time) to all 12.

---

## 5. CosmosDB Containers to Create

Per Formula Spec §10, you need these new containers (or extensions of existing):

```
mood_events           — per mood capture from any source
fab_completion        — per Bookend cool-down (already exists per BETA-BOOKEND-001)
jotform_events        — per AM/PM submission
nudge_events          — per nudge response
journal_entries       — per cool-down (Reading B integration)
effort_daily_rollup   — nightly compute (F, C, LC_beta, E, Mood, Grit_M, SC_beta)
disengagement_flags   — when E<0.3 for 3d / E<0.2 for 5d / 7d no interaction
```

Every captured row carries the V-tag array per BETA-VTAG-001.

---

## 6. Hard Blockers Before May 7

| # | Blocker | Owner |
|---|---|---|
| 1 | Val's Oura Ring charger (procurement) | Val |
| 2 | Wearable confirmation per cohort member | Val to check |
| 3 | Channel preference per person (SMS / iMessage / WhatsApp / Email) | Val to ask each cohort member |
| 4 | Time-zone confirmation for May 7–17 window | Val to check |
| 5 | GLP-1 status for new cohort members (adds critical FAB if yes) | Val to check |
| 6 | Lana's wake/sleep window (still TBD) | From her intake |

---

## 7. The 3 Things You Owe Val by Friday May 8

| # | Item | Format |
|---|---|---|
| 1 | Confirmation that all 3 JotForms are built and live | URLs to test |
| 2 | Confirmation that campaigns are scheduled for all 12 cohort | Screenshot of campaigns dashboard |
| 3 | One test cycle of your own data flowing through (AM JotForm + 3 nudges + PM JotForm + Bookend) | One full day of records in CosmosDB |

---

## 8. Deliverables Val Owes You by Friday May 8

| # | Item | Status |
|---|---|---|
| 1 | Grit Engine formula (multiplier rules + curve) | ✅ Delivered (BETA-FORMULA-001) |
| 2 | Effort Score formula | ✅ Delivered (BETA-FORMULA-001) |
| 3 | Mood scoring scale | ✅ Delivered (BETA-FORMULA-001) |
| 4 | 110 FABs for the cohort | ✅ Delivered (BETA-FAB-COHORT-001) — Lana's 10 still pending intake |
| 5 | V1–V4 mapping | ✅ Delivered (BETA-VTAG-001) |

---

## 9. Day 11 Deliverable (May 18) — What You Owe Val

A 30-day-trend update covering all 12 cohort members. Per Formula Spec §8, the report contains:

- Activity summary (pulled from Journal entries)
- HRV (where wearable data exists)
- Behavioral consistency index (C from Formula Spec §3)
- Schedule adherence (routine drift)
- Sleep score (where available)
- Nudge compliance rate
- Productivity-prediction match rate (AM Q5 vs 1 PM Nudge Q1)
- Effort Score (E) per cohort member
- Stability Coefficient (SC_beta) per cohort member
- Disengagement flags

**This is what Val takes to Belgrade May 27.**

---

## 10. Questions? Read In This Order

1. `BETA-FORMULA-001` (Formula Spec) — math
2. `BETA-VTAG-001` (V-Tag Mapping) — what tag goes where
3. `BETA-NUDGE-001` (Nudge Templates) — message text
4. `BETA-JF-AM-001` / `BETA-JF-PM-001` / `BETA-JF-BASELINE-001` (Form templates) — form content
5. `BariAccess_Beta_Build_Spec_2026-05-06` v3 (Master Spec) — everything else

If still confused: ping Val. Don't guess.

---

*BariAccess LLC — Confidential — Internal Use Only*
*Copyright © 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
