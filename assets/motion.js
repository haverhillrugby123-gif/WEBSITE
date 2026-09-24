(()=>{
 const track=document.querySelector('.motion-track');if(!track)return;
 const slides=[...track.querySelectorAll('.motion-slide')],toggle=document.querySelector('#motion-toggle'),status=document.querySelector('#slide-position'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduce.matches,index=0,timer;
 const sync=()=>{document.documentElement.classList.toggle('motion-paused',paused);toggle.textContent=paused?'Play animations':'Pause animations';toggle.setAttribute('aria-pressed',String(paused));};
 const move=(step,manual=false)=>{index=(index+step+slides.length)%slides.length;track.scrollTo({left:slides[index].offsetLeft-slides[0].offsetLeft,behavior:reduce.matches?'auto':'smooth'});if(manual)status.textContent=`0${index+1} / 03`;};
 const start=()=>{clearInterval(timer);if(!paused)timer=setInterval(()=>{if(!document.hidden&&!track.matches(':hover')&&!track.contains(document.activeElement))move(1);},6500);};
 toggle.addEventListener('click',()=>{paused=!paused;sync();start();});
 document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>{paused=true;sync();start();move(Number(button.dataset.slide),true);}));
 track.addEventListener('pointerdown',()=>{paused=true;sync();start();});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();paused=true;sync();start();move(e.key==='ArrowRight'?1:-1,true);}});
 track.addEventListener('scrollend',()=>{index=slides.reduce((best,s,i)=>Math.abs(Math.min(s.offsetLeft-slides[0].offsetLeft,track.scrollWidth-track.clientWidth)-track.scrollLeft)<Math.abs(Math.min(slides[best].offsetLeft-slides[0].offsetLeft,track.scrollWidth-track.clientWidth)-track.scrollLeft)?i:best,0);if(paused)status.textContent=`0${index+1} / 03`;});
 reduce.addEventListener('change',()=>{if(reduce.matches)paused=true;sync();start();});sync();start();
})();
