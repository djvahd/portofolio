import { profile } from '../data/profile'
import { packages } from '../data/services'
import { FadeUp } from './FadeUp'

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="services-title" className="font-display text-4xl md:text-6xl">
          Packages &amp; prices
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Fixed prices, no hourly billing. AUD for Australia, SGD for Singapore.
        </p>
        <p className="mt-2 max-w-xl text-muted">{profile.speed}</p>
      </FadeUp>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {packages.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-line p-6 md:p-8">
              <h3 className="font-display text-2xl">{p.name}</h3>
              <p className="mt-4">
                <span className="font-display text-4xl">{p.aud}</span>
                {p.per && <span className="text-muted">{` ${p.per}`}</span>}
              </p>
              <p className="mt-1 text-sm text-muted">{`${p.sgd} · ${p.time}`}</p>
              <p className="mt-5">{p.summary}</p>
              <ul className="mt-5 space-y-2 text-muted">
                {p.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        ))}
      </div>
      <FadeUp>
        <a
          href={profile.cta.href}
          className="mt-10 inline-flex rounded-full bg-fg px-6 py-3 font-medium text-bg"
        >
          {profile.cta.label}
        </a>
      </FadeUp>
    </section>
  )
}
