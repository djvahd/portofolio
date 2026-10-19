import { profile } from '../data/profile'
import { FadeUp } from './FadeUp'

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="contact-title" className="font-display text-4xl md:text-6xl">
          Contact
        </h2>
        <div className="mt-10">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="font-display text-[clamp(1.25rem,6.2vw,1.875rem)] underline decoration-line underline-offset-8 transition-colors [overflow-wrap:anywhere] hover:decoration-fg md:text-5xl"
            >
              {profile.email}
            </a>
          ) : (
            <p className="font-display text-3xl text-muted md:text-5xl">Email coming soon</p>
          )}
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-lg">
          {profile.socials.map((s) => (
            <li key={s.label}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-60"
                >
                  {s.label}
                </a>
              ) : (
                <span className="text-muted" title="Link coming soon">
                  {s.label}
                </span>
              )}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-lg">
          {profile.cv.map((c) => (
            <li key={c.label}>
              <a
                href={c.url}
                download
                className="underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-24 text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </FadeUp>
    </section>
  )
}
