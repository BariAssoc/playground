/**
 * Layout tokens — spacing, radii, shadows.
 * Pulled from Lite Beta screenshot measurements (May 11, 2026 build).
 */

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  pill: '999px',
  phone: '3rem',   // outer iPhone frame
  panel: '2.4rem', // inner safe area
} as const;

export const SHADOW = {
  card: '0 1px 3px rgba(0, 0, 0, 0.06)',
  overlay: '0 6px 16px rgba(0, 0, 0, 0.12)',
  workpad: '0 -8px 30px rgba(0, 0, 0, 0.15)',
  phone: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const SPACING = {
  phoneWidth: '360px',
  phoneHeight: '760px',
  phoneBorder: '8px',
  notchTop: '12px',
  notchWidth: '110px',
  notchHeight: '28px',
} as const;
