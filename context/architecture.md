# Architecture Context

## Stack

| Layer         | Technology                      | Role                                |
| ------------- | ------------------------------- | ----------------------------------- |
| Framework     | Next.js 14+ (App Router)        | Page structure, routing, deployment |
| Language      | TypeScript                      | Type safety, developer experience   |
| 3D Engine     | Three.js + React Three Fiber    | 3D rendering, scene management      |
| 3D Helpers    | @react-three/drei               | Model loading, controls, helpers    |
| Animations    | GSAP + ScrollTrigger            | Scroll-driven animations, timelines |
| State         | Zustand                         | UI state (colors, cart, selection)  |
| Styling       | Tailwind CSS                    | 2D UI components, responsive design |
| Effects       | @react-three/postprocessing     | Bloom, blur, visual effects         |
| Smooth Scroll | Lenis                           | Buttery smooth scrolling            |
| Fonts         | Google Fonts (Playfair Display) | Luxury typography                   |

## System Boundaries

- `app/` — Next.js pages, routing, layout structure
- `components/3d/` — Three.js components, watch model, scene setup
- `components/ui/` — 2D UI components (buttons, panels, swatches)
- `lib/` — Utilities, helpers, constants (colors, part definitions)
- `store/` — Zustand stores (watch state, cart state, UI state)
- `public/models/` — 3D model files (watch.glb)
- `public/fonts/` — Local font files
- `styles/` — Global styles, Tailwind configuration

## Storage Model

- **In-Memory State (Zustand)**: Selected colors, cart state, selected part, scroll position
- **3D Model File**: `public/models/watch.glb` — static watch model
- **No Backend**: This is a frontend-only project
- **Browser LocalStorage**: Optional — could persist color selections (not in MVP)

## Auth and Access Model

- No authentication required
- Site is publicly accessible
- No user data stored
- No ownership or access control needed

## Invariants

1. Scroll position always controls animation state — animations must work bidirectionally
2. 3D scene must never block the main thread for more than 16ms
3. All 3D part positions must be saved before disassembly and restored on reassembly
4. The watch model must never be mutated directly — always clone before modifying
5. Color changes must be smooth transitions (not instant switches)
6. Mobile and desktop must share the same component tree — only layout/UI changes
7. No hardcoded scroll positions — use ScrollTrigger with relative positions
8. The 3D canvas must not render when off-screen (performance)
9. All part selections must be reversible (ESC, click elsewhere)
10. Sound effects must be user-initiated (no autoplay audio)
