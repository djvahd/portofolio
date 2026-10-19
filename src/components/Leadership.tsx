import { leadership, recognition } from '../data/leadership'
import { FadeUp } from './FadeUp'

export function Leadership() {
  return (
    <section
      id="leadership"
      aria-labelledby="leadership-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="leadership-title" className="font-display text-4xl md:text-6xl">
          Leadership &amp; recognition
        </h2>
        <ul data-testid="leadership-list" className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2">
          {leadership.map((r) => (
            <li key={`${r.title}-${r.org}`}>
              <h3 className="font-display text-xl md:text-2xl">{r.title}</h3>
              <p className="mt-1 text-sm text-muted">{r.period ? `${r.org} · ${r.period}` : r.org}</p>
              <p className="mt-3 max-w-xl text-muted">{r.note}</p>
            </li>
          ))}
        </ul>
        <h3 className="mt-16 text-sm uppercase tracking-[0.2em] text-muted">Recognition</h3>
        <ul data-testid="recognition-list" className="mt-4 space-y-2">
          {recognition.map((r) => (
            <li key={r.title}>
              {`${r.title}, ${r.year}`}
              {r.note ? <span className="text-muted">{`. ${r.note}`}</span> : null}
            </li>
          ))}
        </ul>
      </FadeUp>
    </section>
  )
}
