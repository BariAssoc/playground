/**
 * Rhythm Board — upper dynamic surface per §3.
 * Hosts cards that change with patient state, time of day, and program activity.
 * The Routine Bookshelf lives at its bottom edge (see surfaces/RoutineBookshelf).
 *
 * Cards visible in Lite Beta (May 2026 screenshots):
 *   - HRV card
 *   - Educational card
 *   - Memory Snap card (TBD content)
 *   - Signal Board card
 *   - Program card (paginated)
 */

import React from 'react';

interface RhythmBoardProps {
  children?: React.ReactNode;
}

export const RhythmBoard: React.FC<RhythmBoardProps> = ({ children }) => (
  <div className="px-3 pt-1 flex-1 flex flex-col">{children}</div>
);

export { HRVCard } from './HRVCard.js';
export { EducationalCard } from './EducationalCard.js';
export { MemorySnapCard } from './MemorySnapCard.js';
export { SignalBoardCard, type SignalRow } from './SignalBoardCard.js';
export { ProgramCard } from './ProgramCard.js';
