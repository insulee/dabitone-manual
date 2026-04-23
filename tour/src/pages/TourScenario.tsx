/**
 * 투어 시나리오 페이지 엔진 — Quickstart 01~08 공통.
 * 플랜 v3.1 Phase R3.1.
 *
 * 레이아웃: 좌 70% screenshot stage (hotspot + highlight overlay), 우 30% 설명 레일.
 * 스텝 이동은 prev/next 버튼 + query string ?s=N 동기화.
 * 접근성: LiveRegion으로 step 변경 발화, 키보드 네비, focus restore.
 */
import { useEffect, useState } from "preact/hooks"
import { currentStepIndex, gotoStep } from "../lib/state"
import { setStepComplete } from "../lib/storage"
import { LiveRegion } from "../components/LiveRegion"
import { Hotspot } from "../components/Hotspot"
import type { Tour, TourStep } from "../types"
import { loadTour } from "../../data/quickstart"

interface Props {
  slug: string
}

export function TourScenario({ slug }: Props) {
  const [tour, setTour] = useState<Tour | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    loadTour(slug)
      .then((t) => {
        if (t) setTour(t)
        else setLoadError(`시나리오를 찾을 수 없습니다: ${slug}`)
      })
      .catch((e) => setLoadError(String(e)))
  }, [slug])

  if (loadError) {
    return (
      <main class="tour-section" aria-label="투어 오류">
        <div class="tour-section__inner">
          <h1 class="tour-section__title">투어를 열 수 없습니다</h1>
          <p class="tour-section__caption">{loadError}</p>
          <a
            href="/tour/"
            style={{
              color: "var(--tour-c-text)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← 투어 홈으로
          </a>
        </div>
      </main>
    )
  }

  if (!tour) {
    return (
      <main class="tour-section" aria-label="투어 로드 중">
        <div class="tour-section__inner">
          <p class="tour-section__caption">로드 중…</p>
        </div>
      </main>
    )
  }

  return <ScenarioBody tour={tour} />
}

function ScenarioBody({ tour }: { tour: Tour }) {
  const stepIdx = Math.min(currentStepIndex.value, tour.steps.length - 1)
  const step = tour.steps[stepIdx]
  const isFirst = stepIdx === 0
  const isLast = stepIdx === tour.steps.length - 1

  const progressPct = ((stepIdx + 1) / tour.steps.length) * 100

  useEffect(() => {
    setStepComplete(tour.slug, step.id)
  }, [step.id])

  function next() {
    if (!isLast) gotoStep(stepIdx + 1)
  }
  function prev() {
    if (!isFirst) gotoStep(stepIdx - 1)
  }

  // 키보드 단축키 — ← → ArrowKeys
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return
      if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [stepIdx, isFirst, isLast])

  return (
    <main class="tour-scenario" aria-label={`투어: ${tour.title}`}>
      <LiveRegion
        message={`스텝 ${stepIdx + 1} / ${tour.steps.length}: ${step.title}`}
      />

      <ProgressHeader tour={tour} stepIdx={stepIdx} pct={progressPct} />

      <div class="tour-scenario__stage-and-rail">
        <Stage step={step} />
        <Rail
          step={step}
          stepIdx={stepIdx}
          isFirst={isFirst}
          isLast={isLast}
          onPrev={prev}
          onNext={next}
          nextTour={tour.nextTour}
        />
      </div>

      {isLast && !tour.nextTour && <CompletionScreen tour={tour} />}
    </main>
  )
}

function CompletionScreen({ tour }: { tour: Tour }) {
  return (
    <section class="tour-completion tour-section--dark">
      <div class="tour-completion__inner">
        <p class="tour-completion__eyebrow">COMPLETE</p>
        <h2 class="tour-completion__title">투어 완료.</h2>
        <p class="tour-completion__text">
          {tour.title} 투어가 끝났습니다. 다른 투어를 이어가거나, DabitOne을 지금 설치할 수 있습니다.
        </p>
        <div class="tour-completion__actions">
          <a class="tour-btn tour-btn--primary" href="/tour/">모든 투어 보기 →</a>
          <a class="tour-btn tour-btn--secondary" href="https://www.dabitsol.com" target="_blank" rel="noreferrer">
            DabitOne 다운로드
          </a>
        </div>
      </div>
    </section>
  )
}

function ProgressHeader({
  tour,
  stepIdx,
  pct,
}: {
  tour: Tour
  stepIdx: number
  pct: number
}) {
  return (
    <header class="tour-scenario__header">
      <div class="tour-scenario__header-top">
        <div class="tour-scenario__header-info">
          <p class="tour-scenario__eyebrow">DabitOne 투어</p>
          <h1 class="tour-scenario__title">{tour.title}</h1>
          {tour.subtitle && (
            <p class="tour-scenario__subtitle">{tour.subtitle}</p>
          )}
        </div>
        <div class="tour-scenario__counter" aria-live="polite">
          {stepIdx + 1} / {tour.steps.length}
        </div>
      </div>
      <div
        class="tour-progress"
        role="progressbar"
        aria-valuenow={stepIdx + 1}
        aria-valuemin={1}
        aria-valuemax={tour.steps.length}
        aria-label="투어 진행률"
      >
        <div class="tour-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </header>
  )
}

function Stage({ step }: { step: TourStep }) {
  const useMobile = typeof window !== "undefined" && window.innerWidth < 720
  const hotspot = step.hotspot
  const mobileOverride = step.mobileHotspot
  const effective = useMobile && mobileOverride && hotspot
    ? { ...hotspot, ...mobileOverride }
    : hotspot

  return (
    <div class="tour-stage" style={{ aspectRatio: `${step.image.width} / ${step.image.height}` }}>
      <img
        class="tour-stage__image"
        src={step.image.src}
        alt={step.image.alt}
        width={step.image.width}
        height={step.image.height}
        loading="eager"
        decoding="async"
      />
      {effective && (
        <Hotspot
          data={effective}
          onActivate={() => {
            // 스텝 내 핫스팟 — 현재는 다음 스텝 유도
          }}
        />
      )}
    </div>
  )
}

function Rail({
  step,
  stepIdx,
  isFirst,
  isLast,
  onPrev,
  onNext,
  nextTour,
}: {
  step: TourStep
  stepIdx: number
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
  nextTour?: string
}) {
  return (
    <aside class="tour-rail">
      <h2 class="tour-rail__title">{step.title}</h2>
      <p class="tour-rail__desc">{step.description}</p>

      {step.tips && step.tips.length > 0 && (
        <ul class="tour-rail__tips">
          {step.tips.map((tip, i) => (
            <li key={i} class="tour-rail__tip">{tip}</li>
          ))}
        </ul>
      )}

      {step.relatedRefs && step.relatedRefs.length > 0 && (
        <div class="tour-rail__refs">
          <div class="tour-rail__refs-head">더 자세히</div>
          <ul class="tour-rail__refs-list">
            {step.relatedRefs.map((ref, i) => (
              <li key={i}>
                <a class="tour-rail__ref-link" href={ref.path}>{ref.label} →</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div class="tour-rail__actions">
        <button
          onClick={onPrev}
          disabled={isFirst}
          class="tour-btn tour-btn--secondary"
          aria-label="이전 스텝"
        >
          ← 이전
        </button>
        {!isLast && (
          <button onClick={onNext} class="tour-btn tour-btn--primary">다음 →</button>
        )}
        {isLast && nextTour && (
          <a href={`/tour/quickstart/${nextTour}/`} class="tour-btn tour-btn--primary">
            다음 투어 →
          </a>
        )}
        {isLast && !nextTour && (
          <a href="/tour/" class="tour-btn tour-btn--primary">
            투어 완료 — 홈으로
          </a>
        )}
      </div>

      {step.nextHint && !isLast && (
        <p class="tour-rail__hint">다음: {step.nextHint}</p>
      )}
    </aside>
  )
}

