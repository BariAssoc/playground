/**
 * SimulationScreen — 12-step day-in-the-life walkthrough.
 *
 * Ported from CCO-LITE-BETA-UI-001_SIMULATION.jsx (May 11, 2026 build).
 * Demonstrates §5 JotForm Flow + §6 Dual AI Protocol end-to-end without
 * needing real backend wiring. Use for Zakiy + Val demo + Biohackers NYC.
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

import { PhoneFrame } from '../components/PhoneFrame.js';
import { StatusBar } from '../components/StatusBar.js';
import { HRVCard, EducationalCard, MemorySnapCard } from '../surfaces/RhythmBoard/index.js';
import { RoutineBookshelf } from '../surfaces/RoutineBookshelf/index.js';
import { Row1Tiles, type Row1TileData } from '../surfaces/ConstellationPanel/Row1Tiles.js';
import { OllieSpace } from '../surfaces/ConstellationPanel/OllieSpace.js';
import { AIPlayground } from '../surfaces/ConstellationPanel/AIPlayground.js';
import { DailyPulse } from '../surfaces/ConstellationPanel/DailyPulse.js';
import { JotFormPrompt } from '../surfaces/Overlays/JotFormPrompt.js';
import { WorkPad } from '../surfaces/WorkPad/index.js';
import { ReminderPicker } from '../surfaces/Overlays/ReminderPicker.js';
import { ParkingCounter } from '../surfaces/Overlays/ParkingCounter.js';

import { EXPRESSION, SURFACE, CASCADE_RIM_COLOR } from '../theme/palette.js';
import { useAbaStore } from '../state/abaStore.js';
import type { SimStep } from '../types/ui.js';
import { Q_LABEL } from '../canon/constants.js';

const STEPS: readonly SimStep[] = [
  { n: 1, title: 'Idle morning', phase: 'MORNING', expression: 'GREEN',
    ollieText: 'Good morning. Day is open.',
    bubbleVisible: false, bubbleText: null,
    bookshelf: { morning: 0, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 0, activeSpeaker: null, overlay: null, isNight: false, rRimColor: null,
    caption: 'Day begins. Bookshelf empty. Constellation Panel idle.',
    canonRef: '§3 Surface Inventory — Rhythm Board resting state' },
  { n: 2, title: '🔵 Ollie announces JotForm', phase: 'MORNING', expression: 'BLUE',
    ollieText: 'You got it — are you ready — yes or no?',
    bubbleVisible: false,
    bubbleText: null,
    bookshelf: { morning: 0, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: 'YES_NO', isNight: false, rRimColor: null,
    caption: "Announcement initiated through Ollie's Space. FAB badge appears.",
    canonRef: '§5 Steps 1 + 2 — Ollie announces JotForm with "are you ready" prompt' },
  { n: 3, title: '🟢 Yes → Now → WorkPad opens', phase: 'MORNING', expression: 'GREEN',
    ollieText: "Card open. Let's knock this out.", bubbleVisible: false, bubbleText: null,
    bookshelf: { morning: 0, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: 'WORKPAD', isNight: false, rRimColor: null,
    caption: 'WorkPad opens halfway over Constellation Panel.',
    canonRef: '§5 Step 3a — Yes → Now → Card opens, WorkPad halfway' },
  { n: 4, title: '🟢 MORNING complete', phase: 'MORNING', expression: 'GREEN',
    ollieText: 'Goodmorning! Strong start to the day.', bubbleVisible: true,
    bubbleText: 'Strong night, great job. Your signal board is looking good. You are building consistency. Keep this going.',
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 0, activeSpeaker: 'ollie', overlay: null, isNight: false, rRimColor: null,
    caption: 'FAB completed. Bookshelf MORNING fills green. On track.',
    canonRef: '§2 🟢 Green — FAB completed / on track' },
  { n: 5, title: '🔵 Midday JotForm announced', phase: 'MIDDAY', expression: 'BLUE',
    ollieText: 'You got it — are you ready — yes or no?', bubbleVisible: false, bubbleText: null,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: 'YES_NO', isNight: false, rRimColor: null,
    caption: 'Second JotForm of the day announced.',
    canonRef: '§5 Steps 1 + 2 — repeat for midday' },
  { n: 6, title: '🟠 Yes — Later → deferred', phase: 'MIDDAY', expression: 'ORANGE',
    ollieText: "Got it. Bookshelf turning — I'll check in later.",
    bubbleVisible: false, bubbleText: null,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: null, isNight: false, rRimColor: CASCADE_RIM_COLOR,
    caption: 'Patient deferred. Bookshelf MIDDAY rotates to orange. R&R rim turns orange (cascade rim active).',
    canonRef: '§5 Step 3b — Yes → Later → Routine Bookshelf turns orange' },
  { n: 7, title: '🟠 Reminder picker — ONE CHANCE', phase: 'MIDDAY', expression: 'ORANGE',
    ollieText: 'When should I remind you?', bubbleVisible: false, bubbleText: null,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: 'REMINDER', isNight: false, rRimColor: CASCADE_RIM_COLOR,
    caption: '30 min / 1 hour / never. One chance only — no second prompt if dismissed.',
    canonRef: '§5 Step 4 — Reminder options · ONE CHANCE ONLY' },
  { n: 8, title: '🟠 No response → Parking Lot', phase: 'MIDDAY', expression: 'ORANGE',
    ollieText: "I'll keep it in your Parking Lot.", bubbleVisible: true,
    bubbleText: 'Held in Parking Lot. 72 hours to come back to it. After that, it moves to Three Dots archive — marked incomplete.',
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: 'PARKING_COUNTER', isNight: false, rRimColor: CASCADE_RIM_COLOR,
    caption: 'JotForm dropped to Parking Lot. 72-hour window starts. No nagging.',
    canonRef: '§5 Step 5 — Drops to Parking Lot — 72 hours' },
  { n: 9, title: '🔵 Evening — Ollie introduces ABA', phase: 'EVENING', expression: 'BLUE',
    ollieText: 'Let me bring {ABA}.', bubbleVisible: false, bubbleText: null,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'ollie', overlay: null, isNight: false, rRimColor: CASCADE_RIM_COLOR,
    caption: 'Evening trigger. Dual AI handoff initiated. ABA never appears alone — Ollie introduces.',
    canonRef: '§6 Evening trigger — "Let me bring [ABA name]"' },
  { n: 10, title: '🟣 ABA — Day 1 message', phase: 'EVENING', expression: 'PURPLE',
    ollieText: 'Let me bring {ABA}.', bubbleVisible: true,
    bubbleText: "You're doing a great job. Dr. Andrei is sending you a great message soon — we'll go live.",
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'aba', overlay: null, isNight: false, rRimColor: CASCADE_RIM_COLOR,
    caption: "ABA active. Ollie's owl DIMS but stays visible. ABA icon BRIGHTENS. 🟣 Purple state.",
    canonRef: '§6 ABA Day-1 message + §2 🟣 AI Playground active' },
  { n: 11, title: '🟣 Evening ambience handoff', phase: 'EVENING', expression: 'PURPLE',
    ollieText: "I'll let {ABA} tell you how to get ready for tonight.", bubbleVisible: true,
    bubbleText: 'Time to wind down. Bookshelf evening is filling. Breathing slows. Lights ease.',
    bookshelf: { morning: 5, midday: 0, evening: 3, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'aba', overlay: null, isNight: false, rRimColor: CASCADE_RIM_COLOR,
    caption: 'Evening ambience. Ollie cues, ABA delivers night routine. Bookshelf evening fills.',
    canonRef: '§6 Evening ambience — "I\\u2019ll let [ABA] tell you..."' },
  { n: 12, title: '⚪ Night mode', phase: 'NIGHT', expression: 'WHITE',
    ollieText: 'Quieting down. Breathing slow.', bubbleVisible: true,
    bubbleText: 'Lights low. Let your body wind down. I will be here in the morning.',
    bookshelf: { morning: 5, midday: 0, evening: 5, mOrange: 5 },
    fabBadge: 1, activeSpeaker: 'aba', overlay: null, isNight: true, rRimColor: CASCADE_RIM_COLOR,
    caption: 'Night mode. Phone goes opaque white. Day complete.',
    canonRef: '§2 ⚪ Opaque White — relaxation / breathing / sleep' },
] as const;

const Header: React.FC = () => (
  <div className="flex items-center justify-between px-5 pb-3" style={{ color: SURFACE.ink }}>
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

const interpolate = (text: string, abaName: string): string =>
  text.replace(/\{ABA\}/g, abaName);

export const SimulationScreen: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const abaName = useAbaStore((s) => s.name);
  const setName = useAbaStore((s) => s.setName);
  const step = STEPS[idx];

  const goBack = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(STEPS.length - 1, i + 1));
  const restart = () => setIdx(0);

  const tiles: Row1TileData[] = [
    { label: 'R&R',          value: 91, rim: step.rRimColor },
    { label: 'Healthspan',   value: 88 },
    { label: 'My Blueprint', value: 86 },
    { label: 'Inner Circle', value: 52 },
  ];

  return (
    <div className="min-h-screen w-full body-font" style={{ background: SURFACE.pageBg }}>
      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex flex-col items-start mb-6">
          <div className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: '#9A3412' }}>
            CCO-LITE-BETA-UI-001 · v1.0 LOCKED · Simulation
          </div>
          <h1 className="display-font text-3xl md:text-4xl leading-tight font-medium">
            A day in <em className="font-light">BariAccess Lite</em>
          </h1>
          <p className="mt-2 text-[12px] max-w-xl text-gray-600">
            12 steps. Morning JotForm → completion → midday deferral → Parking Lot →
            evening Dual AI handoff → night mode. Tap <strong>Next</strong> to advance.
          </p>
        </div>

        <PhoneFrame isNight={step.isNight}>
          <StatusBar />
          <Header />

          {step.overlay === 'PARKING_COUNTER' && <ParkingCounter />}

          <div className="px-3 pt-1 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-2">
              <HRVCard ms={55} />
              <EducationalCard title="Programs · two tracks" body="Learn covers education a…" />
            </div>
            <MemorySnapCard />
            <div className="flex-1" />
            <RoutineBookshelf state={step.bookshelf} />
          </div>

          <div className="px-3 pt-2 pb-2" style={{ background: SURFACE.panelBg }}>
            <Row1Tiles tiles={tiles} />
            <div className="mt-2">
              <OllieSpace
                text={interpolate(step.ollieText, abaName)}
                expression={step.expression}
              />
            </div>
            <AIPlayground
              visible={step.bubbleVisible}
              text={interpolate(step.bubbleText ?? '', abaName)}
              expression={step.expression}
              activeSpeaker={step.activeSpeaker}
              abaName={abaName}
            />
            <DailyPulse badges={{ FAB: step.fabBadge, ITB: 4 }} />
          </div>

          {step.overlay === 'YES_NO' && (
            <JotFormPrompt
              expression={step.expression}
              onYesNow={goNext}
              onYesLater={goNext}
              onNo={goNext}
            />
          )}
          {step.overlay === 'WORKPAD' && (
            <WorkPad
              title="What is HRV?"
              subtitle="Heart Rate Variability"
              body="Daily learning · short comprehension check. Your prescriber stays in charge of medical decisions."
              progressPct={0}
              onStart={goNext}
              onSaveToQ={goNext}
            />
          )}
          {step.overlay === 'REMINDER' && <ReminderPicker onPick={() => goNext()} />}
        </PhoneFrame>

        <div className="flex items-center justify-center gap-3 mt-5">
          <button onClick={goBack} disabled={idx === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              background: idx === 0 ? '#F3F4F6' : '#FFFFFF',
              color: idx === 0 ? '#9CA3AF' : '#111827',
              border: '1px solid #E5E7EB',
              boxShadow: idx === 0 ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
            }}>
            <ChevronLeft size={16} /> Back
          </button>
          <div className="px-4 py-2.5 rounded-xl text-[12px] font-semibold tabular-nums"
            style={{ background: '#111827', color: '#FFFFFF', minWidth: 110, textAlign: 'center' }}>
            Step {idx + 1} / {STEPS.length}
          </div>
          <button onClick={goNext} disabled={idx === STEPS.length - 1}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              background: idx === STEPS.length - 1 ? '#F3F4F6' : '#0A0A0A',
              color: idx === STEPS.length - 1 ? '#9CA3AF' : '#FFFFFF',
              border: '1px solid #0A0A0A',
            }}>
            Next <ChevronRight size={16} />
          </button>
          <button onClick={restart} className="ml-2 flex items-center gap-1 px-3 py-2.5 rounded-xl text-[12px] font-medium"
            style={{ background: '#FFFFFF', color: '#6B7280', border: '1px solid #E5E7EB' }}>
            <RotateCcw size={14} /> Restart
          </button>
        </div>

        <div className="mt-5 max-w-xl mx-auto">
          <div className="rounded-xl p-4 bg-white border border-gray-200">
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500">
                {step.title}
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: EXPRESSION[step.expression].text }}>
                {step.phase}
              </div>
            </div>
            <div className="text-[13px] leading-relaxed text-gray-800 mb-2">{step.caption}</div>
            <div className="text-[11px] font-mono pt-2 border-t border-dashed border-gray-200 text-gray-500">
              Canon: {step.canonRef}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500 mr-2">
            ABA name
          </span>
          {['Max', 'Atlas', 'Athos'].map((n) => {
            const active = abaName === n;
            return (
              <button key={n} onClick={() => setName(n)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: active ? '#111827' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#374151',
                  border: '1px solid #E5E7EB',
                }}>
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
