import { useRef, useState } from 'react'
import { profile } from '../data/profile'
import { useInteractive } from '../hooks/useInteractive'
import { useSmoothMouse } from '../hooks/useSmoothMouse'
import { ContourBackground } from './ContourBackground'

function HeroPhoto({ revealed }: { revealed: boolean }) {
  const box =
    'absolute bottom-0 right-6 aspect-[900/1137] h-[72vh] md:right-[8%] md:h-[88vh]'
  // The wireframe is a mask, so its lines take the theme's background colour.
  return revealed ? (
    <div aria-hidden="true" className={`${box} wireframe-mask`} />
  ) : (
    <img
      aria-hidden="true"
      src="/images/hero-cutout.webp"
      alt=""
      className={`${box} object-contain`}
    />
  )
}

function HeroText({
  role,
  heading,
  revealed,
}: {
  role: string
  heading: boolean
  revealed: boolean
}) {
  const nameClass =
    'hero-name relative text-[clamp(4rem,15vw,12rem)] leading-[0.9] tracking-tight'
  const name = (
    <>
      <span className="font-display font-light">{profile.name.slice(0, -2)}</span>
      <span className="font-sans font-extrabold">{profile.name.slice(-2)}</span>
    </>
  )
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-20">
      <HeroPhoto revealed={revealed} />
      {heading ? (
        <h1 aria-label={profile.name} className={nameClass}>
          {name}
        </h1>
      ) : (
        <div className={nameClass}>{name}</div>
      )}
      <p className="relative mt-4 text-sm font-medium uppercase tracking-[0.2em]">
        {profile.tagline}
      </p>
      <p className="relative mt-6 font-display text-[clamp(1.5rem,4vw,3rem)] italic">{role}</p>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const interactive = useInteractive()
  const [locked, setLocked] = useState(false)
  useSmoothMouse(ref, interactive, 0.12, locked)

  const baseRole = interactive
    ? profile.roles.base
    : `${profile.roles.base} & ${profile.roles.reveal}`

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative overflow-hidden">
      <ContourBackground />
      <HeroText heading role={baseRole} revealed={false} />
      {interactive && (
        <>
          <div aria-hidden="true" className="spotlight-layer absolute inset-0">
            <HeroText heading={false} role={profile.roles.reveal} revealed />
          </div>
          <button
            type="button"
            aria-pressed={locked}
            onClick={() => setLocked((v) => !v)}
            className={`absolute bottom-6 right-6 z-20 rounded border px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
              locked ? 'border-fg bg-fg text-bg' : 'border-line bg-bg/70 backdrop-blur'
            }`}
          >
            {locked ? 'Unlock' : 'Tap to lock'}
          </button>
        </>
      )}
    </section>
  )
}
