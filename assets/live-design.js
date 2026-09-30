// Local draft interactions. No requests, tracking, storage or enquiry delivery.
const liveMenu = document.querySelector('.ukot-canonical-toggle');
const liveLinks = document.querySelector('.ukot-canonical-links');
if(liveMenu && liveLinks){
 const setMenu = open => {liveLinks.classList.toggle('ukot-open',open);liveMenu.setAttribute('aria-expanded',String(open));liveMenu.textContent=open?'Close':'Menu';};
 liveMenu.addEventListener('click',()=>setMenu(liveMenu.getAttribute('aria-expanded')!=='true'));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&liveLinks.classList.contains('ukot-open')){setMenu(false);liveMenu.focus();}});
 for(const type of ['click','focusin']) document.addEventListener(type,e=>{if(!liveLinks.contains(e.target)&&!liveMenu.contains(e.target))setMenu(false);});
 liveLinks.querySelectorAll('a').forEach(a=>{if(new URL(a.href).pathname.replace(/index\.html$/, '')===location.pathname.replace(/index\.html$/, ''))a.setAttribute('aria-current','page');a.addEventListener('click',()=>setMenu(false));});
 matchMedia('(min-width:901px)').addEventListener('change',()=>setMenu(false));
 document.documentElement.classList.add('nav-ready');
}
const resourceRoot=document.querySelector('#ukot-lib');
if (resourceRoot) {
 const search = resourceRoot.querySelector('.search');
 const cards = [...resourceRoot.querySelectorAll('.grid .card')];
 const filters = [...resourceRoot.querySelectorAll('.filter[data-f]')];
 let category = 'all';
 const update = () => {
  const normalise = text => text.toLowerCase().replace(/[’‘]/g, "'").replace(/&/g, ' and ').replace(/\b11(?:\s*-?\s*plus|\s*\+)/g, '11+');
  const words = normalise(search.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;
  cards.forEach(card => {
   const cat = card.querySelector('.cat').textContent.trim();
   const text = normalise(`${cat} ${card.querySelector('h3').textContent}`);
   const categories = (card.dataset.categories || cat).split('|');
   const show = (category === 'all' || categories.includes(category)) && words.every(word => text.includes(word));
   card.hidden = !show;
   if (show) count++;
  });
  filters.forEach(button => {
   const selected = button.dataset.f === category;
   button.classList.toggle('on', selected);
   button.setAttribute('aria-pressed', String(selected));
  });
  resourceRoot.querySelector('#ukot-resource-status').textContent = `${count} ${count === 1 ? 'resource' : 'resources'} shown`;
  resourceRoot.querySelector('.empty').hidden = count > 0;
 };
 filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.f; update(); }));
 search.addEventListener('input', update);
 resourceRoot.querySelector('#clear-resources').addEventListener('click', () => {
  category = 'all'; search.value = ''; update(); search.focus();
 });
 update();
 // Enable controls only after every handler and the initial results are ready.
 [search, ...filters, resourceRoot.querySelector('#clear-resources')].forEach(control => { control.disabled = false; });
 const toolsNote = resourceRoot.querySelector('#resource-tools-note');
 if (toolsNote) toolsNote.hidden = true;
 resourceRoot.classList.add('resources-ready');
}

const articleSearch = document.querySelector('#article-search-form');
if (articleSearch) {
 const input = articleSearch.querySelector('#article-search');
 const cards = [...document.querySelectorAll('.article-card[data-search]')];
 const normalise = text => text.toLowerCase().replace(/&/g,' and ').replace(/\b11(?:\s*-?\s*plus|\s*\+)/g,'11+');
 const update = () => {
  const words = normalise(input.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;
  cards.forEach(card => { card.hidden = !words.every(word => normalise(card.dataset.search).includes(word)); if (!card.hidden) count++; });
  document.querySelector('#article-search-status').textContent = `${count} ${count === 1 ? 'result' : 'results'} shown`;
  document.querySelector('#article-search-empty').hidden = count > 0;
 };
 input.value = (new URLSearchParams(location.search).get('q') || '').slice(0,120);
 input.addEventListener('input',update);
 articleSearch.addEventListener('submit',event => {event.preventDefault();update();history.replaceState(null,'',location.pathname+(input.value?'?q='+encodeURIComponent(input.value):''));});
 articleSearch.querySelector('#article-search-clear').addEventListener('click',() => {input.value='';update();history.replaceState(null,'',location.pathname);input.focus();});
 articleSearch.querySelectorAll('input,button').forEach(control=>control.disabled=false);
 document.querySelector('#article-search-note').hidden=true;
 update();
}

const supportFinder = document.querySelector('#support-finder-form');
if (supportFinder) {
 const result = document.querySelector('#support-finder-result');
 const title = document.querySelector('#support-result-title');
 const explanation = document.querySelector('#support-result-text');
 const answers = document.querySelector('#support-result-answers');
 const links = document.querySelector('#support-result-links');
 const stages = {
  gcse: ['Start with targeted GCSE diagnosis.', 'Bring recent work, mock responses or topic results if available. Identify whether the main issue is knowledge, method, exam technique or independence.', 'GCSE tuition', supportFinder.dataset.gcse],
  '11-plus': ['Start with the actual 11+ target test.', 'Confirm the target school or local test format, then identify the strongest and weakest English, maths or reasoning areas.', '11+ tuition', supportFinder.dataset.eleven],
  primary: ['Start with the foundations that matter next.', 'A recent piece of reading, writing or maths work can help identify a specific gap, confidence, fluency or greater challenge.', 'Primary tuition', supportFinder.dataset.primary],
  other: ['Start with a short diagnostic conversation.', 'Look at current work or a short task, identify the main barrier and discuss whether suitable tuition could help.'],
 };
 const clear = () => { result.hidden = true; links.replaceChildren(); };
 supportFinder.addEventListener('change', clear);
 supportFinder.addEventListener('submit', event => {
  event.preventDefault();
  if (!supportFinder.reportValidity()) return;
  const chosen = stages[supportFinder.elements.stage.value];
  if (!chosen) return;
  title.textContent = chosen[0]; explanation.textContent = chosen[1];
  answers.textContent = 'Your priorities: ' + ['difficulty','cause','evidence','goal'].map(name => supportFinder.elements[name].selectedOptions[0].textContent).join('; ') + '.';
  links.replaceChildren();
  if (chosen[2]) { const link = document.createElement('a'); link.href = chosen[3]; link.textContent = chosen[2]; links.append(link); }
  const enquire = document.createElement('a'); enquire.href = supportFinder.dataset.contact + (supportFinder.elements.stage.value === 'other' ? '' : '?service=' + supportFinder.elements.stage.value); enquire.textContent = 'Start a tuition enquiry'; links.append(enquire);
  result.hidden = false; result.focus();
 });
 document.querySelector('#support-finder-reset').addEventListener('click', () => { supportFinder.reset(); clear(); supportFinder.elements.stage.focus(); });
 supportFinder.querySelector('fieldset').disabled = false;
 document.querySelector('#support-finder-note').textContent = 'Answers stay on this page. Nothing is sent or stored; start an enquiry separately if you want to discuss support.';
}

const faqQuestions = document.querySelector('#ukot-faq .questions');
if (faqQuestions) {
 const questions = [...faqQuestions.querySelectorAll('details')];
 questions.forEach(question => question.addEventListener('toggle', () => { if (question.open) questions.forEach(other => { if (other !== question) other.open = false; }); }));
}

