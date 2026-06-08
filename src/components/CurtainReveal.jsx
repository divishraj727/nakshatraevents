import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import s from './CurtainReveal.module.css'

/**
 * CurtainReveal
 *
 * Wraps any content. On scroll entry a gold bar sweeps left→right
 * across the element, then exits right, leaving content visible.
 *
 * Props:
 *   delay   — seconds before the wipe starts (default 0)
 *   once    — only fire once (default true)
 *   axis    — 'x' (horizontal wipe, default) | 'y' (vertical wipe top→bottom)
 *   className / style — forwarded to the outer wrapper
 */
export default function CurtainReveal({
  children,
  delay = 0,
  once = true,
  axis = 'x',
  className = '',
  style,
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once, margin: '-8% 0px' })

  const isX = axis === 'x'

  /* ── Curtain keyframe: slide IN then slide OUT ── */
  const curtainAnim = inView
    ? {
        [isX ? 'x' : 'y']: ['-101%', '0%', '0%', '101%'],
        opacity: 1,
      }
    : { [isX ? 'x' : 'y']: '-101%', opacity: 1 }

  /* ── Content becomes visible exactly when curtain is at full cover ── */
  const contentAnim = inView
    ? { opacity: 1, [isX ? 'y' : 'x']: 0 }
    : { opacity: 0, [isX ? 'y' : 'x']: isX ? 8 : 0 }

  const DURATION  = 0.82
  const MID       = 0.46   // fraction when curtain fully covers content

  return (
    <span ref={ref} className={`${s.wrapper} ${className}`} style={style}>
      {/* Gold curtain bar */}
      <motion.span
        className={s.curtain}
        aria-hidden="true"
        initial={{ [isX ? 'x' : 'y']: '-101%', opacity: 1 }}
        animate={curtainAnim}
        transition={{
          duration: DURATION,
          delay,
          times: [0, MID, MID + 0.04, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Actual content — invisible until curtain fully covers it */}
      <motion.span
        className={s.content}
        initial={{ opacity: 0 }}
        animate={contentAnim}
        transition={{
          opacity: { duration: 0.01, delay: delay + DURATION * MID },
          y: { duration: 0 },
          x: { duration: 0 },
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}
