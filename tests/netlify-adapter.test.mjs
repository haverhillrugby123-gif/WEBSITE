import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const source = await readFile('contact/index.html', 'utf8');
const main = await readFile('assets/main.js', 'utf8');
const adapter = await readFile('assets/netlify-enquiry.js', 'utf8');
async function fixture(candidate = true) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const host = candidate === 'wrong-host' ? 'other.invalid' : candidate === 'no-host' ? '' : 'candidate.invalid';
  const html = source.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '').replace('id="enquiry-form"', candidate ? `id="enquiry-form" data-enquiry-provider="netlify-review" data-enquiry-host="${host}"` : 'id="enquiry-form"');
  await page.route('https://candidate.invalid/**', route => route.request().method() === 'GET' ? route.fulfill({ contentType: 'text/html', body: html }) : route.fulfill({ status: 503 }));
  await page.goto('https://candidate.invalid/contact/');
  await page.addScriptTag({ content: main });
  await page.addScriptTag({ content: adapter });
  await page.locator('#name').fill('Synthetic QA'); await page.locator('#email').fill('qa@example.invalid');
  await page.locator('#yeargroup').selectOption('Year 10'); await page.locator('#subject').fill('English'); await page.locator('#support').fill('Synthetic fixture only');
  return { page, browser };
}
test('default preview does not create send control or send a request', async () => {
  const { page, browser } = await fixture(false);
  try { await page.locator('#prepare-enquiry').click(); assert.equal(await page.locator('#send-enquiry').count(), 0); assert.match(await page.locator('#form-status').textContent(), /has not been sent/); } finally { await browser.close(); }
});
test('missing or mismatched approved hostname leaves email-only fallback', async () => {
  for (const mode of ['no-host', 'wrong-host']) {
    const { page, browser } = await fixture(mode);
    try { await page.locator('#prepare-enquiry').click(); assert.equal(await page.locator('#send-enquiry').count(), 0); } finally { await browser.close(); }
  }
});
test('review before POST; pending locks double click; submitted does not claim delivery', async () => {
  const { page, browser } = await fixture(); let count = 0; let release;
  try {
    await page.route('https://candidate.invalid/', async route => { count++; const body = new URLSearchParams(route.request().postData()); assert.equal(body.get('form-name'), 'tuition-enquiry'); assert.equal(body.get('email'), 'qa@example.invalid'); await new Promise(resolve => { release = resolve; }); await route.fulfill({ status: 200 }); });
    await page.locator('#prepare-enquiry').click(); assert.equal(count, 0);
    await page.locator('#send-enquiry').click(); await page.waitForFunction(() => document.querySelector('#send-enquiry').disabled);
    await page.locator('#send-enquiry').dispatchEvent('click'); assert.equal(count, 1); release();
    await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('has been submitted'));
    assert.match(await page.locator('#form-status').textContent(), /not inbox delivery/);
  } finally { release?.(); await browser.close(); }
});
test('HTTP error preserves inputs and requires fresh review', async () => {
  const { page, browser } = await fixture();
  try { await page.locator('#prepare-enquiry').click(); await page.locator('#send-enquiry').click(); await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('could not confirm')); assert.equal(await page.locator('#name').inputValue(), 'Synthetic QA'); assert.equal(await page.locator('#send-enquiry').isDisabled(), true); } finally { await browser.close(); }
});
test('timeout and changed-data responses cannot overwrite current state', async () => {
  const { page, browser } = await fixture();
  try {
    await page.route('https://candidate.invalid/', () => {});
    await page.clock.install(); await page.locator('#prepare-enquiry').click(); await page.locator('#send-enquiry').click(); await page.clock.fastForward(15001);
    await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('could not confirm'));
    await page.locator('#prepare-enquiry').click(); await page.locator('#send-enquiry').click(); await page.locator('#support').fill('Updated synthetic fixture');
    await page.clock.fastForward(16000); assert.match(await page.locator('#form-status').textContent(), /uncertain/); assert.equal(await page.locator('#support').inputValue(), 'Updated synthetic fixture');
  } finally { await browser.close(); }
});
