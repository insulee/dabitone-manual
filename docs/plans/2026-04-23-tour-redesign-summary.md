# Tour 풀 리디자인 — 완료 요약

**Date:** 2026-04-23
**Branch:** feature/tour-redesign
**Base:** 4a03620 (main HEAD at start)

## Phases

- Phase 0 — 환경·베이스라인 (스크린샷 + 빌드 확인)
- Phase 1 — 디자인 토큰 & 폰트 (팔레트·타이포·Pretendard·Inter Variable·shadow)
- Phase 2 — 컴포넌트 CSS (hotspot·button·Quickstart card·잔여 accent 정리)
- Phase 3 — Hero 픽셀 모션 Canvas
- Phase 4 — Landing 구조 재구성 (Hero·Manifesto 다크·Feature 좌우 교대·Quickstart 3+2·Footer 다크 + 설치 CTA)
- Phase 5 — Quickstart 페이지 업데이트 (subtitle·Stage border·Rail class·완료 스크린)
- Phase 6 — 반응형 검증 + Mobile Stage grid fix

## Key deliverables

- `tour/src/styles/tokens.css` — 모노크롬 팔레트 + type scale + 폰트 stack
- `tour/src/styles/app.css` — 모든 컴포넌트 CSS
- `tour/src/components/PixelMotion.tsx` — Canvas dot matrix
- `tour/src/pages/Landing.tsx` — 9 섹션
- `tour/src/pages/TourScenario.tsx` — ProgressHeader + Stage + Rail + CompletionScreen
- `scripts/copy-fonts.mjs` — 폰트 자동 복사
- `scripts/build-tour.mjs` — esbuild external `/static/fonts/*`
- `quartz/static/fonts/*.woff2` — 폰트 바이너리 커밋

## 의도적 보류

- **Rest Moment 추상 이미지 섹션**: Unsplash 이미지 수동 선정 필요. 섹션 자체도 추가하지 않음 (placeholder 회피).
- **Feature visual slot SVG 아이콘**: 현재 `F01` 큰 텍스트 mark로 채움.
- **Popover dark-section 오버라이드**: 현재 popover는 light context만 발생.
- **Lighthouse 측정**: 사용자 환경에서 수동.

## Known items

- `--tour-c-text-dim: #a3a3a3` light bg 대비 2.52 (decorative num 용도로 의도적 저대비 — 정보 전달 텍스트 금지).
- TS `npm run check`: pre-existing 4 errors (quartz.config·QuickLinks·tour emitter·TourScenario Rail unused stepIdx).

## PR body draft

### Title
`feat(tour): 풀 리디자인 — 모노크롬 + Pretendard/Inter + 다크 반전 + 픽셀 모션`

### Summary
- Tour 앱 (`/tour/` Landing + `/tour/quickstart/01~08` 8 시나리오) 모노크롬 디자인 언어 전환
- Landing 9 섹션 재구성: Hero(픽셀 모션) → Manifesto(다크) → Feature×4(좌우 교대) → Quickstart(3+2) → Footer(다크 + 설치 CTA)
- Quickstart 페이지: subtitle + Stage border + Rail class + 완료 스크린
- Pretendard Variable + Inter Variable self-hosted WOFF2

### Test plan
- [ ] http://localhost:8888/tour/ — Landing hard refresh 확인
- [ ] http://localhost:8888/tour/quickstart/01-first-connection/ — step 탐색
- [ ] http://localhost:8888/tour/quickstart/08-firmware/?s=10 — 완료 스크린
- [ ] DevTools Mobile 375/768/1440 — 반응형 stack·grid
- [ ] `prefers-reduced-motion` — 픽셀 모션 정적
- [ ] Lighthouse Performance/Accessibility ≥ 90
