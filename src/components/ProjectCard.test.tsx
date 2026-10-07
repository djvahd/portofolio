import { render, screen } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'
import type { Project } from '../data/projects'

const base: Project = {
  slug: 'demo',
  title: 'Demo Project',
  role: 'Developer',
  year: '2026',
  description: 'A demo description.',
  image: '/images/projects/demo.webp',
  liveUrl: null,
}

it('links out safely when a live URL exists', () => {
  render(<ProjectCard project={{ ...base, liveUrl: 'https://example.com' }} />)
  const link = screen.getByRole('link', { name: /Demo Project/ })
  expect(link).toHaveAttribute('href', 'https://example.com')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

it('shows a coming-soon note and no link without a live URL', () => {
  render(<ProjectCard project={base} />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('Live link coming soon')).toBeInTheDocument()
  expect(screen.getByText('Demo Project')).toBeInTheDocument()
  expect(screen.getByText('Developer · 2026')).toBeInTheDocument()
})
