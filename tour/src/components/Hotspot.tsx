import { useEffect, useRef, useState } from "preact/hooks"
import { animate, reducedMotion } from "../lib/motion"
import type { Hotspot as HotspotData } from "../types"

interface Props {
  data: HotspotData
  onActivate: () => void
}

export function Hotspot({ data, onActivate }: Props) {
  const ringRef = useRef<HTMLSpanElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!ringRef.current || reducedMotion()) return
    const ring = ringRef.current
    const id = setInterval(() => {
      animate(
        ring,
        { scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] },
        { duration: 1.6, easing: "ease-out" },
      )
    }, 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {data.box && (
        <div
          class="tour-hotspot__box"
          style={{
            left: `${data.x - data.box.w / 2}%`,
            top: `${data.y - data.box.h / 2}%`,
            width: `${data.box.w}%`,
            height: `${data.box.h}%`,
          }}
          aria-hidden="true"
        />
      )}
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
        <span class="tour-hotspot__ring" ref={ringRef} aria-hidden="true" />
        <span class="tour-hotspot__dot" aria-hidden="true" />
        {hovered && <span class="tour-hotspot__label">{data.label}</span>}
      </button>
    </>
  )
}
