/**
 * 투어 앱 최상위 — URL path에 따라 렌더 분기.
 */
import { useEffect } from "preact/hooks"
import { currentTourSlug } from "./lib/state"
import { Landing } from "./pages/Landing"
import { LandingGrid } from "./pages/LandingGrid"
import { LandingConsole } from "./pages/LandingConsole"
import { LandingDesktop } from "./pages/LandingDesktop"
import { LandingEditorial } from "./pages/LandingEditorial"
import { LandingHorizontal } from "./pages/LandingHorizontal"
import { LandingScrolly } from "./pages/LandingScrolly"
import { LandingPlayground } from "./pages/LandingPlayground"
import { LandingCraft } from "./pages/LandingCraft"
import { LandingKinetic } from "./pages/LandingKinetic"
import { LandingCanvas } from "./pages/LandingCanvas"
import { LandingHybrid } from "./pages/LandingHybrid"
import { TourScenario } from "./pages/TourScenario"
import { AccessibleView } from "./pages/AccessibleView"

/**
 * 라우트 분기 — `/tourN` (N=1..11) path-segment-aware 매칭.
 * `/tour10`이 `/tour1` 문자열 prefix와 겹치므로 정규식으로 숫자 캡처 후 매핑.
 */
function getCurrentRoute():
  | "landing"
  | "landing-grid"
  | "landing-console"
  | "landing-desktop"
  | "landing-editorial"
  | "landing-horizontal"
  | "landing-scrolly"
  | "landing-playground"
  | "landing-craft"
  | "landing-kinetic"
  | "landing-canvas"
  | "landing-hybrid"
  | "scenario"
  | "accessible" {
  const p = window.location.pathname
  if (p.startsWith("/tour/accessible")) return "accessible"
  if (p.match(/\/tour\/quickstart\/[^/]+/)) return "scenario"
  // `/tourN(/|$)` — path segment 경계 강제.
  const m = p.match(/^\/tour(\d+)(?:\/|$)/)
  if (m) {
    const n = m[1]
    switch (n) {
      case "1":
        return "landing-grid"
      case "2":
        return "landing-console"
      case "3":
        return "landing-desktop"
      case "4":
        return "landing-editorial"
      case "5":
        return "landing-horizontal"
      case "6":
        return "landing-scrolly"
      case "7":
        return "landing-playground"
      case "8":
        return "landing-craft"
      case "9":
        return "landing-kinetic"
      case "10":
        return "landing-canvas"
      case "11":
        return "landing-hybrid"
    }
  }
  return "landing"
}

export function App() {
  const route = getCurrentRoute()

  useEffect(() => {
    // 페이지 타이틀 업데이트 — Quartz SPA 전환 시에도 올바른 타이틀
    const t = document.title
    if (t) {
      const event = new CustomEvent("tour-hydrated", { detail: { route } })
      document.dispatchEvent(event)
    }
  }, [route])

  if (route === "scenario") {
    return <TourScenario slug={currentTourSlug.value ?? ""} />
  }
  if (route === "accessible") {
    return <AccessibleView />
  }
  if (route === "landing-grid") {
    return <LandingGrid />
  }
  if (route === "landing-console") {
    return <LandingConsole />
  }
  if (route === "landing-desktop") {
    return <LandingDesktop />
  }
  if (route === "landing-editorial") {
    return <LandingEditorial />
  }
  if (route === "landing-horizontal") {
    return <LandingHorizontal />
  }
  if (route === "landing-scrolly") {
    return <LandingScrolly />
  }
  if (route === "landing-playground") {
    return <LandingPlayground />
  }
  if (route === "landing-craft") {
    return <LandingCraft />
  }
  if (route === "landing-kinetic") {
    return <LandingKinetic />
  }
  if (route === "landing-canvas") {
    return <LandingCanvas />
  }
  if (route === "landing-hybrid") {
    return <LandingHybrid />
  }
  return <Landing />
}
