/**
 * Focus trap — Popover·모달 열릴 때 Tab 이동이 모달 내부에만 돌게.
 * 플랜 v3.1 codex finding 5 반영 (접근성 baseline).
 */

export function createFocusTrap(container: HTMLElement): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null
  const focusables = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  function onKey(e: KeyboardEvent) {
    if (e.key !== "Tab") return
    if (focusables.length === 0) return
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last?.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first?.focus()
    }
  }

  container.addEventListener("keydown", onKey)
  first?.focus()

  return () => {
    container.removeEventListener("keydown", onKey)
    previouslyFocused?.focus?.()
  }
}
