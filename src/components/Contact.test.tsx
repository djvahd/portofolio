import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

it('shows the contact heading and all four socials', () => {
  render(<Contact />)
  expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument()
  for (const label of ['GitHub', 'LinkedIn', 'Instagram', 'TikTok']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
})

it('does not render dead links for unset socials or email', () => {
  render(<Contact />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('Email coming soon')).toBeInTheDocument()
})
