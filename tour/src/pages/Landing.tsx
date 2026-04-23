/**
 * 랜딩 페이지 — 텍스트 중심 (2026-04-23).
 * 구조: Hero → Manifesto → Feature × 4 (이미지 제거) → Quickstart → Footer.
 * 특징 4개: All-in-One / 탭별 완결 / dbNet / HEX·ASCII 통합 전송.
 */
import { useEffect, useRef } from "preact/hooks"
import { revealOnEnter } from "../lib/observe"

export function Landing() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Feature
        num="F01"
        label="ALL-IN-ONE"
        title="다섯 도구가 하나의 앱 안에."
        lines={[
          "다빛채, DBPS(다빛프로토콜시뮬레이터), dbNet, 시리얼 모니터, 이미지·GIF 편집.",
          "예전엔 각자 실행하던 프로그램들이 DabitOne 한 창 안에 모였습니다.",
        ]}
      />
      <Feature
        num="F02"
        label="ONE SCREEN PER TAB"
        flip
        title="각 탭이 해당 작업의 시작부터 끝까지."
        lines={[
          "통신, 설정, 전송, 편집, 고급 — 다섯 개 탭.",
          "레거시에서 설정은 흩어져 있었습니다. 화면 크기, 표출 신호, 폰트 전송이 각자 다른 창에서.",
          "DabitOne은 한 화면 안에 모았습니다. 메뉴 탐색과 창 전환이 줄어든 만큼, 설정 시간도 짧아집니다.",
        ]}
      />
      <Feature
        num="F03"
        label="DBNET"
        title="IP 검색과 설정, 가장 빠른 길."
        lines={[
          "UDP 브로드캐스트 한 번으로 같은 서브넷의 컨트롤러가 MAC·IP 목록으로.",
          "장비를 클릭하면 연결 설정으로 자동 반영, 곧바로 연결 테스트.",
          "이전보다 안정적인 응답, 타이핑과 오타 확인이 줄어든 흐름.",
        ]}
      />
      <Feature
        num="F04"
        label="HEX · ASCII"
        flip
        title="한 화면에서, 두 프로토콜."
        lines={[
          "메시지 종류·섹션·페이지를 라디오·콤보박스로 선택하는 HEX. 텍스트 영역에 직접 쓰는 ASCII.",
          "가운데의 “ASCII 변환” 버튼이 HEX 설정값을 ASCII 문자열로 바꿔 줍니다.",
          "프로토콜 문서 없이도 패킷 구조 확인. 시스템 연동과 현장 디버깅에서 학습 시간이 짧아집니다.",
        ]}
      />
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
      <div class="tour-hero__inner">
        <h1 class="tour-hero__title">DabitOne</h1>
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

function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class="tour-manifesto tour-section--dark"
      aria-label="철학"
      style={{ opacity: 0 }}
    >
      <div class="tour-manifesto__inner">
        <h2 class="tour-manifesto__title">
          픽셀에서 프로토콜까지,
          <br />
          하나의 소프트웨어.
        </h2>
      </div>
    </section>
  )
}

function Feature({
  num,
  label,
  title,
  lines,
  flip,
}: {
  num: string
  label: string
  title: string
  lines: string[]
  flip?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) revealOnEnter(ref.current)
  }, [])
  return (
    <section
      ref={ref}
      class={`tour-feature ${flip ? "tour-feature--flip" : ""}`}
      style={{ opacity: 0 }}
      aria-label={label.toLowerCase()}
    >
      <div class="tour-feature__inner">
        <div class="tour-feature__text">
          <div class="tour-feature__head">
            <span class="tour-feature__num">{num}</span>
            <span class="tour-feature__label">{label}</span>
          </div>
          <h3 class="tour-feature__title">{title}</h3>
          <div class="tour-feature__body">
            {lines.map((line, i) => (
              <p key={i} class="tour-feature__line">
                {line}
              </p>
            ))}
          </div>
        </div>
        <div class="tour-feature__visual" aria-hidden="true">
          <div class="tour-feature__visual-mark">{num}</div>
        </div>
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
