import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const pages = ['index.html','how-it-works/index.html','gcse/index.html','11-plus/index.html','primary/index.html','about/index.html','resources/index.html','faq/index.html','contact/index.html','work-with-us/index.html','404.html'];

let refs = 0;
let images = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const fail = message => { throw new Error(`${page}: ${message}`); };

  if (!html.includes('<html lang="en-GB">')) fail('document language must be en-GB');
  if ((html.match(/<h1\b/g) || []).length !== 1) fail('expected exactly one h1');
  if ((html.match(/<title>/g) || []).length !== 1) fail('expected exactly one title');
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail('meaningful meta description missing');
  if (!/<link rel="canonical" href="https:\/\/www\.ukonlinetuition\.co\.uk\//.test(html)) fail('canonical URL missing or unexpected');
  if (!html.includes('name="viewport"')) fail('viewport missing');
  if (!html.includes('noindex,nofollow')) fail('draft indexing protection missing');
  if (!html.includes('class="draft-skip"')) fail('skip link missing');

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) fail('duplicate element IDs');

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    const tag = match[0];
    if (!/\balt="[^"]*"/.test(tag)) fail('image missing alt attribute');
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) fail('image missing intrinsic width/height');
  }

  for (const match of html.matchAll(/<button\b[^>]*>/g)) {
    if (!/\btype="button"/.test(match[0])) fail('button missing explicit type="button"');
  }

  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [relative, hash] = url.split('#');
    if (relative && relative.split('?')[0].endsWith('/')) fail(`directory link is not portable in downloaded preview: ${url}`);
    const dest = relative ? path.normalize(path.join(path.dirname(page), relative.split('?')[0])) : page;
    const target = dest.endsWith('.html') || path.extname(dest) ? dest : path.join(dest, 'index.html');
    try { await access(target); } catch { fail(`broken local reference ${url}`); }
    if (hash) {
      const body = await readFile(target, 'utf8');
      if (!body.includes(`id="${hash}"`)) fail(`missing anchor ${url}`);
    }
    refs++;
  }

  if (page === 'contact/index.html') {
    if (!html.includes('class="formcard preview-form"')) fail('preview-only enquiry form marker missing');
    if (/\saction=/.test(html)) fail('preview form must not submit to a network endpoint');
    if (!html.includes('id="check-enquiry"')) fail('preview validation control missing');
  }
}

for (const script of ['assets/main.js','assets/live-design.js','assets/motion.js']) {
  execFileSync(process.execPath, ['--check', script]);
}

console.log(`PASS: ${pages.length} HTML pages, ${refs} local references, ${images} images, UK language metadata, single H1/title, canonical/meta/noindex, unique IDs, image dimensions/alts, explicit button types, preview-form safety and JavaScript syntax.`);
