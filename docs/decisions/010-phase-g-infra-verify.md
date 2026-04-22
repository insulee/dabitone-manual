# ADR-010: Phase G-4 인프라 검증 리포트

**일자**: 2026-04-22
**범위**: Phase G Task 6 (PDF·검색·Sitemap)
**검증 방식**: 로컬 빌드 + 정적 서버 + 자동 스크립트

## 요약

| 항목 | 상태 | 수치 |
|---|---|---|
| PDF Reference | ✅ | 12.19 MB, 40 페이지 |
| PDF Operation | ✅ | 2.82 MB, 8 페이지 |
| Sitemap (`/sitemap.xml`) | ✅ | 52 `<loc>` URL |
| Search Index (`/static/contentIndex.json`) | ✅ | 128 KB |
| Link check (`npm run verify:links`) | ✅ | 60 pages · 3044 links · 0 broken |

## 세부

### PDF (build:pdf)

`scripts/build-pdf.mjs` (Playwright + pdf-lib) 로컬 실행 결과:
- `public/pdf/DabitOne_Manual_Reference.pdf` — 12.19 MB, 40 페이지
- `public/pdf/DabitOne_Manual_Operation.pdf` — 2.82 MB, 8 페이지
- 경고·에러 없음

**참조**: `content/index.md`, `tour Landing`, `AccessibleView`에서 PDF 링크 하드코딩 — 모두 도달 확인.

### Sitemap

`public/sitemap.xml`에 52 URL. 49 md + Tour emitter가 추가 발행한 redirect stub 및 accessible 등 포함.

### Search Index

Quartz `ContentIndex` 플러그인이 자동 생성하는 `/static/contentIndex.json`. 128KB. 검색 가능 문서 인덱싱 완료. (수동 쿼리 검증은 UI에서 별도 진행 가능)

### Link Check (codex P1/P2 반영 버전)

`scripts/verify-links.mjs`:
- Tour hydration wait (`.tour-tabs__list`, `.tour-scenario__rail`)
- `?s=0..7` 스텝 순회
- PDF·Asset은 HEAD 요청으로 status 체크

결과: 60 pages visited, 3044 links collected (61 unique targets), **0 broken**.

## 주의사항

- `npm run build` 만 실행 시 PDF 재생성 안 됨 — `build:pdf`는 별도
- 로컬 완전 검증 시: `npm run build:all` (build + build:pdf 포함)
- CI `deploy.yml`은 build:pdf 포함해 실행하되 `continue-on-error` — 운영 환경은 PDF 실패해도 사이트 배포

## DoD 충족

- [x] PDF 2권 다운 정상
- [x] Quartz 검색 인덱스 존재
- [x] Sitemap 생성 + 50+ URL
- [x] verify-links 0 broken (PDF 포함 전체 링크 도달)

## 후속

- Phase G-5 (Getting Started 심화) · G-6 (Reference 스크린샷 크롭) 진행
- 최종 Task 11 종합 Done 선언 시 `build:all` 재실행 + verify:links 재검증
