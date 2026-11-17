import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

const BAR_HEIGHT = 64
const TOGGLE_CLASS =
  'rounded-full border border-current px-4 py-1.5 text-sm font-medium capitalize'

/**
 * Just the name and the theme switch. Their colours follow the theme of whatever is behind them:
 * the hero's theme first, the opposite theme once the hero scroll has flipped it. From the
 * "Selected work" section on, the header becomes a semi-transparent bar.
 */
export function Nav({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [state, setState] = useState({ flipped: false, bar: false, lens: false })

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('top')
      const work = document.getElementById('work')
      let flipped = false
      let lens = false
      if (hero) {
        const range = hero.offsetHeight - window.innerHeight
        // The stage's backdrop is fully inverted a quarter of the way through the pinned scroll
        const flipAt = range > 0 ? range * 0.25 : hero.offsetHeight - BAR_HEIGHT
        flipped = window.scrollY >= flipAt
        // The hero's liquid lens is only on screen at the very start of the pinned scroll
        lens = window.scrollY < Math.max(range, 0) * 0.08 + 1
      }
      const bar = work ? work.getBoundingClientRect().top <= BAR_HEIGHT : false
      setState((s) =>
        s.flipped === flipped && s.bar === bar && s.lens === lens ? s : { flipped, bar, lens },
      )
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const behind: Theme = state.flipped ? (theme === 'light' ? 'dark' : 'light') : theme

  return (
    <>
      <header
        data-theme={behind}
        className={`fixed inset-x-0 top-0 z-50 text-fg transition-colors duration-300 ${
          state.bar
            ? 'border-b border-line bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-display text-lg font-semibold">
            {profile.name}
          </a>
          <ThemeToggle theme={theme} onToggle={onToggle} shows={behind} />
        </div>
      </header>

      {/* The hero's liquid, carried over the header: the same shape reveals an inverted copy */}
      {state.lens && (
        <div
          aria-hidden="true"
          data-theme={behind}
          data-lens-mirror
          className="lens-header fixed inset-x-0 top-0 z-[51] border-b border-transparent"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <span className="font-display text-lg font-semibold">{profile.name}</span>
            <span className={TOGGLE_CLASS}>{behind}</span>
          </div>
        </div>
      )}
    </>
  )
}
