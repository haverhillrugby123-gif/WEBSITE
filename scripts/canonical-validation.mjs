import { readFileSync } from 'node:fs';
export const canonicalMap = JSON.parse(readFileSync(new URL('./canonical-map.json', import.meta.url), 'utf8'));
export function checkCanonical(page, html, fail) {
  const matches = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)];
  if (page === '404.html') {
    if (matches.length) fail('error page must not invent a canonical destination');
    return;
  }
  const entry = canonicalMap[page];
  if (!entry?.verifiedOn || !entry?.title || !entry.url.startsWith('https://www.ukonlinetuition.co.uk/')) fail('missing verified production canonical mapping');
  if (matches.length !== 1 || matches[0][1] !== entry.url) fail('canonical differs from verified production mapping');
  const og = html.match(/<meta property="og:url" content="([^"]+)"/);
  if (og && og[1] !== entry.url) fail('Open Graph URL differs from canonical mapping');
}
export function checkSitemap(xml, fail) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort();
  const expected = Object.values(canonicalMap).map(row => row.url).sort();
  if (JSON.stringify(urls) !== JSON.stringify(expected)) fail('sitemap must contain exactly the verified production mappings');
}
