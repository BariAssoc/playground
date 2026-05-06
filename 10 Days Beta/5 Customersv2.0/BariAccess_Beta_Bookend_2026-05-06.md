# BariAccess Beta — Simplified Universal Bookend

**Document ID:** BETA-BOOKEND-001
**Version:** v2 (May 6, 2026 — adds Journal Log Integration)
**Author:** Valeriu E Andrei MD, President — BariAccess LLC
**Status:** Beta v2 — universal template (no contextual variants)
**Linked spec:** BariAccess Beta Build Spec — 10-Day Production Sprint (May 6, 2026)
**Cohort:** Val, Zakiy, Nikita, Costin, Victor

---

## Purpose

Defines the simplified Bookend interaction model for the 10-day Wizard of Oz beta launch. Each FAB is bracketed by a warm-up Bookend (fires at scheduled time) and a cool-down Bookend (fires at end of window). Together they capture all 6 required data points (timestamp, mood, frequency, consistency, timing, space) — but only 4 of those are user-input. The other 2 are computed in backend.

Every cool-down completion also writes a log entry to the Journal, so the user can scroll back through their day and see what they did, when, and how they felt (see §Journal Log Integration).

This is the simplified, universal version. The full contextual Bookend system (Protected / Challenging / Vulnerable / Exciting / Routine variants) is parking-lotted for post-NYC.

---

## Design Principle — Minimize User Friction

If we ask 6 fields per warm-up + 6 fields per cool-down on every FAB, with 10 FABs per day, the cohort hits 120 click-interactions per person per day. They burn out by Day 3. The simplified Bookend captures the same data points with **4 user clicks per FAB** (~8 seconds total) by computing the remaining metrics from the timestamp and click data.

| Metric | Captured By |
|---|---|
| **Timestamp** | Auto (system) |
| **Mood** | User tap |
| **Space** | User tap |
| **Completion** | User tap |
| **Frequency** | Backend computed |
| **Consistency** | Backend computed |
| **Timing** | Backend computed |

---

## Warm-Up Bookend

**Trigger:** FAB scheduled time arrives. Timer fires. Ollie nudge appears in chat: *"Time for [FAB name]"*

**User flow:**
1. Notification appears in Ollie's Space
2. Chat indicator (service-button-style dot) lights up
3. User taps chat → card opens

**Card contents — 2 user fields:**

| Field | Type | Options |
|---|---|---|
| Timestamp | Auto | (system captures, no user input) |
| Mood right now | Tap (1 of 5) | 😞 Low / 😐 Meh / 🙂 Okay / 😊 Good / 🔥 Great |
| Space right now | Tap (1 of 3) | 🛡️ Protected / ⚡ Challenging / 💧 Vulnerable |

**User clicks:** 2
**Card closes.** FAB executes (user goes to do the thing).

---

## Cool-Down Bookend

**Trigger:** End of FAB completion window (scheduled_time + window_minutes). Auto-fires whether or not user has acted.

**User flow:**
1. Cool-down nudge appears in Ollie's Space
2. Chat indicator lights up
3. User taps chat → card opens

**Card contents — 2 user fields:**

| Field | Type | Options |
|---|---|---|
| Timestamp | Auto | (system captures, no user input) |
| Did you do it? | Tap (1 of 3) | ✅ Yes / ❌ No / ⏭️ Skip |
| Mood after | Tap (1 of 5) | 😞 Low / 😐 Meh / 🙂 Okay / 😊 Good / 🔥 Great |

**User clicks:** 2
**Card closes.** Routine Bookshelf segment updates color (Green / Orange / Red). Backend writes Journal entry (see next section).

---

## Journal Log Integration (NEW in v2)

Every cool-down completion writes a single log entry to the Journal so the cohort can see their day at a glance — what they did, when, completion status, mood delta. Locked as **Reading B**: card popup remains the primary interaction; Journal is a downstream display.

### What Zakiy Has to Build

1. **Backend write** to `journal_entries` container on every cool-down completion (~5 lines of code at the existing cool-down handler)
2. **Journal WorkPad rendering** — chronological list of today's entries with status icon, FAB name, timestamp, mood delta, color state (the panel exists; this just populates it)

### What Zakiy Does NOT Have to Build

- New cool-down UI (cards stay as-is)
- Journal editing (read-only for the beta)
- Journal export (post-NYC)
- Journal filtering / search (post-NYC)
- Multi-day Journal view (single-day only for the beta)

### Journal Entry Format (Visual)

```
TODAY — Wednesday May 6

🟢 5:32 AM   Light therapy                  ✅   🙂 → 🙂  
🟢 5:48 AM   Hydration (first water)        ✅   🙂 → 😊  
🔴 6:18 AM   GLP-1 check                    ✅   😐 → 🙂   ← critical, completed
🟢 6:44 AM   Morning walk (15 min)          ✅   🙂 → 😊  
🟠 7:32 AM   Protein breakfast              ❌   🙂 → 😞   ← missed
🟢 11:05 AM  Posture / stand-up break       ✅   😊 → 😊  
... (rest of day)
```

### Journal Entry Fields

| Field | Source | Example |
|---|---|---|
| Time | Cool-down timestamp | 7:14 AM |
| FAB Name | From FAB record | GLP-1 / medication check |
| Status icon | From completion | ✅ / ❌ / ⏭️ |
| Mood delta | Mood-after − Mood-before | 🙂 → 😊 (+1) |
| Color state | From Bookshelf logic | 🟢 / 🟠 / 🔴 |
| Critical flag | Inherited from FAB | 🔴 only if critical |

---

## Color State Logic (Cool-Down → Bookshelf + Journal)

| Cool-Down Response | Critical Flag | Resulting Color |
|---|---|---|
| ✅ Yes | Any | 🟢 Green |
| ❌ No | No | 🟠 Orange |
| ❌ No | Yes | 🔴 Red |
| ⏭️ Skip | No | 🟠 Orange (with skip-tag) |
| ⏭️ Skip | Yes | 🔴 Red (with skip-tag) |
| No response (timeout) | No | 🟠 Orange |
| No response (timeout) | Yes | 🔴 Red |

---

## Backend-Computed Metrics

These metrics are derived from the warm-up + cool-down + timestamp data — no user input required.

| Metric | Formula / Method | Window |
|---|---|---|
| **Frequency** | Count of "Yes" responses ÷ scheduled FAB count | Rolling 7 days |
| **Consistency** | Standard deviation of completion timestamps relative to scheduled time | Rolling 10 days |
| **Timing** | Delta between scheduled_time and actual cool-down "Yes" timestamp | Per FAB |
| **Mood delta** | Mood-after − Mood-before (numeric scale 1–5) | Per FAB |

---

## Data Schema (CosmosDB)

### Container 1: `bookend_events`

```json
{
  "event_id": "string (uuid)",
  "user_id": "string",
  "fab_id": "string",
  "fab_name": "string",
  "event_type": "warmup | cooldown",
  "scheduled_time": "ISO 8601 datetime",
  "actual_timestamp": "ISO 8601 datetime",
  "mood": "integer 1-5 (5 = Great)",
  "space": "protected | challenging | vulnerable",
  "completion": "yes | no | skip | timeout",
  "critical_flag": "boolean",
  "color_state": "blue | green | orange | red",
  "synthetic": "boolean (true for backfill data)"
}
```

### Container 2: `journal_entries` (NEW in v2)

Written once per cool-down completion. Read by Journal WorkPad.

```json
{
  "entry_id": "string (uuid)",
  "user_id": "string",
  "fab_id": "string",
  "fab_name": "string",
  "log_time": "ISO 8601 datetime (cool-down timestamp)",
  "completion": "yes | no | skip | timeout",
  "mood_before": "integer 1-5",
  "mood_after": "integer 1-5",
  "mood_delta": "integer (-4 to +4)",
  "color_state": "green | orange | red",
  "critical_flag": "boolean",
  "synthetic": "boolean"
}
```

---

## Total User Friction (per FAB)

| Step | User Action | Time |
|---|---|---|
| Warm-up: tap chat | 1 tap | 1 sec |
| Warm-up: tap mood | 1 tap | 2 sec |
| Warm-up: tap space | 1 tap | 2 sec |
| Cool-down: tap chat | 1 tap | 1 sec |
| Cool-down: tap completion | 1 tap | 2 sec |
| Cool-down: tap mood | 1 tap | 2 sec |
| **Total** | **6 taps** (4 are data-bearing) | **~10 sec** |

**Across 10 FABs per day:** ~60 taps, ~100 seconds of friction. Sustainable for 10 days.

---

## What This Beta Bookend Does NOT Do

These are explicitly cut for the 10-day sprint and parking-lotted for post-NYC:

- Contextual Bookend variants (Protected / Challenging / Vulnerable / Exciting / Routine variants with custom JSON)
- Voice input or voice analysis on Bookends
- Free-text reflection prompts in the Journal
- Adaptive Bookend tuning based on prior responses
- Memory Lane / Memory Snap injection on Bookend completion
- Different cards by FAB type (universal template only)
- Multi-day Journal scrolling (single-day view only)

---

## Open Items

1. Confirm tap-vs-swipe interaction pattern for Zakiy's UI build
2. Confirm whether "Skip" should still record mood/space, or close immediately
3. Confirm timeout behavior — does no-response cool-down still record mood automatically? (Recommend: no — leave fields null and tag as `timeout`.)
4. Confirm whether warm-up Bookend mood should be required or skippable (Recommend: required for data integrity, but allow 1 tap to dismiss with `null` mood if user is too rushed)
5. Confirm Journal entry render order — chronological ascending (top of day at top) or reverse (latest at top)? Recommend: chronological ascending so the day reads like a log.

---

*BariAccess LLC — Confidential — Internal Use Only*
*Copyright © 2026 BariAccess LLC. All rights reserved. BariAccess™, RITHM™, and related marks are trademarks of BariAccess LLC.*
