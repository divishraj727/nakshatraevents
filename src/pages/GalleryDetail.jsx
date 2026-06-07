import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import s from './GalleryDetail.module.css'

export default function GalleryDetail() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  const displayName = decodeURIComponent(category || '')

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.ok ? r.json() : [])
      .then(all => {
        const filtered = displayName === 'All'
          ? all
          : all.filter(i => i.category === displayName)
        setItems(filtered)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [displayName])

  const close = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox(i => (i - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() => setLightbox(i => (i + 1) % items.length), [items.length])

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next, close])

  return (
    <div className={s.page}>
      {/* Header */}
      <motion.header
        className={s.header}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className={s.back} onClick={() => navigate('/#gallery')} aria-label="Back to gallery">
          ← Back
        </button>
        <div className={s.headerText}>
          <h1 className={s.heading}>{displayName}</h1>
          <p className={s.count}>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </motion.header>

      <main className={s.main}>
        {loading ? (
          <div className={s.loadState}>
            <motion.div className={s.spinner} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
          </div>
        ) : items.length === 0 ? (
          <motion.div
            className={s.empty}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            <p>No media uploaded for <strong>{displayName}</strong> yet.</p>
            <p className={s.emptySub}>Upload images and videos via the admin panel.</p>
          </motion.div>
        ) : (
          <motion.div
            className={s.grid}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {items.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} onClick={() => setLightbox(i)} />
            ))}
          </motion.div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <motion.div
            className={s.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className={s.lightboxInner}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {items[lightbox].type === 'video' ? (
                <video
                  src={items[lightbox].url}
                  className={s.lightboxMedia}
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <img
                  src={items[lightbox].url}
                  alt={items[lightbox].label || 'Event photo'}
                  className={s.lightboxMedia}
                />
              )}
              <p className={s.lightboxCaption}>
                {items[lightbox].label || displayName}
                <span className={s.lightboxCounter}>{lightbox + 1} / {items.length}</span>
              </p>
            </motion.div>

            <button className={`${s.lbNav} ${s.lbPrev}`} onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous">‹</button>
            <button className={`${s.lbNav} ${s.lbNext}`} onClick={e => { e.stopPropagation(); next() }} aria-label="Next">›</button>
            <button className={s.lbClose} onClick={close} aria-label="Close">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GalleryCard({ item, index, onClick }) {
  const isVideo = item.type === 'video'
  const gradients = ['gradA', 'gradB', 'gradC', 'gradD', 'gradE', 'gradF']
  const grad = gradients[index % gradients.length]

  return (
    <motion.figure
      className={`${s.card} ${s[grad]}`}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] } },
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {item.url ? (
        isVideo ? (
          <video src={item.url} className={s.media} muted preload="metadata" playsInline />
        ) : (
          <img src={item.url} alt={item.label || 'Event photo'} className={s.media} loading="lazy" />
        )
      ) : null}
      <div className={s.overlay} />
      {isVideo && <span className={s.playIcon} aria-hidden="true">▶</span>}
      <figcaption className={s.caption}>
        {item.label && <span className={s.captionTitle}>{item.label}</span>}
      </figcaption>
    </motion.figure>
  )
}
