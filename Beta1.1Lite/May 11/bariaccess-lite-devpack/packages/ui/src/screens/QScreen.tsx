/**
 * QScreen — full-screen Q inbox view + Parking Lot tab.
 */

import React, { useState } from 'react';
import { PhoneFrame } from '../components/PhoneFrame.js';
import { StatusBar } from '../components/StatusBar.js';
import { Q } from '../surfaces/Inbox/Q.js';
import { ParkingLot } from '../surfaces/Inbox/ParkingLot.js';
import { Q_LABEL } from '../canon/constants.js';

type Tab = 'q' | 'parking';

export const QScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('q');
  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex items-center justify-between px-5 pb-3 text-[13px] font-semibold">
        <span className="text-blue-500">‹ Back</span>
        <span className="tracking-[0.22em] font-light">{Q_LABEL}</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="flex border-b border-gray-200">
        {(['q', 'parking'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-[11px] font-semibold tracking-wider uppercase"
            style={{
              color: tab === t ? '#0A0A0A' : '#9CA3AF',
              borderBottom: tab === t ? '2px solid #0A0A0A' : '2px solid transparent',
            }}
          >
            {t === 'q' ? Q_LABEL : 'Parking Lot'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {tab === 'q' ? <Q /> : <ParkingLot />}
      </div>
    </PhoneFrame>
  );
};
