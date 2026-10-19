import { render, screen } from '@testing-library/react'
import { Leadership } from './Leadership'

it('shows the heading, six roles, and three recognitions', () => {
  render(<Leadership />)
  expect(
    screen.getByRole('heading', { level: 2, name: 'Leadership & recognition' }),
  ).toBeInTheDocument()
  expect(screen.getByTestId('leadership-list').querySelectorAll('li')).toHaveLength(6)
  expect(screen.getByTestId('recognition-list').querySelectorAll('li')).toHaveLength(3)
})

it('does not use article elements, which are reserved for project cards', () => {
  render(<Leadership />)
  expect(screen.queryAllByRole('article')).toHaveLength(0)
})

it('states the numbers that the CV states', () => {
  render(<Leadership />)
  expect(screen.getByText(/Led 45 members to deliver 14 work programs/)).toBeInTheDocument()
  expect(screen.getByText(/Led 40 members to deliver 18 work programs/)).toBeInTheDocument()
  expect(screen.getByText(/around 1,100 participants/)).toBeInTheDocument()
})
