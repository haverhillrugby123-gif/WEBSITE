import { mkdir, copyFile, cp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pages } from './check-site.mjs';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of pages){const dest=path.join('dist',file);await mkdir(path.dirname(dest),{recursive:true});await copyFile(file,dest)}
await cp('assets','dist/assets',{recursive:true});
for(const file of ['robots.txt','sitemap.xml'])await copyFile(file,path.join('dist',file));
await writeFile('dist/revision.json', JSON.stringify({ revision: process.env.GITHUB_SHA || 'local', builtAt: new Date().toISOString() }) + '\n');
console.log('Draft build saved to dist. No deployment performed.');
