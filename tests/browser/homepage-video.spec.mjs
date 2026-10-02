import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const request = route.request();
    const local = request.url().startsWith('http://127.0.0.1:4173/');
    const nativeControlBlob = request.url().startsWith('blob:http://127.0.0.1:4173/');
    if ((!local && !nativeControlBlob) || !['GET', 'HEAD'].includes(request.method())) return route.abort();
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
    if (filename.endsWith('.vtt')) expect(response.headers()['content-type']).toMatch(/^text\/vtt(?:;|$)/);
    if (filename.endsWith('.mp4')) expect(response.headers()['content-type']).toMatch(/^video\/mp4(?:;|$)/);
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

test('male video decodes, plays on request and loads its seven native caption cues', async ({ page }) => {
  await page.goto('./');
  const video = page.getByLabel('UK Online Tuition introduction', { exact: true });
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(1);
  expect(await video.evaluate(v => ({ paused: v.paused, muted: v.muted, autoplay: v.autoplay, duration: v.duration, width: v.videoWidth, height: v.videoHeight }))).toEqual({ paused: true, muted: true, autoplay: false, duration: 18.5, width: 1920, height: 1080 });
  console.log('Initial native caption state', await video.evaluate(v => ({ mode: v.textTracks[0]?.mode, cues: v.textTracks[0]?.cues?.length || 0, trackReadyState: v.querySelector('track').readyState, mediaError: v.error?.message || null })));
  await expect.poll(() => video.evaluate(v => v.textTracks[0]?.cues?.length || 0)).toBe(7);
  expect(await video.evaluate(v => ({ language: v.textTracks[0].language, mode: v.textTracks[0].mode, first: v.textTracks[0].cues[0].text, lastEnd: v.textTracks[0].cues[6].endTime }))).toEqual({ language: 'en', mode: 'showing', first: 'Welcome to UK Online Tuition.', lastEnd: 16.4 });
  await video.evaluate(v => v.play());
  await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0.1);
  await expect.poll(() => video.evaluate(v => v.textTracks[0].activeCues?.length || 0)).toBeGreaterThan(0);
  await video.evaluate(v => v.pause());
  expect(await video.evaluate(v => ({ paused: v.paused, error: v.error?.message || null }))).toEqual({ paused: true, error: null });
});

test('Chromium native controls support play, pause, mute, unmute and keyboard activation', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Native browser chrome is inspected through Chromium CDP; other engines retain decode/caption and keyboard-transcript checks.');
  await page.goto('./');
  const video = page.getByLabel('UK Online Tuition introduction', { exact: true });
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(1);
  const client = await context.newCDPSession(page);
  async function control(pattern) {
    const { nodes } = await client.send('Accessibility.getFullAXTree');
    return nodes.find(node => !node.ignored && node.role?.value === 'button' && pattern.test(node.name?.value || '') && node.backendDOMNodeId);
  }
  async function clickNative(pattern) {
    await video.hover();
    await expect.poll(async () => Boolean(await control(pattern))).toBe(true);
    const node = await control(pattern);
    const { model } = await client.send('DOM.getBoxModel', { backendNodeId: node.backendDOMNodeId });
    const q = model.content;
    await page.mouse.click((q[0] + q[2] + q[4] + q[6]) / 4, (q[1] + q[3] + q[5] + q[7]) / 4);
  }
  await clickNative(/^play(?:$|\s)/i);
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(false);
  await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0.1);
  await clickNative(/^(?:unmute|mute)(?:$|\s)/i);
  await expect.poll(() => video.evaluate(v => v.muted)).toBe(false);
  await clickNative(/^(?:unmute|mute)(?:$|\s)/i);
  await expect.poll(() => video.evaluate(v => v.muted)).toBe(true);
  await clickNative(/^pause(?:$|\s)/i);
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
  await video.focus();
  await expect(video).toBeFocused();
  await page.keyboard.press('Space');
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(false);
  await page.keyboard.press('Space');
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
  await client.detach();
});
