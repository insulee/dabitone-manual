# DabitOne 매뉴얼 사이트

**URL**: https://dabitone.dabitsol.com
**소스**: 이 디렉토리는 Quartz SSG 기반 사이트의 루트입니다.
**브랜치**: `feature/dabitone-manual` (main merge 전까지 preview만)

## 팀 편집 흐름

1. Obsidian으로 `content/` 폴더를 Vault로 열어서 Markdown 편집
2. 저장 시 `scripts/auto-deploy.ps1`이 변경을 감지해 자동으로 `git push` → Cloudflare Pages가 재배포
3. 몇 분 내에 `https://dabitone.dabitsol.com`에 반영

## 로컬 빌드·미리보기

```powershell
cd D:\Gitea\dabitone-manual\manual
npm ci
npx quartz build --serve
# → http://localhost:8080
```

## 스크립트

| 파일 | 역할 |
|------|------|
| `scripts/auto-deploy.ps1` | content 변경 감지 → deploy.sh 호출 |
| `scripts/deploy.sh` | quartz build + git push |
| `scripts/deploy-cf.ps1` | 수동 Cloudflare Pages 배포 (Wrangler) |
| `scripts/capture-screens.ps1` | DabitOne WPF 자동 스크린샷 캡처 |
| `scripts/build-pdf.mjs` | Playwright로 챕터별 PDF 자동 생성 |

## 결정 기록

- [ADR-001 Cloudflare Pages Direct Upload](docs/decisions/001-deploy-mode.md)

## 관련 문서

- [설계](../docs/plans/2026-04-21-dabitone-manual-design.md)
- [구현 계획 v2](../docs/plans/2026-04-21-dabitone-manual-plan.md)
- [CLAUDE.md — 멀티세션 / Worktree 운영 규칙](../CLAUDE.md)
