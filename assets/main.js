document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const form = document.querySelector('#enquiry-form');
if (form) {
  const status = document.querySelector('#form-status');
  const draft = document.querySelector('#enquiry-draft');
  const preview = document.querySelector('#enquiry-preview');
  const emailLink = document.querySelector('#open-enquiry-email');
  const copyButton = document.querySelector('#copy-enquiry');
  const get = name => String(form.elements.namedItem(name)?.value || '').trim();
  const say = message => { status.textContent = message; };

  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of form.querySelectorAll('[required]')) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    }
    for (const field of form.querySelectorAll('input, select, textarea')) {
      field.setAttribute('aria-invalid', String(!field.validity.valid));
    }
    if (!form.reportValidity()) {
      say('Please complete the required fields and enter a valid email address.');
      return;
    }
    const subject = `Tuition enquiry — ${get('yeargroup')} — ${get('subject')}`;
    const body = [
      'Hello UK Online Tuition,', '', 'I would like to enquire about tuition.', '',
      `Parent/contact name: ${get('name')}`, `Email: ${get('email')}`,
      ...(get('phone') ? [`Phone: ${get('phone')}`] : []),
      `Year group/stage: ${get('yeargroup')}`, `Subject or entrance test: ${get('subject')}`, '',
      'Main difficulty, goal or support needed:', get('support'),
      ...(get('availability') ? ['', `Availability: ${get('availability')}`] : []),
      '', 'Thank you.'
    ].join('\n');
    preview.value = `To: ukonlinetuition1@gmail.com\nSubject: ${subject}\n\n${body}`;
    emailLink.href = `mailto:ukonlinetuition1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draft.hidden = false;
    say('Your enquiry is ready but has not been sent. Open your email app, or copy the message into your usual email service.');
    document.querySelector('#enquiry-draft-title').focus();
  });

  form.addEventListener('input', event => {
    if (!event.target.name) return;
    event.target.setCustomValidity('');
    event.target.removeAttribute('aria-invalid');
    if (!draft.hidden) {
      draft.hidden = true;
      preview.value = '';
      emailLink.removeAttribute('href');
      say('Your details changed. Prepare the enquiry again to update your message.');
    }
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      say('Enquiry copied. Paste it into an email to ukonlinetuition1@gmail.com, review it and send.');
    } catch {
      preview.focus();
      preview.select();
      say('Select and copy the message below, then paste it into your usual email service.');
    }
  });
  emailLink.addEventListener('click', () => say('Your email app may open. Review and send the message there. If nothing opens, use Copy enquiry.'));
  document.querySelector('#enquiry-fields').disabled = false;
}
