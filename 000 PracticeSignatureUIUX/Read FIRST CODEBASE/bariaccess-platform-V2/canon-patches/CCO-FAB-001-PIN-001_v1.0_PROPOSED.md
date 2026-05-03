# CCO-FAB-001-PIN-001 v1.0 PROPOSED
## FAB Canon v2.0 Pass 1 — Pin Measurement Specifications

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-FAB-001-PIN-001
TITLE:          FAB Canon v2.0 Pass 1 — Pin Measurement Specifications
                (Closes the §7 deferral gap)
TYPE:           Canonical Patch (companion to CCO-FAB-001 v2.0 Pass 1)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only

PURPOSE:        Close the implementation gap between CCO-FAB-001 v2.0 Pass 1 §7
                (Pin measurement specs deferred) and PAC-ISE-002 v2.0 Signal 6
                (resolver requires Mood + Effort 7-day slopes from V2). Without
                this patch, the ISE Resolver cannot compute Trajectory, blocking
                state resolution beyond Governance/Stale checks.

DEPENDS ON:     CCO-FAB-001 v2.0 Pass 1 (May 2, 2026) — parent
                PAC-ISE-002 v2.0 (March 12, 2026) — consumer (Signal 6)
                PAC-ISE-004 v1.0A — storage layer (BehaviorEvents container)
                Beacon Canon v1.1 §6.5 (Path B — Bounded 0–100)
                ISE Canon v3.0 §2 (7-state set), §10 (Scoring)
                Voice Memory Rule, March 17, 2026 — Effort Score formula lock

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

This patch defines the measurement specs for the three **Always-On Pins** declared in CCO-FAB-001 v2.0 Pass 1 §7. These are the sensors inside every Bookend, sampled on every FAB execution.

The Open Pin Set (Screen time, App interaction patterns, iOS Focus Mode, Response latency, Voice tone) remains deferred to a future pass per FAB Canon §7. **In scope here: Timestamp · Mood · Effort.**

---

## §2. TIMESTAMP PIN (mandatory, 4 levels)

Every Bookend records four timestamps in UTC milliseconds (ISO 8601 with `Z` suffix at API boundary):

| Level | Field name | Captured at | Required |
|---|---|---|---|
| 1 | `should_start_ts` | Slot's scheduled time-window start (per RBSHELF §6.5) | ✅ |
| 2 | `actual_start_ts` | Patient/biometric trigger fires Bookend Open | ✅ |
| 3 | `duration_sec` | Computed: `actual_end_ts − actual_start_ts` (integer seconds) | ✅ |
| 4 | `actual_end_ts` | Bookend Close fires (manual confirmation, biometric auto-complete, or window expiry) | ✅ |

**Storage:** BehaviorEvents container, fields named exactly as above. Partition key `/userId` per PAC-ISE-004.

**Rule:** Timestamp delta `(actual_start_ts − should_start_ts)` is the **timing accuracy** input to FCS (FAB Consistency Score, FAB Canon §11). Acceptance window: ±15 minutes counts as on-time; beyond is logged but does not invalidate the FAB.

---

## §3. MOOD PIN

| Attribute | Value |
|---|---|
| **Source** | Patient self-report via M+E icon (Constellation Panel Row 4, V3 input — per Bookshelf RBSHELF v1.1 §13) |
| **Capture cadence** | Sampled at Bookend Open AND Bookend Close (two readings per FAB) |
| **Raw scale** | 5-point Likert: 1 = very low · 2 = low · 3 = neutral · 4 = elevated · 5 = high |
| **Normalization** | `mood_normalized = (raw − 1) / 4` → output 0.0–1.0 |
| **Calibration path** | **Beacon Path B** (Bounded 0–100) when displayed via Beacon bands. Multiply normalized by 100 for band lookup. |
| **Storage field** | `mood_raw` (1–5) AND `mood_normalized` (0.0–1.0). Both stored — raw for audit, normalized for downstream computation. |
| **Missing data** | If patient skips, default to 30 per Beacon Canon §12.3 "Routine as Ground Truth / Never Blank." Confidence indicator drops one tier. |

---

## §4. EFFORT PIN

**Effort Score formula (Voice Memory Rule, March 17, 2026 — supersedes PAC-ISE-002 v2.0 §6 Signal 6 formula):**

```
E = 0.40·F + 0.30·C + 0.30·LC

Where:
  F  = FAB Completion Rate (7-day rolling, 0.0–1.0)
  C  = Consistency (timing accuracy, 7-day rolling, 0.0–1.0)
  LC = Learning Coefficient (Memory Rule, March 17, 2026)

LC = (0.30 × Quiz_PassRate)
   + (0.25 × Quiz_Attempts_norm)
   + (0.25 × Content_Engagement_norm)
   + (0.20 × Ollie_Questions_norm)

All inputs normalized 0.0–1.0. Output E ∈ [0.0, 1.0].
```

| Attribute | Value |
|---|---|
| **Source** | Computed nightly from BehaviorEvents (V2) + Journal Layer 1 (quiz/content engagement) |
| **Capture cadence** | Bookend Close stamps the daily E value into the FAB record (NOT computed per-Bookend; daily roll-up) |
| **Calibration path** | **Beacon Path B** (Bounded 0–100) when displayed via Beacon bands |
| **Storage field** | `effort_score_daily` (0.0–1.0) on each FAB record. Daily snapshot in `effort-daily-rollup` per-user record. |
| **Missing data** | Default 30 per Beacon Canon §12.3. Confidence drops one tier. |

**Patch note for downstream consumers:** PAC-ISE-002 v2.0 Signal 6 references `E = 0.25F + 0.25C + 0.30CE + 0.20L` — this is **superseded** by the formula above. PAC-ISE-002 will be synced via planned patch **G7** (CCO-PAC-ISE-002-PATCH-001, queued after G6); until G7 is locked, this Pin Spec doc is the authoritative source for `effort_score_daily`.

---

## §5. 7-DAY SLOPE COMPUTATION (for PAC-ISE-002 Signal 6 — Trajectory)

Resolver Signal 6 requires three slope inputs. All three computed identically:

```python
# Linear regression slope over last 7 days of daily values
def compute_7day_slope(daily_values: list[float]) -> float:
    """
    daily_values: list of 7 daily means (most recent last)
    returns: slope in units of (value_unit / day)
    """
    n = len(daily_values)  # 7
    x_mean = (n - 1) / 2  # 3.0 for 7 days
    y_mean = sum(daily_values) / n
    numerator = sum((i - x_mean) * (v - y_mean) for i, v in enumerate(daily_values))
    denominator = sum((i - x_mean) ** 2 for i in range(n))
    return numerator / denominator if denominator > 0 else 0.0
```

**Direction classification per PAC-ISE-002 §15 thresholds:**

| Slope value | Direction | Resolver action |
|---|---|---|
| `slope > +0.1` | **UP** | Enables ISE-4 (Momentum) check |
| `−0.1 ≤ slope ≤ +0.1` | **FLAT** | Neutral — no ISE-4 enablement |
| `slope < −0.1` | **DOWN** | Contributes to ISE-2 (Protective) check |

Three slopes computed daily per patient: `mood_slope`, `effort_slope`, and `fsi_direction` (FSI direction comes from Signal 5 / BHR composite — out of scope here). All written to `signals` block of `ise-transition-log` per PAC-ISE-002 §12.3.

---

## §6. STORAGE HOOK SUMMARY (PAC-ISE-004 alignment)

```typescript
// BehaviorEvents container — additions per this patch
interface FABBookendRecord {
  id: string;                          // GUID
  userId: string;                      // partition key
  fabId: string;                       // FAB instance ID
  fabName: string;                     // e.g., "FAB-HYDRATION"
  family: FABFamily;                   // 7 families per v2.0 §2
  visibility: "task" | "silent";       // per v2.0 §3
  
  // Timestamp pin (§2)
  should_start_ts: string;             // ISO 8601 UTC
  actual_start_ts: string;
  actual_end_ts: string;
  duration_sec: number;
  
  // Mood pin (§3) — captured twice per FAB
  mood_raw_open: number;               // 1-5, may be null if skipped
  mood_normalized_open: number;        // 0.0-1.0
  mood_raw_close: number;
  mood_normalized_close: number;
  
  // Effort pin (§4) — daily snapshot
  effort_score_daily: number;          // 0.0-1.0, stamped at close
  
  // Outcome
  fab_outcome: "Y" | "N" | "drift";    // completion result
  
  _ts: number;                         // Cosmos auto
}
```

---

## §7. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| CCO-FAB-001 v2.0 Pass 1 §7 | Parent — closes the deferred Pin spec gap |
| PAC-ISE-002 v2.0 Signal 6 | Consumer — receives mood_slope + effort_slope from this patch |
| PAC-ISE-004 v1.0A | Storage — BehaviorEvents container hosts pin data |
| Beacon Canon v1.1 §6.5, §12.3 | Path B calibration + Never Blank default 30 |
| Beacon Calibration Algorithm v1.0 §4.2 | Path B implementation |
| RBSHELF v1.1 §13 | M+E icon location (Constellation Panel Row 4) |
| Voice Memory Rule, March 17, 2026 | Effort Score formula authority (supersedes PAC-ISE-002 v2.0) |
| **CCO-PAC-ISE-002-PATCH-001 (G7 — queued)** | Downstream sync patch — will reconcile PAC-ISE-002 v2.0 Signal 6 to this Pin Spec |

---

## §8. OPEN QUESTIONS

| # | Question | Owner |
|---|---|---|
| OQ-PIN-01 | M+E icon two-reading capture (Open + Close) — does Ollie prompt explicitly at both, or is one ambient/optional? | Val + Nikita |
| OQ-PIN-02 | Open Pin Set measurement specs (Screen time, Focus, Response latency, Voice tone) — Pass schedule? | Val (future Pass) |
| OQ-PIN-03 | Should `effort_score_daily` use a Beacon Path B confidence indicator (per §11 Beacon Canon) given LC inputs are themselves 7-day rolling? | Val + Zakiy |

---

## §9. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial patch. Closes FAB Canon v2.0 Pass 1 §7 deferred gap. Defines Timestamp (4 levels), Mood (5-pt Likert → 0–1), Effort (March 17 formula). 7-day slope computation locked. Storage hooks aligned to PAC-ISE-004. Honest flag: Effort formula in PAC-ISE-002 v2.0 superseded — sync patch G7 queued.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — CCO-FAB-001-PIN-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
