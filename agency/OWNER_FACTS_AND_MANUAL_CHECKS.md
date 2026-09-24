# Facts and external checks still needed

Updated 24/09/2026. These are completion dependencies, not approved customer-facing claims.

## R05: service facts

Confirm once for GCSE, 11+ and Primary, noting any differences:

- Who delivers lessons: founder only or other tutors, and how the assigned tutor is introduced.
- Supported ages/year groups, subjects, exam boards and tiers.
- Typical lesson duration and one-to-one/group options.
- Fees or the exact quotation process; payment timing and cancellation/rescheduling terms.
- Parent involvement and feedback arrangements.

Publish confirmed facts consistently in the relevant service pages, How It Works, FAQ and contact guidance. Update FAQ structured data when visible FAQ answers change. Do not reuse founder qualifications as a claim about all tutors.

## R07: email and recruitment handling

Confirm who can access enquiries, how long enquiries and tutor applications are retained, what determines deletion, and the actual process/contact for access or deletion requests. Confirm recruitment next steps and when documents are requested through an appropriate channel. Existing email handoff and minimisation wording must remain accurate; do not imply website storage or invent a retention period.

## R08: real assistive technology and email applications

Record tester, date, device/OS, browser/client version, exact commit and result for:

1. NVDA and VoiceOver: navigate services, complete and recover from enquiry errors, read the draft, select/copy it and return to editing.
2. Actual Safari/iOS and normal Firefox: menu, focus visibility, zoom/reflow, enquiry and resource search.
3. Configured email clients: recipient, subject and body survive mailto handoff; do not send personal information as a test. Clipboard-denied manual copy works.

Playwright WebKit is engine evidence, not a claim that Safari or VoiceOver has been tested. Automated forced-colour/reflow checks do not establish WCAG conformance.

## R12: hosted settings

The connector returned no repository rulesets but could not read branch protection (403); secret protection settings are unavailable through this connector. An authorised maintainer should inspect these settings and record their actual state. Do not disable protections or widen app permissions simply to complete an audit.
