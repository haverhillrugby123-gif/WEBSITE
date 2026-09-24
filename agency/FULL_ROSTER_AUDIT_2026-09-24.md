# Full Agency Roster Audit — 24/09/2026

Scope: `haverhillrugby123-gif/WEBSITE`, public GitHub Pages build. User explicitly requested a full-roster release challenge.

## Material findings and actions

### Design / Brand / UX
- **Finding:** The homepage proof row used generic trust language while stronger verified founder credentials were already available.
- **Action:** Replaced generic proof pills with concrete teaching experience, PGCE qualification and former Head of English experience.
- **Finding:** About-page decorative copy described the website design itself rather than the tutoring proposition.
- **Action:** Replaced it with pupil-facing teaching-process language.
- **Finding:** Contact CTA was labelled as a preview check, which created uncertainty at the conversion point.
- **Action:** Reframed the flow as a clear email handoff.

### Engineering / Frontend / Code review
- **Finding:** The public enquiry form validated input but intentionally stopped, leaving a functional dead end.
- **Action:** Added a progressive client-side `mailto:` handoff that prepares a structured enquiry in the visitor's email app.
- **Action:** Added input length limits and kept the flow dependency-free.
- **Action:** Kept the build static, lightweight and framework-free.

### Accessibility / Section 508 / QA
- **Finding:** The contact section used `aria-labelledby="ukot-form-title"` without a matching ID.
- **Action:** Added the missing heading ID.
- **Action:** Extended automated checks to validate `aria-labelledby`, `aria-controls` and label/field references.
- Existing skip links, visible focus states, reduced-motion handling, image alternatives and keyboard controls remain in place.

### Product / Sales / Conversion
- **Finding:** The highest-friction issue was that a completed enquiry could not lead anywhere.
- **Action:** The primary form now prepares a real enquiry email, while the visible direct-email fallback remains.
- **Action:** Added clearer privacy/reassurance copy at the moment of conversion.

### SEO / AEO / Content
- **Action:** Added `FAQPage` structured data based on visible FAQ content.
- **Action:** Strengthened visible authority signals without adding unsupported testimonials or outcome claims.
- **Decision:** Keep GitHub Pages `noindex,nofollow`, canonicalised to the Wix production domain, to avoid duplicate-site cannibalisation.

### Security / Privacy
- **Action:** No server-side collection, browser storage, analytics or tracking was introduced.
- **Action:** Enquiry values are URL-encoded before transfer to the visitor's email application.
- **Action:** Automated checks fail if common network/storage primitives are introduced into the enquiry script.
- **Residual limitation:** Email delivery depends on the visitor having an email application configured. The direct email address remains visible as fallback.

### Project / Research / Operations
- **Decision:** Use a minimal-change release rather than redesigning already-working pages.
- **Action:** Preserve GitHub Actions build/deploy gating and extend regression checks.
- **Evidence rule:** No new claims were added beyond known founder credentials and existing service descriptions.

## NOT_APPLICABLE specialist families
Academic research disciplines, finance/tax, game development, GIS, healthcare systems, blockchain, XR/spatial computing, China-market channels, e-commerce operations, paid-media buying and unrelated enterprise integrations have no material role in this static tutoring-site improvement. They introduce no justified changes.

## Release assessment
Website build remains a lightweight public preview. Material conversion, trust, accessibility-reference and AEO defects identified in this sweep were addressed. Wix production remains untouched.
