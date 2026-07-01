# Verification library

Verification patterns organized by domain. In step 3 of the flow, pick the strongest available mechanical check for the artifact being built. Use the LLM-as-judge fallback only when no mechanical option fits — and flag it in the iteration log as weaker grounding.

The hierarchy from strongest to weakest:

1. **Deterministic mechanical checks** (compile, lint, schema, exit code) — strongest
2. **Comparative mechanical checks** (screenshot diff, regex, count) — strong
3. **Heuristic mechanical checks** (statistical sanity, reading level) — medium
4. **LLM-as-judge with explicit rubric** — weakest acceptable; flag in log
5. **Subjective human review** — not a loop verification; out of scope

---

## Web (HTML / CSS / JS)

- `node --check <file.js>` — syntax check for inline or extracted JS
- `npx html-validate <file.html>` — HTML structure validation
- `axe-core` via headless browser (Playwright / Puppeteer) — accessibility check; default threshold: no critical issues
- Screenshot diff at multiple breakpoints (375 / 768 / 1440 typical for responsive)
- DOM assertion — specific element present, text matches, attribute equals
- Lighthouse score thresholds (performance / accessibility / best practices)
- Color-scheme meta check (when dark-mode lock is required)
- CSS validation via `css-validator`

---

## Content (text / markdown / docs)

- Word count within range
- Regex contains / excludes (required claims present, banned phrases absent)
- Required sections present (heading list matches expected)
- Reading level (Flesch-Kincaid or similar) within range
- Link validity check (no 404s in markdown links)
- Citation count meets minimum
- Required terms used at least N times (for SEO or topical coverage)
- Voice / tone — LLM-as-judge fallback when no mechanical signal exists; use a 3–5 criterion rubric

---

## Data (CSV / notebooks / pipelines)

- Schema check — columns present, types match expected
- Row count within range
- Null rate per column below threshold
- Statistical sanity — mean, stdev, range within expected bounds
- Output file format validity (parseable as CSV / JSON / Parquet)
- Deterministic reproduction — re-running on the same input gives the same output
- Join cardinality (no unexpected duplicates from joins)
- Date range check (no future dates in historical data, etc.)

---

## Agent / automation / script

- Exit code 0 on success
- Tool-call trace matches expected pattern (specific tools called in expected order)
- Log output contains required markers
- Side effects actually produced (file written, API called, message sent)
- Termination within budget (time, tokens, iteration count)
- Error handling triggered correctly on intentionally bad input
- No secrets leaked in logs / output

---

## Design (Figma / visual)

- Component count matches plan
- Layer naming convention followed (no "Rectangle 47")
- Auto-layout properties set on responsive frames
- Color tokens used (no raw hex values outside the token system)
- Responsive variants present (mobile / tablet / desktop)
- Visual regression via screenshot diff against a reference
- Accessibility — contrast ratios meet WCAG AA

---

## Code (any language)

- Compiles / passes interpreter syntax check
- Linter passes (ruff / eslint / etc.)
- Type check passes (`tsc --noEmit`, `mypy`, etc.)
- Unit tests pass
- Test coverage above threshold
- No TODOs / FIXMEs in production code paths
- Build succeeds end-to-end
- Smoke test on built artifact passes

---

## Slide deck / presentation

- Slide count matches plan
- Each slide has a title
- Image-to-text ratio per visual style spec
- All embedded charts render
- Font usage limited to spec'd set
- Speaker notes present (when required)

---

## API / backend service

- Endpoints return expected status codes on happy path
- Endpoints return expected error codes on bad input
- Schema validation of request and response bodies
- Auth flow works (unauthenticated request rejected, authenticated request accepted)
- Health check endpoint returns 200
- Response time below threshold under typical load
- No secrets in repo / committed config

---

## Mobile prototype

- Screen count matches plan
- All buttons / links lead somewhere (no dead-ends)
- Touch targets meet minimum size (44pt iOS / 48dp Android)
- Auth flow renders if specified
- Loading and error states present for screens that fetch data

---

## LLM-as-judge fallback (when nothing mechanical fits)

When no mechanical check exists for the relevant quality dimension, fall back to LLM-as-judge. Rules for using it well:

- Use 3–5 named criteria, not a single "is this good" question
- Each criterion gets a yes / no, not a numeric score (scores drift between rounds)
- Aggregate: all criteria must pass, or specify which subset must pass
- The rubric is fixed at the start of the loop — do not let the rubric evolve mid-loop
- Always flag this verification path in the iteration log as "weaker grounding (LLM-as-judge)"

**Example rubric** for "is this article draft good enough to publish":
1. Opens with a concrete claim, not a setup paragraph (yes / no)
2. Each section has a single argument (yes / no)
3. No unsupported numerical claims (yes / no)
4. Ends with a specific takeaway (yes / no)

Aggregate: all four must pass.

---

## Picking the right check

If multiple checks apply, prefer the one that:

1. Is fastest to run (sub-second is ideal, under 30s is fine)
2. Has clearest pass / fail signal (no ambiguity)
3. Catches the most likely failure mode for the current task

Combine 2–3 checks when no single check is sufficient. Example: HTML page = syntax check + accessibility + visual screenshot. All three must pass for verification to be green.
