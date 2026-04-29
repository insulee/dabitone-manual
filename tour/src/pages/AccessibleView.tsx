/**
 * 접근성 대안 경로 `/accessible/` — 키보드·스크린 리더 전용 텍스트 뷰.
 * LED Grid aesthetic 적용 (2026-04-21 재설계).
 */
import { landing } from "../../data/landing"

const FEATURES: readonly { label: string; desc: string }[] = [
  { label: "6 PROTOCOLS", desc: "Serial · TCP · UDP · BLE · MQTT · dbNet" },
  { label: "DRAG & DROP", desc: "편집기에서 바로 이미지·GIF·텍스트" },
  { label: "REAL-TIME", desc: "전송 진행률 · 재시도 · 실패 분석" },
  { label: "6 FORMATS", desc: "DAT · ANI · GIF · PLA · BGP · FNT" },
  { label: "SCHEDULE", desc: "메시지 스케줄 · 배경 순환" },
  { label: "FIRMWARE", desc: "컨트롤러 OTA 업데이트" },
]

const SPECS: readonly { k: string; v: string }[] = [
  { k: "통신 프로토콜", v: "Serial · TCP · UDP · BLE · MQTT · dbNet" },
  { k: "파일 포맷", v: "DAT · ANI · GIF · PLA · BGP · FNT" },
  { k: "플랫폼", v: "Windows 10 이상" },
  { k: "언어", v: "한국어 · 영어" },
  { k: "버전", v: "1.1.0 (2026-04)" },
]

export function AccessibleView() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "80px 32px",
        background: "var(--tour-c-bg)",
        color: "var(--tour-c-text)",
      }}
      aria-label="투어 접근성 경로"
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--tour-font-mono)",
            fontSize: "var(--tour-fs-label)",
            letterSpacing: "var(--tour-ls-label)",
            textTransform: "uppercase",
            color: "var(--tour-c-text-dim)",
            margin: "0 0 24px",
          }}
        >
          DABITSOL · TEXT-ONLY VIEW
        </p>
        <h1
          style={{
            fontFamily: "var(--tour-font-display)",
            fontSize: "clamp(40px, 6vw, 72px)",
            letterSpacing: "var(--tour-ls-tight)",
            fontWeight: 700,
            margin: "0 0 24px",
            lineHeight: 1.05,
            color: "var(--tour-c-text)",
          }}
        >
          {landing.hero.title}
        </h1>
        <p
          style={{
            fontSize: "clamp(18px, 1.5vw, 22px)",
            color: "var(--tour-c-text-soft)",
            margin: "0 0 16px",
            lineHeight: 1.4,
          }}
        >
          {landing.hero.subtitle}
        </p>
        <p
          style={{
            color: "var(--tour-c-text-soft)",
            margin: "0 0 64px",
            lineHeight: 1.5,
          }}
        >
          인터랙티브 투어의 모든 내용을 텍스트로 읽으실 수 있습니다. 스크린
          리더·키보드 사용자를 위한 대안 경로입니다.
        </p>

        <Section eyebrow="FEATURES" title="기능">
          <dl style={{ margin: 0 }}>
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--tour-c-line)",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--tour-font-mono)",
                    fontSize: "var(--tour-fs-label)",
                    letterSpacing: "var(--tour-ls-label)",
                    color: "var(--tour-c-text-soft)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                    fontWeight: 600,
                  }}
                >
                  {f.label}
                </dt>
                <dd style={{ margin: 0, color: "var(--tour-c-text)" }}>
                  {f.desc}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section eyebrow="QUICKSTART" title="시나리오 투어">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {landing.hotspots.map((h) => (
              <li
                key={h.id}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid var(--tour-c-line)",
                }}
              >
                <a
                  href={`/quickstart/${h.tourSlug}/`}
                  style={{
                    fontFamily: "var(--tour-font-body)",
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "var(--tour-c-text)",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {h.hotspot.label} →
                </a>
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--tour-c-text-soft)",
                    margin: "6px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {h.summary}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="SPECIFICATIONS" title="스펙">
          <dl style={{ margin: 0 }}>
            {SPECS.map((s) => (
              <div
                key={s.k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "24px",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--tour-c-line)",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--tour-font-mono)",
                    fontSize: "var(--tour-fs-label)",
                    letterSpacing: "var(--tour-ls-label)",
                    textTransform: "uppercase",
                    color: "var(--tour-c-text-soft)",
                  }}
                >
                  {s.k}
                </dt>
                <dd style={{ margin: 0, color: "var(--tour-c-text)" }}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section eyebrow="REFERENCE PDF" title="오프라인 PDF">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--tour-c-line)",
              }}
            >
              <a
                href="/pdf/DabitOne_Manual_Reference.pdf"
                style={{
                  color: "var(--tour-c-text)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                매뉴얼 — 기능편 →
              </a>{" "}
              <span style={{ color: "var(--tour-c-text-soft)" }}>
                화면별 컨트롤 · 파일 포맷 · 메뉴 구조
              </span>
            </li>
            <li
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--tour-c-line)",
              }}
            >
              <a
                href="/pdf/DabitOne_Manual_Operation.pdf"
                style={{
                  color: "var(--tour-c-text)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                운영·문제해결편 →
              </a>{" "}
              <span style={{ color: "var(--tour-c-text-soft)" }}>
                트러블슈팅 · FAQ · 릴리즈 노트
              </span>
            </li>
          </ul>
        </Section>

        <p style={{ marginTop: "96px" }}>
          <a
            href="/"
            style={{
              fontFamily: "var(--tour-font-mono)",
              fontSize: "var(--tour-fs-small)",
              letterSpacing: "var(--tour-ls-mono)",
              textTransform: "uppercase",
              color: "var(--tour-c-text)",
              textDecoration: "none",
            }}
          >
            ← 인터랙티브 투어로 돌아가기
          </a>
        </p>
      </div>
    </main>
  )
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: preact.ComponentChildren
}) {
  return (
    <section style={{ marginTop: "72px" }}>
      <p
        style={{
          fontFamily: "var(--tour-font-mono)",
          fontSize: "var(--tour-fs-label)",
          letterSpacing: "var(--tour-ls-label)",
          textTransform: "uppercase",
          color: "var(--tour-c-text-soft)",
          margin: "0 0 12px",
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontSize: "clamp(24px, 3vw, 36px)",
          letterSpacing: "var(--tour-ls-tight)",
          fontWeight: 500,
          margin: "0 0 24px",
          color: "var(--tour-c-text)",
          borderTop: "1px solid var(--tour-c-line)",
          paddingTop: "24px",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
