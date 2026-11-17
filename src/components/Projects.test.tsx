import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'

it('renders every project in one grid', () => {
  render(<Projects />)
  expect(screen.getByTestId('project-grid').querySelectorAll('article')).toHaveLength(6)
  expect(screen.queryByText('Other work')).toBeNull()
})

it('lays the cards out two per row from the md breakpoint up', () => {
  const { container } = render(<Projects />)
  const grid = container.querySelector('#work [data-testid="project-grid"]')
  expect(grid).not.toBeNull()
  expect(grid).toHaveClass('grid', 'md:grid-cols-2')
})
