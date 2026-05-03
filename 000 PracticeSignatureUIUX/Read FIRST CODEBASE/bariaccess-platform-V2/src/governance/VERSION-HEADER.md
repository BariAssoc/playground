# VERSION-HEADER — BariAccess Platform · Phase 6 V2

**Phase:** 6 of 7 — Governance + API
**Version:** V2
**Build date:** 2026-05-03
**Supersedes:** Governance + API halves of V1 Phase 2E (`bariaccess-platform-phase2E.tar.gz`)
**Status:** ✅ Audit-corrected · 184/184 tests passing in integrated suite (V2 Phase 7)
**Authority:** Valeriu E. Andrei, MD, FACS, FASMBS — Founder & CEO, BariAccess LLC
**Scribe:** Claude (Anthropic) — code generation under Val's direction

---

## What this phase contains

The Governance + API layer of the BariAccess platform — the two boundary surfaces that enforce canonical rules and serve canonical data:

**Governance (5 files)** is the per-state behavioral and visibility enforcement layer. It encodes PAC-ISE-006 (CPIE/CCIE Visibility/Redaction Matrix) and PAC-ISE-007 (AI Behavioral Governance by ISE State). These modules are pure rule engines — given an ISE state and an attempted action, they answer "allowed" / "blocked" / "log this deviation."

**API (8 files)** is the HTTP boundary — Express/Fastify-style route handlers and middleware that:
1. Authenticate and authorize via role-based access (`role-check.ts`)
2. Log every request for compliance (`audit.ts` middleware)
3. Redact every response per the visibility matrix (`redaction.ts` middleware)
4. Serve five canonical endpoints (`identity-ise`, `journal-entries`, `composite-state`, `slot-state`, `safety-trigger`)

Together, this phase is **the boundary where canon meets the wire.** Everything below this layer is internal logic; everything above this layer is the patient app, the provider portal, or external integrations.

## What changed from V1

V1 organized this work as part of `Phase 2E` (which also contained the test suite). V2 separates concerns:
- **V2 Phase 6** — Governance + API (this phase, 13 files)
- **V2 Phase 7** — Test Suite + Audit Capstone (other half of V1's 2E + post-audit additions)

This separation matters for GitHub readers because the API layer is the public surface area — readers focused on "how do I integrate with BariAccess?" should land here without test infrastructure noise. Readers focused on "is the platform verified?" should land in Phase 7 with the full test suite + audit record.

V2 changes for Phase 6 specifically:
1. **Renamed** Phase 2E (governance + API halves) → Phase 6 (V2 first-class phase)
2. **Added** `VERSION-HEADER.md` (this file)
3. **Preserved** all 13 source files bit-identical to V1 AUDITED

**No audit corrections affect this phase.** The audit corrected logic in lower layers (Resolver canon §10 literal, ORI threshold, presignal detection, Beacon §16 weighting, color tokens). These changes propagated upward to Governance + API as **input changes** but did not require any code edits in this layer because:
- Governance modules are pure rule engines that consume the (now corrected) Resolver outputs
- API routes are stateless handlers that delegate to Resolver + computation
- Middleware redaction reads from the (now correct) visibility matrix without modification

This is the architectural cleanliness validation: corrections in lower layers should NOT cascade into upper layer code edits. Phase 6 V2 confirms this held.

## What's NOT in this phase

| Expected here? Located in |
|---|---|
| Type definitions | Phase 1 |
| Beacon calibration math | Phase 2 |
| Resolver state-machine logic | Phase 3 |
| Computation utilities (slope, FCS, ORI, etc.) | Phase 4 |
| Cosmos storage container specs | Phase 4 |
| React components | Phase 5 |
| Tests for governance modules | Phase 7 |
| Tests for API routes | Phase 7 (integration test suite) |
| Audit changelog | Phase 7 |
| Zakiy onboarding docs | Phase 7 |

## Canon authorities for this phase

The implementations in this phase are literal translations of:

### Governance
- **PAC-ISE-006 v1.0A §4** — CPIE/CCIE Visibility Redaction Matrix (`visibility-matrix.ts`)
- **PAC-ISE-007 v1.0B §3** — Prohibited Capabilities (hard rules) (`prohibited-capabilities.ts`)
- **PAC-ISE-007 v1.0B §4** — Per-State AI Boundaries (`ai-boundaries.ts`)
- **PAC-ISE-007 v1.0B §7** — Compliance Logging (`audit-logger.ts`)
- **PAC-ISE-007 v1.0B §7.2** — Deviation Alerts (`deviation-detector.ts`)

### API
- **PAC-ISE-001 v1.0A** — `GET /v1/identity/ise` response shape (`routes/identity-ise.ts`)
- **CCO-UX-CARD-COMM-PATCH-001** (G5) — Three view variants (`routes/journal-entries.ts`)
- **CCO-RR-PYRAMID-ADD-PATCH-001** (G2) — Composite state queries (`routes/composite-state.ts`)
- **CCO-UX-RBSHELF-PATCH-001** (G3) — Slot state queries (`routes/slot-state.ts`)
- **DEV-WORK-D0LITE-PATCH-001** (G6) §5 — Safety trigger endpoint (`routes/safety-trigger.ts`)
- **CCO-UX-CARD-COMM-PATCH-001** (G5) §6.2 — Role-based access (`auth/role-check.ts`)
- **PAC-ISE-007 v1.0B §7** — Audit middleware (`middleware/audit.ts`)
- **CCO-UX-CARD-COMM-PATCH-001** (G5) §7 — Redaction enforcement at boundary (`middleware/redaction.ts`)

Each file's top-of-file comment cites its specific canon section.

## Dependencies on other phases

**This phase depends on:**
- **Phase 1** (Foundation) — types
- **Phase 3** (Resolver Core) — `routes/identity-ise.ts` calls `resolve()` from `src/resolver/resolver.ts`
- **Phase 4** (Computation + Storage) — `routes/composite-state.ts` calls `computeApexRollup()`; `middleware/redaction.ts` invokes `redactJournalEntry()` from `storage/redaction-layer.ts`; storage container specs consumed for query construction

**This phase is consumed by:**
- **Phase 7** (Tests) — Integration test suites exercise every API endpoint; HIPAA mandatory tests (G5 T1-T12) and Safety mandatory tests (G6 MW-T1..MW-T8) live here

**External runtime dependencies (declared in package.json from Phase 1):**
- Express or Fastify (route handler shape is framework-agnostic; choose at integration)
- Cosmos DB SDK (`@azure/cosmos`)
- Standard Node.js crypto for audit log integrity
- No other runtime libraries required — governance + API are deliberately minimal

## How to verify this phase

```bash
# Extract Phase 1 through 6 in order
tar -xzf bariaccess-platform-phase1-V2.tar.gz
tar -xzf bariaccess-platform-phase2-V2.tar.gz
tar -xzf bariaccess-platform-phase3-V2.tar.gz
tar -xzf bariaccess-platform-phase4-V2.tar.gz
tar -xzf bariaccess-platform-phase5-V2.tar.gz
tar -xzf bariaccess-platform-phase6-V2.tar.gz
cd bariaccess-platform-V2/

# Install node_modules (required for full type resolution)
npm install

# Typecheck — should be clean
npx tsc --noEmit -p tsconfig.json
# Expected: no errors. Governance + API compile cleanly with all dependencies resolved.
```

For full test suite verification, install Phase 7 and run:

```bash
npm test
# Expected: Test Suites: 10 passed, 10 total
#           Tests:       184 passed, 184 total
```

Phase 6-specific test coverage (in Phase 7):
- `tests/acceptance/g5-hipaa-redaction.test.ts` — 17 tests (12 mandatory T1-T12 + 5 bonus)
- `tests/acceptance/g6-safety-escalation.test.ts` — 12 tests (8 mandatory MW-T1..MW-T8 + 4 bonus)
- `tests/acceptance/pac-ise-007.test.ts` — Governance boundary tests
- `tests/integration/resolver-flow.test.ts` — End-to-end Mark scenario through API

## V2 lineage record

| File | V1 phase | V2 phase | Notes |
|---|---|---|---|
| `src/governance/visibility-matrix.ts` | 2E | 6 | bit-identical |
| `src/governance/ai-boundaries.ts` | 2E | 6 | bit-identical |
| `src/governance/audit-logger.ts` | 2E | 6 | bit-identical |
| `src/governance/deviation-detector.ts` | 2E | 6 | bit-identical |
| `src/governance/prohibited-capabilities.ts` | 2E | 6 | bit-identical |
| `src/api/auth/role-check.ts` | 2E | 6 | bit-identical |
| `src/api/middleware/audit.ts` | 2E | 6 | bit-identical |
| `src/api/middleware/redaction.ts` | 2E | 6 | bit-identical |
| `src/api/routes/identity-ise.ts` | 2E | 6 | bit-identical |
| `src/api/routes/journal-entries.ts` | 2E | 6 | bit-identical |
| `src/api/routes/composite-state.ts` | 2E | 6 | bit-identical |
| `src/api/routes/slot-state.ts` | 2E | 6 | bit-identical |
| `src/api/routes/safety-trigger.ts` | 2E | 6 | bit-identical |
| `VERSION-HEADER.md` | n/a | 6 | **new in V2** — this file |

## Canon mapping (file → canon section)

| File | Canon source | Section | What it implements |
|---|---|---|---|
| `governance/visibility-matrix.ts` | PAC-ISE-006 | §4 | CPIE/CCIE redaction rules per ISE state |
| `governance/ai-boundaries.ts` | PAC-ISE-007 | §4 | Per-state AI behavior boundaries (allowed/blocked/escalated) |
| `governance/audit-logger.ts` | PAC-ISE-007 | §7 | Compliance logging with chain-of-custody hashing |
| `governance/deviation-detector.ts` | PAC-ISE-007 | §7.2 | Deviation alerting (provider notification trigger) |
| `governance/prohibited-capabilities.ts` | PAC-ISE-007 | §3 | Hard-rule capabilities (e.g., NEVER prescribe, NEVER diagnose) |
| `api/auth/role-check.ts` | G5 (CARD-COMM-PATCH-001) | §6.2 | Role validation: patient / provider / staff / admin |
| `api/middleware/audit.ts` | PAC-ISE-007 | §7 | Per-request audit log entry |
| `api/middleware/redaction.ts` | G5 | §7 | Response redaction enforcement at HTTP boundary |
| `api/routes/identity-ise.ts` | PAC-ISE-001 + PAC-ISE-002 | §3, §13 | Main `GET /v1/identity/ise` — returns ISEPayload for current user |
| `api/routes/journal-entries.ts` | G5 | All | Three view variants (patient / provider / internal) |
| `api/routes/composite-state.ts` | G2 | §3 | Composite state query (live + accruing) |
| `api/routes/slot-state.ts` | G3 | All | Slot state query (17 slots) |
| `api/routes/safety-trigger.ts` | G6 | §5 | POST /v1/safety/trigger — mental wellbeing escalation |

## Audit corrections applied

**None.** Phase 6 contains no files modified by the 2026-05-03 audit. The audit findings were entirely in Phases 3, 4, and 5. Phase 6 (Governance + API) consumes the corrected outputs of those layers without itself requiring code edits.

This is a deliberate architectural property: **governance and API are mechanism, not policy.** Policy lives in canon and lower layers. When canon changes, governance + API may need to consume new fields or new rules, but the boundary modules themselves are stable.

For full audit record, see Phase 7 `CHANGELOG-AUDIT-2026-05-03.md`.

## Trade-secret notice

Per PAC-ISE-007 v1.0B, the **specific deviation thresholds** (how far an AI response can drift from canonical behavior before triggering an alert) are calibration values that live in the deployment vault, not in the codebase. The values shipping in this phase are canon defaults documented in PAC-ISE-007 §7.2. Production deployment overrides via environment variables.

The audit-logger's chain-of-custody hashing salt is also vault-side. The codebase imports it as `process.env.AUDIT_LOG_SALT` with a clearly-marked dev-only fallback.

## License & confidentiality

© 2026 BariAccess LLC. All rights reserved.
This source is proprietary. Distribution requires explicit written authorization from Val.

## Document history

| Version | Date | Change |
|---|---|---|
| V1 — phase 2E (governance + API halves) | 2026-05-03 (early) | Original Governance + API content |
| V1 — AUDITED | 2026-05-03 (mid-day) | Audit found no corrections needed in this layer |
| V2 — phase 6 | 2026-05-03 | Architectural separation from test suite; first-class V2 phase; bit-identical to V1 AUDITED |

---

**END OF VERSION-HEADER**
