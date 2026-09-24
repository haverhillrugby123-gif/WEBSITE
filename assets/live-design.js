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
}
const lessonCopy={Diagnose:['Specific feedback','Know what worked, what did not, and what to do next.'],Explain:['Clear explanations','See the thinking behind a successful answer, one step at a time.'],Practise:['Focused practice','Apply the method independently, with support when needed.'],Feedback:['A clear next step','Use feedback to improve the next answer.']};
document.querySelectorAll('[role="group"]').forEach(group=>{
 const controls=[...group.querySelectorAll('[role="button"]')];
 const activate=el=>{
  controls.forEach(b=>{b.setAttribute('aria-pressed',String(b===el));b.classList.toggle('on',b===el);});
  if(group.closest('.lesson')){const copy=lessonCopy[el.textContent.trim()];const feedback=group.closest('.lesson').querySelector('.feedback');if(copy&&feedback){feedback.replaceChildren();const icon=document.createElement('span');icon.className='mark';icon.textContent='✓';const text=document.createElement('div');const strong=document.createElement('b');strong.textContent=copy[0];const small=document.createElement('div');small.className='small';small.textContent=copy[1];text.append(strong,small);feedback.append(icon,text);}}
  else{const panel=group.nextElementSibling;if(panel?.classList.contains('ukot-dyn')){const title=el.querySelector('h3')?.textContent||el.textContent.trim();const desc=el.querySelector('p')?.textContent||title;if(panel.querySelector('b'))panel.querySelector('b').textContent=title;if(panel.querySelector('p'))panel.querySelector('p').textContent=desc;}}
 };
 controls.forEach((el,i)=>{el.addEventListener('click',()=>activate(el));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(el);}if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const next=controls[(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+controls.length)%controls.length];next.focus();activate(next);}});});
});
const resourceRoot=document.querySelector('#ukot-lib');
if(resourceRoot){let category='all';const search=resourceRoot.querySelector('.search');const cards=[...resourceRoot.querySelectorAll('.grid .card')];const filters=[...resourceRoot.querySelectorAll('.filter')];const update=()=>{let count=0;cards.forEach(card=>{const show=(category==='all'||card.querySelector('.cat')?.textContent.trim()===category)&&card.textContent.toLowerCase().includes(search.value.toLowerCase());card.hidden=!show;if(show)count++;});resourceRoot.querySelector('#ukot-resource-status').textContent=`${count} resources shown`;};filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.f;filters.forEach(b=>{b.classList.toggle('on',b===button);b.setAttribute('aria-pressed',String(b===button));});update();}));search.addEventListener('input',update);update();}
