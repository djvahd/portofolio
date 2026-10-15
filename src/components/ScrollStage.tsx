import { useEffect, useState } from 'react'
import { easeInOut, motion, useTransform, type MotionValue } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'

// Placeholder scribble (1180 × 775, the proportions of a big signature): swap this path for
// the real signature. Any set of strokes works; they are drawn one after another.
const SIGNATURE_PATH =
  'M20 625C150 650 330 610 560 520C760 440 930 330 1040 215C1090 150 1060 90 990 100C900 112 790 190 700 280L880 8M880 8L395 760M395 760L520 725C640 690 800 640 920 560C960 530 1000 520 1030 540C1060 560 1000 600 960 610L1160 505'

const LINE_A = 'I build systems — '
const LINE_B = 'I shape interfaces — '

const PHOTO_ASPECT = 900 / 1137
const END_PHOTO_H = 1.18 // portrait is a bit larger than the box, so its lower edge is cropped

/**
 * Geometry of the hero panel and the portrait inside it as the page scrolls. The panel starts
 * as the full screen and ends as a 4:3 box in the middle; the portrait starts to the right
 * (exactly where the hero draws it) and ends centred, head at the top, chest cropped.
 */
export function useHeroGeometry(progress: MotionValue<number>) {
  const read = () => ({ w: document.documentElement.clientWidth, h: window.innerHeight })
  const [size, setSize] = useState(read)
  useEffect(() => {
    const onResize = () => setSize(read())
    onResize() // the scrollbar may have appeared since the first render
    window.addEventListener('resize', onResize)
    // The page's own width changes when the scrollbar shows up or goes away
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize)
    observer?.observe(document.documentElement)
    return () => {
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
    }
  }, [])

  const wide = size.w >= 768
  const startH = wide ? 0.88 : 0.72 // portrait height as a share of the panel
  const startRight = wide ? 0.08 : 0.04
  const startPhotoW = startH * size.h * PHOTO_ASPECT
  const startLeftPct = (1 - startRight - startPhotoW / size.w) * 100

  // The box takes a fixed share of the screen: about a third wide and 40% tall
  const endW = size.w * (wide ? 0.327 : 0.62)
  const endH = size.h * (wide ? 0.397 : 0.42)
  const endPhotoW = endH * END_PHOTO_H * PHOTO_ASPECT
  const endLeftPct = ((endW - endPhotoW) / 2 / endW) * 100

  const range = [0, 0.45]
  const opts = { ease: easeInOut }
  return {
    left: useTransform(progress, range, [0, (size.w - endW) / 2], opts),
    top: useTransform(progress, range, [0, (size.h - endH) / 2], opts),
    width: useTransform(progress, range, [size.w, endW], opts),
    height: useTransform(progress, range, [size.h, endH], opts),
    photoLeft: useTransform(progress, range, [`${startLeftPct}%`, `${endLeftPct}%`], opts),
    photoTop: useTransform(progress, range, [`${(1 - startH) * 100}%`, '0%'], opts),
    photoHeight: useTransform(progress, range, [`${startH * 100}%`, `${END_PHOTO_H * 100}%`], opts),
  }
}

/** The inverted-theme backdrop with the running text, fading in behind the shrinking hero. */
export function StageBackdrop({ progress, theme }: { progress: MotionValue<number>; theme: Theme }) {
  const opacity = useTransform(progress, [0.12, 0.38], [0, 1])
  const textOpacity = useTransform(progress, [0.3, 0.5], [0, 1])
  // Sized by the shorter of width and height, so both rows always fit on screen
  const size = 'text-[clamp(2rem,min(6.3vw,11.8vh),7.5rem)]'
  const row = `flex w-max whitespace-nowrap uppercase ${size}`

  return (
    <motion.div
      aria-hidden="true"
      data-theme={theme}
      style={{ opacity }}
      className="absolute inset-0 z-[1] overflow-hidden bg-bg text-fg"
    >
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none leading-[0.92]"
      >
        {/* Two copies per row, so sliding by half a row loops seamlessly and never stops */}
        <div className={`${row} marquee-left font-display font-light text-muted`}>
          <span>{LINE_A.repeat(6)}</span>
          <span>{LINE_A.repeat(6)}</span>
        </div>
        <div className={`${row} marquee-right font-sans font-extrabold tracking-tight text-fg`}>
          <span>{LINE_B.repeat(6)}</span>
          <span>{LINE_B.repeat(6)}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** The signature, drawn stroke by stroke as the scroll finishes. */
export function Signature({ progress, theme }: { progress: MotionValue<number>; theme: Theme }) {
  const draw = useTransform(progress, [0.55, 0.95], [0, 1])
  const visible = useTransform(draw, (v) => (v > 0.001 ? 1 : 0))
  return (
    <motion.svg
      aria-hidden="true"
      data-theme={theme}
      viewBox="0 0 1180 775"
      fill="none"
      style={{ opacity: visible }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-[4] w-[90vw] -translate-x-1/2 -translate-y-1/2 md:w-[min(61.5vw,117vh)]"
    >
      <motion.path
        d={SIGNATURE_PATH}
        stroke="var(--accent)"
        strokeWidth={24}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: draw }}
      />
    </motion.svg>
  )
}
