# Enquiry clipboard resilience, 30/09/2026

Scope: the existing draft pull request for the GitHub Pages preview. This is not a live website change or a publication decision.

## Change

Copying an enquiry can finish after a visitor chooses Edit enquiry or prepares a newer draft. The previous handler would then replace the current status with an old result; a denied copy would also try to focus and select the earlier, now-cleared preview. Each prepared or cleared draft now advances a version counter. A pending clipboard result only changes status or focus if it still belongs to the visible draft.

The clipboard request uses the message present when Copy enquiry was selected. This guard does not cancel a clipboard request already started by the visitor. Editing retains the existing behaviour: clear the prepared preview and email-app link, keep the form details, and require preparation again.

## Regression coverage

A new browser case delays the clipboard result, then checks both Edit enquiry and regeneration before allowing either success or denial to settle. It verifies that the current status, focus, draft visibility and message remain correct. The clipboard is mocked, all form values are synthetic, and the existing suite blocks external requests. No email app is launched or message sent.

## Verification

This change was made through the GitHub connector. No local runtime or manual browser session was used. Exact-commit checks, build and repeated Chromium/Firefox/WebKit results are recorded in the pull request and linked GitHub Actions run once complete. Prior test results do not validate this change.

Existing owner decisions and real Safari/iOS, assistive-technology and configured email-client checks in OWNER_FACTS_AND_MANUAL_CHECKS.md remain outstanding. No network, storage, tracking, backend, indexing, domain or Wix setting was added or changed.
