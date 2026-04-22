# Phase G — Manual Completion Design Doc

**일자**: 2026-04-22
**근거 스킬**: `superpowers:brainstorming` 절차 준용
**사용자 합의**: Q1=A(production ready 전부) · Q2=1(순차 실행)

## Goal

DabitOne 매뉴얼 사이트 **production ready** — 링크 0 깨짐, 본문 풍부(트러블슈팅 ≥ 8 · FAQ ≥ 15), PDF·검색·sitemap 정상, Getting Started 첫 사용자 막힘 없음, Reference 주요 페이지 UI 크롭 삽입.

## 배경

- v3.1 R0~R7 + R4a~R4d 완료 (ADR-009): content/ 49 md stub 제거, tour 40 step, /tour/ Preact 앱, Quartz 통합
- 이 세션 Phase A~F 추가 완료: 랜딩 재설계(Stone Light), hotspot 자율 검증, Tour navigation fix, 스텝 확장(25→40)
- 남은 일: 매뉴얼 본문 및 인프라의 production readiness 검증·보강

## Architecture

| 레이어 | 구성 |
|---|---|
| Content | `content/*.md` 49 files 기본 + 확장 (G-2 트러블슈팅 3, G-3 FAQ 확장, G-5 GS 심화) |
| Automation (신규) | `scripts/verify-links.mjs` — Playwright·link crawler. 기존 `scripts/verify-hotspots.mjs` 유지 |
| Infra | Quartz Sitemap/RSS/Search, CI `build-pdf` (Playwright+pdf-lib), GitHub Pages |
| Assets | `content/assets/screens/manual-poc/*.png` 5장 + `content/assets/screens/reference/*.png` 신규 크롭 |

## Phases · 산출물 · DoD

### G-1 링크 검증 자율화
- **산출물**: `scripts/verify-links.mjs`, `package.json` npm script 추가, 깨진 링크 수정
- **DoD**: `npm run verify:links` 실행 결과 0 broken
- **방법**: Playwright로 모든 페이지 로드 → a[href] 추출 → 내부 링크는 HTTP GET 체크, 외부는 skip. Tour `relatedRefs`도 별도 검증

### G-2 트러블슈팅 확장
- **산출물**: 신규 3건 `06-color-mismatch.md`, `07-partial-display.md`, `08-sync-failure.md` + 기존 5건에 "증상 → 원인 → 해결" 구조 보강
- **DoD**: ≥ 8 사례, 각 구조 일관

### G-3 FAQ 보강
- **산출물**: `content/troubleshooting/05-faq.md` 카테고리별 (설치·연결·편집·전송·펌웨어) 확장
- **DoD**: ≥ 15 Q&A, 각 카테고리 2개 이상

### G-4 PDF·검색·Sitemap 검증
- **산출물**: 검증 리포트 (verify-report.md 또는 이 design doc에 addendum)
- **DoD**:
  - PDF 2권 (Reference / Operation) 다운로드 정상, pdf-lib 경고 없음
  - Quartz 검색 쿼리 "통신" "편집" "펌웨어" 각 hit 존재
  - `/sitemap.xml` 생성 + 49개 URL 포함

### G-5 Getting Started 심화
- **산출물**: `content/getting-started/install.md`, `overview.md` 확장
- **DoD**: 각 ≥ 150줄, 첫 사용자 스토리형 (구매→설치→첫 연결→첫 메시지), 주요 섹션에 스크린샷 1~2장

### G-6 Reference 스크린샷 크롭
- **산출물**: `content/assets/screens/reference/*.png` (main-*.png에서 sharp로 크롭), 해당 md에 ![alt](path) embed
- **DoD**: ≥ 10 reference 페이지에 UI 크롭 이미지 삽입

## 사용 도구
- Playwright (link crawler, 이미 dep에 있음)
- sharp (image crop, 이미 dep에 있음)
- Quartz ContentIndex (search plugin, 이미 구성)
- codex CLI (plan review)

## 위험 · 롤백

| 위험 | 대응 |
|---|---|
| 링크 대량 깨짐 | G-1 먼저 실행해 실제 상황 파악 후 G-2~G-6 범위 재판단 가능 |
| PDF 빌드 실패 | CI `continue-on-error` 설정으로 사이트 배포 무영향. 로컬 `npm run build:pdf`로 재현·수정 |
| Reference 크롭 품질 저하 | sharp로 정밀 영역 좌표 지정, 결과 Read로 자체 검증 loop |
| 시간 초과 | 각 Phase 끝마다 commit+push — 중단 시 다음 세션이 이어받기 쉬움 |

## Testing

- **G-1**: `npm run verify:links` 결과 기반 (0 broken)
- **G-2·G-3**: heading/QA count 점검, 구조 일관성
- **G-4**: PDF 파일 크기·hash 체크 + Quartz 검색 수동 쿼리 + sitemap URL 수
- **G-5**: 렌더 HTML 수동 Read, 분량 체크
- **G-6**: sharp 크롭 결과 PNG Read 시각 검증

## 제외 (이번 범위 아님)
- 영어 i18n (별도 프로젝트 규모)
- 비디오 데모 (별도)
- 투어 스텝 추가 확장 (Phase F-2에서 25→40 완료)

## 성공 기준 (Done 선언 조건)

- [ ] G-1 ~ G-6 각 Phase의 DoD 모두 충족
- [ ] 깨진 링크 0
- [ ] 트러블슈팅 ≥ 8 · FAQ ≥ 15
- [ ] PDF 2권 정상 다운로드
- [ ] Quartz 검색 3개 쿼리 이상 hit
- [ ] sitemap.xml 생성 + 49 URL
- [ ] GS install/overview ≥ 150줄, 스토리형
- [ ] Reference ≥ 10 페이지에 UI 크롭 이미지
- [ ] 최종 commit + push 완료

## 진행 방식 (사용자 합의)

1. 순차 실행 (G-1 → G-6), 병렬·subagent 분담 하지 않음
2. 각 Phase 끝마다 commit + push로 진행 가시화
3. 중간 블로커 발생 시에만 사용자에게 보고
4. 최종 Phase G-6 완료 후 종합 보고 + DoD 체크

## 후속

- `writing-plans` skill로 implementation plan 작성 (task-level 분해)
- plan doc → codex CLI로 리뷰 (`codex review`)
- 리뷰 finding 반영 후 실행 시작
