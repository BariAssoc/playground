PAC-ISE-001 — Identity State Expressions™ Rendering Layer

Version: v1.0A
Status: Canonical / Active
Domain: BariAccess™ OS → Identity Engine → Rendering Layer
Primary Consumers: Frontend (Constellation), Ollie Space controller, API layer, QA/Audit
Hard Rules (Non-Negotiable):

Exactly one ISE at render time (no blended states)

UI + Ollie behavior is derived from state (no narrative, no AI improvisation)

No emotion claims, diagnosis, moral framing, or shaming

Governance gating overrides (ISE-5 may be forced by CPIE/Clinical flags)

1) Purpose

Implement Identity State Expressions™ (ISEs) as a deterministic interface layer that visually reflects computed identity readiness/protection states to support:

protection,

rhythm alignment,

adherence,
without judgment or diagnosis.

2) Scope

This PAC defines:

the finite ISE state set (enum)

the render contract for:

Identity icon

Button/CTA availability + ordering

Ollie Space cadence/prompt density (template-keyed)

the wire contract (JSON payload)

the mapping table (state → render defaults)

test requirements

Out of scope:

exact formula thresholds (handled in Trigger Table PAC later)

raw biometric exposure (disallowed at this layer)

3) Finite ISE State Set (Canonical)

ISE_0_NEUTRAL_BASELINE

ISE_1_ALIGNED_AVAILABLE

ISE_2_PROTECTIVE_RECOVERY_FORWARD

ISE_3_CONTAINED_LOAD_LIMITED

ISE_4_BUILDING_MOMENTUM

ISE_5_RESTRICTED_GUARDED (Governance State)

ISE_6_EXPLORATORY_LOW_SIGNAL (Optional but supported)

4) Deterministic Behavior Map (Canonical)

At render-time, the OS provides ISEPayload.state, and the client applies the mapping below.

4.1 Identity Icon (Render Tokens)

posture: neutral | upright | softened | contained

saturation: standard | bright | muted | lightOpacity

motion: none | subtleIdle | steadyIdle | minimal

overlay: none | shieldLock (only for ISE-5)

4.2 Button/CTA Policy

mode: default | build | recovery | compress | restricted | onboarding

maxVisible: 1–8

orderingBias: none | performanceFirst | recoveryFirst | continuityFirst | oneNextStep | approvedOnly

restrictedActions: actionId list (required for restricted mode)

4.3 Ollie Space Policy (Template-Keyed)

No freeform. Ollie behavior must be selected by:

cadence: neutral | forward | slow | minimal | strictNeutral | explanatory

promptDensity: normal | increased | reduced | minimal

voiceStyle: informational | encouragingNeutral | protective | containment | continuity | governanceNeutral | onboardingGuide

templateKeys: pre-approved template IDs (prevents drift)

5) State → Defaults (Canonical Lookup Table)

Use this table as the single source of truth for UI behavior.

export enum ISEState {
  ISE_0_NEUTRAL_BASELINE = "ISE_0_NEUTRAL_BASELINE",
  ISE_1_ALIGNED_AVAILABLE = "ISE_1_ALIGNED_AVAILABLE",
  ISE_2_PROTECTIVE_RECOVERY_FORWARD = "ISE_2_PROTECTIVE_RECOVERY_FORWARD",
  ISE_3_CONTAINED_LOAD_LIMITED = "ISE_3_CONTAINED_LOAD_LIMITED",
  ISE_4_BUILDING_MOMENTUM = "ISE_4_BUILDING_MOMENTUM",
  ISE_5_RESTRICTED_GUARDED = "ISE_5_RESTRICTED_GUARDED",
  ISE_6_EXPLORATORY_LOW_SIGNAL = "ISE_6_EXPLORATORY_LOW_SIGNAL"
}

export const ISE_DEFAULTS: Record<ISEState, any> = {
  [ISEState.ISE_0_NEUTRAL_BASELINE]: {
    render: { identityIcon: { posture: "neutral", saturation: "standard", motion: "none", overlay: "none" } },
    cta: { mode: "default", maxVisible: 8, orderingBias: "none", restrictedActions: [] },
    ollie: { cadence: "neutral", promptDensity: "normal", voiceStyle: "informational", templateKeys: ["ISE0_INFO"] }
  },
  [ISEState.ISE_1_ALIGNED_AVAILABLE]: {
    render: { identityIcon: { posture: "upright", saturation: "bright", motion: "subtleIdle", overlay: "none" } },
    cta: { mode: "build", maxVisible: 8, orderingBias: "performanceFirst", restrictedActions: [] },
    ollie: { cadence: "forward", promptDensity: "increased", voiceStyle: "encouragingNeutral", templateKeys: ["ISE1_BUILD"] }
  },
  [ISEState.ISE_2_PROTECTIVE_RECOVERY_FORWARD]: {
    render: { identityIcon: { posture: "softened", saturation: "muted", motion: "minimal", overlay: "none" } },
    cta: { mode: "recovery", maxVisible: 4, orderingBias: "recoveryFirst", restrictedActions: [] },
    ollie: { cadence: "slow", promptDensity: "reduced", voiceStyle: "protective", templateKeys: ["ISE2_STABILIZE"] }
  },
  [ISEState.ISE_3_CONTAINED_LOAD_LIMITED]: {
    render: { identityIcon: { posture: "contained", saturation: "standard", motion: "minimal", overlay: "none" } },
    cta: { mode: "compress", maxVisible: 2, orderingBias: "oneNextStep", restrictedActions: [] },
    ollie: { cadence: "minimal", promptDensity: "minimal", voiceStyle: "containment", templateKeys: ["ISE3_ONE_STEP"] }
  },
  [ISEState.ISE_4_BUILDING_MOMENTUM]: {
    render: { identityIcon: { posture: "upright", saturation: "standard", motion: "steadyIdle", overlay: "none" } },
    cta: { mode: "build", maxVisible: 6, orderingBias: "continuityFirst", restrictedActions: [] },
    ollie: { cadence: "neutral", promptDensity: "normal", voiceStyle: "continuity", templateKeys: ["ISE4_KEEP_RHYTHM"] }
  },
  [ISEState.ISE_5_RESTRICTED_GUARDED]: {
    render: { identityIcon: { posture: "neutral", saturation: "standard", motion: "none", overlay: "shieldLock" } },
    cta: { mode: "restricted", maxVisible: 3, orderingBias: "approvedOnly", restrictedActions: ["REQUIRES_ALLOWLIST"] },
    ollie: { cadence: "strictNeutral", promptDensity: "minimal", voiceStyle: "governanceNeutral", templateKeys: ["ISE5_GUIDANCE_ONLY"] }
  },
  [ISEState.ISE_6_EXPLORATORY_LOW_SIGNAL]: {
    render: { identityIcon: { posture: "neutral", saturation: "lightOpacity", motion: "none", overlay: "none" } },
    cta: { mode: "onboarding", maxVisible: 3, orderingBias: "none", restrictedActions: [] },
    ollie: { cadence: "explanatory", promptDensity: "normal", voiceStyle: "onboardingGuide", templateKeys: ["ISE6_LEARN_RHYTHM"] }
  }
};


Note (Governance): For ISE-5, restrictedActions must resolve to an explicit allow-list or deny-list in implementation. The placeholder "REQUIRES_ALLOWLIST" prevents accidental “open access.”

6) JSON Schema — ISEPayload (v1.0A)

This schema is the API contract for resolver output.

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://bariaccess.dev/schemas/ise-payload.v1.0A.schema.json",
  "title": "ISEPayload",
  "type": "object",
  "required": ["version", "generatedAt", "state", "render", "cta", "ollie"],
  "additionalProperties": false,
  "properties": {
    "version": { "type": "string", "const": "v1.0A" },
    "generatedAt": { "type": "string", "format": "date-time" },
    "state": {
      "type": "string",
      "enum": [
        "ISE_0_NEUTRAL_BASELINE",
        "ISE_1_ALIGNED_AVAILABLE",
        "ISE_2_PROTECTIVE_RECOVERY_FORWARD",
        "ISE_3_CONTAINED_LOAD_LIMITED",
        "ISE_4_BUILDING_MOMENTUM",
        "ISE_5_RESTRICTED_GUARDED",
        "ISE_6_EXPLORATORY_LOW_SIGNAL"
      ]
    },
    "reasonCodes": {
      "type": "array",
      "description": "Abstracted, non-diagnostic explanation tokens for audit and tuning.",
      "items": { "type": "string" },
      "maxItems": 10
    },
    "contributors": {
      "type": "array",
      "description": "Abstracted signal contributors; no raw biometrics.",
      "items": {
        "type": "object",
        "required": ["domain", "direction"],
        "additionalProperties": false,
        "properties": {
          "domain": {
            "type": "string",
            "enum": ["biometric", "sleep", "rhythm", "behavior", "cognitive", "governance"]
          },
          "direction": {
            "type": "string",
            "enum": ["up", "down", "stable", "insufficient", "flagged"]
          },
          "note": { "type": "string", "maxLength": 160 }
        }
      },
      "maxItems": 10
    },
    "render": {
      "type": "object",
      "required": ["identityIcon"],
      "additionalProperties": false,
      "properties": {
        "identityIcon": {
          "type": "object",
          "required": ["posture", "saturation", "motion", "overlay"],
          "additionalProperties": false,
          "properties": {
            "posture": { "type": "string", "enum": ["neutral", "upright", "softened", "contained"] },
            "saturation": { "type": "string", "enum": ["standard", "bright", "muted", "lightOpacity"] },
            "motion": { "type": "string", "enum": ["none", "subtleIdle", "steadyIdle", "minimal"] },
            "overlay": { "type": "string", "enum": ["none", "shieldLock"] }
          }
        }
      }
    },
    "cta": {
      "type": "object",
      "required": ["mode", "maxVisible", "orderingBias", "restrictedActions"],
      "additionalProperties": false,
      "properties": {
        "mode": { "type": "string", "enum": ["default", "build", "recovery", "compress", "restricted", "onboarding"] },
        "maxVisible": { "type": "integer", "minimum": 1, "maximum": 8 },
        "orderingBias": {
          "type": "string",
          "enum": ["none", "performanceFirst", "recoveryFirst", "continuityFirst", "oneNextStep", "approvedOnly"]
        },
        "restrictedActions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "ollie": {
      "type": "object",
      "required": ["cadence", "promptDensity", "voiceStyle", "templateKeys"],
      "additionalProperties": false,
      "properties": {
        "cadence": { "type": "string", "enum": ["neutral", "forward", "slow", "minimal", "strictNeutral", "explanatory"] },
        "promptDensity": { "type": "string", "enum": ["normal", "increased", "reduced", "minimal"] },
        "voiceStyle": {
          "type": "string",
          "enum": ["informational", "encouragingNeutral", "protective", "containment", "continuity", "governanceNeutral", "onboardingGuide"]
        },
        "templateKeys": {
          "type": "array",
          "description": "Pre-approved template IDs only (prevents improvisation drift).",
          "items": { "type": "string" },
          "minItems": 1,
          "maxItems": 6
        }
      }
    },
    "governance": {
      "type": "object",
      "description": "Optional governance block used primarily when state is ISE_5_RESTRICTED_GUARDED.",
      "additionalProperties": false,
      "properties": {
        "isClinicalRouted": { "type": "boolean" },
        "visibility": { "type": "string", "enum": ["ccie", "cpie", "dual"] },
        "redactionLevel": { "type": "string", "enum": ["none", "light", "strict"] }
      }
    }
  }
}

7) Example Payload (ISE-2)
{
  "version": "v1.0A",
  "generatedAt": "2026-01-15T20:12:33Z",
  "state": "ISE_2_PROTECTIVE_RECOVERY_FORWARD",
  "reasonCodes": ["RECOVERY_DEBT_TREND", "RHYTHM_MISALIGNMENT"],
  "contributors": [
    { "domain": "biometric", "direction": "down", "note": "Readiness below baseline" },
    { "domain": "sleep", "direction": "down", "note": "Timing/duration disruption" },
    { "domain": "rhythm", "direction": "flagged", "note": "Misalignment detected" }
  ],
  "render": { "identityIcon": { "posture": "softened", "saturation": "muted", "motion": "minimal", "overlay": "none" } },
  "cta": { "mode": "recovery", "maxVisible": 4, "orderingBias": "recoveryFirst", "restrictedActions": [] },
  "ollie": { "cadence": "slow", "promptDensity": "reduced", "voiceStyle": "protective", "templateKeys": ["ISE2_STABILIZE"] }
}

8) Acceptance Tests (Minimum)

Resolver

Always returns exactly one state

Enum validation enforced

ISE-5 overrides when governance flags active

No raw biometrics in payload

UI

Icon tokens match mapping

CTA compression honored (maxVisible)

Restricted mode disables actions deterministically

Ollie

Uses templateKeys only

Cadence/promptDensity strictly applied

9) ABAEMR Save Path (recommended)
ABAEMR STRUCTURE
→ Technical Systems & Development
→ Developer Standards & Templates
→ PACs
→ PAC-ISE-001 Identity State Expressions Rendering Layer v1.0A