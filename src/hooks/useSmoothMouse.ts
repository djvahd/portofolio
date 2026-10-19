import { useEffect, useRef, type RefObject } from 'react'

const BASE_RADIUS = 110
const LINGER_MS = 70 // the blob starts melting this soon after the pointer stops
const MELT = 0.06 // how slowly it melts away (per frame): about a second to be gone
const POINTS = 16

// An idle "ghost pointer" that now and then swipes edge to edge in fast diagonal zig-zags,
// leaving a longer trail of the same kind.
const IDLE_MS = 2500
const GHOST_SEGMENTS = 4
const GHOST_SEGMENT_MS = 380
const GHOST_GAP_MIN = 2500
const GHOST_GAP_RANGE = 2500
const SCROLL_PAUSE_MS = 800 // no swipe starts this soon after the page last scrolled
const JITTER_PX = 4 // pointer or scroll movement below this is noise and never cancels a swipe
const TRAIL_MS = 1300 // how long a piece of the ghost's trail lives
const TRAIL_SPACING = 28 // px between the points a trail's outline is built from

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
 * A closed, smooth blob as SVG path data, shaped like a droplet in motion: round at the front,
 * drawn out into a soft tail behind when it moves (vx, vy in px/frame), with a slow, gentle
 * wobble (t in ms) so the edge never sits still.
 */
function blobD(cx: number, cy: number, radius: number, t: number, vx = 0, vy = 0): string {
  const speed = Math.hypot(vx, vy)
  const dirX = speed > 0.01 ? vx / speed : 1
  const dirY = speed > 0.01 ? vy / speed : 0
  const tail = 1 + Math.min(speed * 0.045, 0.85) // how far the back is drawn out
  const nose = 1 + Math.min(speed * 0.01, 0.15) // the front only swells a little
  const squash = 1 / Math.sqrt(tail) // the body narrows as the tail lengthens

  const pts: [number, number][] = []
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2
    // A few slow, smooth lobes drifting around the edge: organic, never lumpy or spiky
    const wobble =
      1 +
      0.07 * Math.sin(2 * a + t * 0.0011) +
      0.05 * Math.sin(3 * a - t * 0.0016) +
      0.03 * Math.sin(5 * a + t * 0.0023)
    const lx = Math.cos(a) * radius * wobble
    const ly = Math.sin(a) * radius * wobble
    const along = lx * dirX + ly * dirY
    const across = (-lx * dirY + ly * dirX) * squash
    const stretched = along * (along < 0 ? tail : nose)
    pts.push([cx + stretched * dirX - across * dirY, cy + stretched * dirY + across * dirX])
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

/** Samples younger than `lifeMs` (a clock that went backwards counts as expired). */
function alive(trail: TrailSample[], now: number, lifeMs: number) {
  return trail.filter((s) => now - s.born >= 0 && now - s.born < lifeMs)
}

/** The shape of a trail: one ribbon, thinner the older a piece is, so the tail goes first. */
function trailShape(trail: TrailSample[], now: number, radius: number, lifeMs: number) {
  const pts: { x: number; y: number; r: number }[] = []
  trail.forEach((s, i) => {
    const age = now - s.born
    const life = smooth(1 - age / lifeMs)
    const grow = Math.min(1, 0.35 + age / 120) // the head swells in instead of popping
    const r = radius * life * grow
    const prev = pts[pts.length - 1]
    const spaced = !prev || Math.hypot(s.x - prev.x, s.y - prev.y) >= TRAIL_SPACING
    if (r >= 2 && (spaced || i === trail.length - 1)) pts.push({ x: s.x, y: s.y, r })
  })
  if (pts.length === 0) return null
  if (pts.length === 1) return blobD(pts[0].x, pts[0].y, pts[0].r, now)
  return ribbonD(pts, now)
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
    let presence = 0 // the blob under the pointer: 0 = gone, 1 = full size
    let raf = 0

    let ghostTrail: TrailSample[] = []
    let ghostPath: [number, number][] = []
    let ghostStart = 0 // 0 = not swiping
    let ghostLast: [number, number] = [0, 0]
    let nextGhost = performance.now() + IDLE_MS
    let lastScroll = -Infinity
    let lastScrollY = window.scrollY
    let lastPointer: [number, number] | null = null

    // The swipes only play while the page rests at the top; a real scroll cancels one mid-way
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) < JITTER_PX) return
      lastScrollY = window.scrollY
      lastScroll = performance.now()
      ghostStart = 0
    }

    const onMove = (e: PointerEvent) => {
      // A "still" mouse still twitches, and browsers re-send moves after layout changes
      if (
        lastPointer &&
        Math.hypot(e.clientX - lastPointer[0], e.clientY - lastPointer[1]) < JITTER_PX
      ) {
        return
      }
      lastPointer = [e.clientX, e.clientY]
      lastMove = performance.now()
      real = true
      if (lockedRef.current) return
      if ((e.target as Element).closest?.('[data-lens-ignore]')) return
      const rect = el.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      if (!seeded || presence < 0.05) {
        // A fresh blob starts under the pointer instead of streaking in from the last spot
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
      follow(lens, target.x, target.y, k)

      // Hover: the blob swells up while the pointer moves, and melts away slowly once it stops.
      // Locked, it stays put where it was left.
      const wanted = seeded && (isLocked || (real && moving))
      presence = ease(presence, wanted ? 1 : 0, wanted ? 0.3 : MELT)

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
          ghostTrail.push({ x, y, vx: x - ghostLast[0], vy: y - ghostLast[1], born: now })
          ghostLast = [x, y]
        }
      }
      ghostTrail = alive(ghostTrail, now, TRAIL_MS)

      const shapes: string[] = []
      if (presence >= 0.02) {
        shapes.push(blobD(lens.x, lens.y, BASE_RADIUS * smooth(presence), now, lens.vx, lens.vy))
      }
      const ghost = trailShape(ghostTrail, now, BASE_RADIUS * 0.85, TRAIL_MS)
      if (ghost) shapes.push(ghost)

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
