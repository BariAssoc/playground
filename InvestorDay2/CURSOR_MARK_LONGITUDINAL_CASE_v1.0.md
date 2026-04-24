# CURSOR DEVELOPER PROMPT — MARK LONGITUDINAL CASE v1.0

**Document type:** Cursor-ready extension specification
**Author:** BariAccess™ Canonical Architecture — Val + Claude
**Date:** April 22, 2026
**Status:** SANDBOX — extends existing playground, not yet canonical
**Purpose:** Add three new preset scenarios and a Play Sequence demo to the existing Mark Beacon Playground, showing Mark's longitudinal arc — good time (Nov 2025), bad time (April 2026), and recovery after FABs are applied.

---

© 2026 BariAccess LLC. All rights reserved. Confidential — Internal use only.

---

## SECTION 1 — WHAT THIS IS

This document does NOT rebuild the Beacon Playground. It extends it.

**Reference file (already built):** `CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md`
**Reference implementation (already live):** `mark-beacon-playground/index.html` — four panels (Sliders, Formula Engine, Beacon Corridor, ISE Resolver), four existing presets.

**What to add to the existing playground:**

1. Three new preset buttons in Panel A (Scenarios 5, 6, 7) — Mark's longitudinal case
2. A **Play Sequence** button that walks the demo through Scenario 5 → 6 → 7 automatically
3. A caption area beneath the Beacon corridor that displays the **Ollie line** and **Max line** for whichever scenario is currently loaded
4. A **FAB panel** (new Panel E) that lists the six FABs active in the Scenario 6 → 7 recovery arc

Everything else — sliders, formula engine, Beacon corridor rendering, ISE resolver — stays exactly as it is. **Do not change the existing engine. Do not re-render the existing four presets. Only ADD.**

---

## SECTION 2 — THE THREE NEW SCENARIOS

Mark is 64 years old, 6'3". On tirzepatide (Zepbound) weekly injection program. The three scenarios show the same patient across a four-month arc.

| # | Scenario | V1 | V2 | V3 | V4 | SC | Band | ISE |
|---|---|---|---|---|---|---|---|---|
| 5 | Mark — Good Time (Nov 2025) | 94 | 88 | 92 | 92 | 91.6 | Band 2 Green | ISE-4 Momentum |
| 6 | Mark — Bad Time (April 2026) | 72 | 68 | 70 | 65 | 69.0 | Band 5 Deep Orange | ISE-3 Containment |
| 7 | Mark — Recovery (FABs Applied) | 86 | 84 | 88 | 85 | 85.3 | Band 2 Green | ISE-4 Momentum |

### Canonical SC formula (unchanged, locked in CCO-IC-SC-001)

`SC = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4`

Floor 0, ceiling 100. Piecewise linear. No sigmoid. Same as existing playground.

### Canonical Beacon band mapping (unchanged, locked in Beacon_Canon_v1.1)

Same seven bands the playground already renders. Scenario SC values land at:
- 91.6 → Band 2 Green (Strong alignment)
- 69.0 → Band 5 Deep Orange (Concern)
- 85.3 → Band 2 Green (Strong alignment)

### Canonical ISE resolver (unchanged, from playground spec)

- SC ≥ 85 → ISE-4 Momentum
- 70–84 → ISE-2 Protective
- 65–69 → ISE-3 Containment
- 60–64 → ISE-1 Crisis Support
- <60 → ISE-0 Emergency

Applied to the three scenarios (deterministic — no narrative override):
- Scenario 5 (SC 91.6) → **ISE-4 Momentum**
- Scenario 6 (SC 69.0) → **ISE-3 Containment** (canonical output of the resolver)
- Scenario 7 (SC 85.3) → **ISE-4 Momentum**

---

## SECTION 3 — WHAT MARK'S NUMBERS MEAN

Plain language description of each V-value in each scenario. This is context for understanding the display, not UI copy.

### Scenario 5 — Good Time (November 2025)

- **V1 = 94 (Biometric).** HRV strong for his age. Sleep efficient. Resting heart rate stable.
- **V2 = 88 (Behavioral).** FABs being executed consistently. Effort showing up.
- **V3 = 92 (Contextual).** Routine held. No external stressors. Protected space.
- **V4 = 92 (Interventional).** Injection timing consistent. Protein first. Hydration on track. Alcohol minimal.

### Scenario 6 — Bad Time (April 2026)

- **V1 = 72 (Biometric).** HRV suppressed. Sleep fragmented. Glucose variability up.
- **V2 = 68 (Behavioral).** FABs inconsistent. Effort scattered.
- **V3 = 70 (Contextual).** Post-holiday plus business stress. Challenging space.
- **V4 = 65 (Interventional).** Two missed injections in last three weeks. Evening alcohol. Sleep short.

### Scenario 7 — Recovery (FABs applied, estimated 3–4 weeks forward)

- **V1 = 86 (Biometric).** HRV rebounding. Sleep regularizing. Glucose variability reducing.
- **V2 = 84 (Behavioral).** Daily FABs restored. Injection-day routine re-anchored.
- **V3 = 88 (Contextual).** Stress still present but no longer compounding. Challenging-to-Protected transition.
- **V4 = 85 (Interventional).** Injection timing back. Protein-first. Hydration. Alcohol reduced.

---

## SECTION 4 — OLLIE AND MAX COPY (§22 REVIEWED)

Copy appears in a caption area beneath the Beacon corridor when each scenario is loaded. Ollie appears first (top), Max second (below Ollie).

### Scenario 5 — Good Time

**Ollie:** *Morning, Mark. Rhythm is strong this week. Keep what's working.*

**Max:** *Injection timing consistent. Protein intake on track. Sleep and hydration holding. This is the pattern to protect.*

### Scenario 6 — Bad Time

**Ollie:** *Mark, a few things are drifting. Let's look at what to bring back first.*

**Max:** *Two missed injections in the last three weeks, shortened sleep, and evening alcohol together are pushing glucose variability up. Start with injection timing — that one move brings the rest back into range.*

### Scenario 7 — Recovery

**Ollie:** *Mark, you've got your rhythm back. Nice work.*

**Max:** *Injection timing restored, protein-first at the first meal, hydration consistent, evening alcohol reduced. Your corridor reflects the work. Stay with these anchors.*

### Rules for rendering the copy

- Ollie bubble color, Max bubble color, and bubble shape follow whatever the app already uses (Max = purple, per canon). If the playground does not yet have AI bubble styling, show both as plain text boxes labeled "Ollie" and "Max" — styling is not the point of this demo.
- **Do not modify the copy text.** It has passed content governance review. No acronyms. No protocol language. Ship the exact strings above.
- Character counts (for reference, in case bubbles clip):

| Scenario | Ollie chars (w/spaces) | Max chars (w/spaces) |
|---|---|---|
| 5 | 61 | 109 |
| 6 | 74 | 201 |
| 7 | 45 | 196 |

---

## SECTION 5 — THE SIX FABS (PANEL E — NEW)

This section is new. It defines the FABs that drive Mark's recovery from Scenario 6 to Scenario 7. These are individual FABs — no family grouping — listed as a simple panel beside or beneath the Beacon corridor.

**Display rule:** Panel E is visible in all three scenarios. In Scenario 5, FABs show as "active/maintenance." In Scenario 6, FABs show as "drifting/needs attention." In Scenario 7, FABs show as "restored."

### FAB 1 — Injection-Timing FAB

- **What it does:** Keeps Mark's tirzepatide injection on a consistent weekly cadence.
- **Cadence:** Every 7 days.
- **Why it matters:** Missed or late injections flatten GLP-1 effect and drive glucose variability back up. Timing consistency is the single highest-leverage intervention for V4.
- **Scenario states:**
  - Scenario 5: On cadence.
  - Scenario 6: Two missed in last three weeks.
  - Scenario 7: Restored to weekly cadence.

### FAB 2 — Protein-First FAB

- **What it does:** Ensures protein arrives first in the meal sequence, at least twice daily.
- **Cadence:** At least 2 meals per day begin with protein before carbohydrate.
- **Why it matters:** Protein-first ordering blunts post-prandial glucose spikes and supports satiety on GLP-1 therapy. Sustains lean mass preservation during weight loss.
- **Scenario states:**
  - Scenario 5: Routine in place.
  - Scenario 6: Inconsistent — fewer than 2 meals.
  - Scenario 7: Routine restored at first and second daily meal.

### FAB 3 — Hydration FAB

- **What it does:** Keeps Mark on a structured hydration cadence through the day.
- **Cadence:** Regular intake distributed across the day (not concentrated late).
- **Why it matters:** GLP-1 therapy suppresses thirst cue. Structured cadence prevents dehydration, which compounds constipation risk and flattens HRV.
- **Scenario states:**
  - Scenario 5: Cadence held.
  - Scenario 6: Intake dropped, distribution skewed.
  - Scenario 7: Cadence restored.

### FAB 4 — Sleep FAB

- **What it does:** Protects sleep ambiance — the conditions that support onset and continuity.
- **Anchor:** Sleep ambiance (darkness, temperature, device quiet window).
- **Why it matters:** Sleep fragmentation directly suppresses HRV and drives insulin resistance higher. For Mark at 64, sleep ambiance is the lever with the largest next-day HRV effect.
- **Scenario states:**
  - Scenario 5: Ambiance held. Sleep continuous.
  - Scenario 6: Ambiance degraded. Sleep short and fragmented.
  - Scenario 7: Ambiance restored. Sleep regularizing.

### FAB 5 — Alcohol-Reduction FAB

- **What it does:** Activates specifically around social events and friend meetings — the contexts Mark labels as **Vulnerable space** (V3 weight 1.5) because social pressure to drink is highest there.
- **Cadence:** Activates when Mark enters a Vulnerable space containing known alcohol cues.
- **Why it matters:** Evening alcohol, even moderate, suppresses overnight HRV, fragments sleep, and compounds GI symptoms on tirzepatide. The FAB gives Mark a ready micro-plan before he enters the room.
- **Scenario states:**
  - Scenario 5: Minimal alcohol. FAB dormant.
  - Scenario 6: Evening alcohol compounding other drift signals.
  - Scenario 7: Reduced. FAB engaged before events.

### FAB 6 — Hunger FAB

- **What it does:** Reminds Mark to eat based on hunger cues. If Mark is not hungry at an expected mealtime, surfaces a Hunger FAB prompt to check whether the skipped meal is suppression from GLP-1 (acceptable), or drift (needs intervention).
- **Cadence:** Fires at Mark's usual meal windows. Triggers a check-in prompt if no hunger is reported.
- **Why it matters:** GLP-1 therapy blunts hunger. On good days this supports weight loss. On bad days it can mask under-eating that drives fatigue, lean mass loss, and HRV suppression. The FAB distinguishes the two.
- **Scenario states:**
  - Scenario 5: Hunger cues intact. FAB in background.
  - Scenario 6: Hunger absent at multiple meals. FAB flagging under-eating risk.
  - Scenario 7: Hunger cues re-emerging. FAB back to background.

### Panel E rendering

Display all six FABs as a compact list. Each FAB shows:
- Short name ("Injection Timing," "Protein First," "Hydration," "Sleep," "Alcohol Reduction," "Hunger")
- Current status dot: green (on-track), orange (drifting), gray (dormant/not-needed)

Scenario-by-scenario dot mapping:

| FAB | Scenario 5 | Scenario 6 | Scenario 7 |
|---|---|---|---|
| Injection Timing | 🟢 | 🟠 | 🟢 |
| Protein First | 🟢 | 🟠 | 🟢 |
| Hydration | 🟢 | 🟠 | 🟢 |
| Sleep | 🟢 | 🟠 | 🟢 |
| Alcohol Reduction | ⚪ dormant | 🟠 | 🟢 |
| Hunger | ⚪ background | 🟠 | ⚪ background |

---

## SECTION 6 — PLAY SEQUENCE BUTTON

Add one new button to the playground: **▶ Play Sequence: Mark Longitudinal**

When clicked, it walks the display through the three scenarios automatically:

1. Load Scenario 5 — Good Time. Hold for 5 seconds.
2. Transition to Scenario 6 — Bad Time. Hold for 5 seconds.
3. Transition to Scenario 7 — Recovery. Hold for 5 seconds.
4. Stop on Scenario 7 until the user clicks another preset.

### Transition behavior

- Sliders animate from one V-value to the next over ~1 second per transition. Not an instant jump. This shows the change.
- The Beacon corridor marker slides smoothly from one band to the next following the SC change.
- The ISE resolver updates at the end of each transition.
- The Ollie and Max copy fades out, then fades in with the new scenario's lines.
- The FAB panel status dots update smoothly to match the new scenario.

### Why this matters for the demo

The Play Sequence is how Val shows investors, partners, and the clinical team the **core story of BariAccess**: the platform detects drift, names it in human language, points to the one-move corrections, and shows the corridor recover as the FABs do their job. Three screens. One arc. No words from Val needed — the playground tells the story.

---

## SECTION 7 — RULES CURSOR MUST FOLLOW

- **Do not modify the existing four presets (Good Day, Max Score, Drifting, GLP-1 Missed).** They are calibration anchors and must stay as-is.
- **Do not modify the SC formula, the Beacon band thresholds, or the ISE resolver logic.** Locked canon.
- **Do not modify Panel B (Formula Engine) or Panel C (Beacon Corridor) visual rendering.** Only ADD the caption area beneath Panel C for Ollie/Max copy, and the new Panel E for FABs.
- **Do not invent new Ollie or Max lines.** Use exactly the strings in Section 4. They have passed content review.
- **Do not invent new FABs.** The six in Section 5 are the only FABs for this demo.
- **Do not add clinical data overlays** (no HRV numbers, no glucose values, no lab displays). The V1–V4 scores are the only numbers shown. Clinical data mapping is deferred to a future document.
- **Preserve the Play Sequence as optional.** The three new preset buttons must also work as standalone clicks (without sequence mode).

---

## SECTION 8 — CANONICAL REFERENCES

| Document | What it governs |
|---|---|
| `Beacon_Canon_v1.1` | 7-band corridor, band thresholds (locked) |
| `ISE_Canon_v3.0` | 7 ISE states, resolver logic (locked) |
| `CCO-IC-SC-001` | SC formula weights 0.25 / 0.35 / 0.20 / 0.20 (locked) |
| `CURSOR_MARK_BEACON_PLAYGROUND_v1.0.md` | Existing playground spec this document extends |
| V3 Space-State definitions | Protected (1.0) / Challenging (1.25) / Vulnerable (1.5) — referenced in FAB 5 |

---

## SECTION 9 — WHAT SHIPS TO ZAKIY

When Cursor finishes and Val has reviewed:

1. This markdown file (`CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md`)
2. The updated `mark-beacon-playground/index.html` with:
   - Three new preset buttons (Scenarios 5, 6, 7)
   - Caption area for Ollie/Max copy under Beacon corridor
   - New Panel E listing the six FABs with scenario-state dots
   - Play Sequence button with 3-step auto-walk

Nothing else. No new files. No new architecture. This is an additive extension, not a rebuild.

---

## SECTION 10 — RESOLVED OPEN ITEMS (v1.0 FINAL)

1. **ISE-3 accepted for Scenario 6.** Deterministic output of the canonical resolver. No narrative override.
2. **Scenario 6 Ollie line confirmed for ISE-3 Containment tone.** "Let's look at what to bring back first" fits Containment.
3. **Six FABs defined in Section 5.** Individual FABs — no family grouping for this case.

---

*End of CURSOR_MARK_LONGITUDINAL_CASE_v1.0.md*
