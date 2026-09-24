# Browser and release evidence

Updated 24/09/2026. Local evidence is separate from GitHub Actions and published-site evidence.

## Parent browser checks

- Resource searches for “Summary and Inference” and “Summary & Inference” both returned the same single guide.
- With JavaScript requests failing, navigation stayed in document flow and resource tools stayed disabled with a visible explanation; resource links remained available.
- Service context from the 11+ route was preselected, could be changed to Primary, and appeared as Primary in the prepared draft. The form contained only synthetic review details; no email was opened or sent.
- Homepage screenshots inspected at 320px and 1440px. Header logo loaded, Menu stayed inside the narrow viewport, and desktop layout remained intact. Footer image retains original artwork and uses lazy loading.
- The script-failure resource count was corrected from40 to39 following withdrawal of the inaccurate guide.

## Automated checks

Static validation and build pass locally. Canonical fixtures reject the old invented GCSE path and any canonical on404; the sitemap must match the ten verified production routes.

The separate test automation report records browser results, negative controls and verified Action pins. Actual Safari/iOS, NVDA, VoiceOver, real email applications and hosted protection settings remain explicit external checks, as listed in OWNER_FACTS_AND_MANUAL_CHECKS.md.

## Release record

GitHub Actions and deployed revision evidence will be added after publication. This file does not by itself establish a deployment or accessibility conformance.

## Final local test evidence

- Final full matrix: 33/33 passed in 44.7 seconds, zero retries. Eleven journeys in Chromium, Firefox and WebKit.
- Initial ten-repeat matrix: 320 passed and ten WebKit keyboard failures. The explicit skip-link focusability fix then passed 30/30 keyboard repetitions across all three engines. No assertions were skipped and no focus was injected.
- Isolated broken-draft and broken-404-image copies both failed their intended assertions. Normal source/dist remained intact.
- Uncaught browser page errors now fail the suite and preserve diagnostic evidence.
- The HTTP smoke and three-page performance-observation scripts passed against a local build with revision=local. That validates the scripts, not a hosted deployment.
- Independent challenger found no new blocking source defect, conditional on resolving the recorded keyboard failure. Separate QA reviewed safeguards, test strength and remaining limitations.

The configured remote gate repeats all eleven final journeys ten times per engine. Its exact revision and outcome must be recorded separately.
