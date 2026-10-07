export interface Social {
  label: 'GitHub' | 'LinkedIn' | 'Instagram' | 'TikTok'
  url: string | null
}

export const profile: {
  name: string
  tagline: string
  roles: { base: string; reveal: string }
  about: string
  skills: { dev: string[]; design: string[] }
  email: string | null
  socials: Social[]
} = {
  name: 'Adriel',
  tagline: 'This is Me',
  roles: { base: 'Developer', reveal: 'Designer' },
  about:
    'I build systems and shape the interfaces people use to reach them. I like calm, considered work where the engineering and the design pull in the same direction.',
  skills: {
    dev: ['React', 'TypeScript', 'Google Apps Script', 'HTML & CSS'],
    design: ['UI / UX', 'Branding', 'Figma', 'Blender (3D)'],
  },
  email: null,
  socials: [
    { label: 'GitHub', url: null },
    { label: 'LinkedIn', url: null },
    { label: 'Instagram', url: null },
    { label: 'TikTok', url: null },
  ],
}
