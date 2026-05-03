# Beacon Calibration Algorithm — Calibrating Any Formula Score to Beacon Bands Display

**Document ID:** Beacon-Calibration-Algorithm  
**Version:** 1.0  
**Date:** March 14, 2026  
**Status:** CANONICAL — LOCKED  
**Purpose:** Define a single, deterministic algorithm to calibrate any formula score into the Beacon 7-band display (0–100 score + band + color).  
**Canon alignment:** Beacon Canon v1.1; ISE Canon v3.0 (§5 tile rims, §10 ISE and Scoring); CCO-IC-SC-001 (Stability Coefficient) §6; PAC-ISE (Resolver reads Beacon output); BariAccess Algorithms FINAL (deterministic formula / state classifier).
**Alignment:** ISE Canon v3.0 and Beacon Canon v1.1 (calibration to 7-band display; Tile 1 = R&R per CCO-CP-R1T1-001). 2026-03-14.

---

## 1. Scope and Principle

**Scope:** Any numeric score produced by a BariAccess formula (e.g. R&R, Layer 1 composites, Layer 2 sub-scores, SC, Effort, domain scores V1–V4) that must be shown in the Constellation Panel using the Beacon bands.

**Principle:** One grammar for display. Every score that touches the user as a “Beacon” tile or rim color passes through this calibration so that:

- The same 7 bands and colors are used everywhere [Beacon_Canon_v1.1 (1).md, §4].
- Band thresholds and response protocols are unchanged by ISE; only upstream weights may shift [Beacon_Canon_v1.1 (1).md, §16, §22].
- Governance metrics (e.g. SC) may keep their own rules (e.g. DriftLevel) while still using Beacon for display [CCO-IC-SC-001_Stability_Coefficient_Canon_v1.0.md, §6].

**What this algorithm does NOT do:** It does not define how R&R, SC, or any composite is computed. It only defines how an already-computed score is **calibrated** to the Beacon bands for display.

---

## 2. Input Classification

The calibration algorithm accepts one numeric score and its **input type**. The type determines which path is used.

| Input Type | Description | Example | Canon reference |
|------------|-------------|---------|------------------|
| **Z** | Normalized Z-score (population or reference). Positive = better when convention applied. | SMA composite Z, component Z after ln() and ref | Beacon §6.2, §7 |
| **Bounded_0_100** | Score already on 0–100 (higher = better). | R&R, SC, CIR, RSI, Effort, many V1–V4 domain scores | Beacon §6.5, §8 Path B |
| **Raw_Range** | Score on a known numeric range [min, max] (higher or lower = better must be stated). | Custom formula on [0, 10], [0, 1], or other bounded scale | Calibration path below |

**Rule:** Input type is fixed at score design time (per White Paper or canon), not chosen at runtime. Same score always uses the same path.

---

## 3. The 7 Beacon Bands (Reference)

Band boundaries and display are from Beacon Canon v1.1 §4. No changes.

| Band | Score range | Color | Name |
|------|-------------|-------|------|
| 1 | 95–100 | Strong Green | Strong Green |
| 2 | 85–94 | Med Green | Med Green |
| 3 | 80–84 | Faint Green | Faint Green |
| 4 | 70–79 | Light Orange | Light Orange |
| 5 | 65–69 | Med Orange | Med Orange |
| 6 | 60–64 | Dark Orange | Dark Orange |
| 7 | &lt;60 | Red | Red |

---

## 4. Calibration Paths

### 4.1 Path A: Z-Score Input

**When:** Input type = **Z**.

**Steps:**

1. **Inversion (if needed):** For metrics where higher raw value means worse health, use inverted Z: `Z_display = -Z` so that positive = better [Beacon Canon §7.3].
2. **Piecewise linear map Z → 0–100:** Apply the Beacon piecewise linear function [Beacon_Canon_v1.1 (1).md, lines 186–198]:

```
If Z >= +1.5   → Score = min(100, 95 + (Z - 1.5) × 10)
If Z >= +0.7   → Score = 85 + (Z - 0.7) × 12.5
If Z >= +0.3   → Score = 80 + (Z - 0.3) × 12.5
If Z >= -0.3   → Score = 70 + (Z + 0.3) × 16.7
If Z >= -0.6   → Score = 65 + (Z + 0.6) × 16.7
If Z >= -1.0   → Score = 60 + (Z + 1.0) × 12.5
If Z <  -1.0   → Score = max(0, 60 + (Z + 1.0) × 20)
```

3. **Band lookup:** From Score (0–100), determine band by the table in §3 above.

**Output:** `(Score_0_100, Band, BandName, Color)`.

---

### 4.2 Path B: Bounded 0–100 Input

**When:** Input type = **Bounded_0_100**.

**Steps:**

1. **Clamp:** Ensure value is in [0, 100]. If outside, set to 0 or 100.
2. **No rescaling.** Score is already on the Beacon scale [Beacon Canon §6.5, §8 Path B].
3. **Band lookup:** From Score (0–100), determine band by the table in §3.

**Output:** `(Score_0_100, Band, BandName, Color)`.

**Example (SC):** SC is 0–100; it does not use the piecewise map; it goes through Beacon for display only. Band and rim color follow this path [CCO-IC-SC-001, §6].

---

### 4.3 Path C: Raw Range Input (Calibration to 0–100)

**Naming note:** This "Path C" is the **Raw_Range calibration path** in this algorithm only. It is not Beacon Canon §8 "Path C: Hybrid" (which is the normalization path for composites built from mixed V1+V2/V3 components). Here, Path C means: a single score on an arbitrary numeric range is rescaled to 0–100 then mapped to Beacon bands.

**When:** Input type = **Raw_Range** with known `min`, `max`, and direction (higher = better or higher = worse).

**Steps:**

1. **Linear rescale to 0–100:**
   - If **higher = better:**  
     `Score_0_100 = 100 × (value - min) / (max - min)`  
     (if `max == min`, treat as 50).
   - If **higher = worse:**  
     `Score_0_100 = 100 × (max - value) / (max - min)`  
     so that better raw value → higher score.
2. **Clamp** to [0, 100].
3. **Band lookup:** From Score (0–100), determine band by the table in §3.

**Output:** `(Score_0_100, Band, BandName, Color)`.

**Note:** This path is for scores that are not Z and not already 0–100. It preserves Beacon band semantics (same thresholds, same colors) while allowing arbitrary numeric ranges to be shown in the same display grammar. Bounded scoring in Beacon Canon §6.5 is per-component; this generalizes a single “any bounded range” step for calibration only.

---

## 5. Band Lookup (Common)

Given `Score` in [0, 100]:

```
If Score >= 95  → Band = 1, BandName = "Strong Green",   Color = Strong Green
If Score >= 85  → Band = 2, BandName = "Med Green",      Color = Med Green
If Score >= 80  → Band = 3, BandName = "Faint Green",    Color = Faint Green
If Score >= 70  → Band = 4, BandName = "Light Orange",   Color = Light Orange
If Score >= 65  → Band = 5, BandName = "Med Orange",    Color = Med Orange
If Score >= 60  → Band = 6, BandName = "Dark Orange",    Color = Dark Orange
Else            → Band = 7, BandName = "Red",            Color = Red
```

Boundaries are inclusive on the lower bound (e.g. 70 → Band 4).

---

## 6. End-to-End Algorithm (Pseudocode)

```
CALIBRATE_TO_BEACON(value, input_type, [min, max], higher_is_better)
  → (score_0_100, band, band_name, color)

1. IF input_type == Z:
     IF metric is "higher = worse": Z := -Z
     score_0_100 := BEACON_PIECEWISE_LINEAR(Z)   // §4.1
   ELSE IF input_type == Bounded_0_100:
     score_0_100 := CLAMP(value, 0, 100)         // §4.2
   ELSE IF input_type == Raw_Range:
     score_0_100 := RESCALE_TO_0_100(value, min, max, higher_is_better)  // §4.3
     score_0_100 := CLAMP(score_0_100, 0, 100)
   ELSE:
     RETURN error "Unknown input_type"

2. (band, band_name, color) := BAND_LOOKUP(score_0_100)   // §5

3. RETURN (score_0_100, band, band_name, color)
```

**Deterministic:** Same inputs → same outputs. Aligns with BariAccess Algorithms FINAL (deterministic formula / state classifier).

---

## 7. Edge Cases and Confidence

- **Missing data:** Handled upstream by the score’s own canon (e.g. default 30 for missing self-report [Beacon §12.3], SC = 30 fallback [CCO-IC-SC-001 §10]). Calibration receives the score produced by that logic; it does not invent values.
- **Confidence:** Confidence is attached to the score by the formula that produced it (Beacon §11). Calibration does not change confidence; display layer shows score + band + confidence together.
- **Never blank:** The system always produces a score with confidence indicator [Beacon §12.5]. Calibration always returns a valid (score, band, name, color) when given a valid input_type and value.

---

## 8. ISE and Resolver

- **ISE Canon v3.0 alignment:** Identity State Expressions modify **how** composite scores are calculated (weights), not what bands mean. Band thresholds, piecewise mapping, and this calibration are unchanged by ISE [ISE Canon v3.0 §10; Beacon Canon §16, §22]. Calibration output (score, band, color) is used for **Lane 1** presentation: tile rims (Row 1) are aligned with Beacon band color; ISE owns that presentation [ISE Canon v3.0 §5].
- **ISE:** Does not change band thresholds or this calibration. ISE can change weights inside composite formulas. Calibration runs on the resulting score.
- **Resolver:** PAC-ISE-002 Resolver reads Beacon output (scores/bands); it does not compute scores. Calibration runs before the Resolver; Resolver consumes calibrated Beacon display state.

---

## 9. Cross-References

| Document | Section | Relevance |
|----------|---------|-----------|
| Beacon Canon v1.1 | §4 | 7-band definitions |
| Beacon Canon v1.1 | §6.2, §6.5 | Piecewise (Z); bounded 0–100 direct |
| Beacon Canon v1.1 | §7, §8 | Normalization pipeline; Path A/B/C (Beacon Path C = Hybrid, not this doc’s Path C) |
| **ISE Canon v3.0** | **§5** | **Tile rims (Row 1): color aligned with Beacon band; ISE owns.** |
| **ISE Canon v3.0** | **§10** | **ISE and Scoring: weights shift by ISE; band thresholds and mapping do not change.** |
| CCO-IC-SC-001 | §6 | SC through Beacon for display |
| PAC-ISE-002 | §3 | Resolver reads Beacon; does not compute scores |
| BariAccess_Algorithms_FINAL | §2, §4 | Deterministic formula; state classifier |

---

## 10. Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | March 14, 2026 | Initial release. Path A (Z), Path B (Bounded_0_100), Path C (Raw_Range). Band lookup, pseudocode, edge cases, cross-references. Alignment with ISE Canon v3.0 (§5 tile rims, §10 scoring); Path C naming clarified vs Beacon §8 Path C: Hybrid. |

---

**END OF BEACON CALIBRATION ALGORITHM v1.0**

*This document defines the canonical algorithm for calibrating any formula score to the Beacon bands display. All implementations (frontend, backend, analytics) should use this specification. Band thresholds and piecewise breakpoints remain defined solely in Beacon Canon v1.1.*
