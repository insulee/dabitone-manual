---
title: MQTT
description: "MQTT 브로커 경유 원격 연결 — 인터넷으로 멀리 있는 컨트롤러 관리 (DabitOne 신기능)"
last_updated: 2026-04-21
---

# MQTT

![BLE/MQTT 영역](/assets/screens/reference/comm-ble-mqtt.png)

> 경로: **[통신] → [MQTT] 버튼** (별도 설정창 팝업)

## 언제 쓰나

- 컨트롤러가 **원격지**에 있어 직접 TCP 연결이 어려울 때 (NAT·방화벽 뒤)
- 여러 곳에 흩어진 장비를 **한 대시보드**로 모니터링할 때
- **인터넷 기반** 중앙 관제 필요 시

> [!info] MQTT는 DabitOne 신기능입니다. 별도 **MQTT 브로커**(자체 호스팅 또는 상용 서비스)가 필요합니다.

## MQTT 개요

MQTT는 IoT·M2M에서 표준으로 쓰이는 **Publish/Subscribe** 메시징 프로토콜. DabitOne과 컨트롤러가 **같은 브로커에 접속**하여 토픽을 주고받습니다.

```
[DabitOne]                [컨트롤러 A]
    ↓ publish                  ↑ subscribe
    └─→ [MQTT Broker] ─→───────┘
            ↑ subscribe        publish
[컨트롤러 B]
```

## 기본 사용

1. 메인 통신 창 하단의 **[MQTT]** 버튼 클릭 → 전용 설정창 팝업
2. 브로커 정보 입력
3. 인증·암호화 설정
4. 주제(토픽) 지정
5. **[연결]** → MQTT 브로커에 접속

## 화면 구성 (MQTT 설정창)

| 요소 | 유형 | 설명 |
|-----|-----|-----|
| `Broker Host` | TextBox | MQTT 브로커 주소 (예: `broker.dabitsol.com`) |
| `Broker Port` | TextBox | 포트 (기본 `1883`, TLS면 `8883`) |
| `Client ID` | TextBox | 이 DabitOne 인스턴스의 고유 ID |
| `Username` | TextBox | 인증이 필요하면 사용자명 |
| `Password` | PasswordBox | 비밀번호 |
| `Use TLS` | CheckBox | 암호화 연결 사용 |
| `Topic (pub)` | TextBox | DabitOne이 publish할 토픽 |
| `Topic (sub)` | TextBox | DabitOne이 subscribe할 토픽 |
| `QoS` | ComboBox | `0` / `1` / `2` (기본 `1`) |
| **[연결]** | Button | 브로커 접속 시도 |

## 주요 옵션

### Broker

자체 운영(Mosquitto, EMQX 등) 또는 상용 서비스(HiveMQ Cloud, AWS IoT 등) 이용 가능. 보안상 **TLS 사용 + 인증 필수** 권장.

### Topic 규약

권장 구조: `dabit/{고객}/{장비}/cmd` (명령 보내기), `dabit/{고객}/{장비}/telemetry` (상태 수신)

정확한 토픽은 **컨트롤러 펌웨어의 MQTT 구현**과 일치해야 합니다. 제조사 기술 문서 확인.

### QoS (Quality of Service)

- `0` — 최대 1회 전달 (빠르지만 손실 가능)
- `1` — 최소 1회 전달 (중복 가능)
- `2` — 정확히 1회 전달 (느림)

전광판 운영에는 `1` 권장 (손실 방지 + 적당한 속도).

### TLS

브로커가 TLS를 지원하면 반드시 켜세요. 공인 인증서 사용 또는 **CA 인증서 파일**을 수동 업로드.

## 제약

> [!warning] MQTT 연결은 Serial·TCP보다 **지연이 큽니다** (브로커 경유). 실시간 응답이 중요한 경우(연결 테스트 등)에는 타임아웃을 충분히(5~10초) 잡으세요.

| 항목 | 제약 |
|------|-----|
| 메시지 크기 | 브로커 정책에 따름 (보통 256KB~수 MB) |
| 동시 접속 | 브로커 플랜에 따름 |
| 지연 | 수백 ms ~ 수 초 (브로커 위치·QoS에 따름) |

## 설정 영속성

> [!info] 브로커·토픽 정보는 `AppSettings`에 저장됩니다. **비밀번호는 안전하게 암호화**되어 저장.

## 관련

- 로컬 네트워크: [TCP](/ui-reference/01-communication/tcp)
- 근거리 무선: [BLE](/ui-reference/01-communication/ble)
- 문제 해결: [연결이 안 될 때](/troubleshooting/01-connection)
