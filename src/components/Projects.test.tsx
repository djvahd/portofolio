import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'

it('renders every project, earlier work under Other work', () => {
  render(<Projects />)
  expect(screen.getAllByRole('article')).toHaveLength(3)
  expect(screen.getByRole('heading', { level: 3, name: 'Other work' })).toBeInTheDocument()
})

it('lays the cards out two per row from the md breakpoint up', () => {
  const { container } = render(<Projects />)
  const grid = container.querySelector('#work [data-testid="project-grid"]')
  expect(grid).not.toBeNull()
  expect(grid).toHaveClass('grid', 'md:grid-cols-2')
})
