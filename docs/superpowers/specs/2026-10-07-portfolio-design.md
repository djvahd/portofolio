# Portfolio Website: Design Spec

Date: 2026-10-07 · Owner: Adriel

## Goal
Personal-branding portfolio for Adriel (dev + design mix). Minimalist, calm, comfortable to look at. Light theme by default with a dark mode.

## Visual direction
- **Light (default):** background `#F6F4EF`, text `#161616`, accent terracotta `#C2562B` (default, easy to change in `tokens.css`).
- **Dark:** background `#0C0C0C`, text `#D7E2EA`, hero heading uses gradient `linear-gradient(180deg,#646973,#BBCCD7)`.
- **Fonts:** Fraunces (headings), Inter (body). Loaded from Google Fonts.
- **Motion:** gentle fade-up on scroll, calm hovers. All motion off under `prefers-reduced-motion`.

## Stack and deploy
Vite + React + TypeScript + Tailwind + Framer Motion. Static site, no backend, no router.
Deploy: Netlify (`netlify.toml`: build `npm run build`, publish `dist`). Free subdomain `*.netlify.app` for now.

## Structure
```
Portfolio/
  netlify.toml
  src/
    components/  Nav, ThemeToggle, Hero, Spotlight, Projects, ProjectCard, About, Contact
    data/        profile.ts, projects.ts   (all copy lives here)
    hooks/       useTheme.ts, useSmoothMouse.ts
    styles/      tokens.css
  public/
    images/projects/   one screenshot per project (e.g. arsipia.webp)
    images/profile.jpg  photo for About (to be supplied)
```

## Sections (single page)
1. **Hero:** "Adriel" large, tagline "This is Me". Spotlight effect: a cursor-following soft circle (CSS `mask` + radial-gradient, eased via rAF) reveals the alternate layer, "Developer" → "Designer". On touch devices and under reduced motion: static hero, no effect.
2. **Selected work:** four cards in a two-column grid (one column below the `md` breakpoint), each with screenshot, title, role, year, and a "Live" link (opens in a new tab). Projects: **Arsipia, Smart Odong Campus System, Photobooth, Harmoni Clothing**. Hover: slight image zoom, arrow appears. No per-project detail pages in v1.
3. **About:** photo, short paragraph, two skill columns (Dev | Design).
4. **Contact:** email link plus GitHub, LinkedIn, Instagram links. No form.

## Theming
CSS variables in `tokens.css`; dark mode overrides them via `[data-theme="dark"]`. `useTheme` reads `localStorage`, falls back to `prefers-color-scheme`, sets the attribute on `<html>`. 300 ms color transition. Toggle in the nav.

## Content placeholders (to fill later)
Marked `TODO` in `data/`; the site renders with sensible fallbacks until they are filled.
- Per-project: live URL, screenshot, one-line description, role, year.
- Email address, GitHub / LinkedIn / Instagram URLs.
- About paragraph and skill lists.
- Profile photo: save as `public/images/profile.jpg`.
- Screenshots: save as `public/images/projects/<slug>.webp`.

## Quality and testing
- Responsive 360 px → wide desktop. Lighthouse ≥ 90.
- WCAG AA contrast in both themes, keyboard navigable, alt text on images.
- Vitest unit tests: `useTheme` (storage, system fallback, toggle) and project data shape (required fields present).
- Manual visual check: light, dark, mobile.

## Out of scope (v1)
Router / project detail pages, CMS, contact form, blog, i18n.
