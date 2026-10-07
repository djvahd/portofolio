import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

it('offers dark when light and calls onToggle on click', async () => {
  const onToggle = vi.fn()
  render(<ThemeToggle theme="light" onToggle={onToggle} />)
  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
  expect(onToggle).toHaveBeenCalledTimes(1)
})

it('offers light when dark', () => {
  render(<ThemeToggle theme="dark" onToggle={() => {}} />)
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
})
