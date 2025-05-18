import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  projects: [
    {
      displayName: 'cdk',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/cdk/test/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/cdk/tsconfig.json' }]
      },
    },
    {
      displayName: 'lambda',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/lambda/tests/**/*.spec.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/lambda/tsconfig.json' }]
      },
    }
  ],
  moduleFileExtensions: ['ts','js','json','node']
};

export default config;
