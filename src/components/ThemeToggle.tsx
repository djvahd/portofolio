import type { Theme } from '../hooks/useTheme'

/**
 * `shows` overrides the visible word (by default the theme a click switches to), so the label
 * can name the theme of the section it sits on while a click still switches the page theme.
 */
export function ThemeToggle({
  theme,
  onToggle,
  shows,
}: {
  theme: Theme
  onToggle: () => void
  shows?: Theme
}) {
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      className="rounded-full border border-current px-4 py-1.5 text-sm font-medium capitalize"
    >
      {shows ?? next}
    </button>
  )
}
