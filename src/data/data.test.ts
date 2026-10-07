import { profile } from './profile'
import { projects } from './projects'

describe('profile', () => {
  it('has the required identity fields', () => {
    expect(profile.name).toBe('Adriel')
    expect(profile.tagline).toBe('This is Me')
    expect(profile.roles).toEqual({ base: 'Developer', reveal: 'Designer' })
    expect(profile.about.length).toBeGreaterThan(20)
  })

  it('lists the four socials in order, with null or https urls', () => {
    expect(profile.socials.map((s) => s.label)).toEqual([
      'GitHub',
      'LinkedIn',
      'Instagram',
      'TikTok',
    ])
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

describe('projects', () => {
  it('contains exactly the four projects in order', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'arsipia',
      'smart-odong',
      'photobooth',
      'harmoni-clothing',
    ])
  })

  it('has complete fields and valid image/link shapes', () => {
    for (const p of projects) {
      expect(p.title).not.toBe('')
      expect(p.role).not.toBe('')
      expect(p.year).toMatch(/^\d{4}$/)
      expect(p.description).not.toBe('')
      expect(p.image).toBe(`/images/projects/${p.slug}.webp`)
      expect(p.liveUrl === null || p.liveUrl.startsWith('https://')).toBe(true)
    }
  })

  it('has unique slugs', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
  })
})
