/**
 * QUERIES — Canonical Cosmos DB query patterns
 * 
 * Source canon:
 *   - PAC-ISE-004 v1.0A §5 (canonical query patterns)
 *   - CCO-RR-PYRAMID-ADD-PATCH-001 v1.0 §6 (composite query)
 *   - CCO-UX-RBSHELF-PATCH-001 v1.0 §6 (slot/cascade queries)
 * 
 * All queries return SQL strings + parameter bindings.
 * Execution uses @azure/cosmos SDK (wired in Phase 2C).
 */

// ─────────────────────────────────────────────────────────────────────────────
// PARAMETERIZED QUERY TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface ParameterizedQuery {
  query: string;
  parameters: Array<{ name: string; value: string | number | boolean }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISE QUERIES (PAC-ISE-004 §5)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get current ISE state for user (PAC-ISE-004 §5.1).
 */
export function queryGetCurrentISE(userId: string): ParameterizedQuery {
  return {
    query: 'SELECT * FROM c WHERE c.id = @userId',
    parameters: [{ name: '@userId', value: userId }]
  };
}

/**
 * Get recent N transitions for user, descending by transitionAt (PAC-ISE-004 §5.2).
 */
export function queryRecentTransitions(
  userId: string,
  limit: number = 20
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.transitionAt DESC OFFSET 0 LIMIT @limit',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@limit', value: limit }
    ]
  };
}

/**
 * Get transitions in a date range (PAC-ISE-004 §5.3).
 */
export function queryTransitionsInRange(
  userId: string,
  startDateISO: string,
  endDateISO: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND c.transitionAt >= @startDate AND c.transitionAt <= @endDate ORDER BY c.transitionAt DESC',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@startDate', value: startDateISO },
      { name: '@endDate', value: endDateISO }
    ]
  };
}

/**
 * Get governance override frequency (PAC-ISE-004 §5.5).
 */
export function queryGovernanceOverrideCount(
  startDateISO: string
): ParameterizedQuery {
  return {
    query:
      'SELECT VALUE COUNT(1) FROM c WHERE c.governanceApplied = true AND c.transitionAt >= @startDate',
    parameters: [{ name: '@startDate', value: startDateISO }]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITE QUERIES (G2 §6)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get count of LIVE composites in orange/red bands (G2 §6 — Signal 4 input).
 * 
 * Per G2 §5.3: composites in `accruing` state are NOT counted in `composites_in_orange`.
 * Only `state = "live"` AND beacon_band 4–7 are counted.
 */
export function queryCompositesInOrangeCount(
  userId: string
): ParameterizedQuery {
  return {
    query:
      'SELECT VALUE COUNT(1) FROM c WHERE c.userId = @userId AND c.state = "live" AND c.beacon_band >= 4 AND c.beacon_band <= 7',
    parameters: [{ name: '@userId', value: userId }]
  };
}

/**
 * Get count of LIVE composites in red band only (G2 §6 — Signal 4 input).
 */
export function queryCompositesInRedCount(userId: string): ParameterizedQuery {
  return {
    query:
      'SELECT VALUE COUNT(1) FROM c WHERE c.userId = @userId AND c.state = "live" AND c.beacon_band = 7',
    parameters: [{ name: '@userId', value: userId }]
  };
}

/**
 * Get all composite states for a user (R&R card render).
 */
export function queryAllCompositeStates(userId: string): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.compositeName ASC',
    parameters: [{ name: '@userId', value: userId }]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SLOT QUERIES (G3 §6)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all slots for a user on a specific date.
 */
export function querySlotsForDate(
  userId: string,
  dateYYYYMMDD: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND c.date = @date ORDER BY c.window_start_ts ASC',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@date', value: dateYYYYMMDD }
    ]
  };
}

/**
 * Get slot drift count for the last 24 hours (G3 §3 — Signal 4 input).
 * Counts slots with final_state = 'orange' OR currently in_window with drift_detected.
 */
export function querySlotDriftCount24h(
  userId: string,
  isoTimestamp24hAgo: string
): ParameterizedQuery {
  return {
    query: `SELECT VALUE COUNT(1) FROM c
            WHERE c.userId = @userId
              AND (
                (c.final_state = "orange" AND c.final_state_locked_at >= @cutoff)
                OR
                (c.lifecycle_state = "in_window" AND c.drift_detected_in_window = true)
              )`,
    parameters: [
      { name: '@userId', value: userId },
      { name: '@cutoff', value: isoTimestamp24hAgo }
    ]
  };
}

/**
 * Get slot completion events in last 7 days (Signal 5 — FCS + ORI).
 */
export function queryRecentSlotCompletions(
  userId: string,
  isoTimestamp7dAgo: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND c.actual_end_ts >= @cutoff AND c.lifecycle_state = "post_window" ORDER BY c.actual_end_ts DESC',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@cutoff', value: isoTimestamp7dAgo }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EFFORT QUERIES (G1)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get last 7 days of Effort Score daily snapshots (Signal 6 — slope input).
 * Per G7: Resolver READS this, does NOT recompute.
 */
export function queryEffortLast7Days(
  userId: string,
  isoTimestamp7dAgo: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.user_id = @userId AND c.computed_at >= @cutoff ORDER BY c.date ASC',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@cutoff', value: isoTimestamp7dAgo }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY ENGAGEMENT ROLLUP QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get last 7 daily engagement rollups (Signal 5 source).
 */
export function queryEngagementRollupLast7Days(
  userId: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.date DESC OFFSET 0 LIMIT 7',
    parameters: [{ name: '@userId', value: userId }]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL QUERIES (G5 — HIPAA REDACTION HAPPENS AT API LAYER, NOT HERE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get journal entries for user (full 9 columns from Cosmos).
 * 
 * ⚠️ Caller MUST apply redaction via redaction-layer.ts before returning to API.
 * This query returns the FULL document — redaction is API-layer responsibility.
 */
export function queryJournalEntries(
  userId: string,
  limit: number = 50,
  includeRevoked: boolean = false
): ParameterizedQuery {
  if (includeRevoked) {
    return {
      query:
        'SELECT * FROM c WHERE c.userId = @userId ORDER BY c._ts DESC OFFSET 0 LIMIT @limit',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@limit', value: limit }
      ]
    };
  }
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND IS_NULL(c.revoked_at) ORDER BY c._ts DESC OFFSET 0 LIMIT @limit',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@limit', value: limit }
    ]
  };
}

/**
 * Get a specific journal entry by ID.
 */
export function queryJournalEntryById(
  userId: string,
  entryId: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND c.entry_id = @entryId',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@entryId', value: entryId }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MENTAL WELLBEING QUERIES (G6)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get unresolved mental wellbeing triggers for user.
 */
export function queryActiveSafetyTriggers(userId: string): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND IS_NULL(c.resolved_at) ORDER BY c.detection_at DESC',
    parameters: [{ name: '@userId', value: userId }]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FIREFLIES QUERIES (G6 — gate by HIPAA flags)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get Fireflies calls for user — only those with both HIPAA gates active.
 */
export function queryIngestedFirefliesCalls(
  userId: string
): ParameterizedQuery {
  return {
    query:
      'SELECT * FROM c WHERE c.userId = @userId AND c.hipaa_baa_active = true AND NOT IS_NULL(c.consent_recorded_at) AND IS_NULL(c.revoked_at) ORDER BY c.call_started_at DESC',
    parameters: [{ name: '@userId', value: userId }]
  };
}
