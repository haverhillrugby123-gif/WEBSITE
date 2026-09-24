# UK Online Tuition website

Updated on 24/09/2026.

This repository contains the GitHub Pages preview of the UK Online Tuition website. The separate Wix production site remains unchanged.

## Local checks

```sh
npm ci
npm run check
npm run build
```

The check command validates page metadata, internal references, image attributes, enquiry handoff safeguards and JavaScript syntax. The build command creates `dist`; it does not deploy the site.

GitHub Actions runs checks and builds on pull requests and pushes to `main`. Deployment of `dist` to GitHub Pages is restricted to `main`; pull requests do not deploy. A successful local build does not establish that the remote workflow or deployed site has passed.

## Hosting and indexing

The preview uses the `/WEBSITE/` project path. The custom 404 page uses this absolute project path so its assets and navigation work even when GitHub Pages serves it for a missing nested URL. To verify that behaviour locally, serve the build beneath `/WEBSITE/` with unknown routes falling back to `404.html` while retaining their requested URLs. Opening `404.html` directly from disk does not reproduce Pages routing. Changing the project path requires updating its absolute references.

Canonical URLs continue to point to `https://www.ukonlinetuition.co.uk/`. The preview retains `noindex,nofollow` and the `robots.txt` crawl block. Publishing this preview does not authorise an indexing or domain cutover.

## Enquiries

The enquiry form validates locally and prepares an email draft for the visitor to review. It offers an email-app handoff and a copyable message addressed to `ukonlinetuition1@gmail.com`. Preparing a draft does not send the enquiry; the visitor must send it through their email service. The website has no enquiry backend and does not persist the visitor's details. A direct email link remains available if JavaScript is unavailable.
