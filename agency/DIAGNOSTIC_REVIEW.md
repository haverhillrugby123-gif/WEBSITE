# Published diagnostic migration review

Reviewed 30 September 2026 by the independent QA/accessibility reviewer, consulting the original Agency Agents **Accessibility Auditor** profile. This is content and semantic-source review, not a screen-reader certification or a validated educational assessment.

## Scope and evidence

The four source bodies came from read-only published Wix content, with source identities and snapshot hashes retained in each article's provenance. No original publication dates, questions or existing prediction disclaimers were removed. Each local correction/addition records exact before/after text, rationale and review date in `provenance.editorialChanges`. Live Wix was not edited.

Counts verified: the Year 11 readiness checklist has 20 statements; GCSE Maths and 11+ have 12 questions each; GCSE English has 8 questions. The readiness tool already specifies one point per statement. Compact guidance now defines the diagnostic totals and treatment of multipart/open answers.

## Independent Maths recalculation

| Question | Calculation/check | Verified answer |
| --- | --- | --- |
| 1 | 72 × 4 / 100 | 2.88 |
| 2 | 375/1000, divide both by 125 | 3/8 |
| 3 | 80 + 80 × 15/100 | £92 |
| 4 | Collect 3a − a and 5b + 2b | 2a + 7b |
| 5 | (31 − 7)/4 | x = 6 |
| 6 | Distribute 3 across both terms | 3x + 12 |
| 7 | 350/5 × 2 | 140 g |
| 8 | (60 − 45)/60 × 100 | 25% |
| 9 | 180 − 48 − 67 | 65° |
| 10 | Area 8 × 5; perimeter 2 × (8 + 5) | 40 cm²; 26 cm |
| 11 | 2/(3 + 5 + 2), reduced | 1/5 |
| 12 | Test 4n + 1 for n = 1, 2, 3, 4 | 5, 9, 13, 17 |

All original Maths results were correct. The probability prompt now specifies random selection. One point for question 10 requires both results and units; equivalent probability fractions/decimals are accepted.

## Corrections and assessment limits

- 11+ anagrams accept SILENT, ENLIST, TINSEL, INLETS and other valid words using all six letters exactly once.
- The calf analogy accepts cow or bull; the question did not specify sex.
- Correcting “were” to “was” does not require replacing valid singular “their” with “his”.
- Alternative grammatical punctuation and evidence-supported inferences remain valid.
- English scoring accepts justified alternatives rather than requiring exact wording. Evaluation question 7 asks for an evidence type, since there is no storm passage to quote.
- “Secure” applies only to the sampled questions. The readiness high band now describes planning habits, not subject mastery.
- Every tool retains its original non-prediction caveat. Added guidance identifies bands as informal and rejects overall attainment or entrance-test predictions.

## Meaningful regression coverage for generation and browser QA

Verify all 20/12/12/8 items and answer counts survive rendering, including maths symbols, currency and units. Preserve the documented answer alternatives, explicit maximum scores and original caveats. The score ranges must cover every integer from zero to the maximum exactly once. Check links resolve to the migrated diagnostic routes. Render questions/answers in semantic lists and headings; any answer-disclosure control must work with Enter/Space and retain logical focus and reading order. Do not treat exact-string answer matching as an English marking scheme.

Real assistive-technology testing of the final rendered articles remains a separate verification item. No synthetic submission, email or publication was performed.
