document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const form = document.querySelector('#enquiry-form');
if (form) {
  // Keep focus-driven scrolling from moving enquiry controls during a click.
  document.documentElement.style.scrollBehavior = 'auto';
  const status = document.querySelector('#form-status');
  const draft = document.querySelector('#enquiry-draft');
  const preview = document.querySelector('#enquiry-preview');
  const emailLink = document.querySelector('#open-enquiry-email');
  const copyButton = document.querySelector('#copy-enquiry');
  const editButton = document.querySelector('#edit-enquiry');
  const enquiryFields = document.querySelector('#enquiry-fields');
  const get = name => String(form.elements.namedItem(name)?.value || '').trim();
  const say = message => { status.textContent = message; };
  let draftVersion = 0;
  const clearDraft = () => {
    draftVersion++;
    draft.hidden = true;
    preview.value = '';
    emailLink.removeAttribute('href');
  };
  const serviceLabels = new Map([['gcse', 'GCSE'], ['11-plus', '11+'], ['primary', 'Primary']]);
  const serviceField = form.elements.namedItem('service');
  const enquiryParams = new URLSearchParams(location.search);
  const requestedService = enquiryParams.get('service');
  if (serviceField && serviceLabels.has(requestedService)) serviceField.value = requestedService;
  // Carry only recognised subject context, never arbitrary visitor details.
  const subjectField = form.elements.namedItem('subject');
  if (subjectField && requestedService === 'gcse' && enquiryParams.get('subject') === 'english') subjectField.value = 'English';

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
    draftVersion++;
    const subject = `Tuition enquiry — ${get('yeargroup')} — ${get('subject')}`;
    const body = [
      'Hello UK Online Tuition,', '', 'I would like to enquire about tuition.', '',
      `Parent/contact name: ${get('name')}`, `Email: ${get('email')}`,
      ...(serviceLabels.has(get('service')) ? [`Service: ${serviceLabels.get(get('service'))}`] : []),
      ...(get('phone') ? [`Phone: ${get('phone')}`] : []),
      `Year group/stage: ${get('yeargroup')}`, `Subject or entrance test: ${get('subject')}`, '',
      'Main difficulty, goal or support needed:', get('support'),
      ...(get('availability') ? ['', `Availability: ${get('availability')}`] : []),
      '', 'Thank you.'
    ].join('\n');
    preview.value = `To: ukonlinetuition1@gmail.com\nSubject: ${subject}\n\n${body}`;
    const handoff = `mailto:ukonlinetuition1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Email clients differ in how much URI text they accept. Keep long drafts
    // intact for copying instead of offering a potentially truncated handoff.
    const useCopy = handoff.length > 2000;
    emailLink.hidden = useCopy;
    if (useCopy) emailLink.removeAttribute('href');
    else emailLink.href = handoff;
    draft.hidden = false;
    say(useCopy
      ? 'Your enquiry is ready but has not been sent. This longer message is best copied into your usual email service; review it and send it to ukonlinetuition1@gmail.com.'
      : 'Your enquiry is ready but has not been sent. Open your email app, or copy the message into your usual email service.');
    document.querySelector('#enquiry-draft-title').focus();
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
    enquiryFields.querySelector('input, select, textarea').focus();
  });

  copyButton.addEventListener('click', async () => {
    // A delayed clipboard result must not overwrite a newer editing state.
    const versionAtCopy = draftVersion;
    const messageAtCopy = preview.value;
    const isCurrentDraft = () => versionAtCopy === draftVersion && !draft.hidden;
    try {
      await navigator.clipboard.writeText(messageAtCopy);
      if (!isCurrentDraft()) return;
      say('Enquiry copied. Paste it into an email to ukonlinetuition1@gmail.com, review it and send.');
    } catch {
      if (!isCurrentDraft()) return;
      preview.focus();
      preview.select();
      say('Select and copy the message below, then paste it into your usual email service.');
    }
  });
  emailLink.addEventListener('click', () => say('Your email app may open. Review and send the message there. If nothing opens, use Copy enquiry.'));
  enquiryFields.disabled = false;
  document.querySelector('#enquiry-script-note').hidden = true;
}

