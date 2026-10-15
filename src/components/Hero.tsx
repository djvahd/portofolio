import { useRef, useState } from 'react'
import {
  easeInOut,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { profile } from '../data/profile'
import { useInteractive } from '../hooks/useInteractive'
import { useSmoothMouse } from '../hooks/useSmoothMouse'
import type { Theme } from '../hooks/useTheme'
import { ContourBackground } from './ContourBackground'
import { Signature, StageBackdrop, useHeroGeometry } from './ScrollStage'

// Where the hero draws the portrait: bottom right, as a share of the screen. The lens's
// wireframe copy uses the same box; the real portrait is moved by useHeroGeometry.
const WIREFRAME_BOX =
  'absolute bottom-0 right-[4%] aspect-[900/1137] h-[72%] md:right-[8%] md:h-[88%]'

function HeroText({ role, heading }: { role: string; heading: boolean }) {
  const nameClass =
    'hero-name relative text-[clamp(4rem,15vw,12rem)] leading-[0.9] tracking-tight'
  const name = (
    <>
      <span className="font-display font-light">{profile.name.slice(0, -2)}</span>
      <span className="font-sans font-extrabold">{profile.name.slice(-2)}</span>
    </>
  )
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pt-20">
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

/**
 * The hero is a pinned stage inside a tall scroll track. Scrolling shrinks the whole hero into
 * a 4:3 box in the middle (only the words slide away), flips the theme and draws the signature.
 */
export function Hero({ theme = 'light' }: { theme?: Theme }) {
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const interactive = useInteractive()
  const reduce = useReducedMotion()
  const [locked, setLocked] = useState(false)
  const [overLock, setOverLock] = useState(false)
  useSmoothMouse(stageRef, interactive, 0.12, locked)

  const inverse: Theme = theme === 'light' ? 'dark' : 'light'
  const still = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const progress = reduce ? still : scrollYProgress

  const geo = useHeroGeometry(progress)
  const radius = useTransform(progress, [0, 0.45], [0, 28], { ease: easeInOut })
  const textOpacity = useTransform(progress, [0.02, 0.2], [1, 0])
  const textY = useTransform(progress, [0.02, 0.2], [0, -60])
  const linesOpacity = useTransform(progress, [0, 0.15], [1, 0])
  const lensOpacity = useTransform(progress, [0, 0.08], [1, 0])
  const lensEvents = useTransform(progress, (v) => (v < 0.08 ? 'auto' : 'none'))

  const baseRole = interactive
    ? profile.roles.base
    : `${profile.roles.base} & ${profile.roles.reveal}`

  return (
    <section
      ref={trackRef}
      id="top"
      aria-label="Introduction"
      className={reduce ? 'relative h-screen' : 'relative h-[170vh]'}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        {!reduce && <StageBackdrop progress={progress} theme={inverse} />}

        <motion.div
          style={{
            left: geo.left,
            top: geo.top,
            width: geo.width,
            height: geo.height,
            borderRadius: radius,
          }}
          className="absolute z-[2] overflow-hidden bg-bg"
        >
          <motion.div style={{ opacity: linesOpacity }} className="absolute inset-0">
            <ContourBackground />
          </motion.div>
          <motion.img
            aria-hidden="true"
            src="/images/hero-cutout.webp"
            alt=""
            style={{ left: geo.photoLeft, top: geo.photoTop, height: geo.photoHeight }}
            className="absolute aspect-[900/1137] object-contain"
          />
          <motion.div style={{ opacity: textOpacity, y: textY }} className="absolute inset-0">
            <HeroText heading role={baseRole} />
          </motion.div>
        </motion.div>

        {!reduce && <Signature progress={progress} theme={inverse} />}

        {interactive && (
          <>
            <motion.div
              style={{ opacity: lensOpacity }}
              className="pointer-events-none absolute inset-0 z-[5]"
            >
              <div
                aria-hidden="true"
                className={`spotlight-layer absolute inset-0 transition-opacity duration-150 ${
                  overLock ? 'opacity-0' : ''
                }`}
              >
                <HeroText heading={false} role={profile.roles.reveal} />
                <div className={`${WIREFRAME_BOX} wireframe-mask`} />
              </div>
            </motion.div>
            <motion.button
              type="button"
              data-lens-ignore
              aria-pressed={locked}
              onPointerEnter={() => setOverLock(true)}
              onPointerLeave={() => setOverLock(false)}
              onClick={() => setLocked((v) => !v)}
              style={{ opacity: lensOpacity, pointerEvents: lensEvents }}
              className={`absolute bottom-6 left-6 z-[6] rounded border px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                locked ? 'border-bg bg-fg text-bg' : 'border-fg bg-bg text-fg'
              }`}
            >
              {locked ? 'Unlock' : 'Tap to lock'}
            </motion.button>
          </>
        )}
      </div>
    </section>
  )
}
