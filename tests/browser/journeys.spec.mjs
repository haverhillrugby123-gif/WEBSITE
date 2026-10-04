import { test as base, expect } from '@playwright/test';
const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const consoleLog = [], network = [], pageErrors = [];
    page.on('console', message => consoleLog.push(`${message.type()}: ${message.text()}`));
    page.on('pageerror', error => { consoleLog.push(`pageerror: ${error.message}`); pageErrors.push(error.message); });
    page.on('response', response => network.push(`${response.status()} ${response.url()}`));
    page.on('requestfailed', request => network.push(`FAILED ${request.url()} ${request.failure()?.errorText}`));
    // This preview must never submit visitor data or launch an email service in a test.
    await page.route('**/*', route => {
      const request = route.request();
      if (!request.url().startsWith('http://127.0.0.1:4173/') || !['GET', 'HEAD'].includes(request.method())) return route.abort();
      return route.continue();
    });
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus || pageErrors.length) {
      await testInfo.attach('console', { body: consoleLog.join('\n'), contentType: 'text/plain' });
      await testInfo.attach('network', { body: network.join('\n'), contentType: 'text/plain' });
    }
    expect(pageErrors, 'No uncaught application errors').toEqual([]);
  },
});
async function prepare(page) {
  await page.getByLabel('Parent/contact name').fill('Browser Test');
  await page.getByLabel('Email address').fill('browser@example.invalid');
  await page.getByLabel('Pupil year group/stage').selectOption('Year 10');
  await page.getByLabel('Subject or entrance test').fill('Maths');
  await page.getByLabel('Main difficulty, goal or support needed').fill('Practise algebra.');
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click();
  await expect(page.getByRole('heading', { name: 'Review your enquiry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review your enquiry' })).toBeFocused();
}
test('inner-page teaching examples reveal and close from the keyboard', async ({ page }) => {
  for (const route of ['about/', 'how-it-works/', 'work-with-us/']) {
    await page.goto(route);
    const summary = page.locator('.ep-paper summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.ep-paper details')).toHaveAttribute('open', '');
    await expect(page.locator('.ep-paper details p')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.locator('.ep-paper details')).not.toHaveAttribute('open', '');
  }
});

test('mobile menu opens and Escape closes with focus returned', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'GCSE', exact: true })).toBeHidden();
});
test('keyboard reaches the skip link and operates mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.goto('./');
  // WebKit Windows skips ordinary anchors by default; the explicit skip-link
  // tab stop and native menu button must remain reachable using the keyboard.
  for (let i = 0; i < 3 && !(await page.getByRole('button', { name: 'Menu', exact: true }).evaluate(el => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
});
test('invalid enquiry, unsent draft, route context and edit invalidation', async ({ page }) => {
  await page.goto('contact/index.html?service=gcse');
  await page.getByRole('button', { name: 'Prepare enquiry email' }).click();
  await expect(page.getByRole('status')).toContainText('required fields');
  await expect(page.getByRole('heading', { name: 'Review your enquiry' })).toBeHidden();
  await prepare(page);
  await expect(page.getByRole('status')).toContainText('has not been sent');
  await expect(page.getByLabel('Prepared message')).toHaveValue(/Service: GCSE/);
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveAttribute('href', /^mailto:/);
  await page.getByLabel('Subject or entrance test').fill('English');
  await expect(page.getByRole('heading', { name: 'Review your enquiry' })).toBeHidden();
  await expect(page.getByLabel('Prepared message')).toHaveValue('');
  await expect(page.locator('#open-enquiry-email')).not.toHaveAttribute('href');
});
test('clipboard denial exposes selected manual-copy fallback', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Test denial'); } } }));
  await page.goto('contact/index.html'); await prepare(page);
  await page.getByRole('button', { name: 'Copy enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Select and copy');
  await expect(page.getByLabel('Prepared message')).toBeFocused();
  expect(await page.getByLabel('Prepared message').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(0);
});

test('enquiry reading order matches layout and editing returns to retained details', async ({ page }) => {
  for (const width of [390, 1348]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('contact/index.html?service=gcse');
    const form = page.locator('#enquiry-form');
    const aside = page.locator('.contact-direct');
    expect(await form.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('.contact-direct')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    const formBox = await form.boundingBox(), asideBox = await aside.boundingBox();
    if (width < 901) expect(asideBox.y).toBeGreaterThanOrEqual(formBox.y + formBox.height);
    else expect(asideBox.x).toBeGreaterThan(formBox.x);
    await expect(page.locator('#enquiry-script-note')).toBeHidden();
    await prepare(page);
    await page.getByRole('button', { name: 'Edit enquiry', exact: true }).click();
    await expect(page.getByLabel('Tuition route')).toBeFocused();
    await expect(page.getByLabel('Parent/contact name')).toHaveValue('Browser Test');
    await expect(page.getByLabel('Prepared message')).toHaveValue('');
    await expect(page.locator('#open-enquiry-email')).not.toHaveAttribute('href');
    await expect(page.locator('#enquiry-draft')).toBeHidden();
    await page.getByLabel('Subject or entrance test').fill('English');
    await page.getByRole('button', { name: 'Prepare enquiry email' }).click();
    await expect(page.getByLabel('Prepared message')).toHaveValue(/Subject or entrance test: English/);
  }
});

for (const width of [320, 390, 768, 1348]) test(`every page reflows at ${width}px`, async ({ page }) => {
  const routes = ['./', 'how-it-works/', 'gcse/', '11-plus/', 'primary/', 'about/', 'resources/', 'faq/', 'contact/', 'work-with-us/', '404.html'];
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      // Compare layout widths on the same rounding basis. WebKit at Windows
      // display scaling can round innerWidth down and clientWidth up by 1px.
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${route} at ${width}px`).toBe(true);
      expect(await page.locator('nav img').evaluate(img => img.complete && img.naturalWidth > 0), `${route} logo`).toBe(true);
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      if (await menu.isVisible()) {
        await menu.click();
        await expect(page.getByRole('navigation').getByRole('link', { name: 'Enquire', exact: true })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${route} open menu at ${width}px`).toBe(true);
      }
    }
});
test('resource ampersand and word searches agree; reset restores all', async ({ page }) => {
  await page.goto('resources/index.html');
  const search = page.getByRole('searchbox', { name: 'Search resources' });
  const result = page.getByRole('link', { name: /Online Primary English & Maths Tuition/ });
  await search.fill('English & Maths'); await expect(result).toBeVisible();
  const count = await page.locator('#ukot-resource-status').textContent();
  await search.fill('English and Maths'); await expect(result).toBeVisible();
  await expect(page.locator('#ukot-resource-status')).toHaveText(count);
  await search.fill('zz-no-such-topic'); await expect(page.getByRole('heading', { name: 'No matching resources' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(search).toHaveValue('');
  await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#ukot-resource-status')).toHaveText(`${await page.locator('.grid .card').count()} resources shown`);
});

test('illustrative learning examples reveal explanations from the keyboard', async ({ page }) => {
  await page.goto('./');
  const section = page.locator('.vf-examples');
  await expect(section).toContainText('not actual pupil work or results');
  for (const [label, answer] of [
    ['Explore an interpretation', 'Maya may feel nervous.'],
    ['See the explanation', '6 ÷ 2 = 3 and 8 ÷ 2 = 4'],
    ['Reveal the next step', '12 × 2 = 24'],
  ]) {
    const summary = section.locator('summary').filter({ hasText: label });
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(summary.locator('..').locator('p')).toBeVisible();
    await expect(summary.locator('..')).toContainText(answer);
  }
});
for (const width of [390, 900]) for (const mode of ['no JavaScript', 'blocked scripts']) {
  test.describe(`${mode}, ${width}px`, () => {
    test.use({ javaScriptEnabled: mode !== 'no JavaScript', viewport: { width, height: 900 } });
    test('navigation stays in flow and fallback content remains usable', async ({ page }) => {
      if (mode === 'blocked scripts') await page.route('**/*.js', route => route.abort());
      await page.goto('contact/index.html');
      const nav = page.getByRole('navigation');
      await expect(nav.getByRole('link', { name: 'Enquire', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Prepare enquiry email' })).toBeDisabled();
      await expect(page.locator('#enquiry-script-note')).toBeVisible();
      await expect(page.locator('#enquiry-script-note').getByRole('link')).toHaveAttribute('href', 'mailto:ukonlinetuition1@gmail.com');
      const navBox = await nav.boundingBox(), headingBox = await page.getByRole('heading', { level: 1 }).boundingBox();
      expect(headingBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.goto('resources/index.html');
      await expect(page.getByRole('searchbox')).toBeDisabled();
      await expect(page.getByRole('link', { name: /Online Primary English & Maths Tuition/ })).toBeVisible();
      await expect(page.locator('#ukot-resource-status')).toHaveText(`${await page.locator('.grid .card').count()} resources shown`);
    });
  });
}
test('nested 404 loads assets and recovers to home without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto('missing/deep/page'); expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Let’s get you back on track.');
  expect(await page.locator('nav img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL(/\/WEBSITE\/index.html$/);
});
test('320px reflow remains usable with reduced motion and forced colours', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  for (const route of ['./', 'contact/index.html', 'resources/index.html']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.slice(0,60), right: el.getBoundingClientRect().right })) }));
    expect(overflow.scroll, `${route}: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.width);
  }
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Enquire', exact: true })).toBeVisible();
});
