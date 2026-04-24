# README — MARK LONGITUDINAL DEMO v1.0
## Investor Meeting Brief for Zakiy

**Document type:** Cursor-ready extension specification — investor-demo edition
**Author:** BariAccess™ — Val + Claude
**Date:** April 22, 2026
**Status:** SANDBOX — investor demo build, not yet canonical
**Audience:** Zakiy (lead developer)
**Purpose:** Extend the existing Mark Beacon Playground into a four-scenario longitudinal demo for the second investor meeting. Build A → B → C → D. Add Pyramid rendering and one Journal capture moment.

---

© 2026 BariAccess LLC. All rights reserved. Confidential — Internal use only.

---

## 1 — Why this document exists

The second investor meeting is coming. We need a demo that tells the Mark story in four short scenes — not one long animation. An investor can absorb one scenario, ask a question, see the next. Four chapters beats one long arc. Each scene should be short enough to show cleanly and long enough to make its point.

This README tells you what to build. It is additive. Nothing already in place gets rebuilt.

---

## 2 — What to read first (in this exact order)

Before you touch a line of code:

1. **`CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md`** — the original four-panel playground. You already built this. Refresh on the sliders, formula engine, Beacon corridor, ISE resolver.
2. **`CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md`** — yesterday's extension. Three scenarios (Scenarios 5, 6, 7), six FABs, Play Sequence button. This is the foundation for today's work.
3. **This README.** It supersedes the three-scenario version. The new sequence is four scenarios (A, B, C, D), with the Pyramid and the Journal added.

Read in order. Build additively. When in doubt, the canonical references at the bottom of this document win.

---

## 3 — What's new vs. yesterday

Three changes:

1. **Four scenarios, not three.** The arc becomes A → B → C → D. Scenarios 5, 6, 7 from yesterday are conceptually replaced by A, B, C, D — but yesterday's asset files stay in place; we add new presets alongside them.
2. **R&R Pyramid rendering added.** A new visual panel shows the 8 composite scores (SRC, SBL, MBC, MEI, AMP, BCI, CRC, BHR) and how they move across scenarios.
3. **Journal surface added.** One scenario (Scenario B) triggers a Journal capture — tap-only prompts, investor-visible.

Everything else from yesterday — the six FABs, the SC formula, the Beacon bands, the ISE resolver, the Ollie/Max caption area, the Play Sequence button — stays exactly as built.

---

## 4 — The four scenarios at a glance

Mark is 64 years old, 6'3". On tirzepatide (Zepbound) weekly injection program. The four scenarios span a roughly five-month arc.

| # | Scenario | V1 | V2 | V3 | V4 | SC | Band | ISE |
|---|---|---|---|---|---|---|---|---|
| A | Mark — Good Time (Nov 2025) | 94 | 88 | 92 | 92 | 91.6 | Band 2 Green | ISE-4 Momentum |
| B | Mark — Starts to Slip (Dec 2025 / Jan 2026) | 82 | 78 | 80 | 75 | 79.0 | Band 4 Orange | ISE-2 Protective |
| C | Mark — Three Months Ignored Advice (April 2026) | 64 | 58 | 65 | 50 | 60.3 | Band 6 Red-Orange | ISE-1 Crisis Support |
| D | Mark — Recovery after FABs (estimated May 2026) | 86 | 84 | 88 | 85 | 85.3 | Band 2 Green | ISE-4 Momentum |

**Canonical formulas — unchanged:**

- `SC = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4` (floor 0, ceiling 100, piecewise linear)
- Beacon bands: Band 1 (95–100) · Band 2 (85–94) · Band 3 (80–84) · Band 4 (70–79) · Band 5 (65–69) · Band 6 (60–64) · Band 7 (<60)
- ISE resolver: SC ≥85 → ISE-4 · 70–84 → ISE-2 · 65–69 → ISE-3 · 60–64 → ISE-1 · <60 → ISE-0

### The clinical story per scenario (plain language, not UI copy)

**Scenario A — Good Time.** Mark is on rhythm. Injection weekly. Protein at meals. Sleep ambient. Hydration consistent. Minimal alcohol. Protected space. Numbers are strong for his age.

**Scenario B — Starts to Slip.** One missed injection. Holiday pressure begins. Sleep shortens. Evening alcohol creeps in. HRV takes a visible dip. Ollie catches it. Max explains it. **The Journal activates here** — Ollie asks Mark to tap a few responses. This is the moment the platform asks the patient to contribute data, and the patient still has the capacity to engage.

**Scenario C — Three Months of Ignored Advice.** Mark disengaged. Ollie's prompts went unanswered. Max's check-ins skipped. Alcohol became routine. Injections inconsistent. Sleep fragmented. After three months of drift, the Beacon has dropped into Band 6. This is the scenario the investor needs to see — not because it's dramatic, but because it's real. The 54% non-retention side of the 466-patient cohort looks exactly like this. The platform's value is that it kept watching even when Mark stopped engaging.

**Scenario D — Recovery.** FABs applied. Injection restored. Protein-first re-anchored. Hydration cadence. Sleep ambiance protected. Alcohol reduced around Vulnerable-space events. Hunger cues re-emerge. Over several weeks, Mark's corridor climbs back. Not instantly — this is not magic. But the recovery arc is real and visible.

---

## 5 — Ollie and Max copy per scenario (§22 reviewed)

Each scenario displays an Ollie line and a Max line in the caption area beneath the Beacon corridor. Ship the exact strings below. Do not paraphrase. Do not shorten. Do not invent.

### Scenario A — Good Time

**Ollie:** *Morning, Mark. Rhythm is strong this week. Keep what's working.*

**Max:** *Injection timing consistent. Protein intake on track. Sleep and hydration holding. This is the pattern to protect.*

### Scenario B — Starts to Slip

**Ollie:** *Mark, something shifted this week. Let me ask you a few quick things so we can catch it early.*

**Max:** *HRV dipped about ten points from your baseline, and one injection moved outside the weekly window. Nothing urgent — the earlier we name it, the smaller the fix.*

### Scenario C — Three Months of Ignored Advice

**Ollie:** *Mark, it's been three months. I want to walk through what I've been seeing, and what we can do next.*

**Max:** *Over the last twelve weeks, injection cadence, sleep, and hydration have all drifted together. Your corridor reflects that. We have a clear path back, one FAB at a time, starting this week.*

### Scenario D — Recovery after FABs

**Ollie:** *Mark, you've got your rhythm back. Nice work.*

**Max:** *Injection timing restored, protein-first at the first meal, hydration consistent, evening alcohol reduced. Your corridor reflects the work. Stay with these anchors.*

### Character counts (for bubble sizing)

| Scenario | Ollie (w/spaces) | Max (w/spaces) |
|---|---|---|
| A | 61 | 109 |
| B | 94 | 143 |
| C | 95 | 175 |
| D | 45 | 196 |

---

## 6 — FAB status across the four scenarios (Panel E)

Panel E from yesterday's document stays in place. The status-dot mapping now covers four columns instead of three.

| FAB | A — Good | B — Slip | C — Ignored (3 mo) | D — Recovery |
|---|---|---|---|---|
| Injection Timing | 🟢 | 🟠 | 🔴 | 🟢 |
| Protein First | 🟢 | 🟠 | 🔴 | 🟢 |
| Hydration | 🟢 | 🟢 | 🔴 | 🟢 |
| Sleep | 🟢 | 🟠 | 🔴 | 🟢 |
| Alcohol Reduction | ⚪ dormant | 🟠 | 🔴 | 🟢 |
| Hunger | ⚪ background | ⚪ background | 🟠 | ⚪ background |

**Dot semantics:**
- 🟢 Green — on track
- 🟠 Orange — drifting, needs attention
- 🔴 Red — sustained non-adherence
- ⚪ Gray — dormant / background (not currently relevant)

**Notes:**
- The Hydration FAB stays 🟢 in Scenario B because hydration typically holds when drift begins elsewhere. This is clinically honest. It goes red only when three months of compound disengagement have eroded every anchor.
- The Hunger FAB moves to 🟠 specifically in Scenario C because that is where under-eating masked by GLP-1 hunger suppression becomes a real risk. In A, B, and D it remains in background.
- Do not invent additional FABs for this demo. The six are the six.

---

## 7 — The Journal surface (Scenario B only)

The Journal appears in Scenario B. Nowhere else in this demo.

### Why it lives in Scenario B

The Journal fires in Scenario B because that is where the platform's clinical logic activates: drift detected, patient still engaged, one-tap input is the right next step. The investor sees this sequence in three beats:

1. **AI detects drift.** Beacon moves to Band 4. ISE resolves to ISE-2.
2. **AI asks for one-tap input.** Ollie invites. Max contextualizes. Journal surfaces.
3. **Patient contributes data. Pyramid updates.** The V-values and composite scores refresh based on Mark's taps.

### What the Journal looks like in the demo

A simple card below the Ollie/Max caption area, visible only in Scenario B. Three tap questions. Each question offers three or four tap-only response options. No typing.

**Placeholder structure — content from Val:**

```
Journal card header: Mark, a few quick taps.

Q1 — Sleep last night:   [ option 1 ]  [ option 2 ]  [ option 3 ]
Q2 — Alcohol this week:  [ option 1 ]  [ option 2 ]  [ option 3 ]
Q3 — Injection timing:   [ option 1 ]  [ option 2 ]  [ option 3 ]

Tap-to-complete. No typing. No skip required.
```

**Val will provide the exact prompt text and the option strings separately.** Do not invent content. Ship the scaffolding only, with the three questions labeled as placeholders, until Val delivers the copy.

### How the Journal affects the demo

When the investor taps through Mark's responses in the Journal card:
- A subtle animation acknowledges the tap
- The V2 score ticks by a small amount (showing patient data contributing to the composite)
- The pyramid panel (Section 8) shows the V2 → BHR (Behavioral & Habit Readiness) and V2 → BCI (Brain & Cognitive Integrity) composites reflecting the input

Keep the animation subtle. The investor should feel the causality, not see a fireworks display.

---

## 8 — R&R Pyramid panel (new Panel F)

Add a new Panel F to the playground: the R&R Pyramid visualization.

### What the pyramid shows

The 8 composites from the R&R Canon (locked March 3, 2026), with their scores updating per scenario. Render as a horizontal bar grid or a simple stacked visualization — not a literal triangle. The word "pyramid" refers to the architectural hierarchy (R&R apex → 8 composites → 24 sub-scores), not the visual shape.

**The 8 composites (display order: Recovery side first, Readiness side second):**

| # | Composite | Full Name | Weight | Side |
|---|---|---|---|---|
| 1 | SRC | Sleep & Recovery | 0.14 | Recovery |
| 2 | SBL | Stress & Burden Level | 0.14 | Recovery |
| 3 | MBC | Muscle & Body Composition | 0.11 | Recovery |
| 4 | MEI | Metabolic & Energy Index | 0.11 | Recovery |
| 5 | AMP | Activity & Movement Performance | 0.12 | Readiness |
| 6 | BCI | Brain & Cognitive Integrity | 0.12 | Readiness |
| 7 | CRC | Circadian & Rhythm Coherence | 0.15 | Readiness |
| 8 | BHR | Behavioral & Habit Readiness | 0.11 | Readiness |

**Apex formula (locked):**
`R&R = 0.14·SRC + 0.14·SBL + 0.11·MBC + 0.11·MEI + 0.12·AMP + 0.12·BCI + 0.15·CRC + 0.11·BHR`

### Composite scores per scenario

For this demo, use the following composite-score mapping. These numbers are demo scaffolding — not clinical canon — chosen to show directional movement that tracks the Beacon arc.

| Composite | A — Good | B — Slip | C — Ignored | D — Recovery |
|---|---|---|---|---|
| SRC — Sleep & Recovery | 92 | 80 | 58 | 86 |
| SBL — Stress & Burden Level | 90 | 76 | 55 | 84 |
| MBC — Muscle & Body Composition | 90 | 85 | 62 | 85 |
| MEI — Metabolic & Energy Index | 93 | 78 | 56 | 85 |
| AMP — Activity & Movement | 91 | 82 | 60 | 85 |
| BCI — Brain & Cognitive Integrity | 92 | 80 | 62 | 86 |
| CRC — Circadian & Rhythm Coherence | 93 | 78 | 58 | 86 |
| BHR — Behavioral & Habit Readiness | 89 | 75 | 54 | 84 |
| **R&R apex (computed)** | **91.3** | **79.1** | **58.1** | **85.1** |

The R&R apex values are close to the SC values (91.6 / 79.0 / 60.3 / 85.3) by design. The apex and the SC are two different composites — they should track each other without being identical. This is clinically coherent and shows the investor that multiple independent calculations converge.

### Rendering rules for Panel F

- Each composite is a horizontal bar, labeled with its short name (SRC, SBL, etc.) and its current score.
- Use the same Beacon band colors to tint each bar based on the composite's score — green above 85, orange around 70–84, red below 60. This visually ties the pyramid to the Beacon.
- Show the R&R apex number prominently above the 8 composites.
- When scenarios transition, animate the bar values and colors smoothly (~1 second per scenario change) to mirror the SC animation.
- Do not expand to show the 24 sub-scores. Composites only. Sub-score drill-down is deferred to a future build.

---

## 9 — Play Sequence updated for four scenarios

The Play Sequence button from yesterday's document stays. Update the walkthrough:

**New button label:** `▶ Play Sequence: Mark Investor Arc`

**Walkthrough:**
1. Load Scenario A — Good Time. Hold 6 seconds.
2. Transition to Scenario B — Starts to Slip. Hold 8 seconds (longer — the Journal surfaces here).
3. Transition to Scenario C — Three Months Ignored Advice. Hold 8 seconds.
4. Transition to Scenario D — Recovery. Hold 6 seconds.
5. Stop on Scenario D until the user clicks another preset.

**Per-transition animations (all in unison, ~1.2 seconds each):**
- Slider V-values animate from prior to new
- Beacon corridor marker slides to new band
- ISE resolver updates at end of transition
- Ollie and Max copy fades out, fades in with new lines
- FAB panel dots animate to new status
- Pyramid panel bars and colors animate to new values
- In the B transition only: the Journal card fades in after Ollie's line appears

**Stop-between-scenarios option:** In addition to Play Sequence, each of the four new preset buttons (A, B, C, D) must work as a standalone click — so Val can pause the demo on any scenario to answer an investor question, then resume.

---

## 10 — Rules Cursor must follow

- **Do not modify the existing four calibration presets** (Good Day, Max Score, Drifting, GLP-1 Missed). They remain as-is.
- **Do not modify yesterday's Scenarios 5, 6, 7 presets** (from `CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md`). Keep them as fallback; the new Scenarios A, B, C, D are added alongside, not in place of.
- **Do not modify the SC formula, Beacon band thresholds, or ISE resolver logic.** Locked canon.
- **Do not modify Panel B or Panel C visual rendering.** Only ADD the caption area (already spec'd yesterday), Panel E (FABs), and Panel F (Pyramid).
- **Do not invent Ollie or Max lines.** Use exactly Section 5.
- **Do not invent FABs.** The six are the six.
- **Do not invent Journal content.** Ship placeholder scaffolding for Section 7. Val delivers the content.
- **Do not add clinical data overlays** (no raw HRV numbers, no glucose values, no lab panel displays). V-values and composites are the only numbers shown.
- **Preserve standalone preset function.** A, B, C, D each work as standalone clicks even outside Play Sequence.

---

## 11 — What ships to Zakiy

When Cursor finishes and Val has reviewed:

1. This markdown file (`README_MARK_LONGITUDINAL_DEMO_v1.0.md`)
2. The updated `mark-beacon-playground/index.html` with:
   - Four new preset buttons (Scenarios A, B, C, D) added alongside existing presets
   - Updated Ollie/Max caption area covering the four new scenarios
   - Panel E (FABs) updated for four-scenario dot mapping
   - **Panel F (R&R Pyramid) — new**
   - **Journal card — new, visible only in Scenario B**
   - Updated Play Sequence button walking A → B → C → D

Nothing else. No new files. No new architecture. This is additive only.

---

## 12 — Canonical references

| Document | What it governs |
|---|---|
| `Beacon_Canon_v1.1` | 7-band corridor, band thresholds (locked) |
| `ISE_Canon_v3.0` | 7 ISE states, resolver logic (locked) |
| `CCO-IC-SC-001` | SC formula weights 0.25 / 0.35 / 0.20 / 0.20 (locked) |
| R&R Canon (composite weights, March 3, 2026) | 8 composites, apex formula, weight distribution (locked) |
| `CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md` | Original playground spec |
| `CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md` | Yesterday's three-scenario extension + six FABs |
| V3 Space-State definitions | Protected (1.0) / Challenging (1.25) / Vulnerable (1.5) — referenced in FAB 5 |

---

## 13 — Open items for Val (before investor meeting)

Two items Val must deliver before the demo is investor-ready:

1. **Journal content for Scenario B.** Three tap questions with three or four tap-only response options each. Val provides the exact prompt text and option strings. Zakiy ships placeholder scaffolding in the meantime.
2. **Scenario rehearsal.** Before the investor meeting, Val and Zakiy walk through Play Sequence together on a full screen to confirm timing, transitions, and copy land right. Any adjustments happen before the meeting, not during.

---

*End of README_MARK_LONGITUDINAL_DEMO_v1.0.md*
