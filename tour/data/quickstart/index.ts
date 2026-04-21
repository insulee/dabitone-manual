/**
 * Quickstart 투어 데이터 로더 — slug → Tour 객체 동적 import.
 * 각 투어 파일을 개별 chunk로 분리해 번들 크기 관리.
 */
import type { Tour } from "../../src/types"

type LoaderFn = () => Promise<{ default: Tour } | { tour: Tour }>

const LOADERS: Record<string, LoaderFn> = {
  "01-first-connection": () => import("./01-first-connection"),
  "02-screen-size": () => import("./02-screen-size"),
  "03-send-message": () => import("./03-send-message"),
  "04-edit-image": () => import("./04-edit-image"),
  "05-gif-editor": () => import("./05-gif-editor"),
  "06-schedule-pla": () => import("./06-schedule-pla"),
  "07-background-bgp": () => import("./07-background-bgp"),
  "08-firmware": () => import("./08-firmware"),
}

export async function loadTour(slug: string): Promise<Tour | null> {
  const loader = LOADERS[slug]
  if (!loader) return null
  const mod = await loader()
  if ("default" in mod) return mod.default
  if ("tour" in mod) return mod.tour
  return null
}

export const TOUR_SLUGS = Object.keys(LOADERS)
