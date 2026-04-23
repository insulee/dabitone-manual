/**
 * 랜딩 페이지 — 안 Scrolly (Scrollytelling with pinned DabitOne UI, 2026-04-23).
 * /tour6/ 경로 전용. 좌 45%에 DabitOne 앱 UI mock이 sticky로 고정,
 * 우 55%는 4 chapter + intro + end 세로 스크롤. IntersectionObserver가
 * 각 chapter의 data-state를 읽어 좌측 UI mock을 4 state로 전환.
 *
 * 참조:
 *  - NYT/Bloomberg scrollytelling
 *  - Apple MacBook Pro 스펙 페이지 scroll-pinned laptop
 *  - Shorthand/Webflow scrollytelling showcase
 */
import { useEffect, useRef, useState } from "preact/hooks"

type ChapterDef = {
  id: string
  state: string
  title: string
  paragraphs: string[]
}

const CHAPTERS: readonly ChapterDef[] = [
  {
    id: "ch1",
    state: "state-allinone",
    title: "F01 · ALL-IN-ONE",
    paragraphs: [
      "다빛채, DBPS(다빛프로토콜시뮬레이터), dbNet, 시리얼 모니터, 이미지·GIF 편집.",
      "예전엔 각자 실행하던 프로그램들이 DabitOne 한 창 안에 모였습니다.",
    ],
  },
  {
    id: "ch2",
    state: "state-screens",
    title: "F02 · ONE SCREEN PER TAB",
    paragraphs: [
      "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
      "메뉴 탐색과 창 전환이 줄어든 만큼, 설정 시간도 짧아집니다.",
    ],
  },
  {
    id: "ch3",
    state: "state-dbnet",
    title: "F03 · DBNET",
    paragraphs: [
      "UDP 브로드캐스트 한 번으로 같은 서브넷의 컨트롤러가 MAC·IP 목록으로.",
      "클릭 한 번에 연결 설정 자동 반영, 곧바로 연결 테스트.",
    ],
  },
  {
    id: "ch4",
    state: "state-hex",
    title: "F04 · HEX · ASCII",
    paragraphs: [
      "HEX·ASCII 설정을 한 화면에서 전환, 가운데 버튼으로 즉시 변환.",
      "프로토콜 문서 없이도 패킷 구조 확인, 현장 디버깅 시간이 짧아집니다.",
    ],
  },
]

export function LandingScrolly() {
  const [activeState, setActiveState] = useState<string>("state-allinone")
  const chaptersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add("tour6-page")
    return () => document.body.classList.remove("tour6-page")
  }, [])

  useEffect(() => {
    const chapters = chaptersRef.current?.querySelectorAll<HTMLElement>(".tour6-chapter")
    if (!chapters || chapters.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        // 뷰포트 중앙에 가장 가까운 entry를 선택하여 그 chapter의 state를 active 로.
        let best: IntersectionObserverEntry | null = null
        let bestDist = Infinity
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const rect = e.boundingClientRect
          const middle = rect.top + rect.height / 2
          const dist = Math.abs(middle - window.innerHeight / 2)
          if (dist < bestDist) {
            bestDist = dist
            best = e
          }
        }
        if (best) {
          const el = best.target as HTMLElement
          const state = el.dataset.state
          if (state) setActiveState(state)
        }
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-20% 0px -20% 0px" },
    )
    chapters.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <div class="tour6-shell">
      <aside class="tour6-stage" aria-hidden="true">
        <UIMock state={activeState} />
      </aside>
      <div class="tour6-story" ref={chaptersRef}>
        <IntroChapter />
        {CHAPTERS.map((ch) => (
          <section class="tour6-chapter" key={ch.id} data-state={ch.state}>
            <p class="tour6-chapter__eyebrow">{ch.title.split(" · ")[0]}</p>
            <h2 class="tour6-chapter__title">{ch.title.split(" · ").slice(1).join(" · ")}</h2>
            {ch.paragraphs.map((p, i) => (
              <p class="tour6-chapter__body" key={i}>
                {p}
              </p>
            ))}
          </section>
        ))}
        <EndChapter />
      </div>
    </div>
  )
}

function UIMock({ state }: { state: string }) {
  return (
    <div class={`tour6-mock ${state}`}>
      <div class="tour6-mock__window">
        <div class="tour6-mock__titlebar">
          <span class="tour6-mock__dot tour6-mock__dot--r" />
          <span class="tour6-mock__dot tour6-mock__dot--y" />
          <span class="tour6-mock__dot tour6-mock__dot--g" />
          <span class="tour6-mock__title">DabitOne — {getTitleForState(state)}</span>
        </div>
        <div class="tour6-mock__body">
          <div class="tour6-mock__sidebar">
            {["통신", "설정", "전송", "편집", "고급"].map((t, i) => (
              <div key={i} class={`tour6-mock__tab ${getTabHighlight(state, i)}`}>
                {t}
              </div>
            ))}
          </div>
          <div class="tour6-mock__content">
            <StateAllInOne />
            <StateScreens />
            <StateDbnet />
            <StateHex />
          </div>
        </div>
      </div>
    </div>
  )
}

function getTitleForState(s: string): string {
  if (s === "state-allinone") return "통합 앱"
  if (s === "state-screens") return "통신"
  if (s === "state-dbnet") return "dbNet"
  if (s === "state-hex") return "편집"
  return "통합 앱"
}

function getTabHighlight(s: string, i: number): string {
  if (s === "state-screens") return i === 0 ? "is-active" : ""
  if (s === "state-dbnet") return i === 0 ? "is-active" : ""
  if (s === "state-hex") return i === 3 ? "is-active" : ""
  return i === 0 ? "is-active" : ""
}

// 각 state는 자체 UI preview를 렌더하고, CSS로 parent class에 따라 표시 여부를 토글.
function StateAllInOne() {
  return (
    <div class="tour6-state tour6-state--allinone">
      <div class="tour6-state__title">다섯 도구 → 하나</div>
      <div class="tour6-state__icons">
        {["다빛채", "DBPS", "dbNet", "Serial", "Editor"].map((n, i) => (
          <div key={i} class="tour6-state__icon" style={{ animationDelay: `${i * 120}ms` }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  )
}

function StateScreens() {
  return (
    <div class="tour6-state tour6-state--screens">
      <div class="tour6-state__screen-demo">
        <div class="tour6-state__row">통신 — Serial · TCP · UDP</div>
        <div class="tour6-state__row">설정 — 화면 · 시계 · 밝기</div>
        <div class="tour6-state__row">전송 — 메시지 · 스케줄</div>
        <div class="tour6-state__row">편집 — 텍스트 · 이미지 · GIF</div>
        <div class="tour6-state__row">고급 — 펌웨어 · 로그 · 진단</div>
      </div>
    </div>
  )
}

function StateDbnet() {
  return (
    <div class="tour6-state tour6-state--dbnet">
      <div class="tour6-state__dbnet-label">UDP BROADCAST</div>
      <div class="tour6-state__dbnet-pulse" aria-hidden="true" />
      <div class="tour6-state__dbnet-list">
        <div class="tour6-state__dbnet-item">
          <span>00:1A:2B:3C:4D:5E</span>
          <span>192.168.0.201</span>
        </div>
        <div class="tour6-state__dbnet-item">
          <span>00:1A:2B:3C:4D:5F</span>
          <span>192.168.0.202</span>
        </div>
        <div class="tour6-state__dbnet-item">
          <span>00:1A:2B:3C:4D:60</span>
          <span>192.168.0.203</span>
        </div>
      </div>
    </div>
  )
}

function StateHex() {
  return (
    <div class="tour6-state tour6-state--hex">
      <div class="tour6-state__hex-header">메시지 · 섹션 · 페이지</div>
      <div class="tour6-state__hex-radios">
        {["MSG.01", "MSG.02", "MSG.03"].map((n, i) => (
          <div key={i} class={`tour6-state__hex-radio ${i === 1 ? "is-active" : ""}`}>
            ◉ {n}
          </div>
        ))}
      </div>
      <div class="tour6-state__hex-convert">⇅ ASCII 변환</div>
      <div class="tour6-state__hex-ascii">AT+PKT=0x01,0x02,...</div>
    </div>
  )
}

function IntroChapter() {
  return (
    <section class="tour6-chapter tour6-chapter--intro" data-state="state-allinone">
      <p class="tour6-hero__eyebrow">DABITONE · v1.2.0</p>
      <h1 class="tour6-hero__title">
        DabitOne.
        <br />
        스크롤하며 체험하세요.
      </h1>
      <p class="tour6-hero__tagline">픽셀에서 프로토콜까지, 하나의 소프트웨어.</p>
      <p class="tour6-hero__sub">
        왼쪽 화면이 스크롤에 따라 DabitOne의 네 가지 핵심 기능을 실연합니다.
      </p>
      <div class="tour6-hero__cta">
        <a
          class="tour-btn tour-btn--secondary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
      </div>
    </section>
  )
}

function EndChapter() {
  return (
    <section class="tour6-chapter tour6-chapter--end" data-state="state-hex">
      <p class="tour6-chapter__eyebrow">END</p>
      <h2 class="tour6-chapter__title">직접 써볼 차례.</h2>
      <p class="tour6-chapter__body">
        투어를 끝까지 스크롤했습니다. 이제 DabitOne을 설치하거나, 상세한 Quickstart로 이동하세요.
      </p>
      <div class="tour6-chapter__cta">
        <a
          class="tour-btn tour-btn--primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드 →
        </a>
        <a class="tour-btn tour-btn--secondary" href="/tour/quickstart/01-first-connection/">
          Quickstart로
        </a>
      </div>
    </section>
  )
}
