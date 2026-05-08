# BariAccess Beta — Developer Pack

**Generated:** May 7, 2026
**For:** Zakiy Manigo, Lead Software Developer
**From:** Valeriu E Andrei MD via Claude (executive coder)
**Cohort window:** May 7–17, 2026
**Day 11 deliverable:** May 18, 2026

---

## What this pack is

A drop-in TypeScript scaffolding covering everything specified in the BETA-* documents:

- All math from `BETA-FORMULA-001` (Mood, F, C, LC_beta, E, Grit Engine, Space Multiplier, SC_beta) — as pure functions with worked-example tests.
- All schemas from `BETA-VTAG-001`, `BETA-BOOKEND-001`, `BETA-FORMULA-001` — as TypeScript interfaces and Zod runtime validators.
- The 13-cohort roster as a typed seed file.
- All 130 FABs from `BETA-FAB-COHORT-001 v5` as a typed seed file.
- A nightly compute job skeleton.
- A nudge-reply parser (handles 8 reply formats — see `parsers/nudge-parser.ts`).
- React components for Routine Bookshelf, Warm-up Bookend, Cool-down Bookend, Journal Log.
- All API endpoints as Express handlers.

## What this pack is NOT

- Not a deployable app. You wire it into your existing repo / auth / deployment.
- Not connected to JotForm — webhook receivers are scaffolded, you configure the JotForm side.
- Not connected to Spike API — adapter shape is here, you supply credentials.
- Not connected to SMS/WhatsApp gateway — parser is ready, you wire the gateway.

## How to use this pack

1. **Read `DECISIONS.md` first.** Every design decision is listed there with the spec source. Override any by changing the value and re-running tests.
2. **Run the test suite.** `cd packages/backend && npm install && npm test` — every formula has worked-example tests pulled from the specs. If they pass, the math matches Val's spec.
3. **Seed the database.** `npm run seed:cohort && npm run seed:fabs` — loads the 13 cohort members and 130 FABs.
4. **Wire your existing campaigns feature** to the API endpoints in `packages/backend/src/api/`.
5. **Drop the React components** into your existing frontend or use them as references.

## Friday May 8 deliverable to Val

Per `BETA-HANDOFF-001 §7`, by Friday May 8 you owe Val:
1. URLs to the 3 live JotForms.
2. Screenshot of campaigns dashboard configured for all 13 cohort members.
3. One full day of records in CosmosDB from a self-test cycle.

## Day 11 (May 18) deliverable to Val

Per `BETA-FORMULA-001 §8` and `BETA-HANDOFF-001 §9`, the report includes:
- Activity summary (Journal entries)
- HRV (where wearable data exists)
- Behavioral consistency index (C from §3)
- Schedule adherence (routine drift)
- Sleep score
- Nudge compliance rate
- Productivity prediction match rate
- Effort Score (E) per cohort member
- Stability Coefficient (SC_beta) per cohort member
- Disengagement flags

The `jobs/day11-report.ts` skeleton aggregates all of these. Wire it to whatever output format Val wants (PDF, email, dashboard).

## Document provenance

This pack is generated from these source documents (all dated May 6, 2026):
- `BariAccess_Beta_Build_Spec_2026-05-06` (v3)
- `BETA-COHORT-ROSTER-001` (v1)
- `BETA-FAB-COHORT-001` (v5 — 13 cohort, 130 FABs)
- `BETA-VTAG-001` (v1)
- `BETA-FORMULA-001` (v1)
- `BETA-NUDGE-001` (v1)
- `BETA-BOOKEND-001` (v3)
- `BETA-JF-AM-001` (v2)
- `BETA-JF-PM-001` (v2)
- `BETA-JF-BASELINE-001` (v2)
- `BETA-INTAKE-001` (v0.2)
- `BETA-HANDOFF-001` (v1)

## Questions

If anything is unclear: ping Val. Don't guess.

---

*BariAccess LLC — Confidential — Internal Use Only*
*© 2026 BariAccess LLC. All rights reserved.*
