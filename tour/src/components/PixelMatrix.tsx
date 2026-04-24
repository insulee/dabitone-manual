/**
 * LED Pixel Matrix — tour11 Hero 배경.
 * 기본: 16px 간격 도트 격자, 매우 약한 breathing (opacity 0.04 → 0.10).
 * 커서 근접: 180px 반경 도트 밝기 증가 + 가까울수록 cyan tint.
 * 제품 메타포 — 커서 = 사용자가 LED 픽셀을 직접 점등하는 컨트롤러.
 */
import { useEffect, useRef } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

interface Props {
  dotSize?: number
  spacing?: number
  minAlpha?: number
  maxAlpha?: number
  radius?: number
}

type Point = { x: number; y: number; phase: number; speed: number }

export function PixelMatrix({
  dotSize = 1.8,
  spacing = 16,
  minAlpha = 0.08,
  maxAlpha = 0.18,
  radius = 200,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const ioRef = useRef<IntersectionObserver | null>(null)
  const inViewRef = useRef(true)
  const pointsRef = useRef<Point[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const cv: HTMLCanvasElement = canvas
    const cx: CanvasRenderingContext2D = ctx

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = reducedMotion()
    const coarse = window.matchMedia("(pointer: coarse)").matches

    function buildGrid(w: number, h: number) {
      const pts: Point[] = []
      const cols = Math.ceil(w / spacing)
      const rows = Math.ceil(h / spacing)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          pts.push({
            x: i * spacing + spacing / 2,
            y: j * spacing + spacing / 2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.0002 + Math.random() * 0.0004,
          })
        }
      }
      pointsRef.current = pts
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = cv.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      cv.width = Math.max(1, Math.floor(w * dpr))
      cv.height = Math.max(1, Math.floor(h * dpr))
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      cx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildGrid(w, h)
    }

    function drawStatic() {
      const rect = cv.getBoundingClientRect()
      cx.clearRect(0, 0, rect.width, rect.height)
      const alpha = (minAlpha + maxAlpha) / 2
      cx.fillStyle = `rgba(10, 10, 10, ${alpha})`
      for (const p of pointsRef.current) {
        cx.fillRect(p.x - dotSize / 2, p.y - dotSize / 2, dotSize, dotSize)
      }
    }

    function drawFrame(t: number) {
      const rect = cv.getBoundingClientRect()
      cx.clearRect(0, 0, rect.width, rect.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mouseRef.current.active && !coarse
      const r2 = radius * radius

      for (const p of pointsRef.current) {
        const pulse = 0.5 + 0.5 * Math.sin(p.phase + t * p.speed)
        let alpha = minAlpha + (maxAlpha - minAlpha) * pulse
        let r = 10
        let g = 10
        let b = 10

        if (mouseActive) {
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < r2) {
            const dist = Math.sqrt(d2)
            const pull = 1 - dist / radius
            alpha += pull * 0.5
            // cyan tint — 가까울수록 강해지게 pull^2 가중
            const tint = pull * pull
            r = Math.round(10 + (14 - 10) * tint)
            g = Math.round(10 + (165 - 10) * tint)
            b = Math.round(10 + (233 - 10) * tint)
          }
        }

        if (alpha > 0.95) alpha = 0.95
        cx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        cx.fillRect(p.x - dotSize / 2, p.y - dotSize / 2, dotSize, dotSize)
      }

      if (inViewRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame)
      } else {
        rafRef.current = null
      }
    }

    function start() {
      if (reduced) {
        drawStatic()
        return
      }
      if (!rafRef.current && inViewRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame)
      }
    }

    function stop() {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    function onMove(e: MouseEvent) {
      const rect = cv.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
    }

    function onLeaveWindow() {
      mouseRef.current.active = false
    }

    resize()
    start()

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) drawStatic()
    })
    ro.observe(cv)

    ioRef.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inViewRef.current = e.isIntersecting
          if (e.isIntersecting) start()
          else stop()
        }
      },
      { threshold: 0 },
    )
    ioRef.current.observe(cv)

    if (!reduced && !coarse) {
      window.addEventListener("mousemove", onMove)
      document.addEventListener("mouseleave", onLeaveWindow)
    }

    return () => {
      stop()
      ro.disconnect()
      ioRef.current?.disconnect()
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeaveWindow)
    }
  }, [dotSize, spacing, minAlpha, maxAlpha, radius])

  return <canvas ref={canvasRef} class="tour11-hero__matrix-bg" aria-hidden="true" />
}
