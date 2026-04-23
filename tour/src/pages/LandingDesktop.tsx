/**
 * 랜딩 페이지 — 안 E-1 (Variant E-1 "App Window Shell", 2026-04-23).
 * /tour3/ 경로 전용. 페이지 전체가 DabitOne 데스크톱 앱 창 메타포 + Variable Font Kinetic (D 레이어).
 *
 * 디자인 레퍼런스: Linear (sticky header + tab nav), Raycast (monospace micro-UI),
 * Arc `/max` (UI-as-landing blur), Vercel dashboard preview (chrome으로 "live app" 느낌).
 * 사용자가 /tour/(안 A)·/tour1/(안 B)·/tour2/(안 C)와 비교 평가할 네 번째 실험 안.
 */
import type { ComponentChild } from "preact"
import { useEffect, useState } from "preact/hooks"
import { signal } from "@preact/signals"
import { reducedMotion } from "../lib/motion"

type TabId = "home" | "features" | "quickstart" | "download" | "docs"

const TABS: readonly { id: TabId; num: string; label: string }[] = [
  { id: "home", num: "01", label: "홈" },
  { id: "features", num: "02", label: "기능" },
  { id: "quickstart", num: "03", label: "퀵스타트" },
  { id: "download", num: "04", label: "다운로드" },
  { id: "docs", num: "05", label: "문서" },
] as const

const currentTab = signal<TabId>("home")

function currentTabLabel(id: TabId): string {
  return TABS.find((t) => t.id === id)!.label
}

export function LandingDesktop() {
  const [time, setTime] = useState(formatTime(new Date()))
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    document.body.classList.add("tour3-page")
    return () => {
      document.body.classList.remove("tour3-page")
    }
  }, [])

  // Clock — 30초마다 갱신 (minutes만 표시하므로 과도한 tick 방지).
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000)
    return () => clearInterval(id)
  }, [])

  // Scroll-linked wght — 현재 탭의 title.
  // currentTab.value를 effect dependency에 넣어 탭 전환 시 재구독.
  const activeTabId = currentTab.value
  useEffect(() => {
    if (reducedMotion()) return
    const title = document.querySelector<HTMLElement>(".tour3-content__title")
    if (!title) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        // 0~500px 구간에서 700→950으로 증가 (spec 700~900보다 강하게).
        const progress = Math.min(1, Math.max(0, y / 500))
        const wght = 700 + progress * 250
        title.style.fontVariationSettings = `"wght" ${Math.round(wght)}`
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [activeTabId])

  function switchTab(id: TabId) {
    if (currentTab.value === id) return
    setIsSwitching(true)
    currentTab.value = id
    // 탭 전환 시 상단으로 스크롤하여 wght scroll-linked가 700부터 시작.
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" })
    // 다음 프레임 후 is-switching 해제 → CSS transition으로 wght 300→700 애니.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsSwitching(false))
    })
  }

  return (
    <div class="tour3-shell">
      <Titlebar />
      <div class="tour3-body">
        <Sidebar onSwitch={switchTab} />
        <Content isSwitching={isSwitching} onSwitch={switchTab} />
      </div>
      <Statusbar time={time} />
    </div>
  )
}

/* ==================== Title bar ==================== */

function Titlebar() {
  const tabLabel = currentTabLabel(currentTab.value)
  return (
    <header class="tour3-titlebar" role="banner">
      <div class="tour3-titlebar__left">
        <div class="tour3-titlebar__dots" aria-hidden="true">
          <span class="tour3-titlebar__dot tour3-titlebar__dot--r" />
          <span class="tour3-titlebar__dot tour3-titlebar__dot--y" />
          <span class="tour3-titlebar__dot tour3-titlebar__dot--g" />
        </div>
      </div>
      <div class="tour3-titlebar__center">
        <span class="tour3-titlebar__appname">DabitOne</span>
        <span class="tour3-titlebar__sep" aria-hidden="true">
          {" "}
          —{" "}
        </span>
        <span class="tour3-titlebar__tab">{tabLabel}</span>
      </div>
      <div class="tour3-titlebar__meta">v1.2.0 · KST</div>
    </header>
  )
}

/* ==================== Sidebar ==================== */

function Sidebar({ onSwitch }: { onSwitch: (id: TabId) => void }) {
  const activeId = currentTab.value
  return (
    <nav class="tour3-sidebar" aria-label="앱 네비게이션">
      <p class="tour3-sidebar__brand">DabitOne</p>
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          class={`tour3-sidebar__tab${activeId === t.id ? " is-active" : ""}`}
          onClick={() => onSwitch(t.id)}
          aria-current={activeId === t.id ? "page" : undefined}
        >
          <span class="tour3-sidebar__tab-num">{t.num}</span>
          <span class="tour3-sidebar__tab-label">{t.label}</span>
        </button>
      ))}
      <div class="tour3-sidebar__spacer" />
      <div class="tour3-sidebar__footer">
        © 다빛솔루션
        <br />
        2026
      </div>
    </nav>
  )
}

/* ==================== Content ==================== */

function Content({
  isSwitching,
  onSwitch,
}: {
  isSwitching: boolean
  onSwitch: (id: TabId) => void
}) {
  const tab = currentTab.value
  return (
    <main class={`tour3-content${isSwitching ? " is-switching" : ""}`} role="main">
      {tab === "home" && <ContentHome onSwitch={onSwitch} />}
      {tab === "features" && <ContentFeatures />}
      {tab === "quickstart" && <ContentQuickstart />}
      {tab === "download" && <ContentDownload />}
      {tab === "docs" && <ContentDocs />}
    </main>
  )
}

function ContentHome({ onSwitch }: { onSwitch: (id: TabId) => void }) {
  return (
    <>
      <p class="tour3-content__eyebrow">DABITONE · v1.2.0</p>
      <h1 class="tour3-content__title">DabitOne.</h1>
      <p class="tour3-content__tagline">픽셀에서 프로토콜까지, 하나의 소프트웨어.</p>
      <p class="tour3-content__sub">
        다빛솔루션 LED 전광판 운영 데스크톱 앱. 통신, 설정, 전송, 편집, 고급 운영을 한 화면에.
      </p>
      <div class="tour3-content__stats">
        <span class="tour3-content__stat">
          <strong>5</strong> 탭
        </span>
        <span class="tour3-content__stat">
          <strong>6+</strong> 프로토콜
        </span>
        <span class="tour3-content__stat">
          <strong>8</strong> 퀵스타트
        </span>
        <span class="tour3-content__stat">
          <strong>2</strong> 매뉴얼 PDF
        </span>
      </div>
      <div class="tour3-content__cta">
        <button
          type="button"
          class="tour-btn tour-btn--primary"
          onClick={() => onSwitch("quickstart")}
        >
          투어 시작하기 →
        </button>
        <a
          class="tour-btn tour-btn--secondary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          DabitOne 다운로드
        </a>
      </div>
    </>
  )
}

const FEATURES: readonly {
  num: string
  label: string
  title: string
  lines: readonly ComponentChild[]
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

function ContentFeatures() {
  return (
    <>
      <p class="tour3-content__eyebrow">FEATURES — 4 / 4</p>
      <h1 class="tour3-content__title">달라진 네 가지.</h1>
      <div class="tour3-features">
        {FEATURES.map((f) => (
          <article class="tour3-feature-card" key={f.num}>
            <div class="tour3-feature-card__head">
              <span class="tour3-feature-card__num">{f.num}</span>
              <span class="tour3-feature-card__label">{f.label}</span>
            </div>
            <h3 class="tour3-feature-card__title">{f.title}</h3>
            <div class="tour3-feature-card__lines">
              {f.lines.map((l, i) => (
                <p class="tour3-feature-card__line" key={i}>
                  {l}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

const QUICKSTART_ITEMS: readonly {
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

function ContentQuickstart() {
  return (
    <>
      <p class="tour3-content__eyebrow">QUICKSTART — 5 시나리오</p>
      <h1 class="tour3-content__title">어디서부터 시작할까요?</h1>
      <div class="tour3-quickstart">
        {QUICKSTART_ITEMS.map((it) => (
          <a class="tour3-quickstart__item" key={it.num} href={`/tour/quickstart/${it.slug}/`}>
            <span class="tour3-quickstart__num">{it.num}</span>
            <span class="tour3-quickstart__name">{it.name}</span>
            <span class="tour3-quickstart__desc">{it.desc}</span>
            <span class="tour3-quickstart__arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

function ContentDownload() {
  return (
    <>
      <p class="tour3-content__eyebrow">INSTALL</p>
      <h1 class="tour3-content__title">지금 다운로드.</h1>
      <p class="tour3-content__sub">
        다빛솔루션 공식 사이트에서 최신 설치 파일을 받습니다. 서명된 실행 파일, 약 150 MB.
      </p>
      <div class="tour3-content__cta">
        <a
          class="tour-btn tour-btn--primary"
          href="https://www.dabitsol.com"
          target="_blank"
          rel="noreferrer"
        >
          dabitsol.com →
        </a>
      </div>
      <div class="tour3-download-info">
        <div class="tour3-download-info__cell">
          <p class="tour3-download-info__cell-label">지원 환경</p>
          <p class="tour3-download-info__cell-value">Windows 10 / 11 · .NET 8 runtime 내장</p>
        </div>
        <div class="tour3-download-info__cell">
          <p class="tour3-download-info__cell-label">파일 크기</p>
          <p class="tour3-download-info__cell-value">약 150 MB</p>
        </div>
        <div class="tour3-download-info__cell">
          <p class="tour3-download-info__cell-label">검증</p>
          <p class="tour3-download-info__cell-value">다빛솔루션 디지털 서명</p>
        </div>
      </div>
    </>
  )
}

function ContentDocs() {
  return (
    <>
      <p class="tour3-content__eyebrow">REFERENCE PDF</p>
      <h1 class="tour3-content__title">오프라인 참조용.</h1>
      <div class="tour3-docs">
        <a class="tour3-docs__card" href="/pdf/DabitOne_Manual_Reference.pdf">
          <span class="tour3-docs__card-mark" aria-hidden="true">
            A
          </span>
          <div>
            <p class="tour3-docs__card-title">매뉴얼 — 기능편</p>
            <p class="tour3-docs__card-hint">화면별 컨트롤 · 파일 포맷 · 메뉴 구조</p>
          </div>
        </a>
        <a class="tour3-docs__card" href="/pdf/DabitOne_Manual_Operation.pdf">
          <span class="tour3-docs__card-mark" aria-hidden="true">
            B
          </span>
          <div>
            <p class="tour3-docs__card-title">매뉴얼 — 운영편</p>
            <p class="tour3-docs__card-hint">트러블슈팅 · FAQ · 릴리즈 노트</p>
          </div>
        </a>
      </div>
    </>
  )
}

/* ==================== Status bar ==================== */

function Statusbar({ time }: { time: string }) {
  const tabLabel = currentTabLabel(currentTab.value)
  return (
    <footer class="tour3-statusbar" role="contentinfo">
      <div class="tour3-statusbar__left">
        <span class="tour3-statusbar__ok" aria-hidden="true">
          ●
        </span>
        <span> CONNECTED</span>
        <span class="tour3-statusbar__sep" aria-hidden="true">
          {" "}
          ·{" "}
        </span>
        <span>v1.2.0</span>
      </div>
      <div class="tour3-statusbar__center">~/{tabLabel}</div>
      <div class="tour3-statusbar__right">{time}</div>
    </footer>
  )
}

function formatTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, "0")
  const m = d.getMinutes().toString().padStart(2, "0")
  return `KST ${h}:${m}`
}
