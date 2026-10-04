# Separate static-host preparation

This draft starts from main `9d4ac882e9cfaad193512df940070ac01851f083`.
It prepares a separate host while the live Wix site remains at the apex and
`www.ukonlinetuition.co.uk`. Dan approved using his existing Netlify Free account
and `preview.ukonlinetuition.co.uk` on 4 October. No host project or DNS record
has been created by this preparation; current limits, target and TLS still need
verification. No new OAuth/token grant, paid service or unexpected terms are approved.

## Build outputs

| Command | Folder | Enquiry route |
| --- | --- | --- |
| `npm run build` | `dist` | Existing local email draft; `/WEBSITE/` 404 links |
| `npm run build:root` | `dist-root` | Existing local email draft; root 404 links |
| `npm run build:enquiry-preview` | `dist-enquiry-preview` | Review-only main Wix Form candidate |

Each output is separate. The existing Pages workflow still uploads only `dist`
and deploys only main. A draft PR cannot deploy either candidate. The root
outputs include `_headers` for Cloudflare Pages / Netlify static hosting, with
noindex, nosniff and explicit PDF, MP4 and VTT types. Provider behaviour must be
checked on the eventual hosted URL; the local server is not a provider emulator.

The enquiry candidate uses the exact main public form URL
`https://danielpharris4.wixforms.com/f/7511201696308003871`. It explains the
off-site destination, includes no query parameters or pupil details, and keeps
email/phone fallbacks. The eight-page guide stays freely downloadable.
The candidate also offers a free initial consultation and guide through the
existing unsent email builder, for adult contacts. A separate optional unticked
checkbox adds a weekly-newsletter request to that draft. It does not create a
subscriber, send confirmation, or start weekly delivery. Verify the actual
subscriber provider, consent record, confirmation, unsubscribe and retention
before enabling any operational newsletter signup. No pupil details are needed.
**Do not activate this candidate publicly until a controlled enquiry is recorded,
the success state is checked, and the owner's actual inbox receipt is verified.**
That test needs separate approval and coordination with the form owner; these
browser checks never send a submission or launch an email application.

All HTML sources, canonical/OG URLs, robots.txt, sitemap.xml, 45 Wix article
cards and approved PDF/video/captions remain unchanged. This is preparation for
a noindex pilot, not an indexing cutover. Organisation schema still identifies
the existing Wix business URL. A later indexing decision needs an exact final
hostname, self-canonicals/OG URLs, deliberate sitemap and Search Console plan.

## Host choice and permissions

Netlify Free is the approved first host, subject to action-time quota/permission
checks. Cloudflare Pages Free remains an alternative requiring a separate account
choice. Its [published limits](https://developers.cloudflare.com/pages/platform/limits/)
are 500 builds/month, one concurrent build, 20,000 files and 25 MiB per asset.
The [subscription agreement](https://www.cloudflare.com/terms/) still applies;
no agreement has been accepted on Dan's behalf and no paid service is proposed.
No Functions, Workers, R2, analytics or new form processor are required here.

There are two distinct first-deployment choices:

- [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/):
  Dan authorises the Cloudflare GitHub App for **only** `haverhillrugby123-gif/WEBSITE`.
  Use the reviewed release branch, `npm run build:root`, output `dist-root`, and
  disable automatic production/branch deployments until the release is approved.
  Connecting the repository can start a public deployment, so grant and launch
  permission must be resolved before connecting it. No token belongs in the repo.
- [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/):
  upload the reviewed prebuilt folder/ZIP through the dashboard after approval.
  It avoids a repository grant but is manual; a Direct Upload project cannot later
  switch to Git integration. Moving then requires a new Pages project.

Netlify's [current pricing](https://www.netlify.com/pricing/)
has 300 credits/month, with production deployments and traffic consuming credits.
The applicable [self-serve agreement](https://www.netlify.com/pdf/self-serve-subscription-agreement.pdf/)
and actual account limits need review. No account or billable option is configured.

GitHub remains the code and review location. Its
[Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
restrict using Pages as free hosting for an online business, so the current Pages
URL must not be treated as an approved commercial launch destination.

## Subdomain plan

Read-only public DNS on 4 October 2026 shows Wix nameservers and Wix apex/www
records. Account-level DNS access has not been established by these code checks.
The approved new subdomain is `preview.ukonlinetuition.co.uk`; no guessed project
target may be used. The exact Netlify target will come from the newly created,
reviewed project, with a readback of any existing preview record before changes.

[Cloudflare's custom-domain instructions](https://developers.cloudflare.com/pages/configuration/custom-domains/)
allow a subdomain CNAME while keeping the existing DNS provider. After the actual
Pages project exists and public launch is approved, first associate the chosen
hostname in Pages, then obtain approval for the exact **new subdomain** CNAME to
that project's real `pages.dev` target. Read existing records and CAA before the
change, then verify TLS and all routes. Preserve apex, www, nameservers, MX and
other mail/security records. No DNS record is proposed with a guessed target.

## Release gates and verification

Run `npm run check`, all three builds, `npm run test:browser`, `npm run test:root`
and `npm run test:enquiry-preview`. CI retains the ten-repeat existing release
suite and adds the root suite plus the separate candidate checks, all with zero
retries. Existing browser assertions resolve their expected URLs from each
configured base path; their download, keyboard, 404 and form checks are retained.

Before release: check current account limits and any unexpected terms/permissions;
verify the approved subdomain's actual target, provider headers/404/deep links and approved
asset hashes on the real host; verify the main form's recording and inbox receipt
before activating that CTA; obtain any separate indexing or measurement approval.
Do not infer lead success from a link click, email draft or aggregate form count.
