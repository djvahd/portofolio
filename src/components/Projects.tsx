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
      <div data-testid="project-grid" className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {projects.map((p, i) => (
          <FadeUp key={p.slug} delay={(i % 2) * 0.1}>
            <ProjectCard project={p} />
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
