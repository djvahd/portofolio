import { renderHook } from '@testing-library/react'
import { blobPath, ease, useSmoothMouse, zigzag } from './useSmoothMouse'

describe('ease', () => {
  it('moves a fraction of the distance toward the target', () => {
    expect(ease(0, 10, 0.1)).toBeCloseTo(1)
    expect(ease(10, 0, 0.5)).toBeCloseTo(5)
  })

  it('stays put when already at the target', () => {
    expect(ease(7, 7, 0.3)).toBe(7)
  })
})

describe('zigzag', () => {
  it('goes down-right, down-left, down-right, down-left', () => {
    expect(zigzag(100, 0, 200, 130, 4)).toEqual([
      [100, 0],
      [300, 130],
      [100, 260],
      [300, 390],
      [100, 520],
    ])
  })
})

describe('blobPath', () => {
  it('is a closed path made of smooth curves', () => {
    const d = blobPath(100, 100, 50, 0)
    expect(d.startsWith("path('M")).toBe(true)
    expect(d.endsWith("Z')")).toBe(true)
    expect(d.match(/C/g)).toHaveLength(16)
  })

  it('wobbles over time even when nothing else changes', () => {
    expect(blobPath(100, 100, 50, 0)).not.toBe(blobPath(100, 100, 50, 4000))
  })

  it('stretches along the direction of motion', () => {
    expect(blobPath(100, 100, 50, 0, 20, 0)).not.toBe(blobPath(100, 100, 50, 0, 0, 0))
  })
})

describe('useSmoothMouse liquid', () => {
  const HIDDEN = 'circle(0px)'
  const LATER = 1e9 // far past the last pointer move: idle for a long time

  function setup() {
    const el = document.body.appendChild(document.createElement('section'))
    el.getBoundingClientRect = () => ({ left: 0, top: 0 }) as DOMRect
    let frameCb: FrameRequestCallback = () => {}
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frameCb = cb
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    const ref = { current: el }
    const hook = renderHook(({ locked }) => useSmoothMouse(ref, true, 0.12, locked), {
      initialProps: { locked: false },
    })
    const move = (x: number, target: Element = el) =>
      target.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: 0, bubbles: true }))
    const frames = (n: number, start = 0, step = 16) => {
      for (let i = 0; i < n; i++) frameCb(start + i * step)
    }
    const blob = () => el.style.getPropertyValue('--blob')
    const shapes = () => (blob().match(/M/g) ?? []).length
    return { el, hook, move, frames, blob, shapes }
  }

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('mirrors the liquid onto marked layers outside the stage, like the header', () => {
    const { move, frames, blob } = setup()
    const mirror = document.body.appendChild(document.createElement('header'))
    mirror.setAttribute('data-lens-mirror', '')
    move(120)
    frames(30)
    expect(blob()).toMatch(/^path\(/)
    expect(mirror.style.getPropertyValue('--blob')).toBe(blob())
  })

  it('shows nothing before any pointer arrives', () => {
    const { frames, blob } = setup()
    frames(5)
    expect(blob()).toBe(HIDDEN)
  })

  it('splashes up as a single blob as soon as the pointer moves', () => {
    const { move, frames, blob, shapes } = setup()
    move(120)
    frames(30)
    expect(blob()).toMatch(/^path\(/)
    expect(shapes()).toBe(1)
  })

  it('draws the blob out into a soft tail behind the direction of motion', () => {
    const coords = (d: string) => [...d.matchAll(/(-?\d+\.\d) (-?\d+\.\d)/g)].map((m) => [+m[1], +m[2]])
    const extent = (d: string, axis: 0 | 1) => {
      const v = coords(d).map((c) => c[axis])
      return [Math.min(...v), Math.max(...v)]
    }
    const rest = blobPath(0, 0, 100, 0, 0, 0)
    const moving = blobPath(0, 0, 100, 0, 25, 0) // moving right, fast
    const [movingMin, movingMax] = extent(moving, 0)
    const [restMin, restMax] = extent(rest, 0)
    expect(movingMin).toBeLessThan(restMin * 1.4) // the tail reaches much farther left
    expect(-movingMin).toBeGreaterThan(movingMax * 1.3) // and the front stays rounder than the back
    expect(restMax - restMin).toBeLessThan(movingMax - movingMin)
    const [hMin, hMax] = extent(moving, 1)
    const [rhMin, rhMax] = extent(rest, 1)
    expect(hMax - hMin).toBeLessThan(rhMax - rhMin) // the body narrows as the tail lengthens
  })

  it('melts away slowly once the pointer stops, not all at once', () => {
    const { move, frames, blob } = setup()
    move(120)
    frames(30)
    expect(blob()).toMatch(/^path\(/)
    const stopped = performance.now() + 300 // 300 ms later: stopped, but not yet idle
    frames(20, stopped)
    expect(blob()).toMatch(/^path\(/) // a third of a second on, it is still there, shrinking
    frames(100, stopped + 20 * 16)
    expect(blob()).toBe(HIDDEN) // gone after about a second and a half
  })

  it('swipes a ghost pointer across the page while idle, then lets go', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { frames, blob, shapes } = setup()
    for (let i = 0; i < 60; i++) frames(1, LATER + i * 16) // idle long enough: a fast swipe starts
    expect(blob()).toMatch(/^path\(/)
    expect(shapes()).toBe(1) // one continuous ribbon of liquid, not a string of separate blobs
    const during = blob().length
    frames(1, LATER + 1700) // swipe over, the oldest part of the trail is already gone
    expect(shapes()).toBe(1)
    const dissolving = blob().length
    expect(dissolving).toBeGreaterThan(0)
    expect(dissolving).toBeLessThan(during)
    frames(1, LATER + 3000) // the rest has dissolved too, next swipe still seconds away
    expect(blob()).toBe(HIDDEN)
  })

  it('keeps the swipe away from scrolling: not while scrolled, not right after a scroll', () => {
    const { frames, blob } = setup()
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
    frames(1, LATER)
    frames(1, LATER + 700)
    expect(blob()).toBe(HIDDEN) // the page is not resting at the top

    Object.defineProperty(window, 'scrollY', { value: 10, configurable: true })
    vi.spyOn(performance, 'now').mockReturnValue(LATER)
    window.dispatchEvent(new Event('scroll'))
    frames(1, LATER + 300)
    frames(1, LATER + 700)
    expect(blob()).toBe(HIDDEN) // scrolled a moment ago

    frames(1, LATER + 2600) // the page has rested long enough
    frames(1, LATER + 3000)
    expect(blob()).toMatch(/^path\(/)
  })

  it('lets a swipe finish through pointer twitches and scroll noise, but not a real move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { move, frames, blob } = setup()
    const curves = () => (blob().match(/C/g) ?? []).length // grows as the ribbon gets longer
    move(100) // the pointer rests here
    for (let i = 0; i < 18; i++) frames(1, LATER + i * 16) // a swipe is under way
    const early = curves()

    move(101) // a twitch
    window.dispatchEvent(new Event('scroll')) // scroll event with no real scrolling
    for (let i = 0; i < 18; i++) frames(1, LATER + 288 + i * 16)
    expect(curves()).toBeGreaterThan(early) // still being drawn

    move(300) // a real move hands the page back to the pointer
    for (let i = 0; i < 18; i++) frames(1, LATER + 576 + i * 16)
    const after = curves()
    frames(1, LATER + 576 + 18 * 16)
    expect(curves()).toBeLessThanOrEqual(after) // nothing new is added
  })

  it('does not swipe while locked', () => {
    const { hook, frames, blob } = setup()
    hook.rerender({ locked: true })
    frames(300, LATER)
    expect(blob()).toBe(HIDDEN)
  })

  it('hands over to the real pointer when it moves mid-swipe', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { move, frames, blob } = setup()
    frames(1, LATER)
    frames(1, LATER + 800)
    expect(blob()).toMatch(/^path\(/)
    move(50)
    frames(60, performance.now() + 300) // pointer stopped 300 ms ago, not idle yet
    expect(blob()).toBe(HIDDEN) // ghost gone, nothing left once the pointer stops again
  })

  it('stays put and keeps wobbling while locked', () => {
    const { hook, move, frames, blob } = setup()
    move(120)
    frames(30)
    hook.rerender({ locked: true })
    frames(1, LATER)
    const a = blob()
    expect(a).toMatch(/^path\(/)
    frames(1, LATER + 3000)
    expect(blob()).toMatch(/^path\(/)
    expect(blob()).not.toBe(a)
  })

  it('ignores moves over a data-lens-ignore element', () => {
    const { el, move, frames, blob } = setup()
    const btn = el.appendChild(document.createElement('button'))
    btn.setAttribute('data-lens-ignore', '')
    move(120)
    frames(400, 0, 0) // time stands still, so the liquid neither melts nor wobbles
    const before = blob()
    move(500, btn)
    frames(1, 0, 0)
    expect(blob()).toBe(before)
  })

  it('shrinks away when the pointer leaves', () => {
    const { move, frames, blob } = setup()
    move(120)
    frames(30)
    document.documentElement.dispatchEvent(new Event('pointerleave'))
    frames(130, 30 * 16)
    expect(blob()).toBe(HIDDEN)
  })
})
