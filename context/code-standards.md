# Code Standards

## General

- Keep components small and single-purpose
- One component per file (except small helper components)
- Fix root causes, do not layer workarounds
- Do not mix 2D UI and 3D scene logic in one component
- Use meaningful names — no `Component1`, `temp`, `test`

## TypeScript

- Strict mode is required throughout the project
- Avoid `any` — use explicit interfaces or narrowly scoped types
- Define types/interfaces in the same file where they are used
- Use `type` for unions, `interface` for object shapes
- No unused variables or imports (ESLint will catch these)

## React / Next.js

- Use client components only when needed (3D, animations, state)
- `use client` directive at top of interactive components
- Use React Server Components for static content
- Keep 3D components isolated in `components/3d/`
- Keep UI components isolated in `components/ui/`
- Use Zustand for shared state — no prop drilling

## Three.js / React Three Fiber

- Load the watch model once — do not reload on re-render
- Always clone the model before modifying (never mutate original)
- Save original positions before disassembly
- Use `useMemo` for expensive 3D calculations
- Clean up Three.js resources in `useEffect` cleanup
- Use `useFrame` for per-frame animations (rotation, bobbing)
- Do not create new geometries inside `useFrame`

## Styling

- Use CSS custom property tokens from `ui-context.md`
- No hardcoded hex values in components
- Use Tailwind utility classes
- Follow the border radius scale defined in `ui-context.md`
- Dark theme only — no light mode styles

## State Management (Zustand)

- One store per concern (watch store, cart store, UI store)
- Keep stores small — do not create one giant store
- Use selectors to access specific state values
- Derive state where possible (do not store duplicate values)
- Action names should be clear: `setStrapColor`, `addToCart`

## Animations (GSAP)

- All scroll animations must be bidirectional (scrub)
- Use ScrollTrigger with relative positions (not absolute pixel values)
- Do not mix GSAP and CSS animations on the same element
- Kill ScrollTrigger instances on component unmount
- Use `gsap.timeline()` for multi-step animations

## File Organization

- `app/` — Next.js pages and routing
- `components/3d/` — Three.js scene, watch model, 3D components
- `components/ui/` — 2D UI components (buttons, panels, swatches)
- `lib/` — Utilities, constants, helper functions
- `store/` — Zustand stores
- `public/models/` — 3D model files (GLB format)
- `styles/` — Global styles, CSS custom properties

## Performance

- Target 60fps on desktop, 30fps minimum on mobile
- Do not use heavy post-processing on mobile
- Lazy load 3D components where possible
- Use `Suspense` for model loading
- Optimize textures (max 2048x2048 for mobile)
- Do not render 3D canvas when off-screen
