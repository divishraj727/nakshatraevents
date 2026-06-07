import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import s from './Testimonials.module.css'

const testimonials = [
  {
    quote:
      'Nakshatra Events turned our wedding in Shimoga into something beyond what we had imagined. Every detail was handled with precision and genuine care: the florals, the lighting, the coordination, all of it.',
    name: 'Priya &amp; Rahul Sharma',
    event: 'Wedding Ceremony, Shimoga',
  },
  {
    quote:
      'Our annual corporate gala in Bangalore was elevated to a completely different standard. The team understood our brand and built an environment that left every attendee talking for weeks.',
    name: 'Vikram Shetty',
    event: 'Corporate Gala, Bangalore',
  },
  {
    quote:
      'The Sangeeth was a dream. The energy, the stage, the decor — nothing was out of place. Our guests are still talking about it months later.',
    name: 'Deepika &amp; Family',
    event: 'Sangeeth Ceremony, Shimoga',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => setCurrent(index)

  return (
    <section id="about" className={s.section} aria-label="Client testimonials">
      <div className={s.inner}>
        <motion.div
          ref={ref}
          className={s.wrapper}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={s.mark} aria-hidden="true">"</span>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              className={s.quote}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              dangerouslySetInnerHTML={{
                __html: `<p>${testimonials[current].quote}</p>`,
              }}
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`attr-${current}`}
              className={s.attribution}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className={s.name}
                dangerouslySetInnerHTML={{ __html: testimonials[current].name }}
              />
              <span className={s.event}>{testimonials[current].event}</span>
            </motion.div>
          </AnimatePresence>

          <div className={s.dots} role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Show testimonial ${i + 1}`}
                className={`${s.dot} ${i === current ? s.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
