export interface Package {
  name: string
  aud: string
  sgd: string
  per: string | null
  time: string
  summary: string
  includes: string[]
}

// Draft prices from the brief (2026-11-15); change them here
export const packages: Package[] = [
  {
    name: 'Landing page',
    aud: 'AUD 1,200',
    sgd: 'SGD 800',
    per: null,
    time: 'Ready in 1 week',
    summary: 'One page that explains what you do and turns visitors into enquiries.',
    includes: [
      'Mobile-first design and build',
      'Enquiry or booking form',
      'Click-to-call, map and opening hours',
      'Basic SEO and visitor stats',
    ],
  },
  {
    name: 'Business site',
    aud: 'AUD 2,000',
    sgd: 'SGD 1,500',
    per: null,
    time: 'Ready in 2 weeks',
    summary: 'Up to 5 pages for a business with several services to show.',
    includes: [
      'Everything in the landing page',
      'Up to 5 pages, e.g. Home, Services, About, Gallery, Contact',
      'Booking or quote form',
      'SEO set-up for every page',
    ],
  },
  {
    name: 'Care plan',
    aud: 'AUD 100',
    sgd: 'SGD 80',
    per: 'per month',
    time: 'After launch',
    summary: 'Keeps your site fast, safe and up to date, so you never have to touch it.',
    includes: [
      'Hosting and SSL looked after',
      'Up to 1 hour of text and photo changes',
      'Monthly speed and uptime check',
      'Backups',
    ],
  },
]

export const steps: { title: string; text: string }[] = [
  {
    title: 'Call',
    text: 'A 15-minute call about your business, your customers and what the site has to do.',
  },
  {
    title: 'Mock-up',
    text: 'A free homepage mock-up, so you see the design before you pay anything.',
  },
  {
    title: 'Build',
    text: 'A 50% deposit starts the build. You get two rounds of revisions.',
  },
  {
    title: 'Launch',
    text: 'You pay the rest, the site goes live on your domain and I show you around it.',
  },
]

export interface Testimonial {
  quote: string
  name: string
  business: string
}

// Real client quotes go here. The section stays hidden while the list is empty.
export const testimonials: Testimonial[] = []
