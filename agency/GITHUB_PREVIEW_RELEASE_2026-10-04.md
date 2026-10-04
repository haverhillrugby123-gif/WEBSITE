# GitHub preview integration, 4 October 2026

This release combines the existing eleven-page GitHub preview, the prepared voiced homepage introduction, the original local design and enquiry improvements, and the free GCSE English Language structure guide. The live Wix site and its domain remain separate. The full-article migration in draft PR #3 is outside this release; resource cards continue to link to Wix articles.

## Source preservation

- Starting main revision: `f5e32b5218e1fd7e8c6f73e745067baa963c432c`.
- Introduction PR #5 head: `a8305b687b65d3e27efd02c36904bfba3387299c`. Its exact-head workflow passed on 2 October; it is separate evidence from checks for this combined revision.
- Original local changes dated 27 September are retained in a separate working copy. The original checkout is not rewritten. Four overlaps are explicitly reconciled: homepage introduction/design, GCSE guide/design, Resources guide/library, and JPEG/MP4/VTT/PDF preview MIME types.
- The PDF is the approved eight-page file, 86,393 bytes, SHA256 `7351452f669580b4aa0ab49c4b24cf27434288d933620dcfa0fa56cbe5e56e40`. Both download links serve those same local bytes beneath `/WEBSITE/assets/guides/`.
- The Resources library contains 45 unique article links, including six newer published Wix resources. The previously withheld Paper 1 overview remains withheld pending its separate content review.

## Verification boundaries

Local static checks and build passed for eleven HTML pages, 333 local references and 36 image references. Browser coverage includes all eleven pages at four widths, email-draft editing and fallback, resource search, native video controls/captions/transcript, PDF download hashes, keyboard use without JavaScript, and guide reflow with enlarged text.

The combined revision must pass its own GitHub Actions workflow before merging. Earlier workflow results do not validate these new files. The build job allows 25 minutes for the expanded suite of 35 journeys across three engines and ten repetitions, with zero browser retries. Windows Playwright WebKit reports a lower decoded video size on the unchanged introduction baseline; Linux CI retains the exact-resolution check. A one-off local WebKit resource-filter timeout passed when rerun. Neither engine emulation nor automated checks establishes actual Safari/iOS, assistive-technology or configured email-client results; outstanding manual checks remain in `OWNER_FACTS_AND_MANUAL_CHECKS.md`.

Preview pages retain production canonicals and `noindex,nofollow`. Enquiries remain an unsent email-app/copy handoff with no visitor storage. This release adds no tracking, credentials, form backend, domain or access change. The existing main workflow builds and deploys only the GitHub Pages preview, then verifies its revision and routes.
