import { useEffect, useRef, useState } from "preact/hooks"
import type { Hotspot as HotspotData } from "../types"

interface Props {
  data: HotspotData
  onActivate: () => void
}

/**
 * GPS pin pulse — JS-driven box-shadow update.
 * CSS animation은 OS prefers-reduced-motion으로 강제 1회 truncate되는
 * 환경(Windows 시각효과 OFF, DevTools emulate, 일부 확장)이 있어서
 * requestAnimationFrame으로 직접 inline style 갱신 — browser-level
 * reduce-motion 영향 안 받음. 항상 무한 루프 보장.
 */
export function Hotspot({ data, onActivate }: Props) {
  const [hovered, setHovered] = useState(false)
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    let raf = 0
    let start: number | null = null
    const DURATION = 2600
    const MAX_SPREAD = 21
    function step(ts: number) {
      if (start === null) start = ts
      const elapsed = (ts - start) % DURATION
      const t = elapsed / DURATION
      const r1 = t < 0.5 ? t / 0.5 : 0
      const r2 = t >= 0.5 ? (t - 0.5) / 0.5 : 0
      const r1S = (r1 * MAX_SPREAD).toFixed(1)
      const r1A = (Math.max(0, 0.7 * (1 - r1))).toFixed(3)
      const r2S = (r2 * MAX_SPREAD).toFixed(1)
      const r2A = (Math.max(0, 0.55 * (1 - r2))).toFixed(3)
      dot!.style.boxShadow = `0 0 0 ${r1S}px rgba(194,65,12,${r1A}), 0 0 0 ${r2S}px rgba(194,65,12,${r2A})`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <button
      class="tour-hotspot"
      style={{ left: `${data.x}%`, top: `${data.y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={onActivate}
      aria-label={data.ariaLabel}
    >
      <span class="tour-hotspot__dot" ref={dotRef} aria-hidden="true" />
      {hovered && <span class="tour-hotspot__label">{data.label}</span>}
    </button>
  )
}
