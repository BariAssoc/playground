/**
 * BariAccess Beta — Daily Rollup + Journal Read API
 *
 * Read-only endpoints for the frontend. Per CCO-FAB-001-PIN-001, never recompute
 * scoring on display — only read from `effort_daily_rollup`.
 */

import { Router, type Request, type Response } from 'express';

export const reportsRouter = Router();

// ────────────────────────────────────────────────────────────
// GET /api/reports/rollup/:user_id?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns array of EffortDailyRollup rows for the date range.
// ────────────────────────────────────────────────────────────
reportsRouter.get(
  '/rollup/:user_id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id } = req.params;
      const from = (req.query.from as string) ?? null;
      const to = (req.query.to as string) ?? null;
      const rollups = await loadRollups(user_id, from, to);
      res.json({ user_id, range: { from, to }, rollups });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// GET /api/reports/journal/:user_id?date=YYYY-MM-DD
// Returns Journal entries for a single day (default: today).
// ────────────────────────────────────────────────────────────
reportsRouter.get(
  '/journal/:user_id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id } = req.params;
      const date = (req.query.date as string) ?? null;
      const entries = await loadJournalEntries(user_id, date);
      res.json({ user_id, date, entries });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// GET /api/reports/cohort-overview
// Day 11 dashboard view — all cohort members at a glance.
// ────────────────────────────────────────────────────────────
reportsRouter.get(
  '/cohort-overview',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const date = (req.query.date as string) ?? null;
      const overview = await loadCohortOverview(date);
      res.json({ date, members: overview });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// GET /api/reports/disengagement
// Active disengagement flags (unresolved).
// ────────────────────────────────────────────────────────────
reportsRouter.get(
  '/disengagement',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const flags = await loadActiveDisengagementFlags();
      res.json({ flags });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  }
);

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
async function loadRollups(
  user_id: string,
  from: string | null,
  to: string | null
): Promise<any[]> {
  throw new Error('loadRollups — wire to Cosmos');
}
async function loadJournalEntries(
  user_id: string,
  date: string | null
): Promise<any[]> {
  throw new Error('loadJournalEntries — wire to Cosmos');
}
async function loadCohortOverview(date: string | null): Promise<any[]> {
  throw new Error('loadCohortOverview — wire to Cosmos');
}
async function loadActiveDisengagementFlags(): Promise<any[]> {
  throw new Error('loadActiveDisengagementFlags — wire to Cosmos');
}
