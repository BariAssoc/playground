/**
 * Constellation Panel — primary daily UI, 5-row architecture per §3.
 *
 * Row 1 — Signal Bar / Crown (4 tiles)
 * Row 2 — Ollie's Space
 * Row 3+4 — Replaced by AI Playground compact area (May 2026 layout)
 * Row 5 — Daily Pulse (6 trackers)
 *
 * Note: Constellation Panel is STATIC; only its CONTENTS change.
 * Layout never shifts. Per CCO-UX-RBCP-001.
 */

import React from 'react';
import { Row1Tiles, type Row1TileData } from './Row1Tiles.js';
import { OllieSpace } from './OllieSpace.js';
import { AIPlayground } from './AIPlayground.js';
import { DailyPulse, type DailyPulseBadges } from './DailyPulse.js';
import { SURFACE, type ExpressionState } from '../../theme/palette.js';
import type { AISpeaker } from '../../types/ui.js';

export interface ConstellationPanelProps {
  tiles: Row1TileData[];
  ollieText: string;
  expression: ExpressionState;
  aiPlayground: {
    visible: boolean;
    text: string;
    expression: ExpressionState;
    activeSpeaker: AISpeaker;
  };
  abaName: string;
  pulseBadges?: DailyPulseBadges;
}

export const ConstellationPanel: React.FC<ConstellationPanelProps> = ({
  tiles,
  ollieText,
  expression,
  aiPlayground,
  abaName,
  pulseBadges,
}) => (
  <div className="px-3 pt-2 pb-2" style={{ background: SURFACE.panelBg }}>
    <Row1Tiles tiles={tiles} />
    <div className="mt-2">
      <OllieSpace text={ollieText} expression={expression} />
    </div>
    <AIPlayground
      visible={aiPlayground.visible}
      text={aiPlayground.text}
      expression={aiPlayground.expression}
      activeSpeaker={aiPlayground.activeSpeaker}
      abaName={abaName}
    />
    <DailyPulse badges={pulseBadges} />
  </div>
);

export { Row1Tiles, OllieSpace, AIPlayground, DailyPulse };
export type { Row1TileData, DailyPulseBadges };
