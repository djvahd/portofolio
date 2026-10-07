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
