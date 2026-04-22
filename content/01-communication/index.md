---
title: 통신
description: "DabitOne 통신 설정 — Serial·TCP·UDP·BLE·MQTT·dbNet 전체"
last_updated: 2026-04-21
---

# 통신 설정

> 경로: 좌측 사이드바 **[통신]** 탭 (DabitOne 실행 시 기본 선택)

## 이 화면의 역할

DabitOne과 다빛솔루션 LED 컨트롤러를 **물리 연결**하는 모든 방식을 한 화면에 모은 통합 창. 예전엔 연결 방식마다 별도 창이었지만 이제 라디오 버튼 하나로 전환합니다.

## 화면 구성

좌측 열에 4개의 그룹박스가 세로로 배열됩니다. 각 그룹박스 헤더의 **라디오 버튼**으로 통신 방식 하나를 활성화.

| 그룹박스 헤더 | 라디오 버튼 이름 | 기본 선택 |
|--------------|---------------|---------|
| Serial | Serial | ✅ |
| Client TCP/IP | Client TCP/IP | |
| Server TCP/IP | Server TCP/IP | |
| UDP | UDP | |

이들과 별도로 하단에 **[BLE]**·**[MQTT]** 버튼(별도 설정창), 우측에 **dbNet** 패널(네트워크 자동 검색).

## 각 통신 방식 상세

- [Serial](/01-communication/serial) — 시리얼 케이블(RS-232/RS-485) 연결
- [TCP (Client / Server)](/01-communication/tcp) — IP 기반 TCP/IP 연결
- [UDP](/01-communication/udp) — 브로드캐스트·단방향 UDP 연결
- [BLE](/01-communication/ble) — 블루투스 Low Energy (신기능)
- [MQTT](/01-communication/mqtt) — MQTT 브로커 경유 원격 연결 (신기능)
- [dbNet](/01-communication/dbnet) — 네트워크 자동 검색 도구

## 공통 — 연결 테스트

통신 방식을 선택하고 설정을 입력한 뒤, 화면 하단의 **[연결 테스트]** 버튼으로 실제 연결을 확인합니다.

| 컨트롤 | 유형 | 설명 |
|-------|-----|-----|
| `[연결 테스트]` | Button | 현재 설정 저장 + 컨트롤러에 echo 요청 |
| `응답시간` | ComboBox | 타임아웃. `1초`~`6초`, 기본 **`3초`** |

### 결과 피드백

| 상태 | 토스트 | 상태 영역 |
|------|--------|----------|
| 성공 | **"연결 테스트 성공"** (녹색) | "연결됨 (Serial/TCP/UDP 등)" 녹색 |
| 응답 없음 | **"연결 테스트 응답 없음"** (노란색) | "연결 안됨" |
| 실패 | **"연결 테스트 실패: {에러메시지}"** (빨간색) | "연결 안됨" |

## 설정 영속성

> [!info] 여기서 입력한 모든 값(포트·속도·IP·포트번호 등)은 `AppSettings`에 자동 저장되어 앱 재시작 후에도 유지됩니다. 마지막으로 성공한 연결 방식이 다음 실행 시에도 선택됩니다.

## 관련

- 체험 투어: [/tour/quickstart/01-first-connection/](/tour/quickstart/01-first-connection/)
- 문제 해결: [연결이 안 될 때](/troubleshooting/01-connection)
