const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', () => setOpen(false));
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const form = document.querySelector('#enquiry-form');
if (form) {
  const status = document.querySelector('#form-status');
  const button = document.querySelector('#prepare-enquiry');
  const get = name => String(form.elements.namedItem(name)?.value || '').trim();

  form.addEventListener('submit', event => event.preventDefault());

  button?.addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please complete the required fields and enter a valid email address.';
      status.className = 'form-status show error';
      return;
    }

    const subjectLine = `Tuition enquiry — ${get('yeargroup')} — ${get('subject')}`;
    const lines = [
      'Hello UK Online Tuition,',
      '',
      'I would like to enquire about tuition.',
      '',
      `Parent/contact name: ${get('name')}`,
      `Email: ${get('email')}`,
      get('phone') ? `Phone: ${get('phone')}` : '',
      `Year group/stage: ${get('yeargroup')}`,
      `Subject or entrance test: ${get('subject')}`,
      '',
      'Main difficulty, goal or support needed:',
      get('support'),
      '',
      get('availability') ? `Availability:\n${get('availability')}` : '',
      '',
      'Thank you.'
    ].filter(Boolean);

    status.textContent = 'Opening your email app. Review the message there, then send it when you are ready.';
    status.className = 'form-status show';

    window.location.href = `mailto:ukonlinetuition1@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
}
