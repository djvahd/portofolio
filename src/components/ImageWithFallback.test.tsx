import { fireEvent, render, screen } from '@testing-library/react'
import { ImageWithFallback } from './ImageWithFallback'

it('renders an img, then a labelled placeholder after a load error', () => {
  render(<ImageWithFallback src="/missing.webp" alt="Cover of Arsipia" />)
  const img = screen.getByRole('img', { name: 'Cover of Arsipia' })
  expect(img.tagName).toBe('IMG')
  fireEvent.error(img)
  expect(screen.getByRole('img', { name: 'Cover of Arsipia' }).tagName).toBe('DIV')
})
