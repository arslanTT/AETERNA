<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Application Building Context

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, canvas design, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps
7. `context/watch-model.md` — 3D watch model reference, part groups, materials, and animation specs

## Feature Specs

When building a specific feature or scene, first read the relevant spec file from `feature-specs/` folder:

- `feature-specs/01-hero-scene.md` — Scene 1: Hero "The Reveal"
- Additional specs will be added for subsequent scenes

Read the feature spec BEFORE writing any code for that feature. The spec contains detailed build instructions, file requirements, and verification criteria.

## Update Rules

- Update `context/progress-tracker.md` after each meaningful implementation change
- If implementation changes architecture, scope, or standards, update the relevant context file before continuing
- Do NOT modify files in `feature-specs/` unless explicitly instructed
- Do NOT modify files in `context/` unless updating progress or resolving documented open questions

## Build Order

Work through scenes in this exact order:

1. Scene 1: Hero (feature-specs/01-hero-scene.md)
2. Scene 2: Explore (spec to be added)
3. Scene 3: Customize (spec to be added)
4. Scene 4: Own (spec to be added)

Do NOT start work on a later scene before the current scene is complete and verified.

## Critical Rules

- Never mutate the original watch model — always clone before modifying
- Save original positions before any disassembly
- Scroll animations must work bidirectionally (scroll up reverses)
- Use CSS custom properties from `ui-context.md` — no hardcoded hex values
- All 3D components must be client components
- Target 60fps on desktop, 30fps minimum on mobile
- Clean up GSAP ScrollTrigger instances on unmount
- Do not create new projects or config files — work within existing structure