/**
 * 랜딩 페이지 — 안 Hybrid (Bento + Embedded Horizontal Scroll, Vol. 11, 2026-04-24).
 * /tour11/ 경로 전용. tour1 Bento 구조의 중간에 tour5 방식의 가로 스크롤 섹션을 끼우고,
 * tour9·tour10 대비 훨씬 차분한 micro-hover(Linear/Vercel/Apple 제품 페이지 수준)만 적용.
 *
 * 구성 (위→아래):
 *  1. Hero — tour1-style 컴팩트 히어로 + 2 CTA (magnetic 효과 적용).
 *  2. Bento Row 1 — 2×2 primary feature grid (subtle translateY + border accent).
 *  3. Horizontal Film-strip — 섹션 내부 가로 스크롤. 휠·키보드·progress bar.
 *  4. Bento Row 2 — 2×2 secondary feature grid.
 *  5. Magnetic CTA Footer — 다크 패널 + 포인터 근접 반응 buttons.
 *
 * 제약:
 *  - 휠 캡처는 strip 섹션 위에 포인터가 있을 때만. strip 끝에 닿으면 세로 스크롤로 해제.
 *  - 키보드 ←→는 strip 내부 포커스 시 작동.
 *  - reduced-motion / coarse pointer 시 magnetic + scale hover 비활성화.
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
      <BentoRow rowNum={1} features={PRIMARY_FEATURES} eyebrow="FEATURES" title="DabitOne이 달라진 네 가지" />
      <FilmStrip />
      <BentoRow rowNum={2} features={SECONDARY_FEATURES} eyebrow="DEEP DIVE" title="현장을 바꾸는 네 가지 기술" />
      <MagneticFooter />
    </div>
  )
}

/* =========================================================================
   Hero — 컴팩트 히어로 + magnetic CTA
   ========================================================================= */

function Hero() {
  return (
    <section class="tour11-hero" aria-label="Hero">
      <div class="tour11-hero__inner">
        <p class="tour11-hero__eyebrow">DABITONE</p>
        <h1 class="tour11-hero__title">
          하나의 컨트롤러를 움직이는<br />
          하나의 소프트웨어
        </h1>
        <p class="tour11-hero__sub">
          다빛솔루션 LED 전광판 운영 데스크톱 앱. 픽셀에서 프로토콜까지.
        </p>
        <div class="tour11-hero__cta">
          <MagneticLink
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
            className="tour11-btn tour11-btn--primary"
          >
            DabitOne 다운로드<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
          <MagneticLink href="#quickstart" className="tour11-btn tour11-btn--secondary">
            투어 시작<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   Bento Rows — 2×2 primary / secondary feature grids
   ========================================================================= */

type Feature = {
  num: string
  label: string
  title: string
  body: string
}

const PRIMARY_FEATURES: readonly Feature[] = [
  {
    num: "F01",
    label: "ALL-IN-ONE",
    title: "다섯 도구가 하나의 앱 안에",
    body: "다빛채·DBPS·dbNet·시리얼 모니터·이미지 편집. 각자 실행하던 프로그램이 한 창 안에.",
  },
  {
    num: "F02",
    label: "ONE SCREEN PER TAB",
    title: "각 탭이 작업의 시작부터 끝까지",
    body: "통신·설정·전송·편집·고급 — 다섯 탭. 메뉴 탐색과 창 전환이 줄어듭니다.",
  },
  {
    num: "F03",
    label: "DBNET",
    title: "IP 검색과 설정, 가장 빠른 길",
    body: "UDP 브로드캐스트 한 번으로 MAC·IP 목록. 클릭 한 번에 연결 설정 자동 반영.",
  },
  {
    num: "F04",
    label: "HEX · ASCII",
    title: "한 화면에서, 두 프로토콜",
    body: "HEX·ASCII 설정을 한 화면에서 전환. 프로토콜 문서 없이도 패킷 구조 확인.",
  },
] as const

const SECONDARY_FEATURES: readonly Feature[] = [
  {
    num: "F05",
    label: "AUTO DISCOVERY",
    title: "dbNet 자동 검색",
    body: "같은 서브넷의 컨트롤러를 자동으로 찾고, 연결 설정을 클릭 한 번에 반영.",
  },
  {
    num: "F06",
    label: "PROTOCOL CONVERT",
    title: "HEX·ASCII 실시간 변환",
    body: "가운데 변환 버튼 하나로 두 프로토콜 간 즉시 전환. 현장 디버깅 시간 단축.",
  },
  {
    num: "F07",
    label: "FIRMWARE",
    title: "펌웨어 업데이트",
    body: "컨트롤러 펌웨어를 DabitOne 안에서 바로 갱신. 별도 툴 없이 업데이트 완료.",
  },
  {
    num: "F08",
    label: "DIRECT PROTOCOL",
    title: "프로토콜 직접 송수신",
    body: "시리얼 모니터로 임의의 패킷을 직접 보내고 응답을 확인. 포맷 검증·테스트에 유용.",
  },
] as const

function BentoRow({
  rowNum,
  features,
  eyebrow,
  title,
}: {
  rowNum: number
  features: readonly Feature[]
  eyebrow: string
  title: string
}) {
  return (
    <section class={`tour11-bento tour11-bento--row${rowNum}`} aria-label={title}>
      <div class="tour11-bento__inner">
        <div class="tour11-bento__header">
          <p class="tour11-bento__eyebrow">{eyebrow}</p>
          <h2 class="tour11-bento__title">{title}</h2>
        </div>
        <ul class="tour11-bento__grid">
          {features.map((f) => (
            <li key={f.num} class="tour11-card">
              <div class="tour11-card__head">
                <span class="tour11-card__num">{f.num}</span>
                <span class="tour11-card__label">{f.label}</span>
              </div>
              <h3 class="tour11-card__title">{f.title}</h3>
              <p class="tour11-card__body">{f.body}</p>
              <span class="tour11-card__arrow" aria-hidden="true">
                →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* =========================================================================
   FilmStrip — 섹션 내부 가로 스크롤 (wheel → horizontal)
   ========================================================================= */

type Chapter = {
  num: string
  title: string
  subtitle: string
  descriptor: string
  slug: string
}

const CHAPTERS: readonly Chapter[] = [
  {
    num: "01",
    title: "최초 연결",
    subtitle: "Serial · TCP · UDP",
    descriptor: "컨트롤러와 PC를 처음 연결하는 세 가지 방법.",
    slug: "01-first-connection",
  },
  {
    num: "02",
    title: "화면 크기",
    subtitle: "모듈 수 · 색상 깊이",
    descriptor: "가로·세로 모듈 수와 색상 깊이를 설정합니다.",
    slug: "02-screen-size",
  },
  {
    num: "03",
    title: "메시지 전송",
    subtitle: "텍스트 입력부터 표출까지",
    descriptor: "첫 텍스트 메시지를 전광판에 표시하는 과정.",
    slug: "03-send-message",
  },
  {
    num: "04",
    title: "이미지 편집",
    subtitle: "BMP · PNG · JPG → DAT",
    descriptor: "이미지를 DAT 포맷으로 변환해 전송합니다.",
    slug: "04-edit-image",
  },
  {
    num: "05",
    title: "GIF",
    subtitle: "내장 GIF 편집기",
    descriptor: "여러 프레임을 연결해 동영상 메시지 제작.",
    slug: "05-gif-editor",
  },
  {
    num: "06",
    title: "스케줄",
    subtitle: "PLA · 순차 재생",
    descriptor: "여러 메시지를 시간 단위로 순차 재생합니다.",
    slug: "06-schedule-pla",
  },
] as const

function FilmStrip() {
  const stripRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  // 휠 이벤트 → 가로 스크롤 변환
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    function onWheel(e: WheelEvent) {
      // strip 위에서 세로 휠이 지배적일 때만 가로로 변환
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const delta = e.deltaY
      const atStart = strip!.scrollLeft <= 0
      const maxScroll = strip!.scrollWidth - strip!.clientWidth
      const atEnd = strip!.scrollLeft >= maxScroll - 1
      // 스크롤이 양끝에 닿고 그 방향으로 더 밀면 세로로 해제
      if ((atStart && delta < 0) || (atEnd && delta > 0)) return
      e.preventDefault()
      strip!.scrollLeft += delta
    }

    strip.addEventListener("wheel", onWheel, { passive: false })
    return () => strip.removeEventListener("wheel", onWheel)
  }, [])

  // 키보드 ← → — strip 내 포커스 시에만
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    function onKey(e: KeyboardEvent) {
      const active = document.activeElement
      if (!active || !strip!.contains(active)) return
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
      e.preventDefault()
      const step = strip!.clientWidth * 0.6
      strip!.scrollBy({
        left: e.key === "ArrowRight" ? step : -step,
        behavior: reducedMotion() ? "auto" : "smooth",
      })
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // 진행률 계산 (rAF throttled)
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = strip!.scrollWidth - strip!.clientWidth
        if (max <= 0) {
          setProgress(0)
          return
        }
        setProgress(Math.min(1, Math.max(0, strip!.scrollLeft / max)))
      })
    }
    // 초기 상태
    onScroll()
    strip.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      strip.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="quickstart" class="tour11-strip" aria-label="Quickstart 투어">
      <div class="tour11-strip__inner">
        <div class="tour11-strip__header">
          <div>
            <p class="tour11-strip__eyebrow">QUICKSTART</p>
            <h2 class="tour11-strip__title">Quickstart 투어</h2>
          </div>
          <p class="tour11-strip__hint" aria-hidden="true">
            → 가로로 스크롤 · 휠 또는 ←→
          </p>
        </div>
        <div
          ref={stripRef}
          class="tour11-strip__track"
          role="region"
          aria-label="Quickstart 투어 가로 스크롤"
          tabIndex={0}
        >
          {CHAPTERS.map((c, i) => (
            <a
              key={c.num}
              class="tour11-tile"
              href={`/tour/quickstart/${c.slug}/`}
              style={{ "--tile-idx": i } as Record<string, number>}
            >
              <div class="tour11-tile__canvas" aria-hidden="true">
                <TileIllustration idx={i} />
              </div>
              <div class="tour11-tile__meta">
                <span class="tour11-tile__num">{c.num}</span>
                <span class="tour11-tile__subtitle">{c.subtitle}</span>
              </div>
              <h3 class="tour11-tile__title">{c.title}</h3>
              <p class="tour11-tile__descriptor">{c.descriptor}</p>
              <span class="tour11-tile__arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
        <div class="tour11-strip__progress" aria-hidden="true">
          <div
            class="tour11-strip__progress-bar"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </section>
  )
}

/**
 * Tile 일러스트레이션 — 간단한 SVG. 챕터별로 모티프 달라짐.
 */
function TileIllustration({ idx }: { idx: number }) {
  const patterns = [
    // 01 — 점선 연결
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      <circle cx="10" cy="30" r="3" fill="currentColor" />
      <line x1="13" y1="30" x2="87" y2="30" stroke="currentColor" strokeDasharray="4 3" strokeWidth="1" />
      <rect x="85" y="22" width="14" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>,
    // 02 — 그리드
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      {Array.from({ length: 8 }).map((_, x) =>
        Array.from({ length: 5 }).map((_, y) => (
          <rect
            key={`${x}-${y}`}
            x={6 + x * 11}
            y={6 + y * 10}
            width="8"
            height="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        )),
      )}
    </svg>,
    // 03 — 텍스트 블록
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      <rect x="8" y="12" width="60" height="6" fill="currentColor" opacity="0.9" />
      <rect x="8" y="22" width="80" height="4" fill="currentColor" opacity="0.55" />
      <rect x="8" y="30" width="70" height="4" fill="currentColor" opacity="0.55" />
      <rect x="8" y="40" width="40" height="4" fill="currentColor" opacity="0.35" />
    </svg>,
    // 04 — 이미지 프레임
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      <rect x="10" y="10" width="80" height="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.7" />
      <polyline points="16,46 34,30 52,42 78,18 88,28 88,46 16,46" fill="currentColor" opacity="0.35" />
    </svg>,
    // 05 — GIF frames
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      <rect x="8" y="18" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="38" y="18" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="68" y="18" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
      <polygon points="16,26 16,34 22,30" fill="currentColor" opacity="0.7" />
      <polygon points="46,26 46,34 52,30" fill="currentColor" opacity="0.85" />
      <polygon points="76,26 76,34 82,30" fill="currentColor" />
    </svg>,
    // 06 — 타임라인
    <svg viewBox="0 0 100 60" preserveAspectRatio="none">
      <line x1="8" y1="30" x2="92" y2="30" stroke="currentColor" strokeWidth="1" />
      <rect x="12" y="22" width="22" height="16" fill="currentColor" opacity="0.7" />
      <rect x="38" y="22" width="16" height="16" fill="currentColor" opacity="0.45" />
      <rect x="58" y="22" width="28" height="16" fill="currentColor" opacity="0.85" />
    </svg>,
  ]
  return patterns[idx] ?? patterns[0]
}

/* =========================================================================
   MagneticFooter — 다크 패널 + 포인터 근접 자성 CTA
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
          <MagneticLink href="/tour/" className="tour11-btn tour11-btn--secondary tour11-btn--on-dark">
            전체 투어 보기<span class="tour11-btn__arrow" aria-hidden="true">→</span>
          </MagneticLink>
        </div>
        <p class="tour11-footer__colophon">© 다빛솔루션 · 2026</p>
      </div>
    </section>
  )
}

/* =========================================================================
   MagneticLink — 포인터 근접 120px 내에서 최대 8px 끌림, rAF 기반 spring
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
    // coarse pointer / reduced motion → 자성 효과 비활성화
    const coarse = window.matchMedia("(pointer: coarse)").matches
    if (coarse || reducedMotion()) return

    const RADIUS = 120
    const MAX = 8
    const DAMPING = 0.18
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let raf = 0
    let running = false

    function tick() {
      const dx = targetX - currentX
      const dy = targetY - currentY
      currentX += dx * DAMPING
      currentY += dy * DAMPING
      el!.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && targetX === 0 && targetY === 0) {
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
      } else {
        const pull = 1 - dist / RADIUS
        targetX = (dx / RADIUS) * MAX * pull * 2
        targetY = (dy / RADIUS) * MAX * pull * 2
        // clamp
        targetX = Math.max(-MAX, Math.min(MAX, targetX))
        targetY = Math.max(-MAX, Math.min(MAX, targetY))
      }
      ensureRunning()
    }

    function onLeave() {
      targetX = 0
      targetY = 0
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
