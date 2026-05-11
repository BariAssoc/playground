import React, { useState, useEffect } from 'react';
import {
  Clapperboard,
  Stethoscope,
  Compass,
  RefreshCw,
  TrendingUp,
  Hourglass,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  Sparkles,
  X,
} from 'lucide-react';

/* ===========================================================
   CCO-LITE-BETA-UI-001 v1.0 — Day-in-the-Life Simulation
   12 steps stepping through a real Lite Beta day:
   morning JotForm → completion → midday deferral → Parking Lot
   → evening Dual AI handoff → night mode.
   Each step shows the phone state + the canon rule firing.
   =========================================================== */

const PALETTE = {
  BLUE:   { text: '#1E40AF', bubbleBg: '#EFF6FF', border: '#93C5FD', dot: '#3B82F6' },
  GREEN:  { text: '#166534', bubbleBg: '#F0FDF4', border: '#86EFAC', dot: '#22C55E' },
  ORANGE: { text: '#9A3412', bubbleBg: '#FFF7ED', border: '#FDBA74', dot: '#F97316' },
  RED:    { text: '#991B1B', bubbleBg: '#FEF2F2', border: '#FCA5A5', dot: '#EF4444' },
  PURPLE: { text: '#6B21A8', bubbleBg: '#FAF5FF', border: '#D8B4FE', dot: '#A855F7' },
  WHITE:  { text: '#374151', bubbleBg: '#FFFFFF', border: '#E5E7EB', dot: '#D1D5DB' },
};

const STEPS = [
  {
    n: 1,
    title: 'Idle morning',
    phase: 'MORNING',
    color: 'GREEN',
    ollieText: 'Good morning. Day is open.',
    bubbleVisible: false,
    bubbleText: null,
    bookshelf: { morning: 0, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 0,
    activeSpeaker: null,
    overlay: null,
    isNight: false,
    rRimColor: null,
    caption: 'Day begins. Bookshelf empty. Constellation Panel idle.',
    canonRef: '§3 Surface Inventory — Rhythm Board resting state',
  },
  {
    n: 2,
    title: '🔵 Ollie announces JotForm',
    phase: 'MORNING',
    color: 'BLUE',
    ollieText: 'You got it — are you ready — yes or no?',
    bubbleVisible: false,
    bookshelf: { morning: 0, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: 'YES_NO',
    isNight: false,
    rRimColor: null,
    caption: 'Announcement initiated through Ollie\'s Space. FAB badge appears.',
    canonRef: '§5 Steps 1 + 2 — Ollie announces JotForm with "are you ready" prompt',
  },
  {
    n: 3,
    title: '🟢 Yes → Now → WorkPad opens',
    phase: 'MORNING',
    color: 'GREEN',
    ollieText: 'Card open. Let\'s knock this out.',
    bubbleVisible: false,
    bookshelf: { morning: 0, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: 'WORKPAD',
    isNight: false,
    rRimColor: null,
    caption: 'WorkPad opens halfway over Constellation Panel.',
    canonRef: '§5 Step 3a — Yes → Now → Card opens, WorkPad halfway',
  },
  {
    n: 4,
    title: '🟢 MORNING complete',
    phase: 'MORNING',
    color: 'GREEN',
    ollieText: 'Goodmorning! Strong start to the day.',
    bubbleVisible: true,
    bubbleText: 'Strong night, great job. Your signal board is looking good. You are building consistency. Keep this going.',
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 0,
    activeSpeaker: 'ollie',
    overlay: null,
    isNight: false,
    rRimColor: null,
    caption: 'FAB completed. Bookshelf MORNING fills green. On track.',
    canonRef: '§2 🟢 Green — FAB completed / on track',
  },
  {
    n: 5,
    title: '🔵 Midday JotForm announced',
    phase: 'MIDDAY',
    color: 'BLUE',
    ollieText: 'You got it — are you ready — yes or no?',
    bubbleVisible: false,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 0 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: 'YES_NO',
    isNight: false,
    rRimColor: null,
    caption: 'Second JotForm of the day announced.',
    canonRef: '§5 Steps 1 + 2 — repeat for midday',
  },
  {
    n: 6,
    title: '🟠 Yes — Later → deferred',
    phase: 'MIDDAY',
    color: 'ORANGE',
    ollieText: 'Got it. Bookshelf turning — I\'ll check in later.',
    bubbleVisible: false,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: null,
    isNight: false,
    rRimColor: '#F97316',
    caption: 'Patient deferred. Bookshelf MIDDAY rotates to orange. R&R rim turns orange (cascade rim active).',
    canonRef: '§5 Step 3b — Yes → Later → Routine Bookshelf turns orange',
  },
  {
    n: 7,
    title: '🟠 Reminder picker — ONE CHANCE',
    phase: 'MIDDAY',
    color: 'ORANGE',
    ollieText: 'When should I remind you?',
    bubbleVisible: false,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: 'REMINDER',
    isNight: false,
    rRimColor: '#F97316',
    caption: '30 min / 1 hour / never. One chance only — no second prompt if dismissed.',
    canonRef: '§5 Step 4 — Reminder options · ONE CHANCE ONLY',
  },
  {
    n: 8,
    title: '🟠 No response → Parking Lot',
    phase: 'MIDDAY',
    color: 'ORANGE',
    ollieText: 'I\'ll keep it in your Parking Lot.',
    bubbleVisible: true,
    bubbleText: 'Held in Parking Lot. 72 hours to come back to it. After that, it moves to Three Dots archive — marked incomplete.',
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: 'PARKING_COUNTER',
    isNight: false,
    rRimColor: '#F97316',
    caption: 'JotForm dropped to Parking Lot. 72-hour window starts. No nagging.',
    canonRef: '§5 Step 5 — Drops to Parking Lot — 72 hours',
  },
  {
    n: 9,
    title: '🔵 Evening — Ollie introduces Max',
    phase: 'EVENING',
    color: 'BLUE',
    ollieText: 'Let me bring Max.',
    bubbleVisible: false,
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'ollie',
    overlay: null,
    isNight: false,
    rRimColor: '#F97316',
    caption: 'Evening trigger. Dual AI handoff initiated. ABA never appears alone — Ollie introduces.',
    canonRef: '§6 Evening trigger — "Let me bring [ABA name]"',
  },
  {
    n: 10,
    title: '🟣 Max (ABA) — Day 1 message',
    phase: 'EVENING',
    color: 'PURPLE',
    ollieText: 'Let me bring Max.',
    bubbleVisible: true,
    bubbleText: 'You\'re doing a great job. Dr. Andrei is sending you a great message soon — we\'ll go live.',
    bookshelf: { morning: 5, midday: 0, evening: 0, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'aba',
    overlay: null,
    isNight: false,
    rRimColor: '#F97316',
    caption: 'ABA active. Ollie\'s owl DIMS but stays visible. ABA icon BRIGHTENS. 🟣 Purple state.',
    canonRef: '§6 ABA Day-1 message + §2 🟣 AI Playground active',
  },
  {
    n: 11,
    title: '🟣 Evening ambience handoff',
    phase: 'EVENING',
    color: 'PURPLE',
    ollieText: 'I\'ll let Max tell you how to get ready for tonight.',
    bubbleVisible: true,
    bubbleText: 'Time to wind down. Bookshelf evening is filling. Breathing slows. Lights ease.',
    bookshelf: { morning: 5, midday: 0, evening: 3, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'aba',
    overlay: null,
    isNight: false,
    rRimColor: '#F97316',
    caption: 'Evening ambience. Ollie cues, ABA delivers night routine. Bookshelf evening fills.',
    canonRef: '§6 Evening ambience — "I\'ll let [ABA] tell you..."',
  },
  {
    n: 12,
    title: '⚪ Night mode',
    phase: 'NIGHT',
    color: 'WHITE',
    ollieText: 'Quieting down. Breathing slow.',
    bubbleVisible: true,
    bubbleText: 'Lights low. Let your body wind down. I will be here in the morning.',
    bookshelf: { morning: 5, midday: 0, evening: 5, mOrange: 5 },
    fabBadge: 1,
    activeSpeaker: 'aba',
    overlay: null,
    isNight: true,
    rRimColor: '#F97316',
    caption: 'Night mode. Phone goes opaque white. Day complete.',
    canonRef: '§2 ⚪ Opaque White — relaxation / breathing / sleep',
  },
];

/* ============ atomic pieces ============ */

const PhoneShell = ({ children, isNight }) => (
  <div
    className="relative mx-auto rounded-[3rem] shadow-2xl"
    style={{
      width: '360px',
      height: '760px',
      background: isNight ? '#FAFAF9' : '#F4ECE6',
      border: '8px solid #1A1A1A',
      transition: 'background 700ms ease',
    }}
  >
    <div
      className="absolute left-1/2 -translate-x-1/2 rounded-full z-10"
      style={{ top: '12px', width: '110px', height: '28px', background: '#000' }}
    />
    <div className="w-full h-full overflow-hidden rounded-[2.4rem] flex flex-col relative">
      {children}
    </div>
  </div>
);

const StatusBar = () => (
  <div
    className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold"
    style={{ color: '#000', height: '36px' }}
  >
    <span>10:25</span>
    <span className="flex items-center gap-1">
      <Signal size={12} />
      <Wifi size={12} />
      <Battery size={14} />
    </span>
  </div>
);

const Header = () => (
  <div className="flex items-center justify-between px-5 pb-3" style={{ color: '#0A0A0A' }}>
    <div className="flex flex-col gap-[3px]">
      <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
      <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
      <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
    </div>
    <div className="text-[13px] tracking-[0.22em] font-light">
      BARIACCESS<sup className="text-[7px]">TM</sup>
    </div>
    <div className="text-[13px] font-semibold">Q</div>
  </div>
);

/* ============ Rhythm Board ============ */

const HRVCard = () => (
  <div className="rounded-2xl p-3 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
    <div className="flex items-baseline justify-between">
      <span className="text-[10px] font-semibold tracking-wider text-gray-500">HRV</span>
      <span className="text-[10px] text-green-500">+0 ms</span>
    </div>
    <div className="flex items-baseline gap-1 mt-1">
      <span className="text-3xl font-bold text-green-500" style={{ lineHeight: 1 }}>55</span>
      <span className="text-[10px] text-gray-500">ms</span>
    </div>
    <svg viewBox="0 0 100 22" className="w-full mt-2" style={{ height: '22px' }}>
      <polyline fill="none" stroke="#22C55E" strokeWidth="1.3"
        points="0,15 16,11 32,13 48,8 64,9 80,7 100,5" />
    </svg>
    <div className="flex justify-between text-[9px] mt-1 text-gray-500">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
    </div>
  </div>
);

const EducationalCard = () => (
  <div className="rounded-2xl p-3 bg-white flex flex-col justify-between"
    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
    <div>
      <div className="text-[10px] font-semibold tracking-wider text-gray-500">EDUCATIONAL</div>
      <div className="text-sm font-semibold leading-tight mt-1 text-gray-900">
        Programs · two tracks
      </div>
      <div className="text-[10px] mt-1 text-gray-500">Learn covers education a…</div>
    </div>
    <button className="mt-2 self-start px-3 py-1 rounded-full text-[11px] font-medium"
      style={{ border: '1px solid #3B82F6', color: '#3B82F6' }}>
      Explore ›
    </button>
  </div>
);

const MemorySnap = () => (
  <div className="grid grid-cols-2 gap-2 mt-2">
    <div className="rounded-xl overflow-hidden relative h-20"
      style={{ background: 'linear-gradient(135deg, #475569 0%, #334155 60%, #1E293B 100%)' }}>
      <div className="absolute top-2 left-2 flex items-center gap-1 text-white text-[9px] font-semibold tracking-wider">
        <Sparkles size={9} /> MEMORY SNAP
      </div>
      <div className="absolute bottom-1 left-2 text-white text-[9px] opacity-80">19h ago</div>
    </div>
    <div className="rounded-xl overflow-hidden relative h-20"
      style={{ background: 'linear-gradient(135deg, #D6BCA0 0%, #A78569 50%, #6B5848 100%)' }}>
      <div className="absolute bottom-1 right-2 text-white text-[9px] font-medium">View all ›</div>
    </div>
  </div>
);

const RoutineBookshelf = ({ bookshelf }) => {
  // 16 segments split visually into MORNING (idx 0-4), MIDDAY (5-10), EVENING (11-15)
  const segments = Array.from({ length: 16 }, (_, i) => {
    if (i < 5) {
      if (i < bookshelf.morning) return '#16A34A';
      return '#D1D5DB';
    } else if (i < 11) {
      if (i - 5 < bookshelf.midday) return '#16A34A';
      if (i - 5 < bookshelf.mOrange) return '#F97316';
      return '#D1D5DB';
    } else {
      if (i - 11 < bookshelf.evening) return '#16A34A';
      return '#D1D5DB';
    }
  });
  return (
    <div className="mt-3 px-1">
      <div className="flex gap-[2px]">
        {segments.map((color, i) => (
          <div key={i} className="flex-1 h-[10px] rounded-[2px]"
            style={{ background: color, transition: 'background 500ms ease' }} />
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[8px] tracking-wider text-gray-500">
        <span>MORNING</span>
        <span>MIDDAY</span>
        <span>EVENING</span>
      </div>
    </div>
  );
};

/* ============ Constellation Panel pieces ============ */

const Row1Tile = ({ label, value, rim }) => (
  <div className="rounded-xl px-2 py-1.5 flex flex-col bg-white"
    style={{
      border: rim ? `1.5px solid ${rim}` : '1px solid transparent',
      transition: 'border-color 500ms ease',
    }}>
    <span className="text-[9px] font-medium text-gray-500">{label}</span>
    <span className="text-lg font-bold leading-none mt-0.5 text-gray-900">{value}</span>
  </div>
);

const OllieSpaceLine = ({ step }) => {
  const p = PALETTE[step.color];
  return (
    <div className="rounded-xl text-center text-[11px] font-semibold py-2 px-3"
      style={{
        background: p.bubbleBg,
        border: `1.5px solid ${p.border}`,
        color: p.text,
        transition: 'all 500ms ease',
        minHeight: '36px',
      }}>
      {step.ollieText}
    </div>
  );
};

const OllieIcon = ({ active }) => (
  <div className="w-6 h-6 rounded-full flex items-center justify-center"
    style={{
      background: active ? '#92400E' : '#FCD34D',
      opacity: active ? 1 : 0.35,
      transition: 'opacity 500ms ease',
      fontSize: '14px',
    }}>🦉</div>
);

const ABAIcon = ({ active, initial }) => (
  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
    style={{
      background: active ? '#1F2937' : '#D1D5DB',
      color: '#FFFFFF',
      opacity: active ? 1 : 0.35,
      transition: 'opacity 500ms ease',
    }}>{initial}</div>
);

const AIPlayground = ({ step, abaName }) => {
  if (!step.bubbleVisible) return null;
  const p = PALETTE[step.color];
  const ollieActive = step.activeSpeaker === 'ollie';
  const abaActive = step.activeSpeaker === 'aba';
  return (
    <div className="rounded-2xl p-3 mt-2"
      style={{
        background: p.bubbleBg,
        border: `1.5px solid ${p.border}`,
        transition: 'all 500ms ease',
      }}>
      <div className="rounded-xl p-2.5 text-[11px] leading-snug text-center bg-white"
        style={{ color: p.text, border: `1px solid ${p.border}` }}>
        {step.bubbleText}
      </div>
      <div className="ml-3 mt-[-1px]">
        <div className="w-0 h-0" style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${p.border}`,
        }} />
      </div>
      <div className="flex items-center gap-2 mt-1 ml-1">
        <OllieIcon active={ollieActive} />
        <ABAIcon active={abaActive} initial={abaName.charAt(0)} />
        <span className="text-[9px] ml-1" style={{ color: p.text }}>
          {ollieActive ? 'Ollie speaking' : `${abaName} responding (Ollie present)`}
        </span>
      </div>
    </div>
  );
};

const DailyPulse = ({ fabBadge }) => {
  const items = [
    { Icon: Clapperboard, label: 'FAB', ring: '#EC4899', badge: fabBadge },
    { Icon: Stethoscope,  label: 'ITB', ring: '#F59E0B', badge: 4 },
    { Icon: Compass,      label: 'BEACON', ring: '#14B8A6', badge: null },
    { Icon: RefreshCw,    label: 'ROUTINE', ring: '#3B82F6', badge: null },
    { Icon: TrendingUp,   label: 'PROD', ring: '#F87171', badge: null },
    { Icon: Hourglass,    label: 'PARK', ring: '#A855F7', badge: null },
  ];
  return (
    <div className="grid grid-cols-6 gap-1 px-1 pt-2 pb-1">
      {items.map(({ Icon, label, ring, badge }, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center relative bg-white"
            style={{ border: `2px solid ${ring}` }}>
            <Icon size={14} color={ring} />
            {badge !== null && badge > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
                style={{ background: i === 0 ? '#E11D48' : '#8B5CF6' }}>{badge}</span>
            )}
          </div>
          <span className="text-[8px] font-semibold tracking-wide" style={{ color: '#2563EB' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ============ Overlays (per step) ============ */

const YesNoOverlay = ({ color }) => {
  const p = PALETTE[color];
  return (
    <div className="absolute left-3 right-3 bottom-[268px] z-20 rounded-2xl p-3 flex gap-2"
      style={{ background: '#FFFFFF', border: `1.5px solid ${p.border}`, boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
      <button className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white"
        style={{ background: p.dot }}>Yes — Now</button>
      <button className="flex-1 py-2 rounded-xl text-[12px] font-semibold"
        style={{ background: p.bubbleBg, color: p.text, border: `1px solid ${p.border}` }}>Yes — Later</button>
      <button className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-gray-500"
        style={{ background: '#F3F4F6' }}>No</button>
    </div>
  );
};

const WorkPadOverlay = () => (
  <div className="absolute left-0 right-0 bottom-0 z-20 rounded-t-3xl p-4 flex flex-col"
    style={{ background: '#FFFFFF', boxShadow: '0 -8px 30px rgba(0,0,0,0.15)', height: '52%' }}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[10px] font-semibold tracking-wider text-gray-500">WORKPAD · LEARN</div>
        <div className="text-base font-bold mt-1 text-gray-900">What is HRV?</div>
        <div className="text-[10px] text-gray-500">Heart Rate Variability</div>
      </div>
      <div className="text-[11px] font-semibold" style={{ color: '#22C55E' }}>0%</div>
    </div>
    <div className="mt-3 text-[11px] text-gray-700 leading-relaxed">
      Daily learning · short comprehension check. Your prescriber stays in charge of medical decisions.
    </div>
    <button className="mt-3 self-start px-4 py-2 rounded-full text-[12px] font-semibold text-white"
      style={{ background: '#22C55E' }}>
      Start quiz →
    </button>
    <button className="mt-2 self-start px-4 py-1.5 rounded-full text-[11px] font-medium"
      style={{ background: '#F3F4F6', color: '#374151' }}>
      Save to Q
    </button>
  </div>
);

const ReminderOverlay = () => {
  const p = PALETTE.ORANGE;
  return (
    <div className="absolute left-3 right-3 bottom-[268px] z-20 rounded-2xl p-3"
      style={{ background: '#FFFFFF', border: `1.5px solid ${p.border}`, boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-wider" style={{ color: p.text }}>REMINDER</span>
        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: p.dot, color: '#FFFFFF' }}>ONE CHANCE</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-xl text-[11px] font-semibold"
          style={{ background: p.bubbleBg, color: p.text, border: `1px solid ${p.border}` }}>30 min</button>
        <button className="flex-1 py-2 rounded-xl text-[11px] font-semibold"
          style={{ background: p.bubbleBg, color: p.text, border: `1px solid ${p.border}` }}>1 hour</button>
        <button className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-gray-500"
          style={{ background: '#F3F4F6' }}>never</button>
      </div>
    </div>
  );
};

const ParkingCounter = () => {
  const p = PALETTE.ORANGE;
  return (
    <div className="absolute left-3 right-3 top-[60px] z-20 rounded-xl p-2 flex items-center justify-between"
      style={{ background: p.bubbleBg, border: `1.5px solid ${p.border}` }}>
      <span className="text-[10px] font-semibold tracking-wider" style={{ color: p.text }}>
        PARKING LOT
      </span>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: p.text }}>
        72:00:00
      </span>
    </div>
  );
};

/* ============ The phone composition ============ */

const Phone = ({ step, abaName }) => {
  return (
    <PhoneShell isNight={step.isNight}>
      <StatusBar />
      <Header />

      {step.overlay === 'PARKING_COUNTER' && <ParkingCounter />}

      <div className="px-3 pt-1 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-2">
          <HRVCard />
          <EducationalCard />
        </div>
        <MemorySnap />
        <div className="flex-1" />
        <RoutineBookshelf bookshelf={step.bookshelf} />
      </div>

      <div className="px-3 pt-2 pb-2" style={{ background: 'rgba(244, 236, 230, 1)' }}>
        <div className="grid grid-cols-4 gap-1.5">
          <Row1Tile label="R&R" value="91" rim={step.rRimColor} />
          <Row1Tile label="Healthspan" value="88" />
          <Row1Tile label="My Blueprint" value="86" />
          <Row1Tile label="Inner Circle" value="52" />
        </div>
        <div className="mt-2">
          <OllieSpaceLine step={step} />
        </div>
        <AIPlayground step={step} abaName={abaName} />
        <DailyPulse fabBadge={step.fabBadge} />
      </div>

      {/* OVERLAYS rendered last so they sit on top */}
      {step.overlay === 'YES_NO' && <YesNoOverlay color={step.color} />}
      {step.overlay === 'WORKPAD' && <WorkPadOverlay />}
      {step.overlay === 'REMINDER' && <ReminderOverlay />}
    </PhoneShell>
  );
};

/* ============ Simulation controls ============ */

const SimControls = ({ stepIdx, setStepIdx, total }) => {
  const goBack = () => setStepIdx(Math.max(0, stepIdx - 1));
  const goNext = () => setStepIdx(Math.min(total - 1, stepIdx + 1));
  const restart = () => setStepIdx(0);
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      <button onClick={goBack} disabled={stepIdx === 0}
        className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
        style={{
          background: stepIdx === 0 ? '#F3F4F6' : '#FFFFFF',
          color: stepIdx === 0 ? '#9CA3AF' : '#111827',
          border: '1px solid #E5E7EB',
          cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
          boxShadow: stepIdx === 0 ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
        }}>
        <ChevronLeft size={16} /> Back
      </button>

      <div className="px-4 py-2.5 rounded-xl text-[12px] font-semibold tabular-nums"
        style={{ background: '#111827', color: '#FFFFFF', minWidth: '110px', textAlign: 'center' }}>
        Step {stepIdx + 1} / {total}
      </div>

      <button onClick={goNext} disabled={stepIdx === total - 1}
        className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
        style={{
          background: stepIdx === total - 1 ? '#F3F4F6' : '#0A0A0A',
          color: stepIdx === total - 1 ? '#9CA3AF' : '#FFFFFF',
          border: '1px solid #0A0A0A',
          cursor: stepIdx === total - 1 ? 'not-allowed' : 'pointer',
          boxShadow: stepIdx === total - 1 ? 'none' : '0 4px 12px rgba(0,0,0,0.2)',
        }}>
        Next <ChevronRight size={16} />
      </button>

      <button onClick={restart}
        className="ml-2 flex items-center gap-1 px-3 py-2.5 rounded-xl text-[12px] font-medium"
        style={{ background: '#FFFFFF', color: '#6B7280', border: '1px solid #E5E7EB' }}>
        <RotateCcw size={14} /> Restart
      </button>
    </div>
  );
};

/* ============ Step caption block ============ */

const CaptionBlock = ({ step }) => (
  <div className="mt-5 max-w-xl mx-auto">
    <div className="rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500">
          {step.title}
        </div>
        <div className="text-[9px] tracking-[0.18em] uppercase font-semibold"
          style={{ color: PALETTE[step.color].text }}>
          {step.phase}
        </div>
      </div>
      <div className="text-[13px] leading-relaxed text-gray-800 mb-2">{step.caption}</div>
      <div className="text-[11px] font-mono pt-2"
        style={{ color: '#6B7280', borderTop: '1px dashed #E5E7EB' }}>
        Canon: {step.canonRef}
      </div>
    </div>
  </div>
);

/* ============ ABA selector ============ */

const AbaSelector = ({ aba, setAba }) => {
  const opts = [
    { name: 'Max', sub: 'default' },
    { name: 'Atlas', sub: 'Zakiy' },
    { name: 'Athos', sub: 'Val' },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gray-500 mr-2">
        ABA name
      </span>
      {opts.map((o) => {
        const active = aba === o.name;
        return (
          <button key={o.name} onClick={() => setAba(o.name)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: active ? '#111827' : '#FFFFFF',
              color: active ? '#FFFFFF' : '#374151',
              border: '1px solid #E5E7EB',
            }}>
            {o.name} <span className="opacity-50">· {o.sub}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ============ Top-level app ============ */

export default function CanonSimulation() {
  const [stepIdx, setStepIdx] = useState(0);
  const [aba, setAba] = useState('Max');
  const step = STEPS[stepIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .display-font { font-family: 'Fraunces', Georgia, serif; }
        .body-font { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen w-full body-font" style={{ background: '#F4ECE6' }}>
        <div className="max-w-3xl mx-auto px-5 py-8">
          <div className="flex flex-col items-start mb-6">
            <div className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: '#9A3412' }}>
              CCO-LITE-BETA-UI-001 · v1.0 LOCKED · Simulation
            </div>
            <h1 className="display-font text-3xl md:text-4xl leading-tight"
              style={{ color: '#0A0A0A', fontWeight: 500 }}>
              A day in <em style={{ fontWeight: 300 }}>BariAccess Lite</em>
            </h1>
            <p className="mt-2 text-[12px] max-w-xl" style={{ color: '#4B5563' }}>
              12 steps. Morning JotForm → completion → midday deferral → Parking Lot →
              evening Dual AI handoff → night mode. Tap <strong>Next</strong> to advance.
            </p>
          </div>

          <Phone step={step} abaName={aba} />

          <SimControls stepIdx={stepIdx} setStepIdx={setStepIdx} total={STEPS.length} />

          <CaptionBlock step={step} />

          <AbaSelector aba={aba} setAba={setAba} />

          <div className="mt-10 pt-6 text-[10px] text-center"
            style={{ color: '#9CA3AF', borderTop: '1px solid #E5E7EB' }}>
            BariAccess LLC · Confidential — Internal Use Only · © 2026 BariAccess LLC.
          </div>
        </div>
      </div>
    </>
  );
}
