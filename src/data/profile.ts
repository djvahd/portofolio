export interface Social {
  label: 'GitHub' | 'LinkedIn' | 'Instagram'
  url: string | null
}

export const profile: {
  name: string
  fullName: string
  tagline: string
  roles: { base: string; reveal: string }
  about: string[]
  location: string
  skills: { dev: string[]; design: string[] }
  email: string | null
  formEndpoint: string | null
  bookingUrl: string | null
  socials: Social[]
  cv: { label: string; url: string }[]
} = {
  name: 'Adriel',
  fullName: 'Jovanic Adriel Harjanto',
  tagline: 'This is Me',
  roles: { base: 'Developer', reveal: 'Designer' },
  about: [
    "I'm Adriel, a web developer and designer studying computer science at Universitas Padjadjaran in Indonesia. I build fast, mobile-first websites for small businesses: clear about what you offer, easy to contact you from, and quick to load on a phone.",
    "I've also led a 45-person student council and a 40-person city student forum, so I'm used to deadlines and keeping people updated. The full story is in my CV.",
  ],
  location: 'Based in Indonesia, GMT+7: 1 hour behind Perth and Singapore.',
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
  // A Formspree-style endpoint (POST, JSON reply). While null the form opens a prefilled email.
  formEndpoint:
    'https://script.google.com/macros/s/AKfycbypxMSkcq2W5njnwL8fZgBXwZYka2MHMN0kPEtKURdf7IR1U1F793adp1lX6oR8_OTaAA/exec',
  // e.g. a Calendly or Cal.com link; the "book a call" link shows once this is set
  bookingUrl: null,
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
