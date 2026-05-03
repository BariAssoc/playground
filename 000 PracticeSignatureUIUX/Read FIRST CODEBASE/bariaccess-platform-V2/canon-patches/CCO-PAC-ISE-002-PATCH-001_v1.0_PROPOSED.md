# CCO-PAC-ISE-002-PATCH-001 v1.0 PROPOSED
## PAC-ISE-002 Signal 6 — Effort Formula Sync to Pin Specs Authority

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-PAC-ISE-002-PATCH-001
TITLE:          PAC-ISE-002 Signal 6 — Effort Formula Sync to Pin Specs Authority
                (Housekeeping wrap — closes Effort formula drift)
TYPE:           Canonical Patch (companion to PAC-ISE-002 v2.0)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only
CONFIDENTIALITY: TRADE SECRET (inherits from PAC-ISE-002 parent)

PURPOSE:        Synchronize PAC-ISE-002 v2.0 §6 Signal 6 Effort Score formula
                with the canonical authority established in CCO-FAB-001-PIN-001
                v1.0 (G1). The PAC-ISE-002 v2.0 (March 12, 2026) formula was
                superseded 5 days later by Voice Memory Rule (March 17, 2026)
                but the PAC was not updated. This patch closes that drift.

RATIONALE:      PAC-ISE-002 v2.0 is a TRADE SECRET document. Per BariAccess
                governance doctrine, trade-secret canon must NOT contradict
                companion canon. Maintaining drift in a trade-secret formula
                creates audit risk for investor due diligence, university
                research partnerships, and future legal review. This patch
                resolves the drift formally rather than leaving it as a
                "read the comments" workaround.

DEPENDS ON:     PAC-ISE-002 v2.0 (March 12, 2026) — parent
                CCO-FAB-001-PIN-001 v1.0 (G1, May 2, 2026) — authority
                Voice Memory Rule, March 17, 2026 — formula lock origin

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

This is a **housekeeping sync patch.** Single-section update to PAC-ISE-002 v2.0 §6 Signal 6 to reference the canonical Effort Score formula established in G1 (Pin Specs).

**No architectural changes.** No threshold changes. No new fields. No state machine changes. Pure formula reference correction.

**In scope:** §6 Signal 6 Effort formula reference replacement.

**Out of scope:** Anything else in PAC-ISE-002 v2.0. The other 5 signals (Governance Flag, Data Freshness, Cognitive Load, Health Status, Engagement, Trajectory) are unchanged.

---

## §2. THE DRIFT

PAC-ISE-002 v2.0 §6 Signal 6 currently states:

> **Effort source** | Effort Score (locked: `E = 0.25F + 0.25C + 0.30CE + 0.20L`), 7-day slope

This formula was locked March 12, 2026 in PAC-ISE-002 v2.0. **Five days later**, on March 17, 2026, a Voice Memory Rule established a new Effort Score formula:

```
E = 0.40·F + 0.30·C + 0.30·LC

Where:
  F  = FAB Completion Rate (7-day rolling, 0.0–1.0)
  C  = Consistency (timing accuracy, 7-day rolling, 0.0–1.0)
  LC = Learning Coefficient

LC = (0.30 × Quiz_PassRate)
   + (0.25 × Quiz_Attempts_norm)
   + (0.25 × Content_Engagement_norm)
   + (0.20 × Ollie_Questions_norm)
```

The newer formula was canonized in G1 (CCO-FAB-001-PIN-001 v1.0) §4 on May 2, 2026, with explicit supersession notice. This patch propagates that supersession into PAC-ISE-002.

---

## §3. THE PATCH (LOCKED)

**Replace the Signal 6 Effort source row in PAC-ISE-002 v2.0 §6** with:

> **Effort source** | Effort Score `effort_score_daily` per CCO-FAB-001-PIN-001 v1.0 §4 (`E = 0.40·F + 0.30·C + 0.30·LC`). Stored in `effort-daily-rollup` per-user record. Resolver reads daily snapshot — does NOT recompute. 7-day slope computed per CCO-FAB-001-PIN-001 v1.0 §5.

### 3.1 What changes

| Before (PAC-ISE-002 v2.0) | After (this patch) |
|---|---|
| Formula inline in PAC: `E = 0.25F + 0.25C + 0.30CE + 0.20L` | Formula reference: see CCO-FAB-001-PIN-001 v1.0 §4 |
| Signal 6 implies Resolver computes Effort | Signal 6 reads `effort_score_daily` from rollup container |
| Components: F, C, CE, L | Components: F, C, LC (per G1 authority) |

### 3.2 What does NOT change

- Signal 6 input contract (still produces `mood_slope`, `effort_slope`, `fsi_direction`)
- 7-day slope computation method (linear regression — same for all three slope inputs, per G1 §5)
- Direction classification thresholds (`THRESHOLD_NEG = -0.1`, `THRESHOLD_POS = +0.1`)
- Resolver priority chain
- Signal 6 role in ISE state determination (UP enables ISE-4; DOWN contributes to ISE-2)
- Storage location — still written to `signals` block of `ise-transition-log` per PAC-ISE-002 §12.3

### 3.3 Implementation impact for Zakiy

Zakiy's Resolver code reads `effort_score_daily` from the `effort-daily-rollup` container, not a recomputed formula. The Resolver is a dispatcher (per PAC-ISE-002 v2.0 §3.1) — it does not compute Effort Score. The Effort Score is computed nightly by the FAB system (per G1) and stored as a daily snapshot.

Zakiy's TypeScript / pseudocode for Signal 6 reads:

```typescript
// Resolver Signal 6 — Trajectory (UPDATED per this patch)
async function getSignal6Trajectory(userId: string): Promise<TrajectorySignal> {
  // Read 7 days of daily rollups
  const rollups = await getEngagementRollups7Days(userId);
  
  // Extract daily values (already computed by FAB system per G1 §4)
  const moodValues = rollups.map(r => r.mood_normalized_daily);  // 0.0-1.0
  const effortValues = rollups.map(r => r.effort_score_daily);   // 0.0-1.0 per G1 §4
  
  // Compute slopes per G1 §5
  const moodSlope = compute7daySlope(moodValues);
  const effortSlope = compute7daySlope(effortValues);
  
  // FSI direction from Signal 5 / BHR composite
  const fsiDirection = await getFsiDirection7Day(userId);
  
  return {
    mood_slope: moodSlope,
    effort_slope: effortSlope,
    fsi_direction: fsiDirection,
    direction: classifyDirection(moodSlope, effortSlope, fsiDirection)
  };
}
```

---

## §4. AUDIT NOTE FOR FUTURE READERS

When future readers (Zakiy + future developers, investor due diligence reviewers, university research partners, legal counsel) encounter PAC-ISE-002 v2.0:

1. Read PAC-ISE-002 v2.0 + this patch (CCO-PAC-ISE-002-PATCH-001 v1.0) as a unit
2. The Effort Score formula authority is **G1 (CCO-FAB-001-PIN-001 v1.0 §4)**, not PAC-ISE-002 v2.0 §6
3. The original PAC-ISE-002 v2.0 §6 formula (`E = 0.25F + 0.25C + 0.30CE + 0.20L`) is HISTORICAL — it was locked March 12, 2026 and superseded March 17, 2026
4. Both formulas should appear in the documentation chain to preserve audit trail

This explicit audit note is included so the supersession is discoverable, not buried.

---

## §5. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| PAC-ISE-002 v2.0 §6 Signal 6 | Parent — section being patched |
| CCO-FAB-001-PIN-001 v1.0 (G1) §4 | Authority — canonical Effort Score formula |
| CCO-FAB-001-PIN-001 v1.0 (G1) §5 | Authority — 7-day slope computation |
| Voice Memory Rule, March 17, 2026 | Origin — formula supersession event |

---

## §6. OPEN QUESTIONS

None. This is a pure sync patch with no new architectural decisions.

---

## §7. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Housekeeping sync patch. PAC-ISE-002 v2.0 §6 Signal 6 Effort formula reference updated from inline `E = 0.25F + 0.25C + 0.30CE + 0.20L` (March 12, 2026 — superseded) to canonical reference at CCO-FAB-001-PIN-001 v1.0 §4 (`E = 0.40·F + 0.30·C + 0.30·LC` per March 17, 2026 Voice Memory Rule). Resolver clarified to READ effort_score_daily from rollup container, not recompute. No architectural, threshold, or state machine changes. Pure reference correction. Closes Effort formula drift in trade-secret canon.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — CCO-PAC-ISE-002-PATCH-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
CONFIDENTIALITY: TRADE SECRET (inherits from PAC-ISE-002 parent)
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
