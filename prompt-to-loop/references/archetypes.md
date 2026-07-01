# Loop archetypes

Five archetypes. Pick one in step 3 of the flow based on task shape. Each has a known failure mode — knowing the failure mode helps catch the loop going off-rails during execution.

---

## 1. Generate-Verify-Refine

**Shape:** Draft → check → revise → check → revise → ... until check passes or cap hit.

**Best for:** Most build tasks where there is a cheap, deterministic verification signal. Default choice when in doubt.

**Examples:** Single-file HTML page (verification = `node --check` + axe-core), CSS animation (verification = browser screenshot diff), data cleaning script (verification = schema check on output).

**Failure modes:**
- **Verification too loose** — passes mediocre output. Symptom: loop terminates after 1 iteration but the artifact isn't actually good. Fix: tighten the rubric, add more checks.
- **Verification too strict** — never passes. Symptom: hits iteration cap repeatedly. Fix: relax check or split into sub-loops with intermediate checks.
- **No state carry on failures** — model keeps making the same mistake. Fix: explicitly pass the list of failed attempts into the next iteration's context.

---

## 2. Plan-Execute-Observe (ReAct shape)

**Shape:** Plan next step → execute → observe result → revise plan → execute next step → ...

**Best for:** Multi-step tasks where each step's outcome changes what the next step should be. The plan is not knowable upfront.

**Examples:** Agent that researches a topic by searching, reading, then searching follow-ups. Data pipeline where each transformation depends on the previous output's shape. Debugging where each test result narrows the search.

**Failure modes:**
- **Plan can't adapt to surprising observations** — model keeps following the original plan even when reality diverges. Fix: at each observation, explicitly ask "does this change the plan?" before executing the next step.
- **Observation step is too thin** — model doesn't actually read the result before moving on. Fix: require an explicit summary of what was observed before planning the next step.
- **Plan grows unboundedly** — loop never converges. Fix: track depth, force a "wrap up or commit" decision at depth N.

---

## 3. Critic-Author

**Shape:** Two roles. Generator (author) produces an output. Critic scores it against an explicit rubric. Generator revises against the critique. Repeat.

**Best for:** Writing, design, copy, and other subjective work where quality criteria can be articulated but not mechanically checked. Also good when verification needs more nuance than a pass/fail.

**Examples:** Article draft (critic checks voice, structure, factual claims). Logo design exploration (critic checks against brand criteria). Cover letter (critic checks tone, fit, claims).

**Failure modes:**
- **Critic and author drift** — critic gets harsher each round, or author gets defensive and stops responding to critique. Fix: pin the rubric upfront and don't let it evolve mid-loop.
- **Critic games the rubric** — surfaces nitpicks instead of substantive issues once the output is good. Fix: cap critic at 3 issues per round; if all 3 are nitpicks, terminate.
- **Author games the rubric** — generates output optimized for rubric, not the underlying goal. Fix: include "does this actually solve the user's problem?" as a meta-criterion.

---

## 4. Reduce-to-green

**Shape:** Reproduce the problem → isolate the cause → fix → verify green → repeat if regression.

**Best for:** Debugging shape. Fixing broken artifacts. Bisection when isolation is hard.

**Examples:** Test suite has failures, find which change broke each. CSS layout broke, isolate which rule. API integration started returning 500s, find what changed.

**Note:** Reduce-to-green is rare for *build* tasks (the topic of this skill is creating new artifacts, not fixing existing ones), but it can appear in build tasks at sub-loop level — e.g., the main loop is Generate-Verify-Refine, but when verification fails repeatedly on the same issue, drop into Reduce-to-green to isolate the cause.

**Failure modes:**
- **Bug is intermittent** — green/red flips between iterations randomly. Fix: run verification multiple times before declaring green.
- **Test suite is wrong** — chasing a phantom bug. Fix: validate the test against a known-good input first.
- **Isolation step is skipped** — model jumps to fixes without finding the actual cause. Fix: require an explicit "the cause is X" statement before applying any fix.

---

## 5. Explore-Exploit

**Shape:** Generate many candidates broadly → score them → take top-k → generate more around the top-k → score → narrow further.

**Best for:** Research-shaped tasks. "Find me X" or "what's the best Y" prompts. Tasks where the answer space is large and the right answer is not obvious upfront.

**Examples:** Find the right competitive positioning angle. Pick a color palette from a large space. Find the right architecture among several candidates.

**Failure modes:**
- **Scoring is noisy** — top-k changes every round, never converges. Fix: rescore the same candidates twice, use the average; or move to a tournament structure.
- **Exploration space too large** — random sampling never finds good candidates. Fix: seed with a few hand-picked candidates that you know are decent, then expand around them.
- **Premature exploitation** — narrows to top-k too fast, misses better options. Fix: keep exploration breadth wide for at least the first two rounds.

---

## Selection guidance

| Task feels like... | Use archetype |
|---|---|
| "Build / make this artifact" with a clear check | Generate-Verify-Refine |
| "Do this multi-step task where the next step depends on the last result" | Plan-Execute-Observe |
| "Write / design something where quality is subjective" | Critic-Author |
| "Fix this broken thing" or sub-loop when GVR keeps failing the same way | Reduce-to-green |
| "Find the best X among many possibilities" | Explore-Exploit |

When in doubt, default to **Generate-Verify-Refine** — it's the most common shape for build tasks and the easiest to reason about.
