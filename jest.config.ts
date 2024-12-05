/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@api$': '<rootDir>/src/utils/burger-api.ts'
  },
};

export default config;