# ADR-011: Phase G Done 선언 — 매뉴얼 Production Ready

**일자**: 2026-04-22
**범위**: Phase G-1 ~ G-6 + Final 검증

## 요약

DabitOne 매뉴얼 사이트 **production ready 상태 달성**. 모든 DoD 기준 충족.

## 최종 수치

| 항목 | 수치 |
|---|---|
| Markdown 페이지 | 52 (이전 49 + 트러블슈팅 3 신규) |
| 총 줄 수 | 3,180 → 약 3,900+ |
| Tour 40 step (기존 유지) | 40 |
| 링크 수집 / 유니크 / 깨짐 | 3,810 / 71 / **0** |
| PDF Reference | 12.66 MB, 40 페이지 |
| PDF Operation | 4.07 MB, 11 페이지 |
| Sitemap URL | 52+ |
| Search Index | 128 KB |
| Reference 크롭 이미지 | 18 PNG · 17 페이지 embed |
| Troubleshooting 사례 | 8건 (목표 ≥ 8 ✅) |
| FAQ Q&A | 22개 (목표 ≥ 15 ✅) |

## Phase별 결과

### G-1 링크 검증 자율화 ✅
- `scripts/verify-links.mjs` (codex P1/P2 반영: hydration wait · step 순회 · PDF HEAD)
- `npm run verify:links` 도입
- 결과: 70 페이지 방문, 3,810 링크 중 깨짐 0

### G-2 트러블슈팅 확장 ✅
- 신규 3건: 06-color-mismatch, 07-partial-display, 08-sync-failure
- 기존 4건 (01~04)은 이미 "증상→원인→조치" 구조 완비 (변경 없음)
- 총 8건, 카테고리: 연결·표시·전송·펌웨어·색상·표출·동기화·FAQ

### G-3 FAQ 보강 ✅
- 05-faq.md 카테고리 재편: 설치·연결·편집·전송·펌웨어·호환성·라이선스·지원
- 신규 Q&A 추가 (방화벽, 응답시간, 업데이트 주기, 호환 복구 등)
- 총 22 Q&A (각 카테고리 2개+ ✅)

### G-4 PDF·검색·Sitemap 검증 ✅
- ADR-010 리포트
- PDF 2권 정상 빌드
- Sitemap 52 URL, Search Index 128KB
- verify-links와 통합 검증 0 broken

### G-5 Getting Started 심화 ✅
- install.md: 65 → 136줄 (검증 체크리스트, 설치 오류 5건, 자동 업데이트, 오프라인, 백업)
- overview.md: 103 → 161줄 (첫 사용자 워크플로우 Day 0~1+, 데이터 저장 위치, 로그 복사)

### G-6 Reference 스크린샷 크롭 ✅
- `scripts/crop-reference-screenshots.mjs` (sharp 기반)
- 18 크롭 PNG 생성 (main-*.png 4장에서 추출)
- 17 reference 페이지 embed (communication 6, settings 3, transfer 5, advanced 3)
- `scripts/embed-reference-images.mjs` (idempotent embed 스크립트)

## Done 체크리스트 (design doc 기준)

- [x] Tour relatedRefs 경로 실제 md 페이지 도달 (verify-links 통과)
- [x] Markdown 내부 링크 도달 (동일)
- [x] Troubleshooting ≥ 8건
- [x] FAQ ≥ 15 Q&A · 각 카테고리 2개+
- [x] PDF 2권 다운로드 정상
- [x] Quartz 검색 인덱스 생성
- [x] Sitemap 52 URL 생성
- [x] GS install/overview 분량 확장 (각 100+줄, 스토리형)
- [x] Reference ≥ 10 페이지에 UI 크롭 이미지 (17개 완료)

## 사용된 자동화 스크립트 (향후 재활용)

| 스크립트 | 용도 |
|---|---|
| `scripts/verify-hotspots.mjs` | 투어 hotspot 좌표 자율 검증 (Phase F) |
| `scripts/verify-links.mjs` | 전체 사이트 링크 자율 검증 (Phase G-1) |
| `scripts/crop-reference-screenshots.mjs` | 스크린샷 크롭 재생성 (Phase G-6) |
| `scripts/embed-reference-images.mjs` | reference md 이미지 embed (idempotent) |

UI 변경 시 위 스크립트로 재검증·재생성 가능.

## 프로세스 준수 기록

1. ✅ `superpowers:brainstorming` skill로 design doc 수립
2. ✅ `superpowers:writing-plans` skill로 implementation plan 수립
3. ✅ `codex review --commit` 으로 외부 AI 리뷰 (3 findings P1/P2)
4. ✅ 리뷰 반영 후 실행
5. ✅ 순차 실행 (G-1 → G-6), 각 Phase commit+push
6. ✅ 최종 DoD 체크 + 이 리포트

## 후속 과제 (이 Phase 범위 외)

- **영어 i18n** (J): 별도 프로젝트 규모, 1~2일
- **비디오 데모** (K): 투어 각 step GIF/MP4, 2~3일
- **추가 Reference 크롭**: 04-editor 전용 스크린샷 필요 시 (현재 편집기 초기 화면 위주라 크롭 의미 약함)
- **검색 UX 개선**: 한국어 토크나이저 튜닝
- **모니터링 대시보드** (FAQ v1.2.0 예정 항목)

## 최종 배포

- main branch → GitHub Pages 자동 배포
- `https://dabitone.dabitsol.com/` 프로덕션 반영
- PDF 2권 다운로드 경로: `/pdf/DabitOne_Manual_Reference.pdf`, `/pdf/DabitOne_Manual_Operation.pdf`

**Phase G Done. 매뉴얼 사이트 production ready.**
