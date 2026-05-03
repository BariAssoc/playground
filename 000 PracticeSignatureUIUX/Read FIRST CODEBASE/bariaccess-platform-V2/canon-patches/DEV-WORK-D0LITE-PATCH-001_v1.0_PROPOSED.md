# DEV-WORK-D0LITE-PATCH-001 v1.0 PROPOSED
## Practice Edition Phase 1 Implementation Patches
## Locked Tile Render · Voice Signal · Safety Escalation · PROD Lock

```
═══════════════════════════════════════════════════════════════════════════════
BARIACCESS LLC — CANONICAL PATCH
═══════════════════════════════════════════════════════════════════════════════
DOCUMENT ID:    DEV-WORK-D0LITE-PATCH-001
TITLE:          Practice Edition Phase 1 Implementation Patches
                — Locked Tile Render, Voice Signal, Safety Escalation, PROD Lock
                (Closes the four DEV-WORK-D0LITE v0.3 implementation gaps)
TYPE:           Canonical Patch (companion to DEV-WORK-D0LITE-001 v0.3)
VERSION:        v1.0 PROPOSED
STATUS:         🟡 DRAFT — PENDING VAL APPROVAL
DATE:           May 2, 2026
AUTHOR:         Valeriu E. Andrei, MD, FACS, FASMBS — President, BariAccess LLC
SCRIBE:         Claude (Anthropic) — drafting only
TO:             Zakiy Manigo, Lead Developer

PURPOSE:        Close four discrete implementation gaps in DEV-WORK-D0LITE v0.3
                that would block Practice Edition Phase 1 build:
                  §3 — Locked Tile Render Token (PAC-ISE-005 extension)
                  §4 — Fireflies.ai Voice Signal (Signal 7 — additive to Resolver)
                  §5 — Mental Wellbeing Safety Escalation (PAC-ISE-007 hook)
                  §6 — PROD Slot 5 Lock (Daily Pulse contradiction resolution)

DEPENDS ON:     DEV-WORK-D0LITE-001 v0.3 — parent
                PAC-ISE-005 v1.0A — frontend rendering authority (extended in §3)
                PAC-ISE-002 v2.0 — resolver signals (extended in §4)
                PAC-ISE-007 v1.0B — AI behavioral governance (extended in §5)
                CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) — accruing render token
                CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) — HIPAA redaction (Fireflies)

COMPLIANCE:     Document Canon v2 (April 18, 2026)
                BariAccess LLC single-entity IP
                HIPAA Privacy Rule (Fireflies voice transcripts = PHI)
═══════════════════════════════════════════════════════════════════════════════
```

---

## §1. PURPOSE & SCOPE

This patch resolves four discrete operational gaps in DEV-WORK-D0LITE v0.3. Each gap is independent — they share only the parent document and audience (Zakiy).

**Structure:** Four sub-sections, each acting as a mini-patch with its own scope, lock, and acceptance criteria.

**In scope:**
- Locked tile render token spec (extending PAC-ISE-005)
- Fireflies.ai voice signal as new Resolver input (extending PAC-ISE-002)
- Mental Wellbeing safety escalation flow (extending PAC-ISE-007)
- PROD slot 5 explicit lock behavior (resolving DEV-WORK-D0LITE §3 vs §6 contradiction)

**Out of scope:**
- Tile unlock animations (Nikita)
- Fireflies vendor contract / BAA execution (Val + counsel)
- Crisis intervention protocol clinical content (Val + Pamela)
- Daily Pulse rendering details beyond PROD lock (RBDISP canon)

---

## §2. THE FOUR GAPS — SUMMARY

| # | Gap | Patch section | Code blocker? |
|---|---|---|---|
| 1 | Locked tile render — no PAC-ISE-005 token for "Opens at Day X" | §3 | ✅ Yes |
| 2 | Fireflies.ai signal not in Resolver Signal inventory | §4 | ✅ Yes |
| 3 | Mental Wellbeing escalation flow not mapped to PAC-ISE-007 | §5 | ✅ Yes — safety blocker |
| 4 | PROD slot 5: "fixed slot count" vs "removed for PE" contradiction | §6 | ✅ Yes |

---

## §3. LOCKED TILE RENDER TOKEN (LOCKED)

### 3.1 Problem

DEV-WORK-D0LITE v0.3 §5 declares:
> "Tap on locked tile | Small message: 'Opens at Day [X] — [clinical trigger]'"

But PAC-ISE-005 v1.0A render tokens are: `posture · saturation · motion · overlay`. None map to "this tile is time-locked." Zakiy can't render the locked state without a token spec.

### 3.2 Solution — extend PAC-ISE-005 with `tileLock` token

Add new render token to the Identity Icon and Signal Bar tile component:

```typescript
// PAC-ISE-005 extension — tile lock render token
interface TileLockToken {
  state: "unlocked" | "locked";
  
  // Locked state only
  unlock_day?: number;                        // e.g., 7, 30
  unlock_clinical_trigger?: string;           // e.g., "first lab return"
  unlock_progress?: number;                   // 0.0-1.0 (days elapsed / target)
  display_message?: string;                   // pre-rendered for tap interaction
}
```

### 3.3 Visual treatment (LOCKED)

| State | Visual | Tap behavior |
|---|---|---|
| `unlocked` | Standard tile rendering per Beacon band | Standard interaction |
| `locked` | Tile dimmed to 40% opacity + lock icon overlay (small, bottom-right) + thin progress arc on tile border | Tap shows `display_message` in small popup; no other interaction |

**Reuses existing PAC-ISE-005 vocabulary:** `saturation: lightOpacity` is already defined for ISE-6 — same opacity treatment can apply. The lock icon overlay is new (extends the `overlay` token enum: `none | shieldLock | tileLock`).

### 3.4 Practice Edition Phase 1 application

Per DEV-WORK-D0LITE v0.3 §5:

| Tile | Day 1 state | Unlock trigger | Unlock day estimate |
|---|---|---|---|
| **R&R** | `unlocked` | n/a | Day 0 |
| **Healthspan** | `locked` | First lab return | Day 7–10 |
| **My Blueprint** | `locked` | Day 30 trend window opens | Day 30 |
| **Inner Circle** | `unlocked` per OQ-T3 default (carry forward; OQ remains open) | n/a | Day 0 |

**Note:** OQ-T3 (DEV-WORK-D0LITE v0.3 §2) carried forward — Inner Circle Day 0 visibility is your decision; default = unlocked.

### 3.5 Compatibility with G2

Tile-level `tileLock` is **orthogonal** to composite-level `accruing` (G2). A tile can be `unlocked` while several of its underlying composites are `accruing`:

- **R&R tile:** `unlocked` Day 1, but only SRC + CRC composites are `live`; other 6 are `accruing`
- **Healthspan tile:** `locked` Day 1, all underlying composites would be `accruing` regardless of tile state

When tile is locked, the underlying composites are NOT shown — composite render is only relevant on unlocked tiles.

---

## §4. FIRELIES.AI VOICE SIGNAL — SIGNAL 7 (ADDITIVE TO RESOLVER)

### 4.1 Problem

DEV-WORK-D0LITE v0.3 §1 declares:
> "Voice + Tone | Not mentioned | D0 Pamela call → Journal Layer 1 (Fireflies.ai, HIPAA consent flow)"

PAC-ISE-002 v2.0 has 6 Resolver signals. None reference voice/tone data. Fireflies.ai output is captured but not consumed by Resolver — the voice signal is "stranded data."

### 4.2 Solution — declare voice as ADDITIVE Signal 7 (Phase 2+, not Phase 1)

For **Phase 1 launch**, Fireflies.ai output flows to Journal Layer 1 only. **Resolver does NOT consume voice in Phase 1.** This is intentional:

- Phase 1 voice data accrues silently to validate signal-to-noise ratio
- Voice consent flow needs HIPAA review before voice influences clinical state
- Phase 1 ship blocker is Fireflies BAA execution + consent UX (per §4.5), not Resolver integration

For **Phase 2+**, voice is a **proposed Signal 7 (Voice Affect)**:

```typescript
// PROPOSED — not active in Phase 1
interface VoiceAffectSignalInput {
  source: "fireflies_ai_pamela_call" | "fireflies_ai_provider_call";
  call_duration_sec: number;
  
  // Tone analysis (Phase 2+)
  tone_valence: number;          // -1.0 (negative) to +1.0 (positive)
  tone_arousal: number;          // 0.0 (calm) to 1.0 (activated)
  tone_confidence: number;       // 0.0-1.0 (model confidence in classification)
  
  // Speech analysis (Phase 2+)
  patient_speaking_ratio: number;    // 0.0-1.0 (fraction of call where patient spoke)
  speech_pace_relative: number;      // -1.0 (slower than baseline) to +1.0 (faster)
  
  // Compliance metadata (always present)
  consent_recorded_at: string;       // ISO 8601 — must be present
  hipaa_baa_active: boolean;         // must be true to ingest
  redacted_transcript_id: string;    // pointer to Journal Layer 1 row
}
```

### 4.3 Phase 1 storage hook

Even though Resolver doesn't consume voice in Phase 1, the data must be stored properly for Phase 2 enablement:

```typescript
// fireflies-call-records — NEW container, Phase 1 capture only
interface FirefliesCallRecord {
  id: string;                            // GUID
  userId: string;                        // partition key
  call_type: "pamela_d0" | "pamela_checkin" | "provider_visit";
  call_started_at: string;
  call_ended_at: string;
  duration_sec: number;
  
  // HIPAA gates (MUST be present)
  consent_recorded_at: string | null;    // null = call not ingested
  hipaa_baa_active: boolean;             // false = call not ingested
  
  // Storage references
  transcript_journal_row_id: string;     // links to Journal entry per G5 redaction rules
  audio_storage_uri: string | null;      // encrypted blob, optional
  
  // Phase 2 fields (populated when voice analysis enabled)
  voice_analysis_completed_at: string | null;
  voice_signal_input: VoiceAffectSignalInput | null;
  
  // Redaction (per G5 §6.4)
  revoked_at: string | null;
  
  _ts: number;
}
```

**Indexing:** Partition `/userId`. Indexed: `call_type`, `call_started_at`. TTL: per HIPAA retention policy (default 6 years per 45 CFR §164.530(j)(2)).

### 4.4 Resolver integration deferral

Per Phase 1 doctrine: **voice does NOT contribute to ISE state in Phase 1.** Phase 2+ activation requires:

1. Fireflies BAA execution + signed
2. HIPAA voice consent flow validated by counsel (Crenguta Leaua Esq.)
3. Voice analysis model validation against cohort data
4. Threshold calibration per Isaiah/WoZ extension to voice domain

Until all four are met, `VoiceAffectSignalInput` is computed and stored (if §4.5 conditions met) but Resolver ignores it.

### 4.5 Phase 1 ship blocker (HIPAA)

DEV-WORK-D0LITE v0.3 §12 flags voice as Phase 1 blocker. This patch confirms and codifies:

| Blocker | Status | Closes when |
|---|---|---|
| Fireflies BAA executed | 🔴 NOT YET | Counsel + Fireflies sign BAA |
| Voice consent UX shipped | 🔴 NOT YET | Patient app D0 onboarding includes explicit voice consent screen with opt-in (default OFF) |
| HIPAA-compliant audio storage | 🔴 NOT YET | Encrypted blob storage with RBAC + audit log enabled |

**Hard rule:** No Fireflies call ingestion until ALL three blockers close. Pre-blocker calls fall back to manual journal entry by Pamela.

---

## §5. MENTAL WELLBEING SAFETY ESCALATION FLOW (LOCKED)

### 5.1 Problem

DEV-WORK-D0LITE v0.3 §1 declares:
> "Mental Wellbeing safety | Not flagged | Safety escalation flow flagged as PE blocker"

PAC-ISE-007 v1.0B has escalation rules per state pattern (e.g., distress in ISE-5 → flag for clinical review). But there's no specific flow for **acute mental wellbeing crisis** detection — i.e., the patient signals self-harm, suicidal ideation, or acute psychiatric distress.

This is the most safety-critical gap in the six.

### 5.2 Solution — Mental Wellbeing Safety Escalation Hook

Define a dedicated escalation flow that operates **outside** the normal ISE state machine. This flow has higher priority than any ISE state including ISE-5 (Restricted/Guarded).

```typescript
// Mental Wellbeing crisis flow — additive to PAC-ISE-007
interface MentalWellbeingTrigger {
  trigger_id: string;
  userId: string;
  
  // Detection source
  source: "patient_text_self_harm" 
        | "patient_text_suicidal_ideation"
        | "patient_voice_distress" 
        | "ollie_concern_pattern"
        | "explicit_help_request";
  
  detection_at: string;                  // ISO 8601
  detection_confidence: number;          // 0.0-1.0
  
  // Content (REDACTED in CCIE-interface, full in CPIE-interface)
  trigger_content_redacted: string;      // safe summary
  trigger_content_full: string;          // verbatim, CPIE-interface only
  
  // Routing
  immediate_provider_alert: boolean;     // true for high-confidence triggers
  immediate_988_offer: boolean;          // true if explicit ideation/self-harm
  pamela_notified_at: string | null;
  provider_notified_at: string | null;
  
  // Resolution
  resolved_at: string | null;
  resolution_type: "provider_contact" 
                 | "patient_safe_response" 
                 | "988_referred" 
                 | "emergency_services_contacted" 
                 | null;
}
```

### 5.3 Detection rules (LOCKED)

The flow triggers on ANY of:

1. **Patient text matches self-harm/suicidal-ideation pattern** (keyword + context model — implementation per Phase 1 simple keyword list, Phase 2+ NLP model)
2. **Patient explicitly requests help** ("I need help," "I'm in crisis," "I want to talk to someone")
3. **Voice distress detected** (Phase 2+ via Fireflies; not in Phase 1)
4. **Ollie pattern concern** — Ollie's templates include `ISE5_GUIDANCE_ONLY` but Ollie cannot generate this trigger; only AskABA/Max in CPIE-interface analysis can flag
5. **Patient hits 988-related content** (clear opt-in UI to dial 988)

### 5.4 Response flow (LOCKED)

When trigger fires:

```
TRIGGER DETECTED
        │
        ▼
1. Capture event in mental-wellbeing-events container
        │
        ▼
2. ISE state OVERRIDE: force ISE-5 (Restricted/Guarded) regardless of current state
        │
        ▼
3. Ollie cadence forced to: cadence="strictNeutral", voiceStyle="protective"
        │
        ▼
4. Patient sees Ollie utterance: "I'm here. Are you safe right now?"
   (templateKey = ISE5_SAFETY_CHECKIN — NEW template, not in PAC-ISE-003 v1.0A)
        │
        ▼
5. Three response options for patient:
   ┌─────────────────────────────────────┐
   │ "I'm safe"          → de-escalate    │
   │ "I need to talk"    → 988 offer +    │
   │                       provider page  │
   │ "I need help now"   → 988 dialed +   │
   │                       911 offered    │
   └─────────────────────────────────────┘
        │
        ▼
6. Provider notification (always, even if patient chose "I'm safe")
        │
        ▼
7. Pamela notification (always)
        │
        ▼
8. Audit log entry (always)
```

### 5.5 Phase 1 implementation requirements

| Requirement | Phase 1 status |
|---|---|
| Keyword list for text pattern detection | Locked to a basic clinical keyword set (Val + Pamela curate before ship) |
| `ISE5_SAFETY_CHECKIN` template added to PAC-ISE-003 | Added (proposed in this patch) |
| 988 dial integration | Native iOS/Android tel: link |
| 911 offer (not auto-dial) | Show option, patient confirms |
| Provider notification channel | SMS to provider on file (per Bariatric Associates contact list) |
| Pamela notification channel | Slack DM + email |
| Audit log | Special-flag entry in `ise-transition-log` with `severity: critical` |

### 5.6 Hard rules (NEVER violated)

1. **AI never decides not to escalate.** When trigger fires, escalation happens. Period.
2. **AI never gives crisis counseling.** Only safety check-in templates + 988/911 options.
3. **No false reassurance.** AI does not say "you're going to be okay." It says "I'm here. Are you safe right now?"
4. **Patient choosing "I'm safe" does NOT cancel provider notification.** Provider always notified.
5. **No diagnostic language.** AI never references "suicidal ideation," "self-harm," "crisis" — only safety language ("Are you safe?").

### 5.7 Acceptance tests (PHASE 1 SHIP BLOCKERS)

| Test | Criteria |
|---|---|
| MW-T1 | Trigger keyword list locked + reviewed by clinical (Val + Pamela) before ship |
| MW-T2 | Trigger detection latency < 2 seconds from patient input to ISE-5 override |
| MW-T3 | Provider notification fires within 30 seconds of trigger |
| MW-T4 | "I'm safe" response does NOT cancel provider notification |
| MW-T5 | 988 link works on iOS + Android |
| MW-T6 | Audit log entry created with `severity: critical` |
| MW-T7 | Trigger content full is NEVER returned to CCIE-interface (per G5) |
| MW-T8 | If `hipaa_baa_active = false`, trigger content full is NOT stored — only safe summary |

**These tests block Phase 1 ship.** A patient experiencing crisis at the demo would be a catastrophic failure mode.

---

## §6. PROD SLOT 5 LOCK (RESOLVES DEV-WORK-D0LITE §3 vs §6 CONTRADICTION)

### 6.1 Problem

DEV-WORK-D0LITE v0.3 §3 declares:
> "Daily Pulse — 6 tracker slots ❌ NEVER TOUCH (slot count fixed; content configures)"

DEV-WORK-D0LITE v0.3 §6 declares:
> "5. PROD | ❌ Removed for Practice Edition"

These contradict. Per your earlier decision (locked May 2): **slot count stays fixed at 6; PROD slot 5 is locked empty.**

This patch codifies the resolution.

### 6.2 Resolution (LOCKED)

| Aspect | Locked behavior |
|---|---|
| **Slot count** | 6 (NEVER TOUCH preserved) |
| **PROD slot 5 in Practice Edition** | Present in DOM, rendered as `locked-empty` state |
| **Visual** | Faint placeholder + lock icon (similar to §3 tile-locked treatment) |
| **Tap behavior** | Small popup: "Productivity tracking unlocks in a future edition" |
| **Cascade routing** | PROD slot does NOT light up on any cascade (per G3 §5.1 cognitive family rule already locked this) |
| **Storage** | No tracker data computed for PROD in Phase 1 |

### 6.3 Locked-empty token (PAC-ISE-005 extension)

```typescript
// Daily Pulse tracker render token — extends PAC-ISE-005
interface TrackerRenderToken {
  slot_position: 1 | 2 | 3 | 4 | 5 | 6;
  slot_label: "FAB" | "ITB" | "BEACON" | "ROUTINE" | "PROD" | "PARK";
  state: "active" | "locked_empty" | "future_unlock";
  
  // active state
  rim_color?: string;                    // Beacon band color when active
  
  // locked_empty state (Practice Edition PROD)
  locked_message?: string;               // e.g., "Unlocks in future edition"
  
  // future_unlock state (e.g., BEACON if not yet active)
  unlock_trigger?: string;
}
```

### 6.4 Why locked-empty (not removed)

Three reasons preserve doctrine:

1. **Architectural consistency.** Daily Pulse slot count fixed = 6, always.
2. **Future-proofing.** When Productivity vertical comes online (future Edition), PROD slot already exists in DOM and just transitions `locked_empty → active`.
3. **Patient learning.** Mark sees the same 6-slot Daily Pulse layout from Day 1 onward — no UI shift when verticals expand.

### 6.5 Phase 1 application

| Daily Pulse slot | Practice Edition Phase 1 state |
|---|---|
| 1. FAB | `active` — FAB-NUTRITION + FAB-HYDRATION |
| 2. ITB | `active` — Interventional Therapeutic Block |
| 3. BEACON | `active` — secondary spider/radar view |
| 4. ROUTINE | `active` — FAB-ROUTINE meta-FAB |
| 5. **PROD** | **`locked_empty`** — "Unlocks in future edition" |
| 6. PARK | `active` — simple parking for programs |

---

## §7. CROSS-REFERENCES

| Document ID | Relationship |
|---|---|
| DEV-WORK-D0LITE-001 v0.3 | Parent — closes 4 implementation gaps |
| PAC-ISE-005 v1.0A | Extended — `tileLock` token (§3), `TrackerRenderToken` (§6) |
| PAC-ISE-002 v2.0 | Extended — Voice Signal 7 deferred to Phase 2+ (§4) |
| PAC-ISE-007 v1.0B | Extended — Mental Wellbeing escalation hook (§5) |
| PAC-ISE-003 v1.0A | Extended — `ISE5_SAFETY_CHECKIN` template added (§5.5) |
| CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 (G2) | Companion — `accruing` token orthogonal to `tileLock` |
| CCO-UX-CARD-COMM-PATCH-001 v1.0 (G5) | Authority — HIPAA redaction applies to mental wellbeing trigger content |

---

## §8. OPEN QUESTIONS

| # | Question | Phase 1 default | Owner | Code blocker? |
|---|---|---|---|---|
| OQ-D0LITE-PATCH-01 | Inner Circle Day 0 visibility (carries from OQ-T3) | **Default unlocked Day 0** — carry forward | Val | ❌ No — default works |
| OQ-D0LITE-PATCH-02 | Mental wellbeing keyword list — Val + Pamela curate | Phase 1 ship blocker — list locked before ship | Val + Pamela | ✅ HARD SHIP BLOCKER |
| OQ-D0LITE-PATCH-03 | Fireflies BAA execution timeline | Phase 1 ship blocker | Val + Crenguta Leaua Esq. | ✅ HARD SHIP BLOCKER |
| OQ-D0LITE-PATCH-04 | Voice consent UX wording | Phase 1 ship blocker | Val + Nikita + counsel | ✅ HARD SHIP BLOCKER |
| OQ-D0LITE-PATCH-05 | When PROD vertical launches in future Edition, locked_empty → active transition UX | Defer — not Phase 1 | Val + Nikita | ❌ No — Phase 2+ |

---

## §9. CHANGE LOG

| Version | Date | Author | Summary |
|---|---|---|---|
| **v1.0 PROPOSED** | **May 2, 2026** | **Val + Claude (assist)** | **Initial patch. Closes 4 DEV-WORK-D0LITE v0.3 implementation gaps. (1) Locked tile render: new `tileLock` token added to PAC-ISE-005 — 40% opacity + lock overlay + progress arc. (2) Fireflies voice signal: declared as Signal 7 PROPOSED, deferred to Phase 2+. Phase 1 captures voice silently with HIPAA gates (BAA + consent + encrypted storage). (3) Mental Wellbeing Safety Escalation: dedicated flow operating OUTSIDE normal ISE machine, forces ISE-5 override on trigger. New `ISE5_SAFETY_CHECKIN` template proposed for PAC-ISE-003. 8 acceptance tests block Phase 1 ship. (4) PROD slot 5: locked_empty state preserves slot count = 6 + future-proofs Productivity vertical expansion. Three sections (§4.5, §5.7, §8) flag Phase 1 ship blockers explicitly.** |

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF PATCH — DEV-WORK-D0LITE-PATCH-001 v1.0 PROPOSED
STATUS: 🟡 DRAFT — PENDING VAL APPROVAL
PHASE 1 SHIP BLOCKERS: §4.5 (Fireflies BAA + consent UX + encrypted storage),
                       §5.7 (Mental Wellbeing acceptance tests MW-T1 through MW-T8)
AUTHORITY: Valeriu E. Andrei, MD, President — BariAccess LLC
DOCUMENT CANON v2 GOVERNANCE — APRIL 18, 2026
═══════════════════════════════════════════════════════════════════════════════
```

© 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC. Confidential — Internal use only.
