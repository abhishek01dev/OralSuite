import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/*.test.ts', 'apps/api/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['packages/*/src/**', 'apps/api/src/**'],
      exclude: ['**/generated/**', '**/*.test.ts', '**/index.ts'],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 80,
        statements: 80,
      },
    },
    testTimeout: 30000,
    pool: 'forks',
  },
});
