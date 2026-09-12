# AETERNA — Luxury Watch Showcase

## Overview

AETERNA is a cinematic, single-page 3D experience that showcases a luxury watch. It uses React Three Fiber, GSAP ScrollTrigger, and modern web technologies to create a scroll-driven interactive product demonstration. The site targets potential clients and employers, demonstrating advanced frontend and 3D development skills. It solves the problem of presenting a premium product in a memorable, interactive way that static images or video cannot achieve.

## Goals

1. Create a visually stunning 3D watch showcase that loads in under 3 seconds and runs at 60fps on desktop
2. Deliver a fully scroll-driven narrative with 4 distinct scenes (Reveal, Explore, Customize, Own)
3. Build an interactive exploded view where users can click and inspect individual watch parts
4. Implement real-time color customization with smooth 3D material transitions
5. Ensure full mobile responsiveness with touch controls and optimized performance

## Core User Flow

1. User lands on page — black screen with subtle loading
2. Watch parts assemble from darkness with dramatic spotlight
3. User scrolls — watch disassembles into exploded view
4. User drags to rotate exploded view, hovers to highlight parts
5. User clicks a part — part focuses, other parts blur, details panel appears
6. User scrolls — parts reassemble, color customization section appears
7. User clicks color swatches — watch parts change color with smooth transitions
8. User scrolls to final section — "Add to Cart" button appears
9. User clicks "Add to Cart" — shopping bag appears, watch flies into bag
10. Navbar shows bag icon with item count — experience complete

## Features

### 3D Watch Experience

- Realistic 3D watch model loaded from GLB file
- Scroll-driven assembly and disassembly animations
- Exploded view with 6 clickable part groups (strap, dial, bezel, crown, case back, connectors)
- Interactive rotation with drag controls (mouse and touch)
- Smooth camera transitions between scenes
- Dramatic lighting with spotlight effects

### Part Exploration

- Hover highlighting on individual parts
- Click to focus on specific part
- Background parts blur when one is selected
- Details panel showing part name, description, material, and specs
- ESC key or click elsewhere to close details

### Customization System

- 4 strap colors (Silver, Gold, Rose Gold, Black)
- 3 dial colors (White, Deep Blue, Black)
- 3 bezel colors (Silver, Gold, Rose Gold)
- Real-time material color transitions
- Specs panel updates based on selections

### Cart Interaction

- "Add to Cart" call-to-action button
- 3D shopping bag appears on click
- Watch flies into bag with arc animation
- Sound effects using Web Audio API
- Navbar bag icon updates (static, non-interactive)

### Responsive Design

- Desktop: Full 3D experience with side panels
- Mobile: Touch controls, bottom sheet details, stacked swatches
- Tablet: Hybrid layout with scaled UI elements

## Scope

### In Scope

- Single-page 3D experience with 4 scenes
- Watch model loading and display
- Scroll-driven animations (GSAP ScrollTrigger)
- Exploded view with part selection
- Details panel for 6 major part groups
- Color customization for 3 watch components
- Cart animation with 3D shopping bag
- Sound effects via Web Audio API
- Responsive design (desktop, tablet, mobile)
- Performance optimization (60fps target)

### Out of Scope

- User accounts or authentication
- Backend database or persistence
- Real payment processing
- Cart management (add/remove multiple items)
- Multiple watch models
- AR/VR integration
- Social media sharing
- Analytics or tracking
- Content management system

## Success Criteria

1. Page loads in under 3 seconds with watch visible within 5 seconds
2. All scroll animations work smoothly in both directions (scroll up and down)
3. User can click any of the 6 major part groups and see details
4. Color changes apply smoothly without page reload
5. "Add to Cart" animation completes with watch in bag
6. Works on desktop (Chrome, Safari, Firefox) and mobile (iOS Safari, Android Chrome)
7. No console errors or TypeScript errors
8. `npm run build` passes cleanly
9. Site is deployed and accessible via URL
