---
title: TCP (Client / Server)
description: "TCP/IP 연결 설정 — dbNet으로 컨트롤러 검색 후 IP·Port 자동 채움"
last_updated: 2026-04-29
aliases:
  - "/01-communication/tcp"
---

# TCP (Client / Server)

> [!abstract] dbNet으로 컨트롤러를 검색해 IP를 자동으로 채워 연결
> `Client TCP/IP`는 PC → 컨트롤러 방향, `Server TCP/IP`는 컨트롤러 → PC 방향. 일반적인 환경은 `Client TCP/IP`.

### Client TCP/IP

#### 연결 절차

- `통신` > `Client TCP/IP` 라디오 버튼 선택
- 우측 `dbNet` > `Search` 클릭 → 같은 네트워크의 컨트롤러가 좌측 목록에 표시
- 컨트롤러 MAC 주소 클릭 → 중앙 Network 영역에 IP·Subnet·Gateway·Port 자동 입력
- 필요 시 IP/Subnet/Gateway/Port 수정 후 `Set` → 컨트롤러 네트워크 설정 적용
- `Add` 클릭 → 좌측 `Client TCP/IP` 그룹박스에 IP·Port 자동 채움
- `연결 테스트` 클릭

#### IP 직접 입력
- IP·Port를 알면 `IP Address` `IP Port`에 직접 입력 후 `연결 테스트`
- 기본값: `192.168.0.201` : `5000`

#### `Ping`
- 입력한 IP로 ICMP ping 전송
- 네트워크 도달 여부 빠른 확인

### Server TCP/IP

#### 연결 절차

- `통신` > `Server TCP/IP` 라디오 버튼 선택
- `dbNet` > `Search` > 컨트롤러 MAC 선택
- 중앙 Network 영역에서 `Controller Client Mode (Server TCP/IP)` 체크
- `Server IP`, `Server Port`에 PC의 IP·Port 입력 후 `Set`
- `Search` 다시 눌러 변경 확인 → `Add`
- 좌측 `Server TCP/IP` 그룹박스의 `IP Address` 드롭다운에서 PC 어댑터 IP 선택
- `IP Port` 입력 (기본 `5000`)
- `연결 테스트` 클릭 → 컨트롤러가 접속하면 성공

> [!warning] Server TCP/IP 사용 시 Windows 방화벽에서 해당 포트 허용 필요.

---
