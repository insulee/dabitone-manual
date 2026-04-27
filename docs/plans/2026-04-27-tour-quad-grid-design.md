---
title: /tour HorizontalFeatures → 2x2 Quad Grid 재설계
date: 2026-04-27
status: approved
---

# /tour HorizontalFeatures → 2x2 Quad Grid 재설계

## 배경

`/tour` 페이지(LandingHybrid)의 가운데 `HorizontalFeatures` 섹션은
현재 sticky 400vh + 가로 translate + wheel-snap 기반의 가로 스크롤 패널
4개(F01~F04)다. 사용자가 가로 스크롤 인터랙션을 제거하고 정적 4분할
그리드로 교체하기로 결정. Apple Korea 메인의 카드 그리드를 톤 레퍼런스로 삼는다.

콘텐츠(F01 ALL-IN-ONE, F02 ONE SCREEN PER TAB, F03 DBNET, F04 HEX·ASCII)는
유지. 시각만 풀-블리드 그라디언트 카드로 전환.

## 결정 요약

| 항목 | 결정 |
|---|---|
| 컴포지션 | 풀-블리드 배경 (카드 전체가 시각 요소) |
| 시각 소스 | CSS 컬러 그라디언트 + SVG turbulence noise grain (스크린샷·외부 이미지 미사용) |
| 카드 동작 | 정적 (link 없음, 정보 전시) |
| 컬러 톤 | 차분 cool 4종 (deep blue / deep purple / deep teal / charcoal) |
| Hover | 없음 (cursor default) |
| 카드 비율 | 정사각 1:1 |

## 레이아웃

- 2x2 그리드, 정사각 카드
- `max-width: 1280px` (기존 hybrid 섹션과 일관)
- 갭 16px (Apple 식 tight)
- 모바일 (<768px) → 1열 stack

## 카드 컬러 매핑

| 패널 | 그라디언트 |
|---|---|
| F01 ALL-IN-ONE | deep blue · `#0c4a6e → #075985` |
| F02 ONE SCREEN PER TAB | deep purple · `#3b0764 → #581c87` |
| F03 DBNET | deep teal · `#134e4a → #115e59` |
| F04 HEX·ASCII | charcoal · `#1c1917 → #292524` |

+ SVG `feTurbulence` noise grain overlay, 약 5% opacity.

## 카드 내부 컴포지션

- 풀-블리드 그라디언트 + noise
- 텍스트 좌하단 정렬 (Apple 식)
  - eyebrow label: `white/60%`, 12px, uppercase, letter-spacing 1.5
  - title (h2): white, 36–44px, line-height 1.1, 2줄 (`\n`)
  - body lines: `white/75%`, 16px, 1–3줄
- 카드 패딩 48px

## 인터랙션

- Hover 없음 (cursor default)
- 진입 fade-in: `IntersectionObserver`, 카드별 stagger 80ms, opacity 0→1 + translateY 16→0
- 페이지 로드 시 viewport 안 카드부터 순차 entrance

## 코드 변경 범위

### `tour/src/pages/LandingHybrid.tsx`
- `HorizontalFeatures` 함수 → `QuadGrid`로 교체
- `PANELS` 데이터 유지 (label/title/lines)
- 기존 `useEffect` 안의 wheel/scroll/snap 로직 전부 제거
- `<HorizontalFeatures />` 호출은 `<QuadGrid />`로

### `tour/src/styles/hybrid.css`
- 제거: `.tour11-horizontal*`, `.tour11-panel*` (가로 스크롤 관련 스타일)
- 추가: `.tour11-quad*` (그리드, 카드, 텍스트, fade-in keyframe)
- noise SVG는 inline `data:image/svg+xml`로 background-image 추가 (외부 fetch 없음)

## 비변경 영역

- Hero, QuickstartTabs, MagneticFooter — 기존 그대로
- 4개 패널 카피 — 한 글자도 수정 없음
- 라우팅 — `/tour/`만 사용 (정리 commit 4b6d25b 적용 상태)

## 검증

- `npm run build` → public/tour/index.html 갱신
- localhost:8888/tour/ desktop 1440px viewport에서 2x2 정사각 4 카드 확인
- 모바일 viewport(<768px)에서 1열 stack 확인
- noise grain 농도 확인 (지나치게 진하면 5% 미만으로 조정)
- IntersectionObserver entrance가 정상 동작 (스크롤 시 카드 순차 fade-in)

## 비고

- 카드 정적 = link 아님. 추후 link 필요해지면 `<a>` wrap + cursor pointer 추가만.
- 컬러 매핑(F01~F04 → blue/purple/teal/charcoal)은 임의 매핑. 추후 brand 톤 재조정 시 변경 가능.
