import { mkdir, copyFile, cp, rm, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pages } from './check-site.mjs';
import { buildProfile, enquiryCandidate } from './build-profile.mjs';
const profile = buildProfile(process.argv.slice(2));
const output = profile.directory;
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for (const file of pages) {
  const dest = path.join(output, file);
  await mkdir(path.dirname(dest), {recursive:true});
  let html = await readFile(file, 'utf8');
  if (file === '404.html' && profile.root) html = html.replaceAll('/WEBSITE/', '/');
  if (profile.enquiryPreview) html = enquiryCandidate(file, html);
  await writeFile(dest, html);
}
await cp('assets',path.join(output,'assets'),{recursive:true});
for(const file of ['robots.txt','sitemap.xml'])await copyFile(file,path.join(output,file));
if (profile.root) await copyFile('hosting/root-headers.txt', path.join(output, '_headers'));
await writeFile(path.join(output,'revision.json'), JSON.stringify({ revision: process.env.GITHUB_SHA || 'local', builtAt: new Date().toISOString(), basePath: profile.basePath, enquiryPreview: profile.enquiryPreview }) + '\n');
console.log(`Draft build saved to ${output}. No deployment performed.`);
