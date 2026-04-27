/**
 * 투어 앱 최상위 — URL path에 따라 렌더 분기.
 */
import { useEffect } from "preact/hooks"
import { currentTourSlug } from "./lib/state"
import { LandingHybrid } from "./pages/LandingHybrid"
import { TourScenario } from "./pages/TourScenario"
import { AccessibleView } from "./pages/AccessibleView"

function getCurrentRoute(): "landing" | "scenario" | "accessible" {
  const p = window.location.pathname
  if (p.startsWith("/tour/accessible")) return "accessible"
  if (p.match(/\/tour\/quickstart\/[^/]+/)) return "scenario"
  return "landing"
}

export function App() {
  const route = getCurrentRoute()

  useEffect(() => {
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
  return <LandingHybrid />
}
