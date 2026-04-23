/**
 * 랜딩 페이지 — 안 F (Variant Concept 1 + F "Editorial Magazine", 2026-04-23).
 * /tour4/ 경로 전용. Wallpaper* / Kinfolk / Cereal 매거진 print 스타일 web 구현.
 *
 * 특징:
 *  - Serif display (Source Serif 4 Variable, opsz+wght) + Pretendard Variable 본문
 *  - VOL.1 · ISSUE 01 masthead + huge serif DabitOne. cover
 *  - FIG.01~04 에디토리얼 TOC + asymmetric 5/8 비대칭 figure spreads (F02·F04 flip)
 *  - 단일 red accent #D40000 (FIG 라벨·얇은 rule·hover·ticker rule·colophon CTA만)
 *  - Display terminology marquee (italic serif, prefers-reduced-motion 존중)
 *  - Editorial colophon — PDF 참조 + Typeset in... + DABITSOL.COM CTA
 */
import { useEffect, useRef } from "preact/hooks"
import { revealOnEnter } from "../lib/observe"

type SpreadDef = {
  fig: string
  page: string
  label: string
  title: string
  body: readonly string[]
  marginalia: string
  mark: string
  caption: string
  flip?: boolean
}

const SPREADS: readonly SpreadDef[] = [
  {
    fig: "FIG. 01",
    page: "p.01",
    label: "ALL-IN-ONE",
    title: "다섯 도구가 하나의 앱 안에.",
    body: [
      "다빛채, DBPS(다빛프로토콜시뮬레이터), dbNet, 시리얼 모니터, 이미지·GIF 편집.",
      "예전엔 각자 실행하던 프로그램들이 DabitOne 한 창 안에 모였습니다.",
    ],
    marginalia: "통합은 속도다.",
    mark: "01",
    caption: "FIG.01 — Five tools, one surface.",
  },
  {
    fig: "FIG. 02",
    page: "p.02",
    label: "ONE SCREEN PER TAB",
    title: "각 탭이 해당 작업의 시작부터 끝까지.",
    body: [
      "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
      "레거시에서 설정은 흩어져 있었습니다. 화면 크기, 표출 신호, 폰트 전송이 각자 다른 창에서.",
      "DabitOne은 한 화면 안에 모았습니다. 메뉴 탐색과 창 전환이 줄어든 만큼, 설정 시간도 짧아집니다.",
    ],
    marginalia: "한 화면이 시간을 줄인다.",
    mark: "02",
    caption: "FIG.02 — One screen, one job, complete.",
    flip: true,
  },
  {
    fig: "FIG. 03",
    page: "p.03",
    label: "DBNET",
    title: "IP 검색과 설정, 가장 빠른 길.",
    body: [
      "UDP 브로드캐스트 한 번으로 같은 서브넷의 컨트롤러가 MAC·IP 목록으로.",
      "장비를 클릭하면 연결 설정으로 자동 반영, 곧바로 연결 테스트.",
      "이전보다 안정적인 응답, 타이핑과 오타 확인이 줄어든 흐름.",
    ],
    marginalia: "네트워크 탐색이 타이핑보다 빠르다.",
    mark: "03",
    caption: "FIG.03 — Discovery replaces input.",
  },
  {
    fig: "FIG. 04",
    page: "p.04",
    label: "HEX · ASCII",
    title: "한 화면에서, 두 프로토콜.",
    body: [
      "메시지 종류·섹션·페이지를 라디오·콤보박스로 선택하는 HEX. 텍스트 영역에 직접 쓰는 ASCII.",
      "가운데의 \u201CASCII 변환\u201D 버튼이 HEX 설정값을 ASCII 문자열로 바꿔 줍니다.",
      "프로토콜 문서 없이도 패킷 구조 확인. 시스템 연동과 현장 디버깅에서 학습 시간이 짧아집니다.",
    ],
    marginalia: "두 프로토콜이 한 창에 공존한다.",
    mark: "04",
    caption: "FIG.04 — Two protocols, one window.",
    flip: true,
  },
] as const

const TICKER_TERMS: readonly string[] = [
  "PIXEL PITCH",
  "DISPLAY CONTROLLER",
  "SCANNING",
  "FRAME RATE",
  "DVI",
  "HDMI",
  "COLOR DEPTH",
  "BRIGHTNESS",
  "GAMMA",
  "REFRESH CYCLE",
  "SYNC",
  "BLANKING",
  "PROTOCOL",
  "BROADCAST",
  "BLANK INTERVAL",
  "CHROMA",
  "LUMA",
] as const

export function LandingEditorial() {
  useEffect(() => {
    document.body.classList.add("tour4-page")
    return () => {
      document.body.classList.remove("tour4-page")
    }
  }, [])

  return (
    <div class="tour4-shell">
      <Cover />
      <Contents />
      <Spreads />
      <Ticker />
      <Colophon />
    </div>
  )
}

function Cover() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <header ref={ref} class="tour4-cover" id="cover" aria-label="커버" style={{ opacity: 0 }}>
      <div class="tour4-cover__masthead">
        <span>VOL.1 · ISSUE 01</span>
        <span>APRIL 2026</span>
      </div>
      <div class="tour4-cover__left">
        <h1 class="tour4-cover__title">DabitOne.</h1>
        <p class="tour4-cover__tagline">
          픽셀에서 프로토콜까지,
          <br />
          하나의 소프트웨어.
        </p>
        <p class="tour4-cover__meta">다빛솔루션 발행 · 공식 매뉴얼 — 2026</p>
      </div>
      <div class="tour4-cover__visual" aria-hidden="true">
        <span class="tour4-cover__fig-mark">01</span>
      </div>
      <a class="tour4-cover__read-link" href="#contents">
        READ THE TOUR →
      </a>
    </header>
  )
}

function Contents() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour4-contents"
      id="contents"
      aria-label="목차"
      style={{ opacity: 0 }}
    >
      <p class="tour4-contents__intro">
        LED 전광판 운영 소프트웨어 DabitOne의
        <br />
        작동 원리와 변화를 기록합니다.
      </p>
      <div class="tour4-contents__right">
        <p class="tour4-contents__head">INSIDE — FOUR FEATURES</p>
        <h2 class="tour4-contents__title">네 가지 특징.</h2>
        <ul class="tour4-contents__list" role="list">
          {SPREADS.map((s) => (
            <li key={s.fig}>
              <a class="tour4-contents__item" href={`#${s.fig.replace(/[. ]/g, "").toLowerCase()}`}>
                <span class="tour4-contents__fig">{s.fig}</span>
                <span class="tour4-contents__title-entry">{s.title}</span>
                <span class="tour4-contents__page">{s.page}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Spreads() {
  return (
    <>
      {SPREADS.map((s) => (
        <Spread key={s.fig} spread={s} />
      ))}
    </>
  )
}

function Spread({ spread }: { spread: SpreadDef }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  const anchor = spread.fig.replace(/[. ]/g, "").toLowerCase()
  return (
    <section
      ref={ref}
      class={`tour4-spread${spread.flip ? " tour4-spread--flip" : ""}`}
      id={anchor}
      aria-label={spread.label.toLowerCase()}
      style={{ opacity: 0 }}
    >
      <div
        class="tour4-spread__figure"
        data-fig={spread.fig}
        data-caption={spread.caption}
        aria-hidden="true"
      >
        <span class="tour4-spread__fig-mark">{spread.mark}</span>
      </div>
      <div class="tour4-spread__text">
        <p class="tour4-spread__fig-label">{spread.fig}</p>
        <p class="tour4-spread__label">{spread.label}</p>
        <h2 class="tour4-spread__title">{spread.title}</h2>
        <div class="tour4-spread__body">
          {spread.body.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <hr class="tour4-spread__hairline" aria-hidden="true" />
        <p class="tour4-spread__marginalia">{spread.marginalia}</p>
      </div>
    </section>
  )
}

function Ticker() {
  // 두 번 렌더링 → 무한 scroll 효과. 키보드 포커스 대상 아님.
  const items = [...TICKER_TERMS, ...TICKER_TERMS]
  return (
    <section class="tour4-ticker" aria-hidden="true">
      <div class="tour4-ticker__track">
        {items.map((term, i) => (
          <span key={i} class="tour4-ticker__item">
            {term}
          </span>
        ))}
      </div>
    </section>
  )
}

function Colophon() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section ref={ref} class="tour4-colophon" aria-label="콜로폰" style={{ opacity: 0 }}>
      <p class="tour4-colophon__head">COLOPHON</p>
      <div class="tour4-colophon__right">
        <p class="tour4-colophon__intro">
          이 웹사이트는 DabitOne 매뉴얼의 디지털판입니다.
          <br />
          Pretendard Variable과 Source Serif 4로 조판.
        </p>
        <div class="tour4-colophon__pdfs">
          <a class="tour4-colophon__pdf" href="/pdf/DabitOne_Manual_Reference.pdf">
            <span class="tour4-colophon__pdf-tag">A</span>
            <span class="tour4-colophon__pdf-name">매뉴얼 — 기능편</span>
            <span class="tour4-colophon__pdf-meta">p.reference · PDF</span>
          </a>
          <a class="tour4-colophon__pdf" href="/pdf/DabitOne_Manual_Operation.pdf">
            <span class="tour4-colophon__pdf-tag">B</span>
            <span class="tour4-colophon__pdf-name">매뉴얼 — 운영편</span>
            <span class="tour4-colophon__pdf-meta">p.operation · PDF</span>
          </a>
        </div>
        <div class="tour4-colophon__meta">
          <p>DabitOne.app v1.2.0 · 2026 다빛솔루션</p>
          <p>Typeset in Source Serif 4 + Pretendard Variable</p>
          <p>Web build: 87dbd5a</p>
        </div>
      </div>
      <a
        class="tour4-colophon__cta"
        href="https://www.dabitsol.com"
        target="_blank"
        rel="noreferrer"
      >
        → DABITSOL.COM
      </a>
    </section>
  )
}
