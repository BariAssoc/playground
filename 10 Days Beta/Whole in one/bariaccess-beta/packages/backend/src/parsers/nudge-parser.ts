/**
 * BariAccess Beta — Nudge Reply Parser
 *
 * Source: BETA-NUDGE-001 §Notes for Zakiy
 *
 * Handles real-world reply formats from cohort:
 *   - "1Y 2N 3Y" (clean — what spec assumes)
 *   - "yes yes no"
 *   - "1: yes, 2: no, 3: yes"
 *   - "yyy" / "yyn"
 *   - "All yes today"
 *   - "Skipped breakfast, water yes, walked"
 *   - emoji ✅ ❌
 *   - delayed multi-message
 *
 * VAL_DEFAULT — fallback to `parse_failed` status routes to manual review,
 * NOT silent failure. This was the operational risk Claude flagged repeatedly.
 *
 * RECOMMENDED: Run smoke test before May 7 — Val + Zakiy each text 5
 * different reply formats; verify parser catches each.
 */

import type { NudgeResponses, NudgeType } from '@bariaccess/shared';

export type ParseStatus = 'complete' | 'partial' | 'parse_failed';

export interface ParsedNudge {
  status: ParseStatus;
  responses: NudgeResponses;
  raw: string;
  notes: string[];
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────

const YES_TOKENS = [
  'y',
  'yes',
  'yeah',
  'yep',
  'yup',
  'yea',
  'yass',
  'sure',
  'done',
  'did',
  'ok',
  'okay',
  '✅',
  '👍',
  '✔',
  '✔️',
  '✓',
];

const NO_TOKENS = [
  'n',
  'no',
  'nope',
  'nah',
  'didnt',
  "didn't",
  'skip',
  'skipped',
  'missed',
  '❌',
  '👎',
  '✗',
  '✘',
];

function normalizeToken(token: string): 'Y' | 'N' | null {
  const lower = token.toLowerCase().trim();
  if (YES_TOKENS.includes(lower)) return 'Y';
  if (NO_TOKENS.includes(lower)) return 'N';
  return null;
}

function tokenize(message: string): string[] {
  // Split on whitespace, commas, colons, semicolons. Preserve emoji.
  return message
    .split(/[\s,;:.!?]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

// ────────────────────────────────────────────────────────────
// PATTERN: "All yes" / "All no"
// ────────────────────────────────────────────────────────────
function tryAllYesNoPattern(
  message: string,
  expected_count: number
): NudgeResponses | null {
  const lower = message.toLowerCase();
  const allYes = /\b(all|everything|all of them)\b.*\b(yes|y)\b/.test(lower);
  const allNo = /\b(all|everything|none|nothing)\b.*\b(no|n|none)\b/.test(lower);

  if (allYes) {
    const r: NudgeResponses = {};
    for (let i = 1; i <= expected_count; i++) {
      r[`q${i}` as keyof NudgeResponses] = 'Y';
    }
    return r;
  }
  if (allNo) {
    const r: NudgeResponses = {};
    for (let i = 1; i <= expected_count; i++) {
      r[`q${i}` as keyof NudgeResponses] = 'N';
    }
    return r;
  }
  return null;
}

// ────────────────────────────────────────────────────────────
// PATTERN: "yyy" or "yyn" — consecutive single-char Y/N
// ────────────────────────────────────────────────────────────
function tryConsecutivePattern(
  message: string,
  expected_count: number
): NudgeResponses | null {
  const stripped = message.replace(/[\s\n\r,;:.!?]/g, '').toLowerCase();
  if (stripped.length === expected_count && /^[yn]+$/.test(stripped)) {
    const r: NudgeResponses = {};
    for (let i = 0; i < expected_count; i++) {
      r[`q${i + 1}` as keyof NudgeResponses] =
        stripped[i] === 'y' ? 'Y' : 'N';
    }
    return r;
  }
  return null;
}

// ────────────────────────────────────────────────────────────
// PATTERN: "1Y 2N 3Y" — numbered with Y/N
// ────────────────────────────────────────────────────────────
function tryNumberedPattern(
  message: string,
  expected_count: number
): NudgeResponses | null {
  const responses: NudgeResponses = {};
  let matchCount = 0;
  for (let i = 1; i <= expected_count; i++) {
    // Match "1Y", "1: yes", "1 yes", "(1) yes" etc.
    const re = new RegExp(
      `\\b${i}\\)?\\s*[:.\\-]?\\s*(yes|no|y|n|✅|❌|👍|👎)\\b`,
      'i'
    );
    const match = message.match(re);
    if (match) {
      const tok = normalizeToken(match[1]);
      if (tok) {
        responses[`q${i}` as keyof NudgeResponses] = tok;
        matchCount++;
      }
    }
  }
  return matchCount === expected_count ? responses : null;
}

// ────────────────────────────────────────────────────────────
// PATTERN: token sequence — "yes yes no"
// ────────────────────────────────────────────────────────────
function trySequentialTokenPattern(
  message: string,
  expected_count: number
): NudgeResponses | null {
  const tokens = tokenize(message);
  const tokens_normalized = tokens
    .map(normalizeToken)
    .filter((t): t is 'Y' | 'N' => t !== null);
  if (tokens_normalized.length === expected_count) {
    const r: NudgeResponses = {};
    tokens_normalized.forEach((t, i) => {
      r[`q${i + 1}` as keyof NudgeResponses] = t;
    });
    return r;
  }
  return null;
}

// ────────────────────────────────────────────────────────────
// 10 AM PARSER — 3 Y/N questions
// ────────────────────────────────────────────────────────────
export function parse10AMNudge(message: string): ParsedNudge {
  const notes: string[] = [];
  const expected = 3;

  // Try patterns in order of specificity
  for (const fn of [
    tryNumberedPattern,
    tryConsecutivePattern,
    trySequentialTokenPattern,
    tryAllYesNoPattern,
  ]) {
    const result = fn(message, expected);
    if (result) {
      notes.push(`Matched pattern: ${fn.name}`);
      return {
        status: 'complete',
        responses: result,
        raw: message,
        notes,
      };
    }
  }

  // Partial match — at least one Y/N detectable
  const partial: NudgeResponses = {};
  for (let i = 1; i <= expected; i++) {
    const re = new RegExp(`\\b${i}\\b\\D*?\\b(yes|no|y|n)\\b`, 'i');
    const m = message.match(re);
    if (m) {
      const tok = normalizeToken(m[1]);
      if (tok) partial[`q${i}` as keyof NudgeResponses] = tok;
    }
  }
  if (Object.keys(partial).length > 0) {
    notes.push('Partial extraction — manual review recommended');
    return { status: 'partial', responses: partial, raw: message, notes };
  }

  notes.push('No recognizable Y/N pattern');
  return { status: 'parse_failed', responses: {}, raw: message, notes };
}

// ────────────────────────────────────────────────────────────
// 1 PM PARSER — Q1 Y/N + reason + Q2 1–5 + Q3 Y/N
// ────────────────────────────────────────────────────────────
export function parse1PMNudge(message: string): ParsedNudge {
  const notes: string[] = [];
  const responses: NudgeResponses = {};

  // Q1 — On-track Y/N
  const q1Match = message.match(/\b1\)?\s*[:.\-]?\s*(yes|no|y|n)\b/i);
  if (q1Match) {
    const tok = normalizeToken(q1Match[1]);
    if (tok) responses.q1 = tok;
  }

  // Q1 reason — anything after Q1 N until next number or end
  if (responses.q1 === 'N') {
    const reasonMatch = message.match(/\b1\b.*?\bn(o)?\b\s*[:,\-]?\s*(.+?)(?=\b[23]\b|$)/i);
    if (reasonMatch && reasonMatch[2].trim().length > 0) {
      responses.q1_reason = reasonMatch[2].trim();
    }
  }

  // Q2 — Mood 1–5
  const q2Match = message.match(/\b2\)?\s*[:.\-]?\s*([1-5])\b/);
  if (q2Match) {
    responses.q2 = parseInt(q2Match[1], 10);
  }

  // Q3 — Brilliant Y/N
  const q3Match = message.match(/\b3\)?\s*[:.\-]?\s*(yes|no|y|n)\b/i);
  if (q3Match) {
    const tok = normalizeToken(q3Match[1]);
    if (tok) responses.q3 = tok;
  }

  const fieldCount = Object.keys(responses).filter(
    (k) => k !== 'q1_reason'
  ).length;

  if (fieldCount === 3) {
    return { status: 'complete', responses, raw: message, notes };
  } else if (fieldCount > 0) {
    notes.push(`Partial — ${fieldCount}/3 fields parsed`);
    return { status: 'partial', responses, raw: message, notes };
  }

  // Try fallback consecutive pattern for q1 + q3 only (skip q2 numeric)
  const fallbackTokens = tokenize(message)
    .map(normalizeToken)
    .filter((t): t is 'Y' | 'N' => t !== null);
  if (fallbackTokens.length >= 2) {
    responses.q1 = fallbackTokens[0];
    responses.q3 = fallbackTokens[fallbackTokens.length - 1];
    notes.push('Fallback pattern used — Q2 mood not captured');
    return { status: 'partial', responses, raw: message, notes };
  }

  notes.push('No recognizable 1 PM pattern');
  return { status: 'parse_failed', responses: {}, raw: message, notes };
}

// ────────────────────────────────────────────────────────────
// 3:30 PM PARSER — Q1 Y/N + lunch time + Q2 hunger 1–10
// ────────────────────────────────────────────────────────────
export function parse330PMNudge(message: string): ParsedNudge {
  const notes: string[] = [];
  const responses: NudgeResponses = {};

  // Q1 — Lunch eaten Y/N
  const q1Match = message.match(/\b1\)?\s*[:.\-]?\s*(yes|no|y|n)\b/i);
  if (q1Match) {
    const tok = normalizeToken(q1Match[1]);
    if (tok) responses.q1 = tok;
  }

  // Lunch time — look for HH:MM or "12:30 PM" patterns
  const timeMatch = message.match(/\b(\d{1,2}:\d{2}\s*(am|pm)?|\d{1,2}\s*(am|pm))\b/i);
  if (timeMatch) {
    responses.q1_time = timeMatch[1];
  }

  // Q2 — Hunger 1–10 (the primary signal per spec)
  const q2Match = message.match(/\b2\)?\s*[:.\-]?\s*(10|[1-9])\b/);
  if (q2Match) {
    responses.q2 = parseInt(q2Match[1], 10);
  }

  // Per spec: hunger is primary — even if Q1 missed, hunger landing = partial-OK
  if (responses.q2 != null) {
    if (responses.q1 != null) {
      return { status: 'complete', responses, raw: message, notes };
    }
    notes.push('Hunger captured (primary signal); Q1 missed');
    return { status: 'partial', responses, raw: message, notes };
  }

  // Try fallback: any number 1–10 anywhere
  const fallbackHunger = message.match(/\b(10|[1-9])\b/);
  if (fallbackHunger) {
    responses.q2 = parseInt(fallbackHunger[1], 10);
    notes.push('Fallback hunger extraction — verify');
    return { status: 'partial', responses, raw: message, notes };
  }

  notes.push('No recognizable 3:30 PM pattern');
  return { status: 'parse_failed', responses: {}, raw: message, notes };
}

// ────────────────────────────────────────────────────────────
// MAIN ROUTER
// ────────────────────────────────────────────────────────────
export function parseNudgeReply(
  nudge_id: NudgeType,
  message: string
): ParsedNudge {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return {
      status: 'parse_failed',
      responses: {},
      raw: message,
      notes: ['Empty message'],
    };
  }

  switch (nudge_id) {
    case '10am':
      return parse10AMNudge(trimmed);
    case '1pm':
      return parse1PMNudge(trimmed);
    case '3:30pm':
      return parse330PMNudge(trimmed);
    default:
      return {
        status: 'parse_failed',
        responses: {},
        raw: message,
        notes: [`Unknown nudge_id: ${nudge_id}`],
      };
  }
}
