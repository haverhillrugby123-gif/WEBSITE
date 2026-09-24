# UK Online Tuition usability redesign

24/09/2026. This review supersedes the earlier publication-readiness assessment for the current design.

## Delivered

The previous design gave generic artwork and animated demonstrations more space than useful information. The homepage now begins with the tuition offer and enquiry route, followed by three clear stage choices. The rocket, decorative carousel, simulated progress graphics and duplicate teaching interactions have been removed, including their scripts and assets.

GCSE, Primary and 11+ pages now explain subjects, preparation and lesson approach in compact static sections. About presents the founder's actual credentials. How It Works explains enquiry, discussion and arrangement. Contact puts the form before secondary information on mobile and includes direct email and telephone links. Resources uses searchable compact rows rather than oversized cards. FAQs put fees, format and getting started first.

The shared brand colours, accessible navigation, email-draft safeguards, useful articles and prior fixes are preserved. The form prepares a draft for the visitor to send; it does not submit an enquiry or save personal information. No email was sent in testing.

## Research and factual grounding

Reviewed [Tutorful](https://tutorful.co.uk/), [MyTutor's process](https://www.mytutor.co.uk/how-it-works/) and [Owl Tutors](https://owltutors.co.uk/). The design applies useful patterns: clear subject and stage routes, a short explanation of the next steps, concrete teaching evidence, and practical information near the enquiry action. It does not copy their marketplace functions or promise unavailable services.

Founder credentials were checked against [the existing About page](https://www.ukonlinetuition.co.uk/about-5). Contact details were checked against [the existing business website](https://www.ukonlinetuition.co.uk/). No prices, reviews, results, guaranteed availability or tutor-wide credentials were invented. Forty existing article links returned HTTP 200; two representative articles were also opened in a browser and their content checked. This is link verification, not a subject-matter audit of all articles.

## Verification scope

Browser checks cover 11 pages at 320, 375, 768, 1024 and 1440 pixels: 55 layout cases. No horizontal overflow, active animations, remaining motion/carousel markup, broken images or oversized decorative elements were detected. Every page has one H1. The first Contact field sits 457 to 631 pixels from the top across these widths.

Twenty-two internal destinations and fragment targets passed. Invalid and valid enquiry drafts, edit invalidation, resource search and reset, and navigation/enquiry fallback without JavaScript passed. Automated accessibility checks covered every page at mobile and desktop widths. A contact navigation contrast defect was corrected; targeted mobile and desktop rechecks passed with zero axe violations. The mobile menu passed ten consecutive open, Escape and focus-return tests after correcting a test locator that did not account for the button changing its name to Close. The independent visual challenger found no serious visual usability blocker in the reviewed desktop and mobile screenshots. Automated tests do not replace testing with a screen reader or representative parents.

Four distinct Agency specialists contributed to this revision: UX Researcher (competitors), Frontend Developer (service pages), UI Finish-Gate Reviewer (critical review), and Test Automation Engineer (independent browser checks). These are additional to the earlier thirty-agent review, which is retained as history rather than reused as proof of this design.

## Publication boundary

The deliverable is the GitHub Pages preview. The separate Wix production site and domain have not changed. Preview noindex/nofollow, robots blocking and production-domain canonicals remain in place. An indexed production cutover still requires route and canonical mapping, domain/deployment configuration and separate authorisation. The enquiry mechanism remains an email-client handoff, not a backend submission service.
