/**
 * localStorage 기반 투어 진행률 저장.
 * 플랜 v3.1 Phase R1.5.
 */

const KEY = "dabitone-tour-progress"

export interface TourProgress {
  [tourSlug: string]: { completedSteps: string[]; lastStepId: string }
}

export function getProgress(): TourProgress {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as TourProgress
  } catch {
    return {}
  }
}

export function setStepComplete(tourSlug: string, stepId: string) {
  const prog = getProgress()
  const entry = prog[tourSlug] ?? { completedSteps: [], lastStepId: "" }
  if (!entry.completedSteps.includes(stepId)) {
    entry.completedSteps.push(stepId)
  }
  entry.lastStepId = stepId
  prog[tourSlug] = entry
  try {
    localStorage.setItem(KEY, JSON.stringify(prog))
  } catch {
    // localStorage 꽉 찼거나 privacy mode — 무시
  }
}

export function resetProgress(tourSlug?: string) {
  if (!tourSlug) {
    localStorage.removeItem(KEY)
    return
  }
  const prog = getProgress()
  delete prog[tourSlug]
  localStorage.setItem(KEY, JSON.stringify(prog))
}
