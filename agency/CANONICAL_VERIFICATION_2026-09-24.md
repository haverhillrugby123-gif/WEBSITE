# Production destination verification

On 24/09/2026, the following destinations were read in the browser and their rendered page identity checked. This records live evidence, not an inferred folder convention. These are existing production pages; no Wix changes were made.

| Preview page | Verified production path | Rendered identity |
|---|---|---|
| Home | / | UK Online Tuition homepage |
| GCSE | /services-4 | GCSE Tuition Services |
| 11+ | /copy-of-public-exams | Entrance exam preparation |
| Primary | /copy-of-11-entrance-exams | Strong foundations, explained properly |
| How It Works | /general-9 | Process before, during and after lessons |
| About | /about-5 | Daniel Harris, founder and teaching experience |
| Resources | /blog | Revision resource library |
| FAQ | /about-4 | Lesson, tutor and practical questions |
| Contact | /blank-2 | Tuition enquiry |
| Work With Us | /general-8 | Tutor opportunities |

The preview About page specifically profiles Daniel, so its closest equivalent is /about-5 rather than the broader /blank-1 service approach page. The 404 document has no canonical and is excluded from the sitemap.

scripts/canonical-map.json is the explicit source of truth. Local tests prove consistency with the dated map; they do not establish perpetual availability of external pages. Recheck destinations when production routes change.
