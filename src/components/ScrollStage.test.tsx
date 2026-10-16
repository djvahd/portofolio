import { renderHook } from '@testing-library/react'
import { motionValue } from 'framer-motion'
import { useHeroGeometry } from './ScrollStage'

function geometryAt(width: number, height: number) {
  Object.defineProperty(document.documentElement, 'clientWidth', { value: width, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true })
  const { result } = renderHook(() => useHeroGeometry(motionValue(0)))
  const pct = (s: string) => parseFloat(s)
  const { start } = result.current
  return { left: pct(start.left), top: pct(start.top), height: pct(start.height), result }
}

describe('useHeroGeometry', () => {
  afterEach(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', { value: 0, configurable: true })
  })

  it('puts the portrait to the right on a wide screen', () => {
    const g = geometryAt(1280, 800)
    const photoW = 0.88 * 800 * (900 / 1137) // 557px, well under 60% of the width
    expect(g.height).toBeCloseTo(88)
    expect(g.left).toBeCloseTo((1 - 0.08 - photoW / 1280) * 100, 0)
    expect(g.top + g.height).toBeCloseTo(100) // sits on the bottom edge
  })

  it('centres a smaller portrait on a phone, never wider than the screen', () => {
    const g = geometryAt(375, 812)
    const photoW = 0.92 * 375 // limited by the width, not the height
    expect(g.left).toBeCloseTo(((1 - photoW / 375) / 2) * 100, 0)
    expect(g.left).toBeGreaterThan(0)
    expect(g.top + g.height).toBeCloseTo(100)
    expect((g.height / 100) * 812 * (900 / 1137)).toBeLessThanOrEqual(375)
  })

  it('does not let a tablet held upright swallow the screen either', () => {
    const g = geometryAt(768, 1024)
    const photoW = (g.height / 100) * 1024 * (900 / 1137)
    expect(photoW).toBeLessThanOrEqual(0.92 * 768 + 1)
    expect(g.height).toBeLessThan(70) // the words keep the top of the screen
  })

  it('starts the box from the whole screen', () => {
    const { result } = geometryAt(1280, 800)
    expect(result.current.width.get()).toBe(1280)
    expect(result.current.height.get()).toBe(800)
    expect(result.current.left.get()).toBe(0)
    expect(result.current.top.get()).toBe(0)
  })
})
