import {examCluster,supportFinder} from './overlay-parity.mjs';
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import path from 'node:path';
const origin='https://www.ukonlinetuition.co.uk';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceMap=JSON.parse(await readFile('scripts/canonical-map.json','utf8'));
const categories=JSON.parse(await readFile('content/categories.json','utf8'));
const media=JSON.parse(await readFile('content/media-manifest.json','utf8'));
const imageMap=new Map(media.entries.flatMap(e=>[e.url,...e.sourceUrls].map(url=>[url,e])));
const articles=await Promise.all((await readdir('content/articles')).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await readFile('content/articles/'+f,'utf8'))));
if(new Set(articles.map(a=>a.slug)).size!==articles.length)throw Error('Duplicate article slug');
if(new Set(articles.map(a=>a.title.toLowerCase())).size!==articles.length)throw Error('Duplicate article title');
articles.sort((a,b)=>b.firstPublishedDate.localeCompare(a.firstPublishedDate)||a.title.localeCompare(b.title));
const texts=nodes=>nodes.map(n=>typeof n==='string'?n:texts(n.children)).join(' ').replace(/\s+/g,' ').trim();
const articleMap=new Map(articles.map(a=>['/post/'+a.slug,'post/'+a.slug+'/index.html']));
const routes=new Map(Object.entries(sourceMap).map(([file,entry])=>[new URL(entry.url).pathname,file]));
routes.set('/general-9','general-9/index.html');routes.set('/blank-1','blank-1/index.html');routes.set('/search','search/index.html');routes.set('/blog','blog/index.html');
for(const c of categories)routes.set(c.url.path,'blog/categories/'+c.slug+'/index.html');
for(const [url,file]of articleMap)routes.set(url,file);
const tags=new Map();
function gather(n,article){if(typeof n==='string')return;const href=n.attrs?.href;if(href){try{const u=new URL(href,origin);if(u.hostname==='www.ukonlinetuition.co.uk'&&u.pathname.startsWith('/blog/hashtags/')){if(!tags.has(u.pathname))tags.set(u.pathname,new Set());tags.get(u.pathname).add(article.slug);}}catch{}}n.children.forEach(c=>gather(c,article));}
articles.forEach(a=>a.body.forEach(n=>gather(n,a)));
for(const tag of tags.keys())routes.set(tag,tag.slice(1)+'/index.html');
const relative=(file,target)=>path.posix.relative(path.posix.dirname(file),target)||'index.html';
function link(file,href){
 if(!href)return null;
 if(href.startsWith('#'))return href;
 if(/^(mailto:|tel:)/.test(href))return href;
 let u;try{u=new URL(href,origin);}catch{return null;}
 if(!['https:','http:'].includes(u.protocol))return null;
 if(['www.ukonlinetuition.co.uk','ukonlinetuition.co.uk'].includes(u.hostname)){
  const target=routes.get(u.pathname.replace(/\/$/,'')||'/');
  if(!target)throw Error('Unmapped public internal link '+href);
  return relative(file,target)+u.search+u.hash;
 }
 return u.href;
}
function body(nodes,file){return nodes.map(n=>{
 if(typeof n==='string')return esc(n);
 if(['script','style','iframe','svg','path','button','input','form'].includes(n.tag))return '';
 const children=body(n.children,file);
 if(n.tag==='img'){
  const image=imageMap.get(n.attrs['data-pin-media']||n.attrs.src);if(!image)throw Error('Missing preserved image');
  return `<img src="${esc(relative(file,image.localFile))}" alt="${esc(n.attrs.alt||'')}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">`;
 }
 if(n.tag==='a'){const href=link(file,n.attrs.href);return href?`<a href="${esc(href)}">${children}</a>`:children;}
 const tag=n.tag==='h1'?'h2':n.tag;
 if(!['p','h2','h3','h4','h5','h6','strong','em','u','s','ul','ol','li','blockquote','code','pre','table','thead','tbody','tr','th','td','caption','figure','figcaption','br','hr','sup','sub'].includes(tag))return children;
 if(['br','hr'].includes(tag))return `<${tag}>`;
 const attrs=tag==='ol'&&/^\d+$/.test(n.attrs.start||'')?` start="${n.attrs.start}"`:'';
 return `<${tag}${attrs}>${children}</${tag}>`;
}).join('');}
// Keep the local review inside the replacement for known production links.
// Metadata canonicals remain absolute; only ordinary anchors are rebased.
for(const file of [...Object.keys(sourceMap),'404.html']){
 const source=await readFile(file,'utf8');
 const rewritten=source.replace(/(<a\b[^>]*\bhref=")(https:\/\/(?:www\.)?ukonlinetuition\.co\.uk[^\"]*)"/g,(_,prefix,href)=>prefix+esc(link(file,href.replaceAll('&amp;','&')))+'"');
 if(rewritten!==source)await writeFile(file,rewritten);
}
const base=await readFile('about/index.html','utf8');
const nav=base.match(/<nav id="ukot-global-nav"[\s\S]*?<\/nav>/)[0];
const footer=base.match(/<footer>[\s\S]*?<\/footer>/)[0];
function rebase(html,oldFile,newFile){return html.replace(/\b(href|src|srcset)="([^"]+)"/g,(m,attr,url)=>{
 if(/^(https?:|mailto:|tel:|data:|#)/.test(url))return m;
 const [plain,query='']=url.split('?');const target=plain.startsWith('/WEBSITE/')?plain.slice(9):path.posix.normalize(path.posix.join(path.posix.dirname(oldFile),plain));
 return `${attr}="${esc(relative(newFile,target)+(query?'?'+query:''))}"`;
});}
const categoryLabels=new Map(categories.map(c=>[c.id,c.label]));
const categoryPriority=['GCSE English','GCSE Maths','11+ & Entrance Exams','Primary English & Maths','Revision & Study Skills'];
const resourceLabel=label=>({'11+ & Entrance Exams':'11+','Primary English & Maths':'Primary','Revision & Study Skills':'General study guidance'}[label]||label);
function routeFor(a){const labels=a.categories.map(id=>categoryLabels.get(id));const label=categoryPriority.find(c=>labels.includes(c));return label==='GCSE English'?'?service=gcse&subject=english':label==='GCSE Maths'?'?service=gcse':label==='11+ & Entrance Exams'?'?service=11-plus':label==='Primary English & Maths'?'?service=primary':'';}
function enquiry(file,a){const labels=a?.categories.map(id=>categoryLabels.get(id))||[];const english=labels.includes('GCSE English');return `<aside class="article-enquiry"><h2>${english?'Need support with GCSE English?':'Need teaching alongside your revision?'}</h2><p>${english?'Ask about English Language or Literature support.':'English, Maths and 11+ tuition can focus on the difficulty behind the practice.'} Tell us the year group, subject and support needed.</p><a href="${esc(relative(file,'contact/index.html')+(a?routeFor(a):''))}">Start a tuition enquiry →</a><p>Your enquiry is prepared as an unsent email for you to review and send.</p></aside>`;}
export const migrationPages=[];
export const migrationCanonicalMap={};
async function page(file,{title,description,canonical,content,schema}){
 const head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | UK Online Tuition</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="${schema?'article':'website'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="twitter:card" content="summary"><meta name="theme-color" content="#10213b"><link rel="icon" href="${relative(file,'assets/favicon.svg')}" type="image/svg+xml">`;
 const css=['live-design.css','brand.css','refinement.css','visual-finish.css','articles.css'].map(name=>`<link rel="stylesheet" href="${relative(file,'assets/'+name)}">`).join('');
 const html=`<!doctype html><html lang="en-GB"><head>${head}${css}${schema?'<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>':''}</head><body class="article-page"><a class="draft-skip" tabindex="0" href="#main-content">Skip to content</a>${rebase(nav,'about/index.html',file)}<main id="main-content" tabindex="-1">${content}</main>${rebase(footer,'about/index.html',file)}<script src="${relative(file,'assets/main.js')}" defer></script><script src="${relative(file,'assets/live-design.js')}" defer></script></body></html>\n`;
 await mkdir(path.posix.dirname(file),{recursive:true});await writeFile(file,html);migrationPages.push(file);migrationCanonicalMap[file]={url:canonical,title,verifiedOn:'2026-09-30',state:'Public-source route preserved in protected replacement preview'};
}
function descriptionFor(a){return a.description.length>=40?a.description:texts(a.body).slice(0,180).replace(/\s+\S*$/,'');}
function archiveNav(file){return `<nav class="article-nav" aria-label="Resource navigation"><a href="${relative(file,'resources/index.html')}">All resources</a><a href="${relative(file,'search/index.html')}">Search pages and articles</a><details><summary>Browse categories</summary><div>${categories.map(c=>`<a href="${relative(file,'blog/categories/'+c.slug+'/index.html')}">${esc(c.label)}</a>`).join('')}</div></details></nav>`;}
function cards(file,list,fullText=false){return `<div class="article-list">${list.map(a=>`<article class="article-card"${fullText?` data-search="${esc(a.title+' '+texts(a.body))}"`:''}><h2><a href="${relative(file,'post/'+a.slug+'/index.html')}">${esc(a.title)}</a></h2><p>${esc(descriptionFor(a))}</p></article>`).join('')}</div>`;}
for(const a of articles){
 const file='post/'+a.slug+'/index.html';const canonical=origin+'/post/'+a.slug;const description=descriptionFor(a);
 const edit=a.provenance.editorialChanges.length?'<p>Guidance reviewed 30 September 2026.</p>':'';
 let articleBody=body(a.body,file);
 if(a.slug.startsWith('free-')&&a.slug.endsWith('-diagnostic')){const answer='<h2>Answers';const start=articleBody.indexOf(answer);if(start>=0){const end=articleBody.indexOf('</h2>',start);articleBody=articleBody.slice(0,start)+`<details class="diagnostic-answers"><summary>Check the answers and marking guidance</summary>`+articleBody.slice(end+5)+'</details>';}}
 const content=`${archiveNav(file)}<header class="article-header"><p>Revision resource</p><h1>${esc(a.title)}</h1><p>${esc(description)}</p><time datetime="${esc(a.firstPublishedDate)}">First published ${new Date(a.firstPublishedDate).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</time>${edit}</header><div class="article-layout">${enquiry(file,a)}<article class="article-body">${examCluster(a,file,relative)}${articleBody}<aside class="article-source-note"><h2>About this resource</h2><p>Revision guidance from UK Online Tuition. <a href="${relative(file,'about/index.html')}">Read about Daniel Harris and the teaching approach</a>.</p>${/aqa.*english-language|english-language.*aqa/.test(a.slug)?'<p>Use your current exam specification and question instructions. <a href="https://www.aqa.org.uk/subjects/english/gcse/english-8700/specification">Official AQA GCSE English Language specification</a>.</p>':''}</aside></article>${enquiry(file,a)}</div>`;
 await page(file,{title:a.title,description,canonical,content,schema:{'@context':'https://schema.org','@type':'Article',headline:a.title,description,datePublished:a.firstPublishedDate,dateModified:a.provenance.editorialChanges.length?'2026-09-30':a.lastPublishedDate,mainEntityOfPage:canonical}});
}
for(const c of categories){const file='blog/categories/'+c.slug+'/index.html';const list=articles.filter(a=>a.categories.includes(c.id));await page(file,{title:c.title,description:c.description.length>=40?c.description:`Revision articles and practical guidance for ${c.label.toLowerCase()} from UK Online Tuition.`,canonical:origin+c.url.path,content:`${archiveNav(file)}<header class="article-header"><p>Resource category</p><h1>${esc(c.title)}</h1><p>${esc(c.description)}</p><p>${list.length} articles</p></header>${cards(file,list)}`});}
for(const [tag,slugs]of tags){const file=tag.slice(1)+'/index.html';const title='#'+decodeURIComponent(tag.split('/').at(-1));const list=articles.filter(a=>slugs.has(a.slug));await page(file,{title,description:`Previously tagged ${title} revision articles and tuition guidance from UK Online Tuition. Browse their full content and related resources.`,canonical:origin+tag,content:`${archiveNav(file)}<header class="article-header"><p>Resource tag</p><h1>${esc(title)}</h1><p>${list.length} articles carrying this tag in their preserved source content.</p></header>${cards(file,list)}`});}
const searchFile='search/index.html';
let searchCards=cards(searchFile,articles,true);
const serviceCards=[];
for(const [file,entry]of Object.entries(sourceMap)){const raw=await readFile(file,'utf8');const text=raw.match(/<main\b[\s\S]*?<\/main>/)?.[0]?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')||entry.title;serviceCards.push(`<article class="article-card" data-search="${esc(entry.title+' '+text)}"><h2><a href="${relative(searchFile,file)}">${esc(entry.title)}</a></h2><p>Tuition information and guidance from UK Online Tuition.</p></article>`);}
searchCards=searchCards.replace('</div>',serviceCards.join('')+'</div>');
await page(searchFile,{title:'Search tuition pages and revision articles',description:'Search UK Online Tuition service information and all 52 revision articles. Browse categories and find practical English, Maths and 11+ guidance.',canonical:origin+'/search',content:`${archiveNav(searchFile)}<header class="article-header"><p>Find useful guidance</p><h1>Search pages and revision articles</h1><p>Search titles and article text across tuition information and revision resources.</p><p><a href="#resource-search-title">Search pages and articles</a> · <a href="#support-finder-title">Try the support finder</a></p></header>${supportFinder(searchFile,relative)}<h2 id="resource-search-title" tabindex="-1">Search pages and articles</h2><form class="article-tools" id="article-search-form" role="search"><label for="article-search">Search pages and articles</label><input type="search" id="article-search" name="q" maxlength="120" disabled><button type="submit" disabled>Search</button><button type="button" id="article-search-clear" disabled>Clear</button></form><p class="migration-notice" id="article-search-note">Search tools need JavaScript. All page and article links are available below.</p><p class="migration-notice" id="article-search-status" role="status">${articles.length+serviceCards.length} results available</p>${searchCards}<p class="migration-notice" id="article-search-empty" hidden>No matching pages or articles. Try fewer words or clear the search.</p>`});
for(const route of ['general-9','blank-1']){const d=JSON.parse(await readFile('content/'+route+'.json','utf8'));const destination=route==='general-9'?'testimonials':'our-story';const file=destination+'/index.html';await page(file,{title:d.title,description:route==='general-9'?'Previously published parent and student testimonials from UK Online Tuition, preserved for the replacement website with source provenance retained for publication review.':'The story and teaching team of UK Online Tuition, preserved from the existing public company page without additional tutor qualifications or availability claims.',canonical:origin+'/'+destination,content:`<header class="article-header"><p>UK Online Tuition</p><h1>${esc(d.title)}</h1><p>${route==='general-9'?'Previously published reviews. Current advertised tuition focuses on English, Maths and 11+.':'Our story and teaching team. Ask about the tutor and support available for your enquiry.'}</p></header><div class="article-layout"><div class="article-body">${body(d.body,file)}</div>${enquiry(file)}</div>`});}
const company=JSON.parse(await readFile('content/astra-about-ukot.json','utf8'));const companyFile='blank-1/index.html';await page(companyFile,{title:'About UK Online Tuition',description:company.description,canonical:origin+'/blank-1',content:`<header class="article-header"><p>About UK Online Tuition</p><h1>${esc(company.title)}</h1><p>${esc(company.description)}</p></header><div class="article-layout"><article class="article-body">${body(company.body,companyFile)}<p><a href="${relative(companyFile,'about/index.html')}">Read about founder Daniel Harris</a></p></article>${enquiry(companyFile)}</div>`});
// Preserve the existing resource layout and controls while adding the seven missing articles.
let resources=await readFile('resources/index.html','utf8');
const grid=articles.map(a=>{const labels=a.categories.map(id=>resourceLabel(categoryLabels.get(id)));const primary=categoryPriority.map(resourceLabel).find(l=>labels.includes(l))||'General study guidance';return `<a class="card" data-categories="${esc(labels.join('|'))}" href="../post/${a.slug}/index.html"><span class="cat">${esc(primary)}</span><h3>${esc(a.title)}</h3><span class="go">Read resource →</span></a>`;}).join('');
resources=resources.replace(/<div class="grid">[\s\S]*?<\/div><div class="empty"/,`<div class="grid">${grid}</div><div class="empty"`).replace(/\d+ resources shown/,`${articles.length} resources shown`);
await writeFile('resources/index.html',resources);
// Existing production service URLs receive equivalent pages, not a blanket homepage redirect.
for(const [source,entry]of Object.entries(sourceMap)){
 const route=new URL(entry.url).pathname;if(route==='/'||route==='/how-it-works')continue;
 const file=route.slice(1)+'/index.html';if(migrationPages.includes(file))continue;
 const html=rebase(await readFile(source,'utf8'),source,file);await mkdir(path.posix.dirname(file),{recursive:true});await writeFile(file,html);migrationPages.push(file);migrationCanonicalMap[file]={...entry,state:'Equivalent protected service route'};
}
for(const [alias,source]of [['about-founder','about/index.html'],['11','11-plus/index.html']]){const file=alias+'/index.html';await mkdir(alias,{recursive:true});await writeFile(file,rebase(await readFile(source,'utf8'),source,file));migrationPages.push(file);migrationCanonicalMap[file]={...sourceMap[source],state:'Equivalent review-only target for historical Harmony static redirect proposal; no redirect activated'};}
const urls=[...new Set([...Object.values(sourceMap),...Object.values(migrationCanonicalMap)].map(e=>e.url))].sort();
await writeFile('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${esc(url)}</loc></url>`).join('')+'</urlset>\n');
await writeFile('content/migration-route-status.json',JSON.stringify({generatedOn:'2026-09-30',articles:articles.length,productionArticles:articles.filter(a=>!a.provenance.sourceSiteId).length,referenceOriginalArticles:articles.filter(a=>a.provenance.sourceSiteId==='9acfbd18-b294-48b8-add2-4e0c912bead9').length,categories:categories.length,localArticleImages:media.entries.length,generatedRoutes:migrationPages,unresolvedRoutes:[{path:'/members',reason:'Existing Wix account/member functionality needs an owner-approved continuation, migration or retirement decision; no private records exported.'},{path:'/group/uk-online-tuition-group/discussion',reason:'Existing group/discussion functionality needs an owner-approved continuation, migration or retirement decision; no discussions copied.'}],publication:false},null,2)+'\n');
console.log(`Generated ${articles.length} article pages, ${categories.length} category archives, ${tags.size} tag archives, search and preserved service routes. No publication.`);
