/**
 * 랜딩 페이지 — 안 Generative Canvas (Vol. 10, 2026-04-24).
 * /tour10/ 경로 전용. 알고리즘 배경 + 떠 있는 콘텐츠 아일랜드.
 *
 * 디자인 테시스: 신호 처리 메타포 — 배경은 flow field + particle trails로
 * "살아있는 신호"를 구성하고, 콘텐츠는 glass 카드로 배경 위에 떠 있다.
 *
 * Inspiration: Awwwards experimental, Cell (Martin Naumann), Lusion,
 * generative.fm, Joshua Davis, Zach Lieberman.
 *
 * 특징:
 *  - 전 뷰포트 fixed Canvas 2D (pseudo-Perlin flow field + 200~400 particle trails).
 *  - Pointer 영향 — 180px 반경 내 angle bending (eased pointer spring).
 *  - Scroll 영향 — noiseScale이 scroll progress로 부드럽게 이동.
 *  - DPR capped at 2; 모바일/저사양 입자 수 절반.
 *  - prefers-reduced-motion → 정적 스냅샷 1회 렌더 후 RAF 없음.
 *  - 6 섹션 — Hero · Data Stream · Constellation · Control Surface · Manifesto · Colophon.
 *  - 구성: 깊은 미드나잇 네이비(#030615) + 시안(#22D3EE) + 마젠타(#E879F9) + 일렉트릭 그린(#00FF87).
 */
import { useEffect, useRef, useState } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

export function LandingCanvas() {
  useEffect(() => {
    document.body.classList.add("tour10-page")
    return () => {
      document.body.classList.remove("tour10-page")
    }
  }, [])

  return (
    <div class="tour10-shell">
      <GenerativeBackground />
      <CursorGlow />
      <HeroIsland />
      <DataStream />
      <Constellation />
      <ControlSurface />
      <ManifestoIsland />
      <Colophon />
    </div>
  )
}

/* =========================================================================
   GenerativeBackground — flow field + particle trails canvas
   ========================================================================= */

type Particle = {
  x: number
  y: number
  px: number
  py: number
  color: 0 | 1 // 0 = cyan, 1 = magenta
}

function GenerativeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return
    // Closures below capture non-null types explicitly.
    const cv: HTMLCanvasElement = canvas
    const cx: CanvasRenderingContext2D = ctx

    const reduced = reducedMotion()

    // --- config
    let dpr = Math.min(2, window.devicePixelRatio || 1)
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const lowCPU =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency < 4
    const PARTICLE_COUNT = isMobile || lowCPU ? 180 : 340
    const STEP = 0.9
    const POINTER_RADIUS = 180
    const POINTER_STRENGTH = 0.75
    const BG_FADE = "rgba(3, 6, 21, 0.06)"
    const BG_CLEAR = "#030615"
    const COLOR_CYAN = "rgba(34, 211, 238, 0.58)"
    const COLOR_MAGENTA = "rgba(232, 121, 249, 0.58)"

    let w = 0
    let h = 0
    let running = true
    let rafId = 0
    let resizeTimer = 0
    let particles: Particle[] = []
    let noiseScale = 0.0035
    let scrollTargetScale = 0.0035
    const pointer = { x: -9999, y: -9999, active: false }
    const easedPointer = { x: -9999, y: -9999 }

    // --- pseudo-Perlin (fbm of sin) — no deps.
    function flowAngle(x: number, y: number, t: number): number {
      // Multi-octave sine/cosine combo — cheap but visually organic.
      const n1 =
        Math.sin(x * noiseScale + t * 0.00012) *
        Math.cos(y * noiseScale + t * 0.00009)
      const n2 =
        Math.sin(x * noiseScale * 2.1 + t * 0.00017) *
        Math.cos(y * noiseScale * 2.3 - t * 0.00011)
      const n = n1 * 0.7 + n2 * 0.3
      return n * Math.PI * 2
    }

    function spawnParticle(): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        px: 0,
        py: 0,
        color: Math.random() < 0.15 ? 1 : 0,
      }
    }

    function initParticles() {
      particles = new Array(PARTICLE_COUNT).fill(0).map(spawnParticle)
      for (const p of particles) {
        p.px = p.x
        p.py = p.y
      }
    }

    function setupSize() {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      cv.width = Math.floor(w * dpr)
      cv.height = Math.floor(h * dpr)
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      cx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // initial clear
      cx.fillStyle = BG_CLEAR
      cx.fillRect(0, 0, w, h)
    }

    function drawStaticSnapshot() {
      // single pass — render a representative flow field state for reduced motion.
      cx.fillStyle = BG_CLEAR
      cx.fillRect(0, 0, w, h)
      const samples = isMobile ? 600 : 1400
      const t = 1500
      for (let i = 0; i < samples; i++) {
        const sx = Math.random() * w
        const sy = Math.random() * h
        let x = sx
        let y = sy
        cx.strokeStyle = Math.random() < 0.15 ? COLOR_MAGENTA : COLOR_CYAN
        cx.lineWidth = 0.7
        cx.beginPath()
        cx.moveTo(x, y)
        for (let st = 0; st < 40; st++) {
          const a = flowAngle(x, y, t)
          x += Math.cos(a) * STEP
          y += Math.sin(a) * STEP
          cx.lineTo(x, y)
          if (x < 0 || x > w || y < 0 || y > h) break
        }
        cx.stroke()
      }
    }

    function step(t: number) {
      if (!running) return

      // ease pointer (simple spring)
      easedPointer.x += (pointer.x - easedPointer.x) * 0.12
      easedPointer.y += (pointer.y - easedPointer.y) * 0.12

      // ease noiseScale toward scroll target
      noiseScale += (scrollTargetScale - noiseScale) * 0.05

      // fade prior frame for trails
      cx.fillStyle = BG_FADE
      cx.fillRect(0, 0, w, h)

      cx.lineWidth = 0.9
      for (const p of particles) {
        p.px = p.x
        p.py = p.y

        let a = flowAngle(p.x, p.y, t)

        // pointer influence — within radius, bend toward pointer direction
        if (pointer.active) {
          const dx = easedPointer.x - p.x
          const dy = easedPointer.y - p.y
          const dist2 = dx * dx + dy * dy
          const r2 = POINTER_RADIUS * POINTER_RADIUS
          if (dist2 < r2) {
            const fall = 1 - Math.sqrt(dist2) / POINTER_RADIUS
            const pointerAngle = Math.atan2(dy, dx)
            // bend angle toward pointer, strength proportional to proximity
            const bend = fall * POINTER_STRENGTH
            const da = pointerAngle - a
            // normalize to [-PI, PI]
            const wrapped = Math.atan2(Math.sin(da), Math.cos(da))
            a += wrapped * bend
          }
        }

        p.x += Math.cos(a) * STEP
        p.y += Math.sin(a) * STEP

        // respawn if out of bounds
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          // respawn at random edge
          const edge = Math.floor(Math.random() * 4)
          if (edge === 0) {
            p.x = 0
            p.y = Math.random() * h
          } else if (edge === 1) {
            p.x = w
            p.y = Math.random() * h
          } else if (edge === 2) {
            p.x = Math.random() * w
            p.y = 0
          } else {
            p.x = Math.random() * w
            p.y = h
          }
          p.px = p.x
          p.py = p.y
        }

        cx.strokeStyle = p.color === 1 ? COLOR_MAGENTA : COLOR_CYAN
        cx.beginPath()
        cx.moveTo(p.px, p.py)
        cx.lineTo(p.x, p.y)
        cx.stroke()
      }

      rafId = requestAnimationFrame(step)
    }

    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setupSize()
        initParticles()
        if (reduced) drawStaticSnapshot()
      }, 140)
    }

    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }

    function onPointerLeave() {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    function onScroll() {
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)),
      )
      scrollTargetScale = 0.0025 + progress * 0.0045
    }

    function onVisibility() {
      if (document.hidden) {
        running = false
        if (rafId) cancelAnimationFrame(rafId)
      } else if (!reduced) {
        if (!running) {
          running = true
          rafId = requestAnimationFrame(step)
        }
      }
    }

    setupSize()
    initParticles()

    if (reduced) {
      drawStaticSnapshot()
    } else {
      rafId = requestAnimationFrame(step)
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("pointerleave", onPointerLeave)
      window.addEventListener("scroll", onScroll, { passive: true })
      document.addEventListener("visibilitychange", onVisibility)
    }
    window.addEventListener("resize", onResize)

    return () => {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", onResize)
      if (!reduced) {
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerleave", onPointerLeave)
        window.removeEventListener("scroll", onScroll)
        document.removeEventListener("visibilitychange", onVisibility)
      }
    }
  }, [])

  return (
    <div class="tour10-bg" aria-hidden="true">
      <canvas ref={canvasRef} class="tour10-bg__canvas" />
      <div class="tour10-bg__vignette" />
    </div>
  )
}

/* =========================================================================
   CursorGlow — CSS-only blurred dot, fine-pointer only
   ========================================================================= */

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion()) return
    const fine = window.matchMedia("(pointer: fine)").matches
    if (!fine) return
    const el = ref.current
    if (!el) return

    let x = -9999
    let y = -9999
    let ex = -9999
    let ey = -9999
    let raf = 0

    function loop() {
      ex += (x - ex) * 0.18
      ey += (y - ey) * 0.18
      if (el) el.style.transform = `translate3d(${ex}px, ${ey}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    function onMove(e: PointerEvent) {
      x = e.clientX
      y = e.clientY
      if (el) el.style.opacity = "1"
    }
    function onLeave() {
      if (el) el.style.opacity = "0"
    }

    raf = requestAnimationFrame(loop)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return <div ref={ref} class="tour10-cursor" aria-hidden="true" />
}

/* =========================================================================
   Section 01 — HERO ISLAND
   ========================================================================= */

function HeroIsland() {
  return (
    <section class="tour10-island tour10-hero" aria-label="DabitOne 소개">
      <p class="tour10-eyebrow">A GENERATIVE OS FOR LED</p>
      <h1 class="tour10-hero__wordmark">DABITONE</h1>
      <p class="tour10-hero__sub">하드웨어 제어를 예술로.</p>
      <div class="tour10-hero__cta">
        <a
          class="tour10-btn tour10-btn--primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          다운로드
        </a>
        <a
          class="tour10-btn tour10-btn--secondary"
          href="/tour/quickstart/01-first-connection/"
        >
          투어 시작
        </a>
      </div>
    </section>
  )
}

/* =========================================================================
   Section 02 — DATA STREAM (signal legend: 4 mini-cards)
   ========================================================================= */

type StreamCard = {
  label: string
  num: string
  desc: string
  waveform: "sine" | "step" | "packet" | "bars"
  accent?: boolean
}

const STREAM_CARDS: readonly StreamCard[] = [
  { num: "01", label: "LED SIGNAL", desc: "RGB 밝기 파형", waveform: "sine" },
  { num: "02", label: "IMAGE DATA", desc: "BMP·PNG·JPG → DAT", waveform: "bars" },
  { num: "03", label: "DBNET PACKET", desc: "UDP 브로드캐스트", waveform: "packet", accent: true },
  { num: "04", label: "HEX / ASCII", desc: "프로토콜 토글", waveform: "step" },
] as const

function DataStream() {
  return (
    <section class="tour10-island tour10-stream" aria-label="데이터 스트림">
      <div class="tour10-stream__header">
        <p class="tour10-stream__eyebrow">SIGNAL LEGEND · 02</p>
        <h2 class="tour10-stream__title">하나의 소프트웨어, 네 가지 신호.</h2>
      </div>
      <div class="tour10-stream__grid">
        {STREAM_CARDS.map((c) => (
          <article
            key={c.num}
            class={`tour10-stream__card${c.accent ? " is-accent" : ""}`}
            aria-label={`${c.label} ${c.desc}`}
          >
            <div class="tour10-stream__card-head">
              <span class="tour10-stream__card-num">{c.num}</span>
              <span class="tour10-stream__card-dot" aria-hidden="true" />
            </div>
            <div class="tour10-stream__card-viz" aria-hidden="true">
              <Waveform kind={c.waveform} accent={c.accent ?? false} />
            </div>
            <div class="tour10-stream__card-meta">
              <span class="tour10-stream__card-label">{c.label}</span>
              <span class="tour10-stream__card-desc">{c.desc}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Waveform({ kind, accent }: { kind: StreamCard["waveform"]; accent: boolean }) {
  const stroke = accent ? "#00ff87" : "#22d3ee"
  if (kind === "sine") {
    return (
      <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
        <path
          d="M0,20 C20,5 30,5 40,20 S60,35 80,20 100,5 120,20 140,35 160,20"
          fill="none"
          stroke={stroke}
          stroke-width="1.4"
        />
      </svg>
    )
  }
  if (kind === "step") {
    return (
      <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
        <path
          d="M0,30 L20,30 L20,14 L50,14 L50,28 L80,28 L80,10 L120,10 L120,30 L160,30"
          fill="none"
          stroke={stroke}
          stroke-width="1.4"
        />
      </svg>
    )
  }
  if (kind === "packet") {
    return (
      <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
        {[10, 26, 42, 58, 74, 90, 106, 122, 138].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={i % 3 === 0 ? 8 : i % 3 === 1 ? 14 : 10}
            width="10"
            height={i % 3 === 0 ? 24 : i % 3 === 1 ? 18 : 22}
            fill={stroke}
            opacity={0.4 + (i % 3) * 0.2}
          />
        ))}
      </svg>
    )
  }
  // bars
  return (
    <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
      {[5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125, 137, 149].map((x, i) => {
        const h = 6 + ((i * 7) % 28)
        return <rect key={i} x={x} y={40 - h} width="8" height={h} fill={stroke} opacity={0.6} />
      })}
    </svg>
  )
}

/* =========================================================================
   Section 03 — CONSTELLATION (quickstart nodes as a graph)
   ========================================================================= */

type Node = {
  slug: string
  label: string
  x: number
  y: number
}

const NODES: readonly Node[] = [
  { slug: "01-first-connection", label: "최초 연결", x: 18, y: 28 },
  { slug: "04-edit-image", label: "이미지 편집", x: 42, y: 68 },
  { slug: "05-gif-editor", label: "GIF", x: 66, y: 30 },
  { slug: "06-schedule-pla", label: "스케줄", x: 80, y: 74 },
  { slug: "08-firmware", label: "펌웨어", x: 34, y: 20 },
] as const

// curves connecting adjacent node pairs (indexed)
const EDGES: readonly [number, number][] = [
  [0, 4],
  [4, 2],
  [0, 1],
  [1, 3],
  [2, 3],
] as const

function Constellation() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section class="tour10-island tour10-constellation" aria-label="Quickstart 성좌">
      <div class="tour10-constellation__header">
        <p class="tour10-eyebrow">CONSTELLATION · 03</p>
        <h2 class="tour10-constellation__title">시작 시나리오</h2>
        <p class="tour10-constellation__sub">점을 눌러 투어로 진입합니다.</p>
      </div>
      <div class="tour10-constellation__graph" role="list">
        <svg
          class="tour10-constellation__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {EDGES.map((e, i) => {
            const a = NODES[e[0]]
            const b = NODES[e[1]]
            const cx = (a.x + b.x) / 2 + (i % 2 === 0 ? 6 : -6)
            const cy = (a.y + b.y) / 2 + (i % 2 === 0 ? -4 : 4)
            return (
              <path
                key={i}
                d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                fill="none"
                stroke="rgba(34, 211, 238, 0.35)"
                stroke-width="0.25"
                stroke-dasharray="1 1"
              />
            )
          })}
        </svg>
        {NODES.map((n, i) => (
          <a
            key={n.slug}
            href={`/tour/quickstart/${n.slug}/`}
            class={`tour10-constellation__node${active === i ? " is-active" : ""}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` } as Record<string, string>}
            role="listitem"
            aria-label={n.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((v) => (v === i ? null : v))}
            onFocus={() => setActive(i)}
            onBlur={() => setActive((v) => (v === i ? null : v))}
          >
            <span class="tour10-constellation__dot" aria-hidden="true" />
            <span class="tour10-constellation__label">{n.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* =========================================================================
   Section 04 — CONTROL SURFACE (status readout strip)
   ========================================================================= */

function ControlSurface() {
  return (
    <section class="tour10-island tour10-control" aria-label="제어 상태">
      <div class="tour10-control__head">
        <span class="tour10-control__pulse" aria-hidden="true" />
        <span class="tour10-control__head-label">CONTROL SURFACE · 04</span>
      </div>
      <div class="tour10-control__readouts">
        <div class="tour10-control__readout">
          <span class="tour10-control__key">SIGNAL</span>
          <span class="tour10-control__val tour10-control__val--ok">STABLE</span>
        </div>
        <div class="tour10-control__readout">
          <span class="tour10-control__key">CONTROLLERS</span>
          <span class="tour10-control__val">128</span>
        </div>
        <div class="tour10-control__readout">
          <span class="tour10-control__key">PACKETS/S</span>
          <span class="tour10-control__val">240</span>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   Section 05 — MANIFESTO ISLAND
   ========================================================================= */

function ManifestoIsland() {
  return (
    <section class="tour10-island tour10-manifesto" aria-label="철학">
      <p class="tour10-eyebrow">MANIFESTO · 05</p>
      <h2 class="tour10-manifesto__line">픽셀에서 프로토콜까지, 하나의 소프트웨어.</h2>
      <p class="tour10-manifesto__binary" aria-hidden="true">
        01000100 01000001 01000010 01001001
      </p>
    </section>
  )
}

/* =========================================================================
   Section 06 — COLOPHON / CTA
   ========================================================================= */

function Colophon() {
  return (
    <section class="tour10-island tour10-colophon" aria-label="설치 및 콜로폰">
      <div class="tour10-colophon__cta">
        <a
          class="tour10-btn tour10-btn--primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          다운로드
        </a>
        <a
          class="tour10-btn tour10-btn--secondary"
          href="/tour/quickstart/01-first-connection/"
        >
          투어 시작
        </a>
      </div>
      <p class="tour10-colophon__line">
        © 2026 DabitSol · Generative elements rendered client-side · respects
        prefers-reduced-motion
      </p>
    </section>
  )
}
