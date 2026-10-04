import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const expectedHash = '7351452f669580b4aa0ab49c4b24cf27434288d933620dcfa0fa56cbe5e56e40';
const fileName = 'gcse-english-language-structure-guide.pdf';
const linkName = 'Download the free guide (PDF)';
const newResources = [
  ['GCSE English', 'aqa-gcse-english-language-paper-1-q2-q3-q4-q5-guide'],
  ['GCSE English', 'free-gcse-english-language-diagnostic'],
  ['GCSE Maths', 'free-gcse-maths-diagnostic'],
  ['11+', 'free-11-plus-english-reasoning-diagnostic'],
  ['General study guidance', 'year-11-gcse-exam-readiness-check'],
  ['General study guidance', 'free-gcse-11-plus-revision-resources'],
];

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const request = route.request();
    return request.url().startsWith('http://127.0.0.1:4173/') && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort();
  });
});

for (const pagePath of ['resources/index.html', 'gcse/index.html']) {
  for (const width of [320, 700, 1280]) {
    test(`${pagePath} guide reflows at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pagePath + '#free-gcse-structure-guide');
      const panel = page.getByRole('region', { name: 'Free GCSE English Language structure guide' });
      await expect(panel).toBeVisible();
      for (const link of [panel.getByRole('link', { name: linkName }), panel.getByRole('link', { name: 'Ask about GCSE English tuition' })]) {
        await expect(link).toBeVisible();
        const box = await link.boundingBox();
        // Firefox can report a 48px box as 47.999984px after layout rounding.
        expect(box.height).toBeGreaterThanOrEqual(47.99);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (testInfo.project.name === 'chromium' && width !== 700) {
        await panel.screenshot({ path: testInfo.outputPath(`guide-panel-${width}.png`) });
      }
      if (width === 320) {
        await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        expect(await panel.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('canonical PDF is served with correct MIME type and downloaded unchanged', async ({ page, request }, testInfo) => {
  const response = await request.get(`assets/guides/${fileName}`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('application/pdf');
  const bytes = await response.body();
  expect(bytes.length).toBe(86393);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(expectedHash);
  await page.goto('resources/index.html#free-gcse-structure-guide');
  const promise = page.waitForEvent('download');
  await page.getByRole('link', { name: linkName }).click();
  const download = await promise;
  expect(download.suggestedFilename()).toBe(fileName);
  expect(download.url()).toBe(new URL(`assets/guides/${fileName}`, testInfo.project.use.baseURL).href);
  const saved = testInfo.outputPath('canonical-guide.pdf');
  await download.saveAs(saved);
  expect(createHash('sha256').update(await readFile(saved)).digest('hex')).toBe(expectedHash);
});

test('keyboard download and enquiry link work without JavaScript', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:4173/') ? route.continue() : route.abort());
    await page.goto(new URL('resources/index.html', testInfo.project.use.baseURL).href);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await page.keyboard.press('Tab');
    // The preserved resource hero has a library jump before the guide. WebKit's
    // default link-tabbing preference can skip it; explicit guide links stay tabbable.
    const libraryJump = page.getByRole('link', { name: 'Browse the library' });
    if (await libraryJump.evaluate(link => link === document.activeElement)) {
      await expect(libraryJump).toHaveAttribute('href', '#resource-library');
      await page.keyboard.press('Tab');
    }
    await expect(page.getByRole('link', { name: linkName })).toBeFocused();
    const promise = page.waitForEvent('download');
    await page.keyboard.press('Enter');
    const download = await promise;
    const saved = testInfo.outputPath('keyboard-guide.pdf');
    await download.saveAs(saved);
    expect(createHash('sha256').update(await readFile(saved)).digest('hex')).toBe(expectedHash);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Ask about GCSE English tuition' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new URL('contact/index.html?service=gcse', testInfo.project.use.baseURL).href);
    await expect(page.locator('a.direct[href="mailto:ukonlinetuition1@gmail.com"]')).toBeVisible();
  } finally { await context.close(); }
});

test('English enquiry CTA retains the existing email-draft flow', async ({ page }) => {
  await page.goto('gcse/index.html#free-gcse-structure-guide');
  const link = page.getByRole('link', { name: 'Ask about GCSE English tuition' });
  await expect(link).toHaveAttribute('href', '../contact/index.html?service=gcse');
  await link.click();
  await expect(page.locator('#enquiry-form [name="service"]')).toHaveValue('gcse');
  await expect(page.getByRole('button', { name: 'Prepare enquiry email' })).toBeVisible();
});

test('45 unique published Wix article links stay searchable and guide stays visible', async ({ page }) => {
  await page.goto('resources/index.html');
  const cards = page.locator('.grid > a.card');
  await expect(cards).toHaveCount(45);
  const links = await cards.evaluateAll(items => items.map(card => card.getAttribute('href')));
  expect(new Set(links).size).toBe(45);
  expect(links.every(href => href.startsWith('https://www.ukonlinetuition.co.uk/post/'))).toBe(true);
  expect(links).not.toContain('https://www.ukonlinetuition.co.uk/post/aqa-gcse-english-language-paper-1');
  for (const [category, slug] of newResources) {
    const card = page.locator(`a.card[href="https://www.ukonlinetuition.co.uk/post/${slug}"]`);
    await page.getByRole('button', { name: category, exact: true }).click();
    await expect(card).toBeVisible();
    await expect(card.locator('.cat')).toHaveText(category);
  }
  await page.getByRole('searchbox', { name: 'Search resources' }).fill('zz-guide-test-no-match');
  await expect(page.getByRole('heading', { name: 'No matching resources' })).toBeVisible();
  await expect(page.getByRole('link', { name: linkName })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.ukonlinetuition.co.uk/blog');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await expect(page.locator('#free-gcse-structure-guide form, #free-gcse-structure-guide input, #free-gcse-structure-guide script')).toHaveCount(0);
});
