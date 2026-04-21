/**
 * Motion One wrapper — Apple-style easing/duration 기본값 제공.
 * 플랜 v3.1 Phase R1.2 + 디자인 방향성 §3 모션 원칙 반영.
 *
 * prefers-reduced-motion 사용자는 모든 애니 ≤ 100ms로 단축.
 */
import { animate as motionAnimate } from "motion"

/** Apple HIG "emphasized out" — 기본 easing. */
export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

/** duration 토큰 — 마이크로/전환/히어로. */
export const DUR = {
  micro: 0.4,
  transition: 0.7,
  hero: 1.2,
} as const

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

interface AnimateOptions {
  duration?: number
  delay?: number
  easing?: string
}

/**
 * 표준 애니 호출 — reduced-motion이면 0.1s로 단축.
 */
export function animate(
  target: Element | Element[] | string,
  keyframes: Record<string, unknown>,
  options: AnimateOptions = {},
) {
  if (reducedMotion()) {
    return motionAnimate(target as Element, keyframes, { duration: 0.1 })
  }
  return motionAnimate(target as Element, keyframes, {
    duration: options.duration ?? DUR.transition,
    delay: options.delay ?? 0,
    easing: options.easing ?? EASE,
  } as never)
}

/**
 * stagger delay 계산 — 자식 요소 순차 cascade 연출에.
 */
export function stagger(baseDelay: number, gap = 0.08) {
  return (i: number) => baseDelay + i * gap
}
