import { useRef, useState, useEffect } from 'react'
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring, useTransform,
} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CurtainReveal from './CurtainReveal'
import s from './Gallery.module.css'

const BASE = 'https://nakshatraweddingandevents.in/wp-content/uploads'

const CATEGORIES = ['All', 'Wedding', 'Mehandi', 'Corporate Event', 'Celebration', 'Photography']

const placeholders = [
  { id: 'p1',  type: 'image', url: `${BASE}/2023/07/Patrick-Felicia.jpg`,                                    label: 'Wedding Ceremony',       category: 'Wedding' },
  { id: 'p2',  type: 'image', url: `${BASE}/2023/07/iiiiiiiiii-891x1024-1.jpg`,                             label: 'Bridal Portrait',        category: 'Wedding' },
  { id: 'p3',  type: 'image', url: `${BASE}/2023/06/1-2.jpg`,                                               label: 'Wedding Decor',          category: 'Wedding' },
  { id: 'p4',  type: 'image', url: `${BASE}/2023/06/2-2.jpg`,                                               label: 'Stage Setup',            category: 'Wedding' },
  { id: 'p5',  type: 'image', url: `${BASE}/2023/06/3-2.jpg`,                                               label: 'Celebration Moments',    category: 'Wedding' },
  { id: 'p6',  type: 'image', url: `${BASE}/2023/06/4-1.jpg`,                                               label: 'Floral Arrangements',    category: 'Wedding' },
  { id: 'p7',  type: 'image', url: `${BASE}/2023/07/mehandi-function-photography-services.jpeg`,            label: 'Mehandi Ceremony',       category: 'Mehandi' },
  { id: 'p11', type: 'image', url: `${BASE}/2023/07/band-or-dj-for-wedding-reception.webp`,                 label: 'DJ & Sangeet Night',     category: 'Celebration' },
  { id: 'p12', type: 'image', url: `${BASE}/2023/07/60a10ef1f1d351621167857.jpeg`,                          label: 'Birthday Celebration',   category: 'Celebration' },
  { id: 'p13', type: 'image', url: `${BASE}/2023/06/devendran-events-ameerpet-hyderabad-event-organisers-for-birthday-party-s99wy617eu.webp`, label: 'Birthday Setup', category: 'Celebration' },
  { id: 'p15', type: 'image', url: `${BASE}/2023/07/Screenshot_28.png`,                                     label: 'Product Launch',         category: 'Corporate Event' },
  { id: 'p16', type: 'image', url: `${BASE}/2023/07/Screenshot_27.png`,                                     label: 'Corporate Event',        category: 'Corporate Event' },
  { id: 'p17', type: 'image', url: `${BASE}/2023/07/Screenshot_109.png`,                                    label: 'Corporate Gala',         category: 'Corporate Event' },
  { id: 'p19', type: 'image', url: `${BASE}/2023/07/WhatsApp-Image-2023-06-09-at-11.38.33-AM-1-1.jpeg`,    label: 'Candid Moments',         category: 'Photography' },
  { id: 'p20', type: 'image', url: `${BASE}/2023/07/WhatsApp-Image-2023-06-09-at-11.38.33-AM-1.jpeg`,      label: 'Event Highlights',       category: 'Photography' },
  { id: 'p21', type: 'image', url: `${BASE}/2023/07/971104_538433389551280_1749892374_n.jpg`,               label: 'Special Moments',        category: 'Photography' },
  { id: 'p22', type: 'image', url: `${BASE}/2023/07/WhatsApp-Image-2023-06-09-at-11.33.34-AM-1-1.jpeg`,    label: 'Behind the Scenes',      category: 'Photography' },
  { id: 'p23', type: 'image', url: `${BASE}/2023/06/WhatsApp-Image-2023-06-09-at-11.33.32-AM-1-1.jpeg`,    label: 'Team at Work',           category: 'Photography' },
  { id: 'p24', type: 'image', url: `${BASE}/2023/06/WhatsApp-Image-2023-06-09-at-11.33.32-AM-1.jpeg`,      label: 'Event Setup',            category: 'Photography' },
]

const MAX_TILT = 14   // degrees

function GalleryItem({ item, index, filter, onNavigate }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const isVideo = item.type === 'video'

  /* ── Tilt motion values ── */
  const rotX    = useMotionValue(0)
  const rotY    = useMotionValue(0)
  const glareX  = useMotionValue(50)
  const glareY  = useMotionValue(50)
  const glareOp = useMotionValue(0)

  const springCfg = { stiffness: 200, damping: 28, mass: 0.5 }
  const sRotX  = useSpring(rotX,    springCfg)
  const sRotY  = useSpring(rotY,    springCfg)
  const sGlare = useSpring(glareOp, { stiffness: 160, damping: 24 })

  /* Combine glare X/Y into a single gradient string */
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,248,200,0.22) 0%, rgba(255,220,100,0.06) 35%, transparent 60%)`
  )

  /* rAF throttle — only update motion values once per frame */
  const rafPending  = useRef(false)
  const pendingMove = useRef({ x: 0, y: 0 })

  const handleMove = (e) => {
    pendingMove.current = { x: e.clientX, y: e.clientY }
    if (rafPending.current) return
    rafPending.current = true
    requestAnimationFrame(() => {
      rafPending.current = false
      const el = ref.current
      if (!el) return
      const { left, top, width, height } = el.getBoundingClientRect()
      const xNorm = (pendingMove.current.x - left) / width  - 0.5
      const yNorm = (pendingMove.current.y - top)  / height - 0.5
      rotX.set(-yNorm * MAX_TILT)
      rotY.set( xNorm * MAX_TILT)
      glareX.set((xNorm + 0.5) * 100)
      glareY.set((yNorm + 0.5) * 100)
      glareOp.set(1)
    })
  }

  const handleLeave = () => {
    rafPending.current = false
    rotX.set(0)
    rotY.set(0)
    glareOp.set(0)
  }

  return (
    <motion.figure
      ref={ref}
      className={`${s.item} ${item.url ? '' : s['grad' + (item.gradient || 'A')]}`}
      style={{
        perspective: 900,
        rotateX: sRotX,
        rotateY: sRotY,
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: (index % 3) * 0.07 }}
      whileHover={{ scale: 1.04, zIndex: 2 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onNavigate(filter)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onNavigate(filter)}
      aria-label={`View all ${filter === 'All' ? '' : filter} gallery photos`}
    >
      {item.url ? (
        isVideo ? (
          <video
            src={item.url}
            className={s.media}
            muted loop playsInline
            onMouseEnter={e => e.target.play()}
            onMouseLeave={e => e.target.pause()}
          />
        ) : (
          <img src={item.url} alt={item.label || 'Event photo'} className={s.media} loading="lazy" />
        )
      ) : null}
      <div className={s.overlay} aria-hidden="true" />

      {/* Gold glare highlight that tracks cursor */}
      <motion.div
        className={s.glare}
        style={{ background: glareBg, opacity: sGlare }}
        aria-hidden="true"
      />

      <figcaption className={s.caption}>
        <span>{item.label}</span>
        {item.category && <span className={s.captionTag}>{item.category}</span>}
      </figcaption>
      {isVideo && <span className={s.videoIcon} aria-hidden="true">▶</span>}
    </motion.figure>
  )
}

export default function Gallery() {
  const [apiItems, setApiItems] = useState([])
  const [filter, setFilter] = useState('All')
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.ok ? r.json() : [])
      .then(setApiItems)
      .catch(() => setApiItems([]))
  }, [])

  const allItems = apiItems.length > 0 ? apiItems : placeholders
  const filtered = filter === 'All' ? allItems : allItems.filter(i => i.category === filter)

  const handleNavigate = (cat) => {
    navigate(`/gallery/${encodeURIComponent(cat)}`)
  }

  return (
    <section id="gallery" className={s.section} aria-label="Event gallery">
      <div className={s.inner}>
        <div ref={headerRef} className={s.header}>
          <h2 className={s.heading}>
            <CurtainReveal><span>The Work</span></CurtainReveal>
          </h2>
          <p className={s.subhead}>
            <CurtainReveal delay={0.18}>
              <span>A glimpse of events crafted across Karnataka. Click any category to view the full collection.</span>
            </CurtainReveal>
          </p>
        </div>

        <div className={s.filters} role="tablist" aria-label="Filter gallery by category">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              className={`${s.filterBtn} ${filter === cat ? s.filterActive : ''}`}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className={s.grid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {filtered.map((item, i) => (
              <GalleryItem
                key={item.id}
                item={item}
                index={i}
                filter={filter}
                onNavigate={handleNavigate}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className={s.cta}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.button
            className={s.ctaBtn}
            onClick={() => handleNavigate('All')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            View Full Gallery
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
