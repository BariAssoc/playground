---
**BariAccess LLC**
**Document:** ITB-ZBOUND™ Act 2 — Full Layer Induction (Weeks 1–72)
**Version:** v0.1 DRAFT
**Author:** Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
**Date:** April 20, 2026
**Classification:** Confidential — Internal Use Only
---

# ITB-ZBOUND™ — ACT 2: FULL LAYER INDUCTION (WEEKS 1–72)

**Block ID:** ITB-ZBOUND Full Layer — Induction Phase
**Patient Case Anchor:** Mark — enrolled at week 0 with external MD's Rx for Zepbound 2.5 mg → titration schedule through 15 mg
**Credit Label:** CPIE (no parking, no shortcuts in escalation)
**Governance:** External prescriber authority for all dose decisions; BariAccess as wellness consultant and monitoring infrastructure
**Master Barista:** Pamela
**Baseline HbA1c:** 6.2% (confirmed)
**Biometric Cadence:** InBody every 8 weeks
**Capture Venue:** Local BBS station (Mark has access)

---

## §1 — WHAT ACT 2 IS

Act 1 (Light Layer) teaches. Act 2 (Full Layer Induction) **deploys** — but only after three gates have closed:

| Gate | Requirement |
|---|---|
| **Education Gate** | Mark has completed Light Layer modules and passed PQIS quiz at ≥80% |
| **Prescription Gate** | Mark's external physician has written an active Zepbound Rx, visible to BariAccess as a documented artifact (not an order we issue) |
| **Consent Gate** | Mark has signed the Full Layer consent acknowledging BariAccess is not his prescriber, does not renew, does not adjust dose, and operates as wellness consultant only |

Once all three close, the Full Layer activates. The Light Layer does not disappear — it continues running in parallel, always on, always available.

---

## §2 — DAY 0 EMBARKMENT

Day 0 is the most architecturally dense moment of the entire block. Everything the monitoring infrastructure will rely on for 72 weeks must be captured here.

**What happens at Day 0 — in order:**

1. **Baseline biometric capture at Mark's local BBS station:**
   - Weight: 235 lb
   - Height: 5′8″
   - BMI: 35.7 — Class II obesity
   - InBody body composition: skeletal muscle mass, body fat %, visceral fat area, segmental analysis
   - Grip strength (HGS) — muscle quality baseline
   - Resting vitals: BP, HR, SpO₂
2. **Baseline labs** (ordered by external MD, results piped to BariAccess via Health Gorilla):
   - Comprehensive metabolic panel
   - Lipid panel
   - **HbA1c baseline: 6.2%** (prediabetic range per ADA criteria)
   - TSH and free T4 (baseline thyroid)
   - Fasting insulin and C-peptide
   - hs-CRP, uric acid, homocysteine
3. **Wearable pairing** — Oura Ring Gen 4 + WHOOP MG (standard Phase 1 stack) + Garmin Index Sleep Monitor
4. **FAB activation** — six FABs instantiated for Mark (details in §7)
5. **V-stream initialization** — V1, V2, V3, V4 channels open; baseline values stored in CosmosDB Fortress
6. **Ollie handshake** — Ollie greets Mark by name, references his specific case, confirms the wellness-consultant framing in natural conversation
7. **First injection — Week 1 prep** — Pamela demonstrates injection technique to Mark at the BBS station. Injection day is assigned: **Friday** (Mark's choice, becomes his Weekly-Injection-Day FAB anchor)

**Document artifacts generated at Day 0:**

- ITB-ZBOUND Full Layer Enrollment Record (CPIE)
- External MD Prescription Artifact (screenshot or pharmacy record)
- Consent and Wellness-Consultant Disclaimer (signed)
- Baseline V1–V4 snapshot
- Mark's Dynamic Profile entry

---

## §3 — MARK'S 10 BIRTH FIELDS (POPULATED)

Per CCO-ITB-001 v1.0 §5, every Full Layer ITB must be instantiated with all 10 fields filled for the specific patient. Mark's instance:

| # | Field | Mark's Value |
|---|---|---|
| 1 | Credit Label | CPIE |
| 2 | Light Layer | Active from Day 0 (persists throughout Act 2) |
| 3 | Full Layer Authorization | External MD Rx verified + Mark's signed consent |
| 4 | Compliance Disclaimer | Wellness-consultant variant (BariAccess is not prescriber); HIPAA notice active; emergency instructions displayed |
| 5 | Escalation Rules | Ollie → Max → Pamela (Master Barista) → External MD (CPIE full chain, no shortcuts) |
| 6 | Parking Eligibility | Not eligible (CPIE) |
| 7 | FABs Connected | Weekly-Injection-Day, Protein-First, Hydration, Muscle-Guard, GI-Symptom-Log, Guardian-FAB (medication adherence) |
| 8 | V-Streams | V1 + V2 + V3 + V4 — all four feeding A5 ITB state engine |
| 9 | Phase Structure | Assessment (Day 0 → Week 4) → Intervention (Week 5 → 52) → Monitoring (Week 53 → 72) → Transition gate to Act 3 maintenance |
| 10 | Build Phase | Phase 1 — flagship CPIE block |

---

## §4 — THE INDUCTION ARC — SIX DOSE PHASES

Mark's 18 months (72 weeks) broken into the six dose-titration phases that the FDA label defines.

| Phase | Weeks | Dose | Primary Objective | Dominant FAB | Expected TBWL (cumulative) |
|---|---|---|---|---|---|
| P1 — Adaptation | 1–4 | 2.5 mg | Tolerance, education reinforcement, injection technique locked | Weekly-Injection-Day | 0–2% |
| P2 — First Therapeutic | 5–8 | 5.0 mg | First real weight signal, GI-symptom surveillance peaks | Hydration + GI-Symptom-Log | 3–6% |
| P3 — Step Up | 9–12 | 7.5 mg | Metabolic inflection (HbA1c, insulin sensitivity start shifting) | Protein-First becomes primary | 7–10% |
| P4 — Maintenance Option | 13–16 | 10.0 mg | First dose where Mark and his MD could choose to hold (Mark chose to escalate) | Muscle-Guard activates as primary | 11–15% |
| P5 — Step Up | 17–20 | 12.5 mg | Continued active loss; wearable/sleep trends begin to improve | Muscle-Guard + Protein-First | 16–20% |
| P6 — Maximum Dose | 21–72 | 15.0 mg | Sustained loss phase — slowest but longest stretch; goal approach | All FABs; Guardian-FAB dominant | 21–34.5% (final 34.5% at week 72) |

**Clinical note embedded in the block:** The percentages above are expected ranges from SURMOUNT-1 averages. Mark is a high-responder (final 34.5% TBWL versus SURMOUNT mean ~22.5% at 15 mg). This is flagged in his Dynamic Profile as the reason the Muscle-Guard FAB runs at elevated sensitivity throughout — a patient losing faster than average loses lean mass faster too, unless protocol compensates.

**InBody measurement cadence:** Every 8 weeks at the BBS station. This means Mark will have approximately 9 InBody re-measurements during the 72-week induction (weeks 8, 16, 24, 32, 40, 48, 56, 64, 72) plus his Day 0 baseline.

---

## §5 — KEY SCENES, WEEK BY WEEK

These are the moments when the architecture proves itself. Each scene is annotated with which layer fires, what data is captured, and whether escalation is triggered.

### Scene 1 — Week 1, Friday (First Injection Day)

Mark injects Zepbound 2.5 mg at 7:02 AM in his abdomen. Oura captures a normal night of sleep. Within 15 seconds of the injection, Mark taps "INJECTED" in the BariAccess app.

- **V4 capture:** Injection event logged with timestamp, dose, site, patient confirmation
- **Weekly-Injection-Day FAB:** Birth event. Friday at ~7 AM becomes his anchor. FAB begins learning his pattern.
- **Ollie action:** Sends a warm confirmation message within 30 seconds. Reminds Mark of hydration target for today. Asks about any symptoms so far (none expected yet).
- **No escalation. No credits yet** — CPIE credits start accruing when adherence crosses 72 hours of tracked behavior.

### Scene 2 — Week 3, Tuesday (First GI Pre-Signal)

Mark reports mild nausea for the second day in a row. Hydration is 1.8 L — below his 2.5 L rolling baseline. Resting HR up 4 bpm.

- **V1 capture:** HR elevation, hydration deficit
- **V2 capture:** GI-Symptom-Log entry (nausea × 2 days)
- **V3 capture:** Context — Mark traveled for work Sunday; sleep disrupted
- **A5 ITB engine reads:** Pre-signal in Hydration + GI-Symptom domains. Not a signal yet (single domain, 72-hour window). No clinical intersection.
- **Ollie action:** Gentle nudge. "Hey Mark — your fluid's a bit low the last two days and you mentioned some nausea. Can we get 500 mL of water in the next hour and log how you feel? Also want me to queue a Light Layer refresher on hydration management while we're at it?"
- **No Max escalation. No Pamela contact. No external MD.**
- **CCIE credit awarded** for engaging with the nudge (Light Layer reinforcement during Full Layer phase).

### Scene 3 — Week 8, Thursday (First InBody Re-Measurement at 8-Week Cadence)

Mark visits his local BBS station for his scheduled 8-week body composition check.

- **V1 capture:** Weight 221 lb (−14 lb, 6.0% TBWL), skeletal muscle mass −1.8 lb (preserved at 95% of baseline), body fat −11.2 lb
- **Muscle-Guard FAB reads:** Lean mass loss ratio = 13% of total loss — well below 25% SURMOUNT average. Green.
- **Protein-First FAB reads:** 7-day average protein intake 82 g/day, slightly below 1.2 g/kg target (Mark currently 221 lb = 100 kg → target 120 g). Yellow — nudge.
- **Ollie action:** Celebrates the body composition result (lean preserved, fat down). Then pivots to protein: "Your muscle's holding great — here's how we keep it that way. Your protein's running a bit light. Want to talk about bumping to 100+ grams? I can walk you through it."
- **Pamela (Master Barista) notified** (not escalated — informed, per CCIE low-priority pattern). Pamela sends Mark a quick video walk-through on adding a second daily whey shake.
- **CPIE credit awarded** for completing scheduled biometric check.

### Scene 4 — Week 12 (First HbA1c Follow-Up)

Mark's external MD orders a 3-month HbA1c. Result: **5.9%** — down from 6.2% baseline.

- **V1 capture:** HbA1c trajectory entered
- **A5 ITB engine reads:** Metabolic parameter improving as expected. No pre-signal.
- **Ollie action:** Shares the result with Mark in plain language. Connects it to the SURMOUNT-1 evidence from Light Layer Part 7. Reinforces the "this is what we expected, and it's working" message. Offers Mark an optional Light Layer module on beta-cell function recovery.
- **Max action:** Silent — no human escalation needed. Max notes the trajectory in Mark's Dynamic Profile as a positive metabolic indicator.
- **No Pamela contact. No external MD contact.** The result was MD-ordered; MD sees it in their EMR independently.

### Scene 5 — Week 24 (Reaching 15 mg)

Mark's first injection at max dose. He's now lost 18% of starting weight (~42 lb, down to 193 lb). This is also his Week 24 InBody measurement at the BBS station — third 8-week cadence check.

- **V4 capture:** Dose transition event logged; this is a Phase 6 entry marker.
- **V1 capture:** InBody at Week 24 — lean mass retention holding at 92% of baseline. Muscle-Guard green.
- **Ollie action:** Frames this as a milestone. Reminds Mark that the highest dose means GI symptoms may flare again (dose-dependent per SURMOUNT data). Prepares Mark for the possibility.
- **Pamela check-in scheduled** — video call for the following week, optional. CPIE credit for attending.

### Scene 6 — Week 36 (Halfway Point — Barista Quarterly Review)

Pamela leads a 30-minute video review with Mark. Covers: weight trajectory, body composition trend (now four 8-week InBody data points), protein adherence, sleep, HRV, F.A.C.T.S. behavioral score, and next-quarter planning.

- **All four V-streams** summarized in Mark's review dashboard.
- **FAB performance** — each active FAB's adherence ratio reported.
- **Mark's reported wellbeing** — captured as patient-voice qualitative data into V3.
- **No clinical decisions** — Pamela is the wellness consultant. All medical decisions remain with external MD. Review summary is exported and offered to Mark's MD as an optional artifact for his records.

### Scene 7 — Week 52 (One-Year External MD Visit)

Mark sees his external physician for the one-year follow-up. Weight 172 lb (−63 lb, 26.8%). HbA1c 5.8%. All labs normal.

- **BariAccess artifact delivered to MD** (with Mark's consent): One-year BariAccess wellness summary — 10 pages, structured format, V1 biometric trends (including seven 8-week InBody data points), V2 behavioral adherence, V3 context log, V4 ITB adherence chart.
- **MD decision:** Continue at 15 mg weekly. No dose change.
- **Mark's Dynamic Profile updated** with the visit outcome. No BariAccess-side action triggered — the decision sits with MD.

### Scene 8 — Week 72 (Induction Goal Reached)

Mark weighs 154 lb. Down 81 lb from baseline. **34.5% total body weight loss achieved.** HbA1c 5.8%. All biometrics normal. Final Week 72 InBody at BBS station confirms lean mass retention: 78% of original skeletal muscle mass preserved (versus SURMOUNT average ~74%) — a meaningful win, attributable to sustained protein adherence across all nine 8-week measurements.

- **V4 event:** Induction Phase completion flag set
- **A5 ITB engine:** Moves Mark from Intervention state → Monitoring state → Transition Gate to Act 3 (Maintenance / Spacing)
- **Ollie action:** Celebrates the milestone genuinely. Introduces Act 3 concepts at Light Layer level — interval extension, hunger logging, what the evidence says, what the options are. Does NOT recommend the extension — Mark and his MD will decide that.
- **Pamela scheduled** for a 60-minute Maintenance Planning session — framing the options, preparing Mark to have the conversation with his external MD.
- **BariAccess does not propose interval extension.** It becomes Mark's choice, MD-authorized, BariAccess-monitored — which is exactly where Act 3 picks up.

---

## §6 — DATA FLOWS: V1 – V4 DURING INDUCTION

| Stream | What it captures during Act 2 | Primary sources |
|---|---|---|
| V1 — Biometric | Weight, InBody body composition (every 8 weeks), labs (HbA1c, CMP, lipids, insulin), vitals (BP, HR), wearable data (HRV, sleep, activity, SpO₂), grip strength | BBS station, Oura, WHOOP, Garmin, Health Gorilla lab feed, InBody |
| V2 — Behavioral | FAB adherence ratios, F.A.C.T.S. score, protein intake log, hydration log, injection adherence, GI-symptom self-report, Light Layer engagement events | BariAccess app, QMQN (Jotforms in WOZ phase), PQIS quiz completions |
| V3 — Contextual | Travel events, social events, sleep disruption, work stress flags, environmental change (moved, season change), emotional state tags | Calendar integration, Ollie conversational capture, Aurora Effect™ context tagging |
| V4 — Interventional | Dose-day events, ITB Full adherence state, Program start/complete events, Escape-to-Light events (none in Mark's case), prescription renewal events | ITB-ZBOUND state machine, external MD artifacts, Program Canon engine |

All four streams feed the A5 ITB State Engine. A5 produces the ITB status signal that Beacon ingests.

---

## §7 — ACTIVE FAB INVENTORY (MARK'S INSTANCE)

| FAB | Purpose | Trigger | Frequency | Data Source |
|---|---|---|---|---|
| Weekly-Injection-Day | Anchor the injection event; surveil for missed doses | Friday AM + patient confirmation tap | Weekly | V4 + patient self-report |
| Protein-First | Maintain ≥1.2 g/kg daily intake; leucine-loaded first meal of day | Meal tag events; rolling 7-day average | Daily (passive) + mealtime prompt | V2 |
| Hydration | Maintain 2.5–3 L daily fluid; flag deficit patterns | Rolling 24h below baseline | Continuous | V1 + V2 |
| Muscle-Guard | Detect lean mass loss >20% of total weight change | Post-InBody measurement (every 8 weeks) | Every 8 weeks | V1 (InBody) |
| GI-Symptom-Log | Capture nausea, vomiting, diarrhea frequency; correlate to dose and hydration | Patient-initiated entry | Event-driven | V2 |
| Guardian-FAB | Medication adherence surveillance (CPIE overlay on Weekly-Injection-Day) | Missed dose >24h past scheduled | Weekly | V4 |

---

## §8 — ESCALATION PATHWAY (CPIE, NO SHORTCUTS)

The CPIE rule from ITB Canon §13: **Ollie → Max → Pamela (Master Barista) → External MD. Always. No skipping steps.**

For Mark, through 72 weeks, the escalation ladder was invoked zero times at the external-MD level — meaning BariAccess caught everything at the Ollie or Max layer. This is the infrastructure working as designed.

**Example triggers that would escalate Mark to external MD (none fired in his case, included for canon completeness):**

| Trigger | Escalation Level |
|---|---|
| Missed dose ≥14 days (Guardian-FAB red) | Pamela → MD notification |
| Weight loss >3 lb in 7 days sustained (dehydration/AKI risk) | Pamela → MD urgent |
| Lean mass loss >30% of total weight change on 8-week InBody | Pamela → MD consult |
| HbA1c rising >0.4% in 3 months despite adherence | Pamela → MD consult |
| Persistent GI symptoms >14 days unrelieved | Pamela → MD for dose review |
| Patient reports suspected pancreatitis / gallbladder / thyroid symptoms | Immediate 911 + MD notification |

---

## §9 — CPIE CREDIT ARCHITECTURE DURING INDUCTION

Credits accrue in two parallel tracks during Act 2:

**Track 1 — Full Layer CPIE credits (primary):**

- Each completed injection-day confirmation
- Each 8-week InBody check at BBS station
- Each HbA1c follow-up engagement
- Each Pamela quarterly review attended
- Each Program completion (Learn → Intervene pair)
- Each clinical milestone (5%, 10%, 15%, 20%, 25%, 30% TBWL)

**Track 2 — Light Layer CCIE credits (parallel, continues during Full):**

- Each Light Layer module engagement
- Each PQIS mini-quiz passed
- Each Ollie nudge acted upon
- Each education module completion

**Credit totals projected for Mark at Week 72 (estimated from architecture):**

- CPIE credits: ~180–220 events
- CCIE credits: ~350–450 events

These credits are spendable across the BariAccess merchant ecosystem. For Mark specifically, this is the mechanism that funds his eventual cross-merchant purchases in Act 3 (wellness services, Lopesan experiences, PROFEX sessions, etc.).

---

## §10 — WEEK 72 TRANSITION GATE → ACT 3

Week 72 is not the end — it's a state change. Full Layer Induction completes and Mark enters the Transition Gate where his case ISE state shifts from Intervention → Monitoring.

**Gate requirements to enter Act 3:**

| Requirement | Mark's Status at Week 72 |
|---|---|
| Weight stability ≥4 months at goal | ✅ 154–155 lb × 4 months at 15 mg weekly |
| Lean mass retention ≥70% | ✅ 78% preserved |
| Labs within individual baseline | ✅ All normal |
| Adherence ≥80% across all FABs | ✅ |
| External MD authorization for Act 3 options | 🟡 Pending — to be initiated in first Act 3 scene |
| Patient consent for Act 3 protocol | 🟡 Pending |
| PQIS Act 3 quiz passed | 🟡 Pending |

Act 3 picks up with the prescriber offering the choice Mark's physician offered him: reduce dose or extend interval. Mark chose interval. That's where Act 3 begins — and where the BariAccess innovation (the 10 → 14-day spacing protocol with hunger logging) plays out.

---

## DOCUMENT METADATA

| Attribute | Value |
|---|---|
| Document ID | ITB-ZBOUND Act 2 — Full Layer Induction |
| Version | v0.1 DRAFT |
| Parent Canon | CCO-ITB-001 v1.0 DRAFT; Program Canon v2 DRAFT |
| Header Entity | BariAccess LLC |
| Author | Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC |
| Date | April 20, 2026 |
| Mark's Baseline HbA1c | 6.2% (confirmed) |
| InBody Cadence | Every 8 weeks at local BBS station |
| Master Barista | Pamela |
| Scene Count | 8 narrative scenes as approved |
| Hallucinations | None — every architectural claim grounded in ITB Canon v1.0 and Program Canon v2 |
| Next Layer | Act 3 (Full Layer — Maintenance / Spacing) — in drafting |

---

**Copyright © 2026 BariAccess LLC. All rights reserved.**
**ITB-ZBOUND™, BariAccess™, PQIS, CCIE, CPIE, and F.A.C.T.S. are trademarks of BariAccess LLC.**
**Confidential — Internal Use Only. Not for external distribution without written authorization from the President of BariAccess LLC.**
