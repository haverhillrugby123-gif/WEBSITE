import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const request = route.request();
    if (!request.url().startsWith('http://127.0.0.1:4173/') || !['GET', 'HEAD'].includes(request.method())) return route.abort();
    return route.continue();
  });
});

test('homepage video is paused, muted, captioned and independent of the original hero', async ({ page }) => {
  await page.goto('./');
  const player = page.getByLabel('UK Online Tuition introduction', { exact: true });
  await expect(player).toHaveCount(1);
  await expect(player).toHaveAttribute('controls', '');
  await expect(player).toHaveAttribute('muted', '');
  await expect(player).toHaveAttribute('playsinline', '');
  await expect(player).toHaveAttribute('preload', 'metadata');
  await expect(player).not.toHaveAttribute('autoplay');
  await expect(player).not.toHaveAttribute('loop');
  expect(await player.evaluate(video => ({ paused: video.paused, muted: video.muted, autoplay: video.autoplay }))).toEqual({ paused: true, muted: true, autoplay: false });
  await expect(player.locator('track')).toHaveAttribute('kind', 'captions');
  await expect(player.locator('track')).toHaveAttribute('srclang', 'en');
  await expect(player.locator('track')).toHaveAttribute('default', '');
  expect(await player.evaluate(video => !video.closest('[aria-hidden="true"]'))).toBe(true);
  await expect(page.locator('.u-hero h1')).toHaveText('Online tuition.A clearer way forward.');
  await expect(page.locator('.u-hero a.u-button')).toHaveAttribute('href', 'contact/index.html');
  for (const filename of ['homepage-introduction.mp4', 'homepage-introduction.en.vtt', 'homepage-introduction-poster.png', 'homepage-introduction.css']) {
    const response = await page.request.get(`http://127.0.0.1:4173/WEBSITE/assets/${filename}`);
    expect(response.ok(), `${filename} is served beneath the project path`).toBe(true);
  }
});

for (const width of [320, 700, 1280]) {
  test(`homepage introduction reflows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Meet UK Online Tuition.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const video = await page.getByLabel('UK Online Tuition introduction', { exact: true }).boundingBox();
    expect(video.width).toBeGreaterThan(200);
    expect(video.x).toBeGreaterThanOrEqual(0);
    expect(video.x + video.width).toBeLessThanOrEqual(width + 1);
  });
}

test.describe('homepage introduction without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('keyboard transcript and native video controls remain available', async ({ page }) => {
    await page.goto('./');
    const summary = page.locator('.ukot-intro-video-transcript summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.ukot-intro-video-transcript')).toHaveAttribute('open', '');
    await expect(page.locator('.ukot-intro-video-transcript p')).toContainText('Welcome to UK Online Tuition.');
    await expect(page.getByRole('link', { name: 'Download the video', exact: true })).toHaveAttribute('href', 'assets/homepage-introduction.mp4');
    await expect(page.getByLabel('UK Online Tuition introduction', { exact: true })).toHaveAttribute('controls', '');
  });
});
