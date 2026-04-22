---
title: DAT
description: "전광판에 표시되는 한 장면 — 텍스트 또는 이미지 비트맵의 바이너리"
last_updated: 2026-04-21
---

# DAT

> **DAT** — 전광판에 표시되는 **한 장면**(텍스트 또는 이미지)의 바이너리 파일. DabitOne·DabitChe 생태계의 **기본 표시 단위**.

## 어디서 만들어지나

| 편집 화면 | 결과물 |
|----------|--------|
| [텍스트 편집](/04-editor/text) | `.DAT` — 지정한 글꼴·효과로 렌더된 텍스트 비트맵 |
| [이미지 편집](/04-editor/image) | `.DAT` — BMP/PNG/JPG를 전광판 해상도·색상 깊이로 변환한 비트맵 |

한 파일은 **한 장면**을 담습니다. 연속 재생하려면 여러 DAT를 [ANI](/file-formats/ani) 또는 [PLA](/file-formats/pla)로 묶으세요.

## 어디에 저장되나

```
기본: C:\Users\[사용자]\Documents\DabitOne\Data\
프로젝트별 권장 구조: Data\[프로젝트명]\메시지.DAT
```

파일명은 자유이지만 **한글·특수문자 지양**을 권장합니다(컨트롤러 쪽 파일 시스템 호환).

## 용량·제약

| 항목 | 값 |
|------|-----|
| 단일 DAT 최대 크기 | 컨트롤러 모델에 따라 다름 (보통 수십 KB~수 MB) |
| 해상도 | 프로젝트의 화면 크기 설정과 일치 |
| 색상 깊이 | 1 / 3 / 8 / 24 비트 |
| 분할 조건 | 한 화면 크기를 초과하면 분할 모드 필요 |

> [!info] DAT는 프로젝트의 **화면 크기 설정에 맞춰 생성**됩니다. 화면 크기를 바꾸면 기존 DAT는 크기가 안 맞을 수 있어 재생성이 필요합니다.

## 호환성

- 기존 **DabitChe**에서 만든 DAT 그대로 사용 가능
- DabitOne에서 만든 DAT도 구버전에서 읽을 수 있으나 일부 효과는 무시될 수 있음
- 다른 회사 소프트웨어의 DAT는 **호환 안 됨** (포맷이 다름)

## 관련 파일 형식

- [ANI](/file-formats/ani) — DAT 여러 개 + 타이밍으로 구성한 애니메이션
- [PLA](/file-formats/pla) — DAT/ANI 여러 개 + 시간 스케줄로 구성한 플레이리스트
- [BGP](/file-formats/bgp) — 배경 레이어용 스케줄

## 기술 상세 (개발자용)

바이너리 헤더·섹션 구조 등 바이트 레벨 스펙은 다빛솔루션 기술 문서에서 제공합니다. DabitOne 사용자는 편집기를 통해 생성·편집하므로 스펙 직접 접근은 불필요.

## 체험

- [/tour/quickstart/03-send-message/](/tour/quickstart/03-send-message/) — 텍스트 DAT 만들기
- [/tour/quickstart/04-edit-image/](/tour/quickstart/04-edit-image/) — 이미지 DAT 만들기
