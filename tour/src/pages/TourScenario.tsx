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
import { animate, reducedMotion } from "../lib/motion"
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
              color: "var(--tour-c-accent)",
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
    <main
      class="tour-scenario"
      aria-label={`투어: ${tour.title}`}
      style={{
        minHeight: "100vh",
        padding: "40px 32px",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      <LiveRegion
        message={`스텝 ${stepIdx + 1} / ${tour.steps.length}: ${step.title}`}
      />

      <ProgressHeader tour={tour} stepIdx={stepIdx} pct={progressPct} />

      <div
        class="tour-scenario__stage-and-rail"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.8fr) minmax(280px, 1fr)",
          gap: "40px",
          marginTop: "40px",
          alignItems: "start",
        }}
      >
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
    </main>
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
    <header style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "12px",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "var(--tour-fs-small)",
              color: "var(--tour-c-text-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            DabitOne 투어
          </div>
          <h1
            style={{
              fontFamily: "var(--tour-font-display)",
              fontSize: "var(--tour-fs-section)",
              letterSpacing: "var(--tour-ls-tight)",
              fontWeight: 600,
              margin: 0,
              lineHeight: "var(--tour-lh-tight)",
            }}
          >
            {tour.title}
          </h1>
        </div>
        <div
          style={{
            fontSize: "var(--tour-fs-body)",
            color: "var(--tour-c-text-soft)",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 500,
          }}
          aria-live="polite"
        >
          {stepIdx + 1} / {tour.steps.length}
        </div>
      </div>
      <div
        style={{
          height: "3px",
          background: "var(--tour-c-line)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={stepIdx + 1}
        aria-valuemin={1}
        aria-valuemax={tour.steps.length}
        aria-label="투어 진행률"
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--tour-c-accent)",
            transition: reducedMotion()
              ? "none"
              : "width 400ms var(--tour-ease-out)",
          }}
        />
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
    <div class="tour-stage" style={{ aspectRatio: `${step.image.width} / ${step.image.height}`, maxHeight: "78vh" }}>
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
    <aside
      class="tour-scenario__rail"
      style={{
        position: "sticky",
        top: "40px",
        background: "var(--tour-c-bg-panel)",
        padding: "32px 28px",
        border: "1px solid var(--tour-c-line)",
        boxShadow: "var(--tour-shadow-pop)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--tour-font-display)",
          fontSize: "clamp(24px, 2.2vw, 32px)",
          letterSpacing: "var(--tour-ls-tight)",
          fontWeight: 600,
          lineHeight: "var(--tour-lh-tight)",
          margin: "0 0 16px",
        }}
      >
        {step.title}
      </h2>
      <p
        style={{
          fontSize: "var(--tour-fs-body)",
          lineHeight: "var(--tour-lh-normal)",
          color: "var(--tour-c-text-soft)",
          margin: "0 0 24px",
        }}
      >
        {step.description}
      </p>

      {step.tips && step.tips.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 24px",
            borderTop: "1px solid var(--tour-c-line)",
            paddingTop: "16px",
          }}
        >
          {step.tips.map((tip, i) => (
            <li
              key={i}
              style={{
                fontSize: "15px",
                color: "var(--tour-c-text-soft)",
                padding: "6px 0 6px 20px",
                position: "relative",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  color: "var(--tour-c-accent)",
                }}
              >
                ·
              </span>
              {tip}
            </li>
          ))}
        </ul>
      )}

      {step.relatedRefs && step.relatedRefs.length > 0 && (
        <div
          style={{
            borderTop: "1px solid var(--tour-c-line)",
            paddingTop: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "var(--tour-c-text-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            더 자세히
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {step.relatedRefs.map((ref, i) => (
              <li key={i} style={{ marginBottom: "4px" }}>
                <a
                  href={ref.path}
                  style={{
                    color: "var(--tour-c-accent)",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  {ref.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={onPrev}
          disabled={isFirst}
          style={{
            ...secondaryButton,
            opacity: isFirst ? 0.4 : 1,
            cursor: isFirst ? "not-allowed" : "pointer",
          }}
          aria-label="이전 스텝"
        >
          ← 이전
        </button>
        {!isLast && (
          <button onClick={onNext} style={primaryButton}>
            다음 →
          </button>
        )}
        {isLast && nextTour && (
          <a href={`/tour/quickstart/${nextTour}/`} style={primaryLink}>
            다음 투어 →
          </a>
        )}
        {isLast && !nextTour && (
          <a href="/tour/" style={primaryLink}>
            투어 완료 — 홈으로
          </a>
        )}
      </div>

      {step.nextHint && !isLast && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--tour-c-text-soft)",
            marginTop: "16px",
            fontStyle: "italic",
          }}
        >
          다음: {step.nextHint}
        </p>
      )}
    </aside>
  )
}

const primaryButton: preact.JSX.CSSProperties = {
  padding: "12px 24px",
  fontFamily: "var(--tour-font-body)",
  fontSize: "var(--tour-fs-body)",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  background: "var(--tour-c-accent)",
  color: "#fff",
  border: 0,
  borderRadius: 0,
  cursor: "pointer",
}
const primaryLink: preact.JSX.CSSProperties = {
  ...primaryButton,
  textDecoration: "none",
  display: "inline-block",
}
const secondaryButton: preact.JSX.CSSProperties = {
  padding: "12px 24px",
  fontFamily: "var(--tour-font-body)",
  fontSize: "var(--tour-fs-body)",
  fontWeight: 500,
  background: "transparent",
  color: "var(--tour-c-text)",
  border: "1px solid var(--tour-c-line-strong)",
  borderRadius: 0,
  cursor: "pointer",
}
