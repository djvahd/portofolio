import { existsSync } from 'node:fs'
import { profile } from './profile'
import { projects } from './projects'

describe('profile', () => {
  it('has the required identity fields', () => {
    expect(profile.name).toBe('Adriel')
    expect(profile.offer.length).toBeGreaterThan(20)
    expect(profile.roles).toEqual({ base: 'Developer', reveal: 'Designer' })
    expect(profile.about.join(' ').length).toBeGreaterThan(20)
  })

  it('lists the three socials in order, with null or https urls', () => {
    expect(profile.socials.map((s) => s.label)).toEqual(['GitHub', 'LinkedIn', 'Instagram'])
    for (const s of profile.socials) {
      expect(s.url === null || s.url.startsWith('https://')).toBe(true)
    }
  })

  it('has skills for both dev and design', () => {
    expect(profile.skills.dev.length).toBeGreaterThan(0)
    expect(profile.skills.design.length).toBeGreaterThan(0)
  })

  it('has a null or valid email', () => {
    expect(profile.email === null || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.email)).toBe(true)
  })
})

describe('cv downloads', () => {
  it('points at files that exist in public/cv', () => {
    for (const c of profile.cv) {
      expect(existsSync(`public${c.url}`)).toBe(true)
    }
  })
})

describe('projects', () => {
  it('contains exactly these projects in order, with no Smart Odong', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'demo-physio',
      'demo-renovations',
      'demo-cafe',
      'arsipia',
      'photobooth',
      'harmoni-clothing',
    ])
  })

  it('gives every business demo a page in public/demos and a case study', () => {
    const demos = projects.filter((p) => p.kind === 'demo')
    expect(demos.length).toBeGreaterThanOrEqual(2)
    for (const p of demos) {
      expect(existsSync(`public${p.liveUrl}index.html`)).toBe(true)
      expect(p.caseStudy?.result).toBeTruthy()
    }
  })

  it('puts demos for businesses before other work', () => {
    const kinds = projects.map((p) => p.kind)
    expect(kinds).toEqual([...kinds].sort())
  })

  it('has complete fields and valid image/link shapes', () => {
    for (const p of projects) {
      expect(p.title).not.toBe('')
      expect(p.role).not.toBe('')
      expect(p.year).toMatch(/^\d{4}$/)
      expect(p.description).not.toBe('')
      expect(p.image).toBe(`/images/projects/${p.slug}.webp`)
      expect(existsSync(`public${p.image}`)).toBe(true)
      expect(p.liveUrl === null || /^(https:\/\/|\/demos\/)/.test(p.liveUrl)).toBe(true)
    }
  })

  it('has unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
  })
})
