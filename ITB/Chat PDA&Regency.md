CCO-V4-DATA-001
V4 Therapeutic Adherence Data Architecture
PDC + Recency + Pattern — Developer Implementation Guide
BariAccess™ — For Zakiy — Lead Developer
From: Valeriu Eugen Andrei, MD, FACS, FASMBS
Date: April 2026
Status: INTERNAL — Developer Eyes Only

WHAT THIS DOCUMENT IS
This document defines how the BariAccess platform collects, computes, and stores the three components of V4 — the Therapeutic Adherence domain score used in the TRAC™ formula. V4 is not a manually entered number. It is a computed score derived from three distinct data components. This document tells Zakiy exactly what to build, what data to collect, how to compute each component, and how to store everything in CosmosDB.

WHY V4 HAS THREE COMPONENTS
A single adherence number cannot tell the full clinical story. Three components are required.
PDC     = How much over time?
          The historical average.
          Are they taking most of their doses?

Recency = How long since last dose?
          The current gap.
          Is something happening right now?

Pattern = Is this getting worse?
          The trajectory.
          Is this a one-time event or
          a recurring problem?

Together they tell the full story.
Each one alone misses something.
All three together — nothing is missed.

PART 1 — PDC
Proportion of Days Covered

What PDC Means
PDC measures what percentage of prescribed doses the patient has taken over a defined observation window. It is the FDA and CMS standard for measuring medication adherence across all chronic disease categories.
CLINICAL THRESHOLD:
PDC ≥ 0.80 = Adherent
PDC < 0.80 = Non-adherent

This threshold is published standard.
Not invented by BariAccess.
Used in all major GLP-1 studies.

How to Compute PDC for Tirzepatide
Tirzepatide is a weekly injectable. The patient has one prescribed injection per week.
OBSERVATION WINDOW: Rolling 30 days

DOSES PRESCRIBED in 30 days:
  30 days ÷ 7 days per dose = 4.28
  Round to 4 prescribed doses

DOSES CONFIRMED by patient in 30 days:
  Count of YES responses to
  injection confirmation prompt
  within the observation window

PDC = Doses Confirmed ÷ Doses Prescribed

EXAMPLES:
  4 confirmed of 4 prescribed = PDC 1.00
  3 confirmed of 4 prescribed = PDC 0.75
  2 confirmed of 4 prescribed = PDC 0.50
  0 confirmed of 4 prescribed = PDC 0.00

How to Convert PDC to a Score
PDC score feeds into V4 as a 0-100 value.

PDC_Score = PDC × 100

PDC 1.00 → PDC_Score = 100
PDC 0.80 → PDC_Score = 80
PDC 0.75 → PDC_Score = 75
PDC 0.50 → PDC_Score = 50
PDC 0.00 → PDC_Score = 0

CosmosDB — PDC Data Points to Store
Every time the patient responds to the injection confirmation prompt, store one document in the glp1-adherence-events container.
json{
  "id": "MARK-001-GLP1-2026-04-18",
  "patientId": "SYNTH-MARK-001",
  "eventType": "GLP1_INJECTION_CONFIRMATION",
  "scheduledDate": "2026-04-18",
  "confirmedDate": "2026-04-18",
  "response": "YES",
  "responseTimestamp": "2026-04-18T19:32:00Z",
  "daysLate": 0,
  "source": "patient_self_report",
  "medication": "tirzepatide",
  "doseNumber": 14,
  "dataType": "synthetic",
  "notForProduction": true
}
RESPONSE VALUES:
  "YES"     — patient confirmed injection taken
  "NO"      — patient confirmed injection missed
  "DELAYED" — patient took it late (record daysLate)
  "NO_RESPONSE" — patient did not respond to prompt

PART 2 — RECENCY
How Long Since Last Dose

What Recency Means
Recency answers one question: how many days have passed since the patient's last confirmed injection? It catches gaps that PDC misses because PDC averages over 30 days and cannot detect a current crisis until enough time has passed to move the average.
CLINICAL EXAMPLE:
Mark was perfect for 25 days.
Then stopped for 5 days.

PDC = 25 of 30 days = 0.83.
PDC says: still adherent. No alert.

Recency = 5 days since last dose.
Recency says: gap forming. Act now.

Recency catches what PDC misses.

How to Compute Recency Score
INPUTS:
  Last confirmed injection date
  Today's date
  Patient's prescribed injection interval
    (7 days for tirzepatide)

FORMULA:
  Days_Since_Last_Dose =
    Today - Last_Confirmed_Date

  Grace_Period = 2 days
    (allows for slight schedule flexibility)

  Effective_Gap =
    Days_Since_Last_Dose
    minus Prescribed_Interval
    minus Grace_Period

  If Effective_Gap ≤ 0:
    Recency_Score = 100 (on schedule)

  If Effective_Gap = 1-3 days late:
    Recency_Score = 85

  If Effective_Gap = 4-7 days late:
    Recency_Score = 60

  If Effective_Gap = 8-14 days late:
    Recency_Score = 30

  If Effective_Gap > 14 days late:
    Recency_Score = 0

Clinical Meaning of Recency Score
Recency 100: On schedule. No gap.

Recency 85:  1-3 days late.
             Could be schedule flexibility.
             Ollie sends gentle reminder.
             No clinical alert.

Recency 60:  4-7 days late.
             One week missed.
             Ollie activates protocol.
             Clinical notice to provider.

Recency 30:  8-14 days late.
             Two weeks without medication.
             Provider notification required.
             Barista outreach triggered.

Recency 0:   More than 14 days late.
             Discontinuation territory.
             Full clinical alert.
             Provider direct notification.

CosmosDB — Recency Computed Field
Recency is computed daily by the scoring engine. Store the result in the patient's daily score document.
json{
  "recency": {
    "daysSinceLastDose": 8,
    "lastConfirmedDate": "2026-04-10",
    "effectiveGap": 1,
    "recencyScore": 85,
    "computedAt": "2026-04-18T06:00:00Z"
  }
}

PART 3 — PATTERN
Is This Getting Worse?

What Pattern Means
Pattern is the predictive component. PDC and Recency are reactive — they respond to what has already happened. Pattern looks at the trajectory — where things are heading — so the system can intervene before a full clinical gap develops.
THREE PATTERN TYPES:

ISOLATED EVENT:
  One gap. Never happened before.
  Patient has perfect history
  except for this one event.
  Clinical response: gentle notice.
  Pattern Score: 90-100.

RECURRING GAPS:
  Gaps happen regularly.
  Every 4-6 weeks. Same pattern.
  Something is causing this cycle.
  Cost? Side effects? Work schedule?
  Clinical response: coaching needed.
  Pattern Score: 50-70.

ESCALATING FREQUENCY:
  Gaps are getting longer over time.
  Month 1: 3-day gap.
  Month 2: 7-day gap.
  Month 3: 14-day gap.
  Patient heading toward stopping.
  Clinical response: urgent intervention.
  Pattern Score: 0-40.

How to Compute Pattern Score
INPUTS:
  Full history of GLP1_INJECTION_CONFIRMATION
  events for this patient

COMPUTE THREE METRICS:

Metric 1 — Gap Count (last 90 days):
  Count of NO or NO_RESPONSE events
  where daysLate > 3

Metric 2 — Gap Trend:
  Is average gap duration increasing?
  Compare last 30 days vs prior 60 days.
  Increasing = negative trend.
  Stable or decreasing = positive trend.

Metric 3 — Gap Frequency Trend:
  Are gaps occurring more often?
  Compare gap count last 30 days
  vs prior 30 days.
  More frequent = negative trend.

PATTERN SCORE COMPUTATION:
  Start at 100.

  For each gap in last 90 days:
    Subtract 10 points per gap.

  If Gap_Trend is increasing:
    Subtract additional 15 points.

  If Gap_Frequency is increasing:
    Subtract additional 15 points.

  Floor at 0.

EXAMPLES:
  0 gaps in 90 days:
    Pattern Score = 100

  1 gap, stable trend:
    Pattern Score = 90

  2 gaps, stable trend:
    Pattern Score = 80

  3 gaps, increasing duration:
    Pattern Score = 55

  4 gaps, increasing frequency
  and duration:
    Pattern Score = 25

CosmosDB — Pattern Computed Field
json{
  "pattern": {
    "gapCount90Days": 1,
    "gapTrend": "stable",
    "gapFrequencyTrend": "stable",
    "patternScore": 90,
    "patternType": "ISOLATED_EVENT",
    "computedAt": "2026-04-18T06:00:00Z"
  }
}

PART 4 — V4 FINAL SCORE
The Three-Component Formula
V4 = (PDC_Score × 0.50)
   + (Recency_Score × 0.30)
   + (Pattern_Score × 0.20)

Floor: 0    Ceiling: 100

WEIGHT RATIONALE:
PDC = 0.50
  The historical average carries
  the most weight. It is the most
  stable and least volatile signal.
  Subject to least short-term noise.

Recency = 0.30
  Current gap detection is clinically
  urgent. Second highest weight.
  Catches crises PDC misses.

Pattern = 0.20
  Predictive value is real but
  requires time to establish.
  Lower weight until pattern
  has sufficient history to
  be statistically meaningful.

Clinical Scenarios — Full V4 Computation

SCENARIO 1 — Mark Day 36 (one missed dose)
PDC:
  35 of 36 days covered = 0.97
  PDC_Score = 97

Recency:
  Last injection 7 days ago — on schedule
  Then missed today — 0 days late
  (missed injection just happened)
  Recency_Score = 100

Pattern:
  First gap ever in 36 days
  Pattern Score = 100

V4 = (97×0.50) + (100×0.30) + (100×0.20)
   = 48.5 + 30.0 + 20.0
   = 98.5

V4 = 98.5

TRAC™ multiplier = 1.00 (V4 ≥ 85)
System response: Ollie sends nudge.
"Mark — did you take your
tirzepatide today?"
No clinical alert. Proportionate.

SCENARIO 2 — Mark Day 50 (never resumed after Day 36)
PDC:
  35 of 50 days covered = 0.70
  PDC_Score = 70

Recency:
  Last injection 14 days ago
  Effective gap = 7 days late
  Recency_Score = 30

Pattern:
  1 gap. Duration increasing.
  Pattern Score = 75

V4 = (70×0.50) + (30×0.30) + (75×0.20)
   = 35.0 + 9.0 + 15.0
   = 59.0

V4 = 59.0

TRAC™ multiplier = 0.85 (V4 50-69)
System response:
Provider notification.
Barista outreach triggered.
ISE shifts to Protective.
Clinically correct and proportionate.

SCENARIO 3 — Recurring monthly gaps
PDC:
  22 of 30 days covered = 0.73
  PDC_Score = 73

Recency:
  5 days since last dose
  3 days late
  Recency_Score = 85

Pattern:
  3 gaps in 90 days.
  Frequency increasing.
  Pattern Score = 55

V4 = (73×0.50) + (85×0.30) + (55×0.20)
   = 36.5 + 25.5 + 11.0
   = 73.0

V4 = 73.0

TRAC™ multiplier = 1.00 (V4 70-84)
But system flags recurring pattern.
Barista coaching session recommended.
Ollie activates education FAB.

PART 5 — HOW THE APP COLLECTS THIS DATA
The ITB-GLP1 Workflow — What Zakiy Builds
This is the exact user interaction sequence that generates all V4 data. The education IS the data collection.

INJECTION DAY — (Patient's chosen weekly day)
MORNING (7:00 AM — push notification):
  Ollie banner in app:
  "Mark, today is your tirzepatide day."

  ITB-GLP1 block activates.
  Patient sees injection reminder card.
  No action required yet.

AFTERNOON (4 hours after scheduled time):
  If no confirmation received yet:
  Ollie banner:
  "Mark — ready for your injection?"
  Two buttons: DONE / NOT YET

  If DONE selected:
    Record: response = "YES"
    Record: confirmedDate = today
    Record: daysLate = 0
    V4 data point stored immediately.

  If NOT YET selected:
    Set reminder for 3 hours later.

EVENING (if still no confirmation):
  Ollie banner:
  "Mark, did you take your
  tirzepatide today?"
  Three buttons:
  TOOK IT / SKIPPED TODAY / WILL TAKE LATER

  If TOOK IT:
    response = "DELAYED"
    daysLate = hours late ÷ 24

  If SKIPPED TODAY:
    response = "NO"
    Reason prompt fires (see below)

  If WILL TAKE LATER:
    Flag as pending.
    Check again next morning.

MISSED DOSE REASON CAPTURE
When patient selects SKIPPED TODAY, one follow-up question appears. One question only. Not a survey.
Ollie banner:
"No problem Mark. Quick question —
what got in the way today?"

Four buttons:
  Side effects
  Ran out / Cost
  Forgot
  Other

Record: missedReason = [selection]

This data feeds:
  The white paper analysis.
  The university validation study.
  The clinical coaching protocol.
  The provider dashboard.

IT IS ONE TAP.
Not a burden. Maximum data value.
Minimum patient friction.

NEXT MORNING — FOLLOW UP
If patient reported NO or DELAYED:
Ollie banner (next morning):
"Good morning Mark. How are
you feeling today?"

If side effects were reported:
  Ollie activates GI support protocol.
  Hydration FAB fires.
  Provider notified if severe.

If cost was reported:
  Barista notified immediately.
  Copay assistance resources sent.
  This is a system-level response.
  Not just a nudge.

If forgot:
  Ollie: "No worries. Can you take it
  now or would you prefer to wait
  until your next scheduled day?"
  Patient decides. Platform records.

PART 6 — COSMOSDB IMPLEMENTATION
Container Structure for V4 Data
CONTAINER 1: glp1-adherence-events
  One document per injection event.
  Partition key: /patientId
  Every confirmation, skip, delay
  stored here as an immutable record.
  Append-only. Never update or delete.

CONTAINER 2: patient-daily-scores
  Existing container.
  Add V4 computed fields daily.
  PDC_Score, Recency_Score,
  Pattern_Score, V4_Final all stored
  alongside SC and TRAC scores.

CONTAINER 3: glp1-pattern-summary
  Rolling 90-day pattern summary
  per patient. Updated daily.
  Used by pattern score computation.
  Partition key: /patientId

Daily Scoring Engine — V4 Computation Sequence
RUNS EVERY DAY AT 6:00 AM PER PATIENT:

Step 1:
Query glp1-adherence-events
for last 30 days.
Compute PDC_Score.

Step 2:
Query last confirmed injection date.
Compute days since last dose.
Compute Recency_Score.

Step 3:
Query glp1-pattern-summary.
Compute gap count and trends.
Compute Pattern_Score.

Step 4:
V4 = (PDC×0.50)+(Recency×0.30)
    +(Pattern×0.20)
Clamp to 0-100.

Step 5:
Store V4 in patient-daily-scores
alongside SC and TRAC computation.

Step 6:
If V4 triggers TRAC threshold —
fire appropriate clinical response.

PART 7 — TRAC™ MULTIPLIER WITH V4
For reference — how V4 feeds TRAC™:
IF V1≥85 AND V2≥85 AND V4≥85
→ Multiplier = 1.10
  Full convergence reward.

IF V4 between 70-84
→ Multiplier = 1.00
  Suboptimal. Monitor. No penalty.

IF V4 between 50-69
→ Multiplier = 0.92
  PDC below threshold.
  Clinical notice. Ollie activates.

IF V4 between 30-49
→ Multiplier = 0.85
  Sustained gap. Provider notification.
  Barista outreach triggered.

IF V4 below 30
→ Multiplier = 0.75
  Discontinuation territory.
  Full clinical alert.
  Provider direct notification.

TRAC = [(V4×0.40)+(V1×0.35)+(V2×0.25)]
       × Multiplier

Floor: 0    Ceiling: 100

PART 8 — HARD RULES FOR ZAKIY
RULE 1: glp1-adherence-events is
        append-only. Never update
        or delete a record.
        Every event is permanent.

RULE 2: V4 is recomputed daily
        at 6:00 AM for every patient.
        Never use yesterday's V4
        in today's TRAC computation.

RULE 3: All synthetic records carry
        dataType: "synthetic"
        and notForProduction: true.
        Never mix synthetic and real.

RULE 4: Missed dose reason capture
        is one question only.
        Four options maximum.
        Never a survey. Never more
        than one tap from the patient.

RULE 5: Patient self-report is the
        Phase 1 data source only.
        All documents must carry:
        source: "patient_self_report"
        This is honest labeling.
        Pharmacy data integration
        is Phase 2 — not yet built.

RULE 6: The 0.80 PDC threshold
        is published clinical standard.
        Do not change this threshold
        without Val approval and
        published literature support.

RULE 7: Nothing goes live without
        Val approval. Even V4 engine.
        Send computed V4 values to Val
        for review before any patient
        sees a TRAC score in the app.

PHASE ROADMAP — HONEST ABOUT LIMITATIONS
PHASE 1 — NOW (platform launch):
  Data source: patient self-report only.
  Via ITB-GLP1 injection confirmation.
  Honest limitation: subject to
  social desirability bias.
  Label in all outputs:
  "V4 based on patient self-report.
  Independent pharmacy verification
  pending Phase 2 integration."

PHASE 2 — 6-18 months:
  Add pharmacy fill data.
  Surescripts or PBM integration.
  Cross-reference with self-report.
  PDC becomes objectively computable.
  V4 becomes significantly more rigorous.

PHASE 3 — 2-5 years:
  Connected injection device data.
  Objective injection confirmation.
  No patient reporting required.
  V4 becomes fully objective.
  This is the published gold standard.
  This is what the white paper
  points toward as future state.

REFERENCE DOCUMENTS
WP-TRAC-001 v0.1
  TRAC™ White Paper (in development)
  Scientific rationale for V4 architecture

CCO-TRAC-001 (pending)
  TRAC™ Canon Document
  Full formula specification

CCO-IC-SC-001
  Stability Coefficient Canon
  SC formula — locked

Beacon_Canon_v1.1
  7-band corridor specification
  Normalization paths A/B/C

MARK_60DAY_SYNTHETIC_DATA_v1.1
  Corrected 60-day synthetic data
  (pending recomputation)

INTERNAL DOCUMENT — DEVELOPER EYES ONLY
Not for external distribution
© 2026 BariAccess LLC
All rights reserved. Confidential and proprietary.
Author: Valeriu Eugen Andrei, MD, FACS, FASMBS
Unauthorized use or disclosure prohibited.
