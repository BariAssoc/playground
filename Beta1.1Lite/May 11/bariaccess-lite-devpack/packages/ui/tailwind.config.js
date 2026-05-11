/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        ios: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Per CCO-LITE-BETA-UI-001 §2 Expression Color Code — see src/theme/palette.ts
        // for the canonical source of truth. These are convenience aliases.
        canon: {
          beige: '#F4ECE6',
          ink: '#0A0A0A',
        },
      },
    },
  },
  plugins: [],
};
