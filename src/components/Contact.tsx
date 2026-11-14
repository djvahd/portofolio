import { profile } from '../data/profile'
import { EnquiryForm } from './EnquiryForm'
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
        <p className="mt-4 max-w-xl text-lg">
          Tell me about your business and what the site should do. I&apos;ll reply with a few
          questions and a free homepage mock-up.
        </p>
        <p className="mt-2 text-muted">{profile.location}</p>
        <div className="mt-10 max-w-3xl">
          <EnquiryForm />
        </div>
        {profile.bookingUrl && (
          <a
            href={profile.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-lg underline decoration-line underline-offset-4 hover:decoration-fg"
          >
            Prefer to talk? Book a 15-minute call
          </a>
        )}
        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Or email me</p>
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="mt-2 inline-block font-display text-[clamp(1.25rem,6.2vw,1.875rem)] underline decoration-line underline-offset-8 transition-colors [overflow-wrap:anywhere] hover:decoration-fg"
            >
              {profile.email}
            </a>
          ) : (
            <p className="mt-2 font-display text-3xl text-muted">Email coming soon</p>
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
