/**
 * BariAccess Beta — Disengagement Detection + Medication Flag Upgrade Jobs
 *
 * Run alongside nightly-compute. Reads effort_daily_rollup, writes flags.
 */

import { randomUUID } from 'node:crypto';
import { checkDisengagement } from '../scoring';
import type {
  CohortMember,
  DisengagementFlag,
  EffortDailyRollup,
} from '@bariaccess/shared';

// ────────────────────────────────────────────────────────────
// DISENGAGEMENT RUNNER
// ────────────────────────────────────────────────────────────
export async function runDisengagementCheck(date: string) {
  const members = await loadAllCohortMembers();
  const flagsCreated: DisengagementFlag[] = [];

  for (const m of members) {
    if (m.beta_started_at == null) continue;
    const recent = await loadRecentRollups(m.user_id, date, 7);
    const lastInteractionDays = await loadLastAppInteractionDaysAgo(
      m.user_id,
      date
    );

    const check = checkDisengagement(recent, lastInteractionDays);
    if (check.flagged && check.rule && check.action) {
      const existing = await loadActiveFlag(m.user_id, check.rule);
      if (!existing) {
        const flag: DisengagementFlag = {
          flag_id: randomUUID(),
          user_id: m.user_id,
          archetype: m.archetype,
          flagged_at: new Date().toISOString(),
          rule: check.rule,
          action: check.action,
          resolved: false,
          resolved_at: null,
        };
        await writeFlag(flag);
        flagsCreated.push(flag);
        console.log(
          `[disengagement] ${m.user_id} flagged: ${check.rule} → ${check.action}`
        );
      }
    }
  }
  return flagsCreated;
}

// ────────────────────────────────────────────────────────────
// MEDICATION FLAG UPGRADE — VAL_DEFAULT_26
// When intake reveals new medications (esp. GLP-1, insulin),
// auto-upgrade the relevant FAB to critical_flag=true.
// ────────────────────────────────────────────────────────────
export async function runMedicationFlagUpgrade() {
  const recentIntakes = await loadRecentIntakes();
  let upgraded = 0;

  for (const intake of recentIntakes) {
    const meds = extractMedicationsFromIntake(intake);
    if (meds.length === 0) continue;

    for (const med of meds) {
      const isCritical =
        med.includes('glp-1') ||
        med.includes('semaglutide') ||
        med.includes('tirzepatide') ||
        med.includes('insulin') ||
        med.includes('warfarin') ||
        med.includes('digoxin');

      if (!isCritical) continue;

      const fabsToUpgrade = await loadFABsForMember(intake.user_id, [
        'medication',
        'medication_check',
        'glp-1',
      ]);
      for (const fab of fabsToUpgrade) {
        if (!fab.critical_flag) {
          await updateFABCritical(fab.fab_id, true);
          upgraded++;
          console.log(
            `[medication-upgrade] ${intake.user_id}/${fab.fab_id} → critical=true (${med})`
          );
        }
      }
    }
  }
  console.log(`[medication-upgrade] upgraded ${upgraded} FABs`);
  return upgraded;
}

function extractMedicationsFromIntake(intake: any): string[] {
  const raw = intake.responses?.medications ?? intake.responses?.q_medications ?? '';
  if (typeof raw !== 'string') return [];
  return raw
    .toLowerCase()
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Stubs
async function loadAllCohortMembers(): Promise<CohortMember[]> {
  throw new Error('wire to Cosmos');
}
async function loadRecentRollups(
  user_id: string,
  date: string,
  days: number
): Promise<EffortDailyRollup[]> {
  throw new Error('wire to Cosmos');
}
async function loadLastAppInteractionDaysAgo(
  user_id: string,
  date: string
): Promise<number> {
  throw new Error('wire to Cosmos');
}
async function loadActiveFlag(
  user_id: string,
  rule: DisengagementFlag['rule']
): Promise<DisengagementFlag | null> {
  throw new Error('wire to Cosmos');
}
async function writeFlag(flag: DisengagementFlag): Promise<void> {
  throw new Error('wire to Cosmos');
}
async function loadRecentIntakes(): Promise<any[]> {
  throw new Error('wire to Cosmos');
}
async function loadFABsForMember(
  user_id: string,
  name_keywords: string[]
): Promise<any[]> {
  throw new Error('wire to Cosmos');
}
async function updateFABCritical(
  fab_id: string,
  critical: boolean
): Promise<void> {
  throw new Error('wire to Cosmos');
}

if (require.main === module) {
  const today = new Date().toISOString().slice(0, 10);
  Promise.all([runDisengagementCheck(today), runMedicationFlagUpgrade()])
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
