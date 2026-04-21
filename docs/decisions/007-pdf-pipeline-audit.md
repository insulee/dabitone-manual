# ADR-007: PDF Pipeline 현황 Audit (v2→v3 이전 손실 진단)

**일자**: 2026-04-21
**관련 플랜**: `docs/plans/2026-04-21-dabitone-manual-plan-v3.md` Phase R0.5, R5
**근거**: codex 리뷰 finding 9

## 배경

플랜 v3 Phase R5는 "기존 `scripts/build-pdf.mjs` 수정"을 가정했다. codex 리뷰에서 이 파일이 실제로 존재하지 않음을 발견. 해당 파일은 **plan v2**(Gitea `D:\Gitea\dabitche\docs\plans\2026-04-21-dabitone-manual-plan.md`)의 Phase 5 산출물이었으나, **GitHub repo로 이전하는 과정에서 해당 Phase가 실행되기 전에 이전이 발생**하여 현 repo에 없다.

## 현황 점검

### GitHub repo (`D:\GitHub\dabitone-manual\`)

- `scripts/` 디렉토리 존재
  - `auto-deploy.ps1` — 편집 루프·로컬 auto-deploy용 (Phase 1 산출물, OK)
  - `deploy.sh` — Cloudflare Pages 배포 스크립트 (Phase 2 산출물, OK)
  - **`build-pdf.mjs` — 없음**
  - **`poc-pdf.mjs` — 없음** (Phase 0 PoC 산출물도 없음)
- `package.json` devDependencies
  - `serve-handler: ^6.1.6` 설치되어 있음 — PDF 빌드 시 local file server 용 (PoC 과정의 흔적)
  - `playwright` — **없음**
  - `pdf-lib` — **없음**

### Gitea 원본 repo (`D:\Gitea\dabitche\`)

- `manual/scripts/` — 디렉토리 자체 없음. v2 플랜 Phase 0~5가 실제 실행된 적 없음.

### v2 플랜의 의도 (참고)

v2 Phase 5 Task 5.1~5.2의 설계:
- Playwright (Chromium) + `pdf-lib`로 PDF 생성
- `contentIndex.json` 기반 URL 수집
- `emulateMedia({ media: 'screen' })` + `document.fonts.ready` 대기로 폰트·이미지 품질 확보
- 챕터별 3권 분할 (Install / Content / Operation)
- 각 챕터 < 25 MiB (Cloudflare Pages Direct Upload 제한 회피)

## 결론

**R5는 "수정"이 아니라 "신규 작성"**. v2 플랜의 설계는 재사용 가능하지만 실제 코드는 0부터 쓴다.

## 영향 · 조치

| 항목 | 조치 |
|------|------|
| R5 소요 추정 | 0.5일 → **1~1.5일**로 상향 (플랜 v3.1에 반영 완료) |
| 의존성 추가 | `playwright`, `pdf-lib` devDependencies 설치 필요 — R5.1 Step 2 |
| 챕터 구성 | 3권 → **2권** (Reference + Operation) — v3.1이 이미 반영 |
| Quickstart 투어 PDF 제외 | `/tour/*`, `/quickstart/*` 경로 필터 필요 — 코드 레벨 |
| 예상 크기 | Reference 1권 ~10~15 MiB, Operation 1권 ~5~8 MiB (이미지 많음 가정) |

## 결정

1. **R5 진입 시 플랜 v2 Task 5.2의 스크립트 설계 참조하여 신규 작성**
2. **Phase 0의 PoC(`poc-pdf.mjs`)는 생략** — v2 PoC 결과 이미 설계 문서에 반영되어 있으므로 R5에서 바로 `build-pdf.mjs` 작성해도 충분
3. **크기 제약(25 MiB)은 Cloudflare Direct Upload 가정이었음** — 현재 배포가 GitHub Pages이므로 제약 달라짐. 확인:
   - GitHub Pages 단일 파일 제한: **100 MiB** (훨씬 여유)
   - 2권 분할은 **사용자 경험(챕터별 다운로드 편의)** 기준으로 유지
4. **PDF 생성은 optional** — 쇼케이스성 타겟 오디언스는 온라인 투어 중심, PDF는 부가 가치

## 남은 질문 (R5 진입 전 결정 필요)

- [ ] 챕터 이름 확정: "UI 레퍼런스편" + "운영·문제해결편"으로 진행? 또는 더 마케팅 친화적 이름?
- [ ] PDF 표지 페이지 디자인 필요 여부 — 표지 없이 목차부터 시작? 브랜드 표지 1페이지 추가?
- [ ] 헤더·푸터에 페이지 번호·버전 넣기?

이 질문들은 R5 진입 시 사용자에게 확인.
