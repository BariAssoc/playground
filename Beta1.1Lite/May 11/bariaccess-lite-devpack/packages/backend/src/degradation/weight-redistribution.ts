/**
 * BariAccess — Weight Redistribution Helper
 *
 * Source: RR-Calculation-Canon-Pass0_v1_1_LOCKED.md Spec 4 (carry-forward + redistribute)
 *         + DECISIONS.md §2 (R&R_Lite via redistribution, not hardcoded weights)
 *
 * THE single helper used by:
 *   - R&R_Lite        (3-of-8 composite subset)
 *   - SRC composite   (3 sub-scores; redistributes when one is INSUFFICIENT)
 *   - SBL composite   (3 sub-scores)
 *   - AMP composite   (3 sub-scores; LSR warmup case)
 *   - Sub-scores      (3-4 components each; redistributes when a component is missing)
 *
 * RULE: Any time a weighted sum has missing inputs, call THIS helper.
 *       Never hardcode redistributed weights.
 *
 * CRITICAL: This is also the migration path. When the remaining 5 R&R composites
 * ship, R&R_Lite → R&R is literally:
 *     redistributeWeights(['SRC','SBL','AMP'], RR_WEIGHTS)
 *  →  redistributeWeights(['SRC','SBL','MBC','MEI','AMP','BCI','CRC','BHR'], RR_WEIGHTS)
 * No other code change required.
 */

import type { WeightTable, RedistributedWeights } from '@bariaccess-lite/shared';

/**
 * Redistribute the weights of a subset of keys over a master weight table.
 *
 * Behavior:
 *   - Sums the weights of `available_keys` from `master`.
 *   - Divides each available key's weight by the sum → re-normalized to 1.0.
 *   - Keys present in `master` but missing from `available_keys` are dropped.
 *
 * Examples:
 *   master = { SRC: 0.14, SBL: 0.14, AMP: 0.12, ... } (8 keys, sum 1.0)
 *   redistributeWeights(['SRC','SBL','AMP'], master)
 *     → { weights: { SRC: 0.350, SBL: 0.350, AMP: 0.300 }, redistributed: true,
 *         dropped_keys: ['MBC','MEI','BCI','CRC','BHR'] }
 *
 *   master = { SQI: 0.40, SRI: 0.35, SNS: 0.25 }  (SRC sub-scores)
 *   redistributeWeights(['SQI','SRI','SNS'], master)
 *     → { weights: { SQI: 0.40, SRI: 0.35, SNS: 0.25 }, redistributed: false,
 *         dropped_keys: [] }
 *   (No-op when full set is available.)
 *
 *   redistributeWeights(['SQI','SRI'], master)  (SNS missing)
 *     → { weights: { SQI: 0.5333, SRI: 0.4667 }, redistributed: true,
 *         dropped_keys: ['SNS'] }
 *
 * Throws if:
 *   - `available_keys` is empty
 *   - All available keys have weight 0 in master (degenerate)
 *   - Any available_key is missing from master (caller bug)
 */
export function redistributeWeights(
  available_keys: string[],
  master: WeightTable
): RedistributedWeights {
  if (available_keys.length === 0) {
    throw new Error('redistributeWeights: available_keys is empty');
  }

  // Validate every available key exists in master.
  for (const key of available_keys) {
    if (!(key in master)) {
      throw new Error(
        `redistributeWeights: key "${key}" missing from master weight table. ` +
          `Master keys: ${Object.keys(master).join(', ')}`
      );
    }
  }

  const sum = available_keys.reduce((acc, k) => acc + master[k]!, 0);
  if (sum === 0) {
    throw new Error('redistributeWeights: sum of available weights is zero');
  }

  const all_master_keys = Object.keys(master);
  const dropped_keys = all_master_keys.filter((k) => !available_keys.includes(k));
  const redistributed =
    dropped_keys.length > 0 || Math.abs(sum - 1.0) > 1e-9;

  const weights: WeightTable = {};
  for (const k of available_keys) {
    weights[k] = master[k]! / sum;
  }

  return { weights, redistributed, dropped_keys };
}

/**
 * Apply redistributed weights to a value table, returning the weighted sum.
 *
 * Caller is responsible for ensuring values are in the same 0–1 (component)
 * or 0–100 (score) scale; this function does no scale conversion.
 */
export function weightedSum(
  values: Record<string, number>,
  weights: WeightTable
): number {
  let sum = 0;
  for (const [k, w] of Object.entries(weights)) {
    if (!(k in values)) {
      throw new Error(
        `weightedSum: value for key "${k}" missing. ` +
          `Value keys: ${Object.keys(values).join(', ')}`
      );
    }
    if (!Number.isFinite(values[k]!)) {
      throw new Error(
        `weightedSum: value for key "${k}" is not finite (${values[k]}). ` +
          `Caller must filter out missing inputs BEFORE calling.`
      );
    }
    sum += values[k]! * w;
  }
  return sum;
}
