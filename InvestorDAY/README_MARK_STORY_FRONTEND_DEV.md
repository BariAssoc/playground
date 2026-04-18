# README — BARIACCESS MARK STORY
## Frontend Development Guide
## For Zakiy — Developer, Bariatric Associates
## From Val — Founder & CEO, BariAccess™
## Date: March 14, 2026

---

## WHAT YOU ARE BUILDING

A 7-day animated clinical story showing how BariAccess detects and corrects a routine deviation in a bariatric patient named Mark. Three HTML prototypes already exist. You are building the production-quality frontend that replaces them.

---

## SCREEN ARCHITECTURE — NON-NEGOTIABLE

```
TOP 60-70%   = RHYTHM BOARD (dynamic)
               Content changes per day
               Clears completely when
               Beacon takeover fires

BOTTOM 30%   = CONSTELLATION PANEL (static)
               ALWAYS VISIBLE
               Never disappears
               Never moves
               Even during Beacon takeover
```

---

## OLLIE SPACE — ALWAYS ON SCREEN

The Ollie Space panel is part of the Constellation Panel. It is always present. It never disappears. Even when the Rhythm Board clears and Beacon takes over — the Constellation Panel and Ollie Space remain visible and active.

```
OLLIE SPACE CONTAINS:

1. Blue banner — max 40 characters
   Short message only. Never more.

2. Central area — Ollie figure
   Expression changes per day
   See Expression Rules below

3. Bottom left — two avatar icons
   Ollie icon (warm circle)
   Max/AskABA icon (sharp bird)
   Only one lights up at a time
   Never both simultaneously

4. Right side — Bleb (speech bubble)
   Used when message exceeds 40 chars
   Covers the AI playground area
   Matches the Ollie figure expression
   See Bleb Rules below
```

---

## BANNER RULE — 40 CHARACTER MAXIMUM

The blue banner above the Ollie figure holds the short message. Hard limit 40 characters. If the message is longer than 40 characters it goes into the BLEB — not the banner.

---

## BLEB RULES

The bleb is a large speech bubble that expands over the central Ollie space area when a long message fires.

```
WHEN TO USE THE BLEB:
Message longer than 40 characters → use bleb
Short nudge or greeting → use banner only

BLEB BEHAVIOR:
Appears with smooth expand animation
Covers the Ollie figure area
Text displays inside the bleb
Ollie expression visible below or beside bleb
Bleb disappears after message duration
Ollie figure returns to center

BLEB STYLE:
Rounded rectangle with tail pointing
toward the speaking avatar icon
Ollie bleb — warm blue tone
Max/AskABA bleb — neutral grey tone
```

---

## OLLIE EXPRESSION RULES

Ollie figure changes expression to match the clinical moment. These are the abstract Ollie form states matching the ISE canonical states.

```
Day 1 — ROUTINE NOTICE
Expression: Curious / alert posture
Color: Neutral warm white
The Ollie form tilts slightly
The EVENING segment on the routine bar
turns ORANGE simultaneously
Both fire together — visual connection
between Ollie noticing and routine bar

Day 2 — FIRST SIGNALS
Expression: Concerned / softened posture
Color: Warm amber glow
ISE-2 Protective mode beginning

Day 3 — MAX SPEAKS (AskABA)
Expression: Neutral / clinical posture
Color: Cool grey
Max avatar icon lights up
Ollie icon dims
Bleb is grey tone (Max speaking)

Day 3 INTERVENTION — OLLIE RETURNS
Expression: Steady / directive posture
Color: Warm blue
Ollie avatar icon lights up
Max icon dims

Day 4 — RECOVERY MORNING
Expression: Bright / upward posture
Color: Soft green glow
ISE-4 Momentum beginning

Day 5 — STABILIZING
Expression: Calm / settled posture
Color: Gentle green
Continuing ISE-4

Day 7 — RESTORED
Expression: Full / radiating posture
Color: Strong green
MemorySnap fires simultaneously
```

---

## DAY BY DAY CONTENT SPECIFICATION

---

### DAY 1 — ROUTINE CHANGE

```
TIME: 19:15

RHYTHM BOARD:
  HRV tile: 58ms, delta -2ms (amber)
  Routine bar: EVENING segment turns ORANGE
  Memory Snap: visible (personal photos)
  Gym indicator: Gym at 7PM — unusual time

CONSTELLATION PANEL:
  R&R score: 88 (no flag yet)
  Ollie avatar: LIT
  Max avatar: dim

BANNER (40 chars max):
  "Mark, gym moved to 7PM. Intentional?"

BLEB (Ollie speaking, warm blue):
  "Hydrate well and sleep early.
   Get in bed by 9:15 PM."

OLLIE EXPRESSION:
  Curious / alert posture
  Routine bar EVENING orange fires
  simultaneously with Ollie notice
```

---

### DAY 2 — FIRST SIGNALS

```
TIME: 07:30

RHYTHM BOARD:
  HRV tile: 49ms, delta -9ms (red)
  Biometric panel appears:
    HRV 42ms down
    Sleep score 76 down
    Temperature 99.2F up
    Resting HR 74 bpm up
  Routine bar: EVENING still orange

CONSTELLATION PANEL:
  R&R score: 81 (orange border flag)
  Ollie avatar: LIT first

BANNER (40 chars max):
  "Mark, Max has an update for you."

BLEB SEQUENCE — TWO BLEBS:

  Bleb 1 (Ollie speaking, warm blue):
    "Mark, Max wants to give you
     an update from Doctor Andrei."

  [Ollie icon dims. Max icon lights up.]

  Bleb 2 (Max speaking, grey tone):
    "Hi Mark — your HRV dropped -9ms.
     Sleep dropped 6 points.
     Go to bed at 9:20PM tonight."
```

---

### DAY 3 — SYSTEM ALERT

```
TIME: 08:00

RHYTHM BOARD:
  CLEARS COMPLETELY
  Beacon takeover activates
  ISE funnel animation plays:
    Score ball (79) drops through funnel
    Lands on Band 3 — Faint Green
    Pre-signal fires
  Routine bar: EVENING turns RED

CONSTELLATION PANEL:
  All 4 score tiles fade to 30% opacity
  Max avatar: LIT
  Ollie avatar: dim

BANNER (40 chars max):
  "AskABA has a clinical update."

BLEB (Max/AskABA speaking, grey tone):
  "Your insulin resistance & glucose
   fluctuated. Sleep + stress are
   affecting protein synthesis
   overnight."

[Max dims. Ollie lights up. New bleb.]

BANNER (40 chars max):
  "Here is your plan for tonight."

BLEB (Ollie speaking, warm blue):
  "Hydrate now. Protein tonight.
   Exercise before 3PM only.
   Bed at 9:20PM — your
   optimal window."

FAB WEDGES appear below Ollie panel:
  Hydration
  Protein
  Sleep 9:20PM
  Exercise before 3PM
```

---

### DAY 4 — RECOVERY BEGINS

```
TIME: 07:15

RHYTHM BOARD:
  Beacon clears. Content returns.
  Biometric panel — all GREEN:
    HRV 50ms up
    Sleep score 81 up
    Temperature 98.4F normal
    Resting HR 68 bpm normal
  Score tiles return to full opacity

CONSTELLATION PANEL:
  R&R score: 82 (no flag)
  Ollie avatar: LIT
  Max avatar: dim

BANNER (40 chars max):
  "Good morning Mark! Great job."

BLEB (Ollie speaking, soft green):
  "HRV +8ms. Temperature normalized.
   Resting HR improved.
   Great job last night."

OLLIE EXPRESSION:
  Bright / upward posture
  Soft green glow
```

---

### DAY 5 — STABILIZING

```
TIME: 14:30

RHYTHM BOARD:
  Normal content all visible
  Routine bar: MORNING + MIDDAY active

CONSTELLATION PANEL:
  R&R score: 86
  Ollie avatar: LIT

BANNER (40 chars max):
  "Your readiness improved today."

BLEB (Ollie speaking, gentle green):
  "Do light activity today —
   walk or stretch.
   Exercise after 3PM if needed."

OLLIE EXPRESSION:
  Calm / settled posture
  Gentle green
```

---

### DAY 6 — HOLDING STEADY

```
TIME: 18:00

RHYTHM BOARD:
  Normal content
  All segments active on routine bar

CONSTELLATION PANEL:
  R&R score: 88
  Ollie avatar: LIT

BANNER (40 chars max):
  "Another strong day, Mark."

BLEB (Ollie speaking, medium green):
  "Protein and hydration on track.
   Keep your bedtime at 9:20PM.
   You are building the habit."

OLLIE EXPRESSION:
  Steady / confident posture
  Medium green
```

---

### DAY 7 — FULLY RESTORED

```
TIME: 08:00

RHYTHM BOARD:
  MemorySnap FIRES — camera flash effect
  New memory card appears:
    "Pattern memorized"
  All segments active on routine bar
  HRV chart fully recovered

CONSTELLATION PANEL:
  R&R score: 90 (strong green)
  Ollie avatar: LIT

BANNER (40 chars max):
  "Mark — fully restored."

BLEB (Ollie speaking, strong green):
  "Your memory now holds this pattern.
   Your FABs protected you."

OLLIE EXPRESSION:
  Full / radiating posture
  Strong green glow
  MemorySnap and Ollie fire together
```

---

## TIMING SPECIFICATION

```
Each day:        9 seconds auto-advance
Progress bar:    visible at top of screen
Day dots:        7 dots — current highlighted
Bleb duration:   4-5 seconds per bleb
Two-bleb days:   first bleb 4s
                 pause 1s
                 second bleb 4s
Beacon takeover: stays full duration
                 of Day 3 and Day 3B
```

---

## PAUSE / DEMO MODE

```
Header button: Pause Demo
When tapped:
  Story freezes
  Slider panel appears (V1 V2 V3 V4)
  Audience moves V4 slider down
  Beacon fires in real time
  Ball drops to correct band
  Ollie banner responds to score

When Resume tapped:
  Sliders hide
  Story resumes from current day
```

---

## HARD RULES — NEVER VIOLATE

```
RULE 1: Ollie Space is ALWAYS visible.
        Never hide it. Never remove it.
        Even during Beacon takeover.

RULE 2: Banner maximum 40 characters.
        Overflow goes to bleb only.

RULE 3: Only one avatar speaks at a time.
        Ollie lit = Max dim.
        Max lit = Ollie dim.
        Never both lit simultaneously.

RULE 4: Routine bar EVENING segment
        and Ollie expression fire together
        on Day 1. They are connected.

RULE 5: Beacon takeover clears only
        the Rhythm Board.
        Constellation Panel stays.

RULE 6: SC formula weights are LOCKED.
        0.25/V1 + 0.35/V2 + 0.20/V3
        + 0.20/V4. Never change.

RULE 7: Nothing goes live without
        Val approval first.
```

---

## REFERENCE FILES

```
bariaccess_mark_story_v1.html
  Prototype v1 — timer, no sliders

bariaccess_mark_story_v2.html
  Prototype v2 — funnel ball drop animation

bariaccess_mark_story_v3.html
  Prototype v3 — live sliders for demo

ZAKIY_FULL_DEVELOPER_PACKAGE_v1.0.md
  Clinical context and CosmosDB schema

MARK_60DAY_SYNTHETIC_DATA_v1.0.md
  60-day scoring data table

ZAKIY_API_ENDPOINT_SPEC_v1.0.md
  4 API endpoints to build
```

---

*© 2026 BariAccess™ / RITHM LLC*
*All rights reserved. Confidential and proprietary.*
*Unauthorized use or disclosure prohibited.*
