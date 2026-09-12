# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow.
Context files define what to build, how to build it, and the
current state of progress. Always implement against these
specs — do not infer or invent behavior from scratch.

The project is a cinematic 3D watch showcase (AETERNA) with
4 scenes: Reveal, Explore, Customize, Own. Each scene is
broken into feature units with clear specs. Work through
units in order, verifying each before moving to the next.

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- Do not build multiple scenes in one implementation step
- Each unit should be testable independently

## When to Split Work

Split an implementation step if it combines:

- 3D scene logic and 2D UI changes
- Multiple unrelated scenes
- Scroll animations and user interactions
- Behavior not clearly defined in the context files
- Color customization and cart animation

If a change cannot be verified end to end quickly,
the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing
- Do not add features not in the project overview
- If part names in the watch model are unknown, document them in `context/watch-model.md` before using them

## Protected Files

Do not modify the following unless explicitly instructed:

- `public/models/*` — 3D model files
- `styles/globals.css` — global styles (unless adding CSS custom properties)
- Any third-party library internals
- `context/*.md` — context files (unless updating progress or resolving open questions)

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture.md`
- Storage model decisions → `architecture.md`
- Code conventions or standards → `code-standards.md`
- Feature scope → `project-overview.md`
- Progress state → `progress-tracker.md`
- Watch model part mapping → `context/watch-model.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. `npm run build` passes
5. No TypeScript errors
6. No console errors
7. Responsive at mobile and desktop
8. All verify-when-done conditions in the unit spec are met

## Working with the Watch Model

- The watch model is loaded once and cached
- Always clone the model before modifying materials or positions
- Save original positions before any disassembly
- Part names must be documented in `context/watch-model.md`
- Do not assume part names — verify with console logging
- Target model size: under 5MB (compress if larger)
- Target 60fps on desktop, 30fps on mobile

## Scene Implementation Order

Build scenes in this exact order:

1. Scene 1: Hero (reveal from darkness, assembly)
2. Scene 2: Explore (disassembly, exploded view, part selection)
3. Scene 3: Customize (color swatches, material changes)
4. Scene 4: Own (cart animation)

Each scene must be complete before starting the next.
