/**
 * BariAccess Beta — Bookend Events API
 *
 * Source: BETA-BOOKEND-001 §Data Schema
 *
 * Receives warm-up + cool-down taps from frontend.
 * Writes bookend_events + journal_entries (cool-down) + mood_events.
 */

import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import {
  BookendEventSchema,
  JournalEntrySchema,
  MoodEventSchema,
  type BookendEvent,
  type JournalEntry,
  type MoodEvent,
} from '@bariaccess/shared';
import {
  moodDelta,
  moodToBeacon,
  normalizeMood,
  resolveColorState,
  warmupColorState,
} from '../scoring';

export const bookendRouter = Router();

// ────────────────────────────────────────────────────────────
// POST /api/bookend/warmup — fired when user taps warm-up Bookend card
// ────────────────────────────────────────────────────────────
bookendRouter.post(
  '/warmup',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, fab_id, mood, space } = req.body;
      const fab = await loadFAB(fab_id);
      const member = await loadCohortMember(user_id);

      const event: BookendEvent = {
        event_id: randomUUID(),
        user_id,
        fab_id,
        fab_name: fab.name,
        event_type: 'warmup',
        scheduled_time: deriveScheduledTime(fab),
        actual_timestamp: new Date().toISOString(),
        mood: mood ?? null,
        space: space ?? null,
        completion: null,
        critical_flag: fab.critical_flag,
        color_state: warmupColorState(),
        archetype: member.archetype,
        internal_only: member.internal_only || fab.internal_only,
        synthetic: false,
      };

      BookendEventSchema.parse(event);
      await writeBookendEvent(event);

      // VAL_DEFAULT_35 — every Mood capture writes mood_events row
      if (mood != null) {
        const moodEvent: MoodEvent = {
          event_id: randomUUID(),
          user_id,
          mood_raw: mood,
          mood_normalized: normalizeMood(mood),
          beacon_value: moodToBeacon(mood),
          source: 'bookend_warmup',
          archetype: member.archetype,
          timestamp: event.actual_timestamp,
        };
        MoodEventSchema.parse(moodEvent);
        await writeMoodEvent(moodEvent);
      }

      res.status(201).json({ ok: true, event_id: event.event_id });
    } catch (err) {
      console.error('[bookend.warmup]', err);
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// POST /api/bookend/cooldown — fired when user taps cool-down Bookend card
// ────────────────────────────────────────────────────────────
bookendRouter.post(
  '/cooldown',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, fab_id, completion, mood_after } = req.body;
      const fab = await loadFAB(fab_id);
      const member = await loadCohortMember(user_id);
      const warmup = await loadLatestWarmup(user_id, fab_id);

      const color_state = resolveColorState(completion, fab.critical_flag);
      const now = new Date().toISOString();

      // Cool-down Bookend event
      const event: BookendEvent = {
        event_id: randomUUID(),
        user_id,
        fab_id,
        fab_name: fab.name,
        event_type: 'cooldown',
        scheduled_time: deriveScheduledTime(fab),
        actual_timestamp: now,
        mood: mood_after ?? null,
        space: null, // VAL_DEFAULT_34 — Space NOT captured at cool-down for beta
        completion,
        critical_flag: fab.critical_flag,
        color_state,
        archetype: member.archetype,
        internal_only: member.internal_only || fab.internal_only,
        synthetic: false,
      };
      BookendEventSchema.parse(event);
      await writeBookendEvent(event);

      // VAL_DEFAULT_35 — paired Journal entry
      const mood_before = warmup?.mood ?? null;
      const journal: JournalEntry = {
        entry_id: randomUUID(),
        user_id,
        fab_id,
        fab_name: fab.name,
        log_time: now,
        completion,
        mood_before,
        mood_after: mood_after ?? null,
        mood_delta: moodDelta(mood_before, mood_after ?? null),
        color_state,
        critical_flag: fab.critical_flag,
        internal_only: member.internal_only || fab.internal_only,
        archetype: member.archetype,
        synthetic: false,
      };
      JournalEntrySchema.parse(journal);
      await writeJournalEntry(journal);

      // VAL_DEFAULT_36 — capture mood_after for ALL completion states (Yes/No/Skip)
      if (mood_after != null) {
        const moodEvent: MoodEvent = {
          event_id: randomUUID(),
          user_id,
          mood_raw: mood_after,
          mood_normalized: normalizeMood(mood_after),
          beacon_value: moodToBeacon(mood_after),
          source: 'bookend_cooldown',
          archetype: member.archetype,
          timestamp: now,
        };
        MoodEventSchema.parse(moodEvent);
        await writeMoodEvent(moodEvent);
      }

      res.status(201).json({
        ok: true,
        event_id: event.event_id,
        journal_entry_id: journal.entry_id,
        color_state,
      });
    } catch (err) {
      console.error('[bookend.cooldown]', err);
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// GET /api/bookend/today/:user_id — today's Bookend state for Bookshelf rendering
// ────────────────────────────────────────────────────────────
bookendRouter.get(
  '/today/:user_id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id } = req.params;
      const todayEvents = await loadTodayBookendEvents(user_id);
      res.json({ user_id, events: todayEvents });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// HELPERS — wire to your Cosmos client
// ────────────────────────────────────────────────────────────
async function loadFAB(fab_id: string): Promise<any> {
  throw new Error('loadFAB — wire to Cosmos');
}
async function loadCohortMember(user_id: string): Promise<any> {
  throw new Error('loadCohortMember — wire to Cosmos');
}
async function loadLatestWarmup(
  user_id: string,
  fab_id: string
): Promise<BookendEvent | null> {
  throw new Error('loadLatestWarmup — wire to Cosmos');
}
async function loadTodayBookendEvents(
  user_id: string
): Promise<BookendEvent[]> {
  throw new Error('loadTodayBookendEvents — wire to Cosmos');
}
async function writeBookendEvent(event: BookendEvent): Promise<void> {
  throw new Error('writeBookendEvent — wire to Cosmos');
}
async function writeJournalEntry(entry: JournalEntry): Promise<void> {
  throw new Error('writeJournalEntry — wire to Cosmos');
}
async function writeMoodEvent(event: MoodEvent): Promise<void> {
  throw new Error('writeMoodEvent — wire to Cosmos');
}
function deriveScheduledTime(fab: any): string {
  // Combine today's cohort-local date with fab.scheduled_time
  return new Date().toISOString();
}
