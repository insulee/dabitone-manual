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
import { TourScenario } from "./pages/TourScenario"
import { AccessibleView } from "./pages/AccessibleView"

function getCurrentRoute():
  | "landing"
  | "landing-grid"
  | "landing-console"
  | "landing-desktop"
  | "landing-editorial"
  | "landing-horizontal"
  | "scenario"
  | "accessible" {
  const p = window.location.pathname
  if (p.startsWith("/tour/accessible")) return "accessible"
  if (p.match(/\/tour\/quickstart\/[^/]+/)) return "scenario"
  if (p.startsWith("/tour5")) return "landing-horizontal"
  if (p.startsWith("/tour4")) return "landing-editorial"
  if (p.startsWith("/tour3")) return "landing-desktop"
  if (p.startsWith("/tour2")) return "landing-console"
  if (p.startsWith("/tour1")) return "landing-grid"
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
  return <Landing />
}
