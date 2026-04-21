/**
 * 투어 앱 엔트리포인트.
 *
 * `<div id="tour-root">`가 있을 때만 Preact 앱을 mount한다.
 * URL path에 따라 Landing 또는 TourScenario를 렌더.
 *
 * one-router 원칙(ADR-008): path 변경은 Quartz SPA router에 위임.
 * 투어는 같은 path 내에서 step(query string ?s=N)만 관리.
 */
import { render } from "preact"
import { App } from "./App"
import { hydrateFromUrl } from "./lib/state"

function mount() {
  const root = document.getElementById("tour-root")
  if (!root) return
  // 기존 플레이스홀더(SSR된 tour-loading)를 비우고 Preact로 교체
  root.innerHTML = ""
  render(<App />, root)
}

// Quartz SPA router 전환 후에도 재mount되도록 nav 이벤트 구독
function init() {
  hydrateFromUrl()
  mount()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true })
} else {
  init()
}

// Quartz SPA 전환 시 (새 페이지가 document.body로 교체됨) 재초기화
document.addEventListener("nav", () => {
  hydrateFromUrl()
  mount()
})
