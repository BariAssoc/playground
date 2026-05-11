/**
 * ArchiveScreen — Three Dots archive view for expired JotForms.
 */

import React from 'react';
import { PhoneFrame } from '../components/PhoneFrame.js';
import { StatusBar } from '../components/StatusBar.js';
import { ThreeDots } from '../surfaces/Inbox/ThreeDots.js';

export const ArchiveScreen: React.FC = () => (
  <PhoneFrame>
    <StatusBar />
    <div className="flex items-center justify-between px-5 pb-3 text-[13px] font-semibold">
      <span className="text-blue-500">‹ Back</span>
      <span className="tracking-[0.22em] font-light">ARCHIVE</span>
      <span style={{ width: 40 }} />
    </div>
    <div className="flex-1 overflow-auto">
      <ThreeDots />
    </div>
  </PhoneFrame>
);
