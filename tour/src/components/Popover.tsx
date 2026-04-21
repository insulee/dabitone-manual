import { useEffect, useRef } from "preact/hooks"
import type { ComponentChildren } from "preact"
import { animate } from "../lib/motion"
import { createFocusTrap } from "../lib/focusTrap"

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ComponentChildren
  cta?: { label: string; href: string }
}

export function Popover({ open, onClose, title, children, cta }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !backdropRef.current || !cardRef.current) return
    animate(backdropRef.current, { opacity: [0, 1] }, { duration: 0.3 })
    animate(
      cardRef.current,
      { opacity: [0, 1], transform: ["scale(0.94)", "scale(1)"] },
      { duration: 0.5, delay: 0.08 },
    )
    const releaseFocus = createFocusTrap(cardRef.current)
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      releaseFocus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div class="tour-popover__backdrop" ref={backdropRef} onClick={onClose}>
      <div
        class="tour-popover__card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-popover-title"
      >
        <button class="tour-popover__close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <h3 class="tour-popover__title" id="tour-popover-title">
          {title}
        </h3>
        <div class="tour-popover__body">{children}</div>
        {cta && (
          <a class="tour-popover__cta" href={cta.href}>
            {cta.label} →
          </a>
        )}
      </div>
    </div>
  )
}
