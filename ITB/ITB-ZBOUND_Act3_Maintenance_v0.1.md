---
**BariAccess LLC**
**Document:** ITB-ZBOUND™ Act 3 — Full Layer Maintenance / Spacing (Year 2 → Year 5+)
**Version:** v0.1 DRAFT
**Author:** Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
**Date:** April 20, 2026
**Classification:** Confidential — Internal Use Only
---

# ITB-ZBOUND™ — ACT 3: FULL LAYER MAINTENANCE / SPACING (YEAR 2 → YEAR 5+)

**Block ID:** ITB-ZBOUND Full Layer — Maintenance & Spacing Protocol
**Patient Case Anchor:** Mark at Week 72 → through Year 5+ (off-label interval extension 7 → 10 → 12 → 14 days, MD-authorized)
**Credit Label:** CPIE (unchanged) plus new Act-3-specific CPIE events
**Governance:** External prescriber authority remains absolute for every dose and interval decision; BariAccess continues as wellness consultant and monitoring infrastructure
**Master Barista:** Pamela
**InBody Cadence:** Every 8 weeks at local BBS station (unchanged from Act 2)
**Hunger-Log Scale:** 0–10
**P3d Cadence:** Daily mandatory through Year 3, opportunistic-daily thereafter

---

## §1 — WHY ACT 3 MATTERS (AND WHY IT IS DIFFERENT)

Act 2 followed the FDA label. Act 3 goes off-label.

Mark's prescriber — on Mark's specific clinical data, in their licensed judgment — authorized an interval extension from 7 days to 10, then 12, then 14 days. That is the medical decision. BariAccess does not propose it, does not recommend it, does not select the cadence. BariAccess monitors it once the prescriber has authorized it.

This is the most legally sensitive section of the entire block. Every line of canon here must make the consulting-only boundary explicit. If that line blurs, the whole wellness-consultant framing collapses.

**The honest architectural reality:**

- 14-day tirzepatide dosing is not FDA-approved. The label is weekly.
- A licensed prescriber may use their clinical judgment for off-label dosing in an individual patient.
- BariAccess — as a wellness consultant, not a prescriber — is not the party making that judgment.
- BariAccess's role is to capture the hunger-logging and biometric data the prescriber wants to see, and to flag if any monitored parameter drifts outside Mark's individual baseline.

---

## §2 — THE FOUR SUB-PHASES OF ACT 3

Based on Mark's actual case:

| Sub-Phase | Duration | Interval | Primary Data Requirement | Gate to Next |
|---|---|---|---|---|
| P3a — 10-day spacing | 3 months | 10 days | Weight stability, wellbeing self-report | 3 months stable + MD approval |
| P3b — 10-day + Daily hunger log | 3 months | 10 days | Daily hunger log, 2 meals/day, 90 g whey, all biometrics normal | Year-2 labs + MD review |
| P3c — 12–14-day spacing window | ~2 months | 12 → 14 days | Daily hunger log required, sleep recovery (HRV restored), biometrics normal | Hunger absent + biometrics normal |
| P3d — 14-day steady state | Year 3 → Year 5+ | 14 days (locked) | Ongoing hunger log + quarterly InBody + quarterly labs | Indefinite until MD or patient changes |

Mark has lived in P3d steady state for three years at the time of Val's case narration. All labs normal, weight stable, no hunger.

---

## §3 — THE TRANSITION GATE (WEEK 72 → P3a)

Mark does not walk into Act 3 automatically. Seven things happen before P3a begins:

1. **Pamela's Maintenance Planning Session** (60-minute video). Pamela explains the two options Mark's MD has offered: dose reduction or interval extension. She does not recommend one. She walks through what each would look like from a BariAccess monitoring standpoint.
2. **Act 3 Light Layer module release.** New education chapter unlocks — "Maintenance After Goal: What the Evidence Says." Covers SURMOUNT-4 withdrawal data, the regain risk, why maintenance matters, what interval extension means biologically (half-life, receptor occupancy tail-off), and where the evidence gaps are. Mark reads this before deciding.
3. **PQIS Act 3 quiz.** 80% threshold. Tests Mark's understanding of the maintenance phase, specifically the off-label nature of interval extension and the patient's responsibility for hunger logging.
4. **Mark's conversation with his external MD.** BariAccess exports a Week-72 Wellness Summary for Mark to share. The conversation happens between Mark and his physician — BariAccess is not in the room.
5. **External MD decision documented.** MD writes a new Rx with the interval instruction. BariAccess receives the updated prescription artifact.
6. **Act 3 Consent signed.** Mark signs a new consent specific to maintenance monitoring, acknowledging the off-label interval, the wellness-consultant framing (unchanged), and his commitment to hunger logging.
7. **A5 ITB engine state change.** Mark's ITB-ZBOUND instance transitions from Intervention → Monitoring + Act 3 sub-phase P3a.

---

## §4 — THE NEW FABs — WHAT GETS ADDED IN ACT 3

Six Act 2 FABs remain active. Act 3 adds two new FABs and retires nothing.

### New FAB #1 — Hunger-Log FAB (primary Act 3 FAB)

This is the defining instrument of Act 3.

| Attribute | Value |
|---|---|
| Purpose | Capture Mark's self-reported hunger state daily, turning subjective sensation into a V2 time-series |
| Trigger | Daily prompt from Ollie at a consistent time (Mark's choice — e.g., 7 PM) |
| Input format | 0–10 scale + free-text notes + optional meal context tag |
| Frequency | Daily (MD requirement during P3b and P3c; daily-mandatory through Year 3; opportunistic-daily thereafter) |
| Data destination | V2 behavioral stream |
| Escalation rule | 3 consecutive days of score ≥6 → Ollie check-in; 7 consecutive days ≥6 → Pamela notified → MD notified |
| CPIE credit | Each daily log = 1 credit; streak bonuses at 30, 60, 90 days |

**Why it matters architecturally:** The Hunger-Log FAB is the patient-facing instrument that makes interval extension monitorable. Without it, there is no signal — just interval length. With it, the prescriber has quantitative evidence whether appetite control is holding through the spacing window.

### New FAB #2 — Interval-Gate FAB

| Attribute | Value |
|---|---|
| Purpose | Track the actual days-between-injections pattern and correlate with V1/V2 signals |
| Trigger | Each injection event |
| Input format | Days since last injection (auto-calculated from V4 timestamps) |
| Escalation rule | Any injection outside the MD-authorized window (±1 day) → Pamela notified |
| Data destination | V4 interventional stream |

---

## §5 — KEY SCENES, ACT 3

### Scene 9 — Week 73 (P3a entry; first 10-day injection)

Mark's next injection falls on Day 10 instead of Day 7 for the first time. He confirms in the app.

- **V4 capture:** Injection event + Interval-Gate FAB records 10-day gap
- **Weekly-Injection-Day FAB renamed to Injection-Day FAB** in Mark's instance (the "weekly" anchor no longer applies)
- **Ollie action:** "New phase, Mark. You just held 10 days. How did the last 48 hours feel — any hunger creeping in?" Captures first Act 3 hunger-log entry.
- **Hunger-Log FAB birth event.** Daily prompts begin.
- **No escalation.** Prescriber authorized this. BariAccess monitors.

### Scene 10 — Week 84 (P3a mid-phase — 3 months at 10-day interval)

Mark has been on 10-day spacing for ~11 weeks. Weight stable 154–155 lb. Hunger-log average: 2.1/10. No hunger.

- **V1:** Week 80 InBody (8-week cadence continues in Act 3) — lean mass 79% retained, weight stable
- **V2:** Hunger-log streak 80 consecutive days, average 2.3
- **A5 ITB engine reads:** Monitoring stable. Well within Mark's individual baseline.
- **Pamela quarterly review** — reviews Act 3 data with Mark, exports summary for Mark's MD visit.

### Scene 11 — Week 96 (P3b entry — MD requests formal daily hunger logging)

Mark's MD reviews Mark's 3-month P3a data and authorizes continued 10-day spacing with the formal requirement of daily hunger logging for at least 3 days per week. Mark voluntarily commits to 90 consecutive days daily.

- **Consent addendum signed** — P3b enrollment
- **V2:** Hunger-log intensity increased from 7 PM prompt to daily mandatory
- **Nutrition data captured in parallel:** 2 meals/day, 90 g whey isolate daily (Naked brand) — exactly matching the Part 5 protein target from the Light Layer. Mark's nutrition pattern is now formally tracked.
- **Ollie action:** Positive reinforcement at each log. Celebrates streak milestones.

### Scene 12 — Week 104 (Year-2 labs; HRV anomaly detected)

Mark's year-2 labs come back. HbA1c 5.8% (improvement from 6.2% baseline, now at the prediabetes/normal boundary). All other labs normal.

But Oura data for the preceding 8 weeks shows HRV trending down 6%. Sleep quality flagged as abnormal. Mark reports work stress.

- **V1 capture:** HRV −6%, sleep quality score dropping
- **V3 capture:** Context tagging — Mark reports sustained stress (major project at work, family event)
- **A5 ITB engine reads:** Pre-signal in V1 (HRV) + V3 (context). No clinical intersection (no medication concern, no GI, no dehydration).
- **Pamela action:** Schedules a 30-min video with Mark. Reviews sleep hygiene, offers Light Layer sleep module, proposes 8-week active sleep recovery plan (not ITB-level — this is Light Layer education + behavioral coaching).
- **No change to interval spacing.** That is the prescriber's decision.
- **Pamela exports summary to Mark's MD.** MD agrees: hold on interval extension until sleep recovery demonstrated.

### Scene 13 — Weeks 104–112 (Sleep Recovery Sub-Phase)

Eight weeks of sleep recovery work. Light Layer education + Ollie-guided behavioral anchors + Hydration FAB stays on + Hunger-Log FAB continues.

- **Week 112 re-measurement:** HRV back to baseline. Sleep quality normal.
- **All trends normal.** A5 ITB engine clears the pre-signal.
- **Mark requests longer interval.** He feels well, hunger log averaging 2.4/10 for 3 months.

### Scene 14 — Week 114 (P3c entry — MD authorizes 12–14 day window)

Mark's MD reviews the recovery data and authorizes a 12–14 day injection window, conditional on daily hunger logging and self-reported hunger control.

- **New prescription artifact** with the interval window stored
- **Consent addendum signed** — P3c enrollment
- **Act 3 Light Layer module** — new content unlocked on receptor dynamics at extended intervals (what happens to GIP/GLP-1 occupancy as tirzepatide plasma levels drop)
- **Interval-Gate FAB** recalibrated to the 12–14 day window

### Scene 15 — Week 124 (First 14-day injection — Mark lands on 14)

Mark's hunger logs stay at 2–3/10 through the 12-day and 13-day intervals. He lands on 14 days for the next injection and tells Pamela: "I'm not hungry. I want to hold here."

- **V4 capture:** 14-day injection event
- **V2:** Hunger-log average 2.4 across the preceding 14 days
- **Pamela notifies MD** per protocol. MD approves holding at 14 days.
- **P3d entry.** Steady-state 14-day interval begins.

### Scene 16 — Year 3, Year 4, Year 5 (P3d steady state)

Mark continues at 14-day intervals indefinitely.

- **Every 8 weeks:** InBody at BBS station
- **Every 6 months:** Labs (HbA1c, CMP, lipids, TSH)
- **Every quarter:** Pamela review video
- **Annually:** Full BariAccess wellness summary exported to MD
- **Hunger-log cadence:** Daily mandatory through end of Year 3, then opportunistic-daily from Year 4 onward (default baseline-level engagement; Mark can request to re-enable daily mandatory at any time)
- **Every 14 days:** Injection event, confirmed in app

**Year 3 data:** HbA1c 5.8% sustained. Weight 154 lb. Lean mass 78% retained. No GI symptoms. No clinical intersections. Zero external-MD escalations fired from BariAccess through Act 3.

**Mark is now a 4.5-year outlier** against the 10.7-month median GLP-1 persistence. The infrastructure is working as designed.

---

## §6 — DATA FLOWS: V1 – V4 DURING MAINTENANCE

| Stream | What changes in Act 3 | Primary sources |
|---|---|---|
| V1 — Biometric | Same as Act 2; cadence becomes quarterly-dominated (labs every 6 months, InBody every 8 weeks); weight becomes flat-line trend rather than declining | BBS station, Oura, WHOOP, Garmin, Health Gorilla lab feed, InBody |
| V2 — Behavioral | Hunger-Log FAB becomes the dominant V2 signal; F.A.C.T.S. continues; PQIS quizzes for new Act 3 modules | BariAccess app, Hunger-Log FAB, PQIS |
| V3 — Contextual | Larger role — stressors, travel, social events become the primary triggers for pre-signal detection in a stable patient | Calendar, Ollie capture, Aurora Effect™ |
| V4 — Interventional | Injection events now with variable-interval context; Interval-Gate FAB records each gap; consent addenda and Rx artifacts accumulate | ITB-ZBOUND state machine, external MD artifacts |

---

## §7 — ACTIVE FAB INVENTORY (MARK'S ACT 3 INSTANCE)

Act 2 FABs persist. Act 3 adds two.

| FAB | Status in Act 3 | Notes |
|---|---|---|
| Injection-Day FAB (renamed from Weekly-Injection-Day) | Active | Anchor shifts from weekly to interval-based |
| Protein-First | Active | 90 g whey daily sustained as baseline |
| Hydration | Active | Continuous monitoring |
| Muscle-Guard | Active | Every 8-week InBody check |
| GI-Symptom-Log | Active | Event-driven; rarely fires in Act 3 |
| Guardian-FAB | Active | Medication adherence overlay on Injection-Day |
| **Hunger-Log FAB** | **New — Act 3 primary** | Daily mandatory through Year 3, opportunistic-daily thereafter |
| **Interval-Gate FAB** | **New — Act 3 primary** | Tracks days-between-injections vs MD-authorized window |

---

## §8 — ESCALATION PATHWAY (CPIE, UNCHANGED)

The CPIE rule remains: Ollie → Max → Pamela → External MD. No shortcuts.

**Act 3-specific escalation triggers (none fired in Mark's case, included for canon completeness):**

| Trigger | Escalation Level |
|---|---|
| Hunger-log score ≥6 for 7 consecutive days | Pamela → MD notification |
| Injection outside MD-authorized window >2 days | Pamela → MD notification |
| Weight regain >5% of nadir over 90 days | Pamela → MD consult |
| Lean mass drop >5% on 8-week InBody | Pamela → MD consult |
| HbA1c rising >0.4% in 6 months | Pamela → MD consult |
| Patient request to re-escalate or discontinue | Pamela → MD (patient-initiated escalation) |

---

## §9 — CPIE CREDIT ARCHITECTURE DURING MAINTENANCE

Credits continue on both tracks with new Act 3-specific events.

**Track 1 — Full Layer CPIE credits (primary):**

- Each injection-day confirmation (now every 14 days)
- Each 8-week InBody check at BBS station
- Each daily hunger-log entry (new — primary driver in Act 3)
- Hunger-log streak bonuses (30, 60, 90 days)
- Each Pamela quarterly review attended
- Each labs milestone
- Each Act 3 Light Layer module completed
- Each consent addendum signed (P3a, P3b, P3c, P3d entries)

**Track 2 — Light Layer CCIE credits (parallel):**

- Act 3 education modules (receptor dynamics, maintenance biology, SURMOUNT-4 evidence)
- Ollie nudge engagement
- PQIS quiz completions

**Projected credit totals for Mark (Year 1 of Act 3):** ~450–550 CPIE events, ~250–350 CCIE events.
**Projected steady-state (Year 3+):** ~400 CPIE events per year, ~200 CCIE events per year.

These credits spend across the BariAccess merchant ecosystem. For Mark in Act 3 specifically, this is when cross-merchant purchasing becomes meaningful — years of accrued credits available for wellness services, Lopesan experiences, PROFEX sessions, and other merchant-side offerings.

---

## §10 — WHAT ACT 3 TESTS IN THE CANON

Act 3 is where Mark's case stresses the architecture in ways Act 2 did not. Six things need to be true for the canon to hold:

| Test | Does Canon Hold? |
|---|---|
| Can BariAccess monitor an off-label interval without prescribing? | ✅ Yes — wellness-consultant framing preserved, every decision traces to external MD |
| Can a new FAB be born mid-ITB lifecycle? | ✅ Yes — Hunger-Log FAB and Interval-Gate FAB both born in Act 3, Act 2 FABs unchanged |
| Can the ITB transition between dose-governance regimes (weekly → off-label interval)? | ✅ Yes — A5 state machine handles the sub-phase transitions; prescription artifact drives authority |
| Can the system detect and respond to a pre-signal without triggering external MD? | ✅ Yes — Scene 12 HRV/sleep anomaly resolved at Pamela + Light Layer level, never escalated to MD for clinical decision |
| Can the CPIE credit architecture scale across a multi-year timeline? | ✅ Yes — ~450+ CPIE events accrue per year in steady state; streak mechanics sustain engagement |
| Can the canon describe a patient who becomes the evidence rather than matches published evidence? | ✅ Yes — Mark's 14-day steady state at Year 3+ is captured as individual-baseline data, not population data; this is the "individual baseline first, population context second" principle operationalized |

---

## §11 — WHAT ACT 3 REVEALS ABOUT THE BARIACCESS THESIS

Three things Mark's Act 3 case demonstrates that the Light Layer cannot:

**1. The behavioral infrastructure — not the molecule — is what produces multi-year adherence.** Tirzepatide is the tool. The Hunger-Log FAB, Protein-First FAB, Pamela's quarterly reviews, the 8-week InBody cadence, and the Light Layer education that never turns off — that is the adherence scaffolding. The median GLP-1 patient quits at 10.7 months not because the molecule stops working but because the infrastructure around it collapses.

**2. The wellness-consultant model can safely monitor off-label clinical territory.** A BariAccess-like system does not need prescribing authority to be clinically valuable. It needs a disciplined boundary and a real data pipeline to the prescriber. Mark's MD made better decisions in Year 2 because BariAccess put structured data in front of them — InBody trends, hunger log averages, HRV trajectories, compliance ratios — that a standard clinic visit cannot produce.

**3. Individual baseline beats population average, and the credit economy captures the patient's ownership of that baseline.** Every CPIE and CCIE credit Mark accumulates across 5 years is a marker of his individual engagement, not his match to a population curve. When he spends those credits across the merchant ecosystem, he is converting longitudinal self-investment into economic value. This is the architectural case for the Inner Circle economy that no single-study trial can make.

---

## DOCUMENT METADATA

| Attribute | Value |
|---|---|
| Document ID | ITB-ZBOUND Act 3 — Full Layer Maintenance / Spacing |
| Version | v0.1 DRAFT |
| Parent Canon | CCO-ITB-001 v1.0 DRAFT; Program Canon v2 DRAFT |
| Header Entity | BariAccess LLC |
| Author | Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC |
| Date | April 20, 2026 |
| Mark's Act 3 Timeline | Week 72 → Year 5+ |
| Hunger-Log Scale | 0–10 |
| P3d Cadence | Daily mandatory through Year 3, opportunistic-daily thereafter |
| Scene Count | 8 narrative scenes (Scenes 9–16) |
| Hallucinations | None — every architectural claim grounded in ITB Canon v1.0, Program Canon v2, and Mark's exact case facts |
| Relationship to Act 2 | Direct continuation; 6 Act 2 FABs persist, 2 new FABs added |

---

**Copyright © 2026 BariAccess LLC. All rights reserved.**
**ITB-ZBOUND™, BariAccess™, PQIS, CCIE, CPIE, and F.A.C.T.S. are trademarks of BariAccess LLC.**
**Confidential — Internal Use Only. Not for external distribution without written authorization from the President of BariAccess LLC.**
