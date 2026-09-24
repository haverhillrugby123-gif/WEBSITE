// Local draft interactions. No requests, tracking, storage or enquiry delivery.
const liveMenu = document.querySelector('.ukot-canonical-toggle');
const liveLinks = document.querySelector('.ukot-canonical-links');
if(liveMenu && liveLinks){
 const setMenu = open => {liveLinks.classList.toggle('ukot-open',open);liveMenu.setAttribute('aria-expanded',String(open));liveMenu.textContent=open?'Close':'Menu';};
 liveMenu.addEventListener('click',()=>setMenu(liveMenu.getAttribute('aria-expanded')!=='true'));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&liveLinks.classList.contains('ukot-open')){setMenu(false);liveMenu.focus();}});
 for(const type of ['click','focusin']) document.addEventListener(type,e=>{if(!liveLinks.contains(e.target)&&!liveMenu.contains(e.target))setMenu(false);});
 liveLinks.querySelectorAll('a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');a.addEventListener('click',()=>setMenu(false));});
 matchMedia('(min-width:901px)').addEventListener('change',()=>setMenu(false));
 document.documentElement.classList.add('nav-ready');
}
const lessonCopy = {
 Diagnose: ['Find the starting point', 'Use current work and questions to identify the next teaching priority.'],
 Explain: ['Clear explanations', 'See the thinking behind a successful answer, one step at a time.'],
 Practise: ['Focused practice', 'Apply the method independently, with support when needed.'],
 Feedback: ['A clear next step', 'Use feedback to improve the next answer.']
};
const flowCopy = [
 'Start with evidence rather than a guess.',
 'Show the decisions behind a successful answer, one step at a time.',
 'Try the method with prompts and questions that reveal understanding.',
 'Apply the method to a fresh task with less support.',
 'Review the work and choose a specific target for the next lesson.'
];
// Each selector owns one panel; unrelated or nested groups cannot alter it.
const teachingGroups = '.lesson .steps, .process, .method .steps, .principles, .flow, #ukot-work .grid';
document.querySelectorAll(teachingGroups).forEach((group, groupIndex) => {
 const controls = [...group.querySelectorAll('.ukot-click[role="button"], button.ukot-click')]
  .filter(control => control.closest('[role="group"]') === group);
 if (!controls.length) return;
 const lesson = group.closest('.lesson');
 const panel = lesson?.querySelector('.feedback') ||
  (group.nextElementSibling?.matches('.ukot-dyn') ? group.nextElementSibling : null) ||
  (group.matches('.principles') ? group.parentElement.querySelector(':scope > .sticky > .ukot-dyn') : null);
 if (!panel) return;
 const titleNode = panel.querySelector('b');
 const detailNode = panel.querySelector(lesson ? '.small' : 'p');
 if (!titleNode || !detailNode) return;
 const initial = controls.find(control => control.getAttribute('aria-pressed') === 'true') || controls[0];
 const initialTitle = titleNode.textContent.trim();
 const initialDetail = detailNode.textContent.trim();
 const entries = controls.map((control, index) => {
  const title = control.querySelector('h3')?.textContent.trim() || control.textContent.trim();
  if (lesson && lessonCopy[title]) return lessonCopy[title];
  const detail = group.matches('.flow') ? flowCopy[index] : control.querySelector('p')?.textContent.trim();
  // Preserve authored expanded detail when it belongs to the initial selection.
  return [title, control === initial && initialTitle === title ? initialDetail : (detail || title)];
 });
 if (!panel.id) panel.id = `teaching-detail-${groupIndex + 1}`;
 panel.setAttribute('aria-live', 'polite');
 panel.setAttribute('aria-atomic', 'true');
 const label = panel.querySelector('small');
 const numbered = label && /^Step \d+ of \d+$/.test(label.textContent.trim());
 const activate = control => {
  controls.forEach(item => {
   const selected = item === control;
   item.setAttribute('aria-pressed', String(selected));
   item.classList.toggle('on', selected);
  });
  const index = controls.indexOf(control);
  titleNode.textContent = entries[index][0];
  detailNode.textContent = entries[index][1];
  if (numbered) label.textContent = `Step ${index + 1} of ${controls.length}`;
 };
 controls.forEach((control, index) => {
  control.setAttribute('aria-controls', panel.id);
  control.addEventListener('click', () => activate(control));
  control.addEventListener('keydown', event => {
   if (event.altKey || event.ctrlKey || event.metaKey || event.target !== control) return;
   if ((event.key === 'Enter' || event.key === ' ') && control.tagName !== 'BUTTON') {
    event.preventDefault();
    activate(control);
    return;
   }
   let nextIndex;
   if (event.key === 'Home') nextIndex = 0;
   else if (event.key === 'End') nextIndex = controls.length - 1;
   else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % controls.length;
   else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + controls.length) % controls.length;
   else return;
   event.preventDefault();
   controls[nextIndex].focus();
   activate(controls[nextIndex]);
  });
 });
 activate(initial);
});
const resourceRoot=document.querySelector('#ukot-lib');
if (resourceRoot) {
 const search = resourceRoot.querySelector('.search');
 const cards = [...resourceRoot.querySelectorAll('.grid .card')];
 const filters = [...resourceRoot.querySelectorAll('.filter[data-f]')];
 let category = 'all';
 const update = () => {
  const normalise = text => text.toLowerCase().replace(/[’‘]/g, "'").replace(/\b11(?:\s*-?\s*plus|\s*\+)/g, '11+');
  const words = normalise(search.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;
  cards.forEach(card => {
   const cat = card.querySelector('.cat').textContent.trim();
   const text = normalise(`${cat} ${card.querySelector('h3').textContent}`);
   const show = (category === 'all' || category === cat) && words.every(word => text.includes(word));
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
}
