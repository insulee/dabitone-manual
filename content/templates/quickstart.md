---
title: Quickstart 템플릿
description: "시나리오형 how-to 페이지 공통 구조"
status: template
last_updated: 2026-04-21
---

# Quickstart 페이지 템플릿

> [!note] 이 문서는 `content/templates/` 아래에 있어 `ignorePatterns`로 빌드 제외됩니다.
> Phase 6 본문 작성 시 이 구조를 표준으로 따릅니다.

## Frontmatter

```yaml
---
title: [한국어 페이지 제목]
description: "[SEO 1줄, 검색 결과 노출]"
last_updated: YYYY-MM-DD
---
```

## 본문 구조

### 1. TL;DR 콜아웃 (본문 최상단)

```markdown
> [!abstract] TL;DR
> - [무엇을 하는지 1줄]
> - [왜 하는지 1줄]
> - [대략 몇 분 걸리는지 1줄]
```

### 2. 준비물

필요 하드웨어·소프트웨어·케이블·전원 목록.

### 3. 단계 (numbered list)

각 step은 "액션 → 결과 확인"으로 한 문장:

```markdown
1. **[통신] 탭에서 `Serial` 선택** — 우측 포트 드롭다운이 활성화되는지 확인
2. **포트 번호(COM3) 선택 + 보드레이트 115200** — 기본값 사용
3. **`연결` 클릭** — 상단 상태표시등이 🟢 녹색으로 바뀌면 성공
```

### 4. 체크포인트

```markdown
- ✅ UI에 "연결됨" 표시
- ✅ 하트비트 로그 수신
- ✅ 응답 ACK 코드 0x06
```

### 5. 잘 안될 때 (짧게)

```markdown
- **응답 없음** — COM 포트 중복 확인. [연결 문제 해결](/troubleshooting/01-connection)
- **CRC 오류** — 전선 상태 점검, 재연결
```

### 6. 관련 페이지

```markdown
- [다음 단계: 화면 크기 설정](/quickstart/02-screen-size)
- [통신 UI 상세 레퍼런스](/ui-reference/01-communication/)
```

## 톤·문체

- 존댓말 (`~합니다`, `~하세요`)
- 명령형: "클릭하세요", "입력하세요", "확인하세요"
- 전문 용어는 한 번만 영어 병기 후 한국어: `보드레이트(baud rate)`, 이후 "보드레이트"
- 경로 표기: **굵게** `**[통신] → dbNet → Search**`
- 버튼명: 대괄호 `[연결]`, `[전송]`
- 스크린샷 최소화, 텍스트 경로 우선

## 스크린샷 삽입

꼭 필요할 때만:

```markdown
![600](/assets/screens/main-comm.png)
```

Phase 3 완료 후 자동 캡처 스크린샷이 `content/assets/screens/`에 쌓임.
