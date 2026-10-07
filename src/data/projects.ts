export interface Project {
  slug: string
  title: string
  role: string
  year: string
  description: string
  image: string
  liveUrl: string | null
}

export const projects: Project[] = [
  {
    slug: 'arsipia',
    title: 'Arsipia',
    role: 'Developer & Designer',
    year: '2026',
    description:
      'An automation layer on top of Google Drive that organizes files and passes knowledge between generations of student organization boards.',
    image: '/images/projects/arsipia.webp',
    liveUrl: null,
  },
  {
    slug: 'smart-odong',
    title: 'Smart Odong Campus System',
    role: 'Developer & Designer',
    year: '2026',
    description:
      'A smart campus shuttle app with live shuttle status, passenger load, stops, and ride history.',
    image: '/images/projects/smart-odong.webp',
    liveUrl: null,
  },
  {
    slug: 'photobooth',
    title: 'Photobooth',
    role: 'Developer & Designer',
    year: '2026',
    description:
      'A web photobooth built for the Rewind Forum OSIS Jawa Tengah 2026 event, with every photo uploaded automatically.',
    image: '/images/projects/photobooth.webp',
    liveUrl: 'https://photobooth-webapp.netlify.app/',
  },
  {
    slug: 'harmoni-clothing',
    title: 'Harmoni Clothing',
    role: 'Developer & Designer',
    year: '2026',
    description:
      'A modern clothing platform for creators, brands, and communities: custom design with no minimum order.',
    image: '/images/projects/harmoni-clothing.webp',
    liveUrl: 'https://harmoniclothing.com/',
  },
]
