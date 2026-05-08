# BariAccess Beta Build Spec — 10-Day Production Sprint

**Version:** v4 (May 6, 2026 — adds Roychele Jones, cohort 12 → 13)
**To:** Zakiy
**From:** Valeriu E Andrei MD, President — BariAccess LLC
**Date:** May 6, 2026
**Production target:** May 17, 2026 (Day 11 — full cohort embarked)
**Day 11 trend report:** May 18, 2026 (Zakiy → Val)
**Belgrade flight:** May 27, 2026
**Beta cohort:** 13 people across 7 archetypes
**Supersedes:** v3 (12 cohort, 7 archetypes)

---

## What's New in v4

- **Roychele Jones added** as cohort member #13 (Methodical Achiever)
- **Total cohort:** 12 → 13
- **Total FABs:** 120 → 130
- **Methodical Achiever set:** 5 → 6 women (Grace, Jennifer, Madeline, Pamela, Donna, Roychele Jones)
- **No new archetype** — uses existing Methodical Achiever default schedule
- All 7 archetypes unchanged

---

## 1. Scope — What We're Building

A working beta of the Routine Bookshelf with timer-triggered FABs, three mid-day text nudges, and morning/evening JotForms for a 13-person cohort. Data collection runs May 7–May 17. Goal at Day 11: demonstrate V1/V2/V3/V4 score generation from real human routine + nudge + JotForm data.

**This is a Wizard of Oz digital launch.** No conversational AI in the app. All "Ollie interactions" are timer-driven nudges that open pre-built cards with structured input (yes/no, A/B/C, scale).

Every cool-down Bookend completion writes an entry to the Journal so each cohort member can scroll their day's activity (see §6.2).

Per the May 6 lock, every captured data point carries a **V-tag signature** (V1/V2/V3/V4) — the same content can route to multiple V-streams. See BETA-VTAG-001 for the complete tag map.

---

## 2. The 13-Person Cohort (Updated)

| # | Name | Archetype |
|---|---|---|
| 1 | Val (Dr. Andrei) | Sedentary Executive (HQ-based, GLP-1) |
| 2 | Zakiy | Active Night-Shifter (high stress) |
| 3 | Nikita | Sedentary Day / Active Night |
| 4 | Costin | Traveling Strategist (high stress, GLP-1) |
| 5 | Victor | IT & Data Integration |
| 6 | Isaiah | Sedentary Day / Active Night (same as Nikita) |
| 7 | Grace | Methodical Achiever |
| 8 | Jennifer | Methodical Achiever |
| 9 | Madeline | Methodical Achiever |
| 10 | Pamela | Methodical Achiever |
| 11 | Donna | Methodical Achiever |
| 12 | Lana | Embodied Practitioner — **INTERNAL ONLY** |
| 13 | **Roychele Jones** | **Methodical Achiever (NEW)** |

**Methodical Achiever profile:** High agency, detail-driven, evidence-based. Will read forms carefully and answer thoroughly. Personality-led archetype — daily routine pattern TBD per person via intake.

**Embodied Practitioner profile:** Movement-led, body-aware, mindfulness anchor. Body-led FABs replace desk/screen anchors.

---

## 3. Scope — What We're NOT Building

These are explicitly cut from the 10-day sprint. They are parking-lotted for post-NYC.

- Contextual Bookends (Protected / Challenging / Vulnerable / Exciting / Routine variants with custom JSON)
- Voice recognition / voice analysis
- Conversational AI on Ollie's Space
- Memory Lane / Memory Snap auto-generation
- Typewriter pacing animation
- Accessibility controls (font size, slide speed)
- Life Flower FAB / dynamic FAB discovery
- Journal editing, export, filtering, multi-day scrolling
- Free-text analysis on nudge replies (banked but not parsed)

**Voice recording to CosmosDB is allowed but not required.** If it's a half-day add, do it. If it's more, skip.

---

## 4. Five Things Zakiy Needs From Val (Blockers)

Val delivers these by **Friday May 8, end of day.** Without them, May 17 production slips.

| # | Item | Status |
|---|---|---|
| 1 | Grit Engine formula (multiplier rules, 1.0–2.0x trigger conditions) | ✅ Delivered (BETA-FORMULA-001) |
| 2 | Effort Score formula: E = 0.40·F + 0.30·C + 0.30·LC | ✅ Delivered (BETA-FORMULA-001) |
| 3 | Mood scoring scale (input format, range, how it feeds V2) | ✅ Delivered (BETA-FORMULA-001) |
| 4 | The 130 FABs for the cohort (10 per person × 13 people) | ✅ Delivered (BETA-FAB-COHORT-001 v5) |
| 5 | V1/V2/V3/V4 mapping for this beta | ✅ Delivered (BETA-VTAG-001) |

---

## 5. Data Collection Stack — Three Channels

| Channel | When | Format | Owner |
|---|---|---|---|
| **Day 1 Baseline JotForm** | May 11 (one-time, 2 sittings) | ~7 min | Val sends, cohort fills |
| **AM Daily JotForm** | Each morning, May 7–17 | ~2 min × 10 | Auto-fired from Zakiy's campaigns |
| **Mid-Day Text Nudges** | 10 AM / 1 PM / 3:30 PM, May 7–17 | ~30 sec × 10 days | Auto-fired from Zakiy's campaigns |
| **PM Daily JotForm** | Each evening, May 7–17 | ~3 min × 10 | Auto-fired from Zakiy's campaigns |

**Total cohort burden across 10 days:** ~57 min daily forms + ~5 min nudges = ~62 min per person.

---

## 6. The Routine Bookshelf — Architecture

### 6.1 Time Segment Codes

| Segment | Codes | Color Logic |
|---|---|---|
| Morning | AM1, AM2, AM3 | Green when complete, Orange when missed |
| Bar: Morning → Midday | A1, A2, A3, A4 | FAB placement zone |
| Midday | Mid1, Mid2, Mid3 | Green when complete, Orange when missed |
| Bar: Midday → Evening | B1, B2, B3, B4 | FAB placement zone |
| Evening | PM1, PM2, PM3 | Green when complete, Orange when missed |

### 6.2 Bookend Pair (warm-up + cool-down)

| Trigger | Action | Color State |
|---|---|---|
| FAB scheduled time arrives | Warm-up Bookend card pops (mood + space tap) | Blue |
| User taps chat → card opens | Card renders on Rhythm Board | (interaction state) |
| User responds within window | Cool-down card pops (Yes/No/Skip + mood-after) | Green |
| No response within window | Bookshelf segment flips to missed | Orange |
| Critical FAB missed (e.g., GLP-1) | Segment flips Red | Red |

See BETA-BOOKEND-001 for full Bookend interaction spec.

### 6.3 Journal Log Integration

Every cool-down completion writes a single entry to the Journal so the cohort sees their day at a glance.

### 6.4 Mid-Day Text Nudge System

Three nudges per day, sent via SMS/iMessage/WhatsApp through Zakiy's web app campaign feature.

| Time | Nudge | Format |
|---|---|---|
| 10 AM | FAB Check (Protein • Hydration • Movement) | Y/N × 3 |
| 1 PM | Productivity & Mood Check | Y/N + 1–5 + Y/N |
| 3:30 PM | Lunch & Hunger Check | Y/N + 1–10 |

**Critical loop closure:** AM JotForm Q5 (productivity prediction) connects to 1 PM Nudge Q1 (on-track check).

### 6.5 V1–V4 Sub-JSON V-Tag Architecture

Per the May 6 Bookend Digital Signature lock, every captured data point carries a V-tag array. See BETA-VTAG-001.

### 6.6 Campaigns Feature (Web App Delivery)

Zakiy's existing campaigns feature handles all auto-firing — select cohort, set 10-day window, schedule JotForms + nudges per cohort member's local time.

---

## 7. The 30-Day Synthetic Backfill

Day Zero shows historical trend so the app feels lived-in.

**Pipeline:**
1. Cohort completes Day 1 Baseline + 90-day intake
2. Val runs each response through Claude with a synthetic-profile prompt
3. Claude generates 30 days of plausible prior routine data per user — all tagged `synthetic: true`
4. Data lands in CosmosDB before user logs in for the first time
5. When user opens the app, ~30 days of history already plotted

---

## 8. End-of-Day Reporting

**Owner:** Zakiy runs the report nightly. Delivered to cohort the next morning.

**Day 11 special report (May 18):** Zakiy → Val full 30-day-trend update covering all 13 cohort members. This is the deliverable that lets Val plan Belgrade pitch (May 27).

---

## 9. Wearable Status

| Person | Device | Status |
|---|---|---|
| Val (Dr. Andrei) | Oura Ring + Polar | ⚠️ **Charger needed — Val to procure** |
| Zakiy | Oura Ring + Polar | ✅ Active |
| Nikita | TBD | Pending — confirm by May 8 |
| Victor | TBD | Pending — confirm by May 8 |
| Costin | TBD | Pending — confirm by May 8 |
| Isaiah | TBD | Pending — confirm by May 8 |
| Grace | TBD | Pending — confirm by May 8 |
| Jennifer | TBD | Pending — confirm by May 8 |
| Madeline | TBD | Pending — confirm by May 8 |
| Pamela | TBD | Pending — confirm by May 8 |
| Donna | TBD | Pending — confirm by May 8 |
| Lana | TBD | Pending — confirm by May 8 |
| **Roychele Jones** | **TBD** | **Pending — confirm by May 8** |

---

## 10. Production Timeline

| Date | Owner | Milestone |
|---|---|---|
| Wed May 6 (today) | Val + Zakiy | Spec v4 + Cohort FABs v5 + Roychele packets delivered |
| Thu May 7 | Zakiy | Campaign launches — AM JotForm + 3 nudges + PM JotForm fire for all 13 |
| Fri May 8 | Val | Wearable + GLP-1 + channel + time-zone confirmations |
| Sat May 9 – Sun May 10 | Zakiy | Routine Bookshelf + Bookend coding |
| Mon May 11 | Val | 90-Day Intake + Day 1 Baseline JotForm sent to all 13 |
| Tue May 12 – Wed May 13 | Both | Routines populated, synthetic backfill loaded |
| Thu May 14 – Fri May 16 | Both | Internal walkthrough, fix breaks, monitor live data |
| Sat May 17 | — | **Day 11 — full cohort embarked, devices flowing data** |
| Sun May 18 | Zakiy → Val | **30-day-trend update report (13 cohort)** |
| Mon May 19 – Mon May 26 | All | Continued live data, NYC pitch deck prep |
| Tue May 27 | Val | **Flight to Belgrade** |
| Late June | — | Agentic AI integration begins |
| Jun 27–28 | — | Biohackers World NYC launch |

---

## 11. Open Questions for Val

1. **Val's Oura Ring charger** — procurement blocker, needs resolution before May 7 ideally
2. **Wearable per cohort member** — confirm what each of the 13 is wearing by May 8
3. **GLP-1 status for new cohort members** (including Roychele) — adds critical FAB if applicable
4. **Pamela's role overlap** — she runs D0 sessions; how do we handle her dual role as cohort member AND staff?
5. **Channel preference per cohort member** — SMS / iMessage / WhatsApp / Email for nudges
6. **Time-zone handling** — confirm all 13 in same zone for May 7–17, or stagger nudge times
7. **End-of-day reports during Belgrade trip (May 27+)** — Zakiy alone or backup support?
8. **Journal entry render order** — chronological ascending (recommend) or reverse?

---

## 12. Standing Rules (Canon Applied to Beta)

- Row 1 Tile 1 = **R&R (Readiness & Recovery)**
- **51/49 Architecture** — human authority on all judgment calls during beta
- Beta uses simplified canon — not full FAB / QMQN / PQIS / ITB canon
- All data writes to **CosmosDB** — Fortress architecture
- Synthetic data tagged as synthetic
- Header / footer / branding per **Document Canon v2**
- V-tag every captured data point per BETA-VTAG-001
- Lana data = `internal_only: true` flag — never surfaced to PROFEX channel

---

## 13. Linked Documents

| Document | ID | Version |
|---|---|---|
| Cohort FABs (consolidated) | BETA-FAB-COHORT-001 | v5 (130 FABs across 13 cohort) |
| Universal Bookend | BETA-BOOKEND-001 | — |
| Day 1 Baseline JotForm | BETA-JF-BASELINE-001 | v2 |
| AM Daily JotForm | BETA-JF-AM-001 | v2 (with productivity prediction) |
| PM Daily JotForm | BETA-JF-PM-001 | v2 |
| Mid-Day Nudges | BETA-NUDGE-001 | v1 |
| V-Tag Mapping | BETA-VTAG-001 | v1 |
| Formula Spec | BETA-FORMULA-001 | v1 |
| 90-Day Profile Intake | BETA-INTAKE-001 | v0.2 |
| Cohort JotForm Packets | BETA-JF-COHORT-001 | 13 per-person packets |
| Cohort Roster Copy-Paste | BETA-COHORT-ROSTER-001 | v2 (13 cohort) |
| Zakiy Handoff | BETA-HANDOFF-001 | v2 |

---

*BariAccess LLC — Confidential — Internal Use Only*
*Copyright © 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
