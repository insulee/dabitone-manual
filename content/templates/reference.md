---
title: UI Reference 템플릿
description: "5그룹 사이드바 UI 설명 페이지 공통 구조"
status: template
last_updated: 2026-04-21
---

# UI Reference 페이지 템플릿

> [!note] `ignorePatterns`로 빌드 제외. Phase 6 본문 작성 시 기준.

## 페이지 목적

"이 버튼이 뭐예요?"에 답한다. Quickstart가 작업 흐름이라면 Reference는 UI 카탈로그.

## Frontmatter

```yaml
---
title: [기능명 한국어]
description: "[1줄, 화면 경로 포함]"
last_updated: YYYY-MM-DD
---
```

## 본문 구조

### 1. 경로 표시 (첫 줄)

```markdown
> 경로: **[통신] → dbNet → Search**
```

### 2. 화면 구성 (표 형식 추천)

```markdown
| 요소 | 유형 | 설명 |
|------|------|------|
| `COM 포트` | ComboBox | 사용 가능한 시리얼 포트 목록 |
| `보드레이트` | ComboBox | 기본 115200, 범위 9600~921600 |
| `[연결]` | Button | 선택된 포트로 시리얼 연결 시도 |
```

### 3. 기본 사용 (3~5줄)

최소 사용 흐름 요약. 상세는 Quickstart 링크.

### 4. 주요 옵션

각 옵션의 의미·범위·기본값·주의사항.

### 5. 설정 영속성

```markdown
> [!info] 이 화면의 설정값은 `config.properties`에 저장되어 앱 재시작 후에도 유지됩니다.
```

### 6. 관련

```markdown
- 작업 가이드: [[quickstart/01-first-connection|컨트롤러 최초 연결]]
- 기술 스펙: [docs.dabitsol.com 해당 섹션](...)
- 문제 해결: [[troubleshooting/01-connection|연결이 안 될 때]]
```

## 원칙

- 기능 **목적** 1줄, **UI 위치** 경로, **사용법** 표 형식
- "왜 이 버튼이 있나"가 아니라 "이 버튼이 뭘 하나"
- 모든 컨트롤명은 실제 XAML의 `Content=` 값과 일치 (AI 작성 시 `DabitChe.Desktop/Views/*.xaml` 확인 필수)
