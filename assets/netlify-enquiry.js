// Candidate-only adapter. The ordinary preview never loads this file.
(() => {
const form = document.querySelector('form[data-enquiry-provider="netlify-review"]');
if (form && location.protocol === 'https:' && form.dataset.enquiryHost === location.hostname) {
  const draft = document.querySelector('#enquiry-draft');
  const status = document.querySelector('#form-status');
  const fields = ['name', 'email', 'service', 'phone', 'yeargroup', 'subject', 'support', 'availability', 'bot-field'];
  const snapshot = () => new URLSearchParams([
    ['form-name', 'tuition-enquiry'],
    ...fields.map(name => [name, String(form.elements.namedItem(name)?.value || '').trim()])
  ]).toString();
  const send = document.createElement('button');
  send.type = 'button'; send.className = 'send'; send.id = 'send-enquiry';
  send.textContent = 'Send enquiry'; send.disabled = true;
  draft.querySelector('.draft-actions').prepend(send);
  let reviewed = null;
  let pending = null;
  let sequence = 0;
  const invalidate = () => {
    sequence++;
    reviewed = null; send.disabled = true;
    if (pending) {
      pending.abort(); pending = null;
      status.textContent = 'Your details changed while sending. Submission status is uncertain; contact UK Online Tuition before sending again.';
    }
  };
  form.addEventListener('submit', event => {
    if (!pending) return;
    event.preventDefault(); event.stopImmediatePropagation();
    status.textContent = 'Please wait for this submission to finish before preparing another enquiry.';
  }, true);
  form.addEventListener('input', invalidate);
  document.querySelector('#edit-enquiry').addEventListener('click', invalidate);
  form.addEventListener('submit', () => {
    if (draft.hidden || pending) return;
    reviewed = snapshot(); send.disabled = false;
    status.textContent = 'Review your enquiry, then choose Send enquiry. Nothing has been submitted yet.';
  });
  send.addEventListener('click', async () => {
    if (pending || !reviewed || draft.hidden || reviewed !== snapshot()) return;
    const body = reviewed;
    const version = ++sequence;
    const controller = new AbortController(); pending = controller;
    send.disabled = true;
    status.textContent = 'Submitting your enquiry…';
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body, signal: controller.signal, credentials: 'same-origin'
      });
      if (version !== sequence) return;
      if (!response.ok) throw new Error('response');
      reviewed = null;
      status.textContent = 'Your enquiry has been submitted. This confirms submission, not inbox delivery. An enquiry does not book a lesson.';
    } catch {
      if (version !== sequence) return;
      reviewed = null;
      status.textContent = 'We could not confirm submission. Your details are still here. Contact UK Online Tuition before trying again to avoid a duplicate enquiry.';
    } finally {
      clearTimeout(timeout);
      if (version === sequence) pending = null;
    }
  });
}
})();
