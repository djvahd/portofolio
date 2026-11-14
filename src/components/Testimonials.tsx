import { testimonials, type Testimonial } from '../data/services'
import { FadeUp } from './FadeUp'

/** Hidden until there is at least one real client quote in `data/services.ts`. */
export function Testimonials({ items = testimonials }: { items?: Testimonial[] }) {
  if (items.length === 0) return null
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="testimonials-title" className="font-display text-4xl md:text-6xl">
          What clients say
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {items.map((t) => (
            <figure key={`${t.name}-${t.business}`}>
              <blockquote className="font-display text-2xl italic leading-snug">
                {`“${t.quote}”`}
              </blockquote>
              <figcaption className="mt-4 text-muted">{`${t.name}, ${t.business}`}</figcaption>
            </figure>
          ))}
        </div>
      </FadeUp>
    </section>
  )
}
