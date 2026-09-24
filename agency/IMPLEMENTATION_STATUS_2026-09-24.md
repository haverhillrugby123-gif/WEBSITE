# Review implementation ledger

Updated 24/09/2026. Review actions R01–R13. This file distinguishes implementation from verification and business-dependent work.

| Action | Status | Evidence / outstanding work |
|---|---|---|
| R01 | Mitigation implemented | The inaccurate Paper 1 overview link is withdrawn from all preview HTML. Static check prevents accidental reinstatement. Wix article remains separate and unchanged. |
| R02 | Implemented; local checks pass | Ten production destinations verified through their rendered content on 24/09/2026. Explicit scripts/canonical-map.json drives canonical/sitemap regression checks; About maps to the founder page, /about-5. 404 has no invented canonical. Deployment check pending. |
| R03 | Documentation corrected | Preview page noindex is operative; project robots.txt is retained but does not establish a host-root crawl exclusion. No domain or indexing cutover. |
| R04 | Implemented; hosted verification pending | Browser CI, revision metadata, bounded post-deployment smoke and release/recovery runbook added. Final local matrix 33/33 passes; negative controls reject broken draft handling and 404 assets. |
| R05 | Owner facts requested | Existing facts checked against public site. No invented fees, duration, staffing, cancellation or feedback promises. Awaiting confirmed operational details. |
| R06 | Implemented | Contact distinguishes current school from optional target entrance school/general area. |
| R07 | Partial | Accurate email-handoff explanation and privacy-question address added before handoff; tutor enquiry asks for a brief introduction, no identity/pupil records. Owner-confirmed access/retention/process details outstanding. |
| R08 | Automated portion verified; manual checks outstanding | Select boundary strengthened; skip links explicitly keyboard-focusable. Chromium/Firefox/WebKit keyboard, reflow, media emulation and failure checks pass. Real NVDA/VoiceOver, Safari and mail-client checks remain open. |
| R09 | Implemented | Allowlisted editable service context, no pupil data in URL. Email remains required pending operational decision. |
| R10 | Implemented | Ampersand/and equivalence; Revision category renamed General study guidance; controls enabled only after successful initialisation. |
| R11 | Bounded cleanup implemented; performance benefit unverified | Removed 50 unused legacy navigation CSS rules after class inventory. Footer logo lazy-loaded without artwork modification. Homepage visually checked at 320/1440px; narrow-screen logo shrink fixed. Source comparisons are filesystem/gzip estimates. A verified measurement script records actual initial-load transfer, encoding and paint after deployment; hosted observations pending. No causal performance-gain claim. |
| R12 | Partial | Actions pinned to connector-verified full release commits; monthly updates configured. Rulesets API returned [] on 24/09/2026. Branch-protection read returned 403 Resource not accessible by integration; protection state is unknown, not absent. Secret protection settings not accessible via the installed connector. |
| R13 | Implemented and locally verified | Failed-script navigation remains in document flow; disabled resource tools retain a visible explanation and 39 static links. No-JavaScript and blocked-script tests pass at 390/900px across three engines. |

## Deployment and completion

Do not mark these changes deployed from a local build or PR check. Record final commit SHA, successful workflow URLs and deployed smoke evidence after release. Any remaining owner-dependent or real-device work stays explicit.


