import { act, renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'
import { mockMatchMedia } from '../test/matchMedia'

const systemDark = (dark: boolean) =>
  mockMatchMedia((q) => dark && q.includes('prefers-color-scheme: dark'))

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('useTheme', () => {
  it('falls back to the system preference when nothing is stored', () => {
    systemDark(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back to light when the system is not dark', () => {
    systemDark(false)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('prefers the stored value over the system preference', () => {
    systemDark(true)
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('does not persist anything until the user toggles', () => {
    systemDark(true)
    renderHook(() => useTheme())
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('toggle flips the theme, updates the attribute, and persists', () => {
    systemDark(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
