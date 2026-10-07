# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Adriel's single-page minimalist portfolio (light default + dark mode, cursor-spotlight hero) and make it deployable to Netlify.

**Architecture:** Static Vite + React + TypeScript SPA, one page, no router and no backend. All copy lives in `src/data/*`; theming is CSS variables switched by `data-theme` on `<html>`. The hero spotlight is a CSS `mask` driven by two CSS variables (`--mx`, `--my`) updated in a rAF loop, so there are no React re-renders per frame.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3.4, Framer Motion 11, Vitest 2 + Testing Library (jsdom).

## Global Constraints

- Working directory for every command: `D:\Project\Portfolio` (its own git repo; do NOT commit from `D:\Project`).
- Commits: plain messages, **no `Co-Authored-By` trailer** (user preference).
- Light theme: background `#F6F4EF`, text `#161616`, accent terracotta `#C2562B`.
- Dark theme: background `#0C0C0C`, text `#D7E2EA`, hero name gradient `linear-gradient(180deg,#646973,#BBCCD7)`.
- Fonts: Fraunces (headings), Inter (body), from Google Fonts.
- Projects (exactly four, in this order): Arsipia, Smart Odong Campus System, Photobooth, Harmoni Clothing. Each card links to a live URL only (no repo links). No per-project detail pages.
- Socials: GitHub, LinkedIn, Instagram, TikTok. No contact form.
- Hero spotlight: CSS `mask` + radial-gradient, eased in rAF; "Developer" base layer, "Designer" reveal layer. Disabled on touch devices and under `prefers-reduced-motion` (static "Developer & Designer").
- Tagline: "This is Me".
- All motion off under `prefers-reduced-motion`. Theme transition 300 ms.
- Theme: read `localStorage` key `theme`, else `prefers-color-scheme`; persist only when the user toggles.
- WCAG AA contrast in both themes; accent `#C2562B` is used only for large/decorative elements (it is 4.1:1 on the light background, so never for small text). Keyboard navigable; alt text on images.
- Responsive 360 px → wide desktop; Lighthouse performance and accessibility ≥ 90.
- Deploy: Netlify, `netlify.toml` build `npm run build`, publish `dist`.
- Out of scope: router, detail pages, CMS, contact form, blog, i18n.

---

## File Structure

```
Portfolio/
  .gitignore
  index.html
  netlify.toml
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  vite.config.ts
  public/images/profile.jpg            (user supplies later)
  public/images/projects/<slug>.webp   (user supplies later)
  src/
    main.tsx
    App.tsx
    App.test.tsx
    vite-env.d.ts
    styles/index.css, tokens.css
    test/setup.ts, matchMedia.ts
    data/profile.ts, projects.ts, data.test.ts
    hooks/useTheme.ts(+test), useInteractive.ts, useSmoothMouse.ts(+test)
    components/
      Nav.tsx, ThemeToggle.tsx(+test)
      Hero.tsx(+test)
      FadeUp.tsx
      ImageWithFallback.tsx(+test)
      Projects.tsx, ProjectCard.tsx(+test)
      About.tsx, Contact.tsx(+test)
```

---

### Task 1: Scaffold, tooling, tokens, Netlify config

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `netlify.toml`, `.gitignore`
- Create: `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/styles/index.css`, `src/styles/tokens.css`, `src/test/setup.ts`
- Create: `public/images/projects/.gitkeep`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `export default function App(): JSX.Element` (later tasks extend it); CSS variables `--bg --fg --muted --line --accent`; Tailwind colors `bg fg muted line accent`; fonts `font-display` (Fraunces) and `font-sans` (Inter); global vitest setup with `IntersectionObserver` stub.

- [ ] **Step 1: Write config files**

`package.json`:
```json
{
  "name": "portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^11.11.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.5.4",
    "vite": "^5.4.8",
    "vitest": "^2.1.1"
  }
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
```

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

`netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

`.gitignore`:
```
node_modules
dist
*.log
lighthouse.json
.DS_Store
```

`index.html` (the inline script sets the theme before first paint to avoid a flash):
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Adriel — Developer &amp; Designer</title>
    <meta
      name="description"
      content="Portfolio of Adriel: developer and designer building systems and interfaces."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <script>
      try {
        var t = localStorage.getItem('theme');
        if (t !== 'light' && t !== 'dark') {
          t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.dataset.theme = t;
      } catch (e) {}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`src/styles/tokens.css`:
```css
:root,
[data-theme='light'] {
  --bg: #f6f4ef;
  --fg: #161616;
  --muted: #5c5a55;
  --line: rgba(22, 22, 22, 0.14);
  --accent: #c2562b;
}

[data-theme='dark'] {
  --bg: #0c0c0c;
  --fg: #d7e2ea;
  --muted: #9aa7b0;
  --line: rgba(215, 226, 234, 0.16);
  --accent: #e0764a;
}
```

`src/styles/index.css`:
```css
@import './tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background: var(--bg);
  }
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background-color 300ms ease, color 300ms ease;
  }
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
  :focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  IntersectionObserverStub
```

`src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: Write the failing smoke test**

`src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

it('renders the owner name as the main heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1, name: 'Adriel' })).toBeInTheDocument()
})
```

- [ ] **Step 3: Install and run the test to verify it fails**

Run: `npm install` then `npm test`
Expected: FAIL — `Failed to resolve import "./App"` (App.tsx does not exist yet).

- [ ] **Step 4: Write minimal App**

`src/App.tsx`:
```tsx
export default function App() {
  return (
    <main>
      <h1>Adriel</h1>
    </main>
  )
}
```

- [ ] **Step 5: Verify test and build pass**

Run: `npm test` → Expected: `1 passed`.
Run: `npm run build` → Expected: build succeeds, creates `dist/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite react ts tailwind vitest and netlify config"
```

---

### Task 2: Content data (profile + projects)

**Files:**
- Create: `src/data/profile.ts`, `src/data/projects.ts`
- Test: `src/data/data.test.ts`

**Interfaces:**
- Produces:
  - `interface Social { label: 'GitHub' | 'LinkedIn' | 'Instagram' | 'TikTok'; url: string | null }`
  - `const profile: { name: string; tagline: string; roles: { base: string; reveal: string }; about: string; skills: { dev: string[]; design: string[] }; email: string | null; socials: Social[] }`
  - `interface Project { slug: string; title: string; role: string; year: string; description: string; image: string; liveUrl: string | null }`
  - `const projects: Project[]` (exactly four)
- `null` means "not filled in yet"; components render a graceful fallback.

- [ ] **Step 1: Write the failing test**

`src/data/data.test.ts`:
```ts
import { profile } from './profile'
import { projects } from './projects'

describe('profile', () => {
  it('has the required identity fields', () => {
    expect(profile.name).toBe('Adriel')
    expect(profile.tagline).toBe('This is Me')
    expect(profile.roles).toEqual({ base: 'Developer', reveal: 'Designer' })
    expect(profile.about.length).toBeGreaterThan(20)
  })

  it('lists the four socials in order, with null or https urls', () => {
    expect(profile.socials.map((s) => s.label)).toEqual([
      'GitHub',
      'LinkedIn',
      'Instagram',
      'TikTok',
    ])
    for (const s of profile.socials) {
      expect(s.url === null || s.url.startsWith('https://')).toBe(true)
    }
  })

  it('has skills for both dev and design', () => {
    expect(profile.skills.dev.length).toBeGreaterThan(0)
    expect(profile.skills.design.length).toBeGreaterThan(0)
  })

  it('has a null or valid email', () => {
    expect(profile.email === null || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.email)).toBe(true)
  })
})

describe('projects', () => {
  it('contains exactly the four projects in order', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'arsipia',
      'smart-odong',
      'photobooth',
      'harmoni-clothing',
    ])
  })

  it('has complete fields and valid image/link shapes', () => {
    for (const p of projects) {
      expect(p.title).not.toBe('')
      expect(p.role).not.toBe('')
      expect(p.year).toMatch(/^\d{4}$/)
      expect(p.description).not.toBe('')
      expect(p.image).toBe(`/images/projects/${p.slug}.webp`)
      expect(p.liveUrl === null || p.liveUrl.startsWith('https://')).toBe(true)
    }
  })

  it('has unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/data/data.test.ts`
Expected: FAIL — cannot resolve `./profile`.

- [ ] **Step 3: Implement**

`src/data/profile.ts`:
```ts
export interface Social {
  label: 'GitHub' | 'LinkedIn' | 'Instagram' | 'TikTok'
  url: string | null
}

export const profile: {
  name: string
  tagline: string
  roles: { base: string; reveal: string }
  about: string
  skills: { dev: string[]; design: string[] }
  email: string | null
  socials: Social[]
} = {
  name: 'Adriel',
  tagline: 'This is Me',
  roles: { base: 'Developer', reveal: 'Designer' },
  about:
    'I build systems and shape the interfaces people use to reach them. I like calm, considered work where the engineering and the design pull in the same direction.',
  skills: {
    dev: ['React', 'TypeScript', 'Google Apps Script', 'HTML & CSS'],
    design: ['UI / UX', 'Branding', 'Figma', 'Blender (3D)'],
  },
  email: null,
  socials: [
    { label: 'GitHub', url: null },
    { label: 'LinkedIn', url: null },
    { label: 'Instagram', url: null },
    { label: 'TikTok', url: null },
  ],
}
```

`src/data/projects.ts`:
```ts
export interface Project {
  slug: string
  title: string
  role: string
  year: string
  description: string
  image: string
  liveUrl: string | null
}

export const projects: Project[] = [
  {
    slug: 'arsipia',
    title: 'Arsipia',
    role: 'Developer & Designer',
    year: '2026',
    description: 'A digital archive that keeps records organized and easy to find.',
    image: '/images/projects/arsipia.webp',
    liveUrl: null,
  },
  {
    slug: 'smart-odong',
    title: 'Smart Odong Campus System',
    role: 'Developer & Designer',
    year: '2026',
    description: 'A smart campus shuttle (odong-odong) system for Jatinangor.',
    image: '/images/projects/smart-odong.webp',
    liveUrl: null,
  },
  {
    slug: 'photobooth',
    title: 'Photobooth',
    role: 'Developer & Designer',
    year: '2026',
    description: 'A web photobooth that captures, frames, and saves photos in the browser.',
    image: '/images/projects/photobooth.webp',
    liveUrl: null,
  },
  {
    slug: 'harmoni-clothing',
    title: 'Harmoni Clothing',
    role: 'Developer & Designer',
    year: '2026',
    description: 'An online storefront and brand presence for a clothing label.',
    image: '/images/projects/harmoni-clothing.webp',
    liveUrl: null,
  },
]
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/data/data.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "feat: add profile and project content data"
```

---

### Task 3: Theme system (hook, toggle, nav)

**Files:**
- Create: `src/test/matchMedia.ts`, `src/hooks/useTheme.ts`, `src/components/ThemeToggle.tsx`, `src/components/Nav.tsx`
- Test: `src/hooks/useTheme.test.tsx`, `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- Produces:
  - `mockMatchMedia(matches: (query: string) => boolean): void` (test helper, reused by later tests)
  - `type Theme = 'light' | 'dark'`; `getInitialTheme(): Theme`; `useTheme(): { theme: Theme; toggle: () => void }`
  - `ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void })` — accessible name `Switch to dark theme` / `Switch to light theme`
  - `Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void })` — links to `#work`, `#about`, `#contact`

- [ ] **Step 1: Write the test helper and failing tests**

`src/test/matchMedia.ts`:
```ts
export function mockMatchMedia(matches: (query: string) => boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
```

`src/hooks/useTheme.test.tsx`:
```tsx
import { act, renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'
import { mockMatchMedia } from '../test/matchMedia'

const systemDark = (dark: boolean) =>
  mockMatchMedia((q) => dark && q.includes('prefers-color-scheme: dark'))

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('useTheme', () => {
  it('falls back to the system preference when nothing is stored', () => {
    systemDark(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back to light when the system is not dark', () => {
    systemDark(false)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('prefers the stored value over the system preference', () => {
    systemDark(true)
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('does not persist anything until the user toggles', () => {
    systemDark(true)
    renderHook(() => useTheme())
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('toggle flips the theme, updates the attribute, and persists', () => {
    systemDark(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
```

`src/components/ThemeToggle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

it('offers dark when light and calls onToggle on click', async () => {
  const onToggle = vi.fn()
  render(<ThemeToggle theme="light" onToggle={onToggle} />)
  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
  expect(onToggle).toHaveBeenCalledTimes(1)
})

it('offers light when dark', () => {
  render(<ThemeToggle theme="dark" onToggle={() => {}} />)
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/hooks src/components/ThemeToggle.test.tsx`
Expected: FAIL — cannot resolve `./useTheme` / `./ThemeToggle`.

- [ ] **Step 3: Implement**

`src/hooks/useTheme.ts`:
```ts
import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'theme'

export function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // storage unavailable: fall through to system preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem(KEY, next)
      } catch {
        // ignore storage failures; the theme still changes for this session
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
```

`src/components/ThemeToggle.tsx`:
```tsx
import type { Theme } from '../hooks/useTheme'

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      className="rounded-full border border-line px-4 py-1.5 text-sm font-medium capitalize transition-colors hover:border-fg"
    >
      {next}
    </button>
  )
}
```

`src/components/Nav.tsx`:
```tsx
import { profile } from '../data/profile'
import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <a href="#top" className="font-display text-lg font-semibold">
          {profile.name}
        </a>
        <div className="flex items-center gap-4 sm:gap-8">
          <ul className="flex items-center gap-4 text-sm sm:gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-opacity hover:opacity-60">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run src/hooks src/components/ThemeToggle.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/test/matchMedia.ts src/hooks src/components/ThemeToggle.tsx src/components/ThemeToggle.test.tsx src/components/Nav.tsx
git commit -m "feat: add theme hook, toggle, and nav"
```

---

### Task 4: Hero with cursor spotlight

**Files:**
- Create: `src/hooks/useInteractive.ts`, `src/hooks/useSmoothMouse.ts`, `src/components/Hero.tsx`
- Modify: `src/styles/index.css` (append spotlight + dark gradient rules)
- Test: `src/hooks/useSmoothMouse.test.ts`, `src/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `profile` from Task 2; `mockMatchMedia` from Task 3.
- Produces:
  - `ease(current: number, target: number, k: number): number`
  - `useSmoothMouse(ref: RefObject<HTMLElement>, enabled: boolean, k?: number): void` — writes `--mx`/`--my` (px, relative to the element) on `ref.current`
  - `useInteractive(): boolean` — true only for a fine pointer AND no reduced-motion preference
  - `Hero()` — `<section id="top">`; interactive: base layer + `.spotlight-layer` (`aria-hidden="true"`) showing "Designer"; otherwise static "Developer & Designer"

- [ ] **Step 1: Write the failing tests**

`src/hooks/useSmoothMouse.test.ts`:
```ts
import { ease } from './useSmoothMouse'

describe('ease', () => {
  it('moves a fraction of the distance toward the target', () => {
    expect(ease(0, 10, 0.1)).toBeCloseTo(1)
    expect(ease(10, 0, 0.5)).toBeCloseTo(5)
  })

  it('stays put when already at the target', () => {
    expect(ease(7, 7, 0.3)).toBe(7)
  })
})
```

`src/components/Hero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { mockMatchMedia } from '../test/matchMedia'

it('renders a static combined role when the spotlight is disabled', () => {
  mockMatchMedia(() => false)
  const { container } = render(<Hero />)
  expect(screen.getByRole('heading', { level: 1, name: 'Adriel' })).toBeInTheDocument()
  expect(screen.getByText('This is Me')).toBeInTheDocument()
  expect(screen.getByText('Developer & Designer')).toBeInTheDocument()
  expect(container.querySelector('.spotlight-layer')).toBeNull()
})

it('renders the hidden Designer reveal layer when interactive', () => {
  mockMatchMedia(() => true)
  const { container } = render(<Hero />)
  expect(screen.getByText('Developer')).toBeInTheDocument()
  const layer = container.querySelector('.spotlight-layer')
  expect(layer).not.toBeNull()
  expect(layer).toHaveAttribute('aria-hidden', 'true')
  expect(layer).toHaveTextContent('Designer')
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/hooks/useSmoothMouse.test.ts src/components/Hero.test.tsx`
Expected: FAIL — cannot resolve `./useSmoothMouse` / `./Hero`.

- [ ] **Step 3: Implement hooks**

`src/hooks/useInteractive.ts`:
```ts
import { useEffect, useState } from 'react'

const QUERIES = ['(pointer: fine)', '(prefers-reduced-motion: no-preference)']

function compute(): boolean {
  return QUERIES.every((q) => window.matchMedia(q).matches)
}

export function useInteractive(): boolean {
  const [interactive, setInteractive] = useState(compute)

  useEffect(() => {
    const lists = QUERIES.map((q) => window.matchMedia(q))
    const update = () => setInteractive(compute())
    lists.forEach((l) => l.addEventListener('change', update))
    return () => lists.forEach((l) => l.removeEventListener('change', update))
  }, [])

  return interactive
}
```

`src/hooks/useSmoothMouse.ts`:
```ts
import { useEffect, type RefObject } from 'react'

export function ease(current: number, target: number, k: number): number {
  return current + (target - current) * k
}

export function useSmoothMouse(ref: RefObject<HTMLElement>, enabled: boolean, k = 0.12) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const target = { x: -9999, y: -9999 }
    const current = { x: -9999, y: -9999 }
    let seeded = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      if (!seeded) {
        current.x = target.x
        current.y = target.y
        seeded = true
      }
    }

    const tick = () => {
      current.x = ease(current.x, target.x, k)
      current.y = ease(current.y, target.y, k)
      el.style.setProperty('--mx', `${current.x}px`)
      el.style.setProperty('--my', `${current.y}px`)
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [ref, enabled, k])
}
```

- [ ] **Step 4: Implement Hero and styles**

`src/components/Hero.tsx`:
```tsx
import { useRef } from 'react'
import { profile } from '../data/profile'
import { useInteractive } from '../hooks/useInteractive'
import { useSmoothMouse } from '../hooks/useSmoothMouse'

function HeroText({ role, heading }: { role: string; heading: boolean }) {
  const nameClass =
    'hero-name font-display text-[clamp(4.5rem,20vw,16rem)] font-semibold leading-[0.9] tracking-tight'
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-20">
      <p className="mb-4 text-sm uppercase tracking-[0.2em]">{profile.tagline}</p>
      {heading ? (
        <h1 className={nameClass}>{profile.name}</h1>
      ) : (
        <div className={nameClass}>{profile.name}</div>
      )}
      <p className="mt-6 font-display text-[clamp(1.5rem,4vw,3rem)] italic">{role}</p>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const interactive = useInteractive()
  useSmoothMouse(ref, interactive)

  const baseRole = interactive
    ? profile.roles.base
    : `${profile.roles.base} & ${profile.roles.reveal}`

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative overflow-hidden">
      <HeroText heading role={baseRole} />
      {interactive && (
        <div aria-hidden="true" className="spotlight-layer absolute inset-0">
          <HeroText heading={false} role={profile.roles.reveal} />
        </div>
      )}
    </section>
  )
}
```

Append to `src/styles/index.css`:
```css
/* Hero spotlight: a masked terracotta layer that follows the cursor */
.spotlight-layer {
  background: var(--accent);
  color: #f6f4ef;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(
    circle 170px at var(--mx, -9999px) var(--my, -9999px),
    #000 0,
    #000 55%,
    transparent 100%
  );
  mask-image: radial-gradient(
    circle 170px at var(--mx, -9999px) var(--my, -9999px),
    #000 0,
    #000 55%,
    transparent 100%
  );
}

/* Dark mode: gradient hero name (cream inside the spotlight lens) */
[data-theme='dark'] .hero-name {
  background: linear-gradient(180deg, #646973 0%, #bbccd7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
[data-theme='dark'] .spotlight-layer .hero-name {
  background: none;
  -webkit-text-fill-color: currentColor;
}
```

- [ ] **Step 5: Run to verify they pass**

Run: `npx vitest run src/hooks/useSmoothMouse.test.ts src/components/Hero.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useInteractive.ts src/hooks/useSmoothMouse.ts src/hooks/useSmoothMouse.test.ts src/components/Hero.tsx src/components/Hero.test.tsx src/styles/index.css
git commit -m "feat: add hero with cursor spotlight"
```

---

### Task 5: Selected work (cards, image fallback, fade-up)

**Files:**
- Create: `src/components/FadeUp.tsx`, `src/components/ImageWithFallback.tsx`, `src/components/ProjectCard.tsx`, `src/components/Projects.tsx`
- Test: `src/components/ImageWithFallback.test.tsx`, `src/components/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: `Project`, `projects` from Task 2.
- Produces:
  - `FadeUp({ children, delay? }: { children: ReactNode; delay?: number })` — fade-up on scroll, passthrough under reduced motion
  - `ImageWithFallback({ src, alt, className? }: { src: string; alt: string; className?: string })` — renders `<img>`; on load error renders `<div role="img" aria-label={alt}>` placeholder
  - `ProjectCard({ project }: { project: Project })` — `<article>`; with `liveUrl` the whole card is a link (`target="_blank" rel="noopener noreferrer"`, accessible name contains the project title); without it renders no link and shows "Live link coming soon"
  - `Projects()` — `<section id="work">` with `<h2>Selected work</h2>` and four cards

- [ ] **Step 1: Write the failing tests**

`src/components/ImageWithFallback.test.tsx`:
```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { ImageWithFallback } from './ImageWithFallback'

it('renders an img, then a labelled placeholder after a load error', () => {
  render(<ImageWithFallback src="/missing.webp" alt="Cover of Arsipia" />)
  const img = screen.getByRole('img', { name: 'Cover of Arsipia' })
  expect(img.tagName).toBe('IMG')
  fireEvent.error(img)
  expect(screen.getByRole('img', { name: 'Cover of Arsipia' }).tagName).toBe('DIV')
})
```

`src/components/ProjectCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'
import type { Project } from '../data/projects'

const base: Project = {
  slug: 'demo',
  title: 'Demo Project',
  role: 'Developer',
  year: '2026',
  description: 'A demo description.',
  image: '/images/projects/demo.webp',
  liveUrl: null,
}

it('links out safely when a live URL exists', () => {
  render(<ProjectCard project={{ ...base, liveUrl: 'https://example.com' }} />)
  const link = screen.getByRole('link', { name: /Demo Project/ })
  expect(link).toHaveAttribute('href', 'https://example.com')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

it('shows a coming-soon note and no link without a live URL', () => {
  render(<ProjectCard project={base} />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('Live link coming soon')).toBeInTheDocument()
  expect(screen.getByText('Demo Project')).toBeInTheDocument()
  expect(screen.getByText('Developer · 2026')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/components/ImageWithFallback.test.tsx src/components/ProjectCard.test.tsx`
Expected: FAIL — cannot resolve the component modules.

- [ ] **Step 3: Implement**

`src/components/FadeUp.tsx`:
```tsx
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

`src/components/ImageWithFallback.tsx`:
```tsx
import { useState } from 'react'

export function ImageWithFallback({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-line font-display text-4xl text-muted ${className}`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
```

`src/components/ProjectCard.tsx`:
```tsx
import type { Project } from '../data/projects'
import { ImageWithFallback } from './ImageWithFallback'

function CardBody({ project }: { project: Project }) {
  return (
    <>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl">
        <ImageWithFallback
          src={project.image}
          alt={`${project.title} screenshot`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl md:text-4xl">{project.title}</h3>
          <p className="mt-1 text-sm text-muted">{`${project.role} · ${project.year}`}</p>
          <p className="mt-3 max-w-xl text-muted">{project.description}</p>
        </div>
        {project.liveUrl ? (
          <span
            aria-hidden="true"
            className="font-display text-3xl text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        ) : (
          <span className="shrink-0 text-sm text-muted">Live link coming soon</span>
        )}
      </div>
    </>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <CardBody project={project} />
        </a>
      ) : (
        <div>
          <CardBody project={project} />
        </div>
      )}
    </article>
  )
}
```

`src/components/Projects.tsx`:
```tsx
import { projects } from '../data/projects'
import { FadeUp } from './FadeUp'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-6 py-24">
      <FadeUp>
        <h2 id="work-title" className="font-display text-4xl md:text-6xl">
          Selected work
        </h2>
      </FadeUp>
      <div className="mt-12 flex flex-col gap-20">
        {projects.map((p) => (
          <FadeUp key={p.slug}>
            <ProjectCard project={p} />
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run src/components/ImageWithFallback.test.tsx src/components/ProjectCard.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/FadeUp.tsx src/components/ImageWithFallback.tsx src/components/ImageWithFallback.test.tsx src/components/ProjectCard.tsx src/components/ProjectCard.test.tsx src/components/Projects.tsx
git commit -m "feat: add selected work section with project cards"
```

---

### Task 6: About and Contact

**Files:**
- Create: `src/components/About.tsx`, `src/components/Contact.tsx`
- Test: `src/components/Contact.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Social` (Task 2); `FadeUp`, `ImageWithFallback` (Task 5).
- Produces:
  - `About()` — `<section id="about">` with `<h2>About</h2>`, photo (`/images/profile.jpg`, alt `Portrait of Adriel`), paragraph, two skill lists headed "Dev" and "Design"
  - `Contact()` — `<section id="contact">` with `<h2>Contact</h2>`; email as a `mailto:` link, or the text "Email coming soon" when null; each social is a link (`target="_blank"`, `rel="noopener noreferrer"`) when it has a URL, otherwise a muted non-link item with `title="Link coming soon"`

- [ ] **Step 1: Write the failing test**

`src/components/Contact.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

it('shows the contact heading and all four socials', () => {
  render(<Contact />)
  expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument()
  for (const label of ['GitHub', 'LinkedIn', 'Instagram', 'TikTok']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
})

it('does not render dead links for unset socials or email', () => {
  render(<Contact />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('Email coming soon')).toBeInTheDocument()
})
```
(With the default data, every URL and the email are `null`, so no links exist. When the owner fills them in, the second test must be updated or removed.)

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/Contact.test.tsx`
Expected: FAIL — cannot resolve `./Contact`.

- [ ] **Step 3: Implement**

`src/components/About.tsx`:
```tsx
import { profile } from '../data/profile'
import { FadeUp } from './FadeUp'
import { ImageWithFallback } from './ImageWithFallback'

function SkillList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-[0.2em] text-muted">{title}</h3>
      <ul className="mt-3 space-y-1">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="about-title" className="font-display text-4xl md:text-6xl">
          About
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <ImageWithFallback
            src="/images/profile.jpg"
            alt={`Portrait of ${profile.name}`}
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
          <div>
            <p className="max-w-xl text-lg leading-relaxed">{profile.about}</p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <SkillList title="Dev" items={profile.skills.dev} />
              <SkillList title="Design" items={profile.skills.design} />
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  )
}
```

`src/components/Contact.tsx`:
```tsx
import { profile } from '../data/profile'
import { FadeUp } from './FadeUp'

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="contact-title" className="font-display text-4xl md:text-6xl">
          Contact
        </h2>
        <div className="mt-10">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="break-all font-display text-3xl underline decoration-line underline-offset-8 transition-colors hover:decoration-fg md:text-5xl"
            >
              {profile.email}
            </a>
          ) : (
            <p className="font-display text-3xl text-muted md:text-5xl">Email coming soon</p>
          )}
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-lg">
          {profile.socials.map((s) => (
            <li key={s.label}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-60"
                >
                  {s.label}
                </a>
              ) : (
                <span className="text-muted" title="Link coming soon">
                  {s.label}
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-24 text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </FadeUp>
    </section>
  )
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/Contact.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/Contact.tsx src/components/Contact.test.tsx
git commit -m "feat: add about and contact sections"
```

---

### Task 7: Assemble the page, verify quality

**Files:**
- Modify: `src/App.tsx` (replace), `src/App.test.tsx` (replace)

**Interfaces:**
- Consumes: `useTheme`, `Nav`, `Hero`, `Projects`, `About`, `Contact`, `mockMatchMedia`.
- Produces: final `App` — skip link, `Nav`, `<main id="main">` containing the four sections in order.

- [ ] **Step 1: Replace the test with the integration test (failing)**

`src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import App from './App'
import { mockMatchMedia } from './test/matchMedia'

beforeEach(() => {
  localStorage.clear()
  mockMatchMedia(() => false)
})

it('renders every section in order', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1, name: 'Adriel' })).toBeInTheDocument()
  const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(h2s).toEqual(['Selected work', 'About', 'Contact'])
  expect(screen.getAllByRole('article')).toHaveLength(4)
})

it('offers a skip link and a theme toggle', () => {
  render(<App />)
  expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#work')
  expect(screen.getByRole('button', { name: /Switch to (dark|light) theme/ })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — only the minimal App exists (no sections, no skip link).

- [ ] **Step 3: Implement App**

`src/App.tsx`:
```tsx
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Nav theme={theme} onToggle={toggle} />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  )
}
```

- [ ] **Step 4: Run the full suite and build**

Run: `npm test`
Expected: all test files PASS (data 7, theme 5, toggle 2, ease 2, hero 2, image 1, card 2, contact 2, app 2 = 25 tests).
Run: `npm run build`
Expected: `tsc` clean, Vite build succeeds.

- [ ] **Step 5: Manual visual check (dev server)**

Run: `npm run dev` and open the printed URL. Confirm each item:
- Light theme loads by default (cream background) unless the OS is dark.
- Moving the mouse over the hero shows a terracotta lens revealing "Designer"; it trails the cursor smoothly.
- The toggle switches to dark: black background, gradient name, spotlight still works; reload keeps the choice.
- Four project cards show a letter placeholder (screenshots not added yet) and "Live link coming soon".
- At 360 px width (devtools): no horizontal scroll; nav fits on one row.
- Tab key: skip link appears first, focus rings are visible everywhere.
- With OS "reduce motion" on: hero shows "Developer & Designer" with no lens, no fade animations.

- [ ] **Step 6: Lighthouse check**

Run:
```bash
npm run build
npx vite preview --port 4173
```
In a second terminal:
```bash
npx lighthouse http://localhost:4173 --only-categories=performance,accessibility --chrome-flags="--headless" --quiet --output=json --output-path=./lighthouse.json
```
Expected: performance ≥ 90 and accessibility ≥ 90 in `lighthouse.json` (`categories.*.score` ≥ 0.9). If accessibility fails on contrast, change the offending text to `text-fg` / `text-muted` (never accent for small text). `lighthouse.json` is git-ignored; delete it afterwards.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: assemble portfolio page with skip link"
```

---

### Task 8: Deploy to Netlify

**Files:**
- Modify: none required (`netlify.toml` already created in Task 1)

**Interfaces:**
- Consumes: `netlify.toml` (build `npm run build`, publish `dist`).
- Produces: a live `https://<site-name>.netlify.app` URL.

Logging in to Netlify and creating the site are done by the owner (account credentials are never entered by the agent).

- [ ] **Step 1: Verify the production build locally**

Run: `npm run build && npx vite preview --port 4173`
Expected: site loads at `http://localhost:4173` identical to the dev check.

- [ ] **Step 2: Choose a deploy path (owner action)**

Option A, Git-connected (recommended; auto-deploys on push): push the repo to GitHub, then in Netlify choose "Add new site → Import an existing project" and pick the repo. Netlify reads `netlify.toml`; no other settings are needed.

Option B, CLI:
```bash
npx netlify-cli login
npx netlify-cli deploy --prod --dir=dist --create-site <site-name>
```
Expected: the CLI prints a "Website URL" ending in `.netlify.app`.

- [ ] **Step 3: Verify the live site**

Open the printed URL. Confirm: hero spotlight works, dark toggle works, no console errors, all four project cards render.

- [ ] **Step 4: Add assets and links later (owner action)**

- Photo → `public/images/profile.jpg`
- Screenshots → `public/images/projects/arsipia.webp`, `smart-odong.webp`, `photobooth.webp`, `harmoni-clothing.webp`
- Live URLs, email, and social URLs → replace the `null` values in `src/data/projects.ts` and `src/data/profile.ts` with `https://...` strings (email as `name@domain.tld`); then update `src/components/Contact.test.tsx` second test, which asserts the unset state.
- Accent color → change `--accent` in `src/styles/tokens.css`.

Then commit and push (or redeploy) to publish.

---

## Self-Review

**Spec coverage:** Visual tokens, fonts, motion, reduced-motion → Tasks 1, 4, 5. Stack and Netlify → Tasks 1, 8. Structure → File Structure and tasks. Hero spotlight (mask, rAF, touch/reduced-motion off) → Task 4. Selected work (four cards, live links, hover, no detail pages) → Task 5. About and Contact (photo, skills, email, four socials, no form) → Task 6. Theming (variables, storage, system fallback, 300 ms, toggle) → Tasks 1, 3. Placeholders with fallbacks (`null` + image fallback) → Tasks 2, 5, 6. Quality: Vitest for `useTheme` and data shape → Tasks 2, 3; responsive, WCAG, Lighthouse, manual checks → Task 7. Out of scope respected.

**Placeholder scan:** No TBD/TODO. `null` data values are intentional, spec-mandated fallbacks and are exercised by tests.

**Type consistency:** `Theme`, `useTheme`, `ThemeToggle`/`Nav` props, `Project`, `Social`, `profile` fields (`roles.base/reveal`, `skills.dev/design`), `ease`, `useSmoothMouse(ref, enabled, k)`, `ImageWithFallback` props, and `mockMatchMedia` match across all tasks.
