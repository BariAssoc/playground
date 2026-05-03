# ZAKIY — Start Here

Welcome. This document is your entry point to the BariAccess platform scaffold.

Read this first. Then `CHANGELOG-AUDIT-2026-05-03.md`. Then start integrating.

---

## What this scaffold is

A reference TypeScript implementation of the BariAccess Phase 1 platform
backend — Resolver, calibration, governance, API handlers, frontend components,
and tests. It is **production-ready in the sense that the contracts, canon
mappings, and acceptance tests are complete**. It is **not deployed** —
you will wire it to Cosmos, Express/Fastify (your choice), Azure Functions,
notification gateways, and auth middleware.

The scaffold is canon-driven. Every file cites the canon section it implements.
**Treat the canon docs as the source of truth, not the code.** If you see a
mismatch between code and canon, the canon wins — flag it to Val.

---

## Three things to know before you start

### 1. There was an audit on 2026-05-03

The original scaffold was rewritten on 2026-05-03 to fix six canon-implementation
deviations. **Read `CHANGELOG-AUDIT-2026-05-03.md` before reading any code.**
It documents:
- Which behaviors changed
- Which files were rewritten
- The migration table (old shape → new shape)
- Why the changes were made

If you find a function called `_deprecated_priorityChain_v1`, do NOT call it.
It throws on invocation. The new function is `evaluatePriorityChain`.

### 2. The voice signal is INTENTIONALLY disabled

`src/resolver/signals/signal-7-voice.ts` has a large warning banner. **Do not
remove it. Do not wire voice into production.** Voice unlock is a
clinical-legal-validation decision (gates 1-4 in G6 §4.4), not a coding decision.

If you have voice-related questions, route them to Val first, not to me.

### 3. Some weight values are PHASE_1_PROVISIONAL

`src/computation/composite-weights-by-ise.ts` contains weight tables marked
`_PHASE_1_PROVISIONAL`. These are directionally derived from Beacon Canon
§16.3 principles, approved by Val on 2026-05-03 for beta launch.

When the biostatistics team produces validated weights, replace the tables
and update `COMPOSITE_WEIGHTS_PROVENANCE.status` to `'BIOSTATISTICS_VALIDATED'`.
The structural tests will still pass.

---

## How to verify the scaffold on your machine

```bash
# 1. Install
npm install

# 2. Typecheck source + tests
npx tsc --noEmit -p tsconfig.test.json

# 3. Run the full test suite
npm test
# Expected: 184 passed, 10 suites

# 4. Run the two pre-ship gate suites individually
npm run test:hipaa    # G5 §7 — 12 mandatory HIPAA tests + 5 bonus
npm run test:safety   # G6 §5.7 — 8 mandatory safety tests + 4 bonus
```

If any of these fail on your machine, it is an environment issue (Node version,
dependency mismatch). The scaffold ships green.

**Required:** Node.js >= 20.0.0.

---

## Suggested reading order for the canon docs

The canon docs live in your team's archive (Notion / Cursor / wherever Val
keeps them). Read in this order:

1. **`Beacon_Canon_v1_1.md`** — §4 (bands), §6 (piecewise function), §10 (pre-signal),
   §15 (composite hierarchy), §16 (dynamic weighting). The math foundation.
2. **`PAC-ISE-002_ISE_Resolver_Specification_v2_0.md`** — §5 + §10 (priority chain
   pseudocode). The Resolver source of truth.
3. **`PAC-ISE-001_Identity_State_Expressions_Rendering_Layer_v1_0A.md`** — §5 (ISE_DEFAULTS).
   The render contract.
4. **`PAC-ISE-006_CPIE_CCIE_Visibility_Redaction_Matrix_v1_0A.md`** — §4 (visibility).
   The HIPAA contract.
5. **`PAC-ISE-007_AI_Behavioral_Governance_by_ISE_State_v1_0B.md`** — §3 (prohibitions).
   The AI behavior contract.
6. **`DEV-WORK-D0LITE-001_v0_3_Practice-Edition-GLP1.md`** — §5 (G6 safety override).
   The Mental Wellbeing escalation contract.

---

## Repo structure

```
src/
  types/            ← TypeScript interfaces; no logic
  calibration/      ← Beacon score calibration (band lookup + 3 paths)
  computation/      ← Pure deterministic compute (slope, FCS, ORI, effort, presignal,
                      cascade, composite recompute, apex rollup, weights)
  resolver/         ← The Resolver (priority chain, signals 1-7, safety override)
    signals/        ← One file per signal; pure functions
  payload/          ← ISE_DEFAULTS lookup (state → render/cta/ollie)
  storage/          ← Cosmos container specs (10 containers) + redaction layer
    containers/     ← One file per container with TTL, partition key, append-only
  governance/       ← Visibility matrix, AI boundaries, audit, deviation, prohibitions
  frontend/         ← React components (Lane 1 only) + tokens
    components/     ← One file per component
    tokens/         ← Render token mappings
  api/              ← Framework-agnostic route handlers + middleware
    routes/         ← One file per endpoint
    middleware/     ← Redaction + audit
    auth/           ← Role check

tests/
  acceptance/       ← Canon-spec acceptance tests (G5, G6, PAC-ISE-001, -002, -007,
                      Beacon §16 weights, Beacon §10.2 presignal)
  integration/      ← Multi-module flows (Mark E2E, cascade, slot lifecycle)
```

---

## Where to plug things in

### Cosmos client

The container specs in `src/storage/containers/*.ts` define partition keys,
TTL, and append-only flags. Wire your Cosmos client to honor these specs.
Each container module exports a `_container-spec.ts`-shaped descriptor.

### Express / Fastify routes

The route handlers in `src/api/routes/*.ts` are framework-agnostic. They take
typed request objects and return typed response objects with `status`, `body`,
and `headers`. Wire to your framework's req/res adapters.

Storage and notification gateways are passed as constructor params (e.g.,
`SafetyStorageGateway`, `NotificationGateway`). Implement these interfaces
with your concrete Cosmos client and Twilio/Slack/email integrations.

### Auth provider

`src/api/auth/role-check.ts` defines the `AuthContext` interface. Validate
your Auth0/Azure AD/whatever token, populate the AuthContext, pass it to the
route handlers. The handlers call `checkAccess()` which returns 200 or 403
per G5 §6.2.

### Daily 03:00 patient-local apex roll-up

`src/computation/apex-rollup.ts` exports `computeApexRollup()` and the
constant `APEX_ROLLUP_LOCAL_TIME = '03:00'`. Wire to Azure Functions cron
or Durable Functions, scheduling per user's local timezone.

### Resolver run triggers

Per PAC-ISE-002 §13, the Resolver runs:
- On schedule (e.g., every 4 hours per active patient)
- Manually (provider/operator request)
- On event (FAB completion, slot drift, mood pin update, biometric ingestion)

Wire each trigger to call `resolve(inputs)` from `src/resolver/resolver.ts`.

---

## Known limitations / Phase 1.5 work

These are explicit deferrals, NOT bugs:

1. **Voice signal disabled** — see #9 in CHANGELOG and the banner in
   `signal-7-voice.ts`. Unlock requires four gates closed.

2. **Composite weights are PHASE_1_PROVISIONAL** — see #7 in CHANGELOG.
   Biostatistics validation pending.

3. **ISE-4 and ISE-6 use equal weighting** — canon §16.3 explicitly defers
   these to Phase 2.

4. **Conflict pattern 3 (implausible deltas) not implemented** — canon §9
   describes three conflict patterns. Patterns 1 and 2 are implemented.
   Pattern 3 requires day-to-day delta tracking (Phase 1.5).

5. **Slot drift contributes to Signal 4 only at slot resolve time** — the
   Resolver treats `slot_drift_count_24h` as an input. The aggregation
   query is in `src/storage/queries.ts`.

---

## When to ping Val vs. when to look at code

**Ping Val:**
- Voice unlock questions (clinical-legal decision)
- Composite weight questions (biostatistics or clinical principle)
- "Should this behavior be different?" (canon question, not code question)
- Mental wellbeing keyword list curation
- Anything involving the 4 operator-side ship blockers (OQ-D0LITE-PATCH-02
  through 04, OQ-T3)

**Look at code first:**
- "How do I wire X?" (the scaffold has the answer)
- "What's the input/output shape?" (TypeScript interfaces)
- "Why does this test pass/fail?" (read the test + the function it tests)
- "How does Cosmos partition this?" (container spec files)

---

## File-by-file: where the audit changed things

These files were rewritten or substantially modified on 2026-05-03:

| File | Audit item | Change |
|---|---|---|
| `src/resolver/priority-chain.ts` | #3/#4/#5 | Full rewrite to canon §10 literal |
| `src/resolver/resolver.ts` | #3/#4/#5 | Updated input shape passed to chain |
| `src/computation/presignal-detection.ts` | #6 | NEW FILE |
| `src/computation/composite-weights-by-ise.ts` | #7 | NEW FILE |
| `src/computation/apex-rollup.ts` | #7 | Added `ise_state` parameter |
| `src/frontend/tokens/beacon-color-tokens.ts` | #8 | Muted neutral palette |
| `src/resolver/signals/signal-7-voice.ts` | #9 | Reinforced banner |
| `tests/acceptance/pac-ise-002.test.ts` | #3/#4/#5 | Rewritten for canon §10 |
| `tests/integration/resolver-flow.test.ts` | #3/#4/#5 | Rewritten for canon §10 |
| `tests/acceptance/presignal-detection.test.ts` | #6 | NEW FILE |
| `tests/acceptance/beacon-dynamic-weighting.test.ts` | #7 | NEW FILE |

Search for `⚠️ AUDIT 2026-05-03` in any file to find audit-changed lines.

---

## Final note

The original scaffold passed 147/147 tests. After audit, it passes 184/184.

The pre-audit tests were verifying internal contract consistency. The
post-audit tests verify **canon conformance** — meaning when you change the
implementation, the tests will fail unless your change still matches canon.

This is the difference between a scaffold that "compiles and runs" and a
scaffold that "implements the specification." You inherit the second kind.

Build well.

---
2026-05-03
