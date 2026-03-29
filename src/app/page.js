'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ───────── CONFIG ───────── */
const LEAVES = [
  { y: 0.18, side: -1, size: 0.55, angle: -35, label: null },
  { y: 0.30, side:  1, size: 0.70, angle:  30, label: null },
  { y: 0.42, side: -1, size: 0.85, angle: -28, label: 'career' },
  { y: 0.54, side:  1, size: 1.00, angle:  32, label: 'blog' },
  { y: 0.66, side: -1, size: 0.95, angle: -25, label: 'contact' },
  { y: 0.78, side:  1, size: 0.90, angle:  28, label: 'socials' },
  { y: 0.88, side: -1, size: 0.60, angle: -20, label: null },
  { y: 0.95, side:  1, size: 0.35, angle:  18, label: null },
]

const STEM_HEIGHT    = 380
const STEM_WIDTH     = 8
const STEM_BASE_Y    = 520
const GROW_TIME      = 3.5  // total stem grow seconds
const LEAF_STAGGER   = 0.25 // seconds between each leaf start
const LEAF_GROW_TIME = 1.2  // seconds per leaf unfurl

/* ───────── SPRING HELPER ───────── */
function springStep(cur, tgt, vel, stiff, damp, dt) {
  const f = (tgt - cur) * stiff - vel * damp
  return { value: cur + vel * dt, velocity: vel + f * dt }
}

/* ───────── COMPONENT ───────── */
export default function Home() {
  const svgRef     = useRef(null)
  const builtRef   = useRef(false)
  const branchData = useRef([])
  const startRef   = useRef(null)

  const [activeSection, setActiveSection] = useState(null)
  const [labelPositions, setLabelPositions] = useState([])
  const [labelsReady, setLabelsReady] = useState(false)

  const handleBack = useCallback(() => setActiveSection(null), [])

  /* ── build SVG geometry once ── */
  useEffect(() => {
    if (builtRef.current) return
    builtRef.current = true

    const svg = svgRef.current
    const ns  = 'http://www.w3.org/2000/svg'
    const mk  = (tag, a) => { const e = document.createElementNS(ns, tag); for (const [k,v] of Object.entries(a||{})) e.setAttribute(k,v); return e }

    const plantG = svg.querySelector('#plant')

    /* ── main stem ── */
    const stem = mk('line', {
      x1: 400, y1: STEM_BASE_Y,
      x2: 400, y2: STEM_BASE_Y - STEM_HEIGHT,
      stroke: '#3a7d2c', 'stroke-width': STEM_WIDTH,
      'stroke-linecap': 'round',
    })
    stem.style.strokeDasharray  = STEM_HEIGHT
    stem.style.strokeDashoffset = STEM_HEIGHT
    plantG.appendChild(stem)

    /* ── stem nodes (small bumps where leaves attach) ── */
    const nodes = LEAVES.map(lf => {
      const ny = STEM_BASE_Y - STEM_HEIGHT * lf.y
      const node = mk('ellipse', {
        cx: 400, cy: ny,
        rx: STEM_WIDTH * 0.7, ry: STEM_WIDTH * 0.4,
        fill: '#2e8524', opacity: '0',
      })
      plantG.appendChild(node)
      return node
    })

    /* ── leaves ── */
    const data = LEAVES.map((lf, i) => {
      const attachY = STEM_BASE_Y - STEM_HEIGHT * lf.y
      const leafLen = 70 * lf.size
      const leafW   = 22 * lf.size
      const dir     = lf.side // -1 left, +1 right

      // wrapper at attachment point
      const wrap = mk('g')
      wrap.setAttribute('transform', `translate(400, ${attachY})`)
      plantG.appendChild(wrap)

      // animated inner group
      const inner = mk('g')
      inner.style.transformOrigin = '0px 0px'
      inner.style.transform = 'scale(0.01) rotate(0deg)'
      inner.style.opacity = '0'
      wrap.appendChild(inner)

      // leaf shape: pointed oval
      const baseAngle = lf.angle
      const cx = dir * leafLen * 0.5
      const cy = -leafLen * 0.15

      // main leaf body
      const leaf = mk('path', {
        d: `M0,0
            C${dir*12},${-6} ${dir*leafLen*0.6},${-leafW*0.8} ${dir*leafLen},${-leafW*0.15}
            C${dir*leafLen*0.7},${leafW*0.5} ${dir*15},${8} 0,0`,
        fill: dir < 0 ? 'url(#leafL)' : 'url(#leafR)',
        stroke: '#2a7d22',
        'stroke-width': '0.5',
        opacity: '0.93',
      })
      inner.appendChild(leaf)

      // midrib vein
      inner.appendChild(mk('path', {
        d: `M0,0 Q${dir*leafLen*0.35},${-leafW*0.18} ${dir*leafLen*0.95},${-leafW*0.05}`,
        stroke: '#267a1e', 'stroke-width': '1.2', fill: 'none', opacity: '0.6',
      }))

      // side veins
      for (let v = 1; v <= 4; v++) {
        const t = v / 5
        const vx = dir * leafLen * t * 0.9
        const vy = -leafW * 0.12 * (1 - Math.abs(t - 0.5) * 1.5)
        inner.appendChild(mk('line', {
          x1: vx * 0.5, y1: vy * 0.5,
          x2: vx + dir * leafW * 0.25, y2: vy - leafW * 0.3,
          stroke: '#267a1e', 'stroke-width': '0.6', opacity: '0.35',
        }))
        inner.appendChild(mk('line', {
          x1: vx * 0.5, y1: vy * 0.5,
          x2: vx + dir * leafW * 0.15, y2: vy + leafW * 0.3,
          stroke: '#267a1e', 'stroke-width': '0.6', opacity: '0.35',
        }))
      }

      return {
        cfg: lf, inner, node: nodes[i], attachY,
        progress: 0,
        baseAngle,
        spring: { value: 0, velocity: 0 },       // wind angle
        scaleSpring: { value: 0.01, velocity: 0 }, // growth
        windPhase: Math.random() * Math.PI * 2,
        windFreq: 0.5 + Math.random() * 0.5,
        tipX: 400 + dir * leafLen,
        tipY: attachY - leafW * 0.1,
      }
    })

    branchData.current = { stem, data }
  }, [])

  /* ── animation loop ── */
  useEffect(() => {
    let raf
    const dt = 1 / 60

    function tick(now) {
      if (!startRef.current) startRef.current = now
      const elapsed = (now - startRef.current) / 1000
      const svg = svgRef.current
      const { stem, data } = branchData.current
      if (!stem || !data) { raf = requestAnimationFrame(tick); return }

      // stem grow (ease out cubic)
      const stemProg = Math.min(1, elapsed / GROW_TIME)
      const stemEased = 1 - Math.pow(1 - stemProg, 3)
      stem.style.strokeDashoffset = STEM_HEIGHT * (1 - stemEased)

      let allDone = true
      const positions = []

      data.forEach((b, i) => {
        // leaf starts growing when stem reaches its Y position
        const leafTrigger = GROW_TIME * b.cfg.y + i * LEAF_STAGGER * 0.3
        const lt = elapsed - leafTrigger

        if (lt > 0 && b.progress < 1) {
          b.progress = Math.min(1, lt / LEAF_GROW_TIME)
        }
        if (b.progress < 1) allDone = false

        // show node when stem reaches this point
        if (stemEased >= b.cfg.y) {
          b.node.setAttribute('opacity', Math.min(1, (stemEased - b.cfg.y) * 10))
        }

        // spring-driven scale
        b.scaleSpring = springStep(b.scaleSpring.value, b.progress, b.scaleSpring.velocity, 5.0, 4.0, dt)
        const scale = Math.max(0.01, b.scaleSpring.value)

        // wind sway
        const windTarget =
          Math.sin(elapsed * b.windFreq + b.windPhase) * 8 +
          Math.sin(elapsed * b.windFreq * 2.3 + b.windPhase * 0.7) * 3 +
          Math.sin(elapsed * 0.2 + i) * 2 // slow drift
        b.spring = springStep(b.spring.value, windTarget, b.spring.velocity, 3.0, 2.8, dt)

        const angle = b.baseAngle + b.spring.value * (0.3 + b.progress * 0.7)
        b.inner.style.transform = `scale(${scale}) rotate(${angle}deg)`
        b.inner.style.opacity = Math.min(1, b.progress * 4)

        // label position (only for labeled leaves)
        if (b.cfg.label) {
          const rad = angle * Math.PI / 180
          const leafLen = 70 * b.cfg.size * scale
          const dir = b.cfg.side
          const tipSvgX = 400 + dir * leafLen * Math.cos(rad)
          const tipSvgY = b.attachY - dir * leafLen * Math.sin(rad) * 0.3 - 15

          const pt = svg.createSVGPoint()
          pt.x = tipSvgX
          pt.y = tipSvgY
          const ctm = svg.getScreenCTM()
          if (ctm) {
            const sp = pt.matrixTransform(ctm)
            positions.push({ label: b.cfg.label, x: sp.x, y: sp.y })
          }
        }
      })

      setLabelPositions(positions)

      if (allDone && !labelsReady) setLabelsReady(true)

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [labelsReady])

  const labeledLeaves = LEAVES.filter(l => l.label)

  return (
    <main className="scene">
      <svg ref={svgRef} id="scene" viewBox="0 0 800 650" preserveAspectRatio="xMidYMax meet">
        <defs>
          <radialGradient id="bgGlow" cx="0.6" cy="0.25" r="0.55">
            <stop offset="0%"  stopColor="rgba(60,40,20,0.25)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <linearGradient id="leafL" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%"   stopColor="#4aad3a"/>
            <stop offset="40%"  stopColor="#3a9a2c"/>
            <stop offset="100%" stopColor="#2d7a20"/>
          </linearGradient>
          <linearGradient id="leafR" x1="1" y1="0" x2="0" y2="0.3">
            <stop offset="0%"   stopColor="#3fa832"/>
            <stop offset="40%"  stopColor="#358e28"/>
            <stop offset="100%" stopColor="#28721c"/>
          </linearGradient>
          <linearGradient id="potBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c4724a"/>
            <stop offset="100%" stopColor="#8b4f35"/>
          </linearGradient>
          <linearGradient id="potRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4856a"/>
            <stop offset="100%" stopColor="#b06040"/>
          </linearGradient>
        </defs>

        {/* subtle warm glow */}
        <rect width="800" height="650" fill="url(#bgGlow)"/>

        {/* pot */}
        <g>
          {/* shadow under pot */}
          <ellipse cx="400" cy="588" rx="65" ry="6" fill="rgba(0,0,0,0.3)"/>
          {/* pot body */}
          <path d="M348,530 L355,585 L445,585 L452,530 Z" fill="url(#potBody)"/>
          {/* pot rim */}
          <rect x="340" y="522" width="120" height="12" rx="3" fill="url(#potRim)"/>
          {/* soil */}
          <ellipse cx="400" cy="530" rx="50" ry="7" fill="#3a2618"/>
          {/* pot base */}
          <rect x="363" y="585" width="74" height="5" rx="2" fill="#7a4330"/>
        </g>

        {/* plant */}
        <g id="plant"/>
      </svg>

      {/* floating labels */}
      {labeledLeaves.map((lf) => {
        const pos = labelPositions.find(p => p.label === lf.label)
        return (
          <div key={lf.label}
            className={`leaf-label ${labelsReady ? 'visible' : ''}`}
            style={{ left: pos?.x ?? -100, top: pos?.y ?? -100 }}
            onClick={() => setActiveSection(lf.label)}
          >
            {lf.label}
          </div>
        )
      })}

      {/* content overlay */}
      <div className={`overlay ${activeSection ? 'open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) handleBack() }}>
        <button className="close-btn" onClick={handleBack}>&times;</button>
        <div className="overlay-inner">
          {activeSection === 'career' && (
            <div>
              <h2>Career</h2>
              <p>Software engineer. Builder of things. Currently exploring the intersection of AI and developer tools.</p>
              <p className="muted">More details coming soon...</p>
            </div>
          )}
          {activeSection === 'blog' && (
            <div>
              <h2>Blog</h2>
              <p><strong className="dim">My Favorite 3D Prints</strong> <span className="dimmer">&mdash; Aug 2024</span></p>
              <p>A collection of my favorite things I{"'"}ve printed on my Bambu P1P. From desk organizers to docks.</p>
              <p className="muted">More posts coming...</p>
            </div>
          )}
          {activeSection === 'contact' && (
            <div>
              <h2>Contact</h2>
              <p>Want to chat? Reach out.</p>
              <p>The best way is through Twitter/X or GitHub.</p>
            </div>
          )}
          {activeSection === 'socials' && (
            <div>
              <h2>Socials</h2>
              <p>
                <a href="https://x.com/sandeep98suresh" target="_blank" rel="noreferrer" className="social-link">Twitter / X</a>
                <a href="https://github.com/sandeepsuresh1998" target="_blank" rel="noreferrer" className="social-link">GitHub</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
