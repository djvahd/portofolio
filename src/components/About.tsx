import { profile } from '../data/profile'
import { FadeUp } from './FadeUp'
import { ImageWithFallback } from './ImageWithFallback'

function SkillList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-[0.2em] text-muted">{title}</h3>
      <ul className="mt-3 space-y-1">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-6xl border-t border-line px-6 py-24"
    >
      <FadeUp>
        <h2 id="about-title" className="font-display text-4xl md:text-6xl">
          About
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <ImageWithFallback
            src="/images/profile.webp"
            alt={`Portrait of ${profile.name}`}
            className="aspect-[4/5] w-full rounded-2xl object-cover object-[50%_45%]"
          />
          <div>
            <p className="max-w-xl text-lg leading-relaxed">{profile.about}</p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <SkillList title="Dev" items={profile.skills.dev} />
              <SkillList title="Design" items={profile.skills.design} />
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  )
}
