# Identity State Expressions™ (ISE) Canon v3.0 — Canonical Document

**Document Type:** Canonical / Source of Truth  
**Version:** 3.0  
**Status:** ✅ CANONICAL — LOCKED  
**Date:** February 20, 2026  
**No Hallucination:** Content merged from ISE Canon v2.0, 33363Feb20 compliance audit, 33363Feb20 developer letter, PAC-ISE-001 through PAC-ISE-007, Beacon Canon v1.1, FAB Canon v1.2, Program Canon v1.1; no invented definitions.  
**Supersedes:** ISE Canon v2.0 (February 17, 2026) — clarifies two-lane authority (render vs downstream gating) and preserves deterministic resolver.
**Alignment:** Beacon Canon v1.1 and CCO-CP-R1T1-001 (Row 1 Tile 1 = R&R (Readiness & Recovery); §20 Cross-References consistent). 2026-03-14.

---

## Source Materials & Traceability

| Source Type | Specific Sources | Use in This Canon |
|-------------|------------------|-------------------|
| **Existing Canons** | ISE Canon v2.0 | Base structure (20 sections); all content carried forward unless revised below |
| **Audit / Letter** | 33363Feb20UpsatedISE (ISE Canonical Compliance Audit), 33363Feb20DeveloperLetter | §1, §3, §3.1, §5, §15, §17 — two-lane definition; Lane 1 (ISE owns) vs Lane 2 (downstream consumes ISE state, owns decision) |
| **PAC Documents** | PAC-ISE-001 through PAC-ISE-007 | Sections 5, 6, 7, 8, 9, 18; principles from PAC-ISE-007 |
| **Other Canons** | Beacon Canon v1.1, FAB Canon v1.2, Program Canon v1.1 | Sections 10, 11, 12, 13, 20; delivery matrix, weight-shift, FAB/Program behavior |
| **Session / Transcript** | 33317Feb17 (ISE Canon v2.0 — Full Platform Reset & Build) | Structure, Fortress/Phase 3 doctrine |
| **Audit (prior)** | ISE_Document_Audit_Findings_Final.md, readFirst.md | 7-state consistency, PAC-004 naming |

**Document Workflow:** Exact resolver logic and trigger thresholds remain in TS-000 / PAC-ISE-002; this Canon defines WHAT ISE governs and the two-lane boundary (what ISE owns vs what downstream systems own). It does not define HOW the resolver computes state.

---

## TABLE OF CONTENTS

1. [Definition](#1-definition)
2. [The 7 States](#2-the-7-states)
3. [Canonical State Authority](#3-canonical-state-authority)
4. [Two-Lane Authority](#31-two-lane-authority)
5. [Placement in Architecture](#4-placement-in-architecture)
6. [What ISE Governs](#5-what-ise-governs)
7. [ISE and UI/UX](#6-ise-and-uiux)
8. [ISE and Ollie](#7-ise-and-ollie)
9. [ISE and Max (AskABA)](#8-ise-and-max-askaba)
10. [ISE and Fortress](#9-ise-and-fortress)
11. [ISE and Scoring](#10-ise-and-scoring)
12. [ISE and FABs](#11-ise-and-fabs)
13. [ISE and Programs](#12-ise-and-programs)
14. [ISE and BioSnap / Parking Lot](#13-ise-and-biosnap--parking-lot)
15. [ISE and Barista / Provider](#14-ise-and-barista--provider)
16. [ISE and Credits](#15-ise-and-credits)
17. [Blink Escalation](#16-blink-escalation)
18. [Core Principles](#17-core-principles)
19. [PAC Chain](#18-pac-chain)
20. [Proprietary Elements](#19-proprietary-elements)
21. [Cross-References](#20-cross-references)

---

## 1. Definition

**Identity State Expressions™ (ISEs)** are BariAccess™'s proprietary, non-emotional interface layer that translates validated biometric, behavioral, and rhythm signals into **non-emotional, non-diagnostic** visual and behavioral expressions across the full platform to support adherence, protection, and expectation calibration.

- **What they are:** The **single resolved identity state** for the BariAccess™ OS — a governed state layer with **two authorized roles** (see §3.1): (1) **Lane 1 — Render authority:** ISE directly controls how the platform presents itself (icons, CTA ordering, Ollie cadence, notification routing, visual expression). (2) **Lane 2 — Read-only signal:** ISE publishes its resolved state; downstream systems (e.g. PrivilegeExposure Gate 2, PAC-ISE-007 AI behavioral governance) **consume** ISE state as one input and **own their own** gating/enforcement decisions. ISE is not a "gating engine"; it does not own privilege-to-gate mappings or AI enforcement logic.
- **What they do:** Compress V1+V2+V3+V4 into exactly one of 7 states. That state is delivered in the ISE payload (Lane 1) and published for downstream consumption (Lane 2). Lane 1 governs UI rendering, Ollie/Max presentation, Fortress template selection, BioSnap vs Parking Lot routing, and visual/tonal expression. Lane 2 systems use ISE state as input; they do not delegate access-control or enforcement decisions to ISE.
- **Placement (ABAEMR):** Meta-System Architecture → OS Nodes → Identity Engine → Identity State Expressions (ISEs).

**One-line summary:**  
*Identity State Expressions™ (ISEs) are BariAccess™'s proprietary, non-emotional state authority: ISE owns presentation (Lane 1) and publishes state for downstream systems that own their own gating and enforcement (Lane 2) — without judgment or diagnosis.*

**What ISE is NOT:** Emotions or mood indicators; personality traits or avatar "feelings"; psychological or clinical diagnoses; standalone cosmetic icons; AI personality logic; **a gating or access-control engine** (downstream systems own privilege mappings and enforcement); **the owner of credit eligibility** (S5/Credits Engine owns that). ISE is a **governed state layer** and the **single source of resolved state**; gating decisions belong to the systems that consume ISE.

---

## 2. The 7 States

**Do not redefine.** This is the locked finite set. All ISEs must resolve to exactly one value from this set at render time. No blends.

| State | Dual Name | Enum (reference) | User Experience |
|-------|-----------|-------------------|------------------|
| **ISE-0** | Neutral / Baseline | ISE_0_NEUTRAL_BASELINE | Normal app, full options |
| **ISE-1** | Aligned / Available | ISE_1_ALIGNED_AVAILABLE | App encourages action |
| **ISE-2** | Protective / Recovery-Forward | ISE_2_PROTECTIVE_RECOVERY_FORWARD | App slows down, softer tone |
| **ISE-3** | Contained / Load-Limited | ISE_3_CONTAINED_LOAD_LIMITED | App shows ONE thing only |
| **ISE-4** | Building / Momentum | ISE_4_BUILDING_MOMENTUM | App reinforces rhythm |
| **ISE-5** | Restricted / Guarded | ISE_5_RESTRICTED_GUARDED | App neutral, limited actions; provider exercises 51% |
| **ISE-6** | Exploratory / Low-Signal | ISE_6_EXPLORATORY_LOW_SIGNAL | App learns, asks gently |

---

## 3. Canonical State Authority

**Canonical State Authority Rule:**

> "No AI agent within BariAccess™ may independently infer, interpret, or override the user's readiness, protection level, or capacity outside the resolved ISE state."

- ISE is the **authoritative** resolved state. UI, Ollie, Max, Fortress, and all downstream systems that consume ISE operate **inside** that state. ISE is the single source of truth **for the state value**; it does not own the business logic of systems that use that state (e.g. which privileges to restrict, or how to enforce AI silence).
- AI does not re-evaluate physiology or re-label state; AI accepts ISE as authoritative context and executes within its constraints.
- **Direction of flow:** Scoring (V1–V4 → Clinical Intersection) feeds INTO ISE resolution; ISE then delivers Lane 1 payload and publishes state for Lane 2 consumers. Composite weights (dynamic weighting) and all Lane 1 rendering/behavior are governed by ISE; Lane 2 gating and enforcement are owned by their respective systems. R&R and composites do not override ISE.

---

### 3.1 Two-Lane Authority

To prevent ISE from being read as either "render only" (understating its role) or "gating engine" (violating separation of concerns), the Canon defines two explicit lanes:

| Lane | ISE role | Owner of decision / behavior |
|------|----------|------------------------------|
| **Lane 1 — Render authority** | ISE **owns** this. ISE directly controls how the platform presents itself: identity icon (posture, saturation, motion), CTA controller (mode, maxVisible, orderingBias, restrictedActions), Ollie Space (cadence, promptDensity, voiceStyle, templateKeys), tile rims, BioSnap vs Parking Lot routing, Blink escalation UX. The ISE resolver produces the ISEPayload; the developer implements a deterministic mapping: state in → presentation behavior out. |
| **Lane 2 — Read-only signal** | ISE **publishes** its resolved state. Downstream systems **read** ISE state as one input among others. The **gating/enforcement decision** is owned by the downstream system, not by ISE. Examples: **PrivilegeExposure Gate 2** consumes ISE state and applies its own privilege-to-gate table (which privileges to reduce, by how much) — Gate 2 owns that logic. **PAC-ISE-007** (AI Behavioral Governance) defines what AI may/must not do per state; the AI governance layer owns enforcement and compliance logging. **Credits:** S5/Credits Engine owns credit issuance and eligibility; ISE state may inform tone or pressure, but ISE does not gate credit earning or redemption. |

**Guardrail:** ISE does not own privilege-to-gate mappings (PrivilegeExposure does). ISE does not own AI enforcement decisions (PAC-ISE-007 / AI governance layer does). A transient error in the ISE resolver should affect Lane 1 presentation only; Lane 2 systems have their own guards (e.g. Gate 1 corridor score, Gate 3 enforcement flags) so that access control is not solely dependent on one ISE cycle.

---

## 4. Placement in Architecture

**Data flow:**

```
USER INPUT (Row 4 — Daily Lens)
M+E, S, R+E
        │
        ▼
V1 + V2 + V3 + V4 → CLINICAL INTERSECTION
        │
        ▼
ISE RESOLVER (7 States)  ← PAC-ISE-002 / TS-000 (algorithm; thresholds in vault)
        │
   ┌────┴────────────────────┐
   ▼                         ▼
LANE 1 (ISE owns)          LANE 2 (downstream consumes ISE state)
RENDERING + BEHAVIOR       PrivilegeExposure Gate 2, PAC-ISE-007, etc.
(UI, Icon, CTA, Ollie,     Each owns its own gating/enforcement logic.
 Fortress, BioSnap, Rim)
```

**V-Values (inputs to Clinical Intersection):**

| V-Value | Category | What It Contains |
|---------|----------|------------------|
| **V1** | Biometric | ALL physiological data: HRV, Labs, InBody, wearables, VO₂max |
| **V2** | Behavioral | ALL behavioral data: FAB, Grit, Habits, Mood, Effort |
| **V3** | Contextual | ALL context data: Chronotype, Location, Calendar, Space, SJL |
| **V4** | Interventional | ALL treatment data: GLP-1, ITBs, Supplements, Adherence |

**Principle:** V1 + V2 + V3 + V4 → Clinical Intersection → ISE Resolver → **One ISE state** → Lane 1 payload delivered; Lane 2 systems consume state and apply their own logic.

---

## 5. What ISE Governs

Master table — every system component and how ISE relates to it. **Lane** indicates whether ISE **owns** the behavior (Lane 1) or **publishes state** for a downstream system that owns the decision (Lane 2). Details in sections 6–15.

| Component | Lane | How ISE Relates to It |
|-----------|------|------------------------|
| **Identity Icons (Row 4)** | 1 | Posture, saturation, motion — per PAC-ISE-001, PAC-ISE-005; ISE owns. |
| **Buttons / CTAs** | 1 | Which appear, how many, order — CTA controller per state; ISE owns. |
| **Tile rims (Row 1)** | 1 | Color aligned with Beacon band; Ollie expression matches; ISE owns. |
| **Ollie** | 1 | Tone, frequency, templates allowed, expression — PAC-ISE-003, PAC-ISE-007; ISE owns presentation. AI behavioral *enforcement* (what AI must not do) is Lane 2 — PAC-ISE-007 owns. |
| **Max (AskABA)** | 1 | When Max speaks, clinical governance, zero-temperature responses; ISE owns presentation. Governance enforcement is Lane 2. |
| **Fortress (Phase 1–2)** | 1 | Which pre-written templates fire; template keys per state; ISE owns. |
| **BioSnap / Parking Lot** | 1 | What delivers vs what parks — full 7-state matrix (Section 13); ISE owns routing. |
| **Scoring** | 1 | Dynamic weighting — composite weights shift per ISE state; ISE governs weights; numbers in TS/Beacon. |
| **FABs** | 1 | Which FABs deploy, frequency, complexity — FAB Canon §13; ISE governs; FAB Canon defines mapping. |
| **Programs** | 1 | How Programs respond to ISE state — Program Canon; ISE governs; Program Canon defines logic. |
| **ITBs** | 1 | How ITBs present and escalate per ISE state; ISE governs presentation. ITB eligibility is B1→C4, not ISE-gated. |
| **PrivilegeExposure Gate 2** | 2 | Gate 2 **consumes** ISE state; PrivilegeExposure **owns** privilege-to-gate mapping (reduce/simplify/strip per state). ISE does not define which privileges are restricted. |
| **AI behavioral enforcement** | 2 | PAC-ISE-007 defines rules; AI governance layer **owns** enforcement and compliance. ISE publishes state; PAC-ISE-007 owns "what AI may/must not do." |
| **Credits** | 2 | Credit issuance and eligibility owned by S5/CHQ (Credits Engine). ISE state may influence tone or pressure; ISE does not gate credit earning or redemption. |
| **Barista / Provider** | 2 | When human involvement activates: driven by ISE state patterns and system rules (PAC-ISE-007); escalation logic owned by PAC-ISE-007/BBS specs. |

---

## 6. ISE and UI/UX

ISE controls rendering through three mechanisms (per PAC-ISE-001, PAC-ISE-005) — **Lane 1**.

| Mechanism | What ISE Controls |
|-----------|-------------------|
| **Identity icon tokens** | Posture, saturation, motion, overlay per state |
| **CTA controller** | mode, maxVisible, orderingBias, restrictedActions per state |
| **Ollie Space controller** | cadence, promptDensity, voiceStyle, templateKeys per state |

Each ISE state produces a deterministic payload for these three. The Canon defines that ISE governs them; exact payloads and React/TypeScript contracts live in PAC-ISE-001 (contract) and PAC-ISE-005 (reference implementation).

---

## 7. ISE and Ollie

Ollie is the client-facing AI companion (🦉). Ollie's tone, frequency, templates, expression, speech bubble, and scroll sequence are **governed by ISE** (Lane 1).

| Control | Description |
|---------|-------------|
| **Tone** | Derived from resolved ISE state (e.g., softer in ISE-2, forward in ISE-1). |
| **Frequency** | How often Ollie speaks or prompts — governed by ISE. |
| **Templates** | Ollie uses templates per ISE state (PAC-ISE-003). No freeform generation outside ISE lane in canonical design. |
| **Expression** | Row 1 tile rim color = Row 4 Ollie expression (color/mood). |
| **Speech bubble** | Avatar + speech bubble is standard; headline then Ollie bubble then rest of sequence. |
| **Scroll sequence** | Headline → Ollie bubble → ITB status → tier progression → "Enter Press Card." |

Ollie does not independently infer readiness or capacity; Ollie operates within the ISE state the system resolved. **Developer mindset:** "I am Ollie" — write messages as the character, not as the system. What Ollie *may or must not do* (enforcement) is defined and owned by PAC-ISE-007 (Lane 2).

---

## 8. ISE and Max (AskABA)

Max (AskABA, 🪶) is the clinical, zero-temperature AI. Ollie and Max sit on the same row (Row 4). **51/49 Rule:** Human (51%) over AI (49%). ISE governs what both AIs **present** (Lane 1). Max surfaces knowledge and clinical context; Max does not override ISE or explain why the user is in a given state. In ISE-5, provider exercises 51% directly; Max operates in guidance-only mode per PAC-ISE-007. PAC-ISE-007 owns the enforcement rules (Lane 2).

---

## 9. ISE and Fortress

**Fortress** = Phase 1–2: every Ollie message is pre-written and logic-triggered. The logic that triggers a message is **ISE state + reason code** (PAC-ISE-003 template keys).

- **ISE governance applies identically in Phase 1–2 (Fortress) and Phase 3 (AI).** In Fortress, ISE selects templates. In Phase 3, ISE constrains AI generation. The **governance model does not change** — only the execution model (templates vs generated text).
- Template keys per state (e.g. ISE0_INFO, ISE1_BUILD, ISE2_STABILIZE, ISE3_ONE_STEP, ISE4_KEEP_RHYTHM, ISE5_GUIDANCE_ONLY, ISE6_LEARN_RHYTHM) are defined in PAC-ISE-003. Full PAC text stays in PAC documents.

---

## 10. ISE and Scoring

Identity State Expressions modify **how** composite scores are calculated (weights), not what bands mean. Beacon bands remain constant — e.g. Band 2 is always Med Green (85–94) regardless of ISE. The **weights within composite formulas** shift by ISE state (e.g. ISE-2: recovery-related sub-scores weighted higher; ISE-5: physiological weighted highest; ISE-1: default weights).

- **What ISE changes:** Sub-score weights within composites.  
- **What ISE does not change:** Band thresholds, piecewise mapping function, response protocols.

Exact weight tables per ISE state are **vault-level** (TS-002 through TS-010 / PAC-2). See Beacon Canon v1.1 §16, §22; R&R Canon when built. This Canon states that ISE governs dynamic weighting; numbers live in TS.

---

## 11. ISE and FABs

FAB deployment and behavior are conditioned on ISE state. Per FAB Canon v1.2 §13:

| ISE State | FAB Behavior |
|-----------|--------------|
| **ISE-0 (Neutral)** | Standby FABs monitor quietly |
| **ISE-1 (Aligned)** | FABs encourage action |
| **ISE-2 (Protective)** | Wedge FABs may activate to protect |
| **ISE-3 (Contained)** | FABs simplify — show ONE thing |
| **ISE-4 (Momentum)** | FABs reinforce positive trend |
| **ISE-5 (Restricted)** | Clinical governance over FABs |
| **ISE-6 (Exploratory)** | FABs in learning state |

The Canon defines that ISE governs FAB behavior; FAB Canon and implementation PACs define the detailed mapping.

---

## 12. ISE and Programs

Program behavior (e.g. trigger thresholds, Parking Lot patterns) interacts with ISE. Parking Lot patterns affect ISE state; ISE state drives load and mode (e.g. frequent deferrals → ISE Protective; quick resolution → ISE Aligned). Per Program Canon v1.1, ISE is an input to Program behavior. This Canon states that ISE governs Program response; exact logic stays in Program Canon and TS.

---

## 13. ISE and BioSnap / Parking Lot

Complete 7-state delivery matrix (per Beacon Canon v1.1 §27). **Do not use the incomplete matrix from ISE & Ollie v1.0 (B10); use this table.**

| ISE State | Name | Updates Behavior |
|-----------|------|------------------|
| **ISE-0** | Neutral / Baseline | ✅ ALL DELIVER normally |
| **ISE-1** | Aligned / Available | ✅ ALL DELIVER normally |
| **ISE-2** | Protective / Recovery-Forward | 🅿️ PARK non-essential (Clinical delivers) |
| **ISE-3** | Contained / Load-Limited | 🅿️ PARK non-essential (Clinical delivers) |
| **ISE-4** | Building / Momentum | ✅ ALL DELIVER normally |
| **ISE-5** | Restricted / Guarded | 🅿️ PARK non-essential (Clinical/Medication delivers) |
| **ISE-6** | Exploratory / Low-Signal | ✅ ALL DELIVER (gently) |

**ISE-5 rationale:** Safety first; respect user state; park don't delete; exception for critical behavioral (e.g. self-harm → deliver to Provider immediately). Provider exercises 51% directly.  
**ISE-6 rationale:** Learning mode; user is exploring; gentle tone; everything flows (receptive).

---

## 14. ISE and Barista / Provider

Human escalation is triggered by **state patterns and system rules**, not by AI interpretation. Per PAC-ISE-007: user expresses distress in ISE-5 → flag for clinical review; user requests action blocked by governance → notify care team; pattern 3+ consecutive days in ISE-2 → background flag for coach; ISE-5 active 48+ hours → clinical team notification. AI does not decide when to escalate; the system does based on ISE state duration and patterns. Barista/Provider escalation logic is **owned by** PAC-ISE-007 and BBS-related specs (Lane 2); this Canon states that ISE state drives when human involvement activates.

---

## 15. ISE and Credits

Credit **issuance and eligibility** are owned by S5 (Credits Engine) and CHQ rules — **Lane 2**. ISE does not gate credit earning or redemption. ISE state may **influence** tone or pressure (e.g. no pressure in ISE-5; credits maintained but not withdrawn in certain bands). Exact rules are specified in Beacon Canon and Credits engine docs. This Canon states that ISE may inform credit-related behavior; implementation and gating live in S5/product/TS.

---

## 16. Blink Escalation

If the user ignores Orange/Red state (or high-priority prompt):

| Time | Action |
|------|--------|
| 0 sec | Status displayed |
| 10 sec | Icon blinks |
| 1 min | Icon blinks again |
| After 1 min | Notification: **"Ollie was looking for you"** (or equivalent; respectful, not nagging). |

Ollie is the named presence in the escalation. Per PAC-ISE-005 / frontend PACs for exact UX.

---

## 17. Core Principles

Consolidated from ISE Canon v1.0, ISE & Ollie Canon v1.0, PAC-ISE-007, and 33363Feb20 audit/letter. These are non-negotiable.

| # | Principle | Meaning |
|---|------------|---------|
| 1 | **Derived, never inferred** | UI and AI behavior are derived from the resolved ISE state, not inferred by AI or freeform rules. |
| 2 | **Trained by state, not physiology** | AI is trained on resolved ISE state, not on raw HRV/sleep/labs. |
| 3 | **AI is execution layer** | AI agents are execution layers, not decision-makers; they operate within the lane ISE defines. |
| 4 | **Finite state set** | Exactly 7 states (ISE-0 through ISE-6); no blends at render time. |
| 5 | **Logic-triggered only** | ISEs are always triggered by logic (resolver), never by narrative or AI whim. |
| 6 | **Silence as governed behavior** | In ISE-3 and ISE-5, the most helpful thing AI can do is get out of the way. Silence is not a failure. |
| 7 | **Escalation by state patterns** | Escalation is triggered by state duration/patterns and system rules, not by AI interpretation. |
| 8 | **Prohibited AI capabilities** | AI must not infer readiness/fatigue/stress, reference raw metrics, contradict ISE, override governance, explain WHY the user is in a state, or use emotional/diagnostic language. |
| 9 | **Two-lane authority** | **Lane 1:** ISE owns presentation (icon, CTA, Ollie, Fortress, BioSnap routing, scoring weights, FAB/Program response). **Lane 2:** ISE publishes state; downstream systems (PrivilegeExposure Gate 2, PAC-ISE-007, S5/Credits, Barista/Provider logic) consume ISE as input and **own** their gating and enforcement decisions. ISE is not a gating engine. |

**CPIE/CCIE — canonical definitions (locked February 17, 2026):** CPIE = Continue Patient Involvement and Education (clinical, HIPAA-governed, tagged in ITBs). CCIE = Continue Customer Involvement and Education (wellness, non-clinical, tagged in ITBs). These are the canonical credit-type definitions authoritative across all BariAccess documents. *Note:* PAC-ISE-006 (Visibility & Redaction) uses CPIE/CCIE internally as shorthand for interface layers (Clinical/Provider Interface and Consumer/Wellness Interface respectively); that usage is scoped to PAC-ISE-006 only and does not override the canonical credit-type definitions.

---

## 18. PAC Chain

Full PAC text lives in the BariAccess™ ISE System reference and ISE Canonical Set. This section is reference only.

| PAC | Name | Purpose |
|-----|------|---------|
| **PAC-ISE-001** | Identity State Expressions™ Rendering Layer | Deterministic ISE rendering; finite state set; JSON schema; enum; contract for icon/CTA/Ollie. |
| **PAC-ISE-002** | Trigger Threshold Table (ISE Resolver) | Rules to resolve exactly one ISE from abstracted signals. **Algorithm/vault content → TS-000.** Canon describes WHAT resolver does. |
| **PAC-ISE-003** | Reason Codes Dictionary & Ollie Template Keys | Standardized reason codes and Ollie template keys per ISE state. |
| **PAC-ISE-004** | Cosmos DB Schema: ISE State + Transition Log | Audit-ready storage. Canonical naming: containers `ise-current-state`, `ise-transition-log`; partition key `userId`. |
| **PAC-ISE-005** | Frontend Reference Component | Constellation Icon + CTA + Ollie Controller wiring; reference implementation of PAC-ISE-001. |
| **PAC-ISE-006** | CPIE/CCIE Visibility & Redaction Matrix for ISEs | Governance visibility and redaction: consumer never sees governance blocks; clinical sees full context. |
| **PAC-ISE-007** | AI Behavioral Governance by ISE State | What AI may/must not do per state; silence rules; escalation rules; compliance logging; liability positioning. **Owns enforcement (Lane 2);** reads ISE state. |

---

## 19. Proprietary Elements

Identity State Expressions™ (ISE), the 7-state model, the canonical state authority rule, the two-lane authority (Lane 1 / Lane 2), the principle "trained by state not physiology," and the integration of ISE across UI, AI, Fortress, scoring, FABs, Programs, and escalation are proprietary to BariAccess™ / A→G Foundation. PAC-ISE-002 (Resolver) and weight tables are trade-secret/vault. Use for IP and compliance positioning only; do not duplicate implementation detail here.

---

## 20. Cross-References

| Document | Relationship to This Canon |
|----------|----------------------------|
| **Beacon Canon v1.1** | ISE delivery matrix (§27), dynamic weighting (§16, §22), band/ISE interaction; references this Canon for state definitions. |
| **FAB Canon v1.2** | FAB behavior per ISE (§13); must stay consistent with this Canon. |
| **Program Canon v1.1** | Program behavior and Parking Lot ↔ ISE; must stay consistent with this Canon. |
| **Routine Canon v1.0** | Routine and ISE interaction (if any); align with this Canon. |
| **R&R Canon (when built)** | Dynamic weighting per ISE; must reference this Canon for state set and authority. |
| **Constellation Panel Canon** | Row 1 = R&R, Healthspan, My Blueprint, Inner Circle; Row 4 identity icon and Ollie/Max; ISE governs rendering and behavior. |
| **Source of Truth Canon** | Document registry; ISE Canon v3.0 is the single ISE source of truth. |
| **PrivilegeExposure (Gate 2)** | Gate 2 **consumes** ISE state as one input; **owns** privilege-to-gate mapping (which privileges to reduce/simplify/strip per state). Do not embed privilege logic in ISE resolver. |
| **PAC-DP-001 (Dynamic Profile & Mesh)** | Dynamic Profile is the full identity; ISE is the compressed output. DP feeds Clinical Intersection → ISE Resolver. Aligned with this Canon for state set and flow. |
| **TS-000** | ISE Resolver algorithm and trigger thresholds (vault); implements WHAT this Canon describes. |

---

**END OF ISE CANON v3.0**

**Document:** ISE Canon v3.0  
**Effective:** February 20, 2026  
**Status:** CANONICAL — LOCKED  
**Supersedes:** ISE Canon v2.0  
**NO HALLUCINATIONS**
