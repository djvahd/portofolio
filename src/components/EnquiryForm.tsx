import { useState, type FormEvent } from 'react'
import { profile } from '../data/profile'

export const NEEDS = ['A new website', 'A redesign of my current site', 'Help with an existing site', 'Not sure yet']

const FIELDS: [name: string, label: string][] = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['business', 'Business'],
  ['website', 'Website'],
  ['need', 'Needs'],
  ['message', 'Message'],
]

/** A prefilled email, for when no form endpoint is set (or it fails). */
export function mailtoFor(data: FormData, to: string) {
  const subject = `Website enquiry: ${data.get('business') || data.get('name')}`
  const body = FIELDS.map(([key, label]) => `${label}: ${data.get(key) || '-'}`).join('\n')
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error'

const input =
  'mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-fg placeholder:text-muted focus:border-fg focus:outline-none'

export function EnquiryForm({ endpoint = profile.formEndpoint }: { endpoint?: string | null }) {
  const [status, setStatus] = useState<Status>('idle')
  const email = profile.email ?? ''

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('_gotcha')) return // a bot filled the hidden field
    if (!endpoint) {
      setStatus('mailto')
      window.location.href = mailtoFor(data, email)
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className="rounded-2xl border border-line p-6 text-lg">
        Thanks, your enquiry is on its way. I&apos;ll reply by email.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
      <label className="block">
        <span className="text-sm text-muted">Your name</span>
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block">
        <span className="text-sm text-muted">Email</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block">
        <span className="text-sm text-muted">Business name</span>
        <input name="business" required autoComplete="organization" className={input} />
      </label>
      <label className="block">
        <span className="text-sm text-muted">Current website</span>
        <input
          name="website"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com.au, or none yet"
          className={input}
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-sm text-muted">What do you need?</span>
        <select name="need" required defaultValue="" className={input}>
          <option value="" disabled>
            Choose one
          </option>
          {NEEDS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label className="block md:col-span-2">
        <span className="text-sm text-muted">Anything else? (optional)</span>
        <textarea
          name="message"
          rows={4}
          placeholder="What should the site help with? More bookings, more quote requests..."
          className={input}
        />
      </label>
      {/* Honeypot: hidden from people, bots tend to fill it */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-fg px-6 py-3 font-medium text-bg disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending...' : 'Send enquiry'}
        </button>
        {status === 'mailto' && (
          <p role="status" className="mt-4 text-muted">
            Your email app should open with the details filled in. If it didn&apos;t, email me at{' '}
            <a href={`mailto:${email}`} className="underline">
              {email}
            </a>
            .
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="mt-4 text-muted">
            Sorry, that didn&apos;t send. Please email me at{' '}
            <a href={`mailto:${email}`} className="underline">
              {email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}
