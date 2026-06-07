import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import s from './AdminDashboard.module.css'

/* ── helpers ── */
const api = (path, opts = {}) => {
  const token = localStorage.getItem('ne_admin_token')
  return fetch(path, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
}

/* ── Event form ── */
const EMPTY_EVENT = { title: '', date: '', location: '', category: '', description: '' }
const EVENT_CATS = ['Wedding', 'Mehandi', 'DJ & Sangeet', 'Corporate Event', 'Product Launch', 'Photography', 'Celebration', 'Workshop', 'Other']

function EventsTab() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(EMPTY_EVENT)
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState('')

  const load = () => api('/api/events').then(r => r.json()).then(setEvents).catch(() => {})

  useEffect(() => { load() }, [])

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000) }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.location) { flash('Title, date, and location are required.'); return }
    if (editing) {
      await api(`/api/events/${editing}`, { method: 'PUT', body: JSON.stringify(form) })
      flash('Event updated.')
      setEditing(null)
    } else {
      await api('/api/events', { method: 'POST', body: JSON.stringify(form) })
      flash('Event created.')
    }
    setForm(EMPTY_EVENT)
    load()
  }

  const handleEdit = (ev) => {
    setEditing(ev.id)
    setForm({ title: ev.title, date: ev.date, location: ev.location, category: ev.category || '', description: ev.description || '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    await api(`/api/events/${id}`, { method: 'DELETE' })
    flash('Event deleted.')
    load()
  }

  return (
    <div className={s.tabContent}>
      <h2 className={s.tabHeading}>{editing ? 'Edit Event' : 'New Event'}</h2>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.row2}>
          <div className={s.fieldGroup}>
            <label className={s.label}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={s.input} placeholder="Wedding of Priya & Rahul" />
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} className={s.input} />
          </div>
        </div>
        <div className={s.row2}>
          <div className={s.fieldGroup}>
            <label className={s.label}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} className={s.input} placeholder="Shimoga / Bangalore" />
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={s.select}>
              <option value="">Select category</option>
              {EVENT_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={s.textarea} rows={3} />
        </div>
        <div className={s.formActions}>
          <motion.button type="submit" className={s.btn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
            {editing ? 'Save Changes' : 'Create Event'}
          </motion.button>
          {editing && (
            <button type="button" className={s.btnGhost} onClick={() => { setEditing(null); setForm(EMPTY_EVENT) }}>
              Cancel
            </button>
          )}
        </div>
        {msg && <p className={s.flashMsg}>{msg}</p>}
      </form>

      <h2 className={s.tabHeading} style={{ marginTop: '2.5rem' }}>All Events ({events.length})</h2>
      {events.length === 0 ? (
        <p className={s.empty}>No events yet. Create one above.</p>
      ) : (
        <div className={s.eventList}>
          {events.map(ev => (
            <div key={ev.id} className={s.eventRow}>
              <div className={s.eventInfo}>
                <p className={s.eventTitle}>{ev.title}</p>
                <p className={s.eventMeta}>{ev.date} · {ev.location}{ev.category ? ` · ${ev.category}` : ''}</p>
                {ev.description && <p className={s.eventDesc}>{ev.description}</p>}
              </div>
              <div className={s.eventActions}>
                <button className={s.iconBtn} onClick={() => handleEdit(ev)} aria-label="Edit">Edit</button>
                <button className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={() => handleDelete(ev.id)} aria-label="Delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Gallery tab ── */
function GalleryTab() {
  const [items, setItems] = useState([])
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)
  const [category, setCategory] = useState('')

  const load = () => api('/api/gallery').then(r => r.json()).then(setItems).catch(() => {})

  useEffect(() => { load() }, [])

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000) }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    if (category) fd.append('category', category)
    const token = localStorage.getItem('ne_admin_token')
    await fetch('/api/gallery', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
    flash(`${files.length} file(s) uploaded.`)
    load()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from the gallery?')) return
    await api(`/api/gallery/${id}`, { method: 'DELETE' })
    flash('Removed.')
    load()
  }

  return (
    <div className={s.tabContent}>
      <h2 className={s.tabHeading}>Upload Media</h2>
      <div className={s.uploadArea}>
        <div className={s.fieldGroup}>
          <label className={s.label}>Category (optional)</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={s.select}>
            <option value="">Select category</option>
            {['Wedding', 'Mehandi', 'Corporate Event', 'Celebration', 'Photography'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <label className={s.fileLabel}>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className={s.fileInput} disabled={uploading} />
          <span className={s.fileBtn}>{uploading ? 'Uploading…' : 'Choose Images / Videos'}</span>
          <span className={s.fileHint}>JPG, PNG, GIF, MP4, MOV · Max 50MB each</span>
        </label>
        {msg && <p className={s.flashMsg}>{msg}</p>}
      </div>

      <h2 className={s.tabHeading} style={{ marginTop: '2.5rem' }}>Gallery ({items.length})</h2>
      {items.length === 0 ? (
        <p className={s.empty}>No media uploaded yet.</p>
      ) : (
        <div className={s.galleryGrid}>
          {items.map(item => (
            <div key={item.id} className={s.galleryCard}>
              {item.type === 'video' ? (
                <video src={item.url} className={s.thumb} muted preload="metadata" />
              ) : (
                <img src={item.url} alt={item.label || 'Gallery image'} className={s.thumb} loading="lazy" />
              )}
              <div className={s.galleryMeta}>
                <p className={s.galleryLabel}>{item.label || item.filename || '—'}</p>
                {item.category && <span className={s.galleryCat}>{item.category}</span>}
              </div>
              <button
                className={s.deleteBtn}
                onClick={() => handleDelete(item.id)}
                aria-label="Delete media"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Dashboard shell ── */
const TABS = ['Events', 'Gallery']

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Events')

  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div className={s.page}>
      <header className={s.header}>
        <p className={s.logoText}>Nakshatra Events <span className={s.logoBadge}>Admin</span></p>
        <button className={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </header>

      <div className={s.tabBar} role="tablist">
        {TABS.map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`${s.tabBtn} ${tab === t ? s.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <main className={s.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === 'Events' ? <EventsTab /> : <GalleryTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
