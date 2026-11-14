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
}

export const projects: Project[] = [
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
  },
]
