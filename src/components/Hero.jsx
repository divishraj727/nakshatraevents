import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FloatingParticles from './FloatingParticles'
import s from './Hero.module.css'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.6 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

const lineDraw = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -60])
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      id="hero"
      ref={heroRef}
      className={s.hero}
      aria-label="Nakshatra Events — event planners across Karnataka"
    >
      {/* Parallax atmospheric background */}
      <div className={s.bg} aria-hidden="true">
        <motion.div className={s.orb1} style={{ y: orb1Y }} />
        <motion.div className={s.orb2} style={{ y: orb2Y }} />
        <div className={s.orb3} />
        <div className={s.gridOverlay} />
      </div>

      {/* Floating star particles */}
      <FloatingParticles count={32} />

      {/* Main content */}
      <motion.div
        className={s.content}
        style={{ y: contentY, opacity: contentOpacity }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={lineDraw} className={s.ruleRow} aria-hidden="true">
          <span className={s.ruleLine} />
          <span className={s.ruleStar}>✦</span>
          <span className={s.ruleLine} />
        </motion.div>

        <motion.p variants={fadeUp} className={s.eyebrow}>
          Est. 2021 &nbsp;·&nbsp; Karnataka's Premier Event House
        </motion.p>

        <motion.h1 variants={fadeUp} className={s.heading}>
          Transforming Moments,<br />Creating Memories
        </motion.h1>

        <motion.p variants={fadeUp} className={s.subhead}>
          From intimate mehandi ceremonies to grand wedding productions, Nakshatra Events
          crafts celebrations across Shimoga, Bangalore, Mysore, Mangalore and all of Karnataka
          that are felt long after the last guest leaves.
        </motion.p>

        <motion.div variants={fadeUp} className={s.actions}>
          <motion.a
            href="#contact"
            className={s.primaryBtn}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            Plan Your Event
          </motion.a>
          <motion.a
            href="#gallery"
            className={s.secondaryBtn}
            whileHover={{ scale: 1.02, borderColor: 'var(--ink)', color: 'var(--ink)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            View Our Work
          </motion.a>
        </motion.div>

        <motion.div variants={fadeUp} className={s.trustBar}>
          <span className={s.trustItem}><span className={s.trustNum}>500+</span> Events</span>
          <span className={s.trustDot} aria-hidden="true">✦</span>
          <span className={s.trustItem}><span className={s.trustNum}>4+</span> Years</span>
          <span className={s.trustDot} aria-hidden="true">✦</span>
          <span className={s.trustItem}><span className={s.trustNum}>20+</span> Cities</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className={s.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.span
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >↓</motion.span>
      </motion.div>
    </section>
  )
}
