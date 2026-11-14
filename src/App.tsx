import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Leadership } from './components/Leadership'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { Projects } from './components/Projects'
import { ScrollProgress } from './components/ScrollProgress'
import { Services } from './components/Services'
import { Testimonials } from './components/Testimonials'
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
      <ScrollProgress />
      <Nav theme={theme} onToggle={toggle} />
      <main id="main">
        <Hero theme={theme} />
        {/* After the hero scroll the page stays in the opposite theme, all the way down */}
        <div data-theme={theme === 'light' ? 'dark' : 'light'} className="bg-bg text-fg">
          <Projects />
          <Services />
          <Process />
          <Testimonials />
          <Leadership />
          <About />
          <Contact />
        </div>
      </main>
    </>
  )
}
