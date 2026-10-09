---
name: thermo-nuclear-code-quality-review
description: Run an extremely strict maintainability review for abstraction quality, giant files, spaghetti-condition growth, and structural code health. Use for a thermo-nuclear code quality review, thermonuclear review, deep code quality audit, especially harsh maintainability review, abstraction review, or PR review focused on structural simplification. Do not use for ordinary style-only cleanup or cosmetic nits.
disable-model-invocation: true
---

# Thermo-Nuclear Code Quality Review

Use this skill for an unusually strict review of implementation quality, maintainability, abstraction quality, and codebase health. The goal is not to polish local code; it is to find structural simplifications that preserve behavior while making the implementation smaller, more direct, and easier to reason about.

Start from this prompt:

> Perform a deep code quality audit of the current branch's changes. Rethink how to structure or implement the changes to meaningfully improve code quality without impacting behavior. Improve abstractions, modularity, succinctness, and legibility. Reduce spaghetti code. Be ambitious when a clear restructuring path exists. Be extremely thorough and rigorous.

## Review Stance

- Be ambitious about structural simplification. Look for "code judo" moves that delete whole branches, helpers, modes, conditionals, layers, or concepts.
- Do not approve a PR merely because behavior appears correct. Working code that makes the codebase messier is still a problem.
- Prefer direct, boring, maintainable code over hacky, magical, or overly generic mechanisms.
- Treat maintainability regressions as real findings, not style preferences.
- Prefer a small number of high-conviction structural findings over a long list of cosmetic nits.

## Required Checks

For every meaningful change, ask:

- Is there a code-judo move that would make this dramatically simpler?
- Can the change be reframed so fewer concepts, branches, helper layers, flags, or modes are needed?
- Does this improve or worsen the local architecture?
- Did it add branching complexity where a better abstraction, state model, policy object, or dispatcher should exist?
- Did a cohesive module become more coupled, stateful, or harder to scan?
- Is the logic in the right file, package, service, component, or layer?
- Did the change push a file from under 1000 lines to over 1000 lines?
- Are repeated conditionals signaling a missing model or helper?
- Is the abstraction earning its keep, or is it a thin wrapper / pass-through?
- Did it introduce casts, `any`, `unknown`, avoidable optionality, or ad-hoc object shapes that obscure the real invariant?
- Did feature logic leak into a shared path, or implementation detail leak through an API?
- Is orchestration unnecessarily sequential, or can related updates leave state half-applied?

## Blocker-Level Smells

Treat these as presumptive blockers unless the author has a strong structural justification:

- A complicated implementation where a cleaner reframing could delete categories of complexity.
- A file crossing 1000 lines because of the PR, especially when new code can be decomposed.
- Weird one-off conditionals bolted into unrelated or already busy flows.
- Feature-specific checks scattered across shared/general-purpose code.
- One-off booleans, nullable modes, flags, fallback branches, or special cases that complicate control flow.
- Generic "magic" handling that hides simple data-shape assumptions.
- Thin wrappers, identity helpers, pass-through abstractions, or premature extension points.
- Cast-heavy, optionality-heavy, `any`/`unknown` contracts where a clearer typed boundary should exist.
- Duplicated knowledge or bespoke helpers where a canonical helper already exists.
- Logic placed in the wrong layer/package when a clear canonical home exists.
- Refactors that move complexity around without reducing the concepts a reader must hold.
- Temporary branches likely to become permanent debt.
- Partial-update flows that make state less atomic than necessary.
- Sequential async work that is obviously independent and would be clearer in parallel.

## Preferred Remedies

When you find a problem, push for remedies that materially reduce complexity:

- Delete a layer of indirection rather than polish it.
- Reframe the state model so conditionals disappear.
- Move ownership so the feature becomes a natural extension of an existing abstraction.
- Turn special-case logic into a simpler default flow with fewer exceptions.
- Extract a focused helper, pure function, subcomponent, or module when it removes real complexity.
- Split large files into smaller modules before they sprawl past healthy boundaries.
- Put feature-specific logic behind a dedicated abstraction instead of scattering checks.
- Replace condition chains with an explicit typed model, state machine, policy, or dispatcher.
- Separate orchestration from business logic.
- Collapse duplicate branches into one clearer flow.
- Delete wrappers that do not clarify the API.
- Reuse the canonical helper instead of creating a near-duplicate.
- Make type boundaries explicit so control flow gets simpler.
- Move logic to the package/module/layer that already owns the concept.
- Parallelize independent work when that also simplifies orchestration.
- Restructure related updates into a more atomic flow.

## Output Order

Lead with findings, ordered by severity:

1. Structural code-quality regressions.
2. Missed opportunities for dramatic simplification / code-judo restructuring.
3. Spaghetti or branching complexity increases.
4. Boundary, abstraction, and type-contract problems.
5. File-size and decomposition concerns.
6. Modularity and abstraction issues.
7. Legibility and maintainability concerns.

For each finding, include the file/line, the structural problem, why it matters, and the cleaner direction. Do not bury major maintainability issues behind minor readability comments.

## Approval Bar

Approve only when there is:

- no clear structural regression
- no obvious missed simplification that would materially reduce complexity
- no unjustified file-size explosion
- no spaghetti growth from special-case branching
- no hacky or magical abstraction that makes the code harder to reason about
- no unnecessary wrapper, cast, optionality, or type-contract churn
- no clear architecture-boundary leak or avoidable canonical-helper duplication
- no missed decomposition that would materially improve maintainability

If the bar is not met, leave explicit, actionable feedback and push for a cleaner structure.

## Review Language

Be direct, serious, and demanding about quality without being rude. Useful phrases:

- `this pushes the file past 1k lines. can we decompose this first?`
- `this adds another special-case branch into an already busy flow. can we move this behind its own abstraction?`
- `this works, but it makes the surrounding code more spaghetti. let's keep the behavior and restructure the implementation.`
- `this feels like feature logic leaking into a shared path. can we isolate it?`
- `this abstraction seems unnecessary. can we just keep the direct flow?`
- `why does this need a cast / optional here? can we make the boundary more explicit instead?`
- `this looks like a bespoke helper for something we already have elsewhere. can we reuse the canonical one?`
- `i think there's a code-judo move here that makes this much simpler. can we reframe this so these branches disappear?`
- `this refactor moves complexity around, but doesn't really delete it. is there a way to make the model itself simpler?`
