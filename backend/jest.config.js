// import type { Config } from 'jest';

const config /*: Config*/ = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    // '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/certs/',
    '<rootDir>/scripts/',
    '<rootDir>/node_modules/',
  ],
};

export default config;
