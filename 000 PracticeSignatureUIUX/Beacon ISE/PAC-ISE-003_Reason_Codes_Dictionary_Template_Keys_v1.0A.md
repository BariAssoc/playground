# PAC-ISE-003 — Reason Codes Dictionary & Ollie Template Keys
Version: v1.0A  
Status: Canonical / Active (Internal / Trade-Secret)  
Domain: BariAccess™ OS → Identity Engine → ISE Resolver & Ollie Space  
Audience: Backend, Frontend, Content, QA, Audit  
Confidentiality: Internal Only

---

## 1. Purpose

This PAC standardizes:
- **Reason Codes** emitted by the ISE Resolver (audit-safe, non-diagnostic)
- **Ollie Template Keys** used by Ollie Space (pre-approved, non-improvised)

Together, these prevent:
- emotional drift
- narrative inference
- diagnostic leakage
- inconsistent UI language

---

## 2. Hard Rules (Non-Negotiable)

1. Reason Codes are **abstracted** (no raw biometrics, no diagnoses)
2. Template Keys are **pre-approved only** (no free text)
3. Each ISEPayload may include **multiple reason codes**, but:
   - they must map to the resolved ISE
4. CPIE vs CCIE visibility rules apply
5. External surfaces may see **outcomes**, never internal mechanics

---

## 3. Reason Codes Dictionary (Canonical)

### 3.1 Global / Fallback
- `BASELINE_DEFAULT` — No dominant signal pattern
- `DATA_INSUFFICIENT` — Insufficient data quality
- `CONFLICTING_SIGNALS` — Incompatible signal patterns detected

---

### 3.2 Readiness & Recovery
- `READINESS_HIGH`
- `RECOVERY_LOW`
- `RECOVERY_DEBT_TREND`
- `SLEEP_DISRUPTION_MODERATE`
- `SLEEP_DISRUPTION_HIGH`
- `RHYTHM_ALIGNED`
- `RHYTHM_MISALIGNMENT`

---

### 3.3 Cognitive Load & Behavior
- `COGNITIVE_LOAD_HIGH`
- `CHOICE_COMPRESSION_REQUIRED`
- `CONSISTENCY_STRONG`
- `ADHERENCE_EROSION`
- `TASK_SATURATION`

---

### 3.4 Momentum & Trends
- `MOMENTUM_POSITIVE`
- `MOMENTUM_NEGATIVE`
- `TREND_STABLE`
- `BUILD_PHASE_CONTINUATION`

---

### 3.5 Contextual Modifiers
- `TRAVEL_DISRUPTION`
- `SOCIAL_DISRUPTION`
- `ALCOHOL_MARKER`
- `ILLNESS_FLAG`
- `MEDICATION_CHANGE`

---

### 3.6 Governance / Safety (Restricted)
- `GOV_RESTRICTED_MODE`
- `CLINICAL_INTERSECTION_ACTIVE`
- `SAFETY_REVIEW_REQUIRED`
- `ACTIONS_LIMITED_BY_GOVERNANCE`

> ❗ Governance reason codes must never be rendered verbatim to end users.

---

## 4. Mapping Reason Codes → ISE States

| ISE State | Allowed Reason Code Categories |
|----------|--------------------------------|
| ISE-0 Neutral | Global |
| ISE-1 Aligned | Readiness, Rhythm |
| ISE-2 Protective | Recovery, Sleep, Context |
| ISE-3 Contained | Cognitive Load, Behavior |
| ISE-4 Momentum | Momentum, Behavior |
| ISE-5 Restricted | Governance only |
| ISE-6 Exploratory | Global, Data Quality |

Resolvers must not emit reason codes outside the allowed set for the resolved ISE.

---

## 5. Ollie Template Keys (Canonical)

### 5.1 Neutral / Baseline
- `ISE0_INFO` — Neutral informational framing

### 5.2 Aligned / Available
- `ISE1_BUILD` — Capacity-forward, neutral encouragement

### 5.3 Protective / Recovery
- `ISE2_STABILIZE` — Protective, recovery-first framing

### 5.4 Contained / Load-Limited
- `ISE3_ONE_STEP` — Choice compression, single-step focus

### 5.5 Building / Momentum
- `ISE4_KEEP_RHYTHM` — Continuity and rhythm reinforcement

### 5.6 Restricted / Guarded
- `ISE5_GUIDANCE_ONLY` — Governance-safe guidance only

### 5.7 Exploratory / Low-Signal
- `ISE6_LEARN_RHYTHM` — Onboarding and data-collection framing

---

## 6. CPIE vs CCIE Visibility Rules

| Category | CCIE (Wellness) | CPIE (Clinical) |
|--------|------------------|-----------------|
| Reason Codes | Abstracted, limited | Full internal set |
| Template Keys | Allowed | Allowed |
| Governance Codes | Hidden | Internal only |
| Raw Signals | Never | Never (outside clinician UI) |

---

## 7. Validation Rules

- Every ISEPayload:
  - MUST include ≥1 `reasonCode`
  - MUST include ≥1 `templateKey`
- Reason Codes:
  - MUST map to the resolved ISE
- Template Keys:
  - MUST match the resolved ISE
- No dynamic string generation permitted

---

## 8. Acceptance Tests

- Resolver emits only allowed reason codes
- Ollie Space renders only approved templates
- Governance states suppress expressive language
- Audit logs show deterministic mappings

---

## 9. ABAEMR Save Path

ABAEMR STRUCTURE  
→ Technical Systems & Development  
→ Developer Standards & Templates  
→ PACs  
→ PAC-ISE-003 Reason Codes Dictionary & Template Keys v1.0A
