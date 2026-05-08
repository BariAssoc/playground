# BariAccess Beta — Locked Design Decisions

**Generated:** May 7, 2026
**Status:** All decisions defaulted per Claude's recommendations across 8 form reviews.
**Override rule:** Change the value in code, re-run tests. Decision number maps to inline `// VAL_DEFAULT` comments.

---

## How to read this

Each row: decision number → the question → the value locked → the source document or review where it was raised.

If Val overrides any, edit the corresponding code section and re-run tests. Each `// VAL_DEFAULT_NN` comment in the codebase corresponds to a row here.

---

## Decisions 1–12 (from VTag and form reviews)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 1 | OCEAN: V2 stream or meta-state? | **Meta-state** — separate `user_traits` container, not V-tagged | VTag review |
| 2 | `context_classifier` enum locked? | **Yes** — 11 values: stress/nutrition/sleep/productivity/mood/recovery/social/hunger/activity/hydration/medication | VTag review |
| 3 | `fab_flag` definition? | **True when row directly captures FAB attempt or completion** | VTag review |
| 4 | `archetype` field on every event row? | **Yes** — denormalized for query speed | VTag review |
| 5 | Loop-closure additions (mood prediction, P/C/V prediction, AM+PM hunger)? | **Yes — but tagged as v0.3 form additions, not blocking May 7** | AM/PM/Nudge reviews |
| 6 | Per-cohort archetype-aligned 10 AM nudge FABs? | **Yes** — see `seed/cohort-nudge-overrides.ts` | Nudge review |
| 7 | Vitamin S item on 1 PM nudge + PM JotForm? | **Yes — added to v0.3 form set** | Nudge review |
| 8 | Weekly GLP-1 compliance check (Val + Costin)? | **Yes — Sunday PM via separate nudge** | Nudge review |
| 9 | Parser smoke test May 6 evening? | **Operational decision, not code — flagged** | Nudge review |
| 10 | CCO-PREDICTION-FAB-001 candidate canon — draft after May 18? | **Yes — flagged for post-launch** | Cross-form |
| 11 | OCEAN → archetype/FAB mapping canon — draft after all forms? | **Yes — flagged for post-launch** | Cross-form |
| 12 | (a)-with-refinement on Fortress data flow? | **Confirmed by §12 of v3 spec — patient self-report writes to Fortress** | Build Spec v3 |

## Decisions 13–17 (from Formula Spec review)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 13 | Fix V2/V4 double-counting in SC_beta? | **Yes** — V2_beta = (Mood × 50) + (E × 50); V4_beta = (F × 70) + (anchors_compliance × 30); F removed from V2 derivation | Formula Spec review |
| 14 | Daily Mood aggregation: equal mean or differential weighting? | **Equal mean for beta. Differential weighting deferred to v1** | Formula Spec review |
| 15 | Grit_M scope: single FAB cycle or full day? | **Single FAB cycle** — measured at warm-up (Mood + Effort), applied to that cool-down credit | Formula Spec review |
| 16 | SC band thresholds for Day 11 report? | **5-band Path B**: Critical < 25, Yellow 25–50, Green 50–75, Optimal 75–90, Peak 90+ | Formula Spec review |
| 17 | Brilliant Mood routing: V3 chronotype validation? | **Yes — does NOT modify V2 magnitude. Feeds V3 chronotype-alignment signal** | Formula Spec review |

## Decisions 18–22 (from Handoff review)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 18 | Wake/sleep windows for 5 Methodical Achievers — placeholders or real defaults? | **Placeholders, refined from intake May 11+** | Handoff review |
| 19 | Channel preference collection — when does Val ask the cohort? | **By Wednesday May 6 evening** — operational, not code | Handoff review |
| 20 | "If test fire fails" rollback rule? | **Defer launch by 24h, escalate to Val** | Handoff review |
| 21 | May 6 evening parser smoke test on the table? | **Yes — operational** | Handoff review |
| 22 | Lana onboarding rule — May 7 with placeholders or delayed entry? | **Delayed entry; effective Day 1 = day after intake completes** | Handoff review |

## Decision 23 (from sex/gender flag)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 23 | Add Page 7 — Biological Context (sex, cycle, hormonal status) to BETA-INTAKE-001 v0.3? | **Yes — v0.3 form addition before May 11 send** | Sex/gender review |

## Decisions 24–30 (from FAB doc review)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 24 | Lana's 10 FABs — Embodied Practitioner default before May 7? | **Yes — drafted in v5** | FAB review |
| 25 | Per-Methodical-Achiever wake-time personalization before May 7? | **Operational — Val texts each woman** | FAB review |
| 26 | Auto-upgrade FABs to Red when intake reveals new medications? | **Yes — see `jobs/medication-flag-upgrade.ts`** | FAB review |
| 27 | Rationale field optional for ALL archetypes (not just MA + EP)? | **Yes — schema makes it optional everywhere, displayed where populated** | FAB review |
| 28 | Schema separation: `critical_flag` (boolean) vs `display_state` (color)? | **Yes — keep as separate fields, document the runtime resolution table** | FAB review |
| 29 | Wildcard/personal 11th FAB slot, default empty? | **Yes — 11th slot in seed, populated post-intake** | FAB review |
| 30 | Update BETA-FAB-COHORT-001 to v4/v5 with Lana included? | **Confirmed v5 received** | FAB review |

## Decision 31 (cohort)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 31 | Roychele Jones — confirm archetype, sex, GLP-1, internal firewall | **Methodical Achiever (confirmed). Sex F (likely). GLP-1 No (default). Internal No (confirmed)** | Cohort review |

## Decisions 32–33 (from FAB v5 review)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 32 | Lana #2 morning movement practice — extend window from 30 to 45 min provisionally? | **Yes — set to 45 min** | FAB v5 review |
| 33 | Embodied Practitioner archetype-specific SC weighting (V3 elevated)? | **Yes — proposed: SC_EP = 0.20·V1 + 0.30·V2 + 0.30·V3 + 0.20·V4** | FAB v5 review |

## Decisions 34–39 (from Bookend review)

| # | Question | Locked Value | Source |
|---|---|---|---|
| 34 | Capture Space at cool-down (in addition to warm-up)? | **No for beta — document warm-up-only rationale** | Bookend review |
| 35 | Mood-events + journal-entries pairing rule | **Each Bookend tap writes a row to `mood_events`. Cool-down also writes paired `mood_delta` to `journal_entries`** | Bookend review |
| 36 | Always capture mood-after on cool-down, regardless of completion? | **Yes — capture for all completion states (Yes/No/Skip)** | Bookend review |
| 37 | Required vs skippable warm-up Mood — pick one? | **Skippable — penalize via LC_beta JotForm/Nudge engagement signal** | Bookend review |
| 38 | Add `archetype` field to all event containers? | **Yes — `mood_events`, `nudge_events`, `jotform_events`, `effort_daily_rollup` all carry `archetype`** | Bookend review |
| 39 | Update Build Spec v3 → v4 (cohort 13, friction total ~80 min/day, 7 archetypes locked)? | **Flagged — operational doc update, not code** | Bookend review |

---

## Honest caveats from Claude

**Decisions where Val's intuition might differ from my default:**

- **#1 OCEAN as meta-state.** I chose meta-state for cleaner V2 signal. Some platforms (Eight Sleep, WHOOP) merge personality directly into V2 weighting. Val may prefer that approach — it's defensible.
- **#13 V2/V4 double-counting fix.** My fix is one of several valid solutions. Val could also drop F from V4 (keeping it only inside E), or compute V2 and V4 from completely orthogonal signal sets. My fix is the minimum-change version.
- **#14 Equal-weighted Mood mean for beta.** Bookend Mood (immediate, FAB-paired) is more behaviorally relevant than ambient AM/PM mood. Differential weighting (e.g., Bookend × 1.5, Ambient × 0.5) would be defensible. I chose equal for simplicity.
- **#33 EP-specific SC weighting.** This is a real canon decision, not a beta default. I generated the math, but Val should confirm before Day 11 report ships using EP-elevated weighting.

**Decisions Val should review post-Day 11:**

- All BIOSTAT-COMMITTED items in BETA-FORMULA-001 §12 — F, C, LC_beta, Grit Multiplier curve. These need calibration against real data.
- The 11-value `context_classifier` enum (#2) — likely needs 1–2 additions or merges based on what surfaces in Day 11 trend.
- Loop-closure additions (#5) — only added to v0.3 forms, not the May 7 launch forms. Day 11 will reveal whether the loops were essential.

---

*BariAccess LLC — Confidential — Internal Use Only*
*© 2026 BariAccess LLC. All rights reserved.*
