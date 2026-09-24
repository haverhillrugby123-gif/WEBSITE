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
