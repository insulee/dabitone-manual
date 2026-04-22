# Phase G — Manual Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** DabitOne 매뉴얼 사이트 production ready — 링크 0 깨짐, 트러블슈팅 ≥ 8, FAQ ≥ 15, PDF·검색·Sitemap 정상, GS 심화, Reference 스크린샷 크롭 ≥ 10.

**Architecture:** 기존 `content/` + `scripts/` + `quartz/` 구조 유지. 신규: `scripts/verify-links.mjs` (link crawler), `scripts/crop-reference-screenshots.mjs` (sharp 기반 크롭), 신규 트러블슈팅 3건, FAQ 확장, GS 심화, Reference 크롭 asset.

**Tech Stack:** Preact/Quartz, Playwright (이미 dep), sharp (이미 dep), Node 22+, codex CLI (리뷰).

**Test strategy:** 이 프로젝트는 markdown 콘텐츠 + 인프라 검증 중심이라 unit TDD 부적합. 각 task 마지막은 **빌드 성공 + 자동 스크립트 결과 + 수동 Read 시각 검증**으로 갈음.

---

## G-1 링크 검증 자율화

### Task 1: `scripts/verify-links.mjs` 작성

**Files:**
- Create: `scripts/verify-links.mjs`
- Modify: `package.json` (npm script)

**Step 1 — 스크립트 작성**

정적 서버(`npm run verify:serve`) 동작 전제. Playwright로 모든 `/tour/` + markdown 페이지 로드 → a[href] 추출 → 내부 링크 HTTP 상태 확인 → 외부 링크 skip → tour `relatedRefs`도 별도 검증.

```js
// scripts/verify-links.mjs
import { chromium } from "playwright"
import { writeFile, mkdir } from "fs/promises"

const BASE = process.env.BASE_URL || "http://localhost:8888"
const OUT = "verify-links"

// 크롤 시작점 (sitemap.xml 우선, 없으면 수동 목록)
const SEEDS = [
  "/",
  "/tour/",
  "/getting-started/",
  "/ui-reference/",
  "/file-formats/",
  "/troubleshooting/",
  "/blog/",
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const visited = new Set()
  const queue = [...SEEDS]
  const broken = []
  const allLinks = []

  while (queue.length) {
    const path = queue.shift()
    if (visited.has(path)) continue
    visited.add(path)
    const url = BASE + path
    let status = 0
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 })
      status = res?.status() ?? 0
    } catch (e) {
      status = -1
    }
    if (status !== 200) {
      broken.push({ from: "seed", to: path, status })
      continue
    }
    // 링크 수집
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))
    for (const h of hrefs) {
      if (!h) continue
      if (h.startsWith("http") && !h.startsWith(BASE)) continue // 외부
      if (h.startsWith("mailto:") || h.startsWith("#")) continue
      // 절대 경로로 정규화
      const abs = new URL(h, url).pathname
      allLinks.push({ from: path, to: abs })
      if (abs.startsWith("/") && !visited.has(abs) && !queue.includes(abs)) {
        queue.push(abs)
      }
    }
  }

  // 내부 링크 상태 일괄 체크
  for (const l of allLinks) {
    if (l.to.startsWith("/pdf/") || l.to.startsWith("/assets/")) continue // 바이너리
    try {
      const res = await page.goto(BASE + l.to, { waitUntil: "domcontentloaded", timeout: 10000 })
      const s = res?.status() ?? 0
      if (s !== 200) broken.push({ ...l, status: s })
    } catch {
      broken.push({ ...l, status: -1 })
    }
  }

  await browser.close()

  await writeFile(`${OUT}/report.json`, JSON.stringify({ visited: [...visited], broken, total: allLinks.length }, null, 2))
  console.log(`=== verify-links 결과 ===`)
  console.log(`방문: ${visited.size} · 링크 수집: ${allLinks.length} · 깨짐: ${broken.length}`)
  if (broken.length) {
    console.log("\n깨진 링크:")
    for (const b of broken) console.log(`  [${b.status}] ${b.from} → ${b.to}`)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

**Step 2 — `package.json` scripts 추가**

기존 `verify:serve` 밑에:
```json
"verify:links": "node scripts/verify-links.mjs",
```

**Step 3 — 빌드·서버 실행 (이미 떠있으면 skip)**

`npm run build` → `npm run verify:serve` (background)

**Step 4 — 실행**

```bash
node scripts/verify-links.mjs
```
Expected: 방문 N · 깨짐 0 (또는 있으면 리스트 출력 후 exit 1)

**Step 5 — Commit**

```bash
git add scripts/verify-links.mjs package.json
git commit -m "feat(scripts): G-1 verify-links.mjs — 링크 자율 검증 크롤러"
```

### Task 2: 깨진 링크 수정

**Step 1 — 리포트 읽기**

`verify-links/report.json`의 `broken` 배열 확인

**Step 2 — 각 깨진 링크 소스 파일에서 수정 또는 대상 페이지 추가**

**Step 3 — 재실행**
```bash
node scripts/verify-links.mjs
```
Expected: 0 broken

**Step 4 — Commit**
```bash
git add content/ tour/data/quickstart/
git commit -m "fix: G-1 깨진 링크 수정 (N개)"
```

---

## G-2 트러블슈팅 확장

### Task 3: 신규 3건 작성

**Files:**
- Create: `content/troubleshooting/06-color-mismatch.md`
- Create: `content/troubleshooting/07-partial-display.md`
- Create: `content/troubleshooting/08-sync-failure.md`

**Step 1 — 각 파일 작성** (구조: 프론트매터 + 증상 + 원인 후보 + 해결 절차 + 관련 참조)

템플릿:
```markdown
---
title: 색 반전·RGB 순서 문제
description: 전광판 색상이 의도와 달리 뒤집혀 보일 때
date: 2026-04-22
tags:
  - troubleshooting
  - 색상
---

## 증상
...

## 원인
...

## 해결 절차
1. ...
2. ...

## 관련
- [Color Order 설정](/ui-reference/02-settings/screen-size)
- [표출신호 포맷](/ui-reference/02-settings/display-signal)
```

**Step 2 — 빌드 확인**
```bash
npm run build
```
Expected: 49 → 52 files

**Step 3 — Commit**
```bash
git add content/troubleshooting/06-color-mismatch.md content/troubleshooting/07-partial-display.md content/troubleshooting/08-sync-failure.md
git commit -m "feat(content): G-2 트러블슈팅 3건 신규 (색반전·부분표출·동기화)"
```

### Task 4: 기존 5건 구조 보강

**Files:**
- Modify: `content/troubleshooting/01-connection.md` ~ `05-faq.md` (05는 FAQ라 G-3에서)
- 실제로 01~04만 보강

**Step 1 — 각 파일에 "증상 → 원인 → 해결 → 관련" 섹션 통일**
**Step 2 — 빌드 확인**
**Step 3 — Commit**
```bash
git commit -m "docs(content): G-2 트러블슈팅 01~04 구조 보강"
```

---

## G-3 FAQ 보강

### Task 5: `05-faq.md` 카테고리별 15문항

**Files:** Modify `content/troubleshooting/05-faq.md`

**Step 1 — 구조**

```markdown
## 설치
### Q: ...
A: ...
(3문항)

## 연결
(3문항)

## 편집
(3문항)

## 전송
(3문항)

## 펌웨어
(3문항)
```

**Step 2 — Commit**
```bash
git commit -m "feat(content): G-3 FAQ 카테고리별 15문항 확장"
```

---

## G-4 PDF·검색·Sitemap 검증

### Task 6: PDF 빌드·검색·sitemap 동작 확인

**Files:** None (검증 + 리포트)

**Step 1 — 로컬 PDF 빌드**
```bash
npm run build:pdf
```
Expected: `public/pdf/DabitOne_Manual_Reference.pdf`, `public/pdf/DabitOne_Manual_Operation.pdf` 생성 + pdf-lib 경고 없음

**Step 2 — PDF 파일 크기·페이지 수 확인**
```bash
ls -la D:/GitHub/dabitone-manual/public/pdf/
```

**Step 3 — Quartz 검색 동작**

`npm run verify:serve` → Playwright 스크립트 또는 수동: 검색 쿼리 "통신", "편집", "펌웨어" 각 hit 존재

**Step 4 — Sitemap 확인**

`curl http://localhost:8888/sitemap.xml` → 49+ URL 포함

**Step 5 — 결과 리포트**

`docs/decisions/010-phase-g-infra-verify.md` 작성: PDF 크기, 검색 hit 수, sitemap URL 수.

**Step 6 — Commit**
```bash
git add docs/decisions/010-phase-g-infra-verify.md
git commit -m "docs: G-4 PDF·검색·sitemap 검증 리포트"
```

---

## G-5 Getting Started 심화

### Task 7: `install.md` 확장

**Files:** Modify `content/getting-started/install.md`

**Step 1 — 구조** (현 65줄 → 150+줄)
1. 시스템 요구사항 (Windows 10+, .NET 등)
2. 설치 파일 다운로드 경로
3. 설치 마법사 단계별 (스크린샷 1~2장)
4. 최초 실행 화면
5. 설정 저장 위치
6. 제거 방법
7. 자주 겪는 설치 오류 + 해결

**Step 2 — 빌드·Commit**
```bash
git commit -m "docs(content): G-5 install.md 심화 (150+줄, 설치 스토리형)"
```

### Task 8: `overview.md` 확장

**Files:** Modify `content/getting-started/overview.md`

**Step 1 — 구조** (현 103줄 → 150+줄)
1. DabitOne이 뭐하는 도구인지 (1 줄 + 다이어그램)
2. 5개 탭의 역할
3. 대표 워크플로우 (컨트롤러 연결 → 화면 크기 → 편집 → 전송)
4. 첫 사용자가 일반적으로 따라갈 순서
5. 용어 정의 (모듈·BPP·Scan 등)
6. 다음 단계 (투어 01 연결)

**Step 2 — Commit**
```bash
git commit -m "docs(content): G-5 overview.md 심화 (150+줄, 워크플로우)"
```

---

## G-6 Reference 스크린샷 크롭

### Task 9: `scripts/crop-reference-screenshots.mjs` 작성

**Files:**
- Create: `scripts/crop-reference-screenshots.mjs`
- Modify: `package.json`

**Step 1 — 스크립트**

```js
// scripts/crop-reference-screenshots.mjs
import sharp from "sharp"
import { mkdir } from "fs/promises"
import { join } from "path"

const SRC = "content/assets/screens/manual-poc"
const OUT = "content/assets/screens/reference"

// 크롭 정의: 각 reference 페이지별 (source, x, y, w, h in px, 1422x1386 기준)
const CROPS = [
  { out: "comm-serial.png", src: "main-comm.png", x: 130, y: 130, w: 340, h: 260 },
  { out: "comm-tcp-client.png", src: "main-comm.png", x: 130, y: 410, w: 340, h: 200 },
  { out: "comm-tcp-server.png", src: "main-comm.png", x: 130, y: 635, w: 340, h: 135 },
  { out: "comm-udp.png", src: "main-comm.png", x: 130, y: 790, w: 340, h: 145 },
  { out: "comm-dbnet.png", src: "main-comm.png", x: 475, y: 130, w: 460, h: 900 },
  { out: "settings-screen-size.png", src: "main-setup.png", x: 130, y: 120, w: 620, h: 180 },
  { out: "settings-display-signal.png", src: "main-setup.png", x: 130, y: 300, w: 620, h: 760 },
  { out: "settings-font.png", src: "main-setup.png", x: 790, y: 100, w: 600, h: 900 },
  { out: "transfer-message.png", src: "main-simulator.png", x: 130, y: 130, w: 870, h: 900 },
  { out: "transfer-brightness.png", src: "main-simulator.png", x: 1030, y: 290, w: 360, h: 180 },
  { out: "transfer-power.png", src: "main-simulator.png", x: 1030, y: 420, w: 360, h: 140 },
  { out: "transfer-background.png", src: "main-simulator.png", x: 1030, y: 540, w: 360, h: 130 },
  { out: "advanced-time.png", src: "main-advanced.png", x: 130, y: 130, w: 390, h: 140 },
  { out: "advanced-board.png", src: "main-advanced.png", x: 130, y: 290, w: 390, h: 480 },
  { out: "advanced-firmware.png", src: "main-advanced.png", x: 560, y: 130, w: 730, h: 570 },
  { out: "advanced-buttons.png", src: "main-advanced.png", x: 1300, y: 130, w: 110, h: 620 },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const c of CROPS) {
    const srcPath = join(SRC, c.src)
    const outPath = join(OUT, c.out)
    await sharp(srcPath)
      .extract({ left: c.x, top: c.y, width: c.w, height: c.h })
      .toFile(outPath)
    console.log(`✓ ${c.out}`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
```

**Step 2 — `package.json`**
```json
"crop:reference": "node scripts/crop-reference-screenshots.mjs",
```

**Step 3 — 실행**
```bash
node scripts/crop-reference-screenshots.mjs
```
Expected: `content/assets/screens/reference/` 하위 16개 PNG

**Step 4 — Commit**
```bash
git add scripts/crop-reference-screenshots.mjs package.json content/assets/screens/reference/
git commit -m "feat(scripts): G-6 reference 스크린샷 크롭 자동화 (sharp, 16 crop)"
```

### Task 10: Reference md에 이미지 embed

**Files:** Modify `content/ui-reference/**/*.md` (16개 대상)

**Step 1 — 각 md 상단 또는 해당 섹션 앞에:**

```markdown
![통신 · Serial 설정](/assets/screens/reference/comm-serial.png)
```

**Step 2 — 빌드·Commit**
```bash
git commit -m "docs(content): G-6 reference md 16 페이지에 UI 크롭 이미지 embed"
```

---

## Task 11: 최종 빌드·배포·DoD 체크

**Step 1 — 전체 빌드**
```bash
npm run build
```

**Step 2 — verify:links 재실행**
```bash
node scripts/verify-links.mjs
```
Expected: 0 broken

**Step 3 — 최종 commit & push**
```bash
git push origin main
```

**Step 4 — DoD 체크** (design doc 마지막 checklist 확인 + 결과를 `docs/decisions/011-phase-g-done.md`에 기록)

**Step 5 — 종합 commit**
```bash
git add docs/decisions/011-phase-g-done.md
git commit -m "docs: Phase G Done 선언 — 매뉴얼 production ready"
git push origin main
```

---

## 실행 우선순위 & Dependencies

- Task 1 → 2 (검증 → 수정)
- Task 3 → 4 (신규 → 구조 보강)
- 5, 6, 7·8, 9·10 독립
- 11은 마지막

순차 실행 기본 (Q2=1 합의). 각 Phase 끝 commit+push.

## 후속 스킬 선택

- 본 세션에서 직접 실행 (Phase A~F 패턴 일관)
- 또는 `superpowers:subagent-driven-development`로 각 task subagent 분담 + 리뷰

**단, 먼저 codex 리뷰부터.**
