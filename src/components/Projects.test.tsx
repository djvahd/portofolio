import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'

it('renders all four projects', () => {
  render(<Projects />)
  expect(screen.getAllByRole('article')).toHaveLength(4)
})

it('lays the cards out two per row from the md breakpoint up', () => {
  const { container } = render(<Projects />)
  const grid = container.querySelector('#work [data-testid="project-grid"]')
  expect(grid).not.toBeNull()
  expect(grid).toHaveClass('grid', 'md:grid-cols-2')
})
