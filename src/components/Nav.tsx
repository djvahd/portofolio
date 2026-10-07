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
