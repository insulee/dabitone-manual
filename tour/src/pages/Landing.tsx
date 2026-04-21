/**
 * 랜딩 페이지 — Hero + What's New + 5 탭 핫스팟 + PDF 카드.
 * 플랜 v3.1 Phase R2.
 *
 * MVP 단계: Hero + 간단한 placeholder. R2에서 핫스팟·Before/After 단계적 붙임.
 */
import { useEffect, useRef, useState } from "preact/hooks"
import { animate } from "../lib/motion"
import { revealOnEnter } from "../lib/observe"
import { Popover } from "../components/Popover"
import { Hotspot } from "../components/Hotspot"
import { landing } from "../../data/landing"
import type { LandingHotspot } from "../types"

export function Landing() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const [openHotspot, setOpenHotspot] = useState<LandingHotspot | null>(null)

  useEffect(() => {
    if (heroTitleRef.current) {
      animate(
        heroTitleRef.current,
        { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
        { duration: 1.0 },
      )
    }
    if (heroSubRef.current) {
      animate(
        heroSubRef.current,
        { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
        { duration: 0.8, delay: 0.3 },
      )
    }
  }, [])

  return (
    <>
      <Hero
        titleRef={heroTitleRef}
        subRef={heroSubRef}
        title={landing.hero.title}
        subtitle={landing.hero.subtitle}
        heroImage={landing.hero.heroImage}
      />

      <HotspotsSection
        hotspots={landing.hotspots}
        heroImage={landing.hero.heroImage}
        onActivate={setOpenHotspot}
      />

      <PdfFooter />

      {openHotspot && (
        <Popover
          open={true}
          onClose={() => setOpenHotspot(null)}
          title={openHotspot.hotspot.label}
          cta={{
            label: "투어 시작",
            href: `/tour/quickstart/${openHotspot.tourSlug}/`,
          }}
        >
          {openHotspot.summary}
        </Popover>
      )}
    </>
  )
}

function Hero({
  titleRef,
  subRef,
  title,
  subtitle,
  heroImage,
}: {
  titleRef: preact.RefObject<HTMLHeadingElement>
  subRef: preact.RefObject<HTMLParagraphElement>
  title: string
  subtitle: string
  heroImage: { src: string; alt: string; width: number; height: number }
}) {
  return (
    <section class="tour-hero" aria-label="Hero">
      <img
        class="tour-hero__bg"
        src={heroImage.src}
        alt=""
        width={heroImage.width}
        height={heroImage.height}
        loading="eager"
        decoding="async"
      />
      <div class="tour-hero__shade" />
      <div class="tour-hero__inner">
        <h1 class="tour-hero__title" ref={titleRef}>
          {title.split("\n").map((l, i) => (
            <span key={i} class="tour-hero__line">
              {l}
            </span>
          ))}
        </h1>
        <p class="tour-hero__subtitle" ref={subRef}>
          {subtitle}
        </p>
      </div>
      <div class="tour-hero__scroll-hint" aria-hidden="true">
        ↓
      </div>
    </section>
  )
}

function HotspotsSection({
  hotspots,
  heroImage,
  onActivate,
}: {
  hotspots: LandingHotspot[]
  heroImage: { src: string; alt: string; width: number; height: number }
  onActivate: (h: LandingHotspot) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])

  return (
    <section class="tour-section" aria-label="기능별 투어 선택">
      <div class="tour-section__inner">
        <h2 class="tour-section__title">어디서부터 시작할까요?</h2>
        <p class="tour-section__caption">
          아래 파란 점을 눌러 관심 있는 기능의 체험 투어로 바로 이동할 수
          있습니다.
        </p>
        <div ref={ref} class="tour-stage" style={{ opacity: 0 }}>
          <img
            class="tour-stage__image"
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            loading="lazy"
          />
          {hotspots.map((h) => (
            <Hotspot
              key={h.id}
              data={h.hotspot}
              onActivate={() => onActivate(h)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PdfFooter() {
  return (
    <footer class="tour-footer" aria-label="PDF 다운로드">
      <h2
        style={{
          fontFamily: "var(--tour-font-display)",
          fontSize: "var(--tour-fs-section)",
          fontWeight: 600,
          color: "var(--tour-c-text)",
          margin: "0 0 16px",
        }}
      >
        오프라인 참조용 PDF
      </h2>
      <p style={{ marginBottom: "40px" }}>
        원하시는 분은 아래 PDF를 다운로드해 참조하실 수 있습니다 (Optional).
      </p>
      <div class="tour-footer__pdfs">
        <a class="tour-footer__pdf-card" href="/pdf/DabitONe_Manual_Reference.pdf">
          <div class="tour-footer__pdf-title">📄 UI 레퍼런스편</div>
          <div class="tour-footer__pdf-hint">
            화면별 컨트롤 설명, 파일 포맷, 메뉴 구조
          </div>
        </a>
        <a class="tour-footer__pdf-card" href="/pdf/DabitONe_Manual_Operation.pdf">
          <div class="tour-footer__pdf-title">📄 운영·문제해결편</div>
          <div class="tour-footer__pdf-hint">
            트러블슈팅, FAQ, 릴리즈 노트
          </div>
        </a>
      </div>
      <p style={{ fontSize: "14px", color: "var(--tour-c-text-soft)" }}>
        © 다빛솔루션 DabitONe — 버전 1.1.0
      </p>
    </footer>
  )
}
