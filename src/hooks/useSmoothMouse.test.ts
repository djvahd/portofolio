import { ease } from './useSmoothMouse'

describe('ease', () => {
  it('moves a fraction of the distance toward the target', () => {
    expect(ease(0, 10, 0.1)).toBeCloseTo(1)
    expect(ease(10, 0, 0.5)).toBeCloseTo(5)
  })

  it('stays put when already at the target', () => {
    expect(ease(7, 7, 0.3)).toBe(7)
  })
})
