import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    // Applied before any test module (and before `src/config/env.ts`) is loaded.
    env: {
      NODE_ENV: 'test',
      PORT: '5000',
      CLIENT_URL: 'http://localhost:5173',
      SERVER_URL: 'http://localhost:5000',
      MONGO_URI: 'mongodb://127.0.0.1:27017/tawassol-test',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '1h',
    },
    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
});
