import { projects, type Project } from '../data/projects'
import { FadeUp } from './FadeUp'
import { ProjectCard } from './ProjectCard'

function Grid({ items, testId }: { items: Project[]; testId: string }) {
  return (
    <div data-testid={testId} className="mt-10 grid gap-x-8 gap-y-16 md:grid-cols-2">
      {items.map((p, i) => (
        <FadeUp key={p.slug} delay={(i % 2) * 0.1}>
          <ProjectCard project={p} />
        </FadeUp>
      ))}
    </div>
  )
}

export function Projects() {
  const demos = projects.filter((p) => p.kind === 'demo')
  const other = projects.filter((p) => p.kind === 'other')
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-6 py-24">
      <FadeUp>
        <h2 id="work-title" className="font-display text-4xl md:text-6xl">
          Selected work
        </h2>
      </FadeUp>
      {demos.length > 0 && (
        <>
          <FadeUp>
            <h3 className="mt-10 text-sm uppercase tracking-[0.2em] text-muted">
              Websites for local businesses
            </h3>
          </FadeUp>
          <Grid items={demos} testId="demo-grid" />
        </>
      )}
      <FadeUp>
        <h3
          className={`${demos.length > 0 ? 'mt-20' : 'mt-10'} text-sm uppercase tracking-[0.2em] text-muted`}
        >
          Other work
        </h3>
      </FadeUp>
      <Grid items={other} testId="project-grid" />
    </section>
  )
}
