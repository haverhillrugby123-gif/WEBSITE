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
// Local-only preview. No network request, storage or submission service.
const form = document.querySelector('#enquiry-form');
if (form) {
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', event => event.preventDefault());
  document.querySelector('#check-enquiry').addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please complete the required fields and enter a valid email address.';
      status.className = 'form-status show error';
      return;
    }
    status.textContent = 'These details pass the preview checks. Nothing has been sent or saved.';
    status.className = 'form-status show';
  });
}
