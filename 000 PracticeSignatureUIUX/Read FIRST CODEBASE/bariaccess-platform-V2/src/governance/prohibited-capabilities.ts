/**
 * PROHIBITED CAPABILITIES — PAC-ISE-007 §3 Hard Rules
 * 
 * Source canon:
 *   - PAC-ISE-007 v1.0B §3 (prohibited capabilities — hard rules)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (mental wellbeing hard rules)
 * 
 * Defines what AI agents (Ollie, AskABA/Max, Morpheus) MUST NEVER do.
 * Enforcement happens at multiple layers:
 *   - Prompt-level: agent system prompts include these constraints
 *   - Response-level: deviation-detector validates outputs against this list
 *   - Storage-level: prohibited-pattern outputs are flagged in audit log
 * 
 * These rules are non-negotiable. Modification requires canon update.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PROHIBITION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface Prohibition {
  id: string;
  description: string;
  severity: 'high' | 'critical';
  source_canon: string;
  /** Patterns / phrases that indicate violation (used by deviation-detector) */
  violation_patterns: ReadonlyArray<string>;
  /** Which agents this rule applies to */
  applies_to: ReadonlyArray<'ollie' | 'askaba_max' | 'morpheus'>;
}

// ─────────────────────────────────────────────────────────────────────────────
// THE LOCKED PROHIBITION LIST
// ─────────────────────────────────────────────────────────────────────────────

export const PROHIBITED_CAPABILITIES: ReadonlyArray<Prohibition> = [
  // ── PAC-ISE-007 §3.1 — No diagnosis ─────────────────────────────────────
  {
    id: 'P-001',
    description: 'AI must not diagnose medical conditions or assert clinical findings.',
    severity: 'critical',
    source_canon: 'PAC-ISE-007 v1.0B §3.1',
    violation_patterns: [
      'you have ',
      'you are diagnosed with ',
      'this confirms ',
      'this means you have ',
      'i diagnose '
    ],
    applies_to: ['ollie', 'askaba_max', 'morpheus']
  },

  // ── PAC-ISE-007 §3.2 — No raw biometric numbers to patient ──────────────
  {
    id: 'P-002',
    description: 'AI must not surface raw biometric values to the patient (CCIE-interface). Only abstracted directions.',
    severity: 'high',
    source_canon: 'PAC-ISE-007 v1.0B §3.2',
    violation_patterns: [
      // Numeric biometric phrases — caught by regex in deviation-detector
      'your hrv is ',
      'your spo2 is ',
      'your glucose is ',
      'your blood pressure is '
    ],
    applies_to: ['ollie']
  },

  // ── PAC-ISE-007 §3.3 — No medication advice ─────────────────────────────
  {
    id: 'P-003',
    description: 'AI must not recommend, adjust, or comment on medication dosages.',
    severity: 'critical',
    source_canon: 'PAC-ISE-007 v1.0B §3.3',
    violation_patterns: [
      'you should take ',
      'you should stop ',
      'reduce your dose',
      'increase your dose',
      'skip your medication'
    ],
    applies_to: ['ollie', 'askaba_max', 'morpheus']
  },

  // ── G6 §5.6 — Mental wellbeing hard rules ───────────────────────────────
  {
    id: 'P-004-MW',
    description: 'AI must never decide not to escalate when a Mental Wellbeing trigger fires.',
    severity: 'critical',
    source_canon: 'DEV-WORK-D0LITE-PATCH-001 v1.0 §5.6 hard rule 1',
    violation_patterns: [], // behavioral rule — checked at safety-override.ts entrypoint
    applies_to: ['ollie', 'askaba_max']
  },
  {
    id: 'P-005-MW',
    description: 'AI must never give crisis counseling. Only safety check-in template + 988/911 options.',
    severity: 'critical',
    source_canon: 'DEV-WORK-D0LITE-PATCH-001 v1.0 §5.6 hard rule 2',
    violation_patterns: [
      'have you tried meditation',
      'try to relax',
      'take a deep breath and ',
      "let's work through this"
    ],
    applies_to: ['ollie']
  },
  {
    id: 'P-006-MW',
    description: 'No false reassurance during safety check-in.',
    severity: 'critical',
    source_canon: 'DEV-WORK-D0LITE-PATCH-001 v1.0 §5.6 hard rule 3',
    violation_patterns: [
      "you're going to be okay",
      'everything will be fine',
      "you'll get through this"
    ],
    applies_to: ['ollie']
  },
  {
    id: 'P-007-MW',
    description: 'No diagnostic language during safety check-in.',
    severity: 'critical',
    source_canon: 'DEV-WORK-D0LITE-PATCH-001 v1.0 §5.6 hard rule 5',
    violation_patterns: [
      'suicidal ideation',
      'self-harm',
      'crisis',
      'mental illness',
      'psychiatric'
    ],
    applies_to: ['ollie']
  },

  // ── PAC-ISE-007 §3.4 — No state self-modification ───────────────────────
  {
    id: 'P-008',
    description: 'AI must not announce, suggest, or attempt to change ISE state.',
    severity: 'high',
    source_canon: 'PAC-ISE-007 v1.0B §3.4',
    violation_patterns: [
      "i'm changing your state",
      'switching you to ',
      'you are now in ise',
      'moving you to '
    ],
    applies_to: ['ollie', 'askaba_max', 'morpheus']
  }
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export type AIAgent = 'ollie' | 'askaba_max' | 'morpheus';

export function getProhibitionsForAgent(agent: AIAgent): ReadonlyArray<Prohibition> {
  return PROHIBITED_CAPABILITIES.filter((p) => p.applies_to.includes(agent));
}

export function getProhibitionById(id: string): Prohibition | undefined {
  return PROHIBITED_CAPABILITIES.find((p) => p.id === id);
}

export function getCriticalProhibitions(): ReadonlyArray<Prohibition> {
  return PROHIBITED_CAPABILITIES.filter((p) => p.severity === 'critical');
}
