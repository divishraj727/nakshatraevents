import { useMemo } from 'react'
import { motion } from 'framer-motion'
import s from './FloatingParticles.module.css'

export default function FloatingParticles({ count = 28 }) {
  const particles = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 10,
      opacity: Math.random() * 0.4 + 0.1,
    }))
  ), [count])

  return (
    <div className={s.container} aria-hidden="true">
      {particles.map(p => (
        <motion.span
          key={p.id}
          className={s.particle}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          initial={{ y: '105vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}
    </div>
  )
}
