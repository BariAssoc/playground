# RED FLAG QUESTIONS — These ALWAYS Go To Val

**Audience:** Zakiy Manigo, BariAccess developer
**Authority:** Val (CEO, clinical lead, BariAccess LLC)
**Audit revision:** 2026-05-03

---

## What this document is

A non-exhaustive list of questions where the answer must come from Val (or
Val + canon committee), **not from Claude in a fresh chat.**

If you find yourself asking any of these questions — **stop and message Val.**

If a Claude conversation produces an answer to any of these questions and Val
hasn't approved it, **the answer is invalid until Val signs off.**

---

## TIER 1 — Patient Safety (BLOCKING)

These can cause clinical harm if implemented wrong. Never proceed without Val.

### 🚩 Voice / Signal 7 unlock

ANY question about enabling voice consumption. Examples:

- "Can I unlock voice if Azure replaces Fireflies?"
- "We have an Azure BAA — can I turn voice on?"
- "Can I unlock voice for staging/testing only?"
- "Can I add voice to one patient's flow as a pilot?"
- "Can I bypass the activation flags for a demo?"

**Why this is Tier 1:** A voice affect model that hasn't been validated against
the bariatric cohort has unknown false-negative rate. False negative on mental
wellbeing detection = missed crisis = potential patient death. Per G6 §5.6 hard
rules, this has zero margin for error.

**The four required gates (G6 §4.4) must ALL be documented closed in writing
before unlock:**
1. BAA executed
2. HIPAA voice consent UX validated by counsel (Crenguta)
3. Voice affect model validated against bariatric cohort (Pamela + biostatistics)
4. WoZ threshold calibration extended to voice domain (Isaiah + Pamela)

**If you're tempted to unlock voice:** Re-read the banner in `signal-7-voice.ts`.
Then re-read this section.

### 🚩 Mental wellbeing escalation flow changes

ANY change to how the safety override fires, what gets escalated, or who gets
notified. Examples:

- "Can I make the trigger require higher confidence to fire?"
- "Can I skip provider notification if patient says 'I'm safe'?"
- "Can I batch the Pamela notification with other digests?"
- "Can I delay the 988 surface until after I confirm distress?"
- "Can I add an AI-only assessment before escalating?"

**Why this is Tier 1:** Per G6 §5.6, hard rule 4: "Provider notified ALWAYS,
even on 'I'm safe'." Hard rule 1: "AI never decides not to escalate." Any
change to this flow is a clinical safety call requiring Val + Pamela + Crenguta.

### 🚩 G5 HIPAA redaction changes

ANY change to what fields are visible to which interface (CCIE / CPIE / Internal).

- "Can patients see clinical notes for transparency?"
- "Can I add a 'preview' field that shows partial clinical content?"
- "Can I cache the provider view client-side for performance?"
- "Can I let admins see all data without role check?"

**Why this is Tier 1:** Each of the 12 G5 §7 mandatory tests blocks shipping.
PHI leakage = HIPAA violation = company-ending event. Modifications require
counsel review.

---

## TIER 2 — Canon-Locked Behavior (BLOCKING)

These would change patient routing or scoring behavior. Val + canon authority required.

### 🚩 Resolver priority chain changes

ANY change to the priority order, the CHECK conditions, or what state each
CHECK routes to. Examples:

- "Can we route Day 3 patients to ISE-0 instead of ISE-6?"
- "Can we make ISE-4 fire before ISE-1 for patients with rising slopes?"
- "Can we add a new priority CHECK for patients with high BCI?"
- "Can we lower the THRESHOLD_PLI from 5 to 4?"
- "Can we route 1 red composite to ISE-5 instead of ISE-2?"

**Why Tier 2:** The priority chain is canonized in PAC-ISE-002 v2.0 §5 + §10.
The audit on 2026-05-03 corrected 6 deviations. Re-deviating defeats the audit
and reintroduces the same risks.

**If a real need surfaces:** This becomes a canon revision. Val + canon committee
discussion. Document the rationale, update PAC-ISE-002, then update code.
Never code-first.

### 🚩 Threshold value changes

ANY change to constants in `src/resolver/thresholds.ts`. Examples:

- `THRESHOLD_STALE_HOURS` (canon-locked at 72)
- `THRESHOLD_PLI_OVERLOAD` (canon-locked at 5)
- `THRESHOLD_ORI_LOW` (canon-locked at 0.5 — CORRECTED IN AUDIT)
- `THRESHOLD_TRAJECTORY_NEG_SLOPE` / `_POS_SLOPE` (canon-locked at -0.1 / +0.1)
- `THRESHOLD_ONBOARDING_DAYS` (canon-locked at 7)
- `THRESHOLD_COMPOSITES_IN_ORANGE` (canon-locked at 2)
- `THRESHOLD_SLOT_DRIFT_COUNT_24H` (canon-locked at 3)

**Why Tier 2:** These thresholds shape who gets routed to which ISE state.
Changing one shifts the entire patient population's classification. Calibration
adjustments belong in WoZ data review, not ad-hoc code edits.

### 🚩 Beacon §16 weight changes

ANY change to the weight values in `src/computation/composite-weights-by-ise.ts`.

The values are PHASE_1_PROVISIONAL — directionally derived from canon §16.3,
approved by Val on 2026-05-03 with conservative ±0.04 shifts.

**They will change** when biostatistics validates real cohort data. That's a
formal handoff: status flips to BIOSTATISTICS_VALIDATED, validation date
recorded, source data referenced.

**They do NOT change** because someone thinks a number looks too high or too
low.

### 🚩 Beacon band cutoffs / piecewise function changes

The 7-band cutoffs (95/85/80/70/65/60) and the Z-score breakpoints (+1.5/+0.7/
+0.3/-0.3/-0.6/-1.0) in `src/calibration/`. Verified canon-correct in audit.

**Do not modify under any circumstances.** Any "improvement" here is canon
revision territory.

### 🚩 ISE_DEFAULTS render/cta/ollie shapes

`src/payload/ise-defaults.ts` defines what each state looks like to the patient.
Per PAC-ISE-001 §5. Modifying changes the visual experience of every patient
in that state.

---

## TIER 3 — Canon Ambiguity (Val should be aware)

These are open questions surfaced during the audit. Val knows about them.
If Zakiy hits one, Val should be looped in to confirm the resolution still holds.

### 🟡 The James scenario (Beacon §10.2 vs §10.3 narrative)

Canon §10.2 rule: velocity trigger at drop > 10 points / 14 days.
Canon §10.3 narrative: says velocity triggered for James (drop = 9.4 — does NOT exceed >10).
Canon §30.1 character data: labels James as "approaching velocity threshold."

Audit decision: trust the rule (>10). Code follows §10.2 strictly.

**If Zakiy hits this:** Confirm with Val that interpretation is still correct.
Don't unilaterally adjust the threshold or the rule.

### 🟡 ISE-4 and ISE-6 weight tables

Canon §16.3 explicitly says "Phase 2 — to be defined" for both states.
Phase 1 uses equal 1/8 weighting.

**If Zakiy is asked to define these:** Val + biostatistics call. Not Zakiy alone.

### 🟡 Beacon color hex values

Nikita owns final palette. Phase 1 uses muted Tailwind utility classes
(see audit-modified `beacon-color-tokens.ts`).

**If Zakiy is asked for color changes:** Route to Nikita, not Val (this is a
design layer item, not a clinical/canon item).

---

## TIER 4 — Could Be A Real Bug Or Could Be A Misunderstanding

These need investigation before action. Don't change code yet — document and ask.

### 🟡 "This test is failing on my machine but passes in CI"

Investigate environment first. Node version, dependency versions, timezone,
ESM flags. If genuinely a code bug, write up findings and ask Val whether
to file a code fix or a canon clarification.

### 🟡 "I can't find the producer for [boolean field]"

Check `buildHealthStatusInputs` and similar helpers in
`src/resolver/signals/*.ts`. The audit added several producer helpers. If
genuinely missing, document and escalate.

### 🟡 "The audit comment says X but the code does Y"

Treat audit comments as authoritative. If code doesn't match comment,
that's a bug. Document and escalate.

### 🟡 "Canon says X but the audit changelog says Y"

Re-read both carefully. If they genuinely conflict, the audit changelog is
based on canon as of 2026-05-03. Canon may have been updated since. Confirm
with Val.

---

## TIER 5 — Proceed Without Val (with primer)

These are routine integration questions. Use the opening prompt in
`HOW-TO-ASK-CLAUDE.md` and proceed.

### ✅ Cosmos client wiring

Implementing the storage gateway interfaces with `@azure/cosmos`. Standard
TypeScript work. Claude can help.

### ✅ Express/Fastify route adapters

Wiring the framework-agnostic handlers to your chosen HTTP framework. Standard.

### ✅ Auth provider integration

Validating tokens, populating `AuthContext`. Standard.

### ✅ Notification gateway implementations

Twilio for SMS, Slack API for Pamela, email for backup. Standard SaaS work.

### ✅ Azure Functions for cron

Scheduling the 03:00 patient-local apex roll-up. Tricky timezone work but
not canon-sensitive.

### ✅ Test infrastructure

Mocking gateways, writing new test fixtures, debugging Jest config. Standard.

### ✅ TypeScript / build / tooling questions

Strict mode errors, tsconfig issues, Jest ESM, etc. Standard.

### ✅ Frontend component composition

Wiring Constellation Panel rows to data sources. Layout/state management.
Tokens come from `BEACON_COLOR_CLASSES` (don't redefine colors).

---

## The escalation flow when in doubt

```
┌──────────────────────────────────────────────────────────────┐
│  IS YOUR QUESTION ON A TIER 1, 2, OR 3 LIST ABOVE?           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  YES (Tier 1 or 2)                                           │
│    → STOP. Message Val.                                      │
│    → Wait for written response.                              │
│    → Do NOT ask Claude.                                      │
│                                                              │
│  TIER 3 (canon ambiguity)                                    │
│    → Document your finding.                                  │
│    → Loop Val in.                                            │
│    → Val decides whether to update canon or hold.            │
│                                                              │
│  TIER 4 (could be bug, could be misunderstanding)            │
│    → Investigate first (15 min max).                         │
│    → Document findings in writing.                           │
│    → Send to Val.                                            │
│                                                              │
│  TIER 5 (routine integration)                                │
│    → Self-help: search ⚠️ AUDIT markers, read tests, etc.    │
│    → If still stuck: Claude with opening prompt.             │
│    → Proceed.                                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Acknowledgment

By picking up this scaffold, you acknowledge:

- ✋ Voice (Signal 7) is INTENTIONALLY locked. I will not unlock it.
- ✋ Resolver priority chain is canon-locked. I will not modify it without canon revision.
- ✋ Composite weights are PHASE_1_PROVISIONAL. I will not change them.
- ✋ Threshold values are canon-locked. I will not change them.
- ✋ G5 redaction matrix is non-negotiable. I will not change it.
- ✋ G6 safety escalation flow is non-negotiable. I will not change it.

If you find yourself wanting to do any of the above, **stop and ask Val.**

---

## One last thing

These rules look strict. They are. The scaffold was built canon-driven on
purpose, and the audit on 2026-05-03 cleaned up six places where the original
deviated. Re-introducing deviations defeats the audit.

But the rules don't make you helpless. Most of your work — Cosmos wiring,
Express routes, auth, notifications, deployment — is Tier 5. Move fast there.

The Tier 1-3 stuff is the small percentage where slowing down protects patients.

— Claude (audit pass, 2026-05-03)
