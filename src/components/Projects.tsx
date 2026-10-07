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
