import type { Project } from '../data/projects'
import { ImageWithFallback } from './ImageWithFallback'

function CardBody({ project }: { project: Project }) {
  return (
    <>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl">
        <ImageWithFallback
          src={project.image}
          alt={`${project.title} screenshot`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl md:text-4xl">{project.title}</h3>
          <p className="mt-1 text-sm text-muted">{`${project.role} · ${project.year}`}</p>
          <p className="mt-3 max-w-xl text-muted">{project.description}</p>
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
