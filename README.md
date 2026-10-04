# UK Online Tuition website

Updated on 04/10/2026.

Separate-host launch preparation is documented in [hosting/LAUNCH_PREPARATION.md](hosting/LAUNCH_PREPARATION.md). Its root build and main enquiry candidate use separate output folders; account, domain and public activation decisions remain gated.

The separate GitHub preview now includes the prepared homepage introduction and a free eight-page GCSE English Language structure guide on the GCSE and Resources pages. The PDF is available directly without a signup. Resource cards continue to open articles on the live Wix website. See `agency/GITHUB_PREVIEW_RELEASE_2026-10-04.md` for integration and verification boundaries.

The latest bounded enquiry and accessibility fixes are described in `agency/READINESS_2026-09-27.md`. Outstanding business facts and real-device checks remain explicit; preparation does not authorise publication.

This repository contains the GitHub Pages preview of the UK Online Tuition website. The separate Wix production site remains unchanged.

The current design combines practical tuition information with layered backgrounds, floating notebook artwork, subject illustrations and interactive illustrative lesson examples. See `agency/VISUAL_FINISH_2026-09-27.md` for the visual update and artwork provenance. Earlier design reviews are retained as historical evidence.

The original book and gold-spark identity is applied throughout. Its vector provenance and responsive placement are documented in `agency/ORIGINAL_BRAND_2026-09-24.md`.

Every page now has a tailored visual treatment, including subject examples, process boards, local illustrations and layered backgrounds. The page-by-page record is in `agency/ALL_PAGES_VISUAL_2026-09-27.md`.

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



