# PAC-ISE-006 — CPIE/CCIE Visibility & Redaction Matrix for ISEs

Version: v1.0A  
Status: Canonical / Active  
Domain: BariAccess™ OS → Identity Engine → Governance Layer  
Audience: Backend, Frontend, Clinical, Compliance, QA, Audit  
Confidentiality: Internal Only

---

## 1. Purpose

This PAC defines the **visibility and redaction rules** that govern what ISE data is exposed to different system layers and user interfaces, based on:

- **CCIE** (Consumer/Wellness Interface) — end-user facing
- **CPIE** (Clinical/Provider Interface) — clinician/care team facing
- **Dual** — visible to both with appropriate redaction

This ensures:
- Clinical information never leaks to consumer surfaces
- Governance states are handled with appropriate opacity
- Audit trails maintain full fidelity internally
- User trust is preserved through consistent, safe disclosure

---

## 2. Hard Rules (Non-Negotiable)

1. **No diagnosis on CCIE** — consumer interface never sees clinical reason codes or flags
2. **No raw biometrics anywhere** — abstracted scores only, even on CPIE
3. **Governance states are opaque to users** — ISE-5 shows protection, not restriction reason
4. **Redaction is additive** — stricter rules always override looser rules
5. **Audit layer sees everything** — internal logs retain full payload (access-controlled)
6. **Default is CCIE** — if visibility is undefined, assume consumer-safe rules apply

---

## 3. Visibility Layers (Canonical)

| Layer | Description | Access Level |
|-------|-------------|--------------|
| **CCIE** | Consumer/Wellness Interface | End user only |
| **CPIE** | Clinical/Provider Interface | Licensed clinicians, care team |
| **Dual** | Shared visibility | Both, with appropriate redaction per layer |
| **Internal** | Backend/Audit only | System services, compliance, engineering |

---

## 4. ISE Payload Field Visibility Matrix

### 4.1 Core Fields

| Field | CCIE | CPIE | Internal |
|-------|------|------|----------|
| `version` | ✅ | ✅ | ✅ |
| `generatedAt` | ✅ | ✅ | ✅ |
| `state` | ✅ | ✅ | ✅ |

### 4.2 Reason Codes

| Reason Code Category | CCIE | CPIE | Internal |
|---------------------|------|------|----------|
| Global/Fallback | ✅ | ✅ | ✅ |
| Readiness & Recovery | ✅ | ✅ | ✅ |
| Cognitive Load & Behavior | ✅ | ✅ | ✅ |
| Momentum & Trends | ✅ | ✅ | ✅ |
| Contextual Modifiers | ⚠️ Limited | ✅ | ✅ |
| Governance/Safety | ❌ Hidden | ⚠️ Limited | ✅ |

**Contextual Modifier Rules for CCIE:**
- `TRAVEL_DISRUPTION` → ✅ Allowed
- `SOCIAL_DISRUPTION` → ✅ Allowed
- `ALCOHOL_MARKER` → ❌ Hidden (privacy)
- `ILLNESS_FLAG` → ❌ Hidden (clinical)
- `MEDICATION_CHANGE` → ❌ Hidden (clinical)

**Governance Rules for CPIE:**
- `GOV_RESTRICTED_MODE` → ✅ Allowed
- `CLINICAL_INTERSECTION_ACTIVE` → ✅ Allowed
- `SAFETY_REVIEW_REQUIRED` → ✅ Allowed
- `ACTIONS_LIMITED_BY_GOVERNANCE` → ✅ Allowed

### 4.3 Contributors

| Contributor Domain | CCIE | CPIE | Internal |
|-------------------|------|------|----------|
| `biometric` | ⚠️ Direction only | ✅ Full | ✅ Full |
| `sleep` | ✅ | ✅ | ✅ |
| `rhythm` | ✅ | ✅ | ✅ |
| `behavior` | ✅ | ✅ | ✅ |
| `cognitive` | ✅ | ✅ | ✅ |
| `governance` | ❌ Hidden | ⚠️ Limited | ✅ Full |

**CCIE Biometric Rule:**
- Show `direction` only (`up`, `down`, `stable`)
- Never show `note` field for biometric domain

### 4.4 Render Tokens

| Token | CCIE | CPIE | Internal |
|-------|------|------|----------|
| `identityIcon.*` | ✅ | ✅ | ✅ |
| `overlay: shieldLock` | ✅ (no explanation) | ✅ (with context) | ✅ |

### 4.5 CTA Policy

| Field | CCIE | CPIE | Internal |
|-------|------|------|----------|
| `mode` | ✅ | ✅ | ✅ |
| `maxVisible` | ✅ | ✅ | ✅ |
| `orderingBias` | ✅ | ✅ | ✅ |
| `restrictedActions` | ⚠️ Effect only | ✅ Full list | ✅ Full list |

**CCIE restrictedActions Rule:**
- Actions are simply not shown (filtered out)
- User never sees the restriction list itself
- No "unavailable" or "restricted" labels

### 4.6 Ollie Policy

| Field | CCIE | CPIE | Internal |
|-------|------|------|----------|
| `cadence` | ✅ | ✅ | ✅ |
| `promptDensity` | ✅ | ✅ | ✅ |
| `voiceStyle` | ✅ | ✅ | ✅ |
| `templateKeys` | ✅ | ✅ | ✅ |

### 4.7 Governance Block

| Field | CCIE | CPIE | Internal |
|-------|------|------|----------|
| `governance` object | ❌ Never | ✅ Full | ✅ Full |
| `isClinicalRouted` | ❌ | ✅ | ✅ |
| `visibility` | ❌ | ✅ | ✅ |
| `redactionLevel` | ❌ | ✅ | ✅ |

---

## 5. ISE State-Specific Visibility Rules

### 5.1 ISE-0 through ISE-4 (Standard States)

| Layer | Visibility |
|-------|------------|
| CCIE | Full payload with standard redactions |
| CPIE | Full payload |
| Internal | Full payload |

### 5.2 ISE-5 (Restricted/Guarded)

| Layer | Visibility | Special Rules |
|-------|------------|---------------|
| CCIE | Limited | See §5.2.1 |
| CPIE | Full | See §5.2.2 |
| Internal | Full | No redaction |

#### 5.2.1 ISE-5 CCIE Rules (Consumer View)

When `state = ISE_5_RESTRICTED_GUARDED` on CCIE:

```typescript
// Redacted payload for CCIE
{
  state: "ISE_5_RESTRICTED_GUARDED",
  reasonCodes: [],  // Empty - no reason disclosure
  contributors: [], // Empty - no contributor disclosure
  render: {
    identityIcon: {
      posture: "neutral",
      saturation: "standard",
      motion: "none",
      overlay: "shieldLock"  // Visual indicator only
    }
  },
  cta: {
    mode: "restricted",
    maxVisible: 3,
    orderingBias: "approvedOnly",
    restrictedActions: []  // Hidden - actions simply don't appear
  },
  ollie: {
    cadence: "strictNeutral",
    promptDensity: "minimal",
    voiceStyle: "governanceNeutral",
    templateKeys: ["ISE5_GUIDANCE_ONLY"]
  }
  // governance block: NEVER included
}
```

**User Experience:**
- Shield icon appears (no tooltip explaining why)
- Fewer actions available (no "restricted" label)
- Ollie says: "Here's what's available right now." (neutral, not alarming)
- No indication of clinical routing

#### 5.2.2 ISE-5 CPIE Rules (Clinical View)

When `state = ISE_5_RESTRICTED_GUARDED` on CPIE:

```typescript
// Full payload for CPIE
{
  state: "ISE_5_RESTRICTED_GUARDED",
  reasonCodes: ["GOV_RESTRICTED_MODE", "CLINICAL_INTERSECTION_ACTIVE"],
  contributors: [
    { domain: "governance", direction: "flagged", note: "A7 clinical flag active" }
  ],
  render: { /* full */ },
  cta: {
    mode: "restricted",
    maxVisible: 3,
    orderingBias: "approvedOnly",
    restrictedActions: ["strength_challenge", "fasting_protocol", "high_intensity"]
  },
  ollie: { /* full */ },
  governance: {
    isClinicalRouted: true,
    visibility: "cpie",
    redactionLevel: "strict"
  }
}
```

**Clinical Experience:**
- Full visibility into why restriction is active
- Can see which actions are blocked and why
- Governance block provides routing context
- Enables informed clinical decision-making

### 5.3 ISE-6 (Exploratory/Low-Signal)

| Layer | Visibility | Special Rules |
|-------|------------|---------------|
| CCIE | Full | Standard redactions |
| CPIE | Full | + data quality metrics |
| Internal | Full | + signal conflict details |

---

## 6. Redaction Level Definitions

| Level | Description | Applied When |
|-------|-------------|--------------|
| `none` | No redaction, full payload | Standard states, internal access |
| `light` | Reason codes visible, contributors limited | Sensitive context modifiers |
| `strict` | Minimal disclosure, governance hidden | ISE-5, clinical intersections |

### Redaction Application Logic

```typescript
function applyRedaction(
  payload: ISEPayload,
  targetLayer: 'ccie' | 'cpie' | 'internal',
  redactionLevel: 'none' | 'light' | 'strict'
): ISEPayload {
  
  if (targetLayer === 'internal') {
    return payload; // No redaction for internal
  }
  
  let redacted = { ...payload };
  
  if (targetLayer === 'ccie') {
    // Always remove governance block for CCIE
    delete redacted.governance;
    
    // Filter reason codes
    redacted.reasonCodes = filterReasonCodesForCCIE(payload.reasonCodes);
    
    // Filter contributors
    redacted.contributors = filterContributorsForCCIE(payload.contributors);
    
    // Hide restricted actions list (effect only)
    redacted.cta.restrictedActions = [];
  }
  
  if (redactionLevel === 'strict') {
    if (targetLayer === 'ccie') {
      // ISE-5: minimal disclosure
      redacted.reasonCodes = [];
      redacted.contributors = [];
    }
  }
  
  return redacted;
}

function filterReasonCodesForCCIE(codes: string[]): string[] {
  const HIDDEN_FROM_CCIE = [
    'ALCOHOL_MARKER',
    'ILLNESS_FLAG',
    'MEDICATION_CHANGE',
    'GOV_RESTRICTED_MODE',
    'CLINICAL_INTERSECTION_ACTIVE',
    'SAFETY_REVIEW_REQUIRED',
    'ACTIONS_LIMITED_BY_GOVERNANCE'
  ];
  return codes.filter(code => !HIDDEN_FROM_CCIE.includes(code));
}

function filterContributorsForCCIE(contributors: Contributor[]): Contributor[] {
  return contributors
    .filter(c => c.domain !== 'governance')
    .map(c => {
      if (c.domain === 'biometric') {
        // Remove note for biometric on CCIE
        return { domain: c.domain, direction: c.direction };
      }
      return c;
    });
}
```

---

## 7. API Layer Implementation

### 7.1 Endpoint Variants

| Endpoint | Target Layer | Redaction |
|----------|--------------|-----------|
| `GET /v1/identity/ise` | CCIE (default) | Applied |
| `GET /v1/identity/ise?view=cpie` | CPIE | Minimal |
| `GET /v1/internal/identity/ise` | Internal | None |

### 7.2 Authorization Requirements

| Endpoint | Required Role |
|----------|---------------|
| `/v1/identity/ise` | Authenticated user (self) |
| `/v1/identity/ise?view=cpie` | `role:clinician` + patient relationship |
| `/v1/internal/identity/ise` | `role:system` or `role:audit` |

### 7.3 Response Headers

```
X-ISE-Visibility: ccie | cpie | internal
X-ISE-Redaction-Level: none | light | strict
X-ISE-Version: v1.0A
```

---

## 8. Audit Trail Requirements

All ISE payloads, regardless of redaction applied at delivery, must be logged internally with:

| Field | Requirement |
|-------|-------------|
| Full unredacted payload | ✅ Stored |
| Target layer | ✅ Logged |
| Redaction level applied | ✅ Logged |
| Requesting user/service | ✅ Logged |
| Timestamp | ✅ Logged |
| Request context | ✅ Logged |

**Audit Log Schema Addition:**

```typescript
interface ISEAuditEntry {
  // From PAC-ISE-004
  transitionId: string;
  userId: string;
  // ... existing fields
  
  // Visibility tracking
  deliveryLog: {
    targetLayer: 'ccie' | 'cpie' | 'internal';
    redactionLevel: 'none' | 'light' | 'strict';
    requestedBy: string;
    requestedAt: string;
    fieldsRedacted: string[];
  }[];
}
```

---

## 9. UI Implementation Guidelines

### 9.1 CCIE (Consumer Interface)

| Guideline | Implementation |
|-----------|----------------|
| Never show "restricted" labels | Actions simply don't appear |
| Never explain governance | Shield icon is visual-only |
| Never show clinical codes | Filter before render |
| Use neutral language | "Here's what's available" not "You can't do X" |

### 9.2 CPIE (Clinical Interface)

| Guideline | Implementation |
|-----------|----------------|
| Show full context | Clinicians need to understand restrictions |
| Label governance states | "Clinical review in progress" |
| Show blocked actions | List with reason codes |
| Enable override workflow | If clinically appropriate |

### 9.3 Visual Differentiation

| State | CCIE Appearance | CPIE Appearance |
|-------|-----------------|-----------------|
| ISE-5 | Shield icon, neutral copy | Shield icon + "Clinical Hold" badge |
| Restricted action | Not shown | Shown grayed + reason |
| Governance block | Never visible | Collapsible panel |

---

## 10. Edge Cases & Conflict Resolution

### 10.1 Dual Visibility Requests

When a user has both CCIE and CPIE access (e.g., clinician viewing their own data):

- Default to CCIE for self-view
- Require explicit CPIE toggle for clinical view
- Log access layer in audit trail

### 10.2 Visibility Upgrade Requests

If CCIE user requests CPIE data:

- Return 403 Forbidden
- Log attempted access
- Do not reveal that additional data exists

### 10.3 Stale Redaction

If redaction rules change after payload cached:

- Payload TTL: 5 minutes max
- Re-fetch on visibility-sensitive actions
- Never cache ISE-5 payloads on client

---

## 11. Acceptance Tests

| Test | Criteria |
|------|----------|
| CCIE never sees governance block | `governance` field undefined in response |
| CCIE ISE-5 has empty reason codes | `reasonCodes.length === 0` |
| CPIE sees full ISE-5 payload | All fields present |
| Restricted actions hidden on CCIE | Actions filtered, not labeled |
| Audit trail logs delivery context | `deliveryLog` populated |
| Authorization enforced | 403 for unauthorized CPIE access |
| Headers reflect visibility | `X-ISE-Visibility` matches request |

---

## 12. Compliance Notes

| Regulation | How This PAC Addresses It |
|------------|---------------------------|
| HIPAA | Clinical data never exposed to consumer layer |
| GDPR | User can request full internal payload (data subject access) |
| SOC 2 | Audit trail logs all access with context |
| State Privacy Laws | Redaction enforced at API layer, not client |

---

## 13. ABAEMR Save Path

```
ABAEMR STRUCTURE
→ Technical Systems & Development
→ Developer Standards & Templates
→ PACs
→ PAC-ISE-006 CPIE CCIE Visibility Redaction Matrix v1.0A
```

---

## 14. ISE PAC Chain Complete

| PAC | Title | Status |
|-----|-------|--------|
| PAC-ISE-001 | Identity State Expressions™ Rendering Layer | ✅ Canonical |
| PAC-ISE-002 | Trigger Threshold Table (ISE Resolver) | ✅ Canonical |
| PAC-ISE-003 | Reason Codes Dictionary & Ollie Template Keys | ✅ Canonical |
| PAC-ISE-004 | Cosmos DB Schema: ISE State + Transition Log | ✅ Canonical |
| PAC-ISE-005 | Frontend Reference Component | ✅ Canonical |
| PAC-ISE-006 | CPIE/CCIE Visibility & Redaction Matrix | ✅ Canonical |

**The ISE system is now fully specified from concept to implementation to governance.**

---

*End of PAC-ISE-006 v1.0A*
