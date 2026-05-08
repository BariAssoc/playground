/**
 * BariAccess Beta — JotForm Webhook Receivers
 *
 * Source: BETA-JF-AM-001, BETA-JF-PM-001, BETA-JF-BASELINE-001, BETA-INTAKE-001
 *
 * JotForm POSTs form submissions to our webhook endpoint.
 * We normalize, V-tag, write to `jotform_events` + `mood_events`.
 *
 * Wire to your existing Express app:
 *   app.use('/api/jotform', jotformRouter);
 */

import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { JotFormEventSchema } from '@bariaccess/shared';
import { normalizeMood, moodToBeacon } from '../scoring';
import type { JotFormEvent, MoodEvent } from '@bariaccess/shared';
import { randomUUID } from 'node:crypto';

export const jotformRouter = Router();

// ────────────────────────────────────────────────────────────
// JotForm payload shape — adapt to your JotForm field IDs
// ────────────────────────────────────────────────────────────
const JotFormWebhookPayload = z.object({
  formID: z.string(),
  submissionID: z.string(),
  rawRequest: z.string(), // JotForm sends responses as a JSON string in this field
});

interface NormalizedSubmission {
  user_id: string;
  form_id: 'am' | 'pm' | 'baseline' | 'intake';
  day_number: number | null;
  responses: Record<string, unknown>;
  optional_text_submitted: boolean;
  archetype: JotFormEvent['archetype'];
}

// ────────────────────────────────────────────────────────────
// FORM ID → INTERNAL TYPE
// ────────────────────────────────────────────────────────────
// Wire your live JotForm IDs here once forms are created.
const FORM_ID_MAP: Record<string, NormalizedSubmission['form_id']> = {
  // 'YOUR_AM_FORM_ID': 'am',
  // 'YOUR_PM_FORM_ID': 'pm',
  // 'YOUR_BASELINE_FORM_ID': 'baseline',
  // 'YOUR_INTAKE_FORM_ID': 'intake',
};

// ────────────────────────────────────────────────────────────
// POST /api/jotform/webhook
// ────────────────────────────────────────────────────────────
jotformRouter.post(
  '/webhook',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = JotFormWebhookPayload.parse(req.body);
      const responses = JSON.parse(payload.rawRequest);
      const form_id = FORM_ID_MAP[payload.formID];
      if (!form_id) {
        res.status(400).json({ error: 'Unknown formID', formID: payload.formID });
        return;
      }

      // Extract user_id from a known JotForm field (configure based on your form)
      const user_id = responses.user_id ?? responses.q_user_id ?? null;
      if (!user_id) {
        res.status(400).json({ error: 'Missing user_id in submission' });
        return;
      }

      // Look up archetype from cohort_members container
      const archetype = await lookupArchetype(user_id);
      const day_number = extractDayNumber(form_id, responses);

      const event: JotFormEvent = {
        event_id: randomUUID(),
        user_id,
        form_id,
        day_number,
        archetype,
        responses,
        optional_text_submitted: hasOptionalText(responses),
        scheduled_time: deriveScheduledTime(form_id, user_id),
        actual_response_time: new Date().toISOString(),
        completion_status: 'complete',
        v_tags: deriveVTags(form_id, responses),
        timestamp: new Date().toISOString(),
      };

      JotFormEventSchema.parse(event); // Validate
      await writeJotFormEvent(event);

      // AM/PM forms also write mood events for daily aggregation
      if (form_id === 'am' || form_id === 'pm') {
        const moodEvents = extractMoodEvents(event);
        for (const me of moodEvents) await writeMoodEvent(me);
      }

      res.status(200).json({ ok: true, event_id: event.event_id });
    } catch (err) {
      console.error('[jotform.webhook] failure', err);
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// HELPERS — wire to your Cosmos client
// ────────────────────────────────────────────────────────────
async function lookupArchetype(
  user_id: string
): Promise<JotFormEvent['archetype']> {
  // TODO: Cosmos query — SELECT c.archetype FROM cohort_members c WHERE c.user_id = @user_id
  throw new Error('lookupArchetype not implemented — wire to Cosmos');
}

async function writeJotFormEvent(event: JotFormEvent): Promise<void> {
  // TODO: Cosmos upsert into jotform_events container
  throw new Error('writeJotFormEvent not implemented — wire to Cosmos');
}

async function writeMoodEvent(event: MoodEvent): Promise<void> {
  // TODO: Cosmos upsert into mood_events container
  throw new Error('writeMoodEvent not implemented — wire to Cosmos');
}

function extractDayNumber(
  form_id: NormalizedSubmission['form_id'],
  responses: Record<string, unknown>
): number | null {
  if (form_id === 'baseline' || form_id === 'intake') return null;
  // AM/PM forms: derive from beta_started_at + today's date
  return responses.day_number != null ? Number(responses.day_number) : null;
}

function hasOptionalText(responses: Record<string, unknown>): boolean {
  // Check for any non-empty free-text fields (per AM Q8, PM Q9 optional comments)
  const textFields = ['optional_comment', 'q_optional', 'q8_text', 'q9_text'];
  return textFields.some((k) => {
    const v = responses[k];
    return typeof v === 'string' && v.trim().length > 0;
  });
}

function deriveScheduledTime(
  form_id: NormalizedSubmission['form_id'],
  user_id: string
): string {
  // Use cohort member's wake/sleep + form_id to compute scheduled time.
  // Stub: return now.
  return new Date().toISOString();
}

function deriveVTags(
  form_id: NormalizedSubmission['form_id'],
  responses: Record<string, unknown>
): JotFormEvent['v_tags'] {
  // Per BETA-VTAG-001 §V-Domain Reference
  switch (form_id) {
    case 'am':
      return ['V2', 'V3', 'V4'];
    case 'pm':
      return ['V2', 'V3', 'V4'];
    case 'baseline':
      return ['V3']; // Chronotype only — OCEAN goes to user_traits, not V-tagged
    case 'intake':
      return ['V2', 'V3', 'V4']; // Full intake spans all behavioral domains
  }
}

function extractMoodEvents(event: JotFormEvent): MoodEvent[] {
  const moods: MoodEvent[] = [];
  const responses = event.responses;

  // AM Q3 mood, PM Q1 mood — adjust field names to your JotForm field IDs
  const moodFields: Array<{ key: string; source: MoodEvent['source'] }> = [
    { key: 'q3_mood', source: event.form_id === 'am' ? 'am_jotform' : 'pm_jotform' },
    { key: 'mood_am', source: 'am_jotform' },
    { key: 'mood_pm', source: 'pm_jotform' },
  ];

  for (const { key, source } of moodFields) {
    const raw = responses[key];
    if (typeof raw === 'number' && raw >= 1 && raw <= 5) {
      moods.push({
        event_id: randomUUID(),
        user_id: event.user_id,
        mood_raw: raw,
        mood_normalized: normalizeMood(raw),
        beacon_value: moodToBeacon(raw),
        source,
        archetype: event.archetype,
        timestamp: event.timestamp,
      });
    }
  }
  return moods;
}
