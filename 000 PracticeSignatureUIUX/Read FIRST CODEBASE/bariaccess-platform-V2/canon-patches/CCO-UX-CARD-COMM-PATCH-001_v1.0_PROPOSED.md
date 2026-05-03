# CCO-UX-CARD-COMM-PATCH-001 v1.0 PROPOSED
## Cards → Journal Visibility & Redaction Map

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-UX-CARD-COMM-PATCH-001
TITLE:          Cards → Journal Visibility & Redaction Map
                (Closes the MEMO-CARD-COMM-001 §3 implementation gap)
TYPE:           Canonical Patch (companion to MEMO-CARD-COMM-001)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only

PURPOSE:        Close the Cards → Journal bridge implementation gap declared in
                MEMO-CARD-COMM-001 §3. Specifies which Journal Entry Algorithm
                columns are visible on which card surfaces, and how PAC-ISE-006
                redaction rules apply to journal-derived card content. Prevents
                clinical content from leaking to consumer-facing card surfaces.

CRITICAL HIPAA: This patch governs the boundary between consumer-visible card
                content and clinical reasoning content. Misimplementation could
                leak PHI to consumer surfaces. Acceptance tests in §7 are MANDATORY
                before Phase 1 ship.

DEPENDS ON:     MEMO-CARD-COMM-001 (May 2, 2026) — parent
                PAC-ISE-006 v1.0A — CPIE/CCIE Visibility & Redaction Matrix
                ISE Canon v3.0 §17 — CPIE/CCIE canonical disambiguation
                Memory Rule April 24, 2026 — Journal Entry Algorithm columns
                CCO-UX-CARD-001 v1.0 (ON HOLD) — Constellation Panel cards
                CCO-UX-RBCARD-001 v1.0 (WIP) — Rhythm Board card area

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
                HIPAA Privacy Rule (45 CFR §164.502 minimum necessary)
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

This patch resolves the implicit assumption in MEMO-CARD-COMM-001 §3 that "cards surface journal interactions" without specifying **which interactions are surfaced to which audience**.

**The risk:** The Journal Entry Algorithm has 9 columns spanning patient, AI, and provider. If a card naively renders all columns, clinical reasoning (Max→Ollie internal column) or provider routing (AskABA→Provider column) could appear on a consumer surface — an HIPAA violation.

**In scope:** Per-column visibility map across 4 card origin paths; redaction rules; storage/render layer enforcement; acceptance tests.

**Out of scope:** Card visual design (CARD-001 owns); journal column definitions (Memory Rule April 24 owns); BAA template (compliance memo owns).

---

## §2. CRITICAL TERMINOLOGY DISAMBIGUATION

Per ISE Canon v3.0 §17, CPIE and CCIE have **two distinct canonical meanings** that BOTH apply to this patch and must NEVER be confused:

### 2.1 As credit types (platform-wide)

| Acronym | Meaning | Example |
|---|---|---|
| **CPIE-credit** | Continue **Patient** Involvement and Education | Medication adherence FAB completion (HIPAA-tagged) |
| **CCIE-credit** | Continue **Customer** Involvement and Education | Hydration FAB completion (wellness, non-clinical) |

### 2.2 As interface layers (PAC-ISE-006 internal shorthand)

| Acronym | Meaning | Example |
|---|---|---|
| **CPIE-interface** | Clinical/Provider Interface | Provider Dashboard, Pamela's BBS console |
| **CCIE-interface** | Consumer/Wellness Interface | Patient app, Memory Lane card |

**This patch uses BOTH.** A journal row tagged `credit_type: CPIE` (clinical credit) is surfaced via the `CCIE-interface` (patient app) ONLY in redacted form, never with full clinical reasoning. The `CPIE-interface` (provider dashboard) sees the unredacted version.

**Disambiguation rule for this document:** Every reference uses the suffix `-credit` or `-interface` to make the meaning unambiguous. If you see plain "CPIE" or "CCIE" in §3+ without a suffix, it's an editorial bug — flag and fix.

---

## §3. JOURNAL ENTRY ALGORITHM COLUMNS (RECAP)

Per Memory Rule April 24, 2026, every journal entry row has these columns:

| # | Column | Content type | Authority owner |
|---|---|---|---|
| 1 | `entry_id` | Unique identifier | System |
| 2 | `category` | FAB family / domain | FAB Canon v2.0 §2 |
| 3 | `entry` | Patient action / state | Patient (V2) |
| 4 | `question` | Anchored journal question | Pamela / Ollie |
| 5 | `ollie_to_mark_first` | Initial Ollie utterance to patient | Ollie templates (PAC-ISE-003) |
| 6 | `ollie_to_max` | Ollie's question to AskABA (Max) | Ollie internal reasoning |
| 7 | `max_to_ollie` | Max's clinical reasoning back to Ollie | AskABA / Max (clinical AI) |
| 8 | `ollie_to_mark_second` | Final Ollie utterance to patient (post-Max) | Ollie templates + Max-informed |
| 9 | `askaba_to_provider` | Hidden routing flag for clinical escalation | AskABA / clinical alerting |

**Note:** Cell length cap = 125 characters per Memory Rule April 24.

---

## §4. PER-COLUMN VISIBILITY MATRIX (LOCKED)

This is the core compliance lock of the patch.

| Column | CCIE-interface (patient app) | CPIE-interface (provider) | Internal (audit) |
|---|---|---|---|
| `entry_id` | ✅ | ✅ | ✅ |
| `category` | ✅ | ✅ | ✅ |
| `entry` | ✅ | ✅ | ✅ |
| `question` | ✅ | ✅ | ✅ |
| `ollie_to_mark_first` | ✅ | ✅ | ✅ |
| `ollie_to_max` | ❌ **NEVER** | ✅ | ✅ |
| `max_to_ollie` | ❌ **NEVER** | ✅ | ✅ |
| `ollie_to_mark_second` | ✅ | ✅ | ✅ |
| `askaba_to_provider` | ❌ **NEVER** (existence not signaled) | ✅ | ✅ |

**Hard rules:**

1. **`ollie_to_max` and `max_to_ollie` are NEVER rendered to the patient app.** These are internal AI reasoning layers that contain clinical interpretation. Their existence must not be signaled — no "see clinical view" link, no greyed-out placeholder.

2. **`askaba_to_provider` existence is NEVER signaled to the patient.** If a row has this flag set, the patient sees the same row as if it didn't — no indication clinical routing occurred.

3. **All journal rows tagged `credit_type: CPIE-credit` (clinical credit type) follow the same per-column visibility above.** The credit type does NOT change column visibility; CPIE-credit and CCIE-credit rows are filtered identically.

4. **The redaction is enforced at the API/storage layer**, not the render layer. Per PAC-ISE-006 §10.3, "Redaction enforced at API layer, not client." Frontend never receives `ollie_to_max`, `max_to_ollie`, or `askaba_to_provider` for CCIE-interface requests.

---

## §5. PER-CARD-ORIGIN VISIBILITY APPLICATION

MEMO-CARD-COMM-001 §2 declares 4 card origin paths. Each renders to a specific surface, and each surface maps to a specific interface layer:

| Card origin | Surface | Interface layer | Visibility applied |
|---|---|---|---|
| **1. Program-originated** | Rhythm Board card area | CCIE-interface | Patient view (per §4) |
| **2. Q-originated** | Q dropdown context | CCIE-interface | Patient view (per §4) |
| **3. Constellation Panel-originated** | CP tile / tracker | CCIE-interface | Patient view (per §4) |
| **4. Bookshelf-originated (Slot Card)** | Bookshelf area | CCIE-interface | Patient view (per §4) |
| **5. Provider-originated (Provider Dashboard)** | Provider Dashboard | CPIE-interface | Provider view (per §4) |

**Note:** Origin #5 (Provider Dashboard) is not in the original MEMO-CARD-COMM-001 §2 (which is patient-app-focused). This patch adds it explicitly as the canonical Provider-side card surface so the visibility model is complete.

### 5.1 Cross-origin rule

A patient card and a provider card can render the same `entry_id` simultaneously with **different visibility filters applied**. Same source row, different rendering:

```
JOURNAL ROW (entry_id = abc123)
        │
        ├──► Patient app (Slot Card on Bookshelf)
        │    Renders: category, entry, question, ollie_to_mark_first, ollie_to_mark_second
        │
        ├──► Provider Dashboard
        │    Renders: ALL 9 columns including ollie_to_max, max_to_ollie, askaba_to_provider
        │
        └──► Internal audit
             Renders: ALL 9 columns + access log entry
```

---

## §6. STORAGE & API ENFORCEMENT

### 6.1 Storage layer (Cosmos DB)

Journal entries live in their own container (referenced in CCO-JOUR-DEF-001 v1.0, not in scope to redefine here). Each row stored with full 9 columns.

**Column-level access control is NOT enforced at the Cosmos layer.** Cosmos returns the full document; redaction happens in the API layer.

### 6.2 API layer (mandatory redaction filter)

Three endpoint variants, mirroring PAC-ISE-006 §7.1:

| Endpoint | Target interface | Columns returned |
|---|---|---|
| `GET /v1/journal/entries?view=patient` | CCIE-interface | Filtered per §4 (5 columns visible) |
| `GET /v1/journal/entries?view=provider` | CPIE-interface | Filtered per §4 (9 columns visible) |
| `GET /v1/internal/journal/entries` | Internal | Full 9 columns + access log |

**Authorization (per PAC-ISE-006 §7.2):**

| Endpoint | Required role |
|---|---|
| `?view=patient` | Authenticated user (self) |
| `?view=provider` | `role:clinician` + verified patient relationship |
| `/internal/...` | `role:system` or `role:audit` |

**Pamela / Master Barista authentication:** Per OQ-CARD-PATCH-01 default — Pamela authenticates with `role:clinician` (clinician-equivalent under BariAccess BAA). She accesses the `?view=provider` endpoint. May be re-scoped later if counsel requires a distinct BBS tier.

**Response headers:**

```
X-Card-Visibility: ccie-interface | cpie-interface | internal
X-Journal-Redaction-Applied: true | false
X-Patch-Version: CCO-UX-CARD-COMM-PATCH-001 v1.0
```

### 6.3 Reference implementation (TypeScript)

```typescript
const ALWAYS_REDACTED_FROM_CCIE_INTERFACE = [
  'ollie_to_max',
  'max_to_ollie',
  'askaba_to_provider'
] as const;

interface JournalEntryFull {
  entry_id: string;
  category: string;
  entry: string;
  question: string;
  ollie_to_mark_first: string;
  ollie_to_max: string;        // CPIE-interface only
  max_to_ollie: string;        // CPIE-interface only
  ollie_to_mark_second: string;
  askaba_to_provider: boolean | null;  // CPIE-interface only
  credit_type: 'CPIE-credit' | 'CCIE-credit';
  _ts: number;
}

interface JournalEntryPatientView {
  entry_id: string;
  category: string;
  entry: string;
  question: string;
  ollie_to_mark_first: string;
  ollie_to_mark_second: string;
  // credit_type intentionally omitted from patient view
  // No ollie_to_max, max_to_ollie, askaba_to_provider — never sent over wire
}

function redactForCCIEInterface(entry: JournalEntryFull): JournalEntryPatientView {
  return {
    entry_id: entry.entry_id,
    category: entry.category,
    entry: entry.entry,
    question: entry.question,
    ollie_to_mark_first: entry.ollie_to_mark_first,
    ollie_to_mark_second: entry.ollie_to_mark_second
    // Three clinical columns intentionally not copied
    // Whether askaba_to_provider was set is ALSO not signaled
  };
}
```

**Critical:** The function MUST construct a new object with explicit fields. Do NOT use spread/destructuring with delete — those leave detectable traces in JSON serialization that could leak through edge cases.

### 6.4 Consent revocation handling (per OQ-CARD-PATCH-03 default)

When a patient revokes consent, journal entries are **soft-deleted with audit trail**:

```typescript
interface JournalEntrySoftDeleteFields {
  revoked_at: string | null;          // ISO 8601 UTC, set on revocation
  revoked_reason: string | null;      // patient-stated reason or "patient_request"
  revocation_audit_id: string | null; // GUID linking to audit log entry
}
```

Soft-delete behavior:
- `revoked_at` IS NULL → entry visible per §4 visibility matrix
- `revoked_at` IS NOT NULL → entry NOT returned by ANY endpoint (including provider view) except `/internal/journal/entries?include_revoked=true` for audit/compliance review
- Hard delete is NOT performed — HIPAA retention requires audit trail; GDPR Right to Erasure compliance requires fuller spec from counsel (deferred)

---

## §7. ACCEPTANCE TESTS (MANDATORY BEFORE PHASE 1 SHIP)

These tests are HIPAA-relevant. All must pass before any patient-facing release.

| Test | Criteria |
|---|---|
| **T1** | Patient endpoint never returns `ollie_to_max` field — even null, even empty string |
| **T2** | Patient endpoint never returns `max_to_ollie` field |
| **T3** | Patient endpoint never returns `askaba_to_provider` field — even when value is `false` |
| **T4** | Patient endpoint never returns `credit_type` field (no CPIE/CCIE credit-type leakage) |
| **T5** | When `askaba_to_provider = true`, patient view is byte-identical to when `false` (no length leakage, no timing leakage) |
| **T6** | Provider endpoint requires `role:clinician` + verified patient relationship — 403 otherwise |
| **T7** | Provider endpoint receives all 9 columns when authorized |
| **T8** | Internal endpoint requires `role:system` or `role:audit` |
| **T9** | Audit log records every access with `interface`, `requester_role`, `redaction_applied` |
| **T10** | Patient request for `view=provider` returns 403 (not 200 with redaction) — do not signal that a richer view exists |
| **T11** | Same `entry_id` requested via both views returns different payloads with same `entry_id` and same `_ts` |
| **T12** | Redaction enforced at API layer — direct Cosmos access by frontend is impossible (network policy + RBAC) |

**Test framework expectation:** All 12 tests run in CI on every commit affecting `src/api/journal/*` or `src/storage/journal/*`. Failure of ANY test blocks merge.

---

## §8. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| MEMO-CARD-COMM-001 §3 | Parent — closes Cards → Journal bridge implementation gap |
| PAC-ISE-006 v1.0A §4–§7 | Authority — visibility matrix + API enforcement model |
| ISE Canon v3.0 §17 | Authority — CPIE/CCIE dual-meaning disambiguation |
| Memory Rule April 24, 2026 | Authority — Journal Entry Algorithm columns + 125-char cap |
| CCO-UX-CARD-001 v1.0 (ON HOLD) | Companion — Constellation Panel cards (origin #3) |
| CCO-UX-RBCARD-001 v1.0 (WIP) | Companion — Rhythm Board cards (origin #1, #2) |
| CCO-JOUR-DEF-001 v1.0 | Storage authority — Journal container schema |

---

## §9. OPEN QUESTIONS

| # | Question | Phase 1 default | Owner | Code blocker? |
|---|---|---|---|---|
| OQ-CARD-PATCH-01 | Does Pamela (Master Barista) see CPIE-interface or a third "BBS-interface" with partial provider visibility? | **Pamela = CPIE-interface (clinician-equivalent role under BariAccess BAA).** May re-scope later if counsel requires distinct tier. | Val + compliance counsel | ❌ No — Phase 1 default works |
| OQ-CARD-PATCH-02 | When patient explicitly requests "show me what the provider sees" (transparency feature), what is shown? | **NO transparency feature in Phase 1.** Defer until counsel reviews compliance implications. | Val + Crenguta Leaua Esq. | ❌ No — feature deferred |
| OQ-CARD-PATCH-03 | How are journal entries handled when patient revokes consent — soft-delete with audit trail or hard-delete? | **Soft-delete with `revoked_at` timestamp** (per §6.4). Satisfies HIPAA retention. GDPR Right to Erasure spec deferred to counsel. | Val + counsel (HIPAA + GDPR) | ❌ No — Phase 1 default codified |

---

## §10. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial patch. Closes MEMO-CARD-COMM-001 §3 Cards→Journal bridge implementation gap. CRITICAL HIPAA-relevant patch. Per-column visibility matrix locked: 5 columns visible to CCIE-interface (patient app), 9 columns visible to CPIE-interface (provider), all 9 + audit log to Internal. Three clinical columns (ollie_to_max, max_to_ollie, askaba_to_provider) NEVER rendered to patient — existence not signaled. Per-card-origin visibility application locked across 5 surfaces (4 patient origins + 1 provider). API enforcement specified with 3 endpoint variants and authorization rules. Pamela authenticates as clinician-equivalent (CPIE-interface). Soft-delete with `revoked_at` codified for consent revocation. CPIE/CCIE dual-meaning disambiguation enforced throughout document via -credit / -interface suffixes. 12 mandatory acceptance tests defined — all must pass before Phase 1 ship.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — CCO-UX-CARD-COMM-PATCH-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
HIPAA RELEVANCE: HIGH — Acceptance tests §7 are mandatory pre-ship gate
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
