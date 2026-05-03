/**
 * JEST CONFIG — BariAccess Platform Test Runner
 * 
 * ESM + TypeScript via ts-jest. The project uses module: ESNext, so tests
 * run through ts-jest's ESM preset and import .js extensions resolve to .ts
 * source files at test time.
 * 
 * Test categories:
 *   tests/acceptance/*  — canon-spec acceptance tests (G5 / G6 / PAC-ISE-*)
 *   tests/integration/* — multi-module integration scenarios
 *   tests/unit/*        — per-module unit tests (Phase 2+ extension)
 * 
 * Run via:
 *   npm test                 — all tests
 *   npm run test:acceptance  — acceptance suite only
 *   npm run test:hipaa       — G5 HIPAA redaction (PRE-SHIP GATE)
 *   npm run test:safety      — G6 safety escalation (PRE-SHIP GATE)
 * 
 * Format note: this file is .cjs because jest reads its config synchronously
 * via require(); using a .ts config would force a ts-node devDependency.
 */

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // Map .js imports back to .ts source — required because TypeScript
  // emits .js extensions in ESM imports for production output, but
  // tests run against .ts source.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json'
      }
    ]
  },

  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx'
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Coverage settings — exercise governance/HIPAA/safety code paths
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**' // types-only files
  ],
  coverageThreshold: {
    'src/storage/redaction-layer.ts': {
      lines: 80,
      functions: 80
    },
    'src/resolver/safety-override.ts': {
      lines: 80,
      functions: 80
    }
  },

  verbose: true,
  bail: 0,
  testTimeout: 10_000
};
