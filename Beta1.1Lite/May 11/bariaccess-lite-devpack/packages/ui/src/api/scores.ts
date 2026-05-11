/**
 * Score endpoint bindings — calls the backend Express routers:
 *   GET /api/scores/today/:user_id
 *   GET /api/scores/by-date/:user_id/:date
 *   GET /api/scores/range/:user_id?start=&end=
 *   GET /api/sleep/:user_id?date=
 *   GET /api/stress/:user_id?date=
 *   GET /api/activity/:user_id?date=
 *
 * Type definitions live in @bariaccess-lite/shared.
 */

import { api } from './client.js';
import type { ScoreDailyRollup, CompositeResult } from '@bariaccess-lite/shared';

export const ScoresApi = {
  today: (userId: string) =>
    api.get<ScoreDailyRollup>(`/api/scores/today/${encodeURIComponent(userId)}`),

  byDate: (userId: string, date: string) =>
    api.get<ScoreDailyRollup>(
      `/api/scores/by-date/${encodeURIComponent(userId)}/${encodeURIComponent(date)}`,
    ),

  range: (userId: string, start: string, end: string) =>
    api.get<ScoreDailyRollup[]>(
      `/api/scores/range/${encodeURIComponent(userId)}?start=${start}&end=${end}`,
    ),

  sleep: (userId: string, date?: string) => {
    const q = date ? `?date=${date}` : '';
    return api.get<CompositeResult>(`/api/sleep/${encodeURIComponent(userId)}${q}`);
  },

  stress: (userId: string, date?: string) => {
    const q = date ? `?date=${date}` : '';
    return api.get<CompositeResult>(`/api/stress/${encodeURIComponent(userId)}${q}`);
  },

  activity: (userId: string, date?: string) => {
    const q = date ? `?date=${date}` : '';
    return api.get<CompositeResult>(`/api/activity/${encodeURIComponent(userId)}${q}`);
  },
};
