/**
 * 랜딩 페이지 — 안 Horizontal (Full Horizontal Scroll, 2026-04-23).
 * /tour5/ 경로 전용. 페이지 자체가 가로 film strip. 6 패널 scroll-snap.
 *
 * 특징:
 *  - wheel 이벤트 override: 세로 델타 → 가로 스크롤 translate
 *  - scroll-snap-type: x mandatory — 각 패널이 full-viewport width
 *  - 키보드 ← →, 프로그레스 dot (클릭 이동)
 *  - 모바일 <900px: 세로 스택으로 자동 fallback
 *  - 패널 배경 교차(even/odd) + 우측 거대 번호 워터마크
 *
 * 레퍼런스: sitedeck.studio, niu.works, Apple Pages 2016 horizontal macOS,
 *         Pitch horizontal decks.
 */
import { useEffect, useRef, useState } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

const PANELS_COUNT = 6

export function LandingHorizontal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    document.body.classList.add("tour5-page")
    return () => document.body.classList.remove("tour5-page")
  }, [])

  // Desktop: hijack wheel to translate vertical → horizontal
  useEffect(() => {
    if (window.matchMedia("(max-width: 899px)").matches) return
    const container = containerRef.current
    if (!container) return

    function onWheel(e: WheelEvent) {
      // 이미 가로 wheel이면 건드리지 않음. 세로 wheel만 가로로 변환.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        container!.scrollLeft += e.deltaY
      }
    }
    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [])

  // 키보드 ← → 네비
  useEffect(() => {
    if (window.matchMedia("(max-width: 899px)").matches) return
    const container = containerRef.current
    if (!container) return

    function onKey(e: KeyboardEvent) {
      const tgt = e.target as HTMLElement | null
      if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")) return
      const vw = window.innerWidth
      if (e.key === "ArrowRight") {
        e.preventDefault()
        container!.scrollBy({ left: vw, behavior: reducedMotion() ? "auto" : "smooth" })
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        container!.scrollBy({ left: -vw, behavior: reducedMotion() ? "auto" : "smooth" })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // 활성 패널 추적 — scroll 이벤트 → rAF throttle
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const idx = Math.round(container!.scrollLeft / window.innerWidth)
        setActiveIdx(Math.max(0, Math.min(PANELS_COUNT - 1, idx)))
      })
    }
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      container.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  function gotoPanel(idx: number) {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      left: idx * window.innerWidth,
      behavior: reducedMotion() ? "auto" : "smooth",
    })
  }

  return (
    <div class="tour5-shell">
      <div class="tour5-track" ref={containerRef}>
        <Panel1Hero onNext={() => gotoPanel(1)} />
        <PanelFeature
          num="01"
          label="ALL-IN-ONE"
          title="다섯 도구가 하나의 앱 안에."
          lines={[
            "다빛채, DBPS, dbNet, 시리얼 모니터, 이미지·GIF 편집.",
            "예전엔 각자 실행하던 프로그램들이 한 창 안에.",
          ]}
          panelIdx={2}
        />
        <PanelFeature
          num="02"
          label="ONE SCREEN PER TAB"
          title="각 탭이 시작부터 끝까지."
          lines={[
            "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
            "메뉴 탐색과 창 전환이 줄어듭니다.",
          ]}
          panelIdx={3}
        />
        <PanelFeature
          num="03"
          label="DBNET"
          title="IP 검색과 설정, 가장 빠른 길."
          lines={["UDP 브로드캐스트 한 번으로 MAC·IP 목록.", "클릭 한 번에 연결 설정 자동 반영."]}
          panelIdx={4}
        />
        <PanelFeature
          num="04"
          label="HEX · ASCII"
          title="한 화면에서, 두 프로토콜."
          lines={["HEX·ASCII 설정을 한 화면에서 전환.", "프로토콜 문서 없이도 패킷 구조 확인."]}
          panelIdx={5}
        />
        <Panel6End />
      </div>
      <ProgressDots count={PANELS_COUNT} active={activeIdx} onGoto={gotoPanel} />
    </div>
  )
}

function Panel1Hero({ onNext }: { onNext: () => void }) {
  return (
    <section class="tour5-panel tour5-panel--hero">
      <div class="tour5-panel__inner">
        <p class="tour5-hero__eyebrow">DABITONE · v1.2.0</p>
        <h1 class="tour5-hero__title">DabitOne.</h1>
        <p class="tour5-hero__tagline">
          픽셀에서 프로토콜까지,
          <br />
          하나의 소프트웨어.
        </p>
        <p class="tour5-hero__sub">다빛솔루션 LED 전광판 운영 데스크톱 앱. 가로로 스크롤하세요.</p>
        <div class="tour5-hero__cta">
          <button class="tour-btn tour-btn--primary" onClick={onNext}>
            다음 →
          </button>
          <a
            class="tour-btn tour-btn--secondary"
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
          >
            DabitOne 다운로드
          </a>
        </div>
      </div>
      <PanelMeta idx={1} total={PANELS_COUNT} />
    </section>
  )
}

function PanelFeature({
  num,
  label,
  title,
  lines,
  panelIdx,
}: {
  num: string
  label: string
  title: string
  lines: string[]
  panelIdx: number
}) {
  return (
    <section class="tour5-panel tour5-panel--feature">
      <div class="tour5-panel__inner tour5-feature">
        <div class="tour5-feature__text">
          <div class="tour5-feature__head">
            <span class="tour5-feature__num">F{num}</span>
            <span class="tour5-feature__label">{label}</span>
          </div>
          <h2 class="tour5-feature__title">{title}</h2>
          <div class="tour5-feature__body">
            {lines.map((l, i) => (
              <p class="tour5-feature__line" key={i}>
                {l}
              </p>
            ))}
          </div>
        </div>
        <div class="tour5-feature__mark" aria-hidden="true">
          {num}
        </div>
      </div>
      <PanelMeta idx={panelIdx} total={PANELS_COUNT} />
    </section>
  )
}

function Panel6End() {
  const quickstart = [
    { num: "01", name: "통신", slug: "01-first-connection" },
    { num: "02", name: "설정", slug: "02-screen-size" },
    { num: "03", name: "전송", slug: "03-send-message" },
    { num: "04", name: "편집", slug: "04-edit-image" },
    { num: "05", name: "고급", slug: "08-firmware" },
  ]
  return (
    <section class="tour5-panel tour5-panel--end">
      <div class="tour5-panel__inner tour5-end">
        <p class="tour5-end__eyebrow">QUICKSTART</p>
        <h2 class="tour5-end__title">어디서부터 시작할까요?</h2>
        <ul class="tour5-end__list">
          {quickstart.map((q) => (
            <li key={q.num}>
              <a class="tour5-end__link" href={`/tour/quickstart/${q.slug}/`}>
                <span class="tour5-end__num">{q.num}</span>
                <span class="tour5-end__name">{q.name}</span>
                <span class="tour5-end__arrow">→</span>
              </a>
            </li>
          ))}
        </ul>
        <div class="tour5-end__divider" />
        <div class="tour5-end__cta">
          <a
            class="tour-btn tour-btn--primary"
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
          >
            DabitOne 다운로드 →
          </a>
        </div>
        <p class="tour5-end__colophon">© 다빛솔루션 · 2026</p>
      </div>
      <PanelMeta idx={6} total={PANELS_COUNT} />
    </section>
  )
}

function PanelMeta({ idx, total }: { idx: number; total: number }) {
  return (
    <div class="tour5-panel__meta">
      <span class="tour5-panel__idx">
        {String(idx).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  )
}

function ProgressDots({
  count,
  active,
  onGoto,
}: {
  count: number
  active: number
  onGoto: (i: number) => void
}) {
  return (
    <nav class="tour5-progress" aria-label="패널 네비게이션">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          class={`tour5-progress__dot ${i === active ? "is-active" : ""}`}
          onClick={() => onGoto(i)}
          aria-label={`${i + 1}번 패널로 이동`}
        />
      ))}
    </nav>
  )
}
