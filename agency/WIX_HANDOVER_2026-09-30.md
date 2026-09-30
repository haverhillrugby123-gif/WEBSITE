# Wix publication handover, 30/09/2026

## Scope and platform

This repository is a separate static review/reference frontend. Its existing workflow publishes GitHub Pages only when main changes. Do not merge PR #3 as a way to publish Wix. There is no verified repository-to-Harmony import or deployment binding.

Read-only Wix context on 30/09/2026 confirmed:

- Production: `64c79e1f-b6eb-444d-aa03-a4495e2b68f8`, https://www.ukonlinetuition.co.uk/, published, premium/custom domain, Editor.
- Existing Harmony target: `9acfbd18-b294-48b8-add2-4e0c912bead9`, https://danielpharris4.wixsite.com/uk-online-tuition-1, already published, free, Odeditor, Velo disabled.

The public Harmony URL is not private staging. Do not publish changed content there without approval. No new Wix site, domain change or paid service is authorised.

Wix's current static-upload recipe creates a new headless site; it explicitly excludes adding code to an existing editor site. It does not establish compatibility with this Harmony target. No upload/import was attempted. Source: https://dev.wix.com/docs/api-reference/account-level/sites/skills/upload-a-website-or-html-files

Default bounded handover: use approved repository content/design as reference for the existing native Harmony draft. Confirm this path with the owner before material platform work; any alternative hosting/domain migration requires a separate decision.

## Prepared GCSE English copy and journey

The existing GCSE page now contains a visible English support section above the subject cards. It describes reading/analysis, writing and Literature support without guaranteed grades, new pricing, tutor availability or board coverage claims. The free initial consultation was already owner-confirmed in OWNER_FACTS_AND_MANUAL_CHECKS.md.

CTA: **Enquire about GCSE English**. In the repository it opens `contact/index.html?service=gcse&subject=english`; only this recognised GCSE/English pairing is prefilled. Subject stays editable. No parent name, email or pupil information is accepted from URL parameters. The builder still prepares an UNSENT email to `ukonlinetuition1@gmail.com`; the visitor must review and send it through their email service. No website backend/storage, enquiry delivery or tracking is established.

For native Wix implementation, retain equivalent clear wording and the selected truthful enquiry route. Repository JavaScript is not assumed to run in Harmony.

## Evidence-led conversion priorities

The owner-provided research records 44 sessions, 28 visitors and 99 pageviews for 31/08–29/09; 21 of 22 search visits landed on revision articles. The Paper 1 overview had 14 sessions, all single-page, with a late tuition mention that was bold text rather than a link. Separate bot hits are not visitor counts. These are supplied research findings, not a new analytics query here.

1. After content accuracy review and publication approval, replace that live article's unlinked tuition mention with a clear contextual link to the agreed native GCSE English offer/enquiry route, ideally with an earlier useful CTA. Do not publish the repository path into Wix blindly.
2. Preserve the repository's deliberate exclusion of the old Paper 1 overview: scripts/check-site.mjs rejects that link until its current-format exam guidance is reviewed. Conversion optimisation must not reintroduce inaccurate guidance.
3. Keep the existing GCSE page as the commercial service hub. Preserve metadata/canonical mapping until a production page/query inventory supports a change; incomplete exposed search query rows do not prove which keywords produced clicks.
4. Do not treat zero queried form records as proof of zero enquiries. No reliable delivery/conversion tracking has been verified. No ads, tags or paid campaign launched.

## Essential owner decisions

| Decision | Bounded choices | Required evidence |
| --- | --- | --- |
| Wix delivery path | Translate approved content into the existing Harmony draft; or separately plan an authorised hosting migration | Confirm target and scope; no new site by default |
| Enquiry route | Keep explicit email-app/copy handoff; or use existing native Tuition Enquiry form after verification | For native form: destination inbox, notifications, access, storage and an explicitly approved synthetic submission test |
| Privacy operations | Owner supplies actual access, retention/deletion process and request contact | Daniel handles email is confirmed; exclusive access and a retention period are not |

Prepared email handoff avoids inventing backend policy, but real email-client behaviour still needs testing. Native form delivery must not be described as working merely because a form exists. No contact submissions or emails were sent.

## Publication checklist

| Status | Gate |
| --- | --- |
| PASSED (baseline) | PR #3 was verified draft/unmerged at ec193b88d46f62dceccee03da3b3748557028c3f; CI run 36705690634 succeeded, deploy skipped. This is baseline evidence, not evidence for later revisions. |
| PASSED (draft safeguards) | Recent clipboard draft-version guards and enquiry-only immediate scrolling retained. No backend, tracking, persistence or credentials added. Production canonicals, preview noindex,nofollow and robots preserved. |
| PASSED (automated accessibility scan) | axe-core 4.13.0 reported no violations on all 11 pages at 390px and 1348px after fixing the contact privacy link's colour-only styling with underlines. Incomplete checks remain, primarily layered-background contrast, plus selected ARIA/link checks on Home and Work With Us; they require manual assessment. This is not WCAG certification. GCSE and Contact desktop/mobile screenshots were visually reviewed. |
| PASSED (local draft) | Check/build and all 60 Chromium/Firefox/WebKit cases passed without retries on 30/09/2026 (43.3 seconds). All 11 pages reflowed at 320/390/768/1348px, with keyboard, no-script, clipboard and English enquiry coverage. Final hosted revision/run is recorded separately in the PR and local final evidence. |
| UNTESTED | Real NVDA/VoiceOver, actual Safari/iOS, physical mobile browsers, 200%/400% browser zoom and configured email-client recipient/subject/body handoff. WebKit automation is not Safari/VoiceOver evidence or WCAG certification. |
| UNTESTED | Native Harmony responsive layout, native links/SEO and actual enquiry route after implementation. Repository tests do not certify Wix. |
| UNVERIFIED | Native Wix form delivery, conversion tracking, actual mailbox access/retention/deletion, branch protection and secret-protection settings. Do not broaden permissions to complete an audit. |
| UNVERIFIED / OWNER DECISION | Direct repository-to-existing-Harmony publishing path: none verified or attempted. Native reference implementation remains possible. Publication approval and owner route/privacy decisions remain outstanding. |

Confirmed fees/payment/cancellation/lesson duration are listed in OWNER_FACTS_AND_MANUAL_CHECKS.md. Remaining staffing, supported board/age specifics and rescheduling details are only needed before making those additional claims. No fixed fee or outcome guarantee should be invented.

Publication is a separate step after the final review and owner decisions. This handover authorises no merge, deployment, site creation, production edit, contact submission or indexing/domain cutover.
