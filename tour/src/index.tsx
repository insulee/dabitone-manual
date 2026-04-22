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

function mount(attempt = 0) {
  const root = document.getElementById("tour-root")
  if (!root) {
    // Quartz micromorph가 body diff 직후라 새 tour-root가 아직 settle 중일 수 있음.
    // 최대 10회(약 300ms) 재시도.
    if (attempt < 10) {
      setTimeout(() => mount(attempt + 1), 30)
    }
    return
  }
  // 기존 플레이스홀더(tour-loading)를 비우고 Preact로 교체.
  root.innerHTML = ""
  render(<App />, root)
}

function init() {
  hydrateFromUrl()
  mount()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true })
} else {
  init()
}

// Quartz SPA 전환 시 (마이크로몰프가 body diff) 재초기화 — RAF로 한 frame 뒤에 실행.
document.addEventListener("nav", () => {
  requestAnimationFrame(() => {
    hydrateFromUrl()
    mount()
  })
})

// tour-page 내 tour 링크는 micromorph SPA를 우회하고 full page reload로 이동.
// micromorph diff와 Preact re-mount 사이 race 상황에서 흰 화면 발생 방지.
document.addEventListener(
  "click",
  (e) => {
    const target = e.target as HTMLElement | null
    const a = target?.closest?.("a[href]") as HTMLAnchorElement | null
    if (!a) return
    if (a.target === "_blank" || a.hasAttribute("download")) return
    if (!document.body.classList.contains("tour-page")) return
    const href = a.getAttribute("href") ?? ""
    const isTourLink =
      href.startsWith("/tour/") ||
      (href.startsWith("./") && a.pathname.includes("/tour/")) ||
      (href.startsWith("../") && a.pathname.includes("/tour/"))
    if (!isTourLink) return
    e.preventDefault()
    e.stopImmediatePropagation()
    window.location.assign(a.href)
  },
  true,
)
