import { steps } from '../data/services'
import { FadeUp } from './FadeUp'

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="process-title" className="font-display text-4xl md:text-6xl">
          How it works
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="font-display text-xl text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-lg">50% deposit, 2 revision rounds included.</p>
      </FadeUp>
    </section>
  )
}
