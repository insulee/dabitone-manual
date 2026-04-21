/**
 * 투어 시나리오 페이지 — Quickstart 01~08 각각.
 * 플랜 v3.1 Phase R3. MVP는 placeholder, R3.1에서 완성.
 */
import { useEffect } from "preact/hooks"
import { currentStepIndex, gotoStep } from "../lib/state"
import { LiveRegion } from "../components/LiveRegion"

interface Props {
  slug: string
}

export function TourScenario({ slug }: Props) {
  useEffect(() => {
    // R3.1에서 tour 데이터 로드 구현
  }, [slug])

  const step = currentStepIndex.value

  return (
    <main
      class="tour-section"
      aria-label={`투어: ${slug}`}
      style={{ minHeight: "100vh" }}
    >
      <div class="tour-section__inner">
        <LiveRegion message={`스텝 ${step + 1}`} />
        <h1 class="tour-section__title">투어: {slug}</h1>
        <p class="tour-section__caption">
          Phase R3.1에서 인터랙티브 스텝이 여기에 로드됩니다. 현재 스텝:{" "}
          {step + 1}
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
          <button
            onClick={() => gotoStep(Math.max(0, step - 1))}
            style={navButtonStyle}
          >
            이전
          </button>
          <button onClick={() => gotoStep(step + 1)} style={navButtonStyle}>
            다음 →
          </button>
        </div>
        <p style={{ marginTop: "48px" }}>
          <a
            href="/tour/"
            style={{
              color: "var(--tour-c-accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← 투어 홈으로
          </a>
        </p>
      </div>
    </main>
  )
}

const navButtonStyle: preact.JSX.CSSProperties = {
  padding: "12px 24px",
  fontSize: "var(--tour-fs-body)",
  fontWeight: 600,
  background: "var(--tour-c-accent)",
  color: "#fff",
  border: 0,
  borderRadius: "var(--tour-r-md)",
  cursor: "pointer",
}
