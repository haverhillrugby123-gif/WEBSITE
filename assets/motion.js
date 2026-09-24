(() => {
  const track = document.querySelector('.motion-track');
  if (!track) return;
  const slides = [...track.querySelectorAll('.motion-slide')];
  const toggle = document.querySelector('#motion-toggle');
  const status = document.querySelector('#slide-position');
  const showcase = track.closest('.motion-showcase');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (!slides.length || !toggle || !status || !showcase) return;

  let paused = reduce.matches;
  let index = 0;
  let timer;
  let scrollTimer;
  let resizeFrame;
  let visible = true;

  const sync = () => {
    const effectivelyPaused = paused || reduce.matches;
    document.documentElement.classList.toggle('motion-paused', effectivelyPaused);
    toggle.disabled = reduce.matches;
    toggle.textContent = reduce.matches ? 'Reduced motion enabled' : paused ? 'Play animations' : 'Pause animations';
    toggle.setAttribute('aria-pressed', String(effectivelyPaused));
    // Automatic changes should not repeatedly interrupt screen-reader users.
    status.setAttribute('aria-live', effectivelyPaused ? 'polite' : 'off');
  };
  const position = () => {
    status.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const slideLeft = slide => slide.getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
  const updatePosition = () => {
    index = slides.reduce((best, slide, i) =>
      Math.abs(slideLeft(slide) - track.scrollLeft) < Math.abs(slideLeft(slides[best]) - track.scrollLeft) ? i : best, 0);
    position();
  };
  const goTo = (next, instant = false) => {
    index = (next + slides.length) % slides.length;
    track.scrollTo({left: slideLeft(slides[index]), behavior: instant || reduce.matches ? 'auto' : 'smooth'});
    // The scroll listener updates the counter when the visible slide settles.
    if (instant || reduce.matches) updatePosition();
  };
  const start = () => {
    clearInterval(timer);
    if (!paused && visible && !document.hidden && !reduce.matches) {
      timer = setInterval(() => {
        if (!showcase.matches(':hover') && !showcase.matches(':focus-within')) goTo(index + 1);
      }, 6500);
    }
  };
  const pause = () => { paused = true; sync(); start(); };
  toggle.addEventListener('click', () => {
    if (reduce.matches) return;
    paused = !paused;
    sync();
    start();
  });
  showcase.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
    pause();
    goTo(index + Number(button.dataset.slide));
  }));
  track.addEventListener('pointerdown', pause);
  track.addEventListener('wheel', pause, {passive: true});
  track.addEventListener('keydown', event => {
    const targets = {ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: slides.length - 1};
    if (Object.hasOwn(targets, event.key)) {
      event.preventDefault();
      pause();
      goTo(targets[event.key]);
    }
  });
  // Keep swipe, scrollbar and keyboard scrolling in sync, including browsers
  // that do not support scrollend.
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updatePosition, 160);
  }, {passive: true});
  track.addEventListener('scrollend', () => { clearTimeout(scrollTimer); updatePosition(); });
  showcase.addEventListener('focusin', event => {
    if (event.target !== toggle) pause();
  });
  const resize = () => {
    clearTimeout(scrollTimer);
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => goTo(index, true));
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
  else window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', start);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    start();
  }).observe(track);
  reduce.addEventListener('change', () => { if (reduce.matches) paused = true; sync(); start(); });
  sync();
  position();
  start();
})();
