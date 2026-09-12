# UI Context

## Theme

Dark only. No light mode. The design language is a luxury
cinematic showcase — near-black backgrounds with dramatic
lighting. The watch is the hero. UI elements are minimal,
elegant, and fade in/out without distracting from the 3D
experience. Gold accents convey premium quality.

## Colors

| Role            | CSS Variable       | Value     |
| --------------- | ------------------ | --------- |
| Page background | `--bg-base`        | `#0a0a0a` |
| Surface         | `--bg-surface`     | `#111111` |
| Primary text    | `--text-primary`   | `#f5f5f5` |
| Muted text      | `--text-muted`     | `#a3a3a3` |
| Primary accent  | `--accent-primary` | `#c9a84c` |
| Border          | `--border-default` | `#262626` |
| Error           | `--state-error`    | `#ef4444` |
| Success         | `--state-success`  | `#22c55e` |

## Typography

| Role    | Font             | Variable         |
| ------- | ---------------- | ---------------- |
| UI text | Inter            | `--font-sans`    |
| Display | Playfair Display | `--font-display` |

## Border Radius

| Context           | Class        |
| ----------------- | ------------ |
| Inline / small UI | `rounded-md` |
| Cards / panels    | `rounded-lg` |
| Modals / overlays | `rounded-xl` |

## Component Library

Custom components built with Tailwind CSS. Components live
in `components/ui/`. No external component library. All
components are minimal, elegant, and use CSS custom
property tokens.

## Layout Patterns

- Hero: Full-viewport 3D canvas with centered text overlay
- Exploded view: Full-viewport 3D canvas with floating
  details panel on right (desktop) or bottom sheet (mobile)
- Customization: Full-viewport 3D canvas with color swatches
  below watch (desktop) or bottom (mobile)
- CTA: Full-viewport 3D canvas with centered button
- Navbar: Top bar, transparent background, no border
- Details panel: Side panel with backdrop blur

## Icons

Lucide React. Stroke-based icons only. Sizes:
h-4 w-4 for inline, h-5 w-5 for buttons.
No filled icons. No icon fonts.
