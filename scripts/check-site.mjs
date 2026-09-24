import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { checkReferences, checkPrivacy, forbiddenClientAPI } from './validation.mjs';
import './validation.test.mjs';
import './interaction.test.mjs';
import { execFileSync } from 'node:child_process';

export const pages = ['index.html','how-it-works/index.html','gcse/index.html','11-plus/index.html','primary/index.html','about/index.html','resources/index.html','faq/index.html','contact/index.html','work-with-us/index.html','404.html'];

const scripts = ['assets/main.js','assets/live-design.js','assets/motion.js'];
let refs = 0;
let images = 0;

for (const page of pages) {
  const html = (await readFile(page, 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
  const fail = message => { throw new Error(`${page}: ${message}`); };

  if (!html.includes('<html lang="en-GB">')) fail('document language must be en-GB');
  if ((html.match(/<h1\b/g) || []).length !== 1) fail('expected exactly one h1');
  if ((html.match(/<title>/g) || []).length !== 1) fail('expected exactly one title');
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail('meaningful meta description missing');
  if (!/<link rel="canonical" href="https:\/\/www\.ukonlinetuition\.co\.uk\//.test(html)) fail('canonical URL missing or unexpected');
  if (!html.includes('name="viewport"')) fail('viewport missing');
  if (!html.includes('noindex,nofollow')) fail('draft indexing protection missing');
  if (!html.includes('class="draft-skip"')) fail('skip link missing');

  checkReferences(html, fail);
  checkPrivacy(html, [...scripts, ...scripts.map(script => '/WEBSITE/' + script)], fail);
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  const expectedPath = page === 'index.html' ? '' : page === '404.html' ? '404/' : page.replace('index.html','');
  if (canonical.length !== 1 || canonical[0][1] !== 'https://www.ukonlinetuition.co.uk/'+expectedPath) fail('canonical must match the production page');
  if (!/<meta name="robots" content="noindex,nofollow"/.test(html)) fail('robots meta protection missing');

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    const tag = match[0];
    if (!/\balt="[^"]*"/.test(tag)) fail('image missing alt attribute');
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) fail('image missing intrinsic width/height');
  }

  for (const match of html.matchAll(/<button\b[^>]*>/g)) {
    if (!/\btype="(?:button|submit)"/.test(match[0])) fail('button missing explicit type');
  }

  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [relative, hash] = url.split('#');
    if (relative && relative.split('?')[0].endsWith('/')) fail(`directory link is not portable in downloaded preview: ${url}`);
    if (relative.startsWith('/') && !relative.startsWith('/WEBSITE/')) fail(`unexpected absolute preview reference ${url}`);
    const localPath = relative.startsWith('/WEBSITE/') ? relative.slice('/WEBSITE/'.length) : relative;
    const basePath = relative.startsWith('/WEBSITE/') ? '.' : path.dirname(page);
    const dest = relative ? path.normalize(path.join(basePath, localPath.split('?')[0])) : page;
    const target = dest.endsWith('.html') || path.extname(dest) ? dest : path.join(dest, 'index.html');
    try { await access(target); } catch { fail(`broken local reference ${url}`); }
    if (target.endsWith('.html') && !pages.includes(target.split(path.sep).join('/'))) fail(`page missing from build: ${target}`);
    if (hash) {
      const body = await readFile(target, 'utf8');
      if (!body.includes(`id="${hash}"`)) fail(`missing anchor ${url}`);
    }
    refs++;
  }

  if (page === 'contact/index.html') {
    if (!html.includes('class="formcard email-form"')) fail('email enquiry form marker missing');
    if (/\saction=/.test(html)) fail('enquiry form must not submit directly to a network endpoint');
    if (!html.includes('id="prepare-enquiry"')) fail('email preparation control missing');
  }
}

const mainJs = await readFile('assets/main.js','utf8');
if (!mainJs.includes('mailto:ukonlinetuition1@gmail.com')) throw new Error('assets/main.js: enquiry email handoff missing');
if (!mainJs.includes('encodeURIComponent')) throw new Error('assets/main.js: enquiry values must be encoded');


const robots = await readFile('robots.txt','utf8');
if (!/^User-agent: \*\s*\r?\nDisallow: \/\s*$/m.test(robots)) throw new Error('robots.txt: preview crawl block missing');
const faq = await readFile('faq/index.html','utf8');
const schema = JSON.parse(faq.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const answers = [...faq.matchAll(/<details[^>]*><summary>(.*?)<\/summary><div class="answer">(.*?)<\/div><\/details>/g)];
if (schema.mainEntity.length !== answers.length || answers.some(([,question,answer],i)=>schema.mainEntity[i].name!==question || schema.mainEntity[i].acceptedAnswer.text!==answer)) throw new Error('FAQ structured data must match visible answers');
for (const script of scripts) {
  if (forbiddenClientAPI.test(await readFile(script,'utf8'))) throw new Error(`${script}: unapproved network or storage primitive`);
  execFileSync(process.execPath, ['--check', script]);
}

console.log(`PASS: ${pages.length} HTML pages, ${refs} local references, ${images} images, UK language metadata, single H1/title, canonical/meta/noindex, unique IDs, image dimensions/alts, explicit button types, email-handoff safety and JavaScript syntax.`);
