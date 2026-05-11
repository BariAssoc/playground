/**
 * BariAccess Lite — R&R_Lite Headline
 *
 * Source: DECISIONS.md §2 (canon-preserving redistribution)
 *         RR-Calculation-Canon-Pass1_v1_1_LOCKED.md §R&R Spec 1
 *
 * Formula (computed via redistributeWeights, NEVER hardcoded):
 *   R&R_Lite = 0.35·SRC + 0.35·SBL + 0.30·AMP
 *
 * The redistribution path makes migration to full R&R a one-line change:
 *   composite_subset: ['SRC','SBL','AMP'] → ['SRC','SBL','MBC','MEI','AMP','BCI','CRC','BHR']
 *
 * Field name flips from 'rr_lite' to 'rr' when composite_subset.length === 8.
 */

import {
  RR_WEIGHTS,
  type CompositeResult,
  type RRLiteResult,
  type CompositeId,
  type ISEState,
  type ScoreAnnotation,
} from '@bariaccess-lite/shared';
import {
  redistributeWeights,
  weightedSum,
} from '../degradation/weight-redistribution.js';
import { clampScore } from '../beacon/piecewise-linear.js';
import { resolveBand } from '../beacon/band-resolver.js';

export interface RRLiteInput {
  composites: Record<CompositeId, CompositeResult>;
  ise_state: string;
  computed_at: string;
  /** Optional: annotations from V4 layer to attach at headline. */
  headline_annotations?: ScoreAnnotation[];
}

export function computeRRLite(input: RRLiteInput): RRLiteResult {
  const { composites, ise_state, computed_at } = input;
  const composite_subset: CompositeId[] = ['SRC', 'SBL', 'AMP'];

  // Filter to composites with valid scores.
  const present_keys: string[] = composite_subset.filter(
    (id) => composites[id]?.value !== null
  );

  if (present_keys.length === 0) {
    return {
      field_name: 'rr_lite',
      composite_subset,
      composites,
      any_cascade_rim: composite_subset.some((id) => composites[id]?.cascade_rim_active === true),
      ise_state_at_compute: ise_state,
      value: null,
      band: null,
      degradation: 'INSUFFICIENT',
      provenance: 'UNKNOWN_METHOD',
      breakdown: Object.fromEntries(composite_subset.map((id) => [id, null])),
      weights_used: {},
      computed_at,
    };
  }

  const r = redistributeWeights(present_keys, RR_WEIGHTS);
  const values: Record<string, number> = {};
  for (const k of present_keys) {
    values[k] = composites[k as CompositeId]!.value!;
  }
  const headline_value = clampScore(weightedSum(values, r.weights));
  const band = resolveBand(headline_value);

  const provenance_pool = composite_subset.map((id) => composites[id]?.provenance);
  const provenance =
    provenance_pool.some((p) => p === 'UNKNOWN_METHOD')
      ? 'UNKNOWN_METHOD'
      : provenance_pool.some((p) => p === 'PENDING_VALIDATION')
        ? 'PENDING_VALIDATION'
        : 'VALIDATED';

  const any_partial = composite_subset.some(
    (id) => composites[id]?.degradation === 'PARTIAL' || composites[id]?.degradation === 'INSUFFICIENT'
  );
  const degradation = any_partial || r.redistributed ? 'PARTIAL' : 'FULL';

  const any_cascade_rim = composite_subset.some((id) => composites[id]?.cascade_rim_active === true);

  return {
    field_name: composite_subset.length === 8 ? 'rr' : 'rr_lite',
    composite_subset,
    composites,
    any_cascade_rim,
    ise_state_at_compute: ise_state,
    value: headline_value,
    band,
    degradation,
    provenance,
    breakdown: {
      SRC: composites.SRC?.value ?? null,
      SBL: composites.SBL?.value ?? null,
      AMP: composites.AMP?.value ?? null,
    },
    weights_used: r.weights,
    annotations: input.headline_annotations,
    computed_at,
  };
}
