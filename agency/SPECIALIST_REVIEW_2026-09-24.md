# UK Online Tuition: 20-agent review

Date: 24/09/2026. Target: the GitHub Pages website in `haverhillrugby123-gif/WEBSITE`.
Baseline: `32951b7ddc0ec9bcbf73e040c22358ffa561f3c1`.

Twenty distinct specialist agents reviewed bounded areas in successive batches. These were actual delegated reviews, not simulated perspectives. The primary agent synthesised recommendations, implemented the changes and performed browser checks. Reviewers were read-only, avoiding conflicting edits.

## Review ledger

| Agent | Specialist | Finding and disposition |
| --- | --- | --- |
| review01 | Accessibility Auditor | Enter submission and live lesson feedback: implemented. Broader interactive-card heading refactor deferred pending assistive-technology testing. |
| review02 | Frontend Developer | Navigation fallback, native form submission and selectable email draft: implemented. |
| review03 | Product Manager | Explore all tuition routes, email recovery and actual year groups: implemented. |
| review04 | SEO Specialist | Check actual robots markup, exact canonical targets and crawl block: implemented. |
| review05 | Application Security Engineer | Broken privacy regex and missing script coverage: fixed, with regression fixtures. |
| review06 | UI Designer | Mobile panel overlap, featured resource contrast and tiny lesson labels: fixed. |
| review07 | Performance Benchmarker | Suspend offscreen carousel work and pause pseudo-element animations: implemented. CSS splitting deferred because the shared file is modest and no measured loading bottleneck was established. |
| review08 | UX Researcher | Empty results recovery, whitespace/token matching and title/category search: implemented. Source walkthrough, not participant research. |
| review09 | Brand Guardian | Remove internal editorial language and use specific existing founder roles: implemented. Credentials were not independently revalidated. |
| review10 | Test Automation Engineer | Escaping defects and missing label/reference checks: fixed with fixtures. Independently ran check/build and inspected source/build safeguards. Browser journeys checked by primary; a persistent browser CI suite remains a future enhancement. |
| review11 | AEO Foundations Architect | Accurate FAQ descriptions and schema parity: implemented for all visible FAQs. No AI crawler exposure added. |
| review12 | Data Privacy Officer | Reduce requests for pupil identifiers: implemented. Required contact email retained to preserve explicit reply details; making it optional is not necessary for this release. Recruitment documents remain a future content refinement. This was not legal certification. |
| review13 | Content Creator | Clear fees, tutor questions and practical pre-lesson discussion: implemented. |
| review14 | Code Reviewer | Reviewed new enquiry flow; no blocking source defect. Guardrail issue resolved. |
| review15 | UX Architect | Accurate carousel count, pause on interaction and pseudo-element pause: implemented. |
| review16 | Customer Success Manager | Explain email handoff in FAQ and discuss arrangements before lessons: implemented. |
| review17 | Section 508 Accessibility Specialist | Focusable skip targets and accurate step position: implemented. Broader heading/button restructuring deferred; no conformance claim. |
| review18 | DevOps Automator | PR checks, deployment-only permissions and exported-page reference checks: implemented. |
| review19 | Search Relevance Engineer | Normalise apostrophes and 11-plus spelling variants: implemented. |
| review20 | Reality Checker | Challenged final changes and caught an unconditional CSS rule hiding the empty state: fixed and browser-verified. |

## Delivered changes

- Enquiries validate on native submission, including Enter, and expose a readable draft before the visitor chooses their email app or copies the message. Copy failure leaves a selectable message. Editing details invalidates the old draft. The site does not send or store the enquiry.
- Required fields reject whitespace-only values. Primary year groups are explicit and an other/unsure option is available. The form is disabled until its handlers initialise; a no-script email route is provided.
- Resource searches match all query words against titles/categories, support apostrophe and 11-plus variants, and show recovery controls when no results match.
- The homepage tuition button reaches the choice of all three services. Mobile navigation has a static fallback. Small-screen service notes and lesson cards have space to grow with their text.
- FAQ answers use parent-facing language and have matching structured data. Fees and tutor suitability remain matters to confirm, without invented prices or availability.
- Carousel position updates after motion; interactions pause rotation; offscreen/hidden tabs stop its timer. The decorative star obeys the pause control.
- Static checks now cover real ARIA references, real label targets, approved scripts, network/storage tokens in all client scripts, exact canonical targets, crawl blocking, FAQ schema parity and the exported HTML page list. These are bounded safeguards, not a comprehensive security audit.
- Pull requests run checks/build. Pages deployment stays limited to main, with deployment privileges isolated to the deployment job.

## Verification

- Primary and independent QA: `npm run check` and `npm run build` passed across 11 HTML pages, 241 local references and three images. Negative regression fixtures exercise broken labels/references, prohibited APIs and unapproved scripts.
- Source and generated output retain production canonicals, `noindex,nofollow`, the robots crawl block and local scripts only.
- Browser: blank enquiry rejection; Enter prepares a draft with correctly encoded plus/ampersand values; copying reports success; changing a field hides the stale draft. No test email sent.
- Browser: zero results show recovery; clearing restores 40 resources; reordered/space-padded Maths query finds three relevant resources; straight-apostrophe query finds the parent guide; “11 plus” finds six resources.
- Browser: mobile menu opens and Escape closes it with focus returning to Menu. All 11 pages have one H1 and no horizontal document overflow at 320px and 1440px. A 375px service panel was visually checked and its note does not overlap the matrix.
- Browser: Pause changes to Play, the decorative star is paused, Next changes the counter to 02 / 03, and Explore tuition reaches the service-choice anchor.
- Browser testing caught a new focus/click interaction in the pause control; it was corrected and re-tested before release.

Limitations: no real screen-reader audit, live email delivery test, disabled-JavaScript browser session, or measured Core Web Vitals study. The repository's existing Wix production site, domain, indexing policy and enquiry architecture are preserved. GitHub Actions and live deployment evidence are checked separately after committing.
