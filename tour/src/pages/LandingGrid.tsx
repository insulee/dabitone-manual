/**
 * 랜딩 페이지 — 안 B (Variant B, 2026-04-23).
 * /tour1/ 경로 전용 실험. Hero·TabIndex·Footer는 /tour/ 안 A와 동일하고,
 * Feature 섹션만 full-viewport 챕터 → 2×2 grid 카드로 압축.
 *
 * 사용자가 /tour/(안 A)과 /tour1/(안 B)을 나란히 띄워 직접 비교하기 위한 목적.
 */
import { useEffect, useRef } from "preact/hooks"
import { revealOnEnter } from "../lib/observe"
import { PixelMotion } from "../components/PixelMotion"

export function LandingGrid() {
  return (
    <>
      <Hero />
      <FeaturesGrid />
      <TabIndex />
      <Footer />
    </>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section ref={ref} class="tour-hero" aria-label="Hero" style={{ opacity: 0 }}>
      <PixelMotion />
      <div class="tour-hero__inner">
        <h1 class="tour-hero__title">DabitOne</h1>
        <p class="tour-hero__tagline">
          픽셀에서 프로토콜까지,<br />하나의 소프트웨어.
        </p>
        <p class="tour-hero__sub">다빛솔루션 LED 전광판 운영 소프트웨어.</p>
        <div class="tour-hero__cta">
          <a class="tour-btn tour-btn--primary" href="#quickstart">
            투어 시작하기 →
          </a>
          <a
            class="tour-btn tour-btn--secondary"
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
          >
            DabitOne 다운로드
          </a>
        </div>
      </div>
    </section>
  )
}

const FEATURES: readonly {
  num: string
  label: string
  title: string
  lines: readonly string[]
}[] = [
  {
    num: "F01",
    label: "ALL-IN-ONE",
    title: "다섯 도구가 하나의 앱 안에.",
    lines: [
      "다빛채, DBPS(다빛프로토콜시뮬레이터), dbNet, 시리얼 모니터, 이미지·GIF 편집.",
      "예전엔 각자 실행하던 프로그램들이 DabitOne 한 창 안에 모였습니다.",
    ],
  },
  {
    num: "F02",
    label: "ONE SCREEN PER TAB",
    title: "각 탭이 해당 작업의 시작부터 끝까지.",
    lines: [
      "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
      "메뉴 탐색과 창 전환이 줄어든 만큼, 설정 시간도 짧아집니다.",
    ],
  },
  {
    num: "F03",
    label: "DBNET",
    title: "IP 검색과 설정, 가장 빠른 길.",
    lines: [
      "UDP 브로드캐스트 한 번으로 같은 서브넷의 컨트롤러가 MAC·IP 목록으로.",
      "클릭 한 번에 연결 설정 자동 반영, 곧바로 연결 테스트.",
    ],
  },
  {
    num: "F04",
    label: "HEX · ASCII",
    title: "한 화면에서, 두 프로토콜.",
    lines: [
      "HEX·ASCII 설정을 한 화면에서 전환, 가운데 버튼으로 즉시 변환.",
      "프로토콜 문서 없이도 패킷 구조 확인, 현장 디버깅 시간이 짧아집니다.",
    ],
  },
] as const

function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-features-grid"
      aria-label="기능"
      style={{ opacity: 0 }}
    >
      <div class="tour-features-grid__inner">
        <p class="tour-features-grid__eyebrow">FEATURES</p>
        <h2 class="tour-features-grid__title">DabitOne이 달라진 네 가지</h2>
        <ul class="tour-features-grid__list">
          {FEATURES.map((f) => (
            <li key={f.num} class="tour-features-grid__card">
              <div class="tour-features-grid__card-head">
                <span class="tour-features-grid__card-num">{f.num}</span>
                <span class="tour-features-grid__card-label">{f.label}</span>
              </div>
              <h3 class="tour-features-grid__card-title">{f.title}</h3>
              <div class="tour-features-grid__card-body">
                {f.lines.map((line, i) => (
                  <p key={i} class="tour-features-grid__card-line">
                    {line}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
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
      id="quickstart"
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

function Footer() {
  return (
    <footer
      class="tour-footer tour-section--dark"
      aria-label="다운로드 및 참조"
    >
      <div class="tour-footer__inner">
        <div class="tour-footer__install">
          <p class="tour-footer__eyebrow">START USING</p>
          <h3 class="tour-footer__title">DabitOne을 지금 다운로드.</h3>
          <p class="tour-footer__lead">
            설치 파일은 다빛솔루션 공식 사이트에서 제공됩니다.
          </p>
          <a
            class="tour-btn tour-btn--primary"
            href="https://www.dabitsol.com"
            target="_blank"
            rel="noreferrer"
          >
            DabitOne 다운로드 →
          </a>
        </div>
        <div class="tour-footer__pdfs">
          <p class="tour-footer__eyebrow">REFERENCE PDF</p>
          <h3 class="tour-footer__title">오프라인 참조용.</h3>
          <div class="tour-footer__pdf-list">
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
        </div>
        <p class="tour-footer__colophon">© 다빛솔루션</p>
      </div>
    </footer>
  )
}
