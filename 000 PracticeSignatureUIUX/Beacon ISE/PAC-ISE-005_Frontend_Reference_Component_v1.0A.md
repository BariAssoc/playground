# PAC-ISE-005 — Frontend Reference Component (Constellation Panel)

Version: v1.0A  
Status: Canonical / Active  
Domain: BariAccess™ OS → Identity Engine → Frontend Rendering  
Audience: Frontend Engineers, UI/UX, QA  
Confidentiality: Internal (Non-public)

---

## 1. Purpose

This PAC provides a **reference implementation** for rendering Identity State Expressions™ (ISEs) in the Constellation Panel, including:

1. **Identity Icon Component** — visual state expression
2. **CTA Controller** — button availability, ordering, compression
3. **Ollie Space Controller** — cadence, prompt density, template selection
4. **Transition Handling** — smooth state changes without jarring UX

This is a **reference**, not a mandatory implementation. Teams may adapt to their framework (React, Flutter, SwiftUI) while preserving the canonical behavior.

---

## 2. Hard Rules (Non-Negotiable)

1. **Derived, never inferred** — all rendering comes from `ISEPayload`, no local AI logic
2. **Single state at render time** — never blend or interpolate between states
3. **Template keys only** — Ollie uses pre-approved templates, no dynamic generation
4. **No emotion language** — UI copy must never imply mood, feeling, or judgment
5. **Governance override** — ISE-5 suppresses all non-approved UI elements
6. **Graceful degradation** — if payload fetch fails, default to ISE-0

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Constellation Panel                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐                                       │
│   │  Identity Icon  │ ◄── render.identityIcon tokens        │
│   │   Component     │                                       │
│   └─────────────────┘                                       │
│                                                             │
│   ┌─────────────────┐                                       │
│   │  CTA Controller │ ◄── cta.mode, maxVisible, ordering    │
│   │   + Button Grid │                                       │
│   └─────────────────┘                                       │
│                                                             │
│   ┌─────────────────┐                                       │
│   │  Ollie Space    │ ◄── ollie.cadence, templateKeys       │
│   │   Controller    │                                       │
│   └─────────────────┘                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
                   ISEPayload (from API)
                          │
              GET /v1/identity/ise
```

---

## 4. Data Contract (ISEPayload Consumer)

The frontend consumes `ISEPayload` as defined in PAC-ISE-001. Key fields:

```typescript
interface ISEPayload {
  version: string;              // "v1.0A"
  generatedAt: string;          // ISO 8601
  state: ISEState;              // enum
  reasonCodes: string[];        // for debugging/logging only
  contributors: Contributor[];  // for debugging/logging only
  render: {
    identityIcon: {
      posture: "neutral" | "upright" | "softened" | "contained";
      saturation: "standard" | "bright" | "muted" | "lightOpacity";
      motion: "none" | "subtleIdle" | "steadyIdle" | "minimal";
      overlay: "none" | "shieldLock";
    };
  };
  cta: {
    mode: "default" | "build" | "recovery" | "compress" | "restricted" | "onboarding";
    maxVisible: number;         // 1-8
    orderingBias: "none" | "performanceFirst" | "recoveryFirst" | "continuityFirst" | "oneNextStep" | "approvedOnly";
    restrictedActions: string[];
  };
  ollie: {
    cadence: "neutral" | "forward" | "slow" | "minimal" | "strictNeutral" | "explanatory";
    promptDensity: "normal" | "increased" | "reduced" | "minimal";
    voiceStyle: "informational" | "encouragingNeutral" | "protective" | "containment" | "continuity" | "governanceNeutral" | "onboardingGuide";
    templateKeys: string[];
  };
  governance?: {
    isClinicalRouted: boolean;
    visibility: "ccie" | "cpie" | "dual";
    redactionLevel: "none" | "light" | "strict";
  };
}
```

---

## 5. Identity Icon Component

### 5.1 Component Interface

```typescript
interface IdentityIconProps {
  posture: "neutral" | "upright" | "softened" | "contained";
  saturation: "standard" | "bright" | "muted" | "lightOpacity";
  motion: "none" | "subtleIdle" | "steadyIdle" | "minimal";
  overlay: "none" | "shieldLock";
  transitionDuration?: number;  // ms, default 300
}
```

### 5.2 Visual Token Mapping

| Token | Value | Visual Effect |
|-------|-------|---------------|
| **posture** | `neutral` | Default vertical alignment, centered |
| | `upright` | Slight upward shift (+2px), expanded presence |
| | `softened` | Slight downward shift (-2px), rounded edges |
| | `contained` | Scaled down (95%), tighter bounding box |
| **saturation** | `standard` | 100% opacity, base palette |
| | `bright` | 100% opacity, +10% saturation boost |
| | `muted` | 70% opacity, -15% saturation |
| | `lightOpacity` | 50% opacity, no saturation change |
| **motion** | `none` | Static, no animation |
| | `subtleIdle` | Gentle breathing (scale 1.0 → 1.02, 3s loop) |
| | `steadyIdle` | Steady pulse (opacity 0.95 → 1.0, 2s loop) |
| | `minimal` | Micro-drift (translate ±1px, 4s loop) |
| **overlay** | `none` | No overlay |
| | `shieldLock` | Semi-transparent shield icon (bottom-right) |

### 5.3 Reference Implementation (React + Tailwind)

```tsx
import React from 'react';
import { motion } from 'framer-motion';

const POSTURE_STYLES = {
  neutral: 'translate-y-0',
  upright: '-translate-y-0.5 scale-[1.02]',
  softened: 'translate-y-0.5 rounded-2xl',
  contained: 'scale-95',
};

const SATURATION_STYLES = {
  standard: 'opacity-100',
  bright: 'opacity-100 saturate-[1.1]',
  muted: 'opacity-70 saturate-[0.85]',
  lightOpacity: 'opacity-50',
};

const MOTION_VARIANTS = {
  none: {},
  subtleIdle: {
    scale: [1, 1.02, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  steadyIdle: {
    opacity: [0.95, 1, 0.95],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  minimal: {
    x: [0, 1, 0, -1, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

interface IdentityIconProps {
  posture: keyof typeof POSTURE_STYLES;
  saturation: keyof typeof SATURATION_STYLES;
  motion: keyof typeof MOTION_VARIANTS;
  overlay: 'none' | 'shieldLock';
  transitionDuration?: number;
}

export const IdentityIcon: React.FC<IdentityIconProps> = ({
  posture,
  saturation,
  motion: motionType,
  overlay,
  transitionDuration = 300,
}) => {
  return (
    <div className="relative inline-block">
      <motion.div
        className={`
          w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
          flex items-center justify-center
          transition-all
          ${POSTURE_STYLES[posture]}
          ${SATURATION_STYLES[saturation]}
        `}
        style={{ transitionDuration: `${transitionDuration}ms` }}
        animate={MOTION_VARIANTS[motionType]}
      >
        {/* Icon content goes here */}
        <span className="text-white text-2xl">★</span>
      </motion.div>
      
      {overlay === 'shieldLock' && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-xs">🛡</span>
        </div>
      )}
    </div>
  );
};
```

### 5.4 Transition Behavior

| Scenario | Behavior |
|----------|----------|
| State change | Animate over `transitionDuration` (default 300ms) |
| Same state refresh | No visible change |
| Payload fetch failure | Hold previous state for 30s, then fade to ISE-0 |
| First load (no prior state) | Fade in from `lightOpacity` to resolved state |

---

## 6. CTA Controller

### 6.1 Component Interface

```typescript
interface CTAControllerProps {
  mode: string;
  maxVisible: number;
  orderingBias: string;
  restrictedActions: string[];
  availableActions: Action[];  // from app config
}

interface Action {
  id: string;
  label: string;
  category: "performance" | "recovery" | "planning" | "data" | "clinical";
  priority: number;  // lower = higher priority
}
```

### 6.2 Ordering Logic

```typescript
function orderActions(
  actions: Action[],
  orderingBias: string,
  restrictedActions: string[]
): Action[] {
  // 1. Filter out restricted actions
  let filtered = actions.filter(a => !restrictedActions.includes(a.id));
  
  // 2. Apply ordering bias
  switch (orderingBias) {
    case 'performanceFirst':
      filtered.sort((a, b) => {
        if (a.category === 'performance' && b.category !== 'performance') return -1;
        if (b.category === 'performance' && a.category !== 'performance') return 1;
        return a.priority - b.priority;
      });
      break;
    case 'recoveryFirst':
      filtered.sort((a, b) => {
        if (a.category === 'recovery' && b.category !== 'recovery') return -1;
        if (b.category === 'recovery' && a.category !== 'recovery') return 1;
        return a.priority - b.priority;
      });
      break;
    case 'continuityFirst':
      // Prioritize actions that support streaks/momentum
      filtered.sort((a, b) => {
        const continuityCategories = ['performance', 'planning'];
        const aIsContinuity = continuityCategories.includes(a.category);
        const bIsContinuity = continuityCategories.includes(b.category);
        if (aIsContinuity && !bIsContinuity) return -1;
        if (bIsContinuity && !aIsContinuity) return 1;
        return a.priority - b.priority;
      });
      break;
    case 'oneNextStep':
      // Return only the single highest-priority action
      filtered.sort((a, b) => a.priority - b.priority);
      filtered = filtered.slice(0, 1);
      break;
    case 'approvedOnly':
      // For ISE-5: only show explicitly approved clinical actions
      filtered = filtered.filter(a => a.category === 'clinical');
      break;
    default:
      filtered.sort((a, b) => a.priority - b.priority);
  }
  
  return filtered;
}
```

### 6.3 Reference Implementation (React)

```tsx
import React from 'react';

interface CTAGridProps {
  mode: string;
  maxVisible: number;
  orderingBias: string;
  restrictedActions: string[];
  availableActions: Action[];
  onActionClick: (actionId: string) => void;
}

export const CTAGrid: React.FC<CTAGridProps> = ({
  mode,
  maxVisible,
  orderingBias,
  restrictedActions,
  availableActions,
  onActionClick,
}) => {
  const orderedActions = orderActions(availableActions, orderingBias, restrictedActions);
  const visibleActions = orderedActions.slice(0, maxVisible);
  
  // Determine grid columns based on maxVisible
  const gridCols = maxVisible <= 2 ? 'grid-cols-1' : 
                   maxVisible <= 4 ? 'grid-cols-2' : 
                   'grid-cols-4';
  
  return (
    <div className={`grid ${gridCols} gap-3 p-4`}>
      {visibleActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className={`
            px-4 py-3 rounded-lg font-medium transition-all
            ${mode === 'recovery' ? 'bg-blue-100 text-blue-800' : ''}
            ${mode === 'build' ? 'bg-green-100 text-green-800' : ''}
            ${mode === 'compress' ? 'bg-gray-100 text-gray-800' : ''}
            ${mode === 'restricted' ? 'bg-amber-100 text-amber-800' : ''}
            ${mode === 'default' ? 'bg-indigo-100 text-indigo-800' : ''}
            ${mode === 'onboarding' ? 'bg-purple-100 text-purple-800' : ''}
            hover:scale-[1.02] active:scale-[0.98]
          `}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};
```

### 6.4 Mode Visual Treatments

| Mode | Visual Treatment |
|------|------------------|
| `default` | Standard palette, full grid |
| `build` | Green accent, performance emphasis |
| `recovery` | Blue accent, calming palette |
| `compress` | Muted palette, minimal grid (1-2 items) |
| `restricted` | Amber accent, shield indicator |
| `onboarding` | Purple accent, guided appearance |

---

## 7. Ollie Space Controller

### 7.1 Component Interface

```typescript
interface OllieControllerProps {
  cadence: string;
  promptDensity: string;
  voiceStyle: string;
  templateKeys: string[];
}

interface OlliePrompt {
  key: string;
  text: string;
  category: string;
}
```

### 7.2 Template Registry (Reference)

```typescript
const OLLIE_TEMPLATES: Record<string, OlliePrompt> = {
  // ISE-0: Neutral
  'ISE0_INFO': {
    key: 'ISE0_INFO',
    text: "Here's your overview for today.",
    category: 'informational',
  },
  
  // ISE-1: Aligned
  'ISE1_BUILD': {
    key: 'ISE1_BUILD',
    text: "This is a good day to build.",
    category: 'encouragingNeutral',
  },
  
  // ISE-2: Protective
  'ISE2_STABILIZE': {
    key: 'ISE2_STABILIZE',
    text: "Let's stabilize before pushing.",
    category: 'protective',
  },
  
  // ISE-3: Contained
  'ISE3_ONE_STEP': {
    key: 'ISE3_ONE_STEP',
    text: "Let's clear one thing.",
    category: 'containment',
  },
  
  // ISE-4: Momentum
  'ISE4_KEEP_RHYTHM': {
    key: 'ISE4_KEEP_RHYTHM',
    text: "Let's keep this rhythm.",
    category: 'continuity',
  },
  
  // ISE-5: Restricted
  'ISE5_GUIDANCE_ONLY': {
    key: 'ISE5_GUIDANCE_ONLY',
    text: "Here's what's available right now.",
    category: 'governanceNeutral',
  },
  
  // ISE-6: Exploratory
  'ISE6_LEARN_RHYTHM': {
    key: 'ISE6_LEARN_RHYTHM',
    text: "Let's learn your rhythm.",
    category: 'onboardingGuide',
  },
};
```

### 7.3 Cadence & Density Logic

```typescript
interface OllieTimingConfig {
  initialDelay: number;      // ms before first prompt
  promptInterval: number;    // ms between prompts
  maxPromptsPerSession: number;
}

const CADENCE_CONFIG: Record<string, OllieTimingConfig> = {
  neutral: { initialDelay: 2000, promptInterval: 30000, maxPromptsPerSession: 5 },
  forward: { initialDelay: 1000, promptInterval: 20000, maxPromptsPerSession: 7 },
  slow: { initialDelay: 5000, promptInterval: 60000, maxPromptsPerSession: 3 },
  minimal: { initialDelay: 10000, promptInterval: 120000, maxPromptsPerSession: 2 },
  strictNeutral: { initialDelay: 5000, promptInterval: 60000, maxPromptsPerSession: 2 },
  explanatory: { initialDelay: 1500, promptInterval: 25000, maxPromptsPerSession: 6 },
};

const DENSITY_MULTIPLIER: Record<string, number> = {
  normal: 1.0,
  increased: 0.7,   // faster prompts
  reduced: 1.5,     // slower prompts
  minimal: 2.5,     // much slower prompts
};
```

### 7.4 Reference Implementation (React)

```tsx
import React, { useState, useEffect } from 'react';

interface OllieSpaceProps {
  cadence: keyof typeof CADENCE_CONFIG;
  promptDensity: keyof typeof DENSITY_MULTIPLIER;
  voiceStyle: string;
  templateKeys: string[];
}

export const OllieSpace: React.FC<OllieSpaceProps> = ({
  cadence,
  promptDensity,
  voiceStyle,
  templateKeys,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const config = CADENCE_CONFIG[cadence];
  const densityMultiplier = DENSITY_MULTIPLIER[promptDensity];
  
  const currentTemplate = OLLIE_TEMPLATES[templateKeys[currentPromptIndex]] || OLLIE_TEMPLATES['ISE0_INFO'];
  
  useEffect(() => {
    // Initial delay before showing Ollie
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, config.initialDelay * densityMultiplier);
    
    return () => clearTimeout(initialTimer);
  }, [config.initialDelay, densityMultiplier]);
  
  // Voice style affects text rendering
  const textStyle = voiceStyle === 'protective' ? 'text-blue-700' :
                    voiceStyle === 'encouragingNeutral' ? 'text-green-700' :
                    voiceStyle === 'containment' ? 'text-gray-600' :
                    voiceStyle === 'governanceNeutral' ? 'text-amber-700' :
                    'text-indigo-700';
  
  if (!isVisible) return null;
  
  return (
    <div className={`
      p-4 rounded-xl bg-white shadow-sm border border-gray-100
      transition-all duration-500
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
    `}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span>🦉</span>
        </div>
        <p className={`text-sm leading-relaxed ${textStyle}`}>
          {currentTemplate.text}
        </p>
      </div>
    </div>
  );
};
```

---

## 8. Constellation Panel (Composed)

### 8.1 Full Component

```tsx
import React, { useEffect, useState } from 'react';

interface ConstellationPanelProps {
  userId: string;
}

export const ConstellationPanel: React.FC<ConstellationPanelProps> = ({ userId }) => {
  const [payload, setPayload] = useState<ISEPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchISEPayload(userId)
      .then(setPayload)
      .catch((e) => {
        setError(e.message);
        // Fallback to ISE-0
        setPayload(ISE_DEFAULTS[ISEState.ISE_0_NEUTRAL_BASELINE]);
      })
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) {
    return <ConstellationSkeleton />;
  }
  
  if (!payload) {
    return <ConstellationError error={error} />;
  }
  
  return (
    <div className="constellation-panel flex flex-col gap-6 p-6">
      {/* Identity Icon */}
      <div className="flex justify-center">
        <IdentityIcon
          posture={payload.render.identityIcon.posture}
          saturation={payload.render.identityIcon.saturation}
          motion={payload.render.identityIcon.motion}
          overlay={payload.render.identityIcon.overlay}
        />
      </div>
      
      {/* Ollie Space */}
      <OllieSpace
        cadence={payload.ollie.cadence}
        promptDensity={payload.ollie.promptDensity}
        voiceStyle={payload.ollie.voiceStyle}
        templateKeys={payload.ollie.templateKeys}
      />
      
      {/* CTA Grid */}
      <CTAGrid
        mode={payload.cta.mode}
        maxVisible={payload.cta.maxVisible}
        orderingBias={payload.cta.orderingBias}
        restrictedActions={payload.cta.restrictedActions}
        availableActions={APP_ACTIONS}
        onActionClick={handleActionClick}
      />
    </div>
  );
};
```

---

## 9. Error Handling & Fallbacks

| Scenario | Behavior |
|----------|----------|
| API timeout (>5s) | Show skeleton, retry once, then fallback to ISE-0 |
| API error (4xx/5xx) | Log error, fallback to ISE-0, show subtle indicator |
| Invalid payload | Validate against schema, reject and fallback to ISE-0 |
| Missing templateKey | Use `ISE0_INFO` as default |
| Governance block present | Apply redaction rules before rendering |

### Fallback Payload

```typescript
const FALLBACK_PAYLOAD: ISEPayload = {
  version: 'v1.0A',
  generatedAt: new Date().toISOString(),
  state: 'ISE_0_NEUTRAL_BASELINE',
  reasonCodes: ['FALLBACK_DEFAULT'],
  contributors: [],
  render: {
    identityIcon: {
      posture: 'neutral',
      saturation: 'standard',
      motion: 'none',
      overlay: 'none',
    },
  },
  cta: {
    mode: 'default',
    maxVisible: 8,
    orderingBias: 'none',
    restrictedActions: [],
  },
  ollie: {
    cadence: 'neutral',
    promptDensity: 'normal',
    voiceStyle: 'informational',
    templateKeys: ['ISE0_INFO'],
  },
};
```

---

## 10. Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Screen reader support | `aria-label` on Identity Icon describing state (non-emotional) |
| Motion sensitivity | Respect `prefers-reduced-motion`, disable all animations |
| Color contrast | All text meets WCAG AA (4.5:1 minimum) |
| Focus management | CTA buttons have visible focus rings |
| Keyboard navigation | All interactive elements reachable via Tab |

### Reduced Motion Example

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<IdentityIcon
  motion={prefersReducedMotion ? 'none' : payload.render.identityIcon.motion}
  // ... other props
/>
```

---

## 11. Testing Requirements

| Test Category | Coverage |
|---------------|----------|
| **Unit Tests** | Each component renders correctly for all ISE states |
| **Integration Tests** | Constellation Panel fetches and renders payload |
| **Visual Regression** | Snapshot tests for all 7 ISE visual states |
| **Accessibility Tests** | axe-core audit passes for all states |
| **Error Handling** | Fallback behavior verified for API failures |

### Sample Test (Jest + React Testing Library)

```typescript
describe('IdentityIcon', () => {
  it.each([
    ['ISE_0', 'neutral', 'standard', 'none', 'none'],
    ['ISE_1', 'upright', 'bright', 'subtleIdle', 'none'],
    ['ISE_2', 'softened', 'muted', 'minimal', 'none'],
    ['ISE_5', 'neutral', 'standard', 'none', 'shieldLock'],
  ])('renders correctly for %s', (state, posture, saturation, motion, overlay) => {
    const { container } = render(
      <IdentityIcon
        posture={posture}
        saturation={saturation}
        motion={motion}
        overlay={overlay}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
```

---

## 12. ABAEMR Save Path

```
ABAEMR STRUCTURE
→ Technical Systems & Development
→ Developer Standards & Templates
→ PACs
→ PAC-ISE-005 Frontend Reference Component v1.0A
```

---

## 13. Next in Chain

- **PAC-ISE-006** — CPIE/CCIE Visibility & Redaction Matrix for ISEs

---

*End of PAC-ISE-005 v1.0A*
