/**
 * 접근성 대안 경로 `/tour/accessible/` — 키보드·스크린 리더 전용 텍스트 뷰.
 * 같은 투어 데이터에서 텍스트 기반 렌더.
 * 플랜 v3.1 codex finding 5 반영.
 */
import { landing } from "../../data/landing"

export function AccessibleView() {
  return (
    <main
      class="tour-section"
      style={{ minHeight: "100vh", padding: "80px 24px" }}
      aria-label="투어 접근성 경로"
    >
      <div class="tour-section__inner" style={{ maxWidth: "720px" }}>
        <h1 class="tour-section__title">DabitONe 투어 — 텍스트 경로</h1>
        <p class="tour-section__caption">
          인터랙티브 투어의 모든 내용을 텍스트로 읽으실 수 있습니다. 스크린
          리더·키보드 사용자를 위한 대안 경로입니다.
        </p>

        <section>
          <h2 style={{ marginTop: "48px" }}>{landing.hero.title}</h2>
          <p>{landing.hero.subtitle}</p>
        </section>

        <section>
          <h2 style={{ marginTop: "48px" }}>5년 만의 변화</h2>
          {landing.whatsNew.map((item, i) => (
            <article key={i} style={{ marginTop: "32px" }}>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
            </article>
          ))}
        </section>

        <section>
          <h2 style={{ marginTop: "48px" }}>시나리오 투어 목록</h2>
          <ul>
            {landing.hotspots.map((h) => (
              <li key={h.id} style={{ marginTop: "12px" }}>
                <a
                  href={`/tour/quickstart/${h.tourSlug}/`}
                  style={{ color: "var(--tour-c-accent)" }}
                >
                  {h.hotspot.label}
                </a>{" "}
                — {h.summary}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 style={{ marginTop: "48px" }}>오프라인 PDF</h2>
          <ul>
            <li>
              <a href="/pdf/DabitONe_Manual_Reference.pdf">
                UI 레퍼런스편
              </a>{" "}
              — 화면별 컨트롤 설명, 파일 포맷, 메뉴 구조
            </li>
            <li>
              <a href="/pdf/DabitONe_Manual_Operation.pdf">
                운영·문제해결편
              </a>{" "}
              — 트러블슈팅, FAQ, 릴리즈 노트
            </li>
          </ul>
        </section>

        <p style={{ marginTop: "80px" }}>
          <a href="/tour/" style={{ color: "var(--tour-c-accent)" }}>
            ← 인터랙티브 투어로 돌아가기
          </a>
        </p>
      </div>
    </main>
  )
}
