import config from './playwright.root.config.mjs';
export default {
  ...config,
  testDir: './tests',
  testMatch: 'root-hosting.spec.mjs',
  webServer: { ...config.webServer, command: 'node scripts/serve-built.mjs --root --main-enquiry-preview' },
};
