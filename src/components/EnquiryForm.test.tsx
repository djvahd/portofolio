import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnquiryForm, mailtoFor, NEEDS } from './EnquiryForm'

async function fillIn() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Your name'), 'Sam Lee')
  await user.type(screen.getByLabelText('Email'), 'sam@example.com')
  await user.type(screen.getByLabelText('Business name'), 'Sam Physio')
  await user.type(screen.getByLabelText('Current website'), 'samphysio.com.au')
  await user.selectOptions(screen.getByLabelText('What do you need?'), 'A new website')
  await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
}

afterEach(() => vi.unstubAllGlobals())

it('asks for business name, website and what they need', () => {
  render(<EnquiryForm endpoint={null} />)
  expect(screen.getByLabelText('Business name')).toBeRequired()
  expect(screen.getByLabelText('Current website')).not.toBeRequired()
  expect(NEEDS).toContain('Not sure yet')
})

it('posts to the endpoint and thanks the sender', async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true })
  vi.stubGlobal('fetch', fetch)
  render(<EnquiryForm endpoint="https://forms.example/f/abc" />)
  await fillIn()
  expect(fetch).toHaveBeenCalledWith(
    'https://forms.example/f/abc',
    expect.objectContaining({ method: 'POST' }),
  )
  const sent = fetch.mock.calls[0][1].body as URLSearchParams
  expect(sent).toBeInstanceOf(URLSearchParams)
  expect(sent.get('business')).toBe('Sam Physio')
  expect(sent.get('need')).toBe('A new website')
  expect(await screen.findByRole('status')).toHaveTextContent('your enquiry is on its way')
})

it('offers the email address when the endpoint fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  render(<EnquiryForm endpoint="https://forms.example/f/abc" />)
  await fillIn()
  expect(await screen.findByRole('alert')).toHaveTextContent('adrielharjanto@gmail.com')
})

it('builds a prefilled email when there is no endpoint', () => {
  const data = new FormData()
  data.set('name', 'Sam Lee')
  data.set('business', 'Sam Physio')
  data.set('need', 'Landing page')
  const url = mailtoFor(data, 'me@example.com')
  expect(url.startsWith('mailto:me@example.com?subject=Website%20enquiry%3A%20Sam%20Physio')).toBe(true)
  const body = decodeURIComponent(url.split('&body=')[1])
  expect(body).toContain('Business: Sam Physio')
  expect(body).toContain('Needs: Landing page')
  expect(body).toContain('Website: -')
})
