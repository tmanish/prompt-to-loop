---
name: prompt-to-loop
description: Convert any build, make, create, design, or develop prompt into a structured agentic loop with elicitation, verification grounding, and termination. Use this skill whenever a user asks to build, make, create, design, develop, generate, scaffold, or produce any artifact (website, dashboard, app, design, document, agent, script, deck) — even if they don't explicitly ask for a "loop." Triggers on phrases like "build me a...", "create a...", "design a...", "make me...", "develop a...", "help me build...", "I want to make...", or any task that involves producing an artifact with measurable success criteria. Especially valuable when the user prompt is sparse or underspecified. Do not use for lookups, definitions, single-shot edits to existing files, or debugging existing artifacts.
---

# prompt-to-loop

Turn any sparse build prompt into a running loop. The user types "build me a dashboard" — you turn that into an executed loop with a stated goal, mechanical verification, bounded iteration, and a publishable log.

## When to trigger

**Trigger when:** the user prompt is a request to produce a new artifact (build / make / create / design / develop / generate / scaffold) and the requirements are not already fully specified.

**Do not trigger when:**
- The prompt is a lookup or definition ("what is X")
- The prompt is a single-shot edit to a specific existing file ("change line 42 of foo.js")
- The prompt is debugging an existing artifact
- The prompt is a one-shot generation with no meaningful iteration — a single summary, one translation, a one-line answer, a single tweet. A "create" verb alone doesn't justify a loop; there must be a success criterion worth iterating against.
- The prompt is already richly specified (the task-type checklist comes back 80%+ filled in just from reading the prompt)

If genuinely unsure whether to trigger, ask one clarifying question: "Do you want me to scaffold this as a structured loop, or build it directly?"

## The flow

Five steps. Steps 1, 3, and 5 are silent (internal). Steps 2 and 4 are visible to the user.

### Step 1 — Silent specification audit

Read the user prompt. Detect the task type from this list:

- website / landing page
- dashboard / data viz
- mobile app prototype
- Figma file / design mockup
- slide deck / presentation
- document / report / article
- agent / automation / script
- API or backend service
- data analysis / notebook
- game / interactive demo

Open `references/task-checklists.md` and find the checklist for the detected task type. Each checklist has 5–8 fields. For each field, decide whether the user has already specified it (explicitly or by strong implication).

Count gaps. If 80%+ of fields are filled, skip to step 3 — no elicitation needed. Otherwise, rank gaps by leverage (how much picking wrong would cost in rebuild work) and pick the top 3.

**Scale effort to task size.** Not every build deserves the full ceremony:

| Task size | Questions | Iteration cap |
|---|---|---|
| Small (single short artifact: a bio, one chart, a simple form) | 0–1 | 2 |
| Medium (typical page, doc, dashboard, script) | 3 | 5 |
| Large (multi-section artifact, agent, app, deck) | 3–5 | 5 + sub-loops |

A one-paragraph bio doesn't need three questions and five iterations — one question and a verify-once-refine-once pass is proportionate. Over-ceremony on small tasks is the fastest way to make users abandon the skill.

**Hybrid tasks** ("a dashboard with an agent that refreshes it") span multiple checklists. Pick the dominant type — the one whose output the user will actually look at — and borrow the 2–3 highest-leverage fields from the secondary type. Don't force the task into a single checklist and lose the fields that matter.

If the task type doesn't match any of the 10, use the closest match and fall back to a scope + reference-frame + output-format question set.

### Step 2 — Elicitation

Ask the user a small set of multiple-choice questions. If an interactive multiple-choice tool is available (e.g., `ask_user_input_v0` in app surfaces), use it. If not — running via API, CLI, or any surface without that tool — present the same questions as a short numbered list in plain text, each option lettered, with the default marked, and ask the user to reply with one choice per question (e.g., "1b 2a 3a"). The policy below is identical either way.

**Rules:**

- **3 questions default. Up to 5 only when warranted.**
- Use 5 only when the prompt is very sparse (1–3 words total) OR the task type has high variance in output style (agents, games, custom apps)
- Each question: 2–4 options
- Mark one sensible option as the default in the question text (e.g., "Catalog size? (default: 6–20)")
- **Pick the default** as the option that serves the most common use case at the lowest risk — the choice a competent practitioner would assume if forced to guess
- **Always offer a zero-friction skip.** In the framing message before the questions, tell the user they can reply "go" (or tap through defaults) to skip elicitation entirely and let the skill decide everything. If they do, proceed with all defaults and state every assumption in the log. Users who want speed should never be forced through questions; users who want control get it in three taps.
- Order questions by how much they constrain downstream choices — the most decision-shaping question goes first
- Always include an "output format" question if it wasn't specified in the prompt; output format is the most commonly-missing field across task types

**Assertive-with-low-confidence-asks rule:**

If a user gives a vague answer, do NOT ask again by default. Pick a sensible default, state the assumption inline in the iteration log at step 5, and proceed.

**Exception:** ask one targeted follow-up when both of these are true:
1. Confidence in picking the right default is low
2. Picking wrong would force a full rebuild later (not just a tweak)

If picking wrong would only require a tweak, assume and state. If picking wrong would force a rebuild, ask one targeted follow-up.

### Step 3 — Silent loop synthesis

Combine the original prompt + elicitation answers into five components:

**Goal** — Rewrite as a measurable end state. Not "build a website for shoes" but "single-file HTML, 6–20 product cards, premium-minimal aesthetic, passes node --check, responsive at 375/768/1440, no critical axe-core issues."

**Verification** — Pick the mechanical check. Read `references/verification-library.md` for patterns by domain. Prefer mechanical (shell commands, regex, schema checks, exit codes, screenshot diff) over LLM-as-judge. Use LLM-as-judge only when no mechanical option exists, and flag it as weaker grounding in the iteration log. Only pick checks you can actually run in the current environment — if a check needs tooling that isn't available (e.g., a headless browser for axe-core inside a chat surface), drop to the next-best runnable check (syntax check + inspection of the rendered output + an LLM-as-judge rubric). A verification you can't execute produces a loop that can't close.

**Archetype** — Pick one from `references/archetypes.md`. Five available:
- Generate-Verify-Refine (default for most build tasks)
- Plan-Execute-Observe (multi-step where each step's result changes the next)
- Critic-Author (writing / design with subjective quality)
- Reduce-to-green (debugging — rarely for build tasks, but available)
- Explore-Exploit (research / find-me-X tasks)

**Step plan** — 3–7 atomic steps. Each step must be independently executable and observable. If you need more than 7, break into sub-loops.

**Termination** — Success condition: verification passes. Iteration cap: 5. Escape: if the same failure repeats twice, force a replan instead of attempting the same fix again.

**State carry** — Explicit list of what each iteration passes to the next. Most loops fail because state is implicit. Write it out: "Iteration N+1 receives: current artifact path, last verification output, list of fixes already attempted."

### Step 4 — Execute or scaffold

Pick based on task shape:

**Execute in-session when** the task produces a single artifact you can build directly in the current environment: single-file HTML, Figma file (via Figma MCP if available), Notion doc, slide deck, single Python/TS script, markdown document, single image / SVG.

**Produce scaffold when** the task needs external infrastructure: deployed apps, multi-file repos, API services, anything requiring a build step you cannot run in-session. Output a runnable Python or TypeScript file. Use Claude Agent SDK conventions when relevant. The scaffold must include: goal/verification/termination encoded as code, the step plan as functions, and iteration-log-writing built in.

**If genuinely ambiguous**, ask once: "Run this loop in-session, or give you a scaffold to run elsewhere?"

### Step 5 — Output

The output contract depends on which mode step 4 selected.

**In-session execution** — produce two things:

1. **The artifact** the user asked for
2. **The iteration log** (format below), recording each real iteration that ran

**Scaffold mode** — there are no in-session iterations yet, so the deliverable is different:

1. **The runnable scaffold file**
2. **The loop design spec** — goal, verification, termination, archetype, step plan, and state carry — written as a header comment block at the top of the scaffold and summarized briefly in chat. The scaffold writes its own iteration log when the user runs it; don't fabricate iterations that haven't happened.

**Iteration log format (in-session execution):**

```
## Loop summary

**Goal:** [restated measurable goal]
**Archetype:** [name] — [one-line why]
**Verification:** [check used; note if LLM-as-judge fallback was used]
**Assumptions made:** [any defaults picked from vague or missing answers]

### Iteration 1
- Action: [what was built or changed]
- Verification: [PASS / FAIL with specifics]
- Next: [what changes for next iteration, or "complete"]

### Iteration 2
[...]

**Result:** [N iterations / verification passed / iteration cap hit / replan triggered]
```

**Iteration log tone:** neutral, factual, third-person. Not chatty. The log is a publishable artifact in its own right — the user may include it in writeups, post-mortems, or articles.

**Honesty rule — no verification theater.** The log may only record iterations that actually happened and checks that were actually executed (a real tool call, script run, or rendered inspection). Never fabricate iteration entries, never pad the count to look thorough, and never report a check as PASS without running it. If the artifact is right on iteration 1, the log says 1 iteration — that's a good outcome, not a thin one. If the environment can't execute any check at all, drop the loop framing entirely: do one explicit critic pass against the rubric, label the log "single critic pass (no executable verification available)," and say so plainly. A fabricated loop is worse than no loop.

**Subjective work terminates with the user, not the loop.** For writing, design, and other rubric-verified tasks, the internal loop raises the floor — it does not certify the ceiling. Close the log with "converged against rubric" rather than "done," and invite one round of user feedback as the real acceptance test.

## Universal defaults

These are properties of well-designed loops, not style preferences. Bake them in regardless of user preferences:

- Mechanical verification preferred over LLM-as-judge
- Iteration cap scaled to task size (2 for small, 5 for medium/large); force a replan if the same failure repeats twice
- "Same failure" means the same check failing for the same underlying reason — not merely the same check failing
- State carry explicit, never implicit
- Each step atomic (independently executable)
- Iteration log on every in-session run; loop design spec on every scaffold
- Only real, executed checks appear in the log — never fabricated or padded iterations
- Verification grounding flagged as "weak" in the log when LLM-as-judge is used

## Failure modes

**Conflicting elicitation answers** — e.g., user picks "premium aesthetic" + "deploy as plain HTML email." Pick the option that most constrains downstream output, note the conflict in the iteration log, proceed.

**Ungroundable verification** — e.g., "build a beautiful website" with no mechanical signal of "beautiful." Fall back to LLM-as-judge with an explicit rubric of 3–5 named yes/no criteria. Flag in the iteration log as weaker grounding.

**Iteration cap hit** — output the best version achieved, log what failed at each iteration, suggest a replan with a different archetype or different decomposition. Do not silently fail or hide the cap.

**Task outside the 10 known types** — use the scope + reference-frame + output-format fallback question set. If still unclear after elicitation, ask one targeted question rather than guessing.

**Prompt isn't actually a build task** — if detected during step 1 (the prompt is a lookup, debugging request, or single-shot edit), don't trigger this skill. Respond normally instead.

**Elicitation gets ignored / user just says "go"** — proceed with sensible defaults for each unanswered question, state every assumption made in the iteration log so the user can see what was assumed.

## Reference files

- `references/task-checklists.md` — Per-task-type checklist fields used in step 1's audit
- `references/archetypes.md` — Five loop archetypes with failure modes and selection guidance
- `references/verification-library.md` — Verification patterns organized by domain

## Example walkthrough

**User prompt:** "build me a website for shoes"

**Step 1 (silent audit):** Task type = website. Checklist fields: catalog count, primary purpose, aesthetic reference, audience, voice, tech stack, deployment target, breakpoints. Filled in from prompt: 0/8. Gaps ranked by leverage: aesthetic reference, catalog count, output format/tech stack.

**Step 2 (elicitation, 3 questions):**

1. Catalog size? (1–5 / 6–20 [default] / 20+ / single hero product)
2. Aesthetic reference? (premium minimal like Common Projects / mass-market like Nike / niche indie / no reference — pick something modern [default])
3. Output format? (single-file HTML [default] / multi-file repo / Figma mockup)

**User taps:** 6–20 / premium minimal / single-file HTML.

**Step 3 (silent synthesis):**
- Goal: single-file HTML, 6–20 product cards, premium-minimal aesthetic, passes node --check on inline JS, responsive at 375/768/1440, no critical axe-core issues.
- Archetype: Generate-Verify-Refine.
- Verification: node --check + axe-core (headless) + manual visual check at 3 breakpoints.
- Step plan: scaffold IA → product data array → hero section → product grid → typography pass → final polish.
- Termination: all three checks pass, or 5 iterations.
- State carry: file path, last verification output, fixes already attempted.

**Step 4:** Execute in-session (single-file HTML is in-session-doable).

**Step 5:** Output `shoes-website.html` + iteration log showing 3 iterations to green.
