# HOW TO ASK CLAUDE — Zakiy's Playbook

**Audience:** Zakiy Manigo, BariAccess developer
**Purpose:** Get fast, accurate answers from Claude without bypassing Val's authority on clinical/canon decisions
**Audit revision:** 2026-05-03

---

## The honest reality of using Claude

Claude has no memory between sessions. Every time you open a new chat, Claude
knows nothing about:
- The audit that happened on 2026-05-03
- Val's sign-off on the Phase 1 provisional weights
- Why voice (Signal 7) is intentionally locked down
- The canon-vs-narrative tensions we resolved (e.g., the James scenario)

This means **a fresh Claude can give you a different answer than the Claude that
helped Val build this scaffold.** That's not a bug — it's the architecture.

The workflow below protects you from that gap.

---

## The decision rule (memorize this)

> **If the answer could change patient-facing behavior, ask Val.**
> **If the answer would only change my code without changing behavior, ask Claude.**

That's it. One sentence. When in doubt, default to Val. Val is the clinical
authority on this platform; Claude is a coding assistant.

---

## Path A — Coding questions (ask Claude directly)

These are safe to ask Claude in a fresh chat. They're about HOW to implement
something, not WHAT the system should do.

**Examples:**
- "How do I implement the `JournalStorageGateway` interface using @azure/cosmos?"
- "What's the right TypeScript type for this `SafeParseResult` from Zod?"
- "Why is this Jest test using `--experimental-vm-modules`?"
- "How do I wire `handleCreateSafetyTrigger` to an Express POST route?"
- "Show me an example of mocking the `NotificationGateway` for tests"
- "How do I write an Azure Function that schedules per-user-timezone cron?"

For all of these, use the **opening prompt** below.

### The Opening Prompt (copy-paste this every time)

```
I'm Zakiy, the developer integrating the BariAccess Phase 2 TypeScript scaffold.
Status:
- Scaffold version: post-audit 2026-05-03
- 184/184 tests passing across 10 suites
- Pre-ship gates green: G5 HIPAA (17 tests) + G6 safety (12 tests)
- Strict TypeScript, ESM, ts-jest

Locked decisions I am NOT free to override:
- Resolver priority chain matches PAC-ISE-002 v2.0 §10 literal pseudocode
- ORI threshold = 0.5 (canon §6 Signal 5)
- Voice (Signal 7) is locked down per G6 §4.4 — DO NOT touch unless told otherwise
- Composite weights are PHASE_1_PROVISIONAL — directionally derived per Beacon §16.3
- All routing behavior is canon-driven, not preference-driven

I'm working on: [DESCRIBE YOUR TASK]

I need help with: [SPECIFIC QUESTION]

Relevant code/canon attached below.

[PASTE FILE CONTENTS OR CANON SECTION]
```

**Why this prompt works:** It tells fresh Claude what's locked and why, so it
won't suggest changes that would break canon conformance.

---

## Path B — Canon / behavioral questions (ask VAL first)

These are NOT safe to ask Claude in a fresh chat. They could result in changes
to patient-facing behavior. Val must be in the decision loop.

**Examples:**
- "Should this state route differently?"
- "Can I unlock voice if I add an Azure BAA?"
- "This threshold seems wrong — can I change it?"
- "Should I add a new ISE state?"
- "The audit comment says X but my reading of canon says Y — who's right?"
- "Is this a bug or a feature?"
- "Can I add a new prohibited capability to the AI governance list?"
- "Should I add a new safety trigger source?"
- "This composite weight looks too high — can I adjust it?"

For all of these:

1. **Text Val first.** Even a one-liner: "Have a canon question — got 5 min?"
2. If Val is unavailable, **document your question in writing** (Slack DM,
   email, GitHub issue) and **wait for him.** Do NOT guess.
3. If Val pulls Claude into the conversation (three-way), **he provides the
   context.** You don't need to.

---

## The standardized handoff for three-way conversations

When Val brings Claude into the loop on a canon question, the smoothest workflow:

1. **You write up the question** in a single message to Val:
   ```
   File: src/resolver/priority-chain.ts line 247
   Canon section: PAC-ISE-002 v2.0 §10 CHECK 5
   Question: [your question]
   What I tried: [what you did]
   What I expected vs got: [the discrepancy]
   ```
2. **Val pastes that into Claude** along with the relevant canon section
3. **Claude answers** with context
4. **Val resolves** — either he tells you the answer, or amends canon, or
   escalates further

This pattern keeps Val in authority and gives Claude enough context to be useful.

---

## Things you MUST always check before asking Claude

These are quick self-checks that save time:

### 1. Search the codebase first
```bash
grep -r "⚠️ AUDIT 2026-05-03" src/  # Find audit-changed lines
grep -r "your_question_keyword" src/
```

Most questions about "why does this work this way" are answered by the inline
canon citations.

### 2. Read the relevant canon doc
The `CHANGELOG-AUDIT-2026-05-03.md` lists which canon section governs which file.
Open the canon doc, find the section, read it. Half the time your question is
answered there.

### 3. Run the tests
```bash
NODE_OPTIONS='--experimental-vm-modules' npx jest path/to/relevant.test.ts --verbose
```

The tests document expected behavior. If a test passes with your change, your
change probably matches the canonical contract. If it fails, you may have
broken something.

### 4. Check git blame / history
If you have access to git history of the scaffold, check what `⚠️ AUDIT
2026-05-03` markers say at each line. Each marker explains what changed and why.

---

## Anti-patterns (DO NOT DO THESE)

### ❌ "I'll just ask Claude in a new chat without context"
Claude in a fresh chat doesn't know about the audit. It might tell you to
"refactor this" or "simplify this" — and the change would deviate from canon.
Always use the opening prompt.

### ❌ "Val is busy, I'll just decide myself"
You're a developer, not the clinical authority. If you change patient-routing
behavior without Val knowing, you're shipping a different product than what
was approved. Wait for Val. The launch deadline is real but so is patient
safety.

### ❌ "Claude said it's fine, so I'll do it"
Claude in a fresh chat is a coding assistant, not a canon authority. If it
contradicts something in this codebase or the canon docs, the canon wins.
Push back on Claude or escalate to Val.

### ❌ "I'll unlock voice for testing — I'll re-lock it before launch"
NO. Voice unlock requires written sign-off from Crenguta + Pamela + Isaiah
(the four G6 §4.4 gates). The banner in `signal-7-voice.ts` is not decorative.
A bug here can cause clinical harm. See `RED-FLAG-QUESTIONS.md`.

### ❌ "I'll modify a Phase 1 provisional weight to test something"
The weights are locked because they affect scoring across all patients.
Modifying them in production = silent scoring drift. Use a test fixture
override in test code only. Never in production code paths.

---

## What to do if Claude is wrong

You will sometimes get an answer from Claude that doesn't match the canon, the
codebase, or what Val told you. When that happens:

1. **Believe the canon and Val first.** Claude's answer is wrong.
2. **Tell Claude in the same chat:** "That contradicts canon §X / Val's
   directive. The correct answer should align with [cite source]." Claude
   will usually self-correct.
3. **If Claude doubles down**, end the chat and ask Val.
4. **Never trust a Claude answer over a canon citation or Val's directive.**

---

## Quick reference card (print this)

```
┌─────────────────────────────────────────────────────────────────┐
│  ASKING CLAUDE — DECISION TREE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Question changes patient behavior?                             │
│    YES → Ask Val first. Always.                                 │
│    NO  → OK to ask Claude with opening prompt.                  │
│                                                                 │
│  Question involves voice / Signal 7?                            │
│    → Ask Val. Never Claude. (See RED-FLAG-QUESTIONS.md)         │
│                                                                 │
│  Question involves changing weights / thresholds / priority?    │
│    → Ask Val. Never Claude.                                     │
│                                                                 │
│  Question is "how do I implement X in TypeScript/Cosmos/etc"?   │
│    → OK to ask Claude. Use opening prompt.                      │
│                                                                 │
│  Question is "why does the codebase do X"?                      │
│    → Search for ⚠️ AUDIT marker first. Then check canon.        │
│    → If still stuck, ask Claude with full context.              │
│                                                                 │
│  Claude's answer contradicts canon or Val?                      │
│    → Canon wins. Val wins. Always.                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Final note from Claude

I'm a tool. Val is your colleague and the clinical authority. The scaffold is
the contract.

When you're stuck, the best path is almost always: read the canon, then look
at the test, then run the test, then ask. If you've done all three and you're
still stuck, then a Claude conversation can help — but only if Val is comfortable
with the question being asked there.

Build well. Don't break canon. Patient safety is real.

— Claude (audit pass, 2026-05-03)
