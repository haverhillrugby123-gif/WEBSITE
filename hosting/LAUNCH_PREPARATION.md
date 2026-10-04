# Static build profiles

The website has three separate static outputs. Building them does not publish a
site or change the live Wix website.

| Command | Output | Purpose |
| --- | --- | --- |
| `npm run build` | `dist` | GitHub project-path preview |
| `npm run build:root` | `dist-root` | Root-path static build |
| `npm run build:enquiry-preview` | `dist-enquiry-preview` | Review-only consultation, guide and optional newsletter-request copy |

The contact page's primary link opens the existing UK Online Tuition form on
Wix Forms. It works without JavaScript, opens in a new tab and forwards no page
query parameters or referrer. Public route navigation has been checked;
submission recording and actual business-inbox delivery remain unverified.
These automated checks do not submit a form.

Visitors can explicitly expand the secondary email alternative. It validates
locally and prepares a draft for the visitor to review and send through their
own email service. It does not send or save an enquiry. A direct email fallback
remains available when JavaScript is unavailable.

The review-only offer adds an optional, unticked weekly-newsletter request to
the unsent email draft. It creates no subscriber, confirmation or weekly
delivery. Operational newsletter signup requires a separately verified consent,
provider and unsubscribe flow.

The free PDF remains directly downloadable without email. All 45 resource cards
open articles on the live Wix site. Wix canonical destinations, noindex controls,
robots and sitemap are retained. Root builds include static response-header
instructions; their behaviour must be checked on the actual hosting provider.

Run the source checks and the relevant browser journeys before releasing a
reviewed revision. GitHub CI retains repeated Chromium, Firefox and WebKit
checks with zero retries. Synthetic email checks remain unsent. Every output
includes `revision.json`; verify its exact revision on the published host.

Account access, publication, domain routing and rollback records belong in the
private operator handoff. They are not configured by these build commands.
