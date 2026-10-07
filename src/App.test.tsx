import { render, screen } from '@testing-library/react'
import App from './App'
import { mockMatchMedia } from './test/matchMedia'

beforeEach(() => {
  localStorage.clear()
  mockMatchMedia(() => false)
})

it('renders every section in order', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1, name: 'Adriel' })).toBeInTheDocument()
  const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(h2s).toEqual(['Selected work', 'About', 'Contact'])
  expect(screen.getAllByRole('article')).toHaveLength(4)
})

it('offers a skip link and a theme toggle', () => {
  render(<App />)
  expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#work')
  expect(screen.getByRole('button', { name: /Switch to (dark|light) theme/ })).toBeInTheDocument()
})
