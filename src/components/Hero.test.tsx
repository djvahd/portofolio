import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { mockMatchMedia } from '../test/matchMedia'

it('renders a static combined role when the spotlight is disabled', () => {
  mockMatchMedia(() => false)
  const { container } = render(<Hero />)
  expect(screen.getByRole('heading', { level: 1, name: 'Adriel' })).toBeInTheDocument()
  expect(screen.getByText('This is Me')).toBeInTheDocument()
  expect(screen.getByText('Developer & Designer')).toBeInTheDocument()
  expect(container.querySelector('.spotlight-layer')).toBeNull()
})

it('renders the hidden Designer reveal layer when interactive', () => {
  mockMatchMedia(() => true)
  const { container } = render(<Hero />)
  expect(screen.getByText('Developer')).toBeInTheDocument()
  const layer = container.querySelector('.spotlight-layer')
  expect(layer).not.toBeNull()
  expect(layer).toHaveAttribute('aria-hidden', 'true')
  expect(layer).toHaveTextContent('Designer')
})
