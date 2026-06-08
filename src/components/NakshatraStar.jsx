import { useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useVelocity,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from 'framer-motion'
import s from './NakshatraStar.module.css'

/* ── 8-point star polygon points (cx=50, cy=50, R=40, r=17) ── */
const STAR_OUTER =
  '50,10 56.5,34.3 78.3,21.7 65.7,43.5 90,50 65.7,56.5 78.3,78.3 56.5,65.7 50,90 43.5,65.7 21.7,78.3 34.3,56.5 10,50 34.3,43.5 21.7,21.7 43.5,34.3'

/* Inner star is the same shape scaled to 0.6, R=24, r=10 */
const STAR_INNER =
  '50,26 53.9,40.6 67,34.2 59.4,46.1 74,50 59.4,53.9 67,65.8 53.9,59.4 50,74 46.1,59.4 33,65.8 40.6,53.9 26,50 40.6,46.1 33,34.2 46.1,40.6'

export default function NakshatraStar() {
  const [burst, setBurst] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  /* ── Scroll velocity ── */
  const { scrollY } = useScroll()
  const rawVelocity = useVelocity(scrollY)
  const velocity = useSpring(rawVelocity, { stiffness: 40, damping: 18 })

  /* ── Continuous rotation via motion value ── */
  const rotation = useMotionValue(0)

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return
    const vel = velocity.get()
    // Base: ~8 RPM; scroll boosts up to ×3
    const baseRad = (8 / 60) * (delta / 1000) * 360
    const boost = Math.min(Math.abs(vel) * 0.00018, 2)
    const dir = vel < -80 ? -1 : 1
    rotation.set(rotation.get() + baseRad * (1 + boost) * dir)
  })

  /* ── Glow intensity from scroll speed ── */
  const absVel = useTransform(velocity, (v) => Math.abs(v))
  const glowScale = useTransform(absVel, [0, 600], [1, 1.55])
  const glowOpacity = useTransform(absVel, [0, 600], [0.45, 0.85])

  /* ── Click: starburst ── */
  function handleClick() {
    setBurst(true)
    setTimeout(() => setBurst(false), 550)
  }

  return (
    <motion.div
      className={s.wrapper}
      onClick={handleClick}
      whileHover={{ scale: 1.14 }}
      whileTap={{ scale: 0.92 }}
      role="button"
      tabIndex={0}
      aria-label="Nakshatra star"
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* ── Ambient glow ── */}
      <motion.div
        className={s.glow}
        style={{ scale: glowScale, opacity: glowOpacity }}
      />

      {/* ── Burst flash on click ── */}
      <motion.div
        className={s.burst}
        animate={{ scale: burst ? [1, 2.2] : 1, opacity: burst ? [0.7, 0] : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Rotating star ── */}
      <motion.div style={{ rotate: rotation }} className={s.starWrap}>
        <svg
          viewBox="0 0 100 100"
          className={s.svg}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="ns-main" cx="35%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#FFF0B0" />
              <stop offset="40%" stopColor="#E8B840" />
              <stop offset="100%" stopColor="#A07020" />
            </radialGradient>
            <radialGradient id="ns-inner" cx="40%" cy="35%" r="68%">
              <stop offset="0%" stopColor="#FFFADC" />
              <stop offset="55%" stopColor="#F5CE50" />
              <stop offset="100%" stopColor="#C89030" />
            </radialGradient>
            <radialGradient id="ns-center" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFF0A0" />
              <stop offset="100%" stopColor="#F0C840" />
            </radialGradient>
            <filter id="ns-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>

          {/* Soft diffuse glow behind star */}
          <polygon
            points={STAR_OUTER}
            fill="rgba(255,210,80,0.18)"
            filter="url(#ns-blur)"
            transform="scale(1.18) translate(-7.6,-7.6)"
          />

          {/* 8 ray lines */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const x1 = 50 + 22 * Math.cos(angle)
            const y1 = 50 + 22 * Math.sin(angle)
            const x2 = 50 + 46 * Math.cos(angle)
            const y2 = 50 + 46 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,220,100,0.22)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            )
          })}

          {/* Main 8-point star */}
          <polygon points={STAR_OUTER} fill="url(#ns-main)" />

          {/* Inner accent star (slightly rotated 22.5°) */}
          <polygon
            points={STAR_INNER}
            fill="url(#ns-inner)"
            opacity="0.75"
            transform="rotate(22.5, 50, 50)"
          />

          {/* Center circle */}
          <circle cx="50" cy="50" r="7.5" fill="url(#ns-center)" />
          <circle cx="50" cy="50" r="3.5" fill="white" opacity="0.92" />

          {/* 8 small dots at outer points */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            return (
              <circle
                key={i}
                cx={50 + 40 * Math.cos(rad - Math.PI / 2)}
                cy={50 + 40 * Math.sin(rad - Math.PI / 2)}
                r="1.8"
                fill="rgba(255,245,200,0.9)"
              />
            )
          })}
        </svg>
      </motion.div>

      {/* ── Pulse ring ── */}
      <motion.div
        className={s.ring}
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.55, 1], opacity: [0.35, 0, 0.35] }
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Second staggered ring ── */}
      <motion.div
        className={s.ring}
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.7, 1], opacity: [0.2, 0, 0.2] }
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </motion.div>
  )
}
