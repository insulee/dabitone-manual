/**
 * 랜딩 페이지 — LED Grid aesthetic direction (2026-04-21 재설계).
 * frontend-design SKILL.md 원칙 + 2026 type-first / industrial minimalism 트렌드.
 * Hero / Manifesto / FeatureGrid / EditorShot / TabIndex / SpecSheet / Footer.
 */
import { useEffect, useRef } from "preact/hooks"
import { revealOnEnter } from "../lib/observe"

export function Landing() {
  return (
    <>
      <Hero />
      <Manifesto />
      <FeatureGrid />
      <EditorShot />
      <TabIndex />
      <SpecSheet />
      <PdfFooter />
    </>
  )
}

function Hero() {
  return (
    <section class="tour-hero" aria-label="Hero">
      <div class="tour-hero__inner">
        <p class="tour-hero__eyebrow">DABITSOL · LED CONTROL SOFTWARE</p>
        <h1 class="tour-hero__title">DabitONe</h1>
        <p class="tour-hero__sub">다빛솔루션 LED 전광판 운영 소프트웨어.</p>
        <p class="tour-hero__meta">V1.1.0 · WINDOWS · 2026</p>
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

const FEATURES: readonly { label: string; desc: string }[] = [
  { label: "6 PROTOCOLS", desc: "Serial · TCP · UDP · BLE · MQTT · dbNet" },
  { label: "DRAG & DROP", desc: "편집기에서 바로 이미지·GIF·텍스트" },
  { label: "REAL-TIME", desc: "전송 진행률 · 재시도 · 실패 분석" },
  { label: "6 FORMATS", desc: "DAT · ANI · GIF · PLA · BGP · FNT" },
  { label: "SCHEDULE", desc: "메시지 스케줄 · 배경 순환" },
  { label: "FIRMWARE", desc: "컨트롤러 OTA 업데이트" },
] as const

function FeatureGrid() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-features"
      style={{ opacity: 0 }}
      aria-label="기능"
    >
      <div class="tour-features__inner">
        {FEATURES.map((f) => (
          <div key={f.label} class="tour-features__cell">
            <p class="tour-features__label">{f.label}</p>
            <p class="tour-features__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function EditorShot() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-shot"
      style={{ opacity: 0 }}
      aria-label="편집기"
    >
      <div class="tour-shot__inner">
        <p class="tour-shot__eyebrow">EDITOR</p>
        <h3 class="tour-shot__title">
          텍스트, 이미지, GIF를 한 환경에서.
        </h3>
        <img
          class="tour-shot__image"
          src="/assets/screens/manual-poc/main-editor.png"
          alt="DabitONe 편집기 화면"
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

const SPECS: readonly { k: string; v: string }[] = [
  { k: "통신 프로토콜", v: "Serial · TCP · UDP · BLE · MQTT · dbNet" },
  { k: "파일 포맷", v: "DAT · ANI · GIF · PLA · BGP · FNT" },
  { k: "플랫폼", v: "Windows 10 이상" },
  { k: "언어", v: "한국어 · 영어" },
  { k: "버전", v: "1.1.0 (2026-04)" },
] as const

function SpecSheet() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-specs"
      style={{ opacity: 0 }}
      aria-label="스펙"
    >
      <div class="tour-specs__inner">
        <p class="tour-specs__eyebrow">SPECIFICATIONS</p>
        <dl class="tour-specs__list">
          {SPECS.map((s) => (
            <div key={s.k} class="tour-specs__row">
              <dt class="tour-specs__k">{s.k}</dt>
              <dd class="tour-specs__v">{s.v}</dd>
            </div>
          ))}
        </dl>
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
            href="/pdf/DabitONe_Manual_Reference.pdf"
          >
            <span class="tour-footer__pdf-num">A</span>
            <span class="tour-footer__pdf-title">UI 레퍼런스편</span>
            <span class="tour-footer__pdf-hint">
              화면별 컨트롤 · 파일 포맷 · 메뉴 구조
            </span>
          </a>
          <a
            class="tour-footer__pdf-card"
            href="/pdf/DabitONe_Manual_Operation.pdf"
          >
            <span class="tour-footer__pdf-num">B</span>
            <span class="tour-footer__pdf-title">운영·문제해결편</span>
            <span class="tour-footer__pdf-hint">
              트러블슈팅 · FAQ · 릴리즈 노트
            </span>
          </a>
        </div>
        <p class="tour-footer__colophon">
          © DABITSOL · DABITONE V1.1.0
        </p>
      </div>
    </footer>
  )
}
