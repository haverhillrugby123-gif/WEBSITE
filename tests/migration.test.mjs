import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import {chromium,firefox,webkit} from '@playwright/test';
const root=path.resolve('dist');
const routes=JSON.parse(await readFile('content/migration-route-status.json','utf8')).generatedRoutes;
const server=http.createServer(async(req,res)=>{try{assert.equal(req.method,'GET');const url=new URL(req.url,'http://localhost');assert(url.pathname.startsWith('/WEBSITE/'));let file=path.resolve(root,decodeURIComponent(url.pathname.slice(9)));assert(file.startsWith(root+path.sep));if((await stat(file)).isDirectory())file=path.join(file,'index.html');const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':type+'; charset=utf-8'}).end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/WEBSITE/`;
try{
 for(const [name,engine]of Object.entries({chromium,firefox,webkit})){
  await test(`${name}: all migrated routes preserve readable content and reflow at 320/1348px`,async()=>{
   const browser=await engine.launch();try{
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>route.request().url().startsWith(base)&&route.request().method()==='GET'?route.continue():route.abort());
    for(const width of [320,1348]){await page.setViewportSize({width,height:900});for(const file of routes){const response=await page.goto(base+file);assert.equal(response.status(),200,file);const result=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,body:document.querySelector('main').innerText.length,noindex:document.querySelector('meta[name=robots]').content,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1}));assert.equal(result.h1,1,file);assert(result.body>200,file);assert.equal(result.noindex,'noindex,nofollow',file);assert.equal(result.overflow,false,file+' '+width);}}
    await page.goto(base+'post/aqa-gcse-english-language-paper-1/index.html');
    assert.match(await page.locator('.article-body').innerText(),/multiple.choice/i);
    const categories=page.locator('.article-nav summary');await categories.focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('.article-nav details').getAttribute('open'),'');
    await page.getByRole('link',{name:/Start a tuition enquiry/}).first().click();
    await page.waitForFunction(()=>document.querySelector('#service')?.value==='gcse');
    assert.equal(await page.locator('#subject').inputValue(),'English');
    await page.goto(base+'search/index.html?q=macbeth');
    await page.waitForFunction(()=>!document.querySelector('#article-search').disabled);
    assert.match(await page.locator('#article-search-status').innerText(),/4 results/);
    await page.locator('#article-search').fill('zzzznotanarticle');
    await page.getByRole('button',{name:'Search',exact:true}).click();
    assert.equal(await page.locator('#article-search-empty').isVisible(),true);
    await page.getByRole('button',{name:'Clear',exact:true}).click();
    assert.match(await page.locator('#article-search-status').innerText(),/62 results/);
    assert.equal(new URL(page.url()).search,'');
    await page.goto(base+'post/free-gcse-maths-diagnostic/index.html');
    const answers=page.locator('.diagnostic-answers');assert.equal(await answers.getAttribute('open'),null);
    await answers.locator('summary').focus();await page.keyboard.press('Enter');
    assert.equal(await answers.getAttribute('open'),'');assert.match(await answers.innerText(),/26\s*cm/);
    await page.goto(base+'search/index.html');
    await page.waitForFunction(()=>!document.querySelector('#support-finder-form fieldset').disabled);
    for(const [name,value]of Object.entries({stage:'11-plus',difficulty:'exam',cause:'mixed',evidence:'some',goal:'marks'}))await page.locator('#support-'+name).selectOption(value);
    await page.getByRole('button',{name:'Show suggested next step'}).click();
    assert.equal(await page.locator('#support-finder-result').isVisible(),true);
    assert.match(await page.locator('#support-result-title').innerText(),/actual 11\+ target test/);
    assert.equal(await page.locator('#support-finder-result').evaluate(el=>el===document.activeElement),true);
    await page.locator('#support-stage').selectOption('gcse');
    assert.equal(await page.locator('#support-finder-result').isVisible(),false);
    await page.getByRole('button',{name:'Show suggested next step'}).click();
    assert.match(await page.locator('#support-result-title').innerText(),/targeted GCSE diagnosis/);
    await page.getByRole('button',{name:'Start again',exact:true}).click();
    assert.equal(await page.locator('#support-stage').inputValue(),'');
    await page.goto(base+'general-9/index.html');
    assert.match(await page.locator('h1').innerText(),/first question[\s\S]*first lesson/i);
    await page.goto(base+'blank-1/index.html');
    assert.match(await page.locator('h1').innerText(),/specific enough to change/i);
    await page.goto(base+'post/aqa-english-language-paper-1-question-3-structure-2026/index.html');
    assert.equal(await page.locator('.exam-cluster a').count(),5);
    assert.match(await page.locator('.exam-cluster a[aria-current=page]').innerText(),/Q3/);
    assert.deepEqual(errors,[]);
   }finally{await browser.close();}
  });
 }
 await test('article provenance, local image bytes and public route completeness',async()=>{
  const report=JSON.parse(await readFile('content/migration-route-status.json','utf8'));assert.equal(report.articles,52);assert.equal(report.categories,5);assert.equal(report.localArticleImages,25);assert.deepEqual(report.unresolvedRoutes.map(r=>r.path),['/members','/group/uk-online-tuition-group/discussion']);
  const media=JSON.parse(await readFile('content/media-manifest.json','utf8'));for(const image of media.entries){const bytes=await readFile(image.localFile);assert.equal(bytes.length,image.localBytes);assert(image.alt);assert(image.width>0&&image.height>0);}
 });
 await test('six reference originals preserve native sections and historical redirects have real targets',async()=>{
  const raw=await readFile('content/sources/harmony-six-published-posts.json');
  const originals=JSON.parse(raw);assert.equal(originals.length,6);
  const digest=createHash('sha256').update(raw).digest('hex');
  for(const original of originals){
   const article=JSON.parse(await readFile('content/articles/'+original.slug+'.json','utf8'));
   assert.equal(article.title,original.title);assert.equal(article.firstPublishedDate,original.firstPublishedDate);assert.equal(article.lastPublishedDate,original.lastPublishedDate);
   assert.equal(article.provenance.nativeSourceSha256,digest);assert.equal(article.provenance.nativePostId,original.id);
   assert.deepEqual(article.body.map(n=>n.children.join('')),original.richContent.nodes.map(n=>n.nodes.map(t=>t.textData.text).join('')));
   assert.deepEqual(article.body.map(n=>n.tag),original.richContent.nodes.map(n=>n.type==='HEADING'?'h'+n.headingData.level:'p'));
  }
  const redirectReview=JSON.parse(await readFile('content/sources/historical-redirect-review.json','utf8'));
  assert.equal(redirectReview.rows.length,27);assert.equal(redirectReview.replacementRedirectsActivated,false);
  for(const row of redirectReview.rows){const file=row.to.slice(1)+'/index.html';assert((await readFile('dist/'+file,'utf8')).includes('<h1'),row.to);}
 });
}finally{await new Promise(resolve=>server.close(resolve));}

