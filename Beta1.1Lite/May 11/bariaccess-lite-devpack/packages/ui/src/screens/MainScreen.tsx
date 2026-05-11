/**
 * MainScreen — production composition of Lite Beta UI.
 *
 * Wraps:
 *   PhoneFrame → StatusBar → BariAccess header → RhythmBoard (cards + Bookshelf) →
 *   ConstellationPanel (Row 1 + Ollie's Space + AI Playground + Daily Pulse) →
 *   conditional overlays from active JotForm.
 *
 * Data: today's scores from backend (TanStack Query), JotForm state from Zustand.
 */

import React from 'react';
import { PhoneFrame } from '../components/PhoneFrame.js';
import { StatusBar } from '../components/StatusBar.js';
import { RhythmBoard, HRVCard, EducationalCard, MemorySnapCard, SignalBoardCard } from '../surfaces/RhythmBoard/index.js';
import { RoutineBookshelf } from '../surfaces/RoutineBookshelf/index.js';
import { ConstellationPanel } from '../surfaces/ConstellationPanel/index.js';
import { JotFormPrompt } from '../surfaces/Overlays/JotFormPrompt.js';
import { WorkPad } from '../surfaces/WorkPad/index.js';
import { ReminderPicker } from '../surfaces/Overlays/ReminderPicker.js';
import { ParkingCounter } from '../surfaces/Overlays/ParkingCounter.js';

import { useExpressionState } from '../hooks/useExpressionState.js';
import { useAbaStore } from '../state/abaStore.js';
import { useJotFormStore } from '../state/jotformStore.js';
import { useTodayScores } from '../hooks/useTodayScores.js';
import { useJotFormLifecycleTick } from '../hooks/useJotFormLifecycleTick.js';

import { acceptNow, deferLater, pickReminder, completeJotForm } from '../flows/jotFormFlow.js';
import { CASCADE_RIM_COLOR } from '../theme/palette.js';

import { Q_LABEL } from '../canon/constants.js';
import type { Row1TileData } from '../surfaces/ConstellationPanel/Row1Tiles.js';

interface MainScreenProps {
  userId: string;
}

export const MainScreen: React.FC<MainScreenProps> = ({ userId }) => {
  const { current: expression, isNight } = useExpressionState();
  const abaName = useAbaStore((s) => s.name);
  useJotFormLifecycleTick();

  const { data: scores } = useTodayScores(userId);
  const foregroundJot = useJotFormStore((s) =>
    s.foregroundId ? s.items[s.foregroundId] : null,
  );
  const parkedCount = useJotFormStore(
    (s) => Object.values(s.items).filter((i) => i.status === 'PARKED').length,
  );

  // Map backend scores into Row 1 tile values.
  // ScoreDailyRollup → rr_lite.composites.SRC/SBL/AMP (per @bariaccess-lite/shared types).
  const rrLite = scores?.rr_lite;
  const src = rrLite?.composites.SRC;
  const rrValue = rrLite?.value ?? '—';
  const rrRim = src?.cascade_rim_active ? CASCADE_RIM_COLOR : null;

  const tiles: Row1TileData[] = [
    { label: 'R&R', value: rrValue, rim: rrRim },
    { label: 'Healthspan', value: '88' },        // TODO: backend wiring
    { label: 'My Blueprint', value: '86' },      // TODO: backend wiring
    { label: 'Inner Circle', value: '52' },      // TODO: backend wiring
  ];

  // AI Playground default — visible if a JotForm is foregrounded
  const aiPlayground = foregroundJot
    ? {
        visible: true,
        text: foregroundJot.body ?? 'Use the work pad to finish this card.',
        expression,
        activeSpeaker: 'ollie' as const,
      }
    : { visible: false, text: '', expression, activeSpeaker: null };

  const ollieText = foregroundJot?.title ?? 'Good morning.';

  return (
    <PhoneFrame isNight={isNight}>
      <StatusBar />
      <Header />

      {foregroundJot?.status === 'PARKED' && <ParkingCounter />}

      <RhythmBoard>
        <div className="grid grid-cols-2 gap-2">
          <HRVCard ms={55} delta={0} />
          <EducationalCard
            title="Programs · two tracks"
            body="Learn covers education a…"
          />
        </div>
        <MemorySnapCard />
        <SignalBoardCard
          rows={[
            { label: 'Sleep Score',   pct: 82, value: '82' },
            { label: 'Deep Sleep',    pct: 78, value: '2.5h' },
            { label: 'Resting HR',    pct: 70, value: '68' },
            { label: 'Temperature',   pct: 90, value: 'Normal' },
            { label: 'O2 Saturation', pct: 95, value: 'Normal' },
          ]}
        />
        <div className="flex-1" />
        <RoutineBookshelf state={{ morning: 5, midday: 0, evening: 0, mOrange: 0 }} />
      </RhythmBoard>

      <ConstellationPanel
        tiles={tiles}
        ollieText={ollieText}
        expression={expression}
        aiPlayground={aiPlayground}
        abaName={abaName}
        pulseBadges={{ FAB: foregroundJot ? 1 : 0, ITB: 4, PARK: parkedCount }}
      />

      {foregroundJot?.status === 'ANNOUNCED' && (
        <JotFormPrompt
          expression={expression}
          onYesNow={() => acceptNow(foregroundJot.id)}
          onYesLater={() => deferLater(foregroundJot.id)}
          onNo={() => deferLater(foregroundJot.id)}
        />
      )}
      {foregroundJot?.status === 'WORKPAD_OPEN' && (
        <WorkPad
          title={foregroundJot.title}
          body={foregroundJot.body}
          progressPct={0}
          onStart={() => completeJotForm(foregroundJot.id)}
          onSaveToQ={() => deferLater(foregroundJot.id)}
        />
      )}
      {foregroundJot?.status === 'REMINDER_SHOWN' && (
        <ReminderPicker onPick={(ms) => pickReminder(foregroundJot.id, ms)} />
      )}
    </PhoneFrame>
  );
};

const Header: React.FC = () => (
  <div className="flex items-center justify-between px-5 pb-3" style={{ color: '#0A0A0A' }}>
    <div className="flex flex-col gap-[3px]">
      <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
      <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
      <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
    </div>
    <div className="text-[13px] tracking-[0.22em] font-light">
      BARIACCESS<sup className="text-[7px]">TM</sup>
    </div>
    <div className="text-[13px] font-semibold">{Q_LABEL}</div>
  </div>
);
