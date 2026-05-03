# CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 PROPOSED
## R&R Pyramid Addendum — Composite Calibration Paths, Cascade Hooks, and Phase 1 Composite Scope

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-RR-PYRAMID-ADD-PATCH-001
TITLE:          R&R Pyramid Addendum — Composite Calibration Paths,
                Cascade Hooks, and Phase 1 Composite Scope
                (Closes the Pyramid Addendum implementation gap)
TYPE:           Canonical Patch (companion to CCO-RR-PYRAMID-ADD-001 v1.0)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only

PURPOSE:        Close the implementation gap between CCO-RR-PYRAMID-ADD-001 v1.0
                (Pyramid + Ground Levels architecture) and downstream consumers
                (PAC-ISE-002 v2.0 Signal 4, Beacon Calibration Algorithm,
                PAC-ISE-005 frontend rendering). Specifies:
                  (a) Beacon Calibration Path per composite (all 8)
                  (b) Cascade-to-composite data flow (closes OQ-PYR-ADD-05)
                  (c) Phase 1 composite scope for Practice Edition launch
                  (d) `accruing` composite state — new render token

DEPENDS ON:     CCO-RR-PYRAMID-ADD-001 v1.0 PROPOSED (May 2, 2026) — parent
                PAC-ISE-002 v2.0 Signal 4 — consumer (composites_in_orange)
                PAC-ISE-005 v1.0A — frontend (new render token)
                Beacon Canon v1.1 §6.5 (Path B), §15 (Scoring Hierarchy)
                Beacon Calibration Algorithm v1.0 §4.2 (Path B)
                CCO-FAB-001-PIN-001 v1.0 (G1) — feeds Effort Score → AMP composite
                DEV-WORK-D0LITE-001 v0.3 §2 (timespan progression model)
                DEV-WORK-D0LITE-001 v0.3 §4 (3 Principles — D0 quietest state)

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

This patch resolves three concrete implementation gaps in the parent Pyramid Addendum:

- **Calibration ambiguity** — 8 composites needed explicit Beacon Path declaration
- **Cascade data flow** — ground orange → composite orange → Signal 4 was implicit
- **Phase 1 scope** — Practice Edition needed composite-by-composite readiness rules

**In scope:** All 8 composites (SRC, SBL, MBC, MEI, AMP, BCI, CRC, BHR), cascade hooks to PAC-ISE-002 Signal 4, new `accruing` render token, Phase 1 composite unlock thresholds.

**Out of scope:** Component-level (80+ inputs) calibration paths — those remain governed by their respective sub-canons. R&R apex calibration (already Path B per Beacon Canon §15).

---

## §2. ALL 8 COMPOSITES — BEACON CALIBRATION PATH B (LOCKED)

Every composite outputs a bounded 0–100 score by design (Beacon Canon §15). All 8 declared **Path B (Bounded 0–100)** per Beacon Calibration Algorithm v1.0 §4.2.

| Composite | Full name | Calibration Path | Domain | Phase 1 Status |
|---|---|---|---|---|
| **SRC** | Sleep Recovery Composite | **Path B** | Recovery / V1 | ✅ LIVE Day 1 |
| **SBL** | Stress Balance Layer | **Path B** | Recovery / V1+V2 | 🟡 ACCRUING — unlocks Day 14 |
| **MBC** | Metabolic Balance Composite | **Path B** | Metabolic / V1+V4 | 🟡 ACCRUING — unlocks Day 7 + first lab |
| **MEI** | Movement & Exercise Index | **Path B** | Activity / V1+V2 | 🟡 ACCRUING — unlocks Day 7 |
| **AMP** | Adherence & Momentum Profile | **Path B** | Behavioral / V2 | 🟡 ACCRUING — unlocks Day 14 (FCS statistical floor) |
| **BCI** | Body Composition Index | **Path B** | Structural / V1 | 🟡 ACCRUING — unlocks on first InBody/DEXA return |
| **CRC** | Circadian & Rhythm Coherence | **Path B** | Circadian / V1+V3 | ✅ LIVE Day 1 |
| **BHR** | Behavioral Health & Resilience | **Path B** | Behavioral / V2 | 🟡 ACCRUING — unlocks Day 30 (FSI maturation) |

**Calibration rule (LOCKED):** No composite uses Path A (Z-score) or Path C (Raw Range). Path B applies uniformly across the pyramid mid-layer. Component-level inputs may use Path A internally (e.g., HRV Z-score feeding into SRC), but the composite output is always Bounded 0–100 per Beacon §15.

**Missing data within composite:** Each composite handles its own component-level missing data per Beacon Canon §12 (default 30, Routine as Ground Truth, Never Blank). Composite-level confidence indicator per Beacon §11 — confidence drops one tier for each component using default 30.

---

## §3. CASCADE-TO-COMPOSITE DATA FLOW (CLOSES OQ-PYR-ADD-05)

**OQ-PYR-ADD-05 RESOLVED:** When raw V1 fires orange in ground level (e.g., FibroScan elevated → Healthspan ground orange), the cascade flows UPWARD to the composite that aggregates that data (e.g., BCI orange). **The cascade stops at the composite layer.** R&R apex score does NOT recompute in real-time.

**R&R apex behavior:** Apex updates only on its scheduled daily roll-up (nightly compute job). Patient sees granular signal at composite level during the day; apex updates morning of Day N+1.

**Why this doctrine:** Three reasons —
1. Aligns with Beacon Canon §18 Temporal Behavior (smoothing + hysteresis at apex level prevents apex thrashing)
2. Reduces compute load — composite cascades fire frequently; apex recompute is heavy (8 weighted inputs + ISE state lookup + dynamic weighting)
3. Patient UX is cleaner — composite orange is the actionable signal; apex is the daily story

### 3.1 Cascade flow (locked)

```
RAW V1 SIGNAL (e.g., FibroScan elevated)
        │
        ▼
GROUND LEVEL (Healthspan ground orange dot fires — patient sees)
        │
        ▼
COMPOSITE LAYER (BCI recomputes with new component value)
        │
        ▼ (Beacon Calibration Path B — composite score 0-100)
        │
        ▼ (Beacon band lookup → orange band fires)
        │
        ▼
COMPOSITE STATE: ORANGE (R&R card composite dot orange — patient sees)
        │
        │ ⏸ CASCADE STOPS HERE
        │
        ▼ (NOT real-time — daily roll-up only)
R&R APEX RECOMPUTES (next morning)
```

### 3.2 PAC-ISE-002 Signal 4 hook (LOCKED)

Resolver Signal 4 reads `composites_in_orange` count. Source of this count is the composite state machine, not the apex score.

```typescript
// PAC-ISE-002 Signal 4 input contract (clarified by this patch)
interface HealthStatusSignalInput {
  composites_in_orange: number;     // count of composites in orange/red bands (4-7)
  composites_in_red: number;        // count of composites in red band only (7)
  any_presignal_active: boolean;    // any composite in band 3 with declining velocity
  // Apex score NOT used by resolver — patient-facing only
}
```

**Compute schedule:**
- Composite recompute → on cascade fire (event-driven)
- Apex recompute → nightly daily roll-up only
- Resolver re-resolve → on PAC-ISE-002 §13 triggers (daily sync, Space change, governance change, PLI threshold, manual)

**Implication for Zakiy:** Composite state changes during the day fire the cascade and update Signal 4 input — but **do NOT trigger an immediate ISE re-resolve.** Resolver still runs on its scheduled triggers per PAC-ISE-002 §13. This prevents cascade-triggered ISE thrashing.

---

## §4. PHASE 1 COMPOSITE SCOPE — PRACTICE EDITION

### 4.1 Day 1 LIVE composites (2)

Both have strong Day 0–7 data substrate and ship live for Mark + all Practice Edition patients:

| Composite | Why LIVE Day 1 | Data substrate Day 0–7 |
|---|---|---|
| **SRC** | Sleep is the highest-fidelity Day 0 signal | Oura nightly: HRV, RHR, sleep stages, total sleep time, efficiency |
| **CRC** | Chronotype + sleep timing established at BBS Day 0 | Oura sleep timing + chronotype baseline + social jet lag computed nightly |

These are also the two composites most relevant to GLP-1 patients in the first week: tirzepatide affects sleep architecture and disrupts circadian rhythm in early adjustment.

### 4.2 Unlocked composites (6) — threshold-gated unlock

| Composite | Unlock trigger | Estimated Day for Mark | Celebration moment? |
|---|---|---|---|
| **MBC** | Day 7 + first lab return (HbA1c, CMP, lipids) | Day 7–10 | ✅ "Metabolic data unlocked" |
| **MEI** | Day 7 + 7 days of activity data | Day 7 | ✅ "Movement profile unlocked" |
| **BCI** | First InBody/DEXA result returned | Day 1–14 (BBS scheduling-dependent) | ✅ "Body composition unlocked" |
| **AMP** | Day 14 + FCS statistical floor reached (≥ 14 FAB executions across families) | Day 14 | ✅ "Adherence profile unlocked" |
| **SBL** | Day 14 + first stress event correlation OR full 14d HRV maturation | Day 14 | Quiet unlock |
| **BHR** | Day 30 + FSI 7-day stability + ORI rate stable | Day 30 | ✅ "Behavioral resilience unlocked" |

**Unlock semantics:**
- Pre-unlock state = `accruing` (per §5)
- On unlock trigger met → composite transitions `accruing → live`
- Unlock event logged in `ise-transition-log` with reason code `COMPOSITE_UNLOCK_<NAME>`
- Frontend renders unlock celebration (per Nikita's spec — TBD)

### 4.3 Why this scope honors the locked doctrine

Three doctrine alignments:

1. **DEV-WORK-D0LITE v0.3 §4 Principle 2:** "D0 = quietest state. Patient sees minimum needed to start." Mark sees 2 trusted composites Day 1, not 8 thin ones.
2. **DEV-WORK-D0LITE v0.3 §4 Principle 3:** "Unlocks are celebrations." Each composite unlock at its readiness threshold is a designed moment.
3. **DEV-WORK-D0LITE v0.3 §2 Timespan Progression:** Tile-level unlocks (Healthspan Day 7, Blueprint Day 30+) and composite-level unlocks share the same time-locked + event-confirmed pattern.

---

## §5. NEW RENDER TOKEN — `accruing` (PAC-ISE-005 EXTENSION)

PAC-ISE-005 v1.0A defines render tokens for `posture`, `saturation`, `motion`, `overlay` for the Identity Icon. This patch extends with a **composite-state token** — separate from ISE rendering.

### 5.1 Composite render states (LOCKED)

| State | Visual | Patient experience |
|---|---|---|
| `accruing` | Neutral gray composite dot + thin progress arc + microlabel "Data accruing — unlocks [trigger]" | Composite is structurally present but not yet scored |
| `live` | Beacon band color (per current score) — Strong Green / Med Green / Faint Green / Light Orange / Med Orange / Dark Orange / Red | Standard composite rendering per Beacon Canon §4 |

### 5.2 Token spec for Zakiy

```typescript
// PAC-ISE-005 extension — composite render token
interface CompositeRenderToken {
  state: "accruing" | "live";
  
  // accruing only
  unlock_trigger_text?: string;       // e.g., "Day 7 + first lab"
  progress_pct?: number;              // 0-100, how close to unlock
  
  // live only
  beacon_band?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  beacon_score?: number;              // 0-100
  beacon_color?: "strong_green" | "med_green" | "faint_green" 
               | "light_orange" | "med_orange" | "dark_orange" | "red";
  confidence?: "high" | "medium" | "low" | "default";  // per Beacon §11
}
```

### 5.3 Accruing-state rules

- Composite in `accruing` is **NOT counted** in Signal 4's `composites_in_orange` or `composites_in_red`
- Composite in `accruing` does **NOT trigger** cascade upward (no apex impact)
- Composite in `accruing` does **NOT block** ISE state resolution — Resolver treats accruing composites as `direction: insufficient` per PAC-ISE-001 contributor schema
- Tap on accruing composite → small popup: "Opens at [trigger]" (mirrors Practice Edition tile lock UX, DEV-WORK-D0LITE v0.3 §5)

---

## §6. STORAGE HOOKS (PAC-ISE-004 ALIGNMENT)

```typescript
// composite-state container — NEW per this patch
interface CompositeStateRecord {
  id: string;                        // = `${userId}_${compositeName}`
  userId: string;                    // partition key
  compositeName: "SRC" | "SBL" | "MBC" | "MEI" | "AMP" | "BCI" | "CRC" | "BHR";
  state: "accruing" | "live";
  
  // Score snapshot (only when state = "live")
  score_0_100: number | null;
  beacon_band: number | null;        // 1-7
  confidence: "high" | "medium" | "low" | "default" | null;
  
  // Unlock metadata
  unlock_trigger: string;            // human-readable trigger spec
  unlock_progress: number;           // 0.0-1.0 toward unlock
  unlocked_at: string | null;        // ISO 8601 when transitioned to live
  
  // Cascade tracking
  last_cascade_fired_at: string | null;  // last time ground orange cascaded up
  last_recompute_at: string;         // last composite recompute
  
  _ts: number;                       // Cosmos auto
}
```

**Indexing:** Partition key `/userId`. Indexed: `state`, `compositeName`, `beacon_band`. Composite index `[userId, state]` for fast Signal 4 queries.

**Query pattern for Signal 4:**

```sql
SELECT VALUE COUNT(1) FROM c 
WHERE c.userId = @userId 
  AND c.state = "live" 
  AND c.beacon_band >= 4 
  AND c.beacon_band <= 7
```

---

## §7. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| CCO-RR-PYRAMID-ADD-001 v1.0 PROPOSED | Parent — closes implementation gap |
| PAC-ISE-002 v2.0 Signal 4 | Consumer — receives composites_in_orange/red counts from this patch |
| PAC-ISE-005 v1.0A | Consumer — new `accruing` render token extends frontend |
| PAC-ISE-004 v1.0A | Storage — new `composite-state` container hosts pyramid mid-layer |
| Beacon Canon v1.1 §15 | Authority — 8 composite names + scoring hierarchy |
| Beacon Calibration Algorithm v1.0 §4.2 | Path B implementation reference |
| CCO-FAB-001-PIN-001 v1.0 PROPOSED (G1) | Upstream — Effort Score feeds AMP composite |
| DEV-WORK-D0LITE-001 v0.3 §2, §4 | Doctrine alignment — timespan progression + 3 Principles |
| Voice Memory Rule, March 17, 2026 | Effort Score formula authority |

---

## §8. OPEN QUESTIONS

| # | Question | Owner |
|---|---|---|
| OQ-PYR-PATCH-01 | Composite unlock celebration UX (animation, Ollie utterance, BioSnap?) | Val + Nikita |
| OQ-PYR-PATCH-02 | InBody/DEXA scheduling at BBS — Day 1 standard or scheduled later? Affects BCI unlock day | Val + Pamela |
| OQ-PYR-PATCH-03 | If a patient unlocks BCI Day 1 (lucky scheduling), should it count as a celebration moment or quiet entrance? | Val |
| OQ-PYR-PATCH-04 | Apex daily roll-up time — 03:00 local? Tied to morning wearable sync? | Val + Zakiy |
| OQ-PYR-PATCH-05 | If composite goes back below FCS statistical floor after unlock (e.g., AMP loses adherence), does it revert to `accruing` or stay `live` with low confidence? | Val (clinical) |

---

## §9. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial patch. All 8 composites declared Path B (Bounded 0–100). OQ-PYR-ADD-05 RESOLVED — cascade stops at composite layer; apex daily roll-up only. Phase 1 scope locked: 2 LIVE composites Day 1 (SRC, CRC); 6 unlock on data-readiness threshold. New `accruing` render token added to PAC-ISE-005 extension. Storage hooks (`composite-state` container) aligned to PAC-ISE-004. Doctrine alignment with DEV-WORK-D0LITE v0.3 §2 + §4 documented.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
