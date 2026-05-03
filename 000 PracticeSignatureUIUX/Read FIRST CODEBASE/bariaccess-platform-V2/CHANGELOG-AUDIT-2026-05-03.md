# CHANGELOG — Production Readiness Audit · 2026-05-03

## What this document is

A revision record of changes made on 2026-05-03 to bring the Phase 2 scaffold
into canon-conformance before handoff.

The original Phase 2 scaffold (Phases 2A-2E, 82 source files, 11,792 lines)
was built quickly under a Biohackers World NYC June 27-28 launch deadline.
A subsequent audit found that the ACCEPTANCE TESTS (147/147 passing at the
time) verified **internal contract consistency**, NOT **canon conformance**.
The audit identified six implementation deviations and one design-layer item.

This document records what changed, why, and how to migrate.

**Audit approved by:** Val (clinical lead, BariAccess LLC)
**Audit date:** 2026-05-03
**Final test status:** 184/184 passing across 10 suites

---

## Items addressed

| # | Item | Severity | Status |
|---|---|---|---|
| 1 | Beacon 7-band cutoffs (band-lookup.ts) | — | ✅ Verified canon-correct (no change needed) |
| 2 | Path A z-score piecewise function | — | ✅ Verified canon-correct (no change needed) |
| 3 | Resolver priority chain ordering | 🔴 CRITICAL | ✅ Rewritten canon-literal |
| 4 | Resolver `aligned` check | 🟠 HIGH | ✅ Rewritten canon-literal |
| 5 | Resolver `build_favored` check | 🟠 HIGH | ✅ Rewritten canon-literal |
| 6 | Pre-signal detection function | 🟠 HIGH | ✅ Implemented per Beacon §10.2 |
| 7 | Beacon §16 dynamic weighting | 🟡 MEDIUM | ✅ Mechanism + Phase 1 provisional values |
| 8 | Beacon color hex | 🟢 LOW | ✅ Muted neutrals (Nikita refines later) |
| 9 | Voice signal stub | 🟢 LOW | ✅ Reinforced banner; remains intentionally disabled |

---

## #3 / #4 / #5 — Resolver priority chain rewrite

**File:** `src/resolver/priority-chain.ts`

### Behavioral changes

| Scenario | Pre-audit returned | Post-audit returns | Why |
|---|---|---|---|
| Day 3 patient with neutral signals | ISE-0 (Neutral Baseline) | **ISE-6 (Exploratory/Low-Signal)** | Canon §10 CHECK 2 |
| Day 3 patient with rising signals | ISE-4 (Building Momentum) | **ISE-6 (Exploratory/Low-Signal)** | Canon §10 CHECK 2 — onboarding overrides momentum |
| 1 red composite + declining trend | ISE-5 (Restricted/Guarded) | **ISE-2 (Protective/Recovery-Forward)** | Canon §10 CHECK 4A — ISE-5 is reserved for governance, not health concern |
| Declining FSI + low ORI (no red composite) | ISE-2 | **ISE-2 (Protective/Recovery-Forward)** | Canon §10 CHECK 4B — was reachable before but via wrong path |
| Aligned signals + rising slopes simultaneously | ISE-4 (Momentum) | **ISE-1 (Aligned/Available)** | Canon §5 commentary: "Momentum is intentionally after Aligned to prevent it from overriding a depleted or misaligned day" |
| Onboarding day 3 + flat signals | ISE-1 (aligned helper fired) | **ISE-6** | Canon §10 CHECK 2 fires before aligned |

### Structural changes

**Pre-audit chain (10 steps, non-canonical):**
```
1. governance_flag           → ISE-5
2. critical_staleness        → ISE-6
3. health_status_critical    → ISE-5     ← did not exist in canon
4. cognitive_overload        → ISE-3
5. recovery_favored          → ISE-2
6. build_favored             → ISE-4     ← canon order: AFTER aligned
7. aligned                   → ISE-1     ← canon order: BEFORE momentum
8. onboarding_window         → ISE-0     ← canon: ISE-6, at CHECK 2
9. stale_data                → ISE-6
10. default_fallthrough      → ISE-0
```

**Post-audit chain (canon §5 + §10 literal, 7 steps):**
```
1. Governance gating         → ISE-5
2. Low-signal / onboarding   → ISE-6  (onboarding_days < 7 OR stale OR conflict)
3. Containment / overload    → ISE-3
4A. Health in trouble        → ISE-2  (red composite + declining)
4B. Engagement collapsing    → ISE-2  (declining FSI + low ORI)
5. Aligned / available       → ISE-1
6. Building / momentum       → ISE-4
7. Fallback                  → ISE-0
```

### Input contract changes

**Pre-audit:** Priority chain consumed signal evaluator outputs (`signal_1`,
`signal_2`, ...) with derived helper booleans:
- `favors_recovery`
- `favors_recovery_or_explore`
- `favors_momentum`
- `favors_momentum_build`
- `favors_build`
- `favors_ise3`
- `favors_clinical_handoff`

These hid the actual canonical thresholds inside intermediate booleans.

**Post-audit:** Priority chain consumes raw fields per canon §7 input contract:
```typescript
governance_flag: boolean
data_freshness_hours: number
onboarding_days: number
pli_count: number
space_state: 'protected' | 'challenging' | 'vulnerable' | null
composites_in_orange: number
composites_in_red: number
any_presignal_active: boolean
fsi_trend: 'rising' | 'stable' | 'declining'
ori_7d: number
mood_slope: number
effort_slope: number
```

The Resolver (`src/resolver/resolver.ts`) extracts these raw fields from
signal evaluator outputs before calling the chain.

### Conflict detection added

**New function:** `detectConflictingSignals(input)` per canon §9.

Detects three conflict patterns that route to ISE-6 with reason
`CONFLICTING_SIGNALS`:
1. Body failing but engagement strong (possible device error)
2. High cognitive load but everything else fine (possible PLI stacking)
3. Implausible day-to-day deltas (Phase 1.5 — needs delta tracking)

### Migration for code that imported the old shape

Old:
```typescript
const result = evaluatePriorityChain({
  signal_1, signal_2, signal_3, signal_4, signal_5, signal_6,
  days_since_d0
});
```

New:
```typescript
const result = evaluatePriorityChain({
  governance_flag: signal_1.governance_flag,
  data_freshness_hours: signal_2.hours_since_most_recent,
  onboarding_days: days_since_d0,
  pli_count: signal_3.pli_count,
  space_state: signal_3.space_state,
  composites_in_orange: signal_4.composites_in_orange,
  composites_in_red: signal_4.composites_in_red,
  any_presignal_active: signal_4.any_presignal_active,
  fsi_trend: signal_5.fsi_trend,
  ori_7d: signal_5.ori_7d,
  mood_slope: signal_6.mood_slope,
  effort_slope: signal_6.effort_slope
});
```

Resolver's main `resolve()` function does this extraction internally —
external callers don't need to change.

The pre-audit implementation is preserved as
`_deprecated_priorityChain_v1()` which throws a migration error if called.

---

## #6 — Pre-signal detection (new implementation)

**Files added:**
- `src/computation/presignal-detection.ts` (the function)
- `tests/acceptance/presignal-detection.test.ts` (21 tests)

### What was missing

`src/types/beacon.ts` had a `PreSignalDetection` interface; no implementing
function existed. `signal-4-health-status.ts` consumed
`any_presignal_active: boolean` as an input but the producer was never built.

### What was added

`detectCompositePreSignal(input)` implements Beacon §10.2 rule:

```
PRE-SIGNAL = TRUE when EITHER:
  (a) POSITION: Score is currently in Band 3 (Faint Green, 80-84)
  (b) VELOCITY: Score has dropped > 10 points in 14 days, regardless of band
```

`aggregatePreSignalAcrossComposites()` aggregates across all LIVE composites
to produce the `any_presignal_active` boolean the Resolver consumes.

### Canon reconciliation note

Canon §10.3 narrative claims James (WP-002 character) triggered velocity
with a 9.4-point drop. Canon §10.2 rule states drop must be "> 10 points."
Canon §30.1 character math labels James's 9.4-point drop as "Approaching
velocity threshold" — explicitly NOT triggering.

The §10.2 rule is the source of truth (machine-readable). The §10.3
narrative is illustrative; James was the motivating example for ADDING the
velocity rule, not a passing case under the final rule. Code follows §10.2.
Tests document this reconciliation.

---

## #7 — Beacon §16 dynamic composite weighting

**Files added:**
- `src/computation/composite-weights-by-ise.ts` (mechanism + Phase 1 tables)
- `tests/acceptance/beacon-dynamic-weighting.test.ts` (36 tests)

**File modified:**
- `src/computation/apex-rollup.ts` (now accepts `ise_state` parameter)

### What changed

Pre-audit `apex-rollup.ts` had `COMPOSITE_APEX_WEIGHTS_DEFAULT` as equal 1/8
for all 8 composites, with a comment "Operator may persist custom weights via
Beacon §16 mechanism" — the mechanism didn't exist.

Post-audit: `getCompositeWeightsForISE(state)` returns the weight table for
each ISE state per Beacon §16.3 directional principles.

### Phase 1 provisional values

Per canon §16.2, exact weight values are deferred to PAC-2 biostatistics
validation. The values shipping in Phase 1 are PHASE_1_PROVISIONAL —
directionally derived from canon §16.3, with conservative ±0.04 shifts from
the 1/8 baseline.

| State | Treatment | Approved by |
|---|---|---|
| ISE-0 | Behavioral composites weighted higher (BHR, SBL, CRC) | Val 2026-05-03 |
| ISE-1 | Equal 1/8 (canon default) | n/a |
| ISE-2 | Recovery composites weighted higher (SRC, BHR, SBL, CRC); performance lower (MEI, AMP) | Val 2026-05-03 |
| ISE-3 | Subjective composites weighted higher (BCI, SBL, BHR); performance lower | Val 2026-05-03 |
| ISE-4 | Equal 1/8 (canon §16.3 — Phase 2 deferred) | n/a |
| ISE-5 | Objective physiological weighted higher (MBC, SRC, MEI, AMP); subjective lower | Val 2026-05-03 |
| ISE-6 | Equal 1/8 (canon §16.3 — Phase 2 deferred) | n/a |

### Module-load invariant

Every weight table is verified to sum to 1.0 (within floating-point epsilon)
at module load. If any table is malformed, the application fails to start
with a clear error message — preferable to silent scoring drift in production.

### Biostatistics handoff

`COMPOSITE_WEIGHTS_PROVENANCE` constant carries metadata:
- `status: 'PHASE_1_PROVISIONAL'`
- `approved_by`, `approved_on`
- `source_canon: 'Beacon Canon v1.1 §16.3 directional principles'`
- `validation_pending: 'PAC-2 biostatistics validation per canon §16.2'`

When biostatistics produces validated weights:
1. Replace each `*_PHASE_1_PROVISIONAL` constant with validated table
2. Update `COMPOSITE_WEIGHTS_PROVENANCE.status` to `'BIOSTATISTICS_VALIDATED'`
3. Add `validated_by` and `validated_on` fields
4. Tests in `beacon-dynamic-weighting.test.ts` verify structural contract;
   they pass regardless of specific values

---

## #8 — Beacon color tokens

**File modified:**
- `src/frontend/tokens/beacon-color-tokens.ts`

### What changed

Pre-audit values were saturated default Tailwind classes (`bg-emerald-500`,
`bg-red-500`) that read as generic AI-default styling.

Post-audit values are MUTED NEUTRALS that preserve the canonical color
grammar (Strong Green = positive, Red = clinical) while looking calmer and
more clinical. Saturation reduced across the board.

Notable: Band 7 uses `rose-*` not `red-*` per canon §4 Band 7 directive
"Compassionate response — protect, don't punish."

### Canon citation correction

Pre-audit comment incorrectly cited Beacon §13 as the color spec source.
§13 is the Data Resilience Model. Canon §4 provides only band names + emoji
indicators, not exact hex values. Comment now accurate.

### Migration to Nikita's palette

When Nikita delivers final hex tokens, replace Tailwind utility classes
with arbitrary-value Tailwind syntax (e.g., `bg-[#DDE4D6]`). The shape of
`BEACON_COLOR_CLASSES` (bg/border/text/rim) does not change — only the
class strings inside.

---

## #9 — Voice signal stub (NOT unlocked)

**File modified:**
- `src/resolver/signals/signal-7-voice.ts`

### What changed

Reinforced top-of-file warning banner. The signal remains intentionally
disabled. No functional change — the gate function `canResolverConsumeVoice()`
returns `false` and the Resolver discards the result.

### Why voice is NOT unlocked for beta launch

Per G6 §4.4, voice consumption requires four activation gates closed:

1. **BAA executed** — for whatever voice service (Fireflies / Azure)
2. **HIPAA voice consent UX validated by counsel**
3. **Voice affect model validated against bariatric cohort** (NOT general population)
4. **WoZ threshold calibration extended to voice domain**

These are clinical-legal-validation gates, not technical gates. As of audit
date (2026-05-03), gates 2, 3, and 4 are not documented as closed.

A model that hasn't been validated on the bariatric cohort has unknown rates
for both failure modes:
- False positive ("distress" when fine) → unnecessary 988 escalation
- False negative ("fine" when in distress) → missed crisis

G6 §5.6 hard rules exist precisely because mental wellbeing escalation has
zero margin for false negatives.

### Unlock procedure

Documented in the file's banner. Summary:
1. Update `VoicePhase2Activation` flags in caller (all four → true)
2. Implement actual classification logic where the Phase 2+ stub branch lives
3. Wire signal_7 result into Resolver priority chain
4. Add Signal 7 priority position to PAC-ISE-002 §10 (canon update)
5. Add MW-T9..MW-T12 acceptance tests for voice escalation paths
6. Document unlock in `CHANGELOG-PHASE-1.5-VOICE.md` with all four gate-closure attestations

### Routing for questions

> Questions from Zakiy → route to Val first, NOT to Claude.
> Voice unlock is a clinical-legal-validation decision, not a coding one.

---

## What did NOT change (verified canon-correct)

### Beacon 7-band cutoffs (`src/calibration/band-lookup.ts`)

All 7 band ranges (95-100, 85-94, 80-84, 70-79, 65-69, 60-64, 0-59) match
Beacon Canon v1.1 §4 line-by-line. All 7 color names match. No fix needed.

### Path A z-score piecewise function (`src/calibration/path-a-zscore.ts`)

All 7 piecewise breakpoints (Z thresholds at +1.5, +0.7, +0.3, -0.3, -0.6,
-1.0, < -1.0) match Beacon Canon v1.1 §6.2 line-by-line. All coefficients
(10, 12.5, 12.5, 16.7, 16.7, 12.5, 20) match. The cap-at-100 and floor-at-0
clamps match. No fix needed.

### G5 HIPAA redaction tests

All 12 mandatory T1-T12 acceptance tests pass. Pre-ship gate green.

### G6 mental wellbeing safety escalation tests

All 8 mandatory MW-T1..MW-T8 acceptance tests pass. Pre-ship gate green.

---

## Final test status

```
Test Suites: 10 passed, 10 total
Tests:       184 passed, 184 total
Time:        ~1.6 s
```

Suites:
1. `acceptance/g5-hipaa-redaction.test.ts` — 17 tests (HIPAA pre-ship gate)
2. `acceptance/g6-safety-escalation.test.ts` — 12 tests (Safety pre-ship gate)
3. `acceptance/pac-ise-001.test.ts` — 9 tests (ISE_DEFAULTS schema)
4. `acceptance/pac-ise-002.test.ts` — Resolver priority chain (canon §10)
5. `acceptance/pac-ise-007.test.ts` — AI governance + boundaries
6. `acceptance/beacon-dynamic-weighting.test.ts` — 36 tests (Beacon §16)
7. `acceptance/presignal-detection.test.ts` — 21 tests (Beacon §10.2)
8. `integration/resolver-flow.test.ts` — Mark E2E reference scenario
9. `integration/cascade-flow.test.ts` — G3 selective cascade
10. `integration/slot-lifecycle.test.ts` — RBSHELF §15 lifecycle

---

## Carry-forward — operator-side ship blockers (unchanged)

These are NOT code items. They block Phase 1 launch and require operator action:

- ☐ OQ-D0LITE-PATCH-02 — Mental wellbeing keyword list curation (Val + Pamela)
- ☐ OQ-D0LITE-PATCH-03 — Fireflies BAA execution (Val + Crenguta)
- ☐ OQ-D0LITE-PATCH-04 — Voice consent UX wording (Val + Nikita + counsel)
- ☐ OQ-T3 — Inner Circle Day 0 visibility (defaulted to unlocked)

---

## Document history

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-05-03 | Audit pass | Initial audit + 9-item revision |
