export interface Project {
  slug: string
  title: string
  role: string
  year: string
  description: string
  image: string
  liveUrl: string | null
  /** 'demo' sites are built for clients like the visitor; 'other' is earlier work */
  kind: 'demo' | 'other'
  note: string | null
  caseStudy: { problem: string; built: string; result: string } | null
}

export const projects: Project[] = [
  {
    slug: 'demo-physio',
    title: 'Brightmove Physio',
    role: 'Design & build',
    year: '2026',
    description: 'A booking-first website for a physiotherapy clinic in Perth.',
    image: '/images/projects/demo-physio.webp',
    liveUrl: '/demos/physio/',
    kind: 'demo',
    note: 'Demo, fictional clinic',
    caseStudy: {
      problem:
        'Clinic sites often hide the phone number and make new patients call during work hours to book.',
      built:
        'One page with treatments and prices, health-fund details, the next free times, a one-minute booking request and a call button that stays on screen on phones.',
      result:
        'Lighthouse mobile performance 100/100, on screen in about 1 second. The whole page is under 5 KB, with no images, fonts or libraries to wait for.',
    },
  },
  {
    slug: 'demo-renovations',
    title: 'Tallwood Renovations',
    role: 'Design & build',
    year: '2026',
    description: 'A quote-request website for a kitchen and bathroom renovator in Brisbane.',
    image: '/images/projects/demo-renovations.webp',
    liveUrl: '/demos/renovations/',
    kind: 'demo',
    note: 'Demo, fictional builder',
    caseStudy: {
      problem:
        'Homeowners contact three or four builders and go with the one that looks trustworthy and talks price first.',
      built:
        "Services with 'from' prices, a four-step process, recent jobs, service areas and a quote form that asks for suburb, job type and budget up front.",
      result:
        'Every quote request arrives with what the builder needs to price the job. Lighthouse mobile performance 100/100, on screen in about 1 second.',
    },
  },
  {
    slug: 'demo-cafe',
    title: 'Saltbush Cafe',
    role: 'Design & build',
    year: '2026',
    description: 'A menu and table-booking website for a neighbourhood cafe in Sydney.',
    image: '/images/projects/demo-cafe.webp',
    liveUrl: '/demos/cafe/',
    kind: 'demo',
    note: 'Demo, fictional cafe',
    caseStudy: {
      problem:
        'Cafe menus are often a PDF or an Instagram photo that is hard to read on a phone and invisible to Google.',
      built:
        'The menu as real text with prices and dietary tags, a catering offer, table bookings, and opening hours on the first screen.',
      result:
        'Customers can read the menu and book a table in under a minute. Lighthouse mobile performance 100/100, on screen in about 1 second.',
    },
  },
  {
    slug: 'arsipia',
    title: 'Arsipia',
    role: 'Developer, team of 3',
    year: '2026',
    description:
      'Automation on top of Google Drive that keeps files tidy and keeps knowledge with the team when people leave. Built for offices, startups and campuses.',
    image: '/images/projects/arsipia.webp',
    liveUrl: 'https://arsipia.netlify.app/',
    kind: 'other',
    note: 'Site in Indonesian',
    caseStudy: null,
  },
  {
    slug: 'photobooth',
    title: 'Photobooth',
    role: 'Developer & Designer',
    year: '2026',
    description:
      "A browser photobooth for a client's event. Guests take their photos on the spot and every photo uploads automatically.",
    image: '/images/projects/photobooth.webp',
    liveUrl: 'https://photobooth-webapp.netlify.app/',
    kind: 'other',
    note: 'Site in Indonesian',
    caseStudy: null,
  },
  {
    slug: 'harmoni-clothing',
    title: 'Harmoni Clothing',
    role: 'Developer & Designer, demo stage',
    year: '2026',
    description:
      'An online store for custom clothing with no minimum order, for creators, brands and communities.',
    image: '/images/projects/harmoni-clothing.webp',
    liveUrl: 'https://harmoniclothing.com/',
    kind: 'other',
    note: 'Site in Indonesian',
    caseStudy: null,
  },
]
