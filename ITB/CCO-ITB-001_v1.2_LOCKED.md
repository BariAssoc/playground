# BARIACCESS™ CANONICAL SPECIFICATION DOCUMENT

# ITB CANON — MASTER

```
═══════════════════════════════════════════════════════════════
DOCUMENT ID:     CCO-ITB-001
TITLE:           Interventional Therapeutic Block (ITB) Canon
VERSION:         v1.2
STATUS:          ✅ LOCKED — EDITABLE
LOCK DATE:       April 20, 2026
SUPERSEDES:      CCO-ITB-001 v1.0 (March 13, 2026, 964 lines)
                 CCO-ITB-001 v1.1 Amendment (April 20, 2026)
AUTHOR:          Dr. Valeriu E. Andrei, MD, FACS, FASMBS
                 President, BariAccess LLC
ASSISTANT EDITOR: Claude (Anthropic) — AI assist, not creator
CLINICAL TAG:    HYBRID — CPIE (HIPAA) / CCIE (wellness)
LAYER:           Layer 4 — Developer/MASTER
                 (Layers 1–3 to be extracted in subsequent session)
NO HALLUCINATION: ✅ All content traced to confirmed account
                 conversations and uploaded canonical documents
═══════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved.

---

## CROSS-REFERENCES (Canonical Sources)

| Canon | Version | Alignment |
|---|---|---|
| Beacon Canon | v1.1 | ✅ Row 5 order, pre-signal, band/ITB response |
| ISE Canon | v3.0 | ✅ Two-lane authority, CPIE/CCIE definitions (§17), delivery matrix |
| SC Canon | CCO-IC-SC-001 v1.0 | ✅ V4 = ITBs in Cosmos DB; SC formula V4 weight 0.20 |
| FAB Canon | v1.2 | ✅ Level 3 Program FABs attached to ITBs; Guardian FAB watches ITB adherence |
| Program Canon | v2.1 | ✅ ITB lives inside Program Intervene step; Branch Point Rule; Complete Lite |
| Parking Lot Canon | v1.0 | ✅ Slot 5 = Merchant Related ITB; Slot 6 = Vetted Non-Wellness (CPIE hard-stop) |
| PAC-DP-001 | v1.0A | ✅ V4 = ITB status/adherence; ITB REJECTED as Mesh thread |
| PAC-ISE-002 | v2.0 | ✅ Signal 4 = Health Status from Beacon composites; ORI drops 3–7 days before FSI |
| PAC-ISE-006 | v1.0A | ✅ MEDICATION_CHANGE hidden from CCIE; ISE-5 full payload to CPIE |
| PAC-ISE-007 | v1.0B | ✅ AI prohibited from referencing ITB raw data; ISE-5 escalation |
| Routine Canon | v1.0 | ✅ Routine → Segment → FAB hierarchy; FAB Level 3 connects to ITBs |
| CCO-WELL-001 | v1.0 | ✅ CAT-G vetting workflow, state overlay, S15 enforcement |
| CCO-PKG-001 | v1.0 | ✅ Package × ITB Category × B² Type master matrix |
| CCO-DR-REGISTER-001 | v1.0 | ✅ All asterisked items logged as D&R entries |
| Source_of_Truth Canon | v1.1 | ✅ §8.3, §8.7, §8.10, §9.4, §11 (Q1 conflict resolved — see §23) |

---

## TABLE OF CONTENTS

1. [Canonical Definition](#1-canonical-definition)
2. [The Playbook Principle](#2-the-playbook-principle)
3. [Data Stream — V4](#3-data-stream--v4)
4. [ITB Inventory — 19 Named Blocks](#4-itb-inventory--19-named-blocks)
5. [Mandatory Day 0 ITBs](#5-mandatory-day-0-itbs)
6. [Credit Label Governance](#6-credit-label-governance)
7. [Light vs Full Architecture](#7-light-vs-full-architecture)
7.5. [ITB Category Classification — CAT-W / CAT-G / CAT-M](#75-itb-category-classification)
8. [Required Block Fields at Birth](#8-required-block-fields-at-birth)
9. [Detection and Activation Flow](#9-detection-and-activation-flow)
10. [ITB Program Lifecycle](#10-itb-program-lifecycle)
11. [Program Entry Points](#11-program-entry-points)
12. [Box System Wiring](#12-box-system-wiring)
13. [Escalation Chains](#13-escalation-chains)
14. [Row 5 ITB Tracker](#14-row-5-itb-tracker)
15. [Parking Lot Integration](#15-parking-lot-integration)
16. [ISE Integration](#16-ise-integration)
17. [SC and DriftLevel Connection](#17-sc-and-driftlevel-connection)
18. [Dynamic Profile Integration](#18-dynamic-profile-integration)
19. [FAB-ITB Integration](#19-fab-itb-integration)
20. [B² Access and Custom ITBs](#20-b-access-and-custom-itbs)
21. [Phase 1 Build Priority](#21-phase-1-build-priority)
22. [Canonical Case Example — ITB-CASE-001](#22-canonical-case-example--itb-case-001)
23. [Conflict Log](#23-conflict-log)
24. [D&R Register — Asterisked Items](#24-dr-register--asterisked-items)
25. [Source Conversation Index](#25-source-conversation-index)
26. [Change Log](#26-change-log)
27. [Document Status](#27-document-status)

---

## 1. CANONICAL DEFINITION

| Attribute | Value |
|---|---|
| **Full Name** | Interventional Therapeutic Block |
| **Abbreviation** | ITB |
| **Trademark** | ITB™ (each named block carries ™ suffix) |
| **Type** | Structured clinical and educational container |
| **Purpose** | Supports treatments, therapies, products, and wellness protocols with dual-sided governance |
| **Credit Labels** | CAT-W = CCIE only · CAT-G = CCIE (CPIE if prescriber) · CAT-M = BOTH CCIE + CPIE mandatory |
| **Category Tag** | CAT-W / CAT-G / CAT-M — assigned at birth, parallel to credit label |
| **Data Stream** | V4 (Interventional) |
| **A-Box Primary** | A5 — ITB State (Pre / Mid / Post, Adherence) |
| **Cosmos DB containers** | OnboardingStates / ITBs (per SC Canon CCO-IC-SC-001) |
| **Row 5 Position** | Position 2, Icon 💊, ALWAYS VISIBLE |
| **Display Rule** | ITB is ALWAYS in education mode. Never blank. Never hidden. |

### 1.1 Two-Sided Architecture

Every ITB has exactly two sides operating in parallel:

| Side | Audience | Function |
|---|---|---|
| **Provider Side** | Prescribing clinician, Barista | Dashboards, clinical monitoring, dosage tracking, adherence alerts, intervention decisions |
| **Patient/Customer Side** | End user | Education, consent, adherence tracking, 24/7 Ollie feedback loop |

### 1.2 Canonical Tooltip

> *"Structured support for treatments (GLP-1, circadian, wellness). Tracks progress and gives feedback 24/7. The conversation never ends — Ollie guides you, and Barista support is always available."*

### 1.3 Three Parallel Classification Axes

Every ITB carries three tags assigned at birth — all three operate simultaneously:

| Axis | Options | Governs |
|---|---|---|
| **Category Tag** | CAT-W / CAT-G / CAT-M | Regulatory classification; who can deploy |
| **Credit Label** | CCIE / CPIE / Both | Behavioral/clinical governance; escalation chain |
| **Package Eligibility** | Core / Professional / Flagship | Commercial access tier |

### 1.4 What an ITB IS

- A structured container holding educational content, program adherence protocols, escalation rules, FABs, and compliance tracking
- The root of the clinical journey — present from Day 0 as a dormant protocol
- The V4 data container — ITB status and adherence feed directly into SC formula, Beacon, ISE Resolver
- ALWAYS in Light mode (education layer) regardless of Full deployment status
- Tagged at birth with Category + Credit Label — both govern the entire downstream chain

### 1.5 What an ITB IS NOT

- ❌ A medication itself (GLP-1 is the treatment; ITB-GLP1™ is the container governing it)
- ❌ A FAB (FABs are behavioral biomarkers living inside/around ITBs; they are distinct)
- ❌ A Program (Programs are generated FROM ITBs; ITB is the parent container — per CCO-PROG-001 v2.1)
- ❌ A Mesh thread (formally rejected in PAC-DP-001 v1.0A — ITB is data [V4], not context)
- ❌ A Biohacker progression system (Biohackers ACCESS ITBs at higher tiers; they are not ITBs)
- ❌ Something that can be blank or hidden (ALWAYS visible in Row 5)

### 1.6 FDA Consultant Principle (locked April 20, 2026)

> *"If FDA governs it, we support it. If FDA doesn't govern it, we own it."*

| Governing Body | BariAccess Role | ITB Full Contains |
|---|---|---|
| **FDA-governed** (CAT-M — GLP-1, hormones, Rx medications) | Consultant / support layer. Defers entirely to prescribing provider and FDA. | Adherence tracking, education, and engagement support around what provider prescribed. No BariAccess prescription language. |
| **Not FDA-governed** (CAT-W, CAT-G behavioral/wellness) | Content owner. BariAccess defines and manages. | Full program content, protocol, engagement structure. |

---

## 2. THE PLAYBOOK PRINCIPLE

> *"The playbook already exists before the play is called."*

ITBs are **dormant protocols present from Day 0**. When pre-signals emerge, the system does not create a response — it activates one that was already designed.

| Principle | Meaning |
|---|---|
| **Always Present** | Every ITB exists in the system as a dormant Light protocol from Day 0 |
| **Pre-Built** | Clinical content, escalation rules, FABs, compliance language — all pre-loaded |
| **Signal-Activated** | Pre-signal → Light nudge. Signal confirmed → Full deployment |
| **The Root** | ITBs are the root of the clinical journey. Every treatment pathway traces back to an ITB |
| **No Emergency Construction** | The system never builds a response in a crisis. It executes a pre-designed protocol |

---

## 3. DATA STREAM — V4

ITBs are the canonical container for the V4 data domain across all BariAccess systems.

| System | V4 Representation | ITB Role |
|---|---|---|
| **SC Formula** | V4 weight = 0.20 — "Response to interventions indicates system trust" | ITB adherence = direct input to governance metric |
| **ISE Resolver** | Signal 4 (Health Status) reads Beacon composites; ITB compliance feeds V4 → Beacon | ITB non-compliance can contribute to orange/red composites |
| **Dynamic Profile** | V4 = "GLP-1 dosage, supplements, therapy blocks, ITB status, adherence" | ITB is the V4 raw data; NOT a Mesh thread |
| **Cosmos DB** | Container: `OnboardingStates / ITBs` | Partition key: psid |
| **A5** | Primary A-Box for ITB State | Tracks Pre/Mid/Post + Adherence per user |

### 3.1 V4 Data Schema (Draft — needs dev spec)

```
ITB State fields (A5 input):
  - itb_id: string
  - itb_name: string
  - category_tag: "CAT-W" | "CAT-G" | "CAT-M"
  - credit_label: "CCIE" | "CPIE" | "BOTH"
  - lifecycle_state: "Pre" | "Mid" | "Post" | "Drift" | "Parked"
  - adherence_rate: 0.0–1.0
  - last_interaction: datetime
  - program_phase: "Assessment" | "Intervention" | "Monitoring" | "Completion"
  - light_active: boolean (always true)
  - full_active: boolean
  - scheduling_required: boolean (triggers Calendar widget in ITB Full)
```

---

## 4. ITB INVENTORY — 19 NAMED BLOCKS

**As of April 20, 2026. Editable — inventory will grow.**

> *"The ITB inventory is a living list. 19 named blocks as of April 20, 2026. New blocks added via amendment as platform grows. Each new block requires Category Tag (CAT-W/G/M), Credit Label, and Phase assignment before deployment."*

### 4A. CLINICAL ITBs — CAT-M / CPIE + CCIE

| ITB | Full Name | Category | Credit Labels | Phase | Notes |
|---|---|---|---|---|---|
| **ITB-GLP1™** | GLP-1 Receptor Agonist Management Block | CAT-M | CPIE + CCIE | 1 | FDA-governed; BariAccess = consultant layer |
| **ITB-VACCINE™** | Vaccination Preparation & Response Block | CAT-M | CPIE + CCIE | 1 | Immune response monitoring |
| **ITB-CRISIS™** | Crisis Intervention Therapeutic Block | CAT-M | CPIE + CCIE | 1 | ISE-5 trigger; full chain simultaneous |
| **ITB-SOCIAL-RECOVERY™** | Social Isolation Recovery Intervention Block | CAT-G* | CPIE/CCIE mixed | 2 | *Formal vetting pass pending — DR-ITB-SOCREC-001 |
| **ITB-MITOCHONDRIAL-IV™** | Mitochondrial IV Protocol Block | CAT-M* | CPIE + CCIE | 2+ | *CAT-M provisional — DR-ITB-MITO-001 |

### 4B. WELLNESS ITBs — CAT-W / CCIE

**Exercise:**

| ITB | Full Name | Category | Credit Label | Phase |
|---|---|---|---|---|
| **ITB-STRENGTH™** | Strength Training Protocol Block | CAT-W | CCIE | 1 |
| **ITB-AEROBIC™** | Aerobic Training Protocol Block | CAT-W | CCIE | 1 |
| **ITB-DECAT™** | Deconditioning Recovery Block | CAT-W | CCIE | 2 |
| **ITB-RECOVERY-EXERCISE™** | Exercise Recovery Protocol Block | CAT-W | CCIE | 2 |
| **ITB-CHRONO-TRAINING™** | Chronotype-Aligned Training Block | CAT-W | CCIE | 2 |

**Wellness:**

| ITB | Full Name | Category | Credit Label | Phase | Notes |
|---|---|---|---|---|---|
| **ITB-NUTRITION™** | Nutrition Protocol Block | CAT-W | CCIE | 1 | |
| **ITB-HYDRATION™** | Hydration Protocol Block | CAT-W | CCIE | 1 | Oral only — IV hydration = CAT-M |
| **ITB-MENOPAUSE™** | Menopause Management Block | CAT-M | CPIE + CCIE | 2 | Single block dual-track; CCIE=education/lifestyle; CPIE=HRT prescriber-governed |
| **ITB-JETLAG™** | Circadian Disruption Recovery Block | CAT-W* | CCIE | 2 | *If melatonin Rx added → CAT-M companion — DR-ITB-JETLAG-001 |

**Social:**

| ITB | Full Name | Category | Credit Label | Phase |
|---|---|---|---|---|
| **ITB-SOCIAL-COHORT™** | Social Cohort Engagement Block | CAT-W | CCIE | 1 |
| **ITB-SOCIAL-ACTIVITY™** | Social Activity Protocol Block | CAT-W | CCIE | 1 |
| **ITB-SOCIAL-PEER™** | Peer Support & Connection Block | CAT-W | CCIE | 2 |

### 4C. LONGEVITY ITBs — NAMED, NOT YET BUILT

| ITB | Full Name | Category | Status |
|---|---|---|---|
| **ITB-HEALTHSPAN™** | Healthspan Optimization Block | TBD* | Named only — *DR-ITB-HSPAN-001 |
| **ITB-LIFESPAN™** | Longevity & Anti-Aging Protocol Block | TBD* | Named only — *DR-ITB-LSPAN-001 |

### 4D. INVENTORY COUNTS

| Category | Count |
|---|---|
| Clinical (CAT-M) | 5 |
| Wellness (CAT-W) | 12 |
| Longevity (named, TBD) | 2 |
| **Total Named** | **19** |

---

## 5. MANDATORY DAY 0 ITBs

Every user receives exactly these ITBs at Day 0, before any clinical assignment:

| ITB | Type | Cost | Assignment | Duration |
|---|---|---|---|---|
| **Introduction ITB** | Educational | Free | System-assigned | Always active |
| **Interest ITB** | From Barista conversation | Free | System-assigned | 90-day trial |
| Optional 3rd+ ITB | Any (e.g., GLP-1) | Paid | Purchased by user or provider | Per program |

### 5.1 Day 0 Complete Flow

```
Day 0:
  Barista conversation
      → 2 mandatory ITBs assigned (Introduction + Interest)
      → Demo Mode activated
      → Program entry via Row 1 Signal Dial or Q
      → Credits earned
      → Voucher generated

After 7–10 days:
  Real V1 + V2 + V3 + V4 data begins populating
  Dynamic Profile: Unofficial → building
```

---

## 6. CREDIT LABEL GOVERNANCE

### 6.1 The Governing Principle

> **Every ITB block carries credit labels at birth. The category tag determines which labels apply. Both labels are mandatory for CAT-M.**

| Category | Credit Labels | Rule |
|---|---|---|
| **CAT-W** | CCIE only | No exceptions |
| **CAT-G** | CCIE by default; CPIE if prescriber involved | Medical B² can elevate specific CAT-G to CPIE when prescriber signs off |
| **CAT-M** | BOTH CCIE + CPIE mandatory | Every CAT-M ITB must have both. No exceptions. CAT-M cannot be CCIE-only. |

**Canonical source:** ISE Canon v3.0 §17 — locked February 17, 2026.

### 6.2 CPIE vs CCIE Governance Comparison

| Dimension | CPIE | CCIE |
|---|---|---|
| **Credit Value** | Higher | Standard |
| **Escalation Chain** | ISE-gated (see §13) — Barista always before Provider | Ollie → AskABA/Max → Barista (if needed) |
| **Non-Compliance Severity** | DANGEROUS. Hard break. Provider notified. | Behavioral erosion. Nudge → park → re-suggest. |
| **Non-Compliance System Response** | Red trajectory in Beacon; ISE-5 risk | ISE-2 (Protective); orange/drift |
| **Full → Light Downgrade Authority** | Clinical decision — full provider chain required | System or Barista level |
| **Parking Eligibility** | ❌ CANNOT be parked | ✅ CAN be parked |
| **Provider notification** | Mandatory at non-compliance | Not mandatory unless ISE-5 triggered |
| **HIPAA** | ✅ Full HIPAA governance | Standard wellness disclaimers |
| **ISE-5 trigger risk** | High — crisis → ISE-5 directly | Low — requires sustained severe drift |

### 6.3 Single Block Dual-Track (CAT-M)

One CAT-M block carries both tracks internally:

| Layer | Credit Label | Function |
|---|---|---|
| ITB Light | CCIE | Education — always on, parking-immune |
| ITB Full — CCIE track | CCIE | Wellness engagement, behavioral adherence |
| ITB Full — CPIE track | CPIE | Clinical oversight, provider-governed, ISE-gated escalation |

**One block. Two tracks running in parallel inside it.**

**ITB-MENOPAUSE™ example:**
- One block, CAT-M
- CCIE track = education, lifestyle, circadian
- CPIE track = HRT, prescriber-governed
- No companion-block split needed

### 6.4 Companion Block Rule (when applicable)

Two separate blocks are used when two architecturally distinct ITBs exist (e.g., a CAT-W education block paired with a separate CAT-M clinical block for a different protocol). The companion-block rule is NOT required for CAT-M ITBs — those carry dual-track internally.

### 6.5 B1 Routing

B1 uses the credit label as its **primary routing criterion** for all ITB-related C-Box outputs.

---

## 7. LIGHT VS FULL ARCHITECTURE

### 7.1 Two Layers Per Block

| Layer | Description | Cost | Clinical Action | Activation |
|---|---|---|---|---|
| **Light** | Educational, always-on safe zone. Never removed. Parking-immune. | Free / low | ❌ None | Day 0 — always |
| **Full** | Deployed, active, adherence-tracked. Determined by Program. | Paid | ✅ Yes | CPIE = provider auth; CCIE = Barista/Max level |

### 7.2 Parking-Immune — Canonical Definition

> **The Light layer of every ITB — across all categories (CAT-W, CAT-G, CAT-M) — is parking-immune. It cannot be moved to the Parking Lot, suppressed, or removed by any system rule, ISE state, PLI threshold, B² decision, or user action.**

**The two-layer rule under ISE-3:**

| Layer | ISE-3 Effect |
|---|---|
| **Row 5 Tracker (💊 Position 2)** | ✅ Always visible — ISE-3 cannot remove it |
| **Ollie content delivery about Light layer** | ⚠️ Compressed — ISE-3 may silence or reduce Ollie's ITB nudges |

**The distinction:** The tracker is presence. Ollie is delivery. ISE-3 governs delivery, not presence.

### 7.3 Light Layer Always On

> *"ITB is ALWAYS in education mode."*

- Ollie pushes Light ITB content constantly (except ISE-3 compression)
- Light layer survives CPIE hard-stop, Full downgrade, or Parking
- ITB tracker always visible in Row 5 regardless of Full status
- Light is the browsing layer — user can learn without clinical action

### 7.4 ITBs Determined by the Program

> **"ITBs are determined by the Program."** — CCO-PROG-001 v2.1 §7.2.2 Governing Principle

The Program selects the ITB tier at deployment. Signal + FAB + Flag drives Program creation. The Program then offers Learn (Light path) and Intervene (Full path) as branches.

**Upgrade (Light → Full):**
- Gates: ISE ≥ 2 · Barista/Provider green-light · Prerequisite Light ITBs complete · CLI ≥ 0.60

**Downgrade (Full → Light) — Safety Protective:**
- ISE drops to 0 or 1
- Patient misses 3+ consecutive CPIE checkpoints
- CLI drops below 0.40
- Hard-stop events
- Patient requests pause (CCIE only)

**Principle:** Full → Light is protective, not punitive.

### 7.5 CPIE Hard-Stop Flow

When CPIE Full non-compliance confirmed (Slot 6 — Vetted Non-Wellness):

```
CPIE Full Active
    │
    ▼
Non-compliance detected
    │
    ▼
3 days no response → RED ALERT
    │
    ▼
AskABA/Max → Provider (required)
    │
    ▼
Provider decides: Intervene OR Barista Appointment
    │
    ▼
Barista has 72 hours
    │
    ├── Resolved → Normal Full flow resumes
    │
    └── Not Resolved → DOWNGRADE TO LIGHT ITB
                        + Legal form
                        + Defer to prescriber
                        + Notify client
```

### 7.6 CCIE Park Flow

```
CCIE Full Active
    │
    ▼
PLI high OR behavior erosion (no clinical intersection)
    │
    ▼
System / Barista level decision
    │
    ▼
Park CCIE Full → Parking Lot (Standard or Premium slot)
Light CCIE continues (parking-immune)
    │
    ▼
72-hour hold → Q Inbox → Re-suggest
```

---

## 7.5 ITB CATEGORY CLASSIFICATION

### §7.5.1 The Three-Category Model

Every ITB carries a **Category Tag** assigned at birth. The tag is a property of the content, not the client.

| Tag | Full Name | Regulatory Basis | Authority Required |
|---|---|---|---|
| **CAT-W** | Wellness | FDA General Wellness enforcement discretion; no disease claims | None — open deployment |
| **CAT-G** | Gray Zone | Class II device used off-label, or state-variable regulation, or adjacent medical claims | BariAccess pre-vetting + enhanced disclaimers (CCO-WELL-001) |
| **CAT-M** | Medical | Prescription-only by law; medical director required; PHI generation on delivery | Licensed prescriber + HIPAA BAA |

### §7.5.2 Category Decision Criteria

**CAT-W Criteria (ALL must be true):**
- FDA General Wellness criteria met (low-risk, no disease claims)
- No prescription-only products or medications involved in delivery
- No medical device above Class I or Class II used outside cleared/general-wellness scope
- No state requires medical director oversight for delivery
- No PHI generated by the intervention itself

**CAT-G Criteria (ANY triggers classification):**
- Class II medical device used off-label
- FDA has issued a consumer warning about the modality (e.g., WBC — FDA Consumer Update 2016)
- State regulation varies significantly
- Claims boundary is easily crossed
- Professional-grade equipment used without prescriber present

**CAT-M Criteria (ANY triggers classification):**
- Prescription medication administered (GLP-1, hormones, peptides, antibiotics)
- IV administration of any substance (including vitamin drips — Kansas State Board joint warning, February 25, 2026)
- Compound pharmacy products required
- Federal or state law classifies as medical practice
- Medical director required by state law
- Procedure crosses the skin barrier (PRP, injectable peptides, ozone IV, EBOO)

### §7.5.3 Category → Credit Label (locked)

| Category | Credit Labels | Hard Rule |
|---|---|---|
| **CAT-W** | CCIE only | No exceptions |
| **CAT-G** | CCIE default; CPIE if prescriber involved | Medical B² can elevate to CPIE with prescriber sign-off |
| **CAT-M** | BOTH CCIE + CPIE mandatory | CAT-M cannot be CCIE-only. No client override. |

### §7.5.4 Category → B² Authorization

| B² Profile | CAT-W | CAT-G | CAT-M |
|---|---|---|---|
| **Wellness B²** (no prescriber) | ✅ Full library | ⚠️ BariAccess pre-vetted only | ❌ Blocked |
| **Medical B²** (licensed OR Wellness + prescriber + BAA) | ✅ Full | ✅ Full | ✅ Full |

**Automatic enforcement:** Compliance Engine S15 reads B² profile and ITB category tag simultaneously. Hard block — not a warning.

### §7.5.5 Category → Package Eligibility

Per CCO-PKG-001 v1.0:

| Package | CAT-W | CAT-G | CAT-M |
|---|---|---|---|
| **Core** | Light only; Full as add-on | ❌ | ❌ |
| **Professional** | Full library | ⚠️ Pre-vetted subset (Wellness B²); Full (Medical B²) | ❌ (Wellness B²); ✅ (Medical B²) |
| **Flagship** | Full + custom | Full + co-propose | Full (Medical B² required) |

### §7.5.6 CAT-G Vetting — Summary

CAT-G items require explicit vetting before any B² deployment. Full process in CCO-WELL-001 v1.0:
1. Content review — claims language audit, FDA General Wellness check
2. State overlay — 9-state enforcement list
3. Disclaimer attachment — standard no-disease-claims language
4. Decision + log — APPROVE / CONDITIONAL / RECLASSIFY / REJECT
5. Periodic re-review — annual minimum; quarterly for flagged items

**Default-block rule:** Any CAT-G item without an approved vetting record is system-blocked at S15.

### §7.5.7 Named ITB Category Map

| ITB | Category | Credit Labels | Notes |
|---|---|---|---|
| ITB-GLP1™ | CAT-M | CPIE + CCIE | ✅ |
| ITB-VACCINE™ | CAT-M | CPIE + CCIE | ✅ |
| ITB-CRISIS™ | CAT-M | CPIE + CCIE | ✅ |
| ITB-SOCIAL-RECOVERY™ | CAT-G* | Mixed | *DR-ITB-SOCREC-001 |
| ITB-MITOCHONDRIAL-IV™ | CAT-M* | CPIE + CCIE | *DR-ITB-MITO-001 |
| ITB-STRENGTH™ | CAT-W | CCIE | ✅ |
| ITB-AEROBIC™ | CAT-W | CCIE | ✅ |
| ITB-DECAT™ | CAT-W | CCIE | ✅ |
| ITB-RECOVERY-EXERCISE™ | CAT-W | CCIE | ✅ |
| ITB-CHRONO-TRAINING™ | CAT-W | CCIE | ✅ |
| ITB-NUTRITION™ | CAT-W | CCIE | ✅ |
| ITB-HYDRATION™ | CAT-W | CCIE | Oral only — IV = CAT-M |
| ITB-MENOPAUSE™ | CAT-M | CPIE + CCIE | Single block dual-track |
| ITB-JETLAG™ | CAT-W* | CCIE | *DR-ITB-JETLAG-001 |
| ITB-SOCIAL-COHORT™ | CAT-W | CCIE | ✅ |
| ITB-SOCIAL-ACTIVITY™ | CAT-W | CCIE | ✅ |
| ITB-SOCIAL-PEER™ | CAT-W | CCIE | ✅ |
| ITB-HEALTHSPAN™ | TBD* | TBD | *DR-ITB-HSPAN-001 |
| ITB-LIFESPAN™ | TBD* | TBD | *DR-ITB-LSPAN-001 |

---

## 8. REQUIRED BLOCK FIELDS AT BIRTH

Every ITB block MUST be defined with all 11 fields before deployment:

| # | Field | CAT-M Spec | CAT-G Spec | CAT-W Spec |
|---|---|---|---|---|
| 1 | **Category Tag** | CAT-M | CAT-G | CAT-W |
| 2 | **Credit Labels** | CPIE + CCIE (both mandatory) | CCIE (CPIE if prescriber) | CCIE only |
| 3 | **Light Layer Content** | Educational; always present; parking-immune | Educational; always present | Educational; always present |
| 4 | **Full Layer Authorization** | Provider prescription required | Barista/Max (CCIE); prescriber (CPIE) | Barista/Max approval |
| 5 | **Compliance Disclaimer** | Hard medical language; HIPAA notice | Standard + state-specific per CCO-WELL-001 | Wellness disclaimer + 911 notice |
| 6 | **Escalation Rules** | Full chain embedded per §13 | Per credit label | CCIE chain only |
| 7 | **Parking Eligibility** | CPIE = ❌; CCIE = ✅ | CCIE = ✅; CPIE = ❌ | ✅ |
| 8 | **FABs Connected** | Guardian FAB + Program FABs | Guardian + Program FABs | Program FABs |
| 9 | **V-Streams** | V1+V2+V3+V4 inputs to A5 | V2+V4 primary | V2+V4 primary |
| 10 | **Phase Structure** | Assessment → Intervention → Monitoring → Completion | Same | Same |
| 11 | **Build Phase** | Phase 1, 2, or 2+ | Phase 1, 2, or 2+ | Phase 1, 2, or 2+ |

---

## 9. DETECTION AND ACTIVATION FLOW

### 9.1 Three-Stage Signal Model

```
PRE-SIGNAL → SIGNAL → CLINICAL INTERSECTION
     │            │              │
     ▼            ▼              ▼
Light nudge   ITB Light      ITB Full
 (Ollie)*     activates    deploys (CPIE or CCIE Full)
```

*Pre-signal vs Program activation relationship — DR-ITB-PRESIG-001

| Stage | Definition | System Action | V-Value Trigger |
|---|---|---|---|
| **Pre-Signal** | One V-value trending downward. 72-hour window. | Light ITB nudge via Ollie | Single V declining |
| **Signal** | Confirmed trend crossing threshold | Light ITB formally activates; Blip Card updates | Two or more V-values |
| **Clinical Intersection** | V1+V2+V3+V4 converging. Threshold criteria met. | Full ITB deployment chain fires | All 4 V-values |

### 9.2 ISE Resolver Connection

Per PAC-ISE-002 v2.0:
- ORI (Ollie Response Index) drops 3–7 days BEFORE FSI drops — earliest pre-signal for ITB engagement erosion
- FSI (FAB Stability Index) — anchored as BHR sub-score (locked March 3, 2026) — captures cross-FAB erosion
- Signal 4 (Health Status) reads Beacon composites — ITB non-compliance → V4 decline → composites_in_orange increases → ISE-2 or ISE-5 risk

### 9.3 Pre-Signal Detection (from Beacon Canon v1.1 §10)

Pre-signal fires when:
- **Position trigger:** Score enters Faint Green (80–84) from above
- **Velocity trigger:** Rate of descent exceeds threshold (downward slope)
- Both triggers operate in parallel with Program trigger

---

## 10. ITB PROGRAM LIFECYCLE

Per CCO-PROG-001 v2.1 §11:

| State | Color | Description |
|---|---|---|
| **Not Started** | Black/Gray | Program assigned; not yet seen |
| **In Progress** | Green | User actively engaged |
| **Complete Lite** | Green (blinking) | Learn done; Intervene opted out; partial CCIE credits + Parking Lot 72hr |
| **Complete** | Green (blinking) | Both steps done; full credits released |
| **Credits + Voucher** | 48-hour window | Claim or decay (20% per day unclaimed) |
| **Parked** | Orange | Cognitive load protection; CCIE only |
| **Drift** | Orange | Consistency declining; correction program triggered |
| **Critical** | Red (inside card only) | CPIE non-compliance at crisis level |

### 10.1 Branch Point Rule (from CCO-PROG-001 v2.1 §7.3)

```
Program Start
    │
    ▼
LEARN (ITB Light)
    │
    ├───► STOP HERE
    │     Outcome: Partial CCIE credits
    │              "Complete Lite" status
    │              → Parking Lot 72hrs
    │
    └───► CONTINUE TO INTERVENE (ITB Full)
          Gates: ISE-2+ · Approval · CLI ≥ 0.60
          Outcome: Full CPIE credits · Full program completed
```

**User is never forced into Intervene.** Complete Lite = valid, credit-earning path. Repeat Complete Lite feeds V2 as legitimate learning preference — not failure.

---

## 11. PROGRAM ENTRY POINTS

**Replaces §11 "Escape Room → Program Generation" from v1.0.**

Per CCO-PROG-001 v2.1 §5 — Escape Room removed from canon (April 20, 2026).

**Two canonical entry points:**

| # | Source | Location | Trigger |
|---|---|---|---|
| 1 | **Row 1 Signal Dial tap** | R&R · Healthspan · My Blueprint · Inner Circle tiles | Tap tile → Pyramid opens → Tap orange dot → Card Program → Start |
| 2 | **Q (Queue)** | Header right | User manually opens, selects program |
| 3 | **[OPEN SLOT]** | TBD | Reserved by Val — DR-ARCH-3RDSRC-001 |

**Voucher Logic (from CCO-PROG-001 v2.1):**

| Rule | Value |
|---|---|
| Claim window | 48 hours from program completion |
| Unclaimed decay | 20% per day after 48 hours |
| Shareable to | Up to 3 people |
| Expiry | Full decay at 5 days |

**Calendar Integration:** ITBs that require scheduling raise `scheduling_required = true`. Program Card surfaces Calendar widget. Calendar widget is NOT part of the ITB — it executes timing, reminders, and confirmations. ITB Full only — no calendar widget on ITB Light. See CCO-PROG-001 v2.1 §19.

---

## 12. BOX SYSTEM WIRING

### 12.1 A-Box Inputs for ITB

| A-Box | Function | ITB Relevance |
|---|---|---|
| **A5** | ITB State Primary | Pre/Mid/Post, Adherence — canonical ITB state container |
| **A1** | Scores (R&R, V1–V4) | Overall health signal feeding Clinical Intersection |
| **A2** | Behavior Physiology | FAB stability, routine adherence — signals around ITB engagement |
| **A3** | Subjective (Mood, Effort) | Mood/Effort inputs; QMQN™ outputs |
| **A6** | Trend Signals | 7/14/30/90-day slopes; ORI and FSI trends |
| **A8** | Context Layer | Chronotype, location, Space-state; contextualizes ITB timing |

### 12.2 C-Box Outputs from ITB State

| C-Box | Function | ITB Output |
|---|---|---|
| **C4** | ITB Suggestion / Eligibility | Routes to S16 (ITB Engine) + S6 (Tier) |
| **C5** | Credits Award | Routes to S5 (Credits Engine); CPIE credits higher value |
| **C9** | Coaching Narrative (Ollie) | CPIE = escalation language; CCIE = nudge language |
| **C10** | Clinical Intersection Flag | CPIE only → S14 (Governance Triad) |
| **C11** | Context Safety Adjustment | → S8 (Protected Space Engine); modulates ITB delivery timing |

### 12.3 S16 — ITB Engine

| Attribute | Value |
|---|---|
| **Name** | ITB Engine |
| **S-Box** | S16 |
| **Role** | Active Participant |
| **Receives from** | C4 (ITB suggestion/eligibility) |
| **Functions** | ITB lifecycle management, adherence tracking, Light ITB logic, provider dashboard coordination, V4 management, program-level FAB coordination |

### 12.4 Architecture Diagram

```
A5 (ITB State) + A1 + A2 + A3 + A6 + A8
              │
              ▼
        B1 Router
        (primary routing criterion = credit label)
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
   C4        C5        C9/C10/C11
  ITB       Credits   Coaching/Clinical/Context
  Suggest
    │         │         │
    ▼         ▼         ▼
  S16        S5        S14 (CPIE only)
  ITB       Credits    Governance
  Engine    Engine     Triad
    │
    ├── Light ITB (always on, parking-immune)
    ├── Full ITB (Program-determined)
    ├── Provider Dashboard
    └── Program FAB coordination
```

---

## 13. ESCALATION CHAINS

### 13.1 CPIE Escalation — ISE-Gated (CANONICAL)

**Hard Rule:** Barista is ALWAYS in the CPIE chain before Provider. No Ollie → Provider direct. No skipping Barista. Entry timing is ISE-gated — not chain-gated.

| ISE State | Barista Entry Timing |
|---|---|
| ISE-0, ISE-1, ISE-4 | 72-hour window |
| ISE-2, ISE-3 | 24-hour window |
| ISE-5 | Immediately |
| ITB-CRISIS™ / self-harm | Full chain fires simultaneously |

```
Ollie
  │
  ▼
AskABA / Max
  │
  ▼
Barista (timing per ISE state above)
  │
  ▼
Prescribing Provider
```

**Crisis exception:** Self-harm or immediate safety → full chain simultaneous regardless of ISE state (PAC-ISE-007 §6.1).

### 13.2 CCIE Escalation

```
Ollie
  │
  ▼
AskABA / Max
  │
  ▼
Barista (if needed — not mandatory)
```

No mandatory Provider involvement for CCIE. Provider escalation only if ISE-5 triggered or clinical intersection confirmed.

### 13.3 ISE-5 and ITB

When ITB-CPIE non-compliance or crisis triggers ISE-5:
- Provider exercises 51% governance directly (ISE Canon v3.0 §2)
- Ollie operates in governance-neutral mode only (PAC-ISE-007 §4.6)
- Shield overlay activates on identity icon
- Consumer sees protection, not restriction reason (PAC-ISE-006 §5.2.1)
- Clinical (CPIE) surface sees full payload including governance block (PAC-ISE-006 §5.2.2)

---

## 14. ROW 5 ITB TRACKER

### 14.1 Canonical Position

```
[FAB 🎯] [ITB 💊] [Beacon 🧭] [Routine ⭐] [Productivity ⚡] [Parking Lot 🅿️]
   1        2         3          4            5                 6
```

### 14.2 Interaction Model

| Interaction | Response |
|---|---|
| **TAP** | Blip Card (quick status) |
| **DOUBLE TAP** | Definition Card |
| **PRESS ≥ 2s** | Press Card (TikTok-style full view) |
| **PUSH** | Ollie notification |

### 14.3 Visibility Rules

- **ALWAYS VISIBLE** — not conditional on Full deployment
- **Parking-immune** — Row 5 tracker cannot be removed by any system state including ISE-3
- **ISE-3 exception** — Ollie delivery about Light layer may be compressed; tracker itself stays

### 14.4 ITB Blip Card Content

| Box | Content |
|---|---|
| **Box 1** | ITB name + category tag indicator |
| **Box 2** | Lifecycle state (color-coded per §10) |
| **Box 3** | Current program status / next action |

### 14.5 R&R Blip Card Connection

R&R Blip Card Box 3: *"Review ITB Program"* — visible when ≥1 active ITB exists.

---

## 15. PARKING LOT INTEGRATION

### 15.1 ITB Slots in Parking Lot

| Slot | Name | ITB Type | Duration | Vetting |
|---|---|---|---|---|
| **Slot 5** | Merchant Related ITB | Merchant/product updates | Filtered | AskABA + Provider |
| **Slot 6** | Vetted Merchant Non-Wellness | GLP-1, peptides, therapeutic (CPIE) ITBs | 3 days → Red Alert | Provider (pre-vetted) |

### 15.2 Parking Rules by Credit Label

| Rule | CPIE | CCIE |
|---|---|---|
| Can be parked | ❌ NO | ✅ YES |
| Emergency slot | Slot 6 — Red Alert flow | Standard (Slot 1) or Premium (Slot 2) |
| If not resolved | Downgrade to Light + legal form | Q Inbox (72hr) → purge |

### 15.3 Light ITB is Parking-Immune

Light layer is ALWAYS active. Even when Full ITB is parked or downgraded, Light ITB content continues. Light cannot be parked. Tracker cannot be removed.

---

## 16. ISE INTEGRATION

### 16.1 ISE States and ITB Delivery

Per ISE Canon v3.0 §13:

| ISE State | CPIE ITB | CCIE ITB |
|---|---|---|
| ISE-0 Neutral | ✅ Delivers normally | ✅ Delivers normally |
| ISE-1 Aligned | ✅ Delivers | ✅ Delivers |
| ISE-2 Protective | ✅ Delivers (clinical) | ⚠️ Light only; defer Full |
| ISE-3 Contained | ✅ Clinical/Medication delivers | 🅿️ Park non-essential |
| ISE-4 Momentum | ✅ Delivers | ✅ Delivers |
| ISE-5 Restricted | ✅ Clinical delivers (provider governs) | 🅿️ PARK non-essential |
| ISE-6 Exploratory | ✅ Delivers gently | ✅ Delivers gently |

**ISE-5 Rationale:** Clinical (CPIE) always delivers — clinical cannot be suppressed. Non-essential CCIE parks.

### 16.2 ITB → ISE Closed Loop

```
ITB non-compliance (V4 declines)
    │
    ▼
Beacon composite impact (Signal 4 in ISE Resolver)
    │
    ▼
ISE state may shift (ISE-2, ISE-3, or ISE-5)
    │
    ▼
Platform adapts presentation (protection, escalation, governance)
    │
    ▼
Escalation chain fires (per §13 ISE-gated timing)
```

---

## 17. SC AND DRIFTLEVEL CONNECTION

### 17.1 ITB in SC Formula

```
SC = 0.25·V1 + 0.35·V2 + 0.20·V3 + 0.20·V4
```

V4 weight = 0.20 — *"Response to interventions indicates system trust."*

### 17.2 The Domino Chain

```
ITB non-compliance (V4 declines)
    │
    ▼
SC detects (V4 weighted 0.20)
    │
    ▼
DriftLevel may change (Minor → Moderate → Severe → Breach)
    │
    ▼
DriftLevel triggers ISE re-evaluation
    │
    ▼
ISE state may shift → Platform responds
```

### 17.3 SC=30 Fallback

If V4 data unavailable:
- SC falls back to SC=30 with `eligibility_locked = true`
- Does NOT trigger tier changes
- Does NOT trigger DriftLevel escalation until real V4 data returns

---

## 18. DYNAMIC PROFILE INTEGRATION

### 18.1 ITB as V4 Data — NOT Mesh Thread

Per PAC-DP-001 v1.0A (locked):

> **ITB is DATA (V4), not CONTEXT. The SRI Risk Thread covers the safety dimension of ITB adherence.**

ITBs flow into Dynamic Profile as V4 raw data. NOT one of the 7 Mesh threads.

### 18.2 SRI Risk Thread (Thread 4)

- States: Stable / Watchlist / Critical
- At Critical: blocks auto-refill; forces 51% governance review
- Directly relevant to ITB-GLP1™ refill governance

### 18.3 Memory Snap Connection

ITB milestone reached (program completion, adherence streak, phase transition) → Memory Snap generated → Memory Lane (Thread 1). Encodes event as part of user's Trauma & Triumph History.

---

## 19. FAB-ITB INTEGRATION

### 19.1 Level 3 Program FABs

Per FAB Canon v1.2 §3: Every deployed Full ITB has Level 3 Program FABs attached. These FABs:
- Activate when ITB Full deploys
- Duration = ITB program duration
- Monitor adherence to ITB protocol
- Report to A2 (Behavior Physiology) → feeds V2

### 19.2 Program Guardian FAB

Watches ITB adherence at all times, even in Light mode. Level 1 Standby FAB — always on.

```
Guardian FAB (surveillance layer)
    │
    ├── Routine Guardian
    ├── Behavior Guardian
    ├── Program Guardian — ITB adherence
    └── Life-Change Guardian
```

### 19.3 FAB-ITB Activation Flow*

```
Pre-signal (Program Guardian detects drift)
    │
    ▼
FAB deployed* (habit anchor — behavioral anchor)
    │
    ▼
Knowledge infusion (education layer activates)
    │
    ▼
Signal Bar Alert → Program created
```

*FAB deployment sequencing — DR-FAB-PROG-SEQ-001 (see CCO-DR-REGISTER-001)

### 19.4 Hierarchy

```
ROUTINE (24/7 container)
    │
    └── SEGMENT (time block)
            │
            └── FAB Level 1 (Standby — always monitoring)
                    │
                    ├── FAB Level 2 (Wedge — when needed)
                    │
                    └── FAB Level 3 (Program — attached to ITB Full)
```

---

## 20. B² ACCESS AND CUSTOM ITBs

### 20.1 B² ITB Authorization Matrix

Per CCO-PKG-001 v1.0 and §7.5.4:

| B² Profile | CAT-W | CAT-G | CAT-M |
|---|---|---|---|
| **Wellness B²** (no prescriber) | ✅ Full | ⚠️ Pre-vetted only | ❌ Blocked |
| **Medical B²** (licensed OR Wellness + prescriber + BAA) | ✅ Full | ✅ Full | ✅ Full |

**B² onboarding lives in a separate admin layer** — not inside the A/B/C/S box system. S15 Compliance Engine is configured during B² onboarding. Once configuration is complete, patient-facing A/B/C/S engine activates. Provider Dashboard connects to both layers.

### 20.2 Custom ITB Rules

- B² organizations may build custom ITBs
- Same Category Tag + Credit Label rules apply — no exceptions
- Custom CAT-M ITBs require same escalation chain as platform ITBs
- Custom CAT-G ITBs require CCO-WELL-001 vetting pass before deployment
- Custom CAT-W ITBs require Barista/Max approval

### 20.3 AllientCare ITB-MEDICATION

Status: **Conceptual only. Not built.** — DR-ITB-ALLCARE-001

---

## 21. PHASE 1 BUILD PRIORITY

### 21.1 Most Deployed in Patient Cases (10-case analysis)

| ITB / FAB | Deployment Count |
|---|---|
| ITB-SOCIAL-ACTIVITY™ | 5 of 10 cases |
| ITB-AEROBIC™ + ITB-STRENGTH™ | 4 combined |
| FAB-EXERCISE | 10 of 10 cases |
| FAB-ROUTINE | 10 of 10 cases |
| FAB-SOCIAL | 9 of 10 cases |

### 21.2 Phase 1 Build Sequence

| Priority | Item | Rationale |
|---|---|---|
| 1 | FAB-EXERCISE, FAB-ROUTINE, FAB-SOCIAL | Universal deployment; Learning state needed first |
| 2 | ITB-STRENGTH™, ITB-AEROBIC™ | Most common exercise ITBs; CAT-W CCIE |
| 3 | ITB-SOCIAL-COHORT™, ITB-SOCIAL-ACTIVITY™ | High deployment rate; WOZ-compatible |
| 4 | FAB-SLEEP™, FAB-NUTRITION™ | Secondary FABs needed before clinical ITBs |
| 5 | ITB-GLP1™, ITB-CRISIS™ | CAT-M CPIE — highest governance complexity; requires full chain ready |

---

## 22. CANONICAL CASE EXAMPLE — ITB-CASE-001

**Low HRV + Low Angle Phase → Protein Intervention**
*(Locked April 20, 2026 as primary canonical ITB deployment example)*

| Field | Value |
|---|---|
| **Case ID** | ITB-CASE-001 |
| **Trigger signals** | Low HRV (V1) + Low Angle Phase (V1) |
| **Intervention identified** | Protein |
| **FAB deployed** | FAB-PROTEIN* (DR-FAB-PROG-SEQ-001) |
| **Relevant ITBs** | ITB-NUTRITION™ (Light path) · ITB-NUTRITION™ + protocol (Full path) |
| **Credit path A** | Partial CCIE → Complete Lite → Parking Lot 72hr |
| **Credit path B** | Full CPIE → Completed |
| **Clinical tag** | HYBRID — Light = CCIE · Full = CPIE |

```
SIGNAL LAYER
Low HRV + Low Angle Phase (V1 biometric signals)
    │
    ▼
FLAG triggered
    │
    ▼
Intervention identified: PROTEIN
    │
    ▼
FAB deployed* (habit implementation — behavioral anchor)
    │
    ▼
Knowledge infusion (education layer activates)
    │
    ▼
SIGNAL BAR ALERT
Orange rim on tile + Orange dot in Pyramid
    │
    ▼
Problem presented to user
    │
    ▼
PROGRAM CREATED
    │
    ├── PATH A — LEARN (ITB Light)
    │       │
    │       ▼
    │   Partial CCIE credits collected
    │   Marked: COMPLETE LITE
    │   → Parking Lot 72hrs
    │
    └── PATH B — INTERVENE (ITB Full)
            │
            ▼
        Full CPIE credits collected
        Full program completed
```

*FAB deployment sequencing — DR-FAB-PROG-SEQ-001

---

## 23. CONFLICT LOG

| # | Conflict | Source A | Source B | Resolution |
|---|---|---|---|---|
| 1 | ITB Full Name | SOT v1.1 §Glossary: "In The Bag" | All post-Feb 17, 2026 conversations: "Interventional Therapeutic Block" | **RESOLVED Q1 ✅** — "Interventional Therapeutic Block" is canonical. SOT v1.1 carries stale definition — update required at next SOT revision. Flag for Zakiy. |
| 2 | CPIE/CCIE credit definitions | PAC-ISE-006 uses CPIE/CCIE as interface layer shorthand | ISE Canon v3.0 §17: CPIE/CCIE = credit type definitions | PAC-ISE-006 usage scoped to that document only. ISE Canon v3.0 §17 governs everywhere else including ITBs. |
| 3 | ITB as Mesh thread | Some early conversations | PAC-DP-001 v1.0A: ITB formally REJECTED | **RESOLVED ✅** — ITB is V4 data, not Mesh context. |
| 4 | CAT-M credit labels | v1.0 implied CPIE-only for CAT-M | April 20, 2026 session | **RESOLVED ✅** — CAT-M = mandatory BOTH CCIE + CPIE. No exceptions. |
| 5 | Single block vs companion block | Some sessions implied companion block for all | April 20, 2026 session | **RESOLVED ✅** — Single block dual-track for CAT-M. Companion block only when two architecturally distinct protocols exist. |

---

## 24. D&R REGISTER — ASTERISKED ITEMS

All items below are logged in CCO-DR-REGISTER-001 v1.0. None are blockers for this canon lock.

| DR ID | Item | Host Section | Status |
|---|---|---|---|
| DR-ITB-MITO-001 | ITB-MITOCHONDRIAL-IV™ CAT-M provisional confirmation | §4A, §7.5.7 | HELD* |
| DR-ITB-SOCREC-001 | ITB-SOCIAL-RECOVERY™ formal vetting pass | §4A, §7.5.7 | HELD* |
| DR-ITB-JETLAG-001 | ITB-JETLAG™ CAT-W confirmation | §4B, §7.5.7 | HELD* |
| DR-ITB-MENO-001 | ITB-MENOPAUSE™ companion-block evaluation | §4B | HELD* |
| DR-ITB-HSPAN-001 | ITB-HEALTHSPAN™ modality list → category | §4C | HELD* |
| DR-ITB-LSPAN-001 | ITB-LIFESPAN™ modality list → category | §4C | HELD* |
| DR-ITB-PRESIG-001 | Pre-signal vs Signal vs Program activation relationship | §9 | HELD* |
| DR-ITB-OLLIE-001 | Ollie notification trigger algorithm for ITB state changes | (former Q10) | HELD* |
| DR-ITB-BEACON-001 | Beacon → ISE → Program connection algorithm | (former Q11) | HELD* |
| DR-ITB-HIPAA-001 | HIPAA embarkment checkbox logic for B² onboarding | (former Q12) | HELD* |
| DR-ITB-ALLCARE-001 | AllientCare ITB-MEDICATION — build or conceptual | §20.3 | HELD* |
| DR-ITB-ESC-001 | Escape Room replacement fully mapped to Program Canon v2.1 | §11 | HELD* |
| DR-WELL-STATE-001 | 9-state CAT-G enforcement list confirmation | CCO-WELL-001 §4.4 | HELD* |
| DR-WELL-OQ-001 | CCO-WELL-001 open questions Q19–Q24 | CCO-WELL-001 §10 | HELD* |
| DR-PKG-OQ-001 | CCO-PKG-001 open questions Q25–Q32 | CCO-PKG-001 §10 | HELD* |
| DR-CAL-SAFETY-001 | Calendar missed confirmation → Full→Light downgrade | CCO-PROG-001 §19.7 | HELD* |
| DR-FAB-PROG-SEQ-001 | FAB deployment sequencing in Programs | §19.3, §22 | HELD* |
| DR-ARCH-3RDSRC-001 | Third Program Source open slot | §11 | HELD* |

---

## 25. SOURCE CONVERSATION INDEX

| Conversation | Topic | Key ITB Content |
|---|---|---|
| https://claude.ai/chat/d3df073b-5093-4934-8d59-6ddf4f19405e | ITB Search Main Dossier | Playbook Principle, two-sided architecture |
| https://claude.ai/chat/c9a23884-a2b1-4ae4-a6c6-38480d1a3f47 | Constellation Panel Row 1 (Block 19) | Credit label governance, CPIE/CCIE rules |
| https://claude.ai/chat/115bf5af-b47d-456f-83f5-46a25c1bc6f6 | 14-ITB inventory, cross-case deployment | Phase 1 build priority, 10-case analysis |
| https://claude.ai/chat/46577e74-aa6f-42f4-a1d4-c12db50bed53 | FABs and ITBs Review | FAB-ITB interaction, Guardian FAB |
| https://claude.ai/chat/0c27f10e-b538-4cb0-9b89-8971b3f2702d | Canonical Document Review | Original 11-block list |
| https://claude.ai/chat/a0bbf9dd-6e6a-4efc-a8b2-26680194b232 | ABAEMR Name Lock | S16 ITB Engine decision |
| https://claude.ai/chat/7471eeb0-2d39-44b9-91ed-a9c3b3b090c7 | Constellation Panel Row 5 | ITB tracker position 2, ALWAYS VISIBLE |
| https://claude.ai/chat/63741a46-e8c2-47fb-a1f8-ea2350876241 | Architecture Mapping | C4 → S16 wiring |
| https://claude.ai/chat/86bacc02-f572-47d6-8921-4e322f543b05 | EMR Architecture Versions | V4 stream; S16 function |
| https://claude.ai/chat/cfc5b9f8-418b-433c-bcc1-2bc7d6cea53c | V1-V4 Values | Dual-track policy |
| https://claude.ai/chat/6bb2d45d-1662-44e6-859a-034f7dc698c2 | ITB Healthspan/Antiaging | HEALTHSPAN/LIFESPAN status |
| https://claude.ai/chat/1378d83e-64bc-4698-8a2e-2d5189d88e08 | Vitamin S and Anna Lifecycle | ITB always in Row 5 |
| https://claude.ai/chat/bd263e41-7de7-4a6e-8a82-c9011ac021a4 | Rules Transcript | Light vs Full rules |
| https://claude.ai/chat/71216e77-00f1-4d08-8f55-8c109d770dfe | FAB GitHub | FAB-ITB connection |
| https://claude.ai/chat/a2052648-084f-4b87-bb7f-257aadc2e4a4 | CCO-ITB-001 v1.0 original | 964 lines, 25 sections, DRAFT |

---

## 26. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| v1.0 | March 13, 2026 | Dr. Andrei + Claude | Initial ITB canon. 964 lines, 25 sections, 18–19 named blocks, 13 Open Questions. Status: DRAFT. |
| v1.1 | April 20, 2026 | Dr. Andrei | AMENDMENT layer. Low HRV + Low Angle Phase + Protein case locked (ITB-CASE-001). Q3 resolved (ITBs determined by Program). Q9 resolved (dual-path canonical). Cross-references to CCO-PROG-001 v2.1 established. |
| **v1.2** | **April 20, 2026** | **Dr. Andrei** | **FULL REWRITE incorporating v1.1 amendment. Q1 locked (Interventional Therapeutic Block). Q2 locked (ISE-gated escalation). Q5 locked (FDA Consultant Principle). Q6 locked (single block dual-track). Q7 locked (B² admin layer). Q8 locked (Phase 2+ for HEALTHSPAN/LIFESPAN). CAT-W/G/M classification system added (§7.5). Credit label rules locked (CAT-W=CCIE; CAT-G=CCIE/CPIE; CAT-M=both mandatory). Parking-immune definition locked. 19 ITB blocks confirmed (editable). ITB-MENOPAUSE™ resolved as CAT-M dual-track. Escape Room replaced by Program Canon v2.1 entry points. 18 D&R items logged with asterisks. All remaining open questions moved to D&R Register. STATUS: LOCKED.** |

---

## 27. DOCUMENT STATUS

| Attribute | Value |
|---|---|
| **Document ID** | CCO-ITB-001 |
| **Version** | v1.2 |
| **Date** | April 20, 2026 |
| **Status** | ✅ LOCKED — EDITABLE |
| **Layer** | Layer 4 — Developer/MASTER |
| **Layers Pending** | Layer 3 (UI/UX), Layer 2 (Business), Layer 1 (Executive) — future session |
| **Open Questions** | 0 — all moved to D&R Register (§24) |
| **D&R Items** | 18 — logged in CCO-DR-REGISTER-001 v1.0 |
| **No Hallucination** | ✅ All content traced to confirmed source documents |
| **Inventory** | 19 named blocks as of April 20, 2026 — editable, will grow |
| **Dependencies** | Beacon Canon v1.1, ISE Canon v3.0, SC Canon CCO-IC-SC-001, FAB Canon v1.2, Program Canon v2.1, Parking Lot Canon v1.0, PAC-DP-001 v1.0A, PAC-ISE-002 v2.0, PAC-ISE-006 v1.0A, PAC-ISE-007 v1.0B, Routine Canon v1.0, CCO-WELL-001 v1.0, CCO-PKG-001 v1.0, CCO-DR-REGISTER-001 v1.0 |

---

```
═══════════════════════════════════════════════════════════════
END OF DOCUMENT — CCO-ITB-001 v1.2
STATUS: ✅ LOCKED — EDITABLE
AUTHORITY: Dr. Valeriu E. Andrei, President, BariAccess LLC
═══════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. Licensed under Document Canon v2 governance (locked April 18, 2026).
