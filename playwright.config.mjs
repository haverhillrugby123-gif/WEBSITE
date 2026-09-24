import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: 0, workers: process.env.CI ? 3 : 4, timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173/WEBSITE/', trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure' },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({ name: browserName, use: { browserName } })),
  webServer: { command: 'node scripts/serve-built.mjs', url: 'http://127.0.0.1:4173/WEBSITE/', reuseExistingServer: false },
});
