---
title: BLE
description: "BLE(Bluetooth Low Energy) 통신 설정 — DB300WB 컨버터 페어링"
last_updated: 2026-04-29
aliases:
  - "/01-communication/ble"
---

# BLE

> [!abstract] DB300WB BLE 컨버터로 컨트롤러를 무선 연결
> Windows 블루투스로 페어링한 뒤 `BLE` 버튼으로 BLE 시작, `Serial` 모드의 Bluetooth COM 포트로 통신.

### 기본값

- 이름: `dabit_ble`
- 비밀번호: `dabit_ble`
- DB300WB는 `Client TCP/IP` 모드에서만 정상 동작

### 연결 절차

#### Windows 블루투스 페어링
- Windows `Bluetooth 및 장치` > `dabit_ble` 선택 > 페어링
- `장치 관리자` > `포트(COM & LPT)` > 1~2개의 Bluetooth COM 포트 확인

#### DabitOne 통신 설정
- `통신` > `Serial` 라디오 버튼 선택
- `포트`: 페어링된 Bluetooth COM 포트 선택
- `속도`: `115200`
- 좌측 하단 `BLE` 버튼 클릭 → 블루투스 설정 창
  - 블루투스 이름: `dabit_ble`
  - 블루투스 비밀번호: `dabit_ble`
  - `BeginBLE` (시작) 클릭
  - 로그 영역에 `[DIBD BLE OK!]` 확인
  - `닫기`
- `연결 테스트` 클릭

> [!info] DB300WB BLE 이름·비밀번호는 PC 소프트웨어로만 변경 가능하다.

---
