# Facts and external checks still needed

Updated 27/09/2026. Confirmed facts are recorded separately from outstanding completion dependencies.

## R05: service facts

Owner confirmed on 27/09/2026 and reflected in the website copy:

- A free initial consultation helps understand parent priorities and identify suitable support for the child.
- Individual tuition and bespoke packages are welcome.
- Lessons last between 30 minutes and two hours.
- Founder Daniel Harris teaches lessons. This does not establish exclusive staffing.
- Fees vary depending on the tutor’s experience.
- Payment is due after each lesson.
- Cancellations require at least 24 hours’ notice; with less notice, the lesson is chargeable.

Still confirm for GCSE, 11+ and Primary, noting any differences:

- Whether any other tutors deliver lessons, and how they are introduced if applicable.
- Supported ages/year groups, subjects, exam boards and tiers.
- One-to-one/group options.
- The exact quotation process and any separate rescheduling arrangements. No fixed price has been supplied.
- Parent involvement and feedback arrangements.

Publish confirmed facts consistently in the relevant service pages, How It Works, FAQ and contact guidance. Update FAQ structured data when visible FAQ answers change. Do not reuse founder qualifications as a claim about all tutors.

## R07: email and recruitment handling

Owner confirmed that Daniel Harris handles enquiry emails. This does not establish exclusive mailbox access. Confirm any other authorised access, how long enquiries and tutor applications are retained, what determines deletion, and the actual process/contact for access or deletion requests. Confirm recruitment next steps and when documents are requested through an appropriate channel. Existing email handoff and minimisation wording must remain accurate; do not imply website storage or invent a retention period.

## R08: real assistive technology and email applications

Record tester, date, device/OS, browser/client version, exact commit and result for:

1. NVDA and VoiceOver: navigate services, complete and recover from enquiry errors, read the draft, select/copy it and return to editing.
2. Actual Safari/iOS and normal Firefox: menu, focus visibility, zoom/reflow, enquiry and resource search.
3. Configured email clients: recipient, subject and body survive mailto handoff; do not send personal information as a test. Clipboard-denied manual copy works.

Playwright WebKit is engine evidence, not a claim that Safari or VoiceOver has been tested. Automated forced-colour/reflow checks do not establish WCAG conformance.

## R12: hosted settings

Rechecked 08/10/2026 at main `6103e140da9ad4fbf1d58582a38d101d79a0a601`: the branch response explicitly reported `protected:false`, required status checks with enforcement off, and no repository or inherited rulesets. This supersedes the earlier 403-based uncertainty for those controls. Secret protection and environment approval settings remain unverified. A main protection rule requiring a pull request and the existing build check remains a proposed account-setting change. Do not disable protections or widen app permissions simply to complete an audit.
