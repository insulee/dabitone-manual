import { useState } from "preact/hooks"
import type { Hotspot as HotspotData } from "../types"

interface Props {
  data: HotspotData
  onActivate: () => void
}

export function Hotspot({ data, onActivate }: Props) {
  const [hovered, setHovered] = useState(false)

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
      <span class="tour-hotspot__dot" aria-hidden="true" />
      {hovered && <span class="tour-hotspot__label">{data.label}</span>}
    </button>
  )
}
