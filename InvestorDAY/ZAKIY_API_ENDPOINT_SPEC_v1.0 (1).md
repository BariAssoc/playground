# BARIACCESS™ — API ENDPOINT SPECIFICATION
## Synthetic Patient Data — Mark 60-Day Arc
## For Zakiy — Developer, Bariatric Associates
## Version 1.0 — March 14, 2026
## Status: INTERNAL — Developer Eyes Only

---

## WHAT THIS API DOES

Serves Mark's 60-day synthetic scoring data to the React Native app. One endpoint returns a single day. One endpoint returns the full arc. One endpoint returns clinical events only.

No authentication required for sandbox phase. Add auth before any real patient data is connected.

---

## TECH STACK

```
Runtime:     Node.js (Azure Functions or Express)
Database:    CosmosDB — patient-daily-scores container
Framework:   Your choice — Express or Azure Functions
Port:        3001 (local dev)
Base URL:    /api/v1
Data:        MARK_60DAY_SYNTHETIC_DATA_v1.0.md
             converted to 60 JSON documents
```

---

## ENDPOINT 1 — GET ONE DAY

```
GET /api/v1/patient/:patientId/day/:dayNumber

Purpose:
Returns the full scoring record for one
patient on one specific day.

Example:
GET /api/v1/patient/SYNTH-MARK-001/day/36

Response 200:
{
  "patientId": "SYNTH-MARK-001",
  "dayNumber": 36,
  "phase": 4,
  "phaseLabel": "Clinical Event",
  "rawBiometrics": {
    "rmssd_ms": 46,
    "source": "OuraRing_Gen3",
    "confidence": "high"
  },
  "vDomains": {
    "V1": { "score": 69, "source": "HRV_Oura", "path": "A" },
    "V2": { "score": 70, "source": "FAB_completion", "path": "B" },
    "V3": { "score": 80, "source": "SpaceState", "path": "B" },
    "V4": { "score": 40, "source": "GLP1_adherence", "path": "B" }
  },
  "scores": {
    "SC": { "value": 74.8, "status": "canonical" },
    "TRS": { "value": 62.0, "multiplier": 0.85,
             "multiplierReason": "v4_below_70",
             "status": "sandbox" }
  },
  "beaconDisplay": {
    "band": 4,
    "bandName": "Light Orange",
    "hexColor": "#F57C00",
    "preSignal": false,
    "clinicalTrigger": false
  },
  "iseState": {
    "state": "ISE_2_PROTECTIVE_RECOVERY_FORWARD",
    "displayName": "Protective"
  },
  "flags": [
    {
      "type": "GLP1_MISSED",
      "severity": "clinical",
      "reason": "GI_side_effect_dose_escalation"
    }
  ]
}

Response 404:
{
  "error": "Day not found",
  "patientId": "SYNTH-MARK-001",
  "dayNumber": 36
}
```

---

## ENDPOINT 2 — GET FULL ARC

```
GET /api/v1/patient/:patientId/arc

Purpose:
Returns all 60 days for one patient.
Used to render the full timeline chart
and load all preset scenarios.

Example:
GET /api/v1/patient/SYNTH-MARK-001/arc

Query params (optional):
  ?phase=4        returns only Phase 4 days
  ?flagged=true   returns only days with flags

Response 200:
{
  "patientId": "SYNTH-MARK-001",
  "totalDays": 60,
  "phases": [
    { "phase": 1, "label": "Stable Green",   "days": [1,15] },
    { "phase": 2, "label": "Gradual Drift",  "days": [16,28] },
    { "phase": 3, "label": "Pre-Signal Zone","days": [29,35] },
    { "phase": 4, "label": "Clinical Event", "days": [36,42] },
    { "phase": 5, "label": "Recovery",       "days": [43,55] },
    { "phase": 6, "label": "Stabilized",     "days": [56,60] }
  ],
  "arc": [
    {
      "dayNumber": 1,
      "SC": 92.1,
      "TRS": 100,
      "band": 2,
      "hexColor": "#2E7D32",
      "iseState": "ISE_4_BUILDING_MOMENTUM",
      "flags": []
    }
    // ... all 60 days
  ],
  "keyEvents": [
    { "day": 21, "event": "PRE_SIGNAL_FIRST", "SC": 83.7 },
    { "day": 36, "event": "GLP1_MISSED",      "SC": 74.8 },
    { "day": 47, "event": "RECOVERY_CONFIRMED","SC": 85.7 }
  ]
}
```

---

## ENDPOINT 3 — GET CLINICAL EVENTS ONLY

```
GET /api/v1/patient/:patientId/events

Purpose:
Returns only the days where clinical
flags fired. Used by the Barista
dashboard to show provider alerts.

Example:
GET /api/v1/patient/SYNTH-MARK-001/events

Response 200:
{
  "patientId": "SYNTH-MARK-001",
  "totalEvents": 5,
  "events": [
    {
      "dayNumber": 21,
      "type": "PRE_SIGNAL",
      "SC": 83.7,
      "band": 3,
      "bandName": "Faint Green",
      "iseState": "ISE_2_PROTECTIVE_RECOVERY_FORWARD"
    },
    {
      "dayNumber": 36,
      "type": "GLP1_MISSED",
      "SC": 74.8,
      "band": 4,
      "bandName": "Light Orange",
      "V4before": 92,
      "V4after": 40,
      "TRSdrop": 20.0
    },
    {
      "dayNumber": 47,
      "type": "RECOVERY_CONFIRMED",
      "SC": 85.7,
      "band": 2,
      "bandName": "Med Green",
      "iseState": "ISE_4_BUILDING_MOMENTUM"
    }
  ]
}
```

---

## ENDPOINT 4 — GET PATIENT PROFILE

```
GET /api/v1/patient/:patientId/profile

Purpose:
Returns the patient baseline profile.
Used by React Native to initialize
the app with correct patient context.

Response 200:
{
  "patientId": "SYNTH-MARK-001",
  "name": "Mark",
  "age": 52,
  "surgery": "RYGB",
  "monthsPostOp": 18,
  "currentBMI": 28,
  "tier": "Core",
  "device": "OuraRing_Gen3",
  "medication": "Tirzepatide",
  "baselines": {
    "rmssd_ms": 55,
    "rmssd_sd": 8,
    "V1": 96,
    "V2": 90,
    "V3": 93,
    "V4": 90
  },
  "dataType": "synthetic",
  "notForProduction": true
}
```

---

## HARD RULES FOR ZAKIY

```
RULE 1: All responses must include
        dataType: "synthetic" field.
        Never omit this on synthetic data.

RULE 2: SC formula weights are LOCKED.
        0.25/V1 + 0.35/V2 + 0.20/V3 + 0.20/V4
        The API serves pre-computed values
        from CosmosDB. Never recompute
        with different weights server-side.

RULE 3: Band thresholds are LOCKED.
        Do not re-map scores to bands
        server-side. Serve what is stored.

RULE 4: TRS is labeled sandbox everywhere.
        status: "sandbox" on every TRS field.
        Never serve TRS as canonical.

RULE 5: No raw biometrics in any endpoint
        that will face a consumer UI.
        rmssd_ms stays in profile endpoint only.

RULE 6: Nothing goes live without
        Val approval. Even sandbox API.
```

---

## HOW TO LOAD THE DATA INTO COSMOSDB

```
Step 1:
Take MARK_60DAY_SYNTHETIC_DATA_v1.0.md
Convert each row in the 60-day table
to one JSON document using the schema
from your developer package.

Step 2:
Use this document ID format:
  id: "SYNTH-MARK-001-DAY-001"
  id: "SYNTH-MARK-001-DAY-036"

Step 3:
Partition key: patientId
Value: "SYNTH-MARK-001"

Step 4:
Load all 60 documents into
patient-daily-scores container.

Step 5:
Test Endpoint 1 with day 36.
Confirm GLP1_MISSED flag returns.
Send result to Val before proceeding.
```

---

## REACT NATIVE CONNECTION

```javascript
const BASE = 'http://localhost:3001/api/v1';

// Get one day
const getDay = async (patientId, day) => {
  const res = await fetch(
    `${BASE}/patient/${patientId}/day/${day}`
  );
  return res.json();
};

// Get full arc for chart
const getArc = async (patientId) => {
  const res = await fetch(
    `${BASE}/patient/${patientId}/arc`
  );
  return res.json();
};

// Get clinical events for Barista
const getEvents = async (patientId) => {
  const res = await fetch(
    `${BASE}/patient/${patientId}/events`
  );
  return res.json();
};

// Get patient profile
const getProfile = async (patientId) => {
  const res = await fetch(
    `${BASE}/patient/${patientId}/profile`
  );
  return res.json();
};
```

---

## SEQUENCE FOR ZAKIY

```
Phase 1 — Validate playground first (already assigned)
Phase 2 — Simulate 60-day data in CosmosDB
Phase 3 — Build these 4 endpoints
Phase 4 — Connect React Native to endpoints
Phase 5 — Test day 36 end to end
Phase 6 — Send results to Val

Nothing moves to Phase 3 until
Phase 1 validation report is
returned to and approved by Val.
```

---

*INTERNAL DOCUMENT — DEVELOPER EYES ONLY*
*Not for external distribution*

*© 2026 BariAccess™ / RITHM LLC*
*All rights reserved. Confidential and proprietary.*
*Unauthorized use or disclosure prohibited.*
