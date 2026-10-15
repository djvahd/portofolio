import { render } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { Hero } from './Hero'
import { mockMatchMedia } from '../test/matchMedia'

vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: vi.fn(() => false),
}))

beforeEach(() => mockMatchMedia(() => false))

it('pins the hero in a tall scroll track with an inverted-theme backdrop and a signature', () => {
  const { container } = render(<Hero theme="light" />)
  expect(container.querySelector('section')?.className).toContain('h-[170vh]')
  const inverted = container.querySelectorAll('[data-theme="dark"]')
  expect(inverted.length).toBeGreaterThanOrEqual(2) // backdrop, signature
  expect(container.querySelector('svg[viewBox="0 0 1180 775"] path')).not.toBeNull()
  expect(container.querySelector('img')).toHaveAttribute('src', '/images/hero-cutout.webp')
})

it('flips to light when the page theme is dark', () => {
  const { container } = render(<Hero theme="dark" />)
  expect(container.querySelectorAll('[data-theme="light"]').length).toBeGreaterThanOrEqual(2)
})

it('stays a single static screen when reduced motion is requested', () => {
  vi.mocked(useReducedMotion).mockReturnValue(true)
  const { container } = render(<Hero theme="light" />)
  expect(container.querySelector('section')?.className).not.toContain('h-[170vh]')
  expect(container.querySelector('svg[viewBox="0 0 1180 775"]')).toBeNull()
})
