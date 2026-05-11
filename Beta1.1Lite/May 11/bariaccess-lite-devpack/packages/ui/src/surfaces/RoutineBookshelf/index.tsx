/**
 * Routine Bookshelf — §3 surface, lives at bottom of Rhythm Board.
 *
 * 16-segment visual:
 *   - Morning  : segments 0-4   (5 segments)
 *   - Midday   : segments 5-10  (6 segments)
 *   - Evening  : segments 11-15 (5 segments)
 *
 * Segment colors:
 *   - Green:  FAB completed in that session
 *   - Orange: midday session deferred (Yes → Later)
 *   - Grey:   not yet engaged
 *
 * Per INTERACTION 6 (CCO-UX-RBCP-001): Bookshelf RESIZES when WorkPad opens
 * vertically; STAYS FIXED when WorkPad is horizontal.
 */

import React from 'react';
import type { BookshelfState } from '../../types/ui.js';

interface RoutineBookshelfProps {
  state: BookshelfState;
  /** Resized state when WorkPad open vertically */
  compact?: boolean;
}

export const RoutineBookshelf: React.FC<RoutineBookshelfProps> = ({
  state,
  compact = false,
}) => {
  const segments = Array.from({ length: 16 }, (_, i) => {
    if (i < 5) {
      if (i < state.morning) return '#16A34A';
      return '#D1D5DB';
    } else if (i < 11) {
      const offset = i - 5;
      if (offset < state.midday) return '#16A34A';
      if (offset < state.mOrange) return '#F97316';
      return '#D1D5DB';
    } else {
      const offset = i - 11;
      if (offset < state.evening) return '#16A34A';
      return '#D1D5DB';
    }
  });
  const height = compact ? 6 : 10;
  return (
    <div className="mt-3 px-1">
      <div className="flex gap-[2px]">
        {segments.map((color, i) => (
          <div
            key={i}
            className="flex-1 rounded-[2px]"
            style={{
              background: color,
              height,
              transition: 'background 500ms ease',
            }}
          />
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
