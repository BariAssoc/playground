# BARIACCESS™ — R&R PYRAMID CANON ADDENDUM

## Pyramid + Ground Levels Architecture

**DOCUMENT ID:** CCO-RR-PYRAMID-ADD-001
**TITLE:** R&R Pyramid Canon Addendum — Pyramid + Ground Levels Architecture
**VERSION:** v1.0 PROPOSED
**STATUS:** WIP — AWAITING VAL LOCK
**AUTHOR:** Valeriu E. Andrei, MD | President
**ASSISTANT EDITOR:** Claude (Anthropic) — drafting only, not authoring
**DATE:** May 2, 2026
**PARENT CANON:** R&R Pyramid Canon (1+8+24 structure) — NOT modified, only supplemented
**COMPANION:** Card Canon §4.7 (existing card formats per tile)
**RELATED:** DEV-WORK-D0LITE-001 v0.3 §16 (Practice Edition reference)

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.

---

## §1. PURPOSE

This addendum captures architectural clarifications locked May 2, 2026 about the relationship between the R&R Pyramid (1+8+24 + 80 components) and the Ground Levels (V1-V4 raw streams) across the Constellation Crown's four tiles.

**Scope:**
- Does NOT modify the locked R&R Pyramid structure (1+8+24 stays)
- Does NOT modify Healthspan / My Blueprint / Inner Circle canons
- Does supplement them with newly explicit rules locked May 2, 2026

**Source dictation:**
- Val, May 2, 2026: *"The 1/8/24 composite scores derive from V1 V2 V3 V4. These values are feeding the pyramid. Pyramid stays on ground."*
- Val, May 2, 2026: *"R&R, Healthspan, My Blueprint are intimately connected because of signals — Biometrics, Labs, etc — all 4 V values."*
- Val, May 2, 2026: *"Tile 4 is connected too — through tier progressions and credits, which are triggered by changes in signals that cause programs, ITBs, credits, and progression in tier and in biohacker profile."*

---

## §2. THE PYRAMID-ON-GROUND METAPHOR (NEW — LOCKED)

### §2.1 The Architecture

The pyramid is the AGGREGATED layer (composites + sub-scores). The ground is the RAW V1-V4 substrate feeding upward. They are not separate architectural layers — they are connected. The pyramid rests on the ground.

```
        ┌───┐
        │ 1 │              ← R&R apex (LAYER 0)
        └─┬─┘
       ┌──┴──┐
      ┌┴┐ ┌─┴┐             ← 8 composites (LAYER 1)
     ┌──┴──┴──┴──┐
    ┌┴┐┌┴┐┌┴┐┌┴┐┌┴┐         ← 24 sub-scores (LAYER 2)
   ──────────────────────  ← PYRAMID BASE
   ─────────────────────── ← GROUND LEVEL — V1+V2+V3+V4 raw substrate
   ─────────────────────── ← deeper ground (labs, biometrics, behaviors)
   ─────────────────────── ← deepest (continuous to Healthspan / My Blueprint)
```

### §2.2 Data Flow Direction

**UPWARD only at the scoring layer:**
- V1+V2+V3+V4 raw → 80 components → 24 sub-scores → 8 composites → 1 R&R apex

**No score at any pyramid layer references its own layer or above.** Data flows upward; governance flows downward. (Per existing R&R Pyramid Canon.)

### §2.3 Ground Is Not Empty

Ground levels are not blank space below the pyramid. They contain:

- **Raw V1 data** (HRV, sleep stages, RHR, body composition, FibroScan, all blood labs)
- **Raw V2 data** (FAB completion events, Ollie Yes/No responses, behavioral logs)
- **Raw V3 data** (Bookend timestamps, chronotype, social jet lag, environmental context)
- **Raw V4 data** (medication doses, ITB completions, provider interventions)
- **Components** (the 80+ individual measurements, normalized to Beacon scale)

The pyramid's 24 sub-scores aggregate FROM these ground-level components.

---

## §3. ORANGE DOT RULE PER TILE (NEW — LOCKED)

### §3.1 The Locked Rule

This rule was previously implicit. As of May 2, 2026, it is explicit and locked:

| Tile | Where orange dots fire |
|---|---|
| **R&R (Tile 1)** | PYRAMID 3 LAYERS ONLY (1 apex / 8 composites / 24 sub-scores) |
| **Healthspan (Tile 2)** | GROUND LEVELS (visible surface) |
| **My Blueprint (Tile 3)** | GROUND LEVELS (visible surface) |
| **Inner Circle (Tile 4)** | Vertical Columns (separate canon — downstream consequence chain) |

### §3.2 Cascade Rule (LOCKED MAY 2, 2026)

When raw V1-V4 data triggers orange in Healthspan or My Blueprint ground levels, the orange **CASCADES UPWARD** into the R&R pyramid composite that aggregates that data.

**Example A — FibroScan elevated:**
- V1 raw signal: FibroScan reading elevated
- Healthspan ground level: orange dot fires (visible to patient in Healthspan)
- Cascade: BCI composite (Body Composition Index) in R&R pyramid mid-layer ALSO turns orange (because BCI aggregates FibroScan)
- R&R apex score reflects the change

**Example B — Chronotype shift detected:**
- V3 raw signal: chronotype drift detected via 28-day rolling pattern
- My Blueprint ground level: mesh thread orange (visible to patient in My Blueprint)
- Cascade: CRC composite (Circadian & Rhythm Coherence) in R&R pyramid mid-layer ALSO turns orange (because CRC aggregates chronotype)
- R&R apex score reflects the change

### §3.3 Why Orange Stays In Pyramid for R&R

The R&R card has ground BELOW the pyramid base architecturally (per March 31, 2026 hand drawings — chat bd263e41), but the **R&R card surfaces only the aggregated/composite alerts**. R&R is the daily readiness lens — patient sees the apex + composites + sub-scores that integrate all signals.

Healthspan and My Blueprint surface the raw biometric/identity alerts because they are the structural and identity lenses where individual labs and threads matter.

---

## §4. GROUND LEVELS — FLEXIBLE STRUCTURE (LOCKED)

### §4.1 The Lock

Ground Levels are NOT fixed in count. They can be:

- **ONE large deep layer** (Phase 1 simplification — Practice Edition launch)
- **MULTIPLE numbered layers** (future expansion as needs emerge)
- **NAMED layers** (e.g., "Surface," "Deeper," "Mesh")

The choice between these is **operational, not architectural.** The architecture supports any count.

### §4.2 Phase 1 Default

For Practice Edition Phase 1 launch (June 2026 — Biohackers World NYC):
- **ONE deep ground level per tile** holding all relevant V1 data
- All Healthspan labs (FibroScan, body comp, cardiorisk, blood panels) live in this ONE ground level as horizontal swipeable cards
- All My Blueprint mesh thread populations live in this ONE ground level (Phase 1 stub; full expansion Phase 2)

### §4.3 Future Expansion Path

Post-Phase 1, ground levels may expand to:
- Numbered levels (Level 1 surface → Level N deepest)
- Named levels (Surface, Deeper, Mesh, etc.)
- Different counts per tile (Healthspan may have 3, My Blueprint may have 5, etc.)

These decisions deferred to OQ-PYR-ADD-04.

---

## §5. R&R PYRAMID DOES HAVE GROUND ARCHITECTURALLY

### §5.1 Confirmed by March 31 Drawings

Per chat bd263e41 (March 31, 2026), the R&R card structure scrolls down past the pyramid into:
- **Ground 1** = ITB introduction layer (where therapeutic blocks like GLP-1 Therapeutic Block are introduced)
- **Ground 2** = empty, more to come (program territory)
- Deeper grounds = labs, raw biometrics (continuous with Healthspan ground levels per §6)

### §5.2 But Orange Dots Stay in Pyramid for R&R

These ground levels exist architecturally but are **NOT the orange-dot surface for R&R.** They are scroll-down content within the R&R card. Orange dots in R&R remain pyramid-only (per §3).

### §5.3 R&R Card Structure (Full Visual)

```
┌─────────────────────────────────────────┐
│   R&R ROLLING GESTURE CARD              │
│                                         │
│       ┌───┐                             │
│       │ 1 │            ← R&R apex        │
│       └─┬─┘                             │
│      ┌──┴──┐                            │
│     8 composites      ← compass scores  │
│   ┌────┴────┐                           │
│  24 sub-scores       ← biometric dots   │
└─────────────────────────────────────────┘
═══════════════════════════════════════════ ← pyramid base
─────────────────────────────────────────── ← Ground 1 (ITB)
─────────────────────────────────────────── ← Ground 2 (empty/more)
─────────────────────────────────────────── ← Ground deeper
                                              continues into 
                                              Healthspan + Blueprint
```

---

## §6. THE 4-TILE CONNECTED ARCHITECTURE (LOCKED MAY 2, 2026)

### §6.1 The Lock

ALL 4 tiles are connected — through different mechanisms:

**TILES 1-2-3: DIRECT V1-V4 SUBSTRATE SHARING**

Same biometric/behavioral/contextual/interventional signals feed all three tiles simultaneously. They are three lenses on ONE continuous data landscape:

| Tile | Lens |
|---|---|
| R&R (Tile 1) | Aggregated lens — pyramid (1+8+24 daily readiness) |
| Healthspan (Tile 2) | Longitudinal/structural lens — labs, body comp, Bio Age |
| My Blueprint (Tile 3) | Identity lens — mesh threads, chronotype, behavioral identity |

Ground levels flow continuously across Tiles 1-2-3.

**TILE 4 (Inner Circle): DOWNSTREAM CONSEQUENCE CHAIN**

Connected indirectly — reflects the engagement consequences that flow from V1-V4 signal changes:

```
V1-V4 signal change
    ↓
Tile 1/2/3 alert (orange dot fires)
    ↓
Program / ITB triggers
    ↓
Patient engages → Credits accrue (CPIE/CCIE)
    ↓
Tier progression updates
    ↓
Biohacker profile progresses
    ↓
INNER CIRCLE (Tile 4) reflects in vertical columns
```

### §6.2 Why This Matters

No tile is an island. The 4-tile Constellation Crown is ONE connected architecture:

- Tiles 1-2-3 share substrate (raw V1-V4)
- Tile 4 is fed by engagement consequences (programs, credits, tier, biohacker progression)

The patient experiences this as a unified longitudinal platform where signal → response → growth is visible across all 4 tiles in different forms.

### §6.3 Separate Governance Preserved

Per memory rule #4: **Inner Circle S = independent governance metric** with its own V1-V4 pipeline for governance purposes. This separation is preserved at the GOVERNANCE level.

The CONNECTION described in §6.1 is at the **architectural / user-experience level** — the 4 tiles together tell one story, even though Inner Circle's S metric runs on its own pipeline.

This dual structure (connected experience + separate governance) is intentional — it's why Inner Circle can be governance-clean (S=30 fallback rules, eligibility_locked, Never Blank) while still being narratively connected to the rest of the platform.

### §6.4 Implication for Cascade Rule

The cascade rule (§3.2) operates within the **Tiles 1-2-3 substrate** (direct V1-V4 sharing). It does NOT cascade into Tile 4 directly. Tile 4 receives signal changes via the consequence chain (§6.1) — programs trigger, credits accrue, tier progresses.

---

## §7. WHAT THIS ADDENDUM DOES NOT CHANGE

| Element | Status |
|---|---|
| R&R Pyramid Canon (1+8+24 structure) | ✅ UNCHANGED |
| 8 composite names (SRC, SBL, MBC, MEI, AMP, BCI, CRC, BHR) | ✅ UNCHANGED |
| Card Canon §4.7 (Tile card formats) | ✅ UNCHANGED |
| Healthspan Tile content (Bio Age, ChronoMuscle, etc.) | ✅ UNCHANGED |
| My Blueprint Mesh threads | ✅ UNCHANGED |
| Inner Circle vertical columns | ✅ UNCHANGED |
| Inner Circle S governance metric (independent V1-V4 pipeline) | ✅ UNCHANGED |
| FCS formula | ✅ UNCHANGED |
| Beacon 7-band system | ✅ UNCHANGED |
| ISE Canon weighting upstream of pyramid composites | ✅ UNCHANGED |

---

## §8. OPEN QUESTIONS

| # | Question | Owner |
|---|---|---|
| OQ-PYR-ADD-01 | ✅ **CLOSED MAY 2, 2026** — Continuous Ground Landscape across Tiles 1-2-3 LOCKED | Val |
| OQ-PYR-ADD-02 | Pyramid-to-ground gesture in R&R card — scroll, swipe, hidden by default? | Val + Nikita |
| OQ-PYR-ADD-03 | ✅ **CLOSED MAY 2, 2026** — Cascade rule LOCKED (orange in ground → orange in R&R pyramid composite) | Val |
| OQ-PYR-ADD-04 | Ground Level numbering and naming (Phase 1 simplification → future expansion) | Val + Nikita |
| OQ-PYR-ADD-05 | When cascade fires from raw V1 → R&R composite, does it ALSO turn the R&R apex orange? Or only the composite? | Val + Zakiy |
| OQ-PYR-ADD-06 | Tile 4 downstream consequence chain — what is the latency from signal change → Inner Circle column update? | Val + Zakiy |
| OQ-PYR-ADD-07 | If Mark engages with multiple ITBs in one session, do credits batch into one tier update or fire individually? | Val + Zakiy |

---

## §9. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| **R&R Pyramid Canon** (1+8+24 structure — parent) | Parent — NOT modified, only supplemented |
| **Card Canon §4.7** (tile card formats) | Companion — coordinates with this addendum |
| **CCO-FAB-001 v2.0 Pass 1** | FAB Canon — feeds V2 substrate into ground levels |
| **CCO-JOUR-DEF-001 v1.0** | Journal Canon — Layer 1 collects all ground-level data |
| **CCO-V1V4-001** | ⚠️ NOT YET BUILT — V1-V4 stream definitions |
| **PAC-DP-001** | Dynamic Profile / My Blueprint Mesh — connects to ground levels |
| **PCN-RR-INV-001** | R&R Pyramid Inventory — composites detail |
| **CCO-IC-SC-001** | Stability Coefficient — Inner Circle governance |
| **DEV-WORK-D0LITE-001 v0.3 §16** | Practice Edition reference (Phase 1 build) |
| Memory Rule #4 | Inner Circle S independent governance pipeline |

---

## §10. PROVENANCE

| # | Source | Date | Contribution |
|---|---|---|---|
| 1 | Chat 33360 (3cd9b824) | April 8-9, 2026 | Card Canon §4.7 — tile card formats per tile |
| 2 | Chat bd263e41 | March 31, 2026 | Hand drawings showing R&R pyramid → Ground 1 (ITB) → Ground 2 below |
| 3 | Chat a61da8bb | February 24, 2026 | Healthspan tile content + Chrono Suite |
| 4 | Chat 86bacc02 + 37f0fd43 | February 24-26, 2026 | R&R Pyramid Canon (1+8+24 + 80 components) |
| 5 | Chat 115bf5af | February 20, 2026 | 6P × 6B Interlocking Scaffold; FAB-to-composite mapping |
| 6 | This conversation | May 2, 2026 | Pyramid-on-ground metaphor LOCKED; orange dot rule per tile LOCKED; cascade rule LOCKED; continuous ground landscape LOCKED; 4-tile connected architecture LOCKED |

---

## §11. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial addendum. Pyramid-on-ground metaphor locked. Orange dot rule per tile locked. Cascade rule locked (ground orange → R&R composite orange). Ground level flexibility locked (single deep or multiple). Continuous ground landscape across Tiles 1-2-3 locked. 4-tile connected architecture locked (Tiles 1-2-3 share V1-V4 substrate; Tile 4 connected via downstream consequence chain). Separate governance preserved for Inner Circle S metric.** |

---

*END — CCO-RR-PYRAMID-ADD-001 v1.0 PROPOSED / WIP*

*Status: Awaiting Val lock. Practice Edition reference: DEV-WORK-D0LITE-001 v0.3 §16.*

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
