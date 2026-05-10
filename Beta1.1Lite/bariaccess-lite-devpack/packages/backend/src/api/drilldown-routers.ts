/**
 * BariAccess Lite — Drilldown Routers
 *
 * Each drilldown serves the composite + its 3 sub-scores + breakdown
 * for the requested date. Same pattern as scores-router but composite-scoped.
 */

import { Router, type Request, type Response } from 'express';
import type { CompositeId, ScoreDailyRollup } from '@bariaccess-lite/shared';
import type { RollupReader } from './scores-router.js';

function buildDrilldown(composite: CompositeId, reader: RollupReader): Router {
  const router = Router();

  router.get('/:user_id', async (req: Request, res: Response) => {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    const date = String(req.query.date ?? todayString());
    try {
      const rollup = await reader.getRollupByDate(user_id, date);
      if (!rollup) return res.status(404).json({ error: 'rollup not found', user_id, date });
      const composite_data = rollup.rr_lite.composites[composite];
      if (!composite_data) {
        return res.status(404).json({ error: `${composite} composite not found in rollup` });
      }
      return res.json({
        user_id,
        date,
        composite_id: composite,
        composite: composite_data,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      return res.status(500).json({ error: 'drilldown read failed', message });
    }
  });

  return router;
}

export const createSleepRouter = (reader: RollupReader): Router => buildDrilldown('SRC', reader);
export const createStressRouter = (reader: RollupReader): Router => buildDrilldown('SBL', reader);
export const createActivityRouter = (reader: RollupReader): Router => buildDrilldown('AMP', reader);

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
