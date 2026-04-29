/**
 * 투어 전역 상태 — Preact Signals 기반.
 * 플랜 v3.1 Phase R1.5 + codex 3 one-router 반영 (독립 router 없음).
 *
 * 스텝 이동은 URL query string `?s=N` + history.replaceState로 표현.
 * path 변경은 Quartz SPA router에 위임한다.
 */
import { signal } from "@preact/signals"

export const currentStepIndex = signal(0)
export const currentTourSlug = signal<string | null>(null)
export const popoverOpen = signal<{ id: string } | null>(null)

/**
 * 스텝 이동 — replaceState로만 URL 갱신 (히스토리 스택 오염 방지).
 */
export function gotoStep(n: number) {
  currentStepIndex.value = Math.max(0, n)
  try {
    const url = new URL(window.location.href)
    url.searchParams.set("s", String(n))
    window.history.replaceState({}, "", url.toString())
  } catch {
    // SSR 또는 iframe 등에서 URL 접근 안 될 때 무시
  }
}

/**
 * 페이지 진입 시 URL `?s=N`에서 스텝 복원.
 */
export function hydrateFromUrl() {
  try {
    const s = new URL(window.location.href).searchParams.get("s")
    if (s !== null) {
      const n = parseInt(s, 10)
      if (!Number.isNaN(n)) currentStepIndex.value = n
    }
    // slug 추출: /quickstart/<slug>/ → <slug>
    const match = window.location.pathname.match(/\/quickstart\/([^/]+)\/?$/)
    if (match) currentTourSlug.value = match[1]
  } catch {
    // no-op
  }
}
