const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { requireAuth, JWT_SECRET } = require('./middleware/auth.cjs')

const app = express()
const PORT = 3001
const DB_PATH = path.join(__dirname, 'data', 'db.json')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// Admin credentials (hashed password: nakshatra@2024)
const ADMIN_USER = 'admin'
const ADMIN_PASS_HASH = bcrypt.hashSync('nakshatra@2024', 10)

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5175', credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

// ── DB helpers ──────────────────────────────────────────────
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// ── Multer setup ────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp4|mov|webm/i
    cb(null, allowed.test(path.extname(file.originalname)) && allowed.test(file.mimetype))
  },
})

// ── Auth ────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  if (username !== ADMIN_USER || !bcrypt.compareSync(password, ADMIN_PASS_HASH)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user.username })
})

// ── Events ──────────────────────────────────────────────────
app.get('/api/events', (req, res) => {
  const { events } = readDB()
  res.json(events.sort((a, b) => new Date(b.date) - new Date(a.date)))
})

app.post('/api/events', requireAuth, (req, res) => {
  const { title, category, date, location, description } = req.body
  if (!title || !category || !date || !location) {
    return res.status(400).json({ error: 'title, category, date and location are required' })
  }
  const db = readDB()
  const event = { id: `evt-${uuidv4().slice(0, 8)}`, title, category, date, location, description: description || '', createdAt: new Date().toISOString() }
  db.events.push(event)
  writeDB(db)
  res.status(201).json(event)
})

app.put('/api/events/:id', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.events.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.events[idx] = { ...db.events[idx], ...req.body, id: db.events[idx].id }
  writeDB(db)
  res.json(db.events[idx])
})

app.delete('/api/events/:id', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.events.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.events.splice(idx, 1)
  writeDB(db)
  res.json({ ok: true })
})

// ── Gallery ─────────────────────────────────────────────────
app.get('/api/gallery', (req, res) => {
  const { gallery } = readDB()
  res.json(gallery.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
})

app.post('/api/gallery', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const db = readDB()
  const isVideo = /mp4|mov|webm/i.test(path.extname(req.file.filename))
  const item = {
    id: uuidv4(),
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    type: isVideo ? 'video' : 'image',
    label: req.body.label || '',
    category: req.body.category || '',
    createdAt: new Date().toISOString(),
  }
  db.gallery.push(item)
  writeDB(db)
  res.status(201).json(item)
})

app.delete('/api/gallery/:id', requireAuth, (req, res) => {
  const db = readDB()
  const idx = db.gallery.findIndex(g => g.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const file = path.join(UPLOADS_DIR, db.gallery[idx].filename)
  if (fs.existsSync(file)) fs.unlinkSync(file)
  db.gallery.splice(idx, 1)
  writeDB(db)
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`Nakshatra Events API running on http://localhost:${PORT}`))
