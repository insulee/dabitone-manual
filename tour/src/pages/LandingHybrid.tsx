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
        <div class="tour11-horizontal__track" ref={trackRef}>
          {PANELS.map((p) => (
            <PanelCard key={p.num} panel={p} />
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
 * 패널 하나. 텍스트 전용 포스터 — label / title / 본문 lines.
 */
function PanelCard({ panel }: { panel: Panel }) {
  return (
    <article class="tour11-panel">
      <div class="tour11-panel__text">
        <p class="tour11-panel__label">{panel.label}</p>
        <h2 class="tour11-panel__title">{panel.title}</h2>
        {panel.lines.map((line, i) => (
          <p key={i} class="tour11-panel__body">
            {line}
          </p>
        ))}
      </div>
    </article>
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
