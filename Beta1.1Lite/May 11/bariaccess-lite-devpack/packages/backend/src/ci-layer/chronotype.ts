/**
 * BariAccess — Chronotype / V3 Peak Window Resolver
 *
 * Source: RR-Calculation-Canon-Pass2_v1_1_LOCKED.md (peak window 4–8pm typical for muscle/cardio)
 *         BETA-JF-BASELINE-001 (MEQ at intake)
 *
 * Resolves chronotype-driven peak performance windows used by CI-M and CI-C.
 * Uses V3 ChronotypeProfile when established (Day 14+ or MEQ-completed).
 * Falls back to population default (16:00-20:00) during warmup.
 */

import type { ChronotypeProfile } from '@bariaccess-lite/shared';

const DEFAULT_PEAK_START = '16:00';
const DEFAULT_PEAK_END = '20:00';

export interface PeakWindow {
  start: string;        // 'HH:MM'
  end: string;          // 'HH:MM'
  source: 'v3_chronotype' | 'population_default' | 'provider_override';
}

export function resolvePeakWindow(
  chronotype: ChronotypeProfile | null,
  /** Activity domain — currently muscle/cardio share window per Pass 2. */
  domain: 'muscle' | 'cardio' = 'muscle'
): PeakWindow {
  if (chronotype && chronotype.peak_window_start && chronotype.peak_window_end) {
    return {
      start: chronotype.peak_window_start,
      end: chronotype.peak_window_end,
      source: chronotype.source === 'provider_override' ? 'provider_override' : 'v3_chronotype',
    };
  }
  return {
    start: DEFAULT_PEAK_START,
    end: DEFAULT_PEAK_END,
    source: 'population_default',
  };
}

/**
 * Returns the fraction (0..1) of a workout that fell inside the peak window.
 */
export function fractionInPeakWindow(
  workout_start_iso: string,
  workout_duration_min: number,
  peak: PeakWindow
): number {
  const start = new Date(workout_start_iso);
  if (Number.isNaN(start.getTime())) return 0;
  const end = new Date(start.getTime() + workout_duration_min * 60_000);

  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const peakStart = combineDate(dayStart, peak.start);
  const peakEnd = combineDate(dayStart, peak.end);

  const overlapStart = Math.max(start.getTime(), peakStart.getTime());
  const overlapEnd = Math.min(end.getTime(), peakEnd.getTime());
  const overlap = Math.max(0, overlapEnd - overlapStart);
  const total = end.getTime() - start.getTime();
  return total === 0 ? 0 : overlap / total;
}

function combineDate(day: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => Number(n));
  const d = new Date(day);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

/**
 * Map MEQ score to category (Horne-Östberg classic boundaries).
 */
export function meqToCategory(meq: number): ChronotypeProfile['category'] {
  if (meq >= 70) return 'definitely_morning';
  if (meq >= 59) return 'moderately_morning';
  if (meq >= 42) return 'neither';
  if (meq >= 31) return 'moderately_evening';
  return 'definitely_evening';
}
