/**
 * Memory Snap card — §3 surface, content TBD by Val.
 *
 * Renders two-tile carousel with image thumbs + timestamps + "View all".
 * Visual reference: IMG_2735.
 *
 * TODO (Val): canon defines surface slot but content rules are TBD.
 * §9 Open Items — "Memory Snap definition + video content".
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface MemorySnapTile {
  /** URL or CSS gradient/color */
  background?: string;
  /** Caption shown at corners */
  timestamp?: string;
  cta?: string;
}

interface MemorySnapCardProps {
  tiles?: [MemorySnapTile, MemorySnapTile];
}

const DEFAULT_TILES: [MemorySnapTile, MemorySnapTile] = [
  {
    background: 'linear-gradient(135deg, #475569 0%, #334155 60%, #1E293B 100%)',
    timestamp: '19h ago',
  },
  {
    background: 'linear-gradient(135deg, #D6BCA0 0%, #A78569 50%, #6B5848 100%)',
    cta: 'View all ›',
  },
];

export const MemorySnapCard: React.FC<MemorySnapCardProps> = ({ tiles = DEFAULT_TILES }) => (
  <div className="grid grid-cols-2 gap-2 mt-2">
    {tiles.map((tile, idx) => (
      <div
        key={idx}
        className="rounded-xl overflow-hidden relative h-20"
        style={{ background: tile.background }}
      >
        {idx === 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-white text-[9px] font-semibold tracking-wider">
            <Sparkles size={9} /> MEMORY SNAP
          </div>
        )}
        {tile.timestamp && (
          <div className="absolute bottom-1 left-2 text-white text-[9px] opacity-80">
            {tile.timestamp}
          </div>
        )}
        {tile.cta && (
          <div className="absolute bottom-1 right-2 text-white text-[9px] font-medium">
            {tile.cta}
          </div>
        )}
      </div>
    ))}
  </div>
);
