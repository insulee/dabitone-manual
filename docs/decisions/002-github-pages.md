---
title: ADR-002 GitHub Pages + GitHub Actions + Cafe24 DNS 채택
tags: [adr, deploy, github-pages, github-actions]
status: accepted
supersedes: 001-deploy-mode.md
last_updated: 2026-04-21
---

# ADR-002 GitHub Pages + GitHub Actions + Cafe24 DNS 채택

## 상태

**Accepted** — 2026-04-21 (supersedes [[001-deploy-mode|ADR-001]])

## 컨텍스트

DabitOne 매뉴얼 사이트(`dabitone.dabitsol.com`)의 호스팅 방식 결정. [[001-deploy-mode|ADR-001]]은 "docs.dabitsol.com이 Cloudflare Pages를 쓴다"는 전제로 Cloudflare Pages Direct Upload를 채택했으나, 실제 조사에서 그 전제가 틀렸음을 확인:

### 재조사 결과 (2026-04-21)

| 항목 | 값 | 증거 |
|------|----|------|
| docs 호스팅 | **GitHub Pages + Fastly CDN** | HTTP `Server: GitHub.com`, `X-GitHub-Request-Id`, `X-Fastly-Request-ID` |
| docs 소스 | **`insulee/dabitdocs` GitHub 리포** | `git remote -v` |
| docs 배포 workflow | `.github/workflows/deploy.yml`에 `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` | workflow 파일 |
| custom domain | `content/CNAME` → CI가 `public/CNAME`으로 복사 | deploy.yml의 `cp content/CNAME public/CNAME` 단계 |
| dabitsol.com DNS | **Cafe24 nameserver** (`ns1.cafe24.com`, `ns2.cafe24.com`) | `nslookup -type=NS dabitsol.com` |
| Cloudflare 관여 | **없음** | Cloudflare 계정·대시보드에 dabitsol.com 관련 프로젝트 기록 없음 |

이 발견으로 "docs와 동일 스택 재사용" 가치를 되살리려면 **Cloudflare Pages가 아니라 GitHub Pages**를 써야 한다.

## 결정

**DabitOne 매뉴얼 사이트도 docs.dabitsol.com과 동일하게 GitHub Pages + GitHub Actions + Cafe24 DNS로 배포한다.**

### 구체 스택

| 요소 | 값 |
|------|-----|
| 저장소 | **신규 GitHub 리포 `insulee/dabitone-manual`** (Gitea `dabitche`에서 분리) |
| 빌드 CI | GitHub Actions (`.github/workflows/deploy.yml`) |
| Pages 모드 | Source: **GitHub Actions** (branch 모드가 아님) |
| custom domain | `content/CNAME` = `dabitone.dabitsol.com` |
| DNS | **Cafe24 관리 페이지**에서 `dabitone` → `insulee.github.io` CNAME 추가 |

### 배포 흐름

```
Obsidian 편집/저장
  ↓
git commit + push (main 브랜치)
  ↓
.github/workflows/deploy.yml 트리거
  ↓
npm ci → npx quartz build → public/
  ↓
cp content/CNAME public/CNAME  (custom domain 지정)
  ↓
actions/upload-pages-artifact@v3
  ↓
actions/deploy-pages@v4
  ↓
https://dabitone.dabitsol.com
```

## 결과

### 이점

- **docs.dabitsol.com과 완전 동일 스택** — 팀 운영 경험 100% 재사용, 설정·트러블슈팅 패턴 공유
- **Cloudflare 계정·2FA 복구 불필요** — docs 운영과 동일한 GitHub 계정(`insulee`)만 있으면 됨
- **GitHub Actions 무료 사용량으로 충분** — Public 리포는 CI 무제한, Private도 월 2000분 무료
- **CDN(Fastly) 자동 포함** — 별도 설정 없이 전 세계 엣지 캐싱
- **HTTPS 자동 제공** — custom domain 검증 후 Let's Encrypt 인증서 자동

### 제약·트레이드오프

- **모노레포 `dabitche`에서 매뉴얼 소스 분리 필요** — GitHub Pages는 GitHub 리포 CI만 배포 가능. Gitea 리포에 있는 상태로는 배포 불가.
- **AI 작업 시 두 리포(DabitChe.Desktop이 있는 Gitea + 매뉴얼 GitHub) 동시 접근 필요** — Claude Code `additionalDirectories` 설정 또는 세션별 working dir 분리로 해결.
- **Private 리포는 GitHub Pages Free 플랜 사용 불가** — Pages 기능은 무료인데 Private 리포 + Pages 조합은 GitHub Pro/Team 필요. 매뉴얼은 공개 정보라 **Public 리포 권장**.
- **Gitea Actions는 CI에서 제외** — 매뉴얼 관련 CI는 GitHub Actions로만.

### 저장소 분리 구체안

| 파일·폴더 | Gitea `dabitche` (유지) | GitHub `dabitone-manual` (신규) |
|-----------|-------------------------|--------------------------------|
| `docs/plans/2026-04-21-dabitone-manual-*.md` | ✅ (작업 이력 보존) | ❌ |
| `CLAUDE.md`의 Worktree 규칙 | ✅ (team-wide) | ❌ |
| `manual/.gitignore`, `README.md`, `.node-version` | → 이전 | ✅ |
| `manual/content/*` | → 이전 | ✅ |
| `manual/quartz.config.ts`, `quartz.layout.ts`, `quartz/`, `package.json` 등 Quartz 자산 | → 이전 | ✅ |
| `manual/docs/decisions/*` ADR들 | → 이전 | ✅ |
| `manual/scripts/auto-deploy.ps1`, `deploy.sh` | → 이전(경로 수정) | ✅ |
| `.github/workflows/deploy.yml` | ❌ | ✅ (신규) |
| `content/CNAME` | ❌ | ✅ (신규) |

이전 완료 후 Gitea `feature/dabitone-manual` 브랜치의 `manual/` 서브디렉토리는 제거하고, `docs/plans/`의 링크만 신규 GitHub 리포로 업데이트한다.

## 대안 재평가 (ADR-002 시점)

### 대안 1: Cloudflare Pages (ADR-001 기존 결정)

**기각**: docs와 스택 불일치, 별도 Cloudflare 계정 관리 부담, 2FA 복구 비용. ADR-001의 유일한 근거였던 "docs 스택 재사용"이 사실 확인 결과 성립 안 함.

### 대안 2: Gitea 유지 + GitHub mirror push

Gitea `dabitche`에 매뉴얼 서브디렉토리 유지 + Gitea Actions가 자동으로 GitHub에 subtree push → GitHub Actions가 Pages 배포.

**기각**: subtree split 자동화 복잡, mirror 실패·충돌 시 원인 파악 어려움, 두 리포 커밋 이력이 dangling. 일부 가치(모노레포 유지) 있으나 운영 복잡도가 더 큼.

### 대안 3: Gitea Actions가 빌드 → GitHub API로 `gh-pages` 브랜치 push

Gitea Actions가 `npx quartz build` → public/ 산출물을 GitHub 빈 리포의 `gh-pages` 브랜치에 push → GitHub Pages가 `gh-pages` 브랜치 배포.

**기각**: GitHub에 소스 없이 배포 파일만 올라가 코드 리뷰·issue·PR 기능 미활용. 대안 2와 유사한 이원화 문제.

### 대안 4: Netlify / Vercel

GitHub 리포 연결 후 자동 빌드·배포. 기능적으로 GitHub Pages와 유사.

**기각**: 팀 스택 통일성(docs와 동일 GitHub Pages)이 가장 크고, Netlify/Vercel은 별도 계정·비용·빌드 시간 관리가 추가됨.

## 참고

- GitHub Pages 공식: https://docs.github.com/en/pages
- GitHub Actions `deploy-pages`: https://github.com/actions/deploy-pages
- docs.dabitsol.com workflow 레퍼런스: `insulee/dabitdocs` 리포 `.github/workflows/deploy.yml`
- Quartz hosting 가이드: https://quartz.jzhao.xyz/hosting

## 관련

- 폐기된 결정: [[001-deploy-mode|ADR-001]]
- 상위 설계: `../../../../docs/plans/2026-04-21-dabitone-manual-design.md`
- 구현 계획: `../../../../docs/plans/2026-04-21-dabitone-manual-plan.md` (Phase 2 GitHub Pages로 재작성)
