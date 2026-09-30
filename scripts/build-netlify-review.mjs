import { cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
if (!process.argv.includes('--candidate')) throw new Error('Explicit --candidate required; this does not configure or deploy a provider.');
const host = process.argv.find(arg => arg.startsWith('--approved-host='))?.slice('--approved-host='.length) || '';
if (host && !/^(?=.{1,253}$)[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/.test(host)) throw new Error('Use an owner-approved HTTPS hostname only, without path, port or query.');
execFileSync(process.execPath, ['scripts/build-site.mjs'], { stdio: 'inherit' });
await cp('dist', 'dist-netlify-review', { recursive: true });
async function rootPaths(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await rootPaths(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      await writeFile(file, html.replaceAll('/WEBSITE/', '/'));
    }
  }
}
await rootPaths('dist-netlify-review');
const file = 'dist-netlify-review/contact/index.html';
let html = await readFile(file, 'utf8');
html = html.replace('id="enquiry-form"', `id="enquiry-form" name="tuition-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-enquiry-provider="netlify-review" data-enquiry-host="${host}"`);
html = html.replace('<fieldset id="enquiry-fields"', '<input type="hidden" name="form-name" value="tuition-enquiry"><p hidden><label>Leave blank <input name="bot-field" autocomplete="off" tabindex="-1"></label></p><fieldset id="enquiry-fields"');
html = html.replace('Prepare an enquiry email</h2>', 'Review and send an enquiry</h2>');
html = html.replace(/Prepare enquiry email[^<]*/, 'Review enquiry');
html = html.replace('This form prepares a draft for you to send from your email service. It does not send or save your enquiry.', 'Review your details before choosing Send enquiry. If activated on Netlify, this sends your enquiry to Netlify Forms for storage and handling.');
html = html.replace('Preparing a message does not send it. Your details stay on this page until you choose to copy them or open your email app.', 'Preparing a message does not submit it. Choosing Send enquiry transmits your details to Netlify Forms. Avoid sensitive personal information.');
html = html.replace('<p class="form-note" id="email-handling">', '<p class="form-note">Candidate configuration only: provider activation, notification delivery, authorised access and retention remain launch gates. No live delivery is verified. Contact ukonlinetuition1@gmail.com about data handling before submitting personal details.</p><p class="form-note" id="email-handling">');
html = html.replace('Your enquiry has not been sent. Open your email app to review and send it, or copy the message into your usual email service.', 'Your enquiry has not been submitted. Review it, then choose Send enquiry. You can also use the email options below.');
html = html.replace('</body>', '<script src="../assets/netlify-enquiry.js" defer></script></body>');
await writeFile(file, html);
if (!html.includes('content="noindex,nofollow"')) throw new Error('Candidate preview must remain noindex.');
const defaultContact = await readFile('dist/contact/index.html', 'utf8');
if (defaultContact.includes('src="../assets/netlify-enquiry.js"')) throw new Error('Default build must not load provider adapter.');
const notFound = await readFile('dist-netlify-review/404.html', 'utf8');
if (notFound.includes('/WEBSITE/')) throw new Error('Candidate 404 must use host-root paths.');
console.log('Candidate build: dist-netlify-review. No external setup or deployment; default dist remains email-only.');
