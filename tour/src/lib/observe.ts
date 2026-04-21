/**
 * IntersectionObserver 기반 스크롤 reveal — Lenis smooth scroll 대체.
 * 플랜 v3.1 codex finding 7 반영 (MVP는 Lenis 없이 CSS sticky + IO).
 */
import { animate } from "./motion"

/**
 * 요소가 뷰포트에 진입하면 한 번 reveal.
 * threshold 25% + 하단 10% rootMargin으로 "거의 화면 중앙에 왔을 때" 트리거.
 */
export function revealOnEnter(el: HTMLElement, delay = 0) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate(
            e.target,
            { opacity: [0, 1], transform: ["translateY(32px)", "translateY(0)"] },
            { duration: 0.8, delay },
          )
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
  )
  io.observe(el)
  return io
}

/**
 * 여러 요소를 stagger delay로 순차 reveal.
 */
export function revealStagger(els: HTMLElement[], baseDelay = 0, gap = 0.12) {
  els.forEach((el, i) => revealOnEnter(el, baseDelay + i * gap))
}
