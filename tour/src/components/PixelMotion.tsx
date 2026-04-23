/**
 * Hero 배경 Canvas — dot matrix, 극저대비 sine 기반 밝기 변화.
 * "픽셀" 제품 메타포 — 반드시 절제. 사용자가 모션을 의식하면 실패.
 * prefers-reduced-motion 시 정적 격자(또는 빈 상태)로 대체.
 */
import { useEffect, useRef } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

interface Props {
  dotSize?: number
  spacing?: number
  minAlpha?: number
  maxAlpha?: number
}

export function PixelMotion({
  dotSize = 1.5,
  spacing = 14,
  minAlpha = 0.03,
  maxAlpha = 0.09,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const ioRef = useRef<IntersectionObserver | null>(null)
  const inViewRef = useRef(true)
  const pointsRef = useRef<{ x: number; y: number; phase: number; speed: number }[]>([])

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const cv: HTMLCanvasElement = canvas
    const cx: CanvasRenderingContext2D = ctx

    let dpr = window.devicePixelRatio || 1

    function buildGrid(w: number, h: number) {
      const pts: { x: number; y: number; phase: number; speed: number }[] = []
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
      dpr = window.devicePixelRatio || 1
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

    const reduced = reducedMotion()

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
      for (const p of pointsRef.current) {
        const s = 0.5 + 0.5 * Math.sin(p.phase + t * p.speed)
        const alpha = minAlpha + (maxAlpha - minAlpha) * s
        cx.fillStyle = `rgba(10, 10, 10, ${alpha})`
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
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

    return () => {
      stop()
      ro.disconnect()
      ioRef.current?.disconnect()
    }
  }, [dotSize, spacing, minAlpha, maxAlpha])

  return (
    <canvas
      ref={canvasRef}
      class="tour-hero__pixel-bg"
      aria-hidden="true"
    />
  )
}
