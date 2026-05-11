/**
 * BariAccess Lite — Scores Router
 *
 * Endpoints:
 *   GET /api/scores/today/:user_id        — today's R&R_Lite + composites + sub-scores + provenance
 *   GET /api/scores/by-date/:user_id/:date — historical lookup (read-only)
 *
 * Reads from `score_daily_rollup` Cosmos container (pre-computed by nightly job).
 * Reads NEVER recompute (per Pass 0 / CCO-FAB-001-PIN-001).
 */

import { Router, type Request, type Response } from 'express';
import type { ScoreDailyRollup } from '@bariaccess-lite/shared';

export interface RollupReader {
  getRollupByDate(user_id: string, date: string): Promise<ScoreDailyRollup | null>;
  getRollupRange(user_id: string, start: string, end: string): Promise<ScoreDailyRollup[]>;
}

export function createScoresRouter(reader: RollupReader): Router {
  const router = Router();

  router.get('/today/:user_id', async (req: Request, res: Response) => {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    const today = todayInTZ('America/New_York');
    try {
      const rollup = await reader.getRollupByDate(user_id, today);
      if (!rollup) {
        return res.status(404).json({
          error: 'no rollup found for today',
          user_id,
          date: today,
          hint: 'nightly job may not have completed yet, or user is pre-day-1',
        });
      }
      return res.json(rollup);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      return res.status(500).json({ error: 'rollup read failed', message });
    }
  });

  router.get('/by-date/:user_id/:date', async (req: Request, res: Response) => {
    const { user_id, date } = req.params;
    if (!user_id || !date) return res.status(400).json({ error: 'user_id and date required' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
    }

    try {
      const rollup = await reader.getRollupByDate(user_id, date);
      if (!rollup) return res.status(404).json({ error: 'rollup not found' });
      return res.json(rollup);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      return res.status(500).json({ error: 'rollup read failed', message });
    }
  });

  router.get('/range/:user_id', async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const start = String(req.query.start ?? '');
    const end = String(req.query.end ?? '');
    if (!user_id || !start || !end) {
      return res.status(400).json({ error: 'user_id, start, end required' });
    }
    try {
      const rollups = await reader.getRollupRange(user_id, start, end);
      return res.json({ user_id, start, end, count: rollups.length, rollups });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      return res.status(500).json({ error: 'range read failed', message });
    }
  });

  return router;
}

function todayInTZ(_tz: string): string {
  // Lite v1: rely on server TZ being ET. Replace with Intl.DateTimeFormat
  // when multi-cohort timezone support ships.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
