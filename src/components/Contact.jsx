import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import s from './Contact.module.css'

const eventTypes = [
  'Wedding', 'Mehandi', 'DJ & Sangeet', 'Themed Varmala',
  'Corporate Event', 'Product Launch', 'Photography',
  'Birthday / Celebration', 'Baby Shower / Naming Ceremony',
  'Art & Craft Workshop', 'Other',
]

const karnatakaDistricts = [
  'Shimoga', 'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Dharwad',
  'Davangere', 'Tumkur', 'Hassan', 'Udupi', 'Chikmagalur', 'Sagara',
  'Belgaum (Belagavi)', 'Bellary', 'Gulbarga', 'Mandya', 'Kodagu (Coorg)',
  'Bidar', 'Raichur', 'Vijayapura', 'Hosapete', 'Kolar', 'Chickballapur', 'Other',
]

function Field({ label, name, type, value, onChange, error, autoComplete }) {
  return (
    <div className={`${s.fieldGroup} ${error ? s.hasError : ''}`}>
      <label className={s.label} htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type} value={value}
        onChange={onChange} autoComplete={autoComplete}
        className={`${s.input} ${error ? s.inputError : ''}`}
        aria-describedby={error ? `${name}-err` : undefined}
        aria-invalid={!!error}
      />
      {error && <span id={`${name}-err`} className={s.errorMsg} role="alert">{error}</span>}
    </div>
  )
}

function SelectField({ label, name, value, onChange, error, options, placeholder }) {
  return (
    <div className={`${s.fieldGroup} ${error ? s.hasError : ''}`}>
      <label className={s.label} htmlFor={name}>{label}</label>
      <select
        id={name} name={name} value={value} onChange={onChange}
        className={`${s.select} ${error ? s.inputError : ''}`}
        aria-describedby={error ? `${name}-err` : undefined}
        aria-invalid={!!error}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span id={`${name}-err`} className={s.errorMsg} role="alert">{error}</span>}
    </div>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm] = useState({ name: '', email: '', phone: '', eventType: '', city: '', date: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Your name is required.'
    if (!form.email.trim()) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    if (!form.eventType) e.eventType = 'Select an event type.'
    if (!form.city) e.city = 'Select a city.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('submitting')
    setTimeout(() => setStatus('success'), 1400)
  }

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } }

  return (
    <section id="contact" className={s.section} aria-label="Contact Nakshatra Events">
      <div className={s.inner}>
        <motion.div
          ref={ref}
          className={s.layout}
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.div variants={item} className={s.info}>
            <p className={s.preheading}>Begin Your Story</p>
            <h2 className={s.heading}>Let's Plan Something Extraordinary</h2>
            <p className={s.body}>
              Whether you're planning a wedding in Shimoga, a product launch in Bangalore,
              or a celebration anywhere across Karnataka — tell us about your occasion
              and we'll be in touch within 24 hours.
            </p>

            <div className={s.contactBlock}>
              <p className={s.founder}>Rashmi Satish, Founder</p>
              <p className={s.company}>Mahadeva Management (Nakshatra Events)</p>
            </div>

            <div className={s.contactDetails}>
              <div className={s.contactRow}>
                <span className={s.contactIcon} aria-hidden="true">✆</span>
                <div>
                  <a href="tel:+919740904242" className={s.contactLine}>+91 9740904242</a>
                  <a href="tel:+918951403242" className={s.contactLine}>+91 8951403242</a>
                </div>
              </div>
              <div className={s.contactRow}>
                <span className={s.contactIcon} aria-hidden="true">✉</span>
                <a href="mailto:rashmirs1989@gmail.com" className={s.contactLine}>rashmirs1989@gmail.com</a>
              </div>
              <div className={s.contactRow}>
                <span className={s.contactIcon} aria-hidden="true">◎</span>
                <a
                  href="https://maps.app.goo.gl/14VW4uxguHCSFsRK6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.addressLink}
                >
                  <address className={s.address}>
                    Banasiri, 1st Floor, 271-A<br />
                    Gopal Gowda Extension<br />
                    Opp. Commercial Tax Office<br />
                    Shivamogga, Karnataka 577205
                  </address>
                  <span className={s.mapsHint}>View on Maps ↗</span>
                </a>
              </div>
            </div>

            <p className={s.coverage}>
              Serving all districts of Karnataka including Shimoga, Bangalore, Mysore,
              Mangalore, Hubli, Davangere, Hassan, Udupi, Chikmagalur, and beyond.
            </p>
          </motion.div>

          <motion.div variants={item} className={s.formWrap}>
            {status === 'success' ? (
              <motion.div
                className={s.success}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={s.successStar} aria-hidden="true">✦</span>
                <h3 className={s.successHeading}>Enquiry received</h3>
                <p className={s.successBody}>
                  Thank you, {form.name.split(' ')[0]}. Rashmi and the team will be in touch
                  within 24 hours to discuss your event.
                </p>
              </motion.div>
            ) : (
              <form className={s.form} onSubmit={handleSubmit} noValidate aria-label="Event enquiry form">
                <div className={s.row2}>
                  <Field label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
                  <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
                </div>
                <div className={s.row2}>
                  <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" />
                  <Field label="Event Date (approximate)" name="date" type="date" value={form.date} onChange={handleChange} error={errors.date} />
                </div>
                <div className={s.row2}>
                  <SelectField label="Event Type" name="eventType" value={form.eventType} onChange={handleChange} error={errors.eventType} options={eventTypes} placeholder="Select event type" />
                  <SelectField label="City / District" name="city" value={form.city} onChange={handleChange} error={errors.city} options={karnatakaDistricts} placeholder="Select city" />
                </div>
                <div className={s.fieldGroup}>
                  <label className={s.label} htmlFor="message">Tell us about your event</label>
                  <textarea id="message" name="message" className={s.textarea} value={form.message} onChange={handleChange} rows={4} placeholder="Scale, venue, special requirements, or anything else..." />
                </div>
                <motion.button
                  type="submit"
                  className={s.submitBtn}
                  disabled={status === 'submitting'}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
