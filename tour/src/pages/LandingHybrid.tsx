/**
 * 랜딩 페이지 — 안 Hybrid (Vol. 11, 2026-04-24 재작성).
 * /tour11/ 경로 전용. 구성 = tour1 기본 구조 + 가운데 "달라진 네 가지" 섹션만
 * tour2 방식(가로 sticky pin)으로 교체.
 *
 * 구성 (위→아래):
 *  1. Hero — tour1 컴팩트 히어로. 2개의 Magnetic CTA (반경 140px · 최대 14px).
 *  2. HorizontalFeatures — F01~F04 4개 패널을 세로 스크롤 진행도에 맞춰 가로 translate.
 *     섹션 높이 400vh, 내부는 sticky top:0 height:100vh. 패널 위 커서 따라가는 cyan spotlight.
 *  3. QuickstartTabs — tour1 TabIndex와 동일한 5 tabs. Hover 반응 4가지 동시.
 *  4. MagneticFooter — 다크 패널. Hero와 동일한 Magnetic CTA.
 */
import { useEffect, useRef, useState } from "preact/hooks"
import { reducedMotion } from "../lib/motion"

export function LandingHybrid() {
  useEffect(() => {
    document.body.classList.add("tour11-page")
    return () => {
      document.body.classList.remove("tour11-page")
    }
  }, [])

  return (
    <div class="tour11-shell">
      <Hero />
      <HorizontalFeatures />
      <QuickstartTabs />
      <MagneticFooter />
    </div>
  )
}

/* =========================================================================
   Hero — 컴팩트 히어로 + Magnetic CTA
   ========================================================================= */

function Hero() {
  return (
    <section class="tour11-hero" aria-label="Hero">
      <div class="tour11-hero__inner">
        <h1 class="tour11-hero__title">DabitOne</h1>
        <p class="tour11-hero__tagline">
          픽셀에서 프로토콜까지,<br />하나의 소프트웨어.
        </p>
        <p class="tour11-hero__sub">다빛솔루션 LED 전광판 운영 소프트웨어.</p>
        <div class="tour11-hero__cta">
          <MagneticLink href="#quickstart" className="tour11-btn tour11-btn--primary">
            투어 시작하기<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
          <MagneticLink
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
            className="tour11-btn tour11-btn--secondary"
          >
            DabitOne 다운로드<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   HorizontalFeatures — tour2 ConsolePin 패턴을 light theme으로 이식
   ========================================================================= */

type Panel = {
  num: string
  label: string
  title: string
  lines: readonly string[]
}

const PANELS: readonly Panel[] = [
  {
    num: "F01",
    label: "ALL-IN-ONE",
    title: "다섯 도구가\n하나의 앱 안에.",
    lines: [
      "다빛채, DBPS(다빛프로토콜시뮬레이터), dbNet, 시리얼 모니터, 이미지·GIF 편집.",
      "예전엔 각자 실행하던 프로그램들이 DabitOne 한 창 안에 모였습니다.",
    ],
  },
  {
    num: "F02",
    label: "ONE SCREEN PER TAB",
    title: "한 탭 안에\n작업의 처음과 끝.",
    lines: [
      "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
      "레거시에서 설정은 흩어져 있었습니다. 화면 크기, 표출 신호, 폰트 전송이 각자 다른 창에서.",
      "DabitOne은 한 화면 안에 모았습니다. 메뉴 탐색과 창 전환이 줄어든 만큼, 설정 시간도 짧아집니다.",
    ],
  },
  {
    num: "F03",
    label: "DBNET",
    title: "가장 빠른\nIP 검색과 설정.",
    lines: [
      "UDP 브로드캐스트 한 번으로 같은 서브넷의 컨트롤러가 MAC·IP 목록으로.",
      "장비를 클릭하면 연결 설정으로 자동 반영, 곧바로 연결 테스트.",
      "이전보다 안정적인 응답, 타이핑과 오타 확인이 줄어든 흐름.",
    ],
  },
  {
    num: "F04",
    label: "HEX · ASCII",
    title: "한 화면에서,\n두 프로토콜.",
    lines: [
      "메시지 종류·섹션·페이지를 라디오·콤보박스로 선택하는 HEX. 텍스트 영역에 직접 쓰는 ASCII.",
      "가운데의 \u201cASCII 변환\u201d 버튼이 HEX 설정값을 ASCII 문자열로 바꿔 줍니다.",
      "프로토콜 문서 없이도 패킷 구조 확인. 시스템 연동과 현장 디버깅에서 학습 시간이 짧아집니다.",
    ],
  },
] as const

function HorizontalFeatures() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    const progress = progressRef.current
    if (!pin || !track || !progress) return
    if (reducedMotion()) return
    const mq = window.matchMedia("(min-width: 768px)")
    if (!mq.matches) return

    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!pin || !track || !progress) return
        const rect = pin.getBoundingClientRect()
        const total = pin.offsetHeight - window.innerHeight
        const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)))
        // 4 panels → 3 transitions, 0 → -75%
        track.style.transform = `translate3d(${-p * 75}%, 0, 0)`
        progress.style.transform = `scaleX(${p})`
        const idx = Math.min(3, Math.max(0, Math.round(p * 3)))
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

  return (
    <section
      id="features"
      class="tour11-horizontal"
      ref={pinRef}
      aria-label={`Feature ${PANELS[activeIndex]?.num} · ${PANELS[activeIndex]?.label}`}
    >
      <div class="tour11-horizontal__sticky">
        <div class="tour11-horizontal__hud" aria-hidden="true">
          <span>
            <span class="tour11-horizontal__hud-label">MODULE </span>
            <span class="tour11-horizontal__hud-value">
              {String(activeIndex + 1).padStart(2, "0")} / 04
            </span>
          </span>
          <span>
            <span class="tour11-horizontal__hud-label">SCROLL / </span>
            <span class="tour11-horizontal__hud-value">HORIZONTAL</span>
          </span>
        </div>
        <div class="tour11-horizontal__track" ref={trackRef}>
          {PANELS.map((p, i) => (
            <PanelCard key={p.num} panel={p} idx={i} />
          ))}
        </div>
        <div class="tour11-horizontal__progress" aria-hidden="true">
          <div class="tour11-horizontal__progress-bar" ref={progressRef} />
        </div>
      </div>
    </section>
  )
}

/**
 * 패널 하나. Visual 영역에 커서 따라가는 cyan spotlight + 기능 도식 SVG.
 */
function PanelCard({ panel, idx }: { panel: Panel; idx: number }) {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = visualRef.current
    if (!el) return
    const coarse = window.matchMedia("(pointer: coarse)").matches
    if (coarse || reducedMotion()) return

    let raf = 0
    let nx = 50
    let ny = 50
    function onMove(e: MouseEvent) {
      if (!el) return
      const rect = el.getBoundingClientRect()
      nx = ((e.clientX - rect.left) / rect.width) * 100
      ny = ((e.clientY - rect.top) / rect.height) * 100
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        el!.style.setProperty("--mx", `${nx}%`)
        el!.style.setProperty("--my", `${ny}%`)
      })
    }
    function onLeave() {
      if (!el) return
      el.style.setProperty("--mx", "50%")
      el.style.setProperty("--my", "50%")
    }
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <article class="tour11-panel">
      <div class="tour11-panel__text">
        <p class="tour11-panel__num">{panel.num}</p>
        <p class="tour11-panel__label">{panel.label}</p>
        <h2 class="tour11-panel__title">{panel.title}</h2>
        {panel.lines.map((line, i) => (
          <p key={i} class="tour11-panel__body">
            {line}
          </p>
        ))}
      </div>
      <div class="tour11-panel__visual" ref={visualRef}>
        <div class="tour11-panel__spotlight" aria-hidden="true" />
        <div class="tour11-panel__grid-frame" aria-hidden="true" />
        <div class="tour11-panel__diagram" aria-hidden="true">
          <PanelDiagram idx={idx} />
        </div>
      </div>
    </article>
  )
}

/* =========================================================================
   PanelDiagram — 각 패널 기능을 설명하는 미니 SVG 도식.
   모노크롬 + 단일 cyan accent. viewBox 400×440 기준, CSS로 스케일.
   ========================================================================= */

function PanelDiagram({ idx }: { idx: number }) {
  if (idx === 0) return <DiagramAllInOne />
  if (idx === 1) return <DiagramTabs />
  if (idx === 2) return <DiagramDbNet />
  if (idx === 3) return <DiagramHexAscii />
  return null
}

/* F01 — 5 tools merging into one DabitOne window */
function DiagramAllInOne() {
  const tools = ["다빛채", "DBPS", "dbNet", "SERIAL", "IMAGE"]
  return (
    <svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="다섯 도구가 하나의 앱으로 통합">
      {/* 5 small windows at top */}
      {tools.map((t, i) => {
        const x = 8 + i * 77
        return (
          <g key={t} transform={`translate(${x},16)`}>
            <rect x="0" y="0" width="68" height="52" fill="#fff" stroke="#0A0A0A" strokeWidth="1" />
            <rect x="0" y="0" width="68" height="12" fill="#F4F4F4" stroke="#0A0A0A" strokeWidth="1" />
            <circle cx="6" cy="6" r="1.5" fill="#A3A3A3" />
            <circle cx="12" cy="6" r="1.5" fill="#A3A3A3" />
            <circle cx="18" cy="6" r="1.5" fill="#A3A3A3" />
            <text
              x="34"
              y="36"
              fontFamily="ui-monospace, 'SF Mono', monospace"
              fontSize="10"
              fontWeight="500"
              textAnchor="middle"
              fill="#0A0A0A"
            >
              {t}
            </text>
          </g>
        )
      })}
      {/* Converging dotted lines */}
      <g stroke="#0A0A0A" strokeWidth="1" fill="none" opacity="0.35" strokeDasharray="2 3">
        <path d="M 42 72 Q 80 110 200 152" />
        <path d="M 119 72 Q 150 110 200 152" />
        <path d="M 196 72 L 200 152" />
        <path d="M 273 72 Q 250 110 200 152" />
        <path d="M 350 72 Q 320 110 200 152" />
      </g>
      {/* Large DabitOne window */}
      <g transform="translate(40,160)">
        <rect x="0" y="0" width="320" height="264" fill="#fff" stroke="#0A0A0A" strokeWidth="1.5" />
        <rect x="0" y="0" width="320" height="32" fill="#0A0A0A" />
        <circle cx="14" cy="16" r="3.5" fill="#525252" />
        <circle cx="26" cy="16" r="3.5" fill="#525252" />
        <circle cx="38" cy="16" r="3.5" fill="#525252" />
        <text
          x="160"
          y="21"
          fontFamily="ui-monospace, 'SF Mono', monospace"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
          fill="#fff"
        >
          DabitOne
        </text>
        {/* 5 tabs */}
        <g fontFamily="ui-monospace, 'SF Mono', monospace" fontSize="10" fill="#0A0A0A">
          <line x1="0" y1="60" x2="320" y2="60" stroke="#0A0A0A" strokeWidth="1" />
          <text x="30" y="51" textAnchor="middle">
            통신
          </text>
          <text x="94" y="51" textAnchor="middle">
            설정
          </text>
          <text x="160" y="51" textAnchor="middle" fontWeight="700">
            전송
          </text>
          <text x="226" y="51" textAnchor="middle">
            편집
          </text>
          <text x="290" y="51" textAnchor="middle">
            고급
          </text>
          <line x1="142" y1="56" x2="178" y2="56" stroke="#0EA5E9" strokeWidth="2" />
        </g>
        {/* content mock */}
        <g fill="none">
          <rect x="24" y="84" width="272" height="18" stroke="#A3A3A3" strokeWidth="1" />
          <rect x="24" y="116" width="200" height="10" fill="#E5E5E5" stroke="none" />
          <rect x="24" y="134" width="236" height="10" fill="#E5E5E5" stroke="none" />
          <rect x="24" y="152" width="180" height="10" fill="#E5E5E5" stroke="none" />
          <rect x="24" y="196" width="88" height="32" fill="#0A0A0A" />
          <text
            x="68"
            y="216"
            fontFamily="ui-monospace, 'SF Mono', monospace"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            fill="#fff"
          >
            실행
          </text>
          <rect x="120" y="196" width="88" height="32" stroke="#0A0A0A" strokeWidth="1" />
        </g>
      </g>
    </svg>
  )
}

/* F02 — DabitOne window with 5 tabs, one active, showing content depth */
function DiagramTabs() {
  const tabs = [
    { name: "통신", active: false },
    { name: "설정", active: false },
    { name: "전송", active: true },
    { name: "편집", active: false },
    { name: "고급", active: false },
  ]
  return (
    <svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="한 탭 안에 작업의 처음과 끝">
      {/* window */}
      <rect x="20" y="20" width="360" height="400" fill="#fff" stroke="#0A0A0A" strokeWidth="1.5" />
      <rect x="20" y="20" width="360" height="32" fill="#0A0A0A" />
      <circle cx="34" cy="36" r="3.5" fill="#525252" />
      <circle cx="46" cy="36" r="3.5" fill="#525252" />
      <circle cx="58" cy="36" r="3.5" fill="#525252" />
      <text
        x="200"
        y="41"
        fontFamily="ui-monospace, 'SF Mono', monospace"
        fontSize="12"
        fontWeight="500"
        textAnchor="middle"
        fill="#fff"
      >
        DabitOne — 전송
      </text>
      {/* tabs bar */}
      <line x1="20" y1="88" x2="380" y2="88" stroke="#0A0A0A" strokeWidth="1" />
      {tabs.map((t, i) => {
        const x = 50 + i * 70
        return (
          <g key={t.name}>
            <text
              x={x}
              y="76"
              fontFamily="ui-monospace, 'SF Mono', monospace"
              fontSize="12"
              fontWeight={t.active ? 700 : 400}
              textAnchor="middle"
              fill="#0A0A0A"
            >
              {t.name}
            </text>
            {t.active && (
              <line x1={x - 16} y1="84" x2={x + 16} y2="84" stroke="#0EA5E9" strokeWidth="3" />
            )}
          </g>
        )
      })}
      {/* content — 전송 flow */}
      <g>
        <text x="44" y="126" fontFamily="ui-monospace, monospace" fontSize="10" fill="#525252" letterSpacing="0.1em">
          STEP 01 · 메시지 입력
        </text>
        <rect x="44" y="136" width="312" height="44" fill="#F4F4F4" stroke="#A3A3A3" strokeWidth="1" />
        <text x="56" y="161" fontFamily="ui-monospace, monospace" fontSize="11" fill="#0A0A0A">
          HELLO DABITONE_
        </text>
        <text x="44" y="210" fontFamily="ui-monospace, monospace" fontSize="10" fill="#525252" letterSpacing="0.1em">
          STEP 02 · 컨트롤러 선택
        </text>
        <rect x="44" y="220" width="312" height="44" fill="#fff" stroke="#A3A3A3" strokeWidth="1" />
        <circle cx="60" cy="242" r="4" fill="#0EA5E9" />
        <text x="76" y="246" fontFamily="ui-monospace, monospace" fontSize="11" fill="#0A0A0A">
          CTRL-01 · 192.168.1.21
        </text>
        <text x="44" y="294" fontFamily="ui-monospace, monospace" fontSize="10" fill="#525252" letterSpacing="0.1em">
          STEP 03 · 전송
        </text>
        <rect x="44" y="304" width="140" height="40" fill="#0A0A0A" />
        <text
          x="114"
          y="329"
          fontFamily="ui-monospace, monospace"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
          fill="#fff"
        >
          SEND →
        </text>
        {/* result */}
        <g opacity="0.7">
          <rect x="200" y="304" width="156" height="40" fill="none" stroke="#A3A3A3" strokeWidth="1" strokeDasharray="3 3" />
          <text
            x="278"
            y="329"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            textAnchor="middle"
            fill="#525252"
          >
            ● LIVE · 12ms
          </text>
        </g>
        <text x="44" y="380" fontFamily="ui-monospace, monospace" fontSize="10" fill="#A3A3A3">
          한 탭에서 입력 → 선택 → 전송 → 확인까지.
        </text>
      </g>
    </svg>
  )
}

/* F03 — UDP broadcast + controller list table */
function DiagramDbNet() {
  const rows = [
    { mac: "00:1A:2B:3C:01", ip: "192.168.1.21", on: true, hl: false },
    { mac: "00:1A:2B:3C:02", ip: "192.168.1.22", on: true, hl: true },
    { mac: "00:1A:2B:3C:03", ip: "192.168.1.23", on: true, hl: false },
    { mac: "00:1A:2B:3C:04", ip: "192.168.1.24", on: false, hl: false },
  ]
  return (
    <svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UDP 브로드캐스트 후 컨트롤러 목록">
      {/* Broadcast icon */}
      <g transform="translate(200,54)">
        <circle cx="0" cy="0" r="8" fill="#0A0A0A" />
        <g fill="none" stroke="#0A0A0A" strokeWidth="1.5">
          <path d="M -14 -6 A 16 16 0 0 1 14 -6" />
          <path d="M -24 -12 A 28 28 0 0 1 24 -12" />
          <path d="M -34 -18 A 40 40 0 0 1 34 -18" opacity="0.5" />
        </g>
        <text
          x="0"
          y="40"
          fontFamily="ui-monospace, 'SF Mono', monospace"
          fontSize="10"
          fontWeight="500"
          textAnchor="middle"
          fill="#525252"
          letterSpacing="0.18em"
        >
          UDP BROADCAST
        </text>
      </g>
      {/* Table */}
      <g transform="translate(32,140)">
        <rect x="0" y="0" width="336" height="268" fill="#fff" stroke="#0A0A0A" strokeWidth="1" />
        {/* Header */}
        <rect x="0" y="0" width="336" height="32" fill="#0A0A0A" />
        <g fontFamily="ui-monospace, 'SF Mono', monospace" fontSize="10" fontWeight="500" fill="#fff" letterSpacing="0.16em">
          <text x="16" y="20">MAC</text>
          <text x="140" y="20">IP</text>
          <text x="280" y="20">STATUS</text>
        </g>
        {/* Rows */}
        {rows.map((r, i) => {
          const y = 32 + i * 44
          return (
            <g key={r.mac}>
              {r.hl && <rect x="0" y={y} width="336" height="44" fill="rgba(14,165,233,0.12)" />}
              {i > 0 && <line x1="0" y1={y} x2="336" y2={y} stroke="#E5E5E5" strokeWidth="1" />}
              <text x="16" y={y + 27} fontFamily="ui-monospace, monospace" fontSize="11" fill="#0A0A0A">
                {r.mac}
              </text>
              <text x="140" y={y + 27} fontFamily="ui-monospace, monospace" fontSize="11" fill="#0A0A0A">
                {r.ip}
              </text>
              <circle cx="286" cy={y + 22} r="4" fill={r.on ? "#10B981" : "#A3A3A3"} />
              <text
                x="298"
                y={y + 26}
                fontFamily="ui-monospace, monospace"
                fontSize="10"
                fill={r.on ? "#0A0A0A" : "#A3A3A3"}
                letterSpacing="0.1em"
              >
                {r.on ? "LIVE" : "OFF"}
              </text>
              {r.hl && (
                <text
                  x="320"
                  y={y + 27}
                  fontFamily="ui-monospace, monospace"
                  fontSize="12"
                  fill="#0EA5E9"
                  fontWeight="700"
                  textAnchor="end"
                >
                  ↵
                </text>
              )}
            </g>
          )
        })}
      </g>
      <text
        x="200"
        y="428"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        textAnchor="middle"
        fill="#A3A3A3"
        letterSpacing="0.08em"
      >
        클릭 → 연결 설정 자동 반영
      </text>
    </svg>
  )
}

/* F04 — HEX / ASCII side-by-side with conversion button */
function DiagramHexAscii() {
  const hex = ["02 1A 0B 01", "44 41 42 49", "54 4F 4E 45", "0D 0A 03"]
  const ascii = ["␂ · · ·", "D A B I", "T O N E", "␍ ␊ ␃"]
  return (
    <svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HEX와 ASCII 두 프로토콜 전환">
      {/* HEX column */}
      <g transform="translate(20,40)">
        <text
          x="0"
          y="0"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fontWeight="500"
          fill="#525252"
          letterSpacing="0.22em"
        >
          HEX
        </text>
        <rect x="0" y="12" width="144" height="344" fill="#fff" stroke="#0A0A0A" strokeWidth="1" />
        <rect x="0" y="12" width="144" height="32" fill="#F4F4F4" />
        <text
          x="8"
          y="32"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#525252"
          letterSpacing="0.1em"
        >
          0x · RADIO · COMBO
        </text>
        {hex.map((h, i) => (
          <g key={i}>
            <text
              x="12"
              y={72 + i * 36}
              fontFamily="ui-monospace, monospace"
              fontSize="13"
              fontWeight="500"
              fill="#0A0A0A"
              letterSpacing="0.08em"
            >
              {h}
            </text>
          </g>
        ))}
        {/* subtle highlight */}
        <rect x="4" y="88" width="136" height="28" fill="rgba(14,165,233,0.10)" />
      </g>
      {/* Center convert button */}
      <g transform="translate(176,196)">
        <rect x="0" y="0" width="48" height="48" fill="#0A0A0A" />
        <text
          x="24"
          y="30"
          fontFamily="ui-monospace, monospace"
          fontSize="18"
          fontWeight="500"
          textAnchor="middle"
          fill="#fff"
        >
          ↔
        </text>
        <text
          x="24"
          y="68"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fontWeight="500"
          textAnchor="middle"
          fill="#525252"
          letterSpacing="0.18em"
        >
          CONVERT
        </text>
      </g>
      {/* ASCII column */}
      <g transform="translate(236,40)">
        <text
          x="0"
          y="0"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fontWeight="500"
          fill="#525252"
          letterSpacing="0.22em"
        >
          ASCII
        </text>
        <rect x="0" y="12" width="144" height="344" fill="#fff" stroke="#0A0A0A" strokeWidth="1" />
        <rect x="0" y="12" width="144" height="32" fill="#F4F4F4" />
        <text
          x="8"
          y="32"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#525252"
          letterSpacing="0.1em"
        >
          TEXTAREA · DIRECT
        </text>
        {ascii.map((a, i) => (
          <g key={i}>
            <text
              x="12"
              y={72 + i * 36}
              fontFamily="ui-monospace, monospace"
              fontSize="14"
              fontWeight="500"
              fill="#0A0A0A"
              letterSpacing="0.14em"
            >
              {a}
            </text>
          </g>
        ))}
      </g>
      <text
        x="200"
        y="404"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        textAnchor="middle"
        fill="#A3A3A3"
        letterSpacing="0.08em"
      >
        한 화면에서 두 프로토콜 · 가운데 버튼으로 즉시 변환
      </text>
    </svg>
  )
}

/* =========================================================================
   QuickstartTabs — tour1 TabIndex 구조, hover 반응 강화
   ========================================================================= */

type Tab = {
  num: string
  name: string
  desc: string
  slug: string
}

const TABS: readonly Tab[] = [
  {
    num: "01",
    name: "통신",
    desc: "Serial · TCP · UDP · BLE · MQTT · dbNet",
    slug: "01-first-connection",
  },
  { num: "02", name: "설정", desc: "화면 · 시계 · 밝기", slug: "02-screen-size" },
  { num: "03", name: "전송", desc: "메시지 · 스케줄", slug: "03-send-message" },
  { num: "04", name: "편집", desc: "텍스트 · 이미지 · GIF", slug: "04-edit-image" },
  { num: "05", name: "고급", desc: "펌웨어 · 로그 · 진단", slug: "08-firmware" },
] as const

function QuickstartTabs() {
  return (
    <section id="quickstart" class="tour11-quickstart" aria-label="Quickstart">
      <div class="tour11-quickstart__inner">
        <p class="tour11-quickstart__eyebrow">QUICKSTART</p>
        <h2 class="tour11-quickstart__title">어디서부터 시작할까요?</h2>
        <ul class="tour11-quickstart__list">
          {TABS.map((t) => (
            <li key={t.num}>
              <a class="tour11-tab" href={`/tour/quickstart/${t.slug}/`}>
                <span class="tour11-tab__num">{t.num}</span>
                <span class="tour11-tab__name">{t.name}</span>
                <span class="tour11-tab__desc">{t.desc}</span>
                <span class="tour11-tab__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* =========================================================================
   MagneticFooter — 다크 패널 + Magnetic CTA
   ========================================================================= */

function MagneticFooter() {
  return (
    <section class="tour11-footer" aria-label="시작">
      <div class="tour11-footer__inner">
        <p class="tour11-footer__eyebrow">START USING</p>
        <h2 class="tour11-footer__title">
          지금, 현장에서.<br />
          DabitOne을 시작하세요.
        </h2>
        <p class="tour11-footer__sub">
          설치 파일은 다빛솔루션 공식 사이트에서 제공됩니다.
        </p>
        <div class="tour11-footer__cta">
          <MagneticLink
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
            className="tour11-btn tour11-btn--primary tour11-btn--on-dark"
          >
            지금 시작하기<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
          <MagneticLink
            href="#quickstart"
            className="tour11-btn tour11-btn--secondary tour11-btn--on-dark"
          >
            Quickstart 보기<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
        </div>
        <p class="tour11-footer__colophon">© 다빛솔루션 · 2026</p>
      </div>
    </section>
  )
}

/* =========================================================================
   MagneticLink — 반경 140px, 최대 14px 이동 + subtle scale(1.04)
   ========================================================================= */

type MagneticLinkProps = {
  href: string
  target?: string
  rel?: string
  className?: string
  children: preact.ComponentChildren
}

function MagneticLink({ href, target, rel, className, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const coarse = window.matchMedia("(pointer: coarse)").matches
    if (coarse || reducedMotion()) return

    const RADIUS = 140
    const MAX = 14
    const DAMPING = 0.18
    let targetX = 0
    let targetY = 0
    let targetScale = 1
    let currentX = 0
    let currentY = 0
    let currentScale = 1
    let raf = 0
    let running = false

    function apply() {
      el!.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px) scale(${currentScale.toFixed(3)})`
    }

    function tick() {
      const dx = targetX - currentX
      const dy = targetY - currentY
      const ds = targetScale - currentScale
      currentX += dx * DAMPING
      currentY += dy * DAMPING
      currentScale += ds * DAMPING
      apply()
      if (
        Math.abs(dx) < 0.05 &&
        Math.abs(dy) < 0.05 &&
        Math.abs(ds) < 0.001 &&
        targetX === 0 &&
        targetY === 0 &&
        targetScale === 1
      ) {
        el!.style.transform = ""
        running = false
        return
      }
      raf = requestAnimationFrame(tick)
    }

    function ensureRunning() {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > RADIUS) {
        targetX = 0
        targetY = 0
        targetScale = 1
      } else {
        const pull = 1 - dist / RADIUS
        targetX = (dx / RADIUS) * MAX * pull * 2
        targetY = (dy / RADIUS) * MAX * pull * 2
        targetX = Math.max(-MAX, Math.min(MAX, targetX))
        targetY = Math.max(-MAX, Math.min(MAX, targetY))
        // scale — at full pull scale 1.04
        targetScale = 1 + 0.04 * pull
      }
      ensureRunning()
    }

    function onLeave() {
      targetX = 0
      targetY = 0
      targetScale = 1
      ensureRunning()
    }

    window.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
      el.style.transform = ""
    }
  }, [])

  return (
    <a ref={ref} href={href} target={target} rel={rel} class={className}>
      {children}
    </a>
  )
}
