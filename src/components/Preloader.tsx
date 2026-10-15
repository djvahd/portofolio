import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'

const KEY = 'preloader-seen'

function alreadySeen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function Preloader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !alreadySeen())

  useEffect(() => {
    if (!show) return
    if (reduce) {
      setShow(false)
      return
    }
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode: the intro just plays again next visit */
    }
    const t = setTimeout(() => setShow(false), 1400)
    return () => clearTimeout(t)
  }, [show, reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-fg text-bg"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="font-display text-[clamp(3rem,12vw,9rem)] font-semibold tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {profile.name}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
