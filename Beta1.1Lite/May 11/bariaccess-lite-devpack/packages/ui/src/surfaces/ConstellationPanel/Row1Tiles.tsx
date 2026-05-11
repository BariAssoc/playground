/**
 * Row 1 — Constellation Crown / Signal Bar™
 * §3 Surface Inventory + Apr 7 2026 dual-naming lock:
 *   Internal/developer:  SIGNAL BAR™
 *   Stage/brand:         THE CONSTELLATION CROWN™
 *
 * 4 tiles, fixed order: R&R · Healthspan · My Blueprint · Inner Circle
 * Orange cascade rim per Pass 1 §R&R rule when ANY sub-band ≥ 4.
 */

import React from 'react';
import { CROWN_ORDER, type CrownTile } from '../../canon/constants.js';
import { CASCADE_RIM_COLOR, SURFACE } from '../../theme/palette.js';

export interface Row1TileData {
  label: CrownTile;
  value: number | string;
  /** Hex color, or null for no rim. */
  rim?: string | null;
  locked?: boolean;
}

interface Row1TilesProps {
  tiles: Row1TileData[];
}

const Tile: React.FC<{ data: Row1TileData }> = ({ data }) => {
  const rim = data.rim ?? null;
  return (
    <div
      className="rounded-xl px-2 py-1.5 flex flex-col"
      style={{
        background: SURFACE.cardBg,
        border: rim ? `1.5px solid ${rim}` : '1px solid transparent',
        transition: 'border-color 500ms ease',
      }}
    >
      <span className="text-[9px] font-medium" style={{ color: SURFACE.inkMuted }}>
        {data.label}
      </span>
      <span
        className="text-lg font-bold leading-none mt-0.5"
        style={{ color: SURFACE.ink }}
      >
        {data.value}
      </span>
    </div>
  );
};

export const Row1Tiles: React.FC<Row1TilesProps> = ({ tiles }) => {
  // Normalize/order tiles per canonical CROWN_ORDER
  const map = new Map(tiles.map((t) => [t.label, t]));
  const ordered = CROWN_ORDER.map(
    (label) => map.get(label) ?? { label, value: '—', rim: null },
  );
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {ordered.map((t) => (
        <Tile key={t.label} data={t} />
      ))}
    </div>
  );
};

export { CASCADE_RIM_COLOR };
