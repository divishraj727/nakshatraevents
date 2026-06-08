import { useEffect, useRef } from 'react'

/* ── Colour palette ── */
const COLORS = [
  [255, 248, 200], // bright cream-white
  [245, 225, 140], // gold-yellow
  [220, 185, 100], // warm gold
  [255, 255, 255], // pure white sparkle
  [200, 165,  70], // deep gold
]

/* ── Draw an n-point star on canvas ── */
function drawStar(ctx, cx, cy, spikes, ro, ri, color, alpha) {
  const step = Math.PI / spikes
  let rot = -Math.PI / 2          // start pointing up
  ctx.beginPath()
  ctx.moveTo(cx + Math.cos(rot) * ro, cy + Math.sin(rot) * ro)
  for (let i = 0; i < spikes; i++) {
    rot += step
    ctx.lineTo(cx + Math.cos(rot) * ri, cy + Math.sin(rot) * ri)
    rot += step
    ctx.lineTo(cx + Math.cos(rot) * ro, cy + Math.sin(rot) * ro)
  }
  ctx.closePath()
  const [r, g, b] = color
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
  ctx.fill()
}

/* ── Single star particle ── */
class StarParticle {
  constructor(cw, ch, initial = false) {
    this.cw = cw; this.ch = ch
    this.reset(initial)
  }

  reset(initial = false) {
    this.x      = Math.random() * this.cw
    this.y      = initial ? Math.random() * this.ch : this.ch + 20
    // mix of 4-point (sparkle) and some 8-point (brand star)
    this.spikes = Math.random() < 0.75 ? 4 : 8
    this.ro     = Math.random() * 7 + 2.5          // outer radius 2.5–9.5
    this.ri     = this.ro * (this.spikes === 4 ? 0.35 : 0.42)
    this.angle  = Math.random() * Math.PI * 2
    this.spin   = (Math.random() - 0.5) * 0.018    // slow rotation per frame
    this.speedY = -(Math.random() * 0.38 + 0.12)
    this.speedX = (Math.random() - 0.5) * 0.2
    this.maxOp  = Math.random() * 0.55 + 0.08
    this.op     = initial ? Math.random() * this.maxOp : 0
    this.phase  = Math.random() * Math.PI * 2
    this.wobble = Math.random() * 0.0006 + 0.0003
    this.twink  = Math.random() * 0.0012 + 0.0004  // opacity oscillation speed
    this.color  = COLORS[Math.floor(Math.random() * COLORS.length)]
    // Pre-compute the r,g,b string so we don't rebuild it every frame
    this.colorStr = `${this.color[0]},${this.color[1]},${this.color[2]}`
    this.fadeIn = !initial
  }

  update(t) {
    this.y      += this.speedY
    this.x      += this.speedX + Math.sin(t * this.wobble + this.phase) * 0.28
    this.angle  += this.spin

    // twinkle
    this.op = this.maxOp * (0.45 + 0.55 * Math.abs(Math.sin(t * this.twink + this.phase)))

    // fade in from bottom
    if (this.fadeIn) {
      this.op = Math.min(this.op, (this.ch - this.y) < 60
        ? this.op * ((this.ch - this.y) / 60)
        : this.op)
      if (this.op >= this.maxOp * 0.5) this.fadeIn = false
    }

    // fade out near top
    const topZone = this.ch * 0.12
    if (this.y < topZone) {
      this.op *= (this.y / topZone)
    }

    // recycle when gone
    if (this.y < -20 || this.op <= 0.005) this.reset(false)
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)

    // soft glow halo — only for the largest stars (raises threshold: fewer gradient draws)
    if (this.ro > 7) {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.ro * 2.2)
      grad.addColorStop(0, `rgba(${this.colorStr},${(this.op * 0.3).toFixed(3)})`)
      grad.addColorStop(1, `rgba(${this.colorStr},0)`)
      ctx.beginPath()
      ctx.arc(0, 0, this.ro * 2.2, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    // star shape (uses pre-computed colorStr via fillStyle set inside drawStar)
    drawStar(ctx, 0, 0, this.spikes, this.ro, this.ri, this.color, this.op)

    // bright center dot — only for stars big enough to notice
    if (this.ro > 6) {
      ctx.beginPath()
      ctx.arc(0, 0, this.ro * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${(this.op * 0.9).toFixed(3)})`
      ctx.fill()
    }

    ctx.restore()
  }
}

/* ── Component ── */
export default function StarField({ count = 55 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId, particles = [], t = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = Array.from({ length: count }, () =>
        new StarParticle(canvas.width, canvas.height, true)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      t++
      const cw = canvas.width, ch = canvas.height
      ctx.clearRect(0, 0, cw, ch)
      /* cw/ch are only needed inside update(); no per-frame property assignment */
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.cw = cw; p.ch = ch
        p.update(t)
        p.draw(ctx)
      }
      animId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  )
}
