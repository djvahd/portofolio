import { act, render } from '@testing-library/react'
import { Nav } from './Nav'

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('Nav', () => {
  let workTop = 900

  beforeEach(() => {
    const hero = document.body.appendChild(document.createElement('section'))
    hero.id = 'top'
    Object.defineProperty(hero, 'offsetHeight', { value: 2000 })
    const work = document.body.appendChild(document.createElement('section'))
    work.id = 'work'
    work.getBoundingClientRect = () => ({ top: workTop }) as DOMRect
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    workTop = 900
  })

  afterEach(() => {
    document.body.innerHTML = ''
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  it('takes the hero theme first, then the opposite theme once the hero scroll flips it', () => {
    const { container } = render(<Nav theme="dark" onToggle={() => {}} />)
    const header = container.querySelector('header')
    expect(header).toHaveAttribute('data-theme', 'dark')
    scrollTo(200) // before the flip (a quarter of the 1200px pinned scroll is 300px)
    expect(header).toHaveAttribute('data-theme', 'dark')
    scrollTo(400)
    expect(header).toHaveAttribute('data-theme', 'light')
  })

  it('names the theme of the section it sits on, while a click still switches the page', () => {
    const onToggle = vi.fn()
    const { container } = render(<Nav theme="dark" onToggle={onToggle} />)
    const toggle = container.querySelector('button') as HTMLButtonElement
    expect(toggle).toHaveTextContent('dark') // over the dark hero
    expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme')
    scrollTo(400)
    expect(toggle).toHaveTextContent('light') // over the light section below
    expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme') // the page is still dark
    toggle.click()
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('carries the hero liquid over the header, but only at the start of the hero scroll', () => {
    const { container } = render(<Nav theme="dark" onToggle={() => {}} />)
    const mirror = () => container.querySelector('[data-lens-mirror]')
    expect(mirror()).not.toBeNull() // at the very top
    expect(mirror()).toHaveAttribute('aria-hidden', 'true')
    scrollTo(400) // the lens layer has long since faded out
    expect(mirror()).toBeNull()
  })

  it('becomes a semi-transparent bar from the work section on', () => {
    const { container } = render(<Nav theme="light" onToggle={() => {}} />)
    const header = container.querySelector('header')
    expect(header?.className).not.toContain('backdrop-blur')
    workTop = 40
    scrollTo(1300)
    expect(header?.className).toContain('color-mix')
    expect(header?.className).toContain('backdrop-blur')
  })
})
