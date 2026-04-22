---
title: File Format 템플릿
description: "파일 포맷 레퍼런스 페이지 구조"
status: template
last_updated: 2026-04-21
---

# File Format 페이지 템플릿

> [!note] `ignorePatterns`로 빌드 제외. Phase 6 본문 작성 시 기준.

## 페이지 목적

"이 파일이 뭐예요?" "어디서 만들어지나요?" "어디에 저장되나요?"에 답. **사용자 관점**이지 바이트 레벨 스펙 아님 (스펙은 docs.dabitsol.com 기술 문서 링크).

## Frontmatter

```yaml
---
title: [포맷명, 예: DAT]
description: "[1줄, 용도 요약]"
last_updated: YYYY-MM-DD
---
```

## 본문 구조

### 1. 한 줄 요약

```markdown
> **DAT** — 전광판에 표시되는 **한 장면**(텍스트 또는 이미지)의 바이너리 파일
```

### 2. 어디서 만들어지나

```markdown
| 편집 화면 | 결과물 |
|----------|--------|
| 텍스트 편집 | `.DAT` (텍스트 렌더링 결과) |
| 이미지 편집 | `.DAT` (비트맵) |
```

### 3. 어디에 저장되나

기본 저장 경로 + 프로젝트별 구조 권장.

```markdown
기본: `C:\Users\[사용자]\Documents\DabitOne\Data\`
프로젝트별 구조 권장: `Data\[프로젝트명]\메시지.DAT`
```

### 4. 용량·제약

- 최대 크기
- 컨트롤러 저장 한계
- 분할 조건

### 5. 관련 파일 형식

```markdown
- [ANI](/file-formats/ani) — DAT 여러 개 + 타이밍으로 애니메이션
- [PLA](/file-formats/pla) — DAT/ANI 여러 개 + 스케줄
```

### 6. 기술 상세 (링크만)

```markdown
## 기술 상세 (개발자용)

프로토콜 바이트 스펙은 기술 문서 사이트 참조:
- [DAT 포맷 레퍼런스](https://docs.dabitsol.com/...) 
```

## 원칙

- **사용자 관점**: 바이트 오프셋·헤더 구조 직접 설명 금지 (링크로)
- **실사용 흐름** 중심: 편집 → 저장 → 전송 단계에서 어디에 등장하는지
- **파일 확장자**는 대문자 `.DAT` (레거시 관습 유지)
- DabitOne 내장 기능으로 변환 가능한 다른 포맷과의 관계 명시
