// Semantic equivalents of inspected public ASTRA features; no Wix runtime scripts copied.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function examCluster(article, file, relative) {
 const paper = /^(aqa-gcse-english-language-paper-1|aqa-english-language-paper-1-question-)/.test(article.slug) ? 1 : /^(aqa-gcse-english-language-paper-2|aqa-english-language-paper-2-question-)/.test(article.slug) ? 2 : null;
 if (!paper) return '';
 const guides = paper === 1 ? [
  ['Q2 · Language','aqa-english-language-paper-1-question-2-language-analysis'],
  ['Q3 · Structure','aqa-english-language-paper-1-question-3-structure-2026'],
  ['Q4 · Evaluation','aqa-english-language-paper-1-question-4-evaluation-2026'],
  ['Q5 · Creative writing','aqa-english-language-paper-1-question-5-creative-writing-2026'],
 ] : [
  ['Q2 · Summary','aqa-english-language-paper-2-question-2-summary-inference-2026'],
  ['Q3 · Language','aqa-english-language-paper-2-question-3-language-analysis'],
  ['Q4 · Comparison','aqa-english-language-paper-2-question-4-comparison-2026'],
  ['Q5 · Viewpoint writing','aqa-english-language-paper-2-question-5-viewpoint-writing-2026'],
 ];
 guides.push(['Full Paper '+paper+' overview','aqa-gcse-english-language-paper-'+paper]);
 return `<nav class="exam-cluster" aria-label="AQA Paper ${paper} question guides"><h2>Question-by-question guides</h2><p>Move between the paper overview and focused guides.</p><div>${guides.map(([label,slug]) => `<a href="${relative(file,'post/'+slug+'/index.html')}"${slug===article.slug?' aria-current="page"':''}>${escape(label)}</a>`).join('')}</div></nav>`;
}
export function supportFinder(file, relative) {
 const questions = [
  ['stage','Which stage is the pupil at?',[['gcse','GCSE / Year 10–11'],['11-plus','11+ / entrance exam preparation'],['primary','Primary / KS2'],['other','Something else']]],
  ['difficulty','What is the main problem right now?',[['gaps','Knowledge gaps or falling behind'],['exam','Exam technique / converting knowledge into marks'],['confidence','Confidence and independence'],['stretch','Needs more challenge']]],
  ['cause','How clear is the cause of the problem?',[['clear','We know the exact topics or skills'],['mixed','We have a rough idea'],['unclear','Not clear — results are inconsistent']]],
  ['evidence','Is there recent work that could help diagnose it?',[['yes','Yes — school work, mock papers or assessments'],['some','A little'],['no','Not really']]],
  ['goal','What would make tuition feel worthwhile?',[['accuracy','Better accuracy and fewer repeated mistakes'],['marks','Stronger exam performance'],['independence','More independent work and less prompting'],['clarity','A clear plan for what to work on next']]],
 ];
 return `<section class="support-finder" aria-labelledby="support-finder-title"><h2 id="support-finder-title">What kind of support would be most useful?</h2><p>Five questions to narrow the starting point. This is guidance, not a formal academic assessment, score, grade prediction or pass probability.</p><form id="support-finder-form" data-gcse="${relative(file,'gcse/index.html')}" data-primary="${relative(file,'primary/index.html')}" data-eleven="${relative(file,'11-plus/index.html')}" data-contact="${relative(file,'contact/index.html')}"><fieldset disabled><legend>Find a useful starting point</legend>${questions.map(([id,label,options],i)=>`<label for="support-${id}">${i+1}. ${escape(label)}</label><select id="support-${id}" name="${id}" required><option value="">Choose an answer</option>${options.map(([value,text])=>`<option value="${value}">${escape(text)}</option>`).join('')}</select>`).join('')}<button type="submit">Show suggested next step</button><button type="button" id="support-finder-reset">Start again</button></fieldset></form><p id="support-finder-note">The finder needs JavaScript. You can still browse the services or start an enquiry using the page navigation. Answers are not sent or stored.</p><div id="support-finder-result" class="support-result" hidden tabindex="-1" aria-labelledby="support-result-title"><h3 id="support-result-title"></h3><p id="support-result-text"></p><p id="support-result-answers"></p><div id="support-result-links"></div></div></section>`;
}
