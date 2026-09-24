# UK Online Tuition: website review and next steps

Review date: 24/09/2026. All dates use DD/MM/YYYY. Scope: GitHub Pages website and open redesign pull request, with limited checks of linked production destinations.

## Recommendation

Use the existing redesign pull request as the basis for the next release. It materially improves the published preview and already resolves several defects. Do not commission another redesign or replace this small static site with a framework. First correct the canonical mapping and script-failure behaviour and strengthen the release checks. In parallel, resolve the educational error in the prominently linked AQA guide through the separate Wix workflow, or stop recommending it pending correction. Then publish clearer, owner-confirmed practical information for parents.

Confidence: 0.88, a judgement based on source review, successful local checks/builds, GitHub Actions evidence and targeted browser testing. It is not a measured probability or a claim of complete accessibility, security or educational certification.

## Which website was reviewed

| Surface | Revision | Meaning |
|---|---|---|
| [Published GitHub Pages preview](https://haverhillrugby123-gif.github.io/WEBSITE/) | `32951b7ddc0ec9bcbf73e040c22358ffa561f3c1` | Current main snapshot; older design |
| [Open PR #1](https://github.com/haverhillrugby123-gif/WEBSITE/pull/1) | `92ebfadf2e9f2b7fdc8d546c57d391928a2583d0` | Newer design, reviewed from a local build |
| [Wix production](https://www.ukonlinetuition.co.uk/) | No repository revision | Separate site; only selected outgoing destinations checked |

The repository explicitly treats GitHub Pages as a preview. Its noindex policy, email-only enquiry handoff and separation from Wix are intentional constraints. This review did not merge the PR, deploy changes, alter Wix, change a domain or add tracking. An open PR is not evidence that visitors already see its improvements.

## Verified strengths

- The candidate provides clear GCSE, 11+ and Primary routes, recognisable book-and-spark branding and practical next-step copy.
- Its enquiry form creates a reviewable, explicitly unsent draft. The visitor chooses an email app or a copy route. Changing details invalidates the stale draft.
- Search has 40 resources, an empty state and a reset that restores all resources and returns focus to the search field.
- Both versions pass their configured local checks and build. The candidate checks 11 HTML pages, 282 local references and 22 image elements, including validation regression fixtures.
- Candidate CI succeeds on the reviewed SHA. PR builds are separate from deployment, which is restricted to main.
- Thirty candidate layout checks across ten regular pages at 375, 768 and 1440 CSS pixels found no document horizontal overflow, no completed broken images and exactly one H1 per page. These are bounded layout checks, not complete visual or accessibility tests.

## Prioritised action register

Priority P1 means correct promptly before broader promotion or reliance on the affected content. P2 means the next planned delivery batch. P3 means worthwhile refinement after higher-value work. Estimates are planning judgements for an experienced implementer, excluding waiting for owner information.

### R01 · P1 · Correct the featured AQA Paper 1 guide

**Confirmed issue, separate Wix surface.** The prominently linked [Paper 1 guide](https://www.ukonlinetuition.co.uk/post/aqa-gcse-english-language-paper-1) still instructs pupils to list four pieces of information for Q1 and displays a September 2026 specification-check label. Official AQA guidance describes four multiple-choice subquestions for first examination from 2026. The unchanged four-mark total does not make the old instructions appropriate. [AQA answers and commentaries, page 3](https://www.aqa.org.uk/files/2a0165d2-2b01-4d08-8c02-51c5d4ee9926/0a5054aa567b82159c3e8a59c58e78202f6f8760.pdf).

**Next step:** subject lead checks the article's instructions, examples and current-exam statements; corrects the affected material through an authorised Wix task; records the actual reviewer, source and review date. If correction is delayed, stop prominently recommending the affected guide or label historical material accurately. Do not assume the other 39 resources are wrong or verified.

**Done when:** the published instructions and examples match the current format and the review label reflects a real check; alternatively, the inaccurate guide is no longer recommended from this preview pending correction. Recheck the GitHub outgoing link or its removal. Owner: subject/content lead. Estimate: 1–3 hours for this article; wider corpus review requires separate sizing.

### R02 · P2 · Replace assumed production canonicals with a verified route map

**Confirmed defect with limited immediate preview impact.** The candidate GCSE canonical points to `https://www.ukonlinetuition.co.uk/gcse/`, which opened a production 404 page. Production navigation points GCSE to `/services-4`. The validator derives canonicals from preview folder names, so a green check currently enforces an unverified production mapping. The same assumption drives the sitemap. Other destinations require checking; their failure is not established here.

**Next step:** create one explicit preview-to-production URL map. Visit each destination, confirm it is the equivalent page, update canonical tags and sitemap from that map, and validate against it. A subsequent browser check confirmed `/services-4` loads the existing GCSE tuition page. Retain noindex and the existing domain; do not invent a canonical target for the 404 document. [Candidate validator](https://github.com/haverhillrugby123-gif/WEBSITE/blob/92ebfadf2e9f2b7fdc8d546c57d391928a2583d0/scripts/check-site.mjs).

**Done when:** every normal page has one canonical to its verified equivalent production page; sitemap URLs agree; deliberate mapping errors fail checks; no indexing or domain cutover occurs. Owner: frontend/SEO. Estimate: 2–4 hours.

### R03 · P2 · Describe preview indexing controls accurately

**Confirmed documentation/control mismatch.** The project includes `/WEBSITE/robots.txt`, but the host-root `/robots.txt` opened GitHub's not-found page. A project-folder file does not establish the host-wide crawl block claimed by documentation. Preserve the current safeguards while agreeing the intended crawler policy. Google must be allowed to fetch a page to read its noindex directive; crawl blocking and index exclusion are different controls. [Google robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

**Next step:** correct the documentation and test deployed noindex tags. Do not blindly add a host-wide Disallow rule that prevents reading noindex. Any host/domain changes need their own scoped decision.

**Done when:** documentation states which controls actually operate at each URL and deployed pages retain noindex. Owner: SEO/frontend. Estimate: 1–2 hours. Search Console removal/index status was not inspected.

### R04 · P2 · Add a small browser release gate and deployed smoke check

**Verified assurance gap, not a demonstrated current outage.** The workflow validates source and builds but does not exercise browser journeys or check the application after deployment. [Workflow](https://github.com/haverhillrugby123-gif/WEBSITE/blob/92ebfadf2e9f2b7fdc8d546c57d391928a2583d0/.github/workflows/pages.yml).

**Next step:** run a compact suite against built output under `/WEBSITE/`: mobile menu and Escape, invalid/valid enquiry, draft invalidation, copy fallback, resource filtering/reset, internal navigation and nested 404 recovery. After deployment, verify representative pages/assets, noindex and expected revision with bounded retries. Record a simple rollback procedure.

**Done when:** breaking the draft handler or an asset path fails the relevant check; PRs never deploy; post-deployment evidence identifies the tested revision. Owner: frontend/QA. Estimate: 1–2 days. Do not send test emails or add visitor analytics.

### R05 · P2 · Publish practical service facts parents can use

**Content gap requiring owner facts.** The pages repeatedly defer fees, tutor suitability, availability and cancellation terms to an enquiry. That is honest, but the site cannot itself answer several decisions parents need to make. The relationship between founder credentials and the tutor who will teach is implicit.

**Next step:** confirm who delivers lessons, covered subjects/boards/tiers, supported ages, typical duration, format, parent involvement, feedback arrangements, booking steps and cancellation/payment terms. Publish stable facts; keep changeable availability appropriately qualified. Prices may be a range or an explicit quote process if that accurately reflects the business. Never invent DBS checks, qualifications, outcomes or response promises.

**Done when:** a parent can identify suitability and understand the process before enquiry; founder credentials are not presented as credentials of every tutor; service, FAQ and contact copy agree. Owner: business/content lead. Estimate: 2–4 hours implementation after facts are supplied.

### R06 · P2 · Resolve the 11+ school-information contradiction

**Confirmed wording conflict.** The 11+ page asks for a target school/area; contact tells parents to omit the pupil's school. Distinguish an optional intended entrance-test school or general area from the child's current school. [11+ page](https://github.com/haverhillrugby123-gif/WEBSITE/blob/92ebfadf2e9f2b7fdc8d546c57d391928a2583d0/11-plus/index.html), [contact page](https://github.com/haverhillrugby123-gif/WEBSITE/blob/92ebfadf2e9f2b7fdc8d546c57d391928a2583d0/contact/index.html).

**Done when:** both pages use compatible wording and a parent can enquire using only stage, broad test/area and support needed. No school detail should become compulsory. Owner: content/frontend. Estimate: under one hour.

### R07 · P2 · Explain what happens to enquiries after email handoff

**Disclosure gap, not a legal-compliance verdict.** The enquiry builder says it does not save the enquiry; the page gives little information about how the business handles the email after the visitor sends it. Browser persistence, clipboard history and mailbox handling were not comprehensively audited. Tutor recruitment also needs clear initial-contact expectations and a usable fallback address.

**Next step:** owner confirms who receives enquiries, purpose, access, retention and an appropriate privacy contact; write a concise accurate notice. Explain the recruitment next step and ask initially only for necessary information. Do not claim the website's lack of storage means no personal data is handled by the business.

**Done when:** before handoff, contact and recruitment expose an owner-approved explanation of actual email handling and an accessible privacy contact; initial recruitment requests discourage identity documents and identifiable pupil records. Owner: business/privacy lead. Estimate: 1–3 hours writing/implementation after facts are confirmed; legal review, if needed, is separate.

### R08 · P2 · Complete targeted accessibility and compatibility checks

**Unverified area, not established non-conformance.** Native disclosures, labelled form fields, visible focus rules, menu state and draft-heading focus are good foundations. Full screen-reader, keyboard and real-device evidence is missing from this run.

**Next step:** test NVDA and VoiceOver journeys, error recovery, draft reading/copy, sticky-header focus visibility, zoom/reflow and forced colours. Check actual Safari and Firefox, no-JavaScript use, slow loading and email clients. Strengthen the select border if rendered testing confirms the weak boundary. Treat WCAG 2.2 AA as a proposed quality target, not certification. [W3C focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum), [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).

**Done when:** recorded users/testers can complete the core journeys and any failures have evidence, a fix and a retest. Owner: accessibility QA/frontend. Estimate: 1–2 days for this bounded matrix, not a full conformance audit.

### R09 · P3 · Preserve service context and remove avoidable enquiry friction

Use an allowlisted broad service identifier to carry GCSE/11+/Primary context into contact, without pupil details in URLs. Keep fields editable and direct contact functional. Consider making reply email optional only if the owner confirms it is operationally unnecessary; visitors ultimately send from their own email account. These are usability hypotheses, with no measured conversion uplift.

**Done when:** each service journey retains useful context without assumptions about a child's year/subject, and no tracking/storage is added. Owner: frontend/product. Estimate: 2–4 hours.

### R10 · P3 · Improve small resource-search edge cases

Normalise `&` and `and` so `power & conflict` finds the same guide as `power and conflict`. Clarify the broad Revision category, which excludes revision guides assigned to subject categories. A clearer label such as general study guidance may suffice after editorial review; a search service is unnecessary for 40 items.

**Done when:** a small expected-query table passes and category labels accurately describe results. Owner: frontend/content. Estimate: 1–2 hours.

### R11 · P3 · Simplify inherited CSS and optimise measured costs

Shared CSS retains obsolete component rules and broad overrides. There is also a comparatively large footer logo SVG. These are maintenance/payload opportunities, not evidence that users experience a slow website. Prefer a measured cleanup, preserving the supplied brand artwork, over another redesign.

**Done when:** unused rules are removed in bounded changes, desktop/mobile screenshots remain correct and actual compressed transfer/rendering measurements establish any benefit. Owner: frontend. Estimate: half a day initially. No Lighthouse or Core Web Vitals score was measured here.

### R12 · P3 · Harden maintenance proportionately

Pin workflow actions to reviewed immutable commits with a workable update process. Inspect available hosted branch/secret protections before claiming they are absent or adding duplicate tooling. Keep the small static architecture. Existing permissions and deterministic dependency installation are useful strengths.

**Done when:** inspected hosted settings are recorded, external actions use reviewed full commit SHAs with release comments and an update process, and normal authorised release checks pass. Maintainers know how to update dependencies and restore a working preview. Owner: repository maintainer. Estimate: 1–3 hours after settings access.

### R13 · P2 · Keep the mobile page usable when scripts fail

**Confirmed browser reproduction in a local failure simulation.** When JavaScript requests return 503 but browser scripting remains enabled, the mobile navigation stays expanded over the page without a close button. At a confirmed 390-pixel viewport, it obscured the homepage heading and main enquiry CTA. This differs from disabling JavaScript entirely. Resource search/filter controls also lack a successful-initialisation state in source and appear usable when their handlers have not loaded; that resource failure case was not separately exercised.

**Next step:** keep fallback navigation in document flow until enhancement succeeds, and enable resource tools only after handlers attach. Keep all static links available. Add blocked-script tests alongside successful-load and JavaScript-disabled cases.

**Done when:** at 390 and 900 pixels, failed navigation scripts leave content and links reachable without an unclosable overlay; resource controls do not imply functionality they cannot provide; ordinary enhanced navigation and filtering still work. Owner: frontend/QA. Estimate: 2–4 hours.

## Delivery sequence

| Stage | Work | Exit condition |
|---|---|---|
| First, parallel tracks | R01 educational correction; independent GitHub work on R02 canonical map, R06 wording and R13 resilience | Current guidance verified in its own authorised Wix task; GitHub fixes can proceed independently |
| Next delivery batch | R03, R04, R08 | Accurate preview controls, repeatable browser checks and explicit test limits |
| Owner-led content batch | R05, R07 | Approved operational facts published consistently |
| After core checks | R09–R12 | Small improvements validated without redesign, new backend or tracking |

The technical estimates overlap and should not be simply added. A provisional first engineering batch of 2–4 person-days covers R02, R03, R04, R06 and R13, with only a basic keyboard smoke check from R08. It excludes R08's full targeted assistive-technology/device matrix, a full accessibility audit, all-article review, owner decisions, Wix content changes and R09–R12. Reassess after the browser suite and content facts are available. Wix correction is not a prerequisite for unrelated GitHub improvements; avoid continuing to prominently recommend inaccurate material while that correction is pending.

## What is already fixed in the candidate

Do not recreate fixes for the main branch's whitespace-only enquiry acceptance, missing draft/copy fallback, stale carousel behaviour or broken privacy-check regex. The candidate replaces those flows, removes decorative motion, uses standard form submission, invalidates edited drafts and adds regression fixtures. It also improves no-JavaScript navigation and form safety in source. Runtime no-JavaScript verification remains outstanding in this review.

## Proposed release decision

Before the next functional preview release, fix R13, verify R02, add the core browser gate in R04 and complete its basic keyboard checks. R06 is an inexpensive accompanying copy correction. These are recommended acceptance conditions, not claims of current release approval. Broader promotion should also resolve or remove the inaccurate recommendation in R01 and complete the targeted accessibility/device work in R08. Wix correction can run independently.

## Verification and limitations

Local scripts were executed directly using Node; no fresh npm installation was necessary because check/build use Node built-ins. Existing remote Actions runs provide separate evidence of the configured npm-based workflow. [Candidate successful run](https://github.com/haverhillrugby123-gif/WEBSITE/actions/runs/36021859789), [main successful run](https://github.com/haverhillrugby123-gif/WEBSITE/actions/runs/35988626615).

No claim is made about email delivery, tutor credentials, actual availability, inbox response, real conversion rates, search rankings, production headers, all dependency advisories, hosted repository protections or legal compliance. Forty resource links exist; one featured article was examined for a specific current-format discrepancy. Earlier reports in the repository are historical evidence, not tests performed by this review.

## Review method and specialist record

The specialist ledger below and the accompanying evidence-appendix.md document the individual reviews. The HTML report provides direct download links to the appendix and action register. Findings are deduplicated by root cause. Multiple agents agreeing does not increase factual certainty without evidence, and a verification gap is not classified as a demonstrated user-facing defect.
