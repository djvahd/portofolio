import { useEffect, type RefObject } from 'react'

export function ease(current: number, target: number, k: number): number {
  return current + (target - current) * k
}

export function useSmoothMouse(ref: RefObject<HTMLElement>, enabled: boolean, k = 0.12) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const target = { x: -9999, y: -9999 }
    const current = { x: -9999, y: -9999 }
    let seeded = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      if (!seeded) {
        current.x = target.x
        current.y = target.y
        seeded = true
      }
    }

    const tick = () => {
      current.x = ease(current.x, target.x, k)
      current.y = ease(current.y, target.y, k)
      el.style.setProperty('--mx', `${current.x}px`)
      el.style.setProperty('--my', `${current.y}px`)
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [ref, enabled, k])
}
