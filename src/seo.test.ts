import { existsSync, readFileSync } from 'node:fs'

const html = readFileSync('index.html', 'utf-8')
const meta = (attr: string) => html.match(new RegExp(String.raw`${attr}"\s+content="([^"]+)"`))?.[1]

it('has a client-facing title and description', () => {
  expect(html).toMatch(/<title>[^<]*small businesses[^<]*<\/title>/)
  expect(meta('name="description')).toMatch(/small businesses/)
})

it('has Open Graph tags with an image that exists', () => {
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image']) {
    expect(meta(`property="${p}`)).toBeTruthy()
  }
  const image = new URL(meta('property="og:image')!).pathname
  expect(existsSync(`public${image}`)).toBe(true)
})

it('points robots.txt at the sitemap, which lists the canonical URL', () => {
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
  expect(readFileSync('public/robots.txt', 'utf-8')).toContain(`Sitemap: ${canonical}sitemap.xml`)
  expect(readFileSync('public/sitemap.xml', 'utf-8')).toContain(`<loc>${canonical}</loc>`)
})
