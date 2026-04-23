/**
 * 랜딩 페이지 — 안 Kinetic Type Poster (Vol. 09, 2026-04-24).
 * /tour9/ 경로 전용. 타이포그래피가 콘텐츠가 되는 포스터 시리즈.
 *
 * 디자인 테시스: Swiss modernism × scroll-driven variable font motion.
 * Inspiration: Active Theory, Lusion, Pentagram, Fontfabric "Typographic Maximalism 2026".
 *
 * 특징:
 *  - 6개 포스터 = 6개 풀 뷰포트 타이포그래피 컴포지션. 제품 UI/카드/스크린샷 없음.
 *  - 순수 흑·백 + red(#FF2D2D) 단일 accent. 포스터마다 반전 (light ↔ dark).
 *  - CSS animation-timeline: view() — hero와 "08" numeral의 wght가 스크롤에 연동.
 *  - Letter-stagger enter — span-per-char + transition-delay: calc(var(--i) * 30ms).
 *  - 2개의 marquee ticker strip — CSS infinite animation.
 *  - prefers-reduced-motion 완전 존중 — marquee 정지, stagger 즉시, wght 고정.
 */
import { Fragment } from "preact"
import { useEffect, useRef } from "preact/hooks"

export function LandingKinetic() {
  useEffect(() => {
    document.body.classList.add("tour9-page")
    return () => {
      document.body.classList.remove("tour9-page")
    }
  }, [])

  return (
    <div class="tour9-shell">
      <PosterHero />
      <MarqueeStrip variant="a" />
      <PosterOneSoftware />
      <PosterTerms />
      <MarqueeStrip variant="b" />
      <PosterScenes />
      <PosterOffline />
      <MarqueeStrip variant="a" reverse />
      <PosterBegin />
    </div>
  )
}

/* =========================================================================
   IntersectionObserver — reveal poster on enter
   ========================================================================= */
function useReveal(ref: { current: HTMLElement | null }) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add("is-revealed")
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

/* =========================================================================
   Split text into per-character spans with --i index (for stagger)
   ========================================================================= */
function Stagger({ text, offset = 0 }: { text: string; offset?: number }) {
  // 공백도 별도 span으로 — white-space: pre 로 유지
  const chars = [...text]
  return (
    <span class="tour9-stagger" aria-label={text}>
      {chars.map((c, i) => (
        <span
          class="tour9-stagger__char"
          style={{ "--i": i + offset } as Record<string, number>}
          aria-hidden="true"
          key={i}
        >
          {c}
        </span>
      ))}
    </span>
  )
}

/* =========================================================================
   POSTER 01 — DABITONE hero (black-on-white, scroll-driven wght)
   ========================================================================= */
function PosterHero() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section
      ref={ref}
      class="tour9-poster tour9-poster--light tour9-poster--hero"
      aria-label="DabitOne"
    >
      <p class="tour9-poster__eyebrow">VOL. 09 — KINETIC TYPE EDITION</p>
      <h1 class="tour9-hero__wordmark" aria-label="DABITONE">
        <Stagger text="DABITONE" />
      </h1>
      <p class="tour9-poster__caption">
        한 실행 파일. 다섯 도구. 픽셀에서 프로토콜까지.
      </p>
      <div class="tour9-hero__cta-row">
        <a
          class="tour9-hero__cta-primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
        <a class="tour9-hero__cta-secondary" href="/tour/quickstart/01-first-connection/">
          Quickstart
        </a>
      </div>
    </section>
  )
}

/* =========================================================================
   POSTER 02 — ONE / SOFTWARE (dark, oversized red slash)
   ========================================================================= */
function PosterOneSoftware() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section
      ref={ref}
      class="tour9-poster tour9-poster--dark tour9-poster--onesoft"
      aria-label="One Software"
    >
      <p class="tour9-poster__eyebrow">POSTER · 02</p>
      <h2 class="tour9-onesoft__phrase" aria-label="One / Software">
        <span class="tour9-onesoft__line">
          <Stagger text="ONE" />
          <span class="tour9-onesoft__slash" aria-hidden="true">
            /
          </span>
        </span>
        <span class="tour9-onesoft__line tour9-onesoft__line--indent">
          <Stagger text="SOFTWARE" offset={4} />
        </span>
      </h2>
      <p class="tour9-poster__caption tour9-poster__caption--red">
        PIXEL → PROTOCOL
      </p>
    </section>
  )
}

/* =========================================================================
   POSTER 03 — LED × RGB × HEX (light, rotated rows)
   ========================================================================= */
function PosterTerms() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section
      ref={ref}
      class="tour9-poster tour9-poster--light tour9-poster--terms"
      aria-label="LED RGB HEX"
    >
      <p class="tour9-poster__eyebrow">POSTER · 03 — LANGUAGE OF SIGNS</p>
      <div class="tour9-terms__stack">
        <span class="tour9-terms__row" aria-label="LED">
          <Stagger text="LED" />
        </span>
        <span class="tour9-terms__row tour9-terms__row--accent" aria-label="RGB">
          <Stagger text="RGB" offset={4} />
        </span>
        <span class="tour9-terms__row" aria-label="HEX">
          <Stagger text="HEX" offset={8} />
        </span>
      </div>
      <p class="tour9-terms__sub">전광판과 대화하는 언어 — 세 단어로 시작.</p>
    </section>
  )
}

/* =========================================================================
   POSTER 04 — 08 scenarios (dark, massive numeral + tracked list)
   ========================================================================= */
const SCENARIOS: readonly { num: string; name: string }[] = [
  { num: "01", name: "컨트롤러 최초 연결" },
  { num: "02", name: "화면 크기 설정" },
  { num: "03", name: "첫 메시지 전송" },
  { num: "04", name: "이미지 편집·전송" },
  { num: "05", name: "GIF 편집" },
  { num: "06", name: "스케줄 편집 (PLA)" },
  { num: "07", name: "배경 스케줄 (BGP)" },
  { num: "08", name: "펌웨어 업데이트" },
] as const

function PosterScenes() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section
      ref={ref}
      class="tour9-poster tour9-poster--dark tour9-poster--scenes"
      aria-label="8 Scenarios"
    >
      <div class="tour9-scenes__numeral-wrap">
        <span class="tour9-scenes__numeral" aria-label="08">
          08
        </span>
      </div>
      <ul class="tour9-scenes__list" role="list">
        {SCENARIOS.map((s) => (
          <li class="tour9-scenes__item" key={s.num}>
            <span class="tour9-scenes__item-num">{s.num}</span>
            <span class="tour9-scenes__item-name">{s.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* =========================================================================
   POSTER 05 — NO CLOUD / NO LOGIN / ONE EXE (light, brutalist)
   ========================================================================= */
function PosterOffline() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section
      ref={ref}
      class="tour9-poster tour9-poster--light tour9-poster--offline"
      aria-label="Offline First"
    >
      <p class="tour9-poster__eyebrow">POSTER · 05 — OFFLINE FIRST</p>
      <h2 class="tour9-offline__lines" aria-label="No cloud, no login, one exe.">
        <span class="tour9-offline__line">NO CLOUD</span>
        <span class="tour9-offline__line tour9-offline__line--indent-a">NO LOGIN</span>
        <span class="tour9-offline__line tour9-offline__line--indent-b">ONE EXE</span>
      </h2>
      <p class="tour9-poster__caption">
        설치 후 바로 실행. 계정도, 서버도, 외부 도구도 필요 없음.
      </p>
    </section>
  )
}

/* =========================================================================
   POSTER 06 — BEGIN (dark, red accent, final CTA)
   ========================================================================= */
function PosterBegin() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section
      ref={ref}
      class="tour9-poster tour9-poster--dark tour9-poster--begin"
      aria-label="Begin"
    >
      <p class="tour9-poster__eyebrow">POSTER · 06 — FINALE</p>
      <h2 class="tour9-begin__word" aria-label="Begin.">
        <Stagger text="BEGIN" />
        <span class="tour9-begin__word-accent" aria-hidden="true">
          .
        </span>
      </h2>
      <div class="tour9-begin__cta-row">
        <a
          class="tour9-begin__cta-primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
        <a class="tour9-begin__cta-text" href="/tour/">
          /tour/ — 전체 투어 보기 →
        </a>
      </div>
      <div class="tour9-begin__footer">
        <p>© 2026 DABITSOL · 다빛솔루션</p>
        <p>SET IN PRETENDARD VARIABLE</p>
      </div>
    </section>
  )
}

/* =========================================================================
   Marquee ticker strip — infinite scroll, repeated content for seamless loop
   ========================================================================= */
const MARQUEE_A: readonly string[] = [
  "LED",
  "RGB",
  "HEX",
  "UDP",
  "SERIAL",
  "TCP",
  "ASCII",
  "BMP",
  "GIF",
  "PLA",
  "BGP",
  "DBNET",
  "PIXEL",
  "PROTOCOL",
] as const

const MARQUEE_B: readonly string[] = [
  "전광판",
  "컨트롤러",
  "스케줄",
  "펌웨어",
  "메시지",
  "이미지",
  "텍스트",
  "연결",
] as const

function MarqueeStrip({ variant, reverse }: { variant: "a" | "b"; reverse?: boolean }) {
  const items = variant === "a" ? MARQUEE_A : MARQUEE_B
  // 두 번 반복 — translate-50%로 seamless loop
  const loop = [...items, ...items]
  return (
    <div
      class={`tour9-marquee tour9-marquee--strip-${variant}${
        reverse ? " tour9-marquee--reverse" : ""
      }`}
      aria-hidden="true"
    >
      <div class="tour9-marquee__track">
        {loop.map((word, i) => (
          <Fragment key={i}>
            <span class="tour9-marquee__item">{word}</span>
            <span class="tour9-marquee__item tour9-marquee__item--sep">·</span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
