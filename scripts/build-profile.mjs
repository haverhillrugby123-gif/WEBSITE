export function buildProfile(args = []) {
  const allowed = ['--root', '--main-enquiry-preview'];
  if (args.some(arg => !allowed.includes(arg))) throw new Error('Unknown build option');
  const root = args.includes('--root');
  const enquiryPreview = args.includes('--main-enquiry-preview');
  if (enquiryPreview && !root) throw new Error('The enquiry candidate requires a separate root preview');
  return { root, enquiryPreview, basePath: root ? '/' : '/WEBSITE/', directory: enquiryPreview ? 'dist-enquiry-preview' : root ? 'dist-root' : 'dist' };
}

export const mainEnquiryURL = 'https://danielpharris4.wixforms.com/f/7511201696308003871';

// This candidate is emitted only into dist-enquiry-preview. Its notification
// and actual inbox receipt must be verified before any public activation.
export function enquiryCandidate(page, html) {
  if (page === 'contact/index.html') {
    html = html.replace(/Let[’']s talk about the support you need\./, 'Ask about tuition.')
      .replace(/(<h1 id="ukot-contact-title">[^<]*<\/h1>)<p>[^<]*<\/p>/, '$1<p>Tell our team the year group, subject and support needed. Ask about a free initial consultation.</p><p><a class="send" href="#main-enquiry-title">Request your free consultation and guide</a></p>');
    const candidate = `<section class="section" aria-labelledby="main-enquiry-title"><div class="wrap"><h2 id="main-enquiry-title">A free initial consultation and GCSE English guide</h2><p>Ask our team about a free initial consultation and request the free GCSE English Language structure guide. For parents, guardians and adult learners.</p><p><a class="send" href="#secure-enquiry-title">Use the secure enquiry form</a></p><p>You can also <a href="../assets/guides/gcse-english-language-structure-guide.pdf" download>download the free guide directly</a>. The optional email section can include a newsletter request; it does not enrol you.</p></div></section>`;
    const newsletter = `<input type="hidden" name="lead-offer" value="consultation-and-guide"><div class="field full"><label for="newsletter-request"><input type="checkbox" id="newsletter-request" name="newsletter-request" aria-describedby="newsletter-request-note"> I would like weekly exam tips and advice by email from UK Online Tuition (optional)</label><p class="form-note" id="newsletter-request-note">This choice is added to your email draft. It does not enrol you automatically. Newsletter signup will be confirmed separately before any newsletter is sent. You can withdraw your request by emailing ukonlinetuition1@gmail.com. The consultation and free guide do not require newsletter signup.</p></div>`;
    html = html.replace('<p class="form-note" id="privacy-note">', newsletter + '<p class="form-note" id="privacy-note">')
      .replace('Main difficulty, goal or support needed *</label>', 'Main difficulty, goal or support needed (optional)</label>')
      .replace('name="support" maxlength="1200" required', 'name="support" maxlength="1200"')
      .replace('<h2 id="ukot-form-title">Prepare an enquiry email</h2>', '<h2 id="ukot-form-title">Request your consultation and guide by email</h2>');
    if (!html.includes('<section class="section primary-enquiry"')) throw new Error('Contact candidate insertion point missing');
    return html.replace('<section class="section primary-enquiry"', candidate + '<section class="section primary-enquiry"');
  }
  if (['gcse/index.html', 'resources/index.html'].includes(page)) {
    const link = /<a class="ukot-free-guide-enquire"[^>]*>Ask about GCSE English tuition<\/a>/;
    if (!link.test(html)) throw new Error(`${page}: guide enquiry link missing`);
    return html.replace(link, `<a class="ukot-free-guide-enquire" href="../contact/index.html?service=gcse#main-enquiry-title" tabindex="0">Request a free consultation and guide</a><p class="ukot-free-guide-description">For adult contacts. Weekly exam tips and advice are an optional newsletter request; signup will be confirmed separately.</p><a class="ukot-free-guide-enquire" data-main-enquiry href="${mainEnquiryURL}" referrerpolicy="no-referrer" tabindex="0">Ask about GCSE English tuition</a><p class="ukot-free-guide-description">Opens the UK Online Tuition enquiry form on Wix Forms.</p>`);
  }
  return html;
}
