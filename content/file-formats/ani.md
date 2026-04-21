---
title: ANI
description: "여러 DAT 프레임 + 타이밍을 묶은 애니메이션"
last_updated: 2026-04-21
---

# ANI

> **ANI** — 여러 개의 [[file-formats/dat|DAT]] 프레임을 **재생 순서·시간·효과**와 함께 묶은 애니메이션 파일. 전광판에서 움직이는 내용을 표출할 때 사용.

## 어디서 만들어지나

| 편집 화면 | 결과물 |
|----------|--------|
| [[ui-reference/04-editor/gif|GIF 편집]] | `.ANI` — 프레임 타임라인 기반으로 제작 (**DabitONe 신규**) |
| [[ui-reference/04-editor/text|텍스트 편집]] 효과 | `.ANI` — 흐름·점멸 등 시간 효과가 적용된 텍스트 |
| 외부 GIF 불러오기 | 자동으로 ANI로 변환 |

## 구조

- **프레임 목록**: 순차 재생될 DAT 프레임 배열
- **프레임당 시간**: 각 프레임을 몇 ms 표시할지 (프레임별 개별 지정 가능)
- **반복 횟수**: 무한 반복 또는 N회
- **전환 효과**: 프레임 간 페이드·슬라이드 등 (선택)

## 어디에 저장되나

```
기본: C:\Users\[사용자]\Documents\DabitONe\Data\
확장자: .ANI
```

## 용량·제약

| 항목 | 값 |
|------|-----|
| 프레임 수 | 권장 50 이하 (컨트롤러 메모리에 따라 다름) |
| 단일 ANI 크기 | 수백 KB~수 MB |
| 프레임 해상도 | 프로젝트 화면 크기와 동일 |

> [!warning] 프레임이 많고 해상도가 크면 용량이 급격히 증가합니다. 컨트롤러 저장공간·성능 제약을 고려해 프레임 수·해상도 조정이 필요.

## DAT와의 관계

ANI는 DAT의 **컨테이너**. 개별 프레임은 DAT 형식으로 내부에 저장됩니다. 그래서 편집할 때 프레임 단위로 DAT처럼 수정 가능.

## 호환성

- 기존 DabitChe ANI 파일 **그대로 호환**
- DabitONe에서 만든 ANI는 구버전에서도 기본 재생 가능 (일부 신규 효과는 무시)
- 표준 GIF에서 변환 가능 — [[file-formats/gif|GIF]] 참조

## 관련 파일 형식

- [[file-formats/dat|DAT]] — ANI의 각 프레임이 내부적으로 DAT 형식
- [[file-formats/gif|GIF]] — 표준 GIF, DabitONe에서 ANI로 변환해 전송
- [[file-formats/pla|PLA]] — ANI 여러 개를 시간 스케줄에 묶음

## 체험

- [/tour/quickstart/05-gif-editor/](/tour/quickstart/05-gif-editor/) — 내장 GIF/ANI 편집기 체험
