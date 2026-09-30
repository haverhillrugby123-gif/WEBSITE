# Enquiry clipboard resilience, 30/09/2026

Scope: the existing draft pull request for the GitHub Pages preview. This is not a live website change or a publication decision.

## Change

Copying an enquiry can finish after a visitor chooses Edit enquiry or prepares a newer draft. The previous handler would then replace the current status with an old result; a denied copy would also try to focus and select the earlier, now-cleared preview. Each prepared or cleared draft now advances a version counter. A pending clipboard result only changes status or focus if it still belongs to the visible draft.

The clipboard request uses the message present when Copy enquiry was selected. This guard does not cancel a clipboard request already started by the visitor. Editing retains the existing behaviour: clear the prepared preview and email-app link, keep the form details, and require preparation again.

## Regression coverage

A new browser case delays the clipboard result, then checks both Edit enquiry and regeneration before allowing either success or denial to settle. It verifies that the current status, focus, draft visibility and message remain correct. The clipboard is mocked, all form values are synthetic, and the existing suite blocks external requests. No email app is launched or message sent.

## Verification

Source changes were made through the GitHub connector. The first run passed static checks/build and 568 of 570 repeated browser cases, but failed two regeneration checks before clipboard settlement. Run: https://github.com/haverhillrugby123-gif/WEBSITE/actions/runs/36703540081

With approval, the saved diagnostic ZIP was inspected read-only: JSON traces, failure-context text and screenshots. No archive code, local website runtime, new browser session or email client was executed. The prepare-button click snapshots show the root scroll position changing from 1563 to 1594 in Firefox and 1864 to 1943 in WebKit while the pointer action completed. The button moved away from the recorded pointer position, and the form remained in its previous editing state. This points to the page's smooth-scrolling/focus interaction rather than clipboard completion.

The active enquiry builder now uses immediate root scrolling. Other pages retain their existing scrolling behaviour. The existing regeneration and delayed-copy assertions remain unchanged; the latter also checks that immediate scrolling is active. No timeouts, retries, forced clicks or sleeps were added to hide the failure. The full release suite is rerun through GitHub Actions; the exact-commit result is recorded in the pull request. Earlier results do not validate this revision.

Existing owner decisions and real Safari/iOS, assistive-technology and configured email-client checks in OWNER_FACTS_AND_MANUAL_CHECKS.md remain outstanding. No network, storage, tracking, backend, indexing, domain or Wix setting was added or changed.
