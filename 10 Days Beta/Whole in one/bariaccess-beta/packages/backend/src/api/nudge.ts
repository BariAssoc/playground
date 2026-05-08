/**
 * BariAccess Beta — Nudge Inbound + Reports API
 */

import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import {
  NudgeEventSchema,
  type NudgeEvent,
  type NudgeType,
} from '@bariaccess/shared';
import { parseNudgeReply } from '../parsers/nudge-parser';

export const nudgeRouter = Router();

// ────────────────────────────────────────────────────────────
// POST /api/nudge/inbound
// SMS / WhatsApp gateway forwards reply messages here.
// Body: { user_id, nudge_id ('10am'|'1pm'|'3:30pm'), message, channel }
// ────────────────────────────────────────────────────────────
nudgeRouter.post(
  '/inbound',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, nudge_id, message, channel } = req.body as {
        user_id: string;
        nudge_id: NudgeType;
        message: string;
        channel: string;
      };
      if (!user_id || !nudge_id || !message) {
        res.status(400).json({ error: 'Missing user_id / nudge_id / message' });
        return;
      }

      const member = await loadCohortMember(user_id);
      const parsed = parseNudgeReply(nudge_id, message);

      const event: NudgeEvent = {
        event_id: randomUUID(),
        user_id,
        nudge_id,
        scheduled_time: deriveNudgeScheduledTime(nudge_id),
        actual_response_time: new Date().toISOString(),
        responses: parsed.responses,
        archetype: member.archetype,
        v_tags: deriveVTags(nudge_id),
        context_classifier: deriveContextClassifier(nudge_id),
        completion_status:
          parsed.status === 'complete'
            ? 'complete'
            : parsed.status === 'partial'
            ? 'partial'
            : 'parse_failed',
        raw_message: message,
      };
      NudgeEventSchema.parse(event);
      await writeNudgeEvent(event);

      if (parsed.status === 'parse_failed') {
        // Route to manual review queue — Val gets a notification
        await flagForManualReview(event, parsed.notes);
      }

      res.status(201).json({
        ok: true,
        event_id: event.event_id,
        status: event.completion_status,
        notes: parsed.notes,
      });
    } catch (err) {
      console.error('[nudge.inbound]', err);
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
function deriveVTags(nudge_id: NudgeType): NudgeEvent['v_tags'] {
  switch (nudge_id) {
    case '10am':
      return ['V4']; // Protein/hydration/movement = interventional
    case '1pm':
      return ['V2', 'V3']; // Productivity match + Mood + Brilliant routing
    case '3:30pm':
      return ['V3', 'V4']; // Lunch timing + hunger
  }
}

function deriveContextClassifier(
  nudge_id: NudgeType
): NudgeEvent['context_classifier'] {
  switch (nudge_id) {
    case '10am':
      return 'activity';
    case '1pm':
      return 'productivity';
    case '3:30pm':
      return 'hunger';
  }
}

function deriveNudgeScheduledTime(nudge_id: NudgeType): string {
  return new Date().toISOString();
}

async function loadCohortMember(user_id: string): Promise<any> {
  throw new Error('loadCohortMember — wire to Cosmos');
}
async function writeNudgeEvent(event: NudgeEvent): Promise<void> {
  throw new Error('writeNudgeEvent — wire to Cosmos');
}
async function flagForManualReview(
  event: NudgeEvent,
  notes: string[]
): Promise<void> {
  console.warn('[NUDGE PARSE FAILED]', event.user_id, notes);
}
