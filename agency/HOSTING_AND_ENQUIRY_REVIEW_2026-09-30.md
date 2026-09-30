# Hosting and enquiry approval bundle

## Recommended route

Keep GitHub as the source repository and PR review/CI system. Use **Netlify Free with Netlify Forms** as the proposed production hosting/form route, subject to owner approval and actual account-plan verification. GitHub Pages explicitly excludes free hosting for running an online business or sites primarily facilitating commercial transactions. This tuition enquiry site is directed toward buying lessons, so Pages is not recommended as production hosting. No hosting account, repository connection, deployment, domain change, notification or analytics integration has been created by this work.

Official sources checked 30 September 2026:
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://www.netlify.com/pricing/
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/usage-and-billing/
- https://docs.netlify.com/manage/forms/notifications/

Current advertised Free plan: 300 usage credits/month; production deploys15credits, bandwidth20credits/GB, requests2credits/10,000. Form usage documentation says Forms are free/unlimited on credit-based plans; legacy plans have different submission/storage billing. Verify the actual selected plan rather than promising unlimited hosting or applying old100-submission assumptions. Existing observed traffic is small, but bot requests and assets also consume usage; 44sessions/28visitors is not a capacity guarantee. Keep auto-recharge and paid upgrades off; inspect the chosen plan's cap/overage behaviour before launch.

Cloudflare Pages is a reasonable static alternative, but email delivery needs another backend/verification path. Netlify combines hosting, form records, spam filtering and notification setup with less custom infrastructure. Native Forms email defaults use Netlify's sender; a field named email permits Reply-To to the submitter. No API credential needs to appear in browser source. Actual stored submissions and notification receipt must still be tested; HTTP acceptance does not establish delivery.

## Source readiness versus activation

The normal source/local/CI preview remains email-app/copy only, with explicit UNSENT status and no network submission, cookies, analytics or visitor storage. The proposed adapter is built separately for review. Its synthetic local tests cover request encoding and recovery, not a real Netlify service. Do not label it live-working.

Do not enable the adapter on GitHub Pages or Vite as if they process forms. Activation requires approved hosting, correct form detection, provider settings, minimisation/privacy copy, and one approved delivery test. No attachments, pupil names, medical/safeguarding information, subscriptions or auto-response are proposed.

## Smallest unavoidable owner setup decisions

1. Netlify Free was approved by Dan on 30 September ("netlify ok"). Read-only browser inspection of https://app.netlify.com/ shows its Log in screen. Dan must sign in to his owner-controlled account. Account creation and acceptance of provider terms must be performed/approved by Dan. Repository access should be limited to WEBSITE; actual requested scopes have not yet been displayed or authorised. No deployment is authorised. Review the actual Free plan, credit cap and preview visibility before connecting/building. The login screen links to https://www.netlify.com/legal/self-serve-subscription-agreement/ and https://www.netlify.com/privacy . No login, terms or OAuth permission was accepted by this agent.
2. Dan has confirmed only he accesses the Gmail inbox and has declined automatic deletion. Confirm access to future Netlify submission records and truthful manual retention/privacy-request handling before activation. No fixed retention period has been chosen or invented; this does not block independent source preparation.
3. Configure the specific tuition form notification to **ukonlinetuition1@gmail.com only**, without unrelated recipients or marketing actions. This is the owner's confirmed destination; separate service setup must still be approved. Keep provider spam/rejected records and quota/error behaviour visible for operations.
4. Separately approve exactly one controlled delivery test after configuration. Proposed recipient: ukonlinetuition1@gmail.com; subject: `[WEBSITE QA] Synthetic enquiry - no pupil data`; body: name Website QA Test, owner-controlled sender email, Year10, English, support Synthetic delivery check only - no pupil data, availabilityblank; attachmentsnone. Confirm sender and the actual provider notification template before sending; the provider may prepend Netlify/form metadata. Record submissionID/time, spam status and actual Gmail receipt. Cleanup permission is separate. No test was sent in this work.
5. Approve the production domain/indexing change only after every migration manifest route is served or redirects to an equivalent page. Live Wix articles must remain available; keep /post paths and export/review content before moving the domain.

## Analytics path for approval

Start with Search Console on the approved production domain and explicit enquiry outcomes (submitted record, notification receipt, subsequent qualified enquiry). A CTA click, copied draft or mailto open is not an enquiry delivered. Prepare event names enquiry_start, enquiry_validation_error, enquiry_submit_accepted, enquiry_submit_failed with no names/emails/free-text/childdata in payloads. No tracking is installed. Choose analytics, access and any consent/storage setup separately; account ownership and plan cost must be reviewed before activation. Search Console cannot be used to invent exact click-keyword attribution from incomplete rows.

## Launch gates

External host/form configuration, real delivery verification, access/retention facts, actual NVDA/VoiceOver/iOSSafari/email-client checks, complete article migration, final canonical/sitemap/robots/404 behaviour and final publication approval remain explicit gates. Local tests and CI passing do not satisfy these external gates.
