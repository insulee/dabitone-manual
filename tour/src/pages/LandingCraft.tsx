/**
 * 랜딩 페이지 — 안 Craft Atlas (Catalog-book style, 2026-04-24).
 * /tour8/ 경로 전용. Dieter Rams 인더스트리얼 디자인 아틀라스 북 메타포.
 *
 * 디자인 테시스: 2026 "craft rebellion" — corporate generic이 아닌 designer-notebook 질감.
 * Inspiration: rauno.me, Paco Coursey, tldraw.com, Cal.com design craft.
 *
 * 특징:
 *  - 커스텀 spring-follow 커서 (dot + ring, damping 0.12). pointer:coarse 시 네이티브.
 *  - SVG noise grain overlay (feTurbulence baseFrequency 0.9, opacity ~7%).
 *  - Hand-drawn SVG 주석 화살표 — dashed, 곡선, 약간의 wobble.
 *  - View Transitions API — atlas entry 링크 클릭 시 cross-fade.
 *  - Color: warm off-white #F5F1EB + ink #0A0A0A + single red #D40000 (annotation만).
 *  - Typography: Source Serif Variable (display), Pretendard (본문), mono (label).
 *  - Micro-delay stagger — IntersectionObserver + CSS transitions.
 */
import { useEffect, useRef } from "preact/hooks"

export function LandingCraft() {
  useEffect(() => {
    document.body.classList.add("tour8-page")
    return () => {
      document.body.classList.remove("tour8-page")
    }
  }, [])

  return (
    <div class="tour8-shell">
      <GrainOverlay />
      <SpringCursor />
      <HomepageEntry />
      <EntryWhole />
      <EntryLibrary />
      <EntryTextures />
      <EntryExcursion />
      <ColophonEntry />
    </div>
  )
}

/* =========================================================================
   Grain overlay — fixed full-viewport SVG noise, pointer-events none
   ========================================================================= */
function GrainOverlay() {
  return (
    <div class="tour8-grain" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="tour8-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tour8-noise)" />
      </svg>
    </div>
  )
}

/* =========================================================================
   Spring cursor — dot + ring, requestAnimationFrame damping
   ========================================================================= */
function SpringCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // pointer:coarse (touch) 또는 reduced-motion — 커스텀 커서 disable
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (coarse || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let dx = mx
    let dy = my
    let rx = mx
    let ry = my
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onHoverIn = (e: Event) => {
      const t = e.target as Element | null
      if (
        t &&
        t instanceof Element &&
        t.closest("a, button, [role='button'], .tour8-entry-link")
      ) {
        ring.classList.add("is-hover")
      }
    }
    const onHoverOut = (e: Event) => {
      const t = e.target as Element | null
      if (
        t &&
        t instanceof Element &&
        t.closest("a, button, [role='button'], .tour8-entry-link")
      ) {
        ring.classList.remove("is-hover")
      }
    }

    const tick = () => {
      // Dot — 빠른 추종 (damping 낮음)
      dx += (mx - dx) * 0.55
      dy += (my - dy) * 0.55
      // Ring — spring, damping 0.12
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      dot.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    document.body.classList.add("tour8-has-cursor")
    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseover", onHoverIn, { passive: true })
    document.addEventListener("mouseout", onHoverOut, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove("tour8-has-cursor")
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onHoverIn)
      document.removeEventListener("mouseout", onHoverOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} class="tour8-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} class="tour8-cursor-ring" aria-hidden="true" />
    </>
  )
}

/* =========================================================================
   IntersectionObserver — stagger reveal with 150-400ms micro-delays
   ========================================================================= */
function useReveal(ref: { current: HTMLElement | null }, delay = 0) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => {
              ;(e.target as HTMLElement).classList.add("is-revealed")
            }, delay)
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, delay])
}

/* =========================================================================
   View Transitions helper — cross-fade on entry anchor click
   ========================================================================= */
function useViewTransitionScroll() {
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const target = ev.target
      if (!(target instanceof Element)) return
      const a = target.closest("a.tour8-entry-link") as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute("href")
      if (!href || !href.startsWith("#")) return
      const id = href.slice(1)
      const dest = document.getElementById(id)
      if (!dest) return
      ev.preventDefault()
      // View Transitions API는 브라우저에 따라 미지원일 수 있어 런타임 feature-detect.
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => unknown
      }
      if (typeof doc.startViewTransition === "function") {
        doc.startViewTransition(() => {
          dest.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      } else {
        dest.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])
}

/* =========================================================================
   ENTRY — Homepage (atlas cover)
   ========================================================================= */
function HomepageEntry() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 0)
  useViewTransitionScroll()
  return (
    <section
      ref={ref}
      class="tour8-entry tour8-entry--home"
      id="homepage"
      aria-label="홈페이지"
    >
      <div class="tour8-entry__meta">
        <span>HOMEPAGE</span>
        <span>ATLAS · VOL. 01</span>
      </div>
      <h1 class="tour8-home__title">
        DABITONE <em>Atlas</em>
      </h1>
      <p class="tour8-home__sub">A catalog of one software.</p>
      <p class="tour8-home__body">
        픽셀에서 프로토콜까지 — LED 전광판 운영에 필요한 다섯 도구를
        한 창에 모은 소프트웨어. 이 아틀라스는 그 구조와 질감을 기록합니다.
      </p>
      <div class="tour8-home__cta-wrap">
        <a
          class="tour-btn tour-btn--primary tour8-home__cta"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
        <a class="tour-btn tour-btn--secondary" href="#entry01">
          Quickstart
        </a>
        {/* Hand-drawn annotation pointing at primary CTA */}
        <svg
          class="tour8-home__arrow"
          viewBox="0 0 220 120"
          aria-hidden="true"
          fill="none"
        >
          <defs>
            <filter id="tour8-rough-home" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="1.8" />
            </filter>
          </defs>
          <path
            d="M200 10 C 170 22, 140 32, 110 46 S 56 80, 22 102"
            stroke="#D40000"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-dasharray="3 5"
            filter="url(#tour8-rough-home)"
          />
          <path
            d="M18 100 L 30 108 M 18 100 L 26 90"
            stroke="#D40000"
            stroke-width="1.6"
            stroke-linecap="round"
            filter="url(#tour8-rough-home)"
          />
          <text
            x="150"
            y="8"
            class="tour8-handwritten"
            fill="#D40000"
            font-size="13"
          >
            start here
          </text>
        </svg>
      </div>
      <p class="tour8-home__foot">set in Source Serif Variable &amp; Pretendard Variable</p>
    </section>
  )
}

/* =========================================================================
   ENTRY 01 — THE WHOLE
   ========================================================================= */
function EntryWhole() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 150)
  return (
    <section
      ref={ref}
      class="tour8-entry tour8-entry--whole"
      id="entry01"
      aria-label="전체"
    >
      <div class="tour8-entry__meta">
        <span>ENTRY 01</span>
        <span>THE WHOLE</span>
      </div>
      <div class="tour8-whole__grid">
        <div class="tour8-whole__left">
          <h2 class="tour8-entry__title">
            픽셀에서 <em>프로토콜</em>까지, <br />
            하나의 소프트웨어.
          </h2>
          <p class="tour8-entry__body">
            DabitOne은 플러그인을 설치하지 않습니다. 외부 도구와 연동하지 않습니다.
            한 실행 파일에 다섯 개의 도구 — 다빛채 전광판 제어, DBPS 프로토콜 시뮬레이터,
            dbNet 네트워크 검색, 시리얼 모니터, 이미지·GIF 편집 — 가 들어 있습니다.
          </p>
          <p class="tour8-entry__body">
            한 창에서 계획하고, 한 창에서 전송합니다.
          </p>
        </div>
        <div class="tour8-whole__right">
          <div class="tour8-whole__diagram" aria-hidden="true">
            <svg class="tour8-whole__svg" viewBox="0 0 360 360" fill="none">
              <defs>
                <filter id="tour8-rough-whole" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.02"
                    numOctaves="2"
                    seed="3"
                  />
                  <feDisplacementMap in="SourceGraphic" scale="1.5" />
                </filter>
              </defs>
              {/* Hand-drawn circle around wordmark */}
              <ellipse
                cx="180"
                cy="180"
                rx="120"
                ry="86"
                stroke="#0A0A0A"
                stroke-width="1.4"
                stroke-dasharray="4 6"
                filter="url(#tour8-rough-whole)"
              />
              {/* Annotation arrows radiating out */}
              <g filter="url(#tour8-rough-whole)">
                <path
                  d="M 60 80 C 90 100, 100 120, 80 150"
                  stroke="#0A0A0A"
                  stroke-width="1.2"
                  stroke-dasharray="2 4"
                  stroke-linecap="round"
                />
                <path
                  d="M 80 150 L 86 142 M 80 150 L 88 156"
                  stroke="#0A0A0A"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <text
                  x="10"
                  y="70"
                  class="tour8-handwritten"
                  fill="#0A0A0A"
                  font-size="13"
                >
                  no plugins
                </text>
              </g>
              <g filter="url(#tour8-rough-whole)">
                <path
                  d="M 320 110 C 300 140, 290 150, 290 190"
                  stroke="#0A0A0A"
                  stroke-width="1.2"
                  stroke-dasharray="2 4"
                  stroke-linecap="round"
                />
                <path
                  d="M 290 190 L 296 180 M 290 190 L 284 182"
                  stroke="#0A0A0A"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <text
                  x="250"
                  y="100"
                  class="tour8-handwritten"
                  fill="#0A0A0A"
                  font-size="13"
                >
                  no extra tools
                </text>
              </g>
              <g filter="url(#tour8-rough-whole)">
                <path
                  d="M 70 310 C 100 280, 130 270, 160 260"
                  stroke="#0A0A0A"
                  stroke-width="1.2"
                  stroke-dasharray="2 4"
                  stroke-linecap="round"
                />
                <path
                  d="M 160 260 L 150 258 M 160 260 L 152 266"
                  stroke="#0A0A0A"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <text
                  x="40"
                  y="330"
                  class="tour8-handwritten"
                  fill="#0A0A0A"
                  font-size="13"
                >
                  one .exe
                </text>
              </g>
            </svg>
            <span class="tour8-whole__wordmark">DabitOne</span>
          </div>
          <p class="tour8-whole__caption">fig. 01 — one software, one executable</p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   ENTRY 02 — LIBRARY (five capabilities)
   ========================================================================= */
type LibraryRow = {
  num: string
  name: string
  caption: string
  accent?: boolean
}
const LIBRARY: readonly LibraryRow[] = [
  {
    num: "i",
    name: "LED 전광판 통합 제어",
    caption: "Serial · TCP/IP · UDP 세 방식을 한 인터페이스에서.",
    accent: true,
  },
  {
    num: "ii",
    name: "이미지 · GIF 편집",
    caption: "BMP·PNG·JPG를 DAT로, 내장 GIF 편집기로 애니메이션까지.",
  },
  {
    num: "iii",
    name: "스케줄 관리 (PLA · BGP)",
    caption: "여러 메시지·배경화면을 순차 재생하는 타임라인.",
  },
  {
    num: "iv",
    name: "프로토콜 직접 전송",
    caption: "HEX · ASCII 두 프로토콜을 한 창에서 라디오·콤보박스로.",
  },
  {
    num: "v",
    name: "dbNet 자동 검색",
    caption: "UDP 브로드캐스트 한 번으로 서브넷의 컨트롤러를 목록화.",
  },
] as const

function EntryLibrary() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 150)
  return (
    <section
      ref={ref}
      class="tour8-entry tour8-entry--library"
      id="entry02"
      aria-label="라이브러리"
    >
      <div class="tour8-entry__meta">
        <span>ENTRY 02</span>
        <span>LIBRARY</span>
      </div>
      <h2 class="tour8-entry__title">
        다섯 개의 <em>능력</em>.
      </h2>
      <ul class="tour8-library__list" role="list">
        {LIBRARY.map((row, idx) => (
          <li class="tour8-library__row" key={row.num}>
            <span class="tour8-library__num">{row.num}.</span>
            <div class="tour8-library__text">
              <p class="tour8-library__name">{row.name}</p>
              <p class="tour8-library__caption">{row.caption}</p>
            </div>
            <svg
              class={`tour8-library__arrow${row.accent ? " is-accent" : ""}`}
              viewBox="0 0 160 48"
              aria-hidden="true"
              fill="none"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <defs>
                <filter
                  id={`tour8-rough-lib-${idx}`}
                  x="-5%"
                  y="-5%"
                  width="110%"
                  height="110%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.04"
                    numOctaves="2"
                    seed={idx + 1}
                  />
                  <feDisplacementMap in="SourceGraphic" scale="1.2" />
                </filter>
              </defs>
              <path
                d="M 6 30 C 40 18, 80 12, 140 16"
                stroke={row.accent ? "#D40000" : "#0A0A0A"}
                stroke-width="1.3"
                stroke-dasharray="3 5"
                stroke-linecap="round"
                filter={`url(#tour8-rough-lib-${idx})`}
              />
              <path
                d="M 140 16 L 134 10 M 140 16 L 132 22"
                stroke={row.accent ? "#D40000" : "#0A0A0A"}
                stroke-width="1.3"
                stroke-linecap="round"
                filter={`url(#tour8-rough-lib-${idx})`}
              />
            </svg>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* =========================================================================
   ENTRY 03 — TEXTURES (4 preview tiles)
   ========================================================================= */
type TextureTile = {
  fig: string
  title: string
  svg: preact.ComponentChildren
}
const TEXTURES: readonly TextureTile[] = [
  {
    fig: "fig. 01",
    title: "Tab panel",
    svg: (
      <svg viewBox="0 0 160 120" fill="none" aria-hidden="true">
        <rect x="6" y="12" width="148" height="100" stroke="#0A0A0A" stroke-width="1" />
        <line x1="6" y1="30" x2="154" y2="30" stroke="#0A0A0A" stroke-width="1" />
        <rect x="6" y="12" width="38" height="18" fill="#0A0A0A" />
        <rect x="44" y="12" width="38" height="18" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
        <rect x="82" y="12" width="38" height="18" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
        <rect x="14" y="40" width="60" height="8" fill="#0A0A0A" opacity="0.14" />
        <rect x="14" y="54" width="120" height="4" fill="#0A0A0A" opacity="0.1" />
        <rect x="14" y="62" width="100" height="4" fill="#0A0A0A" opacity="0.1" />
        <rect x="14" y="80" width="44" height="20" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
        <rect x="64" y="80" width="44" height="20" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
      </svg>
    ),
  },
  {
    fig: "fig. 02",
    title: "dbNet scan",
    svg: (
      <svg viewBox="0 0 160 120" fill="none" aria-hidden="true">
        <circle cx="80" cy="60" r="6" fill="#0A0A0A" />
        <circle
          cx="80"
          cy="60"
          r="18"
          stroke="#0A0A0A"
          stroke-width="0.8"
          stroke-dasharray="2 3"
        />
        <circle
          cx="80"
          cy="60"
          r="34"
          stroke="#0A0A0A"
          stroke-width="0.8"
          stroke-dasharray="2 3"
          opacity="0.6"
        />
        <circle
          cx="80"
          cy="60"
          r="50"
          stroke="#0A0A0A"
          stroke-width="0.8"
          stroke-dasharray="2 3"
          opacity="0.3"
        />
        <circle cx="36" cy="40" r="3" fill="#0A0A0A" />
        <circle cx="128" cy="36" r="3" fill="#0A0A0A" />
        <circle cx="124" cy="88" r="3" fill="#0A0A0A" />
        <circle cx="40" cy="92" r="3" fill="#0A0A0A" />
      </svg>
    ),
  },
  {
    fig: "fig. 03",
    title: "GIF editor",
    svg: (
      <svg viewBox="0 0 160 120" fill="none" aria-hidden="true">
        <rect x="12" y="14" width="136" height="68" stroke="#0A0A0A" stroke-width="1" />
        <g opacity="0.85">
          <rect x="20" y="22" width="36" height="52" fill="#0A0A0A" opacity="0.14" />
          <rect x="62" y="22" width="36" height="52" fill="#0A0A0A" opacity="0.28" />
          <rect x="104" y="22" width="36" height="52" fill="#0A0A0A" opacity="0.5" />
        </g>
        <line x1="12" y1="92" x2="148" y2="92" stroke="#0A0A0A" stroke-width="0.8" />
        <rect x="14" y="96" width="20" height="14" fill="#0A0A0A" />
        <rect x="38" y="96" width="20" height="14" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
        <rect x="62" y="96" width="20" height="14" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
        <rect x="86" y="96" width="20" height="14" stroke="#0A0A0A" stroke-width="0.6" fill="none" />
      </svg>
    ),
  },
  {
    fig: "fig. 04",
    title: "HEX / ASCII",
    svg: (
      <svg viewBox="0 0 160 120" fill="none" aria-hidden="true">
        <rect x="10" y="12" width="68" height="96" stroke="#0A0A0A" stroke-width="1" />
        <rect x="82" y="12" width="68" height="96" stroke="#0A0A0A" stroke-width="1" />
        <text x="18" y="30" fill="#0A0A0A" font-family="monospace" font-size="9">HEX</text>
        <text x="90" y="30" fill="#0A0A0A" font-family="monospace" font-size="9">ASCII</text>
        <rect x="18" y="40" width="52" height="6" fill="#0A0A0A" opacity="0.14" />
        <rect x="18" y="52" width="52" height="6" fill="#0A0A0A" opacity="0.14" />
        <rect x="18" y="64" width="52" height="6" fill="#0A0A0A" opacity="0.14" />
        <rect x="90" y="40" width="52" height="6" fill="#0A0A0A" opacity="0.2" />
        <rect x="90" y="52" width="52" height="6" fill="#0A0A0A" opacity="0.2" />
        <rect x="90" y="64" width="52" height="6" fill="#0A0A0A" opacity="0.2" />
        <rect x="90" y="76" width="34" height="6" fill="#0A0A0A" opacity="0.2" />
        <path
          d="M 70 60 L 90 60"
          stroke="#0A0A0A"
          stroke-width="1"
          stroke-linecap="round"
          stroke-dasharray="2 2"
        />
      </svg>
    ),
  },
] as const

function EntryTextures() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 200)
  return (
    <section
      ref={ref}
      class="tour8-entry tour8-entry--textures"
      id="entry03"
      aria-label="텍스처"
    >
      <div class="tour8-entry__meta">
        <span>ENTRY 03</span>
        <span>TEXTURES</span>
      </div>
      <h2 class="tour8-entry__title">
        <em>질감</em>의 카탈로그.
      </h2>
      <p class="tour8-entry__body tour8-textures__intro">
        각 탭은 같은 창 안에서 고유한 리듬을 가집니다.
        아래는 그 네 순간의 축소판.
      </p>
      <div class="tour8-textures__grid">
        {TEXTURES.map((t) => (
          <figure class="tour8-textures__tile" key={t.fig}>
            <div class="tour8-textures__frame">{t.svg}</div>
            <figcaption class="tour8-textures__caption">
              <span class="tour8-textures__fig">{t.fig}</span>
              <span class="tour8-textures__title">— {t.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* =========================================================================
   ENTRY 04 — EXCURSION (indexed list, TOC of quickstart)
   ========================================================================= */
type Excursion = { num: string; title: string; href: string }
const EXCURSIONS: readonly Excursion[] = [
  { num: "01", title: "컨트롤러 최초 연결", href: "/tour/quickstart/01-first-connection/" },
  { num: "02", title: "화면 크기 설정", href: "/tour/quickstart/02-screen-size/" },
  { num: "03", title: "첫 메시지 전송", href: "/tour/quickstart/03-send-message/" },
  { num: "04", title: "이미지 편집 · 전송", href: "/tour/quickstart/04-edit-image/" },
  { num: "05", title: "GIF 편집", href: "/tour/quickstart/05-gif-editor/" },
  { num: "06", title: "스케줄 편집 (PLA)", href: "/tour/quickstart/06-schedule-pla/" },
  { num: "07", title: "배경 스케줄 (BGP)", href: "/tour/quickstart/07-background-bgp/" },
  { num: "08", title: "펌웨어 업데이트", href: "/tour/quickstart/08-firmware/" },
] as const

function EntryExcursion() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 150)
  return (
    <section
      ref={ref}
      class="tour8-entry tour8-entry--excursion"
      id="entry04"
      aria-label="여행 목록"
    >
      <div class="tour8-entry__meta">
        <span>ENTRY 04</span>
        <span>EXCURSION</span>
      </div>
      <h2 class="tour8-entry__title">
        여덟 개의 <em>장면</em>.
      </h2>
      <p class="tour8-entry__body tour8-excursion__intro">
        각 장면은 DabitOne을 처음 쓰는 사람이 겪는 한 단계입니다.
        차례대로 따라가 볼 수 있습니다.
      </p>
      <ol class="tour8-excursion__list" role="list">
        {EXCURSIONS.map((e) => (
          <li class="tour8-excursion__row" key={e.num}>
            <a href={e.href} class="tour8-excursion__link">
              <span class="tour8-excursion__num">{e.num}</span>
              <span class="tour8-excursion__title">{e.title}</span>
              <span class="tour8-excursion__dots" aria-hidden="true" />
              <span class="tour8-excursion__page" aria-hidden="true">p.{e.num}</span>
            </a>
          </li>
        ))}
      </ol>
      <p class="tour8-excursion__flourish" aria-hidden="true">
        —&nbsp;&nbsp;✶&nbsp;&nbsp;—
      </p>
    </section>
  )
}

/* =========================================================================
   COLOPHON
   ========================================================================= */
function ColophonEntry() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 200)
  return (
    <section
      ref={ref}
      class="tour8-entry tour8-entry--colophon"
      id="colophon"
      aria-label="콜로폰"
    >
      <div class="tour8-entry__meta tour8-entry__meta--dark">
        <span>COLOPHON</span>
        <span>END OF ATLAS</span>
      </div>
      <h2 class="tour8-colophon__title">
        지금 <em>설치</em>하세요.
      </h2>
      <p class="tour8-colophon__body">
        이 아틀라스는 DabitOne의 축약판입니다. 실제 동작은 Windows 데스크톱에서.
      </p>
      <div class="tour8-colophon__cta">
        <a
          class="tour-btn tour-btn--primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
        <a class="tour-btn tour-btn--secondary" href="/tour/quickstart/01-first-connection/">
          Quickstart 투어
        </a>
      </div>
      <div class="tour8-colophon__foot">
        <p>set in Source Serif Variable &amp; Pretendard Variable</p>
        <p>© 2026 다빛솔루션</p>
      </div>
    </section>
  )
}
