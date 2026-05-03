# PAC-ISE-004 — Cosmos DB Schema: ISE State + Transition Log

**Source:** 33318 (resolved canonical). Containers: `ise-current-state`, `ise-transition-log`. Partition key: `/userId`. Alternative 33322 used `ise_state`/`ise_transition` and `/psid` — this document is the locked canonical.

Version: v1.0A  
Status: Canonical / Active (Internal / Trade-Secret)  
Domain: BariAccess™ OS → Identity Engine → Data Persistence  
Audience: Backend, Data Engineering, QA, Audit, Compliance  
Confidentiality: Internal Only

---

## 1. Purpose

This PAC defines the Cosmos DB container schema for:

1. **Current ISE State** — the latest resolved ISE for each user
2. **ISE Transition Log** — historical record of state changes for audit, tuning, and compliance

Together, these enable:
- Audit traceability (who was in what state, when, why)
- Threshold tuning with real cohort data
- Compliance reporting (no raw biometrics stored)
- Transition pattern analysis (without exposing internals)

---

## 2. Hard Rules (Non-Negotiable)

1. **No raw biometrics** — only abstracted scores and reason codes
2. **Immutable transition log** — append-only, no updates or deletes
3. **Single current state per user** — latest snapshot only
4. **Governance redaction enforced** — ISE-5 records have limited visibility
5. **TTL policy** — transition logs expire per retention policy (default: 365 days)
6. **Partition key** — `userId` for both containers

---

## 3. Container Definitions

### 3.1 Container: `ise-current-state`

**Purpose**: Stores the latest ISE state for each user (overwritten on each resolve).

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Document ID (= `userId`) |
| `userId` | string | ✅ | Partition key |
| `version` | string | ✅ | Schema version (`v1.0A`) |
| `state` | string (enum) | ✅ | Current ISE enum value |
| `resolvedAt` | datetime | ✅ | ISO 8601 timestamp of resolution |
| `reasonCodes` | array[string] | ✅ | Abstracted reason codes (max 10) |
| `contributors` | array[object] | ✅ | Abstracted signal contributors |
| `render` | object | ✅ | Identity icon tokens |
| `cta` | object | ✅ | Button/CTA policy |
| `ollie` | object | ✅ | Ollie Space policy |
| `governance` | object | ❌ | Optional governance block (ISE-5 only) |
| `_ts` | number | auto | Cosmos DB timestamp |

**Indexing Policy**:
- Partition key: `/userId`
- Indexed: `state`, `resolvedAt`
- Excluded: `render`, `cta`, `ollie` (not queried)

**Sample Document**:

```json
{
  "id": "user_abc123",
  "userId": "user_abc123",
  "version": "v1.0A",
  "state": "ISE_2_PROTECTIVE_RECOVERY_FORWARD",
  "resolvedAt": "2026-01-15T20:12:33Z",
  "reasonCodes": ["RECOVERY_LOW", "SLEEP_DISRUPTION_HIGH"],
  "contributors": [
    { "domain": "biometric", "direction": "down", "note": "Readiness below baseline" },
    { "domain": "sleep", "direction": "down", "note": "Timing/duration disruption" }
  ],
  "render": {
    "identityIcon": {
      "posture": "softened",
      "saturation": "muted",
      "motion": "minimal",
      "overlay": "none"
    }
  },
  "cta": {
    "mode": "recovery",
    "maxVisible": 4,
    "orderingBias": "recoveryFirst",
    "restrictedActions": []
  },
  "ollie": {
    "cadence": "slow",
    "promptDensity": "reduced",
    "voiceStyle": "protective",
    "templateKeys": ["ISE2_STABILIZE"]
  },
  "_ts": 1736971953
}
```

---

### 3.2 Container: `ise-transition-log`

**Purpose**: Append-only log of all ISE state transitions for audit and analysis.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique document ID (GUID) |
| `userId` | string | ✅ | Partition key |
| `version` | string | ✅ | Schema version (`v1.0A`) |
| `transitionId` | string | ✅ | Unique transition identifier |
| `previousState` | string (enum) | ✅ | ISE state before transition (or `null` if first) |
| `newState` | string (enum) | ✅ | ISE state after transition |
| `transitionAt` | datetime | ✅ | ISO 8601 timestamp |
| `durationInPreviousState` | number | ❌ | Seconds in previous state (null if first) |
| `reasonCodes` | array[string] | ✅ | Reason codes for new state |
| `contributorSummary` | array[object] | ✅ | Abstracted contributors (domain + direction only) |
| `triggerSource` | string | ✅ | What triggered the resolve (`scheduled`, `manual`, `event`) |
| `governanceApplied` | boolean | ✅ | Whether governance override was applied |
| `redactionLevel` | string | ✅ | `none`, `light`, `strict` |
| `_ts` | number | auto | Cosmos DB timestamp |
| `_ttl` | number | ✅ | TTL in seconds (default: 31536000 = 365 days) |

**Indexing Policy**:
- Partition key: `/userId`
- Indexed: `newState`, `previousState`, `transitionAt`, `triggerSource`, `governanceApplied`
- Composite index: `[userId, transitionAt DESC]` for recent history queries

**Sample Document**:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "user_abc123",
  "version": "v1.0A",
  "transitionId": "txn_20260115_201233_abc123",
  "previousState": "ISE_1_ALIGNED_AVAILABLE",
  "newState": "ISE_2_PROTECTIVE_RECOVERY_FORWARD",
  "transitionAt": "2026-01-15T20:12:33Z",
  "durationInPreviousState": 43200,
  "reasonCodes": ["RECOVERY_LOW", "SLEEP_DISRUPTION_HIGH"],
  "contributorSummary": [
    { "domain": "biometric", "direction": "down" },
    { "domain": "sleep", "direction": "down" }
  ],
  "triggerSource": "scheduled",
  "governanceApplied": false,
  "redactionLevel": "none",
  "_ts": 1736971953,
  "_ttl": 31536000
}
```

---

## 4. Governance & Redaction Rules

### 4.1 ISE-5 (Restricted/Guarded) Handling

When `newState = ISE_5_RESTRICTED_GUARDED`:

| Field | Behavior |
|-------|----------|
| `reasonCodes` | Limited to `GOV_RESTRICTED_MODE` only |
| `contributorSummary` | `[{ "domain": "governance", "direction": "flagged" }]` only |
| `redactionLevel` | Set to `strict` |
| `governance` block | Stored in `ise-current-state` but NOT in transition log |

### 4.2 Redaction Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| `none` | Full reason codes and contributors | Standard states |
| `light` | Reason codes only, contributors omitted | Sensitive context |
| `strict` | Minimal governance code only | Clinical intersection |

---

## 5. Query Patterns (Canonical)

### 5.1 Get Current State for User

```sql
SELECT * FROM c WHERE c.id = @userId
```
Container: `ise-current-state`

---

### 5.2 Get Recent Transitions for User

```sql
SELECT * FROM c 
WHERE c.userId = @userId 
ORDER BY c.transitionAt DESC 
OFFSET 0 LIMIT 20
```
Container: `ise-transition-log`

---

### 5.3 Get Transition History for Date Range

```sql
SELECT * FROM c 
WHERE c.userId = @userId 
  AND c.transitionAt >= @startDate 
  AND c.transitionAt <= @endDate
ORDER BY c.transitionAt DESC
```
Container: `ise-transition-log`

---

### 5.4 Aggregate: State Distribution (Cohort Analysis)

```sql
SELECT c.newState, COUNT(1) as count 
FROM c 
WHERE c.transitionAt >= @startDate 
GROUP BY c.newState
```
Container: `ise-transition-log`  
Note: Cross-partition query; use sparingly or with materialized views.

---

### 5.5 Aggregate: Governance Override Frequency

```sql
SELECT COUNT(1) as count 
FROM c 
WHERE c.governanceApplied = true 
  AND c.transitionAt >= @startDate
```
Container: `ise-transition-log`

---

## 6. Retention & TTL Policy

| Container | TTL | Rationale |
|-----------|-----|-----------|
| `ise-current-state` | None (no TTL) | Always keep latest state |
| `ise-transition-log` | 365 days (31536000s) | Compliance + storage cost |

**Override**: For users with clinical flags, TTL may be extended per CPIE policy (requires governance approval).

---

## 7. Consistency & Throughput

| Setting | Value | Rationale |
|---------|-------|-----------|
| Consistency Level | Session | Sufficient for single-user reads |
| Throughput Mode | Autoscale | Handle resolve spikes |
| Min RU/s | 400 | Baseline |
| Max RU/s | 4000 | Peak (tunable) |

---

## 8. Data Flow (Integration)

```
ISE Resolver (PAC-ISE-002)
    │
    ├──► ise-current-state (upsert)
    │
    └──► ise-transition-log (append)
              │
              └──► Audit / Analytics / Threshold Tuning
```

**Write Pattern**:
1. Resolver computes new ISE state
2. Compare with current state in `ise-current-state`
3. If changed:
   - Append to `ise-transition-log`
   - Upsert to `ise-current-state`
4. If unchanged:
   - Update `resolvedAt` timestamp only (optional, for liveness)

---

## 9. Security & Access Control

| Role | `ise-current-state` | `ise-transition-log` |
|------|---------------------|----------------------|
| ISE Resolver Service | Read/Write | Append Only |
| Frontend API | Read Only | No Access |
| Audit Service | Read Only | Read Only |
| Data Engineering | No Access | Read Only (aggregates) |
| Clinical Dashboard | Read Only (ISE-5 only) | Read Only (ISE-5 only) |

---

## 10. Acceptance Tests

| Test | Criteria |
|------|----------|
| Single state per user | `ise-current-state` has exactly one doc per `userId` |
| Immutable log | No updates or deletes on `ise-transition-log` |
| Governance redaction | ISE-5 records have `redactionLevel = strict` |
| TTL enforcement | Expired docs auto-deleted after 365 days |
| No raw biometrics | No HRV, RHR, or raw sleep values in any document |
| Reason code validation | All `reasonCodes` exist in PAC-ISE-003 dictionary |

---

## 11. ABAEMR Save Path

```
ABAEMR STRUCTURE
→ Technical Systems & Development
→ Developer Standards & Templates
→ PACs
→ PAC-ISE-004 Cosmos DB Schema ISE State Transition Log v1.0A
```

---

## 12. Next in Chain

- **PAC-ISE-005** — Frontend Reference Component (Constellation Icon + CTA + Ollie Controller)
- **PAC-ISE-006** — CPIE/CCIE Visibility & Redaction Matrix for ISEs

---

*End of PAC-ISE-004 v1.0A*
