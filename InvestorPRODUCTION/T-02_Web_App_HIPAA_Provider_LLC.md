# T-02 — Web App Structure + HIPAA Tenants + BariAccess Provider LLC + UI/UX Figma

**Source:** Internal dev session, Val + Zakiy
**Topics covered:** Web app structure, HIPAA vs non-HIPAA tenant separation, BariAccess Provider LLC entity concept, Calendly integration, Figma business + developer track coupling, Beacon display canon, simulation social media gap
**Status:** Ready for Zakiy review
**Purpose:** Side-by-side compare surface — Val's understanding vs Zakiy's understanding of the same transcript

---

## What this transcript contains

### Web app + tenants

- Figma must couple two tracks: **business Figma** and **developer Figma** — developer track must clearly mirror business track.
- Tenant separation primary axis = **HIPAA vs non-HIPAA**, not credits.
- HIPAA cost burden: it's expensive for outside companies to maintain HIPAA infrastructure; BariAccess can absorb HIPAA on their behalf for wellness clients who don't carry HIPAA governance themselves.
- BariAccess defines what HIPAA means and what falls under their governance.
- Tenant types in scope: **B2B, B2B2C, B2C** (client + customer distinction), plus **merchants**.
- Web app priority Phase 1: **Bariatric Associates web app only**. PROFEX web app comes later. Wellness Revive comes later still.
- Client-facing web app component "might not be as necessary in first phase" — basic file upload sufficient for now.
- Provider web app component is more sophisticated (voice recognition, etc.).

### BariAccess Provider LLC concept

- New entity proposed: **BariAccess Provider LLC** (a.k.a. "BariAccess Provider" / "Providers" in UI).
- Purpose: separate B2C intake entity that absorbs B2C clients via Calendly, then refers them to Bariatric Associates (or other providers) on a referral basis.
- Bariatric Associates = first customer of BariAccess Provider LLC.
- Geography flow: New York and New Jersey first; Atlantic City and North Jersey as expansion targets; West Pennsylvania as further extension.
- Patient flow: B2C client → Calendly intake into BariAccess Provider LLC → routed geographically to a provider (Bariatric Associates or affiliate).
- Patient choice: can pick provider geographically or pick specific doctor.
- Pamela's local intake referrals also flow through this same entity ("she's referring to us because it's one company").
- Stance: BariAccess does **not** want to keep clients — wants to be a bridge for people without providers.
- Open: BariAccess Provider LLC is either a separate entity outside BariAccess, or within it — Val undecided.
- Critical: "Bariatric Associates does not contaminate it" — Bariatric Associates must remain just one of many possible providers, not the parent.

### Biometric Stations (formally Barista Stations)

- Renamed in this transcript: **Biometric Stations** (formally Barista Stations).
- Initial NYC + NJ locations.
- Expansion model: B2B clients in new geographies pull stations to their areas; over ~36 months, new stations stand up in Atlantic City, then West Pennsylvania.
- Open question: franchise model vs BariAccess-owned.
- For one-off cases (e.g., patient near Atlantic City Bariatrics): bring patient to existing BariAccess location for biometric enrollment; deliver digital format to patient and doctor; **no blood data left at outside companies**.

### UI/UX Figma direction

- Vertical layout + expansion behavior is canonical — "all the time."
- ITB-style expand-then-collapse pattern.
- **No spaces between display elements** — Val flagged simulation showed gaps (red/green bars + Beacon left empty space because they couldn't fill the gap).
- Phone-size scaling acknowledged: it's okay if it gets bigger on bigger phones, but the visual must not have unfilled space.
- **Beacon display canon needed** — how good news / values in signals display: top → down, nicely sequenced.
- Stick close to simulation precedent for cards.
- Journal WorkPad and WorkPad both get **expand button**.
- Connected text from Ollie's Space / Ollie's AI Playground feeds into WorkPads.

### Source of Truth protocol

- Val locking new working rule: from now on, what Val pushes to Zakiy is **vetted** (not exhausted brain-dump). Treat Val's pushes as **Source of Truth**. Zakiy works from there and pushes back meaningful feedback.

### Simulation gap — social media

- Cards being posted to social media exists only in video, not in simulation.
- Val: consider the video as part of simulation homework.
- Don't build the social media simulation now — but **definitely in production**.

---

## Decisions stated

- Phase 1 web app scope = Bariatric Associates only.
- Tenant separation in Figma developer track = HIPAA vs non-HIPAA.
- BariAccess covers HIPAA infrastructure for wellness clients who don't have it.
- B2C intake routed through Calendly into a separate provider-tier entity (working name: **BariAccess Provider LLC**).
- Biometric Stations is the new canonical name (formally Barista Stations).
- Phase 1 client web app = basic + file upload only.
- Provider web app = voice recognition + more sophisticated.
- Journal WorkPad + WorkPad get expand button.
- Beacon display has its own canon (to be written).
- No empty space between display elements.
- Social media card posting in production scope, not Phase 1 simulation.
- "Source of Truth" rule locked: vetted Val pushes only.

---

## Timeline references

| Date | Milestone |
|------|-----------|
| **May 1** | Figma updates for web app pages on Zakiy's list (he confirmed) |

(No other dates in this transcript — May 2 / May 15 / May 20 from T-01 still apply.)

---

## Dependencies / Blockers

- Figma business track must be coupled to developer track — Zakiy needs to build the developer mirror.
- Business Figma needs HIPAA / non-HIPAA tenant separation logic visualized.
- BariAccess Provider LLC — legal/business structure decision (separate entity vs internal division) — not Zakiy's call but affects how the web app is architected.
- Beacon display canon document needs writing.
- Phone-size sizing strategy for vertical/expansion behavior.
- Calendly integration to BariAccess Provider LLC tenant.
- Biometric Station naming change must propagate through canon (was Barista Stations).

---

## Open Questions

### 1. BariAccess Provider LLC — entity placement — OPEN

Val explicitly undecided: BariAccess Provider LLC is either (A) a separate legal entity outside BariAccess, or (B) inside BariAccess.

This is a **business/legal decision**, not a build decision — but Zakiy should know the architectural impact: if (A), the web app needs cross-entity data flow plumbing (Calendly intake → BariAccess Provider LLC tenant → referral-out to Bariatric Associates / others). If (B), it's a tenant subdivision within BariAccess.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes, and take this through your vacation / post-birthday window. This is Val's decision to make — Zakiy just needs to know which path before final web app build.**

---

### 2. Biometric Station ownership model — OPEN

Val raised: franchise vs BariAccess-owned. No decision in transcript.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes.**

---

### 3. Phase 1 web app — client-side scope — OPEN

Val: *"the client part — the client might not be as necessary in the first phase... but we still have to have the basics — what you had allowed. And maybe just to upload files."*

Working read:
- **Provider web app (Bariatric Associates):** full build — voice recognition + sophisticated features
- **Client web app (Bariatric Associates):** minimal Phase 1 — login + file upload only

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes.**

---

### 4. Beacon display canon — content not yet written — OPEN

Val: *"There should be a canon on how the display of this good news — or the values in signals — displays in the Beacon. Top — then goes down — but has to be a nice display."*

No canon document exists yet. This is a Val-authored canon document, not a Zakiy build task — but Zakiy's UI/UX work depends on it.

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes — flag what you need from the canon to unblock the Figma.**

---

### 5. No-space rule — sizing strategy across phones — OPEN

Val: empty space between display elements (red/green bars + Beacon) looked bad in simulation. Acceptable to scale bigger on bigger phones, but no unfilled gaps.

Implementation strategy not specified — flexbox? Aspect-ratio anchor? Phone-size breakpoints?

> **Leave open. Next transcripts may answer this. Also — Zakiy: use your notes — this is your call as the developer.**

---

## Val's understanding

> **Open. Val to provide in his own words. Zakiy: this is the side-by-side compare surface — when Val fills it in, read it against your own understanding of the same transcript and flag any mismatch.**

---

## Gaps / flags for Zakiy

- **"Biometric Stations (formally Barista Stations)"** — naming change. Confirm propagation across all canon docs is a separate task, not in scope for this Figma sprint.
- **Wellness Revive** mentioned as future tenant — not Phase 1.
- **"Coin side"** in Val's dictation — context unclear; possibly referring to a UI element or sidebar component. Flag for Val to clarify.
- **Calendly migration** ("we may just move the provider — the Calendly — to the new company") — operational task, may need coordination with whoever currently owns the Calendly account.
- **Social media card posting** — production scope, not Phase 1, but worth Zakiy noting for downstream architecture (which surface posts? which AI generates the card? what's the OAuth path?).
- **WorkPad + Journal WorkPad expand button** — Val mentioned, Zakiy acknowledged, but no Figma specifics in this transcript.
- **"Source of Truth" rule** is a working-protocol change between Val and Zakiy — not a build item, but Zakiy should internalize it.
- **B2B2C** mentioned in tenant list but not elaborated — may collapse into B2B + B2C combination, or may be its own tenant class.

---

**[READY FOR ZAKIY REVIEW]**

---

*Document compiled for Zakiy's flight review. T-02 of multi-transcript intake series. More transcripts to follow — full compilation when Val signals "compile."*
