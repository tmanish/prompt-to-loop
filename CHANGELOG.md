# Changelog

All notable changes to prompt-to-loop are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org/).

## [Unreleased]

### Added

- `npx` installer for Claude Code: `npx github:tmanish/prompt-to-loop` copies the skill into `./.claude/skills` (or `~/.claude/skills` with `--global`). Supports `--dir`, `--force`, and `--help`. Pure Node, no dependencies, no npm publish required.

## [1.0.0] - 2026-07-01

Initial public release.

### Added

- Five-step flow: specification audit → elicitation → loop synthesis → execute or scaffold → output with iteration log
- Multi-choice elicitation: 3 questions default, up to 5 for sparse or high-variance prompts, one-word "go" skip that accepts all defaults
- Assertive default policy: vague answers get stated assumptions, not follow-ups, unless picking wrong would force a rebuild
- Effort scaling: question count and iteration cap scale with task size (small / medium / large)
- Ten task-type checklists with a scope + reference-frame + output-format fallback, plus hybrid-task guidance (dominant type + borrowed fields)
- Five loop archetypes with documented failure modes: Generate-Verify-Refine, Plan-Execute-Observe, Critic-Author, Reduce-to-green, Explore-Exploit
- Verification library across eight domains, ranked mechanical-first with an LLM-as-judge fallback (fixed 3–5 criterion rubric, flagged as weaker grounding)
- Environment-aware verification: only checks runnable in the current environment are selected
- Surface-agnostic elicitation: interactive picker where available, plain-text numbered fallback elsewhere (API, CLI)
- Execute-in-session vs. scaffold split, with a loop design spec embedded in scaffolds
- Honesty rule: iteration logs record only real, executed iterations and checks; single labeled critic pass when no check can execute
- Subjective-work termination: logs close with "converged against rubric" and invite user feedback as the real acceptance test
