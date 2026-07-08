# prompt-to-loop

A Claude skill that turns any vague build prompt into a running agentic loop, with a stated goal, mechanical verification, bounded iteration, and a publishable log.

You type *"build me a dashboard."* Instead of guessing at a one-shot answer, the skill asks a few sharp multiple-choice questions, picks an appropriate loop shape, runs it against a real verification check, and hands back the artifact plus a log of how it got there.

**New to loop engineering?** The [Loop Engineering Lab](https://tmanish.github.io/prompt-to-loop/) is an interactive primer on the concepts behind this skill: elicitation, verification grounding, convergence, and termination.

---

## How to use (simplest way)

No technical knowledge needed. Three steps:

1. **Download the skill file.** Grab [`dist/prompt-to-loop.skill`](dist/prompt-to-loop.skill) from this repo (or from the latest release on the Releases page). It downloads like any normal file.
2. **Upload it to Claude.** Open [claude.ai](https://claude.ai), go to **Customize > Skills** (in some versions this appears under **Settings > Capabilities > Skills**), click the **+** button, and upload the file you just downloaded. If the upload dialog only accepts `.zip` files, rename `prompt-to-loop.skill` to `prompt-to-loop.zip` first. The contents are identical.
3. **Make sure it's switched on.** The skill appears in your skills list with a toggle. Turn it on. Also check that **Code execution and file creation** is enabled in Settings > Capabilities, since skills need it to run.

That's it. You don't need to invoke the skill manually. Just ask Claude to build something ("build me a website for my bakery") and the skill activates on its own. To invoke it explicitly, type `/prompt-to-loop` followed by your request, or say "use the prompt-to-loop skill" in your message.

---

## The problem this solves

Most build prompts fail because they're underspecified, not because the model can't do the work. "Build a website for shoes" leaves a dozen decisions implicit: catalog size, aesthetic, output format, audience. A single-shot response just guesses at all of them.

prompt-to-loop closes that gap in two moves:

1. **Elicit before building.** A handful of multiple-choice questions extracts the decisions that actually shape the output, before a single line is written.
2. **Build inside a loop.** The work runs as a generate-verify-refine loop (or another archetype) against a concrete check, so the output converges on a stated goal instead of stopping at the first draft.

The result is more useful output and a transparent record of how it was produced.

---

## How it works

Five steps. Two are visible to you; three run silently.

1. **Specification audit** *(silent)*. The skill detects the task type and checks your prompt against a checklist of fields that matter for that type. If you've already specified most of them, it skips straight to building.
2. **Elicitation** *(visible)*. Three multiple-choice questions by default (up to five for very sparse prompts), each with a sensible default marked. Tap through in seconds.
3. **Loop synthesis** *(silent)*. Your answers become a measurable goal, a verification check, a loop archetype, a step plan, termination conditions, and an explicit state-carry list.
4. **Execute or scaffold** *(visible)*. Tasks that can be built directly are run in-session. Tasks needing external infrastructure produce a runnable scaffold instead.
5. **Output** *(silent synthesis, visible result)*. The artifact plus an iteration log showing what was built, what each verification check returned, and what changed between iterations.

The skill is assertive about defaults: a vague answer gets a sensible assumption (stated in the log), not a follow-up question, unless picking wrong would force a full rebuild, in which case it asks one targeted question.

**Don't want questions at all?** Reply "go" and the skill picks every default itself, listing each assumption in the log. Elicitation is an offer, never a toll.

**Effort scales with the task.** A one-paragraph bio gets one question and a light verify-refine pass; a full site or agent gets the complete treatment. Small tasks are never forced through big-task ceremony.

**The log never lies.** Only iterations that actually ran and checks that actually executed appear in the iteration log. If the artifact is right on the first pass, the log says one iteration. If no check can be executed in the current environment, the skill says so and does a single labeled critic pass instead of pretending to loop.

---

## Installation (all options)

The packaged skill is in [`dist/prompt-to-loop.skill`](dist/prompt-to-loop.skill).

**Claude apps (claude.ai, desktop, mobile):** Follow the three steps in [How to use](#how-to-use-simplest-way) above. ([Anthropic's skill docs cover the exact current path.](https://support.claude.com/en/articles/12512180-use-skills-in-claude))

**Claude Code (npx, one command):** Run the installer straight from GitHub — no clone, no npm publish required:

```bash
# Install into the current project (./.claude/skills)
npx github:tmanish/prompt-to-loop

# Install globally, available in every project (~/.claude/skills)
npx github:tmanish/prompt-to-loop --global
```

Other flags: `--dir <path>` for a custom skills directory, `--force` to overwrite an existing install, `--help` for the full list. After it finishes, restart Claude Code and invoke with `/prompt-to-loop` (or just ask Claude to build something and it triggers automatically).

**Claude Code (manual):** Place the `prompt-to-loop/` source folder in your skills directory (e.g., `.claude/skills/`). No zip needed; Claude Code reads skills from the filesystem. Every skill gets a slash command, so you can invoke it explicitly with `/prompt-to-loop` or let Claude trigger it automatically from your request.

**Claude API:** Upload the skill via the Skills API. See the [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).

**Build from source:** The `.skill` format is a zip of the skill folder. From the repo root:

```bash
zip -r dist/prompt-to-loop.skill prompt-to-loop/
```

Or use `package_skill.py` from Anthropic's [skill-creator](https://github.com/anthropics/skills) toolkit, which validates before packaging:

```bash
python -m scripts.package_skill path/to/prompt-to-loop dist/
```

---

## Surface support

The skill adapts to where it runs. In app surfaces with an interactive picker, the elicitation questions render as tappable buttons. Over the API, in Claude Code, or anywhere without that picker, the same questions are presented as a plain numbered list. You reply with one choice per question (e.g., `1b 2a 3a`). The elicitation policy is identical either way.

Verification adapts too: the skill only picks checks it can actually run in the current environment. If a check needs tooling that isn't present (for example, a headless browser for accessibility testing inside a chat surface), it drops to the next-best runnable check rather than specifying a verification it can't execute.

---

## Examples

### 1. Website

> **You:** build me a website for shoes

The skill asks: catalog size, aesthetic reference, output format. You pick *6-20 products / premium minimal / single-file HTML*. It sets the goal (responsive single-file page, 6-20 product cards, passes a syntax check, no critical accessibility issues), runs a generate-verify-refine loop, and returns the page plus a log showing it reached green in three iterations.

### 2. Article

> **You:** write me a piece on why stablecoins matter for cross-border payments

The skill asks: length, audience, format. You pick *medium (500-2000 words) / fintech professionals / markdown*. Because "good writing" has no mechanical check, it uses a critic-author loop with a fixed rubric: opens with a concrete claim, one argument per section, no unsupported numbers, specific takeaway. It iterates the draft against that rubric until all criteria pass. The log notes the verification was rubric-based rather than mechanical.

### 3. Dashboard

> **You:** make a dashboard for our support metrics

The skill asks: data source, key metrics, interactivity. You pick *hardcoded sample / ticket volume + resolution time + CSAT / filterable*. It builds the dashboard, verifies the charts render and the filter logic works, and returns it with a log of the checks that passed.

### 4. Agent (scaffold mode)

> **You:** build an agent that triages my inbox every morning

This needs infrastructure the skill can't run in a chat: a schedule, mail access, a runtime. So instead of executing, it asks the high-variance questions (trigger, inputs, side effects, tools), then produces a runnable scaffold with the goal, verification, and termination encoded in code, plus a step plan as functions. You take the scaffold and run it in your own environment, where it writes its own iteration log.

---

## Loop archetypes

The skill selects from five loop shapes based on the task. Each has documented failure modes so the loop can be caught going off-rails.

| Archetype | Best for |
|---|---|
| **Generate-Verify-Refine** | Most build tasks with a cheap, deterministic check (default) |
| **Plan-Execute-Observe** | Multi-step tasks where each result changes the next step |
| **Critic-Author** | Writing and design, where quality is subjective but articulable |
| **Reduce-to-green** | Debugging, or a sub-loop when the main loop keeps failing the same way |
| **Explore-Exploit** | "Find the best X" research-shaped tasks |

---

## Verification approach

Verification is ranked from strongest to weakest, and the skill always prefers the strongest option it can run:

1. Deterministic mechanical checks (compile, lint, schema, exit code)
2. Comparative mechanical checks (screenshot diff, regex, count)
3. Heuristic checks (statistical sanity, reading level)
4. LLM-as-judge with an explicit fixed rubric, flagged as weaker grounding in the log
5. Subjective human review, which is out of scope for an automated loop

When it falls back to an LLM-as-judge, it uses 3-5 named yes/no criteria fixed at the start of the loop, never a single "is this good" question and never a drifting rubric.

---

## What it doesn't do

The skill deliberately stays out of cases where a loop adds no value:

- Lookups and definitions
- Single-shot edits to a specific existing file
- Debugging an existing artifact
- One-shot generation with no meaningful success criterion (a single summary, one translation, a one-line answer)
- Prompts already specified richly enough to build directly

A "create" verb alone doesn't trigger it. There has to be a goal worth iterating against.

---

## Customization

The defaults are intentionally general, not tuned to any one person's workflow. If you're adapting this for your own team or stack, the three reference files are where to make changes:

- `references/task-checklists.md`: the fields the skill audits per task type. Add task types or adjust which fields it asks about.
- `references/archetypes.md`: the loop shapes and their selection guidance.
- `references/verification-library.md`: the verification patterns per domain. Add checks specific to your stack.

Changing defaults here propagates through the whole flow without touching the core logic in `SKILL.md`.

---

## Repository structure

```
.
├── README.md                         # This file
├── LICENSE                           # MIT
├── CHANGELOG.md                      # Release history
├── social-preview.png                # GitHub social preview image (1280x640)
├── docs/
│   └── index.html                    # Loop Engineering Lab (GitHub Pages site)
├── dist/
│   └── prompt-to-loop.skill          # Packaged skill, ready to upload
├── package.json                      # npx installer metadata (bin: prompt-to-loop)
├── bin/
│   └── install.js                    # `npx github:tmanish/prompt-to-loop` installer
└── prompt-to-loop/                   # Skill source
    ├── SKILL.md                      # Core flow and triggering logic
    └── references/
        ├── task-checklists.md        # Per-task-type audit fields
        ├── archetypes.md             # Five loop shapes + failure modes
        └── verification-library.md   # Verification patterns by domain
```

---

## License

MIT. See `LICENSE`.

## Contributing

Issues and pull requests welcome, particularly new task-type checklists, additional verification patterns, and real-world prompts that expose gaps in the elicitation logic.
