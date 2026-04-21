# ADR-009: R7 QA 감사 결과 (이 세션 기준)

**일자**: 2026-04-21
**범위**: 플랜 v3.1 전체 Phase 실행 결과 감사
**작성자**: AI (Claude) 단독 세션

## 요약

플랜 v3.1의 R0~R6 구현을 한 세션에 완료. 결과물은 `main`에 배포됨. 이 문서는 **감사**로, 각 검수 항목이 실제로 충족됐는지 기록한다.

## 배포 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| `https://dabitone.dabitsol.com/` | ✅ 배포 | 새 markdown landing |
| `https://dabitone.dabitsol.com/tour/` | ✅ 배포 | Preact 투어 랜딩 |
| `https://dabitone.dabitsol.com/tour/quickstart/01~08/` | ✅ 배포 | 8 시나리오 |
| `https://dabitone.dabitsol.com/tour/accessible/` | ✅ 배포 | 텍스트 대안 |
| `/quickstart/*` 레거시 URL | ✅ 배포 (redirect) | meta refresh → /tour/* |
| 2권 PDF | ⚠️ CI 배포 시 생성 | `continue-on-error`로 실패 시 사이트는 배포됨 |

## 구현됨 vs 검증됨

### ✅ 구현 완료 (코드/문서 존재)

- R0 정리 + 수동 스크린샷 5장 + 레거시 before 9장
- R0.5 PDF pipeline audit (ADR-007)
- R1.0 ADR-006 Custom emitter 결정, ADR-008 Route contract
- R1.1 tour/ 디렉토리 + 확장 스키마 (image/hotspot+ariaLabel/mobileHotspot/srSummary/relatedRefs)
- R1.2 Motion One wrapper + IO helper (Lenis 제외)
- R1.3 Apple-style 디자인 토큰 CSS
- R1.4 Hotspot·Popover·LiveRegion + focus trap
- R1.5 Signals 상태 + localStorage 진행률 (one-router 준수)
- R1.6 TourEmitter + /tour/ 실제 배포
- R2 랜딩: Hero + Before/After 3쌍 + 5 핫스팟 + PDF 카드
- R3.1 TourScenario 엔진 (stage + rail + progress + 키보드)
- R3.2~R3.9 Quickstart 01~08 투어 데이터
- R4 Reference markdown (index + 5 group indexes + Serial/TCP/UDP + troubleshoot 01 + blog v1.1.0)
- R5 build-pdf.mjs (Playwright + pdf-lib, 2권 분할)
- R6 Cross-link (tour → markdown, markdown → tour 인라인 링크)

### ⚠️ 이 세션에서 검증 안 된 항목 (실제 사용자 테스트 필요)

- **브라우저 실제 렌더**: AI가 브라우저를 직접 열 수 없어 로컬 빌드 성공만 확인
- **Lighthouse 점수**: Performance·Accessibility ≥ 85·95 목표 — 사용자 측정 필요
- **모바일 실제 조작**: iPhone/Galaxy 에뮬레이션 및 실기 테스트 — 사용자 필요
- **스크린 리더**: NVDA로 투어 완주 테스트 — 사용자 필요
- **핫스팟 좌표 정확도**: main-comm.png 1422×1386 기준 퍼센트가 실제 버튼 위치와 정확히 일치하는지 — 브라우저 viewer로 조정 필요
- **애니 부드러움 60fps**: Chrome Performance 탭 측정 필요
- **PDF 품질·크기**: CI가 PDF 생성 시도, 실제 파일 크기·폰트 렌더 품질 확인 필요
- **다크 모드 대비**: prefers-color-scheme dark 상태에서 모든 페이지 확인 필요

### 🟡 이 세션에서 미구현 (후속 작업)

- **UI Reference 개별 페이지** (Serial/TCP/UDP·02-settings 상세 3종·03-transfer 상세 6종·04-editor 상세 5종·05-advanced 상세 4종·나머지 01-communication 3종): 현재 stub. 플랜상 R4에 포함되나 이번 세션에선 index + 일부만 작성
- **File Formats 6종**: 전부 stub 상태
- **Troubleshooting 02~05**: 전부 stub (01만 완성)
- **Getting Started install·overview**: stub
- **Preact 투어 앱 세부 마감**:
  - 투어 스텝 간 crossfade 애니 (현재 즉시 전환)
  - 하이라이트 박스(step.hotspot.box) 시각 렌더링
  - 핫스팟 파동 효과의 reduced-motion 세부 처리
  - 모바일 Prev/Next 스와이프 제스처 (현재 버튼만)
- **Before/After 섹션 인터랙션**: 스크러버 드래그 또는 crossfade 미구현 (현재 정적 2열 배치)
- **Hero 카피 후보 A~C 선택 UI**: (D)로 고정

## 플랜 v3.1 검수 기준 대비

| 기준 | 상태 | 비고 |
|------|-----|------|
| 랜딩이 apple.com/iphone과 "같은 카테고리"로 보이나 | ? | 사용자 블라인드 테스트 필요 |
| 60fps 유지 | ? | 측정 필요 |
| 타이포 hierarchy linear.app 수준 | ? | 디자인 리뷰 필요 |
| 핫스팟→popover→딥링크 figma.com 수준 명료성 | ✅ 구현 | 핫스팟 pulse + popover backdrop blur + "자세히" CTA |
| 다크/라이트 섹션 전환 자연스러움 | ? | 색 토큰은 세팅됐고 Hero 다크 + WhatsNew light 구성 — 실제 렌더 확인 필요 |
| 접근성 Lighthouse ≥ 95 | ? | 측정 필요 |
| 모바일 터치 타겟 ≥ 44px | ✅ 구현 (Hotspot 44×44) | 실측 필요 |
| `prefers-reduced-motion` 존중 | ✅ 구현 | motion wrapper + tokens CSS |
| 키보드만으로 완주 | ? | 구현은 됨(Prev/Next 버튼 + 화살표 키), 실 테스트 필요 |
| /tour/accessible 같은 데이터에서 텍스트 렌더 | ✅ 구현 | AccessibleView |

## 사용자 후속 액션 권장

1. **`https://dabitone.dabitsol.com/tour/` 브라우저 열어서 확인**
   - Hero 카피·애니 인상 확인 (D안이 맞나)
   - Before/After 섹션 스크롤 reveal
   - 핫스팟 좌표 정확도 (사이드바 버튼 위에 파란 점이 정확히 올라가는지)
   - Popover 클릭 → "투어 시작" 이동
   - 투어 01 완주 (4 스텝)
2. **Lighthouse 측정** (Chrome DevTools → Lighthouse) 수치 공유
3. **PDF 다운로드 확인** — CI가 PDF 생성에 성공했는지, 파일 크기·렌더 품질
4. **핫스팟 좌표 조정 요청** (필요 시) — 현재 추정치 x=8, y=19/23/27/31/35 등
5. **남은 stub 페이지** 중 우선순위 높은 것 지정 (다음 세션 진입)

## 의사 결정 기록

### 투어에서 생략한 항목 (MVP)

- Lenis smooth scroll (codex 권고)
- GSAP ScrollTrigger (codex 권고)
- word-by-word stagger reveal (디자인 ref Out 태그)
- section lock/scroll jack (디자인 ref Out)
- magnetic cursor (디자인 ref Out)

### 기본값 (사용자 바꿀 수 있음)

- Hero 카피: (D) "6년 만의 리프레시. 당신이 알던 기능은 그대로, 손끝 감각은 전부 새로."
- PDF 챕터명: "UI 레퍼런스편" + "운영·문제해결편"
- 핫스팟 좌표 추정치
- Before/After 3쌍 (통신·편집기·전송)

## 파일 목록 (이 세션에서 만든/수정한 핵심)

```
docs/plans/2026-04-21-dabitone-manual-plan-v3.md   (v3.1로 업데이트)
docs/decisions/
  006-tour-app-integration.md    (ADR-006 Custom emitter)
  007-pdf-pipeline-audit.md      (ADR-007 PDF audit)
  008-route-contract.md          (ADR-008 one-router URL 규약)
  009-r7-qa-audit.md             (이 문서)
quartz/plugins/emitters/tour.tsx
scripts/build-tour.mjs
scripts/build-pdf.mjs
tour/src/{App,index}.tsx + components/ + lib/ + pages/ + styles/
tour/data/landing.ts + quickstart/{01~08,index}.ts
.github/workflows/deploy.yml (build:tour + build:pdf 스텝 추가)
content/index.md (리라이트)
content/ui-reference/{index, 01~05/index, 01-communication/{serial,tcp,udp}}.md
content/troubleshooting/01-connection.md
content/blog/2026-04-21-v1-1-0.md
```

## 총 커밋 수 (이 세션)

`main` 브랜치에 약 13개 커밋 추가 (plan v3.1 + R0~R7 구현).
