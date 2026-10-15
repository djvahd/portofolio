import { profile } from '../data/profile'
import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

export function Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-semibold">
          {profile.name}
        </a>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>
    </header>
  )
}
