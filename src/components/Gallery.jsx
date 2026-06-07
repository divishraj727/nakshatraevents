import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import s from './Gallery.module.css'

const CATEGORIES = ['All', 'Wedding', 'Mehandi', 'Corporate Event', 'Celebration', 'Photography']

const placeholders = [
  { id: 'p1', type: 'image', label: 'Wedding Ceremony', category: 'Wedding', gradient: 'A' },
  { id: 'p2', type: 'image', label: 'Mehandi Decor', category: 'Mehandi', gradient: 'B' },
  { id: 'p3', type: 'image', label: 'Stage Production', category: 'Wedding', gradient: 'C' },
  { id: 'p4', type: 'image', label: 'Corporate Gala', category: 'Corporate Event', gradient: 'D' },
  { id: 'p5', type: 'image', label: 'Themed Varmala', category: 'Wedding', gradient: 'E' },
  { id: 'p6', type: 'image', label: 'Sangeet Night', category: 'Wedding', gradient: 'F' },
  { id: 'p7', type: 'image', label: 'Birthday Setup', category: 'Celebration', gradient: 'A' },
  { id: 'p8', type: 'image', label: 'Product Launch', category: 'Corporate Event', gradient: 'B' },
  { id: 'p9', type: 'image', label: 'Candid Moments', category: 'Photography', gradient: 'C' },
]

function GalleryItem({ item, index, filter, onNavigate }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const isVideo = item.type === 'video'

  return (
    <motion.figure
      ref={ref}
      className={`${s.item} ${item.url ? '' : s['grad' + (item.gradient || 'A')]}`}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: (index % 3) * 0.07 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={() => onNavigate(filter)}
      style={{ cursor: 'pointer' }}
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
            muted
            loop
            playsInline
            onMouseEnter={e => e.target.play()}
            onMouseLeave={e => e.target.pause()}
          />
        ) : (
          <img src={item.url} alt={item.label || 'Event photo'} className={s.media} loading="lazy" />
        )
      ) : null}
      <div className={s.overlay} aria-hidden="true" />
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
        <motion.div
          ref={headerRef}
          className={s.header}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={s.heading}>The Work</h2>
          <p className={s.subhead}>
            Click any category to view the full collection. Upload event photographs
            via the admin panel to replace these placeholders.
          </p>
        </motion.div>

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
