import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import s from './Nav.module.css'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={`${s.nav} ${scrolled ? s.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        <a href="#hero" className={s.logo}>
          <span className={s.logoStar} aria-hidden="true">✦</span>
          Nakshatra Events
        </a>

        <nav className={s.links} aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} className={s.link}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className={s.cta}>
            Plan Your Event
          </a>
        </nav>

        <button
          className={s.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${s.bar} ${menuOpen ? s.b1 : ''}`} />
          <span className={`${s.bar} ${menuOpen ? s.b2 : ''}`} />
          <span className={`${s.bar} ${menuOpen ? s.b3 : ''}`} />
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={s.mobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className={s.mobileLinks} aria-label="Mobile navigation">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={s.mobileLink}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.07,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className={s.mobileCta}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + links.length * 0.07,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Plan Your Event
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
