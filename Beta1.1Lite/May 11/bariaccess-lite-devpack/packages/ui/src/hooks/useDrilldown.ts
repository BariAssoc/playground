/**
 * Composite drilldown hooks — Sleep / Stress / Activity.
 * Each calls the corresponding /api/<composite>/:user_id endpoint.
 */

import { useQuery } from '@tanstack/react-query';
import { ScoresApi } from '../api/scores.js';

const STALE = 60 * 1000;

export function useSleepDrilldown(userId: string, date?: string) {
  return useQuery({
    queryKey: ['scores', 'sleep', userId, date ?? 'today'],
    queryFn: () => ScoresApi.sleep(userId, date),
    staleTime: STALE,
    refetchOnWindowFocus: false,
  });
}

export function useStressDrilldown(userId: string, date?: string) {
  return useQuery({
    queryKey: ['scores', 'stress', userId, date ?? 'today'],
    queryFn: () => ScoresApi.stress(userId, date),
    staleTime: STALE,
    refetchOnWindowFocus: false,
  });
}

export function useActivityDrilldown(userId: string, date?: string) {
  return useQuery({
    queryKey: ['scores', 'activity', userId, date ?? 'today'],
    queryFn: () => ScoresApi.activity(userId, date),
    staleTime: STALE,
    refetchOnWindowFocus: false,
  });
}
