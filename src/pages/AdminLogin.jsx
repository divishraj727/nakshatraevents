import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import s from './AdminLogin.module.css'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setError('Enter both username and password.'); return }
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid credentials.')
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <motion.div
        className={s.card}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={s.header}>
          <span className={s.star} aria-hidden="true">✦</span>
          <h1 className={s.heading}>Admin Panel</h1>
          <p className={s.sub}>Nakshatra Events</p>
        </div>

        <form className={s.form} onSubmit={handleSubmit} noValidate>
          <div className={s.fieldGroup}>
            <label className={s.label} htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={s.input}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={s.input}
              autoComplete="current-password"
            />
          </div>
          {error && <p className={s.error} role="alert">{error}</p>}
          <motion.button
            type="submit"
            className={s.btn}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
