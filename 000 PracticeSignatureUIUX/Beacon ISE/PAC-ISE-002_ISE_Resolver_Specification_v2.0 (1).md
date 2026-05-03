# PAC-ISE-002 v2.0 — ISE Resolver Specification

**Version:** v2.0  
**Status:** CANONICAL — LOCKED (March 12, 2026)  
**Date:** March 12, 2026  
**Domain:** BariAccess™ OS → Identity Engine → ISE Resolver  
**Confidentiality:** CONFIDENTIAL / TRADE SECRET  
**Supersedes:** PAC-ISE-002 v1.0A (6 primitives replaced by 6 signals)  
**Canon Alignment:** ISE Canon v3.0 (February 20, 2026, LOCKED)  
**Audience:** Backend, Data Engineering, QA, Audit, Clinical  
**Locked By:** Dr. Valeriu E. Andrei + Claude (Pro Account)

---

## 1. Purpose

This PAC defines HOW the ISE Resolver deterministically resolves exactly one ISE state from existing system data. ISE Canon v3.0 defines WHAT ISE governs. This document defines HOW the resolver computes.

This document also serves as the trade-secret vault (TS-000 referenced in Canon v3.0). All threshold values and signal logic are proprietary.

---

## 2. Hard Rules (Non-Negotiable)

1. **Single-state output** — resolver must return exactly one enum value from the 7-state set
2. **Governance overrides first** — ISE-5 has absolute priority when triggered
3. **No narrative / no emotion / no diagnosis** — resolver is deterministic logic only
4. **No raw biometric exposure at UI layer** — raw values stay internal to the resolver
5. **Reason codes must be abstracted and audit-safe** — per PAC-ISE-003 dictionary
6. **Resolver is a dispatcher, not a surgeon** — it reads existing data and routes. It does not compute health scores. Beacon does that.
7. **Output conforms to ISEPayload v1.0A** — per PAC-ISE-001 schema

---

## 3. Architecture: Resolver as Dispatcher

### 3.1 What the Resolver Does

The resolver answers one question: **Given this patient's health status (from Beacon), engagement level, and cognitive capacity — what MODE should the entire system operate in right now?**

It reads 6 signals from existing data sources. It runs a priority chain. It outputs one of 7 states. First match wins.

### 3.2 What the Resolver Does NOT Do

- Does NOT compute health scores (Beacon does that)
- Does NOT compute intermediate primitives (v1.0A approach — SUPERSEDED)
- Does NOT diagnose or interpret clinical meaning
- Does NOT own downstream gating or enforcement (Lane 2 systems own that — per Canon §3.1)

### 3.3 Data Flow (per Canon §4)

```
V1 + V2 + V3 + V4 → CLINICAL INTERSECTION
        │
        ▼
   BEACON PIPELINE (scores computed)
        │
        ▼
   ISE RESOLVER (reads 6 signals from Beacon + App)
        │
        ▼
   ONE ISE STATE (enum)
        │
   ┌────┴────────────────────┐
   ▼                         ▼
LANE 1 (ISE owns)          LANE 2 (downstream consumes)
RENDERING + BEHAVIOR       PrivilegeExposure, PAC-ISE-007, etc.
```

### 3.4 Change from v1.0A

| v1.0A (SUPERSEDED) | v2.0 (CURRENT) | Reason |
|---|---|---|
| 6 primitives (RRS, SDI, RMI, CLI, BAS, MOM) computed from scratch | 6 signals read from existing system data | Primitives duplicated Beacon's work. No formulas existed. Signals use data that's already computed. |
| Resolver was a computer | Resolver is a reader/dispatcher | Eliminates redundant computation layer |
| Pseudocode referenced undefined variables | Pseudocode references real database fields | Developer can implement immediately |

---

## 4. The 7 ISE States (from Canon §2 — DO NOT MODIFY)

| State | Enum | Name |
|---|---|---|
| ISE-0 | ISE_0_NEUTRAL_BASELINE | Neutral / Baseline |
| ISE-1 | ISE_1_ALIGNED_AVAILABLE | Aligned / Available |
| ISE-2 | ISE_2_PROTECTIVE_RECOVERY_FORWARD | Protective / Recovery-Forward |
| ISE-3 | ISE_3_CONTAINED_LOAD_LIMITED | Contained / Load-Limited |
| ISE-4 | ISE_4_BUILDING_MOMENTUM | Building / Momentum |
| ISE-5 | ISE_5_RESTRICTED_GUARDED | Restricted / Guarded |
| ISE-6 | ISE_6_EXPLORATORY_LOW_SIGNAL | Exploratory / Low-Signal |

---

## 5. Priority Order (from Canon §4 — DO NOT MODIFY)

```
1. Governance gating         → ISE-5
2. Low-signal / onboarding   → ISE-6
3. Containment / overload    → ISE-3
4. Protective / recovery     → ISE-2
5. Aligned / available       → ISE-1
6. Building / momentum       → ISE-4
7. Fallback                  → ISE-0
```

**Why this order:** Governance always wins. Low-signal overrides non-governance states. Momentum is intentionally after Aligned to prevent it from overriding a depleted or misaligned day.

---

## 6. The 6 Resolver Signals

The resolver reads 6 signals. All are database reads from existing data. No new computation is required.

### Signal 1: Governance Flag

| Attribute | Value |
|---|---|
| **Question it answers** | Is the provider in charge? |
| **Data type** | Boolean (true / false) |
| **Source** | Users table — `governance_active` field |
| **Who sets it** | Provider only. 51% rule (Canon §8). |
| **Who clears it** | Provider only. System cannot auto-release. |
| **Default** | FALSE for every new user |
| **Resolver action** | If TRUE → ISE-5 immediately. No other signal checked. |

### Signal 2: Data Freshness

| Attribute | Value |
|---|---|
| **Question it answers** | Do we have recent data? |
| **Data type** | Hours since last real V1 or V2 data point |
| **Source** | BiometricRecords + BehaviorEvents — most recent `_ts` or `measurementTimestamp` |
| **Threshold** | THRESHOLD_STALE (default: 72 hours — calibrate during WoZ) |
| **Resolver action** | If stale → ISE-6. Prevents misinterpreting data absence as health crisis. |
| **Includes** | Onboarding check: if `onboarding_days < 7` → ISE-6 regardless of freshness |

### Signal 3: Cognitive Load

| Attribute | Value |
|---|---|
| **Question it answers** | Is the patient's brain full? |
| **Components** | PLI (Parking Lot Index) count + Space-State |
| **PLI source** | System-calculated — count of unresolved items in Parking Lot queue |
| **Space source** | User-reported via Constellation Panel Row 4 (V3). NEVER system-inferred. |
| **Threshold** | PLI >= THRESHOLD_PLI (default: 5) AND (Space == "vulnerable" OR composites_in_orange >= 3) |
| **Resolver action** | If overloaded → ISE-3 |

### Signal 4: Health Status

| Attribute | Value |
|---|---|
| **Question it answers** | Is the body in trouble? |
| **Data type** | Count of Beacon composites in Orange (Bands 4-6) and Red (Band 7) |
| **Source** | Beacon pipeline output — 8 composite scores mapped to 7-band system |
| **Phase 1 proxy** | Device readiness/recovery score (Oura, Whoop, Garmin) mapped to band equivalent |
| **What resolver reads** | `composites_in_orange` (count), `composites_in_red` (count), `any_presignal_active` (boolean) |
| **Resolver action** | Used in ISE-2 check (combined with Signal 5 or Signal 6) and ISE-1 check (absence of trouble) |

### Signal 5: Engagement Status

| Attribute | Value |
|---|---|
| **Question it answers** | Is the patient still showing up and doing? |
| **Components** | FSI (FAB Stability Index) 7-day trend + ORI (Ollie Response Index) 7-day rate |
| **FSI** | Cross-FAB erosion detection. Measures behavioral adherence across ALL FAB families. Locked as BHR anchor sub-score (March 3, 2026). Trend values: `rising`, `stable`, `declining`. |
| **ORI** | Responded prompts / total prompts delivered (decay-weighted: `0.95^days_ago`). Range: 0.0 to 1.0. Leading indicator — drops 3-7 days before FSI drops. |
| **Source** | BehaviorEvents container (V2) |
| **Threshold** | ORI < THRESHOLD_ORI (default: 0.5) combined with FSI trend for routing |
| **Combined reading** | FSI stable + ORI high = Engaged. FSI stable + ORI dropping = Early Warning. FSI dropping + ORI dropping = Disengaging. |

### Signal 6: Trajectory

| Attribute | Value |
|---|---|
| **Question it answers** | Which direction is everything heading? |
| **Components** | Mood 7-day slope + Effort 7-day slope + FSI direction |
| **Mood source** | M+E icon input (V2), 5-point scale → 0.0-1.0, 7-day linear regression slope |
| **Effort source** | Effort Score (locked: `E = 0.25F + 0.25C + 0.30CE + 0.20L`), 7-day slope |
| **FSI direction** | From Signal 5 (rising / stable / declining) |
| **Data type** | Direction: UP / FLAT / DOWN |
| **Resolver action** | UP enables ISE-4 (Momentum). DOWN combined with Signal 4 or 5 contributes to ISE-2. |

### Signal Summary Table

| # | Signal | Question | Source | Data Type |
|---|---|---|---|---|
| 1 | Governance Flag | Provider in charge? | Users table | Boolean |
| 2 | Data Freshness | Recent data? | Timestamp check | Hours + onboarding days |
| 3 | Cognitive Load | Brain full? | PLI count + Space-State | Count + Category |
| 4 | Health Status | Body in trouble? | Beacon composites | Band counts + pre-signal flag |
| 5 | Engagement | Still doing? | FSI trend + ORI rate | Trend + Rate |
| 6 | Trajectory | Which direction? | Mood slope + Effort slope + FSI | UP / FLAT / DOWN |

---

## 7. Resolver Input Contract

```json
{
  "governance_flag": "boolean",
  "data_freshness_hours": "number",
  "onboarding_days": "integer",
  "pli_count": "integer",
  "space_state": "protected | challenging | vulnerable",
  "composites_in_orange": "integer (0-8)",
  "composites_in_red": "integer (0-8)",
  "any_presignal_active": "boolean",
  "fsi_trend": "rising | stable | declining",
  "ori_7d": "number (0.0 - 1.0)",
  "mood_slope": "number",
  "effort_slope": "number"
}
```

All fields are reads from existing system data. No derived scores computed by the resolver.

---

## 8. Trigger Table (Deterministic Rules)

### Rule Group G — Governance (ISE-5)

**Trigger:** `governance_flag == true`

**Reason codes:** `GOV_RESTRICTED_MODE`, `CLINICAL_INTERSECTION_ACTIVE`, `SAFETY_REVIEW_REQUIRED`, `ACTIONS_LIMITED_BY_GOVERNANCE`

**Notes:** UI shows shieldLock overlay and approved pathways only. No diagnosis disclosure. Provider exercises 51% directly.

---

### Rule Group Q — Low Signal / Onboarding (ISE-6)

**Trigger:** Governance NOT triggered AND any of:
- `onboarding_days < 7`
- `data_freshness_hours > THRESHOLD_STALE`
- Conflicting signals detected (see §9)

**Reason codes:** `LOW_SIGNAL_ONBOARDING`, `DATA_INSUFFICIENT`, `CONFLICTING_SIGNALS`

---

### Rule Group C — Contained / Load-Limited (ISE-3)

**Trigger:** Governance NOT triggered AND Low-signal NOT triggered AND:
- `pli_count >= THRESHOLD_PLI`
- AND (`space_state == "vulnerable"` OR `composites_in_orange >= 3`)

**Reason codes:** `COGNITIVE_LOAD_HIGH`, `CHOICE_COMPRESSION_REQUIRED`, `TASK_SATURATION`

---

### Rule Group P — Protective / Recovery-Forward (ISE-2)

**Trigger:** Governance NOT triggered AND Low-signal NOT triggered AND Contained NOT triggered AND either:

**Path A — Health in trouble:**
- `composites_in_red >= 1`
- AND (`fsi_trend == "declining"` OR `mood_slope < THRESHOLD_NEG`)

**Path B — Engagement collapsing:**
- `fsi_trend == "declining"` AND `ori_7d < THRESHOLD_ORI`

**Reason codes:** `RECOVERY_LOW`, `SLEEP_DISRUPTION_HIGH`, `RHYTHM_MISALIGNMENT`, `RECOVERY_DEBT_TREND`, `ADHERENCE_EROSION`, `MOMENTUM_NEGATIVE`

**Contextual modifier reason codes (if applicable):** `TRAVEL_DISRUPTION`, `SOCIAL_DISRUPTION`, `ALCOHOL_MARKER`, `ILLNESS_FLAG`, `MEDICATION_CHANGE`

---

### Rule Group A — Aligned / Available (ISE-1)

**Trigger:** Governance NOT triggered AND Low-signal NOT triggered AND Contained NOT triggered AND Protective NOT triggered AND:
- `composites_in_orange == 0` AND `composites_in_red == 0`
- AND `fsi_trend` in `["stable", "rising"]`
- AND `ori_7d >= THRESHOLD_ORI`
- AND `space_state != "vulnerable"`

**Reason codes:** `READINESS_HIGH`, `RHYTHM_ALIGNED`, `CONSISTENCY_STRONG`

---

### Rule Group M — Building / Momentum (ISE-4)

**Trigger:** Governance NOT triggered AND Low-signal NOT triggered AND NOT ISE-3/2/1 AND:
- `mood_slope > THRESHOLD_POS` AND `effort_slope > THRESHOLD_POS`
- AND `fsi_trend == "rising"`
- AND `composites_in_red == 0`
- AND `any_presignal_active == false`

**Reason codes:** `MOMENTUM_POSITIVE`, `CONSISTENCY_STRONG`, `BUILD_PHASE_CONTINUATION`

---

### Fallback — Neutral / Baseline (ISE-0)

**Trigger:** None of the above triggers fire.

**Reason codes:** `BASELINE_DEFAULT`

---

## 9. Conflict Detection (for ISE-6)

Conflicting signals are defined as:
- `composites_in_red >= 1` AND `fsi_trend == "rising"` AND `ori_7d >= 0.8` (body failing but engagement strong — possible device error)
- `pli_count >= THRESHOLD_PLI` AND `composites_in_orange == 0` AND `fsi_trend == "stable"` (cognitive load high but everything else fine — possible PLI stacking from system, not patient)
- Abrupt day-to-day deltas that exceed plausibility gates (data freshness or device sync error)

If conflict → ISE-6 with reason `CONFLICTING_SIGNALS`.

---

## 10. Resolver Pseudocode (Deterministic)

```
function resolveISE(input):

  // CHECK 1: Governance
  if input.governance_flag == true:
    return ISE_5_RESTRICTED_GUARDED
    reasons: [GOV_RESTRICTED_MODE]

  // CHECK 2: Low signal / onboarding
  if input.onboarding_days < 7
     OR input.data_freshness_hours > THRESHOLD_STALE
     OR conflictingSignals(input):
    return ISE_6_EXPLORATORY_LOW_SIGNAL
    reasons: [LOW_SIGNAL_ONBOARDING | DATA_INSUFFICIENT | CONFLICTING_SIGNALS]

  // CHECK 3: Cognitive overload
  if input.pli_count >= THRESHOLD_PLI
     AND (input.space_state == "vulnerable" OR input.composites_in_orange >= 3):
    return ISE_3_CONTAINED_LOAD_LIMITED
    reasons: [COGNITIVE_LOAD_HIGH, CHOICE_COMPRESSION_REQUIRED]

  // CHECK 4A: Health in trouble
  if input.composites_in_red >= 1
     AND (input.fsi_trend == "declining" OR input.mood_slope < THRESHOLD_NEG):
    return ISE_2_PROTECTIVE_RECOVERY_FORWARD
    reasons: [RECOVERY_LOW, ...]

  // CHECK 4B: Engagement collapsing
  if input.fsi_trend == "declining" AND input.ori_7d < THRESHOLD_ORI:
    return ISE_2_PROTECTIVE_RECOVERY_FORWARD
    reasons: [ADHERENCE_EROSION, MOMENTUM_NEGATIVE]

  // CHECK 5: Everything aligned
  if input.composites_in_orange == 0
     AND input.composites_in_red == 0
     AND input.fsi_trend in ["stable", "rising"]
     AND input.ori_7d >= THRESHOLD_ORI
     AND input.space_state != "vulnerable":
    return ISE_1_ALIGNED_AVAILABLE
    reasons: [READINESS_HIGH, RHYTHM_ALIGNED]

  // CHECK 6: Positive momentum
  if input.mood_slope > THRESHOLD_POS
     AND input.effort_slope > THRESHOLD_POS
     AND input.fsi_trend == "rising"
     AND input.composites_in_red == 0
     AND input.any_presignal_active == false:
    return ISE_4_BUILDING_MOMENTUM
    reasons: [MOMENTUM_POSITIVE, CONSISTENCY_STRONG]

  // DEFAULT
  return ISE_0_NEUTRAL_BASELINE
  reasons: [BASELINE_DEFAULT]
```

---

## 11. Output Contract

Output conforms to ISEPayload v1.0A (per PAC-ISE-001). The resolver produces:

| Field | Source |
|---|---|
| `state` | Resolved enum from priority chain |
| `reasonCodes` | From PAC-ISE-003 dictionary only — per §8 trigger table |
| `contributors` | Abstracted: domain + direction only (no raw values) |
| `render` | Looked up from ISE_DEFAULTS table (PAC-ISE-001 §5) |
| `cta` | Looked up from ISE_DEFAULTS table |
| `ollie` | Looked up from ISE_DEFAULTS table |
| `governance` | Populated for ISE-5 only |

**Contributor domains (per PAC-ISE-001 schema):** `biometric`, `sleep`, `rhythm`, `behavior`, `cognitive`, `governance`

**Contributor directions:** `up`, `down`, `stable`, `insufficient`, `flagged`

---

## 12. Storage

### 12.1 Current State (per PAC-ISE-004)

Written to `ise-current-state` container. Upsert per userId.

### 12.2 Transition Log (per PAC-ISE-004)

Appended to `ise-transition-log` container when state changes.

### 12.3 Signal Snapshot (NEW — additive to PAC-ISE-004)

Each resolver run stores the input signals for audit and threshold calibration:

```json
{
  "signals": {
    "governance_flag": false,
    "data_freshness_hours": 4,
    "onboarding_days": 45,
    "pli_count": 2,
    "space_state": "protected",
    "composites_in_orange": 1,
    "composites_in_red": 0,
    "any_presignal_active": false,
    "fsi_trend": "stable",
    "ori_7d": 0.72,
    "mood_slope": 0.05,
    "effort_slope": 0.03
  }
}
```

This block is appended to the transition log record. Internal only — never exposed to UI or AI.

---

## 13. When the Resolver Runs

| Trigger | Description |
|---|---|
| **Daily sync** | Once per day when morning wearable data arrives |
| **Space change** | When user reports Space-State change via Constellation Panel |
| **Governance change** | When provider activates or deactivates governance flag |
| **PLI threshold** | When PLI count crosses THRESHOLD_PLI (new items stacking) |
| **Manual** | Isaiah (WoZ) or provider triggers re-resolve from dashboard |

---

## 14. Phase Strategy

### 14.1 Phase 1: Wizard of Oz

| Component | Status | Consumer |
|---|---|---|
| Resolver | Runs daily. Produces ISE state per patient. | Isaiah reads colored dot on dashboard |
| Fortress | NOT active. No AI to govern. | Isaiah uses clinical judgment |
| Calibration | Isaiah compares resolver output to his judgment. Logs Y/N. | Builds 90-day validation dataset |
| Signal 4 proxy | Device readiness score mapped to band equivalent | Full Beacon composites not yet computing |

### 14.2 Phase 3: AI Active

| Component | Status | Consumer |
|---|---|---|
| Resolver | Same code. No change. | Ollie reads ISE state before every interaction |
| Fortress | ACTIVE. Every Ollie response validated per PAC-ISE-007. | Gate between Ollie and patient |
| Calibration | Thresholds locked from Phase 1 data. Monitoring continues. | Deviation alerts per PAC-ISE-007 §7.2 |

### 14.3 What Changes Between Phases

The resolver code does not change. The 6 signals do not change. The ISE states do not change. The ONLY addition in Phase 3 is the Fortress Gate (PAC-ISE-007 enforcement) — the validation layer between Ollie and the patient.

---

## 15. Threshold Appendix (TRADE SECRET)

All thresholds are calibrated during the 90-day Wizard of Oz period. Isaiah's agreement/disagreement with resolver output determines correct values.

| Threshold | Signal | Default | Calibrated Value | Date Locked |
|---|---|---|---|---|
| THRESHOLD_STALE (hours) | Signal 2 | 72 | | |
| THRESHOLD_PLI (count) | Signal 3 | 5 | | |
| THRESHOLD_ORI (rate) | Signal 5 | 0.5 | | |
| THRESHOLD_NEG (slope) | Signal 6 | -0.1 | | |
| THRESHOLD_POS (slope) | Signal 6 | +0.1 | | |
| ISE-2 sustained → provider alert (days) | Escalation | 7 | | |
| ISE-6 sustained → patient lost alert (days) | Escalation | 14 | | |

### 15.1 Calibration Method

For each patient-day during Phase 1:
1. Record what the resolver said (ISE state + reason)
2. Record what Isaiah would have decided (his clinical judgment, state 0-6)
3. Record match (Y/N)
4. After 90 days: analyze agreement rate per threshold
5. Adjust thresholds where disagreement clusters
6. Lock thresholds with evidence

---

## 16. QA / Acceptance Tests

| Test | Criteria |
|---|---|
| Single-state guarantee | Every input resolves to exactly one ISE |
| Precedence | Governance always forces ISE-5 |
| Precedence | Low-signal overrides non-governance states |
| No raw biometrics | No HRV, RHR, sleep hours in output payload |
| Reason code validation | All reason codes exist in PAC-ISE-003 dictionary |
| Reason codes map to state | No cross-state reason codes |
| Output schema | Conforms to ISEPayload v1.0A (PAC-ISE-001) |
| Signal snapshot stored | Every resolver run logs input signals |
| Conflict detection | Conflicting signals → ISE-6, not ISE-2 |
| Edge: high engagement + red composites | → ISE-6 (conflict) not ISE-1 |
| Edge: strong momentum + vulnerable space | → ISE-3 (containment wins over momentum) |
| Edge: ISE-2 sustained 7+ days | → provider alert generated |

---

## 17. Relationship to Other PACs

| PAC | Relationship | Impact of v2.0 Rewrite |
|---|---|---|
| **ISE Canon v3.0** | Defines WHAT. This PAC defines HOW. | ✅ No change to Canon needed |
| **PAC-ISE-001** | Defines ISEPayload schema. This PAC produces it. | ✅ No change needed |
| **PAC-ISE-003** | Defines reason codes. This PAC emits them. | ✅ No change needed |
| **PAC-ISE-004** | Defines storage. This PAC writes to it. | ⚠️ Additive: `signals` block added to transition log |
| **PAC-ISE-005** | Consumes ISEPayload for rendering. | ✅ No change needed |
| **PAC-ISE-006** | Applies redaction per visibility layer. | ✅ No change needed (cosmetic: add PAC-007 to chain list) |
| **PAC-ISE-007** | Enforces AI governance per state. | ✅ No change needed |

---

## 18. Version History

| Version | Date | Changes |
|---|---|---|
| v1.0A | 2026-02-10 | Initial release. 6 primitives (RRS, SDI, RMI, CLI, BAS, MOM) as resolver inputs. |
| **v2.0** | **2026-03-12** | **Major rewrite. 6 primitives replaced by 6 signals read from existing system data. Resolver redefined as dispatcher (not computer). Trade-secret vault (TS-000) consolidated into this document. Threshold appendix added for WoZ calibration. Canon alignment verified against ISE Canon v3.0.** |

---

## 19. ABAEMR Save Path

```
ABAEMR STRUCTURE
→ Technical Systems & Development
→ Developer Standards & Templates
→ PACs
→ PAC-ISE-002 ISE Resolver Specification v2.0 (TRADE SECRET)
```

---

**END OF PAC-ISE-002 v2.0**

**Document:** PAC-ISE-002 v2.0  
**Effective:** March 12, 2026  
**Status:** CANONICAL — LOCKED  
**Supersedes:** PAC-ISE-002 v1.0A  
**Confidentiality:** TRADE SECRET  
**NO HALLUCINATIONS**
