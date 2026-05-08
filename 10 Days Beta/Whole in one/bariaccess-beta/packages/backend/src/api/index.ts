/**
 * BariAccess Beta — Express app
 *
 * Wire all routers, expose health check.
 */

import express from 'express';
import cors from 'cors';
import { jotformRouter } from './jotform';
import { bookendRouter } from './bookend';
import { nudgeRouter } from './nudge';
import { reportsRouter } from './reports';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'bariaccess-beta',
      time: new Date().toISOString(),
    });
  });

  // API routers
  app.use('/api/jotform', jotformRouter);
  app.use('/api/bookend', bookendRouter);
  app.use('/api/nudge', nudgeRouter);
  app.use('/api/reports', reportsRouter);

  return app;
}

// Boot if run directly
if (require.main === module) {
  const app = createApp();
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`[bariaccess-beta] listening on :${port}`);
  });
}
