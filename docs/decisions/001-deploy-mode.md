---
title: ADR-001 Cloudflare Pages Direct Upload 배포 모드 채택 (SUPERSEDED)
tags: [adr, deploy, cloudflare, wrangler, superseded]
status: superseded
superseded_by: 002-github-pages.md
last_updated: 2026-04-21
---

# ADR-001 Cloudflare Pages Direct Upload 배포 모드 채택 (SUPERSEDED)

> [!warning] **이 결정은 2026-04-21에 [[002-github-pages|ADR-002]]로 대체되었습니다.**
> docs.dabitsol.com의 실제 호스팅을 재조사한 결과 Cloudflare Pages가 아니라 **GitHub Pages**였습니다 (HTTP `Server: GitHub.com` 헤더, origin `insulee/dabitdocs` GitHub 리포 확인). 따라서 "docs와 동일 스택 재사용" 전제가 깨지면서 이 결정은 폐기되고, GitHub Pages 채택으로 전환했습니다.
>
> 아래 본문은 의사결정 과정의 역사 보존용으로 남깁니다.

## 상태

**Superseded by [[002-github-pages|ADR-002]]** — 2026-04-21

## 컨텍스트

DabitOne 사용자 매뉴얼 사이트(`dabitone.dabitsol.com`)는 Quartz SSG 빌드 산출물을 Cloudflare Pages에 배포한다. 저장소는 **Gitea**(`D:\Gitea\dabitche`)다.

Cloudflare Pages가 지원하는 배포 방식은 두 가지다.

| 방식 | 설명 | Gitea 호환 |
|------|------|-----------|
| **Git integration** | Cloudflare가 GitHub/GitLab/Bitbucket 저장소를 감시해 자동 빌드·배포 | ❌ **Gitea 지원 안 함** |
| **Direct Upload** | 외부 CI가 빌드한 정적 파일을 Wrangler CLI(또는 API)로 업로드 | ✅ Cloudflare API Token만으로 동작 |

팀의 소스 호스팅이 Gitea에 고정되어 있어 Git integration 선택지는 사실상 불가능하다.

## 결정

**Cloudflare Pages Direct Upload 방식으로 배포 파이프라인을 구성한다.**

- Gitea Actions가 `manual/` 변경을 감지해 Quartz 빌드 + Playwright PDF 생성 수행
- 빌드 산출물(`manual/public/`)을 `npx wrangler pages deploy`로 Cloudflare Pages에 업로드
- `--branch main` 파라미터로 production 배포, 다른 브랜치는 preview 배포
- 인증: Gitea Secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`

## 결과

### 이점

- Gitea·Cloudflare 두 서비스를 그대로 유지하면서 배포 자동화 확보
- CI가 어디서 돌든(Gitea Actions 러너, 로컬 PC 등) 동일 명령으로 배포 가능
- PDF 생성 같은 커스텀 파이프라인을 자유롭게 삽입할 수 있음 (Git integration은 빌드 단계가 제약적)
- Cloudflare 측 빌드 시간 한도·메모리 제약에서 자유

### 제약 (중요)

- **Direct Upload로 만든 Cloudflare Pages 프로젝트는 추후 Git integration으로 전환 불가.** 만약 저장소를 GitHub로 이관하고 Git integration을 쓰려면 신규 Pages 프로젝트를 만들고 커스텀 도메인을 재연결해야 한다. (공식 문서: https://developers.cloudflare.com/pages/get-started/direct-upload/)
- Cloudflare 대시보드의 "Git Builds" 관련 UI·기능(자동 preview, PR 코멘트 등)은 사용 불가
- 빌드 로그는 Gitea Actions 쪽에만 남음. Cloudflare Deployments 탭에는 "Direct Upload" 표시만

### 운영 영향

- Gitea Actions 러너가 down되면 배포 불가 — 러너 가용성 모니터링 필요
- 로컬 수동 배포 절차(`scripts/deploy-cf.ps1`)를 백업 경로로 유지
- API Token 만료·권한 변경 시 Gitea Secret 갱신 필요 (토큰 갱신 주기 팀 내 약속)

## 대안

### 대안 1: Gitea → GitHub mirror push + Cloudflare Git integration

Gitea `push_mirror` 기능으로 GitHub에 자동 미러링 후, GitHub 저장소를 Cloudflare Pages Git integration에 연결.

- **기각 이유**: 저장소 이원화(Gitea 원본 + GitHub 거울)는 권한·이슈·PR 관리가 복잡해지고, 팀 워크플로우(Gitea 중심)와 괴리. 미러 실패·충돌 시 원인 파악 어려움.

### 대안 2: 자체 호스팅 (Nginx/Caddy)

`manual/public/` 산출물을 자체 VPS에 rsync로 올려 Nginx/Caddy가 서빙.

- **기각 이유**: HTTPS 인증서·CDN·WAF·DDoS 보호를 직접 구축해야 함. 현 팀 규모에서 운영 부담 큼. `docs.dabitsol.com`이 이미 Cloudflare Pages를 쓰고 있어 스택 일관성이 우선.

### 대안 3: Netlify CLI (Direct Upload 형태)

Netlify도 `netlify deploy`로 Direct Upload 지원. Cloudflare Pages와 기능적으로 비슷.

- **기각 이유**: `docs.dabitsol.com`이 Cloudflare Pages에 있어 도메인(`dabitsol.com`) DNS 관리가 이미 Cloudflare. 같은 플랫폼을 쓰는 게 DNS 관리·인증서 연동 측면에서 단순. Netlify를 쓰면 DNS 위임 또는 CNAME flattening 이슈 가능.

### 대안 4: GitHub Pages + Gitea → GitHub 미러

GitHub Pages는 무료·안정적이지만 Netlify·Cloudflare보다 기능이 제한적.

- **기각 이유**: 대안 1과 같은 저장소 이원화 문제. 게다가 GitHub Pages는 PDF 같은 대용량 asset 호스팅에 제약(저장소당 1GB 권장, 파일당 100MB 제한)이 있어 PDF 자동 생성과 궁합이 나쁨.

## 참고

- Cloudflare Pages Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Direct Upload + Continuous Integration: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- Wrangler Pages commands: https://developers.cloudflare.com/workers/wrangler/commands/pages/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/

## 관련

- 상위 설계: [`../../../../docs/plans/2026-04-21-dabitone-manual-design.md`](../../../../docs/plans/2026-04-21-dabitone-manual-design.md)
- 구현 계획: [`../../../../docs/plans/2026-04-21-dabitone-manual-plan.md`](../../../../docs/plans/2026-04-21-dabitone-manual-plan.md) (Phase 0 Task 0.1, Phase 2 Task 2.3~2.5)
