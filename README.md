# UK Online Tuition website

Updated on 24/09/2026.

This repository contains the GitHub Pages preview of the UK Online Tuition website. The separate Wix production site remains unchanged.

The current design puts tuition stages, practical information and enquiries first. Decorative carousels, oversized illustrations, simulated progress graphics and duplicate teaching controls have been removed. The full review is in `agency/WEBSITE_REVIEW_32_AGENTS_2026-09-24.md`, with progress in `agency/IMPLEMENTATION_STATUS_2026-09-24.md`. Earlier redesign/publication reviews are retained as historical evidence.

The original book and gold-spark identity is applied throughout. Its vector provenance and responsive placement are documented in `agency/ORIGINAL_BRAND_2026-09-24.md`.

## Local checks

```sh
npm ci
npm run check
npm run build
npx playwright install chromium firefox webkit
npm run test:browser
```

The check command validates page metadata, internal references, image attributes, enquiry handoff safeguards and JavaScript syntax. The build command creates `dist`; it does not deploy the site.

GitHub Actions runs checks, builds and repeated Chromium, Firefox and WebKit journeys on pull requests and pushes to `main`. The test suite uses synthetic data and never sends email. Failure reports include screenshots, traces and console/network evidence. Deployment of `dist` to GitHub Pages is restricted to `main`; pull requests do not deploy. A successful local build does not establish that the remote workflow or deployed site has passed. Every build emits `revision.json`; the deployment job checks the published URL and expected revision.

## Hosting and indexing

The preview uses the `/WEBSITE/` project path. The custom 404 page uses this absolute project path so its assets and navigation work even when GitHub Pages serves it for a missing nested URL. To verify that behaviour locally, serve the build beneath `/WEBSITE/` with unknown routes falling back to `404.html` while retaining their requested URLs. Opening `404.html` directly from disk does not reproduce Pages routing. Changing the project path requires updating its absolute references.

Canonical URLs continue to point to `https://www.ukonlinetuition.co.uk/`. Every preview page retains `noindex,nofollow`. The project-level `robots.txt` is preserved, but `/WEBSITE/robots.txt` does not establish a host-root crawl block. Crawlers must fetch a page to see its noindex directive; do not add a host-wide block blindly. The sitemap lists only the verified production equivalents recorded in `scripts/canonical-map.json`. Publishing this preview does not authorise an indexing or domain cutover.

## Enquiries

The enquiry form validates locally and prepares an email draft for the visitor to review. It offers an email-app handoff and a copyable message addressed to `ukonlinetuition1@gmail.com`. Preparing a draft does not send the enquiry; the visitor must send it through their email service. The website has no enquiry backend and does not persist the visitor's details. A direct email link remains available if JavaScript is unavailable.


## Review follow-up

See agency/IMPLEMENTATION_STATUS_2026-09-24.md for R01–R13 status, agency/CANONICAL_VERIFICATION_2026-09-24.md for verified routes and agency/RELEASE_RUNBOOK.md for release/recovery steps. Owner facts and manual device checks are recorded in agency/OWNER_FACTS_AND_MANUAL_CHECKS.md.



