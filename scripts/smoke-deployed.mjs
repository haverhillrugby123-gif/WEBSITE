import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
const [base, revision] = process.argv.slice(2);
assert(base && revision, 'Usage: node scripts/smoke-deployed.mjs <deployed-page-url> <expected-sha>');
const root = new URL(base.endsWith('/') ? base : base + '/');
assert(['http:', 'https:'].includes(root.protocol), 'Expected an HTTP(S) deployment URL');
async function get(relative) {
  const url = new URL(relative, root); url.searchParams.set('revision', revision);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  return { response, text: await response.text() };
}
// Condition polling tolerates Pages propagation, with a bounded 90-second budget.
// Browser test retries remain zero; HTTP requests each have a 15-second timeout.
let attempt = 0;
await expect.poll(async () => {
  attempt++;
  let deployed = false;
  try {
    const meta = await get('revision.json');
    deployed = meta.response.status === 200 && JSON.parse(meta.text).revision === revision;
  } catch (error) { console.log(`Revision check ${attempt}: ${error.message}`); }
  console.log(`Revision check ${attempt}: ${deployed ? 'current' : 'not current'}`);
  return deployed;
}, { timeout: 90000, intervals: [1000, 2000, 5000], message: 'Deployed revision must match this release' }).toBe(true);
for (const file of ['index.html', 'contact/index.html', 'resources/index.html', 'assets/main.js', 'assets/live-design.js', 'assets/refinement.css']) {
  const { response, text } = await get(file); assert.equal(response.status, 200, `${file} HTTP status`);
  assert(text.length > 0, `${file} is empty`);
  if (file.endsWith('.html')) {
    assert.match(text, /noindex,nofollow/, `${file} preview indexing directive`);
    assert.match(text, /<main\b/, `${file} main content`);
  }
}
const missing = await get('smoke-missing/nested-page');
assert.equal(missing.response.status, 404, 'Unknown nested URL must return 404');
assert.match(missing.text, /Back to Home/, 'Custom 404 recovery missing');
assert.match(missing.text, /\/WEBSITE\/assets\//, 'Custom 404 assets must resolve from nested URLs');
console.log(`Deployment verified: ${root.href} at ${revision}`);
