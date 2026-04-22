---
title: 화면 크기·배열·색상
description: "가로×세로 모듈 수, 색상 깊이(BPP), 배열 유형 설정"
last_updated: 2026-04-21
---

# 화면 크기·배열·색상

![전광판 화면 구성 UI](/assets/screens/reference/settings-screen-size.png)

> 경로: **[설정] → 화면 크기 섹션**

## 이 화면의 역할

전광판의 **물리 구성**을 DabitOne에 알려주는 가장 중요한 설정. 여기서 입력한 값이 모든 편집·전송의 기준이 됩니다.

## 기본 사용

1. `가로 모듈 수` 입력 — 실물 가로 방향 모듈 개수
2. `세로 모듈 수` 입력 — 실물 세로 방향 모듈 개수
3. `모듈 해상도` 선택 — 모듈 라벨에 표기된 픽셀 단위 (예: 16×16, 32×16)
4. `색상 깊이(BPP)` 선택 — 모듈이 지원하는 비트 수
5. `배열 유형` 선택 — Normal / 180도 / 좌우 뒤집힘 등
6. **[적용]** 또는 **[전송]** 클릭 → 컨트롤러에 반영

## 화면 구성

| 요소 | 유형 | 설명 |
|------|-----|-----|
| `가로 모듈 수` | NumericUpDown | 1 이상 정수 |
| `세로 모듈 수` | NumericUpDown | 1 이상 정수 |
| `모듈 해상도` | ComboBox | 16×16 / 32×16 / 32×32 / 64×32 등 |
| `색상 깊이` | ComboBox | 1 / 3 / 8 / 24 bit |
| `배열 유형` | ComboBox | Normal / Rotate 90 / 180 / 270 / Flip H·V |
| **[적용]** | Button | 현재 입력값을 컨트롤러로 전송 |

## 주요 옵션

### 색상 깊이 (BPP, Bits Per Pixel)

- **1 bit** — 단색 (켜짐/꺼짐) — 구형 단색 전광판
- **3 bit** — RGB 단색 조합 (7색 + 검정) — 구형 3색 전광판
- **8 bit** — 256색 — 중간급
- **24 bit** — 풀컬러 (16,777,216색) — 현대 풀컬러 전광판

모듈이 지원하는 최대 값을 선택. 잘못 선택하면 색상이 이상하게 표시됨 → [표시가 깨질 때](/troubleshooting/02-display-corruption) 참조.

### 배열 유형

모듈을 회전해서 장착했거나 좌우 뒤집어 장착한 경우 여기서 맞춥니다. 대부분 **Normal**.

## 설정 영속성

> [!info] 화면 크기 설정은 **컨트롤러 쪽 비휘발 메모리에 저장**됩니다. DabitOne 재설치해도 컨트롤러 값은 유지. 단 DabitOne UI 쪽은 `AppSettings`에서 마지막 값을 기억합니다.

## 관련

- 체험 투어: [/tour/quickstart/02-screen-size/](/tour/quickstart/02-screen-size/)
- 색상 이상: [표시가 깨질 때](/troubleshooting/02-display-corruption)
- 표출 신호 설정: [표출 신호](/ui-reference/02-settings/display-signal)
