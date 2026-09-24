# Preview release and recovery

Keep GitHub Pages a noindex preview. Wix, its domain and enquiry storage are separate. Do not remove noindex, add a CNAME, tracking or a form backend during routine release work.

## Before release

1. Record the exact PR head. Review the diff against its base and preserve subsequent edits.
2. Run static checks, build and the browser suite against dist beneath /WEBSITE/.
3. Confirm canonical-map.json, sitemap and dated destination evidence agree. Project robots.txt is not host-root crawl control.
4. Check the current implementation ledger. Owner-dependent claims remain unpublished until confirmed; unknown test results must remain labelled.
5. Ensure the successful PR workflow belongs to the exact revision being merged. PR checks must not deploy.

## After an authorised merge

Wait for the main build/deployment workflow. Check deployed revision metadata and smoke output, then inspect the main enquiry and mobile navigation journeys. A Pages deployment result alone is not an application check.

## Recovery

Use a revert commit for the faulty merged change, preserving history, then run the same checks and deployment. Do not force-reset main or delete branches to recover. Before a release, record the last known-good revision and its successful run. If a revert conflicts with later edits, prepare and review the smallest recovery change instead. Verify the restored revision on the deployed preview. This document is a recovery procedure, not evidence that a restoration rehearsal has occurred.

## Maintenance

Pinned external Actions must include a release comment. Review upstream release changes and resolve the new full commit before updating; never replace a pin with an unverified SHA. Keep dependency changes isolated and use the lockfile. Check hosted protections with an authorised settings session; an integration's 403 response does not establish that controls are disabled.
