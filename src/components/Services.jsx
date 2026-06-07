import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import s from './Services.module.css'

const services = [
  { name: 'Weddings', desc: 'Full-scale wedding production: mandap design, floral installations, lighting, catering coordination, and every ritual from mehandi to reception.' },
  { name: 'Mehandi', desc: 'Bespoke mehandi ceremonies with curated floral decor, artist coordination, and a setting that honours the ritual.' },
  { name: 'DJ & Sangeet', desc: 'Vibrant sangeet nights with professional DJ setup, stage production, custom lighting rigs, and sound systems calibrated to the venue.' },
  { name: 'Themed Varmala', desc: 'Signature varmala moments designed around the couple\'s story: floral frames, choreographed entry, and custom stage architecture.' },
  { name: 'Corporate Events', desc: 'Conferences, team events, award nights, and annual galas — produced to reflect your brand at every touch point.' },
  { name: 'Product Launches', desc: 'Launch events that create impact: stage builds, AV production, media setups, and crowd experiences that make your product unforgettable.' },
  { name: 'Photography', desc: 'Event photography and videography packages covering pre-wedding, ceremony, and reception — candid and editorial styles.' },
  { name: 'Celebrations', desc: 'Birthdays, anniversaries, baby showers, naming ceremonies, and milestone gatherings — each one designed to the occasion.' },
  { name: 'Art & Craft Workshops', desc: 'Curated workshops led by founder Rashmi Satish: rangoli, painting, craft sessions for corporate teams and community events.' },
]

function ServiceRow({ service, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className={s.row}
      role="listitem"
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
    >
      <h3 className={s.rowName}>{service.name}</h3>
      <p className={s.rowDesc}>{service.desc}</p>
      <span className={s.rowArrow} aria-hidden="true">→</span>
    </motion.div>
  )
}

export default function Services() {
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="services" className={s.section} aria-label="Event services across Karnataka">
      <div className={s.inner}>
        <motion.div
          ref={headerRef}
          className={s.header}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={s.heading}>What We Do</h2>
          <p className={s.subhead}>
            Nine event types. One standard of craft. Serving Shimoga, Bangalore, Mysore,
            Mangalore, Hubli, Davangere, and every corner of Karnataka.
          </p>
        </motion.div>

        <div className={s.list} role="list">
          {services.map((svc, i) => (
            <ServiceRow key={svc.name} service={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
