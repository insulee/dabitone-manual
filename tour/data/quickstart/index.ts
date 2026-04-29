/**
 * Quickstart 투어 데이터 로더 — slug → Tour 객체 동적 import.
 * 각 투어 파일을 개별 chunk로 분리해 번들 크기 관리.
 */
import type { Tour } from "../../src/types"

type LoaderFn = () => Promise<{ default: Tour } | { tour: Tour }>

const LOADERS: Record<string, LoaderFn> = {
  "01-connect": () => import("./01-connect"),
  "02-display-setup": () => import("./02-display-setup"),
  "03-send-message": () => import("./03-send-message"),
  "04-edit-image": () => import("./04-edit-image"),
  "05-advanced": () => import("./05-advanced"),
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
