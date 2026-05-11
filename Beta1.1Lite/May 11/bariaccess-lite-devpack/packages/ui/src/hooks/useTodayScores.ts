/**
 * useTodayScores — fetches today's score rollup for the current user.
 * Calls GET /api/scores/today/:user_id (backend v0.1.2).
 */

import { useQuery } from '@tanstack/react-query';
import { ScoresApi } from '../api/scores.js';

export function useTodayScores(userId: string) {
  return useQuery({
    queryKey: ['scores', 'today', userId],
    queryFn: () => ScoresApi.today(userId),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
