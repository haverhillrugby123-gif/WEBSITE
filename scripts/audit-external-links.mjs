import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pages} from './check-site.mjs';
const links=new Set();
// Audit visitor navigation anchors. Protected-preview canonical metadata can
// intentionally refer to proposed production URLs which are not launched yet.
for(const page of pages) for(const m of (await readFile(page,'utf8')).matchAll(/<a\b[^>]*\bhref="(https:\/\/[^"<>]+)"/g)) links.add(m[1].replaceAll('&amp;','&'));
const results=[];
const queue=[...links];
await Promise.all(Array.from({length:4},async()=>{while(queue.length){const url=queue.shift();try {const r=await fetch(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(20000)}); results.push({url,status:r.status,finalURL:r.url,ok:r.ok}); await r.body?.cancel();}catch(e){results.push({url,status:null,ok:false,error:e.name+': '+e.message});}}}));
await mkdir('qa',{recursive:true});
await writeFile('qa/external-links.json',JSON.stringify({checkedAt:new Date().toISOString(),limitation:'Read-only availability observations; a successful HTTP response does not verify educational content accuracy.',results:results.sort((a,b)=>a.url.localeCompare(b.url))},null,2));
console.log(JSON.stringify({total:results.length,passed:results.filter(r=>r.ok).length,failures:results.filter(r=>!r.ok)}));
