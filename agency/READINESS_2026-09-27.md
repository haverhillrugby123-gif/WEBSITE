# Publishing preparation, 27/09/2026

Scope: the GitHub Pages preview in `haverhillrugby123-gif/WEBSITE`. The live Wix site and its domain remain separate. This change is prepared on a pull request branch; it is not a publication or indexing cutover.

## Changes

- Owner-confirmed terms now appear consistently across the service journey: fees vary with tutor experience, payment follows each lesson, and cancellation with less than 24 hours' notice is chargeable. FAQ structured data matches the visible answers.
- Contact-page source order now matches its visual order: enquiry builder, then direct-contact details.
- An explicit Edit enquiry action retains entered details, removes the previous prepared message and email-app link, and returns keyboard focus to the tuition route field.
- A visible fallback explanation and direct email link remain available when JavaScript is disabled or blocked. Successful form initialisation hides the explanation.
- Browser coverage now checks all eleven pages at 320, 390, 768 and 1348 pixels, including the expanded mobile menu, plus draft editing and contact reading order.

## Evidence and boundaries

The starting revision is `f5e32b5218e1fd7e8c6f73e745067baa963c432c`. Its current workflow uploads only `dist`, correcting an older Drive tracker entry that described uploading the repository root. Pull requests run checks and build without deploying. Pushes to `main` deploy automatically.

The existing palette, assets, production canonicals, preview `noindex,nofollow`, robots file and client-side-only email handoff are preserved. Copy changes use the owner's confirmed terms. No analytics, storage, backend or third-party client script is introduced.

Validation results for the exact proposed revision belong in the pull request and its GitHub Actions run. A local build or earlier successful workflow does not prove the current proposal has passed hosted checks.

## Remaining owner and device evidence

`OWNER_FACTS_AND_MANUAL_CHECKS.md` remains the source of outstanding details: service staffing, lesson duration and any separate rescheduling arrangements; enquiry/recruitment access and retention; actual assistive-technology, Safari/iOS and configured email-client checks; repository protection settings. These are not resolved by automated browser results. Unconfirmed claims remain unpublished.

The website can be reviewed as an enquiry-led preview without inventing fees or promises. Full business launch readiness and any replacement of the Wix site require the outstanding evidence and a separate publication decision.
