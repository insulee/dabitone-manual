---
title: UDP
description: "UDP 연결 설정 — 브로드캐스트·단방향 송출"
last_updated: 2026-04-21
---

# UDP

![UDP 통신 설정 UI](/assets/screens/reference/comm-udp.png)

> 경로: **[통신] → UDP 그룹박스**

## 언제 쓰나

- 컨트롤러가 한 네트워크에 여러 대 있고 **동시에 같은 내용을 보내야** 할 때
- 응답 확인 없이 **단방향 푸시**만 필요할 때
- 특정 설치 환경에서 UDP 프로토콜을 명시적으로 사용하도록 요구할 때

## 기본 사용

1. `UDP` 그룹박스 헤더 라디오 버튼 클릭
2. `IP Address`에 대상 컨트롤러 IP 입력 (기본 `192.168.0.202`)
3. 하단 **[연결 테스트]** 클릭

## 화면 구성

| 요소 | 유형 | 설명 | 기본값 |
|------|-----|-----|-------|
| `IP Address` | TextBox | 대상 컨트롤러 IPv4 (또는 브로드캐스트 주소 `255.255.255.255`) | `192.168.0.202` |
| `IP Port` | TextBox (ReadOnly) | DabitOne 고정 값 | `5108` (수정 불가) |

## 주요 옵션

### IP Address

- 특정 컨트롤러 1대 → 해당 장비의 IP
- 서브넷 내 **모든 컨트롤러에 동시에** → `브로드캐스트 주소` (보통 `192.168.X.255`)
- **전역 브로드캐스트** → `255.255.255.255` (라우터 차단 가능)

### IP Port 고정 `5108`

DabitOne UDP 통신은 포트 5108로 고정. 컨트롤러 쪽 UDP 수신 포트도 5108이어야 함. 필요 시 컨트롤러 펌웨어 측에서 포트 맞춤.

## 제약

> [!warning] UDP는 **응답 확인 없음**. [연결 테스트] 성공 토스트가 떠도 실제 컨트롤러가 패킷을 받았다는 보장은 없습니다. 화면이 의도대로 나오는지 현장에서 육안 확인 필요.

## 설정 영속성

> [!info] IP Address 값은 `AppSettings`에 저장, 다음 실행 시 복원됩니다. IP Port는 고정값이라 저장 불필요.

## 관련

- 체험: [/tour/quickstart/01-first-connection/](/tour/quickstart/01-first-connection/)
- TCP (확인 가능한 연결): [[ui-reference/01-communication/tcp|TCP]]
- 문제 해결: [[troubleshooting/01-connection|연결이 안 될 때]]
