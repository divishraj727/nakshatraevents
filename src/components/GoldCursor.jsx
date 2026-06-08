import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import s from './GoldCursor.module.css'

const TRAIL_COUNT = 10        // reduced from 14 — fewer ghost dots
const TRAIL_FADE  = 0.5       // max opacity of the freshest trail dot

export default function GoldCursor() {
  const canvasRef  = useRef(null)
  const trailRef   = useRef([])          // [{x,y}, ...]
  const rafRef     = useRef(null)
  const visibleRef = useRef(false)
  const clickRef   = useRef(false)       // replaces useState to avoid re-renders
  const [visible, setVisible] = useState(false)

  /* ── Motion values ── */
  const mx    = useMotionValue(-200)
  const my    = useMotionValue(-200)
  const scale = useMotionValue(1)        // replaces setClicking state

  /* Ring lags behind the dot */
  const rx      = useSpring(mx,    { stiffness: 110, damping: 22, mass: 0.6 })
  const ry      = useSpring(my,    { stiffness: 110, damping: 22, mass: 0.6 })
  const rScale  = useSpring(scale, { stiffness: 300, damping: 20 })

  useEffect(() => {
    /* Skip entirely on touch/hover-none devices */
    if (!canvasRef.current) return

    /* Hide native cursor globally */
    document.documentElement.style.cursor = 'none'

    /* ── Canvas trail loop ── */
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      /* Reassign after each clearRect (canvas resize resets context state) */
      ctx.fillStyle = 'rgb(220,175,60)'
      const pts = trailRef.current
      const len = pts.length
      for (let i = 0; i < len; i++) {
        const progress = 1 - i / len       // 1 = newest, ~0 = oldest
        const alpha    = progress * progress * TRAIL_FADE
        if (alpha < 0.01) continue
        const radius = progress * 5
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(pts[i].x, pts[i].y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(drawTrail)
    }
    rafRef.current = requestAnimationFrame(drawTrail)

    /* ── Mouse listeners ── */
    const onMove = (e) => {
      const x = e.clientX, y = e.clientY
      mx.set(x); my.set(y)

      trailRef.current = [{ x, y }, ...trailRef.current.slice(0, TRAIL_COUNT - 1)]

      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }
    }

    const onEnter  = () => { visibleRef.current = true;  setVisible(true)  }
    const onLeave  = () => { visibleRef.current = false; setVisible(false) }
    const onDown   = () => { clickRef.current = true;  scale.set(1.6) }
    const onUp     = () => { clickRef.current = false; scale.set(1)   }

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)

    return () => {
      document.documentElement.style.cursor = ''
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',     resizeCanvas)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
    }
  }, [mx, my, scale])

  /* Don't render on touch-only devices */
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return null

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        className={s.canvas}
        aria-hidden="true"
      />

      {/* Lagging outer ring */}
      <motion.div
        className={s.ring}
        style={{
          x: rx,
          y: ry,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          scale: rScale,
        }}
      />

      {/* Main gold dot */}
      <motion.div
        className={s.dot}
        style={{
          x: mx,
          y: my,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          scale,
        }}
      />
    </>
  )
}
