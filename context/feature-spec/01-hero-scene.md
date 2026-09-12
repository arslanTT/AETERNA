# Feature Spec: Scene 1 - Hero "The Reveal"

## Goal

Build the hero section where the watch assembles from darkness with dramatic spotlight, then rotates slowly with title "AETERNA" fading in. This is the first scene users experience.

## Context

This project already has:
- Next.js 14+ with App Router
- React Three Fiber and Drei installed
- GSAP with ScrollTrigger installed
- Zustand installed
- Tailwind CSS configured
- Watch model at `public/models/watch.glb`
- All context files in `context/` folder

Read `context/chatbot-prompt.md` for complete project background before building.

## What to Build

### 1. Main Page (`app/page.tsx`)

Modify the existing page to:
- Be a client component
- Render the hero scene
- Set up the scroll container
- Import and use the 3D scene component
- Handle smooth scrolling setup (Lenis)

The page should have:
- Full viewport height
- Dark background (#0a0a0a)
- No navbar yet (will be added later)
- No other sections yet

### 2. Watch Scene Component (`components/3d/WatchHero.tsx`)

Create a component that:
- Loads the watch model from `/models/watch.glb`
- Uses `useGLTF` from Drei
- Clones the scene before modifying
- Scales watch to 0.115
- Centers watch at origin (offset: 0, 0.22, 0.25)
- Stores original positions of all 8 part groups
- Separates parts slightly for initial state
- Exposes animation controls for GSAP

The component should have these states:
- Initial: Parts slightly separated
- Assembled: Parts at original positions
- Rotating: After assembly

### 3. Lighting Setup (`components/3d/HeroLights.tsx`)

Create lighting that includes:
- Ambient light (intensity 0.3)
- Main spotlight from above
- Spotlight position: (0, 10, 5)
- Spotlight target: watch center
- Spotlight angle: 30 degrees
- Spotlight penumbra: 0.5 (soft edges)
- Spotlight intensity starts at 0, animates to 2

### 4. Text Overlay (`components/ui/HeroText.tsx`)

Create text overlay with:
- Title "AETERNA" (Playfair Display font)
- Subtitle "Luxury Timepiece" (Inter font)
- Scroll indicator "Scroll to explore"
- All elements start invisible (opacity 0)
- Fade in via GSAP timeline

### 5. Watch Configuration (`lib/watchConfig.ts`)

Export constants for:
- Part group names (8 groups)
- Initial separation offsets
- Scale value (0.115)
- Center offset
- Animation timings
- Light intensity values

### 6. GSAP Timeline (in page or custom hook)

Create scroll-driven animation that:
- Pins the hero section
- Uses ScrollTrigger with scrub
- Timeline sequence:
  1. Spotlight fades in (0-20% scroll)
  2. Parts assemble (20-60% scroll)
  3. Light reaches full intensity (60-75% scroll)
  4. Watch starts rotating (75-85% scroll)
  5. Title fades in (85-100% scroll)
  6. Subtitle fades in after title

All animations must be bidirectional (scroll up reverses).

## Part Groups and Initial Offsets

```typescript
const PART_GROUPS = {
  FinalStrap1: { initialOffset: [0, -0.15, -0.15] },
  FinalStrap2: { initialOffset: [0, -0.15, 0.15] },
  strapClip: { initialOffset: [0, -0.25, 0] },
  Watch: { initialOffset: [0, 0.15, 0] },
  Men: { initialOffset: [0, 0, 0.1] },
  watchGlass: { initialOffset: [0, 0.25, 0] },
  watchBottom: { initialOffset: [0, -0.1, 0] },
  WatchshellTop: { initialOffset: [0, 0.05, 0] },
};