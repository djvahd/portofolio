export interface Social {
  label: 'GitHub' | 'LinkedIn' | 'Instagram'
  url: string | null
}

export const profile: {
  name: string
  fullName: string
  tagline: string
  roles: { base: string; reveal: string }
  about: string
  skills: { dev: string[]; design: string[] }
  email: string | null
  socials: Social[]
  cv: { label: string; url: string }[]
} = {
  name: 'Adriel',
  fullName: 'Jovanic Adriel Harjanto',
  tagline: 'This is Me',
  roles: { base: 'Developer', reveal: 'Designer' },
  about:
    'Computer science student at Universitas Padjadjaran. I build products and lead the teams behind them: full-stack web, with design and multimedia on the side.',
  skills: {
    dev: [
      'Laravel & PHP',
      'React & TypeScript',
      'Node.js',
      'MySQL',
      'Tailwind CSS',
      'Google Apps Script',
    ],
    design: [
      'Graphic Design',
      'Photography & Videography',
      'Short Film',
      'Figma',
      'Adobe Photoshop, Illustrator, Premiere',
    ],
  },
  email: 'adrielharjanto@gmail.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/djvahd' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jovanicadrielharjanto/' },
    { label: 'Instagram', url: 'https://www.instagram.com/djvahd._/' },
  ],
  cv: [
    { label: 'CV (English)', url: '/cv/Jovanic-Adriel-Harjanto-CV-EN.docx' },
    { label: 'CV (Indonesia)', url: '/cv/Jovanic-Adriel-Harjanto-CV-ID.docx' },
  ],
}
