/**
 * 랜딩 페이지 — stone light theme (2026-04-22 재조정).
 * 구조: Hero / Manifesto / 5 × FeatureShot(통신·설정·전송·편집·고급) / TabIndex / Footer.
 */
import { useEffect, useRef } from "preact/hooks"
import { revealOnEnter } from "../lib/observe"

export function Landing() {
  return (
    <>
      <Hero />
      <Manifesto />
      <FeatureShot
        label="COMMUNICATION"
        title="Serial에서 dbNet까지, 한 창에서."
        image={{
          src: "/assets/screens/manual-poc/main-comm.png",
          alt: "DabitOne 통신 설정 화면",
        }}
      />
      <FeatureShot
        label="SETTINGS"
        title="화면, 시계, 밝기. 한 번에."
        image={{
          src: "/assets/screens/manual-poc/main-setup.png",
          alt: "DabitOne 설정 화면",
        }}
      />
      <FeatureShot
        label="TRANSFER"
        title="전송 진행률과 실패 분석."
        image={{
          src: "/assets/screens/manual-poc/main-simulator.png",
          alt: "DabitOne 전송 화면",
        }}
      />
      <FeatureShot
        label="EDITOR"
        title="텍스트, 이미지, GIF를 한 환경에서."
        image={{
          src: "/assets/screens/manual-poc/main-editor.png",
          alt: "DabitOne 편집기 화면",
        }}
      />
      <FeatureShot
        label="ADVANCED"
        title="펌웨어, 로그, 진단."
        image={{
          src: "/assets/screens/manual-poc/main-advanced.png",
          alt: "DabitOne 고급 화면",
        }}
      />
      <TabIndex />
      <PdfFooter />
    </>
  )
}

function Hero() {
  return (
    <section class="tour-hero" aria-label="Hero">
      <div class="tour-hero__inner">
        <h1 class="tour-hero__title">DabitOne</h1>
        <p class="tour-hero__sub">다빛솔루션 LED 전광판 운영 소프트웨어.</p>
      </div>
    </section>
  )
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section ref={ref} class="tour-manifesto" style={{ opacity: 0 }}>
      <div class="tour-manifesto__inner">
        <h2 class="tour-manifesto__text">
          픽셀에서 프로토콜까지,
          <br />
          하나의 소프트웨어.
        </h2>
      </div>
    </section>
  )
}

function FeatureShot({
  label,
  title,
  image,
}: {
  label: string
  title: string
  image: { src: string; alt: string }
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-shot"
      style={{ opacity: 0 }}
      aria-label={label.toLowerCase()}
    >
      <div class="tour-shot__inner">
        <p class="tour-shot__eyebrow">{label}</p>
        <h3 class="tour-shot__title">{title}</h3>
        <img
          class="tour-shot__image"
          src={image.src}
          alt={image.alt}
          width={1422}
          height={1386}
          loading="lazy"
        />
      </div>
    </section>
  )
}

const TABS: readonly {
  num: string
  name: string
  desc: string
  slug: string
}[] = [
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

function TabIndex() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-tabs"
      style={{ opacity: 0 }}
      aria-label="투어 시작"
    >
      <div class="tour-tabs__inner">
        <p class="tour-tabs__eyebrow">QUICKSTART</p>
        <h3 class="tour-tabs__title">어디서부터 시작할까요?</h3>
        <ul class="tour-tabs__list">
          {TABS.map((t) => (
            <li key={t.num} class="tour-tabs__item">
              <a
                class="tour-tabs__link"
                href={`/tour/quickstart/${t.slug}/`}
              >
                <span class="tour-tabs__num">{t.num}</span>
                <span class="tour-tabs__name">{t.name}</span>
                <span class="tour-tabs__desc">{t.desc}</span>
                <span class="tour-tabs__arrow" aria-hidden="true">
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

function PdfFooter() {
  return (
    <footer class="tour-footer" aria-label="PDF 다운로드">
      <div class="tour-footer__inner">
        <p class="tour-footer__eyebrow">REFERENCE PDF</p>
        <h3 class="tour-footer__title">오프라인 참조용.</h3>
        <div class="tour-footer__pdfs">
          <a
            class="tour-footer__pdf-card"
            href="/pdf/DabitOne_Manual_Reference.pdf"
          >
            <span class="tour-footer__pdf-num">A</span>
            <span class="tour-footer__pdf-title">매뉴얼 — 기능편</span>
            <span class="tour-footer__pdf-hint">
              화면별 컨트롤 · 파일 포맷 · 메뉴 구조
            </span>
          </a>
          <a
            class="tour-footer__pdf-card"
            href="/pdf/DabitOne_Manual_Operation.pdf"
          >
            <span class="tour-footer__pdf-num">B</span>
            <span class="tour-footer__pdf-title">매뉴얼 — 운영편</span>
            <span class="tour-footer__pdf-hint">
              트러블슈팅 · FAQ · 릴리즈 노트
            </span>
          </a>
        </div>
        <p class="tour-footer__colophon">© 다빛솔루션</p>
      </div>
    </footer>
  )
}
