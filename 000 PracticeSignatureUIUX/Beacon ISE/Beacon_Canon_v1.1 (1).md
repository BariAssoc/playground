# BEACON CANON v1.1 — CANONICAL DOCUMENT

**Document:** Beacon Canon  
**Version:** v1.1  
**Date:** February 10, 2026  
**Status:** ✅ CANONICAL — LOCKED  
**Supersedes:** Beacon Canon v1.0 (January 30, 2026)  
**No Hallucination:** ✅ Confirmed  
**Extensible:** ✅ Yes — Will evolve  
**ISE Canon v3.0 alignment:** ✅ Compliant — Beacon governs Lane 1 (tile rims, scoring weights, presentation); delivery matrix per §13; credits owned by S5 (Lane 2). See §22, §27, §34.

---

## TABLE OF CONTENTS

1. [Definition](#1-definition)
2. [Dual Identity](#2-dual-identity)
3. [Location](#3-location)
4. [Color Bands — The 7-Band Architecture](#4-color-bands--the-7-band-architecture)
5. [Band Design Principles](#5-band-design-principles)
6. [Piecewise Linear Mapping Function](#6-piecewise-linear-mapping-function)
7. [Normalization Pipeline](#7-normalization-pipeline)
8. [Normalization Paths (A, B, C)](#8-normalization-paths-a-b-c)
9. [Hybrid Maturation](#9-hybrid-maturation)
10. [Pre-Signal Detection System](#10-pre-signal-detection-system)
11. [Confidence Indicators](#11-confidence-indicators)
12. [Missing Data Philosophy](#12-missing-data-philosophy)
13. [Data Resilience Model (5 Pathways)](#13-data-resilience-model-5-pathways)
14. [Device Capability Handling](#14-device-capability-handling)
15. [Scoring Hierarchy](#15-scoring-hierarchy)
16. [Dynamic Weighting Principle](#16-dynamic-weighting-principle)
17. [System Response Protocol by Band](#17-system-response-protocol-by-band)
18. [Temporal Behavior](#18-temporal-behavior)
19. [Constellation Panel Display](#19-constellation-panel-display)
20. [V-Value Contribution](#20-v-value-contribution)
21. [Beacon ↔ Dynamic Profile Connection](#21-beacon--dynamic-profile-connection)
22. [ISE Interaction with Beacon](#22-ise-interaction-with-beacon)
23. [Updates Governance](#23-updates-governance)
24. [Update Sources](#24-update-sources)
25. [Update Types](#25-update-types)
26. [Update Flows](#26-update-flows)
27. [ISE State Delivery Behavior](#27-ise-state-delivery-behavior)
28. [Priority Classification](#28-priority-classification)
29. [Beacon vs Other Trackers](#29-beacon-vs-other-trackers)
30. [Validation Test Cases](#30-validation-test-cases)
31. [Proprietary Elements](#31-proprietary-elements)
32. [References](#32-references)
33. [Document History](#33-document-history)
34. [Document Status](#34-document-status)

---

## 1. DEFINITION

| Attribute | Value |
|-----------|-------|
| **Name** | Beacon 🧭 |
| **Former Name** | Stability |
| **Full Name** | Beacon Framework™ — Universal Health Metric Normalization and Response System |
| **Type** | Outcome Signal / Guidance + Universal Scoring Grammar |
| **Visual Status** | **SPECIAL** treatment |
| **Purpose** | "Am I on course?" |
| **Governance** | V1+V2+V3+V4 Clinical Intersection |
| **Display** | Percentage (e.g., 87%) + Color Band |
| **What It Is** | A 7-band scoring architecture that converts ANY health metric — physiological, behavioral, contextual, or interventional — into a universal 0-100 scale with clinically defined response protocols at each band |
| **What It Is NOT** | NOT a diagnostic tool. NOT a treatment protocol. NOT a clinical decision system. Beacon OBSERVES, NORMALIZES, and SIGNALS. The provider INTERPRETS and DECIDES (51/49 governance). |
| **Core Principle** | Average is not the goal. In a healthspan optimization platform, average (Z=0) maps to Light Orange — "room to grow." Green must be earned. Red demands response. |
| **Scope** | Beacon applies to ALL scores in the BariAccess hierarchy: R&R (master), 8 Layer 1 composites, 24+ Layer 2 sub-scores. Every score passes through the same framework. |
| **Competitive Position** | Whoop uses a 0-21 strain scale. Oura uses 0-100 Readiness with proprietary thresholds. Apple Health has no unified scoring. None of them have clinically defined response bands with governance protocols. Beacon is the only framework that ties scoring to clinical action. |

### Core Guidance Principle

Beacon is the **guidance signal** that tells the user if they are on course. It is connected to the **Dynamic Profile / My Blueprint** and guides the user through the "corridor" using **Control Theory of Maxwell** — proactive correction to avoid Orange.

---

## 2. DUAL IDENTITY

Beacon serves two roles in BariAccess:

| Role | Description |
|------|-------------|
| **Universal Scoring Grammar** | The 7-band architecture, piecewise linear mapping, color system, response protocols. Every score at every level of the hierarchy uses Beacon. This is the framework that makes all health metrics speak the same language. |
| **Row 5 Tracker** | A specific tile at Row 5, Position 3 in the Daily Pulse. Shows the user "Am I on course?" as a guidance signal. See Section 3 for location. Row 5 display specifications to be defined in Task 17 (Row 5 Tracker Resolution). |

Both roles are canonical. The framework is universal. The tracker is specific.

---

## 3. LOCATION

| Attribute | Value |
|-----------|-------|
| **Row** | Row 5 (Daily Pulse) |
| **Position** | 3 (after FAB and ITB) |
| **Icon** | 🧭 |

### Row 5 Order (Canonical)

```
[FAB 🎯] [ITB 💊] [Beacon 🧭] [Routine ⭐] [Productivity ⚡] [Parking Lot 🅿️]
   1        2         3          4            5                 6
```

---

## 4. COLOR BANDS — THE 7-BAND ARCHITECTURE

### Band Definitions

| Band | Range | Color | Name | Clinical Meaning | Population (approx) |
|------|-------|-------|------|-----------------|---------------------|
| 1 | 95–100 | 🟢🟢🟢 | Strong Green | Top-tier health metric. Protect this corridor. Rare and valuable. | ~7% |
| 2 | 85–94 | 🟢🟢 | Med Green | Genuinely above the curve. System reinforces positive patterns. | ~17% |
| 3 | 80–84 | 🟢 | Faint Green | Good but showing early softening OR entering from above. Pre-signal zone. | ~14% |
| 4 | 70–79 | 🟠 | Light Orange | Average to slightly above. Room to grow. This is where most users live early in their journey. | ~24% |
| 5 | 65–69 | 🟠🟠 | Med Orange | Below average. Needs focused attention. Behavioral or physiological drift detected. | ~11% |
| 6 | 60–64 | 🟠🟠🟠 | Dark Orange | Significantly below average. Active intervention recommended. Provider may be involved. | ~11% |
| 7 | <60 | 🔴 | Red | Clinical intersection. Provider notified. 51/49 governance activated. Compassionate response — protect, don't punish. | ~16% |

### Visual Scale

```
🔴  | 🟠🟠🟠 | 🟠🟠  | 🟠    | 🟢    | 🟢🟢   | 🟢🟢🟢
<60   60-64   65-69   70-79   80-84   85-94    95-100
Red   Dark    Med     Light   Faint   Med      Strong
      Orange  Orange  Orange  Green   Green    Green
```

---

## 5. BAND DESIGN PRINCIPLES

### Asymmetric by Design

The bands are NOT equal width. This is intentional:

**Band 1 is narrow (5 points)** — Exceptional is a small target. The difference between 95 and 100 is meaningful. Being exceptional means precision.

**Band 3 is narrow (5 points)** — The pre-signal zone is an ALERT window. Narrow by design so the system detects transition quickly. A score doesn't linger in Faint Green — it either recovers to Med Green or drops to Light Orange.

**Band 4 is wide (10 points)** — Most users live here, especially early in their journey. Wide enough for movement without constant band-jumping. A user going from 71 to 78 sees progress WITHOUT changing bands, which prevents notification fatigue.

**Band 7 is wide (60 points)** — Once in Red, the specific number matters less than the fact that clinical governance is active. The provider needs to know the user is in Red. Whether they're at 55 or 35, the response protocol is the same: compassionate outreach, 51/49 governance, BBS recovery pathway.

### Anti-Erosion by Design

The mapping places Average (Z=0) at Score 75 (Light Orange). This means:

- A new user on Day 1 sees Light Orange — "you're okay, let's improve" — NOT Red
- A typical bariatric patient 12 months post-surgery sees Light Orange — honest, not discouraging
- Green must be EARNED through genuine improvement — it's not given by default
- Red is reserved for genuine clinical concern — not for average people

### Clinical Rationale

The asymmetry IS the clinical intelligence. Making bands symmetric would make math easier but destroy clinical value. Like a thermometer — normal body temperature is a tiny 1.3°F band, fever is 100.4+, hypothermia is below 95°. Zones are asymmetric because BIOLOGY is asymmetric. Beacon bands follow the same logic. These band widths are derived from 25 years of clinical experience and 9,000 bariatric surgeries.

---

## 6. PIECEWISE LINEAR MAPPING FUNCTION

### 6.1 Why Piecewise Linear (Not Sigmoid)

A standard sigmoid function was tested during ABA-SBL™ development (WP-002) and rejected for three reasons:

**Sigmoid assumes symmetric distribution.** Beacon bands are asymmetric by clinical design. The sigmoid compressed Band 4 (Light Orange) and stretched Band 7 (Red), producing clinically inappropriate assignments.

**Sigmoid parameters are globally coupled.** Changing k (steepness) or Z_mid (midpoint) shifts ALL bands simultaneously. It is impossible to adjust one band without affecting all others.

**Average (Z=0) mapped to Red.** With any standard sigmoid parameterization, an average person scored below 60 (Red), which triggers clinical governance for a healthy person. Adjusting Z_mid fixed this but distorted upper bands.

Piecewise linear mapping was selected because:

- Each Beacon band is defined independently — tunable without affecting others
- The specific breakpoints are tied to clinical rationale, not mathematical convenience
- Phase 2 biostatistical validation can adjust individual bands
- Developer implementation is simple (if/else with linear equations)
- The breakpoints themselves constitute proprietary intellectual property

### 6.2 The Function

**Status:** LOCKED — Available for Phase 1b use. Biostatistical validation in Phase 2 may refine specific breakpoint numbers. Architecture (piecewise linear, 7 segments, asymmetric bands) is permanent.

```
BEACON PIECEWISE LINEAR MAPPING FUNCTION v1.0

Input:   Z (normalized Z-score, any metric)
Output:  Score (0-100, maps to Beacon band)

If Z >= +1.5   → Score = 95 + (Z - 1.5) × 10           cap at 100
If Z >= +0.7   → Score = 85 + (Z - 0.7) × 12.5
If Z >= +0.3   → Score = 80 + (Z - 0.3) × 12.5
If Z >= -0.3   → Score = 70 + (Z + 0.3) × 16.7
If Z >= -0.6   → Score = 65 + (Z + 0.6) × 16.7
If Z >= -1.0   → Score = 60 + (Z + 1.0) × 12.5
If Z <  -1.0   → Score = max(0, 60 + (Z + 1.0) × 20)
```

### 6.3 Verification Table

| Z-Score | Score | Band | Percentile | Population Description |
|---------|-------|------|------------|----------------------|
| +2.5 | 100 | Band 1: Strong Green | ~99th | Elite — top 1% |
| +2.0 | 100 | Band 1: Strong Green | ~98th | Exceptional |
| +1.5 | 95 | Band 1: Strong Green | ~93rd | Outstanding |
| +1.0 | 89 | Band 2: Med Green | ~84th | Strong |
| +0.7 | 85 | Band 2: Med Green | ~76th | Above average |
| +0.5 | 83 | Band 3: Faint Green | ~69th | Good — watch zone |
| +0.3 | 80 | Band 3: Faint Green | ~62nd | Entering watch zone |
| 0.0 | 75 | Band 4: Light Orange | 50th | Average — room to grow |
| -0.3 | 70 | Band 4: Light Orange | ~38th | Lower average |
| -0.5 | 67 | Band 5: Med Orange | ~31st | Below average |
| -0.6 | 65 | Band 5: Med Orange | ~27th | Needs focus |
| -1.0 | 60 | Band 6: Dark Orange | ~16th | Intervention zone |
| -1.5 | 50 | Band 7: Red | ~7th | Provider alert |
| -2.0 | 40 | Band 7: Red | ~2nd | Clinical intersection |
| -3.0 | 20 | Band 7: Red | <1st | Severe — immediate response |

### 6.4 Breakpoint Rationale

| Breakpoint Z | Score Boundary | Clinical Justification |
|-------------|---------------|----------------------|
| +1.5 | 95 (Strong Green entry) | ~93rd percentile. In HRV literature, RMSSD at +1.5 SD above age-sex mean correlates with strong parasympathetic tone and low cardiovascular risk (Shaffer 2017). |
| +0.7 | 85 (Med Green entry) | ~76th percentile. Represents meaningfully above average health status. Users at this level show measurable health advantages in population studies. |
| +0.3 | 80 (Faint Green entry) | ~62nd percentile. The transition from "average" to "above average." Narrow band by design — this is the watch zone where early softening is detected. |
| -0.3 | 70 (Light Orange lower bound) | ~38th percentile. Below this, the user is below the median on a metric. In bariatric population: this is where post-surgical patients begin showing early signs of metabolic stalling. |
| -0.6 | 65 (Med Orange entry) | ~27th percentile. Consistent underperformance. Behavioral or physiological drift is likely in progress. |
| -1.0 | 60 (Dark Orange entry) | ~16th percentile. One full standard deviation below mean. Clinical intervention literature supports this as the threshold where passive observation is insufficient (Spiegelhalter 2012). |

### 6.5 When Piecewise Linear Does NOT Apply

Some scores use bounded scoring models (0-100 directly) rather than Z-score normalization. These scores skip Stage 2 (Z-score) and Stage 3 (piecewise mapping) and map directly to Beacon bands.

Bounded scoring applies when:

- All inputs are already bounded (scales 1-10, percentages 0-100%, categorical states)
- No population reference normalization is needed
- The score represents a behavioral or contextual metric, not a physiological one

Example: CIR (Circadian Regularity) and other behavioral sub-scores use bounded scoring because their components are mood scales (1-10), FAB percentages (0-100%), stress self-report (PSS-4 scale), and categorical states (Protected/Challenging/Vulnerable). These don't require Z-score normalization against a population — they're already in meaningful ranges.

---

## 7. NORMALIZATION PIPELINE

### 7.1 The 3-Stage Pipeline

Every physiological metric in BariAccess passes through 3 stages before becoming a Beacon score:

```
Stage 1: Log Transform          [HRV metrics only]
         x_transformed = ln(x_raw)
         Why: HRV is log-normally distributed (Task Force ESC 1996)

Stage 2: Z-Score Normalization   [all physiological metrics]
         Z = (x - mu_ref) / sigma_ref
         Where mu_ref, sigma_ref = age-sex population parameters
         Inverse metrics: Z = -1 × Z (so positive always = better)

Stage 3: Piecewise Linear Map    [Z → 0-100 Beacon score]
         See Section 6.2 function
```

### 7.2 Behavioral/Contextual Metrics — Bounded Pipeline

```
Stage 1: Not applicable (no transform needed)
Stage 2: Bounded scoring function (specific to each component)
         Output: 0-100 directly
Stage 3: Not applicable (already 0-100, maps directly to Beacon bands)
```

### 7.3 Inversion Rule

For ALL metrics, the convention is: **POSITIVE = BETTER HEALTH.**

Metrics where higher values mean worse health must be inverted:

| Metric | Higher Value Means | Invert? |
|--------|-------------------|---------|
| RMSSD | More parasympathetic tone (better) | No |
| SDNN | More HRV (better) | No |
| Resting Heart Rate | More sympathetic activation (worse) | YES |
| Respiratory Rate | Physiological stress (worse) | YES |
| Skin Temp Deviation | Inflammatory response (worse) | YES |
| Cortisol (future) | More stress (worse) | YES |
| Deep Sleep % | Better recovery (better) | No |
| Step Count | More activity (better) | No |
| FAB Adherence | More engagement (better) | No |
| PLI Count | More cognitive load (worse) | YES (via exponential decay) |

---

## 8. NORMALIZATION PATHS (A, B, C)

### 8.1 Three Paths

| Path | Input Type | Pipeline | Output | Used By |
|------|-----------|----------|--------|---------|
| **Path A: Z-Score + Piecewise** | Physiological biometrics with population references | ln() → Z-score → Piecewise map | 0-100 Beacon | SMA components, physiological sub-scores |
| **Path B: Bounded Scoring** | Behavioral and contextual metrics (scales, %, categories) | Direct bounded function → 0-100 | 0-100 Beacon | CIR components, behavioral sub-scores |
| **Path C: Hybrid** | Mixed physiological + behavioral | Path A for V1 components, Path B for V2/V3 components → weighted combination | 0-100 Beacon | RSI, mixed sub-scores |

### 8.2 Path Selection Rule

```
IF all components are V1 physiological with population references → Path A
IF all components are V2/V3 behavioral/contextual → Path B
IF components are mixed V1 + V2/V3 → Path C
```

This is determined at score design time (in each White Paper) and is FIXED for each score. The path doesn't change at runtime.

---

## 9. HYBRID MATURATION

Normalization evolves over time through three phases:

| Phase | When | What Happens |
|-------|------|-------------|
| **Phase 1: Clinical Reference** | Day 0 (Embarkment) | Z-scores use published population reference ranges (e.g., Tegegne 2020 for HRV, AHA for RHR). Age-sex stratification mandatory. This is the starting point for ALL users. |
| **Phase 2: Personal Trajectory** | Weeks to months post-Embarkment | Personal baseline data accumulates. System layers personal trajectory onto population references. The user's OWN trend becomes increasingly important. |
| **Phase 3: Population Percentile** | Optional, scale-dependent | Population-level percentile ranking available as additional context. Not required for scoring. Enhancement, not replacement. |

### Maturation Principle

Age/sex adjustment is **mandatory** at all phases. HRV and RHR vary significantly by age and sex (Tegegne 2020, N=84,772). A 25-year-old woman's RMSSD of 37ms is median; the same value in a 60-year-old man is well above median. Without age/sex stratification, scores are clinically meaningless.

The system never fully abandons population references — personal trajectory is LAYERED ON TOP, not substituted. This prevents the system from normalizing unhealthy baselines as "personal normal."

---

## 10. PRE-SIGNAL DETECTION SYSTEM

### 10.1 Definition

A pre-signal is an early warning that a score may be declining toward a clinically significant threshold. Pre-signals are detected BEFORE the user enters a concerning band, giving the system time to intervene preventively.

### 10.2 Detection Rule

```
PRE-SIGNAL = TRUE when EITHER:
  (a) POSITION: Score is currently in Band 3 (Faint Green, 80-84)
  (b) VELOCITY: Score has dropped > 10 points in 14 days,
      regardless of current band
```

### 10.3 Why Two Triggers

**Position trigger (Band 3):** Catches users who are objectively in the boundary zone between "good" and "needs attention." Their current state is the signal.

**Velocity trigger (>10 points/14 days):** Catches users who are FALLING, even if they're still in a "good" band. A score dropping from 92 to 81 is still Faint Green, but the TRAJECTORY is the alarm. Conversely, a stable 73 (Light Orange) is NOT a pre-signal — the user isn't declining, they just need work.

Discovered during testing: Character 2 (James, WP-002) was in Light Orange (72.6) but had dropped from 82 in two weeks. The position alone (Light Orange) wouldn't trigger a pre-signal. The velocity did. This distinction is clinically critical — it prevents both false positives (stable Light Orange isn't alarming) and false negatives (dropping scores in any band ARE alarming).

### 10.4 Dual System Response

Pre-signal activates TWO parallel systems:

| System | What Activates | Governed By |
|--------|---------------|-------------|
| **Pre-Signal Detection** (scoring/FAB layer) | Guardian FAB watches declining dimension. Wedge FAB on standby. 48-hour watch period. Ollie contextual nudge. Credits offered for coping action. | Beacon Canon (this document) |
| **Program Trigger** (Program Canon layer) | A Program is generated via BioSnap. Program follows Program Canon rules — can be Started, Deferred, Incomplete, Completed. If not completed → Parking Lot → 72h → Q Inbox → Purge. Completion → BRiCK logged → Credits earned. | Program Canon v1.1 |

Both systems fire from BOTH triggers (position AND velocity).

### 10.5 Pre-Signal Response Protocol

| Action | Responsible | Timing |
|--------|------------|--------|
| Guardian FAB activates — observes the declining dimension | System (automatic) | Immediate on detection |
| Score trend flagged on Constellation Panel | Dashboard display | Immediate |
| Ollie contextual nudge — ONE gentle message | Ollie | Within 4 hours |
| Wedge FAB on standby | System (automatic) | Ready to deploy |
| 48-hour watch period | System timer | No escalation unless decline continues |
| Credits offered for any coping action | Credits Engine | Immediate |
| Program generated via BioSnap | System / Ollie | Immediate |
| Barista NOT notified | — | Unless decline continues past 48h |
| Provider NOT notified | — | Only at Band 5+ sustained |

### 10.6 Pre-Signal Expiration

A pre-signal expires (returns to normal monitoring) when:

```
PRE-SIGNAL EXPIRED when BOTH:
  (a) Score has stabilized or improved for 72+ hours
  (b) Score is NOT in Band 3 (has returned to Band 2 or better,
      OR has stabilized in Band 4+ with no further decline)
```

---

## 11. CONFIDENCE INDICATORS

### 11.1 Definition

Every Beacon score carries a confidence percentage indicating how much data was available to calculate it.

```
Confidence = (available_data_weight / total_possible_weight) × 100%
```

### 11.2 Confidence Levels

| Confidence | Meaning | Display | Action |
|-----------|---------|---------|--------|
| 90-100% | Full or near-full data | Score displayed normally | Normal operation |
| 70-89% | Minor data gap | Score displayed with indicator: "Based on partial data" | System notes gap, no escalation |
| 50-69% | Significant gap | Score displayed with warning: "Limited data available" | BBS outreach for device reconnection |
| <50% | Severe gap | Score displayed as estimate: "Estimated — reconnect device" | BBS recovery pathway activates |

### 11.3 Confidence Sources

| Data Gap Type | Example | Confidence Impact | Duration |
|--------------|---------|------------------|----------|
| Temporary device desync | Oura battery died for 1 day | Temporary drop | Restores when device reconnects |
| Permanent device limitation | Polar has no skin temp | Permanent reduction (e.g., 90%) | Permanent unless user adds device |
| User stopped logging | No mood entries for 7 days | Drop on behavioral components | CIR defaults missing to score 30 |
| Device removed entirely | User stopped wearing Whoop | SMA confidence drops to 0% | V1 scores become unavailable, FAB-first model activates |

---

## 12. MISSING DATA PHILOSOPHY

### 12.1 Core Principle

**Missing data IS data.** When a user stops logging, stops wearing their device, or stops engaging, the ABSENCE of data is itself a behavioral signal. This is a locked BariAccess principle.

### 12.2 Missing Data Rules by Type

| Data Type | When Missing | System Response | Score Impact |
|-----------|-------------|----------------|-------------|
| V1 biometric (device) | Device desynced | Redistribute weights. Confidence drops. BBS outreach. | SMA uses available components |
| V2 self-report (mood, stress) | User stopped logging | Default score = 30 (missing = signal). | CIR components default to 30 |
| V2 behavioral (FAB completion) | User not doing FABs | Score = 0% adherence (actual zero). | Direct negative impact on CIR/RSI |
| V3 contextual (Space-State) | No context update | Hold last known state. | No change until updated |
| V4 interventional (ITB data) | No active ITBs | Not factored into scoring. | No impact (V4 is enhancement) |

### 12.3 Why 30 (Not 0, Not 50)

When self-report data is missing:

- **0 would be too harsh.** A user who forgot to log is not in crisis.
- **50 would be too generous.** A user who stopped engaging is NOT average — they're showing early disengagement.
- **30 is calibrated to Band 7 (Red).** This ensures the CIR score drifts downward when self-report stops, triggering pre-signal detection through velocity. The system notices and responds — without catastrophizing.

### 12.4 Routine as Ground Truth

Before the system escalates about missing wearable data, it checks Routine status (see Routine Canon v1.0):

- **If segments are still executing** → User is probably fine. Tech gap, not behavioral erosion. System holds scores via Longitudinal Hold with confidence indicator.
- **If routine is also gone** → Behavioral erosion is starting. Multiple signals converging. System escalates through Data Resilience Model (Section 13).

Routine is the foundation container. If the container is intact, missing V1 data is a device problem, not a person problem.

### 12.5 Never Blank Rule

The system ALWAYS produces a score using available data with confidence indicator. The score never disappears. This prevents user anxiety and behavioral erosion. A blank screen is more damaging than a low-confidence score.

---

## 13. DATA RESILIENCE MODEL (5 PATHWAYS)

When V1 biometric data gaps occur, the system responds through a graduated 5-pathway model:

| Pathway | Trigger | Response | Who |
|---------|---------|----------|-----|
| **1. Longitudinal Hold** | V1 gap + V2 active + Routine intact | Hold score via historical trends, confidence indicator displayed | System (automatic) |
| **2. Chatbot Triage** | V1 gap persists + user notices | Ollie troubleshoots resync, 1-2 minutes | Ollie (chatbot) |
| **3. Online Barista 24/7** | Chatbot can't resolve | Calendly → Zoom, 5/10/15/20/30 min appointments, premium membership | Online Barista (human) |
| **4. On-Site BBS** | User prefers in-person OR needs stationary biometrics | Walk-in Satellite BBS or Main BBS appointment | Barista / Master Barista |
| **5. FAB Behavioral Recovery** | V1 gap + V2 ALSO drifting + Routine eroding | FABs deploy, entry-level re-engagement, credits offered | System + Barista coordination |

### BBS Infrastructure

| Level | What | Capabilities |
|-------|------|-------------|
| **Online BBS** | 24/7 via Calendly + Zoom integration | 5/10/15/20/30 min appointments. Part of premium membership. Waitlist if busy but always available. |
| **Satellite BBS** | Walk-in location | Stationary biometrics. Barista available. |
| **Main BBS** | Full facility | Master Barista. Full biometric workup: InBody/SECA, FibroScan. Comprehensive assessment. |

### FAB-First Resilience Principle

When V1 (biometric) data disappears entirely, the scoring system does NOT collapse. It shifts to a FAB-first resilience model:

```
WHEN V1 data is unavailable:
  - SMA uses last known value with decaying confidence
  - CIR becomes primary signal (never goes blank)
  - RSI holds rolling average of last 3 episodes
  - Composite score continues with adjusted weights
  - Confidence indicator shows reduced percentage
  - BBS recovery pathway activates for device reconnection
```

**THE SYSTEM NEVER GOES DARK.**

FABs are the puzzle piece that always fits because behavior is ALWAYS observable even when devices fail. Missing data IS behavioral erosion beginning. The ability to continue scoring with behavioral data alone when biometric data disappears is a BariAccess-proprietary innovation. No competitor maintains composite scoring without device data.

---

## 14. DEVICE CAPABILITY HANDLING

### 14.1 Registration at Embarkment D0

During Embarkment (D0), the system registers each user's device capabilities at the BBS:

- What sensors the device has (HRV, skin temp, respiratory rate, etc.)
- What data streams are available
- What is permanently unavailable (e.g., Polar has no skin temp, Oura does)

### 14.2 One Formula, Not Device-Specific Variants

The system maintains ONE scoring formula per metric. It does NOT create device-specific variants. When a sensor is permanently unavailable:

- Weight redistributes proportionally to available components — permanently
- Confidence indicator reflects data completeness (e.g., "SMA calculated with 90% data availability — skin temperature not available from your device")
- Score remains valid and comparable across devices

### 14.3 Device Addition

If a user later adds a device with a previously missing capability, the system detects and recalculates with full data. Confidence increases. No manual intervention required.

### 14.4 Why One Formula

- Easier to validate (one formula, not multiple device-specific variants)
- Easier to explain to providers and users
- Easier for biostatistician to verify
- Prevents device-dependent scoring inconsistencies
- The formula is the intellectual property — not the device workaround

---

## 15. SCORING HIERARCHY

### 15.1 The R&R Architecture

```
                    ┌─────────────────┐
                    │   ABA-R&R™      │  Master Composite
                    │  (Readiness & Recovery│  (WP-010)
                    │   Master Score)  │
                    └────────┬────────┘
                             │
        ┌────────┬───────┬───┴───┬────────┬────────┐
        │        │       │       │        │        │
    ┌───┴──┐ ┌──┴───┐ ┌─┴──┐ ┌──┴──┐ ┌───┴──┐    │
    │ SRC  │ │ SBL  │ │MBC │ │ MEI │ │ AMP  │    │
    │Sleep │ │Stress│ │Body│ │Energy│ │Activ │    │
    │WP-003│ │WP-002│ │WP07│ │WP-04│ │WP-05 │    │
    └──┬───┘ └──┬───┘ └─┬──┘ └──┬──┘ └──┬───┘    │
       │        │       │       │       │         │
    3 sub    3 sub   3 sub  3 sub   3 sub     ┌───┴────┐
    scores   scores  scores scores  scores    │        │
                                          ┌───┴──┐ ┌──┴───┐
                                          │ BCI  │ │ CRC  │
                                          │Brain │ │Rhythm│
                                          │WP-006│ │WP-009│
                                          └──┬───┘ └──┬───┘
                                             │        │
                                          3 sub    3 sub
                                          scores   scores
                                          ┌──────────┐
                                          │  BHR     │
                                          │ Habits   │
                                          │WP-008    │
                                          └──┬───────┘
                                             │
                                          3 sub
                                          scores
```

### 15.2 Layer Structure

| Layer | What | Count | Description |
|-------|------|-------|-------------|
| **Layer 0** | R&R (Master) | 1 | Single apex score — the user's overall Readiness & Recovery readiness. Displayed as Tile 1 (R&R) in Row 1. |
| **Layer 1** | Composites | 8 | SRC, SBL, MBC, MEI, AMP, BCI, CRC, BHR |
| **Layer 2** | Sub-Scores | 24+ | 3 sub-scores per composite (e.g., CIR, SMA, RSI under SBL) |
| **Layer 3** | Components | 80+ | Individual biometric inputs (e.g., ln(RMSSD), RHR, PLI count) |

### 15.3 Universal Rules

Every score at every layer follows these rules:

**Beacon-mapped.** Every score outputs 0-100 and maps to the 7-band system.

**V-stream tagged.** Every component is tagged V1, V2, V3, or V4.

**Confidence-reported.** Every score carries a confidence percentage.

**Pre-signal capable.** Every score can trigger pre-signal detection (position or velocity).

**Missing-data resilient.** Every score has a defined behavior when data is missing.

**ISE-aware.** Every composite can adjust weights based on Identity State Expression. See ISE Canon v3.0 for canonical state definitions.

**Longitudinally tracked.** Every score is stored historically for trend analysis.

**Beacon-responsive.** Every band triggers a defined system response per the protocol in Section 17.

---

## 16. DYNAMIC WEIGHTING PRINCIPLE

### 16.1 The Principle

Composite score weights are NOT fixed. They shift based on ISE state and Mesh context. The Beacon bands remain constant — Band 2 is ALWAYS Med Green (85-94) regardless of ISE. But the WEIGHTS within composite formulas can shift by ISE state.

```
WHAT ISE CHANGES:        Sub-score weights within composites
WHAT ISE DOES NOT CHANGE: Band thresholds, mapping function, response protocols
```

### 16.2 How It Works

Each composite White Paper (WP-002 through WP-009) defines:

- Default weights for ISE-1 (Aligned/Available) — the standard operating state
- Weight variations for each ISE state — how emphasis shifts based on user's current identity state
- Rationale for each shift — why certain sub-scores matter more in certain states

See WP-002 (ABA-SBL™) for the template showing ISE-dependent weight tables. Exact weight values for all ISE states across all composites are deferred to PAC-2 (Deterministic Logic) for biostatistics team validation.

### 16.3 ISE State Reference

All 7 ISE states per ISE Canon v3.0:

| State | Name | Weight Shift Principle |
|-------|------|----------------------|
| **ISE-0** | Neutral / Baseline | Limited V1 data early; behavioral metrics weighted higher |
| **ISE-1** | Aligned / Available | Standard — all weights at default |
| **ISE-2** | Protective / Recovery-Forward | Recovery-related sub-scores weighted higher |
| **ISE-3** | Contained / Load-Limited | Simplified; subjective metrics emphasized |
| **ISE-4** | Building / Momentum | Phase 2 — to be defined |
| **ISE-5** | Restricted / Guarded | Objective (physiological) weighted highest; provider exercises 51% directly |
| **ISE-6** | Exploratory / Low-Signal | Phase 2 — to be defined |

---

## 17. SYSTEM RESPONSE PROTOCOL BY BAND

### 17.1 Response Matrix

| Band | Color | Ollie Intent (Fortress Template) | Ollie Example (Phase 3 AI) | FABs | Credits | Barista | Provider | ISE Impact |
|------|-------|--------------------------------|---------------------------|------|---------|---------|----------|------------|
| 1: Strong Green | 🟢🟢🟢 | Celebrate. Protect the corridor. | "You're in an incredible place right now. Whatever you're doing, keep it up." | Maintenance FABs only | Bonus credits for sustained excellence | Monthly check-in | Not involved unless requested | No change |
| 2: Med Green | 🟢🟢 | Reinforce positive patterns. | "Your stress recovery has been getting stronger. That breathing exercise seems to be helping." | Standard FABs, positive cadence | Normal credit flow | Monthly check-in | Not involved | No change |
| 3: Faint Green | 🟢 | Aware. Subtle shift noticed. | "I noticed things have shifted a bit this week. Nothing to worry about — just want to check in." | Guardian FAB watching. Wedge FAB on standby. | Credits for any coping action | Notified if persists >7 days | Not involved | No change |
| 4: Light Orange | 🟠 | Encouraging. One action focus. | "Room to grow. Here's one thing to try today." | Active deployment. ONE focused FAB per day. | Credits for effort, not outcome | Weekly check-in (Online Barista) | Not involved unless Light Orange >4 weeks | No change |
| 5: Med Orange | 🟠🟠 | Direct. Needs attention. | "This needs attention. Let's focus here together." | Multiple FABs active. Coping priority. | Credits maintained — not withdrawn | Bi-weekly check-in | Notified. Dashboard flag. | Watch for ISE-3 trigger |
| 6: Dark Orange | 🟠🟠🟠 | Concerned. Offer help. | "We're here to help. Let's talk about what's going on." | Simplified FABs — reduce complexity | Credits maintained | Weekly or more. Phone outreach. | Active involvement. Reviews data. | ISE-3 likely |
| 7: Red | 🔴 | Compassionate. ONE message. No pressure. | "We're here. No pressure. Just letting you know we noticed." | NO FAB demands. System protects. | No pressure. Credits banked. | Same-day outreach. Phone call. | Clinical governance. Provider exercises 51% directly. | ISE-5 (Restricted/Guarded) |

**Fortress templates:** To be written by development team using the Intent column as guide. Governed by PAC-ISE-003 (Reason Codes & Ollie Template Keys). Pre-written, logic-triggered, not AI-generated in Phase 1–2.

**Phase 3 AI examples:** Illustrative. When Ollie becomes AI-powered, messages will be contextual and personalized within ISE constraints.

### 17.2 Response Principles

**Graduated, not binary.** The system doesn't flip from "everything is fine" to "crisis." Each band shifts the response incrementally. A user crossing from Light Orange to Med Orange feels a subtle increase in attention, not an alarm.

**Compassionate in Red.** The most critical design decision: when a user is in Band 7, the system does LESS, not more. No FAB demands. No credit pressure. No notifications except one compassionate Ollie message. The response is human — Barista phone call, provider involvement, 51/49 governance. The app becomes a quiet presence, not a taskmaster.

**Anti-erosion across all bands.** At no band does the system punish, shame, or overwhelm. Light Orange says "room to grow" — not "you're failing." Med Orange says "let's focus" — not "you're in trouble." The language matters because language triggers behavior, and behavior is what we're trying to protect.

---

## 18. TEMPORAL BEHAVIOR

### 18.1 Score Update Frequencies

| Score Type | Update Frequency | Why |
|-----------|-----------------|-----|
| Layer 3 components | Real-time to hourly | Raw biometric data flows as device syncs |
| Layer 2 sub-scores | Every 4-6 hours | Sufficient for trend detection without noise |
| Layer 1 composites | Daily (morning recalculation) | User sees stable daily score, not minute-by-minute fluctuation |
| Layer 0 R&R | Daily | Apex score — most stable |

### 18.2 Smoothing and Noise Reduction

Raw biometric data is noisy. A single bad night of sleep shouldn't turn a Med Green score Red.

```
SMOOTHING RULES:
  - Components use 7-day rolling averages unless specified otherwise
  - Sub-scores use 3-day weighted average
    (today 50%, yesterday 30%, day before 20%)
  - Composites calculated from smoothed sub-scores
  - Band transitions require 2 consecutive days in new band
    before display changes
    EXCEPTION: Drops into Band 7 (Red) are IMMEDIATE —
    no smoothing delay for crisis
```

### 18.3 Band Transition Hysteresis

To prevent "band bouncing" (score oscillating between two bands), a hysteresis buffer is applied:

```
HYSTERESIS RULE:
  To ENTER a higher band: score must exceed threshold by 1 point
  for 2 days
  To DROP to a lower band: score must be below threshold for 2 days
  EXCEPTION: Drop to Band 7 (Red) is immediate — no buffer
```

Example: Band 3 / Band 4 boundary is 80.

- Score of 80.5 for 1 day → stays in Band 4 (hasn't crossed +1 for 2 days)
- Score of 81.0 for 2 days → transitions to Band 3
- Score of 79.5 for 1 day → stays in Band 3 (hasn't been below for 2 days)
- Score of 79.0 for 2 days → transitions to Band 4

---

## 19. CONSTELLATION PANEL DISPLAY

### 19.1 What the User Sees

Scores are displayed within the Constellation Panel's 5-row structure (see Constellation Panel Canon for full specification):

- **Row 1 (Status Bar):** R&R Master Score as Tile 1 — single number with Beacon color
- **Row 2–3 (Ollie's Space):** Ollie translates scores into human language
- **Row 4 (Daily Lens):** 5 icons for quick input (Ollie, M+E, S, R+S, AskABA)
- **Row 5 (Daily Pulse):** 6 trackers including Beacon at Position 3

### 19.2 Interaction Model

| Action | Gesture | Result |
|--------|---------|--------|
| **TAP** | Quick touch < 2 sec | Blip Card — headline (3 states), 4 visual indicator boxes, micro-bar |
| **PRESS** | Hold ≥ 2 sec | Press Card — full display with 4 sections: Clinical Detail, Gamification/Equity, Learning Options, All Scores. Panel retracts. |
| **DOUBLE TAP** | Two quick taps | Definition Card — explains abbreviations (FAB, ITB, Beacon, etc.) |

### 19.3 Headline — 3 States

The headline on each Blip Card uses three states, calculated from V1+V2+V3+V4:

| State | Indicator | Meaning |
|-------|-----------|---------|
| **Good Progress** | Green | Within acceptable range |
| **Pre-Signal Warning** | Orange | Early warning pattern |
| **Clinical Intersection** | Red | V1+V2+V3+V4 convergence on decline or abnormal pattern |

### 19.4 Color Communication

The user sees COLORS, not numbers. Ollie explains what the color means in plain language. The specific 0-100 score is available on tap (drill-down) but is not the primary communication.

```
User sees:    [Med Green tile] "Stress"
User taps:    Score 85.9 | Band 2: Med Green | "Your stress levels are strong."
User drills:  CIR 80.9 | SMA 85.6 | RSI 91.3 | Trends | History
```

### 19.5 Ollie's Role in Beacon Communication

Ollie translates Beacon into human language. Governed by ISE state. In Phase 1–2 (Fortress), Ollie uses pre-written templates per PAC-ISE-003. In Phase 3, Ollie generates contextual messages within ISE constraints.

**Ollie NEVER says:**
- "Your Z-score is +0.75" — Users don't know what Z-scores are
- "Your SMA sub-score weighted average is..." — Technical jargon
- "Band 3 Faint Green pre-signal detected" — System language

**Ollie DOES say:**
- "Your stress recovery has been getting stronger. That breathing exercise seems to be helping."
- "I noticed things have shifted a bit this week. Nothing to worry about — just want to check in."
- "You're doing great. Whatever you're doing, keep it up."

### 19.6 Ollie Expression Alignment

Ollie's expression (color, behavior) matches the tile rim color in Row 1 (see ISE Canon v3.0 for full specification):

| State | Tile Rim | Ollie Expression |
|-------|----------|-----------------|
| Green (on track) | Default | Calm, happy |
| Orange (attention) | Orange | Concerned, alert |
| Red (clinical) | Orange rim | Urgent, supportive |

### 19.7 Blink Escalation

If user ignores Orange/Red state (see ISE Canon v3.0):

| Time | Action |
|------|--------|
| 0 sec | Status displayed |
| 10 sec | Icon blinks |
| 1 min | Icon blinks again |
| After 1 min | Notification: "Ollie was looking for you" |

---

## 20. V-VALUE CONTRIBUTION

Beacon is computed from V1 + V2 + V3 + V4:

| V-Value | What Contributes |
|---------|-----------------|
| **V1 (Biometric)** | HRV trend, Resting HR, Sleep metrics, InBody, Labs, VO₂max, Phase Angle |
| **V2 (Behavioral)** | FAB completion, Grit, Habits, Mood, Effort |
| **V3 (Contextual)** | Chronotype alignment, Social Jet Lag, Calendar, Space-State |
| **V4 (Interventional)** | ITB adherence, GLP-1, Supplements, Treatment compliance |

**V1 + V2 + V3 + V4 → Clinical Intersection → Beacon Score**

Exact formulas for how V1-V4 combine into each composite are defined in the individual White Papers (WP-002 through WP-009). The Beacon Framework defines the universal grammar; the White Papers define the specific vocabulary for each score.

---

## 21. BEACON ↔ DYNAMIC PROFILE CONNECTION

```
BEACON 🧭 (Universal Grammar + Row 5 Tracker)
    │
    │ Guides
    ▼
DYNAMIC PROFILE / MY BLUEPRINT (Row 1, Tile 3)
    │
    │ Through the "corridor"
    ▼
CLINICAL INTERSECTION AVOIDANCE
    │
    │ Control Theory of Maxwell
    ▼
PROACTIVE CORRECTION → Stay GREEN, avoid ORANGE
```

### Key Insight

- Beacon is the **guidance signal**
- Connected to **My Blueprint** (evolution: Memory Lane → Dynamic Profile → My Blueprint)
- Based on **stability** (Control Theory of Maxwell)
- **Proactive** — triggers at 80-84 (Faint Green) BEFORE Light Orange
- Memory Snap = single moment; Memory Lane = timeline inside My Blueprint

---

## 22. ISE INTERACTION WITH BEACON

**Canon reference:** ISE Canon v3.0 — §10 (ISE and Scoring), §13 (ISE and BioSnap / Parking Lot — delivery matrix), §3.1 (Two-Lane Authority). Beacon is **Lane 1** for tile rims, scoring weights, and presentation; credit issuance/eligibility is **Lane 2** (S5), per ISE Canon v3.0 §15.

### 22.1 How ISE Affects Scoring

Identity State Expressions (ISE-0 through ISE-6) modify HOW scores are calculated, not what scores mean. The Beacon bands remain constant — Band 2 is ALWAYS Med Green (85-94) regardless of ISE. But the WEIGHTS within composite formulas can shift by ISE state. See Section 16 for Dynamic Weighting Principle. (*ISE Canon v3.0 §10.*)

```
WHAT ISE CHANGES:        Sub-score weights within composites
WHAT ISE DOES NOT CHANGE: Band thresholds, mapping function, response protocols
```

### 22.2 ISE as Canonical State Authority

Per ISE Canon v3.0 (Canonical State Authority Rule): "No AI agent within BariAccess™ may independently infer, interpret, or override the user's readiness, protection level, or capacity outside the resolved ISE state."

ISE governs (Lane 1 — ISE owns presentation):

| Component | How ISE Controls It |
|-----------|-------------------|
| Identity Icons (Row 4) | Posture, saturation, motion |
| Buttons/CTAs | Which appear, how many, order |
| Ollie | Tone, frequency, templates allowed |
| BioSnap | When to trigger, what to show |
| Daily Pulse (Row 5) | What status to display |

### 22.3 ISE Transition Triggers Related to Beacon

| From → To | Trigger | Scoring Impact |
|-----------|---------|---------------|
| ISE-0 → ISE-1 | Sufficient V1 data accumulated (7+ days) | Weights shift from behavioral-heavy to balanced |
| ISE-1 → ISE-2 | User enters recovery phase (post-ITB, post-event) | Recovery sub-scores weighted higher |
| ISE-1 → ISE-3 | User requests simplified view OR cognitive load detected | Subjective metrics emphasized, complexity reduced |
| Any → ISE-5 | Band 7 (Red) sustained | Physiological weighted highest, provider exercises 51% directly |
| ISE-5 → ISE-1 | Provider releases governance | Weights return to standard |

ISE-4 (Building/Momentum) and ISE-6 (Exploratory/Low-Signal) weight-shift rules: Phase 2 — to be defined.

---

## 23. UPDATES GOVERNANCE

### 23.1 Badge on Beacon

| Element | Description |
|---------|-------------|
| **Badge Location** | On Beacon tile (Row 5, Position 3) |
| **Badge Content** | "1 new" indicator if updates exist |
| **Tap with Badge** | Shows update count |
| **Flow** | Updates delivered via BioSnap, badge indicates pending |

### 23.2 Updates Flow Channels

| Channel | Content | When |
|---------|---------|------|
| **BioSnap** | Time-sensitive updates, Ollie/Max delivery | ISE-0, ISE-1, ISE-4, ISE-6 |
| **Parking Lot** | Non-essential updates (parked) | ISE-2, ISE-3, ISE-5 |
| **3-Dots Menu** | Full update history / inbox | Anytime user wants |
| **Badge on Beacon** | "1 new" indicator | Always visible if updates exist |

---

## 24. UPDATE SOURCES

| Source | Description | Example |
|--------|-------------|---------|
| **Uploads / Provider** | Any file upload (labs, tests, blood work, patient files) | Lab results, blood work |
| **System** | Clinical Intersection detected (V1+V2+V3+V4) | Biometric collision |
| **Ollie / Behavioral** | FAB completion, drift, erosion, achievement | "Great job on FAB" |
| **ITB** | Interventional Therapeutic Blocks | GLP-1 titration, HRT |

---

## 25. UPDATE TYPES

| Type | Sub-Types | Priority |
|------|-----------|----------|
| **Clinical** | Labs, Tests, Uploads, Clinical Intersection | Priority 1 / Critical |
| **Behavioral** | FAB completion, drift, erosion, self-harm signs | Priority 1 / Critical |
| **Motivational** | GoodSnap, Streak, Milestone, Tier Progress | Standard |
| **Administrative** | Tier/Lifecycle, Settings, Merchant, System | Standard |

**Key Insight:** Clinical AND Behavioral can BOTH be Critical — Behavioral is NOT automatically lower priority.

---

## 26. UPDATE FLOWS

### Flow A: Clinical / Labs / Uploads

```
ANY UPLOAD (Labs, Tests, Blood work, Patient files)
        │
        ▼
SYSTEM RECEIVES FILE
        │
        ▼
ASKABA (MAX) REVIEWS & ANALYZES
        │
        ▼
PROVIDER INBOX (with AI analysis)
        │
        ▼
PROVIDER REVIEWS & APPROVES MESSAGE
        │
        ▼
ASKABA (MAX) RECEIVES APPROVED MESSAGE
        │
        ▼
ASKABA 🪶 ACTIVATES (Purple rim)
        │
        ▼
OLLIE 🦉 ANNOUNCES:
"Hey Tom, Max wants to talk to you. Can you take time?"
        │
        ▼
CLIENT SAYS YES
        │
        ▼
MAX 🪶 SPEAKS DIRECTLY TO CLIENT
(Zero temperature, clinical, precise)
```

### Flow B: Clinical Intersection (System)

```
V1 + V2 + V3 + V4 → CLINICAL INTERSECTION DETECTED
        │
        ▼
SYSTEM GENERATES ALERT
        │
        ▼
ASKABA (MAX) ANALYZES
        │
        ▼
PROVIDER INBOX (reviews intersection)
        │
        ▼
PROVIDER APPROVES/ADJUSTS MESSAGE
        │
        ▼
ASKABA 🪶 ACTIVATES (Purple rim)
        │
        ▼
OLLIE 🦉 ANNOUNCES → CLIENT AGREES → MAX SPEAKS
```

### Flow C: ITB - CPIE (Medication)

```
TITRATION / MEDICATION (GLP-1, HRT, Supplements)
        │
        ▼
ASKABA (MAX) ANALYZES
        │
        ▼
PROVIDER REVIEWS & APPROVES
        │
        ▼
ASKABA → OLLIE ANNOUNCES → CLIENT AGREES → MAX SPEAKS
```

### Flow D: ITB - CCIE (Education)

```
CCIE CONTENT (Red light therapy, Vibration plates, Light therapy)
        │
        ▼
ASKABA (MAX) REVIEWS
        │
        ▼
OLLIE SPEAKS (Skips provider)
```

### Flow E: Behavioral

```
FAB COMPLETION / ACHIEVEMENT / DRIFT / EROSION
        │
        ▼
ASKABA (MAX) REVIEWS FIRST
(Zero temperature, well-trained guardrails)
        │
        ▼
MAX DECIDES: "Can Ollie speak?"
        │
        ├── YES (Safe, verified) → OLLIE SPEAKS
        │
        └── NO (Concern: self-harm, crisis) → PROVIDER NOTIFIED
```

### Flow F: Motivational

```
MOTIVATIONAL EVENT (GoodSnap, Tier Progress, Credits, Streak)
        │
        ▼
ASKABA (MAX) REVIEWS FIRST
        │
        ▼
MAX DECIDES → OLLIE SPEAKS (if approved)
```

### Flow G: Administrative

| Sub-Type | Flow |
|----------|------|
| **Tier Progression / Lifecycle** | OLLIE DIRECT (objective, system-filtered via PQIS/QMQN) |
| **Settings - Allowed** | OLLIE DIRECT (premade responses) |
| **Settings - Other** | Max → Provider |
| **Merchant** | OLLIE DIRECT (pre-vetted by Provider) |
| **System Update / Maintenance** | OLLIE DIRECT (informational) |

---

## 27. ISE STATE DELIVERY BEHAVIOR

### 27.1 Summary Table

| ISE State | Name | Updates Behavior |
|-----------|------|-----------------|
| **ISE-0** | Neutral / Baseline | ✅ ALL DELIVER normally |
| **ISE-1** | Aligned / Available | ✅ ALL DELIVER normally |
| **ISE-2** | Protective / Recovery-Forward | 🅿️ PARK non-essential (Clinical delivers) |
| **ISE-3** | Contained / Load-Limited | 🅿️ PARK non-essential (Clinical delivers) |
| **ISE-4** | Building / Momentum | ✅ ALL DELIVER normally |
| **ISE-5** | Restricted / Guarded | 🅿️ PARK non-essential (Clinical/Medication delivers) |
| **ISE-6** | Exploratory / Low-Signal | ✅ ALL DELIVER (gently) |

### 27.2 Delivery Matrix by ISE State

| Update Type | ISE-0 | ISE-1 | ISE-2 | ISE-3 | ISE-4 | ISE-5 | ISE-6 |
|-------------|-------|-------|-------|-------|-------|-------|-------|
| **Clinical/Labs** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Clinical Intersection** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ITB - CPIE (Medication)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ITB - CCIE (Education)** | ✅ | ✅ | 🅿️ | 🅿️ | ✅ | 🅿️ | ✅ |
| **Behavioral** | ✅ | ✅ | 🅿️ | 🅿️ | ✅ | 🅿️* | ✅ |
| **Motivational** | ✅ | ✅ | 🅿️ | 🅿️ | ✅ | 🅿️ | ✅ |
| **Administrative** | ✅ | ✅ | 🅿️ | 🅿️ | ✅ | 🅿️ | ✅ |

**🅿️*** = Parks UNLESS critical concern (self-harm) → Then delivers to Provider immediately

### 27.3 ISE-5 Rationale (Restricted / Guarded)

- **Safety first** — Clinical and medication cannot be delayed
- **Respect user state** — ISE-5 means user is guarded, don't overwhelm
- **Park, don't delete** — Updates wait in Parking Lot until ISE changes
- **Exception for critical behavioral** — Self-harm signs still go to Provider immediately
- **Provider exercises 51% directly** — Active clinical governance in this state

### 27.4 ISE-6 Rationale (Exploratory / Low-Signal)

- **Learning mode** — System needs to understand user
- **User is exploring** — Open to receiving information
- **Gentle tone** — Ollie asks, doesn't push
- **Everything flows** — Unlike ISE-5, ISE-6 is receptive

---

## 28. PRIORITY CLASSIFICATION

| Priority | Types | Examples | Flow |
|----------|-------|---------|------|
| **CRITICAL** | Clinical OR Behavioral | ER situation, self-harm signs, biometric collision, major behavioral crisis | Always deliver, Provider notified |
| **Priority 1** | Clinical, Behavioral | Labs, titration, intersection, FAB erosion | Max → Provider → Max → Ollie → Max speaks |
| **Standard** | CCIE, Motivational, Administrative | Education, tier, merchants | Max reviews → Ollie speaks OR Ollie direct |

---

## 29. BEACON VS OTHER TRACKERS

| Tracker | Type | Question It Answers |
|---------|------|-------------------|
| **FAB 🎯** | Behavioral | "Am I doing my behaviors?" |
| **ITB 💊** | Interventional | "Am I following my treatment?" |
| **Beacon 🧭** | Outcome (Guidance) | **"Am I on course?"** |
| **Routine ⭐** | Foundation (Container) | "Is my container protected?" |
| **Productivity ⚡** | Light Signal | "Am I getting things done?" |
| **Parking Lot 🅿️** | Cognitive Load | "What's parked/deferred?" |

### Beacon vs Routine

| Tracker | Status | If RED |
|---------|--------|--------|
| **Routine ⭐** | PREMIUM (gold border) | More severe — container broken, ALL trackers affected |
| **Beacon 🧭** | SPECIAL treatment | Warning — off course, attention needed |

**Both governed by V1+V2+V3+V4 Clinical Intersection**

---

## 30. VALIDATION TEST CASES

Four characters validate the Beacon Framework across the full band spectrum. Complete math from WP-002 (ABA-SBL™).

### 30.1 Character 1: MARIA — Band 2 (Med Green) 🟢🟢

| Field | Value |
|-------|-------|
| Age | 42, Female |
| Profile | 14 months post-sleeve, lost 85 lbs, maintaining |
| Device | Oura Ring Gen 3 (all 6 SMA components) |
| Chronotype | Bear |
| ISE | ISE-1 (Aligned/Available) |
| Tenure | 10 months post-Embarkment |

**SMA Calculation (6 components, confidence 100%):**

| Component | Value | Reference (42F) | Z-Score | Weight |
|-----------|-------|-----------------|---------|--------|
| C1: ln(RMSSD) nocturnal | 38ms → ln=3.64 | Median 25ms → ln=3.22, σ=0.55 | +0.76 | 0.30 |
| C2: RMSSD 7-day slope | +0.5 ms/day | Stable=0, σ≈0.4 | +1.25 | 0.10 |
| C3: RHR morning | 62 bpm | μ=72, σ=12, INVERTED | +0.83 | 0.25 |
| C4: RHR 7-day slope | -0.3 bpm/day | Stable=0, σ≈0.5, INVERTED | +0.60 | 0.10 |
| C5: Resp Rate sleep | 13.0 br/min | μ=14, σ=2.5, INVERTED | +0.40 | 0.15 |
| C6: Skin Temp Dev | +0.15°C | μ=0, σ≈0.5, INVERTED | +0.70 | 0.10 |

```
SMA_Z = 0.30(+0.76) + 0.10(+1.25) + 0.25(+0.83)
      + 0.10(+0.60) + 0.15(+0.40) + 0.10(+0.70)
SMA_Z = 0.228 + 0.125 + 0.208 + 0.060 + 0.060 + 0.070
SMA_Z = +0.751

Piecewise: Z=+0.751 → Score = 85 + (0.751 - 0.7) × 12.5 = 85.6
SMA = 85.6 → Band 2: Med Green ✅
```

**CIR Calculation (bounded scoring, never blank):**

| Component | Value | Score | Weight |
|-----------|-------|-------|--------|
| E1: Mood trend (7-day slope) | +0.8 | clip(50 + 0.8×25) = 70 | 0.25 |
| E2: PLI count | 2 items | 100 × e^(-0.30) = 74.1 | 0.15 |
| E3: Coping FAB adherence | 6 of 7 days | 85.7 | 0.25 |
| E4: Stress self-report (PSS) | Low (2/16) | 87.5 | 0.25 |
| E5: Space-State | Protected | 90 | 0.10 |

```
CIR = 0.25(70) + 0.15(74.1) + 0.25(85.7) + 0.25(87.5) + 0.10(90)
CIR = 80.9 → Band 3: Faint Green
```

**RSI Calculation (hybrid — R1 corrected formula):**

| Component | Value | Score | Weight |
|-----------|-------|-------|--------|
| R1: HRV recovery half-life | tau = 18h | clip(100 - (18×0.8), 20, 100) = 85.6 | 0.40 |
| R2: Sleep quality recovery | 95% baseline in 2 nights | 95.0 | 0.25 |
| R3: FAB stability post-stress | Stable (no drift) | 95.0 | 0.35 |

```
RSI = 0.40(85.6) + 0.25(95.0) + 0.35(95.0)
RSI = 34.2 + 23.8 + 33.3 = 91.3 → Band 2: Med Green
```

**ABA-SBL Composite:**

```
SBL = 0.30(CIR) + 0.40(SMA) + 0.30(RSI)
SBL = 0.30(80.9) + 0.40(85.6) + 0.30(91.3)
SBL = 24.3 + 34.2 + 27.4 = 85.9 → Band 2: Med Green ✅
```

**System Response:** Corridor protection. Credits flow normally. Ollie (Fortress): "You're doing great." Standard FABs, positive cadence. Monthly Barista check-in.

---

### 30.2 Character 2: JAMES — Band 4 (Light Orange) with Pre-Signal 🟠

| Field | Value |
|-------|-------|
| Age | 51, Male |
| Profile | 8 months post-bypass, lost 110 lbs, holiday season approaching |
| Device | Whoop 4.0 (NO skin temp — 5 components, confidence 90%) |
| Chronotype | Wolf |
| ISE | ISE-1 (Aligned/Available) |
| Tenure | 5 months post-Embarkment |

**SMA = 75.1 → Band 4: Light Orange** (C6 unavailable, weights redistributed)

**CIR = 62.1 → Band 6: Dark Orange** (mood declining, PLI 4 items, Challenging Space)

**RSI = 79.7 → Band 4: Light Orange** (recovery adequate but slowing)

```
SBL = 0.30(62.1) + 0.40(75.1) + 0.30(79.7)
SBL = 18.6 + 30.0 + 23.9 = 72.6 → Band 4: Light Orange
```

**Critical insight — Pre-Signal by TREND, not position:**

```
2 weeks ago:  SBL = 82 (Faint Green)
1 week ago:   SBL = 78 (Light Orange — crossed down)
Today:        SBL = 72.6 (Light Orange — still dropping)
Drop = 9.4 points in 14 days → Approaching velocity threshold
```

**System Response:** Guardian FAB watching CIR decline. Ollie (Fortress): "The holidays can shift things." Wedge FAB on standby. Barista NOT notified yet (Light Orange doesn't trigger). Program generated via BioSnap. Credits offered for any coping FAB completion. **This is pre-signal by TREND, not position.**

---

### 30.3 Character 3: DIANE — Band 4 (Light Orange) Stable 🟠

| Field | Value |
|-------|-------|
| Age | 58, Female |
| Profile | 3 months post-Embarkment, 6 months post-revision, lost 45 lbs, learning system |
| Device | Apple Watch Series 9 (NO skin temp) |
| Chronotype | Bear |
| ISE | ISE-1 (Aligned/Available) |

**Revised scores (stable, not declining):**

| Sub-Score | Score | Band |
|-----------|-------|------|
| CIR | 68 | Med Orange — stressed but managing, coping FABs 4/7 days |
| SMA | 72 | Light Orange — biometrics slightly below average |
| RSI | 76 | Light Orange — recovery adequate but slow |

```
SBL = 0.30(68) + 0.40(72) + 0.30(76)
SBL = 20.4 + 28.8 + 22.8 = 72.0 → Band 4: Light Orange ✅
```

**System Response:** Ollie focuses on ONE action per day (Fortress): "Just the breathing exercise today. That's enough." Credits flow for effort. Weekly Online Barista check-in (10 min Zoom). Definition Cards active (still learning). No provider alert. ITBs not recommended yet unless Light Orange persists >4 weeks.

**Diane represents the typical patient 3 months in — needs work, not failing.**

---

### 30.4 Character 4: ROBERT — Band 7 (Red) 🔴

| Field | Value |
|-------|-------|
| Age | 47, Male |
| Profile | 18 months post-bypass, regained 30 of 95 lbs lost |
| Device | Garmin Venu 3 (NO skin temp) — was desynced, just reconnected |
| Chronotype | Wolf |
| ISE | Transitioning to ISE-5 (Restricted/Guarded) |
| Behavior | Stopped wearing device 5 days last week, missed last 2 BBS appointments |

**SMA = 61.7 → Band 6: Dark Orange** (only 2 days fresh data, confidence 47%, only 3 of 6 components)

**CIR = 24.5 → Band 7: Red** (not logging mood 10 days, PLI 11 items, coping FABs 1/7 days, Vulnerable Space)

**RSI = 33.4 → Band 7: Red** (HRV recovery 80h+, sleep 55% baseline, FABs Blocked)

```
SBL = 0.30(24.5) + 0.40(61.7) + 0.30(33.4)
SBL = 7.4 + 24.7 + 10.0 = 42.1 → Band 7: Red ✅
```

**System Response (Immediate):**

| Action | Who | Timing |
|--------|-----|--------|
| Clinical Intersection detected | System (automatic) | Immediate |
| ISE transitions to ISE-5 (Restricted/Guarded) | System | Immediate |
| Provider dashboard flags Robert | AskABA (Max) | Immediate |
| Provider exercises 51% directly | Provider makes decisions | Within 24h |
| Master Barista outreach — phone call, not app notification | Master Barista | Same day |
| Ollie sends ONE compassionate message (Fortress): "Robert, we're here. No pressure." | Ollie | Once. No repeat. |
| No credits pressure, no FAB demands | System protects, does not push | Ongoing |
| Grace period on scoring | Scores hold with declining confidence indicator | 7-14 days |
| BBS recovery pathway activates | Chatbot → Online Barista → On-site if willing | When Robert responds |
| Light ITB re-entry pathway offered | Simple restart — one FAB, one segment, one win | When ready |
| Weight regain flag (30 lbs) | Separate clinical pathway for provider review | Provider reviews |

**Robert's story IS the Obesity Research Sandbox in action.** Device dark (V1 gap) → Mood logs stopped (V2 gap) → Appointments missed (behavioral erosion) → Weight regaining (clinical signal). Exactly the pattern seen in 9,000 patients. System detected through multiple signals converging. Response is compassionate, not punitive.

---

### 30.5 Summary Table

| Character | Age/Sex | SBL Score | Band | CIR | SMA | RSI | Key Teaching Point |
|-----------|---------|-----------|------|-----|-----|-----|--------------------|
| **Maria** | 42F | 85.9 | Med Green 🟢🟢 | 80.9 | 85.6 | 91.3 | Strong across all dimensions — system in corridor |
| **James** | 51M | 72.6 | Light Orange 🟠 | 62.1 | 75.1 | 79.7 | Trend is the pre-signal, not current position |
| **Diane** | 58F | 72.0 | Light Orange 🟠 | 68 | 72 | 76 | Typical patient 3 months in — needs work, not failing |
| **Robert** | 47M | 42.1 | Red 🔴 | 24.5 | 61.7 | 33.4 | Full erosion — clinical intersection, compassionate response |

### 30.6 Issues Found and Corrected During Testing

| # | What Broke | Fix Applied |
|---|-----------|-------------|
| 1 | Sigmoid with k=1.5 failed — average person landed in Red | Sigmoid REPLACED with piecewise linear mapping |
| 2 | R1 formula too harsh — exponential gave 68.7 for fast recovery (tau=18h) | REPLACED with clip(100 - (tau×0.8), 20, 100). tau=18h now gives 85.6 |
| 3 | Maria scored Faint Green instead of Med Green | R1 fix brought RSI from 84.5 to 91.3, SBL from 83.9 to 85.9 |
| 4 | James supposed to show pre-signal but scored Light Orange | Revealed pre-signal is RATE OF CHANGE not just position. Added velocity rule. |
| 5 | Pre-signal rule was missing velocity trigger | ADDED: Triggers when score in Band 3 OR drops >10 points in 14 days |
| 6 | Diane's original biometrics were too poor — scored Red instead of Light Orange | Adjusted to represent typical average patient |
| 7 | CIR missing data had no default | ADDED: When mood logs or stress self-report missing, default score = 30 |
| 8 | Original SMA weights didn't sum correctly for missing data | Confirmed redistribution math: weights rescaled proportionally, confidence reported |

---

## 31. PROPRIETARY ELEMENTS

### 31.1 Trade Secrets

| Element | Status |
|---------|--------|
| 7-band architecture with asymmetric widths | Trade secret |
| Piecewise linear mapping with clinically-justified breakpoints | Trade secret |
| "Average = Light Orange" design philosophy | Trade secret |
| Pre-signal detection via position + velocity | Trade secret |
| Band-specific response protocols with graduated governance | Trade secret |
| Confidence indicator system with FAB-first resilience | Trade secret |
| Missing data = behavioral signal philosophy | Trade secret |
| Constellation Panel 5-row display architecture | Trade secret |
| ISE-dependent weight adjustment within fixed bands | Trade secret |
| Band transition hysteresis with Red exception | Trade secret |
| 5-pathway data resilience model with BBS infrastructure | Trade secret |
| Hybrid maturation normalization (clinical → personal → population) | Trade secret |
| Routine as ground truth for missing data triage | Trade secret |
| Device capability registration at Embarkment D0 with single-formula approach | Trade secret |

### 31.2 Patentable Innovations

| Element | Status |
|---------|--------|
| R&R apex with 8-composite hierarchy feeding single master score | Patentable |
| Behavioral biometric (FAB) integration into clinical scoring framework | Patentable |
| Multi-stream (V1-V4) observation model with ITB correction loops | Patentable |
| Piecewise linear mapping method: "A method for mapping physiological Z-scores to a 7-band clinical response system using clinically-justified breakpoints derived from population reference data and 9,000-patient bariatric experience" | Patentable |
| Post-stress FAB stability as recovery biomarker (R3 component in RSI, see WP-002) | Patentable |

---

## 32. REFERENCES

1. Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. Heart rate variability: standards of measurement, physiological interpretation, and clinical use. *Circulation.* 1996;93(5):1043-1065.

2. Shaffer F, Ginsberg JP. An overview of heart rate variability metrics and norms. *Front Public Health.* 2017;5:258.

3. Tegegne BS, Man T, van Roon AM, Riese H, Snieder H. Reference values of heart rate variability from 10-second resting ECGs: the Lifelines Cohort Study. *Eur Heart J Digital Health.* 2020;1(1):28-30.

4. Andrade C. Z scores, standard scores, and composite test scores explained. *Indian J Psychol Med.* 2021;43(6):555-557.

5. OECD. Handbook on constructing composite indicators: methodology and user guide. Paris: OECD Publishing; 2008.

6. Spiegelhalter D, Sherlaw-Johnson C, Bardsley M, et al. Statistical methods for healthcare regulation: rating, screening, and surveillance. *J R Stat Soc A.* 2012;175(1):1-47.

7. Palatini P. Need for a revision of the normal limits of resting heart rate. *Hypertension.* 1999;33:622-625.

8. Cohen S, Kamarck T, Mermelstein R. A global measure of perceived stress. *J Health Soc Behav.* 1983;24(4):385-396.

9. Peabody JE, et al. A systematic review of HRV as a measure of stress in medical professionals. *Cureus.* 2023;15(2):e34937.

10. Plews DJ, et al. Training adaptation and heart rate variability in elite endurance athletes. *Int J Sports Physiol Perform.* 2013;8(6):688-694.

11. Walker MP. *Why We Sleep: Unlocking the Power of Sleep and Dreams.* New York: Scribner; 2017.

12. Cretikos MA, Bellomo R, Hillman K, et al. Respiratory rate: the neglected vital sign. *Med J Aust.* 2008;188(11):657-659.

---

## 33. DOCUMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| **v1.1** | March 12, 2026 | Alignment with R&R Calculation Canon Pass 3: §15 Scoring Hierarchy updated to Pass 3 canonical composite names (SRC, SBL, MBC, MEI, AMP, BCI, CRC, BHR) and sub-score example (CIR, SMA, RSI under SBL). §30 Validation Test Cases and all narrative references updated from legacy ERO/PSL/SRA to CIR/SMA/RSI. Diagram, tables, Path A/B/C examples, missing-data text, and summary table updated. No band thresholds or formulas changed. |
| **v1.0** | January 30, 2026 — 10:30 PM | Initial Beacon Canon created with: Name change (Stability → Beacon), Color bands (7 bands), Program trigger (80-84%), V-Value contribution, Dynamic Profile connection, Complete Updates governance (Sources, Types, Flows, ISE behavior, Priority) |
| **v1.1** | February 20, 2026 | Sync with ISE Canon v3.0: all references updated from ISE Canon v2.0 to ISE Canon v3.0 (single source of truth). Cross-References table updated. No substantive Beacon content changed. |
| **v1.1** | February 17, 2026 | Sync with ISE Canon v2.0: all references updated from ISE Canon v1.0 / ISE & Ollie Canon v1.0 to ISE Canon v2.0 (single source of truth). Cross-References table consolidated. No substantive Beacon content changed. |
| **v1.1** | February 10, 2026 | Major update incorporating WP-001 (Beacon Framework White Paper) and Feb 8–9 Foundation Reconciliation & Scoring Architecture session. Added: Dual Identity (Section 2), Band names reconciled (Strong Green / Med Green / Faint Green / Light Orange / Med Orange / Dark Orange / Red), Piecewise Linear Mapping Function with breakpoint rationale and clinical citations (Section 6), 3-Stage Normalization Pipeline (Section 7), 3 Normalization Paths A/B/C (Section 8), Hybrid Maturation (Section 9), Pre-Signal Detection System with position + velocity dual trigger and parallel Program trigger per Program Canon v1.1 (Section 10), Confidence Indicators with 4 levels (Section 11), Missing Data Philosophy with default 30, Routine as Ground Truth, Never Blank rule (Section 12), 5-Pathway Data Resilience Model with BBS infrastructure (Section 13), Device Capability Handling at Embarkment D0 (Section 14), Scoring Hierarchy R&R → 8 composites → 24 sub-scores → 80+ components (Section 15), Dynamic Weighting Principle by ISE state (Section 16), System Response Protocol by Band with dual Ollie column Fortress + Phase 3 (Section 17), Temporal Behavior with smoothing and hysteresis (Section 18), Constellation Panel Display with interaction model referenced from Constellation Panel Canon (Section 19), ISE references updated to ISE Canon v2.0 (Sections 22, 27), Validation Test Cases with 4 characters and complete math (Section 30), Proprietary Elements expanded to 14 trade secrets and 5 patentable innovations (Section 31), 12 peer-reviewed references added (Section 32). Cross-references established to: Program Canon v1.1, ISE Canon v1.0, ISE & Ollie Canon v1.0, Constellation Panel Canon, Routine Canon v1.0, WP-002 (ABA-SBL™). |

---

## 34. DOCUMENT STATUS

| Attribute | Value |
|-----------|-------|
| **Document** | Beacon Canon |
| **Version** | v1.1 |
| **Date** | February 10, 2026 |
| **Author** | Dr. Valeriu Andrei, MD, FACS, FASMBS |
| **Status** | ✅ CANONICAL — LOCKED |
| **Supersedes** | Beacon Canon v1.0 (January 30, 2026) |
| **Extensible** | ✅ Yes — Will evolve |
| **No Hallucination** | ✅ Confirmed |
| **Proprietary Elements** | 14 trade secrets, 5 patentable innovations |
| **ISE Canon v3.0 alignment** | ✅ Compliant. Beacon = Lane 1 (tile rims, §19; scoring weights, §16/§22); delivery matrix §27 aligns with ISE Canon v3.0 §13; credits = Lane 2 (S5) per §15. |
| **Dependencies** | All WP-002 through WP-010 reference this document |

### Cross-References

| Document | Relationship |
|----------|-------------|
| **WP-002 (ABA-SBL™)** | First composite score implementing Beacon Framework. Template for WP-003 through WP-009. |
| **Program Canon v1.1** | Program trigger fires in parallel with Pre-Signal Detection at Faint Green and velocity threshold. |
| **ISE Canon v3.0** | **Alignment source.** §10 ISE and Scoring; §13 delivery matrix; §15 ISE and Credits (S5 Lane 2); §3.1 Two-Lane Authority. Single source of truth for 7 states, tile rims, Fortress, Blink escalation. Beacon = Lane 1 (presentation/scoring); credits = Lane 2 (S5). |
| **Constellation Panel Canon** | 5-row structure, interaction model (TAP/PRESS/DOUBLE TAP), Blip Card, Press Card specs. |
| **REF_Beacon_Band_Label_Mapping_WP001_vs_Beacon_Canon.md** | Maps WP-001 band labels to this Canon’s canonical names (Strong Green, Med Green, etc.). |
| **Grit Engine Canon v1.0** | S5 Credits Engine; Grit multiplier feeds credits. Aligns with this Canon §17 (credit/tone by band: no pressure in Red, credits maintained in Orange). |
| **Routine Canon v1.0** | Routine as foundation container. Ground truth for missing data triage. PREMIUM status. |

### Governance Summary

| Gatekeeper | When Used |
|-----------|-----------|
| **Max (AskABA)** | ALL clinical, behavioral with concern, ITB-CPIE, settings needing review |
| **Provider** | Clinical decisions, medication, emergencies, behavioral concerns. Exercises 51% directly in ISE-5. |
| **Ollie Direct** | Tier progression, pre-approved settings, merchants, system updates, motivational (after Max approval) |

**Key Principle:** Max is the GATEKEEPER for everything except objective system-calculated events (Tier, Credits), pre-approved/premade responses, and already-vetted content (Merchants, System updates).

---

**END OF BEACON CANON v1.1**

---

*This document is the canonical reference for Beacon (formerly Stability) in the BariAccess™ platform. It defines the universal 7-band scoring grammar, the piecewise linear mapping function, normalization pipelines, pre-signal detection, confidence indicators, missing data philosophy, scoring hierarchy, system response protocols, temporal behavior, and updates governance. All implementations, discussions, and future updates should reference this document.*
