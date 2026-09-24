import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const [base, revision] = process.argv.slice(2);
assert(base && revision, 'Usage: node scripts/measure-deployed.mjs <published-url> <expected-sha>');
const root = new URL(base.endsWith('/') ? base : `${base}/`);
assert(['http:', 'https:'].includes(root.protocol), 'Expected HTTP(S) URL');
const metadata = await fetch(new URL(`revision.json?revision=${encodeURIComponent(revision)}`, root), { signal: AbortSignal.timeout(15000), cache: 'no-store' });
assert.equal(metadata.status, 200);
assert.equal((await metadata.json()).revision, revision, 'Measure only the expected deployment');
const browser = await chromium.launch();
const observations = [];
try {
  for (const route of ['index.html', 'contact/index.html', 'resources/index.html']) {
    // A fresh context avoids a warmed browser cache. No throttling or field-performance claim.
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const headers = [];
    await page.route('**/*', request => {
      const target = new URL(request.request().url());
      return target.origin === root.origin && ['GET', 'HEAD'].includes(request.request().method()) ? request.continue() : request.abort();
    });
    page.on('response', response => {
      const values = response.headers();
      headers.push({ url: response.url(), status: response.status(), contentEncoding: values['content-encoding'] || null, contentLength: values['content-length'] || null });
    });
    const response = await page.goto(new URL(route, root).href, { waitUntil: 'load', timeout: 30000 });
    assert.equal(response.status(), 200, `${route} must load`);
    await page.waitForFunction(() => performance.getEntriesByType('paint').some(entry => entry.name === 'first-contentful-paint'), null, { timeout: 15000 });
    const timing = await page.evaluate(() => ({
      navigation: performance.getEntriesByType('navigation').map(entry => ({ duration: entry.duration, responseStart: entry.responseStart, domContentLoadedEventEnd: entry.domContentLoadedEventEnd, loadEventEnd: entry.loadEventEnd, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize, decodedBodySize: entry.decodedBodySize })),
      paint: performance.getEntriesByType('paint').map(entry => ({ name: entry.name, milliseconds: entry.startTime })),
      resources: performance.getEntriesByType('resource').map(entry => ({ url: entry.name, initiatorType: entry.initiatorType, duration: entry.duration, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize, decodedBodySize: entry.decodedBodySize }))
    }));
    observations.push({ route, headers, ...timing });
    await context.close();
  }
} finally { await browser.close(); }
await writeFile('deployment-performance.json', JSON.stringify({ revision, url: root.href, observedAt: new Date().toISOString(), environment: 'Chromium, 390x844, fresh context, no artificial throttling', limitation: 'One initial-load laboratory observation per page; below-fold lazy resources may not load until scrolling. Paint and delivery timings vary. Not Core Web Vitals, field data, a causal before/after comparison, or proof of a performance improvement.', observations }, null, 2) + '\n');
console.log(`Recorded three published-page performance observations for ${revision}. No speed-improvement claim.`);


