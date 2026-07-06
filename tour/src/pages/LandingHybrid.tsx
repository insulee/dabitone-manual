/**
 * 랜딩 페이지 — 안 Hybrid (Vol. 11, 2026-04-24 재작성).
 * /tour11/ 경로 전용. 구성 = tour1 기본 구조 + 가운데 "달라진 네 가지" 섹션만
 * tour2 방식(가로 sticky pin)으로 교체.
 *
 * 구성 (위→아래):
 *  1. Hero — tour1 컴팩트 히어로. 2개의 Magnetic CTA (반경 140px · 최대 14px) + 플랫폼 표기.
 *  2. QuadGrid — F01~F06 6개 카드(2열×3행) 정적 그라디언트. IntersectionObserver 스크롤 리빌.
 *  3. QuickstartTabs — tour1 TabIndex와 동일한 5 tabs. Hover 반응 4가지 동시.
 *  4. MagneticFooter — 다크 패널. Hero와 동일한 Magnetic CTA.
 */
import { useEffect, useRef } from "preact/hooks"
import { reducedMotion } from "../lib/motion"
import { PixelMatrix } from "../components/PixelMatrix"

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
      <QuadGrid />
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
      <PixelMatrix dotSize={2.2} minAlpha={0.18} maxAlpha={0.34} />
      <div class="tour11-hero__inner">
        <h1 class="tour11-hero__title">DabitOne</h1>
        <p class="tour11-hero__tagline">
          픽셀에서 프로토콜까지,
          <br />
          하나의 소프트웨어.
        </p>
        <div class="tour11-hero__cta">
          <MagneticLink
            href="https://dabitsol.com/download/"
            target="_blank"
            rel="noreferrer"
            className="tour11-btn tour11-btn--primary"
          >
            지금 시작하기
            <span class="tour11-btn__arrow" aria-hidden="true">
              →
            </span>
          </MagneticLink>
          <MagneticLink href="/quickstart/01-connect/" className="tour11-btn tour11-btn--secondary">
            투어 시작하기
            <span class="tour11-btn__arrow" aria-hidden="true">
              →
            </span>
          </MagneticLink>
        </div>
        <p class="tour11-hero__platform">{"Windows\u00A010/11 지원"}</p>
      </div>
    </section>
  )
}

/* =========================================================================
   QuadGrid — 정적 2x3 풀-블리드 그라디언트 6분할 (HorizontalFeatures 대체)
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
      "예전엔 각자 실행하던 프로그램들이 DabitOne 앱 안에 모였습니다.",
    ],
  },
  {
    num: "F02",
    label: "ONE SCREEN PER TAB",
    title: "한 탭 안에\n작업의 처음과 끝.",
    lines: [
      "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
      "모든 설정이 각자 다른 창에 흩어져 있었습니다.",
      "DabitOne은 한 화면 안에 모았습니다. 메뉴 탐색과 창 전환이 줄어든 만큼, 설정 시간도 짧아집니다.",
    ],
  },
  {
    num: "F03",
    label: "DBNET",
    title: "가장 빠른\nIP 검색과 설정.",
    lines: [
      "Search 한 번으로 모든 컨트롤러를 빠르고 정확하게 검색합니다.",
      "결과는 목록으로 정리되고 바로 골라 연결 테스트가 가능합니다.",
    ],
  },
  {
    num: "F04",
    label: "HEX · ASCII",
    title: "한 화면에서,\n두 프로토콜.",
    lines: [
      "HEX와 ASCII 프로토콜을 한 화면에서 다룹니다.",
      "옵션을 선택하면 HEX 코드, \u201cASCII 변환\u201d 버튼으로 ASCII 코드까지 볼 수 있습니다.",
      "프로토콜 문서 없이도 패킷 구조와 예시를 간단한 조작으로 확인합니다.",
    ],
  },
  {
    num: "F05",
    label: "LIVE PREVIEW",
    title: "보내기 전 미리보기,\n보낸 후 전광판 화면.",
    lines: [
      "전송 탭 미리보기로 오타·색·잘림을 보내기 전에 확인합니다.",
      "전송 후에는 전광판 화면 창이 실제 표출을 그대로 비춥니다.",
    ],
  },
  {
    num: "F06",
    label: "DISPLAY SIGNAL",
    title: "어떤 모듈이든,\n표출신호를 맞춥니다.",
    lines: [
      "내장 표출신호 목록에서 모듈에 맞는 신호를 골라 바로 적용합니다.",
      "목록에 없는 모듈은 스캔 방식·디코더 IC·색 순서를 문자열 패턴으로 직접 정의해 등록합니다.",
    ],
  },
] as const

const QUAD_COLORS = ["blue", "purple", "teal", "peach", "green", "rose"] as const

function QuadGrid() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".tour11-quad__card"))
    if (cards.length === 0) return

    if (reducedMotion()) {
      cards.forEach((c) => c.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = cards.indexOf(entry.target as HTMLElement)
          const stagger = idx >= 0 ? idx * 80 : 0
          window.setTimeout(() => {
            ;(entry.target as HTMLElement).classList.add("is-visible")
          }, stagger)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )

    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" class="tour11-quad" ref={ref} aria-label="DabitOne 핵심 기능 6가지">
      {PANELS.map((p, i) => (
        <QuadCard key={p.num} panel={p} colorIdx={i} />
      ))}
    </section>
  )
}

function QuadCard({ panel, colorIdx }: { panel: Panel; colorIdx: number }) {
  const color = QUAD_COLORS[colorIdx % QUAD_COLORS.length]
  return (
    <article class={`tour11-quad__card tour11-quad__card--${color}`}>
      <div class="tour11-quad__text">
        <p class="tour11-quad__label">{panel.label}</p>
        <h2 class="tour11-quad__title">{panel.title}</h2>
        <div class="tour11-quad__body-group">
          {panel.lines.map((line, i) => (
            <p key={i} class="tour11-quad__body">
              {line}
            </p>
          ))}
        </div>
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
  matchSlugs: readonly string[]
}

const TABS: readonly Tab[] = [
  {
    num: "01",
    name: "통신",
    desc: "Serial · TCP · UDP · BLE · MQTT · dbNet",
    slug: "01-connect",
    matchSlugs: ["01-connect"],
  },
  {
    num: "02",
    name: "설정",
    desc: "화면 구성 · 표출신호 · 폰트",
    slug: "02-display-setup",
    matchSlugs: ["02-display-setup"],
  },
  {
    num: "03",
    name: "전송",
    desc: "HEX · ASCII 프로토콜",
    slug: "03-send-message",
    matchSlugs: ["03-send-message"],
  },
  {
    num: "04",
    name: "편집",
    desc: "PLA · BGP · 텍스트 · 이미지 · GIF",
    slug: "04-edit-image",
    matchSlugs: ["04-edit-image"],
  },
  {
    num: "05",
    name: "고급",
    desc: "보드 · 펌웨어 · 기타",
    slug: "05-advanced",
    matchSlugs: ["05-advanced"],
  },
] as const

export function QuickstartTabs({
  activeSlug,
  hideHeading,
  compact,
}: {
  activeSlug?: string
  hideHeading?: boolean
  compact?: boolean
}) {
  return (
    <section
      id="quickstart"
      class={`tour11-quickstart${compact ? " tour11-quickstart--compact" : ""}`}
      aria-label="Quickstart"
    >
      <div class="tour11-quickstart__inner">
        {!hideHeading && (
          <>
            <p class="tour11-quickstart__eyebrow">Tour</p>
            <h2 class="tour11-quickstart__title">여기에서 둘러보세요.</h2>
          </>
        )}
        <ul class="tour11-quickstart__list">
          {TABS.map((t) => {
            const isActive = activeSlug ? t.matchSlugs.includes(activeSlug) : false
            return (
              <li key={t.num}>
                <a
                  class={`tour11-tab${isActive ? " is-active" : ""}`}
                  href={`/quickstart/${t.slug}/`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {!compact && <span class="tour11-tab__num">{t.num}</span>}
                  <span class="tour11-tab__name">{t.name}</span>
                  {!compact && <span class="tour11-tab__desc">{t.desc}</span>}
                  <span class="tour11-tab__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            )
          })}
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
        <h2 class="tour11-footer__title">지금, DabitOne을 시작하세요.</h2>
        <p class="tour11-footer__sub">
          {"설치 파일은 다빛솔루션 공식 사이트에서 제공됩니다. Windows\u00A010/11을 지원합니다."}
        </p>
        <div class="tour11-footer__cta">
          <MagneticLink
            href="https://dabitsol.com/download/"
            target="_blank"
            rel="noreferrer"
            className="tour11-btn tour11-btn--primary tour11-btn--on-dark"
          >
            지금 시작하기
            <span class="tour11-btn__arrow" aria-hidden="true">
              →
            </span>
          </MagneticLink>
          <MagneticLink
            href="https://dabitone.dabitsol.com/quickstart/01-connect/"
            className="tour11-btn tour11-btn--secondary tour11-btn--on-dark"
          >
            투어 시작하기
            <span class="tour11-btn__arrow" aria-hidden="true">
              →
            </span>
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
