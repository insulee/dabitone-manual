---
title: 통신 개요
description: "DabitOne 통신 탭 화면 구성 — Serial·Client TCP/IP·Server TCP/IP·UDP·BLE·dbNet"
last_updated: 2026-04-29
---

# 통신 개요

> [!abstract] DabitOne 통신 탭의 화면 구성 안내
> 좌측 사이드바 `통신` 탭에 컨트롤러와 PC를 연결하는 모든 방식이 한 화면에 집결.

### 화면 구성

#### 좌측 — 연결 방식 그룹박스
- `Serial` (기본 선택)
- `Client TCP/IP`
- `Server TCP/IP`
- `UDP`
- 각 그룹박스 헤더의 **라디오 버튼**으로 하나만 활성화

#### 좌측 하단 버튼
- `BLE` — 별도 설정창 팝업

#### 우측 — `dbNet` 패널
- 네트워크 자동 검색 도구
- 컨트롤러 IP·Port·서브넷 등 원격 설정 변경
- `Search` / `Set` / `Add` / `Reset` 버튼

#### 하단 — 공통
- `연결 테스트` 버튼: 현재 설정 저장 후 컨트롤러에 echo 요청
- `응답시간` 드롭다운: `1초` ~ `6초` (기본 `3초`)

### 연결 결과

- 성공: **연결 테스트 성공** (녹색 토스트)
- 응답 없음: **연결 테스트 응답 없음** (노란색 토스트)
- 실패: **연결 테스트 실패** (빨간색 토스트)

### 통신 방식별 상세

- [Serial](/docs/01-communication/serial)
- [TCP (Client / Server)](/docs/01-communication/tcp)
- [UDP](/docs/01-communication/udp)
- [BLE](/docs/01-communication/ble)
- [dbNet](/docs/01-communication/dbnet)

---
