/**
 * BariAccess Lite — Express App Wiring
 *
 * Wires the four routers and exposes a factory.
 * Caller (your existing repo) provides a RollupReader implementation
 * over Cosmos.
 */

import express, { type Express } from 'express';
import cors from 'cors';
import { createScoresRouter, type RollupReader } from './scores-router.js';
import {
  createSleepRouter,
  createStressRouter,
  createActivityRouter,
} from './drilldown-routers.js';

export interface CreateAppOptions {
  rollup_reader: RollupReader;
  cors_origin?: string | string[];
}

export function createApp(opts: CreateAppOptions): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(
    cors({
      origin: opts.cors_origin ?? '*',
      credentials: true,
    })
  );

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'bariaccess-lite-scoring',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/scores', createScoresRouter(opts.rollup_reader));
  app.use('/api/sleep', createSleepRouter(opts.rollup_reader));
  app.use('/api/stress', createStressRouter(opts.rollup_reader));
  app.use('/api/activity', createActivityRouter(opts.rollup_reader));

  return app;
}
