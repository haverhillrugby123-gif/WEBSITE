document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const form = document.querySelector('#enquiry-form');
if (form) {
  const status = document.querySelector('#form-status');
  const draft = document.querySelector('#enquiry-draft');
  const preview = document.querySelector('#enquiry-preview');
  const emailLink = document.querySelector('#open-enquiry-email');
  const copyButton = document.querySelector('#copy-enquiry');
  const editButton = document.querySelector('#edit-enquiry');
  const enquiryFields = document.querySelector('#enquiry-fields');
  const get = name => String(form.elements.namedItem(name)?.value || '').trim();
  const say = message => { status.textContent = message; };
  const clearDraft = () => {
    draft.hidden = true;
    preview.value = '';
    emailLink.removeAttribute('href');
  };
  const focusEnquiry = element => {
    // Revealing or hiding a draft changes the page height. Finish the focus
    // scroll immediately so the next form action cannot move under a pointer.
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: 'instant', block: 'center' });
  };
  const serviceLabels = new Map([['gcse', 'GCSE'], ['11-plus', '11+'], ['primary', 'Primary']]);
  const serviceField = form.elements.namedItem('service');
  const requestedService = new URLSearchParams(location.search).get('service');
  if (serviceField && serviceLabels.has(requestedService)) serviceField.value = requestedService;

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
      ...(serviceLabels.has(get('service')) ? [`Service: ${serviceLabels.get(get('service'))}`] : []),
      ...(get('phone') ? [`Phone: ${get('phone')}`] : []),
      `Year group/stage: ${get('yeargroup')}`, `Subject or entrance test: ${get('subject')}`, '',
      'Main difficulty, goal or support needed:', get('support'),
      ...(get('availability') ? ['', `Availability: ${get('availability')}`] : []),
      ...(get('lead-offer') === 'consultation-and-guide' ? ['', 'Please contact me about a free initial consultation and the free GCSE English Language structure guide.'] : []),
      ...(form.elements.namedItem('newsletter-request')?.checked ? ['', 'Optional newsletter request: I would like weekly exam tips and advice by email from UK Online Tuition. Please confirm signup separately before sending newsletters.'] : []),
      '', 'Thank you.'
    ].join('\n');
    preview.value = `To: ukonlinetuition1@gmail.com\nSubject: ${subject}\n\n${body}`;
    emailLink.href = `mailto:ukonlinetuition1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draft.hidden = false;
    say('Your enquiry is ready but has not been sent. Open your email app, or copy the message into your usual email service.');
    focusEnquiry(document.querySelector('#enquiry-draft-title'));
  });

  form.addEventListener('input', event => {
    if (!event.target.name) return;
    event.target.setCustomValidity('');
    event.target.removeAttribute('aria-invalid');
    if (!draft.hidden) {
      clearDraft();
      say('Your details changed. Prepare the enquiry again to update your message.');
    }
  });

  editButton.addEventListener('click', () => {
    clearDraft();
    say('You can now edit your details. Prepare the enquiry again when you are ready. Nothing has been sent.');
    focusEnquiry(enquiryFields.querySelector('input, select, textarea'));
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
  enquiryFields.disabled = false;
  document.querySelector('#enquiry-script-note').hidden = true;
}

