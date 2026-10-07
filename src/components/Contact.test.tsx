import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

it('shows the contact heading and the three socials', () => {
  render(<Contact />)
  expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument()
  for (const label of ['GitHub', 'LinkedIn', 'Instagram']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
  expect(screen.queryByText('TikTok')).toBeNull()
})

it('links each social to its profile and opens it safely in a new tab', () => {
  render(<Contact />)
  const expected: Record<string, string> = {
    GitHub: 'https://github.com/djvahd',
    LinkedIn: 'https://www.linkedin.com/in/jovanicadrielharjanto/',
    Instagram: 'https://www.instagram.com/djvahd._/',
  }
  for (const [label, href] of Object.entries(expected)) {
    const link = screen.getByRole('link', { name: label })
    expect(link).toHaveAttribute('href', href)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

it('shows the email as a mailto link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: 'adrielharjanto@gmail.com' })
  expect(link).toHaveAttribute('href', 'mailto:adrielharjanto@gmail.com')
  expect(screen.queryByText('Email coming soon')).toBeNull()
})
