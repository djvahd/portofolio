import { render, screen } from '@testing-library/react'
import App from './App'

it('renders the owner name as the main heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1, name: 'Adriel' })).toBeInTheDocument()
})
