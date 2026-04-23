/**
 * 랜딩 페이지 — 안 C (Variant C "Operator's Console", 2026-04-23).
 * /tour2/ 경로 전용. 다크 모드 · monospace · horizontal sticky pin · bento · terminal CTA.
 *
 * 디자인 레퍼런스: Vercel (bento + marquee), Linear (모듈), Raycast (다크 + 모노).
 * 사용자가 /tour/(안 A)·/tour1/(안 B)·/tour2/(안 C)를 비교 평가하기 위한 세 번째 실험 안.
 */
import type { ComponentChild } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

export function LandingConsole() {
  useEffect(() => {
    document.body.classList.add("tour2-page")
    return () => {
      document.body.classList.remove("tour2-page")
    }
  }, [])

  return (
    <>
      <Hero />
      <ConsolePin />
      <Bento />
      <Ticker />
      <Terminal />
    </>
  )
}

/* ==================== Hero — Boot screen ==================== */

const TAGLINE_TEXT = "LED 전광판 운영 콘솔."

function Hero() {
  const [reveal, setReveal] = useState(false)
  useEffect(() => {
    if (reducedMotion()) {
      setReveal(true)
      return
    }
    const id = requestAnimationFrame(() => setReveal(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const reduced = reducedMotion()
  const chars = Array.from(TAGLINE_TEXT)

  return (
    <section class="console-hero" aria-label="Hero">
      <p class="console-hero__status" aria-label="시스템 상태">
        <span class="console-dot" aria-hidden="true" />
        <span>LIVE</span>
        <span class="console-hero__status-sep" aria-hidden="true">·</span>
        <span>v1.2.0</span>
        <span class="console-hero__status-sep" aria-hidden="true">·</span>
        <span>ko-KR</span>
        <span class="console-hero__status-sep" aria-hidden="true">·</span>
        <span>다빛솔루션</span>
      </p>

      <div class="console-hero__inner">
        <h1 class="console-hero__logo">DabitOne</h1>
        <p class="console-hero__tagline" aria-label={TAGLINE_TEXT}>
          {chars.map((ch, i) => (
            <span
              key={i}
              class={`console-hero__tagline-char${reveal || reduced ? " is-in" : ""}`}
              aria-hidden="true"
              style={
                reduced
                  ? undefined
                  : { transitionDelay: `${i * 28}ms` }
              }
            >
              {ch === " " ? "\u00a0" : ch}
            </span>
          ))}
        </p>
        <div class="console-hero__cta">
          <a class="tour-btn tour-btn--primary" href="#features">
            $ start tour_
          </a>
          <a
            class="tour-btn tour-btn--secondary"
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
          >
            download
          </a>
        </div>
      </div>
    </section>
  )
}

/* ==================== Feature Console — horizontal sticky pin ==================== */

const PANELS: readonly {
  num: string
  label: string
  title: string
  lines: readonly ComponentChild[]
}[] = [
  {
    num: "F01",
    label: "ALL-IN-ONE",
    title: "다섯 도구, 한 개의 창.",
    lines: [
      <>
        다빛채, <span class="mono">DBPS</span>, <span class="mono">dbNet</span>, 시리얼 모니터, 이미지·GIF 편집.
      </>,
      "각자 실행하던 프로그램이 DabitOne 하나로 모였습니다.",
    ],
  },
  {
    num: "F02",
    label: "ONE SCREEN PER TAB",
    title: "각 탭이 시작부터 끝까지.",
    lines: [
      "통신 · 설정 · 전송 · 편집 · 고급 — 다섯 개 탭.",
      "메뉴 탐색과 창 전환이 줄어든 만큼 설정 시간도 짧아집니다.",
    ],
  },
  {
    num: "F03",
    label: "DBNET",
    title: "IP 검색부터 설정까지, 한 번에.",
    lines: [
      <>
        <span class="mono">UDP</span> 브로드캐스트 한 번으로 같은 서브넷의 컨트롤러가 MAC·IP 목록으로.
      </>,
      "클릭 한 번에 연결 설정 자동 반영, 곧바로 연결 테스트.",
    ],
  },
  {
    num: "F04",
    label: "HEX · ASCII",
    title: "한 화면, 두 프로토콜.",
    lines: [
      <>
        <span class="mono">HEX</span>·<span class="mono">ASCII</span> 설정을 한 화면에서 전환, 가운데 버튼으로 즉시 변환.
      </>,
      "프로토콜 문서 없이 패킷 구조 확인, 현장 디버깅이 짧아집니다.",
    ],
  },
] as const

function ConsolePin() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return
    if (reducedMotion()) return
    // Only run scroll-linked translate on wide screens.
    const mq = window.matchMedia("(min-width: 768px)")
    if (!mq.matches) return

    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!pin || !track) return
        const rect = pin.getBoundingClientRect()
        const total = pin.offsetHeight - window.innerHeight
        const progress = Math.max(
          0,
          Math.min(1, -rect.top / Math.max(1, total)),
        )
        // 4 panels → 3 transitions spanning 0..1 progress.
        // Translate from 0 to -75% (= -3 * 25%).
        track.style.transform = `translate3d(${-progress * 75}%, 0, 0)`
        const idx = Math.min(3, Math.max(0, Math.round(progress * 3)))
        setActiveIndex(idx)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const active = PANELS[activeIndex] ?? PANELS[0]

  return (
    <section
      class="console-pin"
      id="features"
      ref={pinRef}
      aria-label={`Feature ${active.num} · ${active.label}`}
    >
      <div class="console-pin__sticky">
        <div class="console-pin__hud" aria-hidden="true">
          <span>
            <span class="console-pin__hud-label">MODULE </span>
            <span class="console-pin__hud-value">
              {String(activeIndex + 1).padStart(2, "0")} / 04
            </span>
          </span>
          <span>
            <span class="console-pin__hud-label">SCROLL / </span>
            <span class="console-pin__hud-value">HORIZONTAL</span>
          </span>
        </div>
        <div class="console-pin__track" ref={trackRef}>
          {PANELS.map((p) => (
            <article key={p.num} class="console-pin__panel">
              <div class="console-pin__panel-text">
                <p class="console-pin__panel-eyebrow">
                  {p.num} · {p.label}
                </p>
                <h2 class="console-pin__panel-title">{p.title}</h2>
                {p.lines.map((line, i) => (
                  <p key={i} class="console-pin__panel-body">
                    {line}
                  </p>
                ))}
              </div>
              <div class="console-pin__panel-visual">
                <div class="console-pin__grid-frame" aria-hidden="true" />
                <div class="console-pin__watermark" aria-hidden="true">
                  {p.num}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==================== Bento 2.0 grid ==================== */

function Bento() {
  return (
    <section class="console-bento" aria-label="시스템 구성">
      <div class="console-bento__inner">
        <p class="console-bento__eyebrow">SYSTEM · 01</p>
        <h2 class="console-bento__title">
          운영에 필요한 만큼, 정확히.
        </h2>
        <div class="console-bento__grid">
          {/* XL tile */}
          <article class="console-bento__tile console-bento__tile--xl" aria-label="실시간 편성표">
            <div class="console-bento__xl-head">
              <h3 class="console-bento__xl-title">실시간 편성표</h3>
              <span class="console-bento__xl-status">
                <span class="console-dot" aria-hidden="true" />
                ONLINE
              </span>
            </div>
            <div class="console-bento__xl-viz" aria-hidden="true">
              <div class="console-bento__xl-row">
                <span class="console-bento__xl-time">09:00 ─ 12:00</span>
                <span
                  class="console-bento__xl-bar"
                  style={{ ["--bar-start" as any]: "0%", ["--bar-width" as any]: "38%" }}
                />
              </div>
              <div class="console-bento__xl-row">
                <span class="console-bento__xl-time">12:00 ─ 15:00</span>
                <span
                  class="console-bento__xl-bar console-bento__xl-bar--accent"
                  style={{ ["--bar-start" as any]: "38%", ["--bar-width" as any]: "32%" }}
                />
              </div>
              <div class="console-bento__xl-row">
                <span class="console-bento__xl-time">15:00 ─ 18:00</span>
                <span
                  class="console-bento__xl-bar"
                  style={{ ["--bar-start" as any]: "70%", ["--bar-width" as any]: "28%" }}
                />
              </div>
              <div class="console-bento__xl-row">
                <span class="console-bento__xl-time">18:00 ─ 21:00</span>
                <span
                  class="console-bento__xl-bar"
                  style={{ ["--bar-start" as any]: "22%", ["--bar-width" as any]: "54%" }}
                />
              </div>
            </div>
            <div class="console-bento__xl-foot">
              <span>PLA · BGP · 메시지</span>
              <span>Quickstart 06 / 07</span>
            </div>
          </article>

          {/* Small tiles */}
          <article class="console-bento__tile console-bento__tile--sm">
            <div class="console-bento__tile-head">
              <span class="console-bento__tag">TABS</span>
            </div>
            <div>
              <div class="console-bento__stat-num">5</div>
              <div class="console-bento__stat-label">Workspace Tabs</div>
              <p class="console-bento__stat-hint">통신 · 설정 · 전송 · 편집 · 고급</p>
            </div>
          </article>

          <article class="console-bento__tile console-bento__tile--sm">
            <div class="console-bento__tile-head">
              <span class="console-bento__tag">NET</span>
            </div>
            <div>
              <div class="console-bento__stat-num">6+</div>
              <div class="console-bento__stat-label">Protocols</div>
              <p class="console-bento__stat-hint">Serial · TCP · UDP · BLE · MQTT · dbNet</p>
            </div>
          </article>

          <article class="console-bento__tile console-bento__tile--md">
            <div class="console-bento__tile-head">
              <span class="console-bento__tag">TOUR</span>
            </div>
            <div>
              <div class="console-bento__stat-num">8</div>
              <div class="console-bento__stat-label">Quickstart Scenarios</div>
              <p class="console-bento__stat-hint">연결 · 크기 · 전송 · 이미지 · GIF · PLA · BGP · 펌웨어</p>
            </div>
          </article>

          <article class="console-bento__tile console-bento__tile--md">
            <div class="console-bento__tile-head">
              <span class="console-bento__tag">DOCS</span>
            </div>
            <div>
              <div class="console-bento__stat-num">2</div>
              <div class="console-bento__stat-label">Reference PDF</div>
              <p class="console-bento__stat-hint">기능편 · 운영편</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ==================== Marquee ticker ==================== */

const TICKER_ITEMS: readonly string[] = [
  "SERIAL",
  "TCP/IP",
  "UDP",
  "BLE",
  "MQTT",
  "dbNet",
  "RS-485",
  "MODBUS",
  "RTU",
  "ETHERNET",
  "WIFI",
  "4G",
]

function Ticker() {
  // Duplicate content for seamless loop.
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div class="console-ticker" aria-hidden="true">
      <div class="console-ticker__track">
        {doubled.map((item, i) => (
          <>
            <span key={`item-${i}`} class="console-ticker__item">
              {item}
            </span>
            <span key={`sep-${i}`} class="console-ticker__sep">
              ·
            </span>
          </>
        ))}
      </div>
    </div>
  )
}

/* ==================== Terminal CTA ==================== */

function Terminal() {
  return (
    <section class="console-terminal" aria-label="설치">
      <div class="console-terminal__inner">
        <p class="console-terminal__eyebrow">READY</p>
        <p class="console-terminal__line" role="text" aria-label="install dabitone">
          <span class="console-terminal__prompt">$ </span>
          <span class="console-terminal__command">install dabitone</span>
          <span class="console-terminal__caret" aria-hidden="true">_</span>
        </p>
        <p class="console-terminal__sub">
          다빛솔루션 공식 사이트에서 설치 파일을 받습니다.
        </p>
        <div class="console-terminal__actions">
          <a
            class="tour-btn tour-btn--primary"
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
          >
            dabitsol.com →
          </a>
          <a
            class="tour-btn tour-btn--secondary"
            href="/tour/quickstart/01-first-connection/"
          >
            /quickstart
          </a>
        </div>
        <p class="console-terminal__colophon">
          © 다빛솔루션 · <span class="console-terminal__ok" aria-hidden="true">●</span>{" "}
          <span>LIVE</span>
        </p>
      </div>
    </section>
  )
}
