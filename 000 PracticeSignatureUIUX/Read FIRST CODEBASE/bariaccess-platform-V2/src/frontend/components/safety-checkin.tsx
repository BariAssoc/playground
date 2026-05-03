/**
 * SAFETY CHECK-IN — Mental Wellbeing Escalation UI
 * 
 * Source canon:
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.4 (response flow — 3 options)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.5 (Phase 1 implementation requirements)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.6 (hard rules — never violated)
 *   - DEV-WORK-D0LITE-PATCH-001 v1.0 (G6) §5.7 (8 mandatory acceptance tests MW-T1..MW-T8)
 * 
 * ⚠️ SAFETY-CRITICAL ⚠️
 * 
 * Patient sees the safety check-in template + 3 response options:
 *   - "I'm safe"          → de-escalate (provider STILL notified per hard rule 4)
 *   - "I need to talk"    → 988 offer + provider page
 *   - "I need help now"   → 988 dialed + 911 offered
 * 
 * HARD RULES (G6 §5.6 — enforced in this component):
 *   1. AI never decides not to escalate
 *   2. AI never gives crisis counseling — only the safety check-in template + options
 *   3. No false reassurance (no "you're going to be okay")
 *   4. Patient choosing "I'm safe" does NOT cancel provider notification
 *   5. No diagnostic language
 * 
 * The check-in template text is hardcoded here per the locked clinical content
 * in G6 §5.4: "I'm here. Are you safe right now?"
 */

import { useState } from 'react';
import type { PatientSafetyResponse } from '../../types/safety.js';

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

export interface SafetyCheckInProps {
  /** Trigger ID — passed back to onResponse for audit linkage */
  trigger_id: string;
  /** Called when patient selects a response. Caller MUST notify provider regardless. */
  onResponse: (response: PatientSafetyResponse) => void;
  /** 988 dial handler — uses native tel: link on iOS / Android */
  onDial988?: () => void;
  /** 911 offer handler — patient confirms before dial */
  onOffer911?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK-IN TEMPLATE TEXT (G6 §5.4 — LOCKED clinical content)
// ─────────────────────────────────────────────────────────────────────────────

const CHECK_IN_TEXT = "I'm here. Are you safe right now?" as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function SafetyCheckIn({
  trigger_id,
  onResponse,
  onDial988,
  onOffer911,
  className = ''
}: SafetyCheckInProps): JSX.Element {
  const [selected, setSelected] = useState<PatientSafetyResponse | null>(null);

  function handleSelect(response: PatientSafetyResponse): void {
    setSelected(response);
    // Always invoke onResponse — caller is responsible for provider notification
    // per Hard Rule 4 (provider always notified, even on "I'm safe").
    onResponse(response);

    // Per G6 §5.4 response flow:
    if (response === 'i_need_help_now') {
      onDial988?.();
      // 911 offered (patient confirms — not auto-dial)
      // Do NOT auto-dial 911. Show the offer separately.
      onOffer911?.();
    } else if (response === 'i_need_to_talk') {
      // 988 offered (not dialed) + provider paged
      onDial988?.();
    }
    // For 'i_am_safe' — no dial, but provider still notified by caller.
  }

  return (
    <section
      className={[
        'flex flex-col gap-4 p-5 rounded-xl bg-stone-50 border border-stone-300',
        className
      ].join(' ')}
      data-trigger-id={trigger_id}
      role="alertdialog"
      aria-label="Safety check-in"
    >
      <header>
        <p className="text-base font-medium text-stone-900 leading-relaxed">
          {CHECK_IN_TEXT}
        </p>
      </header>

      {selected === null ? (
        <div className="flex flex-col gap-2" role="group" aria-label="Response options">
          <button
            type="button"
            onClick={(): void => handleSelect('i_am_safe')}
            className="w-full px-4 py-3 rounded-md bg-white border border-stone-300 hover:border-stone-500 transition-colors text-stone-800 font-medium text-left"
            data-response="i_am_safe"
          >
            I&apos;m safe
          </button>
          <button
            type="button"
            onClick={(): void => handleSelect('i_need_to_talk')}
            className="w-full px-4 py-3 rounded-md bg-white border border-amber-400 hover:border-amber-500 transition-colors text-amber-900 font-medium text-left"
            data-response="i_need_to_talk"
          >
            I need to talk to someone
          </button>
          <button
            type="button"
            onClick={(): void => handleSelect('i_need_help_now')}
            className="w-full px-4 py-3 rounded-md bg-white border border-red-400 hover:border-red-500 transition-colors text-red-900 font-medium text-left"
            data-response="i_need_help_now"
          >
            I need help now
          </button>
        </div>
      ) : (
        <PostSelectionFooter response={selected} />
      )}

      {/*
        Compliance note (not visible — for code reviewers):
        Per G6 §5.6 hard rules:
          - No false reassurance ("you're going to be okay")
          - No diagnostic language ("crisis", "self-harm", "suicidal ideation")
          - AI never decides not to escalate — provider notified by caller in ALL cases
        This component does NOT contain any of those phrases or behaviors.
      */}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POST-SELECTION FOOTER
// 
// Confirmation message per response type. Uses safety language only — no
// diagnostic language, no false reassurance.
// ─────────────────────────────────────────────────────────────────────────────

interface PostSelectionFooterProps {
  response: PatientSafetyResponse;
}

function PostSelectionFooter({ response }: PostSelectionFooterProps): JSX.Element {
  let message: string;
  switch (response) {
    case 'i_am_safe':
      // Per Hard Rule 4: provider still notified. Do not say "great" / "good".
      message = 'Thanks for letting me know. Your care team has been informed.';
      break;
    case 'i_need_to_talk':
      message = 'Connecting you. The 988 lifeline is one tap away. Your care team is being notified.';
      break;
    case 'i_need_help_now':
      message = 'Calling 988 now. If this is an emergency, you can also reach 911.';
      break;
    default: {
      const _exhaustive: never = response;
      void _exhaustive;
      message = 'Your care team has been informed.';
    }
  }

  return (
    <div
      className="rounded-md bg-white border border-stone-200 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-stone-800">{message}</p>
    </div>
  );
}
