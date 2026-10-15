import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Projects } from './components/Projects'
import { ScrollProgress } from './components/ScrollProgress'
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
      <Preloader />
      <ScrollProgress />
      <Nav theme={theme} onToggle={toggle} />
      <main id="main">
        <Hero theme={theme} />
        {/* After the hero scroll the page stays in the opposite theme, all the way down */}
        <div data-theme={theme === 'light' ? 'dark' : 'light'} className="bg-bg text-fg">
          <Projects />
          <About />
          <Contact />
        </div>
      </main>
    </>
  )
}
