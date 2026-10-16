import { useEffect, useRef, type RefObject } from 'react'

const BASE_RADIUS = 110
const LINGER_MS = 70 // the liquid is a trail: it starts melting as soon as the pointer stops
const MELT = 0.1 // how fast it melts away (per frame)
const POINTS = 10

// An idle "ghost pointer" that now and then swipes edge to edge in fast diagonal zig-zags,
// leaving a long liquid trail whose tail dissolves first, in the order it was laid down.
const IDLE_MS = 2500
const GHOST_SEGMENTS = 4
const GHOST_SEGMENT_MS = 380
const GHOST_GAP_MIN = 2500
const GHOST_GAP_RANGE = 2500
const SCROLL_PAUSE_MS = 800 // no swipe starts this soon after the page last scrolled
const TRAIL_MS = 1300 // how long a piece of the trail lives
const TRAIL_SPACING = 28 // px between the points the trail's outline is built from

const smooth = (v: number) => v * v * (3 - 2 * v)

export function ease(current: number, target: number, k: number): number {
  return current + (target - current) * k
}

/** Zig-zag corner points: down-right, down-left, down-right, down-left, ... */
export function zigzag(x0: number, y0: number, dx: number, dy: number, segments: number) {
  return Array.from({ length: segments + 1 }, (_, i): [number, number] => [
    x0 + (i % 2 ? dx : 0),
    y0 + i * dy,
  ])
}

/**
 * A closed, smooth blob as SVG path data: POINTS radii wobbling over time (t in ms),
 * stretched along the direction of motion (vx, vy in px/frame) like a liquid droplet.
 */
function blobD(cx: number, cy: number, radius: number, t: number, vx = 0, vy = 0): string {
  const speed = Math.hypot(vx, vy)
  const stretch = 1 + Math.min(speed * 0.03, 0.45)
  const squash = 1 / Math.sqrt(stretch) // keeps the area roughly constant
  const dirX = speed > 0.01 ? vx / speed : 1
  const dirY = speed > 0.01 ? vy / speed : 0

  const pts: [number, number][] = []
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2 + t * 0.0003
    const wobble = 1 + 0.22 * Math.sin(t * 0.0013 + i * 1.7) + 0.14 * Math.sin(t * 0.0022 + i * 2.9)
    const lx = Math.cos(a) * radius * wobble
    const ly = Math.sin(a) * radius * wobble
    const along = (lx * dirX + ly * dirY) * stretch
    const across = (-lx * dirY + ly * dirX) * squash
    pts.push([cx + along * dirX - across * dirY, cy + along * dirY + across * dirX])
  }

  return smoothClosed(pts)
}

/** Catmull-Rom spline through the points, written as a closed run of cubic Béziers. */
function smoothClosed(pts: [number, number][]): string {
  const n = pts.length
  const f = (v: number) => v.toFixed(1)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    d +=
      `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ` +
      `${f(p2[0])} ${f(p2[1])}`
  }
  return `${d}Z`
}

/**
 * One continuous liquid ribbon along the points (oldest first), each with its own radius.
 * The outline is a single smooth curve, so the trail reads as one body of liquid.
 */
function ribbonD(samples: { x: number; y: number; r: number }[], t: number): string {
  const n = samples.length
  const left: [number, number][] = []
  const right: [number, number][] = []
  const tangent = (i: number): [number, number] => {
    const a = samples[Math.max(i - 1, 0)]
    const b = samples[Math.min(i + 1, n - 1)]
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    return [(b.x - a.x) / len, (b.y - a.y) / len]
  }
  samples.forEach((s, i) => {
    const [tx, ty] = tangent(i)
    const w = s.r * (1 + 0.1 * Math.sin(t * 0.003 + i * 0.8)) // a gentle ripple in the width
    left.push([s.x - ty * w, s.y + tx * w])
    right.push([s.x + ty * w, s.y - tx * w])
  })
  const head = samples[n - 1]
  const tail = samples[0]
  const [hx, hy] = tangent(n - 1)
  const [tx, ty] = tangent(0)
  return smoothClosed([
    ...left,
    [head.x + hx * head.r, head.y + hy * head.r], // rounded head
    ...right.reverse(),
    [tail.x - tx * tail.r, tail.y - ty * tail.r], // rounded tail
  ])
}

export function blobPath(
  cx: number,
  cy: number,
  radius: number,
  t: number,
  vx = 0,
  vy = 0,
): string {
  return `path('${blobD(cx, cy, radius, t, vx, vy)}')`
}

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
}

interface TrailSample extends Blob {
  born: number
}

function follow(blob: Blob, tx: number, ty: number, k: number) {
  const px = blob.x
  const py = blob.y
  blob.x = ease(blob.x, tx, k)
  blob.y = ease(blob.y, ty, k)
  blob.vx = ease(blob.vx, blob.x - px, 0.25)
  blob.vy = ease(blob.vy, blob.y - py, 0.25)
}

export function useSmoothMouse(
  ref: RefObject<HTMLElement>,
  enabled: boolean,
  k = 0.12,
  locked = false,
) {
  const lockedRef = useRef(locked)
  lockedRef.current = locked

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const target = { x: 0, y: 0 }
    const lens: Blob = { x: 0, y: 0, vx: 0, vy: 0 }
    let seeded = false
    let real = false // a real pointer is inside the window
    let lastMove = performance.now()
    let presence = 0 // 0 = no liquid, 1 = full-size liquid
    let raf = 0

    let trail: TrailSample[] = []
    let ghostPath: [number, number][] = []
    let ghostStart = 0 // 0 = not swiping
    let ghostLast: [number, number] = [0, 0]
    let nextGhost = performance.now() + IDLE_MS
    let lastScroll = -Infinity

    // The swipes only play while the page rests at the top; any scroll cancels one mid-way
    const onScroll = () => {
      lastScroll = performance.now()
      ghostStart = 0
    }

    const onMove = (e: PointerEvent) => {
      lastMove = performance.now()
      real = true
      ghostStart = 0 // a real pointer takes over; the trail left behind keeps dissolving
      if (lockedRef.current) return
      if ((e.target as Element).closest?.('[data-lens-ignore]')) return
      const rect = el.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      if (!seeded || presence < 0.05) {
        // A fresh splash starts under the pointer instead of streaking in from the last spot
        Object.assign(lens, { x: target.x, y: target.y, vx: 0, vy: 0 })
        seeded = true
      }
    }

    const onLeave = () => {
      real = false
    }

    const tick = (now: number) => {
      const isLocked = lockedRef.current
      const moving = now - lastMove < LINGER_MS
      const idle = !isLocked && now - lastMove > IDLE_MS
      const wanted = seeded && (isLocked || (real && moving))
      presence = ease(presence, wanted ? 1 : 0, wanted ? 0.3 : MELT)
      follow(lens, target.x, target.y, k)

      // The ghost pointer: a fast diagonal zig-zag swipe now and then while nobody is hovering
      const atRest = window.scrollY < 24 && now - lastScroll > SCROLL_PAUSE_MS
      if (isLocked || !atRest) ghostStart = 0
      if (idle && atRest && !ghostStart && now >= nextGhost) {
        // From beyond the left edge to beyond the right edge, and back, working down the page
        const x0 = -BASE_RADIUS
        const dx = el.clientWidth + 2 * BASE_RADIUS
        const y0 = el.clientHeight * (0.05 + Math.random() * 0.1)
        ghostPath = zigzag(x0, y0, dx, el.clientHeight * 0.22, GHOST_SEGMENTS)
        ghostLast = ghostPath[0]
        ghostStart = now
      }
      if (ghostStart) {
        const t = (now - ghostStart) / (GHOST_SEGMENTS * GHOST_SEGMENT_MS)
        if (t >= 1) {
          ghostStart = 0
          nextGhost = now + GHOST_GAP_MIN + Math.random() * GHOST_GAP_RANGE
        } else {
          const seg = Math.min(Math.floor(t * GHOST_SEGMENTS), GHOST_SEGMENTS - 1)
          const u = t * GHOST_SEGMENTS - seg
          const s = u * u * (3 - 2 * u) // smoothstep: each stroke eases in and out
          const [ax, ay] = ghostPath[seg]
          const [bx, by] = ghostPath[seg + 1]
          const x = ease(ax, bx, s)
          const y = ease(ay, by, s)
          trail.push({ x, y, vx: x - ghostLast[0], vy: y - ghostLast[1], born: now })
          ghostLast = [x, y]
        }
      }
      // Oldest samples die first, so the tail dissolves piece by piece (a clock that went
      // backwards counts as expired too)
      trail = trail.filter((s) => now - s.born >= 0 && now - s.born < TRAIL_MS)

      // smooth() makes each shrink ease out like a droplet being absorbed
      const shapes: string[] = []
      if (presence >= 0.02) {
        shapes.push(blobD(lens.x, lens.y, BASE_RADIUS * smooth(presence), now, lens.vx, lens.vy))
      }
      // The ghost's trail is one ribbon: thinner the older a piece is, so the tail goes first
      const ribbon: { x: number; y: number; r: number }[] = []
      trail.forEach((s, i) => {
        const age = now - s.born
        const life = smooth(1 - age / TRAIL_MS)
        const grow = Math.min(1, 0.35 + age / 120) // the head swells in instead of popping
        const r = BASE_RADIUS * 0.85 * life * grow
        const prev = ribbon[ribbon.length - 1]
        const spaced = !prev || Math.hypot(s.x - prev.x, s.y - prev.y) >= TRAIL_SPACING
        if (r >= 2 && (spaced || i === trail.length - 1)) ribbon.push({ x: s.x, y: s.y, r })
      })
      if (ribbon.length === 1) {
        shapes.push(blobD(ribbon[0].x, ribbon[0].y, ribbon[0].r, now))
      } else if (ribbon.length > 1) {
        shapes.push(ribbonD(ribbon, now))
      }
      const blob = shapes.length ? `path('${shapes.join('')}')` : 'circle(0px)'
      el.style.setProperty('--blob', blob)
      // Layers outside the stage (like the header) can mirror the liquid, drawn above their own
      // content; they share the stage's origin while it is pinned, so the same path lines up
      document
        .querySelectorAll<HTMLElement>('[data-lens-mirror]')
        .forEach((m) => m.style.setProperty('--blob', blob))
      raf = requestAnimationFrame(tick)
    }

    // Listen on the window: the fixed header overlaps the hero, so the section itself
    // would see the pointer "leave" whenever it passes over the header.
    const root = document.documentElement
    window.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      root.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [ref, enabled, k])
}
