import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { mockMatchMedia } from '../test/matchMedia'

it('leads with the offer and one call to action', () => {
  mockMatchMedia(() => false)
  render(<Hero />)
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Fast websites that bring small businesses more enquiries.',
    }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Adriel')).toBeInTheDocument()
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(1)
  expect(links[0]).toHaveTextContent('Get a free homepage mock-up')
  expect(links[0]).toHaveAttribute('href', '#contact')
})

it('renders a static combined role when the spotlight is disabled', () => {
  mockMatchMedia(() => false)
  const { container } = render(<Hero />)
  expect(screen.getByText('Web Developer & Designer')).toBeInTheDocument()
  expect(container.querySelector('.spotlight-layer')).toBeNull()
})

it('renders the hidden Designer reveal layer when interactive', () => {
  mockMatchMedia(() => true)
  const { container } = render(<Hero />)
  expect(screen.getByText('Web Developer')).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(1) // the lens copy of the button is not a link
  const layer = container.querySelector('.spotlight-layer')
  expect(layer).not.toBeNull()
  expect(layer).toHaveAttribute('aria-hidden', 'true')
  expect(layer).toHaveTextContent('Designer')
})
