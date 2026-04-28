# T-01 — Production Plan + Blind Protocol + White-Label Tenants

**Source:** Internal dev session, Val + Zakiy
**Topics covered:** Belgrade trip prep, limited app exposure strategy, Wizard of Oz blind protocol, PROFEX white label, production timeline May 2 → May 20
**Status:** Ready for Zakiy review
**Purpose:** Side-by-side compare surface — Val's understanding vs Zakiy's understanding of the same transcript

---

## What this transcript contains

- Plan to ship to production *before* the Belgrade trip, using the same app codebase for both the internal team and the blind-protocol participants — exposure controlled per user, not per build.
- Constellation Panel sealed/non-functional for blind users; Q visible to everybody; Three Dots functional but limited; Routine Bookshelf is the only expressive surface blind users see.
- Parking Lot **not** used in first production. Daily Pulse **not** used in first production (may be unlocked later behind the scenes for the team).
- Cards are the navigational explainer — *"the cards say more than 1,000 words."*
- Three-tenant architecture: **BariAccess** (engine) → **Bariatric Associates** (white label, first TestFlight provider) → **PROFEX** (white label, second TestFlight provider).
- Tenant code mechanism already implemented in production: user enters white-label code in settings/Three Dots → switches to that tenant. Database-side tenant assignment also implemented (confirmed by Zakiy).
- Nikita owns the look/branding for Bariatric Associates and PROFEX.
- Microphone currently mocked on BariAccess app; Zakiy confirms it can be made functional.
- Multi-language target: Serbian, Romanian, English — record in original language, translate downstream if needed.
- AI Playground accessible to blind users via a card so they can free-text or voice-input; Ollie + AskABA both surface there with their canonical colors.
- Journal pattern is the collection mechanism (hydration, GLP-1, protein, sleep, mood, space).
- Each user has their own Routine Bookshelf — not shared.
- FABs are a fixed set; extras come in via free text/voice; AI scrubs the transcript and stages content into the Journal/Routine.
- Pamela may run a paper-based session in Belgrade with 3–4 people; web app access desirable but optional.
- Devices to be provided to blind participants.
- Phase 1 (through June) = blind, longitudinal data collection. Phase 2 (post-June) = unlock more surface for them.
- Communication during Zakiy's vacation = text only, no pressure; Zakiy may send 1–2 follow-ups when ready.

---

## Decisions stated

- One app codebase, exposure controlled per user/tenant.
- Constellation Panel **sealed** for blind users.
- Q **visible** to everybody.
- Three Dots **limited functional** for blind users.
- **No** Parking Lot in first production.
- **No** Daily Pulse in first production.
- White-label switching via code in settings (already implemented).
- Three tenants live: BariAccess, Bariatric Associates, PROFEX.
- Bariatric Associates = first TestFlight provider; PROFEX = second.
- Jennifer, Grace, Madeline enrolled in **PROFEX** before Belgrade.
- Microphone to be made functional for production.
- Educational ITBs to be built within "next week."

---

## Timeline references

| Date | Milestone |
|------|-----------|
| **May 2** | Val + Zakiy Figma session + screenshots |
| **May 2 → May 15** | Enroll 5 team members on Bariatric Associates app |
| **May 15** | App upgraded; PROFEX + Bariatric Associates white labels live |
| **May 20** | Flight to Belgrade |
| **May 21** | Measurements / SPORTICO sync in Belgrade |
| **June** | Data collection wraps; Phase 2 planning |
| **September** | Chicago / PROFEX / HO3.0 unveiling |

Zakiy's window referenced as "1.5 to 2 weeks."

---

## Blind protocol participants

| Name | Group | Region |
|------|-------|--------|
| Jennifer | US team — blind | American |
| Grace | US team — blind | American |
| Madeline | US team — blind | American |
| Dušan | Belgrade — blind | Serbian / Europe |
| Duško Ilić | PROFEX — blind | Serbian / Belgrade |
| Costin | PROFEX associate | Romanian |

Plus ~10 PROFEX locals (names not yet locked) → target cohort ~15–20 blind participants.

---

## Dependencies / Blockers

- Educational ITBs (content) — must be ready inside the next week.
- Microphone functionality — currently mocked, needs production wiring.
- Voice recognition in Serbian / Romanian / English.
- AI scrubbing pipeline (free voice/text → AI breakdown → Journal staging).
- Figma + screenshots needed by May 2.
- Devices procured for blind participants.
- Coordination with PROFEX's 3 IT people (API / website) re: data export capabilities.
- Pamela's web app access for in-person Belgrade session.

---

## Open Questions & Decision Requests

### 1. Constellation Panel sealing mechanism — DECISION NEEDED

> **(A) Hidden entirely** from blind users — landing screen becomes Routine Bookshelf
> **(B) Visible but all interactions disabled**
>
> Transcript supports (A) more strongly based on later phrasing ("never see it," "totally sealed"), but Val's opening framing was (B). Zakiy to confirm which is being built.

**Downstream implications either way:**
- If (A): need a new landing route for blind tenant users, and the app's tenant-code mechanism (already in production per Zakiy) needs to drive routing, not just branding.
- If (B): need a "blind mode" feature flag at the user/tenant level that gates all Constellation Panel interactions; Q must remain functional since *"Q is disclosed to everybody."*
- Either way: Three Dots must remain partially functional, so whatever mechanism is used cannot be a blanket "disable everything except Routine Bookshelf."

---

### 2. Dual AI in AI Playground — OPEN

Working assumption from transcript: **both Ollie and AskABA are implemented** in AI Playground with their canonical colors, but blind users are not taught the distinction — they experience it as a unified surface. Zakiy confirmed "both" when Val asked.

Possible collapse: if blind users have no provider-facing surface in Phase 1, AskABA may simply never get invoked for them — even if implemented in the codebase. Frame: *"Confirm AskABA is implemented behind the scenes but not user-reachable in the blind flow — all blind voice/text routes to Ollie."*

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes.**

---

### 3. AI scrubbing pipeline scope for Phase 1 — OPEN

Working read from transcript: **Phase 1 is Wizard of Oz / manual.** Free voice + text gets captured and stored; Val + team run transcripts through external AI between collection and June review; staging into Journal/Routine is human-in-the-loop. **Phase 2 (post-June)** is when the automated pipeline gets built.

If confirmed, the Phase 1 build requirement collapses to:
1. Reliable voice + text capture
2. Clean storage tied to user/tenant
3. Export path so Val can pull transcripts out for offline AI processing

Storage architecture: transcripts need to be tenant-scoped (Bariatric Associates vs PROFEX) and language-tagged (Serbian / Romanian / English) so Val knows what needs translation.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes.**

---

### 4. Phase 1 surface matrix — DECISION NEEDED + OPEN

> Working read from transcript:
>
> | Surface | Internal team (5) | Blind cohort |
> |---------|-------------------|--------------|
> | Constellation Panel | Full | **Sealed** (per Decision #1) |
> | Daily Pulse | No | No |
> | Parking Lot | No | No |
> | Three Dots | Full | **Limited** |
> | Q | Full | Full |
> | Routine Bookshelf | Full | Full |
> | AI Playground | Full | Accessible via card |
>
> Zakiy to confirm matrix or correct rows.
>
> **Also leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and take this with you through your vacation / post-birthday window. No rush to lock — bring back your read when you're ready.**

---

### 5. Belgrade local participant enrollment — OPEN

Cohort size target: ~10 PROFEX locals + 5 named = ~15–20 blind participants. PROFEX white-label must be live by May 15 to support enrollment. Selection criteria, names, and exact enrollment timing (pre-arrival vs on-arrival) not specified in this transcript.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and take this with you through your vacation / post-birthday window. Selection of locals is a Val + Duško conversation, not a build blocker — but the PROFEX tenant must be ready to receive them by May 15.**

---

## Val's understanding

> **Open. Val to provide in his own words. Zakiy: this is the side-by-side compare surface — when Val fills it in, read it against your own understanding of the same transcript and flag any mismatch.**

---

## Gaps / flags for Zakiy

- **"Dual AI"** referenced but not defined in this transcript — assumed Ollie + AskABA based on canon; confirm.
- **"Another 10 people from PROFEX"** is Val's projected blind cohort count, not a locked enrollment number.
- **Costin** appears in the canon participant table but is not discussed by name in transcript body.
- **"We may actually add Jennifer and Grace to their company"** — "their company" ambiguous (PROFEX? Dušan's outfit?).
- **SPORTICO scope** ("we may just put SPORTICO on our app too") referenced but integration depth not detailed.
- **Code-side ownership** for setting up the PROFEX vs Bariatric Associates white-label codes — Nikita owns the *look*, but who configures the codes themselves?
- **Madeline** as participant noted as "may actually work" — soft, not locked.
- **Routine Bookshelf personalization** confirmed ("mine is mine, yours is yours") — implementation status unclear from transcript.

---

**[READY FOR ZAKIY REVIEW]**

---

*Document compiled for Zakiy's flight review. T-01 of multi-transcript intake series. More transcripts to follow — full compilation when Val signals "compile."*
