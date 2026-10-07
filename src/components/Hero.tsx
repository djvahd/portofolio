import { useRef } from 'react'
import { profile } from '../data/profile'
import { useInteractive } from '../hooks/useInteractive'
import { useSmoothMouse } from '../hooks/useSmoothMouse'

function HeroText({ role, heading }: { role: string; heading: boolean }) {
  const nameClass =
    'hero-name font-display text-[clamp(4.5rem,20vw,16rem)] font-semibold leading-[0.9] tracking-tight'
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-20">
      <p className="mb-4 text-sm uppercase tracking-[0.2em]">{profile.tagline}</p>
      {heading ? (
        <h1 className={nameClass}>{profile.name}</h1>
      ) : (
        <div className={nameClass}>{profile.name}</div>
      )}
      <p className="mt-6 font-display text-[clamp(1.5rem,4vw,3rem)] italic">{role}</p>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const interactive = useInteractive()
  useSmoothMouse(ref, interactive)

  const baseRole = interactive
    ? profile.roles.base
    : `${profile.roles.base} & ${profile.roles.reveal}`

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative overflow-hidden">
      <HeroText heading role={baseRole} />
      {interactive && (
        <div aria-hidden="true" className="spotlight-layer absolute inset-0">
          <HeroText heading={false} role={profile.roles.reveal} />
        </div>
      )}
    </section>
  )
}
