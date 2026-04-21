import { useEffect, useRef } from "preact/hooks"

interface Props {
  message: string
  mode?: "polite" | "assertive"
}

/**
 * 스크린 리더용 live region — step 변경·성공 토스트 등을 polite/assertive로 발화.
 */
export function LiveRegion({ message, mode = "polite" }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    // content 변경 시 SR이 발화하도록 잠시 비운 뒤 다시 설정
    ref.current.textContent = ""
    const t = setTimeout(() => {
      if (ref.current) ref.current.textContent = message
    }, 50)
    return () => clearTimeout(t)
  }, [message])
  return <div ref={ref} aria-live={mode} aria-atomic="true" class="sr-only" />
}
