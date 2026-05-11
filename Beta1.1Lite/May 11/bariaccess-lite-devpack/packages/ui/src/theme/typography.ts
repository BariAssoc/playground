/**
 * Typography tokens for BariAccess Lite Beta UI.
 * Display: Fraunces (refined editorial — used for headings).
 * Body:    DM Sans (clean, geometric — used for body + UI controls).
 * iOS:     System stack — used inside PhoneFrame to mimic native rendering.
 */

export const FONT = {
  display: '"Fraunces", Georgia, serif',
  body: '"DM Sans", system-ui, sans-serif',
  ios: '-apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", sans-serif',
} as const;

export const TEXT = {
  // Phone-frame text sizes (small, dense — matches Lite Beta screenshots)
  microLabel: '9px',
  tinyLabel: '10px',
  smallLabel: '11px',
  body: '12px',
  emphasis: '13px',
  title: '14px',
  display: '18px',
} as const;

export const WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
