import config from './playwright.config.mjs';
export default {
  ...config,
  use: { ...config.use, baseURL: 'http://127.0.0.1:4173/' },
  webServer: { ...config.webServer, command: 'node scripts/serve-built.mjs --root', url: 'http://127.0.0.1:4173/' },
};
