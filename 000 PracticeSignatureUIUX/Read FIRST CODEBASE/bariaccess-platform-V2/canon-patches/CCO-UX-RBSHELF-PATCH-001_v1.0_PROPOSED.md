# CCO-UX-RBSHELF-PATCH-001 v1.0 PROPOSED
## Routine Bookshelf — Slot State to Resolver Signal Mapping

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    CCO-UX-RBSHELF-PATCH-001
TITLE:          Routine Bookshelf — Slot State to Resolver Signal Mapping
                (Closes the RBSHELF v1.1 implementation gap)
TYPE:           Canonical Patch (companion to CCO-UX-RBSHELF-001 v1.1)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only

PURPOSE:        Close the implementation gap between CCO-UX-RBSHELF-001 v1.1
                §15.5 (Selective Cascade Per Slot Activation) and PAC-ISE-002
                v2.0 Signal 4 + Signal 5 (resolver inputs). Specifies:
                  (a) Slot state → Signal 5 (Engagement / FSI / ORI)
                  (b) Slot drift detection → Signal 4 (composites_in_orange)
                  (c) Slot-fire event schema for storage + cascade
                  (d) Selective cascade routing rules (which surfaces light up)

DEPENDS ON:     CCO-UX-RBSHELF-001 v1.1 (May 2, 2026) — parent
                CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) — Signal 4 contract
                CCO-FAB-001-PIN-001 v1.0 (G1) — FAB Bookend record schema
                CCO-FAB-001 v2.0 Pass 1 — FAB families, visibility, FCS formula
                PAC-ISE-002 v2.0 — Signal 4 + Signal 5 input contracts
                PAC-ISE-004 v1.0A — storage layer
                Beacon Canon v1.1 §10 — Pre-Signal Detection (A6 trends)

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

This patch resolves the data flow gap between the Bookshelf's slot-level state machine (RBSHELF v1.1) and the ISE Resolver's signal contracts (PAC-ISE-002 v2.0). Without this mapping:

- Slot state changes fire cascade visually but **don't update Signal 4 or 5** → Resolver can't see slot-level engagement/drift
- The `composites_in_orange` count from G2 has only one input source (composite cascades), not two (composite cascades + slot drift surface) — Signal 4 underreports
- Signal 5 (FSI / ORI) has no source declared for "slot completion as engagement signal"

**In scope:** Slot state machine → Signal 4 mapping; FAB Bookend completion → Signal 5 (FSI) mapping; ORI capture from slot interactions; selective cascade routing rules; storage hooks.

**Out of scope:** Slot color rendering rules (RBSHELF v1.1 §7 + EXPR v2.0 §4 own that). FAB-level individual scoring (CCO-FAB-001 owns).

---

## §2. SLOT STATE MACHINE — DECLARATIVE RECAP

Per RBSHELF v1.1 §15.2, every slot lives in one of three lifecycle states:

| Slot lifecycle state | Time relation | Renders | Cascade fires? |
|---|---|---|---|
| **Pre-window (dormant)** | Before slot's time-window | No color | ❌ No |
| **In-window (active)** | During slot's time-window | Renders cascade color C per FAB state + ISE permission | ✅ YES |
| **Post-window (locked)** | After window expiry | Final state: Green / Gray / Orange | ❌ No (unless reverse-fire from Logo per RBSHELF §13.4) |

Locked final states (per RBSHELF v1.1 §15.4):

| Final state | Trigger | Signal 4 contribution | Signal 5 contribution |
|---|---|---|---|
| **Green** | All FABs in slot completed Y in-window | None (positive — no orange contribution) | ✅ Counts toward FCS Completion Rate |
| **Gray** | One+ FABs in slot missed N in-window | None (negative — but doesn't fire orange surface) | ❌ Reduces FCS Completion Rate |
| **Orange** | A6/A2 detected drift during in-window OR persisted past window | ✅ **Adds to slot_drift_count** (see §3) | ❌ Reduces FCS, may indicate disengagement |

---

## §3. SLOT DRIFT → SIGNAL 4 (HEALTH STATUS) MAPPING

### 3.1 The new input field

PAC-ISE-002 v2.0 Signal 4 currently has three inputs (per G2 §3.2):
- `composites_in_orange`
- `composites_in_red`
- `any_presignal_active`

This patch **adds a fourth input** to Signal 4:

```typescript
// PAC-ISE-002 Signal 4 input contract (UPDATED by this patch)
interface HealthStatusSignalInput {
  composites_in_orange: number;       // from G2 — composite-state container
  composites_in_red: number;          // from G2
  any_presignal_active: boolean;      // from G2
  
  // NEW (this patch):
  slot_drift_count_24h: number;       // count of slots that fired Orange in last 24h
                                      // includes both in-window and post-window orange states
}
```

### 3.2 Why slot drift feeds Signal 4

RBSHELF v1.1 §15.3 ("Biological/Behavioral Decay Reveal") establishes that slot Orange surfaces drift **before patient consciously realizes it** — A6 trend slope detection, not patient-reported. This is upstream of composite cascade because:

- Slot drift fires within minutes of A6 detection (event-driven)
- Composite recompute happens on its own schedule (cascade fire when ground orange)
- The two signals can be temporally independent

**Concrete example:** Mark's hydration trend slope drifts downward over 48 hours. Slot A2 (10–11 AM) fires Orange in-window via A6 detection. The cascade fires Daily Pulse FAB tracker rim Orange. **But** the SRC composite hasn't recomputed yet (next nightly roll-up). Without `slot_drift_count_24h`, Signal 4 shows zero composites in orange — falsely benign.

This patch closes that gap.

### 3.3 Threshold semantics

Resolver consumes `slot_drift_count_24h` as a **proxy contributor** to Health Status:

| `slot_drift_count_24h` | Resolver interpretation |
|---|---|
| 0 | No slot-level drift signal |
| 1 | Single drift event — informational, doesn't drive ISE-2 alone |
| 2 | Two drift events in 24h — combined with Signal 5 or Signal 6, contributes to ISE-2 |
| 3+ | Pattern — strong contribution to ISE-2 (Protective) regardless of Signal 5/6 |

**Threshold:** `THRESHOLD_SLOT_DRIFT = 3` (default; calibrated during 90-day WoZ per Isaiah).

Drift count rolls forward 24h on a sliding window; resets when patient enters a new in-window slot with all FABs Green.

---

## §4. SLOT COMPLETION → SIGNAL 5 (ENGAGEMENT) MAPPING

### 4.1 FCS feed from slot Bookends

PAC-ISE-002 v2.0 Signal 5 reads two values:
- **FSI** (FAB Stability Index) 7-day trend → from BHR composite
- **ORI** (Ollie Response Index) 7-day rate → from V2 BehaviorEvents

This patch declares the **slot Bookend** as the canonical capture point for both:

```typescript
// FCS feed from slot completion events
interface SlotCompletionEvent {
  slotId: string;                     // e.g., "A2", "Mid1", "PM3"
  userId: string;                     // partition key
  
  // Bookend timestamps (per G1 Pin Specs §2)
  should_start_ts: string;
  actual_start_ts: string;
  actual_end_ts: string;
  duration_sec: number;
  
  // Slot final state (RBSHELF §15.4)
  final_state: "green" | "gray" | "orange";
  
  // FCS inputs (CCO-FAB-001 §11)
  completion_rate_within_slot: number;      // 0.0-1.0 — fraction of FABs in slot completed Y
  timing_accuracy: number;                  // 0.0-1.0 — 1.0 if all FABs within ±15min, scaled down
  
  // ORI source — Ollie prompts during this slot
  ollie_prompts_delivered: number;
  ollie_prompts_responded: number;
  ori_local: number;                  // = responded / delivered, 0.0-1.0
  
  _ts: number;
}
```

### 4.2 Daily FCS roll-up

```python
# Nightly FCS computation per FAB family — feeds BHR composite + AMP composite
def compute_daily_fcs(slot_completions_today: list[SlotCompletionEvent]) -> dict:
    """
    Returns FCS per FAB family, weighted per CCO-FAB-001 §11:
    FCS = (0.6 × Completion Rate) + (0.4 × Timing Accuracy)
    """
    by_family = group_by_family(slot_completions_today)
    fcs_by_family = {}
    
    for family, events in by_family.items():
        avg_completion = mean([e.completion_rate_within_slot for e in events])
        avg_timing = mean([e.timing_accuracy for e in events])
        fcs_by_family[family] = (0.6 * avg_completion) + (0.4 * avg_timing)
    
    return fcs_by_family
```

### 4.3 ORI capture rule

ORI is captured **per slot Bookend close**, not globally:

```python
# 7-day decay-weighted ORI per PAC-ISE-002 §6 Signal 5
def compute_ori_7day(slot_completions_7d: list[SlotCompletionEvent]) -> float:
    """
    Decay-weighted: 0.95^days_ago
    Returns: 0.0-1.0
    """
    today = date.today()
    weighted_responded = 0
    weighted_delivered = 0
    
    for event in slot_completions_7d:
        days_ago = (today - event.actual_end_ts.date()).days
        weight = 0.95 ** days_ago
        weighted_delivered += event.ollie_prompts_delivered * weight
        weighted_responded += event.ollie_prompts_responded * weight
    
    return weighted_responded / weighted_delivered if weighted_delivered > 0 else 0.0
```

**Why decay-weighted:** Per PAC-ISE-002 §6 Signal 5 — recent days weighted more heavily. Yesterday's responsiveness matters more than 6 days ago.

---

## §5. SELECTIVE CASCADE ROUTING — IMPLEMENTATION SPEC

RBSHELF v1.1 §15.5 establishes the principle of selective cascade. This patch makes the routing rules executable:

### 5.1 Cascade routing table (LOCKED)

When a slot fires Orange via in-window drift detection, the cascade fires selectively per the FAB family in that slot:

| FAB Family in slot | Surfaces lit on cascade |
|---|---|
| **Activity** | Bookshelf slot · Ollie Space · AI Playground · Daily Pulse FAB tracker rim · Logo (optional) |
| **Metabolic** | Bookshelf slot · Ollie Space · AI Playground · Daily Pulse FAB tracker rim · Logo (optional) · MBC composite cascade (Healthspan ground) |
| **Circadian** | Bookshelf slot · Ollie Space · AI Playground · Daily Pulse Routine tracker rim · Logo (optional) · CRC composite cascade |
| **Cognitive** | Bookshelf slot · Ollie Space · AI Playground (PROD slot DOES NOT light — locked empty per DEV-WORK-D0LITE v0.3 PE) |
| **Behavioral** | Bookshelf slot · Ollie Space · AI Playground · BHR composite cascade (after Day 30 unlock) |
| **Social** | Bookshelf slot · Ollie Space · Inner Circle vertical column (Vitamin S thread) |
| **Identity-Fusion** | Bookshelf slot · Ollie Space · Daily Pulse Routine tracker rim · all relevant composites per FAB-ROUTINE membership |

**Hard rule:** Signal Bar tile rims (R&R, Healthspan, My Blueprint, Inner Circle) do NOT light from slot-level cascade. Tile rims only update when their underlying composite or score changes — i.e., from cascade reaching the composite layer (G2), not from slot fire.

### 5.2 Cross-slot FAB rule (LOCKED — closes OQ-RBSHELF-PATCH-03)

Per RBSHELF v1.1 §14.5, FABs that span slot boundaries are anchored to the **start slot** for tracking purposes. This patch extends that rule to cascade behavior:

**Cross-slot FAB cascade fires in the START SLOT ONLY.** The end slot does not light up even if the FAB is still active when the end slot's window opens.

**Example:** A 30-minute walk from 11:50 AM–12:20 PM crosses A4 → Mid1. Cascade fires only in A4 (the start slot). Mid1 remains dormant for this FAB.

**Why:** Matches the §14.5 anchoring rule, simpler state machine, prevents double-counting in `slot_drift_count_24h`. May revisit if patients hit cross-slot scenarios frequently in WoZ Phase 1.

### 5.3 Cascade event schema

```typescript
interface SlotCascadeFireEvent {
  eventId: string;                    // GUID
  userId: string;                     // partition key
  timestamp: string;                  // ISO 8601
  
  source: {
    slotId: string;                   // e.g., "A2"
    fab_family: FABFamily;
    fab_id: string;                   // specific FAB that drifted
    drift_signal: "a6_trend" | "a2_completion" | "a8_context";
  };
  
  surfaces_lit: string[];             // ["bookshelf_slot_a2", "ollie_space", 
                                      //  "ai_playground", "daily_pulse_fab_tracker"]
  
  cascade_terminated_at: string | null;  // surface that terminated cascade if any
  
  smile_doctrine_color: string;       // unified color all lit surfaces matched
  
  contributes_to_signal_4: boolean;   // true if drift event contributes to slot_drift_count
  contributes_to_signal_5: boolean;   // false (slot drift ≠ engagement signal)
  
  _ts: number;
}
```

Stored in NEW container: `slot-cascade-events` (append-only, partition `/userId`, TTL 90 days).

---

## §6. STORAGE HOOKS (PAC-ISE-004 ALIGNMENT)

Three new containers introduced by this patch:

### 6.1 `slot-state` (current state per slot per day)

```typescript
interface SlotStateRecord {
  id: string;                         // = `${userId}_${date}_${slotId}`
  userId: string;                     // partition key
  date: string;                       // YYYY-MM-DD
  slotId: string;                     // "AM1", "A1"-"A4", "Mid1"-"Mid3", "B1"-"B4", "PM1"-"PM3"
  
  // Lifecycle
  lifecycle_state: "pre_window" | "in_window" | "post_window";
  window_start_ts: string;
  window_end_ts: string;
  
  // Final state (locked once post_window)
  final_state: "green" | "gray" | "orange" | null;
  final_state_locked_at: string | null;
  
  // Membership
  fabs_in_slot: string[];             // FAB IDs scheduled for this slot
  fab_outcomes: { [fabId: string]: "Y" | "N" | "drift" | "pending" };
  
  // Drift tracking
  drift_detected_in_window: boolean;
  drift_detection_reason: string | null;
  
  _ts: number;
}
```

### 6.2 `slot-cascade-events` (per §5.3)

Append-only log of all cascade fires.

### 6.3 `daily-engagement-rollup` (per `userId` per day)

```typescript
interface DailyEngagementRollup {
  id: string;                         // = `${userId}_${date}`
  userId: string;                     // partition key
  date: string;                       // YYYY-MM-DD
  
  // FCS per family (CCO-FAB-001 §11)
  fcs_by_family: {
    activity: number;
    metabolic: number;
    circadian: number;
    cognitive: number;
    behavioral: number;
    social: number;
    identity_fusion: number;
  };
  
  // FSI 7-day trend (Signal 5)
  fsi_7d_value: number;               // 0.0-1.0 cross-FAB stability
  fsi_7d_trend: "rising" | "stable" | "declining";
  
  // ORI 7-day decay-weighted (Signal 5)
  ori_7d: number;                     // 0.0-1.0
  
  // Signal 4 contribution
  slot_drift_count_24h: number;
  
  _ts: number;
}
```

**Indexing:**
- `slot-state` — partition `/userId`, indexed `date`, `slotId`, `lifecycle_state`, `final_state`
- `slot-cascade-events` — partition `/userId`, indexed `timestamp`, `fab_family`, TTL 90 days
- `daily-engagement-rollup` — partition `/userId`, indexed `date`

---

## §7. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| CCO-UX-RBSHELF-001 v1.1 §15.5 | Parent — closes Selective Cascade implementation gap |
| PAC-ISE-002 v2.0 Signal 4 | Consumer — adds `slot_drift_count_24h` input |
| PAC-ISE-002 v2.0 Signal 5 | Consumer — receives FSI + ORI from slot completion events |
| CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) | Companion — composite cascade is parallel input to Signal 4 |
| CCO-FAB-001-PIN-001 v1.0 (G1) | Upstream — FAB Bookend timestamps + Effort feed slot completion events |
| CCO-FAB-001 v2.0 Pass 1 §11 | FCS formula authority |
| PAC-ISE-004 v1.0A | Storage — three new containers added |
| Beacon Canon v1.1 §10 | A6 Pre-Signal Detection — drift detection authority |

---

## §8. OPEN QUESTIONS

| # | Question | Owner | Code blocker? |
|---|---|---|---|
| OQ-RBSHELF-PATCH-01 | THRESHOLD_SLOT_DRIFT default = 3 — calibrate during WoZ with Isaiah | Val + Isaiah | ⚠️ Soft — default value works for Phase 1 |
| OQ-RBSHELF-PATCH-02 | Should Logo color-coordination on slot cascade fire be opt-in or default-on? | Val + Nikita | ❌ No (UX choice) |
| **OQ-RBSHELF-PATCH-03** | **✅ CLOSED MAY 2, 2026 — Cross-slot FAB cascade fires in START SLOT ONLY (per §5.2). Matches RBSHELF v1.1 §14.5 anchoring.** | Val | ❌ Closed |

---

## §9. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial patch. Closes RBSHELF v1.1 §15.5 implementation gap. NEW Signal 4 input field `slot_drift_count_24h` added with default threshold = 3. Signal 5 FCS + ORI capture sourced from slot Bookend completion events. Selective cascade routing table locked per FAB family (7 families). Cross-slot FAB cascade rule LOCKED (start slot only — closes OQ-RBSHELF-PATCH-03). Three new Cosmos containers: slot-state, slot-cascade-events (TTL 90d), daily-engagement-rollup. Smile Doctrine color matching enforced at cascade event level. Tile rims explicitly NOT lit by slot cascade — only composite-layer cascade (G2) updates tile rims.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — CCO-UX-RBSHELF-PATCH-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
