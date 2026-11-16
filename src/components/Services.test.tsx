import { render, screen, within } from '@testing-library/react'
import { Process } from './Process'
import { Services } from './Services'
import { Testimonials } from './Testimonials'

it('lists the three packages with AUD and SGD prices', () => {
  render(<Services />)
  for (const [name, aud, sgd] of [
    ['Landing page', 'AUD 1,200', 'SGD 800'],
    ['Business site', 'AUD 2,000', 'SGD 1,500'],
    ['Care plan', 'AUD 100', 'SGD 80'],
  ]) {
    const card = screen.getByRole('heading', { level: 3, name }).parentElement as HTMLElement
    expect(within(card).getByText(aud)).toBeInTheDocument()
    expect(within(card).getByText(new RegExp(`^${sgd} ·`))).toBeInTheDocument()
  }
  expect(screen.getByRole('link', { name: 'Get a free homepage mock-up' })).toHaveAttribute(
    'href',
    '#contact',
  )
})

it('shows the four steps and the payment terms', () => {
  render(<Process />)
  const steps = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
  expect(steps).toEqual(['Call', 'Mock-up', 'Build', 'Launch'])
  expect(screen.getByText('50% deposit, 2 revision rounds included.')).toBeInTheDocument()
})

it('hides testimonials until there is one, then shows it', () => {
  const { container, rerender } = render(<Testimonials items={[]} />)
  expect(container).toBeEmptyDOMElement()
  rerender(<Testimonials items={[{ quote: 'Great work.', name: 'Sam', business: 'Sam Co' }]} />)
  expect(screen.getByText('“Great work.”')).toBeInTheDocument()
  expect(screen.getByText('Sam, Sam Co')).toBeInTheDocument()
})

it('quotes the measured demo speed', () => {
  render(<Services />)
  expect(screen.getByText(/score 100\/100 for mobile performance in Google Lighthouse/)).toBeInTheDocument()
})
