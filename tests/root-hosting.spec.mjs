import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mainEnquiryURL } from '../scripts/build-profile.mjs';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const request = route.request();
    return request.url().startsWith('http://127.0.0.1:4173/') && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort();
  });
});

test('a nested missing route serves a useful 404 with root assets and navigation', async ({ page }) => {
  const response = await page.goto('missing/nested/page/');
  expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Let’s get you back on track.' })).toBeVisible();
  expect(await page.locator('nav img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/index.html');
  await page.getByRole('link', { name: 'Back to Home' }).click();
  expect(new URL(page.url()).pathname).toBe('/index.html');
});

test('root download preserves the approved PDF and caption MIME', async ({ request }) => {
  const pdf = await request.get('assets/guides/gcse-english-language-structure-guide.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect(createHash('sha256').update(await pdf.body()).digest('hex')).toBe('7351452f669580b4aa0ab49c4b24cf27434288d933620dcfa0fa56cbe5e56e40');
  const captions = await request.get('assets/homepage-introduction.en.vtt');
  expect(captions.status()).toBe(200);
  expect(captions.headers()['content-type']).toContain('text/vtt');
});

for (const width of [390, 1280]) test(`main enquiry candidate is clear and ungated at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ['gcse/', 'resources/', 'contact/']) {
    await page.goto(route);
    await expect(page.locator('[data-main-enquiry]')).toHaveAttribute('href', mainEnquiryURL);
    await expect(page.locator('[data-main-enquiry]')).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(new URL(await page.locator('[data-main-enquiry]').getAttribute('href')).search).toBe('');
    expect(await page.locator('main').textContent()).toContain('Wix Forms');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/www\.ukonlinetuition\.co\.uk\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    if (route !== 'contact/') await expect(page.getByRole('link', { name: 'Download the free guide (PDF)' })).toHaveAttribute('href', '../assets/guides/gcse-english-language-structure-guide.pdf');
    else {
      await page.locator('#email-alternative > summary').click();
      await expect(page.getByRole('button', { name: 'Prepare enquiry email' })).toBeVisible();
      await expect(page.locator('a[href="tel:+447885550047"]').first()).toBeVisible();
      await expect(page.getByRole('checkbox', { name: /weekly exam tips/ })).not.toBeChecked();
      if (testInfo.project.name === 'chromium') await page.locator('section[aria-labelledby="main-enquiry-title"]').screenshot({ path: testInfo.outputPath(`offer-${width}.png`) });
    }
  }
});

test('optional newsletter request stays unticked, separate and unsent', async ({ page }) => {
  await page.goto('contact/?service=gcse');
  await page.locator('#email-alternative > summary').click();
  const newsletter = page.getByRole('checkbox', { name: /weekly exam tips/ });
  await expect(newsletter).not.toBeChecked();
  await page.getByLabel('Parent/contact name').fill('Adult Browser Test');
  await page.getByLabel('Email address').fill('adult@example.invalid');
  await page.getByLabel('Pupil year group/stage').selectOption('Year 10');
  await page.getByLabel('Subject or entrance test').fill('English Language');
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click();
  const draft = page.getByLabel('Prepared message');
  await expect(draft).toHaveValue(/free initial consultation and the free GCSE English Language structure guide/);
  await expect(draft).not.toHaveValue(/Optional newsletter request/);
  await expect(page.getByRole('status')).toContainText('has not been sent');
  await page.getByRole('button', { name: 'Edit enquiry', exact: true }).click();
  await newsletter.check();
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click();
  await expect(draft).toHaveValue(/Optional newsletter request:.*confirm signup separately/);
  await page.getByRole('button', { name: 'Edit enquiry', exact: true }).click();
  await newsletter.uncheck();
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click();
  await expect(draft).not.toHaveValue(/Optional newsletter request/);
});
