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
    description: 'A digital archive that keeps records organized and easy to find.',
    image: '/images/projects/arsipia.webp',
    liveUrl: null,
  },
  {
    slug: 'smart-odong',
    title: 'Smart Odong Campus System',
    role: 'Developer & Designer',
    year: '2026',
    description: 'A smart campus shuttle (odong-odong) system for Jatinangor.',
    image: '/images/projects/smart-odong.webp',
    liveUrl: null,
  },
  {
    slug: 'photobooth',
    title: 'Photobooth',
    role: 'Developer & Designer',
    year: '2026',
    description: 'A web photobooth that captures, frames, and saves photos in the browser.',
    image: '/images/projects/photobooth.webp',
    liveUrl: null,
  },
  {
    slug: 'harmoni-clothing',
    title: 'Harmoni Clothing',
    role: 'Developer & Designer',
    year: '2026',
    description: 'An online storefront and brand presence for a clothing label.',
    image: '/images/projects/harmoni-clothing.webp',
    liveUrl: null,
  },
]
