import { useEffect, useState } from 'react'

const QUERIES = ['(pointer: fine)', '(prefers-reduced-motion: no-preference)']

function compute(): boolean {
  return QUERIES.every((q) => window.matchMedia(q).matches)
}

export function useInteractive(): boolean {
  const [interactive, setInteractive] = useState(compute)

  useEffect(() => {
    const lists = QUERIES.map((q) => window.matchMedia(q))
    const update = () => setInteractive(compute())
    lists.forEach((l) => l.addEventListener('change', update))
    return () => lists.forEach((l) => l.removeEventListener('change', update))
  }, [])

  return interactive
}
