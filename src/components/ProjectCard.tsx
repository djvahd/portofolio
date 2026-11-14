import type { Project } from '../data/projects'
import { ImageWithFallback } from './ImageWithFallback'

function CardBody({ project }: { project: Project }) {
  return (
    <>
      <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-line">
        <ImageWithFallback
          src={project.image}
          alt={`${project.title} screenshot`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl md:text-3xl">{project.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {[project.role, project.year, project.note].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-3 max-w-xl text-muted">{project.description}</p>
          {project.caseStudy && (
            <dl className="mt-5 max-w-xl space-y-3 text-sm">
              {(
                [
                  ['Problem', project.caseStudy.problem],
                  ['What I built', project.caseStudy.built],
                  ['Result', project.caseStudy.result],
                ] as const
              ).map(([term, text]) => (
                <div key={term}>
                  <dt className="font-medium uppercase tracking-[0.15em] text-accent">{term}</dt>
                  <dd className="mt-1 text-muted">{text}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {project.liveUrl ? (
          <span
            aria-hidden="true"
            className="font-display text-3xl text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        ) : (
          <span className="shrink-0 text-sm text-muted">Live link coming soon</span>
        )}
      </div>
    </>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <CardBody project={project} />
        </a>
      ) : (
        <div>
          <CardBody project={project} />
        </div>
      )}
    </article>
  )
}
