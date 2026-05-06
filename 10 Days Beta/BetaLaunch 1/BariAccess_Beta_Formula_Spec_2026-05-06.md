# BariAccess Beta — Grit / Effort / Mood / SC Formula Spec

**Document ID:** BETA-FORMULA-001
**Version:** v1 (May 6, 2026)
**Author:** Valeriu E Andrei MD, President — BariAccess LLC
**Audience:** Zakiy (backend implementation reference)
**Linked canon:**
- Effort Score lock — March 17, 2026
- LC (Learning Coefficient) lock — March 17, 2026
- Mood normalization — V2 Behavioral canon
- Grit Engine §4.1 Hourglass Path lock — March 4, 2026
- SC formula — locked

---

## Purpose

Complete biostatistical specification for all scoring formulas Zakiy needs to implement during the May 7–17 beta window. Every value is either marked **[CANON-LOCKED]** (verified from prior canon) or **[BIOSTAT-COMMITTED]** (proposed and defended for beta-specific operationalization).

No placeholders. Every formula is shippable as-written.

---

## 1. Mood Score [CANON-LOCKED]

**Source:** AM JotForm Q6 (mood AM), PM JotForm Q1 (overall day mood), Bookend warm-up + cool-down (per-FAB mood), 1 PM nudge Q2.

### Normalization Formula

```
Mood_normalized = (Mood_raw − 1) / 4.0
```

### Mapping Table

| Raw (1–5 self-report) | Label | Normalized | Beacon Mapping |
|---|---|---|---|
| 5 | Unstoppable / 🔥 Great | 1.00 | 95 |
| 4 | I'm good / 😊 Good | 0.75 | 75 |
| 3 | Surviving / 🙂 Okay | 0.50 | 50 |
| 2 | Struggling / 😐 Meh | 0.25 | 25.5 |
| 1 | Crashing / 😞 Low | 0.00 | 7 |

**Beacon mapping is non-linear** (modified linear with emotional weighting) — uses the locked sequence 7 / 25.5 / 50 / 75 / 95 not a simple ×20 multiplier.

### Storage

CosmosDB `mood_events`:

```json
{
  "event_id": "uuid",
  "user_id": "string",
  "mood_raw": 4,
  "mood_normalized": 0.75,
  "beacon_value": 75,
  "source": "am_jotform | pm_jotform | bookend_warmup | bookend_cooldown | nudge_1pm",
  "timestamp": "ISO 8601"
}
```

---

## 2. Frequency (F) [BIOSTAT-COMMITTED for beta]

**Definition:** Did the user complete the FAB on the day it was scheduled?

```
F = completed_FABs_7d / scheduled_FABs_7d
```

**Range:** 0.0–1.0
**Window:** Rolling 7 days
**Source:** `bookend_events` cool-down completion rows where `completion = "yes"`

**Beta scale:** 10 FABs/day × 7 days = 70 scheduled per cohort member per rolling window.

**Edge case:** First 6 days of beta have <70 scheduled events. Compute F using actual scheduled count for the partial window. Do not pad with zeros.

---

## 3. Consistency (C) [BIOSTAT-COMMITTED for beta]

**Definition:** Did the user complete the FAB *on time* relative to the scheduled time?

### Per-FAB Consistency Score

```
For each completed FAB i:
  delta_minutes = |actual_completion_time − scheduled_time|
  C_i = max(0, 1 − delta_minutes / window_minutes)
```

### 7-Day Rolling C

```
C = mean(C_i for FABs completed in 7-day rolling window)
```

**Range:** 0.0–1.0
**Source:** `bookend_events` cool-down rows with completion = "yes" + scheduled_time + actual_timestamp + window_minutes (from FAB definition)

**Worked example:**

| FAB | Scheduled | Window | Actual | delta | C_i |
|---|---|---|---|---|---|
| GLP-1 check | 6:00 AM | 15 min | 6:02 AM | 2 | 0.87 |
| Hydration | 5:45 AM | 10 min | 5:46 AM | 1 | 0.90 |
| Protein meal | 7:30 AM | 20 min | 7:48 AM | 18 | 0.10 |

C across these 3 = (0.87 + 0.90 + 0.10) / 3 = **0.62**

---

## 4. Learning Coefficient (LC)

### 4.1 LC Canonical [CANON-LOCKED — March 17, 2026]

```
LC = 0.30 × Quiz_PassRate
   + 0.25 × Quiz_Attempts_normalized
   + 0.25 × Content_Engagement_normalized
   + 0.20 × Ollie_Questions_normalized
```

**Range:** 0.0–1.0
**Status:** **CANNOT be computed during 10-day beta** — quizzes, content engagement tracking, and Ollie interactions are not yet shipped.

### 4.2 LC_beta [BIOSTAT-COMMITTED — beta proxy v0.1]

For the May 7–17 beta only, LC is computed using available engagement signals as biostat proxies for the canonical inputs. **Same logic** (measures engagement-seeking behavior), different inputs.

```
LC_beta = 0.40 × JotForm_CompletionRate
        + 0.30 × Nudge_ResponseRate
        + 0.30 × OptionalText_SubmissionRate
```

**Where:**

| Signal | Definition | Source |
|---|---|---|
| JotForm_CompletionRate | (completed AM + completed PM) ÷ (scheduled AM + scheduled PM), rolling 7-day | `jotform_events` |
| Nudge_ResponseRate | (responded nudges) ÷ (sent nudges), rolling 7-day, weighted by recency: weight_i = 0.95^(days_ago_i) | `nudge_events` |
| OptionalText_SubmissionRate | (text-submitted Q8 AM + Q9 PM + 1 PM Q1-reason) ÷ (opportunities), rolling 7-day | `jotform_events` + `nudge_events` |

**Range:** 0.0–1.0

**Deprecation:** When canonical LC inputs ship (quizzes, content engagement, Ollie interactions), LC_beta is replaced by canonical LC. No legacy support.

---

## 5. Effort Score (E) [CANON-LOCKED — March 17, 2026]

```
E = 0.40 × F + 0.30 × C + 0.30 × LC
```

**Range:** 0.0–1.0

**During beta:** E_beta = 0.40·F + 0.30·C + 0.30·LC_beta (substituting beta proxy per §4.2)

**Worked example for Val on Day 7:**

| Variable | Value | Source |
|---|---|---|
| F | 0.71 | 50/70 FABs completed in last 7 days |
| C | 0.62 | mean C_i across completed FABs |
| LC_beta | 0.83 | high JotForm completion + nudge response |
| **E** | **0.65** | (0.40 × 0.71) + (0.30 × 0.62) + (0.30 × 0.83) |

---

## 6. Grit Engine [CANON-LOCKED trigger, BIOSTAT-COMMITTED curve]

### 6.1 Trigger [CANON-LOCKED]

```
Grit triggered IF: Mood ≤ 0.50 AND Effort ≥ 0.60
```

### 6.2 Grit Multiplier Curve [BIOSTAT-COMMITTED]

```
When triggered:
  M = clamp(1.0 + (E − Mood) × 1.5, 1.0, 2.0)
```

**Range:** 1.0× – 2.0×

**Reasoning:** Rewards effort exerted under low mood. Scales by the *gap* between Effort and Mood — the harder you push relative to how you feel, the bigger the reward. Coefficient 1.5 calibrates so that the trigger boundary gives a small boost (~1.15×) and the floor scenario (E=1.0, Mood=0) hits the 2.0× cap.

### 6.3 Worked Examples

| Effort | Mood | Trigger? | Multiplier |
|---|---|---|---|
| 0.6 | 0.5 | ✅ Yes | M = 1.0 + (0.6 − 0.5) × 1.5 = **1.15×** |
| 0.7 | 0.4 | ✅ Yes | M = 1.0 + (0.7 − 0.4) × 1.5 = **1.45×** |
| 0.8 | 0.3 | ✅ Yes | M = 1.0 + (0.8 − 0.3) × 1.5 = **1.75×** |
| 0.9 | 0.2 | ✅ Yes | M = clamp(1.0 + 1.05) = **2.0× (cap)** |
| 1.0 | 0.0 | ✅ Yes | M = clamp(1.0 + 1.5) = **2.0× (cap)** |
| 0.5 | 0.5 | ❌ No | No multiplier (Effort below threshold) |
| 0.7 | 0.6 | ❌ No | No multiplier (Mood above threshold) |

### 6.4 Application

Multiplier applies to **CPIE/CCIE credits earned during the triggered interaction window** (the FAB cycle when both conditions are met). Base credit × M = adjusted credit written to user record.

```
adjusted_credit = base_credit × M
```

Where base_credit = 1 per qualifying FAB completion. PQIS pass adds +2 (when PQIS ships).

---

## 7. Space Multiplier (V3 Modifier) [CANON-LOCKED]

Applied **after** Grit Multiplier when context Space is captured (Bookend warm-up Space tap):

| Space | Multiplier |
|---|---|
| 🛡️ Protected | 1.0× |
| ⚡ Challenging | 1.25× |
| 💧 Vulnerable | 1.5× |
| Mix | 1.0× (default — no boost) |

```
final_credit = base_credit × Grit_M × Space_M
```

**Worked example:** Val completes a FAB at Effort 0.8, Mood 0.3, in Vulnerable space.
- base_credit = 1
- Grit_M = 1.75 (from §6.3)
- Space_M = 1.5
- final_credit = 1 × 1.75 × 1.5 = **2.625 credits**

---

## 8. Stability Coefficient (SC) [CANON-LOCKED]

```
SC = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4
```

**Each Vn already bounded 0–100** (Path B normalization, no Z-score needed).
**SC range:** 0–100.

**V2 weight = 0.35** is the highest single-domain weight — confirms behavioral primacy.

### Component sources for beta

| Variable | Source |
|---|---|
| V1 | Wearable streams (HRV, sleep, RHR, temperature) via Spike API; bounded 0–100 |
| V2 | E (Effort) + Mood blend per V2 normalization spec |
| V3 | Space distribution + chronotype alignment |
| V4 | F (FAB Frequency) — V4 effectively = adherence intensity |

V2/V3/V4 normalization formulas to 0–100 are governed by `CCO-V1-DATA-001`, `CCO-V4-DATA-001` (locked), and `CCO-V2-DATA-001`, `CCO-V3-DATA-001` (canon in progress per memory). For beta:

- **V1 bounded scoring:** use wearable's native bounded score (Oura Readiness 0–100, WHOOP Recovery 0–100, etc.) — no transformation needed
- **V2 bounded scoring:** E × 100 (since E is 0.0–1.0)
- **V3 bounded scoring:** weighted Space distribution × 100
- **V4 bounded scoring:** F × 100

Beta SC formula:

```
SC_beta = 0.25 × V1_wearable_native + 0.35 × (E × 100) + 0.20 × V3_space × 100 + 0.20 × (F × 100)
```

---

## 9. Disengagement Detection [CANON-LOCKED]

| Condition | Threshold | Action |
|---|---|---|
| E < 0.3 | 3 consecutive days | Soft nudge from Ollie ("How's your week going?") |
| E < 0.2 | 5 consecutive days | Outreach — Pamela or Val direct contact |
| No app interaction | 7 consecutive days | Win-back protocol |

Computed at end of each daily report. Flagged in Zakiy's nightly Day 11 report.

---

## 10. Implementation Notes for Zakiy

### Data flow per cohort member, per day

```
1. Wearable streams V1 (auto, throughout day)
2. AM JotForm fires 6:30 AM cohort local time
   → mood, recovery, productivity prediction, sunlight/protein/water/movement booleans
3. 10 AM nudge fires
   → V4 increments (protein/hydration/movement)
4. Per-FAB: warm-up Bookend → cool-down Bookend
   → mood_before, mood_after, completion, Space, V4 increment
5. 1 PM nudge fires
   → on-track-w/-prediction (V2+V3), mood, brilliant flag
6. 3:30 PM nudge fires
   → lunch eaten, hunger 1–10
7. PM JotForm fires ~1 hr before bedtime
   → day mood, mood arc, meals, protein, hydration, Space, sleep ambience prep
8. Nightly compute (post-cutoff):
   - F (rolling 7-day)
   - C (rolling 7-day, mean of C_i)
   - LC_beta (rolling 7-day)
   - E = 0.40·F + 0.30·C + 0.30·LC_beta
   - Mood = mean of mood_normalized for the day
   - Grit_M (if triggered)
   - SC_beta
9. Write daily rollup to `effort_daily_rollup` container
10. Generate end-of-day report (Zakiy → cohort next morning)
```

### Storage containers (additions to existing schema)

```
mood_events           — per mood capture
fab_completion        — per Bookend cool-down (already exists per BETA-BOOKEND-001)
jotform_events        — per AM/PM submission
nudge_events          — per nudge response
effort_daily_rollup   — nightly compute (F, C, LC_beta, E, Mood, Grit_M, SC_beta)
disengagement_flags   — per cohort, when thresholds breached
```

### Critical: do NOT recompute on display

Per `CCO-FAB-001-PIN-001 v1.0`, the resolver reads daily snapshot from `effort_daily_rollup`. **Do not recompute E or SC on every UI render.** Compute once nightly, store, read for display.

---

## 11. Open Items

1. Confirm V2/V3/V4 0–100 normalization formulas for SC_beta (using simplified versions in §8 — verify acceptable for 10-day window)
2. Confirm Brilliant Mood (1 PM nudge Q3) sub-tag handling — does it modify mood baseline upward or feed a separate signal?
3. Confirm whether disengagement nudges from Ollie route through campaigns feature or as ad-hoc messages
4. Confirm whether Grit Multiplier applies to a single FAB cycle or extends across the day until conditions normalize

---

## 12. Versioning

| Item | Status | Lock Date |
|---|---|---|
| E formula | CANON-LOCKED | March 17, 2026 |
| LC canonical | CANON-LOCKED | March 17, 2026 |
| LC_beta proxy | BIOSTAT-COMMITTED | May 6, 2026 (beta-only) |
| Mood normalization | CANON-LOCKED | V2 canon |
| Grit trigger | CANON-LOCKED | March 4, 2026 |
| Grit multiplier curve | BIOSTAT-COMMITTED | May 6, 2026 |
| SC formula | CANON-LOCKED | — |
| Space multipliers | CANON-LOCKED | — |
| Disengagement thresholds | CANON-LOCKED | — |
| F operationalization | BIOSTAT-COMMITTED | May 6, 2026 |
| C operationalization | BIOSTAT-COMMITTED | May 6, 2026 |

---

*BariAccess LLC — Confidential — Internal Use Only*
*Copyright © 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
