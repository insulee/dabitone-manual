/**
 * Quickstart 투어 데이터 로더 — slug → Tour 객체 동적 import.
 * 각 투어 파일을 개별 chunk로 분리해 번들 크기 관리.
 */
import type { Tour } from "../../src/types"

type LoaderFn = () => Promise<{ default: Tour } | { tour: Tour }>

const LOADERS: Record<string, LoaderFn> = {
  "01-first-connection": () => import("./01-first-connection"),
  // R3.3~R3.9에서 02~08 추가
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
