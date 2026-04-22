---
title: TCP (Client / Server)
description: "TCP/IP 연결 설정 — Client(PC가 연결함) / Server(컨트롤러가 접속해 옴)"
last_updated: 2026-04-21
---

# TCP (Client / Server)


> 경로: **[통신] → Client TCP/IP 그룹박스** 또는 **Server TCP/IP 그룹박스**

## 두 가지 역할

| 그룹박스 | 누가 먼저 연결을 시도하는가 | 언제 쓰나 |
|---------|---------------------------|----------|
| **Client TCP/IP** | DabitOne(PC)이 컨트롤러 IP로 접속 | 일반적 설치 — PC가 컨트롤러 IP를 알고 있음 |
| **Server TCP/IP** | 컨트롤러가 DabitOne(PC)으로 접속 | 특수 환경 — 컨트롤러가 유동 IP·NAT 뒤에 있을 때 |

처음이라면 대부분 **Client TCP/IP**입니다.

## Client TCP/IP

### 기본 사용

1. `Client TCP/IP` 그룹박스 헤더 라디오 버튼 클릭
2. `IP Address`에 컨트롤러 IP 입력 (예: `192.168.0.201`)
3. `IP Port`에 포트 번호 입력 (기본 `5000`)
4. (선택) **[Ping]** 버튼으로 네트워크 도달성 점검
5. 하단 **[연결 테스트]** 클릭

### 화면 구성

| 요소 | 유형 | 설명 | 기본값 |
|------|-----|-----|-------|
| `IP Address` | TextBox | 컨트롤러 IPv4 주소 | `192.168.0.201` |
| `IP Port` | TextBox | 컨트롤러 TCP 포트 번호 | `5000` |
| `[Ping]` | Button | 입력한 IP로 ICMP ping 전송 후 결과 토스트 | — |

## Server TCP/IP

### 기본 사용

1. `Server TCP/IP` 그룹박스 헤더 라디오 버튼 클릭
2. `IP Address` 드롭다운에서 PC의 **수신용 네트워크 인터페이스 IP** 선택
3. `IP Port`에 대기 포트 번호 입력 (기본 `5000`)
4. **[연결 테스트]** 클릭 → PC가 대기 상태 진입 → 컨트롤러가 접속하면 성공

### 화면 구성

| 요소 | 유형 | 설명 | 기본값 |
|------|-----|-----|-------|
| `IP Address` | ComboBox | PC에 활성화된 네트워크 어댑터의 IPv4 주소 목록 | — |
| `IP Port` | TextBox | PC의 대기 포트 | `5000` |

> [!warning] Server TCP/IP 사용 시 방화벽에서 해당 포트를 허용해야 합니다. Windows Defender 방화벽이 첫 실행 시 팝업으로 묻는 경우 '허용'을 선택.

## 주요 옵션

### IP Address

- **Client**: 컨트롤러에 할당된 실제 IPv4. 컨트롤러 라벨 또는 dbNet 자동 검색으로 확인 가능
- **Server**: PC 쪽 수신용 인터페이스. 여러 네트워크 어댑터가 있다면 원하는 것을 명시적으로 선택

### IP Port

범위 1~65535. 관행적으로 `5000` 사용. 같은 PC에서 여러 DabitOne을 동시 실행하려면 서로 다른 포트 필요.

## 설정 영속성

> [!info] 최근 사용한 IP·Port가 `AppSettings`에 저장되어 다음 실행 시 복원됩니다.

## 관련

- 체험: [/tour/quickstart/01-first-connection/](/tour/quickstart/01-first-connection/)
- UDP: [UDP](/01-communication/udp)
- dbNet 자동 검색: [dbNet](/01-communication/dbnet)
- 문제 해결: [연결이 안 될 때](/troubleshooting/01-connection)
