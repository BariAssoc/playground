# CCO-ENG-LOGO-EXPR-PATCH-001 v1.0 PROPOSED
## Aurora Anticipation Index — Beacon Calibration Path Declaration

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-ENG-LOGO-EXPR-PATCH-001
TITLE:          Aurora Anticipation Index — Beacon Calibration Path Declaration
                (Closes the LOGO-EXPR v1.1 §18 implementation gap)
TYPE:           Canonical Patch (companion to CCO-ENG-LOGO-EXPR-001 v1.1)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only

PURPOSE:        Declare the Beacon Calibration Path for the Aurora Anticipation
                Index defined in LOGO-EXPR v1.1 §18.6, so that Aurora renders
                consistently with the rest of the platform when displayed via
                Beacon bands on Provider Dashboard, BBS check-in dashboard,
                Memory Lane milestone cards, and validation reports.

DEPENDS ON:     CCO-ENG-LOGO-EXPR-001 v1.1 §18 — parent (Aurora Validation Plan)
                Beacon Canon v1.1 §6.5 — Path B (Bounded 0-100)
                Beacon Calibration Algorithm v1.0 §4.2 — Path B implementation
                PAC-ISE-005 v1.0A — frontend rendering authority

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

LOGO-EXPR v1.1 §18.6 defines:

```
aurora_anticipation_index = 0.40 × normalized_reaction_time_delta
                          + 0.35 × self_report_score
                          + 0.25 × hrv_reactivity_attenuation

Range: 0.0 – 1.0
```

The parent canon does not declare which Beacon Calibration Path applies when this index is displayed via Beacon bands. This patch closes that gap.

**In scope:** Calibration Path declaration; rendering rule; missing-data handling; pre-Day-30 display rule.

**Out of scope:** Aurora formula weights (LOGO-EXPR v1.1 §18.6 owns); Phase 1/2/3 implementation sequencing (LOGO-EXPR v1.1 §18.3–§18.5 owns); reporting cadence (LOGO-EXPR v1.1 §18.7 owns).

---

## §2. CALIBRATION PATH DECLARATION (LOCKED)

**Aurora Anticipation Index is declared Beacon Calibration Path B (Bounded 0–100)** per Beacon Calibration Algorithm v1.0 §4.2.

| Attribute | Value |
|---|---|
| **Calibration Path** | **Path B (Bounded 0–100)** |
| **Native range** | 0.0–1.0 |
| **Beacon scaling** | `score_0_100 = aurora_anticipation_index × 100` |
| **Band lookup** | Standard 7-band table per Beacon Canon §4 |
| **Direction** | Higher = better (more anticipation = more habit formation) |
| **Confidence indicator** | Per Beacon Canon §11 — drops one tier per missing phase input |

### 2.1 Why Path B and not Path A or C

- **Not Path A (Z-score):** Aurora is not normalized against a population reference. It's a within-patient measure compared to that patient's own Day 0–30 baseline. No Z-score conversion appropriate.
- **Not Path C (Raw Range):** Path C is for arbitrary numeric ranges with non-zero/non-100 bounds. Aurora is already designed on 0.0–1.0 — it slots directly into Path B with simple ×100 scaling.
- **Path B (Bounded 0–100):** Native fit. Same path as all 8 R&R composites (per G2), same path as Mood and Effort (per G1). Architectural consistency across the platform.

### 2.2 Band lookup applied

Aurora maps to Beacon bands per Beacon Canon §4:

| Aurora index | Score 0–100 | Band | Color | Reading |
|---|---|---|---|---|
| 0.95–1.00 | 95–100 | 1 | Strong Green | Strong Aurora Effect — habit deeply formed |
| 0.85–0.94 | 85–94 | 2 | Med Green | Aurora Effect established |
| 0.80–0.84 | 80–84 | 3 | Faint Green | Early Aurora signal — habit forming |
| 0.70–0.79 | 70–79 | 4 | Light Orange | Anticipation forming but inconsistent |
| 0.65–0.69 | 65–69 | 5 | Med Orange | Weak anticipation — habit not consolidating |
| 0.60–0.64 | 60–64 | 6 | Dark Orange | Minimal anticipation — engagement concern |
| <0.60 | <60 | 7 | Red | No Aurora signal — flag for Pamela / provider review |

---

## §3. RENDERING RULES

### 3.1 When Aurora renders

Aurora is **NOT** a Day 1 visible metric. Per LOGO-EXPR v1.1 §18.7:

| Audience | First display | Cadence |
|---|---|---|
| **Patient** | Day 90 milestone | Day 90, Day 180 |
| **Provider** | Day 30 (initial reading) | Day 30 / 60 / 90 / 180 |
| **Pamela / Master Barista** | Day 90 | Day 90 / 180 |

Before the first display threshold, Aurora is computed silently and stored, but **not rendered to any surface**. Rendering at this stage would surface a noisy, incomplete signal.

### 3.2 Pre-display computation (Day 0–29)

| Day range | Aurora behavior |
|---|---|
| Day 0–29 | Phase 1 reaction time delta accruing; insufficient data for index. Computed nightly with `confidence = "default"`, NOT rendered anywhere. |
| Day 30 | First Provider Dashboard render. Phase 1 weight active (0.40 × reaction_time_delta), Phase 2 self-report optional (0.35 × score if available), Phase 3 (0.25 × HRV) typically null. Confidence reflects which phases active. |
| Day 60+ | All three phases potentially contributing. Confidence rises with each phase active. |
| Day 90 | First patient-visible render via Memory Lane / Annual Recap card. |

### 3.3 Render token (PAC-ISE-005 extension)

Aurora uses the **same composite render token spec** as the 8 pyramid composites (per G2 §5.2):

```typescript
// Aurora reuses CompositeRenderToken from G2
{
  state: "accruing" | "live",
  unlock_trigger_text?: "Day 30 — Provider view" | "Day 90 — Patient view",
  progress_pct?: number,                    // 0-100, days elapsed / target day
  beacon_band?: 1-7,
  beacon_score?: number,                    // 0-100
  beacon_color?: string,
  confidence?: "high" | "medium" | "low" | "default"
}
```

**Confidence calculation:**

| Phases active | Confidence | Reason |
|---|---|---|
| Phase 1 only | `low` | Single objective measure |
| Phase 1 + Phase 2 | `medium` | Behavioral + self-report |
| Phase 1 + Phase 2 + Phase 3 | `high` | All three pathways active |
| None / pre-Day-30 | `default` | Per Beacon Canon §12.3 — Never Blank, default 30 |

---

## §4. MISSING DATA HANDLING

Per Beacon Canon §12 "Missing Data Philosophy" + §12.3 "Never Blank":

| Missing component | Behavior |
|---|---|
| **No Phase 1 data** (no BioSnap drops yet) | Aurora not computed; render `accruing` state |
| **No Phase 2 self-report** (BBS skipped) | Index computed with available phases; weights renormalized to sum to 1.0 across active phases; confidence drops one tier |
| **No Phase 3 HRV** (consent not granted, or research-stage only) | Index computed without HRV; weights renormalized across Phase 1 + Phase 2; confidence drops one tier |

**Weight renormalization formula:**

```python
def renormalize_aurora_weights(active_phases: set) -> dict:
    """
    Active phases: subset of {"phase_1", "phase_2", "phase_3"}
    Returns: dict mapping phase to renormalized weight summing to 1.0
    """
    base_weights = {"phase_1": 0.40, "phase_2": 0.35, "phase_3": 0.25}
    active_total = sum(base_weights[p] for p in active_phases)
    
    if active_total == 0:
        return {}  # Pre-display — Aurora accruing
    
    return {p: base_weights[p] / active_total for p in active_phases}
```

**Example:** Mark at Day 60 has Phase 1 + Phase 2 (no HRV consent yet). Weights renormalize from `{0.40, 0.35, 0.25}` to `{0.533, 0.467}` for Phase 1 and Phase 2 respectively. Index still ranges 0.0–1.0. Confidence = `medium`.

---

## §5. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| CCO-ENG-LOGO-EXPR-001 v1.1 §18 | Parent — closes Calibration Path declaration gap |
| Beacon Canon v1.1 §6.5, §11, §12 | Path B authority + confidence + missing data |
| Beacon Calibration Algorithm v1.0 §4.2 | Path B implementation |
| CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) §5.2 | Render token reused — `CompositeRenderToken` |
| PAC-ISE-005 v1.0A | Frontend rendering authority |

---

## §6. OPEN QUESTIONS

| # | Question | Owner | Code blocker? |
|---|---|---|---|
| OQ-AURORA-PATCH-01 | Final weight calibration after Phase 1 cohort data accrual (LOGO-EXPR v1.1 §18.6 calls weights "proposed; refinement expected") | Val + Lisa (research) | ❌ No — initial weights work for Phase 1 ship |
| OQ-AURORA-PATCH-02 | Should Aurora index ever block ISE state resolution (e.g., Aurora < 0.30 contributes to ISE-2)? **Phase 1 default: NO.** Aurora is observational/validation in Phase 1; conflating "habit formation tracking" with "user state assessment" violates separation of concerns. May revisit post-launch if Aurora data shows clinical meaning. | Val (clinical) | ❌ No — Phase 1 default = no ISE contribution |

---

## §7. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial patch. Aurora Anticipation Index declared Beacon Calibration Path B (×100 scaling). Render rules locked: pre-Day-30 = accruing (no render); Day 30 = Provider view; Day 90 = Patient view via Memory Lane. Render token reused from G2 CompositeRenderToken. Missing data handling specified — weight renormalization across active phases. Confidence indicator tied to count of active phases (Phase 1 alone = low; Phase 1+2 = medium; all three = high). Pre-display Aurora stored but not rendered. OQ-AURORA-PATCH-02 defaults to NO for Phase 1 — Aurora does not drive ISE state.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — CCO-ENG-LOGO-EXPR-PATCH-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
